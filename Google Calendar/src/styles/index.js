import styled from '@emotion/styled';
import { Box, Chip } from '@mui/material';

export const Header = styled(Box)({
  padding: '8px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid #dadce0',
  height: '64px',
  backgroundColor: '#fff',
});

export const HeaderSpilt = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const Date = styled('div')(({ isToday, isActive }) => ({
  fontSize: '12px',
  fontWeight: 500,
  height: '28px',
  width: '28px',
  lineHeight: '28px',
  borderRadius: '50%',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: isActive ? (isToday ? '#fff' : '#3c4043') : '#70757a',
  backgroundColor: isActive ? (isToday ? '#1a73e8' : 'transparent') : 'transparent',
  margin: '4px auto',
  '&:hover': {
    backgroundColor:
      isActive && !isToday ? '#f1f3f4' : isActive && isToday ? '#1a73e8' : 'transparent',
  },
}));

export const DateDisplayGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  width: '100%',
});

export const CalendarContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
});

export const CustomEventChip = styled(Chip)({
  backgroundColor: '#fefefe00',
  color: '#000000',
  fontSize: '12px',
  height: '22px',
  width: 'fit-content',
  '& .MuiChip-label': { padding: '0 8px' },
  borderRadius: '4px',
  justifyContent: 'flex-start',
});
export const CustomHolidayChip = styled(Chip)({
  backgroundColor: '#0f990f',
  color: '#fff',
  fontSize: '12px',
  height: '22px',
  '& .MuiChip-label': { padding: '0 8px' },
  borderRadius: '4px',
  justifyContent: 'flex-start',
});

export const Dayscontainer = styled(Box)(({ index }) => ({
  padding: '12px 0',
  textAlign: 'center',
  fontSize: '11px',
  fontWeight: 500,
  color: '#70757a',
  borderRight: index < 6 ? '1px solid #dadce0' : 'none',
  textTransform: 'uppercase',
}));
export const HolidayContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  marginTop: '4px',
  overflowY: 'auto',
  flexGrow: 1,
});
export const EventContainer = styled(Box)(({ isActive, index }) => ({
  padding: '4px',
  borderBottom: '1px solid #dadce0',
  borderRight: (index + 1) % 7 !== 0 ? '1px solid #dadce0' : 'none',
  backgroundColor: isActive ? '#fff' : '#f8f9fa',
  position: 'relative',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
}));
