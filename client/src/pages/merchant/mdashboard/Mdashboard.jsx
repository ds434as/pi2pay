import React, { useState, useEffect } from 'react';
import Merchantheader from '../../../components/common/merchant/Merchantheader';
import Merchantsidebar from '../../../components/common/merchant/Merchantsidebar';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { FiDollarSign, FiCreditCard, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const Mdashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previousMonthData, setPreviousMonthData] = useState(null);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  const token = localStorage.getItem('merchantToken');
  const merchantId = JSON.parse(localStorage.getItem('merchantData'));

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${base_url}/api/merchant/transactions/${merchantId._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log(data)
        setDashboardData(data.data);
        
        // In a real app, you would fetch previous month's data here
        // For demo, we'll create some sample previous data
        setPreviousMonthData({
          totalPayin: 1000,
          totalPayout: 700,
          totalPaymentRequests: 250,
          payinStatusCounts: {
            completed: 900,
            rejected: 100
          },
          payoutStatusCounts: {
            success: 650,
            rejected: 50
          }
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Sample data format if API is not ready
  const sampleData = {
    counts: {
      totalPayin: 1245,
      totalPayout: 843,
      totalPaymentRequests: 312,
      payinStatusCounts: {
        pending: 45,
        completed: 1150,
        rejected: 50
      },
      payoutStatusCounts: {
        pending: 23,
        success: 800,
        rejected: 20
      },
      paymentRequestStatusCounts: {
        pending: 12,
        completed: 290,
        failed: 10
      }
    }
  };

  const data = dashboardData || sampleData;

  // Calculate dynamic percentages
  const calculatePercentage = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Success rates
  const payinSuccessRate = data.counts?.payinStatusCounts?.completed 
    ? ((data.counts.payinStatusCounts.completed / data.counts.totalPayin) * 100).toFixed(1)
    : '0';

  const payoutSuccessRate = data.counts?.payoutStatusCounts?.success 
    ? ((data.counts.payoutStatusCounts.success / data.counts.totalPayout) * 100).toFixed(1)
    : '0';

  const paymentRequestSuccessRate = data.counts?.paymentRequestStatusCounts?.completed
    ? ((data.counts.paymentRequestStatusCounts.completed / data.counts.totalPaymentRequests) * 100).toFixed(1)
    : '0';

  // Percentage changes from previous month
  const payinChange = previousMonthData 
    ? calculatePercentage(data.counts.totalPayin, previousMonthData.totalPayin)
    : '0';
  
  const payoutChange = previousMonthData 
    ? calculatePercentage(data.counts.totalPayout, previousMonthData.totalPayout)
    : '0';
  
  const paymentRequestChange = previousMonthData 
    ? calculatePercentage(data.counts.totalPaymentRequests, previousMonthData.totalPaymentRequests)
    : '0';
  
  const payinSuccessChange = previousMonthData 
    ? calculatePercentage(
        parseFloat(payinSuccessRate),
        (previousMonthData.payinStatusCounts.completed / previousMonthData.totalPayin) * 100
      )
    : '0';

  // Chart data preparation
  const payinStatusData = data.counts ? Object.entries(data.counts.payinStatusCounts).map(([name, value]) => ({
    name,
    value
  })) : [];

  const payoutStatusData = data.counts ? Object.entries(data.counts.payoutStatusCounts).map(([name, value]) => ({
    name,
    value
  })) : [];

  const monthlyTransactionData = [
    { name: 'Jan', payin: 4000, payout: 2400 },
    { name: 'Feb', payin: 3000, payout: 1398 },
    { name: 'Mar', payin: 2000, payout: 9800 },
    { name: 'Apr', payin: 2780, payout: 3908 },
    { name: 'May', payin: 1890, payout: 4800 },
    { name: 'Jun', payin: 2390, payout: 3800 },
    { name: 'Jul', payin: 3490, payout: 4300 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="font-nunito font-anek h-screen bg-gray-50">
      <Merchantheader toggleSidebar={toggleSidebar} />

      <div className="flex pt-[10vh] h-[90vh]">
        <Merchantsidebar isOpen={isSidebarOpen} />

        <main className={`transition-all duration-300 flex-1 p-6 overflow-y-auto h-[90vh] ${isSidebarOpen ? 'ml-[17%]' : 'ml-0'}`}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Total Payin</p>
                      <p className="text-2xl font-bold">৳{data.mathed_merchant.total_payin}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
                      <FaBangladeshiTakaSign className="text-2xl" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs font-medium">
                    <span className={`${payinChange >= 0 ? 'text-blue-200' : 'text-red-200'}`}>
                      {payinChange >= 0 ? '↑' : '↓'} {Math.abs(payinChange)}% from last month
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Total Payout</p>
                      <p className="text-2xl font-bold">৳{data.mathed_merchant.total_payout}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-400 bg-opacity-30">
                      <FiCreditCard className="text-2xl" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs font-medium">
                    <span className={`${payoutChange >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                      {payoutChange >= 0 ? '↑' : '↓'} {Math.abs(payoutChange)}% from last month
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Payment Requests</p>
                      <p className="text-2xl font-bold">{data.counts.totalPaymentRequests}</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-400 bg-opacity-30">
                      <FiUsers className="text-2xl" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs font-medium">
                    <span className={`${paymentRequestChange >= 0 ? 'text-purple-200' : 'text-red-200'}`}>
                      {paymentRequestChange >= 0 ? '↑' : '↓'} {Math.abs(paymentRequestChange)}% from last month
                    </span>
                  </div>
                </motion.div>

  {/* New Gateway Cost Card */}
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.7 }}
    className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl shadow-lg p-6 text-white"
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium">Gateway Cost</p>
        <p className="text-2xl font-bold">৳{data.mathed_merchant?.getwaycost}</p>
      </div>
      <div className="p-3 rounded-full bg-rose-400 bg-opacity-30">
        <FaBangladeshiTakaSign className="text-2xl" />
      </div>
    </div>
    <div className="mt-4 text-xs font-medium">
      <span className="text-rose-200">
        Per transaction cost
      </span>
    </div>
  </motion.div>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Success Rate</p>
                      <p className="text-2xl font-bold">{payinSuccessRate}%</p>
                    </div>
                    <div className="p-3 rounded-full bg-amber-400 bg-opacity-30">
                      <FiTrendingUp className="text-2xl" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs font-medium">
                    <span className={`${payinSuccessChange >= 0 ? 'text-amber-200' : 'text-red-200'}`}>
                      {payinSuccessChange >= 0 ? '↑' : '↓'} {Math.abs(payinSuccessChange)}% from last month
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Monthly Transactions Line Chart */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <h3 className="text-lg font-semibold mb-4">Monthly Transactions</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTransactionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="payin"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="payout"
                          stroke="#10b981"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Payin Status Pie Chart */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <h3 className="text-lg font-semibold mb-4">Payin Status Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={payinStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => {
                            const total = payinStatusData.reduce((sum, item) => sum + item.value, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${name}: ${percentage}%`;
                          }}
                        >
                          {payinStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => {
                            const total = payinStatusData.reduce((sum, item) => sum + item.value, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return [`${value} (${percentage}%)`, name];
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Additional Bar Chart */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-6 rounded-xl shadow-lg mb-8"
              >
                <h3 className="text-lg font-semibold mb-4">Payout Status Overview</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={payoutStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        formatter={(value, name, props) => {
                          const total = payoutStatusData.reduce((sum, item) => sum + item.value, 0);
                          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                          return [`${value} (${percentage}%)`, name];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {payoutStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </>
          )}
        </main>
      </div>
    </section>
  );
};

export default Mdashboard;