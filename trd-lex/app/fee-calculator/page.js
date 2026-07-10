'use client';
import { useState } from 'react';
import { feeConfig } from '@/lib/mockData';
import Link from 'next/link';

export default function FeeCalculatorPage() {
  // Default values to provide a preview immediately on load
  const [transferPrice, setTransferPrice] = useState(3500000);
  const [yearsRemaining, setYearsRemaining] = useState(18);
  const [isCompany, setIsCompany] = useState(false);
  
  // Building modification & renovation cost parameters
  const [renovationCost, setRenovationCost] = useState(500000);

  // Fee Rates
  const transferFeeRate = feeConfig?.transferFeeRate || 0.025;
  const stampDutyRate = feeConfig?.stampDutyRate || 0.005;
  const withholdingTaxRate = feeConfig?.withholdingTaxRate || 0.01;
  const vatRate = feeConfig?.vatRate || 0.07;

  // Real-time Calculations
  const transferFee = Math.round(transferPrice * transferFeeRate);
  const stampDuty = Math.round(transferPrice * stampDutyRate);
  const withholdingTax = isCompany ? 0 : Math.round(transferPrice * withholdingTaxRate);
  const vat = isCompany ? Math.round(transferPrice * vatRate) : 0;
  
  const totalGovFees = transferFee + stampDuty + withholdingTax + vat;
  
  // Building Modification Permit Fee (1% of renovation cost, minimum 2,000 Baht under standard regulations, or 0 if no renovation)
  const permitFee = renovationCost > 0 ? Math.max(2000, Math.round(renovationCost * 0.01)) : 0;
  
  const totalRenovationCost = renovationCost + permitFee;
  const grandTotalInvestment = transferPrice + totalGovFees + totalRenovationCost;
  
  const totalMonths = yearsRemaining * 12;
  const monthlyBreakEven = grandTotalInvestment / totalMonths;

  const fmt = n => n.toLocaleString('th-TH');

  return (
    <>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
        padding: '2.5rem 0',
        borderBottom: '3px solid var(--accent)',
      }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>หน้าแรก</Link>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
            <span style={{ color: '#fff', fontSize: '0.85rem' }}>คำนวณค่าธรรมเนียม</span>
          </div>
          <h1 style={{ color: '#fff', marginBottom: '0.5rem' }}>🧮 เครื่องมือคำนวณค่าธรรมเนียมและการลงทุน</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, maxWidth: '700px', fontSize: '0.95rem' }}>
            วางแผนและคำนวณค่าใช้จ่ายในการโอนสิทธิ์การเช่าที่ราชพัสดุ พร้อมประมาณการค่าขออนุญาตดัดแปลงอาคารและจุดคุ้มทุนรายเดือนแบบเรียลไทม์
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: 1100 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem', alignItems: 'start' }} className="fee-calc-grid">

          {/* ── Left Column: Interactive Inputs ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Section 1: ข้อมูลการโอนสิทธิ์ */}
            <div className="card" style={{ padding: '2rem', background: '#fff' }}>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🏢 1. ข้อมูลธุรกรรมโอนสิทธิการเช่า
              </h2>

              {/* Transfer Price Input & Slider */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="form-label" htmlFor="transfer-price-input" style={{ margin: 0 }}>
                    มูลค่าค่าตอบแทนโอนสิทธิ์ (บาท) <span className="required">*</span>
                  </label>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                    ฿{fmt(transferPrice)}
                  </span>
                </div>
                <input
                  id="transfer-price-input"
                  className="form-input"
                  type="number"
                  placeholder="เช่น 3500000"
                  value={transferPrice || ''}
                  onChange={e => setTransferPrice(Math.max(0, Number(e.target.value)))}
                  style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}
                />
                <input 
                  type="range" 
                  min="100000" 
                  max="20000000" 
                  step="100000"
                  value={transferPrice} 
                  onChange={e => setTransferPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                  <span>100,000 บาท</span>
                  <span>10,000,000 บาท</span>
                  <span>20,000,000 บาท</span>
                </div>
              </div>

              {/* Lease Years Slider */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    อายุสัญญาเช่าคงเหลือ (ปี)
                  </label>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.95rem' }}>
                    {yearsRemaining} ปี ({totalMonths} เดือน)
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={yearsRemaining} 
                  onChange={e => setYearsRemaining(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', marginBottom: '0.25rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                  <span>1 ปี</span>
                  <span>10 ปี</span>
                  <span>20 ปี</span>
                  <span>30 ปี</span>
                </div>
              </div>

              {/* Taxpayer Toggle */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">ประเภทบุคคลฝั่งผู้โอน (คิดเกณฑ์ภาษี)</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[
                    { val: false, label: '👤 บุคคลธรรมดา (เสียหัก ณ ที่จ่าย 1%)' },
                    { val: true, label: '🏢 นิติบุคคล (เสีย VAT 7% แทน)' },
                  ].map(({ val, label }) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => setIsCompany(val)}
                      style={{
                        flex: 1, padding: '0.8rem',
                        borderRadius: 'var(--radius-md)',
                        border: isCompany === val ? '2px solid var(--primary)' : '2px solid var(--border)',
                        background: isCompany === val ? 'rgba(30,58,138,0.05)' : 'transparent',
                        color: isCompany === val ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: isCompany === val ? 700 : 400,
                        cursor: 'pointer', transition: 'all var(--transition-fast)',
                        fontSize: '0.82rem',
                        textAlign: 'center'
                      }}
                    >{label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: ปรับปรุงโครงสร้างอาคาร & ดัดแปลงพื้นที่ */}
            <div className="card" style={{ padding: '2rem', background: '#fff' }}>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛠️ 2. การดัดแปลงและโครงสร้างวิศวกรรม
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                พ.ร.บ.ที่ราชพัสดุ พ.ศ. 2562 กำหนดว่าหากต้องการดัดแปลง ต่อเติม หรือเสริมโครงสร้างของอาคารราชพัสดุ จะต้องยื่นแบบแปลนวิศวกรรมและได้รับความยินยอมจากกรมธนารักษ์ และชำระค่าธรรมเนียมคำขอ
              </p>

              {/* Renovation Cost Input & Slider */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="form-label" htmlFor="renovation-cost-input" style={{ margin: 0 }}>
                    งบประมาณปรับปรุงโครงสร้าง / ดัดแปลงอาคาร (บาท)
                  </label>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                    ฿{fmt(renovationCost)}
                  </span>
                </div>
                <input
                  id="renovation-cost-input"
                  className="form-input"
                  type="number"
                  placeholder="หากไม่มีการดัดแปลง ใส่ 0"
                  value={renovationCost || ''}
                  onChange={e => setRenovationCost(Math.max(0, Number(e.target.value)))}
                  style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}
                />
                <input 
                  type="range" 
                  min="0" 
                  max="5000000" 
                  step="50000"
                  value={renovationCost} 
                  onChange={e => setRenovationCost(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                  <span>0 บาท (ไม่มีการดัดแปลง)</span>
                  <span>2,500,000 บาท</span>
                  <span>5,000,000 บาท</span>
                </div>
              </div>
            </div>

            {/* อัตราค่าธรรมเนียมตามกฎหมาย */}
            <div className="card" style={{ padding: '1.5rem', background: 'var(--surface-2)' }}>
              <h3 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text)' }}>📋 อัตราค่าธรรมเนียมราชพัสดุ (สรุป)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-light)' }}>ประเภทรายจ่าย</th>
                    <th style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--text-light)' }}>ฐานคำนวณ</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--text-light)' }}>อัตราเรียกเก็บ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'ค่าธรรมเนียมโอนสิทธิ์การเช่า', base: 'มูลค่าโอนสิทธิ์', rate: '2.50%' },
                    { type: 'อากรแสตมป์สัญญา', base: 'มูลค่าโอนสิทธิ์', rate: '0.50%' },
                    { type: 'ภาษีหัก ณ ที่จ่าย (บุคคลธรรมดา)', base: 'มูลค่าโอนสิทธิ์', rate: '1.00%' },
                    { type: 'ภาษีมูลค่าเพิ่ม VAT (นิติบุคคล)', base: 'มูลค่าโอนสิทธิ์', rate: '7.00%' },
                    { type: 'ค่าธรรมเนียมคำขออนุญาตดัดแปลงอาคาร', base: 'งบประมาณดัดแปลง', rate: '1.00% (ขั้นต่ำ 2,000.-)' },
                  ].map(({ type, base, rate }, index) => (
                    <tr key={type} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.5rem 0', fontWeight: 500 }}>{type}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'center', color: 'var(--text-light)' }}>{base}</td>
                      <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>{rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* ── Right Column: Dynamic Output & Appraisal ── */}
          <div style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Calculations Breakdown */}
            <div className="card" style={{ padding: '2rem', border: '2px solid var(--primary-light)', background: '#fff' }}>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>
                📊 สรุปงบประมาณการลงทุนทั้งหมด
              </h2>

              {/* Breakdown detail */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                
                {/* 1. ค่าตอบแทนโอน */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>ค่าตอบแทนสัญญาโอนสิทธิ์ (เงินทุนต้น)</span>
                  <span style={{ fontWeight: 600 }}>฿{fmt(transferPrice)}</span>
                </div>

                {/* 2. ค่าธรรมเนียมรัฐ */}
                <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>รวมค่าธรรมเนียมและภาษีโอนสิทธิ์สัญญารัฐ</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>฿{fmt(totalGovFees)}</span>
                  </div>
                  <div style={{ paddingLeft: '0.75rem', fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>- ค่าธรรมเนียมโอนสิทธิ์ (2.5%)</span>
                      <span>฿{fmt(transferFee)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>- อากรแสตมป์ (0.5%)</span>
                      <span>฿{fmt(stampDuty)}</span>
                    </div>
                    {!isCompany ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>- ภาษีหัก ณ ที่จ่ายบุคคล (1%)</span>
                        <span>฿{fmt(withholdingTax)}</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>- ภาษีมูลค่าเพิ่มนิติบุคคล (7%)</span>
                        <span>฿{fmt(vat)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. ค่าใช้จ่ายดัดแปลง */}
                {renovationCost > 0 && (
                  <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>งบประมาณดัดแปลงวิศวกรรม & คำขอ</span>
                      <span style={{ fontWeight: 600, color: 'var(--accent)' }}>฿{fmt(totalRenovationCost)}</span>
                    </div>
                    <div style={{ paddingLeft: '0.75rem', fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>- งบประมาณค่าปรับปรุงโครงสร้าง</span>
                        <span>฿{fmt(renovationCost)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>- ค่าอนุญาตดัดแปลง พ.ร.บ.ที่ราชพัสดุ (1%)</span>
                        <span>฿{fmt(permitFee)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div style={{
                padding: '1.25rem',
                background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ประมาณการงบประมาณลงทุนรวมทั้งหมด
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.25rem 0' }}>
                  ฿{fmt(grandTotalInvestment)}
                </div>
                <div style={{ color: 'var(--accent-bright)', fontSize: '0.72rem', fontWeight: 600 }}>
                  * รวมค่าตอบแทน ค่าใช้จ่ายรัฐ และวิศวกรรม
                </div>
              </div>

              {/* ROI & Break-Even Widget */}
              <div style={{
                padding: '1rem',
                background: 'rgba(217, 119, 6, 0.08)',
                border: '1px solid rgba(217, 119, 6, 0.25)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  รายได้ขั้นต่ำที่ต้องทำได้เพื่อจุดคุ้มทุน (ROI Break-Even)
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
                  ฿{fmt(Math.ceil(monthlyBreakEven))} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ เดือน</span>
                </div>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.7rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
                  คำนวณจากค่าใช้จ่ายทั้งหมด {fmt(grandTotalInvestment)} บาท ตลอดอายุสัญญา {yearsRemaining} ปี ({totalMonths} เดือน)
                </p>
              </div>

            </div>

            {/* Legal / Warning Alert inside the card */}
            <div className="font-legal" style={{
              padding: '1.25rem',
              background: 'rgba(220, 38, 38, 0.04)',
              border: '1px solid rgba(220, 38, 38, 0.15)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
            }}>
              <span style={{ color: 'var(--danger)', fontWeight: 700 }}>⚠️ ข้อจำกัดทางกฎหมาย (ข้อเสนอแนะ):</span><br />
              การดัดแปลงโครงสร้างอาคารราชพัสดุใดๆ โดยไม่ได้รับอนุญาตถือเป็นการละเมิดเงื่อนไขในสัญญาเช่า กรมธนารักษ์มีสิทธิ์ขอยกเลิกสัญญาเช่าและยึดเงินค้ำประกันสิทธิ์ได้ทันที กรุณายื่นรายละเอียดแบบวิศวกรรมอาคารเพื่อรับการประเมินจากเจ้าหน้าที่ก่อนเริ่มดำเนินงาน
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/listings" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
                🔍 ค้นหาทำเลที่ดินราชพัสดุ
              </Link>
              <button 
                type="button" 
                onClick={() => alert(`บันทึกแผนประมาณการเรียบร้อย!\nงบประมาณสะสม: ฿${fmt(grandTotalInvestment)} บาท`)}
                className="btn btn-accent" 
                style={{ flex: 1, justifyContent: 'center', borderRadius: 'var(--radius-md)', fontWeight: 700 }}
              >
                💾 บันทึกแผนประเมิน
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
