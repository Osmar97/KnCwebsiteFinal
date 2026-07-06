import { useMemo, useState } from "react";
import { AdminPageMeta } from "@/contexts/AdminPageMetaContext";
import { useComputedAnalytics, useAnalyticsData, defaultFilters, formatCurrency, type AnalyticsFilters } from "@/hooks/admin/useAnalytics";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportToCsv, exportToXlsx } from "@/lib/exporters";
import { Download, TrendingUp, TrendingDown, DollarSign, Users, Calendar, Target, Percent, Filter, RefreshCw } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#D4A65A", "#10b981", "#3b82f6", "#a855f7", "#ef4444", "#f59e0b", "#06b6d4", "#ec4899"];

const KPI = ({ label, value, sub, icon: Icon, accent }: { label: string; value: string; sub?: string; icon: any; accent?: string }) => (
  <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
    <div className="flex items-start justify-between">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-gray-400">{label}</p>
        <p className={`text-xl sm:text-2xl font-bold mt-1.5 ${accent ?? "text-white"}`}>{value}</p>
        {sub && <p className="text-[11px] text-gray-500 mt-1">{sub}</p>}
      </div>
      <Icon className="w-5 h-5 text-gold flex-shrink-0" />
    </div>
  </div>
);

const ChartCard = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
    <div className="flex items-center justify-between mb-3 gap-2">
      <h3 className="text-xs uppercase tracking-widest text-gray-400">{title}</h3>
      {action}
    </div>
    <div className="w-full h-[260px]">{children}</div>
  </div>
);

const ExportButtons = ({ rows, name }: { rows: Record<string, any>[]; name: string }) => (
  <div className="flex gap-1.5">
    <Button size="sm" variant="outline" className="h-8 text-xs border-gray-700 text-gray-200 hover:text-gold hover:border-gold" onClick={() => exportToCsv(rows, name)}>
      <Download className="w-3 h-3 mr-1" /> CSV
    </Button>
    <Button size="sm" variant="outline" className="h-8 text-xs border-gray-700 text-gray-200 hover:text-gold hover:border-gold" onClick={() => exportToXlsx(rows, name)}>
      <Download className="w-3 h-3 mr-1" /> Excel
    </Button>
  </div>
);

const AdminAnalytics = () => {
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultFilters);
  const raw = useAnalyticsData();
  const { data, isLoading } = useComputedAnalytics(filters);

  const tours = raw.data?.tours ?? [];
  const allDestinations = useMemo(() => {
    const s = new Set<string>();
    for (const t of tours) (t.destinations ?? []).forEach((d) => s.add(d));
    return Array.from(s).sort();
  }, [tours]);
  const allCountries = useMemo(() => {
    const s = new Set<string>();
    for (const q of raw.data?.quotes ?? []) {
      if (q.country) s.add(q.country);
      if (q.nationality) s.add(q.nationality);
    }
    for (const w of raw.data?.waitlist ?? []) if (w.country) s.add(w.country);
    return Array.from(s).sort();
  }, [raw.data]);

  const reset = () => setFilters(defaultFilters);

  if (isLoading || !data) {
    return (
      <>
        <AdminPageMeta title="Analytics" description="Revenue, tour performance and CRM insights." />
        <p className="text-gray-400 text-sm">Loading analytics…</p>
      </>
    );
  }

  const growthAccent =
    data.revenueGrowthPct === null ? "text-gray-300" : data.revenueGrowthPct >= 0 ? "text-emerald-400" : "text-red-400";
  const growthLabel = data.revenueGrowthPct === null ? "—" : `${data.revenueGrowthPct >= 0 ? "+" : ""}${data.revenueGrowthPct.toFixed(1)}%`;

  return (
    <>
      <AdminPageMeta
        title="Analytics"
        description="Revenue, lead performance, booking performance and tour performance."
      />
      <div className="flex justify-end mb-4">
        <Button size="sm" variant="outline" className="border-gray-700 text-gray-200" onClick={() => raw.refetch()}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
        </Button>
      </div>
      {/* Filters */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 sm:p-4 mb-5">
        <div className="flex items-center gap-2 mb-3 text-gray-400 text-xs uppercase tracking-widest">
          <Filter className="w-3.5 h-3.5" /> Filters
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <Input type="date" value={filters.start ?? ""} onChange={(e) => setFilters((f) => ({ ...f, start: e.target.value || null }))} className="bg-gray-900 border-gray-800 text-white" />
          <Input type="date" value={filters.end ?? ""} onChange={(e) => setFilters((f) => ({ ...f, end: e.target.value || null }))} className="bg-gray-900 border-gray-800 text-white" />
          <Select value={filters.tourId ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, tourId: v === "all" ? null : v }))}>
            <SelectTrigger className="bg-gray-900 border-gray-800 text-white"><SelectValue placeholder="Tour" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tours</SelectItem>
              {tours.map((t) => <SelectItem key={t.id} value={t.id}>{t.name_en}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.destination ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, destination: v === "all" ? null : v }))}>
            <SelectTrigger className="bg-gray-900 border-gray-800 text-white"><SelectValue placeholder="Destination" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All destinations</SelectItem>
              {allDestinations.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.country ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, country: v === "all" ? null : v }))}>
            <SelectTrigger className="bg-gray-900 border-gray-800 text-white"><SelectValue placeholder="Country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {allCountries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.source ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, source: v as AnalyticsFilters["source"] }))}>
            <SelectTrigger className="bg-gray-900 border-gray-800 text-white"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="booking">Tour Booking</SelectItem>
              <SelectItem value="quote">Custom Quote</SelectItem>
              <SelectItem value="waitlist">Waitlist</SelectItem>
              <SelectItem value="contact">Contact Form</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end mt-3">
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gold" onClick={reset}>Reset filters</Button>
        </div>
      </div>

      <Tabs defaultValue="executive" className="w-full">
        <TabsList className="bg-gray-900 border border-gray-800 mb-4 flex-wrap h-auto">
          <TabsTrigger value="executive">Executive Summary</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="tours">Tour Analytics</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
        </TabsList>

        {/* EXECUTIVE */}
        <TabsContent value="executive" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPI label="Total Revenue" value={formatCurrency(data.totalRevenue, data.currency)} icon={DollarSign} accent="text-emerald-400" />
            <KPI label="Growth (MoM)" value={growthLabel} icon={data.revenueGrowthPct && data.revenueGrowthPct < 0 ? TrendingDown : TrendingUp} accent={growthAccent} />
            <KPI label="New Leads" value={String(data.totalLeads)} icon={Users} />
            <KPI label="Qualified Leads" value={String(data.qualifiedLeads)} icon={Target} />
            <KPI label="Active Tours" value={String(data.activeTours)} icon={Calendar} accent="text-gold" />
            <KPI label="Avg Occupancy" value={`${data.avgOccupancy.toFixed(0)}%`} icon={Percent} />
            <KPI label="Conversion Rate" value={`${data.conversionRate.toFixed(1)}%`} icon={Target} />
            <KPI label="Top Destination" value={data.mostPopularDestination ?? "—"} icon={Calendar} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Monthly Revenue (last 12)">
              <ResponsiveContainer>
                <BarChart data={data.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937" }} formatter={(v: number) => formatCurrency(v, data.currency)} />
                  <Bar dataKey="revenue" fill="#D4A65A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Leads per Month">
              <ResponsiveContainer>
                <LineChart data={data.leadsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937" }} />
                  <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        {/* REVENUE */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPI label="Total Revenue" value={formatCurrency(data.totalRevenue, data.currency)} icon={DollarSign} accent="text-emerald-400" />
            <KPI label="This Month" value={formatCurrency(data.revenueThisMonth, data.currency)} icon={Calendar} />
            <KPI label="Last Month" value={formatCurrency(data.revenueLastMonth, data.currency)} icon={Calendar} />
            <KPI label="Growth %" value={growthLabel} icon={TrendingUp} accent={growthAccent} />
            <KPI label="Avg Booking Value" value={formatCurrency(data.avgBookingValue, data.currency)} icon={DollarSign} />
            <KPI label="Deposits Collected" value={formatCurrency(data.depositsCollected, data.currency)} icon={DollarSign} />
            <KPI label="Outstanding Revenue" value={formatCurrency(data.outstandingRevenue, data.currency)} icon={DollarSign} accent="text-amber-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Revenue by Destination" action={<ExportButtons rows={data.revenueByDestination} name="revenue_by_destination" />}>
              <ResponsiveContainer>
                <BarChart data={data.revenueByDestination.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} width={100} />
                  <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937" }} formatter={(v: number) => formatCurrency(v, data.currency)} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Revenue by Tour" action={<ExportButtons rows={data.revenueByTour} name="revenue_by_tour" />}>
              <ResponsiveContainer>
                <BarChart data={data.revenueByTour.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} width={120} />
                  <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937" }} formatter={(v: number) => formatCurrency(v, data.currency)} />
                  <Bar dataKey="revenue" fill="#D4A65A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Revenue by Country" action={<ExportButtons rows={data.revenueByCountry} name="revenue_by_country" />}>
              <ResponsiveContainer>
                <BarChart data={data.revenueByCountry.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937" }} formatter={(v: number) => formatCurrency(v, data.currency)} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Revenue by Source" action={<ExportButtons rows={data.revenueBySource} name="revenue_by_source" />}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.revenueBySource} dataKey="revenue" nameKey="name" outerRadius={90} label={(e: any) => e.name}>
                    {data.revenueBySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937" }} formatter={(v: number) => formatCurrency(v, data.currency)} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        {/* TOURS */}
        <TabsContent value="tours" className="space-y-4">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase tracking-widest text-gray-400">Per-tour performance</h3>
              <ExportButtons rows={data.tourPerf} name="tour_performance" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-800">
                    <th className="py-2 pr-3">Tour</th>
                    <th className="py-2 pr-3 text-right">Capacity</th>
                    <th className="py-2 pr-3 text-right">Booked</th>
                    <th className="py-2 pr-3 text-right">Remaining</th>
                    <th className="py-2 pr-3 text-right">Occupancy</th>
                    <th className="py-2 pr-3 text-right">Waitlist</th>
                    <th className="py-2 pr-3 text-right">Conversion</th>
                    <th className="py-2 pr-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tourPerf.length === 0 && (
                    <tr><td colSpan={8} className="py-6 text-center text-gray-500">No tour data.</td></tr>
                  )}
                  {data.tourPerf.map((t) => (
                    <tr key={t.tourId} className="border-b border-gray-900 hover:bg-gray-900/40">
                      <td className="py-2 pr-3 text-white">{t.name}</td>
                      <td className="py-2 pr-3 text-right text-gray-300">{t.capacity}</td>
                      <td className="py-2 pr-3 text-right text-gray-300">{t.booked}</td>
                      <td className="py-2 pr-3 text-right text-gray-300">{t.remaining}</td>
                      <td className={`py-2 pr-3 text-right font-medium ${t.occupancy >= 75 ? "text-emerald-400" : t.occupancy >= 40 ? "text-amber-400" : "text-red-400"}`}>{t.occupancy.toFixed(0)}%</td>
                      <td className="py-2 pr-3 text-right text-gray-300">{t.waitlist}</td>
                      <td className="py-2 pr-3 text-right text-gray-300">{t.conversion.toFixed(1)}%</td>
                      <td className="py-2 pr-3 text-right text-gold">{formatCurrency(t.revenue, data.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Best performing</h3>
              <ul className="space-y-2">
                {[...data.tourPerf].sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((t) => (
                  <li key={t.tourId} className="flex items-center justify-between text-sm">
                    <span className="text-white truncate">{t.name}</span>
                    <span className="text-emerald-400">{formatCurrency(t.revenue, data.currency)} · {t.occupancy.toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Underperforming</h3>
              <ul className="space-y-2">
                {[...data.tourPerf].sort((a, b) => a.occupancy - b.occupancy).slice(0, 5).map((t) => (
                  <li key={t.tourId} className="flex items-center justify-between text-sm">
                    <span className="text-white truncate">{t.name}</span>
                    <span className="text-red-400">{t.occupancy.toFixed(0)}% occupancy</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ChartCard title="Bookings per Month">
            <ResponsiveContainer>
              <BarChart data={data.bookingsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937" }} />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        {/* FUNNEL */}
        <TabsContent value="funnel" className="space-y-4">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-widest text-gray-400">Lead conversion funnel</h3>
              <ExportButtons rows={data.funnel} name="conversion_funnel" />
            </div>
            <div className="space-y-2">
              {data.funnel.map((f, i) => {
                const top = data.funnel[0]?.count || 1;
                const prev = i > 0 ? data.funnel[i - 1].count : null;
                const stagePct = (f.count / top) * 100;
                const dropoff = prev !== null && prev > 0 ? ((prev - f.count) / prev) * 100 : null;
                return (
                  <div key={f.stage}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-200">{f.stage}</span>
                      <span className="text-gray-400">
                        {f.count} · {stagePct.toFixed(0)}%{dropoff !== null && dropoff > 0 && <span className="text-red-400 ml-2">−{dropoff.toFixed(0)}%</span>}
                      </span>
                    </div>
                    <div className="h-7 bg-gray-900 rounded overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gold to-amber-600" style={{ width: `${Math.max(2, stagePct)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Overall conversion (Leads → Paid Bookings): <span className="text-gold font-semibold">{data.conversionRate.toFixed(1)}%</span>
            </p>
          </div>
        </TabsContent>

        {/* SOURCES */}
        <TabsContent value="sources" className="space-y-4">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase tracking-widest text-gray-400">Performance by source</h3>
              <ExportButtons rows={data.leadsBySource} name="lead_sources" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-800">
                    <th className="py-2 pr-3">Source</th>
                    <th className="py-2 pr-3 text-right">Total Leads</th>
                    <th className="py-2 pr-3 text-right">Qualified</th>
                    <th className="py-2 pr-3 text-right">Bookings</th>
                    <th className="py-2 pr-3 text-right">Revenue</th>
                    <th className="py-2 pr-3 text-right">Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leadsBySource.map((s) => (
                    <tr key={s.name} className="border-b border-gray-900">
                      <td className="py-2 pr-3 text-white">{s.name}</td>
                      <td className="py-2 pr-3 text-right text-gray-300">{s.leads}</td>
                      <td className="py-2 pr-3 text-right text-gray-300">{s.qualified}</td>
                      <td className="py-2 pr-3 text-right text-gray-300">{s.bookings}</td>
                      <td className="py-2 pr-3 text-right text-gold">{formatCurrency(s.revenue, data.currency)}</td>
                      <td className="py-2 pr-3 text-right text-emerald-400">{s.conversion.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ChartCard title="Leads by Source" action={<ExportButtons rows={data.leadsBySource} name="leads_by_source_chart" />}>
            <ResponsiveContainer>
              <BarChart data={data.leadsBySource}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="leads" fill="#D4A65A" />
                <Bar dataKey="qualified" fill="#10b981" />
                <Bar dataKey="bookings" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AdminAnalytics;