(() => {
  'use strict';
  const cfg = window.GISHODO_SITE || {};
  const links = cfg.links || {};
  const intro = document.getElementById('intro');
  const shell = document.getElementById('siteShell');
  let introDone = false;
  let finishTimer;
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finishIntro = () => {
    if (introDone) return;
    introDone = true;
    window.clearTimeout(finishTimer);
    document.body.classList.remove('intro-lock');
    document.body.classList.add('ready');
    intro.classList.add('intro-out');
    shell.removeAttribute('inert');
    const wait = noMotion ? 0 : 650;
    window.setTimeout(() => { intro.hidden = true; }, wait);
    try { sessionStorage.setItem('gishodo-intro-seen', '1'); } catch (e) { /* private-mode safe */ }
  };
  let hasSeen = false;
  try { hasSeen = sessionStorage.getItem('gishodo-intro-seen') === '1'; } catch (e) {}
  const introMode = cfg.introMode || 'session';
  const playIntro = !noMotion && introMode !== 'off' && (introMode === 'always' || !hasSeen);
  if (playIntro) {
    document.body.classList.add('intro-lock');
    shell.setAttribute('inert', '');
    requestAnimationFrame(() => { intro.classList.add('intro-running'); });
    finishTimer = window.setTimeout(finishIntro, 2750);
  } else {
    finishIntro();
  }
  document.getElementById('skipIntro').addEventListener('click', finishIntro);

  // External links are only enabled if real URLs have been entered in site.config.js.
  document.querySelectorAll('[data-link]').forEach(el => {
    const key = el.dataset.link;
    const url = String(links[key] || '').trim();
    if (!url || !/^(https?:\/\/|mailto:)/i.test(url)) return;
    el.href = url;
    el.hidden = false;
  });
  if ([...document.querySelectorAll('#socials a')].some(el => !el.hidden)) {
    document.getElementById('socialsEmpty').hidden = true;
  }

  // News is intentionally empty until real announcements are added.
  const newsList = document.getElementById('newsList');
  if (Array.isArray(cfg.news) && cfg.news.length) {
    newsList.textContent = '';
    cfg.news.forEach(item => {
      if (!item || !item.title) return;
      const row = document.createElement(item.url && /^https?:\/\//i.test(item.url) ? 'a' : 'div');
      row.className = 'news-row';
      if (row.tagName === 'A') { row.href = item.url; row.target = '_blank'; row.rel = 'noopener noreferrer'; }
      const date = document.createElement('time'); date.textContent = item.date || '—';
      const tag = document.createElement('span'); tag.className = 'news-tag'; tag.textContent = item.category || 'お知らせ';
      const title = document.createElement('span'); title.className = 'news-title'; title.textContent = item.title;
      row.append(date,tag,title);
      newsList.append(row);
    });
    if (!newsList.children.length) newsList.innerHTML = '<p class="news-empty">現在、お知らせはありません。</p>';
  }
  document.getElementById('copyrightYear').textContent = new Date().getFullYear();

  // Mobile menu.
  const toggle = document.getElementById('menuToggle');
  const mobile = document.getElementById('mobileNav');
  const closeMenu = () => { toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','メニューを開く');mobile.hidden = true; };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く');
    mobile.hidden = !open;
  });
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
  window.addEventListener('resize', () => {if (window.innerWidth > 800) closeMenu(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeMenu(); });

  // Navigation active state.
  const navLinks = document.querySelectorAll('.desktop-nav a');
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('active', new URL(a.href, location.href).hash === '#' + entry.target.id));
      });
    }, {rootMargin:'-30% 0px -60% 0px'});
    document.querySelectorAll('main section[id]').forEach(el => navObserver.observe(el));
  }

  // Game detail dialog; designed to work even before release URLs are configured.
  const gameData = {
    breakfast: {
      title: '『最■の朝食を、君に。』',
      category: '料理シミュレーション × 叙述トリック × 心理ホラー',
      description: '朝の光が差し込む部屋。あなたは、大切な人のために朝食を作ることにした。何気ない日常を過ごす短編アドベンチャー。料理の出来栄えと選択によって、異なる結末へと進みます。',
      link: links.breakfast
    },
    mystery: {
      title: '『死人に口なし、神のみぞ知る』',
      category: '探索 × 叙述トリック × ミステリー',
      description: '友人の死をきっかけに始まる探索ミステリー。現場で証拠を集め、関係者の言葉や行動から真相へ迫る。見えている事実が、必ずしも真実とは限らない。',
      link: links.mystery
    }
  };
  const dialog = document.getElementById('gameDialog');
  const dialogPlay = document.getElementById('dialogPlay');
  const dialogNote = document.getElementById('dialogNote');
  document.querySelectorAll('.game-detail').forEach(btn => btn.addEventListener('click', () => {
    const game = gameData[btn.dataset.game];
    if (!game) return;
    document.getElementById('dialogTitle').textContent = game.title;
    document.getElementById('dialogCategory').textContent = game.category;
    document.getElementById('dialogDescription').textContent = game.description;
    if (game.link && /^https?:\/\//i.test(game.link)) {dialogPlay.href=game.link;dialogPlay.hidden=false;dialogNote.hidden=true;}
    else {dialogPlay.removeAttribute('href');dialogPlay.hidden=true;dialogNote.hidden=false;}
    if (typeof dialog.showModal==='function') dialog.showModal();
    else dialog.setAttribute('open','');
  }));
  document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if(event.target===dialog) dialog.close(); });
})();
