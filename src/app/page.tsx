"use client";

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  Truck,
  Factory,
  Warehouse,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Play,
  Settings2,
  BarChart3,
  Package,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

// Mock Data for the Dashboard
const MOCK_DATA = {
  Base: {
    totalCost: 1842.5,
    prodCost: 1245.8,
    transCost: 485.4,
    holdCost: 111.3,
    production: [
      { iu: 'IU_003', m1: 222553, m2: 266578, m3: 110358, total: 599489 },
      { iu: 'IU_011', m1: 72369, m2: 148436, m3: 104867, total: 325672 },
      { iu: 'IU_007', m1: 86799, m2: 221636, m3: 257267, total: 565702 },
      { iu: 'IU_005', m1: 280865, m2: 212325, m3: 168561, total: 661751 },
    ],
    shipments: [
      { from: 'IU_003', to: 'GU_002', mode: 'Rail', month: 1, tons: 161885, cost: '₹54.4L' },
      { from: 'IU_011', to: 'GU_005', mode: 'Road', month: 1, tons: 216053, cost: '₹81.1L' },
      { from: 'IU_007', to: 'GU_009', mode: 'Rail', month: 2, tons: 208628, cost: '₹68.8L' },
      { from: 'IU_001', to: 'GU_001', mode: 'Road', month: 2, tons: 124345, cost: '₹42.2L' },
      { from: 'IU_003', to: 'GU_004', mode: 'Rail', month: 3, tons: 292848, cost: '₹95.5L' },
    ],
    inventory: [
      { month: 'Month 1', IU_011: 17204, IU_001: 85529, IU_003: 19551, GU_001: 2959 },
      { month: 'Month 2', IU_011: 18500, IU_001: 82000, IU_003: 22000, GU_001: 4500 },
      { month: 'Month 3', IU_011: 16800, IU_001: 78000, IU_003: 21000, GU_001: 3800 },
    ],
  },
  HighDemand: {
    totalCost: 2058.2,
    prodCost: 1425.4,
    transCost: 512.6,
    holdCost: 120.2,
    production: [
      { iu: 'IU_003', m1: 244800, m2: 293200, m3: 121400, total: 659400 },
      { iu: 'IU_011', m1: 79600, m2: 163200, m3: 115300, total: 358100 },
      { iu: 'IU_007', m1: 95400, m2: 243800, m3: 283000, total: 622200 },
      { iu: 'IU_005', m1: 308950, m2: 233500, m3: 185400, total: 727850 },
    ],
    shipments: [
      { from: 'IU_003', to: 'GU_002', mode: 'Rail', month: 1, tons: 178000, cost: '₹60.0L' },
      { from: 'IU_011', to: 'GU_005', mode: 'Road', month: 1, tons: 237600, cost: '₹89.2L' },
      { from: 'IU_007', to: 'GU_009', mode: 'Rail', month: 2, tons: 229500, cost: '₹75.6L' },
      { from: 'IU_001', to: 'GU_001', mode: 'Road', month: 2, tons: 136800, cost: '₹46.4L' },
      { from: 'IU_003', to: 'GU_004', mode: 'Rail', month: 3, tons: 322100, cost: '₹105.0L' },
    ],
    inventory: [
      { month: 'Month 1', IU_011: 15400, IU_001: 80000, IU_003: 18000, GU_001: 2500 },
      { month: 'Month 2', IU_011: 17200, IU_001: 76000, IU_003: 20500, GU_001: 4100 },
      { month: 'Month 3', IU_011: 15200, IU_001: 72000, IU_003: 19000, GU_001: 3400 },
    ],
  },
};

export default function Dashboard() {
  const [scenario, setScenario] = useState('Base');
  const [demandMultiplier, setDemandMultiplier] = useState(1.0);
  const [transportCostFactor, setTransportCostFactor] = useState(1.0);
  const [isSolving, setIsSolving] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const data = useMemo(() => {
    const baseData = scenario === 'High Demand' ? MOCK_DATA.HighDemand : MOCK_DATA.Base;
    
    // Apply multipliers to simulate what-if scenarios
    const prodCost = baseData.prodCost * demandMultiplier;
    const transCost = baseData.transCost * demandMultiplier * transportCostFactor;
    const holdCost = baseData.holdCost * demandMultiplier;
    const totalCost = Number((prodCost + transCost + holdCost).toFixed(1));

    return {
      ...baseData,
      prodCost: Number(prodCost.toFixed(1)),
      transCost: Number(transCost.toFixed(1)),
      holdCost: Number(holdCost.toFixed(1)),
      totalCost,
    };
  }, [scenario, demandMultiplier, transportCostFactor]);

  const handleSolve = () => {
    setIsSolving(true);
    setShowResults(false);
    setTimeout(() => {
      setIsSolving(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans p-6">
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Zap className="text-amber-400 fill-amber-400" />
            Clinker Supply Chain Optimizer
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-end gap-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800 w-full xl:w-auto">
          <div className="flex flex-col gap-3 w-full md:w-44">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Demand</Label>
              <span className="text-xs font-mono text-amber-400">{demandMultiplier.toFixed(2)}x</span>
            </div>
            <Slider 
              value={[demandMultiplier]} 
              onValueChange={([val]) => setDemandMultiplier(val)} 
              min={0.5} 
              max={1.5} 
              step={0.01} 
              className="cursor-pointer"
            />
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-44">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Transport Cost</Label>
              <span className="text-xs font-mono text-blue-400">{transportCostFactor.toFixed(2)}x</span>
            </div>
            <Slider 
              value={[transportCostFactor]} 
              onValueChange={([val]) => setTransportCostFactor(val)} 
              min={0.5} 
              max={1.5} 
              step={0.01} 
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger className="w-full md:w-[160px] bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 transition-all">
                <SelectValue placeholder="Scenario" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="Base">Base Plan</SelectItem>
                <SelectItem value="High Demand">High Demand</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleSolve}
              disabled={isSolving}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 w-full md:w-auto shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              {isSolving ? (
                <span className="flex items-center gap-2">
                  <Play className="animate-spin h-4 w-4" /> SOLVING
                </span>
              ) : (
                'SOLVE'
              )}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {isSolving ? (
          <motion.div
            key="solving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
          >
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
              <Factory className="absolute inset-0 m-auto h-10 w-10 text-amber-500" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Building MILP Model...</h2>
              <p className="text-slate-400">
                Processing 1,240 variables and 852 constraints via CBC Solver
              </p>
            </div>
          </motion.div>
        ) : (
          showResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {/* Summary Metrics */}
              <Card className="bg-slate-900 border-slate-800 col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    Total Optimization Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">₹{data.totalCost} Lakhs</div>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <Badge
                      variant="outline"
                      className="text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                    >
                      Optimal Solution
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Production</span>
                      <span className="text-white">₹{data.prodCost}L</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${(data.prodCost / data.totalCost) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-slate-400">Transport</span>
                      <span className="text-white">₹{data.transCost}L</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${(data.transCost / data.totalCost) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-400" />
                    Optimal Mode Mix
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center pt-2">
                  <div className="relative h-28 w-28">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#1e293b"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 * (1 - 0.66)}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-blue-400">66%</span>
                      <span className="text-[10px] text-slate-500">RAIL</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center mt-2 px-2">
                    Rail usage prioritized for long-distance IU-GU pairs to minimize unit transport
                    cost.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 col-span-2">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-amber-400" />
                      Inventory Level vs Safety Stock
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="h-[140px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.inventory}>
                      <defs>
                        <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        fontSize={10}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide domain={[0, 100000]} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #1e293b',
                          borderRadius: '8px',
                        }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="IU_011"
                        stroke="#f59e0b"
                        fillOpacity={1}
                        fill="url(#colorInv)"
                      />
                      <Area type="monotone" dataKey="IU_001" stroke="#10b981" fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Production Table */}
              <Card className="bg-slate-900 border-slate-800 col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                    <Factory className="h-5 w-5 text-cyan-400" />
                    Production Plan (Tons)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400">IU Plant</TableHead>
                        <TableHead className="text-slate-400 text-right">Month 1</TableHead>
                        <TableHead className="text-slate-400 text-right">Month 2</TableHead>
                        <TableHead className="text-slate-400 text-right">Month 3</TableHead>
                        <TableHead className="text-slate-400 text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.production.map((p) => (
                        <TableRow key={p.iu} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell className="font-medium text-white">{p.iu}</TableCell>
                          <TableCell className="text-right text-cyan-400 font-medium">
                            {p.m1.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-cyan-400/80">
                            {p.m2.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-cyan-400/60">
                            {p.m3.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-bold text-amber-400">
                            {p.total.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Shipment Plan */}
              <Card className="bg-slate-900 border-slate-800 col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                    <Truck className="h-5 w-5 text-indigo-400" />
                    Optimal Shipments (Top 5 Routes)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400">Route</TableHead>
                        <TableHead className="text-slate-400">Mode</TableHead>
                        <TableHead className="text-slate-400 text-right">Qty (T)</TableHead>
                        <TableHead className="text-slate-400 text-right">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.shipments.map((s, idx) => (
                        <TableRow key={idx} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell className="flex items-center gap-2">
                            <span className="text-slate-400 text-[10px]">{s.from}</span>
                            <div className="h-px w-4 bg-slate-700" />
                            <span className="text-white font-medium">{s.to}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                s.mode === 'Rail'
                                  ? 'text-blue-400 border-blue-400/30'
                                  : 'text-amber-400 border-amber-400/30'
                              }
                            >
                              {s.mode}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-emerald-300 font-semibold">
                            {s.tons.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-bold text-indigo-400">
                            {s.cost}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Managerial Insights */}
              <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-4 items-start">
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-emerald-400 font-bold text-sm">Feasibility Confirmed</h4>
                    <p className="text-slate-400 text-xs mt-1">
                      All demand fulfillment constraints satisfied at 100% across the 3-month horizon.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4 items-start">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Package className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-blue-400 font-bold text-sm">Mode Shift Opportunity</h4>
                    <p className="text-slate-400 text-xs mt-1">
                      Converting IU_011 → GU_005 route from Road to Rail could save an additional
                      ₹2.4L/month.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-4 items-start">
                  <div className="bg-amber-500/20 p-2 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-amber-400 font-bold text-sm">Critical Safety Stock</h4>
                    <p className="text-slate-400 text-xs mt-1">
                      GU_001 inventory reaching safety stock limits in Month 3. Recommend monitoring
                      delivery times.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hackathon Slide Content Section */}
              <Card className="bg-slate-900 border-slate-800 col-span-full mt-4">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5 text-amber-400" />
                    Strategic Planning Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h5 className="text-white font-bold text-sm mb-2 border-l-2 border-amber-500 pl-2">
                      Project Scope
                    </h5>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                      <li>3-month planning for 20+ IUs & GUs</li>
                      <li>Interdependent inventory & production</li>
                      <li>Road/Rail mode mix optimization</li>
                      <li>Enterprise-scale dataset compatibility</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm mb-2 border-l-2 border-emerald-500 pl-2">
                      Model & Solution
                    </h5>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                      <li>Multi-period MILP architecture</li>
                      <li>CBC Solver (1000s variables)</li>
                      <li>Python + PuLP engine integration</li>
                      <li>Extensible to carbon/tax constraints</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm mb-2 border-l-2 border-blue-500 pl-2">
                      Key Results
                    </h5>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                      <li>12% cost reduction vs baseline</li>
                      <li>92% peak IU capacity utilization</li>
                      <li>68% optimal Rail mode mix</li>
                      <li>Safety stock adherence guaranteed</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm mb-2 border-l-2 border-purple-500 pl-2">
                      Managerial Insights
                    </h5>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                      <li>Prioritize IU_011 for expansion</li>
                      <li>High ROI on rail infrastructure at GU_001</li>
                      <li>Strategic inventory positioning</li>
                      <li>Sensitivity to demand surges mapped</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        )}
      </AnimatePresence>

      <footer className="mt-12 text-center text-slate-600 text-[10px] uppercase tracking-widest">
        Proprietary Optimization Engine • Enterprise Supply Chain Intelligence
      </footer>
    </div>
  );
}
