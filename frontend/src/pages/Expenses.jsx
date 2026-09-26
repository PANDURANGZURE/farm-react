import { useEffect, useMemo, useState } from "react"
import {
  Wallet,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  TrendingDown,
  IndianRupee,
  Receipt,
  Package,
  Stethoscope,
  Users,
  Zap,
  Wrench,
  Truck,
} from "lucide-react"

const API_URL = "http://127.0.0.1:5000/api/expenses"

const categories = [
  "Feed",
  "Medicine",
  "Labour",
  "Electricity",
  "Equipment",
  "Transportation",
  "Maintenance",
  "Other",
]

const categoryIcons = {
  Feed: Package,
  Medicine: Stethoscope,
  Labour: Users,
  Electricity: Zap,
  Equipment: Wrench,
  Transportation: Truck,
  Maintenance: Wrench,
  Other: Receipt,
}

function Expenses() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("7days")

  const [showModal, setShowModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [form, setForm] = useState({
    expense_date: new Date().toISOString().split("T")[0],
    category: "Feed",
    description: "",
    amount: "",
  })

  // =========================
  // FETCH DATA
  // =========================

  const fetchExpenses = async () => {
    try {
      setLoading(true)

      const response = await fetch(API_URL)
      const data = await response.json()

      if (data.success) {
        setRecords(data.records)
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
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
  // FILTERED DATA
  // =========================

  const filteredRecords = useMemo(() => {
    let result = [...records]

    if (dateFilter !== "all") {
      const startDate = getStartDate()

      const today = new Date()
      today.setHours(23, 59, 59, 999)

      result = result.filter((record) => {
        const date = new Date(record.expense_date)

        return date >= startDate && date <= today
      })
    }

    if (search.trim()) {
      const value = search.toLowerCase()

      result = result.filter(
        (record) =>
          record.category.toLowerCase().includes(value) ||
          (record.description || "").toLowerCase().includes(value) ||
          record.expense_date.toLowerCase().includes(value)
      )
    }

    return result
  }, [records, dateFilter, search])

  // =========================
  // STATISTICS
  // =========================

  const totalExpenses = filteredRecords.reduce(
    (sum, record) => sum + Number(record.amount),
    0
  )

  const averageExpense =
    filteredRecords.length > 0
      ? totalExpenses / filteredRecords.length
      : 0

  const highestExpense =
    filteredRecords.length > 0
      ? Math.max(...filteredRecords.map((record) => Number(record.amount)))
      : 0

  // =========================
  // CATEGORY ANALYSIS
  // =========================

  const categoryTotals = useMemo(() => {
    const totals = {}

    filteredRecords.forEach((record) => {
      const category = record.category

      totals[category] =
        (totals[category] || 0) + Number(record.amount)
    })

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [filteredRecords])

  const maxCategoryAmount =
    categoryTotals.length > 0
      ? categoryTotals[0].amount
      : 1

  // =========================
  // FORM
  // =========================

  const openAddModal = () => {
    setEditingRecord(null)

    setForm({
      expense_date: new Date().toISOString().split("T")[0],
      category: "Feed",
      description: "",
      amount: "",
    })

    setShowModal(true)
  }

  const openEditModal = (record) => {
    setEditingRecord(record)

    setForm({
      expense_date: record.expense_date,
      category: record.category,
      description: record.description || "",
      amount: record.amount,
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
  // ADD / UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !form.expense_date ||
      !form.category ||
      !form.amount
    ) {
      alert("Please fill all required fields.")
      return
    }

    try {
      const url = editingRecord
        ? `${API_URL}/${editingRecord.expense_id}`
        : API_URL

      const method = editingRecord ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expense_date: form.expense_date,
          category: form.category,
          description: form.description,
          amount: Number(form.amount),
        }),
      })

      const data = await response.json()

      if (data.success) {
        closeModal()
        fetchExpenses()
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
        fetchExpenses()
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

      {/* HEADER */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 p-8 text-white shadow-xl">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <TrendingDown size={25} />
              </div>

              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                Cost Management
              </span>
            </div>

            <h1 className="text-3xl font-bold">
              Farm Expenses
            </h1>

            <p className="mt-2 max-w-xl text-orange-100">
              Monitor your farm spending and understand where your money goes.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-orange-600 shadow-lg transition hover:bg-orange-50"
          >
            <Plus size={19} />
            Add Expense
          </button>

        </div>
      </div>

      {/* FILTER */}
      

      {/* STAT CARDS */}
      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <IndianRupee size={22} />
            </div>

            <span className="text-xs font-semibold text-orange-500">
              TOTAL
            </span>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Total Expenses
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            ₹{totalExpenses.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>

        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <Receipt size={22} />
            </div>

            <span className="text-xs font-semibold text-red-500">
              AVERAGE
            </span>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Average Expense
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            ₹{averageExpense.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <TrendingDown size={22} />
            </div>

            <span className="text-xs font-semibold text-amber-500">
              HIGHEST
            </span>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Highest Expense
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            ₹{highestExpense.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>

      </div>

      {/* ANALYSIS */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* CATEGORY BREAKDOWN */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Spending by Category
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Where your farm money is being spent
            </p>
          </div>

          {categoryTotals.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No expense data available
            </div>
          ) : (
            <div className="space-y-5">

              {categoryTotals.slice(0, 6).map((item) => {
                const Icon =
                  categoryIcons[item.category] || Receipt

                const percentage =
                  (item.amount / totalExpenses) * 100

                return (
                  <div key={item.category}>

                    <div className="mb-2 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                          <Icon size={17} />
                        </div>

                        <span className="text-sm font-medium text-slate-700">
                          {item.category}
                        </span>

                      </div>

                      <span className="text-sm font-bold text-slate-800">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                        style={{
                          width: `${Math.max(
                            (item.amount / maxCategoryAmount) * 100,
                            4
                          )}%`,
                        }}
                      />

                    </div>

                    <p className="mt-1 text-right text-xs text-slate-400">
                      {percentage.toFixed(1)}%
                    </p>

                  </div>
                )
              })}

            </div>
          )}
        </div>

        {/* RECENT SPENDING */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Expense Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredRecords.length} records found
              </p>
            </div>

            <div className="relative w-full md:w-64">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search expenses..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

            </div>

          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">
              Loading expenses...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <Wallet size={25} />
              </div>

              <p className="mt-4 font-semibold text-slate-700">
                No expenses found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Add an expense or change the selected period.
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {filteredRecords.map((record) => {
                const Icon =
                  categoryIcons[record.category] || Receipt

                return (
                  <div
                    key={record.expense_id}
                    className="flex flex-col gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-orange-200 hover:bg-orange-50/30 md:flex-row md:items-center"
                  >

                    <div className="flex min-w-0 flex-1 items-center gap-4">

                      <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                        <Icon size={20} />
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold text-slate-800">
                            {record.category}
                          </h3>

                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            {record.expense_date}
                          </span>

                        </div>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {record.description || "No description"}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center justify-between gap-4 md:justify-end">

                      <span className="text-lg font-bold text-red-600">
                        - ₹{Number(record.amount).toLocaleString("en-IN")}
                      </span>

                      <div className="flex gap-1">

                        <button
                          onClick={() => openEditModal(record)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => setDeleteId(record.expense_id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>

                  </div>
                )
              })}

            </div>
          )}

        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingRecord
                    ? "Edit Expense"
                    : "Add Expense"}
                </h2>

                <p className="text-sm text-slate-500">
                  Record your farm spending
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
                  Expense Date
                </label>

                <input
                  type="date"
                  name="expense_date"
                  value={form.expense_date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  {categories.map((category) => (
                    <option key={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Example: Cattle feed purchase"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
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
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
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
                  className="flex-1 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600"
                >
                  {editingRecord
                    ? "Update Expense"
                    : "Save Expense"}
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
              Delete Expense?
            </h2>

            <p className="mt-2 text-center text-sm text-slate-500">
              This expense will be permanently deleted.
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

export default Expenses