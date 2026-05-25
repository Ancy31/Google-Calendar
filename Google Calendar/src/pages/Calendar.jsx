import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { DAYS } from '../constants/calender';
import { DateDisplayGrid, Date as DateText } from '../styles';

const Calendar = () => {
  const [value, setValue] = useState(null);
  const clientRef = useRef(null);

  const activeDate = value ? new Date(value) : new Date();
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startPaddingCount = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const endPaddingCount = lastDayOfMonth.getDay();

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

  useEffect(() => {
    if (window?.google?.accounts?.oauth2) {
      console.log('hi');
      // clientRef.current = window.google.accounts.oauth2.initTokenClient({
      //   client_id: '677252180672-mtklniaflulv0i9cvtm92rgp50vmie5e.apps.googleusercontent.com',
      //   scope: 'https://www.googleapis.com/calendar/v3/calendars/calendarId/events',
      //   callback: (response) => {
      //     console.log('Google Response Callback fired:', response);
      //     if (response?.access_token) {
      //       console.log('Success! Token:', response.access_token);
      //     }
      //   },
      //   error_callback: (err) => {
      //     console.error('Google Auth Error:', err);
      //   },
      // });
    } else {
      console.error('Google Script not found! Check your index.html file.');
    }
  }, []);

  const handleGoogleLogin = () => {
    console.log('Login button clicked!');
    if (clientRef.current) {
      clientRef.current.requestAccessToken();
    }
  };
  return (
    <div>
      <Header setValue={setValue} value={value} />

      {/* <div style={{ padding: '20px', textAlign: 'center' }}>
        <button onClick={handleGoogleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Connect Google Calendar
        </button>
      </div> */}

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
              }}
            >
              <DateText isToday={isToday} isActive={dateObj?.isActive}>
                {dateObj?.date?.getDate()}
              </DateText>
            </div>
          );
        })}
      </DateDisplayGrid>
    </div>
  );
};

export default Calendar;
