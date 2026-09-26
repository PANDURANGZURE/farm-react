import { useState } from "react"

import Sidebar from "./Components/Sidebar"
import Navbar from "./Components/Navbar"
import FarmLoader from "./Components/FarmLoader"

import Dashboard from "./pages/Dashboard"
import Milk from "./pages/Milk"
import Eggs from "./pages/Eggs"
import Expenses from "./pages/Expenses"
import Sales from "./pages/Sales"

function App() {
  const [showLoader, setShowLoader] = useState(true)
  const [activePage, setActivePage] = useState("Dashboard")

  const renderPage = () => {
    switch (activePage) {
      case "Milk":
        return <Milk />

      case "Eggs":
        return <Eggs />

      case "Expenses":
        return <Expenses />

      case "Sales":
        return <Sales />

      case "Dashboard":
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Intro Loader */}
      {showLoader && (
        <FarmLoader
          onComplete={() => setShowLoader(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="ml-64 pt-20">
        <div className="p-8">
          {renderPage()}
        </div>
      </main>

    </div>
  )
}

export default App