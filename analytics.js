/* Tinker — аналитика: Microsoft Clarity (посетители, тепловые карты, записи сессий).
   До согласия Clarity работает без cookies (каждый просмотр отдельно).
   После «Принять» — полноценный режим с cookies. Выбор хранится в localStorage. */
(function () {
  'use strict';
  var CLARITY_ID = 'zf1zld8xdx';
  var KEY = 'tk-consent';
  if (!CLARITY_ID || CLARITY_ID.indexOf('__') === 0) return;

  // 1. Загрузчик Clarity (официальный сниппет)
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function signal(v) {
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: v === 'yes' ? 'granted' : 'denied' });
  }

  var saved = get();
  if (saved) { signal(saved); return; }

  var T = {
    ru: { t: 'Мы используем Microsoft Clarity, чтобы понять, как посетители пользуются сайтом. Разрешите cookies для статистики?', y: 'Принять', n: 'Отклонить' },
    es: { t: 'Usamos Microsoft Clarity para entender cómo se usa la web. ¿Aceptas las cookies de estadística?', y: 'Aceptar', n: 'Rechazar' },
    en: { t: 'We use Microsoft Clarity to understand how visitors use this site. Allow statistics cookies?', y: 'Accept', n: 'Decline' },
  };
  var lang = (document.documentElement.lang || 'ru').slice(0, 2);
  var tx = T[lang] || T.ru;

  function show() {
    var css = document.createElement('style');
    css.textContent =
      '#tk-cc{position:fixed;left:20px;bottom:20px;z-index:2147482999;max-width:380px;background:#fff;color:#111;border:1px solid #E4E3DE;border-radius:14px;box-shadow:0 12px 32px rgba(0,0,0,.16);padding:14px 16px;font-family:"Onest",system-ui,sans-serif;font-size:14px;line-height:1.45}' +
      '#tk-cc p{margin:0 0 10px}' +
      '#tk-cc .r{display:flex;gap:8px}' +
      '#tk-cc button{font:inherit;font-weight:600;border-radius:10px;padding:9px 14px;cursor:pointer;min-height:40px}' +
      '#tk-cc .y{background:#111;color:#fff;border:0}' +
      '#tk-cc .n{background:#fff;color:#111;border:1px solid #CFCFC8}' +
      '#tk-cc button:focus-visible{outline:3px solid #A4E606;outline-offset:2px}' +
      '@media (max-width:480px){#tk-cc{left:12px;right:84px;bottom:12px;max-width:none;padding:12px}}';
    document.head.appendChild(css);
    var box = document.createElement('div');
    box.id = 'tk-cc'; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Cookies');
    var p = document.createElement('p'); p.textContent = tx.t;
    var r = document.createElement('div'); r.className = 'r';
    function btn(cls, label, v) {
      var b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = label;
      b.addEventListener('click', function () { set(v); signal(v); box.remove(); });
      return b;
    }
    r.appendChild(btn('y', tx.y, 'yes')); r.appendChild(btn('n', tx.n, 'no'));
    box.appendChild(p); box.appendChild(r);
    document.body.appendChild(box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();
