import { getPrisma } from "../src/db";

const properties = [
  { title: "Sunny 2 BHK Apartment", city: "Jaipur", locality: "Vaishali Nagar", address: "Near Amrapali Circle, Vaishali Nagar, Jaipur", price: "4200000", bedrooms: 2, bathrooms: 2, areaSqft: 1120, propertyType: "Apartment", status: "Available", description: "Well-ventilated apartment with balcony, lift and covered parking.", imageUrl: null },
  { title: "Modern 3 BHK Family Flat", city: "Jaipur", locality: "Mansarovar", address: "Near Madhyam Marg, Mansarovar, Jaipur", price: "5800000", bedrooms: 3, bathrooms: 2, areaSqft: 1450, propertyType: "Apartment", status: "Available", description: "Family-friendly flat close to schools, markets and public transport.", imageUrl: null },
  { title: "Compact 1 BHK Starter Home", city: "Jaipur", locality: "Jagatpura", address: "Near Jagatpura Railway Station, Jaipur", price: "2400000", bedrooms: 1, bathrooms: 1, areaSqft: 620, propertyType: "Apartment", status: "Available", description: "Affordable starter home in a growing residential neighbourhood.", imageUrl: null },
  { title: "Independent 4 BHK Villa", city: "Jaipur", locality: "Ajmer Road", address: "Gated community, Ajmer Road, Jaipur", price: "12500000", bedrooms: 4, bathrooms: 4, areaSqft: 2600, propertyType: "Villa", status: "Available", description: "Spacious villa with private garden, terrace and two-car parking.", imageUrl: null },
  { title: "Ready-to-Move 2 BHK Flat", city: "Jaipur", locality: "Malviya Nagar", address: "Near Gaurav Tower, Malviya Nagar, Jaipur", price: "4950000", bedrooms: 2, bathrooms: 2, areaSqft: 1050, propertyType: "Apartment", status: "Available", description: "Ready-to-move flat near shopping, offices and restaurants.", imageUrl: null },
  { title: "Premium 3 BHK Apartment", city: "Pune", locality: "Hinjawadi", address: "Phase 1, Hinjawadi, Pune", price: "9200000", bedrooms: 3, bathrooms: 3, areaSqft: 1580, propertyType: "Apartment", status: "Available", description: "Modern apartment suited to IT professionals, with clubhouse access.", imageUrl: null },
  { title: "2 BHK Near IT Park", city: "Pune", locality: "Wakad", address: "Datta Mandir Road, Wakad, Pune", price: "6700000", bedrooms: 2, bathrooms: 2, areaSqft: 980, propertyType: "Apartment", status: "Available", description: "Practical layout with balcony and convenient access to the highway.", imageUrl: null },
  { title: "Garden Row House", city: "Pune", locality: "Baner", address: "Residential lane, Baner, Pune", price: "14800000", bedrooms: 3, bathrooms: 3, areaSqft: 1900, propertyType: "Villa", status: "Available", description: "Row house with private garden and dedicated parking.", imageUrl: null },
  { title: "Affordable 1 BHK Apartment", city: "Pune", locality: "Hadapsar", address: "Near Magarpatta Road, Hadapsar, Pune", price: "3800000", bedrooms: 1, bathrooms: 1, areaSqft: 590, propertyType: "Apartment", status: "Available", description: "Compact apartment close to offices, shops and bus routes.", imageUrl: null },
  { title: "Luxury 4 BHK Penthouse", city: "Pune", locality: "Koregaon Park", address: "Koregaon Park, Pune", price: "32500000", bedrooms: 4, bathrooms: 4, areaSqft: 3100, propertyType: "Penthouse", status: "Available", description: "Premium penthouse with large terrace and city views.", imageUrl: null },
  { title: "3 BHK Apartment Near Metro", city: "Bengaluru", locality: "Whitefield", address: "Near ITPL, Whitefield, Bengaluru", price: "11800000", bedrooms: 3, bathrooms: 2, areaSqft: 1500, propertyType: "Apartment", status: "Available", description: "Community apartment with gym, pool and children's play area.", imageUrl: null },
  { title: "2 BHK City Apartment", city: "Bengaluru", locality: "Electronic City", address: "Phase 1, Electronic City, Bengaluru", price: "6200000", bedrooms: 2, bathrooms: 2, areaSqft: 1080, propertyType: "Apartment", status: "Available", description: "Convenient home for commuters with security and power backup.", imageUrl: null },
  { title: "Independent 3 BHK House", city: "Bengaluru", locality: "Kengeri", address: "Kengeri Satellite Town, Bengaluru", price: "8900000", bedrooms: 3, bathrooms: 3, areaSqft: 1750, propertyType: "Independent House", status: "Available", description: "Independent house with utility area and rooftop access.", imageUrl: null },
  { title: "2 BHK Apartment in Noida", city: "Noida", locality: "Sector 137", address: "Sector 137, Noida", price: "7200000", bedrooms: 2, bathrooms: 2, areaSqft: 1125, propertyType: "Apartment", status: "Available", description: "High-rise apartment with security and clubhouse facilities.", imageUrl: null },
  { title: "Spacious 3 BHK Flat", city: "Noida", locality: "Sector 50", address: "Sector 50, Noida", price: "13500000", bedrooms: 3, bathrooms: 3, areaSqft: 1680, propertyType: "Apartment", status: "Available", description: "Large family flat near parks, schools and local shopping.", imageUrl: null },
  { title: "2 BHK Apartment in Gurgaon", city: "Gurugram", locality: "Sector  Gurgaon", address: "New Gurgaon residential area", price: "8400000", bedrooms: 2, bathrooms: 2, areaSqft: 1050, propertyType: "Apartment", status: "Available", description: "Well-planned apartment with parking and gated security.", imageUrl: null },
  { title: "Luxury 4 BHK Builder Floor", city: "Gurugram", locality: "Golf Course Extension Road", address: "Golf Course Extension Road, Gurugram", price: "28500000", bedrooms: 4, bathrooms: 4, areaSqft: 2900, propertyType: "Builder Floor", status: "Available", description: "Premium builder floor with spacious rooms and lift access.", imageUrl: null },
  { title: "3 BHK Apartment Near Beach", city: "Mumbai", locality: "Andheri West", address: "Andheri West, Mumbai", price: "24500000", bedrooms: 3, bathrooms: 2, areaSqft: 1250, propertyType: "Apartment", status: "Available", description: "Urban apartment close to metro connectivity and shopping.", imageUrl: null },
  { title: "2 BHK Resale Apartment", city: "Mumbai", locality: "Kandivali East", address: "Kandivali East, Mumbai", price: "16200000", bedrooms: 2, bathrooms: 2, areaSqft: 890, propertyType: "Apartment", status: "Sold", description: "Sample sold listing to verify that unavailable properties are excluded.", imageUrl: null },
  { title: "Farmhouse with Open Land", city: "Jaipur", locality: "Kukas", address: "Outskirts near Kukas, Jaipur", price: "18500000", bedrooms: 3, bathrooms: 3, areaSqft: 2400, propertyType: "Farmhouse", status: "Available", description: "Farmhouse with open outdoor space, suitable for weekend use.", imageUrl: null },
];
async function main() {
  const prisma = await getPrisma();
  // Upsert by title so rerunning the seed updates these sample listings without duplicating them.
  for (const property of properties) {
    const existing = await prisma.property.findFirst({ where: { title: property.title } });
    if (existing) {
      await prisma.property.update({ where: { id: existing.id }, data: property });
    } else {
      await prisma.property.create({ data: property });
    }
  }
  console.log(`Seeded ${properties.length} sample properties.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const prisma = await getPrisma();
    await prisma.$disconnect();
  });
