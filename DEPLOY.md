# Инструкция по развертыванию (Deployment Guide)

Этот проект представляет собой MVP сайта для аренды товаров, созданный на Next.js 15+, Supabase и Telegram Bot API.

## 1. Настройка Supabase

1. Создайте новый проект на [supabase.com](https://supabase.com).
2. Перейдите в раздел **SQL Editor**.
3. Скопируйте и выполните содержимое файла `supabase/schema.sql` для создания таблиц.
4. Скопируйте и выполните содержимое файла `supabase/rls.sql` для настройки безопасности данных.
5. (Опционально) Выполните `supabase/seed.sql` для наполнения базы тестовыми данными.
6. В разделе **Settings -> API** найдите `Project URL` и `Anon Key`. Они понадобятся для переменных окружения.

## 2. Настройка Telegram Бота

1. Найдите [@BotFather](https://t.me/BotFather) в Telegram.
2. Создайте нового бота командой `/newbot` и получите `API Token`.
3. Узнайте свой `Chat ID` (можно использовать ботов вроде [@userinfobot](https://t.me/userinfobot)).
4. Эти данные понадобятся для уведомлений менеджера.

## 3. Переменные окружения (.env.local)

Создайте файл `.env.local` в корне проекта и заполните его:

```env
# Supabase (доступны на клиенте)
NEXT_PUBLIC_SUPABASE_URL=ваш_url_проекта
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key

# Telegram (только на сервере)
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_CHAT_ID=ваш_id_чата
```

## 4. Локальный запуск

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите проект:
   ```bash
   npm run dev
   ```
3. Откройте [http://localhost:3000](http://localhost:3000).

## 5. Деплой на Vercel

1. Загрузите код в репозиторий GitHub.
2. Подключите репозиторий к [Vercel](https://vercel.com).
3. Добавьте переменные окружения, указанные в пункте 3, в настройках проекта Vercel.
4. Нажмите **Deploy**.

## Архитектура
- **Frontend**: Next.js (App Router), Tailwind CSS, Lucide Icons.
- **Backend**: Next.js API Routes (Route Handlers).
- **Database/Auth**: Supabase.
- **Notifications**: Telegram Bot API.
