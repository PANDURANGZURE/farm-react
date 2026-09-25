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
  {
    name: "Reports",
    icon: BarChart3,
  },
]

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">

      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-2xl">
          🌾
        </div>

        <div>
          <h1 className="font-bold text-white">
            Farm
          </h1>

          <p className="text-xs text-slate-500">
            Management System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">

        {menuItems.map((item, index) => {
          const Icon = item.icon
          const active = index === 0

          return (
            <button
              key={item.name}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.name}
            </button>
          )
        })}

      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-xs text-slate-500">
            System Status
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />

            <span className="text-sm text-green-400">
              Database Connected
            </span>
          </div>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar