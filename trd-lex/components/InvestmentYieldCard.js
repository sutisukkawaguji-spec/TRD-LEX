'use client';
import { useState } from 'react';

export default function InvestmentYieldCard({ 
  baseTransferFee, 
  baseMonthlyRent, 
  remainingYears 
}) {
  const [renovationCost, setRenovationCost] = useState(500000);

  // Calculate total costs over lease duration
  const totalRent = baseMonthlyRent * 12 * remainingYears;
  
  // Building Modification Permit Fee (1% of renovation cost, minimum 2,000 Baht under standard regulations)
  const permitFee = renovationCost > 0 ? Math.max(2000, Math.round(renovationCost * 0.01)) : 0;
  
  const totalInvestment = baseTransferFee + totalRent + renovationCost + permitFee;
  
  // Calculate monthly break-even point
  const totalMonths = remainingYears * 12;
  const monthlyBreakEven = totalInvestment / totalMonths;

  const fmt = n => n.toLocaleString('th-TH');

  return (
    <div className="card" style={{ padding: '1.25rem', background: '#fff', border: '2px solid var(--accent-light)' }}>
      <h3 style={{ 
        fontSize: '0.925rem', 
        fontWeight: 700, 
        color: 'var(--primary)', 
        marginBottom: '0.875rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.4rem' 
      }}>
        📊 ประเมินการเงินและจุดคุ้มทุน (ROI)
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem' }}>
          <span>ค่าตอบแทนโอนสิทธิ์</span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>฿{fmt(baseTransferFee)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem' }}>
          <span>ค่าเช่าหลวงรวม {remainingYears} ปี</span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>฿{fmt(totalRent)}</span>
        </div>
        {renovationCost > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem' }}>
            <span>ค่าขออนุญาตดัดแปลง (1%)</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>฿{fmt(permitFee)}</span>
          </div>
        )}

        {/* User can modify their estimated renovation cost */}
        <div style={{ marginTop: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, color: 'var(--text)' }}>
            งบปรับปรุง/ดัดแปลงอาคาร (บาท)
          </label>
          <input 
            type="number" 
            className="form-input"
            placeholder="ใส่ 0 หากไม่ปรับปรุงอาคาร"
            value={renovationCost || ''}
            onChange={(e) => setRenovationCost(Math.max(0, Number(e.target.value)))}
            style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem', height: 'auto', marginBottom: '0.15rem' }}
          />
          <p style={{ fontSize: '0.62rem', color: 'var(--text-light)', margin: 0 }}>
            * ประมาณการเพื่อคำนวณจุดคุ้มทุนรายเดือน
          </p>
        </div>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        background: 'rgba(217, 119, 6, 0.06)', 
        border: '1px solid rgba(217, 119, 6, 0.15)',
        padding: '0.75rem', 
        borderRadius: 'var(--radius-md)', 
        textAlign: 'center' 
      }}>
        <p style={{ margin: '0 0 0.15rem 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          รายได้ขั้นต่ำต่อเดือนที่ต้องทำได้
        </p>
        <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent)' }}>
          ฿{fmt(Math.ceil(monthlyBreakEven))} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ เดือน</span>
        </p>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.62rem', color: 'var(--text-light)', lineHeight: 1.3 }}>
          เฉลี่ยตลอดระยะเวลา {remainingYears} ปี ({totalMonths} เดือน)
        </p>
      </div>

      <button 
        type="button" 
        onClick={() => alert(`บันทึกการประเมินการลงทุนสำเร็จ!\nเป้าหมายรายได้เฉลี่ยต่อเดือน: ฿${fmt(Math.ceil(monthlyBreakEven))} บาท`)}
        className="btn btn-primary w-full" 
        style={{ 
          marginTop: '0.875rem', 
          borderRadius: 'var(--radius-md)', 
          justifyContent: 'center', 
          fontSize: '0.8rem', 
          padding: '0.5rem 1rem' 
        }}
      >
        💾 บันทึกแผนประเมิน
      </button>
    </div>
  );
}
