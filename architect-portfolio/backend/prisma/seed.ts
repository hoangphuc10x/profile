import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'changeme123';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: 'Kiến trúc sư',
      bio: 'Kiến trúc sư với nhiều năm kinh nghiệm thiết kế và xây dựng nhà ở dân dụng.',
      phone: '0900000000',
    },
  });

  const demo = await prisma.project.upsert({
    where: { slug: 'nha-pho-3-tang-quan-7' },
    update: {},
    create: {
      slug: 'nha-pho-3-tang-quan-7',
      title: 'Nhà phố 3 tầng - Quận 7',
      description:
        'Nhà phố 3 tầng với mặt tiền hiện đại, tối ưu công năng cho gia đình 5 người. Diện tích sàn 240m². Hoàn thiện 2024.',
      area: 240,
      location: 'Quận 7, TP.HCM',
      year: 2024,
      coverImage: '/uploads/demo-1.jpg',
    },
  });

  console.log('Seed completed:', { email, project: demo.slug });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
