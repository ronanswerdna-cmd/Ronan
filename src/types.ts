export interface MinerPack {
  id: string; // e.g., 'vip1', 'vip2', 'vip3', 'vip4'
  name: string;
  cost: number;
  speed: number; // in Ariary per minute
  dailyYield: number; // in Ariary
  termDays: number;
  description: string;
  type: string; // 'vip1' | 'vip2' | 'vip3' | 'vip4'
  tag?: string;
}

export interface DepositRequest {
  id: string;
  operator: 'mvola' | 'airtel' | 'orange' | 'usdt_trc20';
  senderNumber: string;
  amount: number;
  reference: string;
  proofName: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface WithdrawalRequest {
  id: string;
  operator: 'mvola' | 'airtel' | 'orange' | 'usdt_trc20';
  receiverNumber: string;
  amount: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'rejected';
}

export interface UserAccount {
  phone: string;
  name: string;
  password?: string;
  balance: number; // Current balance
  lastBalanceUpdateAt: string; // ISO string used to calculate real-time mining
  activeMiners: {
    minerId: string;
    activatedAt: string; // ISO string
    expiresAt: string; // ISO string
  }[];
  depositHistory: DepositRequest[];
  withdrawalHistory: WithdrawalRequest[];
  referralCode: string;
  referredBy?: string;
  referrals: string[]; // List of phoned referred
  referralEarnings: number;
  isAdmin?: boolean;
  lastMiningSessionStartedAt?: string; // ISO string of when they last pressed 'Start Mining'
}

