import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, ArrowLeft, Save, Search, User } from 'lucide-react';
import axios from 'axios';
import LoanSimulator from '../components/loans/LoanSimulator';

const NewLoanPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      setClients(response.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const filteredClients = clients.filter(c => 
    c.fullName.toLowerCase().includes(search.toLowerCase()) || 
    c.documentId.includes(search)
  );

  const handleSaveLoan = async () => {
    if (!selectedClient) {
      setError('Debes seleccionar un cliente.');
      return;
    }
    if (!simulationData) return;

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        clientId: selectedClient.id,
        amount: simulationData.amount,
        interestRate: simulationData.interestRate,
        lateFeeRate: 50, // Default late fee fixed daily
        frequency: simulationData.frequency,
        installmentsCount: simulationData.installments,
        startDate: simulationData.startDate
      };

      await axios.post(`${API_URL}/loans`, payload);
      navigate('/loans');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el préstamo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/loans')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft className="text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="text-blue-600" /> Nuevo Préstamo
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Configura y origina un nuevo crédito</p>
          </div>
        </div>
        
        <button 
          onClick={handleSaveLoan}
          disabled={isSubmitting || !selectedClient}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Registrar Préstamo
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2 animate-shake">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Client Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Seleccionar Cliente</h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Nombre o documento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
                    selectedClient?.id === client.id 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700' 
                      : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    selectedClient?.id === client.id ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                  }`}>
                    <User size={18} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-sm ${selectedClient?.id === client.id ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300'}`}>
                      {client.fullName}
                    </p>
                    <p className="text-xs text-slate-500">{client.documentId}</p>
                  </div>
                </button>
              ))}
              {filteredClients.length === 0 && (
                <p className="text-center py-4 text-slate-400 text-sm italic">No se encontraron clientes</p>
              )}
            </div>
          </div>

          {selectedClient && (
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Perfil del Cliente</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full border border-green-500/30 uppercase">Verificado</span>
              </div>
              <h4 className="text-xl font-bold mb-1">{selectedClient.fullName}</h4>
              <p className="text-slate-400 text-sm mb-4">{selectedClient.documentId}</p>
              <div className="space-y-2 border-t border-slate-800 pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Teléfono:</span>
                  <span className="font-medium">{selectedClient.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Estado:</span>
                  <span className="text-green-400 font-medium">Activo</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Simulator */}
        <div className="lg:col-span-8">
          <LoanSimulator onSimulationChange={setSimulationData} />
        </div>
      </div>
    </div>
  );
};

export default NewLoanPage;
