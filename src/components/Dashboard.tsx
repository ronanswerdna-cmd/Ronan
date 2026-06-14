import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Activity, Coins, ShieldCheck, Play, ArrowUpRight, ArrowDownRight, RefreshCw, Smartphone, Lock, Clock } from 'lucide-react';
import { UserAccount, MinerPack } from '../types';
import { MINER_PACKS } from '../data';

interface DashboardProps {
  user: UserAccount;
  onNavigate: (tab: string) => void;
  onCollectMining: () => void;
}

export default function Dashboard({ user, onNavigate, onCollectMining }: DashboardProps) {
  const [circlePulse, setCirclePulse] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Filter active and non-expired VIP contracts
  const activeVips = user.activeMiners.filter(m => {
    const isExpired = new Date(m.expiresAt).getTime() <= Date.now();
    return !isExpired;
  });
  const hasActiveVip = activeVips.length > 0;

  // Calculate total daily yield from active VIPs
  let totalDailyYield = 0;
  activeVips.forEach(act => {
    const pack = MINER_PACKS.find(p => p.id === act.minerId);
    if (pack) {
      totalDailyYield += pack.dailyYield;
    }
  });

  // Set up 24h countdown of active mining session (starts when lastMiningSessionStartedAt is set)
  useEffect(() => {
    if (!user.lastMiningSessionStartedAt) {
      setTimeLeft(0);
      return;
    }

    const intervalId = setInterval(() => {
      const lastCollect = new Date(user.lastMiningSessionStartedAt!).getTime();
      const nextAvailable = lastCollect + 24 * 60 * 60 * 1000;
      const remain = nextAvailable - Date.now();
      if (remain <= 0) {
        setTimeLeft(0);
        clearInterval(intervalId);
      } else {
        setTimeLeft(remain);
      }
    }, 1000);

    // Initial calculation
    const initStart = new Date(user.lastMiningSessionStartedAt).getTime();
    const initRemain = (initStart + 24 * 60 * 60 * 1000) - Date.now();
    setTimeLeft(Math.max(0, initRemain));

    return () => clearInterval(intervalId);
  }, [user.lastMiningSessionStartedAt]);

  const isCooldownRunning = timeLeft > 0;

  const formatTimeLeft = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
  };

  // Toggle circle visual animation pulse
  useEffect(() => {
    const interval = setInterval(() => {
      if (isCooldownRunning) {
        setCirclePulse(prev => !prev);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isCooldownRunning]);

  // Calculate stats
  const pendingDeposits = user.depositHistory.filter(d => d.status === 'pending');
  const sumPendingDeposits = pendingDeposits.reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner summary */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 glow-gold relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${hasActiveVip ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-slate-400 text-xs font-mono font-bold tracking-wider uppercase">
                {hasActiveVip ? 'COMPTE VIP ACTIF ET SÉCURISÉ 🟢' : 'AUCUN CONTRAT VIP ACTIF 🔴'}
              </span>
            </div>
            <h2 className="text-white text-xl md:text-2xl font-display font-black mt-1">
              Bienvenue, <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">{user.name}</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-mono">
              Numéro de retrait enregistré : <strong className="text-slate-200">{user.phone}</strong>
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-4 w-full md:w-auto shrink-0">
            <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/15">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-mono">PUISSANCE DE MINAGE VIP</span>
              <div className="text-white font-mono text-sm font-black flex items-center gap-1.5">
                {activeVips.length.toString()} Rig(s) Actif(s)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Mining Action Circle & Statistics */}
      <section className="grid lg:grid-cols-3 gap-6">
        
        {/* Circle mining manual collector */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden h-[360px] shadow-lg shadow-slate-950/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
          
          <span className={`text-[10px] font-mono font-black tracking-wider absolute top-4 left-4 border px-2 py-0.5 rounded-md uppercase ${
            hasActiveVip 
              ? (isCooldownRunning ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20') 
              : 'text-red-400 bg-red-500/10 border-red-500/20'
          }`}>
            {hasActiveVip ? (isCooldownRunning ? 'Cycle Countdown' : 'Prêt à collecter') : 'Inactif • No VIP'}
          </span>

          {/* Case 1: No active VIP contracts */}
          {!hasActiveVip ? (
            <div className="flex flex-col items-center justify-center w-full px-2">
              <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-500/30 flex items-center justify-center mb-4 text-red-500 shadow-lg shadow-red-500/5 animate-pulse">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-red-400 font-display font-black text-sm uppercase tracking-wide">Minage Suspendu</h4>
              <p className="text-xs text-slate-400 my-3 max-w-[240px] leading-relaxed">
                Mila manofa soparim-piraketana VIP ianao vao afaka mitrandraka sy mahazo tombony. (Option réservée aux comptes VIP).
              </p>
              
              <button
                onClick={() => onNavigate('packs')}
                className="w-full max-w-xs py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs tracking-wider uppercase shadow-md shadow-amber-500/10 active:scale-95 transition-all mt-1"
              >
                Louer un Contrat VIP →
              </button>
            </div>
          ) : (
            /* Case 2: Cooldown timer running - Button has disappeared! */
            isCooldownRunning ? (
              <>
                <div className="relative mt-2">
                  <div className={`absolute inset-0 rounded-full border-2 border-emerald-500/10 scale-150 transition-all duration-1000 ${circlePulse ? 'scale-170 opacity-0' : 'opacity-100'}`}></div>
                  <div className="w-28 h-28 rounded-full bg-slate-950 border-4 border-slate-800/60 flex flex-col items-center justify-center relative shadow-xl">
                    <Clock className="w-7 h-7 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
                    <div className="text-[9px] text-slate-500 font-mono mt-1.5 uppercase font-bold tracking-tight">EN COURS</div>
                    <div className="text-emerald-400 font-mono font-black text-xs mt-0.5">
                      +{Math.round(totalDailyYield).toLocaleString('fr-FR')} Ar / j
                    </div>
                  </div>
                </div>

                <div className="mt-5 w-full max-w-xs space-y-2">
                  <span className="text-slate-400 text-[10px] font-mono block">PROCHAINE COLLECTE DE GAINS DANS :</span>
                  <div className="text-base text-amber-400 font-mono font-black tracking-widest px-3 py-1.5 bg-slate-950 border border-slate-800/80 rounded-xl shadow-inner">
                    {formatTimeLeft(timeLeft)}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono italic">
                    Gains du jour collectés ! Revenez demain à la même heure.
                  </p>
                </div>
              </>
            ) : (
              /* Case 3: Ready to collect - "Hanangona" button is shown! */
              <div className="flex flex-col items-center justify-center w-full px-2 mt-2">
                <div className="relative mb-5">
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div className="w-20 h-20 rounded-full bg-slate-950 border-2 border-amber-500/40 flex items-center justify-center animate-bounce duration-1000 shadow-lg shadow-amber-500/10">
                    <Coins className="w-8 h-8 text-amber-500" />
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] text-emerald-400 font-mono uppercase font-black tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Soli-tombony vonona
                  </span>
                  <h4 className="text-white text-base font-display font-black mt-1">
                    +{Math.round(totalDailyYield).toLocaleString('fr-FR')} Ar
                  </h4>
                  <p className="text-[11px] text-slate-400">Cliquez ci-dessous pour encaisser instantanément.</p>
                </div>

                <button
                  onClick={onCollectMining}
                  className="w-full max-w-xs py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-widest uppercase shadow-lg shadow-amber-500/30 hover:shadow-amber-500/45 border-t border-white/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Coins className="w-4 h-4 fill-current text-slate-950" />
                  Hanangona
                </button>
              </div>
            )
          )}
        </div>

        {/* Stats and controls cards */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-slate-500 text-[10px] font-mono block">RENDEMENT JOURNALIER (VIP)</span>
                <p className="text-sm font-semibold text-white mt-1">Gains sous 24h par clic</p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">
                Fixé
              </span>
            </div>
            <div className="pt-4 border-t border-slate-950 mt-4">
              <div className="text-2xl font-mono font-black text-white">
                {totalDailyYield.toLocaleString('fr-FR')} <span className="text-amber-500 text-sm">Ar / j</span>
              </div>
              <p className="text-slate-400 text-xs mt-1 leading-normal">
                Montant total versé sur votre compte à chaque fois que vous cliquez sur le bouton <strong className="text-slate-200">\"Hanangona\"</strong>.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-slate-500 text-[10px] font-mono block">RENDEMENT MENSUEL ESTIMÉ</span>
                <p className="text-sm font-semibold text-white mt-1">Sur la base de 30 jours</p>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded font-bold">
                CUMUL
              </span>
            </div>
            <div className="pt-4 border-t border-slate-950 mt-4">
              <div className="text-2xl font-mono font-black text-emerald-400">
                🚀 +{(totalDailyYield * 30).toLocaleString('fr-FR')} Ar
              </div>
              <p className="text-slate-400 text-xs mt-1 leading-normal">
                Cumulez les gains réguliers en venant réclamer votre pépite de minage VIP toutes les 24 heures.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-slate-500 text-[10px] font-mono block">RECHARGE EN ATTENTE</span>
                <p className="text-sm font-semibold text-white mt-1">En cours de traitement</p>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded font-black">
                ADMIN
              </span>
            </div>
            <div className="pt-4 border-t border-slate-950 mt-4">
              <div className="text-xl font-mono font-black text-slate-100">
                {sumPendingDeposits > 0 ? `${sumPendingDeposits.toLocaleString('fr-FR')} Ar` : 'Aucun dépôt en attente'}
              </div>
              <p className="text-slate-400 text-xs mt-1 leading-normal">
                {sumPendingDeposits > 0 
                  ? 'Nos administrateurs valident votre transfert USDT/Mobile Money sous quelques instants.' 
                  : 'Louez un nouveau rig pour débloquer de plus gros rendements quotidiens.'}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-slate-900 border border-amber-500/20 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <h4 className="font-display font-black text-base text-white">Activer un nouveau Rig ?</h4>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                Profitez du meilleur taux de change pour booster vos bénéfices d'un simple clic par jour.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-950/40">
              <button
                onClick={() => onNavigate('packs')}
                className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 transition-colors text-slate-950 font-bold rounded-lg text-xs"
              >
                Louer un VIP
              </button>
              <button
                onClick={() => onNavigate('referrals')}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 text-white font-medium rounded-lg text-xs"
              >
                Parrainage (10%)
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Rigs / Mineurs Actifs list */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="font-display font-extrabold text-white text-base mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-4.5 text-amber-500" />
          Rigs de minage actifs installés
        </h3>

        {activeVips.length === 0 ? (
          <div className="bg-slate-950 border border-slate-805/80 text-center py-8 rounded-xl">
            <Lock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-xs font-mono">Aucun Rig de minage VIP actif pour l'instant.</p>
            <button
              onClick={() => onNavigate('packs')}
              className="text-amber-400 text-xs mt-2 font-bold hover:underline"
            >
              Consulter la liste de contrats Louables →
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {activeVips.map((act, index) => {
              const pack = MINER_PACKS.find(p => p.id === act.minerId);
              if (!pack) return null;
              return (
                <div key={index} className="bg-slate-950 border border-slate-805 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      #{index + 1}
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-sm text-slate-100">{pack.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        Rendement : {pack.dailyYield.toLocaleString('fr-FR')} Ar / jour • Expire : {new Date(act.expiresAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">État</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">FONCTIONNEL</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
