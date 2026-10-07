// Các mục thiếu cho bài tình huống tham chiếu Sejong 1A được nối ở cuối file.
// Mục còn thiếu cho giáo trình Phase 2; app nối SAU kho từ cũ.
export const VOCAB_FOUNDATION = [
  ['나무', 'namu', 'Cây', 'noi_chon', '나무가 있어요.', 'Có cây.'],
  ['사람', 'saram', 'Người', 'tinh_cam', '좋은 사람이에요.', 'Là một người tốt.'],
  ['한국', 'hanguk', 'Hàn Quốc', 'noi_chon', '한국에 가요.', 'Tôi đi Hàn Quốc.'],
  ['베트남', 'beteunam', 'Việt Nam', 'noi_chon', '저는 베트남 사람이에요.', 'Tôi là người Việt Nam.'],
  ['미국', 'miguk', 'Hoa Kỳ / Mỹ', 'noi_chon', '미국에 가요.', 'Tôi đi Mỹ.'],
  ['중국', 'jungguk', 'Trung Quốc', 'noi_chon', '중국에 가요.', 'Tôi đi Trung Quốc.'],
  ['일본', 'ilbon', 'Nhật Bản', 'noi_chon', '일본에 가요.', 'Tôi đi Nhật Bản.'],
  ['있어요', 'isseoyo', 'Có / ở (tồn tại)', 'tinh_cam', '물이 있어요.', 'Có nước.'],
  ['없어요', 'eopseoyo', 'Không có / không ở', 'tinh_cam', '물이 없어요.', 'Không có nước.']
].map(([ko, roman, meaning, topic, exampleKo, exampleVi]) => ({
  ko,
  roman,
  meaning,
  level: 'A1',
  topic,
  exampleKo,
  exampleVi
}));
// Nội dung biên soạn cho app; ví dụ tự viết, không sao chép câu từ giáo trình.
// Nguồn đối chiếu: https://krdict.korean.go.kr/eng/mainAction?flag=PC
// 치아: https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=28122&nation=eng
// Phân nhóm A1–B2 là lộ trình nội bộ, không phải danh sách từ chính thức của TOPIK.
export const VOCAB_TOPICS = [
  { id: 'chao_hoi', name: 'Chào hỏi & giao tiếp', level: 'A1' },
  { id: 'tinh_cam', name: 'Bản thân & lời thương', level: 'A1' },
  { id: 'gia_dinh', name: 'Gia đình & người thân', level: 'A1' },
  { id: 'an_uong', name: 'Ăn uống & món Hàn', level: 'A1' },
  { id: 'do_vat', name: 'Đồ vật & trường lớp', level: 'A1' },
  { id: 'so_dem', name: 'Số đếm & đơn vị đếm', level: 'A1' },
  { id: 'noi_chon', name: 'Địa điểm quen thuộc', level: 'A1' },
  { id: 'nha_hang', name: 'Cà phê & gọi món', level: 'A2' },
  { id: 'giao_thong', name: 'Đi lại & hỏi đường', level: 'A2' },
  { id: 'mua_sam', name: 'Mua sắm & quần áo', level: 'A2' },
  { id: 'thoi_tiet', name: 'Thời tiết & bốn mùa', level: 'A2' },
  { id: 'hen_ho', name: 'Thời gian & hẹn hò', level: 'A2' },
  { id: 'sinh_hoat', name: 'Sinh hoạt hằng ngày', level: 'A2' },
  { id: 'suc_khoe', name: 'Sức khỏe & hiệu thuốc', level: 'A2' },
  { id: 'du_lich', name: 'Du lịch & khám phá Hàn Quốc', level: 'B1' },
  { id: 'cong_viec', name: 'Công việc & văn phòng', level: 'B1' },
  { id: 'giai_tri', name: 'Sở thích, K-drama & âm nhạc', level: 'B1' },
  { id: 'tinh_cach', name: 'Tính cách & cảm xúc', level: 'B1' },
  { id: 'nau_an', name: 'Nấu ăn & hương vị', level: 'B1' },
  { id: 'doi_song', name: 'Đời sống & môi trường', level: 'B1' },
  { id: 'tam_su', name: 'Tâm sự & tình cảm bền lâu', level: 'B2' },
  { id: 'kinh_ngu', name: 'Kính ngữ & ứng xử', level: 'B2' },
  { id: 'quan_diem', name: 'Thảo luận & quan điểm', level: 'B2' },
  { id: 'xa_hoi', name: 'Xã hội & tin tức', level: 'B2' }
];

// Chỉ bổ sung metadata bằng khóa ko: không thay ko, roman, meaning hay vị trí 120 từ cũ.
export const VOCAB_LEGACY = (() => {
  const groups = {
    chao_hoi: [
      ['안녕하세요', '안녕하세요. 저는 바오옌이에요.', 'Xin chào. Tôi là Bảo Yến.'],
      ['감사합니다', '도와주셔서 감사합니다.', 'Cảm ơn anh/chị đã giúp tôi.'],
      ['네', '네, 좋아요.', 'Vâng, được ạ.'],
      ['아니요', '아니요, 괜찮아요.', 'Không ạ, tôi ổn.'],
      ['미안해요', '늦어서 미안해요.', 'Xin lỗi vì tôi đến muộn.'],
      ['좋아요', '이 노래가 좋아요.', 'Tôi thích bài hát này.'],
      ['안녕', '안녕! 내일 또 만나자.', 'Chào nhé! Mai lại gặp nha.'],
      ['잘 자요', '오늘도 수고했어요. 잘 자요.', 'Hôm nay anh/em đã vất vả rồi. Ngủ ngon nhé.'],
      ['괜찮아요', '조금 늦어도 괜찮아요.', 'Đến muộn một chút cũng không sao.'],
      ['고마워요', '기다려 줘서 고마워요.', 'Cảm ơn anh/em đã đợi.'],
      ['만나서 반가워요', '안녕하세요. 만나서 반가워요.', 'Xin chào. Rất vui được gặp bạn.'],
      ['잘 지냈어요?', '오랜만이에요. 잘 지냈어요?', 'Lâu rồi không gặp. Dạo này bạn thế nào?'],
      ['잘 지냈어요', '네, 잘 지냈어요.', 'Vâng, tôi vẫn ổn.'],
      ['또 봐요', '다음 주에 또 봐요.', 'Tuần sau gặp lại nhé.'],
      ['오랜만이에요', '정말 오랜만이에요.', 'Thật sự lâu rồi không gặp.'],
      ['잠깐만요', '잠깐만요. 지금 갈게요.', 'Chờ chút nhé. Tôi đến ngay.'],
      ['저도요', '저도요. 저도 커피를 좋아해요.', 'Tôi cũng vậy. Tôi cũng thích cà phê.'],
      ['맞아요', '네, 맞아요. 여기가 학교예요.', 'Vâng, đúng rồi. Đây là trường học.']
    ],
    tinh_cam: [
      ['사랑해요', '오늘도 사랑해요.', 'Hôm nay anh/em vẫn yêu em/anh.'],
      ['보고 싶어요', '오늘도 많이 보고 싶어요.', 'Hôm nay anh/em cũng nhớ em/anh nhiều.'],
      ['이름', '제 이름은 바오옌이에요.', 'Tên tôi là Bảo Yến.'],
      ['친구', '제 친구는 한국어를 배워요.', 'Bạn tôi đang học tiếng Hàn.'],
      ['행복', '작은 행복을 함께 찾아요.', 'Cùng tìm những niềm hạnh phúc nhỏ nhé.'],
      ['예뻐요', '오늘 입은 옷이 예뻐요.', 'Bộ quần áo em mặc hôm nay đẹp quá.'],
      ['저', '저는 베트남에서 왔어요.', 'Tôi đến từ Việt Nam.'],
      ['나', '나는 네가 좋아.', 'Tớ thích cậu. (Thân mật)'],
      ['이름이 뭐예요?', '안녕하세요. 이름이 뭐예요?', 'Xin chào. Bạn tên là gì?'],
      ['학생이에요', '저는 대학생이 아니라 고등학생이에요.', 'Tôi là học sinh phổ thông, không phải sinh viên.'],
      ['한국 사람이에요?', '혹시 한국 사람이에요?', 'Bạn là người Hàn Quốc phải không?'],
      ['베트남 사람이에요', '저는 베트남 사람이에요.', 'Tôi là người Việt Nam.'],
      ['남자친구', '남자친구에게 편지를 써요.', 'Tôi viết thư cho bạn trai.'],
      ['여자친구', '여자친구에게 꽃을 줘요.', 'Tôi tặng hoa cho bạn gái.'],
      ['사랑해', '많이 사랑해.', 'Anh/em yêu em/anh nhiều. (Thân mật)'],
      ['보고 싶어', '너무 보고 싶어.', 'Anh/em nhớ em/anh quá. (Thân mật)'],
      ['걱정하지 마요', '저는 괜찮아요. 걱정하지 마요.', 'Anh/em vẫn ổn. Đừng lo nhé.'],
      ['힘내요', '조금만 더 힘내요!', 'Cố gắng thêm một chút nhé!'],
      ['잘했어요', '오늘도 정말 잘했어요.', 'Hôm nay em cũng làm rất tốt.'],
      ['항상', '항상 응원할게요.', 'Anh/em sẽ luôn cổ vũ em/anh.'],
      ['저는 학생이에요', '저는 학생이에요. 한국어를 공부해요.', 'Tôi là học sinh. Tôi học tiếng Hàn.']
    ],
    gia_dinh: [
      ['가족', '우리 가족은 네 명이에요.', 'Gia đình tôi có bốn người.'],
      ['엄마', '엄마와 전화해요.', 'Tôi nói chuyện điện thoại với mẹ.'],
      ['아빠', '아빠는 커피를 좋아해요.', 'Bố thích cà phê.'],
      ['오빠', '저는 오빠가 한 명 있어요.', 'Tôi có một anh trai. (Người nói là nữ)'],
      ['언니', '언니와 같이 쇼핑해요.', 'Tôi đi mua sắm với chị gái. (Người nói là nữ)'],
      ['남동생', '남동생은 학교에 가요.', 'Em trai tôi đi học.'],
      ['여동생', '여동생은 책을 읽어요.', 'Em gái tôi đọc sách.'],
      ['할머니', '할머니께 전화해요.', 'Tôi gọi điện cho bà.'],
      ['할아버지', '할아버지께서 집에 계세요.', 'Ông đang ở nhà.']
    ],
    an_uong: [
      ['맛있어요', '이 빵은 정말 맛있어요.', 'Bánh mì này thật ngon.'],
      ['물', '물을 마셔요.', 'Tôi uống nước.'],
      ['밥', '아침에 밥을 먹어요.', 'Buổi sáng tôi ăn cơm.'],
      ['커피', '따뜻한 커피를 마셔요.', 'Tôi uống cà phê nóng.'],
      ['차', '저는 녹차를 좋아해요.', 'Tôi thích trà xanh.'],
      ['우유', '우유를 한 잔 마셔요.', 'Tôi uống một ly sữa.'],
      ['빵', '빵을 조금 먹어요.', 'Tôi ăn một ít bánh mì.'],
      ['사과', '사과를 하나 먹어요.', 'Tôi ăn một quả táo.'],
      ['먹어요', '저는 김밥을 먹어요.', 'Tôi ăn cơm cuộn.'],
      ['마셔요', '물을 자주 마셔요.', 'Tôi thường xuyên uống nước.'],
      ['배고파요', '아직 밥을 안 먹어서 배고파요.', 'Tôi chưa ăn cơm nên đói.'],
      ['배불러요', '잘 먹었어요. 이제 배불러요.', 'Tôi ăn ngon rồi. Giờ no rồi.'],
      ['맛없어요', '이 음식은 제 입맛에 안 맞아서 맛없어요.', 'Món này không hợp khẩu vị nên tôi thấy không ngon.'],
      ['음식', '한국 음식을 좋아해요.', 'Tôi thích đồ ăn Hàn Quốc.'],
      ['저는 밥을 먹어요', '저는 집에서 밥을 먹어요.', 'Tôi ăn cơm ở nhà.'],
      ['뭐 먹을까요?', '오늘 저녁에 뭐 먹을까요?', 'Tối nay mình ăn gì nhỉ?'],
      ['안 먹어요', '저는 매운 음식을 안 먹어요.', 'Tôi không ăn đồ cay.']
    ],
    do_vat: [
      ['이것은 뭐예요?', '이것은 뭐예요? 한국어로 말해 주세요.', 'Cái này là gì? Hãy nói bằng tiếng Hàn giúp tôi.']
    ],
    so_dem: [
      ['하나', '사과가 하나 있어요.', 'Có một quả táo.'],
      ['둘', '컵이 둘 있어요.', 'Có hai chiếc cốc.'],
      ['셋', '사람이 셋 있어요.', 'Có ba người.'],
      ['넷', '의자가 넷 있어요.', 'Có bốn chiếc ghế.'],
      ['다섯', '책이 다섯 있어요.', 'Có năm quyển sách.'],
      ['일', '오늘은 일월 일일이에요.', 'Hôm nay là ngày một tháng một.'],
      ['이', '제 방은 이 층에 있어요.', 'Phòng tôi ở tầng hai.'],
      ['삼', '삼월에 한국에 가요.', 'Tháng ba tôi đi Hàn Quốc.'],
      ['사', '사 층에 카페가 있어요.', 'Có quán cà phê ở tầng bốn.'],
      ['오', '오월에는 날씨가 좋아요.', 'Tháng năm thời tiết đẹp.']
    ],
    noi_chon: [
      ['집', '집에서 쉬어요.', 'Tôi nghỉ ngơi ở nhà.'],
      ['학교', '학교에 가요.', 'Tôi đi đến trường.'],
      ['여기', '여기에 앉으세요.', 'Mời ngồi ở đây.'],
      ['저기', '저기에 친구가 있어요.', 'Bạn tôi ở đằng kia.'],
      ['어디', '학교가 어디에 있어요?', 'Trường học ở đâu?'],
      ['편의점', '편의점에서 물을 사요.', 'Tôi mua nước ở cửa hàng tiện lợi.'],
      ['화장실', '화장실은 오른쪽에 있어요.', 'Nhà vệ sinh ở bên phải.'],
      ['공항', '공항에서 친구를 만나요.', 'Tôi gặp bạn ở sân bay.'],
      ['어디에 가요?', '지금 어디에 가요?', 'Bây giờ bạn đi đâu?']
    ],
    nha_hang: [
      ['주세요', '메뉴를 주세요.', 'Cho tôi thực đơn với ạ.'],
      ['식당', '이 식당은 김치찌개가 맛있어요.', 'Quán ăn này có canh kim chi ngon.'],
      ['카페', '카페에서 차를 마셔요.', 'Tôi uống trà ở quán cà phê.']
    ],
    giao_thong: [
      ['지하철', '지하철로 학교에 가요.', 'Tôi đến trường bằng tàu điện ngầm.'],
      ['버스', '버스를 타고 집에 가요.', 'Tôi đi xe buýt về nhà.']
    ],
    mua_sam: [
      ['얼마예요?', '이 가방은 얼마예요?', 'Chiếc túi này bao nhiêu tiền?'],
      ['빨간색', '빨간색 가방을 골라요.', 'Tôi chọn chiếc túi màu đỏ.'],
      ['파란색', '파란색 셔츠를 입어요.', 'Tôi mặc áo sơ mi màu xanh lam.'],
      ['노란색', '노란색 모자를 사요.', 'Tôi mua chiếc mũ màu vàng.'],
      ['하얀색', '하얀색 신발이 예뻐요.', 'Đôi giày màu trắng đẹp quá.'],
      ['검은색', '검은색 바지를 입어요.', 'Tôi mặc quần màu đen.'],
      ['분홍색', '분홍색 원피스를 좋아해요.', 'Tôi thích váy liền màu hồng.']
    ],
    thoi_tiet: [['오늘 날씨가 좋아요', '오늘 날씨가 좋아요. 산책할까요?', 'Hôm nay trời đẹp. Đi dạo nhé?']],
    hen_ho: [
      ['오늘', '오늘 저녁에 만나요.', 'Tối nay gặp nhau nhé.'],
      ['내일', '내일 영화 보러 가요.', 'Ngày mai mình đi xem phim nhé.'],
      ['지금', '지금 출발해요.', 'Bây giờ tôi xuất phát.'],
      ['어제', '어제 친구를 만났어요.', 'Hôm qua tôi đã gặp bạn.'],
      ['아침', '아침에 운동해요.', 'Tôi tập thể dục vào buổi sáng.'],
      ['점심', '점심에 같이 밥 먹어요.', 'Buổi trưa cùng ăn cơm nhé.'],
      ['저녁', '저녁에 전화할게요.', 'Buổi tối anh/em sẽ gọi điện.'],
      ['주말', '주말에 시간이 있어요?', 'Cuối tuần bạn có thời gian không?'],
      ['월요일', '월요일에 다시 만나요.', 'Thứ Hai gặp lại nhé.'],
      ['일요일', '일요일에는 집에서 쉬어요.', 'Chủ Nhật tôi nghỉ ngơi ở nhà.'],
      ['몇 시예요?', '지금 몇 시예요?', 'Bây giờ là mấy giờ?']
    ],
    sinh_hoat: [
      ['가요', '매일 학교에 가요.', 'Mỗi ngày tôi đến trường.'],
      ['와요', '친구가 우리 집에 와요.', 'Bạn tôi đến nhà tôi.'],
      ['해요', '집에서 운동을 해요.', 'Tôi tập thể dục ở nhà.'],
      ['봐요', '저녁에 영화를 봐요.', 'Buổi tối tôi xem phim.'],
      ['자요', '밤 열한 시에 자요.', 'Tôi ngủ lúc mười một giờ đêm.'],
      ['일어나요', '아침 일곱 시에 일어나요.', 'Tôi thức dậy lúc bảy giờ sáng.'],
      ['씻어요', '집에 오면 손을 씻어요.', 'Về đến nhà thì tôi rửa tay.'],
      ['공부해요', '매일 한국어를 공부해요.', 'Tôi học tiếng Hàn mỗi ngày.'],
      ['일해요', '저는 아침부터 일해요.', 'Tôi làm việc từ buổi sáng.'],
      ['쉬어요', '조금 피곤해서 쉬어요.', 'Tôi hơi mệt nên nghỉ ngơi.']
    ],
    suc_khoe: [['병원', '아프면 병원에 가요.', 'Nếu bị đau thì tôi đến bệnh viện.']]
  };
  const result = {};
  for (const [topic, rows] of Object.entries(groups)) {
    const level = VOCAB_TOPICS.find(item => item.id === topic).level;
    for (const [ko, exampleKo, exampleVi] of rows) result[ko] = { level, topic, exampleKo, exampleVi };
  }
  return result;
})();
// Nội dung/ví dụ tự biên soạn, không trích từ giáo trình. Chỉ nối, không đổi mục cũ.
VOCAB_FOUNDATION.push(
  ...[
    ['전화번호', 'jeonhwabeonho', 'Số điện thoại', 'chao_hoi', '전화번호가 뭐예요?', 'Số điện thoại là gì?'],
    ['영', 'yeong', 'Số không (0)', 'so_dem', '영은 숫자예요.', 'Không là một chữ số.'],
    ['공', 'gong', 'Số không (cách đọc trong số điện thoại)', 'so_dem', '공일이는 012예요.', 'Gong-il-i là 012.'],
    ['위', 'wi', 'Phía trên', 'do_vat', '책이 책상 위에 있어요.', 'Sách ở trên bàn.'],
    ['아래', 'arae', 'Phía dưới', 'do_vat', '가방이 의자 아래에 있어요.', 'Túi ở dưới ghế.'],
    ['공부하다', 'gongbuhada', 'Học (dạng từ điển)', 'sinh_hoat', '한국어를 공부해요.', 'Tôi học tiếng Hàn.'],
    ['읽다', 'ikda', 'Đọc (dạng từ điển)', 'sinh_hoat', '책을 읽어요.', 'Tôi đọc sách.'],
    ['먹다', 'meokda', 'Ăn (dạng từ điển)', 'sinh_hoat', '빵을 먹어요.', 'Tôi ăn bánh mì.'],
    ['마시다', 'masida', 'Uống (dạng từ điển)', 'sinh_hoat', '우유를 마셔요.', 'Tôi uống sữa.'],
    ['사다', 'sada', 'Mua (dạng từ điển)', 'mua_sam', '빵을 사요.', 'Tôi mua bánh mì.'],
    ['한', 'han', 'Một (trước đơn vị đếm)', 'so_dem', '빵 한 개 주세요.', 'Cho tôi một cái bánh mì.'],
    ['두', 'du', 'Hai (trước đơn vị đếm)', 'so_dem', '빵 두 개 주세요.', 'Cho tôi hai cái bánh mì.'],
    ['세', 'se', 'Ba (trước đơn vị đếm)', 'so_dem', '빵 세 개 주세요.', 'Cho tôi ba cái bánh mì.'],
    ['덥다', 'deopda', 'Nóng (thời tiết; dạng từ điển)', 'thoi_tiet', '오늘은 더워요.', 'Hôm nay trời nóng.'],
    ['춥다', 'chupda', 'Lạnh (thời tiết; dạng từ điển)', 'thoi_tiet', '오늘은 추워요.', 'Hôm nay trời lạnh.'],
    ['오다', 'oda', 'Đến (dạng từ điển)', 'sinh_hoat', '비가 와요.', 'Trời mưa.'],
    ['가다', 'gada', 'Đi (dạng từ điển)', 'sinh_hoat', '공원에 가요.', 'Tôi đi đến công viên.'],
    ['보다', 'boda', 'Xem / nhìn (dạng từ điển)', 'sinh_hoat', '영화를 봐요.', 'Tôi xem phim.'],
    ['산책하다', 'sanchaekhada', 'Đi dạo (dạng từ điển)', 'sinh_hoat', '공원에서 산책해요.', 'Tôi đi dạo ở công viên.'],
    ['같이', 'gachi', 'Cùng nhau', 'hen_ho', '같이 공원에 가요.', 'Cùng đi công viên nhé.'],
    ['영화', 'yeonghwa', 'Phim', 'giai_tri', '영화를 봐요.', 'Tôi xem phim.']
  ].map(([ko, roman, meaning, topic, exampleKo, exampleVi]) => ({
    ko,
    roman,
    meaning,
    topic,
    exampleKo,
    exampleVi,
    level: VOCAB_TOPICS.find(t => t.id === topic).level
  }))
);

// Chỉ nối những từ mới vào cuối words, không chèn trước các index đã lưu.
export const VOCAB_BASIC = (() => {
  const groups = {
    chao_hoi: [
      [
        '안녕히 가세요',
        'annyeonghi gaseyo',
        'Tạm biệt (nói với người đi)',
        '안녕히 가세요. 내일 봐요.',
        'Tạm biệt nhé. Mai gặp lại.'
      ],
      [
        '안녕히 계세요',
        'annyeonghi gyeseyo',
        'Tạm biệt (nói với người ở lại)',
        '저는 먼저 갈게요. 안녕히 계세요.',
        'Tôi về trước nhé. Xin chào tạm biệt.'
      ],
      ['죄송해요', 'joesonghaeyo', 'Tôi xin lỗi (lịch sự)', '늦어서 죄송해요.', 'Tôi xin lỗi vì đến muộn.'],
      [
        '처음 뵙겠습니다',
        'cheoeum boepgetseumnida',
        'Rất hân hạnh được gặp (lần đầu, trang trọng)',
        '처음 뵙겠습니다. 잘 부탁드립니다.',
        'Rất hân hạnh được gặp. Mong anh/chị giúp đỡ.'
      ],
      [
        '천천히 말해 주세요',
        'cheoncheonhi malhae juseyo',
        'Xin hãy nói chậm lại',
        '한국어를 배우고 있어요. 천천히 말해 주세요.',
        'Tôi đang học tiếng Hàn. Xin hãy nói chậm lại.'
      ],
      [
        '다시 말해 주세요',
        'dasi malhae juseyo',
        'Xin hãy nói lại',
        '잘 못 들었어요. 다시 말해 주세요.',
        'Tôi chưa nghe rõ. Xin hãy nói lại.'
      ]
    ],
    tinh_cam: [
      ['생일', 'saengil', 'Sinh nhật', '오늘은 제 생일이에요.', 'Hôm nay là sinh nhật tôi.'],
      ['선물', 'seonmul', 'Món quà', '작은 선물을 준비했어요.', 'Anh/em đã chuẩn bị một món quà nhỏ.'],
      [
        '자기야',
        'jagiya',
        'Anh yêu / Em yêu (cách gọi người yêu)',
        '자기야, 오늘도 힘내!',
        'Anh/em yêu ơi, hôm nay cũng cố lên nhé! (Thân mật)'
      ]
    ],
    gia_dinh: [
      ['부모님', 'bumonim', 'Bố mẹ (kính trọng)', '부모님께 전화를 드려요.', 'Tôi gọi điện cho bố mẹ.'],
      ['어머니', 'eomeoni', 'Mẹ (cách gọi lịch sự)', '어머니께서 요리하세요.', 'Mẹ đang nấu ăn.'],
      ['아버지', 'abeoji', 'Bố (cách gọi lịch sự)', '아버지께서 신문을 읽으세요.', 'Bố đang đọc báo.'],
      ['형', 'hyeong', 'Anh trai (em trai gọi)', '저는 형이 한 명 있어요.', 'Tôi có một anh trai. (Người nói là nam)'],
      [
        '누나',
        'nuna',
        'Chị gái (em trai gọi)',
        '누나는 회사에 다녀요.',
        'Chị gái tôi đi làm ở công ty. (Người nói là nam)'
      ],
      ['동생', 'dongsaeng', 'Em (trai hoặc gái)', '동생과 같이 밥을 먹어요.', 'Tôi ăn cơm cùng em.'],
      ['형제', 'hyeongje', 'Anh em trai / anh chị em', '형제가 몇 명 있어요?', 'Bạn có mấy anh chị em?'],
      ['자매', 'jamae', 'Chị em gái', '우리는 자매예요.', 'Chúng tôi là chị em gái.'],
      ['아들', 'adeul', 'Con trai', '우리 아들은 다섯 살이에요.', 'Con trai chúng tôi năm tuổi.'],
      ['딸', 'ttal', 'Con gái', '우리 딸은 학생이에요.', 'Con gái chúng tôi là học sinh.'],
      ['남편', 'nampyeon', 'Chồng', '남편과 함께 산책해요.', 'Tôi đi dạo cùng chồng.'],
      ['아내', 'anae', 'Vợ', '아내에게 꽃을 줘요.', 'Tôi tặng hoa cho vợ.'],
      ['사촌', 'sachon', 'Anh/chị/em họ', '주말에 사촌을 만나요.', 'Cuối tuần tôi gặp anh/chị/em họ.'],
      ['고모', 'gomo', 'Cô (chị/em gái của bố)', '고모는 부산에 살아요.', 'Cô tôi sống ở Busan.'],
      ['이모', 'imo', 'Dì (chị/em gái của mẹ)', '이모와 전화해요.', 'Tôi nói chuyện điện thoại với dì.']
    ],
    an_uong: [
      ['김치', 'gimchi', 'Kim chi', '김치는 조금 매워요.', 'Kim chi hơi cay.'],
      ['김밥', 'gimbap', 'Cơm cuộn rong biển', '점심에 김밥을 먹어요.', 'Buổi trưa tôi ăn cơm cuộn rong biển.'],
      ['비빔밥', 'bibimbap', 'Cơm trộn Hàn Quốc', '비빔밥에 채소가 많아요.', 'Cơm trộn có nhiều rau.'],
      ['불고기', 'bulgogi', 'Thịt ướp nướng kiểu Hàn', '불고기는 달고 맛있어요.', 'Thịt bulgogi ngọt và ngon.'],
      ['떡볶이', 'tteokbokki', 'Bánh gạo sốt cay', '떡볶이는 맵지만 맛있어요.', 'Bánh gạo sốt cay tuy cay nhưng ngon.'],
      ['계란', 'gyeran', 'Trứng gà', '계란 두 개를 먹어요.', 'Tôi ăn hai quả trứng gà.'],
      ['과일', 'gwail', 'Trái cây', '아침에 과일을 먹어요.', 'Buổi sáng tôi ăn trái cây.'],
      ['고기', 'gogi', 'Thịt', '저는 고기를 좋아해요.', 'Tôi thích ăn thịt.'],
      ['생선', 'saengseon', 'Cá (dùng làm thức ăn)', '오늘은 생선을 먹어요.', 'Hôm nay tôi ăn cá.']
    ],
    do_vat: [
      ['책', 'chaek', 'Sách', '한국어 책을 읽어요.', 'Tôi đọc sách tiếng Hàn.'],
      ['공책', 'gongchaek', 'Vở', '공책에 새 단어를 써요.', 'Tôi viết từ mới vào vở.'],
      ['연필', 'yeonpil', 'Bút chì', '연필로 이름을 써요.', 'Tôi viết tên bằng bút chì.'],
      ['볼펜', 'bolpen', 'Bút bi', '볼펜을 하나 빌려 주세요.', 'Cho tôi mượn một chiếc bút bi nhé.'],
      ['지우개', 'jiugae', 'Cục tẩy', '지우개가 책상 위에 있어요.', 'Cục tẩy ở trên bàn học.'],
      ['가방', 'gabang', 'Túi / cặp', '가방에 책을 넣어요.', 'Tôi cho sách vào cặp.'],
      ['책상', 'chaeksang', 'Bàn học / bàn làm việc', '책상에서 공부해요.', 'Tôi học ở bàn học.'],
      ['의자', 'uija', 'Ghế', '의자에 앉아요.', 'Tôi ngồi xuống ghế.'],
      ['칠판', 'chilpan', 'Bảng viết', '칠판을 보세요.', 'Hãy nhìn lên bảng.'],
      ['교실', 'gyosil', 'Lớp học / phòng học', '교실에 학생이 있어요.', 'Có học sinh trong phòng học.'],
      ['선생님', 'seonsaengnim', 'Thầy/cô giáo', '선생님께 질문해요.', 'Tôi hỏi thầy/cô giáo.'],
      ['학생', 'haksaeng', 'Học sinh / sinh viên', '학생들이 한국어를 배워요.', 'Các học sinh học tiếng Hàn.'],
      ['사전', 'sajeon', 'Từ điển', '사전에서 단어를 찾아요.', 'Tôi tra từ trong từ điển.'],
      [
        '휴대폰',
        'hyudaepon',
        'Điện thoại di động',
        '휴대폰으로 한국어를 공부해요.',
        'Tôi học tiếng Hàn bằng điện thoại.'
      ],
      ['컴퓨터', 'keompyuteo', 'Máy tính', '컴퓨터를 켜요.', 'Tôi bật máy tính.'],
      ['시계', 'sigye', 'Đồng hồ', '시계를 보고 시간을 확인해요.', 'Tôi nhìn đồng hồ để xem giờ.'],
      ['우산', 'usan', 'Ô / dù', '비가 와서 우산을 써요.', 'Trời mưa nên tôi che ô.'],
      ['열쇠', 'yeolsoe', 'Chìa khóa', '열쇠를 가방에 넣어요.', 'Tôi bỏ chìa khóa vào túi.'],
      ['안경', 'angyeong', 'Kính mắt', '책을 읽을 때 안경을 써요.', 'Khi đọc sách tôi đeo kính.'],
      ['컵', 'keop', 'Cốc / ly', '컵에 물을 따라요.', 'Tôi rót nước vào cốc.'],
      ['문', 'mun', 'Cửa', '문을 닫아 주세요.', 'Hãy đóng cửa giúp tôi.'],
      ['창문', 'changmun', 'Cửa sổ', '창문을 열어요.', 'Tôi mở cửa sổ.'],
      ['숙제', 'sukje', 'Bài tập về nhà', '저녁에 숙제를 해요.', 'Buổi tối tôi làm bài tập về nhà.']
    ],
    so_dem: [
      ['여섯', 'yeoseot', 'Sáu (thuần Hàn)', '사과가 여섯 개 있어요.', 'Có sáu quả táo.'],
      ['일곱', 'ilgop', 'Bảy (thuần Hàn)', '일곱 시에 일어나요.', 'Tôi thức dậy lúc bảy giờ.'],
      ['여덟', 'yeodeol', 'Tám (thuần Hàn)', '여덟 시에 출발해요.', 'Tôi xuất phát lúc tám giờ.'],
      ['아홉', 'ahop', 'Chín (thuần Hàn)', '아홉 명이 왔어요.', 'Có chín người đã đến.'],
      ['열', 'yeol', 'Mười (thuần Hàn)', '책이 열 권 있어요.', 'Có mười quyển sách.'],
      ['스물', 'seumul', 'Hai mươi (thuần Hàn; 스무 trước đơn vị)', '저는 스무 살이에요.', 'Tôi hai mươi tuổi.'],
      ['육', 'yuk', 'Sáu (Hán Hàn)', '육 층에 올라가요.', 'Tôi đi lên tầng sáu.'],
      ['칠', 'chil', 'Bảy (Hán Hàn)', '칠월에 여행해요.', 'Tôi đi du lịch vào tháng bảy.'],
      ['팔', 'pal', 'Tám (Hán Hàn)', '팔월에 한국에 가요.', 'Tôi đi Hàn Quốc vào tháng tám.'],
      ['구', 'gu', 'Chín (Hán Hàn)', '구 층에 사무실이 있어요.', 'Có văn phòng ở tầng chín.'],
      ['십', 'sip', 'Mười (Hán Hàn)', '십 분만 기다려 주세요.', 'Hãy đợi tôi mười phút nhé.'],
      ['백', 'baek', 'Một trăm (Hán Hàn)', '백 원짜리 동전이 있어요.', 'Tôi có đồng xu một trăm won.'],
      ['천', 'cheon', 'Một nghìn (Hán Hàn)', '이 물은 천 원이에요.', 'Chai nước này giá một nghìn won.'],
      ['만', 'man', 'Mười nghìn (Hán Hàn)', '이 책은 만 원이에요.', 'Quyển sách này giá mười nghìn won.'],
      ['개', 'gae', 'Cái / quả (đơn vị đếm đồ vật)', '사과 한 개를 주세요.', 'Cho tôi một quả táo với ạ.'],
      ['명', 'myeong', 'Người (đơn vị đếm)', '친구 두 명을 만나요.', 'Tôi gặp hai người bạn.'],
      ['잔', 'jan', 'Ly / cốc (đơn vị đếm đồ uống)', '커피 한 잔을 주세요.', 'Cho tôi một ly cà phê với ạ.'],
      ['병', 'byeong', 'Chai (đơn vị đếm)', '물 두 병을 사요.', 'Tôi mua hai chai nước.'],
      ['권', 'gwon', 'Quyển (đơn vị đếm sách)', '책 세 권을 읽어요.', 'Tôi đọc ba quyển sách.'],
      ['살', 'sal', 'Tuổi (dùng số thuần Hàn)', '동생은 네 살이에요.', 'Em tôi bốn tuổi.'],
      ['시', 'si', 'Giờ (đơn vị chỉ giờ trên đồng hồ)', '세 시에 만나요.', 'Gặp nhau lúc ba giờ nhé.'],
      ['분', 'bun', 'Phút (dùng số Hán Hàn)', '십 분 후에 만나요.', 'Mười phút nữa gặp nhau nhé.'],
      ['원', 'won', 'Won (đơn vị tiền Hàn Quốc)', '커피는 삼천 원이에요.', 'Cà phê giá ba nghìn won.']
    ],
    noi_chon: [
      ['도서관', 'doseogwan', 'Thư viện', '도서관에서 책을 읽어요.', 'Tôi đọc sách ở thư viện.'],
      ['공원', 'gongwon', 'Công viên', '공원에서 산책해요.', 'Tôi đi dạo ở công viên.'],
      ['은행', 'eunhaeng', 'Ngân hàng', '은행에서 돈을 찾아요.', 'Tôi rút tiền ở ngân hàng.'],
      ['우체국', 'ucheguk', 'Bưu điện', '우체국에서 편지를 보내요.', 'Tôi gửi thư ở bưu điện.'],
      ['시장', 'sijang', 'Chợ', '시장에서 과일을 사요.', 'Tôi mua trái cây ở chợ.'],
      ['마트', 'mateu', 'Siêu thị', '마트에서 우유를 사요.', 'Tôi mua sữa ở siêu thị.'],
      ['서점', 'seojeom', 'Hiệu sách', '서점에서 책을 골라요.', 'Tôi chọn sách ở hiệu sách.'],
      ['영화관', 'yeonghwagwan', 'Rạp chiếu phim', '영화관에서 영화를 봐요.', 'Tôi xem phim ở rạp.'],
      ['회사', 'hoesa', 'Công ty', '아침에 회사에 가요.', 'Buổi sáng tôi đi đến công ty.'],
      ['방', 'bang', 'Phòng', '제 방은 작고 깨끗해요.', 'Phòng tôi nhỏ và sạch.'],
      ['부엌', 'bueok', 'Nhà bếp', '엄마는 부엌에 계세요.', 'Mẹ đang ở trong bếp.'],
      ['거실', 'geosil', 'Phòng khách', '거실에서 이야기를 해요.', 'Chúng tôi trò chuyện ở phòng khách.'],
      ['앞', 'ap', 'Phía trước', '학교 앞에서 만나요.', 'Gặp nhau trước trường nhé.'],
      ['뒤', 'dwi', 'Phía sau', '집 뒤에 나무가 있어요.', 'Có cây ở phía sau nhà.'],
      ['옆', 'yeop', 'Bên cạnh', '제 옆에 앉으세요.', 'Mời ngồi bên cạnh tôi.']
    ],
    nha_hang: [
      ['메뉴', 'menyu', 'Thực đơn', '메뉴를 보여 주세요.', 'Cho tôi xem thực đơn với ạ.'],
      ['주문', 'jumun', 'Việc gọi món / đặt hàng', '주문 도와드릴까요?', 'Anh/chị muốn gọi món chưa ạ?'],
      ['주문할게요', 'jumunhalgeyo', 'Tôi muốn gọi món', '여기요, 주문할게요.', 'Anh/chị ơi, tôi muốn gọi món.'],
      [
        '추천해 주세요',
        'chucheonhae juseyo',
        'Xin hãy gợi ý giúp tôi',
        '맵지 않은 음식을 추천해 주세요.',
        'Hãy gợi ý giúp tôi một món không cay.'
      ],
      ['아메리카노', 'amerikano', 'Cà phê Americano', '아메리카노 한 잔 주세요.', 'Cho tôi một ly Americano với ạ.'],
      ['라테', 'rate', 'Cà phê latte', '따뜻한 라테를 주문해요.', 'Tôi gọi một ly latte nóng.'],
      ['주스', 'juseu', 'Nước ép', '오렌지 주스를 마셔요.', 'Tôi uống nước ép cam.'],
      ['얼음', 'eoreum', 'Đá lạnh', '얼음을 조금만 넣어 주세요.', 'Cho tôi ít đá thôi nhé.'],
      ['설탕', 'seoltang', 'Đường (gia vị)', '설탕은 넣지 마세요.', 'Xin đừng cho đường.'],
      ['빨대', 'ppaldae', 'Ống hút', '빨대는 필요 없어요.', 'Tôi không cần ống hút.'],
      ['포장', 'pojang', 'Gói mang đi', '포장해 주세요.', 'Gói mang đi giúp tôi với.'],
      ['계산서', 'gyesanseo', 'Hóa đơn thanh toán', '계산서를 주세요.', 'Cho tôi hóa đơn thanh toán với ạ.'],
      [
        '계산할게요',
        'gyesanhalgeyo',
        'Tôi muốn thanh toán',
        '잘 먹었어요. 계산할게요.',
        'Tôi ăn ngon lắm. Tôi muốn thanh toán.'
      ],
      ['카드', 'kadeu', 'Thẻ (thanh toán)', '카드로 계산할 수 있어요?', 'Tôi có thể thanh toán bằng thẻ không?'],
      ['현금', 'hyeongeum', 'Tiền mặt', '현금으로 낼게요.', 'Tôi sẽ trả bằng tiền mặt.'],
      ['숟가락', 'sutgarak', 'Thìa / muỗng', '숟가락 하나 주세요.', 'Cho tôi một chiếc thìa với ạ.'],
      ['젓가락', 'jeotgarak', 'Đũa', '젓가락으로 김밥을 먹어요.', 'Tôi ăn cơm cuộn bằng đũa.'],
      ['물티슈', 'multisyu', 'Khăn giấy ướt', '물티슈가 있나요?', 'Có khăn giấy ướt không ạ?'],
      [
        '덜 맵게 해 주세요',
        'deol maepge hae juseyo',
        'Xin làm bớt cay',
        '떡볶이를 덜 맵게 해 주세요.',
        'Làm bánh gạo sốt cay bớt cay giúp tôi nhé.'
      ],
      ['자리', 'jari', 'Chỗ ngồi', '창가 자리가 있어요?', 'Có chỗ ngồi cạnh cửa sổ không ạ?'],
      ['예약했어요', 'yeyakhaesseoyo', 'Tôi đã đặt chỗ', '두 명으로 예약했어요.', 'Tôi đã đặt chỗ cho hai người.']
    ],
    giao_thong: [
      ['택시', 'taeksi', 'Taxi', '택시를 타고 공항에 가요.', 'Tôi đi taxi đến sân bay.'],
      ['기차', 'gicha', 'Tàu hỏa', '기차로 부산에 가요.', 'Tôi đi tàu hỏa đến Busan.'],
      ['자전거', 'jajeongeo', 'Xe đạp', '주말에 자전거를 타요.', 'Cuối tuần tôi đi xe đạp.'],
      ['자동차', 'jadongcha', 'Ô tô', '자동차로 한 시간 걸려요.', 'Đi ô tô mất một giờ.'],
      ['역', 'yeok', 'Ga tàu', '역 앞에서 기다려요.', 'Tôi đợi ở trước ga.'],
      ['정류장', 'jeongnyujang', 'Trạm dừng xe buýt', '버스 정류장이 어디예요?', 'Trạm xe buýt ở đâu vậy?'],
      ['교통카드', 'gyotongkadeu', 'Thẻ giao thông', '교통카드를 충전해요.', 'Tôi nạp tiền vào thẻ giao thông.'],
      ['표', 'pyo', 'Vé', '기차표 두 장을 사요.', 'Tôi mua hai vé tàu hỏa.'],
      ['출구', 'chulgu', 'Lối ra', '삼 번 출구에서 만나요.', 'Gặp nhau ở lối ra số ba nhé.'],
      ['입구', 'ipgu', 'Lối vào', '입구에서 기다릴게요.', 'Tôi sẽ đợi ở lối vào.'],
      ['왼쪽', 'oenjjok', 'Bên trái', '왼쪽으로 가세요.', 'Hãy đi về phía bên trái.'],
      ['오른쪽', 'oreunjjok', 'Bên phải', '오른쪽에 은행이 있어요.', 'Có ngân hàng ở bên phải.'],
      ['똑바로', 'ttokbaro', 'Thẳng (hướng đi)', '이 길로 똑바로 가세요.', 'Hãy đi thẳng theo đường này.'],
      ['건너편', 'geonneopyeon', 'Phía đối diện', '건너편에 편의점이 있어요.', 'Có cửa hàng tiện lợi ở phía đối diện.'],
      [
        '갈아타요',
        'garatayo',
        'Chuyển tàu / đổi xe',
        '서울역에서 지하철을 갈아타요.',
        'Tôi chuyển tuyến tàu điện ngầm ở ga Seoul.'
      ],
      ['타요', 'tayo', 'Lên / đi (phương tiện)', '여기서 버스를 타요.', 'Tôi lên xe buýt ở đây.'],
      ['내려요', 'naeryeoyo', 'Xuống (phương tiện)', '다음 역에서 내려요.', 'Tôi xuống ở ga tiếp theo.'],
      ['걸어요', 'georeoyo', 'Đi bộ', '집까지 걸어요.', 'Tôi đi bộ về đến nhà.'],
      ['멀어요', 'meoreoyo', 'Xa', '공항은 여기서 멀어요.', 'Sân bay ở xa đây.'],
      ['가까워요', 'gakkawoyo', 'Gần', '역이 집에서 가까워요.', 'Ga tàu gần nhà tôi.'],
      ['몇 번', 'myeot beon', 'Số mấy / lần thứ mấy', '몇 번 버스를 타요?', 'Tôi phải đi xe buýt số mấy?'],
      ['길', 'gil', 'Đường / lối đi', '이 길로 가면 돼요.', 'Đi theo đường này là được.']
    ],
    mua_sam: [
      ['옷', 'ot', 'Quần áo', '새 옷을 사요.', 'Tôi mua quần áo mới.'],
      ['바지', 'baji', 'Quần', '이 바지는 편해요.', 'Chiếc quần này thoải mái.'],
      ['치마', 'chima', 'Chân váy', '분홍색 치마를 골라요.', 'Tôi chọn chân váy màu hồng.'],
      ['원피스', 'wonpiseu', 'Váy liền', '이 원피스를 입어 볼게요.', 'Tôi muốn thử chiếc váy liền này.'],
      ['셔츠', 'syeocheu', 'Áo sơ mi', '하얀 셔츠를 입어요.', 'Tôi mặc áo sơ mi trắng.'],
      ['신발', 'sinbal', 'Giày / dép', '신발이 조금 작아요.', 'Đôi giày hơi nhỏ.'],
      ['양말', 'yangmal', 'Tất / vớ', '양말 두 켤레를 사요.', 'Tôi mua hai đôi tất.'],
      ['모자', 'moja', 'Mũ / nón', '이 모자가 잘 어울려요.', 'Chiếc mũ này rất hợp với bạn.'],
      ['사이즈', 'saijeu', 'Kích cỡ', '큰 사이즈도 있어요?', 'Có cỡ lớn không ạ?'],
      ['가격', 'gagyeok', 'Giá tiền', '가격을 알고 싶어요.', 'Tôi muốn biết giá.'],
      ['비싸요', 'bissayo', 'Đắt', '이 가방은 너무 비싸요.', 'Chiếc túi này đắt quá.'],
      ['싸요', 'ssayo', 'Rẻ', '이 옷은 예쁘고 싸요.', 'Bộ quần áo này đẹp và rẻ.'],
      ['할인', 'harin', 'Giảm giá', '오늘은 할인을 해요.', 'Hôm nay cửa hàng giảm giá.'],
      ['영수증', 'yeongsujeung', 'Biên lai', '영수증을 주세요.', 'Cho tôi biên lai với ạ.'],
      [
        '입어 봐도 돼요?',
        'ibeo bwado dwaeyo?',
        'Tôi có thể mặc thử không?',
        '이 코트를 입어 봐도 돼요?',
        'Tôi có thể mặc thử chiếc áo khoác này không?'
      ],
      ['탈의실', 'taruisil', 'Phòng thay đồ', '탈의실이 어디예요?', 'Phòng thay đồ ở đâu ạ?'],
      ['교환', 'gyohwan', 'Đổi hàng', '교환이 가능해요?', 'Tôi có thể đổi hàng không?']
    ],
    thoi_tiet: [
      ['날씨', 'nalssi', 'Thời tiết', '오늘 날씨는 어때요?', 'Thời tiết hôm nay thế nào?'],
      ['봄', 'bom', 'Mùa xuân', '봄에는 꽃이 피어요.', 'Mùa xuân hoa nở.'],
      ['여름', 'yeoreum', 'Mùa hè', '여름에는 바다에 가요.', 'Mùa hè tôi đi biển.'],
      ['가을', 'gaeul', 'Mùa thu', '가을에는 단풍이 예뻐요.', 'Mùa thu lá đổi màu rất đẹp.'],
      ['겨울', 'gyeoul', 'Mùa đông', '겨울에는 눈이 와요.', 'Mùa đông có tuyết rơi.'],
      ['비', 'bi', 'Mưa', '오늘 비가 많이 와요.', 'Hôm nay mưa nhiều.'],
      ['눈', 'nun', 'Tuyết', '하얀 눈이 내려요.', 'Tuyết trắng đang rơi.'],
      ['바람', 'baram', 'Gió', '바람이 시원해요.', 'Gió mát dễ chịu.'],
      ['구름', 'gureum', 'Mây', '하늘에 구름이 많아요.', 'Trên trời có nhiều mây.'],
      ['햇빛', 'haetbit', 'Ánh nắng', '햇빛이 따뜻해요.', 'Ánh nắng ấm áp.'],
      ['더워요', 'deowoyo', 'Nóng (thời tiết / cảm giác)', '오늘은 정말 더워요.', 'Hôm nay thật nóng.'],
      [
        '추워요',
        'chuwoyo',
        'Lạnh (thời tiết / cảm giác)',
        '밖이 추워요. 옷을 따뜻하게 입어요.',
        'Bên ngoài lạnh. Hãy mặc ấm nhé.'
      ],
      ['따뜻해요', 'ttatteuthaeyo', 'Ấm áp', '오늘은 날씨가 따뜻해요.', 'Hôm nay thời tiết ấm áp.'],
      ['시원해요', 'siwonhaeyo', 'Mát mẻ', '저녁에는 바람이 시원해요.', 'Buổi tối gió mát mẻ.'],
      ['맑아요', 'malgayo', 'Trong / quang đãng', '하늘이 맑아요.', 'Bầu trời quang đãng.'],
      ['흐려요', 'heuryeoyo', 'U ám / nhiều mây', '오늘은 하늘이 흐려요.', 'Hôm nay trời nhiều mây.'],
      ['습해요', 'seuphaeyo', 'Ẩm (thời tiết)', '여름에는 덥고 습해요.', 'Mùa hè nóng và ẩm.'],
      ['기온', 'gion', 'Nhiệt độ không khí', '오늘 기온은 이십 도예요.', 'Nhiệt độ hôm nay là hai mươi độ.'],
      ['계절', 'gyejeol', 'Mùa', '가장 좋아하는 계절은 봄이에요.', 'Mùa tôi thích nhất là mùa xuân.'],
      ['코트', 'koteu', 'Áo khoác dài', '추워서 코트를 입어요.', 'Vì lạnh nên tôi mặc áo khoác dài.'],
      ['목도리', 'mokdori', 'Khăn quàng cổ', '겨울에는 목도리를 해요.', 'Mùa đông tôi quàng khăn.'],
      ['장갑', 'janggap', 'Găng tay', '손이 시려서 장갑을 껴요.', 'Tay lạnh buốt nên tôi đeo găng tay.'],
      ['우비', 'ubi', 'Áo mưa', '비가 오면 우비를 입어요.', 'Khi trời mưa tôi mặc áo mưa.']
    ],
    hen_ho: [
      ['약속', 'yaksok', 'Cuộc hẹn / lời hứa', '오늘 저녁에 약속이 있어요.', 'Tối nay tôi có hẹn.'],
      ['데이트', 'deiteu', 'Buổi hẹn hò', '주말에 데이트해요.', 'Cuối tuần chúng tôi hẹn hò.'],
      ['시간', 'sigan', 'Thời gian / tiếng đồng hồ', '내일 시간이 있어요?', 'Ngày mai bạn có thời gian không?'],
      ['오전', 'ojeon', 'Buổi sáng (trước 12 giờ trưa)', '오전 열 시에 만나요.', 'Gặp nhau lúc mười giờ sáng nhé.'],
      [
        '오후',
        'ohu',
        'Buổi chiều/tối (sau 12 giờ trưa)',
        '오후 세 시에 카페에 가요.',
        'Ba giờ chiều tôi đến quán cà phê.'
      ],
      ['이번 주', 'ibeon ju', 'Tuần này', '이번 주에 같이 영화 봐요.', 'Tuần này cùng xem phim nhé.'],
      ['다음 주', 'daeum ju', 'Tuần sau', '다음 주에 다시 만나요.', 'Tuần sau gặp lại nhé.'],
      ['기념일', 'ginyeomil', 'Ngày kỷ niệm', '오늘은 우리의 기념일이에요.', 'Hôm nay là ngày kỷ niệm của chúng mình.'],
      ['꽃', 'kkot', 'Hoa', '좋아하는 꽃을 골라요.', 'Hãy chọn loài hoa em thích nhé.'],
      ['편지', 'pyeonji', 'Lá thư', '마음을 담아 편지를 써요.', 'Tôi viết thư bằng cả tấm lòng.'],
      ['기다려요', 'gidaryeoyo', 'Đợi / chờ', '카페 앞에서 기다려요.', 'Tôi đợi ở trước quán cà phê.'],
      ['만나요', 'mannayo', 'Gặp', '내일 여섯 시에 만나요.', 'Mai gặp nhau lúc sáu giờ nhé.'],
      ['늦어요', 'neujeoyo', 'Muộn / trễ', '오늘은 십 분 정도 늦어요.', 'Hôm nay tôi đến muộn khoảng mười phút.']
    ],
    sinh_hoat: [
      ['이를 닦아요', 'ireul dakkayo', 'Đánh răng', '밥을 먹고 이를 닦아요.', 'Ăn cơm xong tôi đánh răng.'],
      ['세수해요', 'sesuhaeyo', 'Rửa mặt', '아침에 세수해요.', 'Buổi sáng tôi rửa mặt.'],
      ['샤워해요', 'syawohaeyo', 'Tắm vòi sen', '운동 후에 샤워해요.', 'Tôi tắm sau khi tập thể dục.'],
      ['청소해요', 'cheongsohaeyo', 'Dọn dẹp', '주말에 방을 청소해요.', 'Cuối tuần tôi dọn phòng.'],
      ['빨래해요', 'ppallaehaeyo', 'Giặt quần áo', '일요일에 빨래해요.', 'Chủ Nhật tôi giặt quần áo.'],
      ['요리해요', 'yorihaeyo', 'Nấu ăn', '집에서 저녁을 요리해요.', 'Tôi nấu bữa tối ở nhà.'],
      ['설거지해요', 'seolgeojihaeyo', 'Rửa bát', '밥을 먹은 후에 설거지해요.', 'Tôi rửa bát sau khi ăn cơm.'],
      ['운동해요', 'undonghaeyo', 'Tập thể dục', '매일 삼십 분 운동해요.', 'Mỗi ngày tôi tập thể dục ba mươi phút.'],
      ['산책해요', 'sanchaekhaeyo', 'Đi dạo', '저녁에 공원에서 산책해요.', 'Buổi tối tôi đi dạo ở công viên.'],
      ['읽어요', 'ilgeoyo', 'Đọc', '잠자기 전에 책을 읽어요.', 'Tôi đọc sách trước khi ngủ.'],
      ['써요', 'sseoyo', 'Viết', '공책에 한국어를 써요.', 'Tôi viết tiếng Hàn vào vở.'],
      ['들어요', 'deureoyo', 'Nghe', '버스에서 음악을 들어요.', 'Tôi nghe nhạc trên xe buýt.'],
      ['매일', 'maeil', 'Mỗi ngày', '매일 새 단어를 배워요.', 'Mỗi ngày tôi học từ mới.'],
      ['보통', 'botong', 'Thường / thông thường', '보통 일곱 시에 일어나요.', 'Tôi thường thức dậy lúc bảy giờ.']
    ],
    suc_khoe: [
      ['약국', 'yakguk', 'Hiệu thuốc', '가까운 약국이 어디예요?', 'Hiệu thuốc gần đây ở đâu?'],
      ['약', 'yak', 'Thuốc', '약사에게 약에 대해 물어봐요.', 'Tôi hỏi dược sĩ về thuốc.'],
      ['의사', 'uisa', 'Bác sĩ', '의사에게 증상을 설명해요.', 'Tôi giải thích triệu chứng cho bác sĩ.'],
      ['약사', 'yaksa', 'Dược sĩ', '약사에게 복용 방법을 물어봐요.', 'Tôi hỏi dược sĩ cách dùng thuốc.'],
      ['간호사', 'ganhosa', 'Y tá / điều dưỡng', '간호사가 체온을 재요.', 'Điều dưỡng đo thân nhiệt.'],
      ['아파요', 'apayo', 'Đau / bị ốm', '어디가 아파요?', 'Bạn đau ở đâu?'],
      ['머리', 'meori', 'Đầu', '머리가 조금 아파요.', 'Tôi hơi đau đầu.'],
      ['배', 'bae', 'Bụng', '배가 아파서 병원에 가요.', 'Tôi đau bụng nên đến bệnh viện.'],
      ['목', 'mok', 'Cổ / họng', '목이 아파요.', 'Tôi đau họng.'],
      ['치아', 'chia', 'Răng (cách nói lịch sự)', '치아가 아파서 치과에 가요.', 'Tôi đau răng nên đến nha khoa.'],
      ['손', 'son', 'Bàn tay', '밥을 먹기 전에 손을 씻어요.', 'Tôi rửa tay trước khi ăn cơm.'],
      ['발', 'bal', 'Bàn chân', '많이 걸어서 발이 아파요.', 'Đi bộ nhiều nên chân tôi đau.'],
      ['감기', 'gamgi', 'Cảm lạnh', '감기에 걸려서 쉬고 있어요.', 'Tôi bị cảm nên đang nghỉ ngơi.'],
      ['기침', 'gichim', 'Ho', '기침이 계속 나요.', 'Tôi ho liên tục.'],
      ['열이 나요', 'yeori nayo', 'Bị sốt', '어제부터 열이 나요.', 'Tôi bị sốt từ hôm qua.'],
      ['콧물', 'konmul', 'Nước mũi', '콧물이 나요.', 'Tôi bị chảy nước mũi.'],
      ['피곤해요', 'pigonhaeyo', 'Mệt mỏi', '오늘은 조금 피곤해요.', 'Hôm nay tôi hơi mệt.'],
      ['어지러워요', 'eojireowoyo', 'Chóng mặt', '갑자기 어지러워요.', 'Tôi đột nhiên thấy chóng mặt.'],
      ['알레르기', 'allereugi', 'Dị ứng', '저는 땅콩 알레르기가 있어요.', 'Tôi bị dị ứng đậu phộng.'],
      ['체온', 'che-on', 'Thân nhiệt', '체온을 재 주세요.', 'Hãy đo thân nhiệt giúp tôi.'],
      ['진료', 'jillyo', 'Khám chữa bệnh', '진료를 받으러 왔어요.', 'Tôi đến để được khám bệnh.'],
      ['치과', 'chigwa', 'Nha khoa', '내일 치과에 가요.', 'Ngày mai tôi đến nha khoa.'],
      ['건강', 'geongang', 'Sức khỏe', '건강이 가장 중요해요.', 'Sức khỏe là quan trọng nhất.']
    ]
  };
  const result = [];
  for (const [topic, rows] of Object.entries(groups)) {
    const level = VOCAB_TOPICS.find(item => item.id === topic).level;
    for (const [ko, roman, meaning, exampleKo, exampleVi] of rows)
      result.push({ ko, roman, meaning, level, topic, exampleKo, exampleVi });
  }
  return result;
})();
