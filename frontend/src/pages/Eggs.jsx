import { useEffect, useMemo, useState } from "react"
import {
  Egg as EggIcon,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  IndianRupee,
  Hash,
  BarChart3,
} from "lucide-react"

const API_URL = "http://127.0.0.1:5000"

function Eggs() {
  // =========================
  // STATE
  // =========================

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("7days")

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [form, setForm] = useState({
    record_date: new Date().toISOString().split("T")[0],
    quantity: "",
    rate: "",
  })

  // =========================
  // FETCH EGGS
  // =========================

  const fetchEggs = async () => {
    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/api/eggs`)
      const data = await response.json()

      if (data.success) {
        setRecords(data.records || [])
      }
    } catch (error) {
      console.error("Egg fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEggs()
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
  // FILTERED RECORDS
  // =========================

  const filteredRecords = useMemo(() => {
    let result = [...records]

    if (dateFilter !== "all") {
      const startDate = getStartDate()

      const endDate = new Date()
      endDate.setHours(23, 59, 59, 999)

      result = result.filter((record) => {
        const recordDate = new Date(record.record_date)

        return (
          recordDate >= startDate &&
          recordDate <= endDate
        )
      })
    }

    if (search.trim()) {
      const searchValue = search.toLowerCase()

      result = result.filter((record) =>
        record.record_date
          ?.toLowerCase()
          .includes(searchValue)
      )
    }

    return result
  }, [records, dateFilter, search])

  // =========================
  // STATISTICS
  // =========================

  const totalEggs = filteredRecords.reduce(
    (sum, record) =>
      sum + Number(record.quantity || 0),
    0
  )

  const totalRevenue = filteredRecords.reduce(
    (sum, record) =>
      sum + Number(record.total || 0),
    0
  )

  const averageRate =
    totalEggs > 0
      ? totalRevenue / totalEggs
      : 0

  // =========================
  // TODAY
  // =========================

  const today =
    new Date().toISOString().split("T")[0]

  const todayRecords = records.filter(
    (record) => record.record_date === today
  )

  const todayEggs = todayRecords.reduce(
    (sum, record) =>
      sum + Number(record.quantity || 0),
    0
  )

  const todayRevenue = todayRecords.reduce(
    (sum, record) =>
      sum + Number(record.total || 0),
    0
  )

  // =========================
  // MAX PRODUCTION
  // =========================

  const maxDailyQuantity = Math.max(
    ...filteredRecords.map((record) =>
      Number(record.quantity || 0)
    ),
    1
  )

  // =========================
  // FORMAT CURRENCY
  // =========================

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })

  // =========================
  // ADD MODAL
  // =========================

  const openAddModal = () => {
    setEditingId(null)

    setForm({
      record_date: today,
      quantity: "",
      rate: "",
    })

    setShowModal(true)
  }

  // =========================
  // EDIT MODAL
  // =========================

  const openEditModal = (record) => {
    setEditingId(record.egg_id)

    setForm({
      record_date: record.record_date,
      quantity: record.quantity,
      rate: record.rate,
    })

    setShowModal(true)
  }

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !form.record_date ||
      !form.quantity ||
      !form.rate
    ) {
      alert("Please fill all fields")
      return
    }

    try {
      const url = editingId
        ? `${API_URL}/api/eggs/${editingId}`
        : `${API_URL}/api/eggs`

      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          record_date: form.record_date,
          quantity: Number(form.quantity),
          rate: Number(form.rate),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        alert(data.error || data.message || "Something went wrong")
        return
      }

      closeModal()
      fetchEggs()
    } catch (error) {
      console.error(error)
      alert("Unable to connect to server")
    }
  }

  // =========================
  // DELETE
  // =========================

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(
        `${API_URL}/api/eggs/${deleteId}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json()

      if (!data.success) {
        alert(data.error || data.message || "Delete failed")
        return
      }

      setDeleteId(null)
      fetchEggs()
    } catch (error) {
      console.error(error)
      alert("Unable to connect to server")
    }
  }

  // =========================
  // LIVE TOTAL
  // =========================

  const liveTotal =
    Number(form.quantity || 0) *
    Number(form.rate || 0)

  // =========================
  // RETURN
  // =========================

  return (
    <div className="space-y-7">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-2 text-sm text-orange-500">
            <EggIcon size={17} />
            <span>Egg Production</span>
          </div>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Egg Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track egg production, quantities and earnings.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <Plus size={18} />
          Add Egg Record
        </button>

      </div>

      {/* DATE FILTER */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-2">
          <CalendarDays
            size={19}
            className="text-orange-500"
          />

          <span className="text-sm font-semibold text-slate-700">
            Production Period
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
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {label}
            </button>
          ))}

        </div>
      </div>

      {/* HERO */}
      <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm">

        <div className="flex flex-col gap-7 lg:flex-row lg:items-center">

          <div className="flex flex-1 items-center gap-5">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-orange-50 text-orange-500">
              <EggIcon size={39} />
            </div>

            <div>

              <p className="text-sm font-medium text-slate-500">
                Total Eggs Produced
              </p>

              <h2 className="mt-1 text-4xl font-bold text-slate-900">
                {totalEggs.toLocaleString("en-IN")}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {filteredRecords.length} production records
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[420px]">

            <div className="rounded-2xl bg-orange-50 p-4">

              <div className="flex items-center gap-2 text-orange-600">
                <Hash size={17} />
                <span className="text-xs font-semibold">
                  Today's Eggs
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {todayEggs.toLocaleString("en-IN")}
              </p>

            </div>

            <div className="rounded-2xl bg-green-50 p-4">

              <div className="flex items-center gap-2 text-green-600">
                <IndianRupee size={17} />
                <span className="text-xs font-semibold">
                  Revenue
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                ₹{formatCurrency(totalRevenue)}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Today's Production
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {todayEggs.toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="rounded-xl bg-white p-3 text-orange-500 shadow-sm">
              <EggIcon size={21} />
            </div>

          </div>

          <p className="mt-3 text-xs text-slate-400">
            ₹{formatCurrency(todayRevenue)} earned today
          </p>

        </div>

        <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Average Rate
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                ₹{averageRate.toFixed(2)}
              </h3>
            </div>

            <div className="rounded-xl bg-white p-3 text-purple-600 shadow-sm">
              <BarChart3 size={21} />
            </div>

          </div>

          <p className="mt-3 text-xs text-slate-400">
            Average earning per egg
          </p>

        </div>

        <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Revenue
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                ₹{formatCurrency(totalRevenue)}
              </h3>
            </div>

            <div className="rounded-xl bg-white p-3 text-green-600 shadow-sm">
              <IndianRupee size={21} />
            </div>

          </div>

          <p className="mt-3 text-xs text-slate-400">
            Selected period
          </p>

        </div>

      </div>

      {/* PRODUCTION ACTIVITY */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-lg font-bold text-slate-900">
            Production Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Egg production for the selected period
          </p>

        </div>

        {filteredRecords.length === 0 ? (

          <div className="py-10 text-center text-sm text-slate-400">
            No production activity available
          </div>

        ) : (

          <div className="space-y-4">

            {[...filteredRecords]
              .sort(
                (a, b) =>
                  new Date(b.record_date) -
                  new Date(a.record_date)
              )
              .slice(0, 6)
              .map((record) => {

                const quantity =
                  Number(record.quantity || 0)

                const width =
                  (quantity / maxDailyQuantity) * 100

                return (
                  <div key={record.egg_id}>

                    <div className="mb-2 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                          <EggIcon size={16} />
                        </span>

                        <span className="text-sm font-medium text-slate-700">
                          {record.record_date}
                        </span>

                      </div>

                      <span className="text-sm font-bold text-slate-800">
                        {quantity.toLocaleString("en-IN")} eggs
                      </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-orange-400 transition-all"
                        style={{
                          width: `${width}%`,
                        }}
                      />

                    </div>

                  </div>
                )
              })}

          </div>

        )}

      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Egg Production Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredRecords.length} records found
            </p>

          </div>

          <div className="relative w-full md:w-72">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />

          </div>

        </div>

        {loading ? (

          <div className="p-12 text-center text-sm text-slate-400">
            Loading egg records...
          </div>

        ) : filteredRecords.length === 0 ? (

          <div className="p-12 text-center">

            <EggIcon
              size={40}
              className="mx-auto text-slate-200"
            />

            <p className="mt-3 text-sm font-medium text-slate-500">
              No egg records found
            </p>

            <button
              onClick={openAddModal}
              className="mt-4 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Add your first record
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Eggs
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Rate / Egg
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredRecords.map((record) => (

                  <tr
                    key={record.egg_id}
                    className="transition hover:bg-orange-50/40"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">

                        <CalendarDays
                          size={16}
                          className="text-orange-500"
                        />

                        {record.record_date}

                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <span className="rounded-lg bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">
                        {Number(record.quantity).toLocaleString("en-IN")} eggs
                      </span>

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      ₹{Number(record.rate).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      ₹{formatCurrency(record.total)}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => openEditModal(record)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-orange-50 hover:text-orange-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => setDeleteId(record.egg_id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
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

      {/* ADD / EDIT MODAL */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-6">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  {editingId
                    ? "Edit Egg Record"
                    : "Add Egg Record"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Enter egg production details
                </p>

              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  value={form.record_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      record_date: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Number of Eggs
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 320"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Rate per Egg
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 6"
                  value={form.rate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rate: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

              </div>

              <div className="rounded-xl bg-orange-50 p-4">

                <p className="text-xs text-orange-500">
                  Calculated Revenue
                </p>

                <p className="mt-1 text-xl font-bold text-orange-700">
                  ₹{formatCurrency(liveTotal)}
                </p>

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  {editingId
                    ? "Update Record"
                    : "Save Record"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* DELETE MODAL */}
      {deleteId && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={21} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Delete this record?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This egg production record will be permanently deleted.
            </p>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
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

export default Eggs