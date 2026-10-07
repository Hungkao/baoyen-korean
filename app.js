'use strict';
// Dữ liệu độc lập: thêm mục mới ở hai mảng này.
const letters = [
 // 8 nguyen am co ban [0-7]
 {ko:'ㅏ',roman:'a',hint:'a như trong "ba"',say:'아',group:'vowels'},
 {ko:'ㅓ',roman:'eo',hint:'gần âm "o", miệng mở hơn; không đọc "e-o"',say:'어',group:'vowels'},
 {ko:'ㅗ',roman:'o',hint:'gần âm "ô", môi tròn',say:'오',group:'vowels'},
 {ko:'ㅜ',roman:'u',hint:'u như trong "thu"',say:'우',group:'vowels'},
 {ko:'ㅡ',roman:'eu',hint:'gần âm "ư", môi không tròn',say:'으',group:'vowels'},
 {ko:'ㅣ',roman:'i',hint:'i như trong "đi"',say:'이',group:'vowels'},
 {ko:'ㅐ',roman:'ae',hint:'gần âm "e"; không đọc tách "a-e"',say:'애',group:'vowels'},
 {ko:'ㅔ',roman:'e',hint:'gần âm "ê"; rất gần ㅐ trong giọng hiện đại',say:'에',group:'vowels'},
 // 14 phu am co ban [8-21]
 {ko:'ㄱ',roman:'g/k',hint:'g/k nhẹ; nghe mẫu 가 (ga)',say:'가',group:'consonants'},
 {ko:'ㄴ',roman:'n',hint:'n; nghe mẫu 나 (na)',say:'나',group:'consonants'},
 {ko:'ㄷ',roman:'d/t',hint:'d/t nhẹ; nghe mẫu 다 (da)',say:'다',group:'consonants'},
 {ko:'ㄹ',roman:'r/l',hint:'r nhẹ hoặc l tùy vị trí; nghe mẫu 라 (ra)',say:'라',group:'consonants'},
 {ko:'ㅁ',roman:'m',hint:'m; nghe mẫu 마 (ma)',say:'마',group:'consonants'},
 {ko:'ㅂ',roman:'b/p',hint:'b/p nhẹ; nghe mẫu 바 (ba)',say:'바',group:'consonants'},
 {ko:'ㅅ',roman:'s',hint:'s; nghe mẫu 사 (sa)',say:'사',group:'consonants'},
 {ko:'ㅇ',roman:'∅/ng',hint:'đầu âm: im lặng; cuối âm: ng. Mẫu 아 (a)',say:'아',group:'consonants'},
 {ko:'ㅈ',roman:'j',hint:'gần "ch" nhẹ; nghe mẫu 자 (ja)',say:'자',group:'consonants'},
 {ko:'ㅊ',roman:'ch',hint:'ch bật hơi; nghe mẫu 차 (cha)',say:'차',group:'consonants'},
 {ko:'ㅋ',roman:'k',hint:'k bật hơi; nghe mẫu 카 (ka)',say:'카',group:'consonants'},
 {ko:'ㅌ',roman:'t',hint:'t bật hơi; nghe mẫu 타 (ta)',say:'타',group:'consonants'},
 {ko:'ㅍ',roman:'p',hint:'p bật hơi, không phải f; nghe mẫu 파 (pa)',say:'파',group:'consonants'},
 {ko:'ㅎ',roman:'h',hint:'h; nghe mẫu 하 (ha)',say:'하',group:'consonants'},
 // 4 nguyen am mo rong (Y-) [22-25]
 {ko:'ㅑ',roman:'ya',hint:'ya — ㅏ thêm nét y đầu; mẫu 야',say:'야',group:'extended_vowels'},
 {ko:'ㅕ',roman:'yeo',hint:'yeo — gần "yuh"; mẫu 여',say:'여',group:'extended_vowels'},
 {ko:'ㅛ',roman:'yo',hint:'yo — môi tròn, có âm y đầu; mẫu 요',say:'요',group:'extended_vowels'},
 {ko:'ㅠ',roman:'yu',hint:'yu — giống "you" tiếng Anh; mẫu 유',say:'유',group:'extended_vowels'},
 // 9 nguyen am kep [26-34]
 {ko:'ㅘ',roman:'wa',hint:'ㅗ+ㅏ → wa; mẫu 와',say:'와',group:'compound_vowels'},
 {ko:'ㅙ',roman:'wae',hint:'ㅗ+ㅐ → wae; gần "we"',say:'왜',group:'compound_vowels'},
 {ko:'ㅚ',roman:'oe',hint:'ㅗ+ㅣ → oe; giọng trẻ thường đọc "we"',say:'외',group:'compound_vowels'},
 {ko:'ㅝ',roman:'wo',hint:'ㅜ+ㅓ → wo; gần "wuh"',say:'워',group:'compound_vowels'},
 {ko:'ㅞ',roman:'we',hint:'ㅜ+ㅔ → we',say:'웨',group:'compound_vowels'},
 {ko:'ㅟ',roman:'wi',hint:'ㅜ+ㅣ → wi',say:'위',group:'compound_vowels'},
 {ko:'ㅢ',roman:'ui',hint:'ㅡ+ㅣ → ui; thực tế hay đọc "ui" hoặc "i"',say:'의',group:'compound_vowels'},
 {ko:'ㅒ',roman:'yae',hint:'gần giống ㅖ trong giọng hiện đại; mẫu 얘',say:'얘',group:'compound_vowels'},
 {ko:'ㅖ',roman:'ye',hint:'ye; mẫu 예',say:'예',group:'compound_vowels'},
 // 5 phu am cang [35-39]
 {ko:'ㄲ',roman:'kk',hint:'k căng, không bật hơi, mạnh hơn ㄱ; mẫu 까',say:'까',group:'tense_consonants'},
 {ko:'ㄸ',roman:'tt',hint:'t căng, không bật hơi, mạnh hơn ㄷ; mẫu 따',say:'따',group:'tense_consonants'},
 {ko:'ㅃ',roman:'pp',hint:'p căng, không bật hơi, mạnh hơn ㅂ; mẫu 빠',say:'빠',group:'tense_consonants'},
 {ko:'ㅆ',roman:'ss',hint:'s căng, mạnh hơn ㅅ; mẫu 싸',say:'싸',group:'tense_consonants'},
 {ko:'ㅉ',roman:'jj',hint:'j căng, mạnh hơn ㅈ; mẫu 짜',say:'짜',group:'tense_consonants'},
];
const words = [
 // ── Cũ (index 0–29, giữ nguyên thứ tự) ──
 {ko:'안녕하세요',roman:'annyeonghaseyo',meaning:'Xin chào',topic:'chào hỏi'},
 {ko:'감사합니다',roman:'gamsahamnida',meaning:'Cảm ơn',topic:'chào hỏi'},
 {ko:'네',roman:'ne',meaning:'Vâng / Có',topic:'giao tiếp'},
 {ko:'아니요',roman:'aniyo',meaning:'Không',topic:'giao tiếp'},
 {ko:'미안해요',roman:'mianhaeyo',meaning:'Xin lỗi',topic:'chào hỏi'},
 {ko:'사랑해요',roman:'saranghaeyo',meaning:'Tôi yêu bạn',topic:'tình cảm'},
 {ko:'보고 싶어요',roman:'bogo sipeoyo',meaning:'Tôi nhớ bạn',topic:'tình cảm'},
 {ko:'맛있어요',roman:'masisseoyo',meaning:'Ngon quá',topic:'ăn uống'},
 {ko:'좋아요',roman:'joayo',meaning:'Tốt / Thích',topic:'giao tiếp'},
 {ko:'물',roman:'mul',meaning:'Nước',topic:'ăn uống'},
 {ko:'밥',roman:'bap',meaning:'Cơm',topic:'ăn uống'},
 {ko:'이름',roman:'ireum',meaning:'Tên',topic:'bản thân'},
 {ko:'안녕',roman:'annyeong',meaning:'Chào / Tạm biệt (thân mật)',topic:'chào hỏi'},
 {ko:'잘 자요',roman:'jal jayo',meaning:'Ngủ ngon',topic:'chào hỏi'},
 {ko:'괜찮아요',roman:'gwaenchanayo',meaning:'Không sao / Ổn mà',topic:'giao tiếp'},
 {ko:'주세요',roman:'juseyo',meaning:'Làm ơn cho tôi…',topic:'giao tiếp'},
 {ko:'커피',roman:'keopi',meaning:'Cà phê',topic:'ăn uống'},
 {ko:'차',roman:'cha',meaning:'Trà',topic:'ăn uống'},
 {ko:'우유',roman:'uyu',meaning:'Sữa',topic:'ăn uống'},
 {ko:'빵',roman:'ppang',meaning:'Bánh mì',topic:'ăn uống'},
 {ko:'사과',roman:'sagwa',meaning:'Quả táo',topic:'ăn uống'},
 {ko:'친구',roman:'chingu',meaning:'Bạn bè',topic:'bản thân'},
 {ko:'가족',roman:'gajok',meaning:'Gia đình',topic:'gia đình'},
 {ko:'집',roman:'jip',meaning:'Nhà',topic:'nơi chốn'},
 {ko:'학교',roman:'hakgyo',meaning:'Trường học',topic:'nơi chốn'},
 {ko:'오늘',roman:'oneul',meaning:'Hôm nay',topic:'thời gian'},
 {ko:'내일',roman:'naeil',meaning:'Ngày mai',topic:'thời gian'},
 {ko:'행복',roman:'haengbok',meaning:'Hạnh phúc',topic:'tình cảm'},
 {ko:'예뻐요',roman:'yeppeoyo',meaning:'Đẹp quá',topic:'tình cảm'},
 {ko:'고마워요',roman:'gomawoyo',meaning:'Cảm ơn (gần gũi)',topic:'chào hỏi'},
 // ── Mới: chào hỏi (30–35) ──
 {ko:'만나서 반가워요',roman:'mannaseo bangawoyo',meaning:'Rất vui được gặp bạn',topic:'chào hỏi'},
 {ko:'잘 지냈어요?',roman:'jal jinaesseoyo?',meaning:'Bạn có khỏe không?',topic:'chào hỏi'},
 {ko:'잘 지냈어요',roman:'jal jinaesseoyo',meaning:'Tôi vẫn khỏe',topic:'chào hỏi'},
 {ko:'또 봐요',roman:'tto bwayo',meaning:'Hẹn gặp lại',topic:'chào hỏi'},
 {ko:'오랜만이에요',roman:'oraenmanieyo',meaning:'Lâu rồi không gặp',topic:'chào hỏi'},
 {ko:'잠깐만요',roman:'jamkkanmanyo',meaning:'Chờ một chút',topic:'chào hỏi'},
 // ── Mới: bản thân (36–41) ──
 {ko:'저',roman:'jeo',meaning:'Tôi (lịch sự)',topic:'bản thân'},
 {ko:'나',roman:'na',meaning:'Tôi (thân mật)',topic:'bản thân'},
 {ko:'이름이 뭐예요?',roman:'ireumi mwoyeyo?',meaning:'Tên bạn là gì?',topic:'bản thân'},
 {ko:'학생이에요',roman:'haksaengieyo',meaning:'Tôi là học sinh',topic:'bản thân'},
 {ko:'한국 사람이에요?',roman:'hanguk saramieyo?',meaning:'Bạn là người Hàn Quốc?',topic:'bản thân'},
 {ko:'베트남 사람이에요',roman:'beteunam saramieyo',meaning:'Tôi là người Việt Nam',topic:'bản thân'},
 // ── Mới: gia đình (42–51) ──
 {ko:'엄마',roman:'eomma',meaning:'Mẹ',topic:'gia đình'},
 {ko:'아빠',roman:'appa',meaning:'Bố',topic:'gia đình'},
 {ko:'오빠',roman:'oppa',meaning:'Anh trai (em gái gọi)',topic:'gia đình'},
 {ko:'언니',roman:'eonni',meaning:'Chị gái (em gái gọi)',topic:'gia đình'},
 {ko:'남동생',roman:'namdongsaeng',meaning:'Em trai',topic:'gia đình'},
 {ko:'여동생',roman:'yeodongsaeng',meaning:'Em gái',topic:'gia đình'},
 {ko:'할머니',roman:'halmeoni',meaning:'Bà nội / ngoại',topic:'gia đình'},
 {ko:'할아버지',roman:'harabeoji',meaning:'Ông nội / ngoại',topic:'gia đình'},
 {ko:'남자친구',roman:'namjachingu',meaning:'Bạn trai',topic:'gia đình'},
 {ko:'여자친구',roman:'yeojachingu',meaning:'Bạn gái',topic:'gia đình'},
 // ── Mới: ăn uống (52–59) ──
 {ko:'먹어요',roman:'meogeoyo',meaning:'Ăn',topic:'ăn uống'},
 {ko:'마셔요',roman:'masyeoyo',meaning:'Uống',topic:'ăn uống'},
 {ko:'배고파요',roman:'baegopayo',meaning:'Tôi đói',topic:'ăn uống'},
 {ko:'배불러요',roman:'baebulleoyo',meaning:'Tôi no rồi',topic:'ăn uống'},
 {ko:'맛없어요',roman:'maseopsseoyo',meaning:'Không ngon',topic:'ăn uống'},
 {ko:'음식',roman:'eumsik',meaning:'Đồ ăn / Thức ăn',topic:'ăn uống'},
 {ko:'식당',roman:'sikdang',meaning:'Nhà hàng / Quán ăn',topic:'ăn uống'},
 {ko:'얼마예요?',roman:'eolmayeyo?',meaning:'Bao nhiêu tiền?',topic:'ăn uống'},
 // ── Mới: nơi chốn (60–69) ──
 {ko:'여기',roman:'yeogi',meaning:'Đây / Ở đây',topic:'nơi chốn'},
 {ko:'저기',roman:'jeogi',meaning:'Kia / Ở kia',topic:'nơi chốn'},
 {ko:'어디',roman:'eodi',meaning:'Ở đâu?',topic:'nơi chốn'},
 {ko:'병원',roman:'byeongwon',meaning:'Bệnh viện',topic:'nơi chốn'},
 {ko:'편의점',roman:'pyeonuijeom',meaning:'Cửa hàng tiện lợi',topic:'nơi chốn'},
 {ko:'카페',roman:'kape',meaning:'Quán cà phê',topic:'nơi chốn'},
 {ko:'지하철',roman:'jihacheol',meaning:'Tàu điện ngầm',topic:'nơi chốn'},
 {ko:'버스',roman:'beoseu',meaning:'Xe buýt',topic:'nơi chốn'},
 {ko:'화장실',roman:'hwajangsil',meaning:'Nhà vệ sinh',topic:'nơi chốn'},
 {ko:'공항',roman:'gonghang',meaning:'Sân bay',topic:'nơi chốn'},
 // ── Mới: thời gian (70–78) ──
 {ko:'지금',roman:'jigeum',meaning:'Bây giờ',topic:'thời gian'},
 {ko:'어제',roman:'eoje',meaning:'Hôm qua',topic:'thời gian'},
 {ko:'아침',roman:'achim',meaning:'Buổi sáng',topic:'thời gian'},
 {ko:'점심',roman:'jeomsim',meaning:'Buổi trưa',topic:'thời gian'},
 {ko:'저녁',roman:'jeonyeok',meaning:'Buổi tối',topic:'thời gian'},
 {ko:'주말',roman:'jumal',meaning:'Cuối tuần',topic:'thời gian'},
 {ko:'월요일',roman:'woryoil',meaning:'Thứ Hai',topic:'thời gian'},
 {ko:'일요일',roman:'iryoil',meaning:'Chủ Nhật',topic:'thời gian'},
 {ko:'몇 시예요?',roman:'myeot siyeyo?',meaning:'Mấy giờ rồi?',topic:'thời gian'},
 // ── Mới: sinh hoạt (79–88) ──
 {ko:'가요',roman:'gayo',meaning:'Đi',topic:'sinh hoạt'},
 {ko:'와요',roman:'wayo',meaning:'Đến / Tới',topic:'sinh hoạt'},
 {ko:'해요',roman:'haeyo',meaning:'Làm',topic:'sinh hoạt'},
 {ko:'봐요',roman:'bwayo',meaning:'Xem / Nhìn',topic:'sinh hoạt'},
 {ko:'자요',roman:'jayo',meaning:'Ngủ',topic:'sinh hoạt'},
 {ko:'일어나요',roman:'ireonayo',meaning:'Thức dậy',topic:'sinh hoạt'},
 {ko:'씻어요',roman:'ssisseoyo',meaning:'Rửa / Tắm',topic:'sinh hoạt'},
 {ko:'공부해요',roman:'gongbuhaeyo',meaning:'Học bài',topic:'sinh hoạt'},
 {ko:'일해요',roman:'ilhaeyo',meaning:'Làm việc',topic:'sinh hoạt'},
 {ko:'쉬어요',roman:'swieyo',meaning:'Nghỉ ngơi',topic:'sinh hoạt'},
 // ── Mới: tình cảm (89–94) ──
 {ko:'사랑해',roman:'saranghae',meaning:'Yêu (thân mật)',topic:'tình cảm'},
 {ko:'보고 싶어',roman:'bogo sipeo',meaning:'Nhớ bạn (thân mật)',topic:'tình cảm'},
 {ko:'걱정하지 마요',roman:'geokjeonghaji mayo',meaning:'Đừng lo lắng',topic:'tình cảm'},
 {ko:'힘내요',roman:'himnaeyo',meaning:'Cố lên!',topic:'tình cảm'},
 {ko:'잘했어요',roman:'jalhaesseoyo',meaning:'Làm tốt lắm!',topic:'tình cảm'},
 {ko:'항상',roman:'hangsang',meaning:'Luôn luôn',topic:'tình cảm'},
 // ── Mới: số đếm (95–104) ──
 {ko:'하나',roman:'hana',meaning:'Một (Hàn thuần)',topic:'số đếm'},
 {ko:'둘',roman:'dul',meaning:'Hai (Hàn thuần)',topic:'số đếm'},
 {ko:'셋',roman:'set',meaning:'Ba (Hàn thuần)',topic:'số đếm'},
 {ko:'넷',roman:'net',meaning:'Bốn (Hàn thuần)',topic:'số đếm'},
 {ko:'다섯',roman:'daseot',meaning:'Năm (Hàn thuần)',topic:'số đếm'},
 {ko:'일',roman:'il',meaning:'1 (Hán-Hàn)',topic:'số đếm'},
 {ko:'이',roman:'i',meaning:'2 (Hán-Hàn)',topic:'số đếm'},
 {ko:'삼',roman:'sam',meaning:'3 (Hán-Hàn)',topic:'số đếm'},
 {ko:'사',roman:'sa',meaning:'4 (Hán-Hàn)',topic:'số đếm'},
 {ko:'오',roman:'o',meaning:'5 (Hán-Hàn)',topic:'số đếm'},
 // ── Mới: màu sắc (105–110) ──
 {ko:'빨간색',roman:'ppalgansaek',meaning:'Màu đỏ',topic:'màu sắc'},
 {ko:'파란색',roman:'paransaek',meaning:'Màu xanh lam',topic:'màu sắc'},
 {ko:'노란색',roman:'noransaek',meaning:'Màu vàng',topic:'màu sắc'},
 {ko:'하얀색',roman:'hayansaek',meaning:'Màu trắng',topic:'màu sắc'},
 {ko:'검은색',roman:'geomeunsaek',meaning:'Màu đen',topic:'màu sắc'},
 {ko:'분홍색',roman:'bunhongsaek',meaning:'Màu hồng',topic:'màu sắc'},
 // ── Mới: câu thực hành (111–119) ──
 {ko:'저는 학생이에요',roman:'jeoneun haksaengieyo',meaning:'Tôi là học sinh',topic:'ngữ pháp'},
 {ko:'이것은 뭐예요?',roman:'igeoseun mwoyeyo?',meaning:'Cái này là gì?',topic:'ngữ pháp'},
 {ko:'저는 밥을 먹어요',roman:'jeoneun babeul meogeoyo',meaning:'Tôi ăn cơm',topic:'ngữ pháp'},
 {ko:'어디에 가요?',roman:'eodie gayo?',meaning:'Bạn đi đâu?',topic:'ngữ pháp'},
 {ko:'뭐 먹을까요?',roman:'mwo meogeulkkayo?',meaning:'Ăn gì nhỉ?',topic:'ngữ pháp'},
 {ko:'안 먹어요',roman:'an meogeoyo',meaning:'Không ăn',topic:'ngữ pháp'},
 {ko:'저도요',roman:'jeodoyo',meaning:'Tôi cũng vậy',topic:'giao tiếp'},
 {ko:'맞아요',roman:'majayo',meaning:'Đúng rồi!',topic:'giao tiếp'},
 {ko:'오늘 날씨가 좋아요',roman:'oneul nalssiga joayo',meaning:'Hôm nay trời đẹp',topic:'ngữ pháp'},
];
// Giữ nguyên 120 vị trí cũ và ID word:ko; chỉ bổ sung metadata, rồi nối từ mới.
const legacyWordCount=words.length;
const topics=window.VOCAB_TOPICS;
for(const word of words)Object.assign(word,window.VOCAB_LEGACY[word.ko]);
words.push(...window.VOCAB_BASIC,...window.VOCAB_INTERMEDIATE);
// Nối sau toàn bộ 547 mục đã phát hành, không dịch chuyển index cũ.
words.push(...window.VOCAB_FOUNDATION);
// 8 bai ngu phap A1
const grammar = [
 {id:'g1',title:'Trật tự câu: Chủ + Tân + Động',level:'A1',
  tip:'Tiếng Hàn đặt động từ ở CUỐI câu — khác tiếng Việt hoàn toàn!',
  formula:'[Chủ ngữ] + [Tân ngữ] + [Động từ]',
  examples:[
   {ko:'저는 밥을 먹어요',roman:'jeoneun babeul meogeoyo',vi:'Tôi ăn cơm'},
   {ko:'저는 물을 마셔요',roman:'jeoneun mureul masyeoyo',vi:'Tôi uống nước'},
  ],
  note:'저는=Tôi | 밥을=cơm (tân ngữ) | 먹어요=ăn → Động từ luôn đứng cuối!'},
 {id:'g2',title:'Giới thiệu: Danh từ + 이에요/예요',level:'A1',
  tip:'"Tôi là..." — 이에요 sau phụ âm, 예요 sau nguyên âm.',
  formula:'[Danh từ] + 이에요 / 예요',
  examples:[
   {ko:'저는 학생이에요',roman:'jeoneun haksaengieyo',vi:'Tôi là học sinh'},
   {ko:'저는 바오옌이에요',roman:'jeoneun baoyenieyo',vi:'Tôi là Bảo Yến'},
  ],
  note:'학생 kết thúc bằng phụ âm → 이에요. Tên kết thúc bằng nguyên âm → 예요.'},
 {id:'g3',title:'Trợ từ chủ đề 은/는',level:'A1',
  tip:'"Về phần..., thì..." — 은 sau phụ âm, 는 sau nguyên âm.',
  formula:'[Danh từ] + 은 / 는',
  examples:[
   {ko:'저는 베트남 사람이에요',roman:'jeoneun beteunam saramieyo',vi:'Tôi là người Việt Nam'},
   {ko:'오늘은 날씨가 좋아요',roman:'oneureun nalssiga joayo',vi:'Hôm nay thì trời đẹp'},
  ],
  note:'은/는 thường bị bỏ qua hoặc dịch lỏng sang tiếng Việt.'},
 {id:'g4',title:'Động từ hiện tại lịch sự: -아요/-어요',level:'A1',
  tip:'Đuôi lịch sự dùng hàng ngày. ㅏ/ㅗ → 아요; còn lại → 어요.',
  formula:'Gốc + 아요 (nếu ㅏ/ㅗ) | + 어요 (còn lại)',
  examples:[
   {ko:'먹어요',roman:'meogeoyo',vi:'Ăn (먹다 → 먹+어요)'},
   {ko:'가요',roman:'gayo',vi:'Đi (가다 → 가+아요=가요)'},
  ],
  note:'Không chia theo ngôi! 저는/당신은/그는 đều dùng đuôi như nhau.'},
 {id:'g5',title:'Phủ định: 안 + động từ',level:'A1',
  tip:'Thêm 안 trước động từ để phủ định — đơn giản hơn tiếng Việt!',
  formula:'안 + [Động từ]',
  examples:[
   {ko:'안 먹어요',roman:'an meogeoyo',vi:'Không ăn'},
   {ko:'안 가요',roman:'an gayo',vi:'Không đi'},
  ],
  note:'못 = không thể (năng lực). 안 = không muốn/không làm.'},
 {id:'g6',title:'Câu hỏi: lên giọng cuối câu',level:'A1',
  tip:'Câu hỏi Có/Không: giữ nguyên câu, lên giọng ở cuối.',
  formula:'[Câu bình thường] + ↗ (lên giọng)',
  examples:[
   {ko:'학생이에요?',roman:'haksaengieyo?',vi:'Bạn là học sinh à?'},
   {ko:'어디에 가요?',roman:'eodie gayo?',vi:'Bạn đi đâu?'},
  ],
  note:'Không cần thêm "có... không?" như tiếng Việt — chỉ lên giọng cuối câu.'},
 {id:'g7',title:'Trợ từ tân ngữ 을/를',level:'A1',
  tip:'을/를 đánh dấu tân ngữ. 을 sau phụ âm, 를 sau nguyên âm.',
  formula:'[Tân ngữ] + 을 / 를',
  examples:[
   {ko:'밥을 먹어요',roman:'babeul meogeoyo',vi:'Ăn cơm (cơm+을)'},
   {ko:'커피를 마셔요',roman:'keopireul masyeoyo',vi:'Uống cà phê (cà phê+를)'},
  ],
  note:'Trong hội thoại thường bị bỏ qua. Học để đọc hiểu văn bản!'},
 {id:'g8',title:'Lịch sự vs thân mật',level:'A1',
  tip:'Lịch sự: -아요/-어요. Thân mật (bạn bè cùng tuổi): -아/-어.',
  formula:'Lịch sự: -아요/-어요 | Thân mật: -아/-어',
  examples:[
   {ko:'사랑해요 / 사랑해',roman:'saranghaeyo / saranghae',vi:'Yêu (lịch sự / thân mật)'},
   {ko:'괜찮아요 / 괜찮아',roman:'gwaenchanayo / gwaenchana',vi:'Ổn mà (lịch sự / thân mật)'},
  ],
  note:'Với người lớn/chưa thân: -아요/-어요. Bạn thân cùng tuổi: -아/-어.'},
];

const PLAN_DAYS = 56;
const $ = id => document.getElementById(id);
// Thứ tự Unicode dùng để ghép Hangul; UI chỉ chọn các chữ cơ bản đã học.
const initialOrder = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const vowelOrder = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const finalOrder = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const syllableLessons = [
 {ko:'가',roman:'ga',initial:'ㄱ',vowel:'ㅏ',final:'',explanation:'ㄱ + ㅏ → 가. Bắt đầu bằng một âm tiết không có phụ âm cuối.'},
 {ko:'나',roman:'na',initial:'ㄴ',vowel:'ㅏ',final:'',explanation:'ㄴ + ㅏ → 나. 나 là “tôi” trong cách nói thân mật.'},
 {ko:'아',roman:'a',initial:'ㅇ',vowel:'ㅏ',final:'',explanation:'ㅇ + ㅏ → 아. ㅇ ở đầu không phát âm, bạn chỉ đọc a.'},
 {ko:'한',roman:'han',initial:'ㅎ',vowel:'ㅏ',final:'ㄴ',explanation:'ㅎ + ㅏ + ㄴ → 한. Đọc âm n ở cuối; bạn sẽ gặp chữ này trong 한글 (Hangul).'},
 {ko:'물',roman:'mul',initial:'ㅁ',vowel:'ㅜ',final:'ㄹ',explanation:'ㅁ + ㅜ + ㄹ → 물, nghĩa là “nước”. ㄹ ở cuối đọc gần âm l.'},
 {ko:'밥',roman:'bap',initial:'ㅂ',vowel:'ㅏ',final:'ㅂ',explanation:'ㅂ + ㅏ + ㅂ → 밥, nghĩa là “cơm”. Âm p cuối khép môi, không bật thêm một âm “pờ”.'}
];
// 56 bai hoc: Tuan 1-4 (Hangul + 30 tu), Tuan 5-8 (ngu phap + 90 tu moi).
const dailyPlan = window.COURSE_CONTENT.lessonSeeds.map(([title,type,indexes,grammarId],index)=>({day:index+1,title,type,grammarId:grammarId||null,items:indexes.map(i=>(type==='letter'?letters:type==='word'?words:syllableLessons)[i])}));
// Bổ sung từ còn thiếu, giữ nguyên số ngày và nội dung của 28 bài cũ.
// Giữ cách phân từ của 53 bài cũ; bài mới chỉ nối vào cuối.
const plannedWords=new Set(dailyPlan.slice(0,53).filter(p=>p.type==='word').flatMap(p=>p.items.map(w=>w.ko)));
for(const word of words.slice(0,legacyWordCount).filter(w=>!plannedWords.has(w.ko))){const lesson=dailyPlan.slice(28,53).filter(p=>p.type==='word').sort((a,b)=>a.items.length-b.items.length)[0];lesson.items.push(word);}
const learningItems=[...letters.map(item=>({type:'letter',item})),...words.map(item=>({type:'word',item})),...syllableLessons.map(item=>({type:'syllable',item}))].map(x=>({...x,id:x.type+':'+x.item.ko}));
const loveMessages=['Hôm nay em chỉ cần cố gắng một chút thôi. Anh luôn cổ vũ em nhé ♡','Một chữ mới, một niềm vui nhỏ. Anh mong góc học này làm em mỉm cười.','Nếu hôm nay hơi mệt, cứ học chậm thôi. Anh vẫn ở đây, cổ vũ em.','Không cần hoàn hảo đâu, Bảo Yến. Mỗi lần em quay lại đã là một điều đáng tự hào.','Em học một chút tiếng Hàn, anh gửi em một chút yêu thương nhé.','Bảo Yến ơi, chúc em một ngày dịu dàng. Một bài học nhỏ đang chờ em ♡','Cảm ơn em vì đã dành thời gian cho chính mình. Anh thương cả những bước nhỏ của em.'];
function localDate(date=new Date()){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
function validDate(value){return typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value+'T12:00:00Z')) && new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;}
function dayBefore(date){const value=new Date(date+'T12:00:00Z');value.setUTCDate(value.getUTCDate()-1);return value.toISOString().slice(0,10);}
const BASE_KEY = 'hangul-little-steps-v1';
let KEY = BASE_KEY;
const total = letters.length + words.length;
function emptyProgress(){return {score:0,streak:0,learned:[],wordIndex:0,completedLessons:[],lessonIndex:0,completedDays:[],daily:null,mistakes:[],srs:{},vocabFilter:{level:'all',topic:'all'},platform:PlatformEngine.empty()};}
let state = emptyProgress();
const validIds = new Set([...letters.map(x=>'letter:'+x.ko),...words.map(x=>'word:'+x.ko)]);
// Dùng cùng một bộ kiểm tra cho dữ liệu cũ, bản sao lưu và dữ liệu đồng bộ.
function normalizeProgress(saved){
 const previous=state;state=emptyProgress();
 try{
  if(saved && typeof saved==='object' && !Array.isArray(saved)){
  state.platform=PlatformEngine.normalize(saved.platform);
  for(const key of ['score','streak']) if(Number.isSafeInteger(saved[key]) && saved[key]>=0) state[key]=saved[key];
  if(Array.isArray(saved.learned)) state.learned=[...new Set(saved.learned.filter(x=>validIds.has(x)))];
  if(Number.isInteger(saved.wordIndex) && saved.wordIndex>=0 && saved.wordIndex<words.length) state.wordIndex=saved.wordIndex;
  const filter=saved.vocabFilter;
  if(filter&&['all','A1','A2','B1','B2'].includes(filter.level)){
   state.vocabFilter.level=filter.level;
   if(topics.some(t=>t.id===filter.topic&&(filter.level==='all'||t.level===filter.level)))state.vocabFilter.topic=filter.topic;
  }
  if(Array.isArray(saved.completedLessons)) state.completedLessons=[...new Set(saved.completedLessons.filter(x=>syllableLessons.some(lesson=>lesson.ko===x)))];
  if(Number.isInteger(saved.lessonIndex) && saved.lessonIndex>=0 && saved.lessonIndex<syllableLessons.length) state.lessonIndex=saved.lessonIndex;
  if(Array.isArray(saved.completedDays)){
   for(const entry of saved.completedDays){if(entry && entry.day===state.completedDays.length+1 && entry.day<=PLAN_DAYS && validDate(entry.date) && entry.date<=localDate() && (!state.completedDays.length || entry.date>state.completedDays.at(-1).date))state.completedDays.push({day:entry.day,date:entry.date});}
  }
  if(Array.isArray(saved.mistakes))state.mistakes=[...new Set(saved.mistakes.filter(id=>learningItems.some(x=>x.id===id)))];
  const d=saved.daily;
  if(d && d.date===localDate() && d.day===activeDay() && Number.isSafeInteger(d.answers) && d.answers>=0 && Number.isSafeInteger(d.correct) && d.correct>=0 && d.correct<=d.answers){
   const ids=planForToday().items.map(item=>planForToday().type+':'+item.ko);
   state.daily={date:d.date,day:d.day,answers:d.answers,correct:d.correct,studied:Array.isArray(d.studied)?[...new Set(d.studied.filter(id=>ids.includes(id)))]:[]};
  }

  }
 if(saved?.srs&&typeof saved.srs==='object'&&!Array.isArray(saved.srs)){for(const [id,e] of Object.entries(saved.srs)){if(learningItems.some(x=>x.id===id)&&e&&Number.isFinite(e.interval)&&e.interval>=1&&Number.isFinite(e.ease)&&validDate(e.due))state.srs[id]={interval:Math.min(365,Math.round(e.interval)),ease:Math.min(2.5,Math.max(1.3,e.ease)),due:e.due,reps:Number.isSafeInteger(e.reps)&&e.reps>=0?Math.min(e.reps,10000):0,lastReviewed:validDate(e.lastReviewed)?e.lastReviewed:null};}}
  return state;
 } finally {state=previous;}
}
function readProgress(key){
 try{const raw=localStorage.getItem(key);return normalizeProgress(raw?JSON.parse(raw):null);}
 catch(error){$('storage-notice').textContent='Chưa đọc được tiến độ đã lưu. Bạn vẫn có thể học trong phiên này.';return emptyProgress();}
}
state=readProgress(KEY);
function save(silent=false){
 if(window.tabAccess && !window.tabAccess.writable())return false;
 let stored=true;
 try{localStorage.setItem(KEY,JSON.stringify(state));$('storage-notice').textContent='';}
 catch(error){stored=false;$('storage-notice').textContent='Trình duyệt đang chặn lưu tiến độ. Hãy cho phép dữ liệu trang web và xuất bản sao lưu trước khi đóng trang.';}
 if(!silent)window.dispatchEvent(new CustomEvent('progress-saved',{detail:{key:KEY}}));
 return stored;
}
function updateStats(){ $('score').textContent=state.score; $('streak').textContent=state.streak; $('learned').textContent=state.learned.length+'/'+total; $('progress').max=total; $('progress').value=state.learned.length; }
function markLearned(id){if(!state.learned.includes(id)){state.learned.push(id);save();updateStats();}}
function activeDay(){return state.completedDays.find(x=>x.date===localDate())?.day || Math.min(PLAN_DAYS,state.completedDays.length+1);}
function planForToday(){return dailyPlan[activeDay()-1];}
function isTodayDone(){return state.completedDays.some(x=>x.date===localDate());}
function ensureDaily(){if(!state.daily || state.daily.date!==localDate() || state.daily.day!==activeDay())state.daily={date:localDate(),day:activeDay(),studied:[],answers:0,correct:0};return state.daily;}
function canFinishDaily(){const d=state.daily,p=planForToday();return !!d && d.date===localDate() && d.day===p.day && p.items.every(item=>d.studied.includes(p.type+':'+item.ko)) && d.answers>=5 && d.correct>=3;}
function dailyStreak(){const dates=new Set(state.completedDays.map(x=>x.date));let date=localDate(),count=0;if(!dates.has(date))date=dayBefore(date);while(dates.has(date)){count++;date=dayBefore(date);}return count;}
// Lịch ôn đơn giản lấy cảm hứng từ SM-2, không phải SM-2 chuẩn.
function updateSRS(id,correct){
 const today=localDate();
 const e=state.srs[id]||{interval:1,ease:2.5,due:today,reps:0};
 if(correct && e.lastReviewed===today)return;
 if(correct){
  e.reps=(e.reps||0)+1;
  e.interval=e.reps===1?1:e.reps===2?6:Math.round((e.interval||1)*(e.ease||2.5));
  e.ease=Math.min(2.5,(e.ease||2.5)+0.1);
 }else{
  e.reps=0;e.interval=1;e.ease=Math.max(1.3,(e.ease||2.5)-0.2);
 }
 e.interval=Math.min(365,e.interval);e.lastReviewed=today;
 const due=new Date(today+'T12:00:00Z');
 due.setUTCDate(due.getUTCDate()+e.interval);
 e.due=due.toISOString().slice(0,10);
 state.srs[id]=e;
}
function getDueCount(){const today=localDate();return learningItems.filter(x=>state.srs[x.id]?.due<=today).length;}

function renderHome(){
 $('review-due').textContent='Ôn đến hạn · '+getDueCount()+' mục';
 $('review-due').disabled=getDueCount()===0;
 const p=planForToday(),done=isTodayDone(),allDone=state.completedDays.length===PLAN_DAYS;
 $('love-message').textContent=loveMessages[(p.day-1)%loveMessages.length];
 $('today-label').textContent=new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'numeric',month:'numeric'}).format(new Date());
 $('daily-week').textContent='Tuần '+Math.ceil(p.day/7)+' · Ngày '+p.day+' / '+PLAN_DAYS;$('daily-title').textContent=p.title;
 $('daily-description').textContent=done?'Em đã dành một chút thời gian cho mình hôm nay. Anh tự hào về em ♡':allDone?'Em đã đi hết '+PLAN_DAYS+' bài. Em tiếp tục ôn những điều muốn nhớ lâu nhé.':'Một cuộc hẹn 10–15 phút. Học chậm, nghe kỹ, không cần vội.';
 $('daily-task-label').textContent='Xem '+p.items.length+' '+(p.type==='letter'?'chữ cái':p.type==='word'?'từ quen thuộc':'âm tiết mẫu');
 $('start-daily').textContent=done?'Xem lại bài hôm nay ♡':allDone?'Ôn lại bài đã học →':state.daily?.date===localDate()?'Tiếp tục bài hôm nay →':'Bắt đầu bài hôm nay →';
 $('daily-status').textContent=done?(allDone?PLAN_DAYS+' cuộc hẹn đã hoàn thành. Em vẫn có thể học và ôn mỗi ngày.':'Bài tiếp theo chờ em vào ngày mai. Hôm nay có thể ôn thêm nếu em thích.'):'Nếu lỡ một ngày, em tiếp tục từ bài đang học. Không sao cả nhé.';
 $('day-streak').textContent=dailyStreak();$('days-completed').textContent=state.completedDays.length+'/'+PLAN_DAYS;
 $('day-grid').replaceChildren();dailyPlan.forEach(plan=>{const chip=document.createElement('span');const complete=state.completedDays.some(x=>x.day===plan.day);chip.className='day-chip'+(complete?' done':'')+(plan.day===p.day?' current':'');chip.textContent=complete?'♡':plan.day;chip.setAttribute('aria-label','Ngày '+plan.day+': '+plan.title+(complete?', đã hoàn thành':plan.day===p.day?', bài hiện tại':', sắp tới'));$('day-grid').append(chip);});
 if(!$('daily-study').hidden)renderDailyStudy();renderDailyPracticeStatus();if($("back-vocab"))$("back-vocab").hidden=!topicPracticeMode;
}
function renderGrammarCard(grammarId){
 const gc=$('daily-grammar');if(!gc)return;
 if(!grammarId){gc.hidden=true;return;}
 const g=grammar.find(x=>x.id===grammarId);
 if(!g){gc.hidden=true;return;}
 gc.hidden=false;gc.replaceChildren();
 const eyebrow=document.createElement('div');eyebrow.className='eyebrow';eyebrow.textContent='✦ Ngữ pháp bài này — '+g.level;
 const title=document.createElement('strong');title.textContent=g.title;
 const tip=document.createElement('p');tip.textContent=g.tip;
 const formula=document.createElement('code');formula.className='grammar-formula';formula.textContent=g.formula;
 const exList=document.createElement('div');exList.className='grammar-examples';
 g.examples.forEach(ex=>{
  const row=document.createElement('div');row.className='grammar-ex';
  const ko=document.createElement('span');ko.lang='ko';ko.className='grammar-ko';ko.textContent=ex.ko;
  const sep=document.createTextNode(' → ');
  const vi=document.createElement('span');vi.className='grammar-vi';vi.textContent=ex.vi;
  row.append(ko,sep,vi);exList.append(row);
 });
 const note=document.createElement('p');note.className='note';note.textContent='💡 '+g.note;
 gc.append(eyebrow,title,tip,formula,exList,note);
}
function renderDailyStudy(){
 const p=planForToday(),d=ensureDaily();$('daily-study-title').textContent=p.title;renderGrammarCard(p.grammarId);$('daily-items').replaceChildren();
 p.items.forEach(item=>{const id=p.type+':'+item.ko,button=document.createElement('button');button.className='study-item';button.setAttribute('aria-pressed',String(d.studied.includes(id)));
  const ko=document.createElement('span');ko.className='ko';ko.lang='ko';ko.textContent=item.ko;
  const roman=document.createElement('span');roman.className='romanization';roman.textContent=item.roman;
  const meaning=document.createElement('span');meaning.className='study-meaning';meaning.textContent=(item.meaning||item.hint||item.explanation)+' · Chạm để nghe';button.append(ko,roman,meaning);
  button.addEventListener('click',()=>{const current=ensureDaily();if(current.day!==p.day){renderHome();return;}if(!current.studied.includes(id))current.studied.push(id);if(p.type!=='syllable')markLearned(id);save();button.setAttribute('aria-pressed','true');speak(item.say||item.ko);updateDailyStudyStatus();});$('daily-items').append(button);
 });updateDailyStudyStatus();
}
function updateDailyStudyStatus(){const d=ensureDaily(),p=planForToday();$('daily-study-progress').textContent='Đã xem '+d.studied.length+'/'+p.items.length+' mục · Đã làm '+d.answers+' câu, đúng '+d.correct+' câu';$('finish-daily').disabled=!canFinishDaily() || isTodayDone() || state.completedDays.length===PLAN_DAYS;$('daily-finish-feedback').textContent=isTodayDone()?'Hôm nay đã hoàn thành rồi. Em có thể ôn lại nhẹ nhàng ♡':canFinishDaily()?'Đủ một buổi học nhỏ rồi! Em bấm Hoàn thành để lưu cuộc hẹn nhé.':'Xem đủ các thẻ và làm ít nhất 5 câu, đúng ít nhất 3 câu nhé.';}
function renderDailyPracticeStatus(){const active=dailyMode && !isTodayDone() && state.completedDays.length<PLAN_DAYS; $('practice-daily').hidden=!active;$('back-daily').hidden=!active;if(active){const d=ensureDaily();$('practice-daily').textContent='Bài hôm nay · '+d.answers+' câu đã làm · '+d.correct+' câu đúng / mục tiêu 3. '+(canFinishDaily()?'Em có thể về bài hôm nay để hoàn thành ♡':'Mục tiêu: ít nhất 5 câu và 3 câu đúng.');}}
$('start-daily').addEventListener('click',()=>{$('daily-study').hidden=false;ensureDaily();renderDailyStudy();save();$('daily-study').scrollIntoView({block:'start',behavior:'instant'});});
$('close-daily').addEventListener('click',()=>{$('daily-study').hidden=true;});
$('daily-practice').addEventListener('click',()=>{resetPractice();dailyMode=!isTodayDone() && state.completedDays.length<PLAN_DAYS;ensureDaily();save();showScreen('practice');});
$('finish-daily').addEventListener('click',()=>{if(!canFinishDaily() || isTodayDone() || state.completedDays.length===PLAN_DAYS)return;state.completedDays.push({day:activeDay(),date:localDate()});dailyMode=false;save();renderHome();});
$('back-daily').addEventListener('click',()=>showScreen('home'));
$('free-practice').addEventListener('click',()=>{resetPractice();newQuestion();});
// Giọng đọc được tải bất đồng bộ trên một số trình duyệt.
const synth = window.speechSynthesis;
let koreanVoice = null;
function loadVoices(){if(synth) koreanVoice=synth.getVoices().find(v=>/^ko(?:-|_|$)/i.test(v.lang)) || null;if(koreanVoice) $('speech-notice').textContent='';}
if(synth){loadVoices();synth.addEventListener('voiceschanged',loadVoices);}
function speak(text){
 loadVoices();
 if(!synth || typeof window.SpeechSynthesisUtterance!=='function'){ $('speech-notice').textContent='Trình duyệt này chưa hỗ trợ đọc tiếng Hàn. Hãy thử Safari hoặc Chrome trên điện thoại.';return; }
 if(!koreanVoice){$('speech-notice').textContent='Chưa tìm thấy giọng Hàn. iPhone: Cài đặt → Trợ năng → Nội dung được đọc (hoặc Đọc & nói) → Giọng nói → Tiếng Hàn. Android: tìm “Chuyển văn bản thành giọng nói” trong Cài đặt, chọn bộ máy đọc và tải giọng tiếng Hàn. Tên mục tùy máy. Sau đó mở lại trình duyệt và bấm Nghe.';return;}
 try{ if(synth.speaking || synth.pending)synth.cancel();if(synth.paused)synth.resume();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='ko-KR';utterance.voice=koreanVoice;utterance.rate=.8;utterance.onerror=event=>{if(!['canceled','interrupted'].includes(event.error)) $('speech-notice').textContent='Chưa phát được âm thanh. Kiểm tra âm lượng, giọng Hàn đã tải và thử bấm Nghe lại nhé.';};synth.speak(utterance); }catch(error){$('speech-notice').textContent='Chưa phát được giọng đọc. Hãy mở lại trình duyệt và thử lần nữa.';}
}
function renderLetters(){
 for(const group of ['vowels','extended_vowels','compound_vowels','consonants','tense_consonants']){
  $(group).replaceChildren();
  letters.filter(x=>x.group===group).forEach(item=>{
   const learned=state.learned.includes('letter:'+item.ko);
   const button=document.createElement('button');button.className='letter'+(learned?' learned':'');button.setAttribute('aria-label',item.ko+', '+item.roman+(learned?', đã học':''));
   const ko=document.createElement('span');ko.className='ko';ko.lang='ko';ko.textContent=item.ko;
   const roman=document.createElement('span');roman.className='roman';roman.textContent=item.roman;
   button.append(ko,roman);
   if(learned){const check=document.createElement('span');check.className='check';check.textContent='✓';check.setAttribute('aria-hidden','true');button.append(check);}
   button.addEventListener('click',()=>{
    markLearned('letter:'+item.ko);button.classList.add('learned');button.setAttribute('aria-label',item.ko+', '+item.roman+', đã học');
    if(!button.querySelector('.check')){const check=document.createElement('span');check.className='check';check.textContent='✓';check.setAttribute('aria-hidden','true');button.append(check);}
    $('letter-detail').replaceChildren();
    const title=document.createElement('div');title.className='large-ko';title.lang='ko';title.textContent=item.ko;
    const romanText=document.createElement('div');romanText.className='romanization';romanText.textContent=item.roman;
    const hint=document.createElement('p');hint.textContent=item.hint;
    $('letter-detail').append(title,romanText,hint);speak(item.say);
   });$(group).append(button);
  });
 }
}
let currentTopic=state.vocabFilter.topic,currentLevel=state.vocabFilter.level,vocabIndex=0,wordRated=false;
function wordsForScope(level,topic){return words.filter(w=>(level==='all'||w.level===level)&&(topic==='all'||w.topic===topic));}
function getFilteredWords(){return wordsForScope(currentLevel,currentTopic);}
function topicName(id){return topics.find(t=>t.id===id)?.name||'Tất cả chủ đề';}
function scopeLabel(level,topic){return topic!=='all'?topicName(topic):level==='all'?'Tất cả từ vựng':'Chặng '+level;}
function setupTopicFilter(){
 const c=$('topic-filter');c.replaceChildren();$('topic-select').replaceChildren();
 $('level-filter').value=currentLevel;
 const visible=topics.filter(t=>currentLevel==='all'||t.level===currentLevel);
 for(const t of [{id:'all',name:'Tất cả chủ đề'},...visible]){
  const option=document.createElement('option');option.value=t.id;option.textContent=t.name;$('topic-select').append(option);
 }
 $('topic-select').value=currentTopic;
 for(const t of visible){
  const list=words.filter(w=>w.topic===t.id),seen=list.filter(w=>state.learned.includes('word:'+w.ko)).length;
  const b=document.createElement('button');b.className='topic-btn'+(t.id===currentTopic?' active':'');b.dataset.topic=t.id;
  b.setAttribute('aria-pressed',String(t.id===currentTopic));
  const name=document.createElement('strong');name.textContent=t.name;
  const count=document.createElement('span');count.textContent=t.level+' · '+list.length+' từ · Đã xem '+seen;
  b.append(name,count);b.addEventListener('click',()=>changeVocabularyFilter(currentLevel,t.id));c.append(b);
 }
 const index=getFilteredWords().findIndex(w=>w===words[state.wordIndex]);vocabIndex=Math.max(0,index);
}
function changeVocabularyFilter(level,topic){
 currentLevel=level;currentTopic=topic;state.vocabFilter={level,topic};
 const first=getFilteredWords()[0];if(first)state.wordIndex=words.indexOf(first);
 setupTopicFilter();renderWord();save();$('topic-action-message').textContent='';
}
$('level-filter').addEventListener('change',()=>changeVocabularyFilter($('level-filter').value,'all'));
$('topic-select').addEventListener('change',()=>changeVocabularyFilter(currentLevel,$('topic-select').value));
function renderTopicOverview(){
 const fw=getFilteredWords(),seen=fw.filter(w=>state.learned.includes('word:'+w.ko)).length;
 const due=fw.filter(w=>state.srs['word:'+w.ko]?.due<=localDate()).length;
 $('topic-overview').textContent=scopeLabel(currentLevel,currentTopic)+' · '+fw.length+' từ · '+seen+' đã xem · '+due+' đến hạn';
 $('review-topic-btn').textContent='Ôn đến hạn · '+due+' từ';
}
function renderWord(){
 const fw=getFilteredWords();$('word-card').hidden=!fw.length;$('practice-topic-btn').disabled=!fw.length;
 if(!fw.length){renderTopicOverview();return;}
 vocabIndex=((vocabIndex%fw.length)+fw.length)%fw.length;const item=fw[vocabIndex];state.wordIndex=words.indexOf(item);
 $('word-counter').textContent='Thẻ '+(vocabIndex+1)+' / '+fw.length;$('word-level').textContent=item.level+' · '+topicName(item.topic);
 $('word-ko').textContent=item.ko;$('word-roman').textContent=item.roman;$('word-meaning').textContent=item.meaning;
 $('word-example-ko').textContent=item.exampleKo;$('word-example-vi').textContent=item.exampleVi;
 $('word-details').hidden=true;$('reveal-word').hidden=false;$('reveal-word').setAttribute('aria-expanded','false');
 wordRated=false;$('remember-word').disabled=false;$('again-word').disabled=false;$('word-rating-status').textContent='';
 markLearned('word:'+item.ko);renderTopicOverview();
}
$('reveal-word').addEventListener('click',()=>{$('word-details').hidden=false;$('reveal-word').setAttribute('aria-expanded','true');});
function rateWord(correct){
 if(wordRated||$('word-details').hidden)return;wordRated=true;
 const item=getFilteredWords()[vocabIndex],id='word:'+item.ko;updateSRS(id,correct);
 if(correct)state.mistakes=state.mistakes.filter(x=>x!==id);else if(!state.mistakes.includes(id))state.mistakes.push(id);
 save();$('remember-word').disabled=true;$('again-word').disabled=true;
 $('word-rating-status').textContent=(correct?'Một bước nhỏ đáng yêu ♡':'Không sao, em sẽ gặp lại từ này nhé ♡')+' · Ôn tiếp: '+state.srs[id].due.split('-').reverse().join('/');renderTopicOverview();
}
$('remember-word').addEventListener('click',()=>rateWord(true));$('again-word').addEventListener('click',()=>rateWord(false));
$('listen-word').addEventListener('click',()=>speak(getFilteredWords()[vocabIndex].ko));
$('listen-example').addEventListener('click',()=>speak(getFilteredWords()[vocabIndex].exampleKo));
function moveWord(step){const fw=getFilteredWords();if(!fw.length)return;vocabIndex=(vocabIndex+step+fw.length)%fw.length;renderWord();save();}
$('prev-word').addEventListener('click',()=>moveWord(-1));$('next-word').addEventListener('click',()=>moveWord(1));
// Hangul = U+AC00 + (phụ âm đầu × 21 + nguyên âm) × 28 + phụ âm cuối.
// Nguồn: https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-3/
function composeSyllable(initial,vowel,final=''){
 const l=initialOrder.indexOf(initial),v=vowelOrder.indexOf(vowel),t=finalOrder.indexOf(final);
 if(initial.length!==1 || vowel.length!==1 || l<0 || v<0 || t<0) return '';
 return String.fromCodePoint(0xAC00+(l*21+v)*28+t);
}
function renderSyllable(){
 const initial=$('initial-select').value,vowel=$('vowel-select').value,final=$('final-select').value;
 $('syllable-result').textContent=composeSyllable(initial,vowel,final);
 $('syllable-parts').textContent=[initial,vowel,...(final?[final]:[])].join(' + ');
 $('syllable-hint').textContent=(initial==='ㅇ'?'ㅇ đầu âm không phát âm. ':'')+(final?'Phụ âm cuối nằm dưới khối chữ.':'Âm tiết này không có phụ âm cuối.');
}
function renderLesson(){
 const lesson=syllableLessons[state.lessonIndex];
 $('lesson-ko').textContent=lesson.ko;$('lesson-roman').textContent=lesson.roman;$('lesson-explanation').textContent=lesson.explanation;
 $('lesson-progress').textContent=state.completedLessons.length+' / '+syllableLessons.length+' ví dụ đã đọc';
 $('lesson-feedback').textContent=state.completedLessons.length===syllableLessons.length?'Bạn đã đọc cả 6 ví dụ! Thử phần Luyện tập để nhớ lâu hơn nhé.':state.completedLessons.includes(lesson.ko)?'✓ Bạn đã đọc ví dụ này. Có thể ôn lại bất cứ lúc nào.':'';
 document.querySelectorAll('#lesson-buttons button').forEach((button,index)=>{button.setAttribute('aria-pressed',String(index===state.lessonIndex));button.textContent=syllableLessons[index].ko+(state.completedLessons.includes(syllableLessons[index].ko)?' ✓':'');});
 $('initial-select').value=lesson.initial;$('vowel-select').value=lesson.vowel;$('final-select').value=lesson.final;renderSyllable();
}
function setupSyllables(){
 for(const [id,items] of [ ['initial-select',letters.filter(x=>x.group==='consonants').map(x=>x.ko)],['vowel-select',letters.filter(x=>x.group==='vowels').map(x=>x.ko)],['final-select',['','ㄱ','ㄴ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ']] ]){
  for(const value of items){const option=document.createElement('option');option.value=value;option.textContent=value||'Không';$(id).append(option);}
  $(id).addEventListener('change',renderSyllable);
 }
 syllableLessons.forEach((lesson,index)=>{const button=document.createElement('button');button.lang='ko';button.setAttribute('aria-label','Ví dụ '+lesson.ko);button.addEventListener('click',()=>{state.lessonIndex=index;renderLesson();save();});$('lesson-buttons').append(button);});
 renderLesson();
}
$('listen-syllable').addEventListener('click',()=>speak($('syllable-result').textContent));
$('listen-lesson').addEventListener('click',()=>speak(syllableLessons[state.lessonIndex].ko));
$('prev-lesson').addEventListener('click',()=>{state.lessonIndex=((state.lessonIndex-1)%syllableLessons.length+syllableLessons.length)%syllableLessons.length;renderLesson();save();});
$('complete-lesson').addEventListener('click',()=>{const lesson=syllableLessons[state.lessonIndex];if(!state.completedLessons.includes(lesson.ko))state.completedLessons.push(lesson.ko);state.lessonIndex=(state.lessonIndex+1)%syllableLessons.length;renderLesson();save();});
// Trộn Fisher–Yates để đáp án và câu hỏi không có thứ tự cố định.
function shuffle(items){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
let screen='home', question=null, timer=null, previousQuestion='',dailyMode=false,reviewMode=false,topicPracticeMode=null;
function resetPractice(){clearTimeout(timer);timer=null;dailyMode=false;reviewMode=false;topicPracticeMode=null;question=null;$('session-summary').hidden=true;$('question-panel').hidden=false;$('back-vocab').hidden=true;$('topic-session-status').hidden=true;}
$('review-due').addEventListener('click',()=>{resetPractice();reviewMode=true;showScreen('practice');});
$('listen-question').addEventListener('click',()=>{if(question?.audio)speak(question.audio);});
function startTopicSession(dueOnly=false){
 const pool=getFilteredWords(),today=localDate();
 const available=pool.filter(w=>!dueOnly||state.srs['word:'+w.ko]?.due<=today);
 if(!available.length){$('topic-action-message').textContent='Chưa có từ đến hạn trong nhóm này. Em có thể học thẻ mới hoặc luyện 10 câu nhé ♡';return;}
 resetPractice();topicPracticeMode={topic:currentTopic,level:currentLevel,dueOnly,queue:shuffle(available).slice(0,10).map(w=>'word:'+w.ko),index:0,results:[]};
 $('topic-action-message').textContent='';showScreen('practice');
}
$('practice-topic-btn').addEventListener('click',()=>startTopicSession(false));
$('review-topic-btn').addEventListener('click',()=>startTopicSession(true));
$('back-vocab').addEventListener('click',()=>{resetPractice();showScreen('vocabulary');});
$('repeat-topic').addEventListener('click',()=>startTopicSession(false));
function finishTopicSession(){
 const session=topicPracticeMode;question=null;$('question-panel').hidden=true;$('session-summary').hidden=false;
 const correct=session.results.filter(r=>r.correct).length;
 $('session-result').textContent=correct+' / '+session.results.length+' câu đúng';
 $('session-note').textContent=scopeLabel(session.level,session.topic)+' · Tiến độ đã ghi nhận. Lịch ôn giúp em gặp lại từng từ vào những ngày tới.';
 $('session-mistakes').replaceChildren();
 const mistakes=session.results.filter(r=>!r.correct);
 if(!mistakes.length){const p=document.createElement('p');p.textContent='Em đã trả lời đúng cả lượt này ♡ Hẹn em ở buổi ôn tiếp theo.';$('session-mistakes').append(p);}
 for(const result of mistakes){
  const item=words.find(w=>'word:'+w.ko===result.id),card=document.createElement('div');card.className='mistake-card';
  const ko=document.createElement('strong');ko.lang='ko';ko.textContent=item.ko;
  const meaning=document.createElement('p');meaning.textContent=item.meaning;
  const example=document.createElement('p');example.lang='ko';example.textContent=item.exampleKo;
  const vi=document.createElement('p');vi.textContent=item.exampleVi;
  const listen=document.createElement('button');listen.textContent='🔊 Nghe '+item.ko;listen.addEventListener('click',()=>speak(item.ko));
  card.append(ko,meaning,example,vi,listen);$('session-mistakes').append(card);
 }
 $('topic-session-status').textContent='Đã hoàn thành '+session.results.length+' câu';$('session-result').focus();
}
function newQuestion(){
 clearTimeout(timer);timer=null;
 if(state.daily?.date!==localDate())dailyMode=false;
 if(isTodayDone() || state.completedDays.length===PLAN_DAYS)dailyMode=false;
 const plan=planForToday(),ids=new Set(plan.items.map(item=>plan.type+':'+item.ko));
 let available=dailyMode?learningItems.filter(x=>ids.has(x.id) || state.mistakes.includes(x.id)):learningItems;
 if(topicPracticeMode){
  if(question?.answered)topicPracticeMode.index++;
  if(topicPracticeMode.index>=topicPracticeMode.queue.length){finishTopicSession();return;}
  available=learningItems.filter(x=>x.id===topicPracticeMode.queue[topicPracticeMode.index]);
 }
 if(reviewMode&&!dailyMode){available=learningItems.filter(x=>state.srs[x.id]?.due<=localDate());if(!available.length){reviewMode=false;showScreen('home');return;}}
 const filtered=available.filter(x=>x.id!==previousQuestion),candidates=filtered.length?filtered:available;
 const selected=candidates[Math.floor(Math.random()*candidates.length)];
 const {type,item,id}=selected;previousQuestion=id;
 loadVoices();const listening=type==='word'&&!!koreanVoice&&typeof window.SpeechSynthesisUtterance==='function'&&Math.random()<0.35;
 const pool=topicPracticeMode?wordsForScope(topicPracticeMode.level,topicPracticeMode.topic):type==='letter'?letters:type==='word'?words:syllableLessons;const field=listening?'ko':type==='word'?'meaning':'roman';
 question={answer:item[field],answered:false,id,item,field,daily:dailyMode,date:localDate(),day:activeDay()};
 $('question-panel').hidden=false;$('session-summary').hidden=true;
 $('topic-session-status').hidden=!topicPracticeMode;
 if(topicPracticeMode)$('topic-session-status').textContent=scopeLabel(topicPracticeMode.level,topicPracticeMode.topic)+' · '+(topicPracticeMode.dueOnly?'Ôn đến hạn · ':'')+'Câu '+(topicPracticeMode.index+1)+' / '+topicPracticeMode.queue.length;
 renderDailyPracticeStatus();if($("back-vocab"))$("back-vocab").hidden=!topicPracticeMode;
 $('question-type').textContent=type==='letter'?'CHỮ CÁI • Phiên âm':type==='word'?'TỪ VỰNG • Nghĩa tiếng Việt':'GHÉP ÂM • Tập đọc';$('question-ko').textContent=item.ko;$('question-prompt').textContent=type==='word'?'Từ này có nghĩa là gì?':type==='syllable'?'Âm tiết này đọc thế nào?':'Chữ này có phiên âm nào?';
 $('listen-question').hidden=!listening;question.audio=listening?item.ko:null;
 if(listening){$('question-type').textContent='LUYỆN NGHE';$('question-ko').textContent='♪';$('question-prompt').textContent='Bấm Nghe rồi chọn từ em nghe được.';}
 const moveFocus=$('answers').contains(document.activeElement) || document.activeElement===$('next-question');
 $('feedback').textContent='';$('feedback').className='feedback';$('next-question').hidden=true;$('answers').replaceChildren();
 // Không đánh đố bài nghe bằng hai cách viết chỉ khác dấu câu/khoảng trắng.
 const spokenKey=value=>value.replace(/[\s?!.,…]/g,'');
 const wrong=shuffle([...new Set(pool.map(x=>x[field]))].filter(x=>x!==question.answer&&(!listening||spokenKey(x)!==spokenKey(question.answer)))).slice(0,3);
 shuffle([question.answer,...wrong]).forEach(answer=>{const button=document.createElement('button');button.className='answer';button.lang=listening?'ko':'vi';button.textContent=answer;button.addEventListener('click',()=>answerQuestion(answer,button));$('answers').append(button);});
 if(moveFocus)$('answers').firstElementChild.focus({preventScroll:true});
}
function answerQuestion(answer,button){
 if(!question || question.answered)return;question.answered=true;const correct=answer===question.answer;
 document.querySelectorAll('.answer').forEach(node=>{node.disabled=true;if(node.textContent===question.answer)node.classList.add('correct');});
 if(correct){state.score=Math.min(Number.MAX_SAFE_INTEGER,state.score+10);state.streak=Math.min(Number.MAX_SAFE_INTEGER,state.streak+1);$('feedback').textContent='Đúng rồi! +10 điểm 🌷';}
 else{state.streak=0;button.classList.add('wrong');$('feedback').textContent='Chưa đúng. Đáp án: '+question.answer+'. Thử tiếp nhé!';}
 if(correct)state.mistakes=state.mistakes.filter(id=>id!==question.id);else if(!state.mistakes.includes(question.id))state.mistakes.push(question.id);updateSRS(question.id,correct);
 if(topicPracticeMode)topicPracticeMode.results.push({id:question.id,correct,answer});
 if(question.daily && question.date===localDate() && question.day===activeDay() && !isTodayDone()){
  const daily=ensureDaily();daily.answers=Math.min(Number.MAX_SAFE_INTEGER,daily.answers+1);if(correct)daily.correct=Math.min(daily.answers,daily.correct+1);
 }
 renderDailyPracticeStatus();if($("back-vocab"))$("back-vocab").hidden=!topicPracticeMode;
 $('feedback').className='feedback '+(correct?'good':'bad');save();updateStats();$('next-question').hidden=false;
 $('next-question').focus({preventScroll:true});
 // Cho thời gian đọc phản hồi; người dùng có thể chuyển ngay bằng nút.
 if(!topicPracticeMode)timer=setTimeout(()=>{if(screen==='practice' && !document.hidden)newQuestion();},2400);
}
$('next-question').addEventListener('click',newQuestion);
function showScreen(next){
 const screens=['home','alphabet','syllables','vocabulary','practice','account','onboarding','roadmap','settings','lesson-outline','lesson'];
 if(!screens.includes(next))return;
 clearTimeout(timer);timer=null;screen=next;
 for(const id of screens) $(id).hidden=id!==screen;
 document.querySelector('.skip-link').href='#'+screen+'-title';
 document.querySelectorAll('nav button').forEach(node=>{if(node.dataset.screen===screen)node.setAttribute('aria-current','page');else node.removeAttribute('aria-current');});
 if(screen==='home')renderHome();if(screen==='alphabet')renderLetters();if(screen==='vocabulary'){setupTopicFilter();renderWord();}if(screen==='practice')newQuestion();
 $(screen+'-title').focus();window.scrollTo({top:0,behavior:'instant'});
 window.dispatchEvent(new CustomEvent('screen-changed',{detail:{screen:next}}));
}
document.querySelectorAll('nav button').forEach(button=>button.addEventListener('click',()=>{resetPractice();showScreen(button.dataset.screen);}));
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);timer=null;if(synth)synth.cancel();}else{if(state.daily?.date!==localDate())dailyMode=false;renderHome();}});
updateStats();renderLetters();setupSyllables();renderHome();

// Cầu nối nhỏ cho tài khoản; không đưa mã xác thực vào dữ liệu học.
window.progressStore={
 get:()=>({version:1,progress:JSON.parse(JSON.stringify(state))}),
 key:()=>KEY,
 guest:()=>({version:1,progress:readProgress(BASE_KEY)}),
 apply(document,{silent=false}={}){
  if(document?.version!==1 || !document.progress || !Array.isArray(document.progress.learned) || !Number.isSafeInteger(document.progress.score))throw new Error('Bản tiến độ không đúng định dạng hoặc thuộc phiên bản mới hơn.');
  state=normalizeProgress(document.progress);const stored=save(silent);this.refresh();return stored;
 },
 switchAccount(id){
  if(id && !/^[a-f0-9-]{36}$/i.test(id))throw new Error('Tài khoản không hợp lệ.');
  KEY=id?BASE_KEY+':'+id:BASE_KEY;state=readProgress(KEY);this.refresh();
  window.dispatchEvent(new Event('progress-scope-changed'));
 },
 reload(){state=readProgress(KEY);this.refresh();},
 updatePlatform(update){
  if(window.tabAccess&&!window.tabAccess.writable())return false;
  const draft=PlatformEngine.normalize(state.platform);update(draft);state.platform=PlatformEngine.normalize(draft);
  return save();
 },
 learningAction(action){
  if(window.tabAccess&&!window.tabAccess.writable())return {error:'Tab này chưa có quyền lưu tiến độ.'};
  const result=LessonEngine.transition(state.platform.learning,action);
  if(result.error)return result;
  state.platform.learning=result.data;
  state.platform.events.push(...result.events.map(e=>({...e,date:localDate()})));
  state.platform.events=state.platform.events.slice(-100);
  for(const e of result.events)if(e.type==='vocabulary_seen'&&validIds.has(e.entityId)&&!state.learned.includes(e.entityId))state.learned.push(e.entityId);
  state.score=Math.min(Number.MAX_SAFE_INTEGER,state.score+result.xp);
  const stored=save();updateStats();
  for(const e of result.events)window.dispatchEvent(new CustomEvent(e.type,{detail:{id:e.entityId}}));
  return {...result,stored};
 },
 refresh(){
  resetPractice();currentLevel=state.vocabFilter.level;currentTopic=state.vocabFilter.topic;$('daily-study').hidden=true;
  updateStats();renderLetters();renderLesson();renderHome();
  if(screen!=='account')showScreen('home');
  window.dispatchEvent(new Event('progress-loaded'));
 }
};
$('open-account').addEventListener('click',()=>showScreen('account'));


