'use client';
import { useState, use, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { mockListings, feeConfig } from '@/lib/mockData';
import { getAssetUrl } from '@/lib/utils';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function ListingDetailPage({ id }) {
  const listing = mockListings.find(l => l.id === id);

  const [activeImg, setActiveImg] = useState(0);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [interestMsg, setInterestMsg] = useState('');
  const [activeRoute, setActiveRoute] = useState(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  useEffect(() => {
    if (isMapExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMapExpanded]);

  const isClickableFeature = (feat) => {
    const keywords = ['BTS', 'MRT', 'รถไฟฟ้า', 'ท่าเรือ', 'แม่น้ำ', 'ชายหาด', 'ทะเล'];
    return keywords.some(kw => feat.toUpperCase().includes(kw));
  };

  if (!listing) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '3rem' }}>🔍</div>
        <h2>ไม่พบประกาศนี้</h2>
        <Link href="/listings" className="btn btn-primary">← กลับหน้าค้นหา</Link>
      </div>
    );
  }

  const fmt = n => n.toLocaleString('th-TH');
  const transferFee = Math.round(listing.transferPrice * feeConfig.transferFeeRate);
  const stampDuty   = Math.round(listing.transferPrice * feeConfig.stampDutyRate);
  const withholding = Math.round(listing.transferPrice * feeConfig.withholdingTaxRate);
  const totalFee    = transferFee + stampDuty + withholding;

  // Demo images — use real photo for first listing, gradient placeholders for rest
  const demoImages = listing.id === 'TRD-2024-001'
    ? ['/demo-listing-01.jpg', null, null]
    : [null, null, null];

  const handleSendInterest = () => {
    setInterestSent(true);
    setTimeout(() => {
      setShowInterestModal(false);
      setInterestSent(false);
      setInterestMsg('');
    }, 2500);
  };

  return (
    <>
      {/* ── Page Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
        padding: 'clamp(1.25rem,4vw,2rem) 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3,
          background:'linear-gradient(90deg,var(--accent),var(--accent-bright),var(--accent))' }} />
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ display:'flex', gap:'0.4rem', alignItems:'center', marginBottom:'0.75rem', flexWrap:'wrap' }}>
            {[['/', 'หน้าแรก'], ['/listings', 'ค้นหาประกาศ']].map(([href, label]) => (
              <span key={href} style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                <Link href={href} style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.82rem' }}>{label}</Link>
                <span style={{ color:'rgba(255,255,255,0.3)' }}>/</span>
              </span>
            ))}
            <span style={{ color:'#fbbf24', fontSize:'0.82rem', fontWeight:600 }}>{listing.id}</span>
          </div>

          <h1 style={{ color:'#fff', marginBottom:'0.75rem', fontSize:'clamp(1.2rem,3vw,1.6rem)', lineHeight:1.3 }}>
            {listing.title}
          </h1>

          <div style={{ display:'flex', gap:'0.625rem', alignItems:'center', flexWrap:'wrap' }}>
            <span style={{
              padding:'0.22rem 0.75rem', borderRadius:'var(--radius-full)',
              background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:'0.78rem',
            }}>🏢 {listing.zoneType}</span>
            {listing.verified && (
              <span style={{
                padding:'0.22rem 0.75rem', borderRadius:'var(--radius-full)',
                background:'rgba(13,140,92,0.35)', color:'#6ee7b7', fontSize:'0.78rem', fontWeight:700,
              }}>✓ ยืนยันตัวตนแล้ว</span>
            )}
            <span style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.78rem' }}>
              สัญญา: {listing.contractNo}
            </span>
            <span style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.78rem', marginLeft:'auto' }}>
              👁 {fmt(listing.views)} ครั้ง
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container" style={{ padding:'1.75rem 1.5rem' }}>
        <div className="detail-layout" style={{ display:'grid', gridTemplateColumns:'1fr 350px', gap:'2rem', alignItems:'start' }}>

          {/* ════ Left Column ════ */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

            {/* ── Image Gallery ── */}
            <div className="card" style={{ overflow:'hidden' }}>
              {/* Main Image */}
              <div style={{ height:'clamp(220px,40vw,360px)', position:'relative', overflow:'hidden',
                background:'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 60%, #203c8a 100%)' }}>

                {demoImages[activeImg] ? (
                  <Image
                    src={getAssetUrl(demoImages[activeImg])}
                    alt={listing.title}
                    fill
                    style={{ objectFit:'cover', objectPosition:'center' }}
                    sizes="(max-width:768px) 100vw, 700px"
                  />
                ) : (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:'5rem', opacity:0.2 }}>🏢</span>
                  </div>
                )}

                {/* Official Watermark Overlay */}
                <div style={{
                  position:'absolute', inset:0,
                  background:'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
                  pointerEvents:'none',
                }} />
                <div style={{
                  position:'absolute', bottom:'1rem', left:'1rem', right:'1rem',
                  display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'0.5rem', flexWrap:'wrap',
                }}>
                  <div style={{
                    padding:'0.45rem 0.875rem', borderRadius:'var(--radius-md)',
                    background:'rgba(0,0,0,0.7)', backdropFilter:'blur(10px)',
                    border:'1px solid rgba(251,191,36,0.45)',
                  }}>
                    <p style={{ color:'#fbbf24', fontWeight:700, fontSize:'0.78rem', margin:0 }}>
                      🔒 สิทธิการเช่าที่ราชพัสดุ — ไม่ใช่การขายขาด
                    </p>
                    <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.68rem', margin:0 }}>
                      TRD-LEX Official • กรมธนารักษ์ กระทรวงการคลัง
                    </p>
                  </div>
                  {listing.verified && (
                    <div style={{
                      padding:'0.35rem 0.75rem', borderRadius:'var(--radius-full)',
                      background:'rgba(13,140,92,0.85)', backdropFilter:'blur(8px)',
                      fontSize:'0.72rem', fontWeight:700, color:'#fff',
                    }}>✓ ยืนยันแล้ว</div>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              <div style={{ padding:'0.875rem 1rem', display:'flex', gap:'0.5rem', background:'var(--surface-2)' }}>
                {demoImages.map((src, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{
                    width:72, height:52, borderRadius:'var(--radius-sm)', overflow:'hidden',
                    border: activeImg === i ? '2px solid var(--accent)' : '2px solid var(--border)',
                    cursor:'pointer', background:'none', padding:0, flexShrink:0,
                    boxShadow: activeImg === i ? '0 0 0 2px rgba(212,146,10,0.3)' : 'none',
                    transition:'all 0.2s ease',
                  }}>
                    {src ? (
                      <Image src={getAssetUrl(src)} alt="" width={72} height={52} style={{ objectFit:'cover', width:'100%', height:'100%' }} />
                    ) : (
                      <div style={{
                        width:'100%', height:'100%',
                        background:`linear-gradient(135deg, hsl(${210+i*20},55%,${25+i*8}%) 0%, hsl(${225+i*10},60%,${18+i*10}%) 100%)`,
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem',
                      }}>🏢</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Info Cards Grid ── */}
            <div className="card" style={{ padding:'1.5rem' }}>
              <h2 style={{ fontSize:'1rem', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                📊 ข้อมูลสำคัญ
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.875rem', marginBottom:'1.5rem' }}>
                {[
                  { label:'พื้นที่',            value:`${fmt(listing.area)} ${listing.areaUnit}`, icon:'📐', color:'var(--primary)' },
                  { label:'สัญญาคงเหลือ',       value:`${listing.leaseYearsRemaining} ปี`,       icon:'📅', color:'var(--accent)' },
                  { label:'หมดอายุสัญญา',       value:`พ.ศ. ${listing.leaseExpiryYear+543}`,     icon:'⏳', color:'var(--warning)' },
                  { label:'ค่าเช่า/เดือน',      value:`฿${fmt(listing.monthlyRent)}`,            icon:'💰', color:'var(--success)' },
                  { label:'ค่าตอบแทนโอนสิทธิ', value:`฿${fmt(listing.transferPrice)}`,          icon:'🤝', color:'var(--primary-light)' },
                  { label:'ประเภทย่าน',         value:listing.zoneType,                          icon:'🏙️', color:'var(--text-muted)' },
                ].map(({ label, value, icon, color }) => (
                  <div key={label} style={{
                    padding:'0.875rem', background:'var(--surface-2)',
                    borderRadius:'var(--radius-md)', border:'1px solid var(--border)',
                  }}>
                    <div style={{ fontSize:'1.2rem', marginBottom:'0.35rem' }}>{icon}</div>
                    <div style={{ fontSize:'0.67rem', color:'var(--text-light)', fontWeight:500, marginBottom:'0.2rem' }}>{label}</div>
                    <div style={{ fontWeight:700, color, fontSize:'clamp(0.8rem,2vw,0.9rem)' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Location */}
              <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>📍 ที่ตั้งและแผนที่ภาพถ่ายทางอากาศ</h4>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{listing.location.address}</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {listing.location.district} • {listing.location.province}
                  <span style={{ marginLeft:'0.75rem', color:'var(--primary-light)', fontWeight:600 }}>
                    [{listing.location.lat.toFixed(4)}°N, {listing.location.lng.toFixed(4)}°E]
                  </span>
                </p>
                
                {/* Dynamic Map Box */}
                <div style={{
                  height: 350,
                  marginTop: '1rem',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  background: 'var(--border)',
                  position: 'relative',
                }}>
                  <MapComponent 
                    lat={listing.location.lat} 
                    lng={listing.location.lng} 
                    activeRoute={activeRoute} 
                    isExpanded={false} 
                  />
                  
                  {/* Fullscreen Toggle Button */}
                  <button
                    onClick={() => setIsMapExpanded(true)}
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      zIndex: 1000,
                      background: 'rgba(30, 58, 110, 0.95)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(30, 58, 110, 0.95)'}
                  >
                    🔍 ขยายแผนที่แบบเต็ม
                  </button>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom:'1.25rem' }}>
                <h4 style={{ fontSize:'0.875rem', marginBottom:'0.625rem' }}>📝 รายละเอียด</h4>
                <p style={{ fontSize:'0.875rem', lineHeight:1.85, color:'var(--text-muted)' }}>{listing.description}</p>
              </div>

              {/* Utilities */}
              {listing.utilities && (
                <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: '0.625rem' }}>⚡ สาธารณูปโภคต่างๆ</h4>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {listing.utilities.map((ut, i) => {
                      let bgColor = 'rgba(30, 58, 110, 0.05)';
                      let textColor = 'var(--primary)';
                      let borderColor = 'rgba(30, 58, 110, 0.15)';
                      let logoUrl = null;
                      let emoji = '📶';

                      if (ut.includes('ไฟฟ้า')) {
                        bgColor = 'rgba(120, 53, 4, 0.06)';
                        textColor = '#78350f';
                        borderColor = 'rgba(120, 53, 4, 0.2)';
                        logoUrl = '/logo-pea-circle.png';
                        emoji = '⚡';
                      } else if (ut.includes('ประปา') || ut.includes('ชลประทาน')) {
                        bgColor = 'rgba(3, 105, 161, 0.06)';
                        textColor = '#0369a1';
                        borderColor = 'rgba(3, 105, 161, 0.2)';
                        logoUrl = '/logo-pwa-circle.png';
                        emoji = '💧';
                      } else if (ut.toUpperCase().includes('AIS')) {
                        bgColor = 'rgba(101, 163, 13, 0.06)';
                        textColor = '#4d7c0f';
                        borderColor = 'rgba(101, 163, 13, 0.2)';
                        logoUrl = '/logo-ais.png';
                        emoji = '🟢';
                      } else if (ut.toUpperCase().includes('TRUE')) {
                        bgColor = 'rgba(220, 38, 38, 0.05)';
                        textColor = '#b91c1c';
                        borderColor = 'rgba(220, 38, 38, 0.18)';
                        logoUrl = '/logo-true.png';
                        emoji = '🔴';
                      } else if (ut.toUpperCase().includes('3BB')) {
                        bgColor = 'rgba(249, 115, 22, 0.06)';
                        textColor = '#ea580c';
                        borderColor = 'rgba(249, 115, 22, 0.2)';
                        emoji = '📶';
                      }

                      return (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            background: bgColor,
                            border: `1px solid ${borderColor}`,
                            color: textColor,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          <span style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                            overflow: 'hidden',
                            position: 'relative',
                          }}>
                            {logoUrl ? (
                              <Image 
                                src={getAssetUrl(logoUrl)} 
                                alt={ut} 
                                width={24} 
                                height={24} 
                                style={{ objectFit: 'contain' }}
                              />
                            ) : (
                              emoji
                            )}
                          </span>
                          <span>{ut}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Features */}
              {listing.features && (
                <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: '0.625rem' }}>💡 จุดเด่นและสิ่งอำนวยความสะดวก</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {listing.features.map((f, i) => {
                      const clickable = isClickableFeature(f);
                      const isActive = activeRoute === f;
                      if (clickable) {
                        return (
                          <button
                            key={i}
                            onClick={() => setActiveRoute(isActive ? null : f)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              background: isActive ? '#0d8c5c' : 'rgba(13, 140, 92, 0.08)',
                              color: isActive ? '#ffffff' : '#0d8c5c',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              border: isActive ? '1px solid #0d8c5c' : '1px solid rgba(13, 140, 92, 0.3)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              transition: 'all 0.2s ease',
                              boxShadow: isActive ? '0 0 10px rgba(13, 140, 92, 0.3)' : 'none',
                            }}
                            title="คลิกเพื่อแสดงเส้นทางบนแผนที่"
                          >
                            🗺️ {f}
                          </button>
                        );
                      } else {
                        return (
                          <span
                            key={i}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--surface-2)',
                              color: 'var(--text-muted)',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              border: '1px solid var(--border)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            ✓ {f}
                          </span>
                        );
                      }
                    })}
                  </div>
                </div>
              )}

              {/* Zoning & Restrictions */}
              {listing.zoning && (
                <div style={{
                  marginTop: '1.5rem',
                  marginBottom: '1.5rem',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderLeft: `6px solid ${listing.zoning.colorCode}`,
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <h4 style={{ fontSize: '0.925rem', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⚖️ ข้อจำกัดและกฎหมายผังเมือง
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ background: 'var(--surface-2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.67rem', color: 'var(--text-light)', fontWeight: 500, marginBottom: '0.2rem' }}>ประเภทผังเมือง</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{
                          display: 'inline-block',
                          width: 14,
                          height: 14,
                          borderRadius: '3px',
                          background: listing.zoning.colorCode,
                          border: '1px solid rgba(0,0,0,0.1)'
                        }} />
                        <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>
                          {listing.zoning.code} ({listing.zoning.color})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.3 }}>
                        {listing.zoning.name}
                      </div>
                    </div>
                    
                    <div style={{ background: 'var(--surface-2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.67rem', color: 'var(--text-light)', fontWeight: 500, marginBottom: '0.2rem' }}>FAR (พื้นที่อาคารสูงสุด)</div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>{listing.zoning.far}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>ของเนื้อที่ดิน</div>
                    </div>

                    <div style={{ background: 'var(--surface-2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.67rem', color: 'var(--text-light)', fontWeight: 500, marginBottom: '0.2rem' }}>OSR (ที่ดินว่างปราศจากอาคาร)</div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--accent)' }}>{listing.zoning.osr}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>ของพื้นที่อาคารรวม</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(30, 58, 110, 0.03)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>📢 คำอธิบายประเภทผังเมือง:</div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {listing.zoning.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', background: 'rgba(220,38,38,0.03)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(220,38,38,0.1)' }}>
                    <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.25rem' }}>ข้อจำกัดและกฎหมายเฉพาะพื้นที่:</div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {listing.zoning.restriction}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Legal Disclaimer ── */}
            <div style={{
              padding:'1rem 1.25rem', borderRadius:'var(--radius-md)',
              background:'rgba(220,38,38,0.05)', border:'1px solid rgba(220,38,38,0.18)',
              display:'flex', gap:'0.75rem',
            }}>
              <span style={{ fontSize:'1.2rem', flexShrink:0 }}>⚠️</span>
              <p style={{ margin:0, fontSize:'0.82rem', color:'var(--text-muted)', lineHeight:1.7 }}>
                <strong style={{ color:'var(--danger)' }}>ข้อควรระวัง:</strong>{' '}
                ที่ราชพัสดุเป็นทรัพย์สินของแผ่นดิน สิ่งที่สามารถทำได้คือ{' '}
                <strong style={{ color:'var(--text)' }}>&quot;โอนสิทธิการเช่า&quot;</strong> เท่านั้น
                ไม่ใช่การซื้อขายกรรมสิทธิ์ การดำเนินการขั้นสุดท้ายต้องผ่านสำนักงานธนารักษ์พื้นที่
              </p>
            </div>
          </div>

          {/* ════ Right Sidebar ════ */}
          <div className="detail-sidebar" style={{ display:'flex', flexDirection:'column', gap:'1.25rem', position:'sticky', top:76 }}>

            {/* ── Price + CTA ── */}
            <div className="card" style={{ padding:'1.5rem', border:'2px solid rgba(212,146,10,0.2)' }}>
              {/* Price banner */}
              <div style={{
                padding:'1.25rem', marginBottom:'1.25rem', textAlign:'center',
                background:'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
                borderRadius:'var(--radius-lg)', position:'relative', overflow:'hidden',
              }}>
                <div style={{
                  position:'absolute', top:0, left:0, right:0, height:3,
                  background:'linear-gradient(90deg, var(--accent), var(--accent-bright), var(--accent))',
                }} />
                <div style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.75rem', marginBottom:'0.25rem' }}>
                  ค่าตอบแทนโอนสิทธิ
                </div>
                <div style={{ color:'#fff', fontWeight:900, fontSize:'clamp(1.5rem,4vw,2rem)', letterSpacing:'-0.5px' }}>
                  ฿{fmt(listing.transferPrice)}
                </div>
                <div style={{ color:'var(--accent-bright)', fontSize:'0.72rem', fontWeight:600, marginTop:'0.2rem' }}>
                  บาท (ไม่รวมค่าธรรมเนียม)
                </div>
              </div>

              {/* CTA Buttons */}
              <button
                id="express-interest-btn"
                onClick={() => setShowInterestModal(true)}
                className="btn btn-accent btn-lg w-full"
                style={{ borderRadius:'var(--radius-md)', justifyContent:'center', marginBottom:'0.75rem',
                  boxShadow:'0 6px 20px rgba(212,146,10,0.35)' }}
              >
                💬 แสดงความสนใจ
              </button>
              <Link href="/fee-calculator" className="btn btn-outline w-full"
                style={{ borderRadius:'var(--radius-md)', justifyContent:'center', textDecoration:'none' }}>
                🧮 คำนวณค่าธรรมเนียม
              </Link>

              {/* Stats */}
              <div style={{
                display:'flex', gap:'0', marginTop:'1rem',
                background:'var(--surface-2)', borderRadius:'var(--radius-md)',
                border:'1px solid var(--border)', overflow:'hidden',
              }}>
                {[
                  { label:'เข้าชม', value:fmt(listing.views), icon:'👁️' },
                  { label:'ความสนใจ', value:listing.interests, icon:'💬' },
                ].map((item, i) => (
                  <div key={item.label} style={{
                    flex:1, textAlign:'center', padding:'0.875rem 0.5rem',
                    borderRight: i === 0 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ fontSize:'1rem', marginBottom:'0.15rem' }}>{item.icon}</div>
                    <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)' }}>{item.value}</div>
                    <div style={{ fontSize:'0.67rem', color:'var(--text-light)' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Fee Estimator ── */}
            <div className="card" style={{ padding:'1.5rem' }}>
              <h3 style={{ fontSize:'0.925rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                🧮 ค่าธรรมเนียมโดยประมาณ
              </h3>
              {[
                { label:'ค่าธรรมเนียมโอนสิทธิ', sub:'2.5%', value:transferFee },
                { label:'อากรแสตมป์',           sub:'0.5%', value:stampDuty   },
                { label:'ภาษีหัก ณ ที่จ่าย',    sub:'1.0%', value:withholding },
              ].map(({ label, sub, value }) => (
                <div key={label} style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'0.6rem 0', borderBottom:'1px solid var(--border-subtle)',
                }}>
                  <div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{label}</div>
                    <div style={{ fontSize:'0.68rem', color:'var(--text-light)' }}>{sub}</div>
                  </div>
                  <span style={{ fontSize:'0.875rem', fontWeight:700 }}>฿{fmt(value)}</span>
                </div>
              ))}
              <div style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'0.875rem 0', marginTop:'0.25rem',
              }}>
                <span style={{ fontWeight:700 }}>รวมค่าธรรมเนียม</span>
                <span style={{ fontWeight:900, color:'var(--primary)', fontSize:'1.05rem' }}>฿{fmt(totalFee)}</span>
              </div>
              <div style={{
                padding:'0.75rem', background:'rgba(212,146,10,0.06)',
                border:'1px solid rgba(212,146,10,0.2)', borderRadius:'var(--radius-sm)',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>รวมทั้งสิ้น (ประมาณ)</span>
                <span style={{ fontWeight:900, color:'var(--accent)', fontSize:'1rem' }}>
                  ฿{fmt(listing.transferPrice + totalFee)}
                </span>
              </div>
              <p style={{ fontSize:'0.7rem', color:'var(--text-light)', margin:'0.5rem 0 0' }}>
                * ตัวเลขประมาณเท่านั้น ขึ้นกับการพิจารณาของกรมธนารักษ์
              </p>
            </div>

            {/* ── Seller Info ── */}
            <div className="card" style={{ padding:'1.5rem' }}>
              <h3 style={{ fontSize:'0.925rem', marginBottom:'1rem' }}>👤 ข้อมูลผู้ประกาศ</h3>
              <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'1rem' }}>
                <div style={{
                  width:46, height:46, borderRadius:'50%', flexShrink:0,
                  background:'linear-gradient(135deg, var(--primary), var(--primary-light))',
                  color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:800, fontSize:'1.1rem',
                }}>
                  {listing.seller.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.875rem' }}>{listing.seller.name}</div>
                  {listing.seller.verified && (
                    <div style={{ fontSize:'0.7rem', color:'var(--success)', fontWeight:600, display:'flex', alignItems:'center', gap:'0.25rem' }}>
                      <span>✓</span> ยืนยัน ThaiD แล้ว
                    </div>
                  )}
                </div>
              </div>
              <div style={{
                padding:'0.75rem', background:'var(--surface-2)',
                borderRadius:'var(--radius-md)', textAlign:'center',
                border:'1px solid var(--border)',
              }}>
                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.2rem' }}>📞 {listing.seller.phone}</div>
                <div style={{ fontSize:'0.7rem', color:'var(--text-light)' }}>
                  เบอร์โทรแสดงเมื่อแสดงความสนใจแล้ว
                </div>
              </div>

              {/* Listed date */}
              <div style={{ marginTop:'0.875rem', display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--text-light)' }}>
                <span>📅 ลงประกาศ: {listing.listedDate}</span>
                <span>#{listing.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ Express Interest Modal ════ */}
      {showInterestModal && (
        <div style={{
          position:'fixed', inset:0, zIndex:2000,
          background:'rgba(10,24,55,0.75)', backdropFilter:'blur(6px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem',
        }} onClick={e => e.target === e.currentTarget && !interestSent && setShowInterestModal(false)}>
          <div style={{
            background:'#fff', borderRadius:'var(--radius-xl)', padding:'clamp(1.5rem,5vw,2.5rem)',
            width:'100%', maxWidth:480, boxShadow:'0 32px 80px rgba(0,0,0,0.25)',
            animation:'slideDown 0.25s ease',
            position:'relative',
          }}>
            {!interestSent ? (
              <>
                {/* Gold top bar */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:4,
                  background:'linear-gradient(90deg, var(--accent), var(--accent-bright), var(--accent))',
                  borderRadius:'var(--radius-xl) var(--radius-xl) 0 0' }} />

                <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>💬</div>
                  <h2 style={{ fontSize:'1.2rem', marginBottom:'0.5rem' }}>แสดงความสนใจ</h2>
                  <p style={{ fontSize:'0.875rem', margin:0 }}>
                    ระบบจะส่งข้อมูลการติดต่อของท่านให้ผู้ประกาศ
                  </p>
                </div>

                {/* Listing summary */}
                <div style={{
                  padding:'0.875rem 1rem', background:'var(--surface-2)',
                  borderRadius:'var(--radius-md)', border:'1px solid var(--border)',
                  marginBottom:'1.25rem',
                }}>
                  <div style={{ fontWeight:700, fontSize:'0.875rem', marginBottom:'0.25rem' }}>{listing.title}</div>
                  <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', display:'flex', justifyContent:'space-between' }}>
                    <span>📍 {listing.location.province}</span>
                    <span style={{ fontWeight:700, color:'var(--primary)' }}>฿{fmt(listing.transferPrice)}</span>
                  </div>
                </div>

                {/* ThaiD check */}
                <div style={{
                  padding:'0.875rem 1rem', background:'linear-gradient(135deg,#1a237e,#283593)',
                  borderRadius:'var(--radius-md)', marginBottom:'1.25rem',
                  display:'flex', alignItems:'center', gap:'0.75rem',
                }}>
                  <span style={{ fontSize:'1.4rem' }}>🇹🇭</span>
                  <div>
                    <div style={{ color:'#a5f3fc', fontWeight:700, fontSize:'0.82rem' }}>ยืนยันตัวตนผ่าน ThaiD แล้ว</div>
                    <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.72rem' }}>นายสมชาย ทดสอบ — บัตรประชาชน ***-****-1234</div>
                  </div>
                  <span style={{ color:'#6ee7b7', fontSize:'1.2rem', marginLeft:'auto' }}>✓</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="interest-msg">ข้อความถึงผู้ประกาศ (ไม่บังคับ)</label>
                  <textarea
                    id="interest-msg"
                    className="form-textarea"
                    placeholder="เช่น สนใจดูสถานที่จริง ขอนัดหมายได้ไหมครับ..."
                    value={interestMsg}
                    onChange={e => setInterestMsg(e.target.value)}
                    style={{ minHeight:90 }}
                  />
                </div>

                <p style={{ fontSize:'0.75rem', color:'var(--text-light)', marginBottom:'1.25rem', lineHeight:1.65 }}>
                  การแสดงความสนใจไม่ถือเป็นการผูกพันทางกฎหมาย การโอนสิทธิ์จริงต้องดำเนินการผ่านสำนักงานธนารักษ์พื้นที่เท่านั้น
                </p>

                <div style={{ display:'flex', gap:'0.75rem' }}>
                  <button
                    onClick={() => setShowInterestModal(false)}
                    className="btn btn-outline"
                    style={{ flex:1, justifyContent:'center', borderRadius:'var(--radius-md)' }}
                  >ยกเลิก</button>
                  <button
                    id="confirm-interest-btn"
                    onClick={handleSendInterest}
                    className="btn btn-accent"
                    style={{ flex:2, justifyContent:'center', borderRadius:'var(--radius-md)',
                      boxShadow:'0 4px 16px rgba(212,146,10,0.35)', fontSize:'0.95rem' }}
                  >✅ ยืนยันแสดงความสนใจ</button>
                </div>
              </>
            ) : (
              /* Success State */
              <div style={{ textAlign:'center', padding:'1rem 0' }}>
                <div style={{
                  width:72, height:72, borderRadius:'50%',
                  background:'rgba(13,140,92,0.1)', border:'3px solid var(--success)',
                  margin:'0 auto 1.25rem',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem',
                }}>✅</div>
                <h3 style={{ color:'var(--success)', marginBottom:'0.5rem' }}>ส่งความสนใจเรียบร้อย!</h3>
                <p style={{ marginBottom:'0.75rem' }}>ระบบส่งข้อมูลให้ผู้ประกาศแล้ว</p>
                <div style={{
                  padding:'0.75rem 1rem', background:'var(--surface-2)',
                  borderRadius:'var(--radius-md)', fontSize:'0.82rem', color:'var(--text-muted)',
                  border:'1px solid var(--border)',
                }}>
                  📞 เบอร์ติดต่อ: <strong style={{ color:'var(--text)' }}>{listing.seller.phone.replace('x', '8')}</strong>
                  <br /><span style={{ fontSize:'0.72rem' }}>ผู้ประกาศจะติดต่อกลับภายใน 24 ชม.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════ Fullscreen Map Modal ════ */}
      {isMapExpanded && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(10, 24, 55, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }} onClick={() => setIsMapExpanded(false)}>
          <div style={{
            position: 'relative',
            width: '92vw',
            height: '88vh',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.2s ease',
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--surface-2)',
            }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🗺️ แผนที่ภาพถ่ายทางอากาศและรูปแปลงที่ดิน (โหมดขยายเต็มหน้าจอ)
                </h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  {listing.title} • {listing.location.address}
                </p>
              </div>
              <button
                onClick={() => setIsMapExpanded(false)}
                style={{
                  background: 'var(--danger)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                ✖ ปิดแผนที่
              </button>
            </div>

            {/* Map Area */}
            <div style={{ flex: 1, position: 'relative' }}>
              <MapComponent
                lat={listing.location.lat}
                lng={listing.location.lng}
                activeRoute={activeRoute}
                isExpanded={isMapExpanded}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
