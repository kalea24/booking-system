import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, startOfToday } from 'date-fns';
import { getAvailableDates } from '../services/api';

const Calendar = ({ onDateSelect, isOwnerView = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const today = startOfToday();

  useEffect(() => {
    fetchAvailableDates();
  }, [currentDate]);

  const fetchAvailableDates = async () => {
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const response = await getAvailableDates(month, year);
      setUnavailableDates(response.data.unavailableDates);
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const isDateUnavailable = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return unavailableDates.includes(dateStr);
  };

  const handleDateClick = (date) => {
    if (!isOwnerView && (isDateUnavailable(date) || isBefore(date, today))) {
      return;
    }
    setSelectedDate(date);
    onDateSelect(date);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl md:text-2xl font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((date, idx) => {
          const unavailable = isDateUnavailable(date);
          const isPast = isBefore(date, today);
          const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const isTodayDate = isToday(date);

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(date)}
              disabled={!isOwnerView && (unavailable || isPast)}
              className={`
                aspect-square p-2 rounded-lg text-sm md:text-base font-medium
                transition-all duration-200 relative
                ${isSelected ? 'bg-primary text-white ring-2 ring-primary' : ''}
                ${isTodayDate && !isSelected ? 'bg-blue-50 text-primary' : ''}
                ${unavailable && !isOwnerView ? 'bg-red-50 text-red-400 line-through cursor-not-allowed' : ''}
                ${isPast && !isOwnerView && !unavailable ? 'text-gray-300 cursor-not-allowed' : ''}
                ${!unavailable && !isPast && !isSelected ? 'hover:bg-gray-100' : ''}
              `}
            >
              {format(date, 'd')}
              {unavailable && !isOwnerView && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="text-red-400 text-2xl">✕</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-50 rounded line-through"></div>
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 rounded"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;