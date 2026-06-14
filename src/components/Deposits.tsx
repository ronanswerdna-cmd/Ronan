import React, { useState } from 'react';
import { Smartphone, ShieldCheck, ArrowRight, Upload, Phone, CheckCircle, Clock, Check, Plus, AlertCircle } from 'lucide-react';
import { UserAccount, DepositRequest } from '../types';

interface DepositsProps {
  user: UserAccount;
  onSubmitDeposit: (deposit: Omit<DepositRequest, 'id' | 'timestamp' | 'status'>) => void;
  usdtRate: number;
  lastRateUpdateAt: string;
}

export default function Deposits({ user, onSubmitDeposit, usdtRate, lastRateUpdateAt }: DepositsProps) {
  const [operator, setOperator] = useState<'mvola' | 'airtel' | 'orange' | 'usdt_trc20'>('usdt_trc20');
  const [senderNumber, setSenderNumber] = useState(user.phone || '');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [proofName, setProofName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Preselected numbers / addresses based on user's operator
  const targets = {
    usdt_trc20: { number: 'TNhoWrCzN2zrDwhDLJ7gszMo4qekyaA48H', owner: 'Réseau TRC-20 (USDT)' }
  };

  const handleSelectQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setProofName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minAmount = Math.ceil(2 * usdtRate); // Minimum 2$ in Ariary based on live exchange rate
    if (!amount || isNaN(Number(amount)) || Number(amount) < minAmount) {
      alert(`Veuillez entrer une somme supérieure ou égale à ${minAmount.toLocaleString('fr-FR')} Ariary (Minimum 2$).`);
      return;
    }
    if (!reference) {
      alert('Veuillez spécifier le code référence de la transaction reçu.');
      return;
    }
    if (!senderNumber) {
      alert("Veuillez entrer votre adresse USDT émettrice.");
      return;
    }

    onSubmitDeposit({
      operator,
      senderNumber,
      amount: Number(amount),
      reference,
      proofName: proofName || 'recu_transfert_screenshot.png',
    });

    setShowNotification(true);
    setAmount('');
    setReference('');
    setProofName('');
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Target Accounts Display */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
        
        <div>
          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono leading-none tracking-widest font-black uppercase px-2.5 py-1 rounded-md inline-block mb-3">
            ⚠️ CONSIGNES OFFICIELLES DE DÉPÔT • TRC-20 UNIQUEMENT
          </span>
          <h3 className="font-display font-black text-white text-lg md:text-xl">
            Compte de Dépôt Crypto Officiel
          </h3>
          <p className="text-slate-400 text-xs md:text-sm mt-1 leading-relaxed">
            Pour acheter un pack de minage, effectuez d'abord le transfert sur notre compte USDT sécurisé ci-dessous. <strong className="text-amber-400">Taux en temps réel : 1 USDT = {Math.round(usdtRate).toLocaleString('fr-FR')} Ar</strong> (actualisé en direct sur internet).
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-amber-500/10 to-slate-950 border border-amber-500/30 p-5 rounded-xl text-left">
            <span className="text-yellow-400 text-[10px] font-mono font-bold uppercase tracking-wider block mb-1">Crypto USDT (TRC-20)</span>
            <p className="text-white text-base md:text-lg font-mono font-black select-all tracking-tight break-all">TNhoWrCzN2zrDwhDLJ7gszMo4qekyaA48H</p>
            <div className="flex justify-between items-center text-[11px] mt-2 text-slate-400">
              <span>Réseau :</span>
              <span className="text-emerald-400 font-bold font-mono">Tron (TRC-20)</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl text-left flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-450 bg-emerald-450 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[8px] font-mono font-black text-emerald-400 uppercase tracking-widest">TEMPS RÉEL</span>
            </div>
            <div>
              <span className="text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider block mb-1">Cours Actuel sur Internet</span>
              <h4 className="text-white text-xl font-mono font-extrabold">{Math.round(usdtRate).toLocaleString('fr-FR')} Ar / USDT</h4>
              <p className="text-[9px] text-slate-500 font-mono mt-0.5">Dernière synchro : <strong className="text-slate-350">{lastRateUpdateAt}</strong></p>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-normal">
              Le taux évolue automatiquement à chaque instant selon le marché international pour vous garantir le meilleur cours possible.
            </p>
          </div>
        </div>
      </section>

      {/* Main Split: Form and History */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Deposit Form */}
        <section className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl relative">
          <h3 className="font-display font-black text-white text-base mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            Déclarer mon dépôt de fonds
          </h3>

          {showNotification && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs rounded-xl mb-4 leading-relaxed font-semibold">
              ✓ Votre demande de rechargement a été enregistrée avec succès ! 
              Notre équipe vérifie actuellement la référence <strong className="text-white">{reference}</strong>.
              Votre solde sera mis à jour sous 5 minutes. Pensez également à transmettre le reçu sur WhatsApp.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs font-mono mb-1.5 block font-bold">PROCÉDÉ DE PAIEMENT SÉLECTIONNÉ</label>
                <div className="w-full bg-slate-950/60 border border-amber-500/30 text-amber-500 rounded-xl py-3 px-4 text-xs font-bold font-mono tracking-wide">
                  💎 CRYPTO USDT (TRC-20)
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs font-mono mb-1.5 block">
                  ADRESSE TRC20 ÉMETTRICE
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: TNhoWrCzN2z..."
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-xs font-mono mb-1.5 block">SOMME VERSÉE (ARIARY)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  placeholder="Ex: 10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                />
                <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-500 font-mono">Ar / Ariary</span>
              </div>
              
              {amount && !isNaN(Number(amount)) && (
                <p className="text-emerald-450 text-emerald-400 text-xs font-mono font-bold mt-1">
                  ✓ Équivaut à : <span className="bg-slate-955 px-1.5 py-0.5 rounded text-white font-black">{(Number(amount) / usdtRate).toFixed(2)} USDT ($)</span>
                </p>
              )}

              {/* Quick Sum Buttons with USDT conversions in parentheses */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[10000, 50000, 200000, 500000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectQuickAmount(val)}
                    className="py-1 px-2.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg text-xs hover:border-amber-500/40 hover:text-white transition-colors font-mono"
                  >
                    +{val.toLocaleString('fr-FR')} Ar ({(val / usdtRate).toFixed(1)} USDT)
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-xs font-mono mb-1.5 block">
                ID DE TRANSACTION CRYPTO (TXID)
              </label>
              <input
                type="text"
                required
                placeholder="Ex: txid_680bfa1e7c5d..."
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Receipt screenshot simulation */}
            <div>
              <label className="text-slate-400 text-xs font-mono mb-1.5 block">
                CAPTURE D'ÉCRAN DU REÇU (OPTIONNEL MAIS RECOMMANDÉ)
              </label>
              
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed ${
                  dragActive ? 'border-amber-500 bg-amber-500/5' : 'border-slate-800 bg-slate-950/30'
                } rounded-xl p-5 text-center transition-colors cursor-pointer relative group`}
              >
                <input
                  type="file"
                  id="screenshot-input"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2 group-hover:text-amber-400 transition-colors" />
                <p className="text-xs text-slate-300 font-medium">
                  {proofName ? (
                    <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> File Loaded: {proofName}
                    </span>
                  ) : (
                    "Glissez votre image de reçu ici, ou cliquez pour naviguer."
                  )}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Sert de preuve visuelle d'envoi</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 transition-colors text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-1 active:scale-95 shadow-md"
            >
              Envoyer ma déclaration pour activation
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </section>

        {/* Deposit History on Right */}
        <section className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h4 className="font-display font-extrabold text-sm text-white mb-3 flex justify-between items-center">
              <span>Déclaration Dépôts</span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">HISTORIQUE</span>
            </h4>

            {user.depositHistory.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-6 leading-relaxed">
                Aucun dépôt déclaré pour le moment.
              </p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                {user.depositHistory.map((dep) => (
                  <div key={dep.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-300 uppercase font-black">
                        {dep.operator}
                      </span>
                      {dep.status === 'pending' ? (
                        <span className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> En attente
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Approuvé ✓
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-400">Montant déclaré :</span>
                      <strong className="text-white">
                        {dep.amount.toLocaleString('fr-FR')} Ar ({(dep.amount / usdtRate).toFixed(2)} USDT)
                      </strong>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono space-y-0.5 border-t border-slate-900 pt-1.5">
                      <p>S/N: {dep.senderNumber}</p>
                      <p>Ref: {dep.reference}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>

    </div>
  );
}
