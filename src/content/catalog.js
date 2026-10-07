// Dữ liệu học cố định: chữ cái, từ vựng cũ, ngữ pháp, âm tiết mẫu và lộ trình 56 bài.
// Không đọc DOM hoặc storage.
import { COURSE_CONTENT } from './course.js';
import { VOCAB_BASIC, VOCAB_FOUNDATION, VOCAB_LEGACY, VOCAB_TOPICS } from './vocabulary-basic.js';
import { VOCAB_INTERMEDIATE } from './vocabulary-intermediate.js';

// Dữ liệu độc lập: thêm mục mới ở hai mảng này.
const letters = [
  // 8 nguyen am co ban [0-7]
  { ko: 'ㅏ', roman: 'a', hint: 'a như trong "ba"', say: '아', group: 'vowels' },
  { ko: 'ㅓ', roman: 'eo', hint: 'gần âm "o", miệng mở hơn; không đọc "e-o"', say: '어', group: 'vowels' },
  { ko: 'ㅗ', roman: 'o', hint: 'gần âm "ô", môi tròn', say: '오', group: 'vowels' },
  { ko: 'ㅜ', roman: 'u', hint: 'u như trong "thu"', say: '우', group: 'vowels' },
  { ko: 'ㅡ', roman: 'eu', hint: 'gần âm "ư", môi không tròn', say: '으', group: 'vowels' },
  { ko: 'ㅣ', roman: 'i', hint: 'i như trong "đi"', say: '이', group: 'vowels' },
  { ko: 'ㅐ', roman: 'ae', hint: 'gần âm "e"; không đọc tách "a-e"', say: '애', group: 'vowels' },
  { ko: 'ㅔ', roman: 'e', hint: 'gần âm "ê"; rất gần ㅐ trong giọng hiện đại', say: '에', group: 'vowels' },
  // 14 phu am co ban [8-21]
  { ko: 'ㄱ', roman: 'g/k', hint: 'g/k nhẹ; nghe mẫu 가 (ga)', say: '가', group: 'consonants' },
  { ko: 'ㄴ', roman: 'n', hint: 'n; nghe mẫu 나 (na)', say: '나', group: 'consonants' },
  { ko: 'ㄷ', roman: 'd/t', hint: 'd/t nhẹ; nghe mẫu 다 (da)', say: '다', group: 'consonants' },
  { ko: 'ㄹ', roman: 'r/l', hint: 'r nhẹ hoặc l tùy vị trí; nghe mẫu 라 (ra)', say: '라', group: 'consonants' },
  { ko: 'ㅁ', roman: 'm', hint: 'm; nghe mẫu 마 (ma)', say: '마', group: 'consonants' },
  { ko: 'ㅂ', roman: 'b/p', hint: 'b/p nhẹ; nghe mẫu 바 (ba)', say: '바', group: 'consonants' },
  { ko: 'ㅅ', roman: 's', hint: 's; nghe mẫu 사 (sa)', say: '사', group: 'consonants' },
  { ko: 'ㅇ', roman: '∅/ng', hint: 'đầu âm: im lặng; cuối âm: ng. Mẫu 아 (a)', say: '아', group: 'consonants' },
  { ko: 'ㅈ', roman: 'j', hint: 'gần "ch" nhẹ; nghe mẫu 자 (ja)', say: '자', group: 'consonants' },
  { ko: 'ㅊ', roman: 'ch', hint: 'ch bật hơi; nghe mẫu 차 (cha)', say: '차', group: 'consonants' },
  { ko: 'ㅋ', roman: 'k', hint: 'k bật hơi; nghe mẫu 카 (ka)', say: '카', group: 'consonants' },
  { ko: 'ㅌ', roman: 't', hint: 't bật hơi; nghe mẫu 타 (ta)', say: '타', group: 'consonants' },
  { ko: 'ㅍ', roman: 'p', hint: 'p bật hơi, không phải f; nghe mẫu 파 (pa)', say: '파', group: 'consonants' },
  { ko: 'ㅎ', roman: 'h', hint: 'h; nghe mẫu 하 (ha)', say: '하', group: 'consonants' },
  // 4 nguyen am mo rong (Y-) [22-25]
  { ko: 'ㅑ', roman: 'ya', hint: 'ya — ㅏ thêm nét y đầu; mẫu 야', say: '야', group: 'extended_vowels' },
  { ko: 'ㅕ', roman: 'yeo', hint: 'yeo — gần "yuh"; mẫu 여', say: '여', group: 'extended_vowels' },
  { ko: 'ㅛ', roman: 'yo', hint: 'yo — môi tròn, có âm y đầu; mẫu 요', say: '요', group: 'extended_vowels' },
  { ko: 'ㅠ', roman: 'yu', hint: 'yu — giống "you" tiếng Anh; mẫu 유', say: '유', group: 'extended_vowels' },
  // 9 nguyen am kep [26-34]
  { ko: 'ㅘ', roman: 'wa', hint: 'ㅗ+ㅏ → wa; mẫu 와', say: '와', group: 'compound_vowels' },
  { ko: 'ㅙ', roman: 'wae', hint: 'ㅗ+ㅐ → wae; gần "we"', say: '왜', group: 'compound_vowels' },
  { ko: 'ㅚ', roman: 'oe', hint: 'ㅗ+ㅣ → oe; giọng trẻ thường đọc "we"', say: '외', group: 'compound_vowels' },
  { ko: 'ㅝ', roman: 'wo', hint: 'ㅜ+ㅓ → wo; gần "wuh"', say: '워', group: 'compound_vowels' },
  { ko: 'ㅞ', roman: 'we', hint: 'ㅜ+ㅔ → we', say: '웨', group: 'compound_vowels' },
  { ko: 'ㅟ', roman: 'wi', hint: 'ㅜ+ㅣ → wi', say: '위', group: 'compound_vowels' },
  { ko: 'ㅢ', roman: 'ui', hint: 'ㅡ+ㅣ → ui; thực tế hay đọc "ui" hoặc "i"', say: '의', group: 'compound_vowels' },
  { ko: 'ㅒ', roman: 'yae', hint: 'gần giống ㅖ trong giọng hiện đại; mẫu 얘', say: '얘', group: 'compound_vowels' },
  { ko: 'ㅖ', roman: 'ye', hint: 'ye; mẫu 예', say: '예', group: 'compound_vowels' },
  // 5 phu am cang [35-39]
  { ko: 'ㄲ', roman: 'kk', hint: 'k căng, không bật hơi, mạnh hơn ㄱ; mẫu 까', say: '까', group: 'tense_consonants' },
  { ko: 'ㄸ', roman: 'tt', hint: 't căng, không bật hơi, mạnh hơn ㄷ; mẫu 따', say: '따', group: 'tense_consonants' },
  { ko: 'ㅃ', roman: 'pp', hint: 'p căng, không bật hơi, mạnh hơn ㅂ; mẫu 빠', say: '빠', group: 'tense_consonants' },
  { ko: 'ㅆ', roman: 'ss', hint: 's căng, mạnh hơn ㅅ; mẫu 싸', say: '싸', group: 'tense_consonants' },
  { ko: 'ㅉ', roman: 'jj', hint: 'j căng, mạnh hơn ㅈ; mẫu 짜', say: '짜', group: 'tense_consonants' }
];
const words = [
  // ── Cũ (index 0–29, giữ nguyên thứ tự) ──
  { ko: '안녕하세요', roman: 'annyeonghaseyo', meaning: 'Xin chào', topic: 'chào hỏi' },
  { ko: '감사합니다', roman: 'gamsahamnida', meaning: 'Cảm ơn', topic: 'chào hỏi' },
  { ko: '네', roman: 'ne', meaning: 'Vâng / Có', topic: 'giao tiếp' },
  { ko: '아니요', roman: 'aniyo', meaning: 'Không', topic: 'giao tiếp' },
  { ko: '미안해요', roman: 'mianhaeyo', meaning: 'Xin lỗi', topic: 'chào hỏi' },
  { ko: '사랑해요', roman: 'saranghaeyo', meaning: 'Tôi yêu bạn', topic: 'tình cảm' },
  { ko: '보고 싶어요', roman: 'bogo sipeoyo', meaning: 'Tôi nhớ bạn', topic: 'tình cảm' },
  { ko: '맛있어요', roman: 'masisseoyo', meaning: 'Ngon quá', topic: 'ăn uống' },
  { ko: '좋아요', roman: 'joayo', meaning: 'Tốt / Thích', topic: 'giao tiếp' },
  { ko: '물', roman: 'mul', meaning: 'Nước', topic: 'ăn uống' },
  { ko: '밥', roman: 'bap', meaning: 'Cơm', topic: 'ăn uống' },
  { ko: '이름', roman: 'ireum', meaning: 'Tên', topic: 'bản thân' },
  { ko: '안녕', roman: 'annyeong', meaning: 'Chào / Tạm biệt (thân mật)', topic: 'chào hỏi' },
  { ko: '잘 자요', roman: 'jal jayo', meaning: 'Ngủ ngon', topic: 'chào hỏi' },
  { ko: '괜찮아요', roman: 'gwaenchanayo', meaning: 'Không sao / Ổn mà', topic: 'giao tiếp' },
  { ko: '주세요', roman: 'juseyo', meaning: 'Làm ơn cho tôi…', topic: 'giao tiếp' },
  { ko: '커피', roman: 'keopi', meaning: 'Cà phê', topic: 'ăn uống' },
  { ko: '차', roman: 'cha', meaning: 'Trà', topic: 'ăn uống' },
  { ko: '우유', roman: 'uyu', meaning: 'Sữa', topic: 'ăn uống' },
  { ko: '빵', roman: 'ppang', meaning: 'Bánh mì', topic: 'ăn uống' },
  { ko: '사과', roman: 'sagwa', meaning: 'Quả táo', topic: 'ăn uống' },
  { ko: '친구', roman: 'chingu', meaning: 'Bạn bè', topic: 'bản thân' },
  { ko: '가족', roman: 'gajok', meaning: 'Gia đình', topic: 'gia đình' },
  { ko: '집', roman: 'jip', meaning: 'Nhà', topic: 'nơi chốn' },
  { ko: '학교', roman: 'hakgyo', meaning: 'Trường học', topic: 'nơi chốn' },
  { ko: '오늘', roman: 'oneul', meaning: 'Hôm nay', topic: 'thời gian' },
  { ko: '내일', roman: 'naeil', meaning: 'Ngày mai', topic: 'thời gian' },
  { ko: '행복', roman: 'haengbok', meaning: 'Hạnh phúc', topic: 'tình cảm' },
  { ko: '예뻐요', roman: 'yeppeoyo', meaning: 'Đẹp quá', topic: 'tình cảm' },
  { ko: '고마워요', roman: 'gomawoyo', meaning: 'Cảm ơn (gần gũi)', topic: 'chào hỏi' },
  // ── Mới: chào hỏi (30–35) ──
  { ko: '만나서 반가워요', roman: 'mannaseo bangawoyo', meaning: 'Rất vui được gặp bạn', topic: 'chào hỏi' },
  { ko: '잘 지냈어요?', roman: 'jal jinaesseoyo?', meaning: 'Bạn có khỏe không?', topic: 'chào hỏi' },
  { ko: '잘 지냈어요', roman: 'jal jinaesseoyo', meaning: 'Tôi vẫn khỏe', topic: 'chào hỏi' },
  { ko: '또 봐요', roman: 'tto bwayo', meaning: 'Hẹn gặp lại', topic: 'chào hỏi' },
  { ko: '오랜만이에요', roman: 'oraenmanieyo', meaning: 'Lâu rồi không gặp', topic: 'chào hỏi' },
  { ko: '잠깐만요', roman: 'jamkkanmanyo', meaning: 'Chờ một chút', topic: 'chào hỏi' },
  // ── Mới: bản thân (36–41) ──
  { ko: '저', roman: 'jeo', meaning: 'Tôi (lịch sự)', topic: 'bản thân' },
  { ko: '나', roman: 'na', meaning: 'Tôi (thân mật)', topic: 'bản thân' },
  { ko: '이름이 뭐예요?', roman: 'ireumi mwoyeyo?', meaning: 'Tên bạn là gì?', topic: 'bản thân' },
  { ko: '학생이에요', roman: 'haksaengieyo', meaning: 'Tôi là học sinh', topic: 'bản thân' },
  { ko: '한국 사람이에요?', roman: 'hanguk saramieyo?', meaning: 'Bạn là người Hàn Quốc?', topic: 'bản thân' },
  { ko: '베트남 사람이에요', roman: 'beteunam saramieyo', meaning: 'Tôi là người Việt Nam', topic: 'bản thân' },
  // ── Mới: gia đình (42–51) ──
  { ko: '엄마', roman: 'eomma', meaning: 'Mẹ', topic: 'gia đình' },
  { ko: '아빠', roman: 'appa', meaning: 'Bố', topic: 'gia đình' },
  { ko: '오빠', roman: 'oppa', meaning: 'Anh trai (em gái gọi)', topic: 'gia đình' },
  { ko: '언니', roman: 'eonni', meaning: 'Chị gái (em gái gọi)', topic: 'gia đình' },
  { ko: '남동생', roman: 'namdongsaeng', meaning: 'Em trai', topic: 'gia đình' },
  { ko: '여동생', roman: 'yeodongsaeng', meaning: 'Em gái', topic: 'gia đình' },
  { ko: '할머니', roman: 'halmeoni', meaning: 'Bà nội / ngoại', topic: 'gia đình' },
  { ko: '할아버지', roman: 'harabeoji', meaning: 'Ông nội / ngoại', topic: 'gia đình' },
  { ko: '남자친구', roman: 'namjachingu', meaning: 'Bạn trai', topic: 'gia đình' },
  { ko: '여자친구', roman: 'yeojachingu', meaning: 'Bạn gái', topic: 'gia đình' },
  // ── Mới: ăn uống (52–59) ──
  { ko: '먹어요', roman: 'meogeoyo', meaning: 'Ăn', topic: 'ăn uống' },
  { ko: '마셔요', roman: 'masyeoyo', meaning: 'Uống', topic: 'ăn uống' },
  { ko: '배고파요', roman: 'baegopayo', meaning: 'Tôi đói', topic: 'ăn uống' },
  { ko: '배불러요', roman: 'baebulleoyo', meaning: 'Tôi no rồi', topic: 'ăn uống' },
  { ko: '맛없어요', roman: 'maseopsseoyo', meaning: 'Không ngon', topic: 'ăn uống' },
  { ko: '음식', roman: 'eumsik', meaning: 'Đồ ăn / Thức ăn', topic: 'ăn uống' },
  { ko: '식당', roman: 'sikdang', meaning: 'Nhà hàng / Quán ăn', topic: 'ăn uống' },
  { ko: '얼마예요?', roman: 'eolmayeyo?', meaning: 'Bao nhiêu tiền?', topic: 'ăn uống' },
  // ── Mới: nơi chốn (60–69) ──
  { ko: '여기', roman: 'yeogi', meaning: 'Đây / Ở đây', topic: 'nơi chốn' },
  { ko: '저기', roman: 'jeogi', meaning: 'Kia / Ở kia', topic: 'nơi chốn' },
  { ko: '어디', roman: 'eodi', meaning: 'Ở đâu?', topic: 'nơi chốn' },
  { ko: '병원', roman: 'byeongwon', meaning: 'Bệnh viện', topic: 'nơi chốn' },
  { ko: '편의점', roman: 'pyeonuijeom', meaning: 'Cửa hàng tiện lợi', topic: 'nơi chốn' },
  { ko: '카페', roman: 'kape', meaning: 'Quán cà phê', topic: 'nơi chốn' },
  { ko: '지하철', roman: 'jihacheol', meaning: 'Tàu điện ngầm', topic: 'nơi chốn' },
  { ko: '버스', roman: 'beoseu', meaning: 'Xe buýt', topic: 'nơi chốn' },
  { ko: '화장실', roman: 'hwajangsil', meaning: 'Nhà vệ sinh', topic: 'nơi chốn' },
  { ko: '공항', roman: 'gonghang', meaning: 'Sân bay', topic: 'nơi chốn' },
  // ── Mới: thời gian (70–78) ──
  { ko: '지금', roman: 'jigeum', meaning: 'Bây giờ', topic: 'thời gian' },
  { ko: '어제', roman: 'eoje', meaning: 'Hôm qua', topic: 'thời gian' },
  { ko: '아침', roman: 'achim', meaning: 'Buổi sáng', topic: 'thời gian' },
  { ko: '점심', roman: 'jeomsim', meaning: 'Buổi trưa', topic: 'thời gian' },
  { ko: '저녁', roman: 'jeonyeok', meaning: 'Buổi tối', topic: 'thời gian' },
  { ko: '주말', roman: 'jumal', meaning: 'Cuối tuần', topic: 'thời gian' },
  { ko: '월요일', roman: 'woryoil', meaning: 'Thứ Hai', topic: 'thời gian' },
  { ko: '일요일', roman: 'iryoil', meaning: 'Chủ Nhật', topic: 'thời gian' },
  { ko: '몇 시예요?', roman: 'myeot siyeyo?', meaning: 'Mấy giờ rồi?', topic: 'thời gian' },
  // ── Mới: sinh hoạt (79–88) ──
  { ko: '가요', roman: 'gayo', meaning: 'Đi', topic: 'sinh hoạt' },
  { ko: '와요', roman: 'wayo', meaning: 'Đến / Tới', topic: 'sinh hoạt' },
  { ko: '해요', roman: 'haeyo', meaning: 'Làm', topic: 'sinh hoạt' },
  { ko: '봐요', roman: 'bwayo', meaning: 'Xem / Nhìn', topic: 'sinh hoạt' },
  { ko: '자요', roman: 'jayo', meaning: 'Ngủ', topic: 'sinh hoạt' },
  { ko: '일어나요', roman: 'ireonayo', meaning: 'Thức dậy', topic: 'sinh hoạt' },
  { ko: '씻어요', roman: 'ssisseoyo', meaning: 'Rửa / Tắm', topic: 'sinh hoạt' },
  { ko: '공부해요', roman: 'gongbuhaeyo', meaning: 'Học bài', topic: 'sinh hoạt' },
  { ko: '일해요', roman: 'ilhaeyo', meaning: 'Làm việc', topic: 'sinh hoạt' },
  { ko: '쉬어요', roman: 'swieyo', meaning: 'Nghỉ ngơi', topic: 'sinh hoạt' },
  // ── Mới: tình cảm (89–94) ──
  { ko: '사랑해', roman: 'saranghae', meaning: 'Yêu (thân mật)', topic: 'tình cảm' },
  { ko: '보고 싶어', roman: 'bogo sipeo', meaning: 'Nhớ bạn (thân mật)', topic: 'tình cảm' },
  { ko: '걱정하지 마요', roman: 'geokjeonghaji mayo', meaning: 'Đừng lo lắng', topic: 'tình cảm' },
  { ko: '힘내요', roman: 'himnaeyo', meaning: 'Cố lên!', topic: 'tình cảm' },
  { ko: '잘했어요', roman: 'jalhaesseoyo', meaning: 'Làm tốt lắm!', topic: 'tình cảm' },
  { ko: '항상', roman: 'hangsang', meaning: 'Luôn luôn', topic: 'tình cảm' },
  // ── Mới: số đếm (95–104) ──
  { ko: '하나', roman: 'hana', meaning: 'Một (Hàn thuần)', topic: 'số đếm' },
  { ko: '둘', roman: 'dul', meaning: 'Hai (Hàn thuần)', topic: 'số đếm' },
  { ko: '셋', roman: 'set', meaning: 'Ba (Hàn thuần)', topic: 'số đếm' },
  { ko: '넷', roman: 'net', meaning: 'Bốn (Hàn thuần)', topic: 'số đếm' },
  { ko: '다섯', roman: 'daseot', meaning: 'Năm (Hàn thuần)', topic: 'số đếm' },
  { ko: '일', roman: 'il', meaning: '1 (Hán-Hàn)', topic: 'số đếm' },
  { ko: '이', roman: 'i', meaning: '2 (Hán-Hàn)', topic: 'số đếm' },
  { ko: '삼', roman: 'sam', meaning: '3 (Hán-Hàn)', topic: 'số đếm' },
  { ko: '사', roman: 'sa', meaning: '4 (Hán-Hàn)', topic: 'số đếm' },
  { ko: '오', roman: 'o', meaning: '5 (Hán-Hàn)', topic: 'số đếm' },
  // ── Mới: màu sắc (105–110) ──
  { ko: '빨간색', roman: 'ppalgansaek', meaning: 'Màu đỏ', topic: 'màu sắc' },
  { ko: '파란색', roman: 'paransaek', meaning: 'Màu xanh lam', topic: 'màu sắc' },
  { ko: '노란색', roman: 'noransaek', meaning: 'Màu vàng', topic: 'màu sắc' },
  { ko: '하얀색', roman: 'hayansaek', meaning: 'Màu trắng', topic: 'màu sắc' },
  { ko: '검은색', roman: 'geomeunsaek', meaning: 'Màu đen', topic: 'màu sắc' },
  { ko: '분홍색', roman: 'bunhongsaek', meaning: 'Màu hồng', topic: 'màu sắc' },
  // ── Mới: câu thực hành (111–119) ──
  { ko: '저는 학생이에요', roman: 'jeoneun haksaengieyo', meaning: 'Tôi là học sinh', topic: 'ngữ pháp' },
  { ko: '이것은 뭐예요?', roman: 'igeoseun mwoyeyo?', meaning: 'Cái này là gì?', topic: 'ngữ pháp' },
  { ko: '저는 밥을 먹어요', roman: 'jeoneun babeul meogeoyo', meaning: 'Tôi ăn cơm', topic: 'ngữ pháp' },
  { ko: '어디에 가요?', roman: 'eodie gayo?', meaning: 'Bạn đi đâu?', topic: 'ngữ pháp' },
  { ko: '뭐 먹을까요?', roman: 'mwo meogeulkkayo?', meaning: 'Ăn gì nhỉ?', topic: 'ngữ pháp' },
  { ko: '안 먹어요', roman: 'an meogeoyo', meaning: 'Không ăn', topic: 'ngữ pháp' },
  { ko: '저도요', roman: 'jeodoyo', meaning: 'Tôi cũng vậy', topic: 'giao tiếp' },
  { ko: '맞아요', roman: 'majayo', meaning: 'Đúng rồi!', topic: 'giao tiếp' },
  { ko: '오늘 날씨가 좋아요', roman: 'oneul nalssiga joayo', meaning: 'Hôm nay trời đẹp', topic: 'ngữ pháp' }
];
// Giữ nguyên 120 vị trí cũ và ID word:ko; chỉ bổ sung metadata, rồi nối từ mới.
const legacyWordCount = words.length;
const topics = VOCAB_TOPICS;
for (const word of words) Object.assign(word, VOCAB_LEGACY[word.ko]);
words.push(...VOCAB_BASIC, ...VOCAB_INTERMEDIATE);
// Nối sau toàn bộ 547 mục đã phát hành, không dịch chuyển index cũ.
words.push(...VOCAB_FOUNDATION);
// 8 bai ngu phap A1
const grammar = [
  {
    id: 'g1',
    title: 'Trật tự câu: Chủ + Tân + Động',
    level: 'A1',
    tip: 'Tiếng Hàn đặt động từ ở CUỐI câu — khác tiếng Việt hoàn toàn!',
    formula: '[Chủ ngữ] + [Tân ngữ] + [Động từ]',
    examples: [
      { ko: '저는 밥을 먹어요', roman: 'jeoneun babeul meogeoyo', vi: 'Tôi ăn cơm' },
      { ko: '저는 물을 마셔요', roman: 'jeoneun mureul masyeoyo', vi: 'Tôi uống nước' }
    ],
    note: '저는=Tôi | 밥을=cơm (tân ngữ) | 먹어요=ăn → Động từ luôn đứng cuối!'
  },
  {
    id: 'g2',
    title: 'Giới thiệu: Danh từ + 이에요/예요',
    level: 'A1',
    tip: '"Tôi là..." — 이에요 sau phụ âm, 예요 sau nguyên âm.',
    formula: '[Danh từ] + 이에요 / 예요',
    examples: [
      { ko: '저는 학생이에요', roman: 'jeoneun haksaengieyo', vi: 'Tôi là học sinh' },
      { ko: '저는 바오옌이에요', roman: 'jeoneun baoyenieyo', vi: 'Tôi là Bảo Yến' }
    ],
    note: '학생 kết thúc bằng phụ âm → 이에요. Tên kết thúc bằng nguyên âm → 예요.'
  },
  {
    id: 'g3',
    title: 'Trợ từ chủ đề 은/는',
    level: 'A1',
    tip: '"Về phần..., thì..." — 은 sau phụ âm, 는 sau nguyên âm.',
    formula: '[Danh từ] + 은 / 는',
    examples: [
      { ko: '저는 베트남 사람이에요', roman: 'jeoneun beteunam saramieyo', vi: 'Tôi là người Việt Nam' },
      { ko: '오늘은 날씨가 좋아요', roman: 'oneureun nalssiga joayo', vi: 'Hôm nay thì trời đẹp' }
    ],
    note: '은/는 thường bị bỏ qua hoặc dịch lỏng sang tiếng Việt.'
  },
  {
    id: 'g4',
    title: 'Động từ hiện tại lịch sự: -아요/-어요',
    level: 'A1',
    tip: 'Đuôi lịch sự dùng hàng ngày. ㅏ/ㅗ → 아요; còn lại → 어요.',
    formula: 'Gốc + 아요 (nếu ㅏ/ㅗ) | + 어요 (còn lại)',
    examples: [
      { ko: '먹어요', roman: 'meogeoyo', vi: 'Ăn (먹다 → 먹+어요)' },
      { ko: '가요', roman: 'gayo', vi: 'Đi (가다 → 가+아요=가요)' }
    ],
    note: 'Không chia theo ngôi! 저는/당신은/그는 đều dùng đuôi như nhau.'
  },
  {
    id: 'g5',
    title: 'Phủ định: 안 + động từ',
    level: 'A1',
    tip: 'Thêm 안 trước động từ để phủ định — đơn giản hơn tiếng Việt!',
    formula: '안 + [Động từ]',
    examples: [
      { ko: '안 먹어요', roman: 'an meogeoyo', vi: 'Không ăn' },
      { ko: '안 가요', roman: 'an gayo', vi: 'Không đi' }
    ],
    note: '못 = không thể (năng lực). 안 = không muốn/không làm.'
  },
  {
    id: 'g6',
    title: 'Câu hỏi: lên giọng cuối câu',
    level: 'A1',
    tip: 'Câu hỏi Có/Không: giữ nguyên câu, lên giọng ở cuối.',
    formula: '[Câu bình thường] + ↗ (lên giọng)',
    examples: [
      { ko: '학생이에요?', roman: 'haksaengieyo?', vi: 'Bạn là học sinh à?' },
      { ko: '어디에 가요?', roman: 'eodie gayo?', vi: 'Bạn đi đâu?' }
    ],
    note: 'Không cần thêm "có... không?" như tiếng Việt — chỉ lên giọng cuối câu.'
  },
  {
    id: 'g7',
    title: 'Trợ từ tân ngữ 을/를',
    level: 'A1',
    tip: '을/를 đánh dấu tân ngữ. 을 sau phụ âm, 를 sau nguyên âm.',
    formula: '[Tân ngữ] + 을 / 를',
    examples: [
      { ko: '밥을 먹어요', roman: 'babeul meogeoyo', vi: 'Ăn cơm (cơm+을)' },
      { ko: '커피를 마셔요', roman: 'keopireul masyeoyo', vi: 'Uống cà phê (cà phê+를)' }
    ],
    note: 'Trong hội thoại thường bị bỏ qua. Học để đọc hiểu văn bản!'
  },
  {
    id: 'g8',
    title: 'Lịch sự vs thân mật',
    level: 'A1',
    tip: 'Lịch sự: -아요/-어요. Thân mật (bạn bè cùng tuổi): -아/-어.',
    formula: 'Lịch sự: -아요/-어요 | Thân mật: -아/-어',
    examples: [
      { ko: '사랑해요 / 사랑해', roman: 'saranghaeyo / saranghae', vi: 'Yêu (lịch sự / thân mật)' },
      { ko: '괜찮아요 / 괜찮아', roman: 'gwaenchanayo / gwaenchana', vi: 'Ổn mà (lịch sự / thân mật)' }
    ],
    note: 'Với người lớn/chưa thân: -아요/-어요. Bạn thân cùng tuổi: -아/-어.'
  }
];

const PLAN_DAYS = 56;
const syllableLessons = [
  {
    ko: '가',
    roman: 'ga',
    initial: 'ㄱ',
    vowel: 'ㅏ',
    final: '',
    explanation: 'ㄱ + ㅏ → 가. Bắt đầu bằng một âm tiết không có phụ âm cuối.'
  },
  {
    ko: '나',
    roman: 'na',
    initial: 'ㄴ',
    vowel: 'ㅏ',
    final: '',
    explanation: 'ㄴ + ㅏ → 나. 나 là “tôi” trong cách nói thân mật.'
  },
  {
    ko: '아',
    roman: 'a',
    initial: 'ㅇ',
    vowel: 'ㅏ',
    final: '',
    explanation: 'ㅇ + ㅏ → 아. ㅇ ở đầu không phát âm, bạn chỉ đọc a.'
  },
  {
    ko: '한',
    roman: 'han',
    initial: 'ㅎ',
    vowel: 'ㅏ',
    final: 'ㄴ',
    explanation: 'ㅎ + ㅏ + ㄴ → 한. Đọc âm n ở cuối; bạn sẽ gặp chữ này trong 한글 (Hangul).'
  },
  {
    ko: '물',
    roman: 'mul',
    initial: 'ㅁ',
    vowel: 'ㅜ',
    final: 'ㄹ',
    explanation: 'ㅁ + ㅜ + ㄹ → 물, nghĩa là “nước”. ㄹ ở cuối đọc gần âm l.'
  },
  {
    ko: '밥',
    roman: 'bap',
    initial: 'ㅂ',
    vowel: 'ㅏ',
    final: 'ㅂ',
    explanation: 'ㅂ + ㅏ + ㅂ → 밥, nghĩa là “cơm”. Âm p cuối khép môi, không bật thêm một âm “pờ”.'
  }
];
// 56 bai hoc: Tuan 1-4 (Hangul + 30 tu), Tuan 5-8 (ngu phap + 90 tu moi).
const dailyPlan = COURSE_CONTENT.lessonSeeds.map(([title, type, indexes, grammarId], index) => ({
  day: index + 1,
  title,
  type,
  grammarId: grammarId || null,
  items: indexes.map(i => (type === 'letter' ? letters : type === 'word' ? words : syllableLessons)[i])
}));
// Bổ sung từ còn thiếu, giữ nguyên số ngày và nội dung của 28 bài cũ.
// Giữ cách phân từ của 53 bài cũ; bài mới chỉ nối vào cuối.
const plannedWords = new Set(
  dailyPlan
    .slice(0, 53)
    .filter(p => p.type === 'word')
    .flatMap(p => p.items.map(w => w.ko))
);
for (const word of words.slice(0, legacyWordCount).filter(w => !plannedWords.has(w.ko))) {
  const lesson = dailyPlan
    .slice(28, 53)
    .filter(p => p.type === 'word')
    .sort((a, b) => a.items.length - b.items.length)[0];
  lesson.items.push(word);
}
const learningItems = [
  ...letters.map(item => ({ type: 'letter', item })),
  ...words.map(item => ({ type: 'word', item })),
  ...syllableLessons.map(item => ({ type: 'syllable', item }))
].map(x => ({ ...x, id: x.type + ':' + x.item.ko }));
const loveMessages = [
  'Hôm nay em chỉ cần cố gắng một chút thôi. Anh luôn cổ vũ em nhé ♡',
  'Một chữ mới, một niềm vui nhỏ. Anh mong góc học này làm em mỉm cười.',
  'Nếu hôm nay hơi mệt, cứ học chậm thôi. Anh vẫn ở đây, cổ vũ em.',
  'Không cần hoàn hảo đâu, Bảo Yến. Mỗi lần em quay lại đã là một điều đáng tự hào.',
  'Em học một chút tiếng Hàn, anh gửi em một chút yêu thương nhé.',
  'Bảo Yến ơi, chúc em một ngày dịu dàng. Một bài học nhỏ đang chờ em ♡',
  'Cảm ơn em vì đã dành thời gian cho chính mình. Anh thương cả những bước nhỏ của em.'
];

export { letters, words, topics, grammar, PLAN_DAYS, syllableLessons, dailyPlan, learningItems, loveMessages };
