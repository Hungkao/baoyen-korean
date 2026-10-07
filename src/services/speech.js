// Giọng đọc tiếng Hàn qua Web Speech: ko-KR, rate 0.8; thiếu giọng thì hướng dẫn cài.
// Giọng đọc được tải bất đồng bộ trên một số trình duyệt.
const speechNotice = () => document.getElementById('speech-notice');
export const synth = window.speechSynthesis;
// Live binding: nơi khác đọc để biết đã có giọng Hàn hay chưa.
export let koreanVoice = null;
export function loadVoices() {
  if (synth) koreanVoice = synth.getVoices().find(v => /^ko(?:-|_|$)/i.test(v.lang)) || null;
  if (koreanVoice) speechNotice().textContent = '';
}
export function initSpeech() {
  if (!synth) return;
  loadVoices();
  synth.addEventListener('voiceschanged', loadVoices);
}
export function speak(text) {
  loadVoices();
  if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') {
    speechNotice().textContent =
      'Trình duyệt này chưa hỗ trợ đọc tiếng Hàn. Hãy thử Safari hoặc Chrome trên điện thoại.';
    return;
  }
  if (!koreanVoice) {
    speechNotice().textContent =
      'Chưa tìm thấy giọng Hàn. iPhone: Cài đặt → Trợ năng → Nội dung được đọc (hoặc Đọc & nói) → Giọng nói → Tiếng Hàn. Android: tìm “Chuyển văn bản thành giọng nói” trong Cài đặt, chọn bộ máy đọc và tải giọng tiếng Hàn. Tên mục tùy máy. Sau đó mở lại trình duyệt và bấm Nghe.';
    return;
  }
  try {
    if (synth.speaking || synth.pending) synth.cancel();
    if (synth.paused) synth.resume();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.voice = koreanVoice;
    utterance.rate = 0.8;
    utterance.onerror = event => {
      if (!['canceled', 'interrupted'].includes(event.error))
        speechNotice().textContent =
          'Chưa phát được âm thanh. Kiểm tra âm lượng, giọng Hàn đã tải và thử bấm Nghe lại nhé.';
    };
    synth.speak(utterance);
  } catch {
    speechNotice().textContent = 'Chưa phát được giọng đọc. Hãy mở lại trình duyệt và thử lần nữa.';
  }
}
