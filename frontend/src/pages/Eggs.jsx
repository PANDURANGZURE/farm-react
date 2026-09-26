import { useEffect, useState } from "react"

import {
  Egg as EggIcon,
  Plus,
  Search,
  X,
  IndianRupee,
  TrendingUp,
  CalendarDays,
  Pencil,
  Trash2,
} from "lucide-react"

import StatCard from "../Components/StatCard"


const API_URL = "http://127.0.0.1:5000"


function Eggs() {

  const [records, setRecords] = useState([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")

  const [showModal, setShowModal] = useState(false)

  const [saving, setSaving] = useState(false)

  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    record_date: "",
    quantity: "",
    rate: "",
  })


  // ==========================================
  // LOAD RECORDS
  // ==========================================

  const loadRecords = async () => {

    try {

      setLoading(true)

      const response = await fetch(
        `${API_URL}/api/eggs`
      )

      const data = await response.json()

      if (data.success) {

        setRecords(data.records)

      } else {

        alert(
          data.error ||
          "Failed to load egg records"
        )

      }

    } catch (error) {

      console.error(error)

      alert("Unable to connect to backend")

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {

    loadRecords()

  }, [])


  // ==========================================
  // FORM CHANGE
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

    setEditingId(null)

    setForm({
      record_date: "",
      quantity: "",
      rate: "",
    })

    setShowModal(true)
  }


  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (record) => {

    setEditingId(record.egg_id)

    setForm({
      record_date: record.record_date,
      quantity: record.quantity,
      rate: record.rate,
    })

    setShowModal(true)
  }


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {

    if (saving) {
      return
    }

    setShowModal(false)

    setEditingId(null)

    setForm({
      record_date: "",
      quantity: "",
      rate: "",
    })
  }


  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setSaving(true)

      const url = editingId
        ? `${API_URL}/api/eggs/${editingId}`
        : `${API_URL}/api/eggs`

      const method = editingId
        ? "PUT"
        : "POST"


      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            record_date: form.record_date,
            quantity: Number(form.quantity),
            rate: Number(form.rate),
          }),
        }
      )


      const data = await response.json()


      if (!response.ok) {

        alert(
          data.error ||
          "Operation failed"
        )

        return
      }


      alert(
        editingId
          ? "Egg record updated successfully"
          : "Egg record added successfully"
      )


      closeModal()

      await loadRecords()


    } catch (error) {

      console.error(error)

      alert("Unable to connect to backend")

    } finally {

      setSaving(false)

    }
  }


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (eggId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this egg record?"
    )


    if (!confirmed) {
      return
    }


    try {

      const response = await fetch(
        `${API_URL}/api/eggs/${eggId}`,
        {
          method: "DELETE",
        }
      )


      const data = await response.json()


      if (!response.ok) {

        alert(
          data.error ||
          "Failed to delete record"
        )

        return
      }


      alert(
        "Egg record deleted successfully"
      )


      await loadRecords()


    } catch (error) {

      console.error(error)

      alert("Unable to connect to backend")

    }
  }


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredRecords = records.filter(
    (record) =>
      record.record_date
        .toLowerCase()
        .includes(search.toLowerCase())
  )


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalEggs = records.reduce(
    (sum, record) =>
      sum + Number(record.quantity),
    0
  )


  const totalRevenue = records.reduce(
    (sum, record) =>
      sum + Number(record.total),
    0
  )


  const averageRate =
    records.length > 0 && totalEggs > 0
      ? totalRevenue / totalEggs
      : 0


  return (

    <div className="space-y-8">


      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-orange-600">
            Farm Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Egg Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track daily egg production and revenue.
          </p>

        </div>


        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
        >

          <Plus size={18} />

          Add Egg Record

        </button>

      </div>


      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Eggs"
          value={totalEggs.toLocaleString("en-IN")}
          subtitle="All recorded eggs"
          icon={<EggIcon size={22} />}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />


        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString(
            "en-IN",
            {
              maximumFractionDigits: 2,
            }
          )}`}
          subtitle="Egg sales"
          icon={<IndianRupee size={22} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />


        <StatCard
          title="Average Rate"
          value={`₹${averageRate.toFixed(2)}`}
          subtitle="Per egg"
          icon={<TrendingUp size={22} />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />


        <StatCard
          title="Records"
          value={records.length}
          subtitle="Total entries"
          icon={<CalendarDays size={22} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

      </div>


      {/* TABLE */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">


        {/* TABLE HEADER */}

        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Egg Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Daily egg production records
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
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500"
            />

          </div>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Quantity
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rate
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-sm text-slate-400"
                  >
                    Loading egg records...
                  </td>

                </tr>

              ) : filteredRecords.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <EggIcon
                        size={40}
                        className="text-slate-300"
                      />

                      <p className="mt-3 text-sm font-medium text-slate-500">
                        No egg records found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Add your first egg record.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredRecords.map((record) => (

                  <tr
                    key={record.egg_id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      #{record.egg_id}
                    </td>


                    <td className="px-6 py-4 text-sm text-slate-600">
                      {record.record_date}
                    </td>


                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      {Number(record.quantity).toLocaleString("en-IN")} eggs
                    </td>


                    <td className="px-6 py-4 text-sm text-slate-600">
                      ₹{Number(record.rate).toFixed(2)}
                    </td>


                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      ₹
                      {Number(record.total).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>


                    {/* ACTIONS */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2">


                        <button
                          onClick={() =>
                            openEditModal(record)
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                        >

                          <Pencil size={17} />

                        </button>


                        <button
                          onClick={() =>
                            handleDelete(
                              record.egg_id
                            )
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >

                          <Trash2 size={17} />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ADD / EDIT MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">


            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  {editingId
                    ? "Edit Egg Record"
                    : "Add Egg Record"}

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  {editingId
                    ? "Update egg production details."
                    : "Enter egg production details."}

                </p>

              </div>


              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
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

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  name="record_date"
                  value={form.record_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />

              </div>


              {/* QUANTITY */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Egg Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Example: 120"
                  min="1"
                  step="1"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />

              </div>


              {/* RATE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Rate per Egg (₹)
                </label>

                <input
                  type="number"
                  name="rate"
                  value={form.rate}
                  onChange={handleChange}
                  placeholder="Example: 7"
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />

              </div>


              {/* TOTAL */}

              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-orange-700">
                    Estimated Total
                  </span>

                  <span className="text-xl font-bold text-orange-700">

                    ₹
                    {(
                      Number(form.quantity || 0) *
                      Number(form.rate || 0)
                    ).toFixed(2)}

                  </span>

                </div>

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Record"
                    : "Save Record"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  )
}

export default Eggs