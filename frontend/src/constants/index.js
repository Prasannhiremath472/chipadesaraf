export const APP_NAME     = 'Chipade Saraf'
export const APP_NAME_MR  = 'चिपडे सराफ'
export const APP_TAGLINE   = 'The Golden Legacy of Kolhapur — Since 1904'
export const APP_EMAIL     = 'chipadesamraf@gmail.com'
export const APP_PHONE     = '0231-2544441 / +91 82371 29913'
export const APP_ADDRESS   = 'Bhausinghji Road, Kolhapur — 416001'
export const APP_ADDRESS2  = 'Venus Corner, Dasara Chowk Road, Kolhapur'
export const APP_EST       = '1904'
export const APP_FULL_NAME = 'मे. गोपीनाथ अनंत चिपडे सराफ'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const CATEGORIES = [
  { id: 1, name: 'Gold Jewellery',    slug: 'gold',      icon: '✦', image: '/images/imgi_8_Gold.jfif.jpg' },
  { id: 2, name: 'Diamond',           slug: 'diamond',   icon: '◆', image: '/images/imgi_12_Diamond.jfif.jpg' },
  { id: 3, name: 'Bridal Collection', slug: 'bridal',    icon: '♛', image: '/images/imgi_13_Bride_jpg.jpg' },
  { id: 4, name: 'Daily Wear',        slug: 'daily-wear',icon: '○', image: '/images/imgi_11_Daily_Wear.jfif.jpg' },
  { id: 5, name: 'Silver',            slug: 'silver',    icon: '◇', image: '/images/imgi_10_Silver_jewellery.jfif.jpg' },
  { id: 6, name: 'Necklaces',         slug: 'necklaces', icon: '◉', image: '/images/imgi_29_Necklace1_jpg.jpg' },
  { id: 7, name: 'Earrings',          slug: 'earrings',  icon: '◎', image: '/images/imgi_25_Earrings_jpg.jpg' },
  { id: 8, name: 'Bangles',           slug: 'bangles',   icon: '◯', image: '/images/imgi_20_2bangles_news.png' },
]

export const OCCASIONS = [
  { name: 'Wedding',     slug: 'wedding'    },
  { name: 'Engagement',  slug: 'engagement' },
  { name: 'Anniversary', slug: 'anniversary'},
  { name: 'Festival',    slug: 'festival'   },
  { name: 'Birthday',    slug: 'birthday'   },
  { name: 'Daily Wear',  slug: 'daily-wear' },
]

export const MATERIALS = [
  { name: 'Gold',    slug: 'gold'    },
  { name: 'Diamond', slug: 'diamond' },
  { name: 'Silver',  slug: 'silver'  },
  { name: 'Pearl',   slug: 'pearl'   },
]

export const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First'       },
  { value: 'popular',   label: 'Most Popular'       },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc',label: 'Price: High to Low' },
  { value: 'rating',    label: 'Highest Rated'      },
]

export const PURITY_OPTIONS = ['24K', '22K', '18K', '14K', 'Sterling 925']

export const WHY_US = [
  { icon: 'star',     title: 'Since 1904',         desc: 'Over 120 years of trust, tradition and master craftsmanship from Kolhapur.' },
  { icon: 'cert',     title: 'BIS Hallmarked',     desc: 'Every piece carries BIS hallmark certification for guaranteed purity.' },
  { icon: 'exchange', title: 'Lifetime Exchange',  desc: 'Exchange your Chipade jewellery for latest designs anytime.' },
  { icon: 'returns',  title: '30-Day Returns',     desc: 'Not in love? Return within 30 days — no questions asked.' },
  { icon: 'shipping', title: 'Insured Shipping',   desc: 'Fully insured complimentary delivery across India.' },
  { icon: 'secure',   title: 'Secure Payments',    desc: 'Bank-grade 256-bit SSL encryption on every transaction.' },
]

export const HERO_SLIDES = [
  {
    image:    '/images/imgi_2_Artboard_1.jpg_1.jpg',
    label:    'Celebrate The Season',
    heading:  'Celebrate The\nSeason of Sparkle',
    sub:      'Exquisite gold & diamond jewellery — handcrafted in Kolhapur since 1904',
    cta:      'Explore Collections',
    ctaLink:  '/shop',
  },
  {
    image:    '/images/imgi_3_Artboard_1_copy_4_jpg.jpg',
    label:    'The Golden Legacy',
    heading:  'The Golden Legacy\nof Kolhapur',
    sub:      'Traditional craftsmanship meeting contemporary elegance',
    cta:      'Shop Bridal',
    ctaLink:  '/shop?occasion=wedding',
  },
  {
    image:    '/images/imgi_5_111_jpg.jpg',
    label:    'New Arrivals',
    heading:  'Timeless Beauty,\nModern Grace',
    sub:      'Discover our latest handcrafted gold jewellery collections',
    cta:      'View New Arrivals',
    ctaLink:  '/shop?sort=newest',
  },
]

export const PRODUCT_IMAGES = {
  necklace1: '/images/imgi_29_Necklace1_jpg.jpg',
  necklace2: '/images/imgi_28_Necklace2_jpg.jpg',
  earrings1: '/images/imgi_25_Earrings_jpg.jpg',
  earrings2: '/images/imgi_24_Earrings2_jpg.jpg',
  bracelet:  '/images/imgi_27_bracelet.jpg',
  bangles:   '/images/imgi_20_2bangles_news.png',
  selection: '/images/imgi_26_selection.jpg',
  allcollections: '/images/imgi_18_allcollectionsphoto.png',
  bride1:    '/images/imgi_13_Bride_jpg.jpg',
  bride2:    '/images/imgi_18_allcollectionsphoto.png',
  footer:    '/images/imgi_30_footerbigimage_1.png',
}

export const NAV_LINKS = [
  {
    label: 'Collections',
    href:  '/shop',
    children: [
      { label: 'Gold Jewellery',    href: '/shop?category=gold'    },
      { label: 'Diamond Jewellery', href: '/shop?category=diamond' },
      { label: 'Bridal Collection', href: '/shop?occasion=wedding' },
      { label: 'Silver Jewellery',  href: '/shop?category=silver'  },
      { label: 'Necklaces',         href: '/shop?category=necklaces' },
      { label: 'Earrings',          href: '/shop?category=earrings'  },
      { label: 'Bangles',           href: '/shop?category=bangles'   },
    ],
  },
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Best Sellers', href: '/shop?sort=popular' },
  { label: 'Bridal',       href: '/shop?occasion=wedding' },
  { label: 'Our Legacy',   href: '/about' },
]

export const FOOTER_LINKS = {
  collections: [
    { label: 'Gold Jewellery',  href: '/shop?category=gold'      },
    { label: 'Diamond',         href: '/shop?category=diamond'   },
    { label: 'Bridal',          href: '/shop?occasion=wedding'   },
    { label: 'Silver',          href: '/shop?category=silver'    },
    { label: 'New Arrivals',    href: '/shop?sort=newest'        },
    { label: 'Best Sellers',    href: '/shop?sort=popular'       },
  ],
  support: [
    { label: 'My Account',          href: '/account'         },
    { label: 'Track Order',         href: '/account/orders'  },
    { label: 'Returns & Exchange',  href: '/returns'         },
    { label: 'FAQ',                 href: '/faq'             },
    { label: 'Contact Us',          href: '/contact'         },
  ],
  company: [
    { label: 'Our Legacy',      href: '/about'   },
    { label: 'Blog',            href: '/blog'    },
    { label: 'Visit Store',     href: '/contact' },
  ],
}

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/chipadesamraf',
  facebook:  'https://facebook.com/chipadesamraf',
  youtube:   'https://youtube.com',
}

export const MARQUEE_ITEMS = [
  '✦ Since 1904', '✦ BIS Hallmarked Gold', '✦ सोने | चांदी | हिरे | मोती',
  '✦ Kolhapur\'s Finest', '✦ Bridal Specialists', '✦ Lifetime Exchange',
  '✦ Since 1904', '✦ BIS Hallmarked Gold', '✦ सोने | चांदी | हिरे | मोती',
  '✦ Kolhapur\'s Finest', '✦ Bridal Specialists', '✦ Lifetime Exchange',
]
