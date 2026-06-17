// CF Pages Function — POST /submit -> Telegram (личный чат владельца)
// Секреты TG_TOKEN и TG_CHAT задаются в настройках Pages-проекта (не в коде).
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const data = await request.json();
    // honeypot: боты заполняют скрытое поле website
    if (data.website) return json({ ok: true });

    const name    = String(data.name    || '').slice(0, 120).trim();
    const contact = String(data.contact || '').slice(0, 160).trim();
    const message = String(data.message || '').slice(0, 1200).trim();
    const lang    = String(data.lang    || '').slice(0, 5);

    if (!contact && !name) return json({ ok: false, error: 'empty' }, 400);
    if (!env.TG_TOKEN || !env.TG_CHAT) return json({ ok: false, error: 'not-configured' }, 500);

    const text =
      '🆕 Заявка с scanner.visaginas360.com\n' +
      '👤 Имя: ' + (name || '—') + '\n' +
      '📞 Контакт: ' + (contact || '—') + '\n' +
      '🌐 Язык: ' + (lang || '—') + '\n' +
      '📝 Задача: ' + (message || '—');

    const tg = await fetch('https://api.telegram.org/bot' + env.TG_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TG_CHAT, text })
    });
    const r = await tg.json();
    return json({ ok: !!r.ok });
  } catch (e) {
    return json({ ok: false, error: 'server' }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
