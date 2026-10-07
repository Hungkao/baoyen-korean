// Thứ tự Unicode dùng để ghép Hangul; UI chỉ chọn các chữ cơ bản đã học.
const initialOrder = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const vowelOrder = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const finalOrder = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ'
];
// Hangul = U+AC00 + (phụ âm đầu × 21 + nguyên âm) × 28 + phụ âm cuối.
// Nguồn: https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-3/
export function composeSyllable(initial, vowel, final = '') {
  const l = initialOrder.indexOf(initial),
    v = vowelOrder.indexOf(vowel),
    t = finalOrder.indexOf(final);
  if (initial.length !== 1 || vowel.length !== 1 || l < 0 || v < 0 || t < 0) return '';
  return String.fromCodePoint(0xac00 + (l * 21 + v) * 28 + t);
}
