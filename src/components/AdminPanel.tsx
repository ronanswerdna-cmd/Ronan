import React, { useState } from 'react';
import { UserAccount, DepositRequest, WithdrawalRequest } from '../types';
import { Users, ArrowUpRight, ArrowDownRight, Check, X, ShieldAlert, Coins, Cpu, Trash2, Edit } from 'lucide-react';

interface AdminPanelProps {
  users: UserAccount[];
  onUpdateUsers: (newUsers: UserAccount[]) => void;
  onLogoutAdmin: () => void;
  usdtRate: number;
}

export default function AdminPanel({ users, onUpdateUsers, onLogoutAdmin, usdtRate }: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'deposits' | 'withdrawals' | 'users'>('deposits');
  const [editUserPhone, setEditUserPhone] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState<string>('');

  // Calculate statistics
  const totalUsers = users.length;
  
  // Total Approved deposits
  const totalApprovedDeposits = users.reduce((acc, u) => {
    return acc + u.depositHistory
      .filter(d => d.status === 'approved')
      .reduce((sum, d) => sum + d.amount, 0);
  }, 0);

  // Total Completed withdrawals
  const totalCompletedWithdrawals = users.reduce((acc, u) => {
    return acc + u.withdrawalHistory
      .filter(w => w.status === 'completed')
      .reduce((sum, w) => sum + w.amount, 0);
  }, 0);

  // Total active mining rigs in Madagascar
  const totalActiveRigs = users.reduce((acc, u) => acc + u.activeMiners.length, 0);

  // Gather all pending deposits across all users
  interface NestedDeposit {
    userPhone: string;
    userName: string;
    deposit: DepositRequest;
  }
  const pendingDeposits: NestedDeposit[] = [];
  users.forEach(u => {
    u.depositHistory.forEach(d => {
      if (d.status === 'pending') {
        pendingDeposits.push({
          userPhone: u.phone,
          userName: u.name,
          deposit: d,
        });
      }
    });
  });

  // Gather all pending withdrawals across all users
  interface NestedWithdrawal {
    userPhone: string;
    userName: string;
    withdrawal: WithdrawalRequest;
  }
  const pendingWithdrawals: NestedWithdrawal[] = [];
  users.forEach(u => {
    u.withdrawalHistory.forEach(w => {
      if (w.status === 'pending') {
        pendingWithdrawals.push({
          userPhone: u.phone,
          userName: u.name,
          withdrawal: w,
        });
      }
    });
  });

  // Handle deposit approval
  const handleApproveDeposit = (userPhone: string, depositId: string) => {
    const updatedUsers = users.map(u => {
      if (u.phone === userPhone) {
        let moneyToAdd = 0;
        const updatedDeposits = u.depositHistory.map(d => {
          if (d.id === depositId && d.status === 'pending') {
            moneyToAdd = d.amount;
            return { ...d, status: 'approved' as const };
          }
          return d;
        });

        // Add deposit money to user balance
        let newBalance = u.balance + moneyToAdd;
        
        // Handle referral commission of 10% if there is a referrer
        let commissionLog = '';
        if (u.referredBy && moneyToAdd > 0) {
          const commPercent = 0.10; // 10% referral commission
          const commissionAmount = moneyToAdd * commPercent;
          
          // We will award the referrer immediately in the users list
          const referrerPhone = u.referredBy;
          // Note: we will edit the referrer in a separate pass below
        }

        return {
          ...u,
          balance: newBalance,
          depositHistory: updatedDeposits,
          lastBalanceUpdateAt: new Date().toISOString()
        };
      }
      return u;
    });

    // Award referral cash to the referrer
    const userOfInterest = users.find(u => u.phone === userPhone);
    if (userOfInterest && userOfInterest.referredBy) {
      const depositObj = userOfInterest.depositHistory.find(d => d.id === depositId);
      if (depositObj) {
        const commission = depositObj.amount * 0.10;
        updatedUsers.forEach(u => {
          if (u.phone === userOfInterest.referredBy || u.referralCode === userOfInterest.referredBy) {
            u.balance += commission;
            u.referralEarnings += commission;
          }
        });
      }
    }

    onUpdateUsers(updatedUsers);
    alert('Le dépôt a été approuvé et le solde de l\'utilisateur a été crédité !');
  };

  // Handle deposit rejection
  const handleRejectDeposit = (userPhone: string, depositId: string) => {
    const updatedUsers = users.map(u => {
      if (u.phone === userPhone) {
        const updatedDeposits = u.depositHistory.map(d => {
          if (d.id === depositId) {
            return { ...d, status: 'rejected' as const };
          }
          return d;
        });

        return {
          ...u,
          depositHistory: updatedDeposits,
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    alert('Le dépôt a été marqué comme rejeté.');
  };

  // Handle withdrawal approval
  const handleApproveWithdrawal = (userPhone: string, withdrawalId: string) => {
    const updatedUsers = users.map(u => {
      if (u.phone === userPhone) {
        const updatedHistory = u.withdrawalHistory.map(w => {
          if (w.id === withdrawalId) {
            return { ...w, status: 'completed' as const };
          }
          return w;
        });

        return {
          ...u,
          withdrawalHistory: updatedHistory,
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    alert('Retrait complété ! L\'argent a été transféré au bénéficiaire.');
  };

  // Handle withdrawal rejection
  const handleRejectWithdrawal = (userPhone: string, withdrawalId: string) => {
    const updatedUsers = users.map(u => {
      if (u.phone === userPhone) {
        let moneyToRefund = 0;
        const updatedHistory = u.withdrawalHistory.map(w => {
          if (w.id === withdrawalId && w.status === 'pending') {
            moneyToRefund = w.amount;
            return { ...w, status: 'rejected' as const };
          }
          return w;
        });

        // Refund the user's balance
        return {
          ...u,
          balance: u.balance + moneyToRefund,
          withdrawalHistory: updatedHistory,
          lastBalanceUpdateAt: new Date().toISOString()
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    alert('Retrait rejeté. Les fonds ont été remboursés sur le solde de l\'utilisateur.');
  };

  // Delete user account
  const handleDeleteUser = (phone: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${phone} ?`)) {
      const remaining = users.filter(u => u.phone !== phone);
      onUpdateUsers(remaining);
    }
  };

  // Open edit balance modal
  const handleStartEditBalance = (user: UserAccount) => {
    setEditUserPhone(user.phone);
    setEditBalance(user.balance.toFixed(0));
  };

  // Confirm edit balance
  const handleSaveBalance = () => {
    if (!editUserPhone || isNaN(Number(editBalance))) return;

    const updated = users.map(u => {
      if (u.phone === editUserPhone) {
        return {
          ...u,
          balance: Number(editBalance),
          lastBalanceUpdateAt: new Date().toISOString()
        };
      }
      return u;
    });

    onUpdateUsers(updated);
    setEditUserPhone(null);
    alert('Le solde de l\'utilisateur a été mis à jour avec succès.');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
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
          className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-amber-400/30 text-amber-400 text-xs font-bold rounded-xl transition-all"
        >
          Déconnexion Admin
        </button>
      </section>

      {/* Admin Stats Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-slate-500 text-[10px] font-mono uppercase block">UTILISATEURS ENREGISTRÉS</span>
          <div className="text-3xl font-mono font-black text-white mt-2 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" />
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
            <Cpu className="w-6 h-6 text-amber-400" />
            {totalActiveRigs} Rigs
          </div>
        </div>
      </section>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-900 gap-1.5 pb-0">
        <button
          onClick={() => setActiveSubTab('deposits')}
          className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-colors ${
            activeSubTab === 'deposits'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900'
          }`}
        >
          Dépôts en attente ({pendingDeposits.length})
        </button>
        <button
          onClick={() => setActiveSubTab('withdrawals')}
          className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-colors ${
            activeSubTab === 'withdrawals'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900'
          }`}
        >
          Retraits en attente ({pendingWithdrawals.length})
        </button>
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-colors ${
            activeSubTab === 'users'
              ? 'bg-amber-500 text-slate-950'
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
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-mono">
                      <th className="pb-3 font-semibold">DATE DE DÉCLARATION</th>
                      <th className="pb-3 font-semibold">UTILISATEUR</th>
                      <th className="pb-3 font-semibold">OPÉRATEUR</th>
                      <th className="pb-3 font-semibold">NUMÉRO ÉMETTEUR</th>
                      <th className="pb-3 font-semibold">CODE DE RÉFÉRENCE</th>
                      <th className="pb-3 font-semibold text-right">MONTANT</th>
                      <th className="pb-3 font-semibold text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {pendingDeposits.map((item) => (
                      <tr key={item.deposit.id} className="hover:bg-slate-950/20 text-slate-350">
                        <td className="py-4.5">{new Date(item.deposit.timestamp).toLocaleString('fr-FR')}</td>
                        <td className="py-4.5 font-bold text-white">
                          {item.userName} <span className="text-slate-500 font-normal">({item.userPhone})</span>
                        </td>
                        <td className="py-4.5">
                          <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded font-black text-amber-500 uppercase">
                            {item.deposit.operator === 'usdt_trc20' ? 'USDT (TRC-20)' : item.deposit.operator}
                          </span>
                        </td>
                        <td className="py-4.5 text-slate-200">{item.deposit.senderNumber}</td>
                        <td className="py-4.5 font-bold text-slate-100 select-all">{item.deposit.reference}</td>
                        <td className="py-4.5 text-right font-black text-emerald-450 text-sm">
                          {item.deposit.amount.toLocaleString('fr-FR')} Ar ({(item.deposit.amount / usdtRate).toFixed(2)} USDT)
                        </td>
                        <td className="py-4.5 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleApproveDeposit(item.userPhone, item.deposit.id)}
                              className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded flex items-center gap-0.5"
                              title="Valider et créditer"
                            >
                              <Check className="w-3.5 h-3.5" /> Accepter
                            </button>
                            <button
                              onClick={() => handleRejectDeposit(item.userPhone, item.deposit.id)}
                              className="px-2 py-1 bg-red-400/10 hover:bg-red-400/20 border border-red-500/20 text-red-400 font-bold rounded flex items-center gap-0.5"
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
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-mono">
                      <th className="pb-3 font-semibold">DATE DE DEMANDE</th>
                      <th className="pb-3 font-semibold">UTILISATEUR</th>
                      <th className="pb-3 font-semibold">OPÉRATEUR DE RÉCEPTION</th>
                      <th className="pb-3 font-semibold">NUMÉRO BÉNÉFICIAIRE</th>
                      <th className="pb-3 font-semibold text-right">MONTANT DEMANDÉ</th>
                      <th className="pb-3 font-semibold text-center">DÉCISION ADMIN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {pendingWithdrawals.map((item) => (
                      <tr key={item.withdrawal.id} className="hover:bg-slate-950/20 text-slate-350">
                        <td className="py-4.5">{new Date(item.withdrawal.timestamp).toLocaleString('fr-FR')}</td>
                        <td className="py-4.5 font-bold text-white">
                          {item.userName} <span className="text-slate-500 font-normal font-sans">({item.userPhone})</span>
                        </td>
                        <td className="py-4.5">
                          <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded font-black text-amber-500 uppercase">
                            {item.withdrawal.operator === 'usdt_trc20' ? 'USDT (TRC-20)' : item.withdrawal.operator}
                          </span>
                        </td>
                        <td className="py-4.5 text-slate-200">{item.withdrawal.receiverNumber}</td>
                        <td className="py-4.5 text-right font-black text-red-400 text-sm">
                          -{item.withdrawal.amount.toLocaleString('fr-FR')} Ar ({(item.withdrawal.amount / usdtRate).toFixed(2)} USDT)
                        </td>
                        <td className="py-4.5 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleApproveWithdrawal(item.userPhone, item.withdrawal.id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded flex items-center gap-0.5"
                              title="Valider et débloquer les fonds"
                            >
                              <Check className="w-3.5 h-3.5" /> Compléter transfert
                            </button>
                            <button
                              onClick={() => handleRejectWithdrawal(item.userPhone, item.withdrawal.id)}
                              className="px-2 py-1 bg-red-400/10 hover:bg-red-400/20 border border-red-500/20 text-red-400 font-bold rounded flex items-center gap-0.5"
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
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                          Parrainé par: {u.referredBy}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
                      <span>Solde : <strong className="text-emerald-400">{u.balance.toLocaleString('fr-FR')} Ar</strong></span>
                      <span>Rigs de Minage : <strong className="text-slate-100">{u.activeMiners.length}</strong></span>
                      <span>Parrainages : <strong className="text-slate-100">{u.referrals.length}</strong></span>
                      <span>Gains Parrain : <strong className="text-amber-500">{u.referralEarnings.toLocaleString('fr-FR')} Ar</strong></span>
                      <span>Code : <strong className="text-amber-300">{u.referralCode}</strong></span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => handleStartEditBalance(u)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs flex items-center gap-1 font-semibold"
                    >
                      <Edit className="w-3.5 h-3.5" /> Editer Solde
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.phone)}
                      disabled={u.phone === 'admin'}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-1 font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Simple Balance Editor Dialog Modal */}
            {editUserPhone && (
              <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4">
                  <h4 className="font-display font-black text-white text-sm">Éditer le solde de l'utilisateur</h4>
                  <p className="text-xs text-slate-400 font-mono">Identifiant : {editUserPhone}</p>
                  
                  <div>
                    <label className="text-slate-400 text-xs block mb-1 font-mono">NOUVEAU SOLDE EN ARIARY (Ar) :</label>
                    <input
                      type="number"
                      value={editBalance}
                      onChange={(e) => setEditBalance(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-white font-mono"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditUserPhone(null)}
                      className="flex-1 py-2 bg-slate-800 rounded-lg text-xs text-slate-350 font-bold"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveBalance}
                      className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold"
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
