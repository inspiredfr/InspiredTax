/* ============================================================================
   InspiredTax Africa — motion & behaviour layer
   No dependencies. Everything gated on IntersectionObserver + reduced-motion.
   ========================================================================= */
(function () {
  'use strict';

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = mqReduce.matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* ---------------------------------------------------------------- utils */
  var zar = function (n) { return Math.round(n).toLocaleString('en-ZA'); };

  function countUp(el, target, dur, prefix, suffix, decimals) {
    prefix = prefix || ''; suffix = suffix || ''; dur = dur || 1400;
    var d = decimals || 0;
    var fmt = function (v) {
      return prefix + (d ? v.toFixed(d) : zar(v)) + suffix;
    };
    if (reduced) { el.textContent = fmt(target); return; }
    var from = parseFloat(el.getAttribute('data-from') || '0');
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = clamp((ts - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(from + (target - from) * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function runCounts(scope) {
    $$('[data-count]', scope).forEach(function (el) {
      countUp(el,
        parseFloat(el.getAttribute('data-count')),
        parseInt(el.getAttribute('data-dur') || '1400', 10),
        el.getAttribute('data-prefix') || '',
        el.getAttribute('data-suffix') || '',
        parseInt(el.getAttribute('data-dec') || '0', 10));
    });
  }

  function onceVisible(el, fn, threshold) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { fn(); io.disconnect(); }
    }, { threshold: threshold || 0.25 });
    io.observe(el);
  }

  /* ------------------------------------------------------------------ nav */
  var nav = $('.nav');
  var progress = $('.nav-progress');
  if (nav) {
    var tick = false;
    var onScroll = function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || window.pageYOffset;
        nav.classList.toggle('scrolled', y > 8);
        if (progress) {
          var h = document.documentElement.scrollHeight - window.innerHeight;
          progress.style.transform = 'scaleX(' + (h > 0 ? clamp(y / h, 0, 1) : 0) + ')';
        }
        tick = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var burger = $('#nav-burger');
  var panel = $('#nav-panel');
  if (burger && panel) {
    burger.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        panel.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* nav section highlighting */
  var navLinks = $$('.nav-links a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove('active'); });
          if (map[en.target.id]) map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) sio.observe(s);
    });
  }

  /* -------------------------------------------------------------- reveals */
  var revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var d = el.getAttribute('data-reveal-delay');
        if (d) el.style.transitionDelay = d + 'ms';
        el.classList.add('in');
        rio.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { rio.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* split-text headings: wrap words for a staggered mask reveal */
  $$('.split').forEach(function (el) {
    if (reduced || !('IntersectionObserver' in window)) { el.classList.add('in'); return; }
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'w';
      var inner = document.createElement('i');
      inner.textContent = w;
      inner.style.transitionDelay = (i * 45) + 'ms';
      span.appendChild(inner);
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    onceVisible(el, function () { el.classList.add('in'); }, 0.2);
  });

  /* ------------------------------------------------------- hero field FX */
  (function heroField() {
    var cv = document.getElementById('hero-fx');
    if (!cv || reduced) return;
    var ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, nodes = [], pulses = [], raf = null, visible = true, px = 0, py = 0, tx = 0, ty = 0;

    function size() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      var count = clamp(Math.round((W * H) / 20000), 26, 76);
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.13,
          vy: (Math.random() - 0.5) * 0.13,
          r: Math.random() * 1.5 + 0.7,
          d: Math.random() * 0.6 + 0.4
        });
      }
      pulses = [];
    }

    function spawnPulse() {
      if (nodes.length < 2 || pulses.length > 7) return;
      var a = nodes[(Math.random() * nodes.length) | 0];
      var best = null, bd = 1e9;
      for (var i = 0; i < nodes.length; i++) {
        var b = nodes[i];
        if (b === a) continue;
        var d = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
        if (d < bd && d > 900) { bd = d; best = b; }
      }
      if (!best) return;
      pulses.push({ a: a, b: best, t: 0, s: 0.006 + Math.random() * 0.007 });
    }

    var LINK = 152, LINK2 = LINK * LINK;

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      px += (tx - px) * 0.04;
      py += (ty - py) * 0.04;

      ctx.clearRect(0, 0, W, H);

      var i, j, a, b, dx, dy, d2;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < -40) a.x = W + 40; else if (a.x > W + 40) a.x = -40;
        if (a.y < -40) a.y = H + 40; else if (a.y > H + 40) a.y = -40;
      }

      /* links */
      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j];
          dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy;
          if (d2 > LINK2) continue;
          var al = (1 - d2 / LINK2) * 0.14;
          ctx.strokeStyle = 'rgba(120,170,255,' + al.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x + px * a.d, a.y + py * a.d);
          ctx.lineTo(b.x + px * b.d, b.y + py * b.d);
          ctx.stroke();
        }
      }

      /* nodes */
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        ctx.fillStyle = 'rgba(196,226,255,' + (0.16 + a.d * 0.2).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(a.x + px * a.d, a.y + py * a.d, a.r, 0, 6.2832);
        ctx.fill();
      }

      /* travelling data pulses */
      for (i = pulses.length - 1; i >= 0; i--) {
        var p = pulses[i];
        p.t += p.s;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        var e = p.t < .5 ? 2 * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 2) / 2;
        var x = p.a.x + (p.b.x - p.a.x) * e + px * p.a.d;
        var y = p.a.y + (p.b.y - p.a.y) * e + py * p.a.d;
        var fade = Math.sin(p.t * Math.PI);

        ctx.strokeStyle = 'rgba(26,221,227,' + (0.28 * fade).toFixed(3) + ')';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.a.x + px * p.a.d, p.a.y + py * p.a.d);
        ctx.lineTo(x, y);
        ctx.stroke();

        var g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, 'rgba(26,221,227,' + (0.85 * fade).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(26,221,227,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.2832); ctx.fill();
        ctx.fillStyle = 'rgba(226,255,255,' + fade.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(x, y, 1.7, 0, 6.2832); ctx.fill();
      }
    }

    size();
    window.addEventListener('resize', function () {
      clearTimeout(cv._t);
      cv._t = setTimeout(size, 220);
    }, { passive: true });

    var pulseTimer = setInterval(function () { if (visible) spawnPulse(); }, 900);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0 })
        .observe(cv);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      else if (!raf) frame();
    });

    if (fine) {
      var host = cv.parentElement;
      host.addEventListener('pointermove', function (e) {
        var r = host.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 26;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 20;
      }, { passive: true });
      host.addEventListener('pointerleave', function () { tx = 0; ty = 0; });
    }

    frame();
    window.addEventListener('pagehide', function () { clearInterval(pulseTimer); if (raf) cancelAnimationFrame(raf); });
  })();

  /* -------------------------------------------------- kinetic word swapper */
  $$('.swap').forEach(function (el) {
    var items = $$('i', el);
    if (!items.length) return;
    var i = 0;
    items[0].classList.add('on');
    el.setAttribute('data-w', items.reduce(function (a, b) {
      return b.textContent.length > a.length ? b.textContent : a;
    }, ''));
    if (reduced || items.length < 2) return;
    setInterval(function () {
      items[i].classList.remove('on');
      i = (i + 1) % items.length;
      items[i].classList.add('on');
    }, 2600);
  });

  /* ------------------------------------------------------------- devices */
  /* A device is a phone whose .scr children are shown one at a time.
     Showing a screen replays its bar fills, gauges and number count-ups.  */
  function initDevice(root, opts) {
    opts = opts || {};
    var screens = $$('.scr', root);
    if (!screens.length) return null;
    var shell = $('.phone-screen', root) || root;
    var current = -1, timer = null;

    function play(scr) {
      $$('.scr-fill,[data-w]', scr).forEach(function (f) {
        var w = f.getAttribute('data-w');
        if (w === null) return;
        f.style.width = '0%';
        /* force reflow so the transition replays */
        void f.offsetWidth;
        f.style.width = w + '%';
      });
      $$('.gauge .prog', scr).forEach(function (c) {
        var pct = parseFloat(c.getAttribute('data-pct') || '0');
        c.style.strokeDashoffset = '201';
        void c.getBoundingClientRect();
        c.style.strokeDashoffset = String(201 * (1 - pct / 100));
      });
      runCounts(scr);
    }

    function show(i, force) {
      i = ((i % screens.length) + screens.length) % screens.length;
      if (i === current && !force) return;
      current = i;
      screens.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      var bloom = screens[i].getAttribute('data-bloom');
      if (bloom) shell.style.setProperty('--scr-bloom', bloom);
      play(screens[i]);
    }

    function auto(on) {
      clearInterval(timer);
      if (on && !reduced && screens.length > 1) {
        timer = setInterval(function () { show(current + 1); }, opts.interval || 4600);
      }
    }

    var started = false;
    onceVisible(root, function () {
      started = true;
      show(opts.start || 0, true);
      if (opts.auto) auto(true);
    }, 0.3);

    /* pause the carousel while the tab is hidden */
    document.addEventListener('visibilitychange', function () {
      if (!started || !opts.auto) return;
      auto(!document.hidden);
    });

    return { show: show, auto: auto, count: screens.length };
  }

  var heroDevice = initDevice($('#hero-device'), { auto: true, interval: 4600 });
  var tourDevice = initDevice($('#tour-device'), { auto: false });

  /* gentle pointer tilt on any phone */
  if (!reduced && fine) {
    $$('.phone-stage').forEach(function (stage) {
      var ph = $('.phone', stage);
      if (!ph) return;
      stage.addEventListener('pointermove', function (e) {
        var r = stage.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        ph.style.transform = 'rotateY(' + (x * 8).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg) translateZ(0)';
      }, { passive: true });
      stage.addEventListener('pointerleave', function () { ph.style.transform = ''; });
    });
  }

  /* --------------------------------------------------- tour scrollytelling */
  (function tour() {
    var panels = $$('.tour-panel');
    if (!panels.length) return;

    function activate(idx) {
      panels.forEach(function (p, i) { p.classList.toggle('active', i === idx); });
      if (tourDevice) tourDevice.show(idx);
    }

    if (!('IntersectionObserver' in window)) { activate(0); return; }

    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) activate(panels.indexOf(en.target));
      });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    panels.forEach(function (p) { tio.observe(p); });
    activate(0);
  })();

  /* ---------------------------------------------- SA provisional tax clock */
  (function taxYear() {
    var host = $('#tl');
    if (!host) return;

    var now = new Date();
    var y = now.getMonth() >= 2 ? now.getFullYear() : now.getFullYear() - 1; /* tax year opens 1 March */
    var d = function (yy, mm, dd) { return new Date(yy, mm, dd, 0, 0, 0, 0); };
    var lastFeb = new Date(y + 1, 2, 0).getDate(); /* 28 or 29 */

    var marks = [
      { t: d(y, 2, 1), label: '1 Mar', note: 'Tax year opens' },
      { t: d(y, 7, 31), label: '31 Aug', note: 'IRP6 Period 1 due' },
      { t: d(y + 1, 1, lastFeb), label: lastFeb + ' Feb', note: 'IRP6 Period 2 due' },
      { t: d(y + 1, 8, 30), label: '30 Sep', note: 'Voluntary top-up' }
    ];
    var start = marks[0].t.getTime();
    var end = marks[marks.length - 1].t.getTime();
    var span = end - start;
    var pos = function (t) { return clamp(((t - start) / span) * 100, 0, 100); };

    var next = null;
    for (var i = 1; i < marks.length; i++) {
      if (marks[i].t.getTime() >= now.getTime()) { next = marks[i]; break; }
    }
    if (!next) next = marks[1];

    /* label + year string */
    var yrEl = $('#tl-year');
    if (yrEl) yrEl.textContent = y + '/' + String((y + 1) % 100).padStart(2, '0');

    /* build desktop marks + mobile list */
    var marksHost = $('#tl-marks'), listHost = $('#tl-list');
    marks.forEach(function (m) {
      var past = m.t.getTime() < now.getTime();
      var isNext = m === next;
      var cls = past ? 'past' : ''; if (isNext) cls = 'next';

      if (marksHost) {
        var el = document.createElement('div');
        el.className = 'tl-mark ' + cls;
        el.style.left = pos(m.t.getTime()) + '%';
        el.innerHTML = '<i></i><b>' + m.label + '</b><span>' + m.note + '</span>';
        marksHost.appendChild(el);
      }
      if (listHost) {
        var li = document.createElement('div');
        li.className = 'tl-li ' + cls;
        li.innerHTML = '<i></i><div><b>' + m.label + '</b><span>' + m.note + '</span></div>';
        listHost.appendChild(li);
      }
    });

    var todayPct = pos(now.getTime());
    var days = Math.max(0, Math.ceil((next.t.getTime() - now.getTime()) / 86400000));

    /* render the real figure up front so it is never wrong if the reveal never fires */
    var daysEl = $('#tl-days');
    if (daysEl) daysEl.textContent = String(days);

    onceVisible(host, function () {
      host.classList.add('in');
      var wrap = host.closest('.timeline-wrap');
      if (wrap) wrap.style.setProperty('--tl-x', todayPct + '%');
      var prog = $('#tl-prog'), nowEl = $('#tl-now');
      if (prog) prog.style.width = todayPct + '%';
      if (nowEl) nowEl.style.left = todayPct + '%';
      if (daysEl && !reduced) { daysEl.textContent = '0'; countUp(daysEl, days, 1500); }
    }, 0.25);

    var lbl = $('#tl-next-label');
    if (lbl) lbl.textContent = 'days to ' + next.label + ' · ' + next.note;
  })();

  /* ------------------------------------------------- deduction waterfall  */
  (function waterfall() {
    var wf = $('#wf');
    if (!wf) return;

    var GROSS = 862000;
    var SET = {
      planned: {
        rows: { ret: 180000, home: 38400, travel: 41200, gear: 22800, taxable: 579600, tax: 145523 - 17235, cred: 8736 },
        due: 119552, saved: 107416, rate: 13.9
      },
      unplanned: {
        rows: { ret: 0, home: 0, travel: 0, gear: 0, taxable: 862000, tax: 252939 - 17235, cred: 8736 },
        due: 226968, saved: 0, rate: 26.3
      }
    };

    function paint(key, animate) {
      var s = SET[key];
      Object.keys(s.rows).forEach(function (k) {
        var row = $('[data-wf="' + k + '"]', wf);
        if (!row) return;
        var val = s.rows[k];
        var bar = $('.wf-bar i', row);
        var num = $('.wf-val', row);
        if (bar) bar.style.width = clamp((val / GROSS) * 100, 0, 100) + '%';
        if (num) {
          if (animate) {
            num.setAttribute('data-from', String(parseFloat(num.getAttribute('data-cur') || '0')));
            countUp(num, val, 900, (val ? (row.getAttribute('data-sign') || '') : '') + 'R ');
          } else {
            num.textContent = (val ? (row.getAttribute('data-sign') || '') : '') + 'R ' + zar(val);
          }
          num.setAttribute('data-cur', String(val));
        }
      });

      var dueRow = $('[data-wf="due"]', wf);
      if (dueRow) {
        var dBar = $('.wf-bar i', dueRow), dNum = $('.wf-val', dueRow);
        if (dBar) dBar.style.width = ((s.due / GROSS) * 100) + '%';
        if (dNum) {
          if (animate) {
            dNum.setAttribute('data-from', String(parseFloat(dNum.getAttribute('data-cur') || '0')));
            countUp(dNum, s.due, 1000, 'R ');
          } else { dNum.textContent = 'R ' + zar(s.due); }
          dNum.setAttribute('data-cur', String(s.due));
        }
      }

      var savedEl = $('#wf-saved'), rateEl = $('#wf-rate');
      if (savedEl) {
        if (animate) {
          savedEl.setAttribute('data-from', String(parseFloat(savedEl.getAttribute('data-cur') || '0')));
          countUp(savedEl, s.saved, 1000, 'R ');
        } else { savedEl.textContent = 'R ' + zar(s.saved); }
        savedEl.setAttribute('data-cur', String(s.saved));
      }
      if (rateEl) {
        if (animate) {
          rateEl.setAttribute('data-from', String(parseFloat(rateEl.getAttribute('data-cur') || '0')));
          countUp(rateEl, s.rate, 1000, '', '%', 1);
        } else { rateEl.textContent = s.rate.toFixed(1) + '%'; }
        rateEl.setAttribute('data-cur', String(s.rate));
      }
    }

    $$('.wf-toggle button', wf.closest('section') || document).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.wf-toggle button').forEach(function (o) { o.classList.remove('on'); });
        b.classList.add('on');
        paint(b.getAttribute('data-set'), true);
      });
    });

    /* start blank, then run the "planned" scenario when it scrolls into view */
    paint('planned', false);
    $$('.wf-bar i', wf).forEach(function (b) { b.dataset.target = b.style.width; b.style.width = '0%'; });
    $$('.wf-val', wf).forEach(function (n) { n.setAttribute('data-cur', '0'); });

    onceVisible(wf, function () {
      $$('.wf-bar i', wf).forEach(function (b, i) {
        setTimeout(function () { b.style.width = b.dataset.target; }, reduced ? 0 : i * 90);
      });
      paint('planned', true);
    }, 0.2);
  })();

  /* ------------------------------------------------------ cursor spotlight */
  if (fine && !reduced) {
    var spot = $$('.card, .feat, .outcome-card');
    var pending = false, queue = [];
    spot.forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        queue.push([el, e.clientX, e.clientY]);
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () {
          queue.forEach(function (q) {
            var r = q[0].getBoundingClientRect();
            q[0].style.setProperty('--mx', ((q[1] - r.left) / r.width * 100).toFixed(1) + '%');
            q[0].style.setProperty('--my', ((q[2] - r.top) / r.height * 100).toFixed(1) + '%');
          });
          queue = []; pending = false;
        });
      }, { passive: true });
    });
  }

  /* --------------------------------------------------------- shield reveal */
  onceVisible($('.shield-stage'), function () {
    var s = $('.shield-stage');
    if (s) s.classList.add('in');
  }, 0.35);

  /* --------------------------------------------------- generic stat counts */
  $$('[data-count-group]').forEach(function (g) {
    onceVisible(g, function () { runCounts(g); }, 0.3);
  });

  /* ---------------------------------------------------- calculator modal  */
  var modal = $('#calc-modal');
  var frame = $('#calc-frame');
  var lastFocus = null, currentCalc = '', dark = false;

  window.openCalcModal = function (ev, key, title) {
    if (ev) ev.preventDefault();
    if (!modal || !frame) return;
    lastFocus = document.activeElement;
    currentCalc = key; dark = true;
    var t = $('#calc-modal-title');
    if (t) t.textContent = title;
    frame.src = 'calculators/' + key + '-dark.html';
    setThemeLabel();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var c = $('#calc-close'); if (c) c.focus();
  };
  window.closeCalcModal = function () {
    if (!modal) return;
    modal.classList.remove('open');
    frame.src = '';
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  window.toggleCalcTheme = function () {
    dark = !dark;
    frame.src = 'calculators/' + currentCalc + '-' + (dark ? 'dark' : 'light') + '.html';
    setThemeLabel();
  };
  function setThemeLabel() {
    var l = $('#calc-theme-label');
    if (l) l.textContent = dark ? 'Light mode' : 'Dark mode';
    if (modal) modal.classList.toggle('calc-light', !dark);
  }
  if (modal) {
    var bd = $('.modal-backdrop', modal);
    if (bd) bd.addEventListener('click', window.closeCalcModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) window.closeCalcModal();
      if (e.key === 'Tab' && modal.classList.contains('open')) {
        /* keep focus inside the sheet */
        var f = $$('button, iframe, [href], input', modal).filter(function (n) { return n.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* --------------------------------------------------------- waitlist form */
  var wl = $('#waitlist-form');
  if (wl) {
    wl.addEventListener('submit', function (e) {
      if (!window.fetch) return;
      e.preventDefault();
      var btn = wl.querySelector('button');
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(wl.action, {
        method: 'POST',
        body: new FormData(wl),
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (!r.ok) throw new Error('bad response');
        wl.style.display = 'none';
        var note = $('.wl-note'); if (note) note.style.display = 'none';
        var ok = $('#wl-success'); if (ok) ok.style.display = 'flex';
      }).catch(function () {
        btn.disabled = false; btn.textContent = label;
        wl.submit();
      });
    });
  }

  /* ------------------------------------------------------------- guide TOC */
  var toc = $('.toc');
  if (toc && 'IntersectionObserver' in window) {
    var tlinks = $$('a', toc);
    var tmap = {};
    tlinks.forEach(function (a) { tmap[a.getAttribute('href').slice(1)] = a; });
    var gio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tlinks.forEach(function (a) { a.classList.remove('active'); });
          if (tmap[en.target.id]) tmap[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.guide-sec[id]').forEach(function (s) { gio.observe(s); });
  }

  /* --------------------------------------------------------- ticker clone */
  $$('.ticker-track').forEach(function (t) {
    t.innerHTML += t.innerHTML; /* seamless 50% marquee loop */
  });

  /* react to a live change of the motion preference */
  if (mqReduce.addEventListener) {
    mqReduce.addEventListener('change', function (e) { reduced = e.matches; });
  }
})();
