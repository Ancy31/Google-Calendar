import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { DAYS } from '../constants/calender';
import { DateDisplayGrid, Date as DateText } from '../styles';
import '../api/config';
import { calenderEventsApi } from '../api/config';
import { Chip, CircularProgress } from '@mui/material';

const Calendar = () => {
  const [value, setValue] = useState(null);

  const activeDate = value ? new Date(value) : new Date();
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startPaddingCount = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const endPaddingCount = lastDayOfMonth.getDay();
  const token = localStorage.getItem('Token');

  const fetchAllDays = () => {
    const allDays = [];
    for (let i = startPaddingCount; i > 0; i--) {
      allDays.push({ date: new Date(year, month, -i + 1), isActive: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      allDays.push({ date: new Date(year, month, i), isActive: true });
    }
    for (let i = 1; i <= (endPaddingCount === 0 ? 0 : 7 - endPaddingCount); i++) {
      allDays.push({ date: new Date(year, month + 1, i), isActive: false });
    }
    return allDays;
  };

  const { data } = useQuery({
    queryKey: ['AllDays', year, month],
    queryFn: fetchAllDays,
    staleTime: 1000 * 60 * 5,
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', { token, year, month }],
    queryFn: () => calenderEventsApi(year, month, token),
    enabled: !!token,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div>
      <Header setValue={setValue} value={value} />

      <DateDisplayGrid>
        {DAYS.map((day, index) => (
          <div key={index} style={{ padding: '12px 10px', border: '1px solid #cccccc9e' }}>
            {day}
          </div>
        ))}
      </DateDisplayGrid>

      <DateDisplayGrid>
        {data?.map((dateObj) => {
          const today = new Date();
          const isToday =
            dateObj?.date?.getFullYear() === today.getFullYear() &&
            dateObj?.date?.getMonth() === today.getMonth() &&
            dateObj?.date?.getDate() === today.getDate();

          return (
            <div
              key={dateObj?.date?.toISOString()}
              style={{
                padding: '55px',
                border: '1px solid #cccccc88',
                backgroundColor: dateObj?.isActive ? '#fff' : '#b8b8b83d',
                position: 'relative',
              }}
            >
              <DateText isToday={isToday} isActive={dateObj?.isActive}>
                {dateObj?.date?.getDate()}
              </DateText>
              {events?.map((event) => {
                const dateStr = event?.start?.dateTime;
                const date = new Date(dateStr);
                const isValid =
                  dateObj?.date?.getFullYear() === date.getFullYear() &&
                  dateObj?.date?.getMonth() === date.getMonth() &&
                  dateObj?.date?.getDate() === date.getDate();
                return isValid ? <Chip key="event" label={event?.summary} /> : '';
              })}
            </div>
          );
        })}
      </DateDisplayGrid>
    </div>
  );
};

export default Calendar;
