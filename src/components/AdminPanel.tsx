import React, { useState } from 'react';
import { Users, Cpu, ArrowUpRight, ArrowDownRight, Check, X, ShieldAlert, Edit, Trash2 } from 'lucide-react';
import { UserAccount, DepositRequest, WithdrawalRequest } from '../types';

interface AdminPanelProps {
  users: UserAccount[];
  usdtRate: number;
  onLogoutAdmin: () => void;
  onUpdateUsers: (updatedList: UserAccount[]) => void;
}

export default function AdminPanel({
  users,
  usdtRate,
  onLogoutAdmin,
  onUpdateUsers,
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'deposits' | 'withdrawals' | 'users'>('deposits');
  const [editUserPhone, setEditUserPhone] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState('');

  // 1. Gather all pending deposits
  const pendingDeposits: { userName: string; userPhone: string; deposit: DepositRequest }[] = [];
  users.forEach((u) => {
    u.depositHistory.forEach((dep) => {
      if (dep.status === 'pending') {
        pendingDeposits.push({ userName: u.name, userPhone: u.phone, deposit: dep });
      }
    });
  });

  // 2. Gather all pending withdrawals
  const pendingWithdrawals: { userName: string; userPhone: string; withdrawal: WithdrawalRequest }[] = [];
  users.forEach((u) => {
    u.withdrawalHistory.forEach((withd) => {
      if (withd.status === 'pending') {
        pendingWithdrawals.push({ userName: u.name, userPhone: u.phone, withdrawal: withd });
      }
    });
  });

  // 3. Overall Statistics
  const totalUsers = users.length;
  let totalApprovedDeposits = 0;
  let totalCompletedWithdrawals = 0;
  let totalActiveRigs = 0;

  users.forEach((u) => {
    u.depositHistory.forEach((dep) => {
      if (dep.status === 'approved') totalApprovedDeposits += dep.amount;
    });
    u.withdrawalHistory.forEach((withd) => {
      if (withd.status === 'completed') totalCompletedWithdrawals += withd.amount;
    });
    u.activeMiners.forEach((act) => {
      const isExpired = new Date(act.expiresAt).getTime() <= Date.now();
      if (!isExpired) totalActiveRigs += 1;
    });
  });

  const handleApproveDeposit = (phone: string, depId: string) => {
    if (confirm("Voulez-vous vraiment approuver et créditer ce dépôt de fonds ?")) {
      const updated = users.map(u => {
        if (u.phone === phone) {
          const depAmount = u.depositHistory.find(d => d.id === depId)?.amount || 0;
          return {
            ...u,
            balance: u.balance + depAmount,
            depositHistory: u.depositHistory.map(d => d.id === depId ? { ...d, status: 'approved' as const } : d)
          };
        }
        return u;
      });
      onUpdateUsers(updated);
    }
  };

  const handleRejectDeposit = (phone: string, depId: string) => {
    if (confirm("Rejeter ce dépôt ?")) {
      const updated = users.map(u => {
        if (u.phone === phone) {
          return {
            ...u,
            depositHistory: u.depositHistory.filter(d => d.id !== depId)
          };
        }
        return u;
      });
      onUpdateUsers(updated);
    }
  };

  const handleApproveWithdrawal = (phone: string, withId: string) => {
    if (confirm("Confirmer le transfert Mobile Money / Crypto et marquer comme complété ?")) {
      const updated = users.map(u => {
        if (u.phone === phone) {
          return {
            ...u,
            withdrawalHistory: u.withdrawalHistory.map(w => w.id === withId ? { ...w, status: 'completed' as const } : w)
          };
        }
        return u;
      });
      onUpdateUsers(updated);
    }
  };

  const handleRejectWithdrawal = (phone: string, withId: string) => {
    if (confirm("Voulez-vous rejeter ce retrait et recréditer instantanément le compte d'utilisateur ?")) {
      const updated = users.map(u => {
        if (u.phone === phone) {
          const withdrawal = u.withdrawalHistory.find(w => w.id === withId);
          const refundedBalance = u.balance + (withdrawal ? withdrawal.amount : 0);
          return {
            ...u,
            balance: refundedBalance,
            withdrawalHistory: u.withdrawalHistory.map(w => w.id === withId ? { ...w, status: 'rejected' as const } : w)
          };
        }
        return u;
      });
      onUpdateUsers(updated);
    }
  };

  const handleStartEditBalance = (user: UserAccount) => {
    setEditUserPhone(user.phone);
    setEditBalance(user.balance.toString());
  };

  const handleSaveBalance = () => {
    if (!editUserPhone || isNaN(Number(editBalance))) return;
    const updated = users.map(u => {
      if (u.phone === editUserPhone) {
        return { ...u, balance: Number(editBalance) };
      }
      return u;
    });
    onUpdateUsers(updated);
    setEditUserPhone(null);
  };

  const handleDeleteUser = (phone: string) => {
    if (phone === 'admin') {
      alert("Impossible de supprimer le compte Principal d'Admin !");
      return;
    }
    if (confirm(`⚠ ATTENTION : Voulez-vous vraiment supprimer définitivement l'utilisateur ${phone} ? Cette action est irréversible.`)) {
      const updated = users.filter(u => u.phone !== phone);
      onUpdateUsers(updated);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Title section */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase block font-black">OXW SECURE ADMINISTRATEUR</span>
          <h2 className="text-white text-2xl font-display font-black mt-1">Espace d'Administration Général</h2>
          <p className="text-slate-400 text-xs mt-1">
            Gérez toutes les transactions financières, validez les rechargements et acceptez les demandes de virement de fonds de Madagascar.
          </p>
        </div>
        <button
          onClick={onLogoutAdmin}
          className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-blue-400/30 text-blue-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          Déconnexion Admin
        </button>
      </section>

      {/* Admin Stats Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-slate-500 text-[10px] font-mono uppercase block">UTILISATEURS ENREGISTRÉS</span>
          <div className="text-3xl font-mono font-black text-white mt-2 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            {totalUsers}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-slate-500 text-[10px] font-mono uppercase block">DÉPÔTS VALIDÉS</span>
          <div className="text-3xl font-mono font-black text-emerald-400 mt-2 flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6 text-emerald-400" />
            {totalApprovedDeposits.toLocaleString('fr-FR')} Ar
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-slate-500 text-[10px] font-mono uppercase block">RETRAITS COMPLÉTÉS</span>
          <div className="text-3xl font-mono font-black text-red-400 mt-2 flex items-center gap-2">
            <ArrowDownRight className="w-6 h-6 text-red-400" />
            {totalCompletedWithdrawals.toLocaleString('fr-FR')} Ar
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-slate-500 text-[10px] font-mono uppercase block">RIGS DE MINAGE EN MADAGASCAR</span>
          <div className="text-3xl font-mono font-black text-slate-100 mt-2 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-400" />
            {totalActiveRigs} Rigs
          </div>
        </div>
      </section>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-900 gap-1.5 pb-0">
        <button
          onClick={() => setActiveSubTab('deposits')}
          className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-colors cursor-pointer ${
            activeSubTab === 'deposits'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900'
          }`}
        >
          Dépôts en attente ({pendingDeposits.length})
        </button>
        <button
          onClick={() => setActiveSubTab('withdrawals')}
          className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-colors cursor-pointer ${
            activeSubTab === 'withdrawals'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900'
          }`}
        >
          Retraits en attente ({pendingWithdrawals.length})
        </button>
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-colors cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900'
          }`}
        >
          Gérer les Utilisateurs ({totalUsers})
        </button>
      </div>

      {/* Content based on sub-tab */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        
        {/* TAB 1: PENDING DEPOSITS */}
        {activeSubTab === 'deposits' && (
          <div>
            <h3 className="font-display font-black text-white text-base mb-4">
              Vérification des Dépôts Declarés
            </h3>

            {pendingDeposits.length === 0 ? (
              <p className="text-slate-500 text-center py-8 text-xs">
                Aucun dépôt en attente d'approbation.
              </p>
            ) : (
              <div className="overflow-x-auto font-mono">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-mono">
                      <th className="pb-3 font-semibold">DATE DE DÉCLARATION</th>
                      <th className="pb-3 font-semibold font-sans">UTILISATEUR</th>
                      <th className="pb-3 font-semibold">OPÉRATEUR</th>
                      <th className="pb-3 font-semibold">NUMÉRO ÉMETTEUR</th>
                      <th className="pb-3 font-semibold">CODE DE RÉFÉRENCE</th>
                      <th className="pb-3 font-semibold text-right">MONTANT</th>
                      <th className="pb-3 font-semibold text-center font-sans">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {pendingDeposits.map((item) => (
                      <tr key={item.deposit.id} className="hover:bg-slate-950/20 text-slate-350">
                        <td className="py-4.5">{new Date(item.deposit.timestamp).toLocaleString('fr-FR')}</td>
                        <td className="py-4.5 font-bold text-white font-sans text-xs">
                          {item.userName} <span className="text-slate-500 font-normal font-mono">({item.userPhone})</span>
                        </td>
                        <td className="py-4.5">
                          <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded font-black text-blue-400 uppercase">
                            {item.deposit.operator === 'usdt_trc20' ? 'USDT (TRC-20)' : item.deposit.operator}
                          </span>
                        </td>
                        <td className="py-4.5 text-slate-200">{item.deposit.senderNumber}</td>
                        <td className="py-4.5 font-bold text-slate-100 select-all">{item.deposit.reference}</td>
                        <td className="py-4.5 text-right font-black text-emerald-400 text-sm">
                          {item.deposit.amount.toLocaleString('fr-FR')} Ar ({(item.deposit.amount / usdtRate).toFixed(2)} USDT)
                        </td>
                        <td className="py-4.5 text-center font-sans">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleApproveDeposit(item.userPhone, item.deposit.id)}
                              className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded flex items-center gap-0.5 cursor-pointer"
                              title="Valider et créditer"
                            >
                              <Check className="w-3.5 h-3.5" /> Accepter
                            </button>
                            <button
                              onClick={() => handleRejectDeposit(item.userPhone, item.deposit.id)}
                              className="px-2 py-1 bg-red-400/10 hover:bg-red-400/20 border border-red-500/20 text-red-400 font-bold rounded flex items-center gap-0.5 cursor-pointer"
                              title="Rejeter"
                            >
                              <X className="w-3.5 h-3.5" /> Rejeter
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PENDING WITHDRAWALS */}
        {activeSubTab === 'withdrawals' && (
          <div>
            <h3 className="font-display font-black text-white text-base mb-4">
              Traitement des Demandes de Retrait Actuels
            </h3>

            {pendingWithdrawals.length === 0 ? (
              <p className="text-slate-500 text-center py-8 text-xs">
                Aucun retrait en attente d'approbation.
              </p>
            ) : (
              <div className="overflow-x-auto font-mono">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-mono">
                      <th className="pb-3 font-semibold">DATE DE DEMANDE</th>
                      <th className="pb-3 font-semibold font-sans">UTILISATEUR</th>
                      <th className="pb-3 font-semibold">OPÉRATEUR DE RÉCEPTION</th>
                      <th className="pb-3 font-semibold">NUMÉRO BÉNÉFICIAIRE</th>
                      <th className="pb-3 font-semibold text-right">MONTANT DEMANDÉ</th>
                      <th className="pb-3 font-semibold text-center font-sans">DÉCISION ADMIN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-350">
                    {pendingWithdrawals.map((item) => (
                      <tr key={item.withdrawal.id} className="hover:bg-slate-950/20 text-slate-350">
                        <td className="py-4.5">{new Date(item.withdrawal.timestamp).toLocaleString('fr-FR')}</td>
                        <td className="py-4.5 font-bold text-white font-sans text-xs">
                          {item.userName} <span className="text-slate-500 font-normal font-mono">({item.userPhone})</span>
                        </td>
                        <td className="py-4.5">
                          <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded font-black text-blue-400 uppercase">
                            {item.withdrawal.operator === 'usdt_trc20' ? 'USDT (TRC-20)' : item.withdrawal.operator}
                          </span>
                        </td>
                        <td className="py-4.5 text-slate-200">{item.withdrawal.receiverNumber}</td>
                        <td className="py-4.5 text-right font-black text-red-400 text-sm">
                          -{item.withdrawal.amount.toLocaleString('fr-FR')} Ar ({(item.withdrawal.amount / usdtRate).toFixed(2)} USDT)
                        </td>
                        <td className="py-4.5 text-center font-sans">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleApproveWithdrawal(item.userPhone, item.withdrawal.id)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded flex items-center gap-0.5 cursor-pointer"
                              title="Valider et débloquer les fonds"
                            >
                              <Check className="w-3.5 h-3.5" /> Compléter transfert
                            </button>
                            <button
                              onClick={() => handleRejectWithdrawal(item.userPhone, item.withdrawal.id)}
                              className="px-2 py-1 bg-red-400/10 hover:bg-red-400/20 border border-red-500/20 text-red-400 font-bold rounded flex items-center gap-0.5 cursor-pointer"
                              title="Rejeter pour fraude et rembourser"
                            >
                              <X className="w-3.5 h-3.5" /> Rejeter (Rembourser)
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USERS LIST */}
        {activeSubTab === 'users' && (
          <div>
            <h3 className="font-display font-black text-white text-base mb-4">
              Base de Données des Utilisateurs Oxw Mining
            </h3>

            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.phone} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-white text-sm">{u.name}</strong>
                      <span className="text-[10px] bg-slate-900 border border-slate-800 rounded text-slate-400 px-1.5 py-0.5 font-mono">
                        {u.phone}
                      </span>
                      {u.referredBy && (
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono">
                          Parrainé par: {u.referredBy}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
                      <span>Solde : <strong className="text-emerald-400">{u.balance.toLocaleString('fr-FR')} Ar</strong></span>
                      <span>Rigs de Minage : <strong className="text-slate-100">{u.activeMiners.length}</strong></span>
                      <span>Parrainages : <strong className="text-slate-100">{u.referrals.length}</strong></span>
                      <span>Gains Parrain : <strong className="text-blue-400">{u.referralEarnings.toLocaleString('fr-FR')} Ar</strong></span>
                      <span>Code : <strong className="text-blue-300 font-bold">{u.referralCode}</strong></span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto justify-end font-sans">
                    <button
                      onClick={() => handleStartEditBalance(u)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Editer Solde
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.phone)}
                      disabled={u.phone === 'admin'}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-1 font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Simple Balance Editor Dialog Modal */}
            {editUserPhone && (
              <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-[999] flex items-center justify-center p-4 font-sans">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4">
                  <h4 className="font-display font-black text-white text-sm">Éditer le solde de l'utilisateur</h4>
                  <p className="text-xs text-slate-400 font-mono">Identifiant : {editUserPhone}</p>
                  
                  <div>
                    <label className="text-slate-400 text-xs block mb-1 font-sans">NOUVEAU SOLDE EN ARIARY (Ar) :</label>
                    <input
                      type="number"
                      value={editBalance}
                      onChange={(e) => setEditBalance(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-white font-mono"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setEditUserPhone(null)}
                      className="flex-1 py-2 bg-slate-800 rounded-lg text-xs text-slate-350 font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveBalance}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
