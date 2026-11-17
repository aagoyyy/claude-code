/** SINGLE SOURCE OF TRUTH for every business figure shown in any scene. Never type a number in a scene. */
export const DATA = {
  packet: 3000,
  rangeLow: 10000,
  rangeHigh: 15000,
  cost: {mi: 3500, telur: 2000, bumbu: 1500},
  modal: 7000,
  price: 12000,
  profit: 5000,
} as const;
export const fmtRp = (n: number) => 'Rp ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const fmtRange = (a: number, b: number) => 'Rp ' + fmtNum(a) + '–' + fmtNum(b);
export const fmtNum = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
// consistency guard (build-time): modal = sum of costs; profit = price - modal
if (DATA.cost.mi + DATA.cost.telur + DATA.cost.bumbu !== DATA.modal || DATA.price - DATA.modal !== DATA.profit) throw new Error('V6 DATA inconsistent');
