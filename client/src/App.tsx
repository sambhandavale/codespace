import { Routes, Route } from 'react-router-dom';
import routes from './useRoutes'; // Import your route definitions
import './main.scss';
import Navbar from './components/navbar/navbar';

function App() {
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
