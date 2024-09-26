import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import routes from './useRoutes'; // Import your route definitions
import './main.scss';
import Navbar from './components/navbar/navbar';
import { initializeSocket } from './hooks/SocketContext';

function App() {
  useEffect(() => {
    initializeSocket();
  }, []);
  return (
    <div className="codespace">
      <Navbar />
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
