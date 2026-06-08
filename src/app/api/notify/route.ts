import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId, productName, startDate, endDate, duration, totalPrice, depositAmount, clientName, clientPhone } = await req.json();

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Telegram credentials missing');
      return NextResponse.json({ success: false, error: 'Config missing' }, { status: 500 });
    }

    const text = `📦 *Новая заявка на аренду № ${orderId}*
*Товар:* ${productName}
*Период:* ${startDate} — ${endDate} (${duration} суток)
*Финансы:* Аренда ${totalPrice} ₽ / Залог ${depositAmount} ₽
*Клиент:* ${clientName}, ${clientPhone}
*Ссылка:* /admin/orders/${orderId}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
