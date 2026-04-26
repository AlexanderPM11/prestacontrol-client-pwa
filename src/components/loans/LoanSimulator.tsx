import React, { useState, useEffect } from 'react';

interface LoanSimulatorProps {
  onSimulationChange?: (data: any) => void;
}

const LoanSimulator: React.FC<LoanSimulatorProps> = ({ onSimulationChange }) => {
  const [amount, setAmount] = useState<number>(1000);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [installments, setInstallments] = useState<number>(4);
  const [frequency, setFrequency] = useState<string>('Semanal');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [simulation, setSimulation] = useState<any[]>([]);
  const [totalToPay, setTotalToPay] = useState<number>(0);

  useEffect(() => {
    calculateSimulation();
  }, [amount, interestRate, installments, frequency, startDate]);

  const calculateSimulation = () => {
    const totalInterest = amount * (interestRate / 100);
    const total = Number(amount) + totalInterest;
    const installmentAmount = total / installments;
    const principalPerInst = amount / installments;
    const interestPerInst = totalInterest / installments;

    const schedule = [];
    let currentData = new Date(startDate);

    for (let i = 1; i <= installments; i++) {
      // Increment date based on frequency
      if (i > 1) {
        if (frequency === 'Diario') currentData.setDate(currentData.getDate() + 1);
        else if (frequency === 'Semanal') currentData.setDate(currentData.getDate() + 7);
        else if (frequency === 'Quincenal') currentData.setDate(currentData.getDate() + 15);
        else if (frequency === 'Mensual') currentData.setMonth(currentData.getMonth() + 1);
      }

      schedule.push({
        number: i,
        date: currentData.toISOString().split('T')[0],
        amount: installmentAmount.toFixed(2),
        principal: principalPerInst.toFixed(2),
        interest: interestPerInst.toFixed(2),
      });
    }

    setSimulation(schedule);
    setTotalToPay(total);
    
    if (onSimulationChange) {
      onSimulationChange({ amount, interestRate, installments, frequency, startDate, total, schedule });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        <span className="p-2 bg-blue-500 rounded-lg text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </span>
        Simulador de Préstamo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Monto Principal</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tasa de Interés (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Fecha de Inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Frecuencia</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="Diario">Diario</option>
              <option value="Semanal">Semanal</option>
              <option value="Quincenal">Quincenal</option>
              <option value="Mensual">Mensual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Número de Cuotas</label>
            <input
              type="number"
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1 font-medium">Total a Pagar</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">${totalToPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400 text-sm">#</th>
              <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400 text-sm">Fecha</th>
              <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400 text-sm">Cuota</th>
              <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400 text-sm">Capital</th>
              <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400 text-sm">Interés</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {simulation.map((item) => (
              <tr key={item.number} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 text-slate-700 dark:text-slate-300 text-sm">{item.number}</td>
                <td className="py-3 text-slate-700 dark:text-slate-300 text-sm">{item.date}</td>
                <td className="py-3 font-medium text-slate-900 dark:text-white text-sm">${item.amount}</td>
                <td className="py-3 text-slate-600 dark:text-slate-400 text-sm">${item.principal}</td>
                <td className="py-3 text-slate-600 dark:text-slate-400 text-sm">${item.interest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanSimulator;
