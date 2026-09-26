import { useEffect, useMemo, useState } from "react"
import {
  Milk as MilkIcon,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  IndianRupee,
  TrendingUp,
  Droplets,
} from "lucide-react"

const API_URL = "http://127.0.0.1:5000"

function Milk() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [form, setForm] = useState({
    record_date: new Date().toISOString().split("T")[0],
    quantity: "",
    rate: "",
  })

  const fetchMilk = async () => {
    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/api/milk`)
      const data = await response.json()

      if (data.success) {
        setRecords(data.records || [])
      }
    } catch (error) {
      console.error("Milk fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMilk()
  }, [])

  const filteredRecords = useMemo(() => {
    return records.filter((record) =>
      record.record_date?.toLowerCase().includes(search.toLowerCase())
    )
  }, [records, search])

  const totalQuantity = records.reduce(
    (sum, record) => sum + Number(record.quantity || 0),
    0
  )

  const totalRevenue = records.reduce(
    (sum, record) => sum + Number(record.total || 0),
    0
  )

  const averageRate =
    totalQuantity > 0 ? totalRevenue / totalQuantity : 0

  const today = new Date().toISOString().split("T")[0]

  const todayRecords = records.filter(
    (record) => record.record_date === today
  )

  const todayQuantity = todayRecords.reduce(
    (sum, record) => sum + Number(record.quantity || 0),
    0
  )

  const todayRevenue = todayRecords.reduce(
    (sum, record) => sum + Number(record.total || 0),
    0
  )

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })

  const openAddModal = () => {
    setEditingId(null)

    setForm({
      record_date: today,
      quantity: "",
      rate: "",
    })

    setShowModal(true)
  }

  const openEditModal = (record) => {
    setEditingId(record.milk_id)

    setForm({
      record_date: record.record_date,
      quantity: record.quantity,
      rate: record.rate,
    })

    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.record_date || !form.quantity || !form.rate) {
      alert("Please fill all fields")
      return
    }

    try {
      const url = editingId
        ? `${API_URL}/api/milk/${editingId}`
        : `${API_URL}/api/milk`

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
        alert(data.error || "Something went wrong")
        return
      }

      closeModal()
      fetchMilk()
    } catch (error) {
      console.error(error)
      alert("Unable to connect to server")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(
        `${API_URL}/api/milk/${deleteId}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json()

      if (!data.success) {
        alert(data.error || "Delete failed")
        return
      }

      setDeleteId(null)
      fetchMilk()
    } catch (error) {
      console.error(error)
      alert("Unable to connect to server")
    }
  }

  const liveTotal =
    Number(form.quantity || 0) * Number(form.rate || 0)

  return (
    <div className="space-y-7">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-blue-500">
            <MilkIcon size={17} />
            <span>Milk Production</span>
          </div>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Milk Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track daily milk production, rates and revenue.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Milk Record
        </button>
      </div>

      {/* HERO PRODUCTION CARD */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-7 text-white shadow-lg">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Droplets size={25} />
              </div>

              <div>
                <p className="text-sm text-blue-100">
                  Total Milk Production
                </p>

                <h2 className="mt-1 text-4xl font-bold">
                  {totalQuantity.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                  <span className="ml-2 text-lg font-medium text-blue-100">
                    Litres
                  </span>
                </h2>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-6 text-blue-100">
              Monitor your farm's milk output and understand how
              production contributes to your overall revenue.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:min-w-[330px]">

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-blue-100">
                Today's Milk
              </p>

              <p className="mt-2 text-2xl font-bold">
                {todayQuantity.toLocaleString("en-IN")}
                <span className="ml-1 text-sm font-normal">
                  L
                </span>
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-blue-100">
                Average Rate
              </p>

              <p className="mt-2 text-2xl font-bold">
                ₹{averageRate.toFixed(2)}
                <span className="ml-1 text-sm font-normal">
                  /L
                </span>
              </p>
            </div>

            <div className="col-span-2 rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-blue-100">
                Total Milk Revenue
              </p>

              <p className="mt-2 text-2xl font-bold">
                ₹{formatCurrency(totalRevenue)}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Today's Production
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {todayQuantity.toLocaleString("en-IN")}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  L
                </span>
              </h3>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <MilkIcon size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            ₹{formatCurrency(todayRevenue)} generated today
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Average Rate
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                ₹{averageRate.toFixed(2)}
              </h3>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <TrendingUp size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Average earning per litre
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Revenue
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                ₹{formatCurrency(totalRevenue)}
              </h3>
            </div>

            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <IndianRupee size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            From {records.length} records
          </p>
        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Milk Production Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete history of milk production
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
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading milk records...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <MilkIcon
              size={40}
              className="mx-auto text-slate-200"
            />

            <p className="mt-3 text-sm font-medium text-slate-500">
              No milk records found
            </p>

            <button
              onClick={openAddModal}
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
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
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Rate / L
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
                    key={record.milk_id}
                    className="transition hover:bg-blue-50/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <CalendarDays
                          size={16}
                          className="text-blue-500"
                        />
                        {record.record_date}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                        {record.quantity} L
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
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => setDeleteId(record.milk_id)}
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
                  {editingId ? "Edit Milk Record" : "Add Milk Record"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Enter production details
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">

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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Milk Quantity (Litres)
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 125.5"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Rate per Litre
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 50"
                  value={form.rate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rate: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs text-blue-500">
                  Calculated Revenue
                </p>

                <p className="mt-1 text-xl font-bold text-blue-700">
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
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editingId ? "Update Record" : "Save Record"}
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
              This milk production record will be permanently deleted.
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

export default Milk;