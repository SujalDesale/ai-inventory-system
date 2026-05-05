import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList
} from "recharts";

export default function Reports() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/reports/full")
      .then(res => {
        console.log("REPORT DATA:", res.data);
        setData(res.data);
      })
      .catch(console.error);
  }, []);

  // ================= HELPERS =================

  const toChart = (obj) =>
    obj && Object.keys(obj).length > 0
      ? Object.entries(obj).map(([k, v]) => ({ name: k, value: v }))
      : [];

  const salesChart = toChart(data?.topItems);

  // 🔥 SORTED CATEGORY (HIGH → LOW)
  const categoryChart = toChart(data?.salesByCategory)
    .sort((a, b) => b.value - a.value);

  const trendChart = data?.dailySales
    ? Object.entries(data.dailySales).map(([date, value]) => ({
        date,
        value
      }))
    : [];

  // ================= STOCK =================

  const stockHealth = data?.products?.map(p => {
    let status = "Healthy";
    if (p.quantity <= p.threshold) status = "Low";
    else if (p.quantity > p.threshold * 2) status = "Overstock";
    return { ...p, status };
  }) || [];

  const healthSummary = ["Healthy", "Low", "Overstock"].map(type => ({
    name: type,
    value: stockHealth.filter(p => p.status === type).length
  }));

  // ================= EXPIRY =================

  const expiryData = data?.expiredProducts?.map(p => ({
    name: p.name,
    value: p.quantity * p.costPrice
  })) || [];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Reports & Analytics</h2>

      {!selected && (
        <div className="grid grid-cols-3 gap-6">

          <Card title="Sales Report"
            items={["Top Selling", "Sales by Category", "Sales Trend"]}
            setSelected={setSelected}
          />

          <Card title="Expiry & Wastage"
            items={["Expiry Loss"]}
            setSelected={setSelected}
          />

          <Card title="Stock Health Report"
            items={["Stock Distribution", "Low Stock Items", "Overstock Items"]}
            setSelected={setSelected}
          />

          <Card title="AI Insights"
            items={["Forecast Accuracy"]}
            setSelected={setSelected}
          />
        </div>
      )}

      {selected && (
        <div className="bg-white p-6 rounded-xl shadow">

          <button onClick={() => setSelected(null)} className="text-indigo-600 mb-4">
            ← Back
          </button>

          <h3 className="text-lg font-semibold mb-4">{selected}</h3>

          {/* ===== SALES ===== */}

          {selected === "Top Selling" && (
            salesChart.length === 0
              ? <Empty />
              : <AnimatedBar data={salesChart} color="#6366F1" />
          )}

          {selected === "Sales by Category" && (
            categoryChart.length === 0
              ? <Empty />
              : <AnimatedHorizontalBar data={categoryChart} />
          )}

          {selected === "Sales Trend" && (
            trendChart.length === 0
              ? <Empty />
              : <AnimatedLine data={trendChart} />
          )}

          {/* ===== EXPIRY ===== */}
          {selected === "Expiry Loss" && (
            expiryData.length === 0
              ? <Empty text="No expired products found" />
              : <AnimatedBar data={expiryData} color="#EF4444" />
          )}

          {/* ===== STOCK ===== */}
          {selected === "Stock Distribution" && (
            <PieView data={healthSummary} />
          )}

          {selected === "Low Stock Items" && (
            stockHealth.filter(p => p.status === "Low").length === 0
              ? <Empty />
              : stockHealth.filter(p => p.status === "Low")
                .map(p => <Row key={p._id} name={p.name} value={p.quantity} />)
          )}

          {selected === "Overstock Items" && (
            stockHealth.filter(p => p.status === "Overstock").length === 0
              ? <Empty />
              : stockHealth.filter(p => p.status === "Overstock")
                .map(p => <Row key={p._id} name={p.name} value={p.quantity} />)
          )}

          {/* ===== AI ===== */}
          {selected === "Forecast Accuracy" && (
            <div>
              <p><strong>Status:</strong> Working</p>
              <p><strong>Model:</strong> Linear Regression</p>
              <p><strong>Accuracy:</strong> Medium</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

//
// ================= COMPONENTS =================
//

function Card({ title, items, setSelected }) {
  return (
    <div className="p-5 bg-white shadow rounded-xl">
      <h3 className="font-semibold mb-4">{title}</h3>
      {items.map(i => (
        <div key={i} className="flex justify-between mb-2">
          <span>{i}</span>
          <span onClick={() => setSelected(i)} className="text-blue-500 cursor-pointer">
            View
          </span>
        </div>
      ))}
    </div>
  );
}

function Row({ name, value }) {
  return (
    <div className="flex justify-between border-b py-2">
      <span>{name}</span>
      <span>{value}</span>
    </div>
  );
}

function Empty({ text = "No data available" }) {
  return <p className="text-gray-500">{text}</p>;
}

//
// ================= ADVANCED CHARTS =================
//

// 🔥 TOP CATEGORY HIGHLIGHT
function AnimatedHorizontalBar({ data }) {
  const max = Math.max(...data.map(d => d.value));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart layout="vertical" data={data} margin={{ left: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Bar dataKey="value" animationDuration={1200}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.value === max ? "#F59E0B" : "#10B981"} // 🔥 highlight
            />
          ))}
          <LabelList dataKey="value" position="right" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function AnimatedBar({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill={color} animationDuration={1200}>
          <LabelList dataKey="value" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function AnimatedLine({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          dataKey="value"
          stroke="#6366F1"
          strokeWidth={3}
          dot={{ r: 4 }}
          animationDuration={1200}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function PieView({ data }) {
  const COLORS = ["#6366F1","#10B981","#F59E0B","#EF4444","#3B82F6"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" outerRadius={100} label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}