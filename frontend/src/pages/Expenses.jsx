import { useEffect, useMemo, useState } from "react"

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Wallet,
  IndianRupee,
  Receipt,
  X,
  CalendarDays,
  FileText,
  Tag,
} from "lucide-react"


const API_URL = "http://127.0.0.1:5000"


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


function Expenses() {

  const [expenses, setExpenses] = useState([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")

  const [showModal, setShowModal] = useState(false)

  const [editingExpense, setEditingExpense] = useState(null)

  const [deletingId, setDeletingId] = useState(null)


  const [form, setForm] = useState({
    expense_date: new Date().toISOString().split("T")[0],
    category: "Feed",
    description: "",
    amount: "",
  })


  // ==========================================
  // FETCH EXPENSES
  // ==========================================

  const fetchExpenses = async () => {

    try {

      setLoading(true)

      const response = await fetch(
        `${API_URL}/api/expenses`
      )

      const data = await response.json()

      if (data.success) {

        setExpenses(data.records)

      } else {

        alert(data.error || "Failed to load expenses")

      }

    } catch (error) {

      console.error(error)

      alert("Unable to connect to backend")

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    fetchExpenses()

  }, [])


  // ==========================================
  // FORM INPUT
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

  }


  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {

    setEditingExpense(null)

    setForm({
      expense_date: new Date().toISOString().split("T")[0],
      category: "Feed",
      description: "",
      amount: "",
    })

    setShowModal(true)

  }


  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (expense) => {

    setEditingExpense(expense)

    setForm({
      expense_date: expense.expense_date,
      category: expense.category,
      description: expense.description || "",
      amount: expense.amount,
    })

    setShowModal(true)

  }


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {

    setShowModal(false)

    setEditingExpense(null)

  }


  // ==========================================
  // ADD / UPDATE EXPENSE
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault()


    if (
      !form.expense_date ||
      !form.category ||
      !form.amount
    ) {

      alert("Please fill all required fields")

      return

    }


    if (Number(form.amount) <= 0) {

      alert("Amount must be greater than 0")

      return

    }


    try {

      const url = editingExpense
        ? `${API_URL}/api/expenses/${editingExpense.expense_id}`
        : `${API_URL}/api/expenses`


      const method = editingExpense
        ? "PUT"
        : "POST"


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


      if (!response.ok || !data.success) {

        alert(data.error || "Something went wrong")

        return

      }


      closeModal()

      fetchExpenses()

    } catch (error) {

      console.error(error)

      alert("Unable to connect to backend")

    }

  }


  // ==========================================
  // DELETE EXPENSE
  // ==========================================

  const handleDelete = async (expenseId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    )


    if (!confirmDelete) {

      return

    }


    try {

      setDeletingId(expenseId)


      const response = await fetch(
        `${API_URL}/api/expenses/${expenseId}`,
        {
          method: "DELETE",
        }
      )


      const data = await response.json()


      if (!response.ok || !data.success) {

        alert(data.error || "Unable to delete expense")

        return

      }


      fetchExpenses()

    } catch (error) {

      console.error(error)

      alert("Unable to connect to backend")

    } finally {

      setDeletingId(null)

    }

  }


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredExpenses = useMemo(() => {

    const query = search.toLowerCase().trim()


    if (!query) {

      return expenses

    }


    return expenses.filter((expense) => {

      return (
        expense.category?.toLowerCase().includes(query) ||
        expense.description?.toLowerCase().includes(query) ||
        expense.expense_date?.toLowerCase().includes(query)
      )

    })

  }, [expenses, search])


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalExpenses = useMemo(() => {

    return expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    )

  }, [expenses])


  const averageExpense = useMemo(() => {

    if (expenses.length === 0) {

      return 0

    }

    return totalExpenses / expenses.length

  }, [expenses, totalExpenses])


  const highestExpense = useMemo(() => {

    if (expenses.length === 0) {

      return 0

    }

    return Math.max(
      ...expenses.map((expense) =>
        Number(expense.amount || 0)
      )
    )

  }, [expenses])


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {

    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )

  }


  return (

    <div className="space-y-8">


      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">

              <Wallet
                size={24}
                className="text-red-600"
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                Expenses
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track and manage farm expenses
              </p>

            </div>

          </div>

        </div>


        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >

          <Plus size={18} />

          Add Expense

        </button>

      </div>


      {/* ==========================================
          STAT CARDS
      ========================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


        {/* TOTAL */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Total Expenses
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                ₹{formatCurrency(totalExpenses)}
              </h2>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">

              <IndianRupee
                size={20}
                className="text-red-600"
              />

            </div>

          </div>

        </div>


        {/* AVERAGE */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Average Expense
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                ₹{formatCurrency(averageExpense)}
              </h2>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">

              <Receipt
                size={20}
                className="text-orange-600"
              />

            </div>

          </div>

        </div>


        {/* HIGHEST */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Highest Expense
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                ₹{formatCurrency(highestExpense)}
              </h2>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">

              <Wallet
                size={20}
                className="text-purple-600"
              />

            </div>

          </div>

        </div>

      </div>


      {/* ==========================================
          SEARCH
      ========================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by category, description or date..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />

        </div>

      </div>


      {/* ==========================================
          TABLE
      ========================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Expense Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredExpenses.length} record
                {filteredExpenses.length !== 1 ? "s" : ""}
              </p>

            </div>

          </div>

        </div>


        {loading ? (

          <div className="flex items-center justify-center py-20">

            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          </div>

        ) : filteredExpenses.length === 0 ? (

          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">

              <Receipt
                size={28}
                className="text-slate-400"
              />

            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              No expenses found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">

              {search
                ? "Try changing your search."
                : "Start by adding your first farm expense."
              }

            </p>

            {!search && (

              <button
                onClick={openAddModal}
                className="mt-5 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >

                <Plus size={17} />

                Add Expense

              </button>

            )}

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredExpenses.map((expense) => (

                  <tr
                    key={expense.expense_id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <CalendarDays
                          size={17}
                          className="text-slate-400"
                        />

                        <span className="text-sm font-medium text-slate-700">
                          {expense.expense_date}
                        </span>

                      </div>

                    </td>


                    <td className="px-6 py-4">

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">

                        <Tag size={13} />

                        {expense.category}

                      </span>

                    </td>


                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2">

                        <FileText
                          size={16}
                          className="text-slate-400"
                        />

                        <span className="max-w-[300px] truncate text-sm text-slate-600">

                          {expense.description || "—"}

                        </span>

                      </div>

                    </td>


                    <td className="px-6 py-4 text-right">

                      <span className="text-sm font-bold text-red-600">

                        ₹{formatCurrency(expense.amount)}

                      </span>

                    </td>


                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            openEditModal(expense)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                        >

                          <Pencil size={16} />

                        </button>


                        <button
                          onClick={() =>
                            handleDelete(
                              expense.expense_id
                            )
                          }
                          disabled={
                            deletingId ===
                            expense.expense_id
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete"
                        >

                          {deletingId ===
                          expense.expense_id ? (

                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-600" />

                          ) : (

                            <Trash2 size={16} />

                          )}

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ==========================================
          ADD / EDIT MODAL
      ========================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">


            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  {editingExpense
                    ? "Edit Expense"
                    : "Add Expense"
                  }

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  {editingExpense
                    ? "Update expense details"
                    : "Enter the expense details"
                  }

                </p>

              </div>


              <button
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >

                <X size={20} />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >


              {/* DATE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Expense Date

                </label>

                <input
                  type="date"
                  name="expense_date"
                  value={form.expense_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />

              </div>


              {/* CATEGORY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Category

                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                >

                  {categories.map((category) => (

                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>

                  ))}

                </select>

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Description

                </label>

                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Example: Cattle feed purchase"
                  maxLength={255}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />

              </div>


              {/* AMOUNT */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Amount

                </label>

                <div className="relative">

                  <IndianRupee
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-400"
                  />

                </div>

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >

                  {editingExpense
                    ? "Update Expense"
                    : "Add Expense"
                  }

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  )

}


export default Expenses