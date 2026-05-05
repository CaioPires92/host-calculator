/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Percent, 
  Plus, 
  Trash2, 
  Info, 
  Coins, 
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';

interface Fee {
  id: string;
  name: string;
  value: number;
  enabled: boolean;
  isRemovable: boolean;
}

export default function App() {
  const [netValue, setNetValue] = useState<number | ''>(1000);
  const [fees, setFees] = useState<Fee[]>([
    { id: 'commission', name: 'Comissão Booking.com', value: 13, enabled: true, isRemovable: false },
    { id: 'genius', name: 'Desconto Genius', value: 10, enabled: true, isRemovable: false },
  ]);
  const [newFeeName, setNewFeeName] = useState('');
  const [newFeeValue, setNewFeeValue] = useState<number | ''>('');
  const [showAddFee, setShowAddFee] = useState(false);

  const toggleFee = (id: string) => {
    setFees(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const removeFee = (id: string) => {
    setFees(prev => prev.filter(f => f.id !== id));
  };

  const addFee = () => {
    if (newFeeName && typeof newFeeValue === 'number') {
      setFees(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newFeeName,
          value: newFeeValue,
          enabled: true,
          isRemovable: true
        }
      ]);
      setNewFeeName('');
      setNewFeeValue('');
      setShowAddFee(false);
    }
  };

  const calculation = useMemo(() => {
    if (typeof netValue !== 'number' || netValue <= 0) return { gross: 0, totalFees: 0 };

    let multiplier = 1;
    fees.forEach(fee => {
      if (fee.enabled) {
        multiplier *= (1 - fee.value / 100);
      }
    });

    const gross = netValue / multiplier;
    
    return {
      gross,
      totalFees: gross - netValue
    };
  }, [netValue, fees]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-blue-500 selection:text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-min">
        
        {/* Header - Bento Span 12 */}
        <header className="col-span-12 flex items-center justify-between px-2 py-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              B.
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-tight leading-none">
                Host <span className="font-semibold">Calculator</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-medium">Booking Management Tool</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-[11px] font-bold uppercase tracking-widest text-white/40">
            <span className="hover:text-white transition-colors cursor-pointer">Simulador</span>
            <span className="text-blue-500">Fluxo de Caixa</span>
          </div>
        </header>

        {/* Main Input - Bento Span 7, Row 2 */}
        <section className="col-span-12 md:col-span-7 md:row-span-2 bg-white/[0.03] border border-white/10 rounded-[28px] p-8 flex flex-col justify-center">
          <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-6 flex items-center gap-2">
            <Coins className="w-3 h-3" /> Valor que desejo receber (Líquido)
          </label>
          <div className="flex items-baseline gap-4 group">
            <span className="text-4xl md:text-5xl font-light opacity-30 group-focus-within:opacity-100 transition-opacity">R$</span>
            <input
              type="number"
              value={netValue}
              onChange={(e) => setNetValue(e.target.value === '' ? '' : Number(e.target.value))}
              className="bg-transparent border-none outline-none text-6xl md:text-8xl font-bold tracking-tighter w-full focus:ring-0 placeholder:text-white/5"
              placeholder="0"
            />
          </div>
          <div className="mt-8 flex gap-3">
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wide">Moeda: BRL</div>
            <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/10 text-[10px] font-bold uppercase tracking-wide text-blue-400">Payout: Transferência</div>
          </div>
        </section>

        {/* Fees Management - Bento Span 5, Row 5 */}
        <section className="col-span-12 md:col-span-5 md:row-span-5 bg-neutral-900/40 border border-white/10 rounded-[28px] p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">Estrutura de Custos</h2>
            <button 
              onClick={() => setShowAddFee(!showAddFee)}
              className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            <AnimatePresence mode="popLayout text-blue-500">
              {fees.map((fee) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={fee.id}
                  className={`flex items-center justify-between p-5 rounded-[22px] border transition-all ${fee.enabled ? 'bg-white/5 border-white/5 active:scale-95' : 'bg-transparent border-white/5 opacity-30 shadow-none'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${fee.enabled ? (fee.id === 'commission' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400') : 'bg-white/5 text-white/20'}`}>
                      {fee.id === 'commission' ? <TrendingUp className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{fee.name}</p>
                      <p className="text-[10px] uppercase font-mono tracking-wider opacity-40">{fee.value}% aplicado</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={fee.enabled}
                      onChange={() => toggleFee(fee.id)}
                      className="w-5 h-5 rounded-md appearance-none border border-white/20 bg-white/5 checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-all"
                    />
                    {fee.isRemovable && (
                      <button 
                        onClick={() => removeFee(fee.id)}
                        className="p-1 hover:text-red-400 text-white/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {showAddFee && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 bg-white/5 rounded-[22px] border border-white/10 space-y-4"
                >
                  <div className="space-y-3 font-medium">
                    <input 
                      value={newFeeName}
                      onChange={(e) => setNewFeeName(e.target.value)}
                      placeholder="Nome da Taxa"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30"
                    />
                    <input 
                      type="number"
                      value={newFeeValue}
                      onChange={(e) => setNewFeeValue(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Porcentagem (%)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addFee} className="flex-1 bg-white text-black py-2.5 rounded-xl text-xs font-bold hover:bg-white/90 transition-colors">Confirmar</button>
                    <button onClick={() => setShowAddFee(false)} className="flex-1 bg-white/10 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">Cancelar</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-8 mt-8 border-t border-white/5 text-white/20">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest mb-2">
              <span>Eficiência Fiscal</span>
              <span>78%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              ></motion.div>
            </div>
          </div>
        </section>

        {/* Result Card - Bento Span 7, Row 3 */}
        <motion.section 
          layout
          className="col-span-12 md:col-span-7 bg-blue-600 rounded-[28px] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 mb-8 block">Preço de Venda Sugerido</span>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl md:text-4xl font-light opacity-60">R$</span>
              <div className="text-7xl md:text-[9rem] font-black tracking-tighter leading-none">
                {calculation.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <p className="mt-6 text-sm md:text-base font-medium text-white/80 max-w-sm">
              Configure seu calendário com este valor para absorver taxas e descontos Genius automaticamente.
            </p>
          </div>
          
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-black/10 rounded-full blur-[60px]"></div>
        </motion.section>

        {/* Metric Card 1 - Bento Span 3 */}
        <section className="col-span-6 md:col-span-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[28px] p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-500/80 mb-1">Custo Total</span>
          <div className="text-2xl md:text-3xl font-bold font-mono text-emerald-400">
            + {formatCurrency(calculation.totalFees)}
          </div>
        </section>

        {/* Metric Card 2 - Bento Span 4 */}
        <section className="col-span-6 md:col-span-4 bg-neutral-900 border border-white/5 rounded-[28px] p-6 flex items-center justify-between px-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-1 block">Payout Bruto</span>
            <div className="text-xl md:text-2xl font-bold">{formatCurrency(calculation.gross)}</div>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/30 backdrop-blur-sm">
            <ChevronRight className="w-6 h-6" />
          </div>
        </section>

      </div>
      
      <footer className="mt-12 md:pb-8 text-center opacity-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em]">Professional Host Terminal v1.2</p>
      </footer>
    </div>
  );
}
