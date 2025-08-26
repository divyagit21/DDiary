import './App.css';
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';

const Home = React.lazy(() => import('./components/Home'));
const Journal = React.lazy(() => import('./components/Journal'));
const Tasks = React.lazy(() => import('./components/Tasks'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const History = React.lazy(() => import('./components/History'));
const Signin = React.lazy(() => import('./components/Signin'));
const Login = React.lazy(() => import('./components/Login'));
const MoodTracker = React.lazy(() => import('./components/MoodTracker'));
const TrackerHistory = React.lazy(() => import('./components/TrackerHistory'));
const JournalWrapper = React.lazy(() => import('./components/JournalWrapper'));
const MoodTrackerWrapper = React.lazy(() => import('./components/MoodTrackerWrapper'));

const Loading = () => (
  <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.5rem' }}>
    Loading...
  </div>
);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </div>
  );
}

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
      {isAuthenticated ? (
        <>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:id?" element={<JournalWrapper />} />
          <Route path="/history" element={<History />} />
          <Route path="/tracker" element={<MoodTracker />} />
          <Route path="/tracker/:id?" element={<MoodTrackerWrapper />} />
          <Route path="/trackerHistory" element={<TrackerHistory />} />
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
  );
};

export default App;
