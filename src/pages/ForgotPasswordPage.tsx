import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import api from '../api/api';

const ForgotPasswordPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { username });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud. Verifica el usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <Link to="/login" className="text-slate-500 hover:text-primary-600 flex items-center gap-2 text-sm font-medium transition-colors">
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>

          {!isSubmitted ? (
            <>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">¿Olvidaste tu contraseña?</h1>
              <p className="text-slate-600 mb-8">
                Ingresa tu nombre de usuario y te enviaremos un código de recuperación a tu Telegram registrado.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Usuario</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                    placeholder="Ej: admin"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20"
                >
                  {isLoading ? 'Enviando...' : (
                    <>
                      Enviar Código <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Enlace Enviado!</h2>
              <p className="text-slate-600 mb-8">
                Hemos enviado las instrucciones de recuperación a tu Telegram. Por favor, revisa tu chat.
              </p>
              <Link
                to="/login"
                className="inline-block w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all active:scale-95"
              >
                Ir al Inicio
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
