import { Link } from "react-router-dom"

function Footer(){

return(

<footer className="bg-gray-900 text-white py-12">

<div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">

{/* Brand */}
<div>
<h2 className="text-xl font-bold mb-4">RentEase</h2>
<p className="text-gray-400 text-sm">
Affordable furniture and appliance rentals for modern living.
</p>
</div>

{/* Company */}
<div>
<h3 className="font-semibold mb-3">Company</h3>
<ul className="space-y-2 text-gray-400 text-sm">

<li>
<Link to="/about" className="hover:text-white">
About Us
</Link>
</li>

<li>
<Link to="/careers" className="hover:text-white">
Careers
</Link>
</li>

<li>
<Link to="/blog" className="hover:text-white">
Blog
</Link>
</li>

</ul>
</div>

{/* Support */}
<div>
<h3 className="font-semibold mb-3">Support</h3>
<ul className="space-y-2 text-gray-400 text-sm">

<li>
<Link to="/help" className="hover:text-white">
Help Center
</Link>
</li>

<li>
<Link to="/contact" className="hover:text-white">
Contact
</Link>
</li>

<li>
<Link to="/maintenance" className="hover:text-white">
Maintenance Request
</Link>
</li>

</ul>
</div>

{/* Legal */}
<div>
<h3 className="font-semibold mb-3">Legal</h3>
<ul className="space-y-2 text-gray-400 text-sm">

<li>
<Link to="/privacy" className="hover:text-white">
Privacy Policy
</Link>
</li>

<li>
<Link to="/terms" className="hover:text-white">
Terms of Service
</Link>
</li>

</ul>
</div>

</div>

<div className="text-center text-gray-500 text-sm mt-10">
© 2026 RentEase. All rights reserved.
</div>

</footer>

)

}

export default Footer