export const PERIODS = ['0-3', '4-6', '7-9', '10-12'];

// Doğum tarihi koda yazılmaz (herkese açık). Uygulama açılırken veritabanından/önbellekten gelip buraya konur.
let birthISO = null;
export const setBirth = (iso) => {
  birthISO = /^\d{4}-\d{2}-\d{2}$/.test(iso ?? '') ? iso : null;
};
export const getBirthISO = () => birthISO;
export const hasBirth = () => birthISO !== null;

export function ageInMonths(now = new Date(), birth = birthISO) {
  if (!birth) return 0;
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
export function milestoneMarkers(now = new Date(), birth = birthISO) {
  if (!birth) return [];
  const b = new Date(birth + 'T00:00:00');
  const out = [{ date: b, label: 'Aslan doğdu' }];
  for (let m = 1; m <= ageInMonths(now, birth); m++) {
    out.push({ date: new Date(b.getFullYear(), b.getMonth() + m, b.getDate()), label: `Aslan ${m} aylık oldu` });
  }
  return out.reverse();
}
