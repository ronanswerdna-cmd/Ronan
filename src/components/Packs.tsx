import React, { useState } from 'react';
import { Cpu, ChevronRight, Check, AlertTriangle, Coins, Sparkles } from 'lucide-react';
import { MinerPack, UserAccount } from '../types';
import { MINER_PACKS } from '../data';

interface PacksProps {
  user: UserAccount;
  onActivatePack: (packId: string) => void;
  onNavigate: (tab: string) => void;
}

export default function Packs({ user, onActivatePack, onNavigate }: PacksProps) {
  const [selectedPack, setSelectedPack] = useState<MinerPack | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenRental = (pack: MinerPack) => {
    setErrorMsg('');
    setSuccessMsg('');
    setSelectedPack(pack);
  };

  const handleConfirmRental = () => {
    if (!selectedPack) return;

    if (selectedPack.cost > user.balance) {
      setErrorMsg(`Solde insuffisant en Ariary. Il vous manque ${(selectedPack.cost - user.balance).toLocaleString('fr-FR')} Ar pour activer ce mineur.`);
      return;
    }

    onActivatePack(selectedPack.id);
    setSuccessMsg(`Félicitations ! Le pack "${selectedPack.name}" a été activé avec succès pour 30 jours.`);
    setErrorMsg('');
    setTimeout(() => {
      setSelectedPack(null);
      setSuccessMsg('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner introduction */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
        <div className="max-w-2xl">
          <span className="text-[10px] font-mono font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase">
            Nos offres Cloud Rigs
          </span>
          <h2 className="text-white text-xl md:text-2xl font-display font-black mt-2">
            Multipliez vos gains en louant de la puissance
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1.5 leading-relaxed">
            Profitez de nos grappes de serveurs de calcul IA virtuelles basées dans le cloud. Une fois loués, les serveurs fonctionnent 24h/24 et 7j/7 sans interruption.
          </p>
        </div>
      </section>

      {/* Grid List packs */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {MINER_PACKS.map(pack => {
          const isOwned = user.activeMiners.some(act => act.minerId === pack.id);
          const count = user.activeMiners.filter(act => act.minerId === pack.id).length;
          
          return (
            <div 
              key={pack.id} 
              className="bg-slate-900 border border-blue-500/10 hover:border-blue-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all group shadow-md hover:shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider font-extrabold font-mono">
                    CONTRAT DE MINAGE {pack.type.toUpperCase()}
                  </span>
                  
                  {pack.tag && (
                    <span className="bg-blue-500/10 border border-blue-500/20 font-mono text-[9px] text-blue-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest font-mono">
                      {pack.tag}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-black text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {pack.name} — Contrat Cloud IA MDG
                </h3>
                
                <p className="text-slate-400 text-xs leading-relaxed mb-6 font-normal">
                  {pack.description}
                </p>

                <div className="p-4 bg-slate-950/60 rounded-xl space-y-2 mb-6 font-mono border border-slate-900">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Dépôt requis :</span>
                    <strong className="text-white font-extrabold text-sm font-mono">
                      {pack.cost.toLocaleString('fr-FR')} Ar
                    </strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Revenu calculé :</span>
                    <strong className="text-blue-400 font-mono">+{pack.speed.toFixed(4)} Ar / min</strong>
                  </div>
                  <div className="flex justify-between text-xs border-t border-slate-900 pt-2 font-mono">
                    <span className="text-slate-400 font-semibold font-sans">Rentabilité Journalière :</span>
                    <strong className="text-emerald-400">+{pack.dailyYield.toLocaleString('fr-FR')} Ar / jour</strong>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">Période d'activité :</span>
                    <strong className="text-slate-300">{pack.termDays} Jours ({pack.termDays / 30} mois)</strong>
                  </div>
                </div>
              </div>

              <div>
                {count > 0 && (
                  <div className="mb-3 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/15 py-1 px-2.5 rounded-lg text-center font-bold font-mono">
                    ✓ Actif sur votre espace • Nombre de Rig(s) loué : {count}
                  </div>
                )}

                <button
                  onClick={() => handleOpenRental(pack)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 transition-colors text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 shadow-md cursor-pointer cursor-pointer"
                >
                  Louer maintenant & Commencer
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Confirmation Modal */}
      {selectedPack && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setSelectedPack(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <h3 className="font-display font-black text-lg text-white mb-4">Activation de votre Mineur Cloud</h3>
            
            {successMsg ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-semibold text-center my-4 flex flex-col items-center gap-2">
                <Check className="w-8 h-8 p-1.5 bg-emerald-500 text-slate-950 rounded-full" />
                {successMsg}
              </div>
            ) : (
              <div className="space-y-4 font-mono">
                <p className="text-slate-300 text-xs md:text-sm font-sans">
                  Vous allez louer le <strong className="text-white">{selectedPack.name}</strong> pour une période de <strong>{selectedPack.termDays} jours</strong>. Le coût sera déduit de votre solde courant.
                </p>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Coût pack :</span>
                    <strong className="text-white font-mono">{selectedPack.cost.toLocaleString('fr-FR')} Ar</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Votre solde :</span>
                    <strong className="text-blue-400 font-mono">{user.balance.toLocaleString('fr-FR')} Ar</strong>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs rounded-xl flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="font-sans">
                      <p className="font-semibold">{errorMsg}</p>
                      <button
                        onClick={() => {
                          setSelectedPack(null);
                          onNavigate('deposits');
                        }}
                        className="text-blue-400 hover:underline font-bold text-xs mt-1.5 block cursor-pointer"
                      >
                        👉 Faire un dépôt maintenant
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2.5 pt-2 font-sans">
                  <button
                    onClick={() => setSelectedPack(null)}
                    className="flex-1 py-2.5 px-4 bg-slate-800 text-slate-300 font-medium rounded-xl text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmRental}
                    className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-550 transition-colors cursor-pointer"
                  >
                    Confirmer l'activation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
