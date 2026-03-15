import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [stats, setStats] = useState({
    totalSales: 0,
    perDaySale: 0,
    totalTransactions: 0,
    totalInventoryItems: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch transactions for sales calculation
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transError) throw transError;

      // Calculate total sales
      const totalSales = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

      // Calculate today's sales (per day sale)
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      const todayTransactions = transactions.filter(transaction => 
        transaction.purchase_date === today
      );
      const perDaySale = todayTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

      // Fetch inventory count
      const { data: inventory, error: invError } = await supabase
        .from('inventory')
        .select('*');

      if (invError) throw invError;

      // Get recent transactions (last 5)
      const recent = transactions.slice(0, 5);

      setStats({
        totalSales: totalSales,
        perDaySale: perDaySale,
        totalTransactions: transactions.length,
        totalInventoryItems: inventory.length
      });

      setRecentTransactions(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Q & A Book Shop - Admin Cashbook Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card sales">
          <div className="stat-value">₨{stats.totalSales.toLocaleString()}</div>
          <div className="stat-label">Total Sales</div>
        </div>
        <div className="stat-card expenses">
          <div className="stat-value">₨{stats.perDaySale.toLocaleString()}</div>
          <div className="stat-label">Per Day Sale</div>
        </div>
        <div className="stat-card transactions">
          <div className="stat-value">{stats.totalTransactions}</div>
          <div className="stat-label">Total Transactions</div>
        </div>
        <div className="stat-card inventory">
          <div className="stat-value">{stats.totalInventoryItems}</div>
          <div className="stat-label">Inventory Items</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="mb-4">Recent Transactions</h2>
        {recentTransactions.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.purchase_date).toLocaleDateString()}</td>
                    <td>{transaction.customer_name}</td>
                    <td>{transaction.item_name}</td>
                    <td>₨{parseFloat(transaction.amount).toLocaleString()}</td>
                    <td>{transaction.payment_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No transactions found. Start by adding your first transaction!</p>
        )}
      </div>
    </div>
  );
}