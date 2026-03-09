const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const posts = [
  {
    title: "Top 5 Màu Kính Áp Tròng (Lens) Được Ưa Chuộng Nhất 2024",
    slug: "top-5-mau-lens-hot-nhat-2024",
    excerpt: "Điểm qua 5 tông màu lens đang dẫn đầu xu hướng năm 2024: từ Nâu Tây tự nhiên, Xám Khói cá tính đến Xanh Dương cuốn hút. Khám phá ngay để tìm ra màu lens chân ái của bạn!",
    content: \`
      <div class="prose max-w-none text-gray-800 space-y-4">
        <p class="text-lg pb-2">Kính áp tròng không chỉ là một trong những sản phẩm hỗ trợ thị lực hiệu quả mà còn là phụ kiện làm đẹp không thể thiếu của các tín đồ thời trang. Năm 2024 đánh dấu sự lên ngôi của các dòng lens tự nhiên nhưng phá cách. Cùng <strong>web-eyewear</strong> điểm qua 5 màu lens "chân ái" của năm nay nhé!</p>
        
        <h3 class="text-xl font-bold mt-6 text-gray-900">1. Nâu Choco (Chocolate Brown) - Sự Đầu Tư An Toàn</h3>
        <p>Màu Nâu Choco luôn đứng vị trí đầu bảng vì khả năng hòa hợp tuyệt vời với màu mắt tự nhiên của người Châu Á. Khi đeo, đôi mắt bạn sẽ có chiều sâu, to tròn và long lanh một cách tự nhiên "đeo như không đeo".</p>
        <img src="https://images.unsplash.com/photo-1542178243-bc0f24cb39bb?q=80&w=1200&auto=format&fit=crop" alt="Màu lens Nâu Choco" class="w-full rounded-lg shadow-md my-4 object-cover h-[400px]" />
        
        <h3 class="text-xl font-bold mt-6 text-gray-900">2. Xám Tây (Smoky Grey) - Cuốn Hút Mọi Ánh Nhìn</h3>
        <p>Xám Khói mang lại khí chất lai Tây cực kỳ sang chảnh và quyến rũ. Nếu bạn chuẩn bị đi tiệc và kết hợp với kiểu trang điểm đậm (smokey makeup), một đôi lens xám khói chắc chắn sẽ biến bạn thành tâm điểm.</p>
        
        <h3 class="text-xl font-bold mt-6 text-gray-900">3. Nâu Trà Sữa (Milk Tea Brown) - Ngọt Ngào & Trong Trẻo</h3>
        <p>Màu Nâu Trà Sữa có tone sáng hơn Choco một chút, mang lại cảm giác cực kỳ trong sáng và nhẹ nhàng. Phù hợp cho cả đi học, đi làm lẫn dạo phố.</p>
        <img src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=1200&auto=format&fit=crop" alt="Kính áp tròng nâu trà sữa" class="w-full rounded-lg shadow-md my-4 object-cover h-[400px]" />

        <h3 class="text-xl font-bold mt-6 text-gray-900">4. Xanh Dương Trong Veo (Aqua Blue)</h3>
        <p>Tone xanh dương nhạt đang "làm mưa làm gió" mùa hè này. Mặc dù là một màu khá kén, nhưng với sự điều chỉnh vân lens tự nhiên hiện nay, Aqua Blue giúp khuôn mặt bừng sáng và sống động.</p>

        <h3 class="text-xl font-bold mt-6 text-gray-900">5. Rêu Nhạt (Olive Green) - Sự Chuyển Màu Thú Vị</h3>
        <p>Nếu bạn đã chán Nâu và Xám, Olive là màu bạn phải thử. Sự pha trộn giữa sắc xanh lá úa và nâu vàng tạo ra một đôi mắt đầy huyền bí.</p>

        <p class="font-semibold text-lg mt-8 text-primary">Tất cả các màu trên đều có sẵn tại shop với đủ mẫu mã (1 ngày, 1 tháng, 6 tháng). Xem ngay trong mục "Sản phẩm" nha!</p>
      </div>
    \`,
    image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=1200&auto=format&fit=crop",
    category: "Góc Làm Đẹp",
  },
  {
    title: "Hướng Dẫn Cực Chi Tiết: Đeo & Tháo Lens Cho Người Mới Bắt Đầu",
    slug: "huong-dan-deo-thao-lens-cho-newbie",
    excerpt: "Lần đầu đeo kính áp tròng? Đừng hoảng sợ! Bài viết này sẽ cung cấp hướng dẫn Step-by-Step an toàn, chuẩn y khoa từ việc rửa tay đến khi đưa lens vào mắt.",
    content: \`
      <div class="prose max-w-none text-gray-800 space-y-4">
        <p class="text-lg">Việc đụng chạm trực tiếp vào mắt thường khiến người mới (newbie) ái ngại. Tuy nhiên, chỉ cần nắm rõ các nguyên tắc vệ sinh cơ bản, việc tự đeo lens sẽ chỉ tốn của bạn chưa đến 30 giây!</p>
        
        <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200&auto=format&fit=crop" alt="Bảo quản và đeo lens" class="w-full rounded-lg shadow-md my-4 object-cover h-[400px]" />

        <h3 class="text-xl font-bold mt-6 text-gray-900">Quy Tắc Số 1: Luôn Rửa Tay Bằng Xà Phòng Trước</h3>
        <p>Mắt rất dễ bị nhiễm khuẩn. Hãy đảm bảo bạn dùng xà phòng diệt khuẩn rửa sạch tay, lau khô bằng khăn không rụng sợi lông.</p>
        
        <h3 class="text-xl font-bold mt-6 text-gray-900">Các Bước Đeo Lens (Vào mắt)</h3>
        <ul class="list-decimal pl-6 space-y-2 font-medium">
          <li><strong>Phân biệt mặt lens:</strong> Đặt lens lên đầu ngón tay trỏ. Nếu lens có hình chữ "U" hoàn hảo (cái bát) là đúng chiều. Nếu viền lens bè ra ngoài (cái đĩa) là sai chiều, cần lật lại ngay.</li>
          <li><strong>Dùng ngón giữa</strong> của bàn tay đang cầm lens kéo nhẹ mí mắt dưới xuống.</li>
          <li><strong>Dùng ngón giữa hoặc ngón trỏ của tay kia</strong> kéo mí mắt trên lên cao, giữ cho mi mắt không chớp.</li>
          <li>Nhìn thẳng hoặc nhìn hơi ngước lên và <strong>nhẹ nhàng đặt lens vào lòng đen.</strong></li>
          <li>Chớp nhẹ mắt vài lần để lens tự vào đúng form và vị trí trung tâm.</li>
        </ul >

        <h3 class="text-xl font-bold mt-6 text-gray-900">Các Bước Tháo Lens (Ra khỏi mắt)</h3>
        <ul class="list-decimal pl-6 space-y-2 font-medium">
          <li>Ngước mắt lên trần nhà.</li>
          <li>Dùng ngón tay giữa kéo nhẹ mí dưới xuống.</li>
          <li>Dùng ngón trỏ chạm nhẹ vào viên lens, trượt nhẹ nó xuống góc mắt dưới (tròng trắng).</li>
          <li>Dùng ngón cái và ngón trỏ nhẹ nhàng "bóp" viên lens và lấy ra.</li>
        </ul>

        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
          <p class="font-bold">💡 Mẹo nhỏ:</p>
          <p>Nếu thấy khó lấy, có thể nhỏ 1-2 giọt nhỏ mắt chuyên dụng chớp chớp cho lens mềm ra trước khi thực hiện bước tháo.</p>
        </div>
      </div>
    \`,
    image: "https://images.unsplash.com/photo-1616422285623-13ff0167295c?q=80&w=1200&auto=format&fit=crop",
    category: "Kiến Thức Nhãn Khoa",
  },
  {
    title: "Sự Thật Về Việc Đeo Lens Đi Ngủ - Hậu Quả Khôn Lường",
    slug: "tac-hai-cua-viec-deo-lens-di-ngu",
    excerpt: "Quên tháo kính áp tròng khi đi ngủ có nguy hiểm không? Hãy cùng các chuyên gia tìm hiểu nguyên nhân tại sao đây là lệnh CẤM KỴ khi dùng lens.",
    content: \`
      <div class="prose max-w-none text-gray-800 space-y-4">
        <p class="text-lg">Việc lười biếng hoặc vô tình chợp mắt vài canh giờ khi đang mang lens có thể là thói quen của nhiều bạn. Thế nhưng, bạn có biết việc làm này có khả năng làm <strong>tổn thương giác mạc vĩnh viễn</strong>?</p>
        
        <h3 class="text-xl font-bold mt-6 text-gray-900">Tại sao không được đeo lens khi ngủ?</h3>
        <p>Giác mạc của mắt chúng ta <strong>cần Oxy từ môi trường không khí để hô hấp</strong> (vì nó không có mạch máu nuôi dưỡng trực tiếp). Khi đang thức, mỗi lần chúng ta chớp mắt, nước mắt sẽ đem oxy cung cấp cho giác mạc.</p>
        <p>Lớp kính áp tròng vốn dĩ đã là một vách ngăn. Khi bạn nhắm mắt ngủ, dòng lưu thông trao đổi Oxy bị ngắt hoàn toàn. Điều này dẫn đến tình trạng <strong>thiếu Oxy giác mạc cấp tính</strong>.</p>
        
        <img src="https://images.unsplash.com/photo-1445053023192-8d45cb66099d?q=80&w=1200&auto=format&fit=crop" alt="Giấc ngủ và sự an toàn của mắt" class="w-full rounded-lg shadow-md my-4 object-cover h-[400px]" />

        <h3 class="text-xl font-bold mt-6 text-red-600">Các biến chứng có thể xảy ra:</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Loét giác mạc:</strong> Thiếu oxy làm giác mạc trầy xước, tạo điều kiện cho vi khuẩn sinh sôi.</li>
          <li><strong>Tâm dịch đỏ mắt:</strong> Các mạch máu dưới kết mạc vỡ hoặc viêm mạnh đỏ ngầu.</li>
          <li><strong>Bề mặt lens "dính chặt" vào mắt:</strong> Nước mắt không tiết ra được, lens cạn khô và bám cứng vào giác mạc. Khi bạn cố tháo có thể làm rách màng giác mạc!</li>
        </ul>

        <h3 class="text-xl font-bold mt-6 text-gray-900">Cách xử lý nếu lỡ quên tháo lens khi ngủ</h3>
        <p>Đừng hoảng sợ và tuyệt đối <strong>không cậy lấy lens ra ngay khi thức dậy</strong> vì lúc này mắt rất khô. Việc bạn cần làm là:</p>
        <ol class="list-decimal pl-6 space-y-2 font-medium bg-gray-50 p-4 rounded-lg mt-2">
          <li>Nhỏ nước mắt nhân tạo (nước nhỏ mắt chuyên dụng cho lens) thật nhiều.</li>
          <li>Nhắm mắt lại vài giây, mát-xa mí mắt cực kỳ nhẹ nhàng để dung dịch ngấm vào phân tách mặt lens.</li>
          <li>Chớp mắt đến khi cảm thấy lens đã di chuyển lại bình thường thì mới bắt đầu lấy ra và vứt luôn đôi lens đó.</li>
        </ol>
      </div>
    \`,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop",
    category: "Cảnh Báo & Sức Khỏe",
  },
  {
    title: "Phân Khúc Chi Tiết: Nên Mua Kính Áp Tròng 1 Ngày Hay 6 Tháng?",
    slug: "nen-mua-lens-1-ngay-hay-6-thang",
    excerpt: "Lựa chọn thời hạn sử dụng lens luôn khiến người mua đau đầu. Đánh giá chi tiết ưu và nhược điểm của 2 dòng lens này để tối ưu túi tiền của bạn.",
    content: \`
      <div class="prose max-w-none text-gray-800 space-y-4">
        <p class="text-lg">Trong thị trường kính áp tròng, hai dòng sản phẩm phổ biến nhất là <strong>Lens dùng 1 ngày (Daily)</strong> và <strong>Lens dài hạn (Monthly / 6 Months / Yearly)</strong>. Liệu cái nào tốt hơn? Câu trả lời là: Phụ thuộc vào nhu cầu của bạn!</p>

        <img src="https://images.unsplash.com/photo-1516709828347-194957e62a17?q=80&w=1200&auto=format&fit=crop" alt="Các loại kính áp tròng" class="w-full rounded-lg shadow-md my-4 object-cover h-[400px]" />

        <h3 class="text-2xl font-bold mt-8 text-gray-900 border-b pb-2">Kính Áp Tròng 1 Ngày (Daily Lenses)</h3>
        <p class="font-medium text-green-600">Ưu điểm:</p>
        <ul class="list-disc pl-6 space-y-2 mb-4">
          <li><span class="font-bold">Vệ sinh tuyệt đối:</span> Dùng xong là vứt bỏ. Không phải lo lắng vệ sinh hay bảo quản khay nước.</li>
          <li><span class="font-bold">Độ ẩm cao x2:</span> Chất liệu lens daily rất mỏng và ngậm nước mạnh, bạn có thể đeo 10-12 tiếng không bị mỏi.</li>
          <li><span class="font-bold">Linh hoạt màu sắc:</span> Chơi màu xám thứ Hai, chơi màu nâu thứ Ba, hoàn toàn bình thường.</li>
        </ul>
        <p class="font-medium text-red-600">Nhược điểm:</p>
        <ul class="list-disc pl-6 space-y-2 mb-6">
          <li>Ngôi vương về sự đắt đỏ nếu bạn dùng liên tục mỗi ngày trong tuần.</li>
        </ul>

        <h3 class="text-2xl font-bold mt-8 text-gray-900 border-b pb-2">Kính Áp Tròng 6 Tháng (Long-term Lenses)</h3>
        <p class="font-medium text-green-600">Ưu điểm:</p>
        <ul class="list-disc pl-6 space-y-2 mb-4">
          <li><span class="font-bold">Chi Phí Cực Tốt:</span> Nếu chia tiền ra 6 tháng sử dụng thì nó vô cùng rẻ (gấp 10 lần daily).</li>
          <li><span class="font-bold">Form dáng chắc chắn:</span> Rất dễ đeo kể cả với người mới bắt đầu vì độ dẻo vừa phải.</li>
        </ul>
        <p class="font-medium text-red-600">Nhược điểm:</p>
        <ul class="list-disc pl-6 space-y-2 mb-6">
          <li>Việc chăm sóc, vệ sinh lens, ngâm rửa bảo quản cần diễn ra cực kỳ cẩn thận hàng ngày.</li>
          <li>Đeo sau 2-3 tháng có thể dính lượng protein nhất định ở mắt, làm nhòe mắt nếu bạn lười chà rửa.</li>
        </ul>

        <div class="bg-indigo-50 p-6 rounded-lg mt-8 text-center">
          <h4 class="font-bold text-xl mb-2 text-indigo-700">Tóm Lại (Kết Luận)</h4>
          <p class="mb-2">👉 Nếu bạn <strong>hiếm thi thoảng mới dùng (đám cưới, kỷ yếu, sinh nhật):</strong> MUA LENS 1 NGÀY NGAY LẬP TỨC.</p>
          <p>👉 Nếu bạn <strong>cận thị, đeo thay kính cận mỗi ngày đi học/làm:</strong> MUA LENS 1 THÁNG HOẶC 6 THÁNG để tiết kiệm ví tiền tuyệt đối nhé.</p>
        </div>
      </div>
    \`,
    image: "https://images.unsplash.com/photo-1542178243-bc0f24cb39bb?q=80&w=1200&auto=format&fit=crop",
    category: "Góc Làm Đẹp",
  }
];

async function seedPosts() {
  console.log("Seeding blog posts...");
  // Clear old posts
  await prisma.post.deleteMany({});
  
  for (const post of posts) {
    await prisma.post.create({
      data: post
    });
    console.log("Upserted post: " + post.slug);
  }
}

seedPosts().then(() => {
  console.log('✅ ALL POSTS SEEDED!');
  process.exit(0);
}).catch(console.error);
