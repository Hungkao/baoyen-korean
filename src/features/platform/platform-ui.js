// Màn trang chính (dashboard), lộ trình, mục lục bài cũ, onboarding và cài đặt.
// Đọc/ghi tiến độ qua progressStore; khôi phục route từ hash (#/roadmap…).
import { currentScreen, showScreen } from '../../app/router.js';
import { COURSE_CONTENT } from '../../content/course.js';
import { dailyPlan, grammar, learningItems } from '../../content/catalog.js';
import { progressStore } from '../../data/progress-store.js';
import { tabAccess } from '../../data/tab-lock.js';
import { LessonEngine } from '../../domain/lesson-engine.js';
import { PlatformEngine as engine } from '../../domain/platform-engine.js';
import { localDate } from '../../shared/dates.js';
import { speak } from '../../services/speech.js';
import { accountState } from '../account/account.js';
import { LessonUI } from '../lessons/lesson-renderer.js';
import { resetPractice, startDueReview } from '../practice/practice.js';

// Cùng model cho giao diện, kiểm thử và bộ xuất nội dung.
export const platformCatalog = engine.catalog(COURSE_CONTENT, dailyPlan);

export function initPlatformUi() {
  const el = id => document.getElementById(id),
    catalog = platformCatalog;
  const routes = new Set([
    'home',
    'roadmap',
    'onboarding',
    'settings',
    'alphabet',
    'syllables',
    'vocabulary',
    'practice',
    'account',
    'lesson-outline',
    'lesson'
  ]);
  const goalNames = {
    communication: 'giao tiếp',
    culture: 'phim, nhạc & văn hóa',
    study: 'du học',
    work: 'công việc',
    topik: 'thi TOPIK'
  };
  let selectedLesson = null,
    restoring = false;
  function node(tag, text, className) {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (className) n.className = className;
    return n;
  }
  function button(text, action, primary = false) {
    const b = node('button', text, primary ? 'primary' : '');
    b.type = 'button';
    b.addEventListener('click', action);
    return b;
  }
  function getProgress() {
    return progressStore.get().progress;
  }
  function route(name) {
    if (!routes.has(name)) name = 'home';
    resetPractice();
    showScreen(name);
  }
  function cloudMessage() {
    const auth = accountState();
    if (!auth?.signedIn)
      return 'Đang học trên máy này. Đăng nhập để hồ sơ và tiến độ có thể đồng bộ; em cũng có thể tải bản sao lưu.';
    const status = el('sync-status').textContent;
    return status || 'Đã đăng nhập; đang kiểm tra trạng thái đồng bộ.';
  }
  function applySettings() {
    document.body.classList.toggle('hide-romanization', !getProgress().platform.settings.showRomanization);
  }
  function renderDashboard() {
    const progress = getProgress(),
      profile = progress.platform.profile;
    const box = el('foundation-dashboard');
    box.replaceChildren();
    // Không tự chọn bài kế tiếp: chỉ mời học tiếp khi em đang dở một bài, còn lại để em tự chọn.
    const session = progress.platform.learning.session;
    const card = node('div', undefined, 'panel next-card');
    if (session && !session.finished) {
      const lesson = LessonEngine.get(session.lessonId);
      const step = document.createElement('progress');
      step.max = lesson.sections.length;
      step.value = session.currentSection;
      step.setAttribute('aria-label', 'Tiến độ trong bài');
      card.append(
        node('span', 'Bài em đang học', 'card-label'),
        node('h3', lesson.title),
        step,
        node('p', `Phần ${session.currentSection + 1}/${lesson.sections.length}`, 'note'),
        button('Tiếp tục bài', () => LessonUI.continueLearning(), true)
      );
      const other = button('Chọn bài khác', () => route('roadmap'));
      other.dataset.study = 'roadmap';
      card.append(other);
    } else {
      const open = button('Mở lộ trình', () => route('roadmap'), true);
      open.dataset.study = 'roadmap';
      card.append(
        node('span', 'Bài học', 'card-label'),
        node('h3', 'Em muốn học bài nào?'),
        node('p', 'Hangul và giao tiếp nhập môn. Mọi bài đều mở, em chọn bài mình thích.'),
        open
      );
    }
    box.append(card);
    const due = learningItems.filter(x => progress.srs[x.id]?.due <= localDate()).length;
    if (due) {
      const review = button('', () => startDueReview());
      review.className = 'review-row';
      review.append(node('strong', 'Ôn đến hạn'), node('span', due + ' mục đang chờ em'));
      box.append(review);
    }
    if (!profile) {
      const goal = button('Thiết lập mục tiêu →', () => route('onboarding'));
      goal.className = 'link-button';
      box.append(goal);
    }
  }
  function renderRoadmap() {
    const p = getProgress(),
      profile = p.platform.profile;
    el('roadmap-personal').textContent = profile
      ? `${profile.name} chọn bất kỳ bài nào mình thích. Thứ tự chỉ là gợi ý.`
      : 'Mọi bài đều mở. Thứ tự chỉ là gợi ý, em chọn bài mình thích.';
    const host = el('roadmap-levels');
    host.replaceChildren();
    // LessonUI sẵn sàng sau initLessonRenderer(); lần vẽ đầu tiên bỏ qua như trước.
    if (LessonUI.renderRoadmap) LessonUI.renderRoadmap(host);
    // 56 bài đọc cũ gom vào một thư viện, mặc định đóng để lộ trình chính gọn.
    const library = node('details', undefined, 'legacy-library');
    library.append(node('summary', 'Thư viện 56 bài đọc cũ'));
    library.append(node('p', 'Đọc và nghe lại các bài từ phiên bản đầu. Tiến độ cũ được giữ nguyên.', 'note'));
    for (const level of catalog.levels) {
      if (!catalog.units.some(u => u.levelId === level.id && catalog.lessons.some(l => l.unitId === u.id))) continue;
      const card = node('article', undefined, 'panel roadmap-level');
      card.append(node('h3', level.title), node('p', level.objective, 'note'));
      for (const unit of catalog.units.filter(u => u.levelId === level.id)) {
        const section = node('details'),
          lessons = catalog.lessons.filter(l => l.unitId === unit.id);
        const completed = lessons.filter(l => engine.lessonStatus(l, p, localDate()) === 'completed').length;
        section.append(node('summary', `${unit.title} · ${completed}/${lessons.length}`));
        for (const lesson of lessons) {
          const status = engine.lessonStatus(lesson, p, localDate());
          const b = button(`Bài ${lesson.day}: ${lesson.title}${status === 'completed' ? ' ✓' : ''}`, () =>
            openLesson(lesson.id)
          );
          b.className = 'roadmap-lesson';
          section.append(b);
        }
        card.append(section);
      }
      library.append(card);
    }
    host.append(library);
  }
  function openLesson(id) {
    selectedLesson = catalog.lessons.find(l => l.id === id);
    if (!selectedLesson) return;
    route('lesson-outline');
  }
  function renderLessonOutline() {
    const lesson = selectedLesson,
      host = el('lesson-outline-body');
    host.replaceChildren();
    if (!lesson) {
      host.append(node('p', 'Em chọn một bài trong lộ trình để xem nội dung nhé.'));
      return;
    }
    el('lesson-outline-title').textContent = lesson.title;
    const status = engine.lessonStatus(lesson, getProgress(), localDate());
    host.append(
      node(
        'p',
        status === 'completed'
          ? 'Bài đã hoàn thành trong lộ trình cũ. Em có thể đọc và nghe lại.'
          : 'Đọc và nghe các mục trong bài theo nhịp em thích; không cần hoàn thành bài trước.'
      )
    );
    const plan = dailyPlan.find(p => p.day === lesson.day);
    for (const item of plan.items) {
      const card = node('div', undefined, 'panel');
      const ko = node('strong', item.ko, 'outline-ko');
      ko.lang = 'ko';
      card.append(
        ko,
        node('p', item.roman, 'romanization'),
        node('p', item.meaning || item.explanation || item.hint),
        button('🔊 Nghe', () => speak(item.say || item.ko))
      );
      host.append(card);
    }
    if (plan.grammarId) {
      const g = grammar.find(g => g.id === plan.grammarId);
      if (g) host.append(node('h3', g.title), node('p', g.tip), node('p', g.formula));
    }
    host.append(
      button(
        plan.type === 'letter' ? 'Mở bảng chữ cái' : plan.type === 'word' ? 'Mở kho từ vựng' : 'Mở bảng ghép âm',
        () => route(plan.type === 'letter' ? 'alphabet' : plan.type === 'word' ? 'vocabulary' : 'syllables')
      )
    );
  }
  function fillProfile() {
    const profile = getProgress().platform.profile || {
      name: 'Bảo Yến',
      experience: 'new',
      hangul: 'no',
      goal: 'communication',
      topikGoal: 'none',
      minutes: 10,
      horizonMonths: 6
    };
    for (const key of ['name', ...Object.keys(engine.choices)])
      el('onboarding-form').elements.namedItem(key).value = String(profile[key]);
    el('profile-feedback').textContent = '';
  }
  function renderSettings() {
    const p = getProgress().platform;
    el('show-romanization').checked = p.settings.showRomanization;
    el('settings-profile').textContent = p.profile
      ? `${p.profile.name} · ${p.profile.minutes} phút/ngày · ${p.profile.horizonMonths} tháng · ${goalNames[p.profile.goal]}`
      : 'Chưa thiết lập mục tiêu.';
    el('platform-cloud-status').textContent = cloudMessage();
  }
  function refresh() {
    applySettings();
    renderDashboard();
    renderSettings();
    el('account-onboarding-prompt').hidden = !!getProgress().platform.profile;
    if (currentScreen() === 'roadmap') renderRoadmap();
    if (currentScreen() === 'lesson-outline') renderLessonOutline();
  }
  el('onboarding-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget),
      input = Object.fromEntries(form.entries());
    input.minutes = Number(input.minutes);
    input.horizonMonths = Number(input.horizonMonths);
    input.completedAt = localDate();
    const profile = engine.profile(input);
    if (!profile) {
      el('profile-feedback').textContent = 'Em kiểm tra tên và chọn đủ các mục hợp lệ nhé.';
      return;
    }
    const saved = progressStore.updatePlatform(p => {
      p.profile = profile;
      p.events.push({ type: 'onboarding_completed', date: localDate(), entityId: catalog.course.id });
    });
    if (!saved) {
      el('profile-feedback').textContent =
        'Chưa lưu được mục tiêu. Hãy cho phép lưu dữ liệu trang hoặc chờ tab học hiện tại đóng; chưa chuyển màn.';
      return;
    }
    route('roadmap');
  });
  el('show-romanization').addEventListener('change', () => {
    const value = el('show-romanization').checked;
    const saved = progressStore.updatePlatform(p => {
      p.settings.showRomanization = value;
      p.events.push({ type: 'settings_updated', date: localDate(), entityId: 'romanization' });
    });
    applySettings();
    el('settings-feedback').textContent = saved
      ? 'Đã lưu cài đặt trên máy; tài khoản sẽ đồng bộ khi có mạng.'
      : 'Chưa lưu được cài đặt. Em kiểm tra quyền lưu dữ liệu trang nhé.';
  });
  document.querySelectorAll('[data-route]').forEach(b => b.addEventListener('click', () => route(b.dataset.route)));
  // Hash router hoạt động trên file:// và hosting tĩnh; không giữ OAuth token trong đường dẫn.
  function restoreRoute() {
    const hash = location.hash;
    if (!hash.startsWith('#/')) return;
    const name = hash.slice(2);
    restoring = true;
    route(routes.has(name) ? name : 'home');
    restoring = false;
  }
  window.addEventListener('hashchange', restoreRoute);
  window.addEventListener('screen-changed', event => {
    const name = event.detail.screen;
    if (!restoring && !location.hash.includes('access_token') && location.hash !== '#/' + name) {
      if (location.hash.startsWith('#/')) history.pushState(null, '', '#/' + name);
      else history.replaceState(null, '', '#/' + name);
    }
    document.querySelectorAll('[data-route]').forEach(b => {
      if (b.dataset.route === name) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    if (name === 'onboarding') fillProfile();
    if (name === 'roadmap') renderRoadmap();
    if (name === 'lesson-outline') renderLessonOutline();
    if (name === 'home') renderDashboard();
    if (name === 'settings') renderSettings();
  });
  window.addEventListener('progress-saved', refresh);
  window.addEventListener('progress-loaded', refresh);
  window.addEventListener('account-state-changed', renderSettings);
  // Thời gian thực tế, chỉ khi tab học hoạt động và người học vừa tương tác.
  let previous = performance.now(),
    lastInteraction = performance.now(),
    scope = progressStore.key();
  function learningScreen() {
    return ['alphabet', 'syllables', 'vocabulary', 'practice', 'lesson-outline', 'lesson'].includes(currentScreen());
  }
  function recordTime() {
    const now = performance.now(),
      delta = Math.floor((now - previous) / 1000);
    previous = now;
    if (scope !== progressStore.key()) {
      scope = progressStore.key();
      lastInteraction = now;
      return;
    }
    if (
      document.hidden ||
      !learningScreen() ||
      now - lastInteraction > 60000 ||
      delta <= 0 ||
      delta > 20 ||
      !tabAccess.writable()
    )
      return;
    progressStore.updatePlatform(p => {
      const date = localDate();
      p.activity[date] = Math.min(86400, (p.activity[date] || 0) + delta);
      if (currentScreen() === 'lesson' && p.learning.session && !p.learning.session.finished)
        p.learning.session.seconds = Math.min(86400, p.learning.session.seconds + delta);
    });
  }
  for (const type of ['pointerdown', 'keydown'])
    document.addEventListener(
      type,
      () => {
        lastInteraction = performance.now();
      },
      { passive: true }
    );
  window.addEventListener('screen-changed', () => {
    previous = performance.now();
  });
  window.addEventListener('progress-scope-changed', () => {
    scope = progressStore.key();
    previous = performance.now();
    lastInteraction = previous;
  });
  document.addEventListener('visibilitychange', () => {
    previous = performance.now();
  });
  setInterval(recordTime, 15000);
  refresh();
  restoreRoute();
  // Web Locks có thể tải lại tiến độ ngay sau startup; khôi phục hash chỉ một lần sau đó.
  const initialHash = location.hash;
  window.addEventListener(
    'tab-writable',
    () => {
      if (initialHash.startsWith('#/')) {
        const name = routes.has(initialHash.slice(2)) ? initialHash.slice(2) : 'home';
        history.replaceState(null, '', '#/' + name);
        restoring = true;
        route(name);
        restoring = false;
      }
    },
    { once: true }
  );
}
