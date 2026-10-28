/* main.js — palette, navigation, invert, scroll progress. */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc = document.querySelector('.doc');

  /* ---------- line numbers ---------- */

  let line = 0;
  doc.querySelectorAll(':scope > *').forEach((el) => {
    if (el.matches('p, h1, h2, blockquote, .divider, .ending')) {
      el.dataset.line = String(++line);
    }
  });

  /* ---------- word count ---------- */

  const wordsEl = document.getElementById('words');
  if (wordsEl) {
    const prose = [...doc.querySelectorAll('p')]
      .map((el) => el.textContent.trim())
      .join(' ');
    wordsEl.textContent = String(prose.split(/\s+/).filter(Boolean).length);
  }

  /* ---------- scroll progress ---------- */

  const progressEl = document.getElementById('progress');
  let ticking = false;

  function updateProgress() {
    ticking = false;
    if (!progressEl) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
    progressEl.textContent = pct + '%';
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });

  updateProgress();

  /* ---------- invert ---------- */

  function setInverted(on) {
    document.documentElement.toggleAttribute('data-inverted', on);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', on ? '#ffffff' : '#000000');
    try {
      localStorage.setItem('life:invert', on ? '1' : '0');
    } catch (e) {}
  }

  function toggleInvert() {
    setInverted(!document.documentElement.hasAttribute('data-inverted'));
  }

  /* ---------- scrolling helpers ---------- */

  function scrollToEl(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function jump(dir) {
    const sections = [...document.querySelectorAll('main section[id]')];
    if (!sections.length) return;

    if (dir > 0) {
      const next = sections.find((s) => s.getBoundingClientRect().top > 40);
      if (next) scrollToEl(next);
      else scrollToEl(sections[0]);
    } else {
      const prev = sections
        .slice()
        .reverse()
        .find((s) => s.getBoundingClientRect().top < -40);
      if (prev) scrollToEl(prev);
      else scrollToEl(document.getElementById('main'));
    }
  }

  /* ---------- palette ---------- */

  const palette = document.getElementById('palette');
  const input = document.getElementById('palette-input');
  const list = document.getElementById('palette-list');
  const help = document.getElementById('help');
  const openBtn = document.getElementById('open-palette');

  const commands = [
    { name: 'begin', hint: 'jump to ## begin', run: () => scrollToEl(document.getElementById('begin')) },
    { name: 'drift', hint: 'jump to ## drift', run: () => scrollToEl(document.getElementById('drift')) },
    { name: 'notice', hint: 'jump to ## notice', run: () => scrollToEl(document.getElementById('notice')) },
    { name: 'end', hint: 'jump to ## end', run: () => scrollToEl(document.getElementById('end')) },
    { name: 'quotes', hint: 'jump to ## quotes', run: () => scrollToEl(document.getElementById('quotes')) },
    { name: 'top', hint: 'back to the beginning', run: () => scrollToEl(document.getElementById('main')) },
    { name: 'theme', hint: 'invert black and white', run: toggleInvert },
    {
      name: 'help',
      hint: 'keyboard shortcuts',
      run: () => {
        if (help && typeof help.showModal === 'function') help.showModal();
      }
    }
  ];

  let filtered = commands.slice();
  let active = 0;

  function renderList() {
    list.textContent = '';
    filtered.forEach((cmd, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active));

      const code = document.createElement('code');
      code.textContent = ':' + cmd.name;

      const hint = document.createElement('span');
      hint.textContent = cmd.hint;

      li.append(code, hint);
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        runCommand(i);
      });
      list.append(li);
    });
  }

  function filter() {
    const q = input.value.trim().replace(/^:/, '').toLowerCase();
    filtered = commands.filter((c) => c.name.startsWith(q));
    active = 0;
    renderList();
    const first = list.firstElementChild;
    if (first) first.scrollIntoView({ block: 'nearest' });
  }

  function moveActive(delta) {
    if (!filtered.length) return;
    active = (active + delta + filtered.length) % filtered.length;
    [...list.children].forEach((li, i) => {
      li.setAttribute('aria-selected', String(i === active));
    });
    const current = list.children[active];
    if (current) current.scrollIntoView({ block: 'nearest' });
  }

  function runCommand(i) {
    const cmd = filtered[i];
    if (!cmd) return;
    if (palette && palette.open) palette.close();
    cmd.run();
  }

  function openPalette() {
    if (!palette || typeof palette.showModal !== 'function') return;
    input.value = '';
    filtered = commands.slice();
    active = 0;
    renderList();
    palette.showModal();
    input.focus();
  }

  if (input && list) {
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveActive(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveActive(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        runCommand(active);
      }
    });
  }

  if (palette) {
    palette.addEventListener('click', (e) => {
      if (e.target === palette) palette.close();
    });
  }

  if (openBtn) {
    openBtn.addEventListener('click', openPalette);
  }

  const closeHelp = document.getElementById('close-help');
  if (closeHelp && help) {
    closeHelp.addEventListener('click', () => help.close());
    help.addEventListener('click', (e) => {
      if (e.target === help) help.close();
    });
  }

  /* ---------- keyboard ---------- */

  let lastG = 0;

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette && palette.open) palette.close();
      else openPalette();
      return;
    }

    if (palette && palette.open) return;
    if (help && help.open) return;

    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'j') {
      jump(1);
    } else if (e.key === 'k') {
      jump(-1);
    } else if (e.key === 'g') {
      const now = Date.now();
      if (now - lastG < 600) {
        scrollToEl(document.getElementById('main'));
        lastG = 0;
      } else {
        lastG = now;
      }
    }
  });
})();
