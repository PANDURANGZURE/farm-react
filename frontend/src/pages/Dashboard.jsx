import { useEffect, useMemo, useState } from "react"

import {
  IndianRupee,
  Milk,
  Egg,
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  CalendarDays,
} from "lucide-react"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const API_URL = "http://127.0.0.1:5000"

function Dashboard() {
  const [milk, setMilk] = useState([])
  const [eggs, setEggs] = useState([])
  const [expenses, setExpenses] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const responses = await Promise.all([
        fetch(`${API_URL}/api/milk`),
        fetch(`${API_URL}/api/eggs`),
        fetch(`${API_URL}/api/expenses`),
        fetch(`${API_URL}/api/sales`),
      ])

      const data = await Promise.all(
        responses.map((response) => response.json())
      )

      if (data[0].success) setMilk(data[0].records || [])
      if (data[1].success) setEggs(data[1].records || [])
      if (data[2].success) setExpenses(data[2].records || [])
      if (data[3].success) setSales(data[3].records || [])
    } catch (error) {
      console.error("Dashboard error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // --------------------------------------------------
  // TOTALS
  // --------------------------------------------------

  const milkRevenue = useMemo(
    () => milk.reduce((sum, item) => sum + Number(item.total || 0), 0),
    [milk]
  )

  const eggRevenue = useMemo(
    () => eggs.reduce((sum, item) => sum + Number(item.total || 0), 0),
    [eggs]
  )

  const salesRevenue = useMemo(
    () => sales.reduce((sum, item) => sum + Number(item.total || 0), 0),
    [sales]
  )

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses]
  )

  /*
    Sales is treated as a separate revenue source.
    If your Sales table contains Milk/Egg sales already,
    remove salesRevenue from totalRevenue to avoid double counting.
  */
  const totalRevenue = milkRevenue + eggRevenue + salesRevenue

  const netProfit = totalRevenue - totalExpenses

  const totalMilk = milk.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  )

  const totalEggs = eggs.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  )

  const profitMargin =
    totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

  // --------------------------------------------------
  // FORMATTERS
  // --------------------------------------------------

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

  const formatNumber = (number) =>
    Number(number || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })

  // --------------------------------------------------
  // MONTHLY CHART
  // --------------------------------------------------

  const monthlyData = useMemo(() => {
    const months = {}

    milk.forEach((item) => {
      const month = item.record_date?.slice(0, 7)

      if (!month) return

      if (!months[month]) {
        months[month] = {
          month,
          revenue: 0,
          expenses: 0,
        }
      }

      months[month].revenue += Number(item.total || 0)
    })

    eggs.forEach((item) => {
      const month = item.record_date?.slice(0, 7)

      if (!month) return

      if (!months[month]) {
        months[month] = {
          month,
          revenue: 0,
          expenses: 0,
        }
      }

      months[month].revenue += Number(item.total || 0)
    })

    sales.forEach((item) => {
      const month = item.sale_date?.slice(0, 7)

      if (!month) return

      if (!months[month]) {
        months[month] = {
          month,
          revenue: 0,
          expenses: 0,
        }
      }

      months[month].revenue += Number(item.total || 0)
    })

    expenses.forEach((item) => {
      const month = item.expense_date?.slice(0, 7)

      if (!month) return

      if (!months[month]) {
        months[month] = {
          month,
          revenue: 0,
          expenses: 0,
        }
      }

      months[month].expenses += Number(item.amount || 0)
    })

    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map((item) => ({
        ...item,
        name: new Date(`${item.month}-01`).toLocaleDateString("en-IN", {
          month: "short",
        }),
        profit: item.revenue - item.expenses,
      }))
  }, [milk, eggs, sales, expenses])

  // --------------------------------------------------
  // EXPENSE CATEGORY DATA
  // --------------------------------------------------

  const expenseCategoryData = useMemo(() => {
    const categories = {}

    expenses.forEach((expense) => {
      const category = expense.category || "Other"

      categories[category] =
        (categories[category] || 0) + Number(expense.amount || 0)
    })

    return Object.entries(categories)
      .map(([name, amount]) => ({
        name,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)
  }, [expenses])

  // --------------------------------------------------
  // RECENT TRANSACTIONS
  // --------------------------------------------------

  const recentTransactions = useMemo(() => {
    const transactions = [
      ...sales.map((item) => ({
        id: `sale-${item.sale_id}`,
        date: item.sale_date,
        title: item.product,
        type: "Sale",
        amount: Number(item.total || 0),
        positive: true,
      })),

      ...expenses.map((item) => ({
        id: `expense-${item.expense_id}`,
        date: item.expense_date,
        title: item.category,
        type: "Expense",
        amount: Number(item.amount || 0),
        positive: false,
      })),
    ]

    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6)
  }, [sales, expenses])

  // --------------------------------------------------
  // CARD COMPONENT
  // --------------------------------------------------

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    iconClass,
    badge,
  }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            {badge && (
              <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                {badge}
              </span>
            )}

            <span className="text-xs text-slate-400">{subtitle}</span>
          </div>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-7">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CalendarDays size={15} />
            <span>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Farm Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor your farm production, revenue and expenses.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Data
        </button>
      </div>

      {/* MAIN KPI CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Revenue"
          value={`₹${formatCurrency(totalRevenue)}`}
          subtitle="Overall income"
          badge="Income"
          icon={<IndianRupee size={21} />}
          iconClass="bg-green-50 text-green-600"
        />

        <StatCard
          title="Total Expenses"
          value={`₹${formatCurrency(totalExpenses)}`}
          subtitle="Farm spending"
          badge="Expense"
          icon={<Wallet size={21} />}
          iconClass="bg-red-50 text-red-600"
        />

        <StatCard
          title="Net Profit"
          value={`₹${formatCurrency(netProfit)}`}
          subtitle={`${profitMargin.toFixed(1)}% margin`}
          badge={netProfit >= 0 ? "Profit" : "Loss"}
          icon={
            netProfit >= 0 ? (
              <TrendingUp size={21} />
            ) : (
              <TrendingDown size={21} />
            )
          }
          iconClass={
            netProfit >= 0
              ? "bg-blue-50 text-blue-600"
              : "bg-orange-50 text-orange-600"
          }
        />

        <StatCard
          title="Sales Transactions"
          value={sales.length}
          subtitle="Total transactions"
          badge="Sales"
          icon={<ShoppingCart size={21} />}
          iconClass="bg-purple-50 text-purple-600"
        />

      </div>

      {/* PRODUCTION */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Farm Production
          </h2>

          <p className="text-sm text-slate-500">
            Current production and generated revenue
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* MILK */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Milk Production
                </p>

                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {formatNumber(totalMilk)}
                  <span className="ml-1 text-base font-medium text-slate-400">
                    L
                  </span>
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Revenue ₹{formatCurrency(milkRevenue)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Milk size={23} />
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-blue-100">
              <div className="h-full w-[72%] rounded-full bg-blue-500" />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {milk.length} production records
            </p>
          </div>

          {/* EGGS */}
          <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Egg Production
                </p>

                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {formatNumber(totalEggs)}
                  <span className="ml-1 text-base font-medium text-slate-400">
                    eggs
                  </span>
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Revenue ₹{formatCurrency(eggRevenue)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Egg size={23} />
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-orange-100">
              <div className="h-full w-[64%] rounded-full bg-orange-500" />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {eggs.length} production records
            </p>
          </div>

        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* MONTHLY PERFORMANCE */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Business Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Revenue, expenses and profit for recent months
            </p>
          </div>

          <div className="h-[330px]">
            {monthlyData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No monthly data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopOpacity={0.25} />
                      <stop offset="100%" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient
                      id="profitGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopOpacity={0.2} />
                      <stop offset="100%" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    formatter={(value) =>
                      `₹${formatCurrency(value)}`
                    }
                  />

                  <Legend />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />

                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    strokeWidth={2}
                    fill="url(#profitGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* EXPENSE BREAKDOWN */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Expense Breakdown
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Spending by category
            </p>
          </div>

          {expenseCategoryData.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-slate-400">
              No expense data available
            </div>
          ) : (
            <div className="space-y-5">
              {expenseCategoryData.map((item, index) => {
                const percentage =
                  totalExpenses > 0
                    ? (item.amount / totalExpenses) * 100
                    : 0

                return (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {item.name}
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        ₹{formatCurrency(item.amount)}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {percentage.toFixed(1)}% of expenses
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* REVENUE SOURCES */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Revenue Sources
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Income generated from different farm activities
          </p>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                {
                  name: "Milk",
                  amount: milkRevenue,
                },
                {
                  name: "Eggs",
                  amount: eggRevenue,
                },
                {
                  name: "Sales",
                  amount: salesRevenue,
                },
              ]}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value) =>
                  `₹${formatCurrency(value)}`
                }
              />

              <Bar
                dataKey="amount"
                name="Revenue"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest income and expense activity
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            Latest 6
          </span>

        </div>

        {recentTransactions.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-400">
            No transactions available
          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      transaction.positive
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {transaction.positive ? (
                      <ArrowUpRight size={19} />
                    ) : (
                      <ArrowDownRight size={19} />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {transaction.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {transaction.type} • {transaction.date}
                    </p>
                  </div>

                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      transaction.positive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.positive ? "+" : "-"}₹
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  )
}

export default Dashboard;