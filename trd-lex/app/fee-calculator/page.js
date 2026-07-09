'use client';
import { useState } from 'react';
import { feeConfig } from '@/lib/mockData';

export default function FeeCalculatorPage() {
  const [transferPrice, setTransferPrice] = useState('');
  const [yearsRemaining, setYearsRemaining] = useState('');
  const [isCompany, setIsCompany] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const price = Number(transferPrice);
    if (!price || price <= 0) return;

    const transferFee = Math.round(price * feeConfig.transferFeeRate);
    const stampDuty = Math.round(price * feeConfig.stampDutyRate);
    const withholdingTax = isCompany ? 0 : Math.round(price * feeConfig.withholdingTaxRate);
    const vat = isCompany ? Math.round(price * feeConfig.vatRate) : 0;
    const total = transferFee + stampDuty + withholdingTax + vat;

    setResult({
      transferPrice: price,
      transferFee,
      stampDuty,
      withholdingTax,
      vat,
      total,
      grandTotal: price + total,
    });
  };

  const fmt = n => n.toLocaleString('th-TH');

  return (
    <>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', padding: '2.5rem 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', marginBottom: '0.5rem' }}>🧮 คำนวณค่าธรรมเนียมโอนสิทธิ</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            ประมาณการค่าใช้จ่ายในการโอนสิทธิการเช่าที่ราชพัสดุ
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: 860 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Input Form */}
          <div>
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>ข้อมูลการโอนสิทธิ</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="transfer-price-input">
                  มูลค่าค่าตอบแทนการโอนสิทธิ (บาท) <span className="required">*</span>
                </label>
                <input
                  id="transfer-price-input"
                  className="form-input"
                  type="number"
                  placeholder="เช่น 1500000"
                  value={transferPrice}
                  onChange={e => setTransferPrice(e.target.value)}
                  style={{ fontSize: '1.1rem' }}
                />
                {transferPrice && (
                  <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem' }}>
                    = ฿{Number(transferPrice).toLocaleString('th-TH')} บาท
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="years-remaining-input">
                  อายุสัญญาคงเหลือ (ปี)
                </label>
                <input
                  id="years-remaining-input"
                  className="form-input"
                  type="number"
                  placeholder="เช่น 18"
                  value={yearsRemaining}
                  onChange={e => setYearsRemaining(e.target.value)}
                />
              </div>

              {/* Toggle */}
              <div className="form-group">
                <label className="form-label">ประเภทผู้ทำธุรกรรม</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[
                    { val: false, label: '👤 บุคคลธรรมดา' },
                    { val: true, label: '🏢 นิติบุคคล' },
                  ].map(({ val, label }) => (
                    <button
                      key={String(val)}
                      id={`taxpayer-${val ? 'company' : 'person'}-btn`}
                      onClick={() => setIsCompany(val)}
                      style={{
                        flex: 1, padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: isCompany === val ? '2px solid var(--primary-light)' : '2px solid var(--border)',
                        background: isCompany === val ? 'rgba(37,99,235,0.08)' : 'transparent',
                        color: isCompany === val ? 'var(--primary-light)' : 'var(--text-muted)',
                        fontWeight: isCompany === val ? 700 : 400,
                        cursor: 'pointer', transition: 'all var(--transition-fast)',
                        fontSize: '0.875rem',
                      }}
                    >{label}</button>
                  ))}
                </div>
              </div>

              <button
                id="calculate-btn"
                className="btn btn-primary btn-lg w-full"
                onClick={calculate}
                disabled={!transferPrice}
                style={{ borderRadius: 'var(--radius-md)', justifyContent: 'center', opacity: transferPrice ? 1 : 0.5 }}
              >
                🧮 คำนวณค่าธรรมเนียม
              </button>
            </div>

            {/* Rate Table */}
            <div className="card" style={{ padding: '1.5rem', marginTop: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>📊 อัตราค่าธรรมเนียม (ตามระเบียบ)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-2)' }}>
                    <th style={{ textAlign: 'left', padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>รายการ</th>
                    <th style={{ textAlign: 'right', padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>อัตรา</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'ค่าธรรมเนียมโอนสิทธิ', rate: '2.5%' },
                    { name: 'อากรแสตมป์', rate: '0.5%' },
                    { name: 'ภาษีหัก ณ ที่จ่าย (บุคคลธรรมดา)', rate: '1%' },
                    { name: 'ภาษีมูลค่าเพิ่ม (นิติบุคคล)', rate: '7%' },
                  ].map(({ name, rate }, i) => (
                    <tr key={name} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>{name}</td>
                      <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-subtle)' }}>{rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.75rem', margin: '0.75rem 0 0' }}>
                * อัตราข้างต้นเป็นการประมาณการเท่านั้น อาจแตกต่างตามดุลยพินิจของกรมธนารักษ์
              </p>
            </div>
          </div>

          {/* Result */}
          <div>
            {result ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="card" style={{ padding: '2rem', border: '2px solid var(--primary-light)' }}>
                  <h2 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    📊 ผลการประมาณค่าธรรมเนียม
                  </h2>

                  {/* Main Price */}
                  <div style={{
                    padding: '1.25rem', background: 'linear-gradient(135deg,var(--primary-dark),var(--primary))',
                    borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1.5rem',
                  }}>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>มูลค่าค่าตอบแทน</div>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.75rem' }}>฿{fmt(result.transferPrice)}</div>
                  </div>

                  {/* Fee Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {[
                      { label: 'ค่าธรรมเนียมโอนสิทธิ (2.5%)', value: result.transferFee, show: true },
                      { label: 'อากรแสตมป์ (0.5%)', value: result.stampDuty, show: true },
                      { label: 'ภาษีหัก ณ ที่จ่าย (1%)', value: result.withholdingTax, show: !isCompany },
                      { label: 'ภาษีมูลค่าเพิ่ม (7%)', value: result.vat, show: isCompany },
                    ].filter(i => i.show).map(({ label, value }) => (
                      <div key={label} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)',
                      }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>฿{fmt(value)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total Fees */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1rem 0', marginTop: '0.25rem',
                    borderTop: '2px solid var(--primary-light)',
                  }}>
                    <span style={{ fontWeight: 700 }}>รวมค่าธรรมเนียมทั้งหมด</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.15rem' }}>฿{fmt(result.total)}</span>
                  </div>

                  {/* Grand Total */}
                  <div style={{
                    padding: '1rem', background: 'rgba(212,160,23,0.08)',
                    border: '1px solid rgba(212,160,23,0.3)', borderRadius: 'var(--radius-md)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ยอดรวมทั้งหมด (ค่าตอบแทน + ค่าธรรมเนียม)</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>ตัวเลขโดยประมาณ</div>
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.25rem' }}>฿{fmt(result.grandTotal)}</div>
                  </div>
                </div>

                <div style={{
                  padding: '1rem', background: 'rgba(239,68,68,0.05)',
                  border: '1px solid rgba(239,68,68,0.15)', borderRadius: 'var(--radius-md)',
                }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--danger)' }}>⚠️ หมายเหตุ:</strong> ตัวเลขข้างต้นเป็นการประมาณการเบื้องต้นเท่านั้น
                    ค่าธรรมเนียมและภาษีที่แท้จริงจะขึ้นอยู่กับการพิจารณาของเจ้าหน้าที่กรมธนารักษ์
                    กรุณาติดต่อสำนักงานธนารักษ์พื้นที่เพื่อข้อมูลที่ถูกต้อง
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a href="/listings" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    🔍 ค้นหาทำเล
                  </a>
                  <a href="/sell" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                    📝 ลงประกาศ
                  </a>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '100%', minHeight: 400, textAlign: 'center',
                background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                border: '2px dashed var(--border)', padding: '2rem',
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.4 }}>🧮</div>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>กรอกข้อมูลแล้วคำนวณ</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  ระบุมูลค่าค่าตอบแทนและกดปุ่มคำนวณ เพื่อดูประมาณการค่าธรรมเนียม
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
