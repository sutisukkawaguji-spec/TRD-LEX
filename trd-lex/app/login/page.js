'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [thaiDPressed, setThaiDPressed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, var(--primary-dark) 0%, var(--primary) 60%, #1e3a8a 100%)',
      padding: '2rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: -100, right: -100, width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,160,23,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -80, width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))',
            border: '2px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(16px)',
            margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>TRD</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.35rem' }}>TRD-LEX</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: 0 }}>
            แพลตฟอร์มโอนสิทธิการเช่าที่ราชพัสดุ
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-xl)', padding: '2.5rem',
          boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.5)',
        }}>

          {/* Tab Switch */}
          <div style={{
            display: 'flex', marginBottom: '2rem',
            background: 'var(--surface-2)', borderRadius: 'var(--radius-full)', padding: '4px',
          }}>
            {[
              { val: 'login', label: 'เข้าสู่ระบบ' },
              { val: 'register', label: 'ลงทะเบียน' },
            ].map(({ val, label }) => (
              <button
                key={val}
                id={`tab-${val}-btn`}
                onClick={() => setMode(val)}
                style={{
                  flex: 1, padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.875rem',
                  transition: 'all var(--transition)',
                  background: mode === val ? 'var(--primary)' : 'transparent',
                  color: mode === val ? '#fff' : 'var(--text-muted)',
                  boxShadow: mode === val ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
                }}
              >{label}</button>
            ))}
          </div>

          {/* ThaiD Button — Primary Auth */}
          <div style={{
            background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
            borderRadius: 'var(--radius-lg)', padding: '1.5rem',
            marginBottom: '1.75rem', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', justifyContent: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', boxShadow: '0 4px 12px rgba(25,118,210,0.5)',
              }}>🇹🇭</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>ThaiD</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>ยืนยันตัวตนดิจิทัลไทย</div>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              {mode === 'login'
                ? 'วิธีที่แนะนำ — เข้าสู่ระบบด้วย ThaiD เพื่อความปลอดภัยสูงสุด'
                : 'สมัครสมาชิกด้วย ThaiD เพื่อยืนยันตัวตนแบบดิจิทัล'}
            </p>

            {!thaiDPressed ? (
              <button
                id="thaid-auth-btn"
                onClick={() => setThaiDPressed(true)}
                style={{
                  width: '100%', padding: '0.875rem',
                  background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                  color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(25,118,210,0.4)',
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 24px rgba(25,118,210,0.5)'; }}
                onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 16px rgba(25,118,210,0.4)'; }}
              >
                🔐 {mode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'} ด้วย ThaiD
              </button>
            ) : (
              <div>
                <div style={{
                  padding: '1rem', background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.4)', borderRadius: 'var(--radius-md)',
                  marginBottom: '0.75rem',
                }}>
                  <div style={{ color: '#6ee7b7', fontWeight: 700, marginBottom: '0.25rem' }}>✅ {mode === 'login' ? 'เข้าสู่ระบบสำเร็จ' : 'ยืนยัน ThaiD สำเร็จ'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>ยินดีต้อนรับ: นายสมชาย ทดสอบ</div>
                </div>
                <a href="/" style={{
                  display: 'block', width: '100%', padding: '0.75rem',
                  background: 'linear-gradient(135deg,var(--success),#34d399)',
                  color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                  fontWeight: 700, textAlign: 'center', cursor: 'pointer', textDecoration: 'none',
                }}>
                  → เข้าสู่ระบบ TRD-LEX
                </a>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>หรือ</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Email/Password Form */}
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">ชื่อ-นามสกุล</label>
              <input id="register-name" className="form-input" type="text" placeholder="กรอกชื่อ-นามสกุล" />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">อีเมล</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">รหัสผ่าน</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">ยืนยันรหัสผ่าน</label>
              <input id="confirm-password" className="form-input" type="password" placeholder="••••••••" />
            </div>
          )}

          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 500 }}>ลืมรหัสผ่าน?</a>
            </div>
          )}

          {mode === 'register' && (
            <div style={{
              margin: '1.25rem 0',
              padding: '0.875rem',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
              lineHeight: 1.5,
              color: 'var(--text-muted)',
              maxHeight: '110px',
              overflowY: 'auto'
            }}>
              <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>📄 ข้อกำหนดและเงื่อนไขของกรมธนารักษ์:</strong>
              1. ระบบ TRD-LEX เป็นตัวกลางภายใต้ระเบียบกระทรวงการคลังว่าด้วยการจัดหาประโยชน์ในที่ราชพัสดุ พ.ศ. 2564<br/>
              2. การโอนสิทธิการเช่าสามารถกระทำได้เมื่อได้รับความเห็นชอบและอนุมัติจากกรมธนารักษ์เป็นลายลักษณ์อักษรเท่านั้น<br/>
              3. ห้ามเผยแพร่ข้อมูลอันเป็นเท็จ บิดเบือน หรือก่อให้เกิดความเข้าใจผิดเกี่ยวกับที่ดินราชพัสดุ<br/>
              4. ข้อมูลการลงประกาศจะเชื่อมโยงกับฐานข้อมูลทะเบียนของกรมธนารักษ์เพื่อยืนยันสิทธิ์
            </div>
          )}

          {mode === 'register' && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <input
                id="accept-terms-checkbox"
                type="checkbox"
                checked={acceptTerms}
                onChange={e => setAcceptTerms(e.target.checked)}
                style={{ marginTop: '0.2rem', cursor: 'pointer' }}
              />
              <label htmlFor="accept-terms-checkbox" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1.4 }}>
                ข้าพเจ้ายอมรับและยินยอมปฏิบัติตาม <span style={{ color: 'var(--primary)', fontWeight: 600 }}>ข้อกำหนดระเบียบที่ราชพัสดุ</span> ของกรมธนารักษ์ทุกประการ
              </label>
            </div>
          )}

          <button
            id={`${mode}-submit-btn`}
            className="btn btn-primary btn-lg w-full"
            style={{ borderRadius: 'var(--radius-md)', justifyContent: 'center', marginBottom: '1rem', opacity: (mode === 'register' && !acceptTerms) ? 0.5 : 1 }}
            disabled={mode === 'register' && !acceptTerms}
          >
            {mode === 'login' ? '→ เข้าสู่ระบบ' : '✓ สมัครสมาชิก'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
            {mode === 'login' ? 'ยังไม่มีบัญชี?' : 'มีบัญชีแล้ว?'}{' '}
            <button
              id={`switch-to-${mode === 'login' ? 'register' : 'login'}-btn`}
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontWeight: 600, cursor: 'pointer', fontSize: '0.825rem' }}
            >
              {mode === 'login' ? 'ลงทะเบียนที่นี่' : 'เข้าสู่ระบบ'}
            </button>
          </p>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          🔒 ข้อมูลของท่านได้รับการเข้ารหัสและคุ้มครองตาม PDPA
        </p>
      </div>
    </div>
  );
}
