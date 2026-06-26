import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tree from './pages/Tree';
import Store from './pages/Store';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <div className="bg-ivory min-h-screen text-brown-dark font-sans selection:bg-emerald-deep/20">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes inside Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={
              <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                <div className="w-24 h-24 mb-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h1 className="text-4xl font-bold text-white tracking-wider">Dashboard Overview</h1>
                <p className="text-gray-400 mt-4 text-center max-w-lg">Welcome to the Binary MLM system. The full dashboard analytics widgets are coming in the next phase!</p>
              </div>
            } />
            <Route path="/store" element={<Store />} />
            <Route path="/tree" element={<Tree />} />
            <Route path="/wallet" element={
              <div className="flex items-center justify-center h-full">
                <h1 className="text-3xl font-bold text-gray-500">Wallet Dashboard Coming Soon</h1>
              </div>
            } />
            <Route path="/reports" element={
              <div className="flex items-center justify-center h-full">
                <h1 className="text-3xl font-bold text-gray-500">Income Reports Coming Soon</h1>
              </div>
            } />
            <Route path="/withdrawals" element={
              <div className="flex items-center justify-center h-full">
                <h1 className="text-3xl font-bold text-gray-500">Withdrawals Coming Soon</h1>
              </div>
            } />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
