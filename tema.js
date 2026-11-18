(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
window.scan=()=>{};
// nama: huruf naik satu per satu, lalu lebar dan berat huruf mengikuti kursor
const nm=$('#nm');let cs=[];
if(nm){nm.setAttribute('aria-label',nm.textContent.trim().replace(/\s+/g,' '));let i=0;
 nm.innerHTML=nm.textContent.trim().split(/\s+/).map(w=>'<span class="r" aria-hidden="true">'+[...w].map(ch=>'<span class="c" style="--i:'+(i++)+'">'+ch+'</span>').join('')+'</span>').join('');
 cs=$$('.c',nm)}
if(cs.length&&!rm){const cur=cs.map(()=>0);let mx=-999,my=-999;addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
 (function f(t){cs.forEach((c,i)=>{const b=c.getBoundingClientRect();let k;
  if(fine&&mx>-900)k=Math.max(0,1-Math.hypot(b.left+b.width/2-mx,b.top+b.height/2-my)/260);else k=(Math.sin(t/900+i*.8)+1)/4;
  cur[i]+=(k-cur[i])*.12;c.style.fontVariationSettings='"wdth" '+(75+cur[i]*25).toFixed(1)+',"wght" '+(800-cur[i]*500).toFixed(0)});requestAnimationFrame(f)})(0)}
// garis perjalanan terisi saat digulir
const tl=$('.tl'),ti=$$('.ti');
function sc(){if(!tl)return;const r=tl.getBoundingClientRect(),y=innerHeight*.65;
 tl.style.setProperty('--p',Math.max(0,Math.min(1,(y-r.top)/r.height)));ti.forEach(e=>e.classList.toggle('on',e.getBoundingClientRect().top<y))}
addEventListener('scroll',sc,{passive:true});sc();
// cahaya mengikuti kursor di hero, angka proyek ikut bergeser
const hr=$('.hero');hr&&hr.addEventListener('pointermove',e=>{const r=hr.getBoundingClientRect();hr.style.setProperty('--mx',e.clientX-r.left+'px');hr.style.setProperty('--my',e.clientY-r.top+'px')});
$$('.pr').forEach(p=>p.addEventListener('pointermove',e=>{const r=p.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5,ex=$('.ex',p);ex&&(ex.style.setProperty('--tx',-x*60+'px'),ex.style.setProperty('--ty',-y*40+'px'))}));
// skill lama, penjelasan muncul
const sp=$('#sp');sp&&$$('.sw button').forEach(b=>b.addEventListener('click',()=>{$$('.sw button').forEach(x=>x.setAttribute('aria-pressed',x===b));
 sp.innerHTML=b.dataset.t;sp.style.animation='none';sp.offsetWidth;sp.style.animation=''}));
$$('#yr,#year').forEach(y=>y.textContent=new Date().getFullYear());
})();
