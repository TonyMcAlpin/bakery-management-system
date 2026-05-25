function Dashboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">
            Revenue
          </h2>

          <p className="text-3xl font-bold mt-2">
            $0.00
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">
            Profit
          </h2>

          <p className="text-3xl font-bold mt-2">
            $0.00
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">
            Inventory Alerts
          </h2>

          <p className="text-3xl font-bold mt-2">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">
            Recipes
          </h2>

          <p className="text-3xl font-bold mt-2">
            0
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;