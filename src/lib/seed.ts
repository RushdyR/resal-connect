import { partners } from "./schema";
import { db } from "./db";

const seedPartners = [
  {
    id: "qitaf",
    name: "Qitaf",
    nameAr: "قطاف",
    category: "Loyalty",
    categoryAr: "ولاء",
    description: "Connect your store to the largest loyalty program in the Kingdom.",
    descriptionAr: "اربط متجرك بأكبر برنامج ولاء في المملكة.",
    logoUrl: "/partners/qitaf.svg",
    sortOrder: 1,
  },
  {
    id: "alrajhi",
    name: "Al rajhi bank",
    nameAr: "مصرف الراجحي",
    category: "Banking",
    categoryAr: "بنوك",
    description: "Allow Al Rajhi customers to earn or redeem loyalty points in your store.",
    descriptionAr: "اسمح لعملاء الراجحي بكسب أو استبدال نقاط الولاء في متجرك.",
    logoUrl: "/partners/alrajhi.svg",
    sortOrder: 2,
  },
  {
    id: "mobily",
    name: "Mobily",
    nameAr: "موبايلي",
    category: "Telecom",
    categoryAr: "اتصالات",
    description: "Allow Mobily customers to redeem points for exclusive rewards in your store.",
    descriptionAr: "اسمح لعملاء موبايلي باستبدال النقاط مقابل مكافآت حصرية في متجرك.",
    logoUrl: "/partners/mobily.svg",
    sortOrder: 3,
  },
  {
    id: "akthr",
    name: "akthr",
    nameAr: "أكثر",
    category: "Loyalty",
    categoryAr: "ولاء",
    description: "Give customers the ability to earn Akthr points and redeem them for rewards in your store.",
    descriptionAr: "امنح العملاء القدرة على كسب نقاط أكثر واستبدالها بمكافآت في متجرك.",
    logoUrl: "/partners/akthr.svg",
    sortOrder: 4,
  },
  {
    id: "anb",
    name: "anb rewards",
    nameAr: "مكافآت العربي",
    category: "Banking",
    categoryAr: "بنوك",
    description: "Give customers the ability to earn ANB Rewards points and redeem them for rewards in your store.",
    descriptionAr: "امنح العملاء القدرة على كسب نقاط مكافآت العربي واستبدالها في متجرك.",
    logoUrl: "/partners/anb.svg",
    sortOrder: 5,
  },
];

async function seed() {
  console.log("Seeding partners...");

  for (const partner of seedPartners) {
    await db
      .insert(partners)
      .values(partner)
      .onConflictDoUpdate({
        target: partners.id,
        set: {
          name: partner.name,
          nameAr: partner.nameAr,
          category: partner.category,
          categoryAr: partner.categoryAr,
          description: partner.description,
          descriptionAr: partner.descriptionAr,
          logoUrl: partner.logoUrl,
          sortOrder: partner.sortOrder,
        },
      });
  }

  console.log(`Seeded ${seedPartners.length} partners.`);
}

seed().catch(console.error);
