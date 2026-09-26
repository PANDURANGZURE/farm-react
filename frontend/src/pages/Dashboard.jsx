import { useEffect, useMemo, useState } from "react"

import {
  IndianRupee,
  Milk,
  Egg,
  ShoppingCart,
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react"

import {
  ResponsiveContainer,
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


  // ==========================================
  // FETCH ALL DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {

    try {

      setLoading(true)

      const [
        milkResponse,
        eggsResponse,
        expensesResponse,
        salesResponse,
      ] = await Promise.all([

        fetch(`${API_URL}/api/milk`),

        fetch(`${API_URL}/api/eggs`),

        fetch(`${API_URL}/api/expenses`),

        fetch(`${API_URL}/api/sales`),

      ])


      const [
        milkData,
        eggsData,
        expensesData,
        salesData,
      ] = await Promise.all([

        milkResponse.json(),

        eggsResponse.json(),

        expensesResponse.json(),

        salesResponse.json(),

      ])


      if (milkData.success) {
        setMilk(milkData.records)
      }

      if (eggsData.success) {
        setEggs(eggsData.records)
      }

      if (expensesData.success) {
        setExpenses(expensesData.records)
      }

      if (salesData.success) {
        setSales(salesData.records)
      }

    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      )

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    fetchDashboardData()

  }, [])


  // ==========================================
  // CALCULATIONS
  // ==========================================

  const milkRevenue = useMemo(() => {

    return milk.reduce(
      (sum, record) =>
        sum + Number(record.total || 0),
      0
    )

  }, [milk])


  const eggRevenue = useMemo(() => {

    return eggs.reduce(
      (sum, record) =>
        sum + Number(record.total || 0),
      0
    )

  }, [eggs])


  const salesRevenue = useMemo(() => {

    return sales.reduce(
      (sum, record) =>
        sum + Number(record.total || 0),
      0
    )

  }, [sales])


  const totalExpenses = useMemo(() => {

    return expenses.reduce(
      (sum, record) =>
        sum + Number(record.amount || 0),
      0
    )

  }, [expenses])


  const totalRevenue =
    milkRevenue +
    eggRevenue +
    salesRevenue


  const netProfit =
    totalRevenue -
    totalExpenses


  const totalMilk = useMemo(() => {

    return milk.reduce(
      (sum, record) =>
        sum + Number(record.quantity || 0),
      0
    )

  }, [milk])


  const totalEggs = useMemo(() => {

    return eggs.reduce(
      (sum, record) =>
        sum + Number(record.quantity || 0),
      0
    )

  }, [eggs])


  const formatCurrency = (amount) => {

    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )

  }


  // ==========================================
  // CHART DATA
  // ==========================================

  const chartData = [

    {
      name: "Milk",
      Revenue: milkRevenue,
    },

    {
      name: "Eggs",
      Revenue: eggRevenue,
    },

    {
      name: "Sales",
      Revenue: salesRevenue,
    },

    {
      name: "Expenses",
      Revenue: totalExpenses,
    },

  ]


  // ==========================================
  // RECENT DATA
  // ==========================================

  const recentSales = [...sales]
    .sort(
      (a, b) =>
        new Date(b.sale_date) -
        new Date(a.sale_date)
    )
    .slice(0, 5)


  const recentExpenses = [...expenses]
    .sort(
      (a, b) =>
        new Date(b.expense_date) -
        new Date(a.expense_date)
    )
    .slice(0, 5)


  // ==========================================
  // STAT CARD
  // ==========================================

  const StatCard = ({
    title,
    value,
    icon,
    iconBg,
    iconColor,
    subtitle,
  }) => (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h2>

          {subtitle && (

            <p className="mt-2 text-xs text-slate-400">
              {subtitle}
            </p>

          )}

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >

          <span className={iconColor}>
            {icon}
          </span>

        </div>

      </div>

    </div>

  )


  return (

    <div className="space-y-8">


      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Farm Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your farm business
          </p>

        </div>


        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* ==========================================
          MAIN STATISTICS
      ========================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">


        <StatCard
          title="Total Revenue"
          value={`₹${formatCurrency(totalRevenue)}`}
          icon={<IndianRupee size={21} />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          subtitle="Milk + Eggs + Sales"
        />


        <StatCard
          title="Total Expenses"
          value={`₹${formatCurrency(totalExpenses)}`}
          icon={<Wallet size={21} />}
          iconBg="bg-red-100"
          iconColor="text-red-600"
          subtitle={`${expenses.length} expense records`}
        />


        <StatCard
          title="Net Profit"
          value={`₹${formatCurrency(netProfit)}`}
          icon={
            netProfit >= 0
              ? <TrendingUp size={21} />
              : <TrendingDown size={21} />
          }
          iconBg={
            netProfit >= 0
              ? "bg-blue-100"
              : "bg-orange-100"
          }
          iconColor={
            netProfit >= 0
              ? "text-blue-600"
              : "text-orange-600"
          }
          subtitle="Revenue − Expenses"
        />


        <StatCard
          title="Sales Records"
          value={sales.length}
          icon={<ShoppingCart size={21} />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          subtitle="Total sales transactions"
        />

      </div>


      {/* ==========================================
          PRODUCTION STATISTICS
      ========================================== */}

      <div>

        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Production Overview
        </h2>


        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


          <StatCard
            title="Milk Produced"
            value={`${totalMilk.toLocaleString("en-IN")} L`}
            icon={<Milk size={21} />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            subtitle={`${milk.length} records`}
          />


          <StatCard
            title="Eggs Produced"
            value={totalEggs.toLocaleString("en-IN")}
            icon={<Egg size={21} />}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
            subtitle={`${eggs.length} records`}
          />


          <StatCard
            title="Product Sales"
            value={`₹${formatCurrency(salesRevenue)}`}
            icon={<ShoppingCart size={21} />}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            subtitle={`${sales.length} records`}
          />

        </div>

      </div>


      {/* ==========================================
          CHART
      ========================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-lg font-bold text-slate-900">
            Revenue Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Revenue and expense comparison
          </p>

        </div>


        <div className="h-[350px] w-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `₹${formatCurrency(value)}`
                }
              />

              <Legend />

              <Bar
                dataKey="Revenue"
                name="Amount"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* ==========================================
          RECENT TABLES
      ========================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


        {/* RECENT SALES */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <h2 className="text-lg font-bold text-slate-900">
              Recent Sales
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest sales transactions
            </p>

          </div>


          {recentSales.length === 0 ? (

            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No sales records available
            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {recentSales.map((sale) => (

                <div
                  key={sale.sale_id}
                  className="flex items-center justify-between px-6 py-4"
                >

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      {sale.product}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {sale.sale_date} •{" "}
                      {sale.quantity} units
                    </p>

                  </div>


                  <p className="text-sm font-bold text-emerald-600">
                    ₹{formatCurrency(sale.total)}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* RECENT EXPENSES */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <h2 className="text-lg font-bold text-slate-900">
              Recent Expenses
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest farm expenses
            </p>

          </div>


          {recentExpenses.length === 0 ? (

            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No expense records available
            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {recentExpenses.map((expense) => (

                <div
                  key={expense.expense_id}
                  className="flex items-center justify-between px-6 py-4"
                >

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      {expense.category}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {expense.expense_date}
                      {expense.description
                        ? ` • ${expense.description}`
                        : ""
                      }
                    </p>

                  </div>


                  <p className="text-sm font-bold text-red-600">
                    ₹{formatCurrency(expense.amount)}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>


    </div>

  )

}


export default Dashboard