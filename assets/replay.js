/* GCW replay shim — static replay behaviours that the SPA bundle used to provide.
 * Scope: reveal-on-scroll, stat counters, mobile nav, dropdown, hero video lightbox, form guard.
 * It intentionally does NOT re-implement app data fetching, routing or form submission. */
(function () {
  'use strict';

  var script = document.currentScript;
  var root = './';
  if (script && script.src) {
    var i = script.src.indexOf('assets/replay.js');
    if (i > -1) { root = script.src.slice(0, i); }
  }
  var HERO_VIDEO = root + 'AppUpload/Video/18483b745c914b3cbbf2702bc1b28ac0.mp4';

  function all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function notice(text) {
    var old = document.querySelector('.gcw-notice');
    if (old) { old.parentNode.removeChild(old); }
    var el = document.createElement('div');
    el.className = 'gcw-notice';
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) { el.parentNode.removeChild(el); }
    }, 4200);
  }

  /* 1. reveal-on-scroll (mirrors the original useLegacyReveal hook) */
  function initReveal() {
    var items = all('.fade-in');
    if (!items.length) { return; }
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* 2. stat counters (prerendered as 0, counted up like the original) */
  function initCounters() {
    var nums = all('.stats-bar-num[data-target]');
    if (!nums.length) { return; }

    function run(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) { return; }
      var start = null;
      var duration = 1600;
      function step(ts) {
        if (start === null) { start = ts; }
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) { requestAnimationFrame(step); }
        else { el.textContent = String(target); }
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      nums.forEach(function (el) { el.textContent = el.getAttribute('data-target'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* 3. mobile navigation */
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
        document.body.style.overflow = open ? 'hidden' : '';
      });
      all('a', menu).forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    all('.nav-dropdown').forEach(function (dd) {
      var trigger = dd.querySelector('.nav-dropdown-trigger');
      if (!trigger) { return; }
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dd.classList.toggle('open');
      });
    });
    document.addEventListener('click', function (e) {
      all('.nav-dropdown.open').forEach(function (dd) {
        if (!dd.contains(e.target)) { dd.classList.remove('open'); }
      });
    });

    var nav = document.getElementById('navbar');
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle('scrolled', window.pageYOffset > 60);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /* 4. hero video lightbox (original bundle opened a modal player) */
  function initHeroVideo() {
    var hero = document.querySelector('.hero-video-parallax');
    if (!hero) { return; }
    var btn = hero.querySelector('button');
    if (!btn) { return; }
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var box = document.createElement('div');
      box.className = 'gcw-lightbox';
      var close = document.createElement('div');
      close.className = 'gcw-lightbox-close';
      close.setAttribute('role', 'button');
      close.setAttribute('aria-label', '关闭');
      close.textContent = '×';
      var video = document.createElement('video');
      video.src = HERO_VIDEO;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      box.appendChild(close);
      box.appendChild(video);
      function closeBox() {
        if (box.parentNode) { box.parentNode.removeChild(box); }
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = '';
      }
      function onKey(ev) { if (ev.key === 'Escape') { closeBox(); } }
      close.addEventListener('click', closeBox);
      box.addEventListener('click', function (ev) { if (ev.target === box) { closeBox(); } });
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      document.body.appendChild(box);
    });
  }

  /* 5. forms have no backend in a static replay — say so instead of failing silently */
  function initForms() {
    all('form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        notice('静态回放版本：表单不提交到后端，请联系原官网 0411-87150000 或 18840843999。');
      });
    });
  }

  function boot() {
    initReveal();
    initCounters();
    initNav();
    initHeroVideo();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
