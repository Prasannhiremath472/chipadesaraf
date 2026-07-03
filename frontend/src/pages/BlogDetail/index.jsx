import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi'

const POSTS = {
  'kolhapuri-saaj-guide': {
    title:'The Complete Guide to Kolhapuri Saaj',
    date:'15 Jan 2025', author:'Chipade Saraf', cat:'Heritage',
    image:'/images/imgi_29_Necklace1_jpg.jpg',
    content:`The Kolhapuri Saaj is not merely a piece of jewellery — it is a living tradition, a cultural identity worn by Maharashtrian brides for centuries.

**What is the Kolhapuri Saaj?**

The Saaj (साज) is a traditional necklace from Kolhapur, Maharashtra. It typically features a long gold chain with a pendant inspired by the Mahalakshmi deity, and is traditionally gifted by the groom's family to the bride at the wedding.

**The Heritage**

Kolhapur has been the centre of gold jewellery craftsmanship for over five centuries. The distinctive Kolhapuri style — heavy, ornate, with deep engravings and bold designs — sets it apart from jewellery of any other region.

At Chipade Saraf, we have been crafting Kolhapuri Saaj in 22K gold since 1904. Each piece is hand-engraved by our master artisans and carries the authentic Kolhapuri identity.

**Choosing Your Saaj**

When selecting a Kolhapuri Saaj, consider:
- **Weight**: Traditional Saaj ranges from 50g to 100g+
- **Purity**: Always choose BIS Hallmarked 22K gold
- **Design**: Choose between traditional (with deity motifs) and contemporary (with floral or geometric patterns)
- **Length**: Typically worn at collarbone length

**Visit Us**

Come to our stores on Bhausinghji Road or Venus Corner, Kolhapur. Our experts will help you select the perfect Saaj for your occasion.`,
  },
  'gold-purity-guide': {
    title:'22K vs 18K Gold: Which is Right for You?',
    date:'08 Feb 2025', author:'Chipade Saraf', cat:'Gold Guide',
    image:'/images/imgi_8_Gold.jfif.jpg',
    content:`Understanding gold purity is essential before buying jewellery. Here's a simple guide to help you decide.

**22K Gold — The Traditional Choice**

22K gold contains 91.6% pure gold. It is the standard for traditional Indian jewellery — bridal sets, necklaces, bangles, and earrings. It has a rich, warm yellow colour.

**Pros of 22K:**
- Higher gold content = better investment value
- Rich traditional yellow colour
- Ideal for intricate, traditional designs
- BIS Hallmarked for certified purity

**18K Gold — The Modern Choice**

18K gold contains 75% pure gold, with the remaining 25% being other metals for durability. It is often used for diamond and gemstone jewellery.

**Pros of 18K:**
- More durable — suitable for daily wear
- Better setting for diamonds
- Available in white gold and rose gold
- More affordable

**Our Recommendation**

For traditional jewellery (necklaces, bangles, Kolhapuri sets) — choose 22K. For diamond rings, pendants and everyday pieces — 18K is ideal.

At Chipade Saraf, all our gold jewellery carries the BIS Hallmark — your guarantee of purity.`,
  },
  'bridal-jewellery-2025': {
    title:'Bridal Jewellery Trends in 2025',
    date:'20 Mar 2025', author:'Chipade Saraf', cat:'Bridal',
    image:'/images/imgi_13_Bride_jpg.jpg',
    content:`2025 bridal jewellery is all about personality — bold heritage pieces paired with modern minimalism.

**1. Layered Necklaces**
Multiple chains at different lengths — from choker to long Haar — create a dramatic bridal look. Our Kolhapuri Saaj paired with a pearl Thushi is the perfect combination.

**2. Polki & Kundan Chokers**
Traditional uncut diamond (Polki) and Kundan settings are back in a big way. Brides love the vintage, regal look these pieces create.

**3. Statement Maang Tikka**
A large, ornate Maang Tikka is one of the most photographed bridal pieces. In 2025, cascading designs with emeralds and rubies are trending.

**4. Minimal Ear Cuffs with Heavy Necklace**
Pairing a statement necklace with minimal ear cuffs balances the look. This is popular with brides who want a modern yet traditional feel.

**5. The Kolhapuri Bridal Set**
The authentic Kolhapuri set — Saaj, Thushi, Bangles, Nath and Jhumka — remains timeless. At Chipade Saraf, we offer complete bridal sets starting at ₹2,00,000.

Book a bridal appointment at our Kolhapur store to try our complete bridal collection.`,
  },
}

const RELATED = [
  { slug:'gold-purity-guide',      title:'22K vs 18K Gold Guide',        image:'/images/imgi_8_Gold.jfif.jpg' },
  { slug:'bridal-jewellery-2025',  title:'Bridal Trends 2025',           image:'/images/imgi_13_Bride_jpg.jpg' },
  { slug:'forming-jewellery-explained','title':'What is Forming Jewellery?', image:'/images/imgi_9_Forming.jfif.jpg' },
]

function renderContent(content) {
  return content.split('\n\n').map((para, i) => {
    if (para.startsWith('**') && para.endsWith('**') && !para.includes('\n')) {
      return <h3 key={i} className="font-sans font-bold text-gray-900 text-lg mt-8 mb-3">{para.replace(/\*\*/g,'')}</h3>
    }
    if (para.startsWith('- ') || para.startsWith('• ')) {
      const items = para.split('\n').filter(Boolean)
      return <ul key={i} className="list-disc list-inside space-y-1 my-3">{items.map((item,j) => <li key={j} className="font-sans text-gray-600 text-sm">{item.replace(/^[-•]\s*/,'').replace(/\*\*([^*]+)\*\*/g,'$1')}</li>)}</ul>
    }
    return <p key={i} className="font-sans text-gray-600 text-base leading-relaxed my-4">{para.replace(/\*\*([^*]+)\*\*/g, (_, m) => m)}</p>
  })
}

export default function BlogDetail() {
  const { slug } = useParams()
  const post = POSTS[slug] || POSTS['kolhapuri-saaj-guide']

  return (
    <>
      <Helmet><title>{post.title} — Chipade Saraf Blog</title></Helmet>

      {/* Hero image */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-[#1a0a0f]">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex flex-col justify-end pb-8 px-6 max-w-4xl mx-auto">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-1 mb-3 bg-[#C8963C] text-white self-start">{post.cat}</span>
          <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight">{post.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Meta */}
        <div className="flex items-center gap-6 text-xs font-sans text-gray-400 mb-8 pb-6 border-b border-gray-100">
          <Link to="/blog" className="flex items-center gap-1 text-[#8B1A4A] hover:underline font-semibold">
            <FiArrowLeft size={13}/> All Articles
          </Link>
          <span className="flex items-center gap-1"><FiCalendar size={12}/> {post.date}</span>
          <span className="flex items-center gap-1"><FiUser size={12}/> {post.author}</span>
        </div>

        {/* Content */}
        <article className="prose-sm max-w-none">
          {renderContent(post.content)}
        </article>

        {/* CTA */}
        <div className="mt-12 bg-[#8B1A4A] p-8 text-center">
          <h3 className="font-serif text-2xl text-white mb-3">Visit Our Kolhapur Store</h3>
          <p className="font-sans text-white/60 text-sm mb-5">Explore our complete collection — Gold, Diamond, Silver & Forming jewellery</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/shop" className="btn-gold text-xs">SHOP NOW</Link>
            <Link to="/contact" className="btn-outline-white text-xs">CONTACT US</Link>
          </div>
        </div>

        {/* Related */}
        <div className="mt-14">
          <h2 className="font-serif text-2xl text-gray-900 mb-7">More Articles</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {RELATED.filter(r => r.slug !== slug).map(r => (
              <Link key={r.slug} to={`/blog/${r.slug}`} className="group block bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img src={r.image} alt={r.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-sans text-sm font-semibold text-gray-800 group-hover:text-[#8B1A4A] transition-colors">{r.title}</h3>
                  <span className="text-[#C8963C] text-xs flex items-center gap-1 mt-2">Read more <FiArrowRight size={11}/></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
