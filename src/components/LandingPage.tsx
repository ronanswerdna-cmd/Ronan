import React from 'react';
import { Cpu, Zap, Coins, TrendingUp, ChevronRight, Smartphone, Share2, Shield, Users, Trophy } from 'lucide-react';
import { MINER_PACKS } from '../data';

interface LandingPageProps {
  onStartFree: () => void;
  onScrollToYields: () => void;
  onOpenAuth: (isSignUp: boolean) => void;
}

export default function LandingPage({ onStartFree, onScrollToYields, onOpenAuth }: LandingPageProps) {
  return (
    <div className="w-full bg-slate-950 text-slate-100 font-sans leading-relaxed">
      {/* Navigation Inside Landing */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-display font-black text-slate-950 text-xl tracking-wider shadow-lg shadow-amber-500/20 shadow-glow">
              OXW
            </div>
            <div>
              <span className="font-display font-extrabold text-lg bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                OXW Creativ
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest leading-none">VITA MALAGASY</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => onOpenAuth(false)}
              className="px-3 py-1.5 md:px-4 md:py-2 text-sm text-slate-300 hover:text-white transition-colors font-medium"
            >
              Se connecter
            </button>
            <button
              id="landing-signup-btn"
              onClick={() => onOpenAuth(true)}
              className="px-4 py-1.5 md:px-5 md:py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs md:text-sm font-bold rounded-lg transition-all shadow-md active:scale-95"
            >
              S'inscrire
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-10 w-[200px] h-[200px] rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none"></div>

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Malagasy Flag Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-300 text-xs font-semibold mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Mineur IA National 🇲🇬 100% en Ariary (Ar)
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-[1.1] mb-6">
            L'Argent Avant Tout — <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              Votre puissance de minage IA
            </span> en Ariary !
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
            <strong className="text-amber-400">Oxw Creativ</strong> est la première plateforme malgache de minage intelligent par IA. 
            Louez de la puissance de calcul virtuelle VIP de minage passif à haut rendement, 
            profitez du système de parrainage et générez des revenus passifs directs crédités sur votre compte en Ariary.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              id="cta-free-miner"
              onClick={onStartFree}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 font-bold rounded-xl transition-all shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              Créer mon compte de minage
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onScrollToYields}
              className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-base"
            >
              Voir les contrats VIP
            </button>
          </div>
        </div>

        {/* 4 Block Stats section */}
        <section className="mt-20 border-t border-slate-900 pt-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-slate-900/40 border border-slate-900/60 p-6 rounded-2xl text-center backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-display font-black text-amber-500 mb-1">12K+</div>
              <div className="text-xs md:text-sm text-slate-400 font-medium">Mineurs malgaches connectés</div>
            </div>
            <div className="bg-slate-900/40 border border-slate-900/60 p-6 rounded-2xl text-center backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-display font-black text-emerald-400 mb-1">85K+</div>
              <div className="text-xs md:text-sm text-slate-400 font-medium">Blocs de calcul minés</div>
            </div>
            <div className="bg-slate-900/40 border border-slate-900/60 p-6 rounded-2xl text-center backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-display font-black text-amber-400 mb-1">240M Ar</div>
              <div className="text-xs md:text-sm text-slate-400 font-medium">Total des gains déjà versés</div>
            </div>
            <div className="bg-slate-900/40 border border-slate-900/60 p-6 rounded-2xl text-center backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-display font-black text-slate-100 mb-1">4.9/5</div>
              <div className="text-xs md:text-sm text-slate-400 font-medium">Note de satisfaction</div>
            </div>
          </div>
        </section>
      </header>

      {/* Comment ça Marche? (Step Guide) */}
      <section className="bg-slate-950 py-20 px-4 md:px-8 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-slate-400">
              Un processus en 3 étapes simples pour transformer vos réseaux sociaux et nos serveurs IA en générateurs de revenus malgaches.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-900/25 border border-slate-900 p-8 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-colors relative">
              <div className="absolute top-6 right-6 text-slate-800 font-display font-black text-6xl select-none leading-none">01</div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 border border-amber-500/20">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-white mb-3">Inscription Facile</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Créez votre compte en quelques secondes avec votre numéro de téléphone. Recevez instantanément un bonus de parrainage de départ de bienvenue de 1 000 Ar !
                </p>
              </div>
              <span className="text-amber-500/70 text-xs font-mono font-semibold uppercase tracking-wider">Configurez votre profil</span>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/25 border border-slate-900 p-8 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-colors relative">
              <div className="absolute top-6 right-6 text-slate-800 font-display font-black text-6xl select-none leading-none">02</div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-white mb-3">Sélectionnez votre VIP</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Rechargez votre portefeuille et louez votre pack de minage VIP (VIP 1, VIP 2, VIP 3, ou VIP 4) adapté à vos attentes de rendement.
                </p>
              </div>
              <span className="text-emerald-500/70 text-xs font-mono font-semibold uppercase tracking-wider">Lancement instantané</span>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/25 border border-slate-900 p-8 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-colors relative">
              <div className="absolute top-6 right-6 text-slate-800 font-display font-black text-6xl select-none leading-none">03</div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 border border-amber-500/20">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-white mb-3">Encaissez en Direct</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Suivez vos Ariary s'accumuler en continu seconde après seconde. Dès que votre solde atteint 5 000 Ar, demandez un retrait direct sur MVola, Orange ou Airtel.
                </p>
              </div>
              <span className="text-amber-500/70 text-xs font-mono font-semibold uppercase tracking-wider">Retraits rapides</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature focus: Minage vs Tasks */}
      <section className="bg-slate-950 py-16 px-4 md:px-8 border-t border-slate-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold mb-6">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              Maximisez vos revenus quotidiens
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-6 leading-tight">
              Combinez l'Intelligence Artificielle et le Réseau Social
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/10 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-white mb-1">⚡ Minage IA Cloud</h4>
                  <p className="text-slate-400 text-sm">
                    Laissez nos serveurs virtuels de calcul s'occuper du gros travail en arrière-plan. Vous n'avez pas besoin de garder l'application ouverte. Suivez simplement vos compteurs grimper en Ariary minute par minute.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-white mb-1">📱 Boost par Tâches Sociales</h4>
                  <p className="text-slate-400 text-sm">
                    Augmentez la rentabilité de votre mineur en aimant, vous abonnant ou partageant du contenu sélectionné sur Facebook, TikTok, YouTube et Instagram. Plus vous validez de blocs, plus l'algorithme mine rapidement.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute -top-1/4 -right-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-[80px]"></div>
            <h3 className="font-display font-extrabold text-xl text-white mb-6 border-b border-slate-800 pb-4 flex justify-between items-center">
              <span>Simulation Taux IA</span>
              <span className="text-xs font-mono px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded">Actif</span>
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-855 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-mono">MINEUR ACTIF</span>
                  <p className="text-white font-bold font-display">Mineur Tanora (10K Ar)</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-xs font-mono">VITESSE MULTI.</span>
                  <p className="text-emerald-400 font-mono font-bold">1.0x (Normal)</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-855 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-mono">COMPLÉTER TÂCHES</span>
                  <p className="text-amber-400 font-bold font-display">4 Micro-tâches validées</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-xs font-mono">VITESSE BOOSTÉE</span>
                  <p className="text-amber-400 font-mono font-bold">+85% (1.85x 🔥)</p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 rounded-xl border border-amber-500/20 flex items-center justify-between mt-6">
                <div>
                  <span className="text-slate-400 text-xs font-mono">GAIN EN 24H ESTIMÉ</span>
                  <p className="text-white text-2xl font-display font-black">53 280 Ar</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-300 text-xs block font-semibold mb-1">Rendement</span>
                  <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-2 py-1 rounded-full">TRÈS ÉLEVÉ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yields list (Contrats List with Anchor ID) */}
      <section id="yields-section" className="bg-slate-950 py-20 px-4 md:px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-4">
              Contrats de Minage Cloud Disponibles
            </h2>
            <p className="text-slate-400">
              Choisissez la puissance de calcul adaptée à vos objectifs de gains hebdomadaires et mensuels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MINER_PACKS.map((pack) => (
              <div
                key={pack.id}
                className={`rounded-2xl p-6 flex flex-col justify-between border ${
                  pack.type === 'free'
                    ? 'bg-slate-900/30 border-slate-800'
                    : pack.type === 'bronze'
                    ? 'bg-gradient-to-b from-slate-900/80 to-slate-900/30 border-amber-900/50 hover:border-amber-500/50'
                    : pack.type === 'silver'
                    ? 'bg-gradient-to-b from-slate-900/80 to-slate-900/30 border-slate-700/50 hover:border-slate-100/50'
                    : 'bg-gradient-to-b from-slate-900/80 to-slate-900/30 border-amber-400/20 hover:border-amber-400/50 shadow-lg shadow-amber-500/5'
                } transition-all duration-300 relative group`}
              >
                {pack.tag && (
                  <span className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/30 font-mono text-[10px] font-black text-amber-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {pack.tag}
                  </span>
                )}
                <div>
                  <span className="text-slate-400 text-xs font-mono font-bold tracking-wider block mb-1 uppercase">
                    PACK {pack.type === 'free' ? 'Gratuit' : pack.type}
                  </span>
                  <h3 className="font-display font-black text-lg text-white mb-4 group-hover:text-amber-400 transition-colors">
                    {pack.name}
                  </h3>
                  
                  <div className="mb-6 border-b border-slate-900 pb-4">
                    <span className="text-slate-400 text-xs block font-mono">COÛT D'ACTIVATION</span>
                    <span className="text-2xl font-display font-black text-white">
                      {pack.cost === 0 ? 'GRATUIT' : `${pack.cost.toLocaleString('fr-FR')} Ar`}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8 text-sm">
                    <li className="flex justify-between">
                      <span className="text-slate-400">Vitesse :</span>
                      <strong className="text-slate-200 font-mono">{pack.speed} Ar / min</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-400">Rendement 24h :</span>
                      <strong className="text-emerald-400 font-mono">+{pack.dailyYield.toLocaleString('fr-FR')} Ar</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-400">Période du pack :</span>
                      <strong className="text-slate-200 font-mono">{pack.termDays} Jours</strong>
                    </li>
                  </ul>
                </div>

                 <button
                  onClick={onStartFree}
                  className="w-full py-3 px-4 font-bold rounded-xl text-center text-sm transition-all flex items-center justify-center gap-1 active:scale-95 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
                >
                  Louer ce Mineur
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deposit Guide section on Landing (Ratsimazafy Numbers) */}
      <section className="bg-slate-900/30 border-t border-slate-900 py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
            <div className="text-center md:text-left mb-6">
              <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-extrabold uppercase px-3 py-1 rounded-full inline-block mb-3">
                ⚠️ Dépôts Sécurisés Madagascar
              </span>
              <h3 className="font-display font-black text-2xl text-white">Consignes d'activation des Packs</h3>
              <p className="text-slate-400 text-sm mt-1">
                Afin de louer de la puissance de minage supplémentaire, effectuez votre transfert en Ariary sur l'un de nos comptes officiels :
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-orange-400 text-xs font-mono font-bold uppercase tracking-wider block mb-1">Telma / MVOLA</span>
                <p className="text-white text-xl font-mono font-black mb-1">038 720 30 22</p>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Propriétaire :</span>
                  <span className="text-emerald-400 text-xs font-bold">RATSIMAZAFY</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-red-500 text-xs font-mono font-bold uppercase tracking-wider block mb-1">Airtel Money</span>
                <p className="text-white text-xl font-mono font-black mb-1">033 091 04 25</p>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Propriétaire :</span>
                  <span className="text-emerald-400 text-xs font-bold">RATSIMAZAFY</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center md:text-left">
              <p className="text-amber-200 text-xs md:text-sm leading-relaxed font-medium">
                💬 <strong>Une fois le virement fait :</strong> Envoyez la capture d'écran du message de reçu (avec la référence claire) sur notre WhatsApp. Votre compte est rechargé et activé automatiquement sous 5 minutes !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer support */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-4 md:px-8 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-display font-black text-slate-950 text-base">
              OXW
            </div>
            <p className="font-display font-bold text-white text-sm">OXW Creativ</p>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/+261387203022"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors font-medium text-sm"
            >
              📞 Support WhatsApp
            </a>
            <span className="text-slate-800">|</span>
            <span className="text-slate-300 font-medium text-xs md:text-sm">
              Page Facebook : <strong className="text-white">OXW Creativ</strong>
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900 pt-6">
          <p className="mb-2">© 2026 OXW Creativ — Minage IA & Micro-tâches à Madagascar. Tous droits réservés.</p>
          <p className="text-[10px] text-slate-600 font-mono tracking-wider">PROPULSÉ PAR TECHNOLOGIE INTÉLLIGENTE CLOUD • VITASY MADAGASCAR</p>
        </div>
      </footer>
    </div>
  );
}
