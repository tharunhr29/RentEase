import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"

function AdminLayout() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout