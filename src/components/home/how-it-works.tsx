const steps = [
  {
    num: 1,
    title: 'Выберите товар',
    desc: 'Найдите нужное в каталоге, посмотрите фото и условия'
  },
  {
    num: 2,
    title: 'Укажите даты',
    desc: 'Выберите период аренды в календаре на карточке'
  },
  {
    num: 3,
    title: 'Оставьте заявку',
    desc: 'Войдите в аккаунт и подтвердите заказ'
  },
  {
    num: 4,
    title: 'Получите товар',
    desc: 'Менеджер свяжется и согласует детали доставки'
  }
];

export function HowItWorks() {
  return (
    <section className="px-5 py-8">
      <h2 className="text-[12px] uppercase tracking-wider text-gray-400 font-medium mb-4">Как это работает</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step) => (
          <div key={step.num} className="bg-gray-50 rounded-xl p-4 text-center border border-transparent hover:border-gray-100 transition-colors">
            <div className="w-7 h-7 bg-[#3C3489] text-[#EEEDFE] rounded-full flex items-center justify-center text-[13px] font-medium mx-auto mb-3">
              {step.num}
            </div>
            <h3 className="text-[13px] font-medium text-gray-900 mb-1">{step.title}</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
