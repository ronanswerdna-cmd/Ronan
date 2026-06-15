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
            <img 
              src="https://i.postimg.cc/L66D8QG2/1781466214082.jpg" 
              alt="Logo OXW Creativ" 
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border border-blue-500/30 shadow-md shadow-blue-500/10"
            />
            <div>
              <span className="font-display font-extrabold text-lg bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                OXW Creativ
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest leading-none">VITA MALAGASY</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => onOpenAuth(false)}
              className="px-3 py-1.5 md:px-4 md:py-2 text-sm text-slate-300 hover:text-white transition-colors font-medium cursor-pointer"
            >
              Se connecter
            </button>
            <button
              id="landing-signup-btn"
              onClick={() => onOpenAuth(true)}
              className="px-4 py-1.5 md:px-5 md:py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-650 text-white text-xs md:text-sm font-bold rounded-lg transition-all shadow-md active:scale-95 cursor-pointer"
            >
              S'inscrire
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-10 w-[200px] h-[200px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none"></div>

        <div className="relative text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-mono font-bold tracking-wider mb-6">
            <Cpu className="w-3.5 h-3.5 animate-spin" />
            MINAGE CLOUD MULTI-THREADS INTELLIGENT
          </span>

          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white mb-6 uppercase leading-[1.1]">
            Générez des gains passifs avec le <br />
            <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Minage IA de Pointe
            </span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            <strong className="text-blue-400 font-bold">Oxw Creativ</strong> est la première plateforme malgache de minage intelligent par IA. Louez de la puissance de calcul brute à prix réduit en Ariary malagasy et récoltez vos profits automatiquement chaque jour sur Mvola, Airtel Money et Orange Money.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth(true)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white font-bold rounded-xl transition-all shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              Démarrer le minage maintenant
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onScrollToYields}
              className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-850 text-slate-300 font-medium rounded-xl border border-slate-850 hover:text-white transition-all text-sm cursor-pointer"
            >
              Découvrir les contrats VIP
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-16 border-t border-slate-900 text-left">
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-display font-black text-blue-500 mb-1">12K+</div>
              <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">Membres Actifs</p>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-display font-black text-blue-400 mb-1">240M Ar</div>
              <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">Retraits Effectués</p>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-display font-black text-white mb-1">99.9%</div>
              <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">Temps de Fonctionnement</p>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-display font-black text-indigo-400 mb-1">100% Secure</div>
              <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">Sécurité des Contrats</p>
            </div>
          </div>
        </div>
      </header>

      {/* Features section */}
      <section className="py-20 px-4 md:px-8 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-500 font-mono text-xs font-bold uppercase tracking-widest block mb-2">Technologie Malagasy</span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-white">Comment fonctionne Oxw Creativ ?</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-3">
              Un écosystème conçu pour rendre le minage de cryptomonnaies accessible, sécurisé et rentable pour tout le monde à Madagascar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-blue-500/70 text-xs font-mono font-semibold uppercase tracking-wider">Configurez votre profil</span>
              <h4 className="text-white font-bold text-lg mt-1 mb-2 font-display">1. Créez votre compte</h4>
              <p className="text-slate-400 text-xs leading-normal">
                Inscrivez-vous en quelques clics via votre numéro Mobile Money local (Mvola, Orange Money, Airtel Money). Recevez un bonus de bienvenue instantané de 1 000 Ar crédité d'office !
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20">
                <Cpu className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-blue-500/70 text-xs font-mono font-semibold uppercase tracking-wider">Simplicité et automatisation</span>
              <h4 className="text-white font-bold text-lg mt-1 mb-2 font-display">2. Louez un contrat de rig</h4>
              <p className="text-slate-400 text-xs leading-normal">
                Sélectionnez l'un de nos serveurs virtuels intelligents (VIP-1 à VIP-7) adaptés à votre budget réels. Activez la puissance de calcul à Madagascar en Ariary pour commencer à récolter des bénéfices quotidiens.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20">
                <Coins className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-blue-500/70 text-xs font-mono font-semibold uppercase tracking-wider">Retraits rapides</span>
              <h4 className="text-white font-bold text-lg mt-1 mb-2 font-display">3. Récoltez en monnaie locale</h4>
              <p className="text-slate-400 text-xs leading-normal">
                Lancez la collecte d'un simple clic toutes les 24 heures et demandez le retrait immédiat de vos Ar directement sur votre compte Mvola, Airtel ou Orange, validé et transféré en moins de quelques minutes !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliation Promotion / Program section */}
      <section className="py-20 px-4 md:px-8 bg-slate-950/20 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold mb-6">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>Gagnez plus avec vos amis</span>
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-display font-black uppercase leading-tight">
              Gagnez des commissions directes d'affiliation
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Le programme d'affiliation et de recommandation d'Oxw Creativ a été optimisé afin de récompenser généreusement les leaders de communauté à Madagascar :
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/10 shrink-0">
                  <Trophy className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">2 000 Ar par Inscription Validée</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Augmentez votre solde directement à chaque nouveau membre parrainé.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/10 shrink-0">
                  <Coins className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">10% de Commission sur les Plans</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Touchez instantanément 10% de royalties du coût du contrat à chaque investissement de vos filleuls.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute -top-1/4 -right-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-[80px]"></div>
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 block uppercase">EXEMPLE DE REVENUS</span>
                <span className="text-white text-sm font-bold font-display mt-1 block">Réseau d'investisseurs de Clara</span>
              </div>
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold font-mono">
                10% Direct Commission
              </div>
            </div>

            <div className="space-y-4 py-6">
              <div className="p-4 bg-slate-950 rounded-2xl flex items-center justify-between border border-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-xs">F</div>
                  <div>
                    <h5 className="text-white text-xs font-bold font-mono">Faly Rabe</h5>
                    <p className="text-[10px] text-slate-500">Inscrit par votre lien</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-bold font-display">VIP-3 Premium activé</p>
                  <p className="text-[10px] text-slate-500">Coût: 50 000 Ar</p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl flex items-center justify-between border border-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-xs">A</div>
                  <div>
                    <h5 className="text-white text-xs font-bold font-mono">Ali Kely</h5>
                    <p className="text-[10px] text-slate-500">Inscrit avec votre code</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-bold font-display">VIP-4 Pro activé</p>
                  <p className="text-[10px] text-slate-500">Coût: 100 000 Ar</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 rounded-xl border border-blue-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">COMMISSION CUMULÉE COLLECTÉE</span>
                <strong className="text-xl font-mono text-emerald-400 font-black">15 000 Ar</strong>
              </div>
              <button
                onClick={() => onOpenAuth(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Rejoindre le réseau
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Rigs contracts Section */}
      <section id="yields-section" className="py-20 px-4 md:px-8 border-t border-slate-900 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-500 font-mono text-xs font-extrabold uppercase tracking-widest block mb-2">Contrats d'exploitation</span>
          <h2 className="font-display font-black text-2xl md:text-3xl text-white">Nos serveurs intelligents de minage par IA</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-3">
            Découvrez nos puissances virtuelles disponibles à la location. Vos gains sont calculés en temps réel et cumulés sur votre compte pour un paiement rapide.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MINER_PACKS.map((pack) => (
            <div
              key={pack.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-xl"
            >
              {pack.tag && (
                <span className="absolute top-4 right-4 bg-blue-500/10 border border-blue-500/30 font-mono text-[10px] font-black text-blue-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {pack.tag} ⭐
                </span>
              )}

              <div className="space-y-4">
                <span className="text-[10px] text-blue-500 font-mono font-bold tracking-widest uppercase block bg-blue-500/10 w-fit px-2 py-0.5 rounded font-mono">
                  {pack.id.toUpperCase()}
                </span>
                
                <div>
                  <h3 className="font-display font-black text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {pack.name}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 h-8 leading-snug">
                    {pack.description}
                  </p>
                </div>

                <div className="py-2 border-y border-slate-800/80 my-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Coût de location :</span>
                    <strong className="text-white font-mono">{pack.cost.toLocaleString('fr-FR')} Ar</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Gain de minage / jour :</span>
                    <strong className="text-emerald-400 font-mono">+{pack.dailyYield.toLocaleString('fr-FR')} Ar</strong>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500 font-sans">Cycle contractuel :</span>
                    <strong className="text-slate-300">{pack.termDays} jours</strong>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 text-[11px] text-slate-400 leading-normal mb-6 font-mono">
                  💸 Rentabilité cumulée estimée : <strong className="text-white">{Math.round(pack.dailyYield * pack.termDays).toLocaleString('fr-FR')} Ar</strong> sur la période.
                </div>

                <button
                  onClick={onStartFree}
                  className="w-full py-3 px-4 font-bold rounded-xl text-center text-sm transition-all flex items-center justify-center gap-1 active:scale-95 bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer"
                >
                  Louer ce Mineur
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer support containing Facebook and official pages */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-4 md:px-8 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-slate-400">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.postimg.cc/L66D8QG2/1781466214082.jpg" 
              alt="Logo" 
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover border border-blue-500/30 shadow-sm"
            />
            <p className="font-display font-bold text-white text-sm">OXW Creativ</p>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/+261387203022"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-blue-400 transition-colors font-medium text-sm"
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
