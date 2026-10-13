import { Prisma } from "./generated/prisma/client";
import { getPrisma } from "./db";
export type Criteria = {
  city?: string; locality?: string; minPrice?: number; maxPrice?: number;
  bedrooms?: number; minBedrooms?: number; maxBedrooms?: number;
  propertyType?: string; minAreaSqft?: number; maxAreaSqft?: number;
};
function validate(c: Criteria) {
  for (const [k,v] of Object.entries(c)) {
    if (typeof v === "number" && (!Number.isFinite(v) || v < 0)) throw new Error(`Invalid value for ${k}`);
    if (typeof v === "string" && (!v.trim() || v.length > 120)) throw new Error(`Invalid value for ${k}`);
  }
  if (c.minPrice != null && c.maxPrice != null && c.minPrice > c.maxPrice) throw new Error("minPrice cannot exceed maxPrice");
  if (c.minBedrooms != null && c.maxBedrooms != null && c.minBedrooms > c.maxBedrooms) throw new Error("minBedrooms cannot exceed maxBedrooms");
}
export async function searchProperties(c: Criteria) {
  validate(c);
  const prisma = await getPrisma();
  const where: Prisma.PropertyWhereInput = { status: { equals: "Available", mode: "insensitive" } };
  if (c.city) where.city = { equals: c.city.trim(), mode: "insensitive" };
  if (c.locality) where.locality = { contains: c.locality.trim(), mode: "insensitive" };
  if (c.propertyType) where.propertyType = { equals: c.propertyType.trim(), mode: "insensitive" };
  if (c.minPrice != null || c.maxPrice != null) {
    where.price = {};
    if (c.minPrice != null) where.price.gte = c.minPrice;
    if (c.maxPrice != null) where.price.lte = c.maxPrice;
  }
  if (c.bedrooms != null) where.bedrooms = c.bedrooms;
  else if (c.minBedrooms != null || c.maxBedrooms != null) {
    where.bedrooms = {};
    if (c.minBedrooms != null) where.bedrooms.gte = c.minBedrooms;
    if (c.maxBedrooms != null) where.bedrooms.lte = c.maxBedrooms;
  }
  if (c.minAreaSqft != null || c.maxAreaSqft != null) {
    where.areaSqft = {};
    if (c.minAreaSqft != null) where.areaSqft.gte = c.minAreaSqft;
    if (c.maxAreaSqft != null) where.areaSqft.lte = c.maxAreaSqft;
  }
  const rows = await prisma.property.findMany({
    where, take: 10, orderBy: { price: "asc" },
    select: { id:true,title:true,city:true,locality:true,address:true,price:true,bedrooms:true,bathrooms:true,areaSqft:true,propertyType:true,status:true,description:true,imageUrl:true }
  });
  return rows.map(r => ({ ...r, price: r.price.toString() }));
}
