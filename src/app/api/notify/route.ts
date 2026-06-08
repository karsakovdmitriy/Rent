import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId, productName, startDate, endDate, duration, totalPrice, depositAmount, clientName, clientPhone } = await req.json();

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (!BOT_TOKEN || !CHAT_ID) {
      console.warn('Telegram credentials missing, skipping notification');
      return NextResponse.json({ success: false, error: 'Config missing' }, { status: 200 });
    }

    const text = `📦 *Новая заявка на аренду № ${orderId}*

*Товар:* ${productName}
*Период:* ${startDate} — ${endDate} (${duration} суток)
*Финансы:* Аренда ${totalPrice} ₽ / Залог ${depositAmount} ₽

*Клиент:* ${clientName}
*Телефон:* ${clientPhone}

[Открыть в админ-панели](${BASE_URL}/admin/orders)`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Notification error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
