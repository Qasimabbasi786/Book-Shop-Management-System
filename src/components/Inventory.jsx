import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    item_name: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    fetchInventory();
    
    // Check if there's a search term from navbar
    const navbarSearchTerm = sessionStorage.getItem('searchTerm');
    if (navbarSearchTerm) {
      setSearchTerm(navbarSearchTerm);
      sessionStorage.removeItem('searchTerm'); // Clear it after using
    }
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm]);

  const filterInventory = () => {
    let filtered = [...inventory];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.price.toString().includes(searchTerm)
      );
    }

    setFilteredInventory(filtered);
  };
  // Sample stationery items data
  const sampleItems = [
    { item_name: 'Ballpoint Pen (Blue)', price: 15, quantity: 50 },
    { item_name: 'Ballpoint Pen (Black)', price: 15, quantity: 45 },
    { item_name: 'Ballpoint Pen (Red)', price: 15, quantity: 30 },
    { item_name: 'HB Pencil', price: 8, quantity: 100 },
    { item_name: '2B Pencil', price: 10, quantity: 75 },
    { item_name: 'Eraser (Small)', price: 5, quantity: 80 },
    { item_name: 'Eraser (Large)', price: 12, quantity: 40 },
    { item_name: 'Sharpener (Metal)', price: 20, quantity: 35 },
    { item_name: 'Ruler (30cm)', price: 25, quantity: 60 },
    { item_name: 'Notebook (Single Line)', price: 45, quantity: 120 },
    { item_name: 'Notebook (Double Line)', price: 45, quantity: 100 },
    { item_name: 'Notebook (Graph)', price: 50, quantity: 80 },
    { item_name: 'Copy (80 Pages)', price: 35, quantity: 150 },
    { item_name: 'Copy (120 Pages)', price: 50, quantity: 100 },
    { item_name: 'Register (200 Pages)', price: 120, quantity: 40 },
    { item_name: 'Marker (Black)', price: 35, quantity: 25 },
    { item_name: 'Marker (Blue)', price: 35, quantity: 20 },
    { item_name: 'Marker (Red)', price: 35, quantity: 18 },
    { item_name: 'Highlighter (Yellow)', price: 40, quantity: 30 },
    { item_name: 'Highlighter (Pink)', price: 40, quantity: 25 },
    { item_name: 'Glue Stick', price: 60, quantity: 35 },
    { item_name: 'Fevicol (20ml)', price: 25, quantity: 50 },
    { item_name: 'Scissors (Small)', price: 80, quantity: 20 },
    { item_name: 'Stapler (Small)', price: 150, quantity: 15 },
    { item_name: 'Stapler Pins', price: 20, quantity: 40 },
    { item_name: 'Paper Clips (Box)', price: 30, quantity: 25 },
    { item_name: 'Rubber Bands (Pack)', price: 15, quantity: 30 },
    { item_name: 'File Folder (Plastic)', price: 45, quantity: 60 },
    { item_name: 'File Folder (Cardboard)', price: 25, quantity: 80 },
    { item_name: 'Spiral Notebook (A4)', price: 85, quantity: 50 },
    { item_name: 'Spiral Notebook (A5)', price: 65, quantity: 70 },
    { item_name: 'Calculator (Basic)', price: 250, quantity: 12 },
    { item_name: 'Calculator (Scientific)', price: 850, quantity: 8 },
    { item_name: 'Geometry Box', price: 180, quantity: 25 },
    { item_name: 'Compass', price: 120, quantity: 20 },
    { item_name: 'Protractor', price: 35, quantity: 40 },
    { item_name: 'Set Square (Pair)', price: 45, quantity: 30 },
    { item_name: 'Color Pencils (12 Colors)', price: 120, quantity: 35 },
    { item_name: 'Color Pencils (24 Colors)', price: 220, quantity: 20 },
    { item_name: 'Crayons (12 Colors)', price: 80, quantity: 40 },
    { item_name: 'Crayons (24 Colors)', price: 150, quantity: 25 },
    { item_name: 'Water Colors (12 Colors)', price: 180, quantity: 30 },
    { item_name: 'Paint Brush Set', price: 120, quantity: 25 },
    { item_name: 'Drawing Book (A4)', price: 60, quantity: 45 },
    { item_name: 'Chart Paper (Pack of 10)', price: 80, quantity: 20 },
    { item_name: 'Carbon Paper', price: 15, quantity: 50 },
    { item_name: 'Tracing Paper', price: 25, quantity: 35 },
    { item_name: 'Sticky Notes (Small)', price: 40, quantity: 60 },
    { item_name: 'Sticky Notes (Large)', price: 65, quantity: 40 },
    { item_name: 'Correction Pen', price: 45, quantity: 30 },
    { item_name: 'Correction Tape', price: 85, quantity: 20 },
    { item_name: 'Punch Machine (2 Hole)', price: 320, quantity: 8 },
    { item_name: 'Punch Machine (4 Hole)', price: 450, quantity: 5 }
  ];

  const addSampleItems = async () => {
    if (!window.confirm('This will add 50+ sample stationery items to your inventory. Continue?')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('inventory')
        .insert(sampleItems);

      if (error) throw error;
      alert('Sample items added successfully!');
      fetchInventory();
    } catch (error) {
      console.error('Error adding sample items:', error);
      alert('Error adding sample items: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInventory(data || []);
      setFilteredInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      alert('Error fetching inventory: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.item_name || !formData.price || !formData.quantity) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('inventory')
          .update({
            item_name: formData.item_name,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity)
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        alert('Item updated successfully!');
      } else {
        // Add new item
        const { error } = await supabase
          .from('inventory')
          .insert([{
            item_name: formData.item_name,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity)
          }]);

        if (error) throw error;
        alert('Item added successfully!');
      }

      // Reset form and refresh data
      setFormData({ item_name: '', price: '', quantity: '' });
      setShowAddForm(false);
      setEditingItem(null);
      fetchInventory();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      item_name: item.item_name,
      price: item.price.toString(),
      quantity: item.quantity.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Item deleted successfully!');
      fetchInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ item_name: '', price: '', quantity: '' });
    setShowAddForm(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Stationery & Bookstore Inventory</h1>
        <p className="page-subtitle">Manage your inventory items, prices, and stock quantities</p>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card mb-5">
          <h2 className="mb-4">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.item_name}
                onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                placeholder="Enter item name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₨)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="Enter price"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                placeholder="Enter quantity"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingItem ? '✏️ Update Item' : '➕ Add Item'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Action Buttons */}
      {!showAddForm && (
        <div className="mb-4">
          <div className="mb-3">
            <input
              type="text"
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inventory items..."
              style={{maxWidth: '400px'}}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
              ➕ Add New Item
            </button>
            {filteredInventory.length === 0 && inventory.length === 0 && (
              <button onClick={addSampleItems} className="btn btn-success">
                📦 Add Sample Stationery Items
              </button>
            )}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="card">
        <h2 className="mb-4">
          Current Inventory ({filteredInventory.length} items)
          {searchTerm && ` - Filtered from ${inventory.length} total`}
        </h2>
        {filteredInventory.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price (₨)</th>
                  <th>Stock Quantity</th>
                  <th>Added Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.item_name}</td>
                    <td>₨{parseFloat(item.price).toLocaleString()}</td>
                    <td>
                      <span className={item.quantity < 10 ? 'text-danger' : ''}>
                        {item.quantity}
                        {item.quantity < 10 && ' ⚠️'}
                      </span>
                    </td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="btn btn-success"
                          style={{padding: '0.5rem'}}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="btn btn-danger"
                          style={{padding: '0.5rem'}}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">
            <p>
              {inventory.length === 0 
                ? 'No inventory items found. Start by adding your first item!' 
                : 'No items match your search criteria.'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="btn btn-secondary mt-2"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      {inventory.filter(item => item.quantity < 10).length > 0 && (
        <div className="card mt-4" style={{borderLeft: '4px solid #ef4444'}}>
          <h3 style={{color: '#ef4444'}}>⚠️ Low Stock Alert</h3>
          <p>The following items are running low on stock:</p>
          <ul>
            {inventory
              .filter(item => item.quantity < 10)
              .map(item => (
                <li key={item.id}>
                  {item.item_name} - Only {item.quantity} left
                </li>
              ))
            }
          </ul>
        </div>
      )}
    </div>
  );
}