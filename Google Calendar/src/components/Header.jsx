import { Button, IconButton, Typography } from '@mui/material';
import { MdNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import { Header as HeaderContainer, HeaderSpilt } from '../styles';
import { useEffect, useState } from 'react';
import { MONTHS } from '../constants/calender';

const Header = ({ value, setValue }) => {
  const [activeDate, setActiveDate] = useState({ month: '', year: '' });

  const handleMonthChange = (modifier) => {
    if (typeof value !== 'string') return;
    const [yearStr, monthStr] = value.split('-');
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) - 1;

    const targetDate = new Date(year, month + modifier, 1);
    const newYear = targetDate.getFullYear();
    const newMonth = String(targetDate.getMonth() + 1).padStart(2, '0');

    setValue(`${newYear}-${newMonth}`);
  };

  const handleToday = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    setValue(`${currentYear}-${currentMonth}`);
  };

  useEffect(() => {
    handleToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof value === 'string' && value.includes('-')) {
      const [yearStr, monthStr] = value.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1;
      setActiveDate({ month: MONTHS[month], year: year });
    }
  }, [value]);

  const inputValue = typeof value === 'string' ? value : '';

  return (
    <HeaderContainer>
      <HeaderSpilt>
        <Typography variant="h6" sx={{ fontSize: '22px', color: '#3c4043', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Calendar
        </Typography>

        <Button variant="outlined" onClick={handleToday} sx={{ ml: 2, textTransform: 'none', color: '#3c4043', borderColor: '#dadce0', '&:hover': { backgroundColor: '#f1f3f4', borderColor: '#dadce0' } }}>
          Today
        </Button>

        <IconButton
          aria-label="Previous Month"
          onClick={() => handleMonthChange(-1)}
          sx={{ color: '#5f6368' }}
        >
          <GrFormPrevious />
        </IconButton>

        <IconButton aria-label="Next Month" onClick={() => handleMonthChange(1)} sx={{ color: '#5f6368' }}>
          <MdNavigateNext />
        </IconButton>

        <Typography variant="h6" sx={{ color: '#3c4043', ml: 1, fontWeight: 400, fontSize: '22px' }}>
          {activeDate?.month} {activeDate?.year}
        </Typography>
      </HeaderSpilt>
      <HeaderSpilt>
        <input
          type="month"
          value={inputValue}
          onChange={(event) => setValue(event?.target?.value)}
          style={{ padding: '8px', border: '1px solid #dadce0', borderRadius: '4px', outline: 'none', color: '#3c4043', cursor: 'pointer' }}
        />
      </HeaderSpilt>
    </HeaderContainer>
  );
};

export default Header;
