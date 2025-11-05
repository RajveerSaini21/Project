import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/data/dashboardData.json')
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    if (!data) return <p className="text-center mt-20 text-gray-500">Loading dashboard...</p>;

    const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B'];

    return (
        <div className="p-6 bg-gray-100 min-h-screen font-sans">
            {/* Top cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Object.entries(data.cards).map(([key, val]) => (
                    <div
                        key={key}
                        className="bg-white border-l-4 rounded-xl shadow-md p-5 flex items-center space-x-4 hover:shadow-lg transition"
                        style={{ borderColor: val.color }}
                    >
                        <div
                            className="w-12 h-12 flex items-center justify-center rounded-full text-white text-lg font-bold shadow"
                            style={{ backgroundColor: val.color }}
                        >
                            {val.title.split(' ')[0][0]}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{val.title}</p>
                            <p className="text-2xl font-semibold text-gray-800">
                                {val.value.toLocaleString('en-US', { style: val.value > 100 ? 'currency' : 'decimal', currency: 'USD' })}
                            </p>
                            <p className="text-sm font-medium text-gray-600">{val.change}</p>
                        </div>
                    </div>
                ))}
            </div>


            {/* Graphs section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Area chart */}
                <div className="bg-white p-5 rounded-xl shadow col-span-2">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        Graphical Presentation of Invoices and Sales (Last 10 Days)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data.charts.incomeExpense} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="income" stroke="#3B82F6" fillOpacity={1} fill="url(#incomeColor)" />
                        </AreaChart>
                    </ResponsiveContainer>

                    {/* Income summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 text-center mt-4 text-sm font-medium">
                        <div className="text-green-600">${data.charts.incomeVsExpenses.income.toLocaleString()}<br />Today Income</div>
                        <div className="text-red-500">${data.charts.incomeVsExpenses.expenses.toLocaleString()}<br />Today Expenses</div>
                        <div className="text-green-700">${data.charts.incomeVsExpenses.profit.toLocaleString()}<br />Today Profit</div>
                        <div className="text-orange-500">${data.charts.incomeVsExpenses.revenue.toLocaleString()}<br />Total Revenue</div>
                    </div>
                </div>

                {/* Recent Buyers */}
                <div className="bg-white p-5 rounded-xl shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent Buyers</h2>
                    <ul className="divide-y">
                        {data.recentBuyers.map((b, i) => (
                            <li key={i} className="flex justify-between items-center py-3">
                                <div>
                                    <p className="font-medium text-gray-800">{b.name}</p>
                                    <p className={`text-xs ${b.status === 'Paid' ? 'text-green-600' : b.status === 'Due' ? 'text-red-500' : 'text-yellow-500'}`}>
                                        {b.status}
                                    </p>
                                </div>
                                <span className="font-semibold text-gray-700">${b.amount.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Lower section: invoices + doughnut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Recent invoices table */}
                <div className="bg-white p-5 rounded-xl shadow col-span-2">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold text-gray-700">Recent Invoices</h2>
                        <div className="space-x-2">
                            <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Add Sale</button>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Manage</button>
                        </div>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 text-sm">
                                <th className="p-2">Invoice#</th>
                                <th className="p-2">Customer</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Due</th>
                                <th className="p-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentInvoices.map((r, i) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                    <td className="p-2 text-blue-600">{r.invoice}</td>
                                    <td className="p-2">{r.customer}</td>
                                    <td className={`p-2 ${r.status === 'Paid' ? 'text-green-600' : r.status === 'Due' ? 'text-red-500' : 'text-yellow-600'}`}>
                                        {r.status}
                                    </td>
                                    <td className="p-2">{r.due}</td>
                                    <td className="p-2 font-medium">${r.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Doughnut Chart */}
                <div className="bg-white p-5 rounded-xl shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Income vs Expenses</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Income', value: data.charts.incomeVsExpenses.income },
                                    { name: 'Expenses', value: data.charts.incomeVsExpenses.expenses },
                                    { name: 'Profit', value: data.charts.incomeVsExpenses.profit }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {COLORS.map((color, index) => <Cell key={index} fill={color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
