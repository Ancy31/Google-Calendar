import { Badge, Box, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import '../api/config';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { DAYS } from '../constants/calender';
import {
  CalendarContainer,
  DateDisplayGrid,
  Date as DateText,
  CustomHolidayChip,
  CustomEventChip,
  Dayscontainer,
  EventContainer,
  HolidayContainer,
} from '../styles';
import { getApiServices } from '../api/api';

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
  const token = JSON.parse(localStorage.getItem('Token'));

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

  const timeMin = new Date(year, month, 1).toISOString();
  const timeMax = new Date(year, month + 1, 0).toISOString();
  const calendarId = encodeURIComponent('en.usa#holiday@group.v.calendar.google.com');

  const { data } = useQuery({
    queryKey: ['AllDays', year, month],
    queryFn: fetchAllDays,
    staleTime: 1000 * 60 * 5,
    enabled: !!year && !!month,
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', token, timeMin, timeMax, activeDate],
    queryFn: () =>
      getApiServices('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        params: {
          timeMin,
          timeMax,
          singleEvents: true,
          orderBy: 'startTime',
        },
      }),
    onSuccess: (res) => localStorage.setItem('googleEvents', JSON.stringify(res.data.items)),
    select: (res) => res?.data?.items,
    enabled: !!token && !!timeMin && !!timeMax,
    staleTime: 1000 * 60 * 60,
  });

  const { data: holidays } = useQuery({
    queryKey: ['holidays', token, calendarId],
    queryFn: () =>
      getApiServices(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`),
    enabled: !!token && !!calendarId,
    select: (res) => res?.data?.items,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
            <Dayscontainer key={index} index={index}>
              {day}
            </Dayscontainer>
          ))}
        </DateDisplayGrid>

        <DateDisplayGrid
          sx={{
            overflowY: 'auto',
            flexGrow: 1,
          }}
        >
          {data?.map((dateObj, index) => {
            const today = new Date();
            const isToday =
              dateObj?.date?.getFullYear() === today.getFullYear() &&
              dateObj?.date?.getMonth() === today.getMonth() &&
              dateObj?.date?.getDate() === today.getDate();

            const isoDate = dateObj?.date?.toISOString();

            return (
              <EventContainer
                key={dateObj?.date?.toISOString()}
                isActive={dateObj?.isActive}
                index={index}
                onClick={() => setActiveModalDate(isoDate)}
              >
                <DateText isToday={isToday} isActive={dateObj?.isActive}>
                  {dateObj?.date?.getDate()}
                </DateText>

                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '4px',
                    flexGrow: 1,
                  }}
                >
                  {events?.map((event) => {
                    const dateStr = event?.start?.dateTime;
                    const date = new Date(dateStr);
                    const isValid =
                      dateObj?.date?.getFullYear() === date.getFullYear() &&
                      dateObj?.date?.getMonth() === date.getMonth() &&
                      dateObj?.date?.getDate() === date.getDate();

                    return isValid ? (
                      <div key={event?.id || 'event'}>
                        <Badge
                          color="secondary"
                          variant="dot"
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                        >
                          <CustomEventChip
                            key={event?.id || 'event'}
                            label={event?.summary}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                              setActiveModalDate(isoDate);
                            }}
                          />
                        </Badge>
                      </div>
                    ) : null;
                  })}
                </div>
                <HolidayContainer>
                  {holidays?.map((holiday, index) => {
                    const holidayDateStr = holiday?.start?.date;
                    const dateObjStr = isoDate?.split('T')[0];
                    console.log(holidayDateStr);
                    const isValid =
                      holidayDateStr && dateObjStr && holidayDateStr.trim() === dateObjStr.trim();
                    console.log(isValid);
                    return isValid ? (
                      <CustomHolidayChip
                        key={`holiday- ${index}`}
                        label={holiday?.summary}
                        size="small"
                      />
                    ) : null;
                  })}
                </HolidayContainer>

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
              </EventContainer>
            );
          })}
        </DateDisplayGrid>
      </Box>
    </CalendarContainer>
  );
};

export default Calendar;
