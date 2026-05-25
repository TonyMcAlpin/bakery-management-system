import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import Ingredients from "./pages/Ingredients";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

import DashboardLayout from "./components/layouts/DashboardLayout";

import {
  isAuthenticated,
} from "./services/authService";

function ProtectedRoute({
  children,
}) {
  if (
    !isAuthenticated()
  ) {
    return (
      <Navigate
        to="/login"
      />
    );
  }

  return children;
}

const router =
  createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },

    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      ),
    },

    {
      path: "/recipes",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Recipes />
          </DashboardLayout>
        </ProtectedRoute>
      ),
    },

    {
      path: "/ingredients",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Ingredients />
          </DashboardLayout>
        </ProtectedRoute>
      ),
    },

    {
      path: "/purchases",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Purchases />
          </DashboardLayout>
        </ProtectedRoute>
      ),
    },

    {
      path: "/sales",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Sales />
          </DashboardLayout>
        </ProtectedRoute>
      ),
    },

    {
      path: "/reports",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
        </ProtectedRoute>
      ),
    },
  ]);

export default router;