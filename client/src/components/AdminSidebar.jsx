import { Link, useLocation } from "react-router-dom"

function AdminSidebar() {
  const location = useLocation()

  const links = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Managers & Users", path: "/admin/users", icon: "👥" },
    { name: "Schedules & Logistics", path: "/admin/logistics", icon: "🚚" },
    { name: "Maintenance", path: "/admin/maintenance", icon: "🔧" },
    { name: "Claims & Disputes", path: "/admin/claims", icon: "⚖️" },
    { name: "Service areas", path: "/admin/locations", icon: "📍" },
    { name: "Orders", path: "/admin/orders", icon: "🧾" },
    { name: "Customer Reviews", path: "/admin/reviews", icon: "💬" },
  ]

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-6 sticky top-0">
      <div className="mb-10">
        <h2 className="text-xl font-bold text-green-400">RentEase Admin</h2>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Management Suite</p>
      </div>

      <nav className="space-y-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-4 p-3 rounded-xl transition ${
              location.pathname === link.path
                ? "bg-green-600 text-white shadow-lg"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <span>{link.icon}</span>
            <span className="font-medium text-sm">{link.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-20 p-4 bg-gray-800 rounded-xl border border-gray-700">
        <p className="text-xs text-gray-400">System Priority</p>
        <p className="text-sm font-bold mt-1 text-yellow-400">Online & Syncing</p>
      </div>
    </div>
  )
}

export default AdminSidebar
