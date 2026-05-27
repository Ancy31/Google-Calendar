import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { DAYS } from '../constants/calender';
import { DateDisplayGrid, Date as DateText, CalendarContainer } from '../styles';
import '../api/config';
import { calenderEventsApi } from '../api/config';
import { Chip, CircularProgress, Box } from '@mui/material';
import Modal from '../components/Modal';

const Calendar = () => {
  const [value, setValue] = useState(new Date());

  const [activeModalDate, setActiveModalDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [activeDate, setActiveDate] = useState(() => (value ? new Date(value) : new Date()));
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startPaddingCount = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const endPaddingCount = lastDayOfMonth.getDay();
  const token = localStorage.getItem('Token');

  // const events = JSON.parse(localStorage.getItem('calenderEvents')) || [];
// console.log(events)
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
    enabled: !!year && !!month,
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', token, year, month, activeDate],
    queryFn: () => calenderEventsApi(year, month, token),
    enabled: !!token && !!year && !!month,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (value) {
      setActiveDate(new Date(value));
    }
  }, [value]);
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <CalendarContainer>
      <Header setValue={setValue} value={value} />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
        <DateDisplayGrid sx={{ borderBottom: '1px solid #dadce0', flexShrink: 0 }}>
          {DAYS.map((day, index) => (
            <div key={index} style={{ padding: '12px 0', textAlign: 'center', fontSize: '11px', fontWeight: 500, color: '#70757a', textTransform: 'uppercase', borderRight: index < 6 ? '1px solid #dadce0' : 'none' }}>
              {day}
            </div>
          ))}
        </DateDisplayGrid>

        <DateDisplayGrid sx={{ overflowY: 'auto', flexGrow: 1, alignContent: 'start', gridAutoRows: 'minmax(120px, 1fr)' }}>
          {data?.map((dateObj, index) => {
            const today = new Date();
            const isToday =
              dateObj?.date?.getFullYear() === today.getFullYear() &&
              dateObj?.date?.getMonth() === today.getMonth() &&
              dateObj?.date?.getDate() === today.getDate();

            const isoDate = dateObj?.date?.toISOString();

            return (
              <div
                key={dateObj?.date?.toISOString()}
                onClick={() => setActiveModalDate(isoDate)}
                style={{
                  padding: '4px',
                  borderRight: (index + 1) % 7 !== 0 ? '1px solid #dadce0' : 'none',
                  borderBottom: '1px solid #dadce0',
                  backgroundColor: dateObj?.isActive ? '#fff' : '#f8f9fa',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <DateText isToday={isToday} isActive={dateObj?.isActive}>
                  {dateObj?.date?.getDate()}
                </DateText>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', overflowY: 'auto', flexGrow: 1 }}>
                  {events?.map((event) => {
                    const dateStr = event?.start?.dateTime;
                    const date = new Date(dateStr);
                    const isValid =
                      dateObj?.date?.getFullYear() === date.getFullYear() &&
                      dateObj?.date?.getMonth() === date.getMonth() &&
                      dateObj?.date?.getDate() === date.getDate();

                    return isValid ? (
                      <Chip 
                        key={event?.id || 'event'} 
                        label={event?.summary} 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          setActiveModalDate(isoDate);
                        }}
                        sx={{ backgroundColor: '#039be5', color: '#fff', fontSize: '12px', height: '22px', '& .MuiChip-label': { padding: '0 8px' }, borderRadius: '4px', justifyContent: 'flex-start' }} 
                      />
                    ) : null;
                  })}
                </div>

                {activeModalDate === isoDate && (
                  <Modal
                    date={isoDate}
                    open={activeModalDate === isoDate}
                    onClose={() => {
                      setActiveModalDate(null);
                      setSelectedEvent(null);
                    }}
                    label="Event Name"
                    setIsModalOpen={() => {
                      setActiveModalDate(null);
                      setSelectedEvent(null);
                    }} 
                    selectedEvent={selectedEvent}
                  />
                )}
              </div>
            );
          })}
        </DateDisplayGrid>
      </Box>
    </CalendarContainer>
  );
};

export default Calendar;
