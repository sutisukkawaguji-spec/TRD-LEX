'use client';
import { useState, useEffect } from 'react';
import { mockListings, zoneTypes, provinces } from '@/lib/mockData';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function ListingsPage() {
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedZone, setSelectedZone] = useState('ทั้งหมด');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Track currently selected property to center on the map
  const [activeProperty, setActiveProperty] = useState(null);

  const filtered = mockListings.filter(l => {
    if (search && 
        !l.title.toLowerCase().includes(search.toLowerCase()) && 
        !l.location.province.toLowerCase().includes(search.toLowerCase()) && 
        !l.location.district.toLowerCase().includes(search.toLowerCase())
    ) return false;
    if (selectedProvince && l.location.province !== selectedProvince) return false;
    if (selectedZone !== 'ทั้งหมด' && l.zoneType !== selectedZone) return false;
    if (maxPrice && l.transferPrice > Number(maxPrice) * 1000000) return false;
    return true;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.transferPrice - b.transferPrice;
    if (sortBy === 'price-desc') return b.transferPrice - a.transferPrice;
    if (sortBy === 'popular') return b.views - a.views;
    // newest (default)
    return new Date(b.listedDate) - new Date(a.listedDate);
  });

  // Automatically select the first listing as active when results change
  useEffect(() => {
    if (sorted.length > 0) {
      setActiveProperty(sorted[0]);
    } else {
      setActiveProperty(null);
    }
  }, [search, selectedProvince, selectedZone, maxPrice, sortBy]);

  const fmt = n => n.toLocaleString('th-TH');

  return (
    <>
      {/* Search Filter Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
        padding: '1.5rem 0',
        borderBottom: '3px solid var(--accent)',
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>หน้าแรก</Link>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>/</span>
            <span style={{ color: '#fff', fontSize: '0.8rem' }}>ค้นหาประกาศ</span>
          </div>
          
          {/* Quick Filter Bar */}
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            background: 'rgba(255,255,255,0.08)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Query */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <input
                id="search-input"
                className="form-input"
                type="text"
                placeholder="🔍 ค้นหาทำเล, อำเภอ, จังหวัด..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: '#fff', border: 'none', padding: '0.65rem 1rem' }}
              />
            </div>

            {/* Province */}
            <div style={{ minWidth: 150 }}>
              <select 
                id="province-select" 
                className="form-select" 
                value={selectedProvince} 
                onChange={e => setSelectedProvince(e.target.value)}
                style={{ background: '#fff', border: 'none', padding: '0.65rem 1rem' }}
              >
                <option value="">ทุกจังหวัด</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Zone Type */}
            <div style={{ minWidth: 150 }}>
              <select
                id="zone-select"
                className="form-select"
                value={selectedZone}
                onChange={e => setSelectedZone(e.target.value)}
                style={{ background: '#fff', border: 'none', padding: '0.65rem 1rem' }}
              >
                {zoneTypes.map(z => <option key={z} value={z}>{z === 'ทั้งหมด' ? 'ทุกประเภทย่าน' : z}</option>)}
              </select>
            </div>

            {/* Max Price */}
            <div style={{ width: 140 }}>
              <input
                id="max-price-input"
                className="form-input"
                type="number"
                placeholder="ราคาดสูงสุด (ล้าน)"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                style={{ background: '#fff', border: 'none', padding: '0.65rem 1rem' }}
              />
            </div>

            {/* Reset */}
            <button
              id="clear-filter-btn"
              onClick={() => { setSearch(''); setSelectedProvince(''); setSelectedZone('ทั้งหมด'); setMaxPrice(''); }}
              style={{
                padding: '0.65rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              ล้างตัวกรอง
            </button>
          </div>
        </div>
      </div>

      {/* Map-Centric Split Layout */}
      <div style={{ 
        maxWidth: 1400, 
        margin: '0 auto', 
        padding: '1.5rem',
      }}>
        
        {/* Results toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            พบสิทธิการเช่าที่ตรงตามเงื่อนไข <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>{sorted.length}</strong> รายการ
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>เรียงตาม:</span>
            <select
              id="sort-select"
              className="form-select"
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={{ width: 'auto', padding: '0.45rem 1.75rem 0.45rem 0.75rem', fontSize: '0.825rem', background: '#fff' }}
            >
              <option value="newest">ใหม่ล่าสุด</option>
              <option value="price-asc">ค่าตอบแทนต่ำ - สูง</option>
              <option value="price-desc">ค่าตอบแทนสูง - ต่ำ</option>
              <option value="popular">ยอดเข้าชมยอดนิยม</option>
            </select>
          </div>
        </div>

        {/* 40/60 Split Container */}
        <div className="listings-layout" style={{ 
          display: 'grid', 
          gridTemplateColumns: '4fr 6fr', 
          gap: '1.5rem', 
          alignItems: 'start'
        }}>
          
          {/* LEFT PANE (40%): Interactive Map */}
          <div className="listing-sidebar" style={{ 
            position: 'sticky', 
            top: '76px', 
            height: 'calc(100vh - var(--navbar-h) - 100px)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border)',
            background: '#fff'
          }}>
            {activeProperty ? (
              <MapComponent 
                lat={activeProperty.location.lat} 
                lng={activeProperty.location.lng} 
                isExpanded={false}
              />
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'var(--surface-2)',
                color: 'var(--text-light)',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</span>
                <p style={{ fontWeight: 600, margin: 0 }}>ไม่พบขอบเขตแปลงที่ดิน</p>
                <p style={{ fontSize: '0.8rem', margin: '0.25rem 0 0' }}>กรุณาปรับตัวกรองค้นหาเพื่อแสดงพิกัดที่ดินราชพัสดุ</p>
              </div>
            )}
          </div>

          {/* RIGHT PANE (60%): Property Cards */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.25rem',
            maxHeight: 'calc(100vh - var(--navbar-h) - 100px)',
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }}>
            {sorted.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff' }}>
                <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
                <h3 style={{ marginBottom: '0.5rem' }}>ไม่พบผลลัพธ์การค้นหา</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                  ขออภัย ไม่พบประกาศเปลี่ยนมือสิทธิที่ตรงตามเงื่อนไขที่คุณเลือก ลองล้างตัวกรองและค้นหาใหม่อีกครั้ง
                </p>
              </div>
            ) : (
              sorted.map(listing => {
                const isActive = activeProperty && activeProperty.id === listing.id;
                return (
                  <div
                    key={listing.id}
                    onMouseEnter={() => setActiveProperty(listing)}
                    onClick={() => setActiveProperty(listing)}
                    className="card animate-fadeUp"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      background: '#fff',
                      border: isActive ? '2px solid var(--accent)' : '1px solid var(--border)',
                      boxShadow: isActive ? 'var(--shadow-lg)' : 'var(--shadow-md)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Thumbnail / Image Area */}
                    <div style={{
                      width: '200px',
                      position: 'relative',
                      background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      color: 'rgba(255,255,255,0.15)',
                      flexShrink: 0
                    }}>
                      🏢
                      {/* Badge: ThaiD Verified (Eco Green) */}
                      {listing.verified && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: 'var(--success)', /* Eco Green */
                          color: '#fff',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}>
                          <span>✓</span> ThaiD Verified
                        </div>
                      )}

                      {/* Official Leasehold Seal */}
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'var(--accent-bright)',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        whiteSpace: 'nowrap'
                      }}>
                        🔒 สิทธิเช่าธนารักษ์
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        {/* Tags */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(30, 58, 138, 0.08)',
                            color: 'var(--primary)',
                            fontSize: '0.7rem',
                            fontWeight: 700
                          }}>{listing.zoneType}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center' }}>
                            สัญญา: {listing.contractNo}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 style={{ 
                          fontSize: '1.05rem', 
                          fontWeight: 700, 
                          marginBottom: '0.35rem', 
                          color: 'var(--text)',
                          lineHeight: 1.4
                        }}>
                          {listing.title}
                        </h3>

                        {/* Location */}
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '0 0 0.875rem' }}>
                          📍 {listing.location.district}, {listing.location.province}
                        </p>
                      </div>

                      {/* Investment details split */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '0.5rem', 
                        padding: '0.75rem', 
                        background: 'var(--surface-2)', 
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.62rem', color: 'var(--text-light)', marginBottom: '0.15rem' }}>ค่าตอบแทนโอนสิทธิ์</div>
                          {/* Value Gold Color */}
                          <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '0.95rem' }}>
                            ฿{fmt(listing.transferPrice)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.62rem', color: 'var(--text-light)', marginBottom: '0.15rem' }}>อายุสัญญาที่เหลือ</div>
                          {/* Value Gold Color */}
                          <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '0.95rem' }}>
                            {listing.leaseYearsRemaining} ปี
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.62rem', color: 'var(--text-light)', marginBottom: '0.15rem' }}>พื้นที่ใช้สอย</div>
                          <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>
                            {fmt(listing.area)} {listing.areaUnit}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                          👁️ {fmt(listing.views)} ผู้เข้าชม
                        </span>
                        
                        <Link 
                          href={`/listings/${listing.id}`} 
                          style={{ 
                            padding: '0.45rem 1rem', 
                            background: 'var(--primary)', 
                            color: '#fff', 
                            borderRadius: 'var(--radius-full)', 
                            fontSize: '0.8rem', 
                            fontWeight: 600, 
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                        >
                          เจรจาโอนสิทธิ์ →
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    </>
  );
}
