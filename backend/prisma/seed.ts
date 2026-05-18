import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const users = [
  {
    email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
    username: 'admin',
    publicSlug: null as string | null,
    inquiryEmail: null as string | null,
    password: process.env.SEED_ADMIN_PASSWORD || 'changeme123',
    name: 'Admin',
    phone: '0900000000',
    tagline: null as string | null,
    bio: 'Quản trị viên hệ thống.',
  },
  {
    email: 'nguyenlamtung@architect.local',
    username: 'nguyenlamtung',
    publicSlug: 'tankientung',
    // ⚠️ Đổi email này thành email THẬT để nhận mail
    inquiryEmail: process.env.SEED_TUNG_EMAIL || null,
    password: 'nguyenlamtung90',
    name: 'Nguyễn Lâm Tùng',
    phone: '0901234567',
    tagline: 'Nhà phố hiện đại - Tối ưu công năng',
    bio: 'Kiến trúc sư với hơn 10 năm kinh nghiệm thiết kế nhà phố và cải tạo. Phong cách hiện đại, tối ưu công năng cho khu đất hẹp.',
  },
  {
    email: 'nguyenvanhung@architect.local',
    username: 'nguyenvanhung',
    publicSlug: 'hung',
    inquiryEmail: process.env.SEED_HUNG_EMAIL || null,
    password: 'nguyenvanhung94',
    name: 'Nguyễn Văn Hùng',
    phone: '0907654321',
    tagline: 'Biệt thự & nhà vườn - Hoà với thiên nhiên',
    bio: 'Kiến trúc sư chuyên biệt thự, nhà vườn và công trình nghỉ dưỡng. Tốt nghiệp Đại học Kiến trúc TP.HCM, hơn 8 năm kinh nghiệm.',
  },
];

const categories = [
  { slug: 'nha-pho', name: 'Nhà phố', description: 'Nhà phố mặt tiền, nhà ống cải tạo', order: 1 },
  {
    slug: 'biet-thu',
    name: 'Biệt thự',
    description: 'Biệt thự sân vườn, biệt thự nghỉ dưỡng',
    order: 2,
  },
  { slug: 'nha-cap-4', name: 'Nhà cấp 4', description: 'Nhà cấp 4 hiện đại, mái Thái', order: 3 },
  { slug: 'cai-tao', name: 'Cải tạo', description: 'Cải tạo nâng cấp công trình cũ', order: 4 },
  { slug: 'van-phong', name: 'Văn phòng', description: 'Thiết kế nội thất văn phòng', order: 5 },
];

// Demo images từ Unsplash (free, themed architecture)
const IMG = {
  modernHouse1: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
  modernHouse2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  modernHouseInt: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
  villa1: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
  villa2: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
  villaGarden: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  townhouse1: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80',
  townhouseInt: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
  smallHouse1: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80',
  smallHouse2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
};

const projects = [
  {
    slug: 'nha-pho-3-tang-quan-7',
    title: 'Nhà phố 3 tầng - Quận 7',
    description:
      'Nhà phố 3 tầng với mặt tiền hiện đại, tối ưu công năng cho gia đình 5 người. Diện tích sàn 240m². Hoàn thiện 2024.',
    area: 240,
    location: 'Quận 7, TP.HCM',
    year: 2024,
    authorUsername: 'nguyenlamtung',
    categorySlugs: ['nha-pho'],
    coverImage: IMG.modernHouse1,
    gallery: [IMG.modernHouse2, IMG.modernHouseInt],
  },
  {
    slug: 'biet-thu-vuon-bao-loc',
    title: 'Biệt thự vườn - Bảo Lộc',
    description:
      'Biệt thự nghỉ dưỡng 2 tầng giữa đồi chè, thiết kế tối giản hòa với thiên nhiên. Diện tích sàn 320m², khuôn viên 1.500m².',
    area: 320,
    location: 'Bảo Lộc, Lâm Đồng',
    year: 2023,
    authorUsername: 'nguyenvanhung',
    categorySlugs: ['biet-thu'],
    coverImage: IMG.villa1,
    gallery: [IMG.villa2, IMG.villaGarden],
  },
  {
    slug: 'nha-ong-cai-tao-quan-binh-thanh',
    title: 'Cải tạo nhà ống - Quận Bình Thạnh',
    description:
      'Cải tạo nhà ống cũ 4x16m thành không gian sống hiện đại, tận dụng giếng trời và sân sau để lấy sáng tự nhiên.',
    area: 192,
    location: 'Quận Bình Thạnh, TP.HCM',
    year: 2024,
    authorUsername: 'nguyenlamtung',
    categorySlugs: ['nha-pho', 'cai-tao'],
    coverImage: IMG.townhouse1,
    gallery: [IMG.townhouseInt],
  },
  {
    slug: 'nha-cap-4-mai-thai-long-an',
    title: 'Nhà cấp 4 mái Thái - Long An',
    description:
      'Nhà cấp 4 mái Thái 3 phòng ngủ trên khu đất 8x20m, chi phí xây dựng tối ưu cho gia đình trẻ.',
    area: 110,
    location: 'Bến Lức, Long An',
    year: 2024,
    authorUsername: 'nguyenvanhung',
    categorySlugs: ['nha-cap-4'],
    coverImage: IMG.smallHouse1,
    gallery: [IMG.smallHouse2],
  },
];

const services = [
  {
    slug: 'thiet-ke-kien-truc',
    title: 'Thiết kế kiến trúc',
    description: 'Lên phương án mặt bằng, phối cảnh 3D, hồ sơ kỹ thuật thi công đầy đủ.',
    icon: 'blueprint',
    priceFrom: 200000,
    unit: 'm²',
    order: 1,
  },
  {
    slug: 'thi-cong-tron-goi',
    title: 'Thi công trọn gói',
    description: 'Thi công phần thô và hoàn thiện. Cam kết tiến độ và chất lượng. Bảo hành 5 năm.',
    icon: 'hammer',
    priceFrom: 5500000,
    unit: 'm²',
    order: 2,
  },
  {
    slug: 'thiet-ke-noi-that',
    title: 'Thiết kế nội thất',
    description:
      'Thiết kế và thi công nội thất theo phong cách yêu cầu. Cung cấp đồ gỗ công nghiệp & tự nhiên.',
    icon: 'sofa',
    priceFrom: 150000,
    unit: 'm²',
    order: 3,
  },
  {
    slug: 'tu-van-cai-tao',
    title: 'Tư vấn cải tạo',
    description: 'Khảo sát hiện trạng, đưa ra phương án tối ưu chi phí cải tạo.',
    icon: 'wrench',
    priceFrom: 0,
    unit: 'lần',
    order: 4,
  },
];

const testimonials = [
  {
    customerName: 'Anh Trần Minh Khoa',
    role: 'Chủ nhà - Quận 7',
    content:
      'Anh Tùng tư vấn tận tâm từ A-Z. Nhà hoàn thiện đúng tiến độ, chi phí trong dự toán. Rất hài lòng!',
    rating: 5,
    projectSlug: 'nha-pho-3-tang-quan-7',
    order: 1,
  },
  {
    customerName: 'Chị Lê Thu Hà',
    role: 'Chủ biệt thự - Bảo Lộc',
    content: 'Thiết kế đẹp, hòa với cảnh quan đồi chè. Đội thi công làm cẩn thận, sạch sẽ.',
    rating: 5,
    projectSlug: 'biet-thu-vuon-bao-loc',
    order: 2,
  },
  {
    customerName: 'Anh Phạm Quốc Bảo',
    role: 'Chủ nhà - Bình Thạnh',
    content:
      'Nhà cũ 30 năm tuổi được cải tạo thành không gian hiện đại, sáng sủa. Cảm ơn KTS rất nhiều.',
    rating: 5,
    projectSlug: 'nha-ong-cai-tao-quan-binh-thanh',
    order: 3,
  },
];

const blogPosts = [
  {
    slug: '5-luu-y-khi-xay-nha-pho-mat-tien-4m',
    title: '5 lưu ý khi xây nhà phố mặt tiền 4m',
    excerpt: 'Diện tích hẹp đòi hỏi thiết kế thông minh. Cùng tìm hiểu các kinh nghiệm thực tế.',
    content:
      '# 5 lưu ý khi xây nhà phố mặt tiền 4m\n\nNhà phố mặt tiền 4m là kiểu nhà phổ biến nhất ở Việt Nam...\n\n## 1. Bố trí giếng trời\n\nGiếng trời giúp...',
    coverImage: null,
    authorUsername: 'nguyenlamtung',
    published: true,
  },
  {
    slug: 'biet-thu-vuon-can-luu-y-gi-ve-phong-thuy',
    title: 'Biệt thự vườn cần lưu ý gì về phong thủy?',
    excerpt: 'Phong thủy không mê tín, mà là khoa học về không khí, ánh sáng, hướng gió.',
    content:
      '# Biệt thự vườn và phong thủy\n\nNhiều khách hàng quan tâm tới phong thủy khi xây biệt thự...',
    coverImage: null,
    authorUsername: 'nguyenvanhung',
    published: true,
  },
];

const faqs = [
  {
    question: 'Chi phí thiết kế và thi công trọn gói trung bình bao nhiêu?',
    answer:
      'Thiết kế từ 200.000đ/m², thi công trọn gói từ 5.500.000đ/m² tùy mức độ hoàn thiện. Liên hệ để được báo giá chi tiết.',
    order: 1,
  },
  {
    question: 'Thời gian thi công 1 căn nhà phố trung bình?',
    answer: 'Nhà phố 3 tầng diện tích sàn ~200m² thường thi công 4-6 tháng, bao gồm cả nội thất.',
    order: 2,
  },
  {
    question: 'Có bảo hành sau khi bàn giao không?',
    answer:
      'Bảo hành phần kết cấu 5 năm, phần hoàn thiện 1 năm, thiết bị theo bảo hành của nhà sản xuất.',
    order: 3,
  },
  {
    question: 'Có hỗ trợ xin giấy phép xây dựng không?',
    answer: 'Có. Chúng tôi hỗ trợ trọn gói hồ sơ và thủ tục xin phép xây dựng tại địa phương.',
    order: 4,
  },
];

async function main() {
  console.log('Seeding users...');
  const userMap = new Map<string, string>(); // username → id
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        passwordHash,
        username: u.username,
        publicSlug: u.publicSlug,
        inquiryEmail: u.inquiryEmail,
        tagline: u.tagline,
        name: u.name,
        phone: u.phone,
        bio: u.bio,
      },
      create: {
        email: u.email,
        username: u.username,
        publicSlug: u.publicSlug,
        inquiryEmail: u.inquiryEmail,
        tagline: u.tagline,
        passwordHash,
        name: u.name,
        phone: u.phone,
        bio: u.bio,
      },
    });
    userMap.set(u.username, user.id);
    console.log(`  ✓ ${u.username} (${u.email})`);
  }

  console.log('Seeding categories...');
  const categoryMap = new Map<string, string>(); // slug → id
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, order: c.order },
      create: c,
    });
    categoryMap.set(c.slug, cat.id);
    console.log(`  ✓ ${c.slug}`);
  }

  console.log('Seeding projects...');
  const projectMap = new Map<string, string>(); // slug → id
  for (const p of projects) {
    const { authorUsername, categorySlugs, gallery, ...projectData } = p;
    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        ...projectData,
        authorId: userMap.get(authorUsername),
        categories: {
          set: categorySlugs.map((slug) => ({ id: categoryMap.get(slug)! })),
        },
      },
      create: {
        ...projectData,
        authorId: userMap.get(authorUsername),
        categories: {
          connect: categorySlugs.map((slug) => ({ id: categoryMap.get(slug)! })),
        },
      },
    });
    projectMap.set(p.slug, project.id);

    // Refresh gallery images
    await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
    if (gallery && gallery.length) {
      await prisma.projectImage.createMany({
        data: gallery.map((url, order) => ({ projectId: project.id, url, order })),
      });
    }
    console.log(`  ✓ ${p.slug} (${gallery?.length || 0} ảnh)`);
  }

  console.log('Seeding services...');
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
    console.log(`  ✓ ${s.slug}`);
  }

  console.log('Seeding testimonials...');
  for (const t of testimonials) {
    const { projectSlug, ...rest } = t;
    // Testimonial không có unique constraint nên dùng deleteMany + create
    await prisma.testimonial.deleteMany({
      where: { customerName: t.customerName, projectId: projectMap.get(projectSlug) ?? null },
    });
    await prisma.testimonial.create({
      data: { ...rest, projectId: projectMap.get(projectSlug) },
    });
    console.log(`  ✓ ${t.customerName}`);
  }

  console.log('Seeding blog posts...');
  for (const b of blogPosts) {
    const { authorUsername, ...postData } = b;
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: {
        ...postData,
        authorId: userMap.get(authorUsername)!,
        publishedAt: b.published ? new Date() : null,
      },
      create: {
        ...postData,
        authorId: userMap.get(authorUsername)!,
        publishedAt: b.published ? new Date() : null,
      },
    });
    console.log(`  ✓ ${b.slug}`);
  }

  console.log('Seeding FAQs...');
  await prisma.faq.deleteMany();
  for (const f of faqs) {
    await prisma.faq.create({ data: f });
    console.log(`  ✓ ${f.question.slice(0, 40)}...`);
  }

  console.log('\nSeed completed.');
  console.log('Tài khoản login (dùng username HOẶC email):');
  for (const u of users) {
    console.log(`  - ${u.username.padEnd(16)} | ${u.email.padEnd(35)} | ${u.password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
