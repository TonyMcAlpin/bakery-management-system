import Sidebar from "./Sidebar";

import {
  logout,
} from "../../services/authService";

function DashboardLayout({
  children,
}) {
  function handleLogout() {
    logout();

    window.location.href =
      "/login";
  }

  return (
    <div className="flex bg-stone-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-8 py-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="bg-stone-900 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;