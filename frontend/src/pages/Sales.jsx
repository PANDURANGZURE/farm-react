import { useEffect, useMemo, useState } from "react"

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ShoppingCart,
  IndianRupee,
  Package,
  CalendarDays,
  Tag,
} from "lucide-react"


const API_URL = "http://127.0.0.1:5000"


const products = [
  "Milk",
  "Eggs",
  "Vegetables",
  "Fruits",
  "Grains",
  "Other",
]


function Sales() {

  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [editingSale, setEditingSale] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const [form, setForm] = useState({
    sale_date: new Date().toISOString().split("T")[0],
    product: "Milk",
    quantity: "",
    rate: "",
  })


  // ==========================================
  // FETCH SALES
  // ==========================================

  const fetchSales = async () => {

    try {

      setLoading(true)

      const response = await fetch(
        `${API_URL}/api/sales`
      )

      const data = await response.json()

      if (data.success) {

        setSales(data.records)

      } else {

        alert(data.error || "Failed to load sales")

      }

    } catch (error) {

      console.error(error)

      alert("Unable to connect to backend")

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    fetchSales()

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
  // OPEN ADD
  // ==========================================

  const openAddModal = () => {

    setEditingSale(null)

    setForm({
      sale_date: new Date().toISOString().split("T")[0],
      product: "Milk",
      quantity: "",
      rate: "",
    })

    setShowModal(true)

  }


  // ==========================================
  // OPEN EDIT
  // ==========================================

  const openEditModal = (sale) => {

    setEditingSale(sale)

    setForm({
      sale_date: sale.sale_date,
      product: sale.product,
      quantity: sale.quantity,
      rate: sale.rate,
    })

    setShowModal(true)

  }


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {

    setShowModal(false)
    setEditingSale(null)

  }


  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault()


    if (
      !form.sale_date ||
      !form.product ||
      !form.quantity ||
      !form.rate
    ) {

      alert("Please fill all required fields")

      return

    }


    if (
      Number(form.quantity) <= 0 ||
      Number(form.rate) <= 0
    ) {

      alert("Quantity and rate must be greater than 0")

      return

    }


    try {

      const url = editingSale
        ? `${API_URL}/api/sales/${editingSale.sale_id}`
        : `${API_URL}/api/sales`


      const method = editingSale
        ? "PUT"
        : "POST"


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


      if (!response.ok || !data.success) {

        alert(data.error || "Something went wrong")

        return

      }


      closeModal()

      fetchSales()

    } catch (error) {

      console.error(error)

      alert("Unable to connect to backend")

    }

  }


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (saleId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this sale?"
    )


    if (!confirmed) {

      return

    }


    try {

      setDeletingId(saleId)


      const response = await fetch(
        `${API_URL}/api/sales/${saleId}`,
        {
          method: "DELETE",
        }
      )


      const data = await response.json()


      if (!response.ok || !data.success) {

        alert(data.error || "Unable to delete sale")

        return

      }


      fetchSales()

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

  const filteredSales = useMemo(() => {

    const query = search.toLowerCase().trim()


    if (!query) {

      return sales

    }


    return sales.filter((sale) => {

      return (
        sale.product?.toLowerCase().includes(query) ||
        sale.sale_date?.toLowerCase().includes(query)
      )

    })

  }, [sales, search])


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalSales = useMemo(() => {

    return sales.reduce(
      (sum, sale) =>
        sum + Number(sale.total || 0),
      0
    )

  }, [sales])


  const totalQuantity = useMemo(() => {

    return sales.reduce(
      (sum, sale) =>
        sum + Number(sale.quantity || 0),
      0
    )

  }, [sales])


  const averageRate = useMemo(() => {

    if (sales.length === 0) {

      return 0

    }

    return (
      sales.reduce(
        (sum, sale) =>
          sum + Number(sale.rate || 0),
        0
      ) / sales.length
    )

  }, [sales])


  // ==========================================
  // CURRENCY
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

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">

            <ShoppingCart
              size={24}
              className="text-emerald-600"
            />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Sales
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track and manage farm product sales
            </p>

          </div>

        </div>


        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >

          <Plus size={18} />

          Add Sale

        </button>

      </div>


      {/* ==========================================
          STAT CARDS
      ========================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


        {/* TOTAL SALES */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Total Sales
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                ₹{formatCurrency(totalSales)}
              </h2>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">

              <IndianRupee
                size={20}
                className="text-emerald-600"
              />

            </div>

          </div>

        </div>


        {/* TOTAL QUANTITY */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Total Quantity
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {totalQuantity.toLocaleString("en-IN")}
              </h2>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">

              <Package
                size={20}
                className="text-blue-600"
              />

            </div>

          </div>

        </div>


        {/* AVERAGE RATE */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Average Rate
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                ₹{formatCurrency(averageRate)}
              </h2>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">

              <Tag
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
            placeholder="Search by product or date..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />

        </div>

      </div>


      {/* ==========================================
          SALES TABLE
      ========================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-bold text-slate-900">
            Sales Records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredSales.length} record
            {filteredSales.length !== 1 ? "s" : ""}
          </p>

        </div>


        {loading ? (

          <div className="flex items-center justify-center py-20">

            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          </div>

        ) : filteredSales.length === 0 ? (

          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">

              <ShoppingCart
                size={28}
                className="text-slate-400"
              />

            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              No sales found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try changing your search."
                : "Start by adding your first sale."
              }
            </p>

            {!search && (

              <button
                onClick={openAddModal}
                className="mt-5 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >

                <Plus size={17} />

                Add Sale

              </button>

            )}

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Rate
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredSales.map((sale) => (

                  <tr
                    key={sale.sale_id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <CalendarDays
                          size={17}
                          className="text-slate-400"
                        />

                        <span className="text-sm font-medium text-slate-700">
                          {sale.sale_date}
                        </span>

                      </div>

                    </td>


                    <td className="px-6 py-4">

                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                        <Tag size={13} />

                        {sale.product}

                      </span>

                    </td>


                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-700">

                      {Number(sale.quantity).toLocaleString("en-IN")}

                    </td>


                    <td className="px-6 py-4 text-right text-sm text-slate-600">

                      ₹{formatCurrency(sale.rate)}

                    </td>


                    <td className="px-6 py-4 text-right">

                      <span className="text-sm font-bold text-emerald-600">

                        ₹{formatCurrency(sale.total)}

                      </span>

                    </td>


                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            openEditModal(sale)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                        >

                          <Pencil size={16} />

                        </button>


                        <button
                          onClick={() =>
                            handleDelete(sale.sale_id)
                          }
                          disabled={
                            deletingId === sale.sale_id
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Delete"
                        >

                          {deletingId === sale.sale_id ? (

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


            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  {editingSale
                    ? "Edit Sale"
                    : "Add Sale"
                  }

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  {editingSale
                    ? "Update sale details"
                    : "Enter the product sale details"
                  }

                </p>

              </div>


              <button
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
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
                  Sale Date
                </label>

                <input
                  type="date"
                  name="sale_date"
                  value={form.sale_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />

              </div>


              {/* PRODUCT */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product
                </label>

                <select
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                >

                  {products.map((product) => (

                    <option
                      key={product}
                      value={product}
                    >
                      {product}
                    </option>

                  ))}

                </select>

              </div>


              {/* QUANTITY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />

              </div>


              {/* RATE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Rate
                </label>

                <div className="relative">

                  <IndianRupee
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    name="rate"
                    value={form.rate}
                    onChange={handleChange}
                    placeholder="Enter rate"
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-400"
                  />

                </div>

              </div>


              {/* LIVE TOTAL */}

              <div className="rounded-xl bg-emerald-50 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-emerald-700">
                    Total Sale
                  </span>

                  <span className="text-lg font-bold text-emerald-700">

                    ₹
                    {formatCurrency(
                      Number(form.quantity || 0) *
                      Number(form.rate || 0)
                    )}

                  </span>

                </div>

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >

                  {editingSale
                    ? "Update Sale"
                    : "Add Sale"
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


export default Sales