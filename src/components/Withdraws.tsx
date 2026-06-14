import React, { useState } from 'react';
import { Smartphone, CheckCircle, ArrowRight, ShieldAlert, History, Clock } from 'lucide-react';
import { UserAccount, WithdrawalRequest } from '../types';

interface WithdrawsProps {
  user: UserAccount;
  onSubmitWithdraw: (withdraw: Omit<WithdrawalRequest, 'id' | 'timestamp' | 'status'>) => void;
  usdtRate: number;
  lastRateUpdateAt: string;
}

export default function Withdraws({ user, onSubmitWithdraw, usdtRate, lastRateUpdateAt }: WithdrawsProps) {
  const [operator, setOperator] = useState<'mvola' | 'airtel' | 'orange' | 'usdt_trc20'>('mvola');
  const [receiverNumber, setReceiverNumber] = useState(user.phone || '');
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const MIN_WITHDRAW = 5000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const value = Number(amount);
    if (!amount || isNaN(value)) {
      setErrorMsg('Veuillez entrer un montant valide en Ariary.');
      return;
    }

    if (value < MIN_WITHDRAW) {
      setErrorMsg(`Le seuil minimal de retrait est de ${MIN_WITHDRAW.toLocaleString('fr-FR')} Ar (${(MIN_WITHDRAW / usdtRate).toFixed(2)} USDT).`);
      return;
    }

    if (value > user.balance) {
      setErrorMsg(`Votre solde actuel (${user.balance.toFixed(2)} Ar / ${(user.balance / usdtRate).toFixed(2)} USDT) est insuffisant pour retirer ${value.toLocaleString('fr-FR')} Ar (${(value / usdtRate).toFixed(2)} USDT).`);
      return;
    }

    if (!receiverNumber) {
      setErrorMsg(operator === 'usdt_trc20' ? "Veuillez indiquer l'adresse TRC-20 de réception." : 'Veuillez indiquer le numéro de téléphone bénéficiaire.');
      return;
    }

    onSubmitWithdraw({
      operator,
      receiverNumber,
      amount: value,
    });

    setSuccessMsg(
      operator === 'usdt_trc20'
        ? `Votre demande de retrait de ${value.toLocaleString('fr-FR')} Ar (${(value / usdtRate).toFixed(2)} USDT) a été soumise avec succès sur votre adresse TRC-20 : ${receiverNumber}.`
        : `Votre demande de retrait de ${value.toLocaleString('fr-FR')} Ar (${(value / usdtRate).toFixed(2)} USDT) a été soumise avec succès sur votre numéro ${receiverNumber}.`
    );
    setAmount('');
  };

  return (
    <div className="space-y-6">
      
      {/* Overview stats bar */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase font-bold">
              SEUIL MINIMUM DE RETRAIT : {MIN_WITHDRAW.toLocaleString('fr-FR')} Ar ({(MIN_WITHDRAW / usdtRate).toFixed(2)} USDT)
            </span>
            <h2 className="text-white text-xl md:text-2xl font-display font-black mt-2">
              Encaissez vos gains en direct
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Les demandes de retrait sont examinées par nos serveurs IA et validées manuellement par nos équipes en 5 à 15 minutes.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-855 text-right font-mono shrink-0">
            <span className="text-slate-500 text-[10px] block">VOTRE SOLDE ACTUEL</span>
            <strong className="text-xl md:text-2xl font-black text-amber-500">
              {user.balance.toLocaleString('fr-FR')} <span className="text-xs">Ar</span> <span className="text-sm font-normal text-slate-400">({(user.balance / usdtRate).toFixed(2)} USDT)</span>
            </strong>
          </div>
        </div>
      </section>

      {/* Main layout form & history split */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Withdrawal form */}
        <section className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-display font-black text-white text-base mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-500" />
            Demande de retrait Ariary
          </h3>

          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-450 text-xs rounded-xl mb-4 leading-normal font-semibold">
              ✓ {successMsg}
              <p className="text-[11px] text-slate-300 mt-2 font-mono">
                La transaction est marquée "En cours" ci-contre. Le paiement sera effectué d'ici peu.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl mb-4 leading-relaxed font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs font-mono mb-1.5 block font-bold">
                  {operator === 'usdt_trc20' ? "ADRESSE TRC-20 (USDT) DE RÉCEPTION" : "N° MOBILE DE RÉCEPTION"}
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder={operator === 'usdt_trc20' ? "Ex: TNhoWrCzN2z..." : "Ex: 034 56 789 01"}
                    value={receiverNumber}
                    onChange={(e) => setReceiverNumber(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs font-mono mb-1.5 block">SÉLECTIONNEZ LE CODE RÉSEAU</label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value as any)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500 font-semibold"
                >
                  <option value="mvola">MVola (Telma)</option>
                  <option value="airtel">Airtel Money</option>
                  <option value="usdt_trc20">Crypto USDT (TRC-20)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-xs font-mono mb-1.5 block">MONTANT DU RETRAIT (ARIARY / Ar)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  placeholder="Seuil exact: 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                />
                <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-500 font-mono">Ar</span>
              </div>
              
              {amount && !isNaN(Number(amount)) && (
                <p className="text-emerald-450 text-emerald-400 text-xs font-mono font-bold mt-1.5 flex items-center flex-wrap gap-1.5">
                  ✓ Équivaut à : <span className="bg-slate-955 px-1.5 py-0.5 rounded text-white font-black font-mono">{(Number(amount) / usdtRate).toFixed(2)} USDT ($)</span> 
                  <span className="text-slate-500 text-[10px] font-normal font-sans">(Taux en direct : 1 USDT = {Math.round(usdtRate).toLocaleString('fr-FR')} Ar • Synchro : {lastRateUpdateAt} 🟢)</span>
                </p>
              )}
              
              <p className="text-[10px] text-slate-500 font-mono mt-1.5">Saisissez un chiffre entier sans point ni virgule.</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2 text-xs text-slate-400">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-250">Garanties de sécurité des transactions :</p>
                <p className="mt-1 leading-relaxed text-[11px]">
                  Chaque retrait est contrôlé par notre validation d'identité afin de lutter contre la fraude mobile money à Madagascar. Tout détournement de fonds entraînera un blocage permanent du compte OXW.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all hover:bg-amber-400 shadow-md active:scale-95 flex items-center justify-center gap-1"
            >
              Soumettre ma demande de transfert
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </section>

        {/* Withdrawal history right */}
        <section className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="font-display font-extrabold text-sm text-white mb-3 flex items-center gap-1.5">
            <History className="w-4 h-4 text-slate-400" />
            Demandes de retrait
          </h4>

          {user.withdrawalHistory.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-6">
              Aucun retrait demandé pour l'instant.
            </p>
          ) : (
            <div className="space-y-3">
              {user.withdrawalHistory.map((withd) => (
                <div key={withd.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-amber-500 uppercase font-black">
                      {withd.operator === 'usdt_trc20' ? 'USDT (TRC-20)' : withd.operator}
                    </span>
                    {withd.status === 'pending' ? (
                      <span className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> En cours
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Confirmé ✓
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400">Somme retirée :</span>
                    <strong className="text-red-400">-{withd.amount.toLocaleString('fr-FR')} Ar ({(withd.amount / usdtRate).toFixed(2)} USDT)</strong>
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-1.5 align-middle break-all">
                    {withd.operator === 'usdt_trc20' ? 'Adresse : ' : 'Numéro : '} {withd.receiverNumber}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

    </div>
  );
}
