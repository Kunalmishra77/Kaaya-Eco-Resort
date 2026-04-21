// d:/kaaya eco resort/server/prisma/seed.js
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const AMENITIES_COMMON = [
  'Air conditioning',
  'Sitting area',
  'Dressing area',
  'Private bathroom',
  'Hot water',
  'Wi-Fi',
]

const AMENITIES_CHALET = [
  ...AMENITIES_COMMON,
  'Garden view',
  'Outdoor seating',
]

const ROOMS = [
  {
    name:            'Family Room \u2013 Garden View',
    slug:            'family-room-garden-view',
    type:            'FAMILY_ROOM',
    description:     'A spacious family room overlooking our lush tropical gardens. Perfect for larger families seeking comfort amidst nature.',
    longDescription: `Wake up to the gentle rustle of palm fronds and the chorus of tropical birds in our Garden View Family Room. Designed for families of up to 6, this generously sized room features three beds, a comfortable sitting area, and a private bathroom with hot water. Step outside to enjoy the garden pathway leading to the resort's shared pool and BBQ area. A serene retreat that keeps you close to nature without sacrificing comfort.`,
    pricePerNight:   28500,
    maxAdults:       6,
    maxChildren:     2,
    bedCount:        3,
    amenities:       [...AMENITIES_CHALET, 'Pool access', 'Kids play area access'],
    images:          ['/images/family-room-interior-a.jpg', '/images/family-room-building.jpg', '/images/tropical-garden.jpg'],
    featured:        true,
  },
  {
    name:            'Family Room \u2013 Lake View',
    slug:            'family-room-lake-view',
    type:            'FAMILY_ROOM',
    description:     'Wake up to breathtaking sunrise views over Yoda Wewa lake. Our most scenic family accommodation.',
    longDescription: `There are mornings you never forget. In our Lake View Family Room, you'll open the curtains to the shimmering expanse of Yoda Wewa, the ancient reservoir that has sustained life in this region for millennia. Three beds, a sitting area, and a panoramic lake-facing outlook make this the most sought-after room for families. Spot elephants at the water's edge at dusk, watch painted storks glide past at dawn, and fall asleep to the sound of the wild.`,
    pricePerNight:   34500,
    maxAdults:       6,
    maxChildren:     2,
    bedCount:        3,
    amenities:       [...AMENITIES_CHALET, 'Lake view', 'Sunrise views', 'Pool access', 'Kids play area access'],
    images:          ['/images/family-room-interior-b.jpg', '/images/lake-dusk.jpg', '/images/lakeside-dining.jpg'],
    featured:        true,
  },
  {
    name:            'Family Chalet with Jacuzzi',
    slug:            'family-chalet-jacuzzi',
    type:            'FAMILY_CHALET',
    description:     'Our most exclusive offering \u2014 a private chalet with an outdoor Jacuzzi, ideal for romantic retreats or intimate family escapes.',
    longDescription: `Absolute luxury in the heart of the wilderness. The Family Chalet with Jacuzzi is Kaaya's signature accommodation \u2014 a private, standalone chalet surrounded by nature, featuring two beautifully appointed bedrooms, a sitting room, and an outdoor Jacuzzi perfect for star-gazing after an evening safari. Designed for intimate groups of up to 4, this is where romantic escapes and milestone celebrations are made. Every detail, from the handcrafted furniture to the curated amenities, reflects our philosophy of rustic luxury.`,
    pricePerNight:   52000,
    maxAdults:       4,
    maxChildren:     2,
    bedCount:        2,
    amenities:       [...AMENITIES_COMMON, 'Private Jacuzzi', 'Standalone chalet', 'Garden terrace', 'Pool access', 'Premium toiletries'],
    images:          ['/images/jacuzzi-chalet.jpg', '/images/chalet-interior-standard.jpg', '/images/pool-trees.jpg'],
    featured:        true,
  },
  {
    name:            'Standard Chalet \u2013 Jungle A',
    slug:            'standard-chalet-jungle-a',
    type:            'STANDARD_CHALET',
    description:     'A cosy jungle-facing chalet for couples, immersed in the sights and sounds of the wild.',
    longDescription: `Jungle Chalet A is nestled at the forest edge, offering an intimate connection with the surrounding wilderness. Two comfortable beds, a private bathroom with hot water, and a small sitting area make it ideal for couples or solo travellers. Hear the calls of peacocks and spot mongooses from your doorstep. Simple, warm, and completely in tune with nature.`,
    pricePerNight:   18500,
    maxAdults:       2,
    maxChildren:     1,
    bedCount:        2,
    amenities:       AMENITIES_CHALET,
    images:          ['/images/chalet-jungle-exterior.jpg', '/images/chalet-interior-b.jpg'],
    featured:        false,
  },
  {
    name:            'Standard Chalet \u2013 Jungle B',
    slug:            'standard-chalet-jungle-b',
    type:            'STANDARD_CHALET',
    description:     'Tucked into the jungle fringe, this chalet offers seclusion and serenity for two.',
    longDescription: `Jungle Chalet B shares the same wild, forested outlook as its neighbour, with its own private entrance and bathroom. The natural timber interiors and earthy palette create a warm cocoon after a day of safari. Watch the sunset paint the treetops orange as you unwind on your private seating area.`,
    pricePerNight:   18500,
    maxAdults:       2,
    maxChildren:     1,
    bedCount:        2,
    amenities:       AMENITIES_CHALET,
    images:          ['/images/chalet-garden-exterior.jpg', '/images/chalet-interior-b.jpg'],
    featured:        false,
  },
  {
    name:            'Standard Chalet \u2013 Garden C',
    slug:            'standard-chalet-garden-c',
    type:            'STANDARD_CHALET',
    description:     'A peaceful garden-view chalet with tropical landscaping and easy pool access.',
    longDescription: `Garden Chalet C offers a gentle, verdant outlook over the resort's manicured tropical gardens. A bright, airy room with two beds, air conditioning, and direct garden access. The pool is a short stroll away, and the outdoor dining area is right next door. Great value for couples seeking relaxation in a natural setting.`,
    pricePerNight:   17000,
    maxAdults:       2,
    maxChildren:     1,
    bedCount:        2,
    amenities:       AMENITIES_CHALET,
    images:          ['/images/chalet-pond.jpg', '/images/tropical-garden.jpg'],
    featured:        false,
  },
  {
    name:            'Standard Chalet \u2013 Garden D',
    slug:            'standard-chalet-garden-d',
    type:            'STANDARD_CHALET',
    description:     'Light-filled and peaceful, this garden chalet is perfect for unwinding between safari adventures.',
    longDescription: `Garden Chalet D is a tranquil hideaway surrounded by flowering tropical plants and swaying palms. The room is comfortably furnished for two, with air conditioning, hot water, and Wi-Fi. Spend mornings at the pool and evenings at the BBQ pit under a canopy of stars. Everything you need, and nothing you don't.`,
    pricePerNight:   17000,
    maxAdults:       2,
    maxChildren:     1,
    bedCount:        2,
    amenities:       AMENITIES_CHALET,
    images:          ['/images/chalet-sunset.jpg', '/images/pool-garden.jpg'],
    featured:        false,
  },
]

const SEED_REVIEWS = [
  {
    rating:   5,
    title:    'Best safari base camp in Yala',
    comment:  'We stayed in the Lake View Family Room and it was absolutely stunning. Woke up to elephants by the lake every morning. The staff arranged our safaris perfectly — we saw leopards on both morning drives. Will absolutely return.',
    approved: true,
  },
  {
    rating:   5,
    title:    'The Jacuzzi chalet is a dream',
    comment:  'Celebrated our anniversary in the Family Chalet. The outdoor Jacuzzi under the stars was unforgettable. The resort is genuinely eco-friendly — solar panels, composting, minimal plastic. Highly recommended for couples.',
    approved: true,
  },
  {
    rating:   5,
    title:    'Perfect family holiday',
    comment:  'Brought our three kids for a week. The kids loved the safari, the pool, and the badminton court. Staff were incredibly friendly and went out of their way to make the children feel special. The BBQ night was a highlight!',
    approved: true,
  },
  {
    rating:   4,
    title:    'Wonderful nature escape',
    comment:  'Stayed in Jungle Chalet A for 3 nights. Peaceful, beautiful, and exactly what we needed. The birding from the lake shore was spectacular. Only minor issue was Wi-Fi in the chalet could be stronger.',
    approved: true,
  },
  {
    rating:   5,
    title:    'Exceeded all expectations',
    comment:  'From the moment we arrived, the warmth of the team at Kaaya was evident. The food is exceptional — fresh Sri Lankan flavours with beautiful presentation. The Yoda Wewa sunrise boat ride is a must-do.',
    approved: true,
  },
]

const GALLERY_IMAGES = [
  { url: '/images/family-room-interior-a.jpg', publicId: 'local-family-room-int-a',   category: 'accommodation', caption: 'Family Room – spacious interiors with warm timber finishes', sortOrder: 1  },
  { url: '/images/family-room-interior-b.jpg', publicId: 'local-family-room-int-b',   category: 'accommodation', caption: 'Family Room – Lake View with orange-accented beds',             sortOrder: 2  },
  { url: '/images/family-room-building.jpg',   publicId: 'local-family-room-building', category: 'accommodation', caption: 'Family Room building set amid tropical gardens',               sortOrder: 3  },
  { url: '/images/jacuzzi-chalet.jpg',          publicId: 'local-jacuzzi-chalet',       category: 'accommodation', caption: 'Family Chalet with private plunge pool and garden',            sortOrder: 4  },
  { url: '/images/chalet-interior-standard.jpg',publicId: 'local-chalet-int-std',      category: 'accommodation', caption: 'Standard Chalet – timber-clad interior with art',              sortOrder: 5  },
  { url: '/images/chalet-interior-b.jpg',       publicId: 'local-chalet-int-b',        category: 'accommodation', caption: 'Standard Chalet – queen room with four-poster bed',            sortOrder: 6  },
  { url: '/images/chalet-jungle-exterior.jpg',  publicId: 'local-chalet-jungle-ext',   category: 'accommodation', caption: 'Jungle Chalet – elevated over the koi pond',                  sortOrder: 7  },
  { url: '/images/chalet-garden-exterior.jpg',  publicId: 'local-chalet-garden-ext',   category: 'accommodation', caption: 'Garden Chalet – nestled in tropical greenery',                sortOrder: 8  },
  { url: '/images/chalet-pond.jpg',             publicId: 'local-chalet-pond',         category: 'accommodation', caption: 'Garden Chalet D – surrounded by water garden and flowers',    sortOrder: 9  },
  { url: '/images/chalet-sunset.jpg',           publicId: 'local-chalet-sunset',       category: 'accommodation', caption: 'Standard Chalet at golden hour',                              sortOrder: 10 },
  { url: '/images/lake-sunset-tree.jpg',        publicId: 'local-lake-sunset-tree',    category: 'lake',          caption: 'Ancient tree at the shores of Yoda Wewa at sunset',           sortOrder: 11 },
  { url: '/images/lake-dusk.jpg',               publicId: 'local-lake-dusk',           category: 'lake',          caption: 'Yoda Wewa at dusk — pastel skies over the ancient reservoir', sortOrder: 12 },
  { url: '/images/lakeside-dining.jpg',         publicId: 'local-lakeside-dining',     category: 'dining',        caption: 'Lakeside picnic table at sunset — dining in the wild',        sortOrder: 13 },
  { url: '/images/lakeside-picnic.jpg',         publicId: 'local-lakeside-picnic',     category: 'dining',        caption: 'Waterside dining at dusk with lake views',                    sortOrder: 14 },
  { url: '/images/garden-swing.jpg',            publicId: 'local-garden-swing',        category: 'activities',    caption: 'Garden swing by the lake — pure relaxation',                 sortOrder: 15 },
  { url: '/images/tropical-garden.jpg',         publicId: 'local-tropical-garden',     category: 'lake',          caption: 'Resort gardens with koi pond and tropical planting',          sortOrder: 16 },
  { url: '/images/garden-buddha.jpg',           publicId: 'local-garden-buddha',       category: 'lake',          caption: 'Peaceful garden with Buddha statue and ancient trees',        sortOrder: 17 },
  { url: '/images/pool-trees.jpg',              publicId: 'local-pool-trees',          category: 'activities',    caption: 'Swimming pool surrounded by tropical forest',                sortOrder: 18 },
  { url: '/images/pool-garden.jpg',             publicId: 'local-pool-garden',         category: 'activities',    caption: 'Pool area with green lawn and relaxation benches',           sortOrder: 19 },
  { url: '/images/restaurant-pavilion.jpg',     publicId: 'local-restaurant-pavilion', category: 'dining',        caption: 'Open-air restaurant pavilion under ancient trees',            sortOrder: 20 },
  { url: '/images/outdoor-seating.jpg',         publicId: 'local-outdoor-seating',     category: 'dining',        caption: 'Garden courtyard dining with stone pathways',                sortOrder: 21 },
  { url: '/images/resort-courtyard.jpg',        publicId: 'local-resort-courtyard',    category: 'lake',          caption: 'Stone-paved resort courtyard with tropical canopy',          sortOrder: 22 },
  { url: '/images/resort-entrance.jpg',         publicId: 'local-resort-entrance',     category: 'lake',          caption: 'Resort entrance with cobblestone driveway and trees',        sortOrder: 23 },
  { url: '/images/resort-main-building.jpg',    publicId: 'local-resort-main',         category: 'lake',          caption: 'Main resort building — natural materials and open design',   sortOrder: 24 },
  { url: '/images/chalet-sunset-a.jpg',         publicId: 'local-chalet-sunset-a',     category: 'accommodation', caption: 'Standard chalet at golden hour in the jungle clearing',     sortOrder: 25 },
]

async function main() {
  console.log('Seeding Kaaya Eco Resort database...')

  const adminPassword = await bcrypt.hash('admin123456', 12)
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@kaayaecoresort.com' },
    update: {},
    create: {
      email:     'admin@kaayaecoresort.com',
      password:  adminPassword,
      firstName: 'Kaaya',
      lastName:  'Admin',
      phone:     '+94771234567',
      role:      'ADMIN',
    },
  })
  console.log('Admin user:', admin.email)

  const guestPassword = await bcrypt.hash('guest123456', 12)
  const guest = await prisma.user.upsert({
    where:  { email: 'guest@example.com' },
    update: {},
    create: {
      email:     'guest@example.com',
      password:  guestPassword,
      firstName: 'Demo',
      lastName:  'Guest',
      role:      'GUEST',
    },
  })
  console.log('Guest user:', guest.email)

  for (const roomData of ROOMS) {
    const room = await prisma.room.upsert({
      where:  { slug: roomData.slug },
      update: roomData,
      create: roomData,
    })
    console.log('Room:', room.name)
  }

  await prisma.review.deleteMany({ where: { userId: guest.id } })
  for (const reviewData of SEED_REVIEWS) {
    await prisma.review.create({
      data: { ...reviewData, userId: guest.id },
    })
  }
  console.log(SEED_REVIEWS.length, 'reviews seeded')

  // Gallery images — upsert by publicId
  for (const imgData of GALLERY_IMAGES) {
    await prisma.galleryImage.upsert({
      where:  { publicId: imgData.publicId },
      update: imgData,
      create: imgData,
    })
  }
  console.log(GALLERY_IMAGES.length, 'gallery images seeded')

  console.log('\nSeed complete!')
  console.log('  Admin: admin@kaayaecoresort.com / admin123456')
  console.log('  Guest: guest@example.com / guest123456')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
