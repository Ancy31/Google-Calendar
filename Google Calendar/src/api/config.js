import { ROUTE_PATHS } from '../routes/routes';

export const handleToken = async () => {
  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: '677252180672-mtklniaflulv0i9cvtm92rgp50vmie5e.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/calendar.events',
      callback: (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          localStorage.setItem('Token', JSON.stringify(tokenResponse.access_token));
          window.location.href = ROUTE_PATHS.calendar;
        }
      },
    });
    await tokenClient.requestAccessToken();
  } catch (err) {
    console.error('Error initializing token client:', err);
  }
};

export const calenderEventsApi = async (year, month, accessToken) => {
  const timeMin = new Date(year, month, 1).toISOString();
  const timeMax = new Date(year, month + 1, 0).toISOString();

  if (!accessToken) {
    throw new Error('No access token found. Please login again.');
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = await res.json();

    if (data.items) {
      localStorage.setItem('googleEvents', JSON.stringify(data.items));
      return data.items;
    }

    return [];
  } catch (err) {
    console.error('Error fetching events:', err);
    throw err;
  }
};
export const calendarHolidaysApi = async (accessToken) => {
  if (!accessToken) {
    throw new Error('No access token found. Please login again.');
  }

  // const calendarId = encodeURIComponent('en.indian#holiday@group.v.calendar.google.com');
  const calendarId = encodeURIComponent('en.usa#holiday@group.v.calendar.google.com');

  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('API Error Response:', errorData);
      throw new Error(`Google API Error: ${res.status} - ${errorData.error.message}`);
    }

    const data = await res.json();

    if (data.items) {
      return data.items;
    }
    return [];
  } catch (err) {
    console.error('Error fetching events:', err);
    throw err;
  }
};

export const saveCalendarEventApi = async (eventDetails, accessToken, eventId = null) => {
  if (!accessToken) {
    throw new Error('No access token found. Please login again.');
  }

  const url = eventId
    ? `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`
    : 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  const method = eventId ? 'PUT' : 'POST';
  const actionText = eventId ? 'update' : 'create';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventDetails),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || `Failed to ${actionText} event on Google Calendar`);
    }
    return data;
  } catch (err) {
    console.error(`Error ${actionText}ing event:`, err);
    throw err;
  }
};
