import {
  Box,
  Button,
  CircularProgress,
  Modal as MuiModal,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { postApiServices, updateApiServices } from '../api/api';

const Modal = ({ date, open, onClose, label, selectedEvent }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 448,
    bgcolor: '#fff',
    borderRadius: '8px',
    boxShadow:
      '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
    p: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    outline: 'none',
  };

  const [value, setValue] = useState('');
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    if (selectedEvent && open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEventName(selectedEvent.summary || '');

      if (selectedEvent.start && selectedEvent.start.dateTime) {
        const startDate = new Date(selectedEvent.start.dateTime);
        const hours = String(startDate.getHours()).padStart(2, '0');
        const minutes = String(startDate.getMinutes()).padStart(2, '0');
        setValue(`${hours}:${minutes}`);
      } else {
        setValue('');
      }
    } else if (open && !selectedEvent) {
      setEventName('');
      setValue('');
    }
  }, [selectedEvent, open]);

  const mutation = useMutation({
    mutationFn: (eventDetails) => {
      const eventId = selectedEvent?.id || null;
      return eventId
        ? updateApiServices(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
            eventId,
            JSON.stringify(eventDetails),
          )
        : postApiServices(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            JSON.stringify(eventDetails),
          );
    },
    onSuccess: () => {
      onClose();
      setValue('');
      setEventName('');
    },
  });

  const handleEvents = ({ timeValue }) => {
    if (!timeValue) return;

    const baseDate = new Date(date);
    const [hours, minutes] = timeValue.split(':');

    baseDate.setHours(parseInt(hours, 10));
    baseDate.setMinutes(parseInt(minutes, 10));

    const startDateIso = baseDate.toISOString();
    const endDate = new Date(baseDate.getTime() + 60 * 60 * 1000);
    const endDateIso = endDate.toISOString();

    const newEvent = {
      summary: eventName || 'New Event',
      start: {
        dateTime: startDateIso,
      },
      end: {
        dateTime: endDateIso,
      },
    };

    mutation.mutate(newEvent);
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleEvents({ timeValue: value });
  };

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      hideBackdrop={true}
    >
      <Box sx={style} onClick={(e) => e.stopPropagation()}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{ fontSize: '22px', fontWeight: 400, color: '#3c4043' }}
        >
          {selectedEvent ? 'Edit Event' : 'Add Event'}
        </Typography>

        <TextField
          id="outlined-basic"
          label={label}
          variant="standard"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          sx={{ mb: 1, mt: 1 }}
        />

        <Typography id="modal-time-label" variant="body1" component="h2" sx={{ color: '#3c4043' }}>
          Choose a Time:
        </Typography>

        <input
          type="time"
          id="appointment"
          name="appointment"
          value={value}
          onChange={(event) => {
            setValue(event?.target?.value);
          }}
          style={{
            padding: '8px',
            border: '1px solid #dadce0',
            borderRadius: '4px',
            outline: 'none',
            color: '#3c4043',
            fontSize: '16px',
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          <Button onClick={onClose} sx={{ color: '#5f6368', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            disabled={mutation.isPending}
            variant="contained"
            sx={{
              backgroundColor: '#1a73e8',
              color: '#fff',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#1557b0', boxShadow: 'none' },
            }}
            onClick={(e) => handleSubmit(e)}
          >
            {mutation.isPending ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </Box>
      </Box>
    </MuiModal>
  );
};

export default Modal;
