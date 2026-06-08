'use client';

import { useState } from 'react';
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarProps {
  onDateChange: (range: { start: Date; end: Date } | null) => void;
}

export function BookingCalendar({ onDateChange }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)); // Mocking June 2026 like in mockup
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 5, 9));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 5, 12));

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const emptyDaysBefore = getDay(days[0]) === 0 ? 6 : getDay(days[0]) - 1;

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      onDateChange(null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
        onDateChange(null);
      } else {
        setEndDate(date);
        onDateChange({ start: startDate, end: date });
      }
    }
  };

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };

  const isSelected = (date: Date) => {
    return (startDate && isSameDay(date, startDate)) || (endDate && isSameDay(date, endDate));
  };

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium">
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </span>
        <div className="flex gap-1">
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={16} /></button>
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="mb-4 flex gap-3 text-[12px] text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#3C3489]"></span> Выбрано
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#EEEDFE] border border-[#AFA9EC]"></span> Диапазон
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
          <div key={d} className="text-[10px] text-gray-400 py-1 font-medium">{d}</div>
        ))}

        {Array.from({ length: emptyDaysBefore }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => handleDateClick(date)}
            className={cn(
              "text-[12px] py-1.5 rounded-md transition-colors",
              isSelected(date) ? "bg-[#3C3489] text-white" :
              isInRange(date) ? "bg-[#EEEDFE] text-[#3C3489]" :
              "text-gray-600 hover:bg-gray-100",
              isToday(date) && !isSelected(date) && "border border-gray-200 font-bold"
            )}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
}
