function AdminCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

export default AdminCard