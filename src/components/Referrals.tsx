import React, { useState } from 'react';
import { UserAccount } from '../types';
import { Sparkles, Trophy, Link, Copy, Check, Users, Gift, Megaphone, ShieldCheck, Lock } from 'lucide-react';

interface ReferralsProps {
  user: UserAccount;
  allUsers: UserAccount[];
  onNavigate: (tab: string) => void;
}

export default function Referrals({ user, allUsers, onNavigate }: ReferralsProps) {
  const [copied, setCopied] = useState(false);

  // Generate their personal referral link
  const refCode = user.referralCode || `OXW-${user.phone.replace(/\s+/g, '')}`;
  const referralLink = `${window.location.origin}/?ref=${refCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find users who were referred by this user
  const referredPeople = allUsers.filter(u => u.referredBy === refCode || u.referredBy === user.phone);

  // Measure cumulative approved deposits to unlock program (min 5 000 Ar deposit)
  const totalApprovedDeposits = (user.depositHistory || [])
    .filter(d => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  const isUnlocked = totalApprovedDeposits >= 5000;

  if (!isUnlocked) {
    return (
      <div className="space-y-6">
        <section className="bg-slate-900 border-2 border-red-500/20 p-8 rounded-3xl relative overflow-hidden shadow-xl text-center max-w-2xl mx-auto space-y-6 py-12">
          {/* Subtle Royal Blue / Red Light Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>

          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-red-400 font-mono tracking-widest uppercase font-bold bg-red-500/10 px-3 py-1 rounded-full">
              SÉCURISATION ANTI-FRAUDE
            </span>
            <h2 className="text-white text-xl md:text-2xl font-display font-black pt-2">
              Étape d'activation requise
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
              Afin d'éviter la prolifération de faux comptes d'affiliation à Madagascar, vous devez avoir effectué un dépôt cumulé minimum de <strong className="text-blue-400">5 000 Ar</strong> pour déverrouiller votre lien de parrainage et percevoir des primes.
            </p>
          </div>

          {/* Progress Status */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl max-w-sm mx-auto space-y-1">
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>Votre dépôt validé actuel :</span>
              <strong className="text-red-400">{totalApprovedDeposits.toLocaleString('fr-FR')} Ar</strong>
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>Seuil requis pour activer :</span>
              <strong className="text-emerald-400">5 000 Ar</strong>
            </div>
            {/* Minimal Progress Line */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3 border border-slate-800">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all" 
                style={{ width: `${Math.min(100, (totalApprovedDeposits / 5000) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('deposits')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95 inline-flex items-center gap-2 uppercase tracking-wide"
            >
              Faire un dépôt pour débloquer (Min. 5 000 Ar)
              <Sparkles className="w-4 h-4 text-blue-300" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Referral Header */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
        
        <div>
          <span className="text-[10px] font-mono font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase inline-block mb-2">
            Programme d'Affiliation OXW Madagascar
          </span>
          <h2 className="text-white text-xl md:text-2xl font-display font-black mt-1">
            Gagnez de l'Ariary en invitant vos proches
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1.5 leading-relaxed">
            Partagez votre lien de parrainage et recevez d'importants bonus de commission. Vos amis bénéficieront également d'un bonus de départ de bienvenue !
          </p>
        </div>
      </section>

      {/* Benefits Card Grid */}
      <section className="grid md:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/15 shrink-0">
            <Gift className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h4 className="text-white text-sm font-bold">1. Prime de Bienvenue</h4>
            <p className="text-slate-400 text-xs mt-1 leading-normal">
              Vos filleuls reçoivent instantanément <strong className="text-slate-205">1 000 Ar de bienvenue</strong> d'office à la création de leur compte.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/15 shrink-0">
            <Trophy className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white text-sm font-bold">2. Commission d'Affiliation Directe</h4>
            <p className="text-slate-400 text-xs mt-1 leading-normal">
              Gagnez <strong className="text-blue-400 font-extrabold">2 000 Ar par filleul</strong> inscrit et validé par notre réseau de minage.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-slate-900 border border-blue-500/25 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/15 shrink-0">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white text-sm font-bold">3. 10% Royalties Dépôt</h4>
            <p className="text-slate-355 text-xs mt-1 leading-normal">
              Touchez <strong className="text-blue-400">10% sur chaque dépôt de pack</strong> effectué par vos filleuls, crédités en direct à vie !
            </p>
          </div>
        </div>

      </section>

      {/* Interactive Referral Panel */}
      <section className="grid lg:grid-cols-3 gap-6">
        
        {/* Referral code copy */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-black text-white text-base">Vos Outils de Parrainage</h3>
            <p className="text-slate-400 text-xs leading-normal">
              Distribuez ce lien ou votre code personnel à vos contacts sur Facebook, Messenger, WhatsApp ou SMS pour quils s'associent à votre réseau de minage mobile.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="text-slate-500 text-[10px] uppercase font-mono font-bold tracking-wider block mb-1.5">Lien de parrainage à partager</label>
                <div className="flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-1.5">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 bg-transparent text-slate-300 font-mono text-xs px-2.5 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copier
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-500 text-[10px] uppercase font-mono font-bold tracking-wider block mb-1.5">Code de parrainage simple</label>
                <div className="w-full sm:w-auto p-3.5 bg-slate-950 border border-slate-800 rounded-xl inline-flex justify-between items-center gap-4">
                  <span className="text-white font-mono font-black tracking-widest text-sm uppercase select-all">{refCode}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(refCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-blue-400 hover:text-blue-300 text-xs font-bold font-mono hover:underline"
                  >
                    Copier le code
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 mt-6 flex items-start gap-3">
            <Megaphone className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-white text-xs font-bold font-mono">Comment ça marche en coulisses ?</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                Dès que votre ami s'inscrit en renseignant votre code <strong className="text-slate-200">{refCode}</strong> dans le formulaire, il apparaît automatiquement dans votre liste ci-contre. Votre commission de parrainage de 10% sur ses futurs achats de VIP s'ajoutera instantanément lors de l'approbation du dépôt par l'administrateur !
              </p>
            </div>
          </div>
        </div>

        {/* Referred list on right */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h4 className="font-display font-extrabold text-white text-sm mb-4 flex items-center justify-between">
              <span>Mes Filleuls ({referredPeople.length})</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                GAIN : {user.referralEarnings.toLocaleString('fr-FR')} Ar
              </span>
            </h4>

            {referredPeople.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <Users className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-slate-500 text-xs">
                  Aucun filleul inscrit pour le moment.
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Invitez vos amis pour débloquer vos gains !
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                {referredPeople.map((person, index) => (
                  <div key={index} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <h5 className="text-white text-xs font-bold">{person.name}</h5>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        Tel : {person.phone || 'Masqué'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Rigs loués</span>
                      <strong className="text-xs font-mono text-blue-500">{person.activeMiners.length} active(s)</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-950 mt-4 text-center">
            <span className="text-[10px] font-mono text-slate-500">
              PROGRAMME DE RENTABILITÉ IA OXW
            </span>
          </div>
        </div>

      </section>

    </div>
  );
}
