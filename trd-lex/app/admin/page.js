'use client';
import { useState, useEffect } from 'react';
import { mockAdminStats } from '@/lib/mockData';
import Link from 'next/link';

export default function AdminPage() {
  const { pendingApproval, activeListings, expressedInterest, completedTransfers, revenueEstimate, monthlyData, topProvinces } = mockAdminStats;
  const fmt = n => n.toLocaleString('th-TH');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [workflowData, setWorkflowData] = useState([]);

  // Fetch / Loading Simulation
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setWorkflowData([
        { id: 'TRD-2025-0089', title: 'พื้นที่พาณิชยกรรม บางรัก', province: 'กรุงเทพฯ', price: '3,500,000', seller: 'นายสมชาย ว.', date: '7 ก.ค. 68', status: 'Pending Engineering Approval' },
        { id: 'TRD-2025-0090', title: 'ที่ดินเกษตร อ.สันทราย', province: 'เชียงใหม่', price: '450,000', seller: 'นางสาวมาลี ก.', date: '7 ก.ค. 68', status: 'Contract Active' },
        { id: 'TRD-2025-0091', title: 'ห้องแถว 3 คูหา เยาวราช', province: 'กรุงเทพฯ', price: '1,800,000', seller: 'นายประสิทธิ์ พ.', date: '8 ก.ค. 68', status: 'Under Renovation Review' },
        { id: 'TRD-2025-0092', title: 'พื้นที่ริมน้ำ บางโพ', province: 'กรุงเทพฯ', price: '5,800,000', seller: 'บจก. เจ้าพระยา', date: '8 ก.ค. 68', status: 'Verification Pending' },
        { id: 'TRD-2025-0093', title: 'โกดังสินค้า อ.ศรีราชา', province: 'ชลบุรี', price: '2,100,000', seller: 'บจก. อีสเทิร์น', date: '9 ก.ค. 68', status: 'Pending Engineering Approval' },
      ]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Engineering Approval':
        return { label: '⚙️ รออนุมัติวิศวกรรม', color: 'var(--accent)', bg: 'rgba(217, 119, 6, 0.08)', border: 'rgba(217, 119, 6, 0.25)' };
      case 'Contract Active':
        return { label: '🟢 สัญญาเช่ามีผล', color: 'var(--success)', bg: 'rgba(5, 150, 105, 0.08)', border: 'rgba(5, 150, 105, 0.25)' };
      case 'Under Renovation Review':
        return { label: '🏗️ ซ่อมแซม/ดัดแปลง', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.25)' };
      case 'Verification Pending':
        return { label: '👤 รอตรวจ ThaiD', color: 'var(--info)', bg: 'rgba(37, 99, 235, 0.08)', border: 'rgba(37, 99, 235, 0.25)' };
      default:
        return { label: status, color: 'var(--text-muted)', bg: 'var(--surface-2)', border: 'var(--border)' };
    }
  };

  const kpis = [
    { label: 'คำขอรออนุมัติ', value: pendingApproval, icon: '⏳', color: 'var(--accent)', bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.15)' },
    { label: 'ประกาศที่แอคทีฟ', value: activeListings, icon: '📋', color: 'var(--primary)', bg: 'rgba(30,58,138,0.06)', border: 'rgba(30,58,138,0.15)' },
    { label: 'ผู้แสดงความสนใจ', value: expressedInterest, icon: '💬', color: 'var(--primary-light)', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)' },
    { label: 'โอนสำเร็จเสร็จสิ้น', value: completedTransfers, icon: '✅', color: 'var(--success)', bg: 'rgba(5,150,105,0.06)', border: 'rgba(5,150,105,0.15)' },
    { label: 'รายได้ค่าธรรมเนียมประมาณ', value: `฿${(revenueEstimate / 1000000).toFixed(1)}M`, icon: '💰', color: 'var(--accent)', bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.15)' },
  ];

  const maxListings = Math.max(...monthlyData.map(d => d.listings));

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--navbar-h))', background: 'var(--bg)' }}>
      
      {/* ── Minimalist Sidebar Navigation ── */}
      <aside style={{
        width: 250,
        background: '#fff',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
      }} className="nav-desktop">
        <div style={{ padding: '1.5rem 1.25rem' }}>
          
          {/* Admin Header Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '2rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.8rem'
            }}>🏢</div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.875rem', lineHeight: 1.2 }}>TRD-LEX ADMIN</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>ส่วนงานระบบกรมธนารักษ์</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {[
              { id: 'dashboard', label: '📊 แดชบอร์ดสรุปผล', badge: null },
              { id: 'workflow', label: '⏳ อนุมัติเอกสารโอน', badge: pendingApproval },
              { id: 'listings', label: '📋 คลังประกาศทั้งหมด', badge: null },
              { id: 'regulations', label: '⚖️ ข้อกำหนดกฎหมาย', badge: null },
              { id: 'settings', label: '⚙️ ตั้งค่าฐานข้อมูล', badge: null },
            ].map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    background: active ? 'rgba(30,58,138,0.06)' : 'transparent',
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={e => { if(!active) e.currentTarget.style.background = 'var(--surface-2)'; }}
                  onMouseLeave={e => { if(!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      background: 'var(--accent)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-full)'
                    }}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Back Link */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <Link href="/" className="btn btn-outline w-full" style={{ justifyContent: 'center', fontSize: '0.8rem', borderRadius: 'var(--radius-md)' }}>
            ↩️ ออกระบบคลังข้อมูล
          </Link>
        </div>
      </aside>

      {/* ── Main Content Workspace ── */}
      <main style={{ flex: 1, padding: '2rem 1.5rem', overflowY: 'auto' }}>
        
        {/* Workspace Topbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700, background: 'rgba(217,119,6,0.1)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                กระทรวงการคลัง (Official)
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              {activeTab === 'dashboard' ? '📊 ระบบวิเคราะห์และตรวจสอบสิทธิ์ TRD-LEX' : 
               activeTab === 'workflow' ? '⏳ การบริหารเวิร์กโฟลว์เอกสาร' : 
               '⚙️ แผงจัดการฐานข้อมูลระบบ'}
            </h1>
          </div>
          <button 
            type="button" 
            onClick={handleRefresh} 
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem' }}
          >
            🔄 รีเฟรชฐานข้อมูล
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }} className="admin-kpi-grid">
              {kpis.map(({ label, value, icon, color, bg, border }) => (
                <div key={label} style={{
                  padding: '1.25rem', borderRadius: 'var(--radius-lg)',
                  background: '#fff', border: `1px solid var(--border)`,
                  boxShadow: 'var(--shadow-sm)',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.35rem', color, lineHeight: 1 }}>
                    {typeof value === 'number' ? fmt(value) : value}
                  </div>
                  <div style={{ fontSize: '0.67rem', color: 'var(--text-light)', marginTop: '0.4rem', fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Middle Grid (Charts & Summary) */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }} className="admin-chart-layout">
              {/* Monthly transfers */}
              <div className="card" style={{ padding: '1.5rem', background: '#fff' }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>📈 สถิติการโพสต์สิทธิ์โอนและการตรวจสอบสำเร็จ</h3>
                <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-end', height: 180, paddingBottom: '0.5rem' }}>
                  {monthlyData.map(({ month, listings, transfers }) => (
                    <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-light)', fontWeight: 700 }}>{listings}</div>
                      <div style={{ width: '100%', display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
                        <div style={{
                          flex: 1, borderRadius: '4px 4px 0 0',
                          height: `${(listings / maxListings) * 120}px`,
                          background: 'linear-gradient(to top, var(--primary), var(--primary-light))',
                        }} />
                        <div style={{
                          flex: 1, borderRadius: '4px 4px 0 0',
                          height: `${(transfers / maxListings) * 120}px`,
                          background: 'linear-gradient(to top, var(--accent), var(--accent-light))',
                        }} />
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{month}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', justifyContent: 'center' }}>
                  {[
                    { color: 'var(--primary)', label: 'ยื่นคำขอโอนสิทธิ์สัญญาราชพัสดุ' },
                    { color: 'var(--accent)', label: 'เจ้าหน้าที่อนุมัติเสร็จสิ้น' },
                  ].map(({ color, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provinces distribution */}
              <div className="card" style={{ padding: '1.5rem', background: '#fff' }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '1.25rem', color: 'var(--primary)' }}>🗺️ จังหวัดยอดนิยมสูงสุด</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {topProvinces.map(({ name, count }, i) => {
                    const pct = (count / topProvinces[0].count) * 100;
                    return (
                      <div key={name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', fontSize: '0.78rem' }}>
                          <span style={{ fontWeight: 600 }}>{i + 1}. {name}</span>
                          <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{count} ประกาศ</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${pct}%`, borderRadius: 3,
                            background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Real-time Data Table with Skeleton Loader */}
        <div className="card" style={{ padding: '1.5rem', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0 }}>
              ⚡ เวิร์กโฟลว์คำขอและสิทธิ์โอนรอการทบทวน (Real-Time Workflows)
            </h3>
            <span style={{
              fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700,
              background: 'rgba(5, 150, 105, 0.08)', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(5, 150, 105, 0.2)'
            }}>
              🟢 เชื่อมต่อฐานข้อมูลสด
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['รหัสคำขอ', 'รายละเอียดแปลงที่ดิน', 'จังหวัด', 'ค่าตอบแทนโอนสิทธิ์', 'ผู้ยื่นคำขอ', 'ยื่นแบบเมื่อ', 'สถานะเอกสารวิศวกรรม/สิทธิ์', 'ดำเนินการตรวจอนุมัติ'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.85rem 0.75rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.78rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Skeleton Loaders State
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem 0.75rem' }}><div className="skeleton" style={{ height: 16, width: 70 }} /></td>
                      <td style={{ padding: '1rem 0.75rem' }}><div className="skeleton" style={{ height: 16, width: 140 }} /></td>
                      <td style={{ padding: '1rem 0.75rem' }}><div className="skeleton" style={{ height: 16, width: 60 }} /></td>
                      <td style={{ padding: '1rem 0.75rem' }}><div className="skeleton" style={{ height: 16, width: 80 }} /></td>
                      <td style={{ padding: '1rem 0.75rem' }}><div className="skeleton" style={{ height: 16, width: 90 }} /></td>
                      <td style={{ padding: '1rem 0.75rem' }}><div className="skeleton" style={{ height: 16, width: 70 }} /></td>
                      <td style={{ padding: '1rem 0.75rem' }}><div className="skeleton" style={{ height: 22, width: 120, borderRadius: 10 }} /></td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <div className="skeleton" style={{ height: 24, width: 50, borderRadius: 12 }} />
                          <div className="skeleton" style={{ height: 24, width: 50, borderRadius: 12 }} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Loaded Data State
                  workflowData.map((row, i) => {
                    const badge = getStatusBadge(row.status);
                    return (
                      <tr key={row.id} style={{ 
                        borderBottom: '1px solid var(--border-subtle)',
                        background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)',
                        transition: 'background 0.2s'
                      }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,138,0.02)'} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--surface-2)'}>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: 'var(--primary-light)', fontSize: '0.78rem' }}>
                          {row.id}
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600 }}>{row.title}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-light)' }}>{row.province}</td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: 'var(--text)' }}>฿{row.price}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-muted)' }}>{row.seller}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-light)', fontSize: '0.75rem' }}>{row.date}</td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <span style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            whiteSpace: 'nowrap'
                          }}>{badge.label}</span>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              id={`approve-${row.id}-btn`}
                              onClick={() => {
                                alert(`อนุมัติคำขอ ${row.id} สำเร็จ! สัญญาได้ถูกปรับปรุงเข้าสู่สารบบที่ราชพัสดุเรียบร้อย`);
                                setWorkflowData(prev => prev.map(item => item.id === row.id ? { ...item, status: 'Contract Active' } : item));
                              }}
                              style={{
                                padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-md)',
                                background: 'rgba(5, 150, 105, 0.08)', color: 'var(--success)',
                                border: '1px solid rgba(5, 150, 105, 0.25)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700,
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'var(--success)'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(5, 150, 105, 0.08)'; e.currentTarget.style.color = 'var(--success)'; }}
                            >อนุมัติ</button>
                            <button
                              id={`reject-${row.id}-btn`}
                              onClick={() => {
                                const reason = prompt(`ระบุสาเหตุการปฏิเสธคำขอ ${row.id}:`, 'เอกสารแบบแปลนโครงสร้างวิศวกรรมไม่ครบถ้วน');
                                if (reason) {
                                  alert(`ส่งข้อมูลแจ้งเตือนเรื่องปฏิเสธไปยังผู้ยื่นคำขอเรียบร้อยแล้ว`);
                                  setWorkflowData(prev => prev.filter(item => item.id !== row.id));
                                }
                              }}
                              style={{
                                padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-md)',
                                background: 'rgba(220, 38, 38, 0.06)', color: 'var(--danger)',
                                border: '1px solid rgba(220, 38, 38, 0.2)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700,
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220, 38, 38, 0.06)'; e.currentTarget.style.color = 'var(--danger)'; }}
                            >ปฏิเสธ</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

    </div>
  );
}
