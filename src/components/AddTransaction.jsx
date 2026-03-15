import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AddTransaction() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    mobile_number: '',
    payment_method: 'Cash',
    account_details: 'Cash',
    description: '',
    purchase_date: new Date().toISOString().split('T')[0]
  });
  const [selectedItems, setSelectedItems] = useState([
    { item_name: '', quantity: 1, price: 0, total: 0 }
  ]);

  const paymentMethods = ['Cash', 'SadaPay', 'NayaPay', 'Easypaisa', 'Bank Transfer'];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .gt('quantity', 0)
        .order('item_name');

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      alert('Error fetching inventory: ' + error.message);
    }
  };

  const addItemRow = () => {
    setSelectedItems([...selectedItems, { item_name: '', quantity: 1, price: 0, total: 0 }]);
  };

  const removeItemRow = (index) => {
    if (selectedItems.length > 1) {
      const newItems = selectedItems.filter((_, i) => i !== index);
      setSelectedItems(newItems);
    }
  };

  const handleItemChange = (index, itemName) => {
    const selectedItem = inventory.find(item => item.item_name === itemName);
    const newItems = [...selectedItems];
    
    if (selectedItem) {
      newItems[index] = {
        ...newItems[index],
        item_name: itemName,
        price: selectedItem.price,
        total: selectedItem.price * newItems[index].quantity
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        item_name: itemName,
        price: 0,
        total: 0
      };
    }
    
    setSelectedItems(newItems);
  };

  const handleQuantityChange = (index, quantity) => {
    const newItems = [...selectedItems];
    const qty = parseInt(quantity) || 1;
    newItems[index] = {
      ...newItems[index],
      quantity: qty,
      total: newItems[index].price * qty
    };
    setSelectedItems(newItems);
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((sum, item) => sum + item.total, 0);
  };

  const validateTransaction = () => {
    // Check required fields
    if (!formData.customer_name.trim()) {
      alert('Please enter customer name');
      return false;
    }

    if (!formData.mobile_number.trim()) {
      alert('Please enter mobile number');
      return false;
    }

    // Validate mobile number format
    if (!/^[0-9]{11}$/.test(formData.mobile_number)) {
      alert('Please enter a valid 11-digit mobile number');
      return false;
    }

    // Check if at least one item is selected
    const validItems = selectedItems.filter(item => item.item_name && item.quantity > 0);
    if (validItems.length === 0) {
      alert('Please select at least one item');
      return false;
    }

    // Check inventory availability for each item
    for (const selectedItem of validItems) {
      const inventoryItem = inventory.find(item => item.item_name === selectedItem.item_name);
      if (!inventoryItem) {
        alert(`Item "${selectedItem.item_name}" not found in inventory`);
        return false;
      }
      if (inventoryItem.quantity < selectedItem.quantity) {
        alert(`Insufficient stock for "${selectedItem.item_name}"! Only ${inventoryItem.quantity} available.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateTransaction()) {
      return;
    }

    try {
      setLoading(true);

      const validItems = selectedItems.filter(item => item.item_name && item.quantity > 0);
      
      // Create transactions for each item
      const transactionPromises = validItems.map(async (item) => {
        // Add transaction
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert([{
            customer_name: formData.customer_name.trim(),
            mobile_number: formData.mobile_number.trim(),
            payment_method: formData.payment_method,
            account_details: formData.payment_method === 'Cash' ? 'Cash' : formData.account_details.trim(),
            item_name: item.item_name,
            quantity: item.quantity,
            amount: item.total,
            description: formData.description.trim(),
            purchase_date: formData.purchase_date
          }]);

        if (transactionError) throw transactionError;

        // Update inventory quantity
        const inventoryItem = inventory.find(inv => inv.item_name === item.item_name);
        const newQuantity = inventoryItem.quantity - item.quantity;
        
        const { error: inventoryError } = await supabase
          .from('inventory')
          .update({ quantity: newQuantity })
          .eq('id', inventoryItem.id);

        if (inventoryError) throw inventoryError;
      });

      await Promise.all(transactionPromises);

      alert(`Successfully added ${validItems.length} transaction(s)!`);
      
      // Reset form
      setFormData({
        customer_name: '',
        mobile_number: '',
        payment_method: 'Cash',
        account_details: 'Cash',
        description: '',
        purchase_date: new Date().toISOString().split('T')[0]
      });
      setSelectedItems([{ item_name: '', quantity: 1, price: 0, total: 0 }]);

      // Refresh inventory
      fetchInventory();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error adding transaction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setFormData({
      ...formData,
      payment_method: method,
      account_details: method === 'Cash' ? 'Cash' : ''
    });
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Record New Sale Transaction</h1>
        <p className="page-subtitle">Admin Tool: Record customer purchases with single or multiple items</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form-container">
          {/* Customer Information */}
          <h3 className="mb-3">Customer Information</h3>
          
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.customer_name}
              onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <input
              type="tel"
              className="form-input"
              value={formData.mobile_number}
              onChange={(e) => setFormData({...formData, mobile_number: e.target.value})}
              placeholder="03XXXXXXXXX"
              pattern="[0-9]{11}"
              required
            />
          </div>

          {/* Payment Information */}
          <h3 className="mb-3 mt-4">Payment Information</h3>
          
          <div className="form-group">
            <label className="form-label">Payment Method *</label>
            <select
              className="form-select"
              value={formData.payment_method}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              required
            >
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          {formData.payment_method !== 'Cash' && (
            <div className="form-group">
              <label className="form-label">Payment Account Details *</label>
              <input
                type="text"
                className="form-input"
                value={formData.account_details}
                onChange={(e) => setFormData({...formData, account_details: e.target.value})}
                placeholder="Account number, wallet ID, etc."
                required
              />
            </div>
          )}

          {formData.payment_method === 'Cash' && (
            <div className="form-group">
              <label className="form-label">Payment Account Details</label>
              <input
                type="text"
                className="form-input"
                value="Cash"
                readOnly
                style={{backgroundColor: '#e5e7eb', color: '#6b7280'}}
              />
            </div>
          )}

          {/* Items Selection */}
          <h3 className="mb-3 mt-4">Items Selection</h3>
          
          {selectedItems.map((item, index) => (
            <div key={index} className="card" style={{marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8fafc'}}>
              <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end'}}>
                <div className="form-group">
                  <label className="form-label">Item {index + 1} *</label>
                  <select
                    className="form-select"
                    value={item.item_name}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    required
                  >
                    <option value="">Select an item</option>
                    {inventory.map(invItem => (
                      <option key={invItem.id} value={invItem.item_name}>
                        {invItem.item_name} - ₨{invItem.price} (Stock: {invItem.quantity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total (₨)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={`₨${item.total.toLocaleString()}`}
                    readOnly
                    style={{backgroundColor: '#e5e7eb'}}
                  />
                </div>

                <div className="form-group">
                  {selectedItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      className="btn btn-danger"
                      style={{padding: '0.5rem'}}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={addItemRow}
              className="btn btn-success"
            >
              ➕ Add Another Item
            </button>
          </div>

          {/* Total Amount Display */}
          <div className="card" style={{backgroundColor: '#dbeafe', padding: '1rem', marginBottom: '1rem'}}>
            <h4 style={{margin: 0, color: '#1e40af'}}>
              Total Transaction Amount: ₨{getTotalAmount().toLocaleString()}
            </h4>
          </div>

          {/* Additional Details */}
          <h3 className="mb-3 mt-4">Additional Details</h3>

          <div className="form-group">
            <label className="form-label">Purchase Date *</label>
            <input
              type="date"
              className="form-input"
              value={formData.purchase_date}
              onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Notes</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Additional notes about the transaction"
              rows="3"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={loading || getTotalAmount() === 0}
          >
            {loading ? '⏳ Adding Transaction...' : `💾 Add Transaction (₨${getTotalAmount().toLocaleString()})`}
          </button>
        </form>
      </div>

      {/* Available Inventory Summary */}
      {inventory.length > 0 && (
        <div className="card mt-4">
          <h3 className="mb-3">Available Inventory ({inventory.length} items)</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price (₨)</th>
                  <th>Available Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.slice(0, 10).map((item) => (
                  <tr key={item.id}>
                    <td>{item.item_name}</td>
                    <td>₨{parseFloat(item.price).toLocaleString()}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {item.quantity < 10 ? (
                        <span style={{color: '#ef4444', fontWeight: 'bold'}}>⚠️ Low Stock</span>
                      ) : (
                        <span style={{color: '#10b981'}}>✅ In Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {inventory.length > 10 && (
            <p className="text-center mt-2">
              <a href="/inventory" className="btn btn-secondary">
                View All {inventory.length} Items
              </a>
            </p>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="card mt-4" style={{backgroundColor: '#f0f9ff'}}>
        <h3 className="mb-3" style={{color: '#1e40af'}}>📋 Admin Instructions</h3>
        <ul style={{paddingLeft: '1.5rem'}}>
          <li><strong>Admin Only:</strong> This is an admin tool for recording customer purchases</li>
          <li><strong>Single Item Purchase:</strong> Select one item, set quantity, and submit</li>
          <li><strong>Multiple Items Purchase:</strong> Click "Add Another Item" to record multiple items in one transaction</li>
          <li><strong>Cash Payments:</strong> Account details automatically set to "Cash" for cash transactions</li>
          <li><strong>Stock Check:</strong> The system automatically checks available stock before processing</li>
          <li><strong>Auto Calculation:</strong> Total amount is calculated automatically based on item prices and quantities</li>
          <li><strong>Inventory Update:</strong> Stock quantities are automatically reduced after successful transaction</li>
        </ul>
      </div>
    </div>
  );
}