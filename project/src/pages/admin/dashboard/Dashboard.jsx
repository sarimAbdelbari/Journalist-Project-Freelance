import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import './dashboard.css';
import { FaUsers, FaNewspaper, FaComments, FaChartLine } from 'react-icons/fa';

// Dummy data
const usersData = [
  { role: 'Admin', value: 2 },
  { role: 'Journalist', value: 8 },
  { role: 'Abonné', value: 40 },
];

const articlesByMonth = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 18 },
  { month: 'Mar', count: 9 },
  { month: 'Apr', count: 15 },
  { month: 'May', count: 20 },
  { month: 'Jun', count: 14 },
  { month: 'Jul', count: 17 },
  { month: 'Aug', count: 22 },
];

const articlesByCategory = [
  { category: 'Politics', count: 22 },
  { category: 'Business', count: 18 },
  { category: 'Tech', count: 29 },
  { category: 'Health', count: 15 },
  { category: 'Science', count: 12 },
  { category: 'Sports', count: 20 },
];

const journalistProductivity = [
  { name: 'Sarah Johnson', articles: 15 },
  { name: 'Michael Chen', articles: 12 },
  { name: 'Aisha Khan', articles: 18 },
  { name: 'David Lee', articles: 9 },
  { name: 'Maria Rodriguez', articles: 14 },
];

const commentsActivity = [
  { month: 'Jan', comments: 45 },
  { month: 'Feb', comments: 68 },
  { month: 'Mar', comments: 52 },
  { month: 'Apr', comments: 70 },
  { month: 'May', comments: 95 },
  { month: 'Jun', comments: 78 },
  { month: 'Jul', comments: 88 },
  { month: 'Aug', comments: 100 },
];

const articleStatusData = [
  { status: 'Published', value: 45 },
  { status: 'Pending', value: 12 },
  { status: 'Draft', value: 8 },
];

// Colors
const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];
const PIE_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];
const LINE_COLOR = '#3b82f6';

const Dashboard = () => {
  // Summary statistics
  const summaryStats = [
    { title: 'Total Users', value: 50, icon: <FaUsers />, color: '#3b82f6' },
    { title: 'Active Journalists', value: 28, icon: <FaChartLine />, color: '#ef4444' },
    { title: 'Articles Published', value: 127, icon: <FaNewspaper />, color: '#10b981' },
    { title: 'Comments', value: 496, icon: <FaComments />, color: '#f59e0b' },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="dashboard-summary">
        {summaryStats.map((stat, index) => (
          <div className="summary-card" key={index} style={{ borderTopColor: stat.color }}>
            <div className="summary-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="summary-details">
              <h3 className="summary-value">{stat.value}</h3>
              <p className="summary-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts Grid */}
      <div className="dashboard-charts">
        
        
        {/* Articles by Month */}
        <div className="chart-card">
          <h2 className="chart-title">Articles Published</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={articlesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke={LINE_COLOR} fill={`${LINE_COLOR}30`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Articles by Category */}
        <div className="chart-card">
          <h2 className="chart-title">Articles by Category</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={articlesByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Journalist Productivity */}
        <div className="chart-card">
          <h2 className="chart-title">Journalist Productivity</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={journalistProductivity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="articles" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Comments Activity */}
        <div className="chart-card">
          <h2 className="chart-title">Comment Activity</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={commentsActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="comments" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#f59e0b" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Article Status */}
        <div className="chart-card">
          <h2 className="chart-title">Article Status</h2>
          <div className="chart-container pie-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={articleStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {articleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Articles`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;