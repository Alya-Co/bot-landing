/* Tinker — чат-виджет для сайта. Один файл для RU / ES / EN.
   Собирает заявку и отправляет её в Worker (/lead) → группа менеджеров в Telegram. */
(function () {
  'use strict';
  var ENDPOINT = 'https://tinkerbot.experthomespain.workers.dev/lead';
  var TG = 'https://t.me/tinker_chatbots_bot';

  var L = {
    ru: {
      name: 'Tinker', open: 'Открыть чат', close: 'Закрыть чат', send: 'Отправить', hint: 'Чат Tinker',
      start: 'Здравствуйте! Я бот Tinker. Такого же можно сделать для вашего бизнеса. Что интересует?',
      price: 'Бот с ответами на вопросы: €150–400. Запись и напоминания: €300–700. ИИ и CRM: €700–2000. Точную цену назовём после короткого разговора о вашем бизнесе.',
      speed: 'Обычно 3–5 рабочих дней. Простой бот может быть готов от 3 рабочих дней.',
      biz: 'Чем занимается ваш бизнес? Пара слов.', bizPh: 'Например: салон красоты в Торревьехе',
      task: 'Что должен делать бот?', channel: 'Где его запустить?',
      contact: 'Как с вами связаться? Напишите имя и Telegram, WhatsApp или email.', contactPh: 'Имя и контакт',
      sending: 'Отправляю…', done: 'Спасибо! Заявка у нас. Ответим в течение рабочего дня.',
      fail: 'Не получилось отправить. Напишите нам в Telegram, ответим там.', tooShort: 'Напишите хотя бы пару символов.',
      tg: 'Написать в Telegram',
      o_price: 'Сколько это стоит', o_speed: 'Как быстро сделаете', o_lead: 'Оставить заявку',
      tasks: { booking: 'Запись на время', quote: 'Заявки и смета', faq: 'Ответы на вопросы', other: 'Другое' },
      channels: { wa: 'WhatsApp', tg: 'Telegram', site: 'Сайт', unk: 'Пока не знаю' },
    },
    es: {
      name: 'Tinker', open: 'Abrir chat', close: 'Cerrar chat', send: 'Enviar', hint: 'Chat de Tinker',
      start: '¡Hola! Soy el bot de Tinker. Se puede hacer uno igual para tu negocio. ¿Qué te interesa?',
      price: 'Bot con respuestas a preguntas: 150–400 €. Reservas y recordatorios: 300–700 €. IA y CRM: 700–2000 €. El precio exacto te lo damos tras una conversación breve sobre tu negocio.',
      speed: 'Normalmente de 3 a 5 días laborables. Un bot sencillo puede estar listo desde 3 días laborables.',
      biz: '¿A qué se dedica tu negocio? Con un par de palabras basta.', bizPh: 'Por ejemplo: peluquería en Torrevieja',
      task: '¿Qué tiene que hacer el bot?', channel: '¿Dónde lo ponemos en marcha?',
      contact: '¿Cómo te contactamos? Escribe tu nombre y Telegram, WhatsApp o email.', contactPh: 'Nombre y contacto',
      sending: 'Enviando…', done: '¡Gracias! Hemos recibido tu solicitud. Te respondemos en un día laborable.',
      fail: 'No se ha podido enviar. Escríbenos por Telegram y te respondemos allí.', tooShort: 'Escribe al menos un par de caracteres.',
      tg: 'Escribir por Telegram',
      o_price: 'Cuánto cuesta', o_speed: 'En cuánto tiempo lo hacen', o_lead: 'Dejar una solicitud',
      tasks: { booking: 'Reserva de citas', quote: 'Solicitudes y presupuesto', faq: 'Respuestas a preguntas', other: 'Otra cosa' },
      channels: { wa: 'WhatsApp', tg: 'Telegram', site: 'Web', unk: 'Aún no lo sé' },
    },
    en: {
      name: 'Tinker', open: 'Open chat', close: 'Close chat', send: 'Send', hint: 'Tinker chat',
      start: 'Hi! I’m the Tinker bot. We can build one like me for your business. What would you like to know?',
      price: 'Bot that answers questions: €150–400. Booking and reminders: €300–700. AI and CRM: €700–2000. We’ll give an exact price after a short chat about your business.',
      speed: 'Usually 3–5 working days. A simple bot can be ready from 3 working days.',
      biz: 'What does your business do? A few words is enough.', bizPh: 'For example: hair salon in Torrevieja',
      task: 'What should the bot do?', channel: 'Where should it run?',
      contact: 'How can we reach you? Write your name and Telegram, WhatsApp or email.', contactPh: 'Name and contact',
      sending: 'Sending…', done: 'Thank you! We’ve got your request and will reply within one working day.',
      fail: 'Couldn’t send it. Message us on Telegram and we’ll answer there.', tooShort: 'Please write at least a couple of characters.',
      tg: 'Message us on Telegram',
      o_price: 'How much does it cost', o_speed: 'How fast can you do it', o_lead: 'Leave a request',
      tasks: { booking: 'Appointment booking', quote: 'Enquiries and quotes', faq: 'Answering questions', other: 'Something else' },
      channels: { wa: 'WhatsApp', tg: 'Telegram', site: 'Website', unk: 'Not sure yet' },
    },
  };

  function pageLang() {
    var l = (document.documentElement.lang || 'ru').slice(0, 2).toLowerCase();
    return L[l] ? l : 'ru';
  }
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  var css = [
    '#tk-w{position:fixed;right:20px;bottom:20px;z-index:2147483000;font-family:"Onest",system-ui,-apple-system,"Segoe UI",sans-serif;color:#111;font-size:14px;line-height:1.45}',
    '#tk-w *{box-sizing:border-box}',
    '#tk-launch{position:relative;width:56px;height:56px;border-radius:50%;border:0;background:#111;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.22);margin-left:auto}',
    '#tk-launch:focus-visible,#tk-w button:focus-visible,#tk-w input:focus-visible{outline:3px solid #A4E606;outline-offset:2px}',
    '#tk-launch i{position:absolute;top:10px;right:10px;width:10px;height:10px;border-radius:50%;background:#A4E606;border:2px solid #111}',
    '#tk-panel{display:none;width:340px;max-width:calc(100vw - 32px);max-height:min(560px,calc(100vh - 100px));background:#fff;border:1px solid #E4E3DE;border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,.2);overflow:hidden;flex-direction:column;margin-bottom:12px}',
    '#tk-w.tk-open #tk-panel{display:flex}',
    '#tk-w.tk-open #tk-launch{display:none}',
    '.tk-head{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid #E4E3DE;background:#F7F6F3}',
    '.tk-title{font-weight:700;font-size:15px;letter-spacing:-.01em;flex:1}',
    '.tk-title b{display:inline-block;width:8px;height:8px;border-radius:50%;background:#A4E606;margin-right:7px}',
    '.tk-lang{display:flex;gap:2px}',
    '.tk-lang button{border:0;background:transparent;font:inherit;font-size:12px;font-weight:600;color:#62625D;padding:5px 7px;border-radius:6px;cursor:pointer}',
    '.tk-lang button[aria-pressed="true"]{background:#111;color:#fff}',
    '.tk-x{border:0;background:transparent;cursor:pointer;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center}',
    '.tk-log{padding:14px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;flex:1;min-height:120px}',
    '.tk-m{max-width:88%;padding:9px 12px;border-radius:12px;white-space:pre-wrap;word-wrap:break-word}',
    '.tk-b{background:#F2F1EC;border-bottom-left-radius:4px;align-self:flex-start}',
    '.tk-u{background:#111;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}',
    '.tk-ctl{padding:10px 14px 14px;border-top:1px solid #E4E3DE;display:flex;flex-direction:column;gap:6px}',
    '.tk-opt{border:1px solid #CFCFC8;background:#fff;border-radius:10px;padding:10px 12px;text-align:left;font:inherit;cursor:pointer;min-height:40px}',
    '.tk-opt:hover{border-color:#111}',
    '.tk-row{display:flex;gap:6px}',
    '.tk-row input{flex:1;min-width:0;border:1px solid #CFCFC8;border-radius:10px;padding:10px 12px;font:inherit;font-size:16px}',
    '.tk-go{border:0;background:#111;color:#fff;border-radius:10px;padding:0 14px;font:inherit;font-weight:600;cursor:pointer;min-height:40px}',
    '.tk-go[disabled]{opacity:.5;cursor:default}',
    '.tk-link{display:block;text-align:center;background:#111;color:#fff;text-decoration:none;border-radius:10px;padding:11px 12px;font-weight:600}',
    '.tk-err{color:#B3261E;font-size:12px;min-height:0}',
    '@media (max-width:480px){#tk-w{right:12px;bottom:12px}#tk-panel{width:calc(100vw - 24px)}}',
    '@media (prefers-reduced-motion:no-preference){#tk-panel{animation:tkin .18s ease-out}@keyframes tkin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}',
  ].join('');

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'on') for (var e in attrs.on) n.addEventListener(e, attrs.on[e]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  var lang = pageLang(), state, root, panel, log, ctl, launch, langBox;

  function reset() { state = { step: 'start', lead: {}, msgs: [] }; }
  function t() { return L[lang]; }
  function say(from, text) { state.msgs.push({ from: from, text: text }); }

  function render() {
    var T = t();
    langBox.innerHTML = '';
    ['en', 'es', 'ru'].forEach(function (c) {
      langBox.appendChild(el('button', { type: 'button', 'aria-pressed': String(c === lang), text: c.toUpperCase(), on: { click: function () { lang = c; var keep = state.step; reset(); state.step = 'start'; say('b', t().start); render(); } } }));
    });
    launch.setAttribute('aria-label', T.open);
    panel.setAttribute('aria-label', T.hint);
    panel.querySelector('.tk-x').setAttribute('aria-label', T.close);
    log.innerHTML = '';
    state.msgs.forEach(function (m) { log.appendChild(el('div', { class: 'tk-m ' + (m.from === 'b' ? 'tk-b' : 'tk-u'), text: m.text })); });
    log.scrollTop = log.scrollHeight;
    ctl.innerHTML = '';
    var s = state.step;
    function opt(label, fn) { ctl.appendChild(el('button', { type: 'button', class: 'tk-opt', text: label, on: { click: fn } })); }
    if (s === 'start' || s === 'price' || s === 'speed') {
      if (s !== 'price') opt(T.o_price, function () { say('u', T.o_price); say('b', T.price); state.step = 'price'; render(); });
      if (s !== 'speed') opt(T.o_speed, function () { say('u', T.o_speed); say('b', T.speed); state.step = 'speed'; render(); });
      opt(T.o_lead, function () { say('u', T.o_lead); say('b', T.biz); state.step = 'biz'; render(); focusInput(); });
    } else if (s === 'biz' || s === 'contact') {
      var input = el('input', { type: 'text', maxlength: s === 'biz' ? '300' : '200', placeholder: s === 'biz' ? T.bizPh : T.contactPh, 'aria-label': s === 'biz' ? T.biz : T.contact, autocomplete: s === 'contact' ? 'name' : 'off' });
      var err = el('div', { class: 'tk-err', role: 'alert' });
      var go = el('button', { type: 'button', class: 'tk-go', text: T.send });
      function submit() {
        var v = input.value.trim();
        if (v.length < (s === 'biz' ? 2 : 3)) { err.textContent = T.tooShort; return; }
        say('u', v);
        if (s === 'biz') { state.lead.biz = v; say('b', T.task); state.step = 'task'; render(); }
        else { state.lead.contact = v; finish(); }
      }
      go.addEventListener('click', submit);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
      ctl.appendChild(el('div', { class: 'tk-row' }, [input, go]));
      ctl.appendChild(err);
    } else if (s === 'task') {
      Object.keys(T.tasks).forEach(function (k) { opt(T.tasks[k], function () { state.lead.task = k; say('u', T.tasks[k]); say('b', T.channel); state.step = 'channel'; render(); }); });
    } else if (s === 'channel') {
      Object.keys(T.channels).forEach(function (k) { opt(T.channels[k], function () { state.lead.channel = k; say('u', T.channels[k]); say('b', T.contact); state.step = 'contact'; render(); focusInput(); }); });
    } else if (s === 'sending') {
      ctl.appendChild(el('div', { text: T.sending }));
    } else if (s === 'done' || s === 'fail') {
      ctl.appendChild(el('a', { class: 'tk-link', href: TG + '?start=site_' + lang, target: '_blank', rel: 'noopener', text: T.tg }));
    }
  }
  function focusInput() { setTimeout(function () { var i = ctl.querySelector('input'); if (i) i.focus(); }, 30); }

  function finish() {
    state.step = 'sending'; say('b', t().sending); render();
    var body = { lang: lang, biz: state.lead.biz, task: state.lead.task, channel: state.lead.channel, contact: state.lead.contact, page: location.pathname, hp: '' };
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
    fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j.ok; }); })
      .catch(function () { return false; })
      .then(function (ok) {
        clearTimeout(timer);
        state.msgs.pop(); // убираем «Отправляю…»
        say('b', ok ? t().done : t().fail);
        state.step = ok ? 'done' : 'fail';
        render();
      });
  }

  function setOpen(v) {
    root.classList.toggle('tk-open', v);
    store('tk-closed', v ? '0' : '1');
    if (v) { var f = panel.querySelector('input, .tk-opt, .tk-link'); if (f) f.focus(); } else launch.focus();
  }

  function init() {
    if (document.getElementById('tk-w')) return;
    var style = el('style'); style.textContent = css; document.head.appendChild(style);
    reset(); say('b', t().start);
    launch = el('button', { type: 'button', id: 'tk-launch', on: { click: function () { setOpen(true); } } }, [el('i')]);
    launch.insertAdjacentHTML('afterbegin', '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>');
    langBox = el('div', { class: 'tk-lang', role: 'group' });
    var x = el('button', { type: 'button', class: 'tk-x', on: { click: function () { setOpen(false); } } });
    x.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#62625D" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    log = el('div', { class: 'tk-log', role: 'log', 'aria-live': 'polite' });
    ctl = el('div', { class: 'tk-ctl' });
    var title = el('div', { class: 'tk-title' }, [el('b'), document.createTextNode('Tinker')]);
    panel = el('div', { id: 'tk-panel', role: 'dialog' }, [el('div', { class: 'tk-head' }, [title, langBox, x]), log, ctl]);
    root = el('div', { id: 'tk-w' }, [panel, launch]);
    root.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    document.body.appendChild(root);
    render();
    // автооткрытие один раз за визит, только на широком экране
    if (store('tk-closed') === null && window.innerWidth > 700) {
      setTimeout(function () { if (store('tk-closed') === null && !root.classList.contains('tk-open')) { root.classList.add('tk-open'); } }, 8000);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
