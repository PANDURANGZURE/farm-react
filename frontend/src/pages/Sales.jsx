import { useEffect, useMemo, useState } from "react"
import {
  ShoppingCart,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  TrendingUp,
  IndianRupee,
  Package,
  Milk,
  Egg,
  Sprout,
  Apple,
  Wheat,
  BarChart3,
} from "lucide-react"

const API_URL = "http://127.0.0.1:5000/api/sales"

const products = [
  "Milk",
  "Eggs",
  "Vegetables",
  "Fruits",
  "Grains",
  "Other",
]

const productIcons = {
  Milk: Milk,
  Eggs: Egg,
  Vegetables: Sprout,
  Fruits: Apple,
  Grains: Wheat,
  Other: Package,
}

function Sales() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("7days")

  const [showModal, setShowModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [form, setForm] = useState({
    sale_date: new Date().toISOString().split("T")[0],
    product: "Milk",
    quantity: "",
    rate: "",
  })

  // =========================
  // FETCH SALES
  // =========================

  const fetchSales = async () => {
    try {
      setLoading(true)

      const response = await fetch(API_URL)
      const data = await response.json()

      if (data.success) {
        setRecords(data.records)
      }
    } catch (error) {
      console.error("Error fetching sales:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  // =========================
  // DATE FILTER
  // =========================

  const getStartDate = () => {
    const today = new Date()
    const start = new Date(today)

    if (dateFilter === "7days") {
      start.setDate(today.getDate() - 6)
    }

    if (dateFilter === "1month") {
      start.setMonth(today.getMonth() - 1)
    }

    if (dateFilter === "6months") {
      start.setMonth(today.getMonth() - 6)
    }

    if (dateFilter === "1year") {
      start.setFullYear(today.getFullYear() - 1)
    }

    start.setHours(0, 0, 0, 0)

    return start
  }

  // =========================
  // FILTER
  // =========================

  const filteredRecords = useMemo(() => {
    let result = [...records]

    if (dateFilter !== "all") {
      const startDate = getStartDate()

      const today = new Date()
      today.setHours(23, 59, 59, 999)

      result = result.filter((record) => {
        const date = new Date(record.sale_date)

        return date >= startDate && date <= today
      })
    }

    if (search.trim()) {
      const value = search.toLowerCase()

      result = result.filter(
        (record) =>
          record.product.toLowerCase().includes(value) ||
          record.sale_date.toLowerCase().includes(value)
      )
    }

    return result
  }, [records, dateFilter, search])

  // =========================
  // STATISTICS
  // =========================

  const totalRevenue = filteredRecords.reduce(
    (sum, record) => sum + Number(record.total),
    0
  )

  const totalQuantity = filteredRecords.reduce(
    (sum, record) => sum + Number(record.quantity),
    0
  )

  const averageRate =
    filteredRecords.length > 0
      ? filteredRecords.reduce(
          (sum, record) => sum + Number(record.rate),
          0
        ) / filteredRecords.length
      : 0

  // =========================
  // PRODUCT ANALYSIS
  // =========================

  const productTotals = useMemo(() => {
    const totals = {}

    filteredRecords.forEach((record) => {
      const product = record.product

      totals[product] =
        (totals[product] || 0) + Number(record.total)
    })

    return Object.entries(totals)
      .map(([product, revenue]) => ({
        product,
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [filteredRecords])

  const topProduct =
    productTotals.length > 0
      ? productTotals[0]
      : null

  // =========================
  // TODAY
  // =========================

  const todayString = new Date().toISOString().split("T")[0]

  const todayRevenue = records
    .filter((record) => record.sale_date === todayString)
    .reduce((sum, record) => sum + Number(record.total), 0)

  // =========================
  // FORM
  // =========================

  const openAddModal = () => {
    setEditingRecord(null)

    setForm({
      sale_date: new Date().toISOString().split("T")[0],
      product: "Milk",
      quantity: "",
      rate: "",
    })

    setShowModal(true)
  }

  const openEditModal = (record) => {
    setEditingRecord(record)

    setForm({
      sale_date: record.sale_date,
      product: record.product,
      quantity: record.quantity,
      rate: record.rate,
    })

    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingRecord(null)
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // =========================
  // FORM TOTAL
  // =========================

  const formTotal =
    Number(form.quantity || 0) *
    Number(form.rate || 0)

  // =========================
  // ADD / UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !form.sale_date ||
      !form.product ||
      !form.quantity ||
      !form.rate
    ) {
      alert("Please fill all fields.")
      return
    }

    try {
      const url = editingRecord
        ? `${API_URL}/${editingRecord.sale_id}`
        : API_URL

      const method = editingRecord ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sale_date: form.sale_date,
          product: form.product,
          quantity: Number(form.quantity),
          rate: Number(form.rate),
        }),
      })

      const data = await response.json()

      if (data.success) {
        closeModal()
        fetchSales()
      } else {
        alert(data.message || "Operation failed.")
      }
    } catch (error) {
      console.error(error)
      alert("Server error.")
    }
  }

  // =========================
  // DELETE
  // =========================

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`${API_URL}/${deleteId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setDeleteId(null)
        fetchSales()
      } else {
        alert(data.message || "Delete failed.")
      }
    } catch (error) {
      console.error(error)
      alert("Server error.")
    }
  }

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 p-8 text-white shadow-xl">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <TrendingUp size={25} />
              </div>

              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                Revenue Management
              </span>

            </div>

            <h1 className="text-3xl font-bold">
              Farm Sales
            </h1>

            <p className="mt-2 max-w-xl text-emerald-100">
              Track product sales, revenue and selling performance.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-emerald-600 shadow-lg transition hover:bg-emerald-50"
          >
            <Plus size={19} />
            Record Sale
          </button>

        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-2">
          <CalendarDays
            size={19}
            className="text-emerald-600"
          />

          <span className="text-sm font-semibold text-slate-700">
            Sales Period
          </span>
        </div>

        <div className="flex flex-wrap gap-2">

          {[
            ["7days", "Past 7 Days"],
            ["1month", "1 Month"],
            ["6months", "6 Months"],
            ["1year", "1 Year"],
            ["all", "All Time"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setDateFilter(value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                dateFilter === value
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
              }`}
            >
              {label}
            </button>
          ))}

        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <IndianRupee size={22} />
            </div>

            <span className="text-xs font-semibold text-emerald-600">
              REVENUE
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Total Revenue
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            ₹{totalRevenue.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </h2>

        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Package size={22} />
            </div>

            <span className="text-xs font-semibold text-blue-600">
              QUANTITY
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Units Sold
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {totalQuantity.toLocaleString("en-IN")}
          </h2>

        </div>

        <div className="rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
              <BarChart3 size={22} />
            </div>

            <span className="text-xs font-semibold text-cyan-600">
              RATE
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Average Selling Rate
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            ₹{averageRate.toFixed(2)}
          </h2>

        </div>

        <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
              <TrendingUp size={22} />
            </div>

            <span className="text-xs font-semibold text-teal-600">
              TOP PRODUCT
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Best Revenue Product
          </p>

          <h2 className="mt-1 truncate text-2xl font-bold text-slate-900">
            {topProduct ? topProduct.product : "—"}
          </h2>

        </div>

      </div>

      {/* PRODUCT PERFORMANCE + TODAY */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* PRODUCT PERFORMANCE */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">

          <div className="mb-6">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <BarChart3 size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Product Performance
                </h2>

                <p className="text-sm text-slate-500">
                  Revenue generated by each product
                </p>
              </div>

            </div>

          </div>

          {productTotals.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No sales data available
            </div>
          ) : (
            <div className="space-y-5">

              {productTotals.map((item) => {

                const Icon =
                  productIcons[item.product] || Package

                const percentage =
                  totalRevenue > 0
                    ? (item.revenue / totalRevenue) * 100
                    : 0

                return (
                  <div key={item.product}>

                    <div className="mb-2 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                          <Icon size={18} />
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-slate-800">
                            {item.product}
                          </p>

                          <p className="text-xs text-slate-400">
                            {percentage.toFixed(1)}% of revenue
                          </p>

                        </div>

                      </div>

                      <span className="font-bold text-slate-800">
                        ₹{item.revenue.toLocaleString("en-IN")}
                      </span>

                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-600"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                )
              })}

            </div>
          )}

        </div>

        {/* TODAY REVENUE */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 p-6 text-white shadow-lg lg:col-span-2">

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative">

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-white/20 p-3">
                <IndianRupee size={22} />
              </div>

              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                TODAY
              </span>

            </div>

            <p className="mt-8 text-emerald-100">
              Today's Revenue
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              ₹{todayRevenue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </h2>

            <div className="mt-8 border-t border-white/20 pt-5">

              <p className="text-sm text-emerald-100">
                Selected period
              </p>

              <p className="mt-1 text-lg font-semibold">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>

            </div>

          </div>
        </div>

      </div>

      {/* SALES RECORDS */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Sales Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredRecords.length} transactions found
            </p>

          </div>

          <div className="relative w-full md:w-72">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

          </div>

        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading sales...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ShoppingCart size={27} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No sales found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Record a sale or change the selected period.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead className="bg-slate-50">

                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                  <th className="px-6 py-4">
                    Date
                  </th>

                  <th className="px-6 py-4">
                    Product
                  </th>

                  <th className="px-6 py-4">
                    Quantity
                  </th>

                  <th className="px-6 py-4">
                    Rate
                  </th>

                  <th className="px-6 py-4">
                    Revenue
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredRecords.map((record) => {

                  const Icon =
                    productIcons[record.product] || Package

                  return (
                    <tr
                      key={record.sale_id}
                      className="transition hover:bg-emerald-50/40"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
                            <CalendarDays size={17} />
                          </div>

                          <span className="font-medium text-slate-700">
                            {record.sale_date}
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                            <Icon size={17} />
                          </div>

                          <span className="font-semibold text-slate-800">
                            {record.product}
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700">
                        {Number(record.quantity).toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        ₹{Number(record.rate).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 font-bold text-emerald-600">
                        ₹{Number(record.total).toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => openEditModal(record)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => setDeleteId(record.sale_id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  {editingRecord
                    ? "Edit Sale"
                    : "Record New Sale"}
                </h2>

                <p className="text-sm text-slate-500">
                  Enter product sales details
                </p>

              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Sale Date
                </label>

                <input
                  type="date"
                  name="sale_date"
                  value={form.sale_date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product
                </label>

                <select
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >

                  {products.map((product) => (
                    <option key={product}>
                      {product}
                    </option>
                  ))}

                </select>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="Example: 50"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Rate
                  </label>

                  <div className="relative">

                    <IndianRupee
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="rate"
                      value={form.rate}
                      onChange={handleChange}
                      placeholder="45"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />

                  </div>

                </div>

              </div>

              <div className="rounded-xl bg-emerald-50 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-emerald-700">
                    Total Revenue
                  </span>

                  <IndianRupee
                    size={19}
                    className="text-emerald-600"
                  />

                </div>

                <p className="mt-1 text-2xl font-bold text-emerald-700">
                  ₹{formTotal.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </p>

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                  {editingRecord
                    ? "Update Sale"
                    : "Save Sale"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={24} />
            </div>

            <h2 className="mt-4 text-center text-lg font-bold text-slate-900">
              Delete Sale?
            </h2>

            <p className="mt-2 text-center text-sm text-slate-500">
              This sales transaction will be permanently deleted.
            </p>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Sales