/* ===== KONFIGURASI: ubah data kontak di sini saja ===== */
const CFG={
 nama:'ZPP Reload',
 telegram:{label:'@zpperkasa',url:'https://t.me/zpperkasa'},
 waCS:{label:'0858-6233-6233',url:'https://wa.me/6285862336233'},
 waB2B:{label:'0812-2085-85',url:'https://wa.me/62812208585'},
 channel:{label:'Channel Info H2H',url:'https://t.me/zavier_h2hinfo'}
};
const page=location.pathname.split('/').pop()||'index.html';
const link=(h,t)=>`<li><a href="${h}" class="${page===h?'on':''}">${t}</a></li>`;
document.getElementById('hdr').innerHTML=`<header><div class="wrap nav">
<a class="brand" href="index.html"><img src="assets/images/logo.png" alt="Logo ZPP Reload">ZPP <span>Reload</span></a>
<button class="burger" aria-label="Menu" onclick="document.getElementById('mn').classList.toggle('open')">☰</button>
<nav id="mn"><ul>${link('index.html','Home')}${link('harga.html','Harga')}${link('pendaftaran.html','Pendaftaran')}</ul></nav></div></header>
<a class="wa" href="${CFG.waCS.url}" target="_blank" rel="noopener" aria-label="WhatsApp CS">💬</a>`;
const contacts=()=>`<div class="contact">
<a class="ct" href="${CFG.telegram.url}" target="_blank" rel="noopener"><i>✈️</i><div><small>Telegram</small><b>${CFG.telegram.label}</b></div></a>
<a class="ct" href="${CFG.waCS.url}" target="_blank" rel="noopener"><i>💬</i><div><small>WhatsApp CS</small><b>${CFG.waCS.label}</b></div></a>
<a class="ct" href="${CFG.waB2B.url}" target="_blank" rel="noopener"><i>🤝</i><div><small>WhatsApp B2B</small><b>${CFG.waB2B.label}</b></div></a>
<a class="ct" href="${CFG.channel.url}" target="_blank" rel="noopener"><i>📢</i><div><small>Channel Telegram</small><b>${CFG.channel.label}</b></div></a></div>`;
document.querySelectorAll('[data-contacts]').forEach(e=>e.innerHTML=contacts());
document.getElementById('ftr').innerHTML=`<footer><div class="wrap"><div class="fg">
<div><div class="brand"><img src="assets/images/logo.png" alt="">ZPP <span>Reload</span></div><p style="margin-top:10px;max-width:300px">Server pulsa, paket data, PPOB &amp; voucher game. Cepat, stabil, harga kompetitif.</p></div>
<div><b>Menu</b><br><a href="index.html">Home</a><a href="harga.html">Harga</a><a href="pendaftaran.html">Pendaftaran</a></div>
<div><b>Hubungi Kami</b><br><a href="${CFG.telegram.url}">Telegram ${CFG.telegram.label}</a><a href="${CFG.waCS.url}">WA CS ${CFG.waCS.label}</a><a href="${CFG.waB2B.url}">WA B2B ${CFG.waB2B.label}</a><a href="${CFG.channel.url}">Channel Info</a></div>
</div><div class="copy">© ${new Date().getFullYear()} ${CFG.nama}. All rights reserved.</div></div></footer>`;

/* ===== Halaman harga ===== */
const tb=document.getElementById('tbody');
if(tb){
 let data=[],kat='Semua',lim=100;
 const rp=n=>'Rp '+Number(n).toLocaleString('id-ID');
 const render=()=>{
  const q=document.getElementById('q').value.toLowerCase();
  const rows=data.filter(d=>(kat==='Semua'||d.kategori===kat)&&(d.kode+' '+d.nama).toLowerCase().includes(q));
  const more=document.getElementById('more');more.hidden=rows.length<=lim;more.textContent='Tampilkan lebih banyak ('+(rows.length-lim)+' lagi)';
  tb.innerHTML=rows.length?rows.slice(0,lim).map(d=>`<tr><td>${d.kode}</td><td>${d.nama}</td><td>${rp(d.harga)}</td><td class="${d.status==='Normal'?'ok':'no'}">${d.status==='Normal'?'● Normal':'● Gangguan'}</td></tr>`).join(''):'<tr><td colspan="4">Produk tidak ditemukan.</td></tr>';
 };
 fetch('data/harga.json').then(r=>r.json()).then(j=>{
  data=j.produk;document.getElementById('upd').textContent='Terakhir diperbarui: '+j.update;
  const ks=['Semua',...new Set(data.map(d=>d.kategori))];
  const t=document.getElementById('tabs');
  t.innerHTML=ks.map(k=>`<button class="tab ${k===kat?'on':''}">${k}</button>`).join('');
  t.onclick=e=>{if(e.target.classList.contains('tab')){kat=e.target.textContent;lim=100;[...t.children].forEach(b=>b.classList.toggle('on',b===e.target));render()}};
  render();
 }).catch(()=>tb.innerHTML='<tr><td colspan="4">Gagal memuat harga. Jalankan lewat server (GitHub Pages / live server).</td></tr>');
 document.getElementById('q').oninput=()=>{lim=100;render()};
 document.getElementById('more').onclick=()=>{lim+=200;render()};
 document.getElementById('dl').onclick=()=>{
  const csv='Kode,Produk,Harga,Status\n'+data.map(d=>`${d.kode},"${d.nama}",${d.harga},${d.status}`).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='harga-zpp-reload.csv';a.click();
 };
}
