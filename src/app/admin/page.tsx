"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
  AreaChart, Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Activation {
  id: string;
  partnerId: string;
  merchantId: string;
  merchantName: string;
  merchantEmail: string;
  earnPoints: boolean;
  redeemPoints: boolean;
  createdAt: string;
  status: string;
  partner: {
    id: string;
    name: string;
    nameAr: string;
  } | null;
}

type ViewMode = "by-partner" | "by-merchant";
type TimeFrame = "7d" | "30d" | "1y" | "custom";

export default function AdminDashboardPage() {
  const [activations, setActivations] = useState<Activation[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("by-partner");
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const password = sessionStorage.getItem("adminPassword");
    if (!password) {
      router.push("/admin/login");
      return;
    }
    try {
      const res = await fetch("/api/activations", {
        headers: { "x-admin-password": password },
      });
      if (res.status === 401) {
        sessionStorage.removeItem("adminPassword");
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setActivations(data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminPassword");
    router.push("/admin/login");
  };

  // Stats
  const total = activations.length;
  const earnOnlyCount = activations.filter((a) => a.earnPoints && !a.redeemPoints).length;
  const redeemOnlyCount = activations.filter((a) => a.redeemPoints && !a.earnPoints).length;
  const bothCount = activations.filter((a) => a.earnPoints && a.redeemPoints).length;

  // Requests over time — dynamic based on timeFrame
  const chartData = (() => {
    const counts: Record<string, number> = {};
    activations.forEach((a) => {
      const day = a.createdAt.split("T")[0];
      counts[day] = (counts[day] || 0) + 1;
    });

    const now = new Date();
    let numDays: number;
    let startDate: Date;

    if (timeFrame === "custom" && customFrom && customTo) {
      startDate = new Date(customFrom);
      const endDate = new Date(customTo);
      numDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    } else if (timeFrame === "1y") {
      numDays = 365;
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 364);
    } else if (timeFrame === "30d") {
      numDays = 30;
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29);
    } else {
      numDays = 7;
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
    }

    // For 1 year, group by week to keep chart readable
    if (timeFrame === "1y") {
      const weeks: { date: string; label: string; requests: number }[] = [];
      let weekTotal = 0;
      let weekStart = "";
      for (let i = 0; i < numDays; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const iso = d.toISOString().split("T")[0];
        if (i % 7 === 0) {
          if (weekStart) {
            weeks.push({ date: weekStart, label: `${new Date(weekStart).getDate()}/${new Date(weekStart).getMonth() + 1}`, requests: weekTotal });
          }
          weekStart = iso;
          weekTotal = 0;
        }
        weekTotal += counts[iso] || 0;
      }
      if (weekStart) {
        weeks.push({ date: weekStart, label: `${new Date(weekStart).getDate()}/${new Date(weekStart).getMonth() + 1}`, requests: weekTotal });
      }
      return weeks;
    }

    // Day-level data for 7d, 30d, custom
    const days: { date: string; label: string; requests: number }[] = [];
    for (let i = 0; i < numDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      days.push({ date: iso, label, requests: counts[iso] || 0 });
    }
    return days;
  })();

  // Group by partner
  const byPartner = activations.reduce<Record<string, { name: string; activations: Activation[] }>>((acc, act) => {
    const key = act.partnerId;
    if (!acc[key]) {
      acc[key] = { name: act.partner?.name || act.partnerId, activations: [] };
    }
    acc[key].activations.push(act);
    return acc;
  }, {});

  const partnerGroups = Object.entries(byPartner).sort(
    ([, a], [, b]) => b.activations.length - a.activations.length
  );

  // Group by merchant
  const byMerchant = activations.reduce<Record<string, { name: string; email: string; activations: Activation[] }>>((acc, act) => {
    const key = act.merchantId;
    if (!acc[key]) {
      acc[key] = { name: act.merchantName, email: act.merchantEmail, activations: [] };
    }
    acc[key].activations.push(act);
    return acc;
  }, {});

  const merchantGroups = Object.entries(byMerchant).sort(
    ([, a], [, b]) => b.activations.length - a.activations.length
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-foreground">Resal Connect — Admin</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Activations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{total}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                across {partnerGroups.length} partners
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Earn Only</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{earnOnlyCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Redeem Only</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{redeemOnlyCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Both (Earn + Redeem)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{bothCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Bar Chart — Requests per Partner */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Requests per Partner</CardTitle>
            </CardHeader>
            <CardContent>
              {partnerGroups.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={partnerGroups.map(([, group]) => ({
                      name: group.name,
                      requests: group.activations.length,
                    }))}
                    layout="vertical"
                    margin={{ top: 0, right: 20, bottom: 0, left: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 13, fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      formatter={(value) => [`${value} merchants`, 'Requests']}
                    />
                    <Bar dataKey="requests" radius={[0, 8, 8, 0]} maxBarSize={36}>
                      {partnerGroups.map(([key], index) => (
                        <Cell key={key} fill={['#3b5bdb', '#5c7cfa', '#748ffc', '#91a7ff', '#bac8ff'][index % 5]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">No data yet</div>
              )}
            </CardContent>
          </Card>

          {/* Donut Chart — Earn vs Redeem vs Both */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Interest Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {total > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Earn Only', value: earnOnlyCount, fill: '#40c057' },
                        { name: 'Redeem Only', value: redeemOnlyCount, fill: '#fd7e14' },
                        { name: 'Both', value: bothCount, fill: '#3b5bdb' },
                      ].filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {[
                        { fill: '#40c057' },
                        { fill: '#fd7e14' },
                        { fill: '#3b5bdb' },
                      ].filter((_, i) => [earnOnlyCount, redeemOnlyCount, bothCount][i] > 0)
                       .map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      formatter={(value) => [`${value} activations`, '']}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={10}
                      formatter={(value) => <span style={{ color: '#6b7280', fontSize: 13 }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">No data yet</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Requests over Time — Area Chart */}
        <Card className="mb-8 bg-white">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Requests over Time
              {timeFrame === "1y" && <span className="ml-1 text-xs font-normal text-muted-foreground">(grouped by week)</span>}
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border bg-muted/50 p-0.5">
                {([["7d", "1W"], ["30d", "1M"], ["1y", "1Y"], ["custom", "Custom"]] as const).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setTimeFrame(value)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      timeFrame === value
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {timeFrame === "custom" && (
                <div className="flex items-center gap-1.5">
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="rounded-md border bg-background px-2 py-1 text-xs"
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="rounded-md border bg-background px-2 py-1 text-xs"
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {timeFrame === "custom" && (!customFrom || !customTo) ? (
              <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
                Select a date range to view data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b5bdb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b5bdb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    interval={Math.max(0, Math.floor(chartData.length / 8) - 1)}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(value) => [`${value} requests`, 'Activations']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#3b5bdb"
                    strokeWidth={2.5}
                    fill="url(#colorReq)"
                    dot={chartData.length <= 31 ? { r: 3, fill: '#3b5bdb', strokeWidth: 0 } : false}
                    activeDot={{ r: 5, fill: '#3b5bdb', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* View Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex rounded-lg border bg-white p-1">
            <button
              onClick={() => setViewMode("by-partner")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "by-partner"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              By Partner
            </button>
            <button
              onClick={() => setViewMode("by-merchant")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "by-merchant"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              By Merchant
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {total} activation{total !== 1 ? "s" : ""} from {merchantGroups.length} merchant{merchantGroups.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* By Partner View */}
        {viewMode === "by-partner" && (
          <div className="space-y-4">
            {partnerGroups.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No activations yet
                </CardContent>
              </Card>
            ) : (
              partnerGroups.map(([partnerId, group]) => {
                const isExpanded = expandedPartner === partnerId;
                const earnOnly = group.activations.filter((a) => a.earnPoints && !a.redeemPoints).length;
                const redeemOnly = group.activations.filter((a) => a.redeemPoints && !a.earnPoints).length;
                const both = group.activations.filter((a) => a.earnPoints && a.redeemPoints).length;

                return (
                  <Card key={partnerId} className="bg-white overflow-hidden">
                    {/* Partner Header — clickable */}
                    <button
                      onClick={() => setExpandedPartner(isExpanded ? null : partnerId)}
                      className="flex w-full items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
                          {group.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground">{group.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {group.activations.length} merchant{group.activations.length !== 1 ? "s" : ""} interested
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Mini stats */}
                        <div className="flex gap-2">
                          {earnOnly > 0 && (
                            <Badge className="bg-green-50 text-green-700 text-xs font-medium">
                              {earnOnly} Earn
                            </Badge>
                          )}
                          {redeemOnly > 0 && (
                            <Badge className="bg-orange-50 text-orange-700 text-xs font-medium">
                              {redeemOnly} Redeem
                            </Badge>
                          )}
                          {both > 0 && (
                            <Badge className="bg-blue-50 text-blue-700 text-xs font-medium">
                              {both} Both
                            </Badge>
                          )}
                        </div>
                        {/* Expand icon */}
                        <svg
                          className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded merchant list */}
                    {isExpanded && (
                      <div className="border-t">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Merchant</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.activations.map((act) => (
                              <TableRow key={act.id}>
                                <TableCell className="font-medium">{act.merchantName}</TableCell>
                                <TableCell className="text-muted-foreground">{act.merchantEmail}</TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    {act.earnPoints && (
                                      <Badge className="bg-green-50 text-green-700 text-xs">Earn</Badge>
                                    )}
                                    {act.redeemPoints && (
                                      <Badge className="bg-orange-50 text-orange-700 text-xs">Redeem</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{act.status}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {new Date(act.createdAt).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* By Merchant View */}
        {viewMode === "by-merchant" && (
          <Card className="bg-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Partners</TableHead>
                    <TableHead>Earn</TableHead>
                    <TableHead>Redeem</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {merchantGroups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                        No activations yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    merchantGroups.map(([merchantId, group]) => {
                      const earnPartners = group.activations.filter((a) => a.earnPoints).map((a) => a.partner?.name || a.partnerId);
                      const redeemPartners = group.activations.filter((a) => a.redeemPoints).map((a) => a.partner?.name || a.partnerId);
                      const latestDate = group.activations.reduce(
                        (latest, a) => (a.createdAt > latest ? a.createdAt : latest),
                        ""
                      );

                      return (
                        <TableRow key={merchantId}>
                          <TableCell className="font-medium">{group.name}</TableCell>
                          <TableCell className="text-muted-foreground">{group.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {group.activations.map((a) => (
                                <Badge key={a.id} variant="secondary" className="text-xs">
                                  {a.partner?.name || a.partnerId}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {earnPartners.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {earnPartners.map((name, i) => (
                                  <Badge key={i} className="bg-green-50 text-green-700 text-xs">
                                    {name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {redeemPartners.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {redeemPartners.map((name, i) => (
                                  <Badge key={i} className="bg-orange-50 text-orange-700 text-xs">
                                    {name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(latestDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
