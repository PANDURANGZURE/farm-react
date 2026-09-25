import { useState } from "react"

import Sidebar from "./Components/Sidebar"
import Navbar from "./Components/Navbar"
import Dashboard from "./pages/Dashboard"
import Milk from "./pages/Milk"

function App() {
  const [activePage, setActivePage] = useState("Dashboard")

  const renderPage = () => {
    switch (activePage) {
      case "Milk":
        return <Milk />

      case "Dashboard":
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">
          {renderPage()}
        </div>
      </main>

    </div>
  )
}

export default App