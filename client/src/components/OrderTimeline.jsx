import React from "react"

const steps = [
  "placed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "active",
  "return_requested",
  "picked_up",
  "completed"
]

const labels = {
  placed: "Order Placed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  active: "Rental Active",
  return_requested: "Return Requested",
  picked_up: "Picked Up",
  completed: "Completed"
}

function OrderTimeline({ status, timeline = [] }) {

  const currentIndex = steps.indexOf(status)

  // Convert timeline array → object for quick lookup
  const statusDates = {}
  timeline.forEach(item => {
    statusDates[item.status] = item.date
  })

  return (

    <div className="w-full py-6">

      <div className="flex items-center justify-between relative">

        {steps.map((step, index) => {

          const completed = index <= currentIndex

          return (

            <div key={step} className="flex-1 text-center relative">

              {/* 🔗 Connecting Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-1 
                  ${index < currentIndex ? "bg-green-500" : "bg-gray-300"}`}
                />
              )}

              {/* 🔵 Circle */}
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center relative z-10
                ${completed ? "bg-green-500 text-white" : "bg-gray-300"}`}
              >
                {completed ? "✓" : ""}
              </div>

              {/* 📍 Label */}
              <p className="text-xs mt-2 font-medium">
                {labels[step]}
              </p>

              {/* 📅 Date */}
              {statusDates[step] && (
                <p className="text-[10px] text-gray-500">
                  {new Date(statusDates[step]).toLocaleDateString()}
                </p>
              )}

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default OrderTimeline