import React from 'react';

interface TickerProps {
  usdtRate: number;
}

export default function Ticker({ usdtRate }: TickerProps) {
  const roundedRate = Math.round(usdtRate).toLocaleString('fr-FR');
  
  return (
    <div className="w-full bg-amber-500 text-slate-950 py-1.5 px-4 overflow-hidden text-xs md:text-sm font-semibold select-none border-b border-amber-600/30 z-[49] relative">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="inline-block mx-8 font-mono">
          📊 <strong className="font-extrabold uppercase">COURS DU JOUR USDT/MGA :</strong> 1 USDT = <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded font-black text-sm">{roundedRate} Ar</span> (Taux réel sur Internet mis à jour en direct 🟢)
        </span>
        <span className="inline-block mx-8">
          🔔 <strong className="font-extrabold uppercase">Actualité :</strong> Taux de minage optimisé aujourd'hui ! Lancez vos mineurs IA et encaissez vos gains directement en USDT TRC-20 au meilleur taux du marché.
        </span>
        <span className="inline-block mx-8 text-slate-900">
          🔥 <strong className="font-extrabold uppercase">Offre Limitée :</strong> Créez votre compte maintenant et profitez d'un mineur gratuit à vie !
        </span>
        <span className="inline-block mx-8">
          ⚡ <strong className="font-extrabold uppercase">Retrait Rapide :</strong> Validation moyenne de vos transferts en moins de 15 minutes sur votre compte.
        </span>
        <span className="inline-block mx-8 font-mono">
          📊 1 USDT = <strong className="bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded font-black">{roundedRate} Ar</strong> (Internet Live Exchange 🟢)
        </span>
      </div>
    </div>
  );
}
