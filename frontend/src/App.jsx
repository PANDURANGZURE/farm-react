import Sidebar from "./Components/Sidebar"
import Navbar from "./Components/Navbar"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">
          <Dashboard />
        </div>
      </main>

    </div>
  )
}

export default App