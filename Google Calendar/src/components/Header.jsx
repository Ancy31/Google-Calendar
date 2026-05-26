import {  Chip, IconButton, Typography } from '@mui/material';
import { MdNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import { Header as HeaderContainer, HeaderSpilt } from '../styles';
import { useEffect, useState } from 'react';
import { MONTHS } from '../constants/calender';

const Header = ({ value, setValue }) => {
  const [activeDate, setActiveDate] = useState({ month: '', year: '' });
  const handleMonthChange = (modifier) => {
    const [yearStr, monthStr] = value.split('-');
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) - 1;

    const targetDate = new Date(year, month + modifier, 1);

    const newYear = targetDate.getFullYear();
    const newMonth = String(targetDate.getMonth() + 1).padStart(2, '0');

    setValue(`${newYear}-${newMonth}`);
    setActiveDate({ month: MONTHS[targetDate.getMonth()], year: newYear });
  };

  const handleToday = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    setValue(`${currentYear}-${currentMonth}`);
    setActiveDate({ month: MONTHS[new Date().getMonth()], year: currentYear });
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <HeaderContainer>
      <HeaderSpilt>
        <Typography variant="h4">Calendar</Typography>

        <input
          type="month"
          value={value || ''}
          onChange={(event) => setValue(event?.target?.value)}
        />

        <IconButton
          color="primary"
          aria-label="Previous Month"
          onClick={() => handleMonthChange(-1)}
        >
          <GrFormPrevious />
        </IconButton>

        <IconButton color="primary" aria-label="Next Month" onClick={() => handleMonthChange(1)}>
          <MdNavigateNext />
        </IconButton>

        <Chip label="Today" variant="outlined" onClick={handleToday} />
      </HeaderSpilt>
      <HeaderSpilt>
        <h1>{activeDate?.month}</h1>
        <h1>{activeDate?.year}</h1>
      </HeaderSpilt>
    </HeaderContainer>
  );
};

export default Header;
