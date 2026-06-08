-- Seed Categories
INSERT INTO categories (name, slug, icon) VALUES
('Инструменты', 'tools', 'tool'),
('Туризм', 'tourism', 'tent'),
('Транспорт', 'transport', 'bike'),
('Фото / Видео', 'photo-video', 'camera'),
('Развлечения', 'entertainment', 'device-gamepad');

-- Seed Products
-- Get category IDs first (this assumes fresh DB and these names exist)
INSERT INTO products (category_id, name, description, price_per_day, deposit_amount, is_popular, is_new)
SELECT id, 'Перфоратор Bosch GBH 2-26', 'Профессиональный перфоратор SDS-plus с мощностью 800 Вт. Подходит для сверления в бетоне, кирпиче, камне. Работает в трёх режимах: сверление, долбление, сверление с долблением.', 350, 3000, true, false
FROM categories WHERE slug = 'tools';

INSERT INTO products (category_id, name, description, price_per_day, deposit_amount, is_popular, is_new)
SELECT id, 'Палатка туристическая 4-местная', 'Просторная двухслойная палатка для комфортного отдыха на природе. Легко устанавливается, имеет отличную вентиляцию и защиту от дождя.', 500, 5000, false, false
FROM categories WHERE slug = 'tourism';

INSERT INTO products (category_id, name, description, price_per_day, deposit_amount, is_popular, is_new)
SELECT id, 'Зеркальная камера Sony A7 III', 'Полнокадровая беззеркальная камера с отличным автофокусом и качеством изображения. Идеальна для профессиональной фото и видеосъемки.', 1200, 15000, false, true
FROM categories WHERE slug = 'photo-video';

INSERT INTO products (category_id, name, description, price_per_day, deposit_amount, is_popular, is_new)
SELECT id, 'Велосипед горный', 'Надежный горный велосипед для поездок по пересеченной местности. Амортизационная вилка, 21 скорость, дисковые тормоза.', 400, 4000, false, false
FROM categories WHERE slug = 'transport';
