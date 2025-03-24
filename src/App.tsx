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
              <React.Suspense
                fallback={<LoadingScreen text="Loading projects..." />}
              >
                {React.lazy(() => import("./components/pages/projects"))}
              </React.Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <React.Suspense
                fallback={<LoadingScreen text="Loading calendar..." />}
              >
                {React.lazy(() => import("./components/pages/calendar"))}
              </React.Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/team"
          element={
            <PrivateRoute>
              <React.Suspense
                fallback={<LoadingScreen text="Loading team..." />}
              >
                {React.lazy(() => import("./components/pages/team"))}
              </React.Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <React.Suspense
                fallback={<LoadingScreen text="Loading settings..." />}
              >
                {React.lazy(() => import("./components/pages/settings"))}
              </React.Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/help"
          element={
            <PrivateRoute>
              <React.Suspense
                fallback={<LoadingScreen text="Loading help..." />}
              >
                {React.lazy(() => import("./components/pages/help"))}
              </React.Suspense>
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
