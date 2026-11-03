export const BABY_BIRTH = '2026-10-01';
export const PERIODS = ['0-3', '4-6', '7-9', '10-12'];

export function ageInMonths(now = new Date(), birth = BABY_BIRTH) {
  const b = new Date(birth + 'T00:00:00');
  let m = (now.getFullYear() - b.getFullYear()) * 12 + now.getMonth() - b.getMonth();
  if (now.getDate() < b.getDate()) m -= 1;
  return Math.max(0, m);
}

export function periodOf(now = new Date()) {
  const m = ageInMonths(now);
  if (m <= 3) return '0-3';
  if (m <= 6) return '4-6';
  if (m <= 9) return '7-9';
  return '10-12';
}

export const currentPeriod = () => periodOf(new Date());

// Doğum günü ve ay dönümleri (bugüne kadar): [{ date, label }], en yeni önce.
export function milestoneMarkers(now = new Date(), birth = BABY_BIRTH) {
  const b = new Date(birth + 'T00:00:00');
  const out = [{ date: b, label: 'Aslan doğdu' }];
  for (let m = 1; m <= ageInMonths(now, birth); m++) {
    out.push({ date: new Date(b.getFullYear(), b.getMonth() + m, b.getDate()), label: `Aslan ${m} aylık oldu` });
  }
  return out.reverse();
}
