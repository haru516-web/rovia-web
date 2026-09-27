const products=[
 {id:1,name:'Quiet Emblem Tee',price:5400,cat:'light',crop:'tee-01',wear:'assets/natsuki-rovia-tee-01.png',colors:['#f4f2ec']},
 {id:2,name:'Mountain Mark Tee',price:5400,cat:'light',crop:'tee-02',wear:'assets/natsuki-rovia-tee-02-worn.png',colors:['#f4f2ec']},
 {id:3,name:'Navy Emblem Tee',price:5400,cat:'dark',crop:'tee-03',wear:'assets/natsuki-rovia-tee-03-worn.png',colors:['#17243d']},
 {id:4,name:'Same Sky Tee',price:5400,cat:'light',crop:'tee-04',wear:'assets/natsuki-rovia-tee-04-worn.png',colors:['#f4f2ec']}
];
const grid=document.querySelector('#productGrid'),cart=[],yen=n=>'¥'+n.toLocaleString('ja-JP'),yenTax=n=>`${yen(n)}（税込）`;
function renderProducts(filter='all'){grid.innerHTML=products.map((p,i)=>`<article class="product-card reveal ${filter!=='all'&&p.cat!==filter?'hidden':''}" style="transition-delay:${(i%4)*.08}s"><div class="product-image-wrap" data-id="${p.id}" tabindex="0" role="button" aria-label="${p.name}を詳しく見る"><div class="product-crop product-image ${p.crop}"></div><button class="quick-btn" data-id="${p.id}">Quick view ＋</button></div><div class="product-info"><div><h3>${p.name}</h3><small>Relaxed unisex fit</small><div class="color-dots">${p.colors.map(c=>`<i style="background:${c}"></i>`).join('')}</div></div><strong>${yenTax(p.price)}</strong></div></article>`).join('');observe();}
function observe(){document.querySelectorAll('.reveal:not(.visible)').forEach(el=>observer.observe(el))}
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});renderProducts();
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.filter.active').classList.remove('active');b.classList.add('active');renderProducts(b.dataset.filter)}));
const modal=document.querySelector('#quickView');let current=null;
const modalGallery=document.querySelector('#modalGallery'),galleryTrack=document.querySelector('#modalGalleryTrack'),wearImage=document.querySelector('#modalWearImage');let activeGalleryIndex=0,swipeOrigin=null;
function showGallerySlide(index){activeGalleryIndex=(index+2)%2;galleryTrack.style.transform=`translate3d(-${activeGalleryIndex*100}%,0,0)`;document.querySelector('#galleryIndex').textContent=String(activeGalleryIndex+1).padStart(2,'0');document.querySelector('#galleryLabel').textContent=activeGalleryIndex?'ON MODEL':'PRODUCT';document.querySelectorAll('.gallery-dot').forEach((dot,i)=>{dot.classList.toggle('active',i===activeGalleryIndex);dot.setAttribute('aria-current',String(i===activeGalleryIndex))})}
modal.addEventListener('pointermove',e=>{const r=modal.getBoundingClientRect(),x=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),y=Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100));modal.style.setProperty('--glass-x',`${x}%`);modal.style.setProperty('--glass-y',`${y}%`)});modal.addEventListener('pointerleave',()=>{modal.style.removeProperty('--glass-x');modal.style.removeProperty('--glass-y')});
function openModal(id){current=products.find(p=>p.id===+id);document.querySelector('#modalCrop').className=`product-crop modal-slide ${current.crop}`;wearImage.src=current.wear;wearImage.alt=`${current.name}の着用イメージ`;showGallerySlide(0);document.querySelector('#modalIndex').textContent=`PIECE ${String(current.id).padStart(2,'0')} / ROVIA 2026`;document.querySelector('#modalName').textContent=current.name;document.querySelector('#modalPrice').textContent=yenTax(current.price);document.querySelector('#colors').innerHTML=current.colors.map((c,i)=>`<button class="swatch ${i?'':'active'}" style="background:${c}" aria-label="カラー ${i+1}"></button>`).join('');modal.showModal()}
grid.addEventListener('click',e=>{const target=e.target.closest('[data-id]');if(target)openModal(target.dataset.id)});grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.dataset.id)openModal(e.target.dataset.id)});
document.querySelector('#galleryPrev').onclick=()=>showGallerySlide(activeGalleryIndex-1);document.querySelector('#galleryNext').onclick=()=>showGallerySlide(activeGalleryIndex+1);document.querySelectorAll('.gallery-dot').forEach(dot=>dot.addEventListener('click',()=>showGallerySlide(+dot.dataset.slideTo)));
modalGallery.addEventListener('pointerdown',e=>{if(!e.target.closest('.gallery-toolbar'))swipeOrigin=e.clientX});modalGallery.addEventListener('pointerup',e=>{if(swipeOrigin===null)return;const delta=e.clientX-swipeOrigin;swipeOrigin=null;if(Math.abs(delta)>42)showGallerySlide(activeGalleryIndex+(delta<0?1:-1))});modalGallery.addEventListener('pointercancel',()=>swipeOrigin=null);
document.querySelector('.modal-close').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});document.querySelector('#colors').addEventListener('click',e=>{if(e.target.classList.contains('swatch')){document.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));e.target.classList.add('active')}});
const cartPanel=document.querySelector('#cart'),backdrop=document.querySelector('#backdrop');function toggleCart(open){cartPanel.classList.toggle('open',open);backdrop.classList.toggle('show',open);cartPanel.setAttribute('aria-hidden',!open)}document.querySelector('#openCart').onclick=()=>toggleCart(true);document.querySelector('#closeCart').onclick=()=>toggleCart(false);backdrop.onclick=()=>toggleCart(false);
function addCart(){const size=document.querySelector('#sizeSelect').value;cart.push({...current,size,key:Date.now()});updateCart();modal.close();const t=document.querySelector('#toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);setTimeout(()=>toggleCart(true),350)}document.querySelector('.add-modal').onclick=addCart;
function updateCart(){document.querySelector('#cartCount').textContent=cart.length;document.querySelector('#cartTitleCount').textContent=cart.length;document.querySelector('#subtotal').textContent=yenTax(cart.reduce((s,p)=>s+p.price,0));document.querySelector('#cartItems').innerHTML=cart.length?cart.map(p=>`<div class="cart-line"><div class="product-crop cart-thumb ${p.crop}"></div><div><h4>${p.name}</h4><small>${p.size} / ${yenTax(p.price)}</small></div><button class="remove" data-key="${p.key}" aria-label="${p.name}を削除">×</button></div>`).join(''):`<div class="empty-cart"><span>○</span><p>バッグは空です。</p><small>気になる一着を見つけてください。</small></div>`}
document.querySelector('#cartItems').addEventListener('click',e=>{if(e.target.dataset.key){cart.splice(cart.findIndex(p=>p.key==e.target.dataset.key),1);updateCart()}});document.querySelector('#checkout').onclick=()=>{if(!cart.length)return;alert('デモサイトのため、決済は実行されません。\nROVIAをお選びいただきありがとうございます。')};
document.querySelectorAll('.tilt-card').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1000px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`});card.addEventListener('pointerleave',()=>card.style.transform='')});

const homeSurface=document.querySelector('#top .collection');
if(homeSurface){
 const scrollDrivenHomeLight=window.matchMedia('(max-width:600px)').matches||window.matchMedia('(hover:none)').matches||window.matchMedia('(pointer:coarse)').matches;
 const setHomeLight=(x,y)=>{
  homeSurface.style.setProperty('--home-light-x',`${x}%`);
  homeSurface.style.setProperty('--home-light-y',`${y}%`);
 };
 const moveHomeLight=e=>{
  if(e.pointerType==='touch')return;
  const r=homeSurface.getBoundingClientRect(),x=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),y=Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100));
  setHomeLight(x,y);
 };
 if(!scrollDrivenHomeLight)homeSurface.addEventListener('pointermove',moveHomeLight,{passive:true});
 homeSurface.addEventListener('pointerleave',()=>{if(!scrollDrivenHomeLight){homeSurface.style.removeProperty('--home-light-x');homeSurface.style.removeProperty('--home-light-y')}});
 if(scrollDrivenHomeLight){
  let scrollLightFrame=0;
  const moveHomeLightWithScroll=()=>{
   if(scrollLightFrame)return;
   scrollLightFrame=window.requestAnimationFrame(()=>{
    scrollLightFrame=0;
    const r=homeSurface.getBoundingClientRect(),sectionTop=r.top+window.scrollY,travel=Math.max(1,homeSurface.offsetHeight-window.innerHeight),progress=Math.max(0,Math.min(1,(window.scrollY-sectionTop)/travel));
    setHomeLight(30+progress*40,12+progress*76);
   });
  };
  window.addEventListener('scroll',moveHomeLightWithScroll,{passive:true});
  window.addEventListener('resize',moveHomeLightWithScroll,{passive:true});
  moveHomeLightWithScroll();
 }
}

const siteIntro=document.querySelector('#siteIntro');
if(siteIntro){
 const siteHome=document.querySelector('#top'),prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let introClosed=false,autoCloseTimer;
 const handleIntroKeydown=e=>{if(e.key==='Escape'||e.key==='Enter'||e.key===' '){e.preventDefault();closeSiteIntro()}};
 const closeSiteIntro=()=>{
  if(introClosed)return;
  introClosed=true;
  window.clearTimeout(autoCloseTimer);
  window.removeEventListener('keydown',handleIntroKeydown);
  if(prefersReducedMotion){
   siteIntro.hidden=true;
   siteIntro.setAttribute('aria-hidden','true');
   document.body.classList.remove('intro-playing');
   siteHome?.focus({preventScroll:true});
   return;
  }
  siteIntro.classList.add('is-exiting');
  window.setTimeout(()=>{
   siteIntro.hidden=true;
   siteIntro.setAttribute('aria-hidden','true');
   document.body.classList.remove('intro-playing');
   siteHome?.focus({preventScroll:true});
  },840);
 };
 document.body.classList.add('intro-playing');
 siteIntro.addEventListener('click',closeSiteIntro);
 window.addEventListener('keydown',handleIntroKeydown);
 siteIntro.focus({preventScroll:true});
 autoCloseTimer=window.setTimeout(closeSiteIntro,3000);
}
