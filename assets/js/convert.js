/* Konversi TSV produk -> harga.json. Dipakai admin.html (browser) dan Node. */
(function(root){
const OP=['Telkomsel','Indosat','Tri','Axis','XL','Smartfren','by.U'];
const ORDER=OP.concat(['Token PLN','DANA','GoPay & Gojek','ShopeePay','OVO & LinkAja','Maxim','E-Money']);
const sw=(p,a)=>a.some(x=>p.startsWith(x));
const rp=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const title=s=>s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
function grp(p){
 if(sw(p,['CVTS','CPTS']))return'Telkomsel';
 if(p==='CPX')return'XL';
 if(sw(p,['BYU','BYDP','CVB','CPB']))return'by.U';
 if(sw(p,['CVS','CPS']))return'Smartfren';
 if(sw(p,['TD','CVT','RVT','CPT'])||p==='T')return'Tri';
 if(sw(p,['AD','CVA','CPA'])||p==='AT')return'Axis';
 if(sw(p,['ID','MOBO','CVI','CPI']))return'Indosat';
 if(p.startsWith('PL'))return'Token PLN';
 if(p.startsWith('DN'))return'DANA';
 if(p.startsWith('GO'))return'GoPay & Gojek';
 if(p==='SHOPEE')return'ShopeePay';
 if(p==='OVOD'||p==='LINKAJA')return'OVO & LinkAja';
 if(p==='MXD')return'Maxim';
 if(p==='BRIZZI')return'E-Money';
 return null}
function jenis(g,n,prov){
 if(!OP.includes(g))return g;
 const s=n.toLowerCase();
 if(prov==='TDH17'||/roam|negara|haji|umroh|ibadah|mabrur|sky pack|travel/.test(s))return'Roaming';
 if(/transfer pulsa/.test(s))return'Transfer Pulsa';
 if(/^(pulsa|by\.u pulsa)/.test(s))return'Pulsa';
 if(/masa aktif/.test(s))return'Masa Aktif';
 if(/perdana/.test(s))return'Perdana';
 if(/nelp|telp|menit|sms|obrol/.test(s)&&!/\d\s?gb/.test(s))return'Telepon & SMS';
 if(/game|diamond|unipin|h3ro|garena|pubg/.test(s))return'Game';
 if(/vocer|voucher|vcr|redeem/.test(s))return'Voucher Data';
 return'Paket Data'}
function clean(n){
 n=n.replace(/\s+/g,' ').trim();
 const parts=n.split(/\s[|l]\s/);
 if(parts.length>1){const last=parts[parts.length-1];
  n=parts.slice(0,-1).every(p=>p.trim()&&last.includes(p.trim()))?last:parts.join(' | ')}
 return n}
function convert(text,dateStr){
 const L=text.split(/\r?\n/).filter(x=>x.trim());
 const H=L.shift().split('\t').map(x=>x.trim());
 const ix=k=>H.indexOf(k);
 const need=['Aktif','Kode','Nama','Provider','Hrg Jual','Gangguan'];
 for(const k of need)if(ix(k)<0)throw new Error('Kolom "'+k+'" tidak ditemukan. Header file: '+H.join(', '));
 const out=[],skip={};const sk=k=>skip[k]=(skip[k]||0)+1;
 for(const line of L){
  const c=line.split('\t');
  const code=c[ix('Kode')],prov=c[ix('Provider')];let nm=c[ix('Nama')]||'';
  const price=parseInt(c[ix('Hrg Jual')],10);
  if(c[ix('Aktif')]!=='1'){sk('nonaktif');continue}
  if(!(price>0)){sk('harga 0 / produk cek');continue}
  if(prov==='BP'||prov==='DEPOSIT'||code==='IDPBYR'){sk('internal (BP/Deposit)');continue}
  const g=grp(prov);if(!g){sk('provider tidak dikenal');continue}
  const m=code.match(/(\d+)$/),nom=m?rp(parseInt(m[1],10)*1000):'';
  let name=clean(nm);
  if(prov==='T')name='Pulsa Tri '+nom;
  else if(prov==='AT')name='Transfer Pulsa Axis '+nom;
  else if(prov==='DND'&&m)name='DANA Direct '+nom;
  else if(prov==='DNBB'&&m)name='DANA Bank '+nom;
  else if(prov==='PLD'&&m)name='Token PLN '+nom;
  else if(prov==='PLNSP'&&m)name='Token PLN Promo '+nom;
  else if(prov==='PLA'&&m)name='Token PLN (PLA) '+nom;
  else if(prov==='BYU'&&m)name='by.U Pulsa '+nom;
  else if(prov==='MOBO')name=name.replace(/(\d),(\d{3})/g,'$1.$2');
  else if(prov==='GODRIVE')name=title(name.replace(/\s+/g,' '));
  else if(prov==='BRIZZI'&&m)name='BRIZZI Top Up '+nom;
  if(prov==='SHOPEE')name=name.replace(/shopee non admin (\d+)/i,(x,d)=>'ShopeePay '+rp(+d));
  if(prov==='GOPAYD')name=name.replace(/GOPAY (\d+) NON ADMIN/i,(x,d)=>'GoPay '+rp(+d));
  if(price<1000&&['DANA','ShopeePay','OVO & LinkAja','GoPay & Gojek'].includes(g))
   name=title(name)+' (nominal bebas, harga = biaya admin)';
  out.push({kategori:g,jenis:jenis(g,name,prov),kode:code,nama:name,harga:price,status:c[ix('Gangguan')]==='1'?'Gangguan':'Normal'});
 }
 out.sort((a,b)=>ORDER.indexOf(a.kategori)-ORDER.indexOf(b.kategori)||a.harga-b.harga||(a.kode<b.kode?-1:1));
 const per={};out.forEach(d=>per[d.kategori]=(per[d.kategori]||0)+1);
 return{json:{update:dateStr||new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}),produk:out},stats:{total:out.length,baris:L.length,skip,per}}}
root.ZPPConvert={convert,ORDER};
if(typeof module!=='undefined')module.exports=root.ZPPConvert;
})(typeof window!=='undefined'?window:globalThis);
