import React from 'react';

export default function About() {
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">About Q & A Book Shop</h1>
        <p className="page-subtitle">Your trusted partner for books and stationery</p>
      </div>

      <div className="card">
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
          <div>
            <h2 className="mb-3">📚 Our Story</h2>
            <p className="mb-4">
              Q & A Book Shop has been serving the community for over a decade, providing quality books, 
              stationery, and educational materials to students, professionals, and book enthusiasts. 
              We pride ourselves on offering a wide selection of products at competitive prices.
            </p>
            
            <h3 className="mb-3">🎯 Our Mission</h3>
            <p className="mb-4">
              To make knowledge accessible to everyone by providing quality books and stationery 
              at affordable prices, while delivering exceptional customer service.
            </p>
          </div>

          <div>
            <h2 className="mb-3">🛍️ Our Products</h2>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li className="mb-2">📖 <strong>Books:</strong> Academic, Fiction, Non-fiction, Reference</li>
              <li className="mb-2">✏️ <strong>Stationery:</strong> Pens, Pencils, Notebooks, Files</li>
              <li className="mb-2">🎨 <strong>Art Supplies:</strong> Colors, Brushes, Drawing Pads</li>
              <li className="mb-2">💼 <strong>Office Supplies:</strong> Folders, Binders, Organizers</li>
              <li className="mb-2">🎓 <strong>Educational Materials:</strong> Charts, Models, Tools</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="mb-4">🏪 Store Information</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem'}}>
          <div>
            <h3 className="mb-3">📍 Location</h3>
            <p>
              Shifa Tameer-e-Millat University<br/>
              Park Road Campus<br/>
              Islamabad, Pakistan
            </p>
          </div>

          <div>
            <h3 className="mb-3">📞 Contact Information</h3>
            <p>
              <strong>Owner 1:</strong> Muhammad Qasim<br/>
              <strong>Phone:</strong> +92 312-5026943<br/>
              <strong>Email:</strong> qasim.tanveer81755@gmail.com<br/>
              <strong>WhatsApp:</strong> +92 312-5026943<br/>
              <br/>
              <strong>Owner 2:</strong> Muhammad Aqdas<br/>
              <strong>Phone 2:</strong> +92 314-5190070<br/>
              <strong>Email 2:</strong> aqdas.khan070@gmail.com<br/>
              <strong>WhatsApp 2:</strong> +92 314-5190070
            </p>
          </div>

          <div>
            <h3 className="mb-3">🕒 Business Hours</h3>
            <p>
              <strong>Monday - Friday:</strong> 08:30 AM - 05:00 PM<br/>
              <strong>Holidays:</strong> Saturday and Sunday<br/>
              <strong>Status:</strong> Closed on weekends
            </p>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="mb-4">💳 Payment Methods</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div className="text-center p-3" style={{border: '2px solid #e5e7eb', borderRadius: '8px'}}>
            <h4>💵 Cash</h4>
            <p>Traditional cash payments accepted</p>
          </div>
          <div className="text-center p-3" style={{border: '2px solid #e5e7eb', borderRadius: '8px'}}>
            <h4>📱 SadaPay</h4>
            <p>Digital wallet payments</p>
          </div>
          <div className="text-center p-3" style={{border: '2px solid #e5e7eb', borderRadius: '8px'}}>
            <h4>💳 NayaPay</h4>
            <p>Mobile banking solution</p>
          </div>
          <div className="text-center p-3" style={{border: '2px solid #e5e7eb', borderRadius: '8px'}}>
            <h4>📲 Easypaisa</h4>
            <p>Mobile financial services</p>
          </div>
          <div className="text-center p-3" style={{border: '2px solid #e5e7eb', borderRadius: '8px'}}>
            <h4>🏦 Bank Transfer</h4>
            <p>Direct bank account transfers</p>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="mb-4">🌟 Why Choose Us?</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem'}}>
          <div>
            <h3>✅ Quality Products</h3>
            <p>We source our products from trusted suppliers to ensure quality and authenticity.</p>
          </div>
          <div>
            <h3>💰 Competitive Prices</h3>
            <p>Best prices in the market with regular discounts and special offers for students.</p>
          </div>
          <div>
            <h3>🚚 Fast Service</h3>
            <p>Quick order processing and efficient customer service for all your needs.</p>
          </div>
          <div>
            <h3>🎓 Student Friendly</h3>
            <p>Special discounts and packages designed specifically for students and educational institutions.</p>
          </div>
        </div>
      </div>

      <div className="card mt-4 text-center">
        <h2 className="mb-4">📞 Get in Touch</h2>
        <p className="mb-4">
          Have questions about our products or services? We'd love to hear from you!
        </p>
        <div className="flex gap-4 justify-center">
          <a href="tel:+923001234567" className="btn btn-primary">
            📞 Call Us
          </a>
          <a href="mailto:qasim.tanveer81755@gmail.com" className="btn btn-success">
            ✉️ Email Us
          </a>
          <a href="https://wa.me/923125026943" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}