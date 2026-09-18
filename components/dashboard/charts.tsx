"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { brl, monthLabel } from "@/lib/format";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#14b8a6"];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid hsl(214 32% 91%)",
  fontSize: 12,
};

export function ReceitaAreaChart({
  data,
}: {
  data: { mes: string; receita: number; despesa: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data.map((d) => ({ ...d, label: monthLabel(d.mes) }))}>
        <defs>
          <linearGradient id="receita" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="despesa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `R$${Math.round(Number(v) / 1000)}k`}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => brl(Number(v))} />
        <Legend />
        <Area type="monotone" dataKey="receita" name="Receita" stroke="#3b82f6" fill="url(#receita)" strokeWidth={2} />
        <Area type="monotone" dataKey="despesa" name="Despesa" stroke="#ef4444" fill="url(#despesa)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function NovosClientesChart({ data }: { data: { mes: string; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data.map((d) => ({ ...d, label: monthLabel(d.mes) }))}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="total" name="Novos clientes" fill="#3b82f6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DespesasPieChart({ data }: { data: { categoria: string; valor: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="valor" nameKey="categoria" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => brl(Number(v))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
