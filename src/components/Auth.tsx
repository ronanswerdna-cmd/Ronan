import React, { useState } from 'react';
import { X, Smartphone, User, Lock, ArrowRight, Sparkles } from 'lucide-react';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  isSignUpInitial: boolean;
  onSuccess: (phone: string, name: string, passwordString: string, referralCodeIntroduced?: string) => void;
}

export default function Auth({ isOpen, onClose, isSignUpInitial, onSuccess }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(isSignUpInitial);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Small validation
    if (!phone) {
      setError('Veuillez entrer un numéro de téléphone.');
      return;
    }
    if (phone.toLowerCase() !== 'admin' && phone.trim().toLowerCase() !== 'ronan ra' && phone.length < 8) {
      setError('Format du numéro invalide. Exemple: 0341234567');
      return;
    }
    if (!password) {
      setError('Veuillez entrer un mot de passe.');
      return;
    }
    if (isSignUp && !name) {
      setError('Veuillez entrer votre nom.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(
        phone, 
        isSignUp ? name : name || 'Utilisateur OXW', 
        password, 
        isSignUp ? referralCode.toUpperCase().trim() : undefined
      );
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden relative shadow-2xl">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-emerald-500"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <span className="font-display font-black text-2xl tracking-widest text-amber-500 uppercase">OXW</span>
            <h3 className="font-display font-extrabold text-xl text-white mt-1">
              {isSignUp ? 'Créer un compte Oxw' : 'Connexion à votre espace'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gérez votre puissance de minage IA à Madagascar
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-slate-400 text-xs font-mono mb-1.5 block">NOM D'UTILISATEUR</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Clara Rabe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-400 text-xs font-mono mb-1.5 block">NUMÉRO MOBILE (MVOLA / AIRTEL / ORANGE)</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ex: 034 56 789 01 ou 'admin'"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-xs font-mono mb-1.5 block">MOT DE PASSE</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="text-slate-400 text-xs font-mono mb-1.5 block">CODE DE PARRAINAGE (OPTIONNEL)</label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-3 w-4 h-4 text-amber-500" />
                  <input
                    type="text"
                    placeholder="Ex: OXW-XXXXX (Optionnel)"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-605 focus:outline-none focus:border-amber-500 transition-colors font-mono uppercase"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  {isSignUp ? 'Créer mon compte de minage' : "Accéder au tableau d'activité"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800/60 pt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              {isSignUp ? 'Déjà inscrit ? Connectez-vous' : "Pas encore de compte ? S'inscrire"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
