import { useLocation } from "react-router-dom"
import jsPDF from "jspdf"

function OrderSuccess(){
    const downloadInvoice = () => {

  const doc = new jsPDF()

  doc.text("RentEase Invoice", 20, 20)

  doc.text(`Order ID: ${order.orderId}`, 20, 40)
  doc.text(`Payment ID: ${order.paymentId}`, 20, 50)
  doc.text(`Amount: ₹${order.amount}`, 20, 60)

  let y = 80

  order.products.forEach(p=>{
    doc.text(`${p.name} - ₹${p.price}`,20,y)
    y += 10
  })

  doc.save("invoice.pdf")

}

  const location = useLocation()

  const order = location.state?.order

  if(!order){
    return <h2 className="p-10">No Order Found</h2>
  }

  return(

    <div className="p-10">

      <h1 className="text-3xl font-bold text-green-600 mb-6">
        🎉 Order Successful!
      </h1>

      <div className="border p-6 rounded-lg">

        <p><b>Order ID:</b> {order.orderId}</p>
        <p><b>Payment ID:</b> {order.paymentId}</p>
        <p><b>Total Amount:</b> ₹{order.amount}</p>

      </div>

      <h2 className="text-xl font-semibold mt-6">
        Ordered Items
      </h2>
      <button
onClick={downloadInvoice}
className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg">
Download Invoice
</button>

      {order.products.map((item)=>(
        <div key={item._id} className="flex justify-between border-b py-2">

          <span>{item.name}</span>

          <span>₹{item.price}</span>

        </div>
      ))}

    </div>
    

  )

}

export default OrderSuccess