import React, { useState, useEffect } from 'react';
import { UserAccount, DepositRequest, WithdrawalRequest } from './types';
import Ticker from './components/Ticker';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Packs from './components/Packs';
import Deposits from './components/Deposits';
import Withdraws from './components/Withdraws';
import Referrals from './components/Referrals';
import AdminPanel from './components/AdminPanel';
import { MINER_PACKS } from './data';
import { Cpu, Coins, ShieldCheck, HelpCircle, LogOut, ArrowRight } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'oxw_creativ_user_session_v1';
const GLOBAL_USERS_KEY = 'oxw_users_all_list_v2';

export default function App() {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSignUpInitial, setIsSignUpInitial] = useState(true);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  
  // Real-time floating balance to display rapid precise incrementing decimals
  const [liveBalance, setLiveBalance] = useState<number>(0);
  const [usdtRate, setUsdtRate] = useState<number>(4650); // Live USDT to MGA (Ariary) exchange rate, fallback is 4650 Ar
  const [lastRateUpdateAt, setLastRateUpdateAt] = useState<string>('En attente...');

  // Countdown/loading state variables for authentication
  const [authLoadingUser, setAuthLoadingUser] = useState<{phone: string, name: string, passwordString: string, referralCodeIntroduced?: string} | null>(null);
  const [authLoadingProgress, setAuthLoadingProgress] = useState(false);
  const [authLoadingSeconds, setAuthLoadingSeconds] = useState(10);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState<string | null>(null);

  // Fetch real-time exchange rate for USDT (USD to MGA) - Polling every 12 seconds for active real-time tracking
  useEffect(() => {
    const fetchRate = () => {
      fetch('https://open.er-api.com/v6/latest/USD')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch exchange rate');
          return res.json();
        })
        .then(data => {
          if (data && data.rates && data.rates.MGA) {
            const rate = Number(data.rates.MGA);
            if (rate > 2000 && rate < 8000) { // Safety check
              console.log('Real-time USDT/USD to MGA rate loaded:', rate);
              setUsdtRate(rate);
              const now = new Date();
              setLastRateUpdateAt(now.toLocaleTimeString('fr-FR'));
            }
          }
        })
        .catch(err => {
          console.error('Error fetching real-time USDT rate from internet, using fallback:', err);
        });
    };

    fetchRate();
    const interval = setInterval(fetchRate, 12000); // Poll and refresh rate in real-time every 12 seconds
    return () => clearInterval(interval);
  }, []);

  // 1. Initial State Loading from LocalStorage on mount
  useEffect(() => {
    // A. Parse or Initialize Global Users List
    let globalUsers: UserAccount[] = [];
    const savedGlobal = localStorage.getItem(GLOBAL_USERS_KEY);
    if (savedGlobal) {
      try {
        globalUsers = JSON.parse(savedGlobal);
      } catch (err) {
        console.error('Error parsing global users', err);
      }
    }

    if (globalUsers.length === 0) {
      const parentReferralCode = 'OXW-ADMIN';
      const nowStr = new Date().toISOString();
      const defaultUsers: UserAccount[] = [
        {
          phone: 'admin',
          name: 'Administrateur Général',
          password: 'admin',
          balance: 0,
          lastBalanceUpdateAt: nowStr,
          activeMiners: [],
          depositHistory: [],
          withdrawalHistory: [],
          referralCode: 'OXW-ADMIN',
          referrals: ['0341234567'],
          referralEarnings: 2000,
          isAdmin: true
        },
        {
          phone: 'Ronan RA',
          name: 'Ronan RA',
          password: '17022006',
          balance: 0,
          lastBalanceUpdateAt: nowStr,
          activeMiners: [],
          depositHistory: [],
          withdrawalHistory: [],
          referralCode: 'OXW-RONAN',
          referrals: [],
          referralEarnings: 0,
          isAdmin: true
        },
        {
          phone: '0341234567',
          name: 'Faly Rabe',
          password: '123456',
          balance: 15800,
          lastBalanceUpdateAt: nowStr,
          activeMiners: [
            {
              minerId: 'vip1',
              activatedAt: nowStr,
              expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
            }
          ],
          depositHistory: [
            {
              id: 'DEP-1',
              operator: 'mvola',
              senderNumber: '0341234567',
              amount: 5000,
              reference: 'Ref: MV12121.2332.A12',
              proofName: 'mvola_recu.png',
              timestamp: nowStr,
              status: 'pending'
            },
            {
              id: 'DEP-2',
              operator: 'airtel',
              senderNumber: '0341234567',
              amount: 10000,
              reference: 'Ref: AM98243.1232.B99',
              proofName: 'airtel_recu.jpg',
              timestamp: nowStr,
              status: 'approved'
            }
          ],
          withdrawalHistory: [
            {
              id: 'WTH-1',
              operator: 'orange',
              receiverNumber: '0341234567',
              amount: 6000,
              timestamp: nowStr,
              status: 'pending'
            }
          ],
          referralCode: 'OXW-FALY',
          referredBy: 'OXW-ADMIN',
          referrals: [],
          referralEarnings: 0
        }
      ];
      localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(defaultUsers));
      globalUsers = defaultUsers;
    }
    setAllUsers(globalUsers);

    // B. Check url search for referral code query
    const searchParams = new URLSearchParams(window.location.search);
    const refParam = searchParams.get('ref');
    if (refParam) {
      sessionStorage.setItem('oxw_active_ref_invitation', refParam);
    }

    // C. Setup standard logged in session
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed: UserAccount = JSON.parse(cached);
        
        // Find latest updated representation from global list to stay synched
        const freshUser = globalUsers.find(u => u.phone === parsed.phone);
        const activeRep = freshUser || parsed;

        const now = new Date();
        activeRep.lastBalanceUpdateAt = now.toISOString();
        setUser(activeRep);
        setLiveBalance(activeRep.balance);
        if (activeRep.isAdmin) {
          setActiveTab('admin');
        } else {
          setActiveTab('dashboard');
        }
      } catch (e) {
        console.error('Error reloading cache', e);
      }
    }
  }, []);

  // 3. Throttle state save to LocalStorage (every 3 seconds) to synchronize to database list
  useEffect(() => {
    if (!user) return;

    const saver = setInterval(() => {
      setUser(prev => {
        if (!prev) return null;
        const updated = {
          ...prev,
          balance: liveBalance,
          lastBalanceUpdateAt: new Date().toISOString()
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        
        // Sync into global user database list as well so Admin reflects live balance
        setAllUsers(currentList => {
          const updatedList = currentList.map(u => u.phone === updated.phone ? updated : u);
          localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(updatedList));
          return updatedList;
        });

        return updated;
      });
    }, 3000);

    return () => clearInterval(saver);
  }, [liveBalance, user]);

  // Log Out handler
  const handleLogOut = () => {
    if (user) {
      const finalState = {
        ...user,
        balance: liveBalance,
        lastBalanceUpdateAt: new Date().toISOString()
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalState));
      
      setAllUsers(currentList => {
        const updatedList = currentList.map(u => u.phone === finalState.phone ? finalState : u);
        localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(updatedList));
        return updatedList;
      });
    }
    setUser(null);
    setActiveTab('dashboard');
  };

  // Countdown ticking effect
  useEffect(() => {
    if (!authLoadingProgress) return;
    const interval = setInterval(() => {
      setAuthLoadingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setAuthLoadingProgress(false);
          if (authLoadingUser) {
            setShowWelcomeMessage(authLoadingUser.name);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [authLoadingProgress, authLoadingUser]);

  // Sign up/Login integration (Kicks off the 10 second loader)
  const handleAuthSuccess = (phone: string, name: string, passwordString: string, referralCodeIntroduced?: string) => {
    setAuthLoadingUser({ phone, name, passwordString, referralCodeIntroduced });
    setAuthLoadingSeconds(10);
    setAuthLoadingProgress(true);
  };

  // Finalizes connection logic and unlocks full space after welcome prompt
  const handleFinalizeAuth = () => {
    if (!authLoadingUser) return;
    const { phone, name, passwordString, referralCodeIntroduced } = authLoadingUser;
    const nowStr = new Date().toISOString();
    
    // A. Parse latest global users from localStorage
    let currentGlobalUsers: UserAccount[] = [];
    const saved = localStorage.getItem(GLOBAL_USERS_KEY);
    if (saved) {
      try {
        currentGlobalUsers = JSON.parse(saved);
      } catch (e) {
        currentGlobalUsers = [...allUsers];
      }
    } else {
      currentGlobalUsers = [...allUsers];
    }

    // Special intercept for Ronan RA super administrator account
    const isRonanRA = phone.trim().toLowerCase() === 'ronan ra';
    if (isRonanRA) {
      if (passwordString !== '17022006') {
        alert("🔒 Code d'accès incorrect pour ce numéro de téléphone. Veuillez réessayer.");
        setAuthLoadingUser(null);
        setShowWelcomeMessage(null);
        return;
      }
      
      let ronanUser = currentGlobalUsers.find(u => u.phone.trim().toLowerCase() === 'ronan ra');
      if (!ronanUser) {
        ronanUser = {
          phone: 'Ronan RA',
          name: 'Ronan RA',
          password: '17022006',
          balance: 0,
          lastBalanceUpdateAt: nowStr,
          activeMiners: [],
          depositHistory: [],
          withdrawalHistory: [],
          referralCode: 'OXW-RONAN',
          referrals: [],
          referralEarnings: 0,
          isAdmin: true
        };
        currentGlobalUsers.push(ronanUser);
      } else {
        ronanUser.isAdmin = true;
        ronanUser.password = '17022006';
        ronanUser.name = 'Ronan RA';
        ronanUser.phone = 'Ronan RA';
      }
      
      localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(currentGlobalUsers));
      setAllUsers(currentGlobalUsers);
      setUser(ronanUser);
      setLiveBalance(ronanUser.balance);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ronanUser));
      setActiveTab('admin');
      setAuthLoadingUser(null);
      setShowWelcomeMessage(null);
      return;
    }

    const matchedUser = currentGlobalUsers.find(u => u.phone === phone);

    if (matchedUser) {
      // 1. Password Verification (skipped for google login with code google_bypass_sso_1702)
      if (passwordString !== 'google_bypass_sso_1702' && matchedUser.password && matchedUser.password !== passwordString) {
        alert("🔒 Code d'accès incorrect pour ce numéro de téléphone. Veuillez réessayer.");
        setAuthLoadingUser(null);
        setShowWelcomeMessage(null);
        return;
      }

      // 2. Already exists -> Login successful
      setUser(matchedUser);
      setLiveBalance(matchedUser.balance);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(matchedUser));
      if (matchedUser.isAdmin) {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }
      setAuthLoadingUser(null);
      setShowWelcomeMessage(null);
      return;
    }

    // B. Registering a new account (Standard or Google SSO)
    const personalRef = `OXW-${phone.substring(Math.max(0, phone.length - 4))}-${Math.floor(100 + Math.random() * 900)}`;
    let welcomeBonus = 1000; // 1 000 Ar welcome bonus
    let referredByCode = '';

    if (referralCodeIntroduced) {
      const parentUser = currentGlobalUsers.find(
        u => u.referralCode === referralCodeIntroduced || u.phone === referralCodeIntroduced
      );

      if (parentUser) {
        referredByCode = parentUser.referralCode;
        welcomeBonus = 1000; // Keep 1000 Ar welcome bonus

        // Credit the referrer direct signup bonus 2000 Ar!
        currentGlobalUsers = currentGlobalUsers.map(u => {
          if (u.phone === parentUser.phone) {
            return {
              ...u,
              balance: u.balance + 2000,
              referralEarnings: u.referralEarnings + 2000,
              referrals: [...u.referrals, phone]
            };
          }
          return u;
        });
      }
    } else {
      // Fallback url query parameter checking if they came from a referral link
      const queryRef = sessionStorage.getItem('oxw_active_ref_invitation');
      if (queryRef) {
        const parentUser = currentGlobalUsers.find(
          u => u.referralCode === queryRef || u.phone === queryRef
        );
        if (parentUser) {
          referredByCode = parentUser.referralCode;
          currentGlobalUsers = currentGlobalUsers.map(u => {
            if (u.phone === parentUser.phone) {
              return {
                ...u,
                balance: u.balance + 2000,
                referralEarnings: u.referralEarnings + 2000,
                referrals: [...u.referrals, phone]
              };
            }
            return u;
          });
          sessionStorage.removeItem('oxw_active_ref_invitation');
        }
      }
    }

    const newUser: UserAccount = {
      phone,
      name,
      password: passwordString,
      balance: welcomeBonus,
      lastBalanceUpdateAt: nowStr,
      activeMiners: [],
      depositHistory: [],
      withdrawalHistory: [],
      referralCode: personalRef,
      referredBy: referredByCode || undefined,
      referrals: [],
      referralEarnings: 0
    };

    currentGlobalUsers.push(newUser);
    localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(currentGlobalUsers));
    setAllUsers(currentGlobalUsers);

    setUser(newUser);
    setLiveBalance(newUser.balance);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
    setActiveTab('dashboard');
    setAuthLoadingUser(null);
    setShowWelcomeMessage(null);
  };

  // Sync balances and persist on specific atomic events
  const executeSetUserAndPersist = (updater: (prev: UserAccount) => UserAccount) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = updater(prev);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      
      // Update inside the global users database
      setAllUsers(currentList => {
        const updatedList = currentList.map(u => u.phone === updated.phone ? updated : u);
        localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(updatedList));
        return updatedList;
      });
      return updated;
    });
  };

  // Purchase/Activate Paid miner packs
  const handleActivatePack = (packId: string) => {
    const pack = MINER_PACKS.find(p => p.id === packId);
    if (!pack || !user) return;

    if (liveBalance < pack.cost) {
      alert(`⚠️ Solde insuffisant ! Pour louer le pack ${pack.name}, il vous faut au moins ${pack.cost.toLocaleString('fr-FR')} Ar. Veuillez faire un dépôt dans la rubrique "Dépôts".`);
      return;
    }

    const currentActualBalance = liveBalance - pack.cost;
    setLiveBalance(currentActualBalance);

    executeSetUserAndPersist(prev => {
      const now = new Date();
      const expires = new Date();
      expires.setDate(expires.getDate() + pack.termDays);

      return {
        ...prev,
        balance: currentActualBalance,
        activeMiners: [
          ...prev.activeMiners,
          {
            minerId: packId,
            activatedAt: now.toISOString(),
            expiresAt: expires.toISOString(),
          }
        ],
        lastBalanceUpdateAt: now.toISOString(),
      };
    });
    alert(`🎉 Félicitations ! Votre contrat de puissance ${pack.name} a été loué avec succès. Vos gains de minage se cumulent désormais en arrière-plan !`);
  };

  // Submit deposit declaration receipt form
  const handleSubmitDeposit = (depositData: Omit<DepositRequest, 'id' | 'timestamp' | 'status'>) => {
    if (!user) return;

    executeSetUserAndPersist(prev => {
      const nowStr = new Date().toISOString();
      const newRequest: DepositRequest = {
        ...depositData,
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: nowStr,
        status: 'pending',
      };

      return {
        ...prev,
        depositHistory: [newRequest, ...prev.depositHistory],
        lastBalanceUpdateAt: nowStr,
      };
    });
  };

  // Submit withdrawal request form
  const handleSubmitWithdraw = (withdrawData: Omit<WithdrawalRequest, 'id' | 'timestamp' | 'status'>) => {
    if (!user) return;

    const requestedAmount = withdrawData.amount;
    
    if (liveBalance < requestedAmount) {
      alert(`⚠️ Solde insuffisant ! Votre solde actuel est de ${liveBalance.toLocaleString('fr-FR')} Ar, mais vous essayez de retirer ${requestedAmount.toLocaleString('fr-FR')} Ar.`);
      return;
    }

    const finalBalance = liveBalance - requestedAmount;
    setLiveBalance(finalBalance);

    executeSetUserAndPersist(prev => {
      const nowStr = new Date().toISOString();
      const newWithdrawal: WithdrawalRequest = {
        ...withdrawData,
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: nowStr,
        status: 'pending',
      };

      return {
        ...prev,
        balance: finalBalance,
        withdrawalHistory: [newWithdrawal, ...prev.withdrawalHistory],
        lastBalanceUpdateAt: nowStr,
      };
    });

    const isCrypto = withdrawData.operator === 'usdt_trc20';
    const destinationLabel = isCrypto ? "adresse TRC-20 (USDT)" : "compte Mobile Money (Mvola / Airtel / Orange)";
    const usdtVal = (requestedAmount / usdtRate).toFixed(2);
    alert(`💸 Demande de retrait soumise avec succès ! Nos administrateurs vont traiter votre transfert de ${requestedAmount.toLocaleString('fr-FR')} Ar (${usdtVal} USDT) vers votre ${destinationLabel}.`);
  };

  // Debug tool/Fallback check: Validation of ALL pending deposits by simulated cloud commission admin
  const handleApproveAllPending = () => {
    if (!user) return;

    let creditedAmount = 0;
    user.depositHistory.forEach(d => {
      if (d.status === 'pending') {
        creditedAmount += d.amount;
      }
    });

    if (creditedAmount === 0) {
      alert("ℹ️ Aucun dépôt en attente d'approbation sur ce compte.");
      return;
    }

    const newActualBalance = liveBalance + creditedAmount;
    setLiveBalance(newActualBalance);

    executeSetUserAndPersist(prev => {
      const updatedDeposits = prev.depositHistory.map(d => {
        if (d.status === 'pending') {
          return { ...d, status: 'approved' as const };
        }
        return d;
      });

      return {
        ...prev,
        balance: newActualBalance,
        depositHistory: updatedDeposits,
        lastBalanceUpdateAt: new Date().toISOString(),
      };
    });

    alert(`⚡ Tous les dépôts déclarés ont été inspectés et crédités de +${creditedAmount.toLocaleString('fr-FR')} Ar sur votre solde !`);
  };

  // For testing block simulation on mining dash
  const handleSimulateMineBlock = () => {
    const reward = Math.floor(Math.random() * 300) + 100;
    const finalBal = liveBalance + reward;
    setLiveBalance(finalBal);

    executeSetUserAndPersist(prev => {
      return {
        ...prev,
        balance: finalBal,
        lastBalanceUpdateAt: new Date().toISOString(),
      };
    });

    alert(`🎉 Bloc miné avec succès ! Votre mineur IA a validé un bloc cryptographique de calcul. Récompense immédiate de +${reward} Ar créditée !`);
  };

  const handleCollectMining = () => {
    if (!user) return;
    
    // Check if user has active VIP subscription (non-expired)
    const activeVips = user.activeMiners.filter(m => new Date(m.expiresAt).getTime() > Date.now());
    if (activeVips.length === 0) {
      alert("❌ Tsy nahomby: Mila manofa soparim-piraketana VIP ianao vao afaka mitrandraka na manangona. (Vous devez disposer d'un contrat VIP actif pour pouvoir miner)");
      return;
    }

    // Check if 24 hours have already passed since last collect
    if (user.lastMiningSessionStartedAt) {
      const lastCollect = new Date(user.lastMiningSessionStartedAt).getTime();
      const nextAvailable = lastCollect + 24 * 60 * 60 * 1000;
      if (Date.now() < nextAvailable) {
        const remainingMs = nextAvailable - Date.now();
        const hrs = Math.floor(remainingMs / (3600 * 1000));
        const mins = Math.floor((remainingMs % (3600 * 1000)) / 60000);
        alert(`⌛ Mbola tsy afaka manangona ianao. Miandrasa ${hrs}h sy ${mins}min mbola sisa. (Veuillez patienter encore ${hrs}h et ${mins}min)`);
        return;
      }
    }

    // Calculate total daily yield of active non-expired contracts
    let totalDailyYield = 0;
    activeVips.forEach(act => {
      const pack = MINER_PACKS.find(p => p.id === act.minerId);
      if (pack) {
        totalDailyYield += pack.dailyYield;
      }
    });

    if (totalDailyYield <= 0) {
      alert("❌ Tsy nahomby: Mila manofa soparim-piraketana VIP ianao vao afaka mitrandraka.");
      return;
    }

    const newBalance = liveBalance + totalDailyYield;
    setLiveBalance(newBalance);

    executeSetUserAndPersist(prev => {
      const nowStr = new Date().toISOString();
      return {
        ...prev,
        balance: newBalance,
        lastMiningSessionStartedAt: nowStr,
        lastBalanceUpdateAt: nowStr,
      };
    });

    alert(`🎉 Hanangona nahomby! Nahazo +${Math.round(totalDailyYield).toLocaleString('fr-FR')} Ar ianao amin'ireo rigs VIP anao. (Collecte de gains réussie !)`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      {/* 10 Seconds progress loading screen */}
      {authLoadingProgress && (
        <div className="fixed inset-0 bg-slate-950 z-[999] flex flex-col items-center justify-center p-6 text-center">
          <div className="absolute w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="relative flex flex-col items-center">
            {/* Pulsing circular logo */}
            <div className="relative w-36 h-36 rounded-full flex items-center justify-center mb-8 border border-blue-500/30 bg-slate-900/80 shadow-2xl p-2 animate-pulse">
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <img 
                src="https://i.postimg.cc/L66D8QG2/1781466214082.jpg" 
                alt="OXW Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover shadow-lg"
              />
            </div>

            <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white mb-2 uppercase">
              Initialisation de votre rig
            </h2>
            <p className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-6 animate-pulse">
              MINAGE IA CLOUD • MADAGASCAR
            </p>

            <div className="w-64 h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden mb-4 relative">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 transition-all duration-1000 ease-linear"
                style={{ width: `${(10 - authLoadingSeconds) * 10}%` }}
              ></div>
            </div>

            <div className="text-slate-400 font-mono text-sm font-semibold">
              Sécurisation des protocoles : <span className="text-blue-500 font-black text-lg">{authLoadingSeconds}s</span>
            </div>

            <p className="text-[10px] text-slate-500 max-w-xs mt-8">
              Veillez à ne pas fermer cette fenêtre. Nous configurons vos clés d'accès privées cryptographiques.
            </p>
          </div>
        </div>
      )}

      {/* Tongasoa welcome greeting */}
      {showWelcomeMessage && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[999] flex flex-col items-center justify-center p-4">
          <div className="absolute w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="bg-slate-900 border-2 border-blue-600/40 w-full max-w-md rounded-3xl p-8 relative shadow-2xl text-center space-y-6 overflow-hidden">
            <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border border-blue-500/20 shadow-md">
              <img 
                src="https://i.postimg.cc/L66D8QG2/1781466214082.jpg" 
                alt="OXW logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase font-black bg-blue-500/10 px-3 py-1 rounded-full">
                ✓ AUTHENTIFICATION RÉUSSIE
              </span>
              <h1 className="font-display font-black text-2xl text-white tracking-tight pt-2">
                Tongasoa, {showWelcomeMessage} !
              </h1>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed px-4">
                Saha-toerana feno ho an'ny fidiram-bola passif malagasy. Oxw Creativ dia faly mandray anao.
                <br />
                Votre espace de minage IA à Madagascar est prêt.
              </p>
            </div>

            <button
              onClick={handleFinalizeAuth}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2 font-display uppercase tracking-wider"
            >
              Accéder à mon espace membre
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      <div>
        {/* Top Scrolling News Bar (Ticker) */}
        <Ticker usdtRate={usdtRate} />

        {/* Conditional Routing: Logged Out vs Active Dashboard Dashboard */}
        {!user ? (
          <LandingPage
            onStartFree={() => {
              setIsSignUpInitial(true);
              setIsAuthOpen(true);
            }}
            onScrollToYields={() => {
              const el = document.getElementById('yields-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenAuth={(isSignUp) => {
              setIsSignUpInitial(isSignUp);
              setIsAuthOpen(true);
            }}
          />
        ) : (
          <div>
            {/* Authenticated Dashboard Header */}
            <header className="border-b border-slate-900 bg-slate-950 px-4 md:px-8 py-5">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                
                {/* Logo & Madagascar title */}
                <div className="flex items-center gap-3">
                  <img 
                    src="https://i.postimg.cc/L66D8QG2/1781466214082.jpg" 
                    alt="Logo" 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-blue-500/30 shadow-md shadow-blue-500/10"
                  />
                  <div>
                    <span className="font-display font-extrabold text-lg text-white">
                      OXW <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Creativ Portal</span>
                    </span>
                    <p className="text-[10px] text-emerald-400 font-mono tracking-widest leading-none mt-0.5">
                      MINAGE IA CLOUD • MADAGASCAR
                    </p>
                  </div>
                </div>

                {/* Navigation Bar inside dashboard */}
                <nav className="flex flex-wrap justify-center gap-1 md:gap-2">
                  {!user.isAdmin ? (
                    <>
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-3 py-1.5 md:px-4 md:py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          activeTab === 'dashboard' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        Activité
                      </button>
                      <button
                        onClick={() => setActiveTab('packs')}
                        className={`px-3 py-1.5 md:px-4 md:py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          activeTab === 'packs' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        Contrats
                      </button>
                      <button
                        onClick={() => setActiveTab('referrals')}
                        className={`px-3 py-1.5 md:px-4 md:py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          activeTab === 'referrals' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        Parrainage
                      </button>
                      <button
                        onClick={() => setActiveTab('deposits')}
                        className={`px-3 py-1.5 md:px-4 md:py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          activeTab === 'deposits' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        Dépôts
                      </button>
                      <button
                        onClick={() => setActiveTab('withdraws')}
                        className={`px-3 py-1.5 md:px-4 md:py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          activeTab === 'withdraws' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        Retraits
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setActiveTab('admin')}
                      className="px-3 py-1.5 md:px-4 md:py-2 text-xs font-black rounded-lg border border-emerald-550 bg-emerald-500 text-slate-950 cursor-pointer"
                    >
                      Espace Admin ⚙️
                    </button>
                  )}
                </nav>

                {/* User details and Log Out trigger */}
                <div className="flex items-center gap-3">
                  {user.isAdmin ? (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-mono block">RÔLE SÉCURISÉ</span>
                      <strong className="text-sm font-mono text-emerald-405 text-emerald-400 font-black tracking-tight block">
                        ADMINISTRATEUR
                      </strong>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-mono block">VOTRE PORTefeuille</span>
                      <strong className="text-sm font-mono text-emerald-400 font-extrabold tracking-tight block">
                        {liveBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ar
                      </strong>
                    </div>
                  )}
                  
                  <button
                    onClick={handleLogOut}
                    title="Se Déconnecter"
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-blue-400 text-slate-400 hover:bg-slate-850 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>

              </div>
            </header>

            {/* Content Tabs Area */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
              {activeTab === 'dashboard' && (
                <Dashboard 
                  user={user} 
                  onNavigate={setActiveTab} 
                  onCollectMining={handleCollectMining}
                />
              )}
              {activeTab === 'packs' && (
                <Packs 
                  user={user} 
                  onActivatePack={handleActivatePack} 
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === 'referrals' && (
                <Referrals 
                  user={user} 
                  allUsers={allUsers}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === 'deposits' && (
                <Deposits 
                  user={user} 
                  onSubmitDeposit={handleSubmitDeposit}
                  usdtRate={usdtRate}
                  lastRateUpdateAt={lastRateUpdateAt}
                />
              )}
              {activeTab === 'withdraws' && (
                <Withdraws 
                  user={user} 
                  onSubmitWithdraw={handleSubmitWithdraw} 
                  usdtRate={usdtRate}
                  lastRateUpdateAt={lastRateUpdateAt}
                />
              )}
              {activeTab === 'admin' && user.isAdmin && (
                <AdminPanel 
                  users={allUsers}
                  onLogoutAdmin={handleLogOut}
                  usdtRate={usdtRate}
                  onUpdateUsers={(updatedList) => {
                    setAllUsers(updatedList);
                    localStorage.setItem('oxw_users_all_list_v2', JSON.stringify(updatedList));

                    // Sync the active admin user representation too if changed
                    const adminRep = updatedList.find(u => u.phone === user.phone);
                    if (adminRep) {
                      setUser(adminRep);
                      setLiveBalance(adminRep.balance);
                      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(adminRep));
                    }
                  }}
                />
              )}
            </main>
          </div>
        )}
      </div>

      {/* Auth Screen Overlay */}
      <Auth
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        isSignUpInitial={isSignUpInitial}
        onSuccess={handleAuthSuccess}
      />

      {/* Global Madagascar Support Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 md:px-8 text-center text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
          <p>© 2026 OXW Creativ — Minage IA & Micro-tâches à Madagascar. Tous droits réservés.</p>
          <div className="flex gap-4">
            <a 
              href="https://wa.me/+261387203022" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-blue-400 transition-colors"
            >
               WhatsApp : +261 38 72 030 22
            </a>
            <span>•</span>
            <span>Facebook : <strong className="text-slate-400">OXW Creativ</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
}
