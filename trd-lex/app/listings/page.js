'use client';
import { useState } from 'react';
import { mockListings, zoneTypes, provinces } from '@/lib/mockData';

export default function ListingsPage() {
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedZone, setSelectedZone] = useState('ทั้งหมด');
  const [maxPrice, setMaxPrice] = useState('');
  const [view, setView] = useState('grid'); // 'grid' | 'map'
  const [sortBy, setSortBy] = useState('newest');

  const filtered = mockListings.filter(l => {
    if (search && !l.title.includes(search) && !l.location.province.includes(search) && !l.location.district.includes(search)) return false;
    if (selectedProvince && l.location.province !== selectedProvince) return false;
    if (selectedZone !== 'ทั้งหมด' && l.zoneType !== selectedZone) return false;
    if (maxPrice && l.transferPrice > Number(maxPrice) * 1000000) return false;
    return true;
  });

  return (
    <>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
        padding: '2.5rem 0',
      }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>หน้าแรก</a>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
            <span style={{ color: '#fff', fontSize: '0.85rem' }}>ค้นหาประกาศ</span>
          </div>
          <h1 style={{ color: '#fff', marginBottom: '0.5rem' }}>ค้นหาสิทธิการเช่าที่ราชพัสดุ</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>พบ {filtered.length} รายการ จากทั้งหมด {mockListings.length} ประกาศทั่วประเทศ</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── Sidebar Filter ── */}
          <aside>
            <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: 90 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔍 ตัวกรองการค้นหา
              </h3>

              <div className="form-group">
                <label className="form-label">คำค้นหา</label>
                <input
                  id="search-input"
                  className="form-input"
                  type="text"
                  placeholder="ชื่อทำเล, จังหวัด, เขต..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">จังหวัด</label>
                <select id="province-select" className="form-select" value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)}>
                  <option value="">ทุกจังหวัด</option>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">ประเภทย่าน</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {zoneTypes.map(z => (
                    <button
                      key={z}
                      id={`zone-${z}`}
                      onClick={() => setSelectedZone(z)}
                      style={{
                        padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-full)',
                        border: selectedZone === z ? '2px solid var(--primary-light)' : '2px solid var(--border)',
                        background: selectedZone === z ? 'rgba(37,99,235,0.08)' : 'transparent',
                        color: selectedZone === z ? 'var(--primary-light)' : 'var(--text-muted)',
                        fontSize: '0.825rem', fontWeight: selectedZone === z ? 600 : 400,
                        textAlign: 'left', cursor: 'pointer', transition: 'all var(--transition-fast)',
                      }}
                    >{z}</button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">ค่าตอบแทนสูงสุด (ล้านบาท)</label>
                <input
                  id="max-price-input"
                  className="form-input"
                  type="number"
                  placeholder="เช่น 5"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                />
              </div>

              <button
                id="clear-filter-btn"
                className="btn btn-outline w-full"
                onClick={() => { setSearch(''); setSelectedProvince(''); setSelectedZone('ทั้งหมด'); setMaxPrice(''); }}
                style={{ borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}
              >
                ล้างตัวกรอง
              </button>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div>
            {/* Toolbar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap',
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                แสดง <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> รายการ
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <select
                  id="sort-select"
                  className="form-select"
                  value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{ width: 'auto', padding: '0.5rem 0.875rem' }}
                >
                  <option value="newest">ใหม่ล่าสุด</option>
                  <option value="price-asc">ราคาต่ำ-สูง</option>
                  <option value="price-desc">ราคาสูง-ต่ำ</option>
                  <option value="popular">ยอดนิยม</option>
                </select>

                {/* View Toggle */}
                <div style={{ display: 'flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--border)' }}>
                  {[['grid', '⊞'], ['list', '≡']].map(([v, icon]) => (
                    <button
                      key={v}
                      id={`view-${v}-btn`}
                      onClick={() => setView(v)}
                      style={{
                        padding: '0.45rem 0.75rem', border: 'none',
                        background: view === v ? 'var(--primary)' : 'transparent',
                        color: view === v ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer', fontSize: '1rem', transition: 'all var(--transition-fast)',
                      }}
                    >{icon}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3>ไม่พบผลลัพธ์</h3>
                <p>ลองปรับเงื่อนไขการค้นหาใหม่</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: view === 'grid' ? 'repeat(2,1fr)' : '1fr',
                gap: '1.25rem',
              }}>
                {filtered.map(listing => (
                  <ListingCardCompact key={listing.id} listing={listing} viewMode={view} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ListingCardCompact({ listing, viewMode }) {
  const fmt = n => n.toLocaleString('th-TH');

  if (viewMode === 'list') {
    return (
      <a href={`/listings/${listing.id}`} style={{ textDecoration: 'none' }}>
        <div className="card" style={{
          display: 'flex', gap: '1.25rem', padding: '1.25rem',
          flexDirection: 'row', alignItems: 'stretch',
        }}>
          {/* Thumbnail */}
          <div style={{
            width: 120, flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem',
          }}>🏢</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{
                padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)',
                background: 'rgba(37,99,235,0.08)', color: 'var(--primary-light)',
                fontSize: '0.7rem', fontWeight: 600,
              }}>{listing.zoneType}</span>
              {listing.verified && (
                <span style={{
                  padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)',
                  background: 'rgba(16,185,129,0.1)', color: 'var(--success)',
                  fontSize: '0.7rem', fontWeight: 600,
                }}>✓ ยืนยันแล้ว</span>
              )}
            </div>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>{listing.title}</h3>
            <p style={{ fontSize: '0.8rem', margin: '0 0 0.75rem' }}>📍 {listing.location.district}, {listing.location.province}</p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div><span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>ค่าตอบแทน</span><br />
                <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>฿{fmt(listing.transferPrice)}</strong></div>
              <div><span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>พื้นที่</span><br />
                <strong style={{ fontSize: '0.95rem' }}>{fmt(listing.area)} ตร.ม.</strong></div>
              <div><span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>สัญญาคงเหลือ</span><br />
                <strong style={{ fontSize: '0.95rem' }}>{listing.leaseYearsRemaining} ปี</strong></div>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={`/listings/${listing.id}`} style={{ textDecoration: 'none' }}>
      <div className="card">
        <div style={{
          height: 160, background: 'linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)',
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem',
        }}>
          🏢
          {listing.verified && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)',
              background: 'rgba(16,185,129,0.9)', fontSize: '0.65rem', fontWeight: 700, color: '#fff',
            }}>✓ ยืนยันแล้ว</div>
          )}
          <div style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            padding: '0.15rem 0.6rem', borderRadius: 'var(--radius-full)',
            background: 'rgba(0,0,0,0.6)', fontSize: '0.6rem', color: '#fbbf24', fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>🔒 สิทธิการเช่า</div>
        </div>
        <div style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '0.875rem', marginBottom: '0.35rem', lineHeight: 1.4 }}>{listing.title}</h3>
          <p style={{ fontSize: '0.75rem', margin: '0 0 0.75rem' }}>📍 {listing.location.district}, {listing.location.province}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>ค่าตอบแทนโอนสิทธิ</div>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>฿{fmt(listing.transferPrice)}</div>
            </div>
            <span style={{
              padding: '0.25rem 0.65rem', background: 'var(--primary)', color: '#fff',
              borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600,
            }}>ดูรายละเอียด</span>
          </div>
        </div>
      </div>
    </a>
  );
}
