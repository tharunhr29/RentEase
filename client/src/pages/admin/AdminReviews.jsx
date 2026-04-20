import { useEffect, useState } from "react"
import API from "../../services/api"

function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await API.get("/admin/reviews")
      setReviews(res.data?.reviews || [])
      setLoading(false)
    } catch (err) {
      console.error(err)
      setReviews([])
      setLoading(false)
    }
  }

  const handleDelete = async (productId, reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return

    try {
      await API.delete(`/admin/reviews/${productId}/${reviewId}`)
      alert("Review deleted")
      fetchReviews() // Refresh list
    } catch (err) {
      console.error(err)
      alert("Error deleting review")
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading reviews...</div>

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-gray-900">Review Moderation.</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage and handle product feedback across the platform.</p>
      </div>

      {(!reviews || reviews.length === 0) ? (
        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
          <p className="text-5xl mb-4">💬</p>
          <h2 className="text-2xl font-bold text-gray-400">No reviews found</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                      {r.productName}
                    </span>
                    <div className="flex text-xs text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < r.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">"{r.comment}"</h3>
                  <p className="text-sm text-gray-400">
                    By <span className="font-bold text-gray-600">{r.user?.name}</span> ({r.user?.email}) 
                    • {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(r.productId, r._id)}
                  className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  Delete Review
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminReviews
