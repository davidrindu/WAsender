import React, { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import BlankPage from "./components/pages/blank-page";
import { AuthProvider, useAuth } from "../supabase/auth";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen, LoadingSpinner } from "./components/ui/loading-spinner";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen text="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

// Lazy loaded components
const ProjectsPage = React.lazy(() => import("./components/pages/projects"));
const ProjectDetailPage = React.lazy(
  () => import("./components/pages/project"),
);
const CreateMessagePage = React.lazy(
  () => import("./components/pages/project/CreateMessagePage"),
);
const ScheduleMessagePage = React.lazy(
  () => import("./components/pages/project/ScheduleMessagePage"),
);
const CalendarPage = React.lazy(() => import("./components/pages/calendar"));
const TeamPage = React.lazy(() => import("./components/pages/team"));
const SettingsPage = React.lazy(() => import("./components/pages/settings"));
const HelpPage = React.lazy(() => import("./components/pages/help"));
const ProfilePage = React.lazy(() => import("./components/pages/profile"));

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<Success />} />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Suspense fallback={<LoadingScreen text="Loading projects..." />}>
                <ProjectsPage />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <PrivateRoute>
              <Suspense fallback={<LoadingScreen text="Loading project..." />}>
                <ProjectDetailPage />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Suspense fallback={<LoadingScreen text="Loading calendar..." />}>
                <CalendarPage />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/team"
          element={
            <PrivateRoute>
              <Suspense fallback={<LoadingScreen text="Loading team..." />}>
                <TeamPage />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Suspense fallback={<LoadingScreen text="Loading settings..." />}>
                <SettingsPage />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/help"
          element={
            <PrivateRoute>
              <Suspense fallback={<LoadingScreen text="Loading help..." />}>
                <HelpPage />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Suspense fallback={<LoadingScreen text="Loading profile..." />}>
                <ProfilePage />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/create-message"
          element={
            <PrivateRoute>
              <Suspense
                fallback={<LoadingScreen text="Loading message creator..." />}
              >
                <CreateMessagePage />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/schedule-message"
          element={
            <PrivateRoute>
              <Suspense
                fallback={<LoadingScreen text="Loading message scheduler..." />}
              >
                <ScheduleMessagePage />
              </Suspense>
            </PrivateRoute>
          }
        />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen text="Loading application..." />}>
        <AppRoutes />
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
