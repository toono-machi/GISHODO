// The persistent top bar and WOX counter are owned only by index.html.
// View templates swap the article body without reloading the document or counter script.
(() => {
  'use strict';
  window.GISHODO_ROUTER_ACTIVE = true;
  const views = new Set(['home','tool','profile','breakfast']);
  const pageContent = document.getElementById('pageContent');
  const gameDialog = document.getElementById('gameDialog');
  const store = new Map();
  const metaDescription = document.querySelector('meta[name="description"]');
  const metaOG = document.querySelector('meta[property="og:title"]');
  const metaOGDesc = document.querySelector('meta[property="og:description"]');
  const metadata = {
    home: {title: '偽書堂｜ミステリーと、少しの怪異を。', description: '偽書堂（ぎしょどう）は、ミステリー・ホラー・怪異・叙述トリックを中心に制作するインディーゲームサークルです。'},
    tool: {title: 'TOOL｜創作を支える、小さな道具たち。｜偽書堂', description: '偽書堂の自作制作ツール10件を紹介しています。'},
    profile: {title: '遠廼まち｜プロフィール｜偽書堂', description: '遠廼まち（toono-machi）のクリエイタープロフィール。'},
    breakfast: {title: '最■の朝食を、君に。｜偽書堂', description: '偽書堂制作『最■の朝食を、君に。』公式作品ページ。'}
  };
  let current = 'home';
  let transitionId = 0;

  // Keep home DOM and its original initialized events alive while displaying other content.
  // The original home markup stays mounted on initial display; detach only when first navigating away.
  store.set('home', document.createDocumentFragment());

  function routeFromLocation() {
    const url = new URL(location.href);
    const named = url.searchParams.get('view');
    return {view: views.has(named) ? named : 'home', hash: url.hash};
  }

  function hrefFor(view, hash = '') {
    return 'index.html' + (view === 'home' ? '' : '?view=' + view) + hash;
  }

  function updateNav(view, hash) {
    const active = view === 'home'
      ? ({'#games': 'GAME','#about': 'ABOUT','#news': 'NEWS','#contact': 'CONTACT'}[hash] || 'HOME')
      : view === 'breakfast' ? 'GAME' : view.toUpperCase();
    document.querySelectorAll('.header .desktop-nav a, .mobile-nav a').forEach(a => {
      const isActive = a.textContent.trim() === active;
      a.classList.toggle('active', isActive);
      if (isActive) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  function closeMenu() {
    const toggle = document.getElementById('menuToggle');
    const mobile = document.getElementById('mobileNav');
    if (!toggle || !mobile) return;
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','メニューを開く');
    mobile.hidden = true;
  }
  function applyTitle(view) {
    const data = metadata[view];
    document.title = data.title;
    if (metaDescription) metaDescription.content = data.description;
    if (metaOG) metaOG.content = data.title;
    if (metaOGDesc) metaOGDesc.content = data.description;
  }
  function viewFragment(view) {
    if (!store.has(view)) {
      const template = document.getElementById('view-' + view);
      if (!template) throw new Error('Missing page template: ' + view);
      store.set(view, template.content.cloneNode(true));
    }
    return store.get(view);
  }
  function scrollToAnchor(hash) {
    if (!hash) { window.scrollTo({top:0,behavior:'instant'}); return; }
    const id = decodeURIComponent(hash.slice(1));
    if (id === 'top' || id === 'pageTop') {
      window.scrollTo({top:0,behavior:'instant'});
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({block:'start',behavior:'instant'});
      else window.scrollTo({top:0,behavior:'instant'});
    }
  }
  function open(view, hash='', {record=false}={}) {
    if (!views.has(view)) view = 'home';
    if (record) history.pushState({view}, '', hrefFor(view,hash));
    if (view !== current || !pageContent.firstElementChild) {
      const oldFragment = document.createDocumentFragment();
      while (pageContent.firstChild) oldFragment.appendChild(pageContent.firstChild);
      store.set(current,oldFragment);
      pageContent.appendChild(viewFragment(view));
      current = view;
      document.body.classList.remove('tool-page','profile-page','breakfast-page');
      if (view !== 'home') document.body.classList.add(view+'-page');
      if (view === 'breakfast') window.GISHODO_initBreakfast?.();
    }
    const year = pageContent.querySelector('#copyrightYear');
    if (year) year.textContent = String(new Date().getFullYear());
    if (gameDialog?.open && view !== 'home') gameDialog.close();
    // The site shell is unchanged. WOX is not evaluated again.
    if (gameDialog) gameDialog.hidden = view !== 'home';
    updateNav(view,hash);
    applyTitle(view);
    closeMenu();
    const token = ++transitionId;
    requestAnimationFrame(() => {
      if (token === transitionId) scrollToAnchor(hash);
    });
  }

  function internalDestination(anchor) {
    if (anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return null;
    const raw = anchor.getAttribute('href');
    if (!raw || /^(mailto:|tel:|javascript:)/i.test(raw)) return null;
    let url;
    try {url = new URL(raw,document.baseURI);} catch {return null;}
    if (url.origin !== new URL(document.baseURI).origin) return null;
    const pathname = url.pathname.split('/').pop();
    if (!['index.html','tool.html','profile.html','breakfast.html',''].includes(pathname)) return null;
    let view = pathname === 'index.html' || pathname === '' ? 'home' : pathname.replace('.html','');
    // A fragment-only link inside a page points at that page, except main menu links.
    if (raw.startsWith('#')) {
      view = anchor.closest('.header, .mobile-nav') ? 'home' : current;
    } else if (view === 'home') {
      const requested = url.searchParams.get('view');
      if (views.has(requested)) view = requested;
    }
    return {view,hash:url.hash};
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;
    const route = internalDestination(anchor);
    if (!route) return;
    event.preventDefault();
    if (current === route.view && location.hash === route.hash) {
      scrollToAnchor(route.hash);
      closeMenu();
      return;
    }
    open(route.view,route.hash,{record:true});
  });
  window.addEventListener('popstate', () => {
    const route = routeFromLocation();
    open(route.view,route.hash);
  });
  // Back to HOME/GAME/ABOUT etc remains in the one persistent document.
  const initial = routeFromLocation();
  open(initial.view,initial.hash);
})();
