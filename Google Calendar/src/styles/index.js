import styled from '@emotion/styled';
import { Box } from '@mui/material';

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
    backgroundColor: isActive && !isToday ? '#f1f3f4' : isActive && isToday ? '#1a73e8' : 'transparent',
  }
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
