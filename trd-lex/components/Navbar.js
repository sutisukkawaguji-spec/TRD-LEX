'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/listings',       label: 'ค้นหาประกาศ',       icon: '🔍' },
    { href: '/fee-calculator', label: 'คำนวณค่าธรรมเนียม', icon: '🧮' },
    { href: '/about',          label: 'เกี่ยวกับ',          icon: 'ℹ️' },
    { href: '/admin',          label: 'Dashboard',          icon: '📊' },
  ];

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid var(--border)',
        boxShadow: '0 2px 20px rgba(30,58,110,0.08)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 'var(--navbar-h)',
        }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <Image
              src={getAssetUrl('/logo-treasury.webp')}
              alt="กรมธนารักษ์ — Value The Treasury Department"
              width={160}
              height={52}
              style={{ objectFit: 'contain', height: 44, width: 'auto' }}
              priority
            />
          </Link>

          {/* ── TRD-LEX badge (desktop) ── */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{
              padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              color: '#fff', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em',
            }}>TRD-LEX</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
              ตลาดสิทธิการเช่าที่ราชพัสดุ
            </div>
          </div>

          {/* ── Desktop Nav Links ── */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
            {navLinks.map(({ href, label, icon }) => {
              const isActive = pathname === href || pathname?.startsWith(href + '/');
              return (
                <Link key={href} href={href} style={{
                  padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)',
                  fontSize: '0.845rem', fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(30,58,110,0.08)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                }}>
                  <span style={{ fontSize: '0.9rem' }}>{icon}</span>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop Auth Buttons ── */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
            <Link href="/sell" style={{
              padding: '0.45rem 1.1rem', borderRadius: 'var(--radius-full)',
              border: '2px solid var(--primary)', color: 'var(--primary)',
              fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}>
              + ลงประกาศ
            </Link>
            <Link href="/login" style={{
              padding: '0.45rem 1.1rem', borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              color: '#fff', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 3px 10px rgba(30,58,110,0.3)',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}>
              🔐 เข้าสู่ระบบ
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="เปิดเมนู"
            style={{
              display: 'none',
              flexDirection: 'column', gap: 5, padding: '0.5rem',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 24, height: 2.5,
                background: menuOpen && i === 1 ? 'transparent' : 'var(--primary)',
                borderRadius: 2,
                transform:
                  menuOpen && i === 0 ? 'rotate(45deg) translate(5px, 5px)' :
                  menuOpen && i === 2 ? 'rotate(-45deg) translate(5px, -5px)' :
                  'none',
                transition: 'all 0.25s ease',
              }} />
            ))}
          </button>
        </div>

        {/* ── Mobile Menu Drawer ── */}
        {menuOpen && (
          <div style={{
            background: '#fff', borderTop: '1px solid var(--border)',
            padding: '1rem',
            animation: 'slideDown 0.2s ease',
          }}>
            {/* Gold accent bar */}
            <div style={{
              height: 3, marginBottom: '1rem',
              background: 'linear-gradient(90deg, var(--primary), var(--accent), var(--primary-light))',
              borderRadius: 2,
            }} />

            {navLinks.map(({ href, label, icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.875rem 1rem', marginBottom: '0.25rem',
                  borderRadius: 'var(--radius-md)', textDecoration: 'none',
                  background: isActive ? 'rgba(30,58,110,0.08)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text)',
                  fontWeight: isActive ? 700 : 500, fontSize: '0.95rem',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ fontSize: '1.2rem', width: 24, textAlign: 'center' }}>{icon}</span>
                  {label}
                </Link>
              );
            })}

            {/* Mobile auth buttons */}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
              <Link href="/sell" onClick={() => setMenuOpen(false)} style={{
                flex: 1, textAlign: 'center', padding: '0.75rem',
                border: '2px solid var(--primary)', color: 'var(--primary)',
                borderRadius: 'var(--radius-md)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
              }}>+ ลงประกาศ</Link>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                flex: 1, textAlign: 'center', padding: '0.75rem',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
              }}>🔐 เข้าสู่ระบบ</Link>
            </div>

            {/* ThaiD quick access on mobile */}
            <div style={{
              marginTop: '0.75rem', padding: '0.875rem', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #1a237e, #283593)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <span style={{ fontSize: '1.5rem' }}>🇹🇭</span>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>เข้าสู่ระบบด้วย ThaiD</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>ยืนยันตัวตนดิจิทัล — กรมการปกครอง</div>
              </div>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                marginLeft: 'auto', padding: '0.4rem 0.875rem',
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none', flexShrink: 0,
              }}>เข้าสู่ระบบ →</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
