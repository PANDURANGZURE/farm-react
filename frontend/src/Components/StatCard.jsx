function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

      </div>

    </div>
  )
}

export default StatCard