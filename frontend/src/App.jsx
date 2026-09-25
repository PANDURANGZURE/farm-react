import { useEffect, useState } from "react"

function App() {
  const [message, setMessage] = useState("Connecting to backend...")

  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message)
      })
      .catch(() => {
        setMessage("Backend connection failed")
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-3xl">
          🌾
        </div>

        <h1 className="text-4xl font-bold text-white">
          Farm Management System
        </h1>

        <p className="mt-3 text-slate-400">
          React + Tailwind CSS + Flask + MySQL
        </p>

        <div className="mt-8 rounded-2xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Backend Status
          </p>

          <p className="mt-2 text-lg font-semibold text-green-400">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App