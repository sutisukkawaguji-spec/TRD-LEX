export const metadata = {
  title: 'เกี่ยวกับโครงการ TRD-LEX',
  description: 'ทำความรู้จักกับ TRD-LEX แพลตฟอร์มทางการสำหรับโอนสิทธิการเช่าที่ราชพัสดุ',
};

export default function AboutPage() {
  const problems = [
    {
      icon: '😕', title: 'ความเข้าใจผิดทางกฎหมาย',
      desc: 'ประชาชนสับสนระหว่าง "ขายขาด" กับ "โอนสิทธิการเช่า" จากประกาศผิดๆ บนโซเชียลมีเดีย',
    },
    {
      icon: '🚨', title: 'ช่องโหว่ของมิจฉาชีพ',
      desc: 'ขาดช่องทางทางการ ทำให้มิจฉาชีพหลอกลวงซื้อขาย "สิทธิลม" นอกระบบ',
    },
    {
      icon: '📉', title: 'พื้นที่ทิ้งร้าง',
      desc: 'ผู้เช่าที่ไม่ต้องการใช้งานแต่หาผู้รับช่วงสิทธิไม่ได้ ทำให้รัฐสูญเสียรายได้',
    },
  ];

  const features = [
    { icon: '✅', title: 'ตรวจสอบสัญญาเช่าจริง', desc: 'ระบบ Smart Validation ตรวจสอบกับฐานข้อมูลกรมธนารักษ์โดยตรง' },
    { icon: '🔐', title: 'ยืนยันตัวตน ThaiD', desc: 'ป้องกันการสวมรอย ตัดปัญหามิจฉาชีพได้ตั้งแต่ต้นทาง' },
    { icon: '🗺️', title: 'ค้นหาบนแผนที่', desc: 'ดูทำเลที่ต้องการบนแผนที่ดิจิทัล พร้อมข้อมูลสภาพแวดล้อม' },
    { icon: '🧮', title: 'คำนวณค่าธรรมเนียม', desc: 'ประมาณการค่าใช้จ่ายก่อนตัดสินใจ สร้างความโปร่งใส' },
    { icon: '💬', title: 'ระบบแสดงความสนใจ', desc: 'ผู้ซื้อแสดงความสนใจ ระบบแจ้งเตือนผู้ขายอัตโนมัติ' },
    { icon: '📊', title: 'Dashboard เจ้าหน้าที่', desc: 'ติดตามสถิติ อนุมัติประกาศ และบริหารระบบอย่างมีประสิทธิภาพ' },
  ];

  const techStack = [
    { name: 'Next.js 14', desc: 'Frontend + SSR/SEO', color: '#000' },
    { name: 'FastAPI', desc: 'Backend RESTful API', color: '#009688' },
    { name: 'PostgreSQL', desc: 'ฐานข้อมูลหลัก', color: '#336791' },
    { name: 'Docker', desc: 'Containerization', color: '#2496ED' },
  ];

  return (
    <>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏛️</div>
          <h1 style={{ color: '#fff', marginBottom: '1rem' }}>TRD Lease Exchange (TRD-LEX)</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 640, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
            แพลตฟอร์มตลาดรองเพื่อการเปลี่ยนมือสิทธิการเช่าที่ราชพัสดุแบบครบวงจร
            ภายใต้โครงการประกวดรางวัลเพชรวายุภักษ์ ครั้งที่ 10
          </p>
          <div style={{
            marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1.25rem', background: 'rgba(212,160,23,0.15)',
            border: '1px solid rgba(212,160,23,0.4)', borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600,
          }}>
            🏆 MOF Hackathon เพชรวายุภักษ์ — แนวคิดนวัตกรรมเพื่อการบริการประชาชน
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🔍 ปัญหาที่แก้ไข</div>
            <h2 className="section-title">ทำไมต้องมี TRD-LEX?</h2>
            <p className="section-desc">ปัญหาเชิงโครงสร้างที่แพลตฟอร์มนี้ถูกสร้างมาเพื่อแก้ไข</p>
          </div>
          <div className="grid-3">
            {problems.map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.75 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Difference */}
      <section style={{ background: 'linear-gradient(135deg, #7c2d12, #991b1b)', padding: '3rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>⚠️ สิ่งสำคัญที่ต้องเข้าใจ</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center', maxWidth: 700, margin: '0 auto' }}>
            <div style={{
              padding: '1.5rem', background: 'rgba(239,68,68,0.2)',
              border: '2px solid rgba(239,68,68,0.4)', borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
              <div style={{ color: '#fca5a5', fontWeight: 700, fontSize: '1rem' }}>การซื้อขายขาด</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.825rem', marginTop: '0.35rem' }}>ทำไม่ได้ตามกฎหมาย ที่ราชพัสดุเป็นของแผ่นดิน</div>
            </div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem' }}>≠</div>
            <div style={{
              padding: '1.5rem', background: 'rgba(16,185,129,0.2)',
              border: '2px solid rgba(16,185,129,0.4)', borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <div style={{ color: '#6ee7b7', fontWeight: 700, fontSize: '1rem' }}>การโอนสิทธิการเช่า</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.825rem', marginTop: '0.35rem' }}>ทำได้ถูกกฎหมาย ต้องผ่านกรมธนารักษ์</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">⚙️ ฟังก์ชันหลัก</div>
            <h2 className="section-title">ครบครันทุกความต้องการ</h2>
          </div>
          <div className="grid-3">
            {features.map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: '1rem', padding: '1.5rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <div style={{
                  width: 48, height: 48, flexShrink: 0, borderRadius: 'var(--radius-md)',
                  background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                }}>{icon}</div>
                <div>
                  <h3 style={{ fontSize: '0.925rem', marginBottom: '0.4rem' }}>{title}</h3>
                  <p style={{ fontSize: '0.825rem', margin: 0, lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🛠️ เทคโนโลยี</div>
            <h2 className="section-title">Tech Stack</h2>
          </div>
          <div className="grid-4">
            {techStack.map(({ name, desc, color }) => (
              <div key={name} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-md)',
                  background: `${color}15`, border: `2px solid ${color}30`,
                  margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, color, fontSize: '0.75rem',
                }}>{name.slice(0, 4)}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>เริ่มต้นใช้งาน TRD-LEX วันนี้</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 auto 2rem' }}>
            ช่องทางทางการ โปร่งใส ตรวจสอบได้ ภายใต้ระเบียบกรมธนารักษ์
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/listings" className="btn btn-accent btn-lg">🔍 ค้นหาทำเล</a>
            <a href="/sell" className="btn btn-ghost btn-lg">📝 ลงประกาศ</a>
          </div>
        </div>
      </section>
    </>
  );
}
