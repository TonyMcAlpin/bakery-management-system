import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-stone-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        BakeryOS
      </h1>

      <nav className="flex flex-col gap-4">
        <Link to="/" className="hover:text-yellow-400">
          Dashboard
        </Link>

        <Link to="/recipes" className="hover:text-yellow-400">
          Recipes
        </Link>

        <Link to="/ingredients" className="hover:text-yellow-400">
          Ingredients
        </Link>

        <Link to="/purchases">
          Purchases
        </Link>

        <Link to="/sales" className="hover:text-yellow-400">
          Sales
        </Link>

        <Link to="/reports" className="hover:text-yellow-400">
          Reports
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;