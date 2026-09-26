import {
  LayoutDashboard,
  Milk,
  Egg,
  Wallet,
  ShoppingCart,
  BarChart3,
} from "lucide-react"

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Milk",
    icon: Milk,
  },
  {
    name: "Eggs",
    icon: Egg,
  },
  {
    name: "Expenses",
    icon: Wallet,
  },
  {
    name: "Sales",
    icon: ShoppingCart,
  },
  
]

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">

      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-2xl shadow-lg shadow-green-600/20">
          🌾
        </div>

        <div>
          <h1 className="font-bold tracking-wide text-white">
            Agri Pocket
          </h1>

          <p className="text-xs text-slate-500">
            Management System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon
          const active = activePage === item.name

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon
                size={19}
                className={`transition ${
                  active
                    ? "text-white"
                    : "text-slate-500 group-hover:text-green-400"
                }`}
              />

              <span>{item.name}</span>

              {active && (
                <span className="ml-auto h-2 w-2 rounded-full bg-white" />
              )}
            </button>
          )
        })}

      </nav>

      {/* Database Status */}
      <div className="border-t border-slate-800 p-4">

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

          <p className="text-xs font-medium text-slate-500">
            System Status
          </p>

          <div className="mt-3 flex items-center gap-2">

            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>

            <span className="text-sm font-medium text-green-400">
              Database Connected
            </span>

          </div>

          <p className="mt-2 text-xs text-slate-600">
            MySQL • Local Server
          </p>

        </div>

      </div>

    </aside>
  )
}

export default Sidebar