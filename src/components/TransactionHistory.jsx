import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const paymentMethods = ['Cash', 'SadaPay', 'NayaPay', 'Easypaisa', 'Bank Transfer'];

  useEffect(() => {
    fetchTransactions();
    
    // Check if there's a search term from navbar
    const navbarSearchTerm = sessionStorage.getItem('searchTerm');
    if (navbarSearchTerm) {
      setSearchTerm(navbarSearchTerm);
      sessionStorage.removeItem('searchTerm'); // Clear it after using
    }
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, filterPaymentMethod, filterDateFrom, filterDateTo]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('Error fetching transactions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.mobile_number.includes(searchTerm) ||
        (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Payment method filter
    if (filterPaymentMethod) {
      filtered = filtered.filter(transaction =>
        transaction.payment_method === filterPaymentMethod
      );
    }

    // Date range filter
    if (filterDateFrom) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.purchase_date) >= new Date(filterDateFrom)
      );
    }

    if (filterDateTo) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.purchase_date) <= new Date(filterDateTo)
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Transaction deleted successfully!');
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction: ' + error.message);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Transaction Date', 'Customer Name', 'Mobile Number', 'Item', 'Quantity', 
      'Amount', 'Payment Method', 'Account Details', 'Description'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(transaction => [
        transaction.purchase_date,
        `"${transaction.customer_name}"`,
        transaction.mobile_number,
        `"${transaction.item_name}"`,
        transaction.quantity,
        transaction.amount,
        transaction.payment_method,
        `"${transaction.account_details || ''}"`,
        `"${transaction.description || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Q&A_BookShop_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

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
        <h1 className="page-title">Sales History</h1>
        <p className="page-subtitle">Admin Tool: View and manage all customer sales transactions</p>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <h3 className="mb-3">Filters & Search</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div className="form-group">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customer, item, mobile..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
            >
              <option value="">All Methods</option>
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="form-input"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">To Date</label>
            <input
              type="date"
              className="form-input"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterPaymentMethod('');
              setFilterDateFrom('');
              setFilterDateTo('');
            }}
            className="btn btn-secondary"
          >
            🔄 Clear Filters
          </button>
          <button onClick={exportToCSV} className="btn btn-success">
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="stats-grid mb-4">
        <div className="stat-card transactions">
          <div className="stat-value">{filteredTransactions.length}</div>
          <div className="stat-label">Total Transactions</div>
        </div>
        <div className="stat-card sales">
          <div className="stat-value">₨{totalAmount.toLocaleString()}</div>
          <div className="stat-label">Total Amount</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <h2 className="mb-4">
          All Sales Transactions ({filteredTransactions.length})
          {searchTerm || filterPaymentMethod || filterDateFrom || filterDateTo ? 
            ` - Filtered from ${transactions.length} total` : ''}
        </h2>
        {filteredTransactions.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Sale Date</th>
                  <th>Customer Name</th>
                  <th>Mobile Number</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Account Details</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.purchase_date).toLocaleDateString()}</td>
                    <td>{transaction.customer_name}</td>
                    <td>{transaction.mobile_number}</td>
                    <td>{transaction.item_name}</td>
                    <td>{transaction.quantity}</td>
                    <td>₨{parseFloat(transaction.amount).toLocaleString()}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: transaction.payment_method === 'Cash' ? '#10b981' : '#3b82f6',
                        color: 'white'
                      }}>
                        {transaction.payment_method}
                      </span>
                    </td>
                    <td>{transaction.payment_method === 'Cash' ? 'Cash' : (transaction.account_details || 'N/A')}</td>
                    <td>{transaction.description || 'N/A'}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(transaction.id)}
                        className="btn btn-danger"
                        style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem'}}
                        title="Delete Transaction"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">
            <p>
              {transactions.length === 0 
                ? 'No sales transactions found. Start by recording your first sale!' 
                : 'No sales transactions match your current filters.'}
            </p>
            <a href="/add-transaction" className="btn btn-primary mt-3">
              ➕ Record New Sale
            </a>
          </div>
        )}
      </div>

      {/* Customer Summary */}
      {filteredTransactions.length > 0 && (
        <div className="card mt-4">
          <h3 className="mb-3">Customer Summary</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Mobile Number</th>
                  <th>Total Purchases</th>
                  <th>Total Amount</th>
                  <th>Last Purchase</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(
                  filteredTransactions.reduce((acc, transaction) => {
                    const key = `${transaction.customer_name}-${transaction.mobile_number}`;
                    if (!acc[key]) {
                      acc[key] = {
                        customer_name: transaction.customer_name,
                        mobile_number: transaction.mobile_number,
                        count: 0,
                        total: 0,
                        lastPurchase: transaction.purchase_date
                      };
                    }
                    acc[key].count += 1;
                    acc[key].total += parseFloat(transaction.amount);
                    if (new Date(transaction.purchase_date) > new Date(acc[key].lastPurchase)) {
                      acc[key].lastPurchase = transaction.purchase_date;
                    }
                    return acc;
                  }, {})
                )
                .sort((a, b) => b.total - a.total)
                .slice(0, 10)
                .map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.customer_name}</td>
                    <td>{customer.mobile_number}</td>
                    <td>{customer.count}</td>
                    <td>₨{customer.total.toLocaleString()}</td>
                    <td>{new Date(customer.lastPurchase).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}