import {
  Milk,
  Egg,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import StatCard from "../Components/StatCard"

function Dashboard() {
  return (
    <div>

      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your farm operations
          </p>
        </div>

        <button className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700">
          + Add Record
        </button>

      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Milk Revenue"
          value="₹45,200"
          subtitle="Total recorded revenue"
          icon={<Milk size={22} />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          title="Egg Revenue"
          value="₹32,850"
          subtitle="Total recorded revenue"
          icon={<Egg size={22} />}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />

        <StatCard
          title="Total Expenses"
          value="₹18,500"
          subtitle="Farm operating expenses"
          icon={<Wallet size={22} />}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />

        <StatCard
          title="Net Profit"
          value="₹59,550"
          subtitle="Revenue minus expenses"
          icon={<TrendingUp size={22} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

      </div>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        {/* Revenue Chart Placeholder */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-semibold text-slate-900">
                Revenue Overview
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Monthly farm revenue
              </p>
            </div>

            <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>This Year</option>
            </select>

          </div>

          <div className="mt-8 flex h-64 items-end gap-5 border-b border-slate-100 px-4">

            {[45, 65, 50, 80, 62, 92, 72, 85, 68, 95, 78, 88].map(
              (height, index) => (
                <div
                  key={index}
                  className="group flex flex-1 flex-col items-center justify-end"
                >
                  <div
                    style={{ height: `${height}%` }}
                    className="w-full max-w-10 rounded-t-lg bg-green-500 transition hover:bg-green-600"
                  />

                  <span className="mt-3 text-xs text-slate-400">
                    {[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ][index]}
                  </span>
                </div>
              )
            )}

          </div>

        </div>

        {/* Quick Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="font-semibold text-slate-900">
            Farm Summary
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Current performance
          </p>

          <div className="mt-6 space-y-5">

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Milk Production
              </span>

              <span className="font-semibold text-slate-800">
                1,250 L
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 w-[78%] rounded-full bg-green-500" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Eggs Produced
              </span>

              <span className="font-semibold text-slate-800">
                12,450
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 w-[65%] rounded-full bg-yellow-500" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Expenses
              </span>

              <span className="font-semibold text-slate-800">
                ₹18,500
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 w-[42%] rounded-full bg-red-500" />
            </div>

          </div>

          <div className="mt-8 rounded-xl bg-green-50 p-4">

            <div className="flex items-center gap-2 text-green-700">
              <ArrowUpRight size={18} />

              <span className="text-sm font-semibold">
                Profit is increasing
              </span>
            </div>

            <p className="mt-1 text-xs text-green-600">
              Compared with the previous period
            </p>

          </div>

        </div>

      </div>

      {/* Recent Activity */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Latest farm records
            </p>
          </div>

          <button className="text-sm font-medium text-green-600 hover:text-green-700">
            View All
          </button>

        </div>

        <div className="mt-6 overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <th className="pb-4">Type</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Description</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>

            <tbody className="text-sm">

              <tr className="border-b border-slate-50">
                <td className="py-4 font-medium text-slate-700">
                  🥛 Milk
                </td>

                <td className="py-4 text-slate-500">
                  Today
                </td>

                <td className="py-4 text-slate-500">
                  Milk sale
                </td>

                <td className="py-4 font-semibold text-green-600">
                  +₹4,500
                </td>

                <td className="py-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Completed
                  </span>
                </td>
              </tr>

              <tr className="border-b border-slate-50">
                <td className="py-4 font-medium text-slate-700">
                  🥚 Eggs
                </td>

                <td className="py-4 text-slate-500">
                  Yesterday
                </td>

                <td className="py-4 text-slate-500">
                  Egg sale
                </td>

                <td className="py-4 font-semibold text-green-600">
                  +₹2,800
                </td>

                <td className="py-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Completed
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-4 font-medium text-slate-700">
                  💸 Expense
                </td>

                <td className="py-4 text-slate-500">
                  Yesterday
                </td>

                <td className="py-4 text-slate-500">
                  Animal feed
                </td>

                <td className="py-4 font-semibold text-red-500">
                  -₹1,250
                </td>

                <td className="py-4">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                    Expense
                  </span>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Dashboard