'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (accepted && email) {
      setSubscribed(true);
    }
  };

  return (
    <section style={{
      background: 'var(--surface-2)',
      padding: '4rem 0',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container" style={{ maxWidth: 640, textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📩</div>
        <h2 style={{ marginBottom: '0.5rem' }}>สมัครสมาชิกรับแจ้งเตือนทำเลใหม่</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          รับข้อมูลประกาศโอนสิทธิเช่าที่ราชพัสดุเปิดใหม่ล่าสุด ส่งตรงถึงอีเมลของคุณทันทีเมื่อระบบอนุมัติ
        </p>

        {subscribed ? (
          <div style={{
            padding: '1.5rem', background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-lg)',
            color: '#0d8c5c', fontWeight: 700
          }}>
            🎉 สมัครสมาชิกรับข้อมูลสำเร็จ! ระบบจะจัดส่งข้อมูลพิกัดแปลงใหม่ตามระเบียบกรมธนารักษ์ให้ท่านทางอีเมล
          </div>
        ) : (
          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', width: '100%', maxWidth: 480, gap: '0.5rem' }}>
              <input
                type="email"
                required
                placeholder="ระบุอีเมลของคุณ (เช่น user@example.com)"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.25rem',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: '#fff'
                }}
              />
              <button
                type="submit"
                disabled={!accepted || !email}
                className="btn btn-primary"
                style={{
                  padding: '0 1.5rem',
                  opacity: (accepted && email) ? 1 : 0.5,
                  cursor: (accepted && email) ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap'
                }}
              >
                สมัครรับข่าวสาร
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', maxWidth: 480, textAlign: 'left' }}>
              <input
                id="home-accept-checkbox"
                type="checkbox"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
                style={{ marginTop: '0.2rem', cursor: 'pointer' }}
              />
              <label htmlFor="home-accept-checkbox" style={{ fontSize: '0.78rem', color: 'var(--text-light)', cursor: 'pointer', lineHeight: 1.4 }}>
                ข้าพเจ้ายินยอมรับข่าวสารทางอีเมล และได้อ่านพร้อมยอมรับ{' '}
                <Link href="/about" target="_blank" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'underline' }}>
                  ข้อกำหนดและเงื่อนไขการเปิดเผยข้อมูลที่ราชพัสดุ
                </Link>{' '}
                ตามพระราชบัญญัติที่ราชพัสดุ พ.ศ. 2562 ของกรมธนารักษ์
              </label>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
