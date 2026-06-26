import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

import Tree from './pages/Tree';

function App() {
  return (
    <Router>
      <div className="bg-[#1a1a1a] min-h-screen text-white font-sans">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tree" element={<Tree />} />
          <Route path="/dashboard" element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-4xl font-bold">Dashboard Coming Soon...</h1>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
