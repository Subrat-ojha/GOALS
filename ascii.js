/* ascii.js - frame loops over real ASCII art fetched from the archive. No canvas, no libraries. */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ART = {
    bamboo: {
      interval: 1800,
      frames: [
        [
          "    ,*-.",
          "    |  |",
          ",.  |  |",
          "| |_|  | ,.",
          "`---.  |_| |",
          "    |  .--`",
          "    |  |",
          "    |  | kra",
        ]
      ]
    },

    monk: {
      interval: 2200,
      frames: [
        [
          "     _______",
          "    /       /_",
          "   /  -/-  / /",
          "  /   /   / /",
          " /_______/ /",
          "((______| /",
          " `\"\"\"\"\"\"\"",
        ]
      ]
    },

    lotus: {
      interval: 1500,
      frames: [
        [
          "     .-",
          "  .-(   )-.",
          " (     __) ).",
          "  `-(       __)",
          "    `(____)-',",
          "  - -  :   :  - -",
          "      / `-' \\",
          "    ,    |   .",
        ]
      ]
    },

  };

  function create({ el, art }) {
    if (!el) return null;

    const { frames, interval = 1500 } = art;
    let index = 0;
    let timer = 0;
    let visible = true;

    function paint() {
      el.textContent = frames[index].join('\n');
      index = (index + 1) % frames.length;
    }

    paint();

    if (reduceMotion || frames.length < 2) {
      return { start() {}, stop() {}, destroy() {} };
    }

    function start() {
      if (timer) return;
      timer = setInterval(paint, interval);
    }

    function stop() {
      clearInterval(timer);
      timer = 0;
    }

    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else stop();
    }, { rootMargin: '140px' });

    io.observe(el);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (visible) start();
    });

    return {
      start,
      stop,
      destroy() {
        stop();
        io.disconnect();
      }
    };
  }

  function init() {
    create({ el: document.getElementById('art-bamboo'), art: bamboo });
    create({ el: document.getElementById('art-monk'), art: monk });
    create({ el: document.getElementById('art-lotus'), art: lotus });
  }

  window.LifeAscii = { create, ART };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
