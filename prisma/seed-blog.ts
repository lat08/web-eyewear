const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const posts = [
    {
      title: "Xu Hướng Màu Lens Hot Nhất 2024",
      slug: "xu-huong-mau-lens-2024",
      excerpt: "Khám phá những tông màu lens đang 'làm mưa làm gió' trong giới trẻ năm nay, từ tone Tây thời thượng đến tone tự nhiên trong trẻo.",
      content: `
        <p>Chọn màu lens không chỉ là vấn đề thẩm mỹ mà còn là cách bạn thể hiện cá tính của mình. Năm 2024 chứng kiến sự lên ngôi của các tông màu mang hơi hướng tự nhiên nhưng vẫn có điểm nhấn đặc biệt.</p>
        <h3>1. Tone Nâu Oolong - Sự lựa chọn hoàn hảo hàng ngày</h3>
        <p>Màu nâu không bao giờ lỗi mốt. Tuy nhiên, năm nay, các dòng lens màu nâu với vân xám nhẹ hoặc nâu trà sữa đang được ưa chuộng hơn cả. Nó tạo hiệu ứng mắt sâu và long lanh một cách tự nhiên.</p>
        <h3>2. Tone Xám Tây - Thời thượng và quyến rũ</h3>
        <p>Dành cho những buổi tiệc tối hoặc khi bạn muốn một diện mạo phá cách. Xám khói hoặc xám xanh là những lựa chọn hàng đầu của các tín đồ làm đẹp.</p>
        <p>Tại Kilala Eye, chúng tôi luôn cập nhật những mẫu mã mới nhất để phục vụ nhu cầu đa dạng của khách hàng.</p>
      `,
      image: "https://images.unsplash.com/photo-1516709828347-194957e62a17?q=80&w=1200&auto=format&fit=crop",
      category: "XU HƯỚNG",
    },
    {
      title: "Hướng Dẫn Đeo Lens Cho Người Mới Bắt Đầu",
      slug: "huong-dan-deo-lens-cho-nguoi-moi",
      excerpt: "Đeo lens lần đầu có thể gặp chút khó khăn. Đừng lo, Kilala sẽ hướng dẫn bạn từng bước để đeo và tháo lens một cách dễ dàng và an toàn nhất.",
      content: `
        <p>Nhiều người cảm thấy sợ hãi khi lần đầu chạm tay vào mắt. Nhưng thực tế, việc đeo kính áp tròng rất đơn giản nếu bạn làm đúng kỹ thuật.</p>
        <h3>Bước 1: Vệ sinh tay sạch sẽ</h3>
        <p>Đây là bước quan trọng nhất để tránh vi khuẩn xâm nhập vào mắt. Hãy rửa tay bằng xà phòng và lau khô bằng khăn không xơ.</p>
        <h3>Bước 2: Kiểm tra lens</h3>
        <p>Đặt lens lên đầu ngón tay trỏ. Kiểm tra xem lens có bị ngược hay không (hình cái bát là đúng, hình cái đĩa có viền bẻ ra là sai).</p>
        <h3>Bước 3: Đưa lens vào mắt</h3>
        <p>Dùng một tay kéo mí mắt trên, một tay kéo mí dưới. Nhìn thẳng hoặc nhìn lên trên và nhẹ nhàng đặt lens vào lòng đen.</p>
      `,
      image: "https://images.unsplash.com/photo-1616422285623-13ff0167295c?q=80&w=1200&auto=format&fit=crop",
      category: "HƯỚNG DẪN",
    },
    {
      title: "Cách Vệ Sinh Khay Đựng Lens Đúng Cách",
      slug: "ve-sinh-khay-dung-lens",
      excerpt: "Vệ sinh khay đựng lens cũng quan trọng không kém gì vệ sinh lens. Hãy cùng tìm hiểu cách bảo quản phụ kiện này để bảo vệ đôi mắt của bạn.",
      content: `
        <p>Khay đựng lens là nơi trú ngụ lý tưởng của vi khuẩn nếu không được vệ sinh thường xuyên.</p>
        <p>Bạn nên thay khay đựng mới mỗi 3 tháng một lần và rửa sạch bằng dung dịch ngâm lens mỗi ngày.</p>
      `,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200&auto=format&fit=crop",
      category: "BẢO QUẢN",
    },
    {
      title: "So Sánh Lens 1 Ngày Và Lens Nhiều Ngày",
      slug: "so-sanh-lens-1-ngay-va-nhieu-ngay",
      excerpt: "Bạn đang phân vân giữa lens dùng 1 lần và lens dùng nhiều lần? Bài viết này sẽ giúp bạn chọn ra loại phù hợp với phong cách sống của mình.",
      content: `
        <p>Mỗi loại lens đều có ưu và nhược điểm riêng. Lens 1 ngày mang lại sự tiện lợi và vệ sinh tuyệt đối, trong khi lens nhiều ngày tiết kiệm chi phí hơn.</p>
      `,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop",
      category: "REVIEW",
    }
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("Seed blog thành công!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
