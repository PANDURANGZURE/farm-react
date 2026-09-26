import {
  LayoutDashboard,
  Milk,
  Egg,
  Wallet,
  ShoppingCart,
  BarChart3,
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Milk", icon: Milk },
  { name: "Eggs", icon: Egg },
  { name: "Expenses", icon: Wallet },
  { name: "Sales", icon: ShoppingCart },

]

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-800 to-teal-700 text-white shadow-2xl">

      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl" />

      {/* Brand */}
      <div className="relative flex h-20 items-center gap-3 border-b border-white/10 px-6">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl shadow-lg backdrop-blur-md">
          🌾
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-wide text-white">
            Agri Pocket
          </h1>

          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-200/70">
            Management System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-2 p-4">

        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200/50">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon
          const active = activePage === item.name

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-white text-emerald-800 shadow-xl shadow-black/20"
                  : "text-emerald-50/75 hover:bg-white/10 hover:text-white"
              }`}
            >

              {/* Active Indicator */}
              {active && (
                <span className="absolute left-0 h-7 w-1 rounded-r-full bg-emerald-400" />
              )}

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  active
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-white/5 text-emerald-200 group-hover:bg-white/10 group-hover:text-white"
                }`}
              >
                <Icon size={18} />
              </div>

              <span>{item.name}</span>

              {active && (
                <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom Status */}
      <div className="relative border-t border-white/10 p-4">

        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg backdrop-blur-md">

          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/60">
              System Status
            </p>

            <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[9px] font-semibold text-emerald-200">
              ONLINE
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">

            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-300/40" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Database Connected
              </p>

              <p className="mt-0.5 text-[10px] text-emerald-100/50">
                MySQL • Local Server
              </p>
            </div>

          </div>
        </div>

        <p className="mt-4 text-center text-[9px] tracking-widest text-emerald-200/30">
          FARM MANAGEMENT • 2026
        </p>

      </div>
    </aside>
  )
}

export default Sidebar