import { MinerPack } from './types';

export const MINER_PACKS: MinerPack[] = [
  {
    id: 'vip1',
    name: 'VIP 1',
    cost: 5000,
    speed: 333.3333 / 1440,
    dailyYield: 333.33,
    termDays: 30,
    description: 'Doublez votre dépôt de départ ! Gagnez 333.33 Ar par jour pour atteindre un total de 10 000 Ar sur un contrat de 30 jours.',
    type: 'vip1',
    tag: 'Débutant',
  },
  {
    id: 'vip2',
    name: 'VIP 2',
    cost: 10000,
    speed: 666.6667 / 1440,
    dailyYield: 666.67,
    termDays: 30,
    description: 'Doublez votre dépôt de départ ! Gagnez 666.67 Ar par jour pour atteindre un total de 20 000 Ar sur un contrat de 30 jours.',
    type: 'vip2',
    tag: 'Populaire',
  },
  {
    id: 'vip3',
    name: 'VIP 3',
    cost: 20000,
    speed: 1333.3333 / 1440,
    dailyYield: 1333.33,
    termDays: 30,
    description: 'Doublez votre dépôt de départ ! Gagnez 1 333.33 Ar par jour pour atteindre un total de 40 000 Ar sur un contrat de 30 jours.',
    type: 'vip3',
    tag: 'Rentable',
  },
  {
    id: 'vip4',
    name: 'VIP 4',
    cost: 60000,
    speed: 4000.00 / 1440,
    dailyYield: 4000.00,
    termDays: 30,
    description: 'Doublez votre dépôt de départ ! Gagnez 4 000.00 Ar par jour pour atteindre un total de 120 000 Ar sur un contrat de 30 jours.',
    type: 'vip4',
    tag: 'Super Rig',
  },
];

