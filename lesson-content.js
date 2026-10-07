'use strict';
// Nội dung tự biên soạn, draft: chưa thẩm định giáo viên. Không chứng nhận TOPIK.
// Đối chiếu: https://www.korean.go.kr/eng_hangeul/principle/001.html
// https://www.korean.go.kr/front_eng/roman/roman_01.do
// https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=282616
window.LESSON_CONTENT = (() => {
 const units=[],lessons=[];
 const grammar=[
  {id:'b2-copula',pattern:'이에요 / 예요',title:'Nói “là…”',meaning:'Gắn vào danh từ để giới thiệu.',usage:'Dùng trong hội thoại lịch sự thông thường.',structure:'Danh từ có batchim + 이에요; không có batchim + 예요.',examples:[{ko:'저는 학생이에요.',vi:'Tôi là học sinh.'},{ko:'저는 민수예요.',vi:'Tôi là Minsu.'}],notes:['예요 là dạng rút gọn sau danh từ không có phụ âm cuối.'],commonMistakes:['학생 có batchim ㅇ: 학생이에요, không dùng 학생예요.']},
  {id:'b2-topic',pattern:'은 / 는',title:'Nêu chủ đề đang nói',meaning:'“Về … thì …”',usage:'Giới thiệu chủ đề hoặc nêu tương phản; không đồng nghĩa hoàn toàn với 이/가.',structure:'Danh từ có batchim + 은; không có batchim + 는.',examples:[{ko:'저는 학생이에요.',vi:'Tôi là học sinh.'},{ko:'이름은 민수예요.',vi:'Tên là Minsu.'}],notes:['저 + 는 → 저는. 은/는 không phải lúc nào cũng dịch thành một từ riêng.'],commonMistakes:['저 không có batchim, dùng 저는, không dùng 저은.']},
  {id:'b2-daily',pattern:'있어요 / 없어요 · -아요 / -어요',title:'Câu ngắn trong ngày',meaning:'Có / không có; diễn tả hoạt động.',usage:'Các mẫu lịch sự thông dụng. Chủ ngữ có thể được lược khi ngữ cảnh rõ.',structure:'Danh từ + 이/가 있어요/없어요. Tân ngữ + 을/를 + động từ.',examples:[{ko:'물이 있어요.',vi:'Có nước.'},{ko:'밥을 먹어요.',vi:'Ăn cơm.'},{ko:'학교에 가요.',vi:'Đi đến trường.'}],notes:['가다 → 가요; 먹다 → 먹어요; 하다 → 해요. Đây là ba dạng mẫu, chưa phải toàn bộ quy tắc chia.'],commonMistakes:['밥 có batchim nên dùng 밥을, không dùng 밥를.']}
 ];
 function unit(id,title,levelId='hangul'){const u={id,title,levelId,order:units.length};units.push(u);return u;}
 function choice(type,prompt,choices,correctAnswer,explanation,extra={}){return {type,prompt,instruction:'Chọn một đáp án.',choices,correctAnswer,explanation,...extra};}
 function make(u,id,title,cards,exercises,extra={}){
  const qs=exercises.map((e,i)=>({...e,id:id+'-e'+(i+1)+(extra.revision?'-r'+extra.revision:'')}));
  const l={id,unitId:u.id,order:lessons.length,title,description:extra.description||'Học chậm, thử nhớ rồi tự kiểm tra một bước nhỏ.',objectives:extra.objectives||['Nhận diện các chữ/mẫu trong bài.','Đọc ví dụ và vận dụng trong bài tập.'],estimatedMinutes:10,type:extra.type||'lesson',contentStatus:'draft',vocabularyIds:extra.vocabularyIds||[],grammarIds:extra.grammarIds||[],prerequisites:lessons.length?[lessons.at(-1).id]:[],completionRules:{quizThreshold:70,requireAllSections:true,requireAllExercises:true},sections:[
   {id:'intro',type:'INTRO',title:'Một mục tiêu nhỏ'},
   {id:'teach',type:'TEACH',title:'Cùng làm quen',cards},
   ...(extra.vocabularyIds?.length?[{id:'vocab',type:'VOCABULARY',title:'Từ em gặp trong bài'}]:[]),
   ...(extra.grammarIds?.length?[{id:'grammar',type:'GRAMMAR',title:'Hiểu mẫu câu'}]:[]),
   {id:'guided',type:'EXERCISE',title:'Luyện có hướng dẫn',exercises:qs.slice(0,2)},
   {id:'independent',type:'EXERCISE',title:'Em tự thử nhé',exercises:qs.slice(2,4)},
   {id:'quiz',type:'QUIZ',title:'Tự kiểm tra cuối bài',exercises:qs.slice(4)},
   {id:'summary',type:'SUMMARY',title:'Gói lại điều vừa học'}
  ]};
  for(const key of ['referenceTheme','memoryCue','recallPrompt','recallAnswer','dialogue'])if(extra[key]!==undefined)l[key]=extra[key];
  if(extra.estimatedMinutes)l.estimatedMinutes=extra.estimatedMinutes;
  lessons.push(l);return l;
 }
 function charLesson(u,id,title,pairs,note){
  // [chữ, âm tiết mẫu, dấu hiệu hình dạng]; không dùng phiên âm làm đáp án chính.
  const [a,b]=pairs;
  const cards=pairs.map(([ko,audio,vi])=>({ko,audio,vi,letterId:'letter:'+ko}));
  cards.push({vi:note||'Nghe âm tiết mẫu; ㅇ ở đầu âm tiết nguyên âm không phát âm. Tập nhận diện hình chữ trước khi nhập bằng bàn phím Hàn.'});
  const choices=pairs.map(p=>p[0]);
  const ex=[
   choice('CHARACTER_CHOICE',a[2],choices,a[0],a[2]),
   {type:'MATCH',prompt:'Ghép chữ với âm tiết mẫu đã học.',pairs:pairs.slice(0,3).map(p=>({left:p[0],right:p[1]})),explanation:'Nghe từng mẫu ở phần dạy rồi quan sát chữ bên trong khối âm tiết.'},
   {type:'TYPING',prompt:'Nhập lại chữ '+b[0],correctAnswer:b[0],explanation:b[2]},
   choice('AUDIO_CHOICE','Nghe âm tiết mẫu rồi chọn chữ đang học.',choices,a[0],a[2],{audio:a[1],fallbackPrompt:'Chế độ đọc: âm tiết '+a[1]+' chứa chữ nào trong bài?'}),
   ...pairs.map(p=>choice('CHARACTER_CHOICE',p[2],choices,p[0],p[2])),
   {type:'TYPING',prompt:b[2]+' Nhập chữ tương ứng.',correctAnswer:b[0],explanation:b[2]}
  ];return make(u,id,title,cards,ex,{objectives:['Nhận diện '+choices.join(', ')+'.','Nghe âm tiết mẫu và đọc chữ trong khối âm tiết.','Nhập chữ bằng bàn phím tiếng Hàn.']});
 }
 function checkpoint(u,title){
  const source=lessons.filter(l=>l.unitId===u.id);
  const pool=source.flatMap(l=>l.sections.find(s=>s.type==='QUIZ').exercises);
  const practice=source[0].sections.filter(s=>s.type==='EXERCISE').flatMap(s=>s.exercises);
  const selected=[...practice.slice(0,4),...pool];
  const l=make(u,u.id+'-check',title,[{vi:'Checkpoint ôn nội dung đã dạy trong unit. Quiz cần đạt ít nhất 70%. Nếu chưa đạt, xem lời giải rồi ôn lại.'}],selected,{type:'checkpoint',revision:u.id.startsWith('b2-')?2:undefined,objectives:['Tự kiểm tra các nội dung đã học trong unit.'],vocabularyIds:[...new Set(source.flatMap(l=>l.vocabularyIds))],grammarIds:[...new Set(source.flatMap(l=>l.grammarIds))]});
  u.checkpointId=l.id;u.lessonIds=lessons.filter(l=>l.unitId===u.id).map(l=>l.id);
 }
 let u=unit('h2-vowels','1 · Sáu nguyên âm đầu tiên');
 charLesson(u,'h2-a-eo','ㅏ và ㅓ',[['ㅏ','아','Nét dọc có nét ngắn hướng sang phải.'],['ㅓ','어','Nét dọc có nét ngắn hướng sang trái.']]);
 charLesson(u,'h2-o-u','ㅗ và ㅜ',[['ㅗ','오','Nét ngang có nét ngắn hướng lên.'],['ㅜ','우','Nét ngang có nét ngắn hướng xuống.']]);
 charLesson(u,'h2-eu-i','ㅡ và ㅣ',[['ㅡ','으','Một nét ngang.'],['ㅣ','이','Một nét dọc.']]);checkpoint(u,'Checkpoint · Nguyên âm cơ bản');
 u=unit('h2-consonants','2 · Phụ âm cơ bản');
 charLesson(u,'h2-g-n-d-r','ㄱ ㄴ ㄷ ㄹ',[['ㄱ','가','Chữ có dạng góc trên, mở về phía dưới bên trái.'],['ㄴ','나','Chữ có dạng góc dưới, mở về phía trên bên phải.'],['ㄷ','다','Chữ như khung vuông thiếu cạnh phải.'],['ㄹ','라','Chữ có nét gấp khúc nhiều tầng.']],'Nghe phụ âm trong âm tiết với ㅏ; âm ㄹ thay đổi theo vị trí, không đồng nhất với r tiếng Việt.');
 charLesson(u,'h2-m-b-s-ng','ㅁ ㅂ ㅅ ㅇ',[['ㅁ','마','Chữ là một khung vuông kín.'],['ㅂ','바','Khung kín có hai nét dọc nhô lên.'],['ㅅ','사','Hai nét xiên tạo hình mái.'],['ㅇ','아','Chữ hình tròn; ở đầu âm tiết không phát âm.']]);
 charLesson(u,'h2-j-ch-h','ㅈ ㅊ ㅎ',[['ㅈ','자','Hình mái có nét ngang ở trên.'],['ㅊ','차','Giống ㅈ nhưng thêm nét ngắn trên cùng.'],['ㅎ','하','Hình tròn với các nét phía trên.']]);
 charLesson(u,'h2-k-t-p','ㅋ ㅌ ㅍ',[['ㅋ','카','Giống ㄱ, thêm nét ngang bên trong.'],['ㅌ','타','Giống ㄷ, thêm nét ngang bên trong.'],['ㅍ','파','Hai nét ngang ngoài và hai nét dọc bên trong.']],'ㅋ ㅌ ㅍ là các phụ âm bật hơi. Nghe mẫu và chú ý luồng hơi; không đọc ㅍ thành f.');checkpoint(u,'Checkpoint · Phụ âm');
 u=unit('h2-blocks','3 · Ghép khối âm tiết');
 make(u,'h2-build','Từ chữ rời đến 가 나 다 마',[{ko:'ㄱ + ㅏ → 가',audio:'가',vi:'Phụ âm đầu ở trái, nguyên âm dọc ở phải.'},{ko:'ㄴ + ㅏ → 나 · ㄷ + ㅏ → 다 · ㅁ + ㅏ → 마',audio:'나 다 마',vi:'Mỗi khối là một âm tiết.'},{ko:'ㅁ + ㅗ → 모',audio:'모',vi:'Nguyên âm ngang nằm dưới phụ âm đầu.'}], [
  choice('MULTIPLE_CHOICE','Khối 가 gồm những chữ nào?',['ㄱ + ㅏ','ㄴ + ㅏ'],'ㄱ + ㅏ','ㄱ bên trái, ㅏ bên phải.'),
  {type:'MATCH',prompt:'Ghép các phần với khối chữ.',pairs:[{left:'ㄴ + ㅏ',right:'나'},{left:'ㄷ + ㅏ',right:'다'},{left:'ㅁ + ㅏ',right:'마'}],explanation:'Đọc từng khối như một âm tiết.'},
  {type:'ORDER',prompt:'Xếp các phần để mô tả 가: phụ âm đầu trước, nguyên âm sau.',tokens:['ㅏ','ㄱ'],correctAnswer:[1,0],explanation:'ㄱ + ㅏ tạo thành 가.'},
  {type:'TYPING',prompt:'Gõ khối tạo bởi ㅁ + ㅏ.',correctAnswer:'마',explanation:'ㅁ và ㅏ ghép thành 마.'},
  choice('CHARACTER_CHOICE','Chọn khối ㄴ + ㅏ.',['가','나','다','마'],'나','ㄴ + ㅏ → 나.'),
  choice('AUDIO_CHOICE','Nghe rồi chọn khối.',['가','나','다','마'],'다','Âm tiết 다 gồm ㄷ + ㅏ.',{audio:'다',fallbackPrompt:'Chế độ đọc: chọn khối ㄷ + ㅏ.'}),
  {type:'TYPING',prompt:'Gõ khối ㅁ + ㅗ.',correctAnswer:'모',explanation:'ㅗ nằm dưới ㅁ.'}
 ]);checkpoint(u,'Checkpoint · Ghép âm');
 u=unit('h2-added','4 · Nguyên âm mở rộng');
 charLesson(u,'h2-y-vowels','ㅑ ㅕ ㅛ ㅠ',[['ㅑ','야','Giống ㅏ nhưng có hai nét ngắn bên phải.'],['ㅕ','여','Giống ㅓ nhưng có hai nét ngắn bên trái.'],['ㅛ','요','Giống ㅗ nhưng có hai nét ngắn hướng lên.'],['ㅠ','유','Giống ㅜ nhưng có hai nét ngắn hướng xuống.']]);
 charLesson(u,'h2-ae-e','ㅐ ㅔ ㅒ ㅖ',[['ㅐ','애','ㅏ thêm một nét dọc ở phải.'],['ㅔ','에','ㅓ thêm một nét dọc ở phải.'],['ㅒ','얘','ㅑ thêm một nét dọc ở phải.'],['ㅖ','예','ㅕ thêm một nét dọc ở phải.']],'ㅐ/ㅔ và ㅒ/ㅖ có thể nghe rất gần nhau. Bài này phân biệt cách viết; không dùng khác biệt âm nhỏ làm tiêu chí nghe.');
 // Không đánh đố các cặp nguyên âm thường hòa âm trong tiếng Hàn hiện đại.
 lessons.at(-1).sections.forEach(s=>(s.exercises||[]).forEach(e=>{if(e.type==='AUDIO_CHOICE'){e.type='CHARACTER_CHOICE';e.prompt='Chọn chữ được tạo bởi ㅏ và một nét dọc ở phải.';delete e.audio;}}));checkpoint(u,'Checkpoint · Nguyên âm mở rộng');
 u=unit('h2-compound','5 · Chữ ghép và phụ âm căng');
 charLesson(u,'h2-wa-wo','ㅘ ㅝ ㅟ ㅢ',[['ㅘ','와','ㅗ + ㅏ tạo thành chữ nào?'],['ㅝ','워','ㅜ + ㅓ tạo thành chữ nào?'],['ㅟ','위','ㅜ + ㅣ tạo thành chữ nào?'],['ㅢ','의','ㅡ + ㅣ tạo thành chữ nào?']],'ㅢ có cách đọc thay đổi theo vị trí/ngữ pháp; ở đây nghe mẫu 의 đứng riêng.');
 charLesson(u,'h2-we','ㅙ ㅚ ㅞ',[['ㅙ','왜','ㅗ + ㅐ tạo thành chữ nào?'],['ㅚ','외','ㅗ + ㅣ tạo thành chữ nào?'],['ㅞ','웨','ㅜ + ㅔ tạo thành chữ nào?']],'Ba chữ có thể nghe rất giống nhau. Bài này kiểm tra cấu tạo chữ.');
 lessons.at(-1).sections.forEach(s=>(s.exercises||[]).forEach(e=>{if(e.type==='AUDIO_CHOICE'){e.type='CHARACTER_CHOICE';e.prompt='Chọn chữ được tạo bởi ㅗ + ㅐ.';delete e.audio;}}));
 charLesson(u,'h2-tense','ㄲ ㄸ ㅃ ㅆ ㅉ',[['ㄲ','까','Hai ㄱ viết cạnh nhau.'],['ㄸ','따','Hai ㄷ viết cạnh nhau.'],['ㅃ','빠','Hai ㅂ viết cạnh nhau.'],['ㅆ','싸','Hai ㅅ viết cạnh nhau.'],['ㅉ','짜','Hai ㅈ viết cạnh nhau.']],'Phụ âm căng không phải kéo dài hai âm. Nghe từng âm tiết mẫu, tránh thêm hơi mạnh như ㅋ/ㅌ/ㅍ.');checkpoint(u,'Checkpoint · Chữ ghép');
 u=unit('h2-final','6 · Batchim cơ bản');
 make(u,'h2-batchim','Phụ âm cuối ở dưới khối',[{ko:'한 · 물 · 밥',audio:'한 물 밥',vi:'ㄴ, ㄹ, ㅂ nằm dưới khối: đó là 받침 (batchim). Không thêm một nguyên âm sau phụ âm cuối.'},{ko:'ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅇ',audio:'국 산 옷 달 밤 밥 강',vi:'Bảy âm cuối cơ bản; ví dụ 옷 kết thúc bằng âm cuối như ㄷ. Bài này chưa dạy toàn bộ batchim kép.'}], [
 choice('MULTIPLE_CHOICE','Batchim nằm ở đâu?',['Dưới khối âm tiết','Luôn bên phải khối'],'Dưới khối âm tiết','Phụ âm cuối đứng dưới phần phụ âm đầu và nguyên âm.'),
 {type:'MATCH',prompt:'Ghép từ với batchim.',pairs:[{left:'물',right:'ㄹ'},{left:'밥',right:'ㅂ'},{left:'한',right:'ㄴ'}],explanation:'Quan sát chữ dưới cùng của mỗi khối.'},
 {type:'ORDER',prompt:'Xếp các phần của 한 theo thứ tự đầu → nguyên âm → cuối.',tokens:['ㄴ','ㅎ','ㅏ'],correctAnswer:[1,2,0],explanation:'ㅎ + ㅏ + ㄴ → 한.'},
 {type:'TYPING',prompt:'Gõ ㅂ + ㅏ + ㅂ thành khối.',correctAnswer:'밥',explanation:'밥 có batchim ㅂ.'},
 choice('CHARACTER_CHOICE','Batchim của 물 là gì?',['ㅁ','ㅜ','ㄹ'],'ㄹ','ㄹ nằm ở dưới.'),choice('MULTIPLE_CHOICE','Âm cuối của 옷 khi đọc đứng riêng thuộc nhóm nào?',['ㄷ','ㅅ bật thành một âm tiết mới'],'ㄷ','ㅅ ở cuối 옷 được đọc như âm cuối ㄷ, không thêm nguyên âm.'),
 {type:'TYPING',prompt:'Gõ khối ㅎ + ㅏ + ㄴ.',correctAnswer:'한',explanation:'Ghép thành 한.'}
 ],{vocabularyIds:['word:물','word:밥']});checkpoint(u,'Checkpoint · Batchim');
 u=unit('h2-sounds','7 · Quy tắc âm đầu tiên');
 make(u,'h2-link','Nối âm và mũi hóa',[{ko:'밥을 → [바블]',audio:'밥을',vi:'Khi trợ từ bắt đầu bằng nguyên âm, phụ âm cuối đơn có thể nối sang âm tiết sau. Giữ nguyên cách viết 밥을.'},{ko:'한국말 → [한궁말]',audio:'한국말',vi:'ㄱ trước ㅁ đổi sang âm ㅇ khi đọc. Đây là mũi hóa; chữ viết không đổi.'}], [
 choice('SENTENCE_CHOICE','밥을 thường được đọc gần cách ghi âm nào?',['바블','바을'],'바블','ㅂ nối sang âm tiết 을.'),
 {type:'MATCH',prompt:'Ghép chữ viết với cách ghi âm đọc.',pairs:[{left:'밥을',right:'바블'},{left:'한국말',right:'한궁말'}],explanation:'Ngoặc vuông mô tả phát âm, không thay chính tả.'},
 {type:'TYPING',prompt:'Gõ đúng chính tả của từ đọc [한궁말].',correctAnswer:'한국말',explanation:'Giữ chữ ㄱ trong 한국말.'},
 choice('MULTIPLE_CHOICE','Mũi hóa làm thay đổi gì?',['Âm đọc trong ngữ cảnh','Luôn thay chữ viết'],'Âm đọc trong ngữ cảnh','Viết 한국말, đọc [한궁말].'),
 choice('SENTENCE_CHOICE','Chọn cách ghi phát âm của 한국말.',['한궁말','한국마'],'한궁말','ㄱ trước ㅁ chuyển sang âm ㅇ.'),
 {type:'TYPING',prompt:'Gõ chính tả của cụm đọc [바블].',correctAnswer:'밥을',explanation:'Phụ âm ㅂ vẫn viết trong 밥.'},
 choice('MULTIPLE_CHOICE','Khi nối âm 밥을, chữ nào chuyển vị trí phát âm?',['ㅂ','ㅏ'],'ㅂ','Phụ âm cuối ㅂ nối sang âm tiết nguyên âm sau.')
 ]);checkpoint(u,'Checkpoint · Quy tắc âm');
 u=unit('h2-reading','8 · Đọc từ ngắn');
 make(u,'h2-read','Đọc 물 밥 나무',[{ko:'물 · 밥 · 나무',audio:'물 밥 나무',vi:'Tách theo khối: 물 có một âm tiết; 나무 có hai âm tiết 나 + 무.'}], [
 choice('WORD_MEANING','물 nghĩa là gì?',['Nước','Cơm'],'Nước','물 là nước.'),{type:'MATCH',prompt:'Ghép chữ và nghĩa.',pairs:[{left:'물',right:'Nước'},{left:'밥',right:'Cơm'},{left:'나무',right:'Cây'}],explanation:'Đọc từng khối rồi nhớ nghĩa.'},
 {type:'ORDER',prompt:'Xếp hai khối thành từ “cây”.',tokens:['무','나'],correctAnswer:[1,0],explanation:'나 + 무 → 나무.'},
 choice('AUDIO_CHOICE','Nghe rồi chọn từ.',['물','밥','나무'],'나무','나무 gồm hai âm tiết.',{audio:'나무',fallbackPrompt:'Chế độ đọc: chọn từ gồm 나 + 무.'}),
 choice('WORD_MEANING','밥 nghĩa là gì?',['Cơm','Nước'],'Cơm','밥 là cơm, cũng dùng để chỉ bữa ăn tùy ngữ cảnh.'),{type:'TYPING',prompt:'Gõ từ “nước”.',correctAnswer:'물',explanation:'물: ㅁ + ㅜ + ㄹ.'},choice('MULTIPLE_CHOICE','나무 có mấy âm tiết?',['Một','Hai'],'Hai','Có hai khối 나 và 무.')
 ],{vocabularyIds:['word:물','word:밥','word:나무']});checkpoint(u,'Checkpoint · Đọc từ');
 u=unit('h2-assessment','9 · Tổng kiểm tra Hangul');
 const characterGroups=[
  ['ㅏ','ㅓ','ㅗ','ㅜ','ㅡ','ㅣ'],['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅎ','ㅋ','ㅌ','ㅍ'],
  ['ㅑ','ㅕ','ㅛ','ㅠ'],['ㅐ','ㅔ','ㅒ','ㅖ'],['ㅘ','ㅝ','ㅟ','ㅢ'],['ㅙ','ㅚ','ㅞ'],['ㄲ','ㄸ','ㅃ','ㅆ','ㅉ']
 ];
 const taughtCards=lessons.flatMap(l=>l.sections.find(s=>s.type==='TEACH').cards||[]).filter(c=>c.letterId);
 const recognition=characterGroups.map((group,i)=>({type:'MATCH',prompt:'Ghép chữ với âm tiết mẫu · nhóm '+(i+1),letterIds:group.map(x=>'letter:'+x),pairs:group.map(x=>({left:x,right:taughtCards.find(c=>c.ko===x).audio})),explanation:'Quan sát chữ trong khối âm tiết mẫu; có thể nghe lại ở bài đã học.'}));
 const previous=id=>lessons.find(l=>l.id===id).sections.flatMap(s=>s.exercises||[]);
 const guided=previous('h2-build').slice(0,4);
 const applied=[previous('h2-build')[4],previous('h2-build')[5],previous('h2-build')[6],previous('h2-batchim')[4],previous('h2-batchim')[5],previous('h2-link')[4],previous('h2-read')[4]];
 make(u,'h2-assessment-check','Checkpoint · Hangul nền tảng',[{vi:'Ôn 40 chữ qua khối âm tiết mẫu, ghép khối, batchim và cách đọc đã học. Kết quả này không chứng nhận phát âm hoặc trình độ TOPIK.'}], [...guided,...recognition,...applied],{type:'checkpoint',revision:2,objectives:['Nhận diện 40 chữ trong âm tiết mẫu.','Vận dụng ghép khối, batchim và quy tắc đọc đã học.']});u.checkpointId='h2-assessment-check';u.lessonIds=['h2-assessment-check'];
 const beginner=[
  ['greetings','Chào hỏi',['안녕하세요','감사합니다','죄송합니다','네','아니요'],[],
   [{ko:'안녕하세요. 감사합니다.',audio:'안녕하세요. 감사합니다.',vi:'Chào lịch sự và cảm ơn.'},{ko:'죄송합니다. 네. 아니요.',audio:'죄송합니다. 네. 아니요.',vi:'Xin lỗi trang trọng; vâng; không. Không dùng 아니요 thay cho mọi cấu trúc phủ định.'}],
   ['안녕하세요','Xin chào','Cảm ơn','감사합니다','Cảm ơn','Xin lỗi']],
  ['identity','Giới thiệu bản thân',['저','이름','사람','학생'],['b2-copula','b2-topic'],
   [{ko:'저는 학생이에요.',audio:'저는 학생이에요.',vi:'Tôi là học sinh. 저 là cách xưng tôi khiêm nhường; 저는 = 저 + 는.'},{ko:'저는 민수예요.',audio:'저는 민수예요.',vi:'Tôi là Minsu. Sau tên không có batchim, dùng 예요.'}],
   ['학생','Học sinh','Tên','이름','Tên','Người']],
  ['countries','Đất nước và quốc tịch',['한국','베트남','미국','중국','일본'],['b2-copula','b2-topic'],
   [{ko:'저는 베트남 사람이에요.',audio:'저는 베트남 사람이에요.',vi:'Tôi là người Việt Nam. Tên nước + 사람 diễn tả người nước đó.'}],
   ['한국','Hàn Quốc','Việt Nam','베트남','Việt Nam','Nhật Bản']],
  ['daily','Những câu trong ngày',['있어요','없어요','가요','먹어요','해요','물','밥'],['b2-daily'],
   [{ko:'물이 있어요. 밥을 먹어요.',audio:'물이 있어요. 밥을 먹어요.',vi:'Có nước. Ăn cơm.'},{ko:'물이 없어요. 학교에 가요. 공부해요.',audio:'물이 없어요. 학교에 가요. 공부해요.',vi:'Không có nước. Đi đến trường. Học bài. 해요 là dạng lịch sự của 하다.'}],
   ['먹어요','Ăn','Đi','가요','Đi','Làm']]
 ];
 for(const [key,title,vocab,gids,cards,[ko,meaning,wrong,ko2,meaning2,wrong2]] of beginner){
  u=unit('b2-'+key,title,'basics');
  const grammarExercise=key==='countries'?{type:'FILL_BLANK',prompt:'저는 베트남 사람___. Điền đuôi “là”.',correctAnswer:'이에요',explanation:'사람 có batchim ㅁ nên dùng 이에요.'}:key==='identity'?{type:'FILL_BLANK',prompt:'저는 학생___. Điền đuôi “là”.',correctAnswer:'이에요',explanation:'학생 kết thúc bằng batchim ㅇ nên dùng 이에요.'}:{type:'TYPING',prompt:'Gõ từ/cụm từ nghĩa là “'+meaning2+'”.',correctAnswer:ko2,explanation:ko2+' nghĩa là '+meaning2+'.'};
  const quizFill=key==='countries'?{type:'FILL_BLANK',prompt:'저는 한국 사람___. Hoàn thành câu “Tôi là người Hàn Quốc”.',correctAnswer:'이에요',explanation:'한국 사람 + 이에요 vì 사람 có batchim.'}:key==='identity'?{type:'FILL_BLANK',prompt:'저는 민수___. Điền đuôi “là” sau tên Minsu.',correctAnswer:'예요',explanation:'민수 không có batchim nên dùng 예요.'}:key==='daily'?{type:'TYPING',prompt:'Viết từ đã học nghĩa là “không có”.',correctAnswer:'없어요',explanation:'없어요 dùng để nói không có.'}:{type:'TYPING',prompt:'Viết lời xin lỗi trang trọng đã học.',correctAnswer:'죄송합니다',explanation:'죄송합니다 là lời xin lỗi trang trọng.'};
  make(u,'b2-'+key+'-lesson',title,cards,[
   choice('WORD_MEANING',ko+' nghĩa là gì?',[meaning,wrong],meaning,ko+' nghĩa là '+meaning+'.'),
   {type:'MATCH',prompt:'Ghép từ với nghĩa.',pairs:[{left:ko,right:meaning},{left:ko2,right:meaning2}],explanation:'Đọc và nghe lại từ trong phần từ vựng.'},
   grammarExercise,
   choice('AUDIO_CHOICE','Nghe rồi chọn từ/cụm từ.',[ko,ko2],ko2,ko2+' nghĩa là '+meaning2+'.',{audio:ko2,fallbackPrompt:'Chế độ đọc: chọn từ nghĩa là “'+meaning2+'”.'}),
   choice('WORD_MEANING',ko2+' nghĩa là gì?',[meaning2,wrong2],meaning2,ko2+' nghĩa là '+meaning2+'.'),
   quizFill,
   key==='countries'?{type:'ORDER',prompt:'Xếp câu: Tôi là người Việt Nam.',tokens:['사람이에요.','저는','베트남'],correctAnswer:[1,2,0],explanation:'저는 + 베트남 사람 + 이에요.'}:key==='identity'?{type:'ORDER',prompt:'Xếp câu: Tôi là học sinh.',tokens:['학생이에요.','저는'],correctAnswer:[1,0],explanation:'저는 nêu chủ đề, 학생이에요 đứng sau.'}:choice('SENTENCE_CHOICE','Chọn nghĩa của '+ko+'.',[meaning,wrong],meaning,'Mẫu này dùng với nghĩa '+meaning+'.')
  ],{revision:2,vocabularyIds:vocab.map(x=>'word:'+x),grammarIds:gids,objectives:['Hiểu từ vựng trong tình huống '+title.toLowerCase()+'.','Dùng mẫu đã học trong câu ngắn.']});checkpoint(u,'Checkpoint · '+title);
 }
 // Chỉ tham chiếu các miền giao tiếp từ mục lục công khai; toàn bộ lời dạy,
 // hội thoại và bài tập bên dưới tự viết. Không phải bản dịch hay bản số hóa sách.
 const reference={title:'Sejong Korean 1A (2022)',url:'https://nuri.iksi.or.kr/front/cms/contents/layout2/learningsejong/detail.do?csCmsMastrSeq=15203&menuSn=649',checkedAt:'2026-10-06',scope:'Khung chủ đề nhập môn; không tái tạo nội dung sách hoặc chứng nhận hoàn thành Sejong.'};
 grammar.push(
  {id:'s1-question',pattern:'뭐예요?',title:'Hỏi “là gì?”',meaning:'Hỏi tên hoặc thông tin của một thứ.',usage:'Câu hỏi lịch sự thông thường.',structure:'Danh từ + 은/는 hoặc 이/가 + 뭐예요?',examples:[{ko:'이름이 뭐예요?',vi:'Tên là gì?'},{ko:'전화번호가 뭐예요?',vi:'Số điện thoại là gì?'}],notes:['뭐 là dạng nói ngắn của 무엇. 은/는 nêu chủ đề, 이/가 đánh dấu chủ ngữ; trong bài ghi nhớ từng câu mẫu.'],commonMistakes:['Viết 뭐예요, không viết 뭐에요.']},
  {id:'s1-place',pattern:'에 있어요 / 에 없어요',title:'Gắn một “ghim vị trí”',meaning:'Nói một vật ở hoặc không ở nơi nào.',usage:'Miêu tả vị trí đồ vật.',structure:'Vật + 이/가 + vị trí + 에 + 있어요/없어요.',examples:[{ko:'책이 책상 위에 있어요.',vi:'Sách ở trên bàn.'},{ko:'가방이 의자 아래에 있어요.',vi:'Túi ở dưới ghế.'}],notes:['이 dùng sau danh từ có batchim, 가 sau danh từ không có batchim. 책상 위: phía trên bàn.'],commonMistakes:['Nói 위치 + 에 있어요; không dùng 에서 cho vị trí tồn tại trong mẫu này.']},
  {id:'s1-action',pattern:'을/를 · -아요/어요',title:'Vật được làm gì?',meaning:'Gắn tân ngữ rồi kết thúc bằng hành động.',usage:'Câu sinh hoạt lịch sự ở hiện tại.',structure:'Danh từ có batchim + 을; không batchim + 를. Động từ đứng cuối câu.',examples:[{ko:'책을 읽어요.',vi:'Tôi đọc sách.'},{ko:'우유를 마셔요.',vi:'Tôi uống sữa.'}],notes:['Các dạng trong bài: 읽다 → 읽어요, 먹다 → 먹어요, 마시다 → 마셔요, 공부하다 → 공부해요.'],commonMistakes:['Không giữ 다 trong câu lịch sự: 먹다 → 먹어요. Không dùng 우유을.']},
  {id:'s1-shopping',pattern:'하고 · 사요',title:'Ghép hai món vào giỏ',meaning:'하고 nối hai danh từ với nghĩa “và”.',usage:'Nói mua các món đồ.',structure:'Danh từ 1 + 하고 + danh từ 2 + 을/를 + 사요.',examples:[{ko:'빵하고 우유를 사요.',vi:'Tôi mua bánh mì và sữa.'},{ko:'커피하고 빵을 사요.',vi:'Tôi mua cà phê và bánh mì.'}],notes:['하다 → 해요 là “làm”; 하고 ở đây là trợ từ nối danh từ, không phải đuôi chia của 하다.'],commonMistakes:['Trong bài này, 하고 nối đồ vật; không dùng nó để nối mọi loại câu.']},
  {id:'s1-counter',pattern:'한/두/세/네 개 주세요',title:'Đếm trước khi gọi món',meaning:'Xin một số lượng đồ vật.',usage:'Yêu cầu lịch sự khi mua đồ.',structure:'Tên đồ vật + số thuần Hàn + 개 + 주세요.',examples:[{ko:'빵 두 개 주세요.',vi:'Cho tôi hai cái bánh mì.'},{ko:'빵 세 개 주세요.',vi:'Cho tôi ba cái bánh mì.'}],notes:['하나/둘/셋/넷 đổi thành 한/두/세/네 trước đơn vị đếm. 개 là đơn vị thông dụng cho đồ vật; đồ uống thường dùng 잔 hoặc 병 theo vật chứa.'],commonMistakes:['Trong mẫu này nói 두 개, không nói 둘 개; không coi 개 là đơn vị dùng cho mọi thứ.']},
  {id:'s1-time',pattern:'시 · 분 · 에',title:'Hai hệ số trên một đồng hồ',meaning:'Nói giờ và thời điểm làm một việc.',usage:'Giờ dùng số thuần Hàn; phút dùng số Hán Hàn.',structure:'오전/오후 + giờ + 시 + phút + 분 + 에 + hành động.',examples:[{ko:'오후 두 시에 가요.',vi:'Tôi đi lúc hai giờ chiều.'},{ko:'세 시 오 분이에요.',vi:'Là ba giờ năm phút.'}],notes:['Ví dụ giờ: 한 시, 두 시, 세 시, 네 시. Phút: 일 분, 이 분, 오 분. 오전 là buổi sáng/trước trưa; 오후 là sau trưa.'],commonMistakes:['Hai giờ là 두 시 trong cách nói thường dùng của bài; hai phút là 이 분.']},
  {id:'s1-weather',pattern:'더워요 · 추워요 · 비가 와요',title:'Ba câu cho cửa sổ hôm nay',meaning:'Miêu tả nóng, lạnh và mưa.',usage:'Hỏi hoặc nói về thời tiết.',structure:'오늘은 + trạng thái; 비가 + 와요.',examples:[{ko:'오늘은 더워요.',vi:'Hôm nay trời nóng.'},{ko:'오늘은 추워요.',vi:'Hôm nay trời lạnh.'},{ko:'비가 와요.',vi:'Trời mưa.'}],notes:['덥다 → 더워요, 춥다 → 추워요 là hai mẫu biến đổi ㅂ cần nhớ. 오다 → 와요. Không phải mọi từ có ㅂ đều đổi giống vậy.'],commonMistakes:['Không viết 덥어요 hoặc 춥어요 cho hai từ này. 더워요 miêu tả thời tiết nóng; không dùng thay cho 뜨거워요 trong mọi ngữ cảnh.']},
  {id:'s1-past',pattern:'-았어요 / -었어요 / 했어요',title:'Đưa câu vào ngày hôm qua',meaning:'Kể một việc đã xảy ra.',usage:'Quá khứ lịch sự thông thường.',structure:'Thân từ kết hợp đuôi quá khứ; ghi nhớ các dạng mẫu trước.',examples:[{ko:'어제 공원에 갔어요.',vi:'Hôm qua tôi đã đi công viên.'},{ko:'책을 읽었어요.',vi:'Tôi đã đọc sách.'},{ko:'공원에서 산책했어요.',vi:'Tôi đã đi dạo ở công viên.'}],notes:['가다 → 갔어요; 읽다 → 읽었어요; 산책하다 → 산책했어요. 에 đánh dấu nơi đến; 에서 đánh dấu nơi thực hiện hành động.'],commonMistakes:['Nếu muốn kể quá khứ, dùng 갔어요; 가요 là mẫu hiện tại. Bài chỉ giới thiệu các dạng đã nêu, chưa bao phủ mọi bất quy tắc.']},
  {id:'s1-invite',pattern:'같이 -(으)ㄹ까요?',title:'Mở một lời rủ nhẹ nhàng',meaning:'Đề nghị cùng làm một việc.',usage:'Rủ người nghe và hỏi ý kiến trong ngữ cảnh “cùng nhau”.',structure:'같이 + thân động từ + ㄹ까요? nếu không batchim; 을까요? nếu có batchim (trừ ㄹ).',examples:[{ko:'같이 공원에 갈까요?',vi:'Mình cùng đi công viên nhé?'},{ko:'같이 빵을 먹을까요?',vi:'Mình cùng ăn bánh mì nhé?'}],notes:['가다 → 갈까요?, 먹다 → 먹을까요?, 마시다 → 마실까요?. Thân từ có ㄹ chỉ thêm 까요. 좋다 → 좋아요 dùng để đồng ý.'],commonMistakes:['Không thêm nguyên đuôi vào 가다: bỏ 다 trước. Mẫu -(으)ㄹ까요? còn có nghĩa khác theo ngữ cảnh; bài này chỉ học cách rủ cùng làm.']}
 );
 const scenarios=[
  {
   key:'hello',title:'Một lời chào, một người bạn mới',referenceTheme:'Giới thiệu bản thân',
   objective:'Chào và giới thiệu tên hoặc vai trò bằng một câu lịch sự.',vocab:['안녕하세요','이름','학생','베트남','사람'],gids:['b2-copula','b2-topic'],
   memory:'Hình dung hai thẻ tên: 학생 có phụ âm cuối → 이에요; 유나 không có phụ âm cuối → 예요.',
   recall:'Tự nói: “Tôi là học sinh”.',answer:'저는 학생이에요.',
   cards:[{ko:'안녕하세요.',vi:'Một lời chào lịch sự dùng khi gặp người khác.'},{ko:'저는 유나예요. / 저는 학생이에요.',vi:'Tôi là Yuna. / Tôi là học sinh. 저는 nêu chủ đề “tôi”. Tên 유나 là tên minh họa.'},{ko:'저는 베트남 사람이에요.',vi:'Tôi là người Việt Nam. 베트남 + 사람: người Việt Nam.'}],
   dialogue:[{ko:'안녕하세요. 저는 유나예요.',vi:'Xin chào. Tôi là Yuna.'},{ko:'안녕하세요. 저는 민수예요.',vi:'Xin chào. Tôi là Minsu.'},{ko:'저는 학생이에요.',vi:'Tôi là học sinh.'}],
   pairs:[{left:'이름',right:'Tên'},{left:'학생',right:'Học sinh'},{left:'베트남',right:'Việt Nam'}],
   fill:{prompt:'저는 학생___. Điền đuôi giới thiệu.',correctAnswer:'이에요',explanation:'학생 có batchim ㅇ → 이에요.'},
   listen:{audio:'저는 유나예요.',choices:['Tôi là Yuna.','Tôi là học sinh.'],correctAnswer:'Tôi là Yuna.',explanation:'유나 là tên minh họa; 예요 nối sau tên không có batchim.',fallbackPrompt:'Đọc 저는 유나예요. rồi chọn nghĩa.'},
   quiz:{prompt:'Chọn câu đúng khi giới thiệu tên 유나.',choices:['저는 유나예요.','저는 유나이에요.'],correctAnswer:'저는 유나예요.',explanation:'유나 kết thúc bằng nguyên âm → 예요.'},
   order:{prompt:'Xếp câu “Tôi là người Việt Nam”.',tokens:['사람이에요.','저는','베트남'],correctAnswer:[1,2,0],explanation:'저는 + 베트남 사람 + 이에요.'}
  },
  {
   key:'digits',title:'Đọc ba số trong một tin nhắn',referenceTheme:'Thông tin liên lạc',
   objective:'Đọc từng chữ số và hỏi số điện thoại.',vocab:['전화번호','공','영','일','이','삼','사','오'],gids:['s1-question'],
   memory:'Số điện thoại giống chuỗi hạt: đọc từng hạt một. 0 có thể đọc 공; đừng ghép 12 thành “mười hai” khi đang đọc từng chữ số.',
   recall:'Viết cách đọc từng chữ số 012 bằng công thức vừa học.',answer:'공 일 이',
   cards:[{ko:'전화번호가 뭐예요?',vi:'Số điện thoại là gì? 전화번호: số điện thoại; 뭐예요?: là gì?'},{ko:'0 공/영 · 1 일 · 2 이 · 3 삼 · 4 사 · 5 오 · 6 육 · 7 칠 · 8 팔 · 9 구',vi:'Bảng chữ số Hán Hàn. Số điện thoại đọc từng chữ số; 0 thường đọc 공.'},{ko:'012 → 공 일 이',audio:'공 일 이',vi:'Chuỗi ba số minh họa để tập đọc, không phải số liên lạc.'}],
   dialogue:[{ko:'전화번호가 뭐예요?',vi:'Số điện thoại là gì?'},{ko:'공 일 이예요.',vi:'Là không, một, hai. Chuỗi minh họa rút gọn.'}],
   pairs:[{left:'공',right:'0'},{left:'일',right:'1'},{left:'이',right:'2'}],
   fill:{prompt:'Chữ số 3 đọc là gì?',correctAnswer:'삼',explanation:'3 là 삼 trong hệ số Hán Hàn.'},
   listen:{audio:'공 이 삼',choices:['023','032','123'],correctAnswer:'023',explanation:'공 = 0, 이 = 2, 삼 = 3.',fallbackPrompt:'Đọc 공 이 삼 rồi chọn chuỗi số.'},
   quiz:{prompt:'Chọn cách đọc từng chữ số 205.',choices:['이 공 오','이 오 공','두 공 다섯'],correctAnswer:'이 공 오',explanation:'Số điện thoại đọc từng chữ số Hán Hàn: 2–0–5.'},
   order:{prompt:'Xếp cách đọc từng chữ số 123.',tokens:['삼','일','이'],correctAnswer:[1,2,0],explanation:'1 일 → 2 이 → 3 삼.'}
  },
  {
   key:'find',title:'Chiếc túi đang trốn ở đâu?',referenceTheme:'Đồ vật và vị trí',
   objective:'Nói đồ vật ở trên, dưới hoặc bên cạnh một vật khác.',vocab:['책','가방','책상','의자','위','아래','옆','있어요'],gids:['s1-place'],
   memory:'Dán một ghim 에 lên bản đồ: 책상 위 + 에 + 있어요. “Ở trên bàn” đi thành một cụm.',
   recall:'Viết “Sách ở trên bàn”.',answer:'책이 책상 위에 있어요.',
   cards:[{ko:'위 · 아래 · 옆',vi:'Phía trên · phía dưới · bên cạnh.'},{ko:'책이 책상 위에 있어요.',vi:'Sách ở trên bàn. 책 + 이 đánh dấu vật đang nói; 책상 위에 là vị trí.'},{ko:'가방이 의자 아래에 있어요.',vi:'Túi ở dưới ghế. Thay vật/vị trí là có câu mới.'}],
   dialogue:[{ko:'가방이 어디에 있어요?',vi:'Túi ở đâu? 어디: đâu.'},{ko:'의자 아래에 있어요.',vi:'Ở dưới ghế.'}],
   pairs:[{left:'위',right:'Phía trên'},{left:'아래',right:'Phía dưới'},{left:'옆',right:'Bên cạnh'}],
   fill:{prompt:'책이 책상 위__ 있어요. Điền ghim vị trí.',correctAnswer:'에',explanation:'Vị trí tồn tại dùng 에 있어요.'},
   listen:{audio:'의자 아래에 있어요.',choices:['Ở dưới ghế.','Ở trên bàn.'],correctAnswer:'Ở dưới ghế.',explanation:'의자 là ghế, 아래 là phía dưới.',fallbackPrompt:'Đọc 의자 아래에 있어요. rồi chọn nghĩa.'},
   quiz:{prompt:'Chọn câu nói “Túi ở cạnh bàn”.',choices:['가방이 책상 옆에 있어요.','가방이 책상 아래에 있어요.'],correctAnswer:'가방이 책상 옆에 있어요.',explanation:'옆 là bên cạnh; 아래 là phía dưới.'},
   order:{prompt:'Xếp câu “Sách ở dưới ghế”.',tokens:['있어요.','의자','책이','아래에'],correctAnswer:[2,1,3,0],explanation:'Vật → vị trí → 있어요.'}
  },
  {
   key:'routine',title:'Một góc học, hai việc nhỏ',referenceTheme:'Hành động sinh hoạt',
   objective:'Nói đọc sách, ăn bánh mì hoặc uống sữa bằng câu ngắn.',vocab:['책','빵','우유','읽다','먹다','마시다','공부하다'],gids:['s1-action'],
   memory:'Câu là một đoàn tàu: đồ vật + 을/를 là toa hàng, động từ lịch sự đứng cuối làm đầu máy.',
   recall:'Viết “Tôi đọc sách”.',answer:'책을 읽어요.',
   cards:[{ko:'책을 읽어요. / 우유를 마셔요.',vi:'Tôi đọc sách. / Tôi uống sữa. 책 có batchim → 을; 우유 không có → 를.'},{ko:'읽다 → 읽어요 · 먹다 → 먹어요 · 마시다 → 마셔요',vi:'Dạng từ điển có 다; câu lịch sự dùng các dạng bên phải. Ghi nhớ theo cặp trong bài này.'},{ko:'한국어를 공부해요.',vi:'Tôi học tiếng Hàn. 공부하다 → 공부해요.'}],
   dialogue:[{ko:'책을 읽어요?',vi:'Bạn đọc sách à?'},{ko:'네. 우유도 마셔요.',vi:'Vâng. Tôi cũng uống sữa. 도 nghĩa là “cũng”.'}],
   pairs:[{left:'읽다',right:'Đọc'},{left:'먹다',right:'Ăn'},{left:'마시다',right:'Uống'}],
   fill:{prompt:'우유__ 마셔요. Điền trợ từ tân ngữ.',correctAnswer:'를',explanation:'우유 không có batchim → 를.'},
   listen:{audio:'빵을 먹어요.',choices:['Tôi ăn bánh mì.','Tôi đọc sách.'],correctAnswer:'Tôi ăn bánh mì.',explanation:'빵 là bánh mì; 먹어요 là ăn.',fallbackPrompt:'Đọc 빵을 먹어요. rồi chọn nghĩa.'},
   quiz:{prompt:'Chọn câu đúng về “đọc sách”.',choices:['책을 읽어요.','책를 읽어요.','책을 읽다요.'],correctAnswer:'책을 읽어요.',explanation:'책 + 을; 읽다 → 읽어요.'},
   order:{prompt:'Xếp câu “Tôi uống sữa”.',tokens:['마셔요.','우유를'],correctAnswer:[1,0],explanation:'Tân ngữ 우유를 đứng trước động từ 마셔요.'}
  },
  {
   key:'basket',title:'Một giỏ bánh và sữa',referenceTheme:'Mua đồ',
   objective:'Nói mua hai món bằng 하고 và 사요.',vocab:['빵','우유','커피','사다'],gids:['s1-shopping'],
   memory:'하고 là quai giỏ nối hai món: 빵 + 하고 + 우유. Cuối câu mới thêm “mua”: 사요.',
   recall:'Viết “Tôi mua bánh mì và sữa”.',answer:'빵하고 우유를 사요.',
   cards:[{ko:'빵하고 우유',vi:'Bánh mì và sữa. Gắn 하고 ngay sau danh từ đầu.'},{ko:'빵하고 우유를 사요.',vi:'Tôi mua bánh mì và sữa. 사다 → 사요.'},{ko:'커피하고 빵을 사요.',vi:'Tôi mua cà phê và bánh mì. Danh từ cuối có batchim → 을.'}],
   dialogue:[{ko:'빵을 사요?',vi:'Bạn mua bánh mì à?'},{ko:'네. 빵하고 우유를 사요.',vi:'Vâng. Tôi mua bánh mì và sữa.'}],
   pairs:[{left:'빵',right:'Bánh mì'},{left:'우유',right:'Sữa'},{left:'커피',right:'Cà phê'}],
   fill:{prompt:'빵__ 우유를 사요. Điền “và”.',correctAnswer:'하고',explanation:'하고 nối hai danh từ.'},
   listen:{audio:'커피하고 빵을 사요.',choices:['Mua cà phê và bánh mì.','Mua sữa và bánh mì.'],correctAnswer:'Mua cà phê và bánh mì.',explanation:'커피 là cà phê, 빵 là bánh mì.',fallbackPrompt:'Đọc 커피하고 빵을 사요. rồi chọn nghĩa.'},
   quiz:{prompt:'Chọn cách nói “Tôi mua sữa”.',choices:['우유를 사요.','우유를 마셔요.'],correctAnswer:'우유를 사요.',explanation:'사요 là mua; 마셔요 là uống.'},
   order:{prompt:'Xếp câu “Tôi mua cà phê và sữa”.',tokens:['사요.','우유를','커피하고'],correctAnswer:[2,1,0],explanation:'커피하고 + 우유를 + 사요.'}
  },
  {
   key:'count',title:'Hai chiếc bánh cho hai người',referenceTheme:'Số lượng và đơn vị đếm',
   objective:'Xin một, hai hoặc ba cái bánh bằng mẫu 주세요.',vocab:['빵','하나','둘','셋','한','두','세','주세요'],gids:['s1-counter'],
   memory:'Số khoác áo ngắn trước 개: 하나 → 한, 둘 → 두, 셋 → 세, 넷 → 네.',
   recall:'Viết “Cho tôi hai cái bánh mì”.',answer:'빵 두 개 주세요.',
   cards:[{ko:'한 개 · 두 개 · 세 개 · 네 개',vi:'Một cái · hai cái · ba cái · bốn cái. 개 là đơn vị đếm đồ vật thông dụng.'},{ko:'빵 두 개 주세요.',vi:'Cho tôi hai cái bánh mì. 주세요 là cách xin lịch sự.'},{ko:'하나 → 한 · 둘 → 두 · 셋 → 세 · 넷 → 네',vi:'Dùng dạng ngắn trước đơn vị đếm. Không áp dụng 개 cho mọi đồ vật hoặc đồ uống.'}],
   dialogue:[{ko:'빵 두 개 주세요.',vi:'Cho tôi hai cái bánh mì.'},{ko:'네.',vi:'Vâng.'},{ko:'감사합니다.',vi:'Cảm ơn.'}],
   pairs:[{left:'한 개',right:'Một cái'},{left:'두 개',right:'Hai cái'},{left:'세 개',right:'Ba cái'}],
   fill:{prompt:'빵 __ 개 주세요. Điền “hai” trước 개.',correctAnswer:'두',explanation:'둘 đổi thành 두 trước đơn vị đếm.'},
   listen:{audio:'빵 세 개 주세요.',choices:['Ba cái bánh mì.','Hai cái bánh mì.'],correctAnswer:'Ba cái bánh mì.',explanation:'세 개 là ba cái.',fallbackPrompt:'Đọc 빵 세 개 주세요. rồi chọn số lượng.'},
   quiz:{prompt:'Chọn cách nói “bốn cái”.',choices:['네 개','넷 개','사 개'],correctAnswer:'네 개',explanation:'넷 đổi thành 네 trước 개 trong mẫu số thuần Hàn này.'},
   order:{prompt:'Xếp câu xin một cái bánh mì.',tokens:['주세요.','개','한','빵'],correctAnswer:[3,2,1,0],explanation:'Đồ vật → số → đơn vị → 주세요.'}
  },
  {
   key:'clock',title:'Một chiếc hẹn lúc hai giờ',referenceTheme:'Thời gian',
   objective:'Đọc giờ/phút và gắn thời điểm vào câu.',vocab:['한','두','세','시','분','오후','이','오'],gids:['s1-time'],
   memory:'Đồng hồ có hai ngăn: giờ dùng 한/두/세; phút dùng 일/이/삼. Hai giờ: 두 시, hai phút: 이 분.',
   recall:'Viết “Tôi đi lúc hai giờ chiều”.',answer:'오후 두 시에 가요.',
   cards:[{ko:'한 시 · 두 시 · 세 시',vi:'Một giờ · hai giờ · ba giờ. Giờ dùng số thuần Hàn.'},{ko:'일 분 · 이 분 · 오 분',vi:'Một phút · hai phút · năm phút. Phút dùng số Hán Hàn.'},{ko:'오후 두 시에 가요. / 세 시 오 분이에요.',vi:'Tôi đi lúc hai giờ chiều. / Là ba giờ năm phút. 오후: sau trưa; 에 đánh dấu thời điểm; 가요: đi.'}],
   dialogue:[{ko:'몇 시에 가요?',vi:'Bạn đi lúc mấy giờ? 몇 시: mấy giờ.'},{ko:'오후 두 시에 가요.',vi:'Tôi đi lúc hai giờ chiều.'}],
   pairs:[{left:'한 시',right:'Một giờ'},{left:'두 시',right:'Hai giờ'},{left:'세 시',right:'Ba giờ'}],
   fill:{prompt:'오후 두 시__ 가요. Điền trợ từ chỉ thời điểm.',correctAnswer:'에',explanation:'에 đánh dấu thời điểm của hành động.'},
   listen:{audio:'세 시 오 분',choices:['3 giờ 5 phút','5 giờ 3 phút'],correctAnswer:'3 giờ 5 phút',explanation:'세 시 = 3 giờ; 오 분 = 5 phút.',fallbackPrompt:'Đọc 세 시 오 분 rồi chọn giờ.'},
   quiz:{prompt:'Chọn cách đọc 2 giờ 2 phút.',choices:['두 시 이 분','이 시 두 분','둘 시 둘 분'],correctAnswer:'두 시 이 분',explanation:'Giờ dùng 두, phút dùng 이.'},
   order:{prompt:'Xếp câu “Tôi đi lúc ba giờ chiều”.',tokens:['가요.','세 시에','오후'],correctAnswer:[2,1,0],explanation:'오후 + 세 시에 + 가요.'}
  },
  {
   key:'weather',title:'Mở cửa sổ, nói một câu',referenceTheme:'Thời tiết',
   objective:'Nói trời nóng, lạnh hoặc mưa bằng ba mẫu ngắn.',vocab:['오늘','날씨','덥다','춥다','비','오다'],gids:['s1-weather'],
   memory:'Nhớ hai cặp có vần 워요: 덥다 → 더워요, 춥다 → 추워요. Chỉ áp dụng mẹo này cho hai từ đang học.',
   recall:'Viết “Hôm nay trời nóng”.',answer:'오늘은 더워요.',
   cards:[{ko:'오늘은 더워요. / 오늘은 추워요.',vi:'Hôm nay trời nóng. / Hôm nay trời lạnh. 오늘은 nêu chủ đề hôm nay.'},{ko:'덥다 → 더워요 · 춥다 → 추워요',vi:'Hai dạng biến đổi ㅂ. Không viết 덥어요 hoặc 춥어요.'},{ko:'비가 와요.',vi:'Trời mưa. 비: mưa; 가 đánh dấu chủ ngữ; 오다 → 와요.'}],
   dialogue:[{ko:'오늘은 더워요?',vi:'Hôm nay trời nóng không?'},{ko:'아니요. 추워요.',vi:'Không. Trời lạnh.'}],
   pairs:[{left:'더워요',right:'Trời nóng'},{left:'추워요',right:'Trời lạnh'},{left:'비가 와요',right:'Trời mưa'}],
   fill:{prompt:'춥다 đổi sang cách nói lịch sự trong bài là gì?',correctAnswer:'추워요',explanation:'춥다 có dạng biến đổi 추워요.'},
   listen:{audio:'비가 와요.',choices:['Trời mưa.','Trời nóng.'],correctAnswer:'Trời mưa.',explanation:'비가 와요 là câu nói trời mưa.',fallbackPrompt:'Đọc 비가 와요. rồi chọn nghĩa.'},
   quiz:{prompt:'Chọn dạng đúng của 덥다 trong câu lịch sự.',choices:['더워요','덥어요','더어요'],correctAnswer:'더워요',explanation:'Ghi nhớ cặp 덥다 → 더워요.'},
   order:{prompt:'Xếp câu “Hôm nay trời lạnh”.',tokens:['추워요.','오늘은'],correctAnswer:[1,0],explanation:'Chủ đề 오늘은 đứng trước trạng thái 추워요.'}
  },
  {
   key:'yesterday',title:'Một tấm ảnh từ hôm qua',referenceTheme:'Kể hoạt động đã làm',
   objective:'Kể đi công viên, đọc sách hoặc đi dạo ở quá khứ.',vocab:['어제','공원','가다','책','읽다','산책하다'],gids:['s1-past'],
   memory:'Hình dung dán nhãn “đã” lên động từ: 가요 → 갔어요; 읽어요 → 읽었어요; 산책해요 → 산책했어요.',
   recall:'Viết “Hôm qua tôi đã đi công viên”.',answer:'어제 공원에 갔어요.',
   cards:[{ko:'어제 공원에 갔어요.',vi:'Hôm qua tôi đã đi công viên. 어제: hôm qua; 가다 → 갔어요.'},{ko:'책을 읽었어요. / 공원에서 산책했어요.',vi:'Tôi đã đọc sách. / Tôi đã đi dạo ở công viên.'},{ko:'공원에 가요. / 공원에서 산책해요.',vi:'에: nơi đến; 에서: nơi hành động diễn ra. Trong quá khứ đổi 가요 → 갔어요, 산책해요 → 산책했어요.'}],
   dialogue:[{ko:'어제 공원에 갔어요?',vi:'Hôm qua bạn đã đi công viên à?'},{ko:'네. 공원에서 산책했어요.',vi:'Vâng. Tôi đã đi dạo ở công viên.'}],
   pairs:[{left:'갔어요',right:'Đã đi'},{left:'읽었어요',right:'Đã đọc'},{left:'산책했어요',right:'Đã đi dạo'}],
   fill:{prompt:'Điền quá khứ của 가다: 어제 공원에 ___.',correctAnswer:'갔어요',explanation:'가다 → 갔어요 khi kể đã đi.'},
   listen:{audio:'책을 읽었어요.',choices:['Tôi đã đọc sách.','Tôi đã đi công viên.'],correctAnswer:'Tôi đã đọc sách.',explanation:'읽었어요 là đã đọc.',fallbackPrompt:'Đọc 책을 읽었어요. rồi chọn nghĩa.'},
   quiz:{prompt:'Chọn câu kể đã đi dạo ở công viên.',choices:['공원에서 산책했어요.','공원에 산책하다요.'],correctAnswer:'공원에서 산책했어요.',explanation:'Nơi hoạt động dùng 에서; 산책하다 → 산책했어요.'},
   order:{prompt:'Xếp câu “Hôm qua tôi đã đọc sách”.',tokens:['읽었어요.','책을','어제'],correctAnswer:[2,1,0],explanation:'어제 + sách làm tân ngữ + động từ quá khứ.'}
  },
  {
   key:'invite',title:'Một lời rủ đi dạo',referenceTheme:'Đề nghị hoạt động cùng nhau',
   objective:'Rủ cùng đi công viên hoặc ăn bánh bằng -(으)ㄹ까요?',vocab:['같이','공원','가다','빵','먹다','커피','마시다','좋아요'],gids:['s1-invite'],
   memory:'Mở cánh cửa bằng 같이. Gốc 가 không có phụ âm cuối → 갈까요?; gốc 먹 có phụ âm cuối → 먹을까요?',
   recall:'Viết “Mình cùng đi công viên nhé?”.',answer:'같이 공원에 갈까요?',
   cards:[{ko:'같이 공원에 갈까요?',vi:'Mình cùng đi công viên nhé? 같이: cùng nhau; 가다 → 갈까요?'},{ko:'같이 빵을 먹을까요? / 같이 커피를 마실까요?',vi:'Mình cùng ăn bánh mì nhé? / Mình cùng uống cà phê nhé?'},{ko:'좋아요.',vi:'Được đấy / hay đấy. Một cách đồng ý ngắn và lịch sự.'}],
   dialogue:[{ko:'같이 공원에 갈까요?',vi:'Mình cùng đi công viên nhé?'},{ko:'좋아요.',vi:'Được đấy.'},{ko:'같이 커피를 마실까요?',vi:'Mình cùng uống cà phê nhé?'}],
   pairs:[{left:'같이',right:'Cùng nhau'},{left:'공원',right:'Công viên'},{left:'커피',right:'Cà phê'}],
   fill:{prompt:'Điền lời rủ cho 가다: 같이 공원에 ___?',correctAnswer:'갈까요',explanation:'Thân 가 không có batchim → ㄹ까요.'},
   listen:{audio:'같이 빵을 먹을까요?',choices:['Rủ cùng ăn bánh mì.','Nói đã đi công viên.'],correctAnswer:'Rủ cùng ăn bánh mì.',explanation:'같이 và 먹을까요? tạo lời rủ ăn cùng nhau.',fallbackPrompt:'Đọc 같이 빵을 먹을까요? rồi chọn ý nghĩa.'},
   quiz:{prompt:'Chọn cách rủ cùng ăn từ động từ 먹다.',choices:['같이 먹을까요?','같이 먹ㄹ까요?','같이 먹다까요?'],correctAnswer:'같이 먹을까요?',explanation:'먹 có batchim ㄱ → 을까요?.'},
   order:{prompt:'Xếp lời rủ cùng uống cà phê.',tokens:['마실까요?','커피를','같이'],correctAnswer:[2,1,0],explanation:'같이 + 커피를 + 마실까요?.'}
  }
 ];
 for(const s of scenarios){
  const u=unit('s1-'+s.key,s.title,'sejong1a');
  const first=s.pairs[0];
  const exercises=[
   choice('WORD_MEANING',first.left+' nghĩa là gì?',[first.right,s.pairs[1].right],first.right,first.left+' = '+first.right+'.'),
   {type:'MATCH',prompt:'Ghép ba mảnh nhớ trong tình huống.',pairs:s.pairs,explanation:'Nhớ theo cặp, rồi đặt lại vào câu mẫu.'},
   {type:'FILL_BLANK',...s.fill},
   choice('AUDIO_CHOICE','Nghe câu ngắn và chọn nghĩa.',s.listen.choices,s.listen.correctAnswer,s.listen.explanation,{audio:s.listen.audio,fallbackPrompt:s.listen.fallbackPrompt}),
   choice('SENTENCE_CHOICE',s.quiz.prompt,s.quiz.choices,s.quiz.correctAnswer,s.quiz.explanation),
   {type:'TYPING',prompt:s.recall,correctAnswer:s.answer,ignorePunctuation:true,explanation:'Câu mẫu: '+s.answer+' Có thể ôn phần giải thích rồi thử lại.'},
   {type:'ORDER',...s.order}
  ];
  const l=make(u,'s1-'+s.key+'-lesson',s.title,s.cards.map(c=>({...c,audio:c.audio||(!/[→·/]/.test(c.ko)?c.ko:undefined)})),exercises,{description:'Một tình huống nhỏ: hiểu mẫu, nhớ bằng hình ảnh, thử nói rồi tự kiểm tra.',objectives:[s.objective,'Dùng lại câu mẫu với từ vựng đã giới thiệu.'],estimatedMinutes:8,vocabularyIds:s.vocab.map(x=>'word:'+x),grammarIds:s.gids,referenceTheme:s.referenceTheme,memoryCue:s.memory,recallPrompt:s.recall,recallAnswer:s.answer,dialogue:s.dialogue});
  u.lessonIds=[l.id];
 }
 return {version:1,units,lessons,grammar,reference};
})();
