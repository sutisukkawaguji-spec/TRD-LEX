import { mockListings, mockStats } from '@/lib/mockData';
import HeroCarousel from '@/components/HeroCarousel';
import NewsletterSection from '@/components/NewsletterSection';
import Link from 'next/link';

export const metadata = {
  title: 'แพลตฟอร์มตลาดรองสิทธิการเช่าที่ราชพัสดุ',
  description: 'TRD-LEX — ช่องทางทางการสำหรับการโอนสิทธิการเช่าที่ราชพัสดุ ปลอดภัย โปร่งใส ตรวจสอบได้',
};

export default function HomePage() {
  const featuredListings = mockListings.filter(l => l.status === 'active').slice(0, 6);
  return (
    <>
      <HeroSection />
      <AlertBanner />
      <StatsSection stats={mockStats} />
      <HowItWorksSection />
      <FeaturedListings listings={featuredListings} />
      <NewsletterSection />
      <CtaSection />
    </>
  );
}

/* ─── Hero ──────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section style={{
      background: 'linear-gradient(145deg, var(--primary-dark) 0%, var(--primary) 55%, #1a3a8a 100%)',
      padding: 'clamp(3.5rem, 8vw, 6.5rem) 0 clamp(3rem, 6vw, 4.5rem)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position:'absolute', top:-80, right:-80, width:380, height:380, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(212,146,10,0.18) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-60, left:-60, width:300, height:300, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(42,82,152,0.22) 0%, transparent 70%)', pointerEvents:'none' }} />
      {/* Gold accent line */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:4,
        background:'linear-gradient(90deg, var(--accent), var(--accent-bright), var(--accent))',
      }} />

      <div className="container" style={{ position:'relative' }}>
        <div className="hero-grid">
          {/* Left Column: Text & CTA */}
          <div>
            {/* Official badge */}
            <div style={{ marginBottom:'1.25rem' }}>
              <span style={{
                display:'inline-flex', alignItems:'center', gap:'0.5rem',
                padding:'0.4rem 1.1rem',
                background:'rgba(212,146,10,0.15)', border:'1px solid rgba(212,146,10,0.4)',
                borderRadius:'var(--radius-full)',
                fontSize:'0.8rem', fontWeight:700, color:'var(--accent-bright)',
                letterSpacing:'0.06em',
              }}>
                🏛️ แพลตฟอร์มทางการ • กรมธนารักษ์ กระทรวงการคลัง
              </span>
            </div>

            <h1 style={{ color:'#fff', marginBottom:'1.25rem', lineHeight:1.2 }}>
              ตลาดกลางสิทธิการเช่า{' '}
              <span style={{
                background:'linear-gradient(135deg, #fbbf24, var(--accent-light), #fbbf24)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>ที่ราชพัสดุ</span>
              <br />ที่เชื่อถือได้
            </h1>

            <p style={{ color:'rgba(255,255,255,0.78)', fontSize:'clamp(0.95rem,2.5vw,1.1rem)', lineHeight:1.85, marginBottom:'2rem' }}>
              โอนสิทธิการเช่าที่ราชพัสดุอย่างถูกต้องตามกฎหมาย — ปลอดภัย โปร่งใส ตรวจสอบได้
              ไม่ใช่การ &quot;ขายขาด&quot; แต่คือการ&nbsp;
              <strong style={{ color:'#fbbf24' }}>โอนสิทธิการเช่า</strong>
            </p>

            <div className="hero-btns" style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom: '2.5rem' }}>
              <Link href="/listings" className="btn btn-accent btn-lg" style={{ justifyContent:'center' }}>
                🔍 ค้นหาทำเล
              </Link>
              <Link href="/sell" className="btn btn-ghost btn-lg" style={{ justifyContent:'center' }}>
                📝 ลงประกาศโอนสิทธิ
              </Link>
            </div>

            {/* Trust indicators */}
            <div style={{ display:'flex', gap:'clamp(0.75rem,3vw,1.5rem)', flexWrap:'wrap' }}>
              {[
                { icon:'🔒', text:'ยืนยันตัวตนผ่าน ThaiD' },
                { icon:'✅', text:'ตรวจสอบสัญญาจริง' },
                { icon:'📍', text:'ค้นหาบนแผนที่' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <span>{icon}</span>
                  <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.82rem', fontWeight:500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Carousel Slide Show */}
          <div>
            <HeroCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Alert Banner ──────────────────────────────────────── */
function AlertBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #7c2d12, #9a1c1c)',
      padding: '0.875rem 0',
    }}>
      <div className="container" style={{ display:'flex', alignItems:'flex-start', gap:'0.875rem' }}>
        <span style={{ fontSize:'1.25rem', flexShrink:0, lineHeight:1.4 }}>⚠️</span>
        <p style={{ color:'#fef2f2', fontSize:'clamp(0.78rem,2vw,0.875rem)', margin:0, lineHeight:1.65 }}>
          <strong>คำเตือน:</strong> &quot;ที่ราชพัสดุ&quot; เป็นทรัพย์สินของแผ่นดิน{' '}
          <strong style={{ color:'#fca5a5' }}>ไม่สามารถซื้อขายโอนกรรมสิทธิ์ได้</strong>
          {' '}— สิ่งที่ทำได้คือ &quot;โอนสิทธิการเช่า&quot; เท่านั้น หากพบประกาศ &quot;ขายที่ราชพัสดุขาด&quot; โปรดระวัง
          <a href="/about" style={{ color:'#fcd34d', marginLeft:'0.5rem', textDecoration:'underline' }}>อ่านเพิ่มเติม →</a>
        </p>
      </div>
    </div>
  );
}

/* ─── Stats ─────────────────────────────────────────────── */
function StatsSection({ stats }) {
  const items = [
    { label:'ประกาศทั้งหมด',  value: stats.totalListings.toLocaleString(),  icon:'📋', color:'var(--primary)' },
    { label:'ประกาศที่เปิดรับ', value: stats.activeListings.toLocaleString(), icon:'✅', color:'var(--success)' },
    { label:'โอนสิทธิสำเร็จ', value: stats.completedTransfers.toLocaleString(), icon:'🤝', color:'var(--accent)' },
    { label:'จังหวัดทั่วประเทศ', value: stats.totalProvinces.toLocaleString(), icon:'🗺️', color:'var(--primary-light)' },
  ];
  return (
    <section style={{ background:'var(--surface)', padding:'2.5rem 0', borderBottom:'1px solid var(--border)' }}>
      <div className="container">
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.25rem' }}>
          {items.map(({ label, value, icon, color }) => (
            <div key={label} style={{
              textAlign:'center', padding:'1.5rem 1rem',
              borderRadius:'var(--radius-lg)', background:'var(--surface-2)',
              border:'1px solid var(--border)',
            }}>
              <div style={{ fontSize:'1.75rem', marginBottom:'0.4rem' }}>{icon}</div>
              <div style={{ fontSize:'clamp(1.5rem,4vw,2rem)', fontWeight:800, color, lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:'0.35rem', fontWeight:500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ──────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    { num:'01', icon:'🔐', title:'ยืนยันตัวตน',   desc:'เข้าสู่ระบบด้วย ThaiD เพื่อยืนยันตัวตนและสิทธิ์', color:'var(--primary)' },
    { num:'02', icon:'🔍', title:'ค้นหาหรือลงประกาศ', desc:'ค้นหาทำเลบนแผนที่ หรือลงประกาศโอนสิทธิ', color:'var(--accent)' },
    { num:'03', icon:'✅', title:'ตรวจสอบสัญญา',  desc:'ระบบตรวจสอบความถูกต้องกับฐานข้อมูลกรมธนารักษ์', color:'var(--success)' },
    { num:'04', icon:'🤝', title:'ติดต่อและโอนสิทธิ', desc:'แสดงความสนใจ ตกลงกัน และโอนสิทธิ์ที่สำนักงานธนารักษ์', color:'var(--primary-light)' },
  ];
  return (
    <section className="section" style={{ background:'var(--bg)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">⚙️ วิธีการใช้งาน</div>
          <h2 className="section-title">ขั้นตอนการโอนสิทธิ ง่ายแค่ 4 ขั้นตอน</h2>
          <p className="section-desc">กระบวนการโปร่งใส ภายใต้การกำกับดูแลของกรมธนารักษ์</p>
        </div>
        <div className="how-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem', position:'relative' }}>
          {/* Connector */}
          <div className="how-connector" style={{
            position:'absolute', top:46, left:'12.5%', right:'12.5%', height:2,
            background:'linear-gradient(90deg, var(--primary), var(--accent), var(--success), var(--primary-light))',
            zIndex:0, borderRadius:2,
          }} />
          {steps.map(({ num, icon, title, desc, color }) => (
            <div key={num} className="card" style={{ padding:'2rem 1.25rem', textAlign:'center', position:'relative', zIndex:1 }}>
              <div style={{
                width:60, height:60, borderRadius:'50%',
                background:`${color}15`, border:`2px solid ${color}30`,
                display:'flex', alignItems:'center', justifyContent:'center',
                margin:'0 auto 1rem', fontSize:'1.4rem',
              }}>{icon}</div>
              <div style={{ fontSize:'0.7rem', fontWeight:800, color, letterSpacing:'0.1em', marginBottom:'0.4rem' }}>ขั้นตอนที่ {num}</div>
              <h3 style={{ fontSize:'0.95rem', marginBottom:'0.6rem' }}>{title}</h3>
              <p style={{ fontSize:'0.82rem', lineHeight:1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Featured Listings ─────────────────────────────────── */
function FeaturedListings({ listings }) {
  return (
    <section className="section" style={{ background:'var(--surface)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🏢 ประกาศล่าสุด</div>
          <h2 className="section-title">ทำเลน่าสนใจ</h2>
          <p className="section-desc">สิทธิการเช่าที่ราชพัสดุจากผู้เช่าที่ยืนยันตัวตนแล้ว</p>
        </div>
        <div className="featured-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
          {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
        </div>
        <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
          <Link href="/listings" className="btn btn-primary btn-lg">ดูประกาศทั้งหมด →</Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Listing Card ──────────────────────────────────────── */
function ListingCard({ listing }) {
  const fmt = n => n.toLocaleString('th-TH');
  // Deterministic color from listing id
  const hue = listing.id.charCodeAt(listing.id.length - 1) * 13;
  return (
    <Link href={`/listings/${listing.id}`} style={{ textDecoration:'none', display:'block' }}>
      <div className="card" style={{ height:'100%' }}>
        {/* Image area */}
        <div style={{
          height:175, position:'relative', overflow:'hidden',
          background:`linear-gradient(135deg, hsl(${210+hue%40},55%,28%) 0%, hsl(${220+hue%30},65%,22%) 100%)`,
        }}>
          <div style={{
            position:'absolute', top:12, left:12,
            padding:'0.22rem 0.65rem', borderRadius:'var(--radius-full)',
            background:'rgba(255,255,255,0.92)', backdropFilter:'blur(8px)',
            fontSize:'0.7rem', fontWeight:600, color:'var(--text)',
          }}>{listing.zoneType}</div>
          {listing.verified && (
            <div style={{
              position:'absolute', top:12, right:12,
              padding:'0.22rem 0.65rem', borderRadius:'var(--radius-full)',
              background:'rgba(13,140,92,0.9)', fontSize:'0.65rem', fontWeight:700, color:'#fff',
            }}>✓ ยืนยันแล้ว</div>
          )}
          <div style={{
            position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)',
            padding:'0.2rem 0.85rem', borderRadius:'var(--radius-full)',
            background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)',
            fontSize:'0.65rem', fontWeight:700, color:'#fbbf24', whiteSpace:'nowrap',
          }}>🔒 สิทธิการเช่า — ไม่ใช่การขายขาด</div>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:'2.75rem', opacity:0.25 }}>🏢</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:'1.1rem' }}>
          <h3 style={{ fontSize:'0.9rem', marginBottom:'0.4rem', lineHeight:1.4, color:'var(--text)' }}>{listing.title}</h3>
          <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.875rem' }}>
            📍 {listing.location.district}, {listing.location.province}
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.4rem', marginBottom:'0.875rem' }}>
            {[
              { label:'พื้นที่', value:`${fmt(listing.area)} ตร.ม.` },
              { label:'สัญญาคงเหลือ', value:`${listing.leaseYearsRemaining} ปี` },
              { label:'ค่าเช่า/เดือน', value:`฿${fmt(listing.monthlyRent)}` },
              { label:'ค่าตอบแทนโอน', value:`฿${fmt(listing.transferPrice)}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding:'0.45rem 0.65rem', background:'var(--surface-2)', borderRadius:'var(--radius-sm)' }}>
                <div style={{ fontSize:'0.62rem', color:'var(--text-light)', fontWeight:500 }}>{label}</div>
                <div style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text)' }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:'0.7rem', color:'var(--text-light)' }}>
              👁️ {fmt(listing.views)} • 💬 {listing.interests}
            </span>
            <span style={{
              padding:'0.28rem 0.75rem', borderRadius:'var(--radius-full)',
              background:'linear-gradient(135deg, var(--primary), var(--primary-light))',
              color:'#fff', fontSize:'0.73rem', fontWeight:600,
            }}>ดูรายละเอียด</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── CTA ───────────────────────────────────────────────── */
function CtaSection() {
  return (
    <section style={{
      background:'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
      padding:'clamp(3rem,7vw,5rem) 0', textAlign:'center', position:'relative', overflow:'hidden',
    }}>
      {/* Gold top bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3,
        background:'linear-gradient(90deg, var(--accent), var(--accent-bright), var(--accent))' }} />
      <div className="container">
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🏛️</div>
        <h2 style={{ color:'#fff', marginBottom:'1rem' }}>พร้อมโอนสิทธิการเช่าแล้วหรือยัง?</h2>
        <p style={{ color:'rgba(255,255,255,0.72)', maxWidth:460, margin:'0 auto 2rem', lineHeight:1.8 }}>
          ช่องทางทางการ น่าเชื่อถือ และตรวจสอบได้ ดำเนินการภายใต้ระเบียบกรมธนารักษ์
        </p>
        <div className="hero-btns" style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/sell"     className="btn btn-accent btn-lg" style={{ justifyContent:'center' }}>📝 ลงประกาศโอนสิทธิ</Link>
          <Link href="/listings" className="btn btn-ghost  btn-lg" style={{ justifyContent:'center' }}>🔍 ค้นหาทำเล</Link>
        </div>
      </div>
    </section>
  );
}
