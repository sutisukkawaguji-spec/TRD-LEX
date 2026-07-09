import { mockAdminStats } from '@/lib/mockData';

export const metadata = { title: 'Admin Dashboard' };

export default function AdminPage() {
  const { pendingApproval, activeListings, expressedInterest, completedTransfers, revenueEstimate, monthlyData, topProvinces } = mockAdminStats;
  const fmt = n => n.toLocaleString('th-TH');

  const kpis = [
    { label: 'รออนุมัติ', value: pendingApproval, icon: '⏳', color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
    { label: 'ประกาศที่เปิดรับ', value: activeListings, icon: '📋', color: 'var(--primary)', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.2)' },
    { label: 'ผู้แสดงความสนใจ', value: expressedInterest, icon: '💬', color: 'var(--primary-light)', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.2)' },
    { label: 'โอนสิทธิสำเร็จ', value: completedTransfers, icon: '✅', color: 'var(--success)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
    { label: 'รายได้ค่าธรรมเนียม (ประมาณ)', value: `฿${(revenueEstimate / 1000000).toFixed(1)}M`, icon: '💰', color: 'var(--accent)', bg: 'rgba(212,160,23,0.08)', border: 'rgba(212,160,23,0.2)' },
  ];

  const maxListings = Math.max(...monthlyData.map(d => d.listings));
  const maxTransfers = Math.max(...monthlyData.map(d => d.transfers));

  return (
    <>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', padding: '2.5rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
                background: 'rgba(212,160,23,0.2)', border: '1px solid rgba(212,160,23,0.4)',
                fontSize: '0.75rem', fontWeight: 600, color: '#fbbf24',
              }}>🔐 เจ้าหน้าที่กรมธนารักษ์</div>
            </div>
            <h1 style={{ color: '#fff', marginBottom: '0.25rem' }}>📊 Admin Dashboard</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.875rem' }}>
              ข้อมูล ณ วันที่ 9 กรกฎาคม 2568
            </p>
          </div>
          <a href="/listings" className="btn btn-ghost">← กลับหน้าหลัก</a>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {kpis.map(({ label, value, icon, color, bg, border }) => (
            <div key={label} style={{
              padding: '1.25rem', borderRadius: 'var(--radius-lg)',
              background: bg, border: `1px solid ${border}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem', color, lineHeight: 1 }}>{typeof value === 'number' ? fmt(value) : value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* Chart */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>📈 ประกาศและการโอนสิทธิรายเดือน</h3>

            {/* Bar Chart */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', height: 200 }}>
              {monthlyData.map(({ month, listings, transfers }) => (
                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: 600 }}>{listings}</div>
                  <div style={{ width: '100%', display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
                    <div style={{
                      flex: 1, borderRadius: '3px 3px 0 0',
                      height: `${(listings / maxListings) * 140}px`,
                      background: 'linear-gradient(to top, var(--primary), var(--primary-light))',
                      transition: 'height var(--transition)',
                    }} />
                    <div style={{
                      flex: 1, borderRadius: '3px 3px 0 0',
                      height: `${(transfers / maxListings) * 140}px`,
                      background: 'linear-gradient(to top, var(--accent), var(--accent-light))',
                      transition: 'height var(--transition)',
                    }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{month}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', justifyContent: 'center' }}>
              {[
                { color: 'var(--primary)', label: 'ประกาศใหม่' },
                { color: 'var(--accent)', label: 'โอนสิทธิสำเร็จ' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: color }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Provinces */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>🗺️ จังหวัดที่มีประกาศสูงสุด</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {topProvinces.map(({ name, count }, i) => {
                const pct = (count / topProvinces[0].count) * 100;
                return (
                  <div key={name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>
                        {i + 1}. {name}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{count} รายการ</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`, borderRadius: 3,
                        background: `linear-gradient(90deg, var(--primary), var(--primary-light))`,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pending Approval Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem' }}>⏳ รายการรออนุมัติ ({pendingApproval} รายการ)</h3>
            <span style={{
              padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
              background: 'rgba(245,158,11,0.1)', color: 'var(--warning)',
              fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(245,158,11,0.25)',
            }}>🔴 มีรายการใหม่</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  {['รหัส', 'ทำเล', 'จังหวัด', 'ค่าตอบแทน', 'ผู้ประกาศ', 'ยื่นวันที่', 'สถานะ', 'การดำเนินการ'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'TRD-2025-0089', title: 'ห้องแถว ย่านรัชดา', province: 'กรุงเทพฯ', price: '850,000', seller: 'นายอรรถพล ว.', date: '7 ก.ค. 68', status: 'รอตรวจสอบ' },
                  { id: 'TRD-2025-0090', title: 'ที่ดินเกษตร อ.สันทราย', province: 'เชียงใหม่', price: '320,000', seller: 'นางสาวนงเยาว์ ส.', date: '7 ก.ค. 68', status: 'ตรวจสอบเอกสาร' },
                  { id: 'TRD-2025-0091', title: 'อาคารพาณิชย์ ย่านเมือง', province: 'ขอนแก่น', price: '1,200,000', seller: 'บ. ภาคอีสาน จก.', date: '8 ก.ค. 68', status: 'รอตรวจสอบ' },
                  { id: 'TRD-2025-0092', title: 'พื้นที่ตลาดนัด', province: 'สงขลา', price: '560,000', seller: 'นายวัฒนา ท.', date: '8 ก.ค. 68', status: 'รอตรวจสอบ' },
                  { id: 'TRD-2025-0093', title: 'โกดังสินค้า ย่านอุตสาหกรรม', province: 'ชลบุรี', price: '2,100,000', seller: 'บ. อีสเทิร์น จก.', date: '9 ก.ค. 68', status: 'ตรวจสอบเอกสาร' },
                ].map((row, i) => (
                  <tr key={row.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600, color: 'var(--primary-light)', fontSize: '0.78rem' }}>{row.id}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>{row.title}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>{row.province}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600 }}>฿{row.price}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>{row.seller}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{row.date}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600,
                        background: row.status === 'รอตรวจสอบ' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                        color: row.status === 'รอตรวจสอบ' ? 'var(--warning)' : 'var(--info)',
                        border: `1px solid ${row.status === 'รอตรวจสอบ' ? 'rgba(245,158,11,0.25)' : 'rgba(59,130,246,0.25)'}`,
                      }}>{row.status}</span>
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button id={`approve-${row.id}-btn`} style={{
                          padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)',
                          background: 'rgba(16,185,129,0.1)', color: 'var(--success)',
                          border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600,
                        }}>อนุมัติ</button>
                        <button id={`reject-${row.id}-btn`} style={{
                          padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)',
                          background: 'rgba(239,68,68,0.1)', color: 'var(--danger)',
                          border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600,
                        }}>ปฏิเสธ</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
