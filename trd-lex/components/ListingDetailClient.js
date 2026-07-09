'use client';
import { useState, use, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { mockListings, feeConfig } from '@/lib/mockData';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function ListingDetailPage({ params }) {
  const { id } = use(params);
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
    const keywords = ['BTS', 'MRT', 'เธฃเธ–เนเธเธเนเธฒ', 'เธ—เนเธฒเน€เธฃเธทเธญ', 'เนเธกเนเธเนเธณ', 'เธเธฒเธขเธซเธฒเธ”', 'เธ—เธฐเน€เธฅ'];
    return keywords.some(kw => feat.toUpperCase().includes(kw));
  };

  if (!listing) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '3rem' }}>๐”</div>
        <h2>เนเธกเนเธเธเธเธฃเธฐเธเธฒเธจเธเธตเน</h2>
        <Link href="/listings" className="btn btn-primary">โ เธเธฅเธฑเธเธซเธเนเธฒเธเนเธเธซเธฒ</Link>
      </div>
    );
  }

  const fmt = n => n.toLocaleString('th-TH');
  const transferFee = Math.round(listing.transferPrice * feeConfig.transferFeeRate);
  const stampDuty   = Math.round(listing.transferPrice * feeConfig.stampDutyRate);
  const withholding = Math.round(listing.transferPrice * feeConfig.withholdingTaxRate);
  const totalFee    = transferFee + stampDuty + withholding;

  // Demo images โ€” use real photo for first listing, gradient placeholders for rest
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
      {/* โ”€โ”€ Page Header โ”€โ”€ */}
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
            {[['/', 'เธซเธเนเธฒเนเธฃเธ'], ['/listings', 'เธเนเธเธซเธฒเธเธฃเธฐเธเธฒเธจ']].map(([href, label]) => (
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
            }}>๐ข {listing.zoneType}</span>
            {listing.verified && (
              <span style={{
                padding:'0.22rem 0.75rem', borderRadius:'var(--radius-full)',
                background:'rgba(13,140,92,0.35)', color:'#6ee7b7', fontSize:'0.78rem', fontWeight:700,
              }}>โ“ เธขเธทเธเธขเธฑเธเธ•เธฑเธงเธ•เธเนเธฅเนเธง</span>
            )}
            <span style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.78rem' }}>
              เธชเธฑเธเธเธฒ: {listing.contractNo}
            </span>
            <span style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.78rem', marginLeft:'auto' }}>
              ๐‘ {fmt(listing.views)} เธเธฃเธฑเนเธ
            </span>
          </div>
        </div>
      </div>

      {/* โ”€โ”€ Main Content โ”€โ”€ */}
      <div className="container" style={{ padding:'1.75rem 1.5rem' }}>
        <div className="detail-layout" style={{ display:'grid', gridTemplateColumns:'1fr 350px', gap:'2rem', alignItems:'start' }}>

          {/* โ•โ•โ•โ• Left Column โ•โ•โ•โ• */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

            {/* โ”€โ”€ Image Gallery โ”€โ”€ */}
            <div className="card" style={{ overflow:'hidden' }}>
              {/* Main Image */}
              <div style={{ height:'clamp(220px,40vw,360px)', position:'relative', overflow:'hidden',
                background:'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 60%, #203c8a 100%)' }}>

                {demoImages[activeImg] ? (
                  <Image
                    src={demoImages[activeImg]}
                    alt={listing.title}
                    fill
                    style={{ objectFit:'cover', objectPosition:'center' }}
                    sizes="(max-width:768px) 100vw, 700px"
                  />
                ) : (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:'5rem', opacity:0.2 }}>๐ข</span>
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
                      ๐”’ เธชเธดเธ—เธเธดเธเธฒเธฃเน€เธเนเธฒเธ—เธตเนเธฃเธฒเธเธเธฑเธชเธ”เธธ โ€” เนเธกเนเนเธเนเธเธฒเธฃเธเธฒเธขเธเธฒเธ”
                    </p>
                    <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.68rem', margin:0 }}>
                      TRD-LEX Official โ€ข เธเธฃเธกเธเธเธฒเธฃเธฑเธเธฉเน เธเธฃเธฐเธ—เธฃเธงเธเธเธฒเธฃเธเธฅเธฑเธ
                    </p>
                  </div>
                  {listing.verified && (
                    <div style={{
                      padding:'0.35rem 0.75rem', borderRadius:'var(--radius-full)',
                      background:'rgba(13,140,92,0.85)', backdropFilter:'blur(8px)',
                      fontSize:'0.72rem', fontWeight:700, color:'#fff',
                    }}>โ“ เธขเธทเธเธขเธฑเธเนเธฅเนเธง</div>
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
                      <Image src={src} alt="" width={72} height={52} style={{ objectFit:'cover', width:'100%', height:'100%' }} />
                    ) : (
                      <div style={{
                        width:'100%', height:'100%',
                        background:`linear-gradient(135deg, hsl(${210+i*20},55%,${25+i*8}%) 0%, hsl(${225+i*10},60%,${18+i*10}%) 100%)`,
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem',
                      }}>๐ข</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* โ”€โ”€ Info Cards Grid โ”€โ”€ */}
            <div className="card" style={{ padding:'1.5rem' }}>
              <h2 style={{ fontSize:'1rem', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                ๐“ เธเนเธญเธกเธนเธฅเธชเธณเธเธฑเธ
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.875rem', marginBottom:'1.5rem' }}>
                {[
                  { label:'เธเธทเนเธเธ—เธตเน',            value:`${fmt(listing.area)} ${listing.areaUnit}`, icon:'๐“', color:'var(--primary)' },
                  { label:'เธชเธฑเธเธเธฒเธเธเน€เธซเธฅเธทเธญ',       value:`${listing.leaseYearsRemaining} เธเธต`,       icon:'๐“…', color:'var(--accent)' },
                  { label:'เธซเธกเธ”เธญเธฒเธขเธธเธชเธฑเธเธเธฒ',       value:`เธ.เธจ. ${listing.leaseExpiryYear+543}`,     icon:'โณ', color:'var(--warning)' },
                  { label:'เธเนเธฒเน€เธเนเธฒ/เน€เธ”เธทเธญเธ',      value:`เธฟ${fmt(listing.monthlyRent)}`,            icon:'๐’ฐ', color:'var(--success)' },
                  { label:'เธเนเธฒเธ•เธญเธเนเธ—เธเนเธญเธเธชเธดเธ—เธเธด', value:`เธฟ${fmt(listing.transferPrice)}`,          icon:'๐ค', color:'var(--primary-light)' },
                  { label:'เธเธฃเธฐเน€เธ เธ—เธขเนเธฒเธ',         value:listing.zoneType,                          icon:'๐๏ธ', color:'var(--text-muted)' },
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
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>๐“ เธ—เธตเนเธ•เธฑเนเธเนเธฅเธฐเนเธเธเธ—เธตเนเธ เธฒเธเธ–เนเธฒเธขเธ—เธฒเธเธญเธฒเธเธฒเธจ</h4>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{listing.location.address}</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {listing.location.district} โ€ข {listing.location.province}
                  <span style={{ marginLeft:'0.75rem', color:'var(--primary-light)', fontWeight:600 }}>
                    [{listing.location.lat.toFixed(4)}ยฐN, {listing.location.lng.toFixed(4)}ยฐE]
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
                    ๐” เธเธขเธฒเธขเนเธเธเธ—เธตเนเนเธเธเน€เธ•เนเธก
                  </button>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom:'1.25rem' }}>
                <h4 style={{ fontSize:'0.875rem', marginBottom:'0.625rem' }}>๐“ เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”</h4>
                <p style={{ fontSize:'0.875rem', lineHeight:1.85, color:'var(--text-muted)' }}>{listing.description}</p>
              </div>

              {/* Utilities */}
              {listing.utilities && (
                <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: '0.625rem' }}>โก เธชเธฒเธเธฒเธฃเธ“เธนเธเนเธ เธเธ•เนเธฒเธเน</h4>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {listing.utilities.map((ut, i) => {
                      let bgColor = 'rgba(30, 58, 110, 0.05)';
                      let textColor = 'var(--primary)';
                      let borderColor = 'rgba(30, 58, 110, 0.15)';
                      let logoUrl = null;
                      let emoji = '๐“ถ';

                      if (ut.includes('เนเธเธเนเธฒ')) {
                        bgColor = 'rgba(120, 53, 4, 0.06)';
                        textColor = '#78350f';
                        borderColor = 'rgba(120, 53, 4, 0.2)';
                        logoUrl = '/logo-pea-circle.png';
                        emoji = 'โก';
                      } else if (ut.includes('เธเธฃเธฐเธเธฒ') || ut.includes('เธเธฅเธเธฃเธฐเธ—เธฒเธ')) {
                        bgColor = 'rgba(3, 105, 161, 0.06)';
                        textColor = '#0369a1';
                        borderColor = 'rgba(3, 105, 161, 0.2)';
                        logoUrl = '/logo-pwa-circle.png';
                        emoji = '๐’ง';
                      } else if (ut.toUpperCase().includes('AIS')) {
                        bgColor = 'rgba(101, 163, 13, 0.06)';
                        textColor = '#4d7c0f';
                        borderColor = 'rgba(101, 163, 13, 0.2)';
                        logoUrl = '/logo-ais.png';
                        emoji = '๐ข';
                      } else if (ut.toUpperCase().includes('TRUE')) {
                        bgColor = 'rgba(220, 38, 38, 0.05)';
                        textColor = '#b91c1c';
                        borderColor = 'rgba(220, 38, 38, 0.18)';
                        logoUrl = '/logo-true.png';
                        emoji = '๐”ด';
                      } else if (ut.toUpperCase().includes('3BB')) {
                        bgColor = 'rgba(249, 115, 22, 0.06)';
                        textColor = '#ea580c';
                        borderColor = 'rgba(249, 115, 22, 0.2)';
                        emoji = '๐“ถ';
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
                                src={logoUrl} 
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
                  <h4 style={{ fontSize: '0.875rem', marginBottom: '0.625rem' }}>๐’ก เธเธธเธ”เน€เธ”เนเธเนเธฅเธฐเธชเธดเนเธเธญเธณเธเธงเธขเธเธงเธฒเธกเธชเธฐเธ”เธงเธ</h4>
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
                            title="เธเธฅเธดเธเน€เธเธทเนเธญเนเธชเธ”เธเน€เธชเนเธเธ—เธฒเธเธเธเนเธเธเธ—เธตเน"
                          >
                            ๐—บ๏ธ {f}
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
                            โ“ {f}
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
                    โ–๏ธ เธเนเธญเธเธณเธเธฑเธ”เนเธฅเธฐเธเธเธซเธกเธฒเธขเธเธฑเธเน€เธกเธทเธญเธ
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ background: 'var(--surface-2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.67rem', color: 'var(--text-light)', fontWeight: 500, marginBottom: '0.2rem' }}>เธเธฃเธฐเน€เธ เธ—เธเธฑเธเน€เธกเธทเธญเธ</div>
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
                      <div style={{ fontSize: '0.67rem', color: 'var(--text-light)', fontWeight: 500, marginBottom: '0.2rem' }}>FAR (เธเธทเนเธเธ—เธตเนเธญเธฒเธเธฒเธฃเธชเธนเธเธชเธธเธ”)</div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>{listing.zoning.far}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>เธเธญเธเน€เธเธทเนเธญเธ—เธตเนเธ”เธดเธ</div>
                    </div>

                    <div style={{ background: 'var(--surface-2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.67rem', color: 'var(--text-light)', fontWeight: 500, marginBottom: '0.2rem' }}>OSR (เธ—เธตเนเธ”เธดเธเธงเนเธฒเธเธเธฃเธฒเธจเธเธฒเธเธญเธฒเธเธฒเธฃ)</div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--accent)' }}>{listing.zoning.osr}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>เธเธญเธเธเธทเนเธเธ—เธตเนเธญเธฒเธเธฒเธฃเธฃเธงเธก</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(30, 58, 110, 0.03)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>๐“ข เธเธณเธญเธเธดเธเธฒเธขเธเธฃเธฐเน€เธ เธ—เธเธฑเธเน€เธกเธทเธญเธ:</div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {listing.zoning.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', background: 'rgba(220,38,38,0.03)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(220,38,38,0.1)' }}>
                    <span style={{ fontSize: '1.1rem' }}>โ ๏ธ</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.25rem' }}>เธเนเธญเธเธณเธเธฑเธ”เนเธฅเธฐเธเธเธซเธกเธฒเธขเน€เธเธเธฒเธฐเธเธทเนเธเธ—เธตเน:</div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {listing.zoning.restriction}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* โ”€โ”€ Legal Disclaimer โ”€โ”€ */}
            <div style={{
              padding:'1rem 1.25rem', borderRadius:'var(--radius-md)',
              background:'rgba(220,38,38,0.05)', border:'1px solid rgba(220,38,38,0.18)',
              display:'flex', gap:'0.75rem',
            }}>
              <span style={{ fontSize:'1.2rem', flexShrink:0 }}>โ ๏ธ</span>
              <p style={{ margin:0, fontSize:'0.82rem', color:'var(--text-muted)', lineHeight:1.7 }}>
                <strong style={{ color:'var(--danger)' }}>เธเนเธญเธเธงเธฃเธฃเธฐเธงเธฑเธ:</strong>{' '}
                เธ—เธตเนเธฃเธฒเธเธเธฑเธชเธ”เธธเน€เธเนเธเธ—เธฃเธฑเธเธขเนเธชเธดเธเธเธญเธเนเธเนเธเธ”เธดเธ เธชเธดเนเธเธ—เธตเนเธชเธฒเธกเธฒเธฃเธ–เธ—เธณเนเธ”เนเธเธทเธญ{' '}
                <strong style={{ color:'var(--text)' }}>&quot;เนเธญเธเธชเธดเธ—เธเธดเธเธฒเธฃเน€เธเนเธฒ&quot;</strong> เน€เธ—เนเธฒเธเธฑเนเธ
                เนเธกเนเนเธเนเธเธฒเธฃเธเธทเนเธญเธเธฒเธขเธเธฃเธฃเธกเธชเธดเธ—เธเธดเน เธเธฒเธฃเธ”เธณเน€เธเธดเธเธเธฒเธฃเธเธฑเนเธเธชเธธเธ”เธ—เนเธฒเธขเธ•เนเธญเธเธเนเธฒเธเธชเธณเธเธฑเธเธเธฒเธเธเธเธฒเธฃเธฑเธเธฉเนเธเธทเนเธเธ—เธตเน
              </p>
            </div>
          </div>

          {/* โ•โ•โ•โ• Right Sidebar โ•โ•โ•โ• */}
          <div className="detail-sidebar" style={{ display:'flex', flexDirection:'column', gap:'1.25rem', position:'sticky', top:76 }}>

            {/* โ”€โ”€ Price + CTA โ”€โ”€ */}
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
                  เธเนเธฒเธ•เธญเธเนเธ—เธเนเธญเธเธชเธดเธ—เธเธด
                </div>
                <div style={{ color:'#fff', fontWeight:900, fontSize:'clamp(1.5rem,4vw,2rem)', letterSpacing:'-0.5px' }}>
                  เธฟ{fmt(listing.transferPrice)}
                </div>
                <div style={{ color:'var(--accent-bright)', fontSize:'0.72rem', fontWeight:600, marginTop:'0.2rem' }}>
                  เธเธฒเธ— (เนเธกเนเธฃเธงเธกเธเนเธฒเธเธฃเธฃเธกเน€เธเธตเธขเธก)
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
                ๐’ฌ เนเธชเธ”เธเธเธงเธฒเธกเธชเธเนเธ
              </button>
              <Link href="/fee-calculator" className="btn btn-outline w-full"
                style={{ borderRadius:'var(--radius-md)', justifyContent:'center', textDecoration:'none' }}>
                ๐งฎ เธเธณเธเธงเธ“เธเนเธฒเธเธฃเธฃเธกเน€เธเธตเธขเธก
              </Link>

              {/* Stats */}
              <div style={{
                display:'flex', gap:'0', marginTop:'1rem',
                background:'var(--surface-2)', borderRadius:'var(--radius-md)',
                border:'1px solid var(--border)', overflow:'hidden',
              }}>
                {[
                  { label:'เน€เธเนเธฒเธเธก', value:fmt(listing.views), icon:'๐‘๏ธ' },
                  { label:'เธเธงเธฒเธกเธชเธเนเธ', value:listing.interests, icon:'๐’ฌ' },
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

            {/* โ”€โ”€ Fee Estimator โ”€โ”€ */}
            <div className="card" style={{ padding:'1.5rem' }}>
              <h3 style={{ fontSize:'0.925rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                ๐งฎ เธเนเธฒเธเธฃเธฃเธกเน€เธเธตเธขเธกเนเธ”เธขเธเธฃเธฐเธกเธฒเธ“
              </h3>
              {[
                { label:'เธเนเธฒเธเธฃเธฃเธกเน€เธเธตเธขเธกเนเธญเธเธชเธดเธ—เธเธด', sub:'2.5%', value:transferFee },
                { label:'เธญเธฒเธเธฃเนเธชเธ•เธกเธเน',           sub:'0.5%', value:stampDuty   },
                { label:'เธ เธฒเธฉเธตเธซเธฑเธ เธ“ เธ—เธตเนเธเนเธฒเธข',    sub:'1.0%', value:withholding },
              ].map(({ label, sub, value }) => (
                <div key={label} style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'0.6rem 0', borderBottom:'1px solid var(--border-subtle)',
                }}>
                  <div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{label}</div>
                    <div style={{ fontSize:'0.68rem', color:'var(--text-light)' }}>{sub}</div>
                  </div>
                  <span style={{ fontSize:'0.875rem', fontWeight:700 }}>เธฟ{fmt(value)}</span>
                </div>
              ))}
              <div style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'0.875rem 0', marginTop:'0.25rem',
              }}>
                <span style={{ fontWeight:700 }}>เธฃเธงเธกเธเนเธฒเธเธฃเธฃเธกเน€เธเธตเธขเธก</span>
                <span style={{ fontWeight:900, color:'var(--primary)', fontSize:'1.05rem' }}>เธฟ{fmt(totalFee)}</span>
              </div>
              <div style={{
                padding:'0.75rem', background:'rgba(212,146,10,0.06)',
                border:'1px solid rgba(212,146,10,0.2)', borderRadius:'var(--radius-sm)',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>เธฃเธงเธกเธ—เธฑเนเธเธชเธดเนเธ (เธเธฃเธฐเธกเธฒเธ“)</span>
                <span style={{ fontWeight:900, color:'var(--accent)', fontSize:'1rem' }}>
                  เธฟ{fmt(listing.transferPrice + totalFee)}
                </span>
              </div>
              <p style={{ fontSize:'0.7rem', color:'var(--text-light)', margin:'0.5rem 0 0' }}>
                * เธ•เธฑเธงเน€เธฅเธเธเธฃเธฐเธกเธฒเธ“เน€เธ—เนเธฒเธเธฑเนเธ เธเธถเนเธเธเธฑเธเธเธฒเธฃเธเธดเธเธฒเธฃเธ“เธฒเธเธญเธเธเธฃเธกเธเธเธฒเธฃเธฑเธเธฉเน
              </p>
            </div>

            {/* โ”€โ”€ Seller Info โ”€โ”€ */}
            <div className="card" style={{ padding:'1.5rem' }}>
              <h3 style={{ fontSize:'0.925rem', marginBottom:'1rem' }}>๐‘ค เธเนเธญเธกเธนเธฅเธเธนเนเธเธฃเธฐเธเธฒเธจ</h3>
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
                      <span>โ“</span> เธขเธทเธเธขเธฑเธ ThaiD เนเธฅเนเธง
                    </div>
                  )}
                </div>
              </div>
              <div style={{
                padding:'0.75rem', background:'var(--surface-2)',
                borderRadius:'var(--radius-md)', textAlign:'center',
                border:'1px solid var(--border)',
              }}>
                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.2rem' }}>๐“ {listing.seller.phone}</div>
                <div style={{ fontSize:'0.7rem', color:'var(--text-light)' }}>
                  เน€เธเธญเธฃเนเนเธ—เธฃเนเธชเธ”เธเน€เธกเธทเนเธญเนเธชเธ”เธเธเธงเธฒเธกเธชเธเนเธเนเธฅเนเธง
                </div>
              </div>

              {/* Listed date */}
              <div style={{ marginTop:'0.875rem', display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--text-light)' }}>
                <span>๐“… เธฅเธเธเธฃเธฐเธเธฒเธจ: {listing.listedDate}</span>
                <span>#{listing.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* โ•โ•โ•โ• Express Interest Modal โ•โ•โ•โ• */}
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
                  <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>๐’ฌ</div>
                  <h2 style={{ fontSize:'1.2rem', marginBottom:'0.5rem' }}>เนเธชเธ”เธเธเธงเธฒเธกเธชเธเนเธ</h2>
                  <p style={{ fontSize:'0.875rem', margin:0 }}>
                    เธฃเธฐเธเธเธเธฐเธชเนเธเธเนเธญเธกเธนเธฅเธเธฒเธฃเธ•เธดเธ”เธ•เนเธญเธเธญเธเธ—เนเธฒเธเนเธซเนเธเธนเนเธเธฃเธฐเธเธฒเธจ
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
                    <span>๐“ {listing.location.province}</span>
                    <span style={{ fontWeight:700, color:'var(--primary)' }}>เธฟ{fmt(listing.transferPrice)}</span>
                  </div>
                </div>

                {/* ThaiD check */}
                <div style={{
                  padding:'0.875rem 1rem', background:'linear-gradient(135deg,#1a237e,#283593)',
                  borderRadius:'var(--radius-md)', marginBottom:'1.25rem',
                  display:'flex', alignItems:'center', gap:'0.75rem',
                }}>
                  <span style={{ fontSize:'1.4rem' }}>๐น๐ญ</span>
                  <div>
                    <div style={{ color:'#a5f3fc', fontWeight:700, fontSize:'0.82rem' }}>เธขเธทเธเธขเธฑเธเธ•เธฑเธงเธ•เธเธเนเธฒเธ ThaiD เนเธฅเนเธง</div>
                    <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.72rem' }}>เธเธฒเธขเธชเธกเธเธฒเธข เธ—เธ”เธชเธญเธ โ€” เธเธฑเธ•เธฃเธเธฃเธฐเธเธฒเธเธ ***-****-1234</div>
                  </div>
                  <span style={{ color:'#6ee7b7', fontSize:'1.2rem', marginLeft:'auto' }}>โ“</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="interest-msg">เธเนเธญเธเธงเธฒเธกเธ–เธถเธเธเธนเนเธเธฃเธฐเธเธฒเธจ (เนเธกเนเธเธฑเธเธเธฑเธ)</label>
                  <textarea
                    id="interest-msg"
                    className="form-textarea"
                    placeholder="เน€เธเนเธ เธชเธเนเธเธ”เธนเธชเธ–เธฒเธเธ—เธตเนเธเธฃเธดเธ เธเธญเธเธฑเธ”เธซเธกเธฒเธขเนเธ”เนเนเธซเธกเธเธฃเธฑเธ..."
                    value={interestMsg}
                    onChange={e => setInterestMsg(e.target.value)}
                    style={{ minHeight:90 }}
                  />
                </div>

                <p style={{ fontSize:'0.75rem', color:'var(--text-light)', marginBottom:'1.25rem', lineHeight:1.65 }}>
                  เธเธฒเธฃเนเธชเธ”เธเธเธงเธฒเธกเธชเธเนเธเนเธกเนเธ–เธทเธญเน€เธเนเธเธเธฒเธฃเธเธนเธเธเธฑเธเธ—เธฒเธเธเธเธซเธกเธฒเธข เธเธฒเธฃเนเธญเธเธชเธดเธ—เธเธดเนเธเธฃเธดเธเธ•เนเธญเธเธ”เธณเน€เธเธดเธเธเธฒเธฃเธเนเธฒเธเธชเธณเธเธฑเธเธเธฒเธเธเธเธฒเธฃเธฑเธเธฉเนเธเธทเนเธเธ—เธตเนเน€เธ—เนเธฒเธเธฑเนเธ
                </p>

                <div style={{ display:'flex', gap:'0.75rem' }}>
                  <button
                    onClick={() => setShowInterestModal(false)}
                    className="btn btn-outline"
                    style={{ flex:1, justifyContent:'center', borderRadius:'var(--radius-md)' }}
                  >เธขเธเน€เธฅเธดเธ</button>
                  <button
                    id="confirm-interest-btn"
                    onClick={handleSendInterest}
                    className="btn btn-accent"
                    style={{ flex:2, justifyContent:'center', borderRadius:'var(--radius-md)',
                      boxShadow:'0 4px 16px rgba(212,146,10,0.35)', fontSize:'0.95rem' }}
                  >โ… เธขเธทเธเธขเธฑเธเนเธชเธ”เธเธเธงเธฒเธกเธชเธเนเธ</button>
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
                }}>โ…</div>
                <h3 style={{ color:'var(--success)', marginBottom:'0.5rem' }}>เธชเนเธเธเธงเธฒเธกเธชเธเนเธเน€เธฃเธตเธขเธเธฃเนเธญเธข!</h3>
                <p style={{ marginBottom:'0.75rem' }}>เธฃเธฐเธเธเธชเนเธเธเนเธญเธกเธนเธฅเนเธซเนเธเธนเนเธเธฃเธฐเธเธฒเธจเนเธฅเนเธง</p>
                <div style={{
                  padding:'0.75rem 1rem', background:'var(--surface-2)',
                  borderRadius:'var(--radius-md)', fontSize:'0.82rem', color:'var(--text-muted)',
                  border:'1px solid var(--border)',
                }}>
                  ๐“ เน€เธเธญเธฃเนเธ•เธดเธ”เธ•เนเธญ: <strong style={{ color:'var(--text)' }}>{listing.seller.phone.replace('x', '8')}</strong>
                  <br /><span style={{ fontSize:'0.72rem' }}>เธเธนเนเธเธฃเธฐเธเธฒเธจเธเธฐเธ•เธดเธ”เธ•เนเธญเธเธฅเธฑเธเธ เธฒเธขเนเธ 24 เธเธก.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* โ•โ•โ•โ• Fullscreen Map Modal โ•โ•โ•โ• */}
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
                  ๐—บ๏ธ เนเธเธเธ—เธตเนเธ เธฒเธเธ–เนเธฒเธขเธ—เธฒเธเธญเธฒเธเธฒเธจเนเธฅเธฐเธฃเธนเธเนเธเธฅเธเธ—เธตเนเธ”เธดเธ (เนเธซเธกเธ”เธเธขเธฒเธขเน€เธ•เนเธกเธซเธเนเธฒเธเธญ)
                </h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  {listing.title} โ€ข {listing.location.address}
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
                โ– เธเธดเธ”เนเธเธเธ—เธตเน
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
