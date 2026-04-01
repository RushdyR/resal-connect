import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const partners = sqliteTable("partners", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  logoUrl: text("logo_url"),
  category: text("category").notNull(),
  categoryAr: text("category_ar").notNull(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  sortOrder: integer("sort_order").default(0),
});

export const activations = sqliteTable("activations", {
  id: text("id").primaryKey(),
  partnerId: text("partner_id")
    .notNull()
    .references(() => partners.id),
  merchantId: text("merchant_id").notNull(),
  merchantName: text("merchant_name").notNull(),
  merchantEmail: text("merchant_email").notNull(),
  earnPoints: integer("earn_points", { mode: "boolean" }).notNull().default(false),
  redeemPoints: integer("redeem_points", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
  status: text("status").notNull().default("pending"),
});
