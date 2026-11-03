(() => {
  'use strict';
  const toggle = document.getElementById('menuToggle');
  const mobile = document.getElementById('mobileNav');
  function closeMenu(){ if(!toggle || !mobile)return; toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','メニューを開く');mobile.hidden=true; }
  if(toggle && mobile){
    toggle.addEventListener('click',()=>{ const opening=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(opening));toggle.setAttribute('aria-label',opening?'メニューを閉じる':'メニューを開く');mobile.hidden=!opening; });
    mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    window.addEventListener('resize',()=>{if(window.innerWidth>800)closeMenu();});
  }
  document.getElementById('copyrightYear').textContent=new Date().getFullYear();
  const cfg=window.GISHODO_SITE||{};
  const distributionURL=cfg.links?.breakfast||'';
  const link=document.getElementById('distributionLink');
  if(/^https?:\/\//.test(distributionURL)){
    link.href=distributionURL;link.hidden=false;
    document.getElementById('distributionStatus').textContent='配布ページへ';
    document.getElementById('distributionNote').textContent='外部の配布ページが新しいタブで開きます。';
  }
  const spoilerToggle=document.getElementById('spoilerToggle');
  const spoiler=document.getElementById('spoilerContent');
  spoilerToggle.addEventListener('click',()=>{
    const open=spoiler.hidden;
    spoiler.hidden=!open;
    spoilerToggle.setAttribute('aria-expanded',String(open));
    spoilerToggle.innerHTML=open?'攻略情報を閉じる <span aria-hidden="true">↗</span>':'エンディングリスト・攻略ヒントを見る <span aria-hidden="true">↗</span>';
  });
  const characters=[
    {name:'主人公',image:null,description:'主人公の容姿は作品内では公開されていません。'},
    {name:'彼',image:'assets/breakfast-him.png',description:'やさしい笑顔で、あなたを迎えてくれる青年。'},
    {name:'？？？',image:'assets/breakfast-koyomi-silhouette.png',description:'謎の鑑定士。公開中のビジュアルはシルエットです。'}
  ];
  const modal=document.getElementById('portraitDialog');
  const photo=document.getElementById('portraitImage');
  const placeholder=document.getElementById('portraitPlaceholder');
  let current=0;
  const ids={protagonist:0,him:1,mystery:2};
  function render(index){
    current=(index+characters.length)%characters.length;
    const data=characters[current];
    photo.hidden=!data.image;
    placeholder.hidden=!!data.image;
    if(data.image){photo.src=data.image; photo.alt=data.name+'の全身立ち絵';}
    document.getElementById('portraitName').textContent=data.name;
    document.getElementById('portraitDesc').textContent=data.description;
    document.getElementById('portraitCount').textContent=String(current+1).padStart(2,'0')+' / 03';
  }
  document.querySelectorAll('[data-character]').forEach(btn=>btn.addEventListener('click',()=>{
    render(ids[btn.dataset.character]??0);
    if(typeof modal.showModal==='function')modal.showModal();else modal.setAttribute('open','');
  }));
  document.getElementById('closePortrait').addEventListener('click',()=>modal.close());
  document.getElementById('previousPortrait').addEventListener('click',()=>render(current-1));
  document.getElementById('nextPortrait').addEventListener('click',()=>render(current+1));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')closeMenu();
    if(!modal.open)return;
    if(e.key==='ArrowLeft')render(current-1);
    if(e.key==='ArrowRight')render(current+1);
  });
})();
