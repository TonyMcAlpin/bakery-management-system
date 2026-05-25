import {
  Navigate,
} from "react-router-dom";

import {
  isAuthenticated,
} from "../services/authService";

function RequireAuth({
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

export default RequireAuth;