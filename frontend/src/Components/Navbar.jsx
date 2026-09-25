import { Bell, Search } from "lucide-react"

function Navbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="flex h-full items-center justify-between px-8">

        {/* Search */}
        <div className="relative w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100">
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="h-8 w-px bg-slate-200" />

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
              PZ
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Farm Admin
              </p>

              <p className="text-xs text-slate-400">
                Administrator
              </p>
            </div>

          </div>

        </div>

      </div>

    </header>
  )
}

export default Navbar