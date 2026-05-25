import {
  useEffect,
  useState,
} from "react";

import {
  getSummaryReport,
} from "../services/reportService";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Reports() {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const [startDate, setStartDate] =
    useState(today);

  const [endDate, setEndDate] =
    useState(today);

  const [report, setReport] =
    useState(null);

  useEffect(() => {
    loadReport(today, today);
  }, []);

  async function loadReport(
    start,
    end
  ) {
    try {
      const data =
        await getSummaryReport(
          start,
          end
        );

      setReport(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function setDailyReport() {
    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    setStartDate(today);
    setEndDate(today);

    loadReport(today, today);
  }

  async function setWeeklyReport() {
    const today = new Date();

    const firstDay =
      new Date();

    firstDay.setDate(
      today.getDate() - 7
    );

    const start =
      firstDay
        .toISOString()
        .split("T")[0];

    const end =
      new Date()
        .toISOString()
        .split("T")[0];

    setStartDate(start);
    setEndDate(end);

    loadReport(start, end);
  }

  async function setMonthlyReport() {
    const today = new Date();

    const firstDay =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

    const start =
      firstDay
        .toISOString()
        .split("T")[0];

    const end =
      new Date()
        .toISOString()
        .split("T")[0];

    setStartDate(start);
    setEndDate(end);

    loadReport(start, end);
  }

  async function handleCustomDateChange(
    newStartDate,
    newEndDate
  ) {
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    loadReport(
      newStartDate,
      newEndDate
    );
  }

  if (!report) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">
          Reports
        </h1>

        <div className="flex gap-3">
          <button
            onClick={
              setDailyReport
            }
            className="bg-stone-300 px-4 py-2 rounded-lg"
          >
            Daily
          </button>

          <button
            onClick={
              setWeeklyReport
            }
            className="bg-stone-300 px-4 py-2 rounded-lg"
          >
            Weekly
          </button>

          <button
            onClick={
              setMonthlyReport
            }
            className="bg-stone-300 px-4 py-2 rounded-lg"
          >
            Monthly
          </button>

          <button
            onClick={() =>
              window.print()
            }
            className="bg-stone-900 text-white px-4 py-2 rounded-lg"
          >
            Print Report
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            handleCustomDateChange(
              e.target.value,
              endDate
            )
          }
          className="border p-3 rounded-lg"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            handleCustomDateChange(
              startDate,
              e.target.value
            )
          }
          className="border p-3 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold">
            Revenue
          </h2>

          <p className="text-3xl mt-2">
            $
            {Number(
              report.summary
                .total_revenue || 0
            ).toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold">
            Profit
          </h2>

          <p className="text-3xl mt-2">
            $
            {Number(
              report.summary
                .total_profit || 0
            ).toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold">
            Sales Count
          </h2>

          <p className="text-3xl mt-2">
            {
              report.summary
                .total_sales
            }
          </p>
        </div>
      </div>

<div className="bg-white p-6 rounded-2xl shadow mb-6">
  <h2 className="text-2xl font-bold mb-4">
    Revenue & Profit Trend
  </h2>

  <div className="w-full">
    <LineChart
      width={1100}
      height={400}
      data={report.revenueTrend}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 20,
      }}
    >
      <CartesianGrid
        stroke="#ccc"
      />

      <XAxis
        dataKey="sale_date"
        stroke="#000"
      />

      <YAxis stroke="#000" />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="revenue"
        stroke="#2563eb"
        strokeWidth={3}
        dot={{ r: 6 }}
      />

      <Line
        type="monotone"
        dataKey="profit"
        stroke="#16a34a"
        strokeWidth={3}
        dot={{ r: 6 }}
      />
    </LineChart>
  </div>
</div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">
          Top Selling Products
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2">
                Product
              </th>

              <th className="pb-2">
                Qty Sold
              </th>
            </tr>
          </thead>

          <tbody>
            {report.topProducts.map(
              (product, index) => (
                <tr
                  key={index}
                  className="border-b"
                >
                  <td className="py-3">
                    {product.name}
                  </td>

                  <td>
                    {
                      product.total_quantity_sold
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;