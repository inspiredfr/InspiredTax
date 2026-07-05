/* InspiredTax Africa — shared behaviour */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav elevate on scroll */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* mobile slide-in panel */
  var burger = document.getElementById('nav-burger');
  var panel = document.getElementById('nav-panel');
  if (burger && panel) {
    burger.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { panel.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* scroll reveal with sibling stagger */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var d = el.getAttribute('data-reveal-delay');
          if (d) el.style.transitionDelay = d + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* phone: count-up + bar fills + gentle pointer tilt */
  var phone = document.querySelector('.phone');
  var amount = document.getElementById('ps-amount-num');
  if (phone) {
    var animatePhone = function () {
      document.querySelectorAll('.ps-fill').forEach(function (f) {
        f.style.width = f.getAttribute('data-w') + '%';
      });
      if (amount && !reduced) {
        var target = 71272, t0 = null;
        var step = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1400, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          amount.textContent = 'R ' + Math.round(target * eased).toLocaleString('en-ZA');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      } else if (amount) {
        amount.textContent = 'R 71,272';
      }
    };
    if ('IntersectionObserver' in window) {
      var pio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { animatePhone(); pio.disconnect(); }
      }, { threshold: 0.35 });
      pio.observe(phone);
    } else { animatePhone(); }

    if (!reduced && window.matchMedia('(pointer: fine)').matches) {
      var stage = document.querySelector('.phone-stage');
      stage.addEventListener('pointermove', function (e) {
        var r = stage.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        phone.style.transform = 'rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg)';
      });
      stage.addEventListener('pointerleave', function () { phone.style.transform = ''; });
    }
  }

  /* calculator modal */
  var modal = document.getElementById('calc-modal');
  var frame = document.getElementById('calc-frame');
  var lastFocus = null, currentCalc = '', dark = false;
  window.openCalcModal = function (ev, key, title) {
    if (ev) ev.preventDefault();
    lastFocus = document.activeElement;
    currentCalc = key; dark = false;
    document.getElementById('calc-modal-title').textContent = title;
    frame.src = 'calculators/' + key + '-light.html';
    setThemeLabel();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('calc-close').focus();
  };
  window.closeCalcModal = function () {
    modal.classList.remove('open');
    frame.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };
  window.toggleCalcTheme = function () {
    dark = !dark;
    frame.src = 'calculators/' + currentCalc + '-' + (dark ? 'dark' : 'light') + '.html';
    setThemeLabel();
  };
  function setThemeLabel() {
    var l = document.getElementById('calc-theme-label');
    if (l) l.textContent = dark ? 'Light mode' : 'Dark mode';
  }
  if (modal) {
    modal.querySelector('.modal-backdrop').addEventListener('click', window.closeCalcModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) window.closeCalcModal();
    });
  }

  /* waitlist form (Formspree) */
  var wl = document.getElementById('waitlist-form');
  if (wl) {
    wl.addEventListener('submit', function (e) {
      if (!window.fetch) return; /* fall back to normal POST */
      e.preventDefault();
      var btn = wl.querySelector('button');
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(wl.action, {
        method: 'POST',
        body: new FormData(wl),
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (r.ok) {
          wl.style.display = 'none';
          document.getElementById('wl-success').style.display = 'flex';
        } else { throw new Error(); }
      }).catch(function () {
        btn.disabled = false; btn.textContent = 'Notify me';
        wl.submit();
      });
    });
  }

  /* guide TOC active state */
  var toc = document.querySelector('.toc');
  if (toc && 'IntersectionObserver' in window) {
    var links = toc.querySelectorAll('a');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('active'); });
          if (map[en.target.id]) map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('.guide-sec[id]').forEach(function (s) { tio.observe(s); });
  }
})();
