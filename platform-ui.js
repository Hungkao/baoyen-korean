'use strict';
// UI nền tảng dùng model/engine; tiến độ vẫn đi qua progressStore và cơ chế cloud cũ.
(() => {
 const el=id=>document.getElementById(id),engine=PlatformEngine;
 const catalog=engine.catalog(COURSE_CONTENT,dailyPlan);
 const routes=new Set(['home','roadmap','onboarding','settings','alphabet','syllables','vocabulary','practice','account','lesson-outline','lesson']);
 const goalNames={communication:'giao tiếp',culture:'phim, nhạc & văn hóa',study:'du học',work:'công việc',topik:'thi TOPIK'};
 let selectedLesson=null,restoring=false;
 function node(tag,text,className){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
 function button(text,action,primary=false){const b=node('button',text,primary?'primary':'');b.type='button';b.addEventListener('click',action);return b;}
 function getProgress(){return progressStore.get().progress;}
 function route(name){if(!routes.has(name))name='home';resetPractice();showScreen(name);}
 function cloudMessage(){
  const auth=window.accountState?.();
  if(!auth?.signedIn)return 'Đang học trên máy này. Đăng nhập để hồ sơ và tiến độ có thể đồng bộ; em cũng có thể tải bản sao lưu.';
  const status=el('sync-status').textContent;
  return status||'Đã đăng nhập; đang kiểm tra trạng thái đồng bộ.';
 }
 function applySettings(){document.body.classList.toggle('hide-romanization',!getProgress().platform.settings.showRomanization);}
 function renderDashboard(){
  const progress=getProgress(),profile=progress.platform.profile;
  const box=el('foundation-dashboard');box.replaceChildren();
  const menu=node('div',undefined,'learning-menu');
  const sections=[
   ['alphabet','Chữ cái','Nhận diện 40 chữ Hangul, nghe âm tiết mẫu.'],
   ['syllables','Ghép âm','Tự ghép chữ và tập đọc các khối âm tiết.'],
   ['vocabulary','Từ vựng','Chọn trong 24 chủ đề, học thẻ và ôn từ em thích.'],
   ['roadmap','Học theo bài','Hangul và giao tiếp nhập môn; mọi bài đều mở.'],
   ['practice','Luyện tập','Tự thử câu hỏi về chữ, từ và ghép âm.']
  ];
  for(const [name,title,description] of sections){
   const b=button('',()=>route(name));b.dataset.study=name;
   b.append(node('strong',title),node('span',description));menu.append(b);
  }
  box.append(menu);
  const session=progress.platform.learning.session;
  if(session&&!session.finished){
   const resume=node('div',undefined,'panel');
   resume.append(node('h3','Bài em đang học'),node('p',LessonEngine.get(session.lessonId).title),button('Tiếp tục bài đang học →',()=>window.LessonUI.continueLearning()));
   box.append(resume);
  }
  const tools=node('div',undefined,'actions');
  tools.append(button('Ôn đến hạn',()=>el('review-due').click()),button('Mục tiêu & cài đặt',()=>route('settings')));
  if(!profile)tools.append(button('Thiết lập mục tiêu →',()=>route('onboarding')));
  box.append(tools,node('p','Em chọn phần mình thích, học và ôn theo nhịp riêng. Mục đã xem không có nghĩa là đã thuộc.','note'));
 }
 function renderRoadmap(){
  const p=getProgress(),profile=p.platform.profile;
  el('roadmap-personal').textContent=profile?`${profile.name} chọn bất kỳ bài nào mình thích. Thứ tự lộ trình chỉ là gợi ý để tìm nội dung.`:'Chọn bài theo sở thích; không cần học theo thứ tự hoặc thiết lập mục tiêu trước.';
  const host=el('roadmap-levels');host.replaceChildren();
  // Giáo trình mới độc lập; các selector/ID legacy vẫn được giữ.
  if(window.LessonUI)window.LessonUI.renderRoadmap(host);
  const legacyTitle=node('h3','56 bài đọc & ôn thêm');host.append(legacyTitle,node('p','Mọi bài đều mở để đọc và nghe lại. Tiến độ lộ trình cũ được giữ riêng.','note'));
  for(const level of catalog.levels){
   if(!catalog.units.some(u=>u.levelId===level.id&&catalog.lessons.some(l=>l.unitId===u.id)))continue;
   const card=node('article',undefined,'panel roadmap-level');card.append(node('span','CHẶNG '+level.order,'eyebrow'),node('h3',level.title),node('p',level.objective));
   card.append(node('span',level.status==='planned'?'Chưa triển khai':'Có nội dung cơ bản · chưa đủ toàn chặng','pill'));
   if(level.targetWords)card.append(node('p',`Mục tiêu giáo trình: ${level.targetWords[0]}–${level.targetWords[1]} từ tích lũy (chưa phải số từ đã cung cấp cho chặng).`,'note'));
   for(const unit of catalog.units.filter(u=>u.levelId===level.id)){
    const section=node('details'),lessons=catalog.lessons.filter(l=>l.unitId===unit.id);
    const completed=lessons.filter(l=>engine.lessonStatus(l,p,localDate())==='completed').length;
    section.append(node('summary',`${unit.title} · ${completed}/${lessons.length} bài`));
    for(const lesson of lessons){const status=engine.lessonStatus(lesson,p,localDate());
     const b=button(`Bài ${lesson.day}: ${lesson.title} · ${status==='completed'?'✓ Xem lại':'Đọc & nghe'}`,()=>openLesson(lesson.id));
     b.className='roadmap-lesson';section.append(b);
    }card.append(section);
   }host.append(card);
  }
 }
 function openLesson(id){selectedLesson=catalog.lessons.find(l=>l.id===id);if(!selectedLesson)return;route('lesson-outline');}
 function renderLessonOutline(){
  const lesson=selectedLesson,host=el('lesson-outline-body');host.replaceChildren();
  if(!lesson){host.append(node('p','Em chọn một bài trong lộ trình để xem nội dung nhé.'));return;}
  el('lesson-outline-title').textContent=lesson.title;
  const status=engine.lessonStatus(lesson,getProgress(),localDate());
  host.append(node('p',status==='completed'?'Bài đã hoàn thành trong lộ trình cũ. Em có thể đọc và nghe lại.':'Đọc và nghe các mục trong bài theo nhịp em thích; không cần hoàn thành bài trước.'));
  const plan=dailyPlan.find(p=>p.day===lesson.day);
  for(const item of plan.items){const card=node('div',undefined,'panel');const ko=node('strong',item.ko,'outline-ko');ko.lang='ko';card.append(ko,node('p',item.roman,'romanization'),node('p',item.meaning||item.explanation||item.hint),button('🔊 Nghe',()=>speak(item.say||item.ko)));host.append(card);}
  if(plan.grammarId){const g=grammar.find(g=>g.id===plan.grammarId);if(g)host.append(node('h3',g.title),node('p',g.tip),node('p',g.formula));}
  host.append(button(plan.type==='letter'?'Mở bảng chữ cái':plan.type==='word'?'Mở kho từ vựng':'Mở bảng ghép âm',()=>route(plan.type==='letter'?'alphabet':plan.type==='word'?'vocabulary':'syllables')));
 }
 function fillProfile(){
  const profile=getProgress().platform.profile||{name:'Bảo Yến',experience:'new',hangul:'no',goal:'communication',topikGoal:'none',minutes:10,horizonMonths:6};
  for(const key of ['name',...Object.keys(engine.choices)])el('onboarding-form').elements.namedItem(key).value=String(profile[key]);
  el('profile-feedback').textContent='';
 }
 function renderSettings(){const p=getProgress().platform;el('show-romanization').checked=p.settings.showRomanization;el('settings-profile').textContent=p.profile?`${p.profile.name} · ${p.profile.minutes} phút/ngày · ${p.profile.horizonMonths} tháng · ${goalNames[p.profile.goal]}`:'Chưa thiết lập mục tiêu.';el('platform-cloud-status').textContent=cloudMessage();}
 function refresh(){applySettings();renderDashboard();renderSettings();el('account-onboarding-prompt').hidden=!!getProgress().platform.profile;if(screen==='roadmap')renderRoadmap();if(screen==='lesson-outline')renderLessonOutline();}
 el('onboarding-form').addEventListener('submit',event=>{
  event.preventDefault();const form=new FormData(event.currentTarget),input=Object.fromEntries(form.entries());
  input.minutes=Number(input.minutes);input.horizonMonths=Number(input.horizonMonths);input.completedAt=localDate();
  const profile=engine.profile(input);
  if(!profile){el('profile-feedback').textContent='Em kiểm tra tên và chọn đủ các mục hợp lệ nhé.';return;}
  const saved=progressStore.updatePlatform(p=>{p.profile=profile;p.events.push({type:'onboarding_completed',date:localDate(),entityId:catalog.course.id});});
  if(!saved){el('profile-feedback').textContent='Chưa lưu được mục tiêu. Hãy cho phép lưu dữ liệu trang hoặc chờ tab học hiện tại đóng; chưa chuyển màn.';return;}
  route('roadmap');
 });
 el('show-romanization').addEventListener('change',()=>{
  const value=el('show-romanization').checked;
  const saved=progressStore.updatePlatform(p=>{p.settings.showRomanization=value;p.events.push({type:'settings_updated',date:localDate(),entityId:'romanization'});});applySettings();
  el('settings-feedback').textContent=saved?'Đã lưu cài đặt trên máy; tài khoản sẽ đồng bộ khi có mạng.':'Chưa lưu được cài đặt. Em kiểm tra quyền lưu dữ liệu trang nhé.';
 });
 document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>route(b.dataset.route)));
 // Hash router hoạt động trên file:// và hosting tĩnh; không giữ OAuth token trong đường dẫn.
 function restoreRoute(){const hash=location.hash;if(!hash.startsWith('#/'))return;const name=hash.slice(2);restoring=true;route(routes.has(name)?name:'home');restoring=false;}
 window.addEventListener('hashchange',restoreRoute);
 window.addEventListener('screen-changed',event=>{
  const name=event.detail.screen;
  if(!restoring&&!location.hash.includes('access_token')&&location.hash!=='#/'+name){
   if(location.hash.startsWith('#/'))history.pushState(null,'','#/'+name);else history.replaceState(null,'','#/'+name);
  }
  document.querySelectorAll('[data-route]').forEach(b=>{if(b.dataset.route===name)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  if(name==='onboarding')fillProfile();if(name==='roadmap')renderRoadmap();if(name==='lesson-outline')renderLessonOutline();if(name==='home')renderDashboard();if(name==='settings')renderSettings();
 });
 window.addEventListener('progress-saved',refresh);window.addEventListener('progress-loaded',refresh);window.addEventListener('account-state-changed',renderSettings);
 // Thời gian thực tế, chỉ khi tab học hoạt động và người học vừa tương tác.
 let previous=performance.now(),lastInteraction=performance.now(),scope=progressStore.key();
 function learningScreen(){return ['alphabet','syllables','vocabulary','practice','lesson-outline','lesson'].includes(screen)||(screen==='home'&&!el('daily-study').hidden);}
 function recordTime(){
  const now=performance.now(),delta=Math.floor((now-previous)/1000);previous=now;
  if(scope!==progressStore.key()){scope=progressStore.key();lastInteraction=now;return;}
  if(document.hidden||!learningScreen()||now-lastInteraction>60000||delta<=0||delta>20||!window.tabAccess?.writable())return;
  progressStore.updatePlatform(p=>{const date=localDate();p.activity[date]=Math.min(86400,(p.activity[date]||0)+delta);if(screen==='lesson'&&p.learning.session&&!p.learning.session.finished)p.learning.session.seconds=Math.min(86400,p.learning.session.seconds+delta);});
 }
 for(const type of ['pointerdown','keydown'])document.addEventListener(type,()=>{lastInteraction=performance.now();},{passive:true});
 window.addEventListener('screen-changed',()=>{previous=performance.now();});
 window.addEventListener('progress-scope-changed',()=>{scope=progressStore.key();previous=performance.now();lastInteraction=previous;});
 document.addEventListener('visibilitychange',()=>{previous=performance.now();});
 setInterval(recordTime,15000);
 window.platformCatalog=catalog; // Dùng cùng model cho kiểm thử và bộ xuất nội dung.
 refresh();restoreRoute();
 // Web Locks có thể tải lại tiến độ ngay sau startup; khôi phục hash chỉ một lần sau đó.
 const initialHash=location.hash;
 window.addEventListener('tab-writable',()=>{if(initialHash.startsWith('#/')){const name=routes.has(initialHash.slice(2))?initialHash.slice(2):'home';history.replaceState(null,'','#/'+name);restoring=true;route(name);restoring=false;}},{once:true});
})();
