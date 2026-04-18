const dns = require("dns")
const Product = require("../models/Product")

const products = [

{
name:"Modern Sofa",
description:"A sleek, minimalist three-seater sofa with premium fabric upholstery. Perfect for contemporary living rooms.",
category:"Furniture",
price:699,
deposit:1500,
image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
stock:10,
availableStock:10
},

{
name:"Luxury Sofa",
description:"Sink into pure comfort with this velvet-finished luxury sofa. Features deep cushions and elegant wooden legs.",
category:"Furniture",
price:899,
deposit:2000,
image:"https://imgs.search.brave.com/Pp2yLwkz9O-LLBxuYypKBbdco1MeQ6TBiI_9IFtvf-o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcx/LmV4cG9ydGVyc2lu/ZGlhLmNvbS9wcm9k/dWN0X2ltYWdlcy9i/Yy1zbWFsbC8yMDE5/LzgvNDU5NDI1MS9s/dXh1cnktc29mYS0x/NTY1MTYyOTI2LTUw/MzUzNjUuanBlZw",
stock:8,
availableStock:8
},

{
name:"Wooden Coffee Table",
description:"Handcrafted from solid Sheesham wood, this coffee table adds a touch of rustic charm to your home.",
category:"Furniture",
price:299,
deposit:800,
image:"https://imgs.search.brave.com/ZS_hBQFg-ShFGNcM1P7wL7AD8vsMTlCMNXQ-9IuqYvw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pa2ly/dS5pbi9jZG4vc2hv/cC9maWxlcy83MXJn/N2lWSnZjTC5fU0wx/MDI0LmpwZz92PTE3/NjM5MDMzNjAmd2lk/dGg9MTAyNA",
stock:12,
availableStock:12
},

{
name:"Queen Size Bed",
description:"Sturdy and stylish Queen size bed frame with an upholstered headboard. Includes under-bed storage drawers.",
category:"Furniture",
price:799,
deposit:1800,
image:"https://imgs.search.brave.com/L9NRTyGzotf-nmnpbYT0Du8iML2cB3IOGEcymKQo-S4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/ZnVybmlzaGthLmNv/bS9jZG4vc2hvcC9m/aWxlcy9BZ2F0aGEt/U2hlZXNoYW0tV29v/ZC1iZWQtd2l0aC1V/cGhvbHN0ZXJlZC1o/ZWFkYm9hcmQtRHJh/d2VyLVN0b3JnZS1R/dWVlbi1TaXplLUZ1/cm5pc2hrYS01MzM2/MDg4NTAwNjY1Ny5q/cGc_dj0xNzcwNzg0/OTEwJndpZHRoPTUz/Mw",
stock:10,
availableStock:10
},

{
name:"Double Bed",
description:"Space-saving double bed perfect for smaller bedrooms or guest rooms. Minimalist design with high-quality wood.",
category:"Furniture",
price:899,
deposit:2000,
image:"https://imgs.search.brave.com/m_SdjQmI8S-RvVQUwOR8tA-giPYZfQQsDfA4hUzTfIU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdC5k/ZXBvc2l0cGhvdG9z/LmNvbS8yNzY1MjA0/LzQzMTMvaS80NTAv/ZGVwb3NpdHBob3Rv/c180MzEzMzcxOS1z/dG9jay1waG90by1k/b3VibGUtYmVkLmpw/Zw",
stock:8,
availableStock:8
},

{
name:"Wardrobe Closet",
description:"Spacious two-door wardrobe with multiple shelves and a hanging rod. Modern finish to match any decor.",
category:"Furniture",
price:499,
deposit:1200,
image:"https://imgs.search.brave.com/cXSfeO1JjbgTQo6n6zgvzyZTutyqUKvDKbzSJ4jGZpA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cmVudG1hY2hhLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAx/OC8xMC9wcmVtaWEt/d2FyZHJvYmUtb24t/cmVudC1jaGVubmFp/LW11bWJhaS1oeWRl/cmFiYWQtcmVudG1h/Y2hhLWxpZmVzdHls/ZS1pbWFnZS0zNjB4/MjcwLmpwZw",
stock:6,
availableStock:6
},

{
name:"Dining Table Set",
description:"Elegant 4-seater dining set made from durable materials. Includes comfortable cushioned chairs.",
category:"Furniture",
price:699,
deposit:1600,
image:"https://imgs.search.brave.com/jURmlyXYy0f2QHKYto6i_pPWSDFt5k9umEmmxqrF37w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2hvcHJlbnR3aXNl/LmNvbS9jZG4vc2hv/cC9maWxlcy9zdHVk/aW9fNjM5YTE5ZjM5/M2U4NjY5ODAzNTE2/NzEwNDcxNzFfNTMz/eC5qcGc_dj0xNzMz/NjMzNzIy",
stock:5,
availableStock:5
},

{
name:"Office Chair",
description:"Ergonomic office chair with lumbar support and adjustable height. Perfect for long working hours.",
category:"Furniture",
price:199,
deposit:500,
image:"https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
stock:15,
availableStock:15
},

{
name:"Study Desk",
description:"Compact and functional study desk with a built-in drawer. Ideal for home offices and student rooms.",
category:"Furniture",
price:249,
deposit:700,
image:"https://imgs.search.brave.com/poYxjkku_44ULbU4QRMsWIaLXrQuMH27bxtVnj0Enzk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9yZW50/b2Z1cm5pc2hlZC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjQvMTEvR3JhdGl0/dWRlLVN0dWR5LVRh/YmxlLXJlbnQtMzAw/eDMwMC5qcGc",
stock:10,
availableStock:10
},

{
name:"Bookshelf",
description:"Five-tier open bookshelf. Display your favorite books and decor with style.",
category:"Furniture",
price:299,
deposit:800,
image:"https://imgs.search.brave.com/eskqlnUZaVHiQl8K5Ow72SS7WMvj2Ll6XbD81ZZY2uU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9yZW50/YmVhbi5pbi9fbmV4/dC9pbWFnZT91cmw9/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZG1uOHhkc3E0/L2ltYWdlL3VwbG9h/ZC92MTc0MDAyMTQx/NC9SZW50YmVhbi91/eXZnMnkxNnhxcDB3/MXRyaDVuOS5qcGcm/dz0zODQwJnE9NzU",
stock:7,
availableStock:7
},

{
name:"Washing Machine",
description:"Fully automatic washing machine with multiple wash programs. Energy-efficient and quiet.",
category:"Appliances",
price:799,
deposit:1800,
image:"https://imgs.search.brave.com/4Z6899uqkCAzlCp0r-rsKxmPmyeskGfvga3BLNXj1AA/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5i/dW5kbGVzLm5sL3dw/LWNvbnRlbnQvdXBs/b2Fkcy9XYXNtYWNo/aW5lLWh1cmVuLWJ1/bmRsZXMuanBn",
stock:6,
availableStock:6
},

{
name:"Refrigerator",
description:"Spacious double-door refrigerator with frost-free technology. Keeps food fresh for longer.",
category:"Appliances",
price:999,
deposit:2200,
image:"https://imgs.search.brave.com/a95lA960GhtrmTkYu-8DgyuYvou2-PQrWOr9TNiZqSU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hYWFw/cGxpYW5jZWxlYXNp/bmcuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDE4LzA0L3N0/YWlubGVzcy1zdGVl/bC1mcmlnaWRhaXJl/LXRvcC1mcmVlemVy/LXJlZnJpZ2VyYXRv/cnMtZmZodDE4MzJ0/cy02NF8xMDAwLmpw/Zw",
stock:6,
availableStock:6
},

{
name:"Microwave Oven",
category:"Appliances",
price:399,
deposit:900,
image:"https://imgs.search.brave.com/U70FwZgRlAR1mUCkTGwZsVFpkB7kMchJu0R3i1bq-T4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/YXBwbGlhbmNlc29u/cmVudC5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMjUvMDUv/d2Vic2l0ZS1pbWFn/ZXMtbWljcm93YXZl/LTgtMzAweDMwMC5q/cGc",
stock:8,
availableStock:8
},

{
name:"Air Conditioner",
category:"Appliances",
price:1299,
deposit:3000,
image:"https://imgs.search.brave.com/E8A_ODFUDD6HQppZJrI0cq5R5-eWGi6ESx9DZfOOUDM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9kMWR2/ZHQxaG0wYzlxaC5j/bG91ZGZyb250Lm5l/dC92MS4wLjEvcHVi/bGljL2Fzc2V0cy9m/cm9udGVuZC9pbWFn/ZXMvbGlzdGluZ3Mv/cG9zdC0zOTczLzY1/YTRjMmEzY2QzZWQu/d2VicA",
stock:5,
availableStock:5
},

{
name:"LED Television",
category:"Electronics",
price:699,
deposit:1500,
image:"https://imgs.search.brave.com/kjE1f4t8jRHoMG5pqU692zks5uIuJQWGpQvbDVVYJfs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cmVudG15dGVsZXZp/c2lvbi5jb20vYXNz/ZXRzL2ltZy9oZC10/ZWxldmlzaW9uLWZv/ci1yZW50LndlYnA",
stock:7,
availableStock:7
},

{
name:"Laptop",
category:"Electronics",
price:1499,
deposit:4000,
image:"https://imgs.search.brave.com/Sdq4_a-71W1wmodkBO5SDyNFQcC73IFRZ7a49psxyrY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cmVudGV6LmluL2Fz/c2V0cy9pbWFnZXMv/MzMyNTUud2VicA",
stock:5,
availableStock:5
},

{
name:"Gaming Chair",
category:"Electronics",
price:399,
deposit:1000,
image:"https://imgs.search.brave.com/1Y5fU6EbEF83l5JnMzrtKy2SA5-raWoiIt0C04SQb2w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFMenJScjBnZEwu/anBn",
stock:9,
availableStock:9
},

{
name:"Smart Speaker",
category:"Electronics",
price:199,
deposit:500,
image:"https://imgs.search.brave.com/T0shBljsnQ-MArDELso7tcGnSR3iVQNaYzk61vvvZww/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA5LzM3LzM2LzM0/LzM2MF9GXzkzNzM2/MzQ3N19OMTFjTnV1/NUJDYWFFMEhwaGM2/T0NZaFAwb2RvYUo0/Yy5qcGc",
stock:10,
availableStock:10
},

{
name:"Treadmill",
category:"Fitness",
price:999,
deposit:2500,
image:"https://imgs.search.brave.com/rWt4Z72zQyvy1czw7SjGvWIDrOCRxIJrcnnm85dM_WY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c3Bhcm5vZGZpdG5l/c3MuY29tL3JlbnRh/bC9iYW5nYWxvcmUv/aW1nL3N0aC00MDAw/LXRyZWFkbWlsbC1v/bi1yZW50LmpwZw",
stock:4,
availableStock:4
},

{
name:"Exercise Bike",
category:"Fitness",
price:699,
deposit:1800,
image:"https://imgs.search.brave.com/SVei_hWruE8SiQoWAHcp8GUeRVh8ermB58xpw1Ye-sQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lYXN5/Zml0bmVzcy5jYS9z/aXRlcy9kZWZhdWx0/L2ZpbGVzL3N0eWxl/cy9wcm9kdWN0X292/ZXJ2aWV3L3B1Ymxp/Yy9wcm9kdWN0cy9l/LWZpdC1wcm8tc3Bp/bi1iaWtlLWhvbWUt/Z3ltLXJlbnRhbC1m/aXRuZXNzLWVxdWlw/bWVudC1yZW50YWwx/LmpwZz9pdG9rPVA0/ZVdpOWRP",
stock:4,
availableStock:4
}
]

module.exports.products = products

const seedDB = async () => {
  try {
    await Product.deleteMany()
    await Product.insertMany(products)
    console.log("20 Products Inserted Successfully")
  } catch (err) {
    console.error("Seed Error:", err)
  }
}

if (require.main === module) {
  const mongoose = require("mongoose");
  const Product = require("../models/Product");
  const path = require("path");
  require("dotenv").config({ path: path.join(__dirname, "../.env") });
  const dns = require("dns");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);

  mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log("Connected to MongoDB for Seeding...");
      seedDB().then(() => {
        console.log("Seed complete, exiting.");
        process.exit(0);
      });
    })
    .catch(err => {
      console.error("Connection Error:", err);
      process.exit(1);
    });
}