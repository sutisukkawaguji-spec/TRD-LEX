import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: {
    template: '%s | TRD-LEX ตลาดสิทธิการเช่าที่ราชพัสดุ',
    default: 'TRD-LEX | แพลตฟอร์มตลาดรองสิทธิการเช่าที่ราชพัสดุ',
  },
  description:
    'TRD Lease Exchange (TRD-LEX) — แพลตฟอร์มทางการของกรมธนารักษ์ สำหรับการโอนสิทธิการเช่าที่ราชพัสดุ โปร่งใส ตรวจสอบได้ ถูกกฎหมาย',
  keywords: ['สิทธิการเช่าที่ราชพัสดุ', 'โอนสิทธิการเช่า', 'ที่ราชพัสดุ', 'กรมธนารักษ์', 'TRD-LEX'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <Navbar />
        <main style={{ minHeight: '100vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  const footerLinks = [
    {
      title: 'บริการ',
      links: [
        { href: '/listings', label: 'ค้นหาประกาศ' },
        { href: '/sell', label: 'ลงประกาศโอนสิทธิ' },
        { href: '/fee-calculator', label: 'คำนวณค่าธรรมเนียม' },
      ],
    },
    {
      title: 'ข้อมูล',
      links: [
        { href: '/about', label: 'เกี่ยวกับโครงการ' },
        { href: '#', label: 'คู่มือการใช้งาน' },
        { href: '#', label: 'คำถามที่พบบ่อย' },
      ],
    },
    {
      title: 'กรมธนารักษ์',
      links: [
        { href: 'https://www.treasury.go.th', label: 'เว็บไซต์หลัก' },
        { href: '#', label: 'ติดต่อสำนักงาน' },
        { href: '#', label: 'นโยบายความเป็นส่วนตัว' },
      ],
    },
  ];

  return (
    <footer style={{
      background: 'var(--bg-dark)',
      color: 'var(--text-on-dark)',
      paddingTop: '3.5rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2.5rem', paddingBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>TRD</span>
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#fff' }}>TRD-LEX</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>ตลาดสิทธิการเช่าที่ราชพัสดุ</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', lineHeight: 1.8, maxWidth: 280 }}>
              แพลตฟอร์มทางการของกรมธนารักษ์ กระทรวงการคลัง สำหรับการโอนสิทธิการเช่าที่ราชพัสดุ
              อย่างโปร่งใส ถูกกฎหมาย และตรวจสอบได้
            </p>
            <div style={{
              marginTop: '1rem', padding: '0.65rem 1rem',
              background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.25)',
              borderRadius: '12px', display: 'inline-block',
            }}>
              <p style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, margin: 0 }}>
                ⚠️ ที่ราชพัสดุ <strong>โอนสิทธิการเช่า</strong> เท่านั้น — ไม่ใช่การขายขาด
              </p>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map(({ title, links }) => (
            <div key={title}>
              <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>{title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <a href={href} style={{
                      color: 'var(--text-light)', fontSize: '0.85rem',
                      textDecoration: 'none',
                    }}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '1.5rem 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', margin: 0 }}>
            © 2568 กรมธนารักษ์ กระทรวงการคลัง • โครงการเพชรวายุภักษ์ ครั้งที่ 10
          </p>
          <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', margin: 0 }}>
            TRD-LEX v1.0 — Demo Prototype
          </p>
        </div>
      </div>
    </footer>
  );
}
