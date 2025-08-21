import './App.css';
import Home from './components/Home';
import Journal from './components/Journal';
import Tasks from './components/Tasks';
import Dashboard from './components/Dashboard';
import History from './components/History';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Router } from 'react-router-dom';
import Signin from './components/Signin';
import Login from './components/Login';
import { AuthProvider } from './components/AuthContext';
import { useAuth } from './components/AuthContext';
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div >
  );
}

function JournalWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();

  const onSaveComplete = () => {
    navigate('/history');
  };

  return <Journal editEntryId={id ? id : null} onSaveComplete={onSaveComplete} />;
}

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/journal/:id?" element={<JournalWrapper />} />
          <Route path="/home" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Home />} />
        </>
      ) : (
        <>
          <Route path="/signin" element={<Signin />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </>
      )}
    </Routes>

  )
}
export default App;



