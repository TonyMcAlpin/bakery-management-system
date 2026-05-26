import { useState } from "react";

import {
  login,
  saveToken,
} from "../services/authService";

import {
  useNavigate,
} from "react-router-dom";

function Login() {
  const navigate =
    useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    try {
      const data =
        await login(
          username,
          password
        );

      saveToken(data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        "Invalid username or password"
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Bakery Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="border p-3 rounded-lg"
          />

          {error && (
            <div className="text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="bg-stone-900 text-white py-3 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;