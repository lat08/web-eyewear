import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const DEFAULT_PASSWORD = '$2b$10$GM0Vh4Iud8wYoZ56PL.YI.g6YGW07kgr40H2Zjkh1soap0LCjQlcK'

const users = [
  { name: 'Nguyễn Thị Mai', email: 'mai.nguyen@gmail.com', phone: '0901234567', address: '123 Nguyễn Huệ, Quận 1, TP.HCM', role: 'USER' },
  { name: 'Trần Văn Hùng', email: 'hung.tran@gmail.com', phone: '0912345678', address: '45 Lê Lợi, Quận 1, TP.HCM', role: 'USER' },
  { name: 'Lê Thị Hồng Nhung', email: 'nhung.le@gmail.com', phone: '0923456789', address: '78 Trần Hưng Đạo, Quận 5, TP.HCM', role: 'USER' },
  { name: 'Phạm Minh Tuấn', email: 'tuan.pham@gmail.com', phone: '0934567890', address: '12 Hai Bà Trưng, Quận 3, TP.HCM', role: 'USER' },
  { name: 'Hoàng Thị Lan Anh', email: 'lananh.hoang@gmail.com', phone: '0945678901', address: '200 Võ Văn Tần, Quận 3, TP.HCM', role: 'USER' },
  { name: 'Vũ Đức Thắng', email: 'thang.vu@gmail.com', phone: '0956789012', address: '55 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM', role: 'USER' },
  { name: 'Đặng Thị Thuỳ Linh', email: 'linh.dang@gmail.com', phone: '0967890123', address: '88 Nguyễn Đình Chiểu, Quận 3, TP.HCM', role: 'USER' },
  { name: 'Bùi Quang Hải', email: 'hai.bui@gmail.com', phone: '0978901234', address: '34 Lý Tự Trọng, Quận 1, TP.HCM', role: 'USER' },
  { name: 'Ngô Thị Thanh Hà', email: 'ha.ngo@gmail.com', phone: '0989012345', address: '67 Pasteur, Quận 1, TP.HCM', role: 'USER' },
  { name: 'Đỗ Hoàng Nam', email: 'nam.do@gmail.com', phone: '0390123456', address: '99 Cách Mạng Tháng 8, Quận 10, TP.HCM', role: 'USER' },
  { name: 'Trịnh Thị Bích Ngọc', email: 'ngoc.trinh@gmail.com', phone: '0701234567', address: '15 Phạm Ngọc Thạch, Quận 3, TP.HCM', role: 'USER' },
  { name: 'Lý Văn Đạt', email: 'dat.ly@gmail.com', phone: '0712345678', address: '42 Nguyễn Thị Minh Khai, Quận 1, TP.HCM', role: 'USER' },
  { name: 'Phan Thị Mỹ Duyên', email: 'duyen.phan@gmail.com', phone: '0723456789', address: '101 Bùi Viện, Quận 1, TP.HCM', role: 'USER' },
  { name: 'Huỳnh Thanh Phong', email: 'phong.huynh@gmail.com', phone: '0734567890', address: '250 Lê Văn Sỹ, Quận Phú Nhuận, TP.HCM', role: 'USER' },
  { name: 'Võ Thị Kim Chi', email: 'chi.vo@gmail.com', phone: '0745678901', address: '33 Nguyễn Trãi, Quận 5, TP.HCM', role: 'USER' },
  { name: 'Tô Minh Khang', email: 'khang.to@gmail.com', phone: '0856789012', address: '18 Lạc Long Quân, Quận 11, TP.HCM', role: 'USER' },
  { name: 'Dương Thị Yến Nhi', email: 'nhi.duong@gmail.com', phone: '0867890123', address: '77 Trường Chinh, Quận Tân Phú, TP.HCM', role: 'USER' },
  { name: 'Mai Xuân Trường', email: 'truong.mai@gmail.com', phone: '0878901234', address: '5 Nguyễn Văn Cừ, Quận 5, TP.HCM', role: 'USER' },
  { name: 'Châu Thị Diễm My', email: 'my.chau@gmail.com', phone: '0889012345', address: '120 Sư Vạn Hạnh, Quận 10, TP.HCM', role: 'USER' },
  { name: 'Lâm Quốc Bảo', email: 'bao.lam@gmail.com', phone: '0890123456', address: '63 Phan Đăng Lưu, Quận Phú Nhuận, TP.HCM', role: 'USER' },
  // Hà Nội
  { name: 'Nguyễn Hữu Phúc', email: 'phuc.nguyen.hn@gmail.com', phone: '0241234567', address: '10 Hàng Bài, Hoàn Kiếm, Hà Nội', role: 'USER' },
  { name: 'Trần Thị Quỳnh Trang', email: 'trang.tran.hn@gmail.com', phone: '0242345678', address: '28 Phố Huế, Hai Bà Trưng, Hà Nội', role: 'USER' },
  { name: 'Lê Anh Dũng', email: 'dung.le.hn@gmail.com', phone: '0353456789', address: '5 Kim Mã, Ba Đình, Hà Nội', role: 'USER' },
  { name: 'Phạm Thị Hương Giang', email: 'giang.pham.hn@gmail.com', phone: '0364567890', address: '90 Đội Cấn, Ba Đình, Hà Nội', role: 'USER' },
  { name: 'Hoàng Đình Quân', email: 'quan.hoang.hn@gmail.com', phone: '0375678901', address: '15 Tràng Tiền, Hoàn Kiếm, Hà Nội', role: 'USER' },
  // Đà Nẵng
  { name: 'Trương Thị Thanh Thảo', email: 'thao.truong.dn@gmail.com', phone: '0236789012', address: '50 Bạch Đằng, Hải Châu, Đà Nẵng', role: 'USER' },
  { name: 'Lưu Văn Hiếu', email: 'hieu.luu.dn@gmail.com', phone: '0237890123', address: '120 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng', role: 'USER' },
  { name: 'Cao Thị Mộng Trinh', email: 'trinh.cao.dn@gmail.com', phone: '0508901234', address: '8 Trần Phú, Hải Châu, Đà Nẵng', role: 'USER' },
  // Cần Thơ
  { name: 'Sơn Thị Ngọc Hân', email: 'han.son.ct@gmail.com', phone: '0299012345', address: '25 Nguyễn Trãi, Ninh Kiều, Cần Thơ', role: 'USER' },
  { name: 'Tăng Hồng Phát', email: 'phat.tang.ct@gmail.com', phone: '0390234567', address: '18 30 Tháng 4, Ninh Kiều, Cần Thơ', role: 'USER' },
]

async function main() {
  console.log(`🌱 Seeding ${users.length} Vietnamese users...`)

  let created = 0
  let skipped = 0

  for (const user of users) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } })
    if (existing) {
      skipped++
      continue
    }

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: DEFAULT_PASSWORD,
        phone: user.phone,
        address: user.address,
        role: user.role,
      }
    })
    created++
    console.log(`  ✅ ${user.name} (${user.email})`)
  }

  console.log(`\n🎉 Done! Created: ${created}, Skipped (already exist): ${skipped}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
