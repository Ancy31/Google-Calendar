import { useState } from 'react';
import Header from '../components/Header';
import { days } from '../constants/calender';
import { DateDisplayGrid, Date as DateText } from '../styles';

const Calendar = () => {
  const [value, setValue] = useState(null);
  console.log(new Date(value));

  const now = value ? new Date(value) : new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const allDays = [];

  const startPaddingCount = firstDayOfMonth.getDay();
  for (let i = startPaddingCount - 1; i >= 0; i--) {
    allDays.push(new Date(year, month, 1 - i - 1));
  }

  for (let i = 1; i <= daysInMonth; i++) {
    allDays.push(new Date(year, month, i));
  }

  const totalDaysNeeded = allDays.length <= 35 ? 35 : 42;
  let nextMonthDay = 1;

  while (allDays.length < totalDaysNeeded) {
    allDays.push(new Date(year, month + 1, nextMonthDay));
    nextMonthDay++;
  }
  console.log(value);
  return (
    <div>
      <Header setValue={setValue} value={value} />
      <DateDisplayGrid>
        {days.map((day, index) => (
          <div key={index} style={{ padding: '12px 10px', border: '1px solid #cccccc9e' }}>
            {day}
          </div>
        ))}
      </DateDisplayGrid>
      <DateDisplayGrid>
        {allDays.map((dateObj) => {
          const today = new Date();
          const isToday =
            dateObj.getFullYear() === today.getFullYear() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getDate() === today.getDate();

          return (
            <div
              key={dateObj.toISOString()}
              style={{ padding: '55px', border: '1px solid #cccccc88' }}
            >
              <DateText isToday={isToday}>{dateObj.getDate()}</DateText>
            </div>
          );
        })}
      </DateDisplayGrid>
    </div>
  );
};

export default Calendar;
