// ============================================
// CashierNova — Dashboard Page
// Ringkasan penjualan, chart, dan transaksi terbaru
// Dependencies: recharts, lucide-react, transactionService
// ============================================

import { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import transactionService from '../services/transactionService';
import { formatCurrency } from '../utils/formatCurrency';
import formatDate from '../utils/formatDate';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartRange, setChartRange] = useState(7);
  const [loading, setLoading] = useState(true);

  const isMobile = window.innerWidth < 640;

  // Fetch data dashboard
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [summaryRes, chartRes] = await Promise.all([
          transactionService.getDashboardSummary(),
          transactionService.getDashboardChart(chartRange),
        ]);
        setSummary(summaryRes.data.data);
        setChartData(chartRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [chartRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Summary cards data
  const cards = [
    {
      title: 'Penjualan Hari Ini',
      value: formatCurrency(summary?.today_sales || 0),
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
    {
      title: 'Transaksi Hari Ini',
      value: summary?.today_transactions || 0,
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Produk Aktif',
      value: summary?.active_products || 0,
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
    },
    {
      title: 'Stok Menipis',
      value: summary?.low_stock_products || 0,
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-600',
      iconBg: 'bg-amber-100',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Ringkasan aktivitas penjualan Anda</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="card hover:shadow-card-hover transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary">{card.title}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{card.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <card.icon size={20} className={card.color.split(' ')[1]} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              <h2 className="font-semibold text-text-primary">Grafik Penjualan</h2>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {[7, 30].map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                    chartRange === range
                      ? 'bg-white text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {range} Hari
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={isMobile ? 200 : 280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd8a3" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2dd8a3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
              />
              <YAxis
                hide={isMobile}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1f2e',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value) => [formatCurrency(value), 'Penjualan']}
                labelFormatter={(label) => formatDate(label, { day: '2-digit', month: 'long', year: 'numeric' })}
              />
              <Area
                type="monotone"
                dataKey="total_sales"
                stroke="#2dd8a3"
                strokeWidth={2.5}
                fill="url(#colorSales)"
                dot={{ fill: '#2dd8a3', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#2dd8a3' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpRight size={20} className="text-primary" />
            <h2 className="font-semibold text-text-primary">Transaksi Terbaru</h2>
          </div>

          <div className="space-y-3">
            {summary?.recent_transactions?.length > 0 ? (
              summary.recent_transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{tx.invoice_number}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {tx.cashier_name} · {formatDate(tx.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">
                      {formatCurrency(tx.grand_total)}
                    </p>
                    <span className="text-xs text-text-secondary capitalize">{tx.payment_method}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-secondary text-center py-8">
                Belum ada transaksi hari ini
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
