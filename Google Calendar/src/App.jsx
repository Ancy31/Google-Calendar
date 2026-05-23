import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from './routes/index.js';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {APP_ROUTES.map(({ path, element: Element }, index) => {
          return <Route path={path} element={<Element />} key={index} />;
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
