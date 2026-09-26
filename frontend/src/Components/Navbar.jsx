import { Bell, Search } from "lucide-react"

function Navbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="flex h-full items-center justify-between px-8">

        

        {/* Right */}
        <div className="flex items-center gap-5">

        

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