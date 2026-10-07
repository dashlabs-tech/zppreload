/* ===== KONFIGURASI: ubah data di sini saja ===== */
const CFG={
 nama:'ZPP Reload',
 telegram:{label:'@zpperkasa',url:'https://t.me/zpperkasa'},
 waCS:{label:'0858-6233-6233',url:'https://wa.me/6285862336233'},
 waB2B:{label:'0812-2085-85',url:'https://wa.me/62812208585'},
 channel:{label:'Channel Info H2H',url:'https://t.me/zavier_h2hinfo'},
 deposit:[],            // contoh: [{bank:'BCA',norek:'1234567890',an:'Nama Pemilik'}]
 formEndpoint:'',       // contoh: 'https://formspree.io/f/xxxxxxx' (kosong = kirim via WhatsApp)
 ga:''                  // contoh: 'G-XXXXXXXXXX' (kosong = tanpa analytics)
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wa=(base,t)=>base+'?text='+encodeURIComponent(t);
const rp=n=>'Rp '+Number(n).toLocaleString('id-ID');
let page=location.pathname.split('/').pop()||'index.html';if(!page.includes('.'))page+='.html';
const toast=t=>{const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),1800)};
const link=(h,t)=>`<li><a href="${h}" class="${page===h?'on':''}">${t}</a></li>`;

/* Header, tema, tombol WhatsApp */
document.getElementById('hdr').innerHTML=`<header><div class="wrap nav">
<a class="brand" href="index.html"><img src="assets/images/logo.png" alt="Logo ZPP Reload">ZPP <span>Reload</span></a>
<div class="nr"><nav id="mn"><ul>${link('index.html','Home')}${link('harga.html','Harga')}${link('pendaftaran.html','Pendaftaran')}${link('faq.html','FAQ')}</ul></nav>
<button class="theme" id="tg" aria-label="Ganti tema"></button>
<button class="burger" aria-label="Menu" onclick="document.getElementById('mn').classList.toggle('open')">☰</button></div></div></header>
<a class="wa" href="${wa(CFG.waCS.url,'Halo ZPP Reload, saya mau tanya soal layanan H2H.')}" target="_blank" rel="noopener" aria-label="Chat admin WhatsApp">💬</a>`;
const tg=document.getElementById('tg'),ico=()=>tg.textContent=document.documentElement.dataset.theme==='dark'?'☀️':'🌙';
ico();tg.onclick=()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}ico()};

/* Banner pengumuman (data/pengumuman.json) */
fetch('data/pengumuman.json').then(r=>r.json()).then(a=>{
 if(!a.aktif||!a.teks)return;
 try{if(sessionStorage.getItem('ann')===a.teks)return}catch(e){}
 const b=document.createElement('div');b.className='ann '+(a.tipe||'info');
 b.innerHTML=`<span>📢 ${esc(a.teks)}</span>${a.link?`<a href="${esc(a.link)}">Detail</a>`:''}<button aria-label="Tutup">✕</button>`;
 b.querySelector('button').onclick=()=>{b.remove();try{sessionStorage.setItem('ann',a.teks)}catch(e){}};
 document.body.prepend(b)}).catch(()=>{});

/* Kontak, deposit, footer */
const contacts=()=>`<div class="contact">
<a class="ct" href="${CFG.telegram.url}" target="_blank" rel="noopener"><i>✈️</i><div><small>Telegram</small><b>${CFG.telegram.label}</b></div></a>
<a class="ct" href="${CFG.waCS.url}" target="_blank" rel="noopener"><i>💬</i><div><small>WhatsApp CS</small><b>${CFG.waCS.label}</b></div></a>
<a class="ct" href="${CFG.waB2B.url}" target="_blank" rel="noopener"><i>🤝</i><div><small>WhatsApp B2B</small><b>${CFG.waB2B.label}</b></div></a>
<a class="ct" href="${CFG.channel.url}" target="_blank" rel="noopener"><i>📢</i><div><small>Channel Telegram</small><b>${CFG.channel.label}</b></div></a></div>`;
document.querySelectorAll('[data-contacts]').forEach(e=>e.innerHTML=contacts());
document.querySelectorAll('[data-deposit]').forEach(e=>e.innerHTML=CFG.deposit.length
 ?'<div class="contact">'+CFG.deposit.map(d=>`<div class="ct"><i>🏦</i><div><small>${esc(d.bank)} a.n. ${esc(d.an)}</small><b>${esc(d.norek)}</b></div></div>`).join('')+'</div>'
 :`<p class="muted">Rekening deposit resmi diberikan admin setelah pendaftaran. Hubungi <a href="${CFG.waCS.url}"><b>WhatsApp CS</b></a> untuk konfirmasi. Jangan transfer ke rekening yang tidak diinformasikan admin.</p>`);
document.getElementById('ftr').innerHTML=`<footer><div class="wrap"><div class="fg">
<div><div class="brand"><img src="assets/images/logo.png" alt="">ZPP <span>Reload</span></div><p style="margin-top:10px;max-width:300px">Server pulsa, paket data, PPOB &amp; voucher game untuk mitra H2H dan reseller.</p></div>
<div><b>Menu</b><br><a href="index.html">Home</a><a href="harga.html">Harga</a><a href="pendaftaran.html">Pendaftaran</a><a href="faq.html">FAQ</a><a href="syarat.html">Syarat &amp; Privasi</a></div>
<div><b>Hubungi Kami</b><br><a href="${CFG.telegram.url}">Telegram ${CFG.telegram.label}</a><a href="${CFG.waCS.url}">WA CS ${CFG.waCS.label}</a><a href="${CFG.waB2B.url}">WA B2B ${CFG.waB2B.label}</a><a href="${CFG.channel.url}">Channel Info</a></div>
</div><div class="copy">© ${new Date().getFullYear()} ${CFG.nama}. All rights reserved.</div></div></footer>`;

/* ===== Halaman harga ===== */
const tb=document.getElementById('tbody');
if(tb){
 let data=[],kat='Semua',jen='Semua',lim=100,onlyG=false,upd='';
 const $=id=>document.getElementById(id);
 const filt=(withJ=true)=>{const q=$('q').value.toLowerCase();
  return data.filter(d=>(kat==='Semua'||d.kategori===kat)&&(!withJ||jen==='Semua'||d.jenis===jen)&&(!onlyG||d.status!=='Normal')&&(d.kode+' '+d.nama).toLowerCase().includes(q))};
 const tabs=(el,list,cur)=>el.innerHTML=list.map(k=>`<button class="tab ${k===cur?'on':''}" data-v="${esc(k)}">${esc(k)}</button>`).join('');
 const buildJ=()=>{const js=[...new Set(data.filter(d=>kat!=='Semua'&&d.kategori===kat).map(d=>d.jenis))];
  $('jtabs').hidden=js.length<2;if(js.length>1)tabs($('jtabs'),['Semua',...js],jen)};
 const render=()=>{
  const rows=filt(),more=$('more');
  more.hidden=rows.length<=lim;more.textContent='Tampilkan lebih banyak ('+(rows.length-lim)+' lagi)';
  tb.innerHTML=rows.length?rows.slice(0,lim).map(d=>`<tr><td><button class="cp" data-k="${esc(d.kode)}" title="Salin kode">${esc(d.kode)} <small>⧉</small></button></td><td>${esc(d.nama)}</td><td>${rp(d.harga)}</td><td class="${d.status==='Normal'?'ok':'no'}">${d.status==='Normal'?'● Normal':'● Gangguan'}</td><td><a class="chat" target="_blank" rel="noopener" aria-label="Tanya via WhatsApp" href="${wa(CFG.waCS.url,'Halo ZPP Reload, saya mau tanya produk '+d.kode+' ('+d.nama+')')}">💬</a></td></tr>`).join(''):'<tr><td colspan="5">Produk tidak ditemukan.</td></tr>';
  $('dlk').hidden=kat==='Semua';$('dlk').textContent='⬇ CSV '+kat};
 const csv=(list,name)=>{const t='Kategori,Jenis,Kode,Produk,Harga,Status\n'+list.map(d=>[d.kategori,d.jenis,d.kode,'"'+d.nama.replace(/"/g,'""')+'"',d.harga,d.status].join(',')).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+t],{type:'text/csv'}));a.download=name+'.csv';a.click()};
 fetch('data/harga.json').then(r=>r.json()).then(j=>{
  data=j.produk;upd=j.update;const g=data.filter(d=>d.status!=='Normal').length;
  $('sb').innerHTML=`<span>📦 ${data.length.toLocaleString('id-ID')} produk</span><span>🕒 Update: ${esc(upd)}</span>`+(g?`<button class="chipb" id="gb">⚠ Gangguan (${g})</button>`:'<span class="ok">✅ Semua produk normal</span>');
  if(g)$('gb').onclick=e=>{onlyG=!onlyG;e.target.classList.toggle('on',onlyG);lim=100;render()};
  $('upd').textContent='Terakhir diperbarui: '+upd;
  tabs($('tabs'),['Semua',...new Set(data.map(d=>d.kategori))],kat);buildJ();render();
 }).catch(()=>tb.innerHTML='<tr><td colspan="5">Gagal memuat harga. Buka lewat server (GitHub Pages / live server).</td></tr>');
 $('tabs').onclick=e=>{const b=e.target.closest('.tab');if(!b)return;kat=b.dataset.v;jen='Semua';lim=100;[...$('tabs').children].forEach(x=>x.classList.toggle('on',x===b));buildJ();render()};
 $('jtabs').onclick=e=>{const b=e.target.closest('.tab');if(!b)return;jen=b.dataset.v;lim=100;[...$('jtabs').children].forEach(x=>x.classList.toggle('on',x===b));render()};
 $('q').oninput=()=>{lim=100;render()};
 $('more').onclick=()=>{lim+=200;render()};
 $('dl').onclick=()=>csv(data,'harga-zpp-reload');
 $('dlk').onclick=()=>csv(data.filter(d=>d.kategori===kat),'harga-'+kat.toLowerCase().replace(/[^a-z0-9]+/g,'-'));
 tb.onclick=e=>{const b=e.target.closest('.cp');if(!b)return;const k=b.dataset.k;
  const ok=()=>toast('Kode '+k+' disalin');
  if(navigator.clipboard)navigator.clipboard.writeText(k).then(ok,()=>{});
  else{const t=document.createElement('textarea');t.value=k;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();ok()}};
}

/* ===== FAQ: pencarian ===== */
const fq=document.getElementById('fq');
if(fq)fq.oninput=()=>{const q=fq.value.toLowerCase();let n=0;
 document.querySelectorAll('.faq details').forEach(d=>{const m=d.textContent.toLowerCase().includes(q);d.hidden=!m;if(m)n++});
 document.getElementById('fe').hidden=n>0};

/* ===== Form pendaftaran ===== */
const rf=document.getElementById('regform');
if(rf)rf.onsubmit=async e=>{
 e.preventDefault();const f=Object.fromEntries(new FormData(rf));if(f.website)return;
 const st=document.getElementById('fs');
 const msg=`Halo ZPP Reload, saya ingin mendaftar.\nNama: ${f.nama}\nUsaha: ${f.usaha||'-'}\nKebutuhan: ${f.kebutuhan}\nKontak: ${f.kontak}\nCatatan: ${f.pesan||'-'}`;
 if(CFG.formEndpoint){
  try{const r=await fetch(CFG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(f)});
   if(r.ok){rf.reset();st.textContent='✅ Terkirim! Tim kami akan segera menghubungi Anda.';return}}catch(_){}
  st.textContent='Pengiriman gagal, dialihkan ke WhatsApp...'}
 window.open(wa(f.kebutuhan.includes('H2H')?CFG.waB2B.url:CFG.waCS.url,msg),'_blank')};

/* ===== Analytics (opsional) & PWA ===== */
if(CFG.ga){const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+CFG.ga;document.head.appendChild(s);
 window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',CFG.ga)}
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
