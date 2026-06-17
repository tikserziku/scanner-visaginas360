// форма заявки -> /submit -> Telegram. Общий для RU/EN/LT.
(function () {
  var lang = (document.documentElement.lang || 'ru').slice(0, 2);
  var dict = {
    ru: { sending: 'Отправляю…', ok: '✅ Заявка отправлена! Отвечу скоро.', err: '⚠️ Ошибка отправки. Напишите напрямую: visaginas360.com', need: 'Укажите контакт для связи' },
    en: { sending: 'Sending…', ok: '✅ Sent! I will reply soon.', err: '⚠️ Send error. Reach me at visaginas360.com', need: 'Please enter a contact' },
    lt: { sending: 'Siunčiama…', ok: '✅ Išsiųsta! Netrukus atsakysiu.', err: '⚠️ Siuntimo klaida. Rašykite: visaginas360.com', need: 'Įveskite kontaktą' }
  };
  var T = dict[lang] || dict.ru;

  var bg = document.getElementById('lead');
  if (!bg) return;
  var form = bg.querySelector('.lead-form');
  var status = bg.querySelector('.form-status');

  document.querySelectorAll('.js-lead-open').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); bg.classList.add('show'); });
  });
  bg.addEventListener('click', function (e) {
    if (e.target === bg || e.target.classList.contains('modal-close')) bg.classList.remove('show');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') bg.classList.remove('show'); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    if (data.website) return;            // honeypot
    if (!data.contact) { status.textContent = T.need; return; }
    data.lang = lang;
    status.textContent = T.sending;
    fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); })
      .then(function (j) { status.textContent = j.ok ? T.ok : T.err; if (j.ok) form.reset(); })
      .catch(function () { status.textContent = T.err; });
  });
})();
