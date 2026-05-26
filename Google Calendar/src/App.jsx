import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from './routes/index.js';
import NotFound from './pages/NotFound.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const queryClient = new QueryClient({});

  return (
    <GoogleOAuthProvider clientId="677252180672-mtklniaflulv0i9cvtm92rgp50vmie5e.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {APP_ROUTES.map(({ path, element: Element }, index) => {
              return <Route path={path} element={<Element />} key={index} />;
            })}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
