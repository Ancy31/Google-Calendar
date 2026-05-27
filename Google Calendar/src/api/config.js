import { ROUTE_PATHS } from '../routes/routes';

export const handleToken = async () => {
  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: '677252180672-mtklniaflulv0i9cvtm92rgp50vmie5e.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
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
