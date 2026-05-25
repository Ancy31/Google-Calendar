import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const Header = styled(Box)({
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.18)',
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '25px',
});

export const HeaderSpilt = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
});

export const Date = styled('span')(({ isToday }) => ({
  fontSize: '24px',
  height: '80px',
  width: '80px',
  padding: '20px',
  borderRadius: '50%',
  textAlign: 'center',
  color: isToday ? 'white' : '#333',
  backgroundColor: isToday ? '#7066ff' : '#fff',
}));

export const DateDisplayGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  width: '99.9vw',
  heigth: '90vh',
});
