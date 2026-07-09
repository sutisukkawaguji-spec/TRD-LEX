'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/utils';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

const STEPS = [
  { id: 1, label: 'ยืนยันตัวตน', icon: '🔐' },
  { id: 2, label: 'เลือกสัญญาเช่า', icon: '📋' },
  { id: 3, label: 'ข้อมูล & ตำแหน่ง', icon: '🏢' },
  { id: 4, label: 'ราคา & ยินยอม', icon: '💰' },
];

const MY_CONTRACTS = [
  {
    contractNo: "สธ.กท.60/2558",
    title: "พื้นที่พาณิชยกรรม ย่านบางรัก ติดถนนสีลม",
    province: "กรุงเทพมหานคร",
    district: "บางรัก",
    subdistrict: "สีลม",
    address: "ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร",
    area: 240,
    zoneType: "พาณิชยกรรม",
    leaseYearsRemaining: 18,
    leaseExpiryYear: 2044,
    monthlyRent: 28000,
    lat: 13.7246,
    lng: 100.5296,
    propertyType: "building",
    floors: "2",
    roomsDetail: "4 ห้องทำงาน 2 ห้องน้ำ",
    buildingCondition: "good",
    buildingArea: "220",
    initialUtilities: ["pea", "pwa", "ais", "true", "drainage", "light"]
  },
  {
    contractNo: "สธ.ชม.12/2562",
    title: "ที่ดินเกษตรกรรม จ.เชียงใหม่ อ.แม่ริม",
    province: "เชียงใหม่",
    district: "แม่ริม",
    subdistrict: "ริมใต้",
    address: "ต.ริมใต้ อ.แม่ริม จ.เชียงใหม่",
    area: 3200,
    zoneType: "เกษตรกรรม",
    leaseYearsRemaining: 24,
    leaseExpiryYear: 2050,
    monthlyRent: 4500,
    lat: 18.8893,
    lng: 98.9442,
    propertyType: "agricultural",
    irrigation: "yes",
    soilType: "ดินร่วนปนเหนียว",
    soilFertility: "high",
    crops: "สวนผสมมะม่วงและลำไย",
    initialUtilities: ["pea", "pwa", "ais"]
  },
  {
    contractNo: "สธ.สข.05/2563",
    title: "ที่ดินว่างเปล่าติดชายหาด จ.สงขลา อ.สิงหนคร",
    province: "สงขลา",
    district: "สิงหนคร",
    subdistrict: "ชิงโค",
    address: "ต.ชิงโค อ.สิงหนคร จ.สงขลา",
    area: 1600,
    zoneType: "ท่องเที่ยวและพักผ่อน",
    leaseYearsRemaining: 12,
    leaseExpiryYear: 2038,
    monthlyRent: 8500,
    lat: 7.2136,
    lng: 100.5972,
    propertyType: "vacant",
    landFilled: "yes",
    roadWidth: "8",
    depth: "40",
    accessRoadType: "ถนนคอนกรีตสาธารณะ",
    initialUtilities: ["pea", "pwa", "true", "light"]
  }
];

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [authDone, setAuthDone] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [expandedContractNo, setExpandedContractNo] = useState(null);
  
  // Coordinates for previewing location confirmation map
  const [mapCoords, setMapCoords] = useState({ lat: 13.7246, lng: 100.5296 });
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  
  const [form, setForm] = useState({
    title: '', province: '', district: '', area: '', zoneType: '', description: '', price: '',
    propertyType: '',
    utilities: [], // array of selected utility keys e.g. ["pea", "pwa", "ais", "true"]
    
    // Building specific
    floors: '',
    roomsDetail: '',
    buildingCondition: '',
    buildingArea: '',
    
    // Vacant specific
    landFilled: '',
    roadWidth: '',
    depth: '',
    accessRoadType: '',
    
    // Residential specific
    maxOccupants: '',
    communityStyle: '',
    mainRoadDist: '',
    hasDrainage: false,
    hasStreetLight: false,
    
    // Agricultural specific
    irrigation: '',
    soilType: '',
    soilFertility: '',
    crops: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [acceptLegal, setAcceptLegal] = useState(false);

  // When a tenant selects one of their contracts, we pre-populate and proceed
  const handleSelectContract = (contract) => {
    setSelectedContract(contract);
    setMapCoords({ lat: contract.lat, lng: contract.lng });
    setLocationConfirmed(false); // Reset confirmation on contract change

    // Pre-populate mock images
    if (contract.contractNo === "สธ.กท.60/2558") {
      setUploadedImages(['/demo-listing-01.jpg', '/hero-01.jpg']);
    } else if (contract.contractNo === "สธ.ชม.12/2562") {
      setUploadedImages(['/hero-02.jpg']);
    } else if (contract.contractNo === "สธ.สข.05/2563") {
      setUploadedImages(['/hero-03.jpg']);
    } else {
      setUploadedImages([]);
    }
    
    setForm({
      title: `เสนอโอนสิทธิ์สัญญาเช่าเลขที่ ${contract.contractNo} (${contract.district})`,
      province: contract.province,
      district: contract.district,
      area: contract.area,
      zoneType: contract.zoneType,
      description: contract.title + " ดำเนินการโอนเปลี่ยนสิทธิ์สัญญาราชพัสดุอย่างถูกต้องตามระเบียบ",
      price: '',
      propertyType: contract.propertyType,
      utilities: contract.initialUtilities || [],
      
      // Building specific
      floors: contract.floors || '',
      roomsDetail: contract.roomsDetail || '',
      buildingCondition: contract.buildingCondition || '',
      buildingArea: contract.buildingArea || '',
      
      // Vacant specific
      landFilled: contract.landFilled || '',
      roadWidth: contract.roadWidth || '',
      depth: contract.depth || '',
      accessRoadType: contract.accessRoadType || '',
      
      // Residential specific
      maxOccupants: '',
      communityStyle: '',
      mainRoadDist: '',
      hasDrainage: false,
      hasStreetLight: false,
      
      // Agricultural specific
      irrigation: contract.irrigation || '',
      soilType: contract.soilType || '',
      soilFertility: contract.soilFertility || '',
      crops: contract.crops || '',
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...newUrls]);
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleUtility = (key) => {
    setForm(prev => {
      const alreadyHas = prev.utilities.includes(key);
      const updated = alreadyHas 
        ? prev.utilities.filter(u => u !== key)
        : [...prev.utilities, key];
      return { ...prev, utilities: updated };
    });
  };

  const handleSubmit = () => {
    if (acceptLegal) {
      setSubmitted(true);
    }
  };

  const fmt = n => n ? Number(n).toLocaleString('th-TH') : '0';

  // Math simulation for rental rate estimation
  const getEstimatedNewRent = () => {
    if (!selectedContract) return 0;
    // Estimate +15% based on standard Treasury rate revision for transfers
    return Math.round(selectedContract.monthlyRent * 1.15);
  };

  const getEstimatedTransferFee = () => {
    if (!selectedContract) return 0;
    // Transfer fee is roughly 2% of transfer price + processing fees
    const priceVal = Number(form.price) || 0;
    return Math.round((priceVal * 0.02) + 5000);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 520, padding: '2rem' }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '1.25rem' }}>🎉</div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--success)' }}>ส่งประกาศตรวจสอบสำเร็จ!</h2>
          <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
            ประกาศเสนอโอนสิทธิการเช่าของท่านได้รับการบันทึกแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบข้อมูลแปลงที่ดิน พิกัด และเอกสารสิทธิ์กับทะเบียนราษฎร์ธนารักษ์ 
            ผลการตรวจสอบจะส่งแจ้งเตือนผ่านช่องทาง <strong>ThaiD</strong> ภายใน 1-3 วันทำการ
          </p>
          <div style={{
            padding: '1.25rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', marginBottom: '2.25rem',
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              🔢 หมายเลขอ้างอิงราชการ: <strong style={{ color: 'var(--primary)' }}>TRD-TX-{Math.floor(Math.random()*90000)+10000}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/listings" className="btn btn-primary">ดูประกาศตลาดกลาง</Link>
            <Link href="/" className="btn btn-outline">กลับหน้าแรก</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', padding: '2.5rem 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', marginBottom: '0.5rem' }}>📝 ลงประกาศโอนสิทธิการเช่าที่ราชพัสดุ</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            ยื่นคำขอโอนสิทธิ์และโฆษณาหาผู้เช่ารายใหม่ผ่านระบบบริการทะเบียนกลาง กรมธนารักษ์
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: 840 }}>
        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: step > s.id ? '1rem' : '1.1rem',
                  background: step > s.id ? 'var(--success)' : step === s.id ? 'var(--primary-light)' : 'var(--border)',
                  color: step >= s.id ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700, transition: 'all var(--transition)',
                  boxShadow: step === s.id ? '0 0 0 4px rgba(37,99,235,0.2)' : 'none',
                }}>
                  {step > s.id ? '✓' : s.icon}
                </div>
                <span style={{ fontSize: '0.73rem', fontWeight: 600, color: step >= s.id ? 'var(--primary)' : 'var(--text-light)', whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, margin: '0 0.5rem', marginBottom: '1.2rem',
                  background: step > s.id ? 'var(--success)' : 'var(--border)',
                  transition: 'background var(--transition)',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: ThaiD Authentication ── */}
        {step === 1 && (
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
              <h2>ยืนยันตัวตนดิจิทัลผู้เช่าราชพัสดุ</h2>
              <p>กรุณายืนยันตัวตนผ่านแอปพลิเคชัน ThaiD เพื่อเข้าถึงข้อมูลสัญญาเช่าในฐานข้อมูลทะเบียนกลาง</p>
            </div>

            {!authDone ? (
              <div>
                {/* ThaiD Mock */}
                <div style={{
                  background: 'linear-gradient(135deg, #1a237e, #283593)',
                  borderRadius: 'var(--radius-lg)', padding: '2.25rem',
                  textAlign: 'center', marginBottom: '1.5rem',
                  border: '2px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{
                      width: 76, height: 76, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1565c0, #1976d2)',
                      margin: '0 auto 1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 0 24px rgba(25,118,210,0.5)',
                    }}>
                      <span style={{ fontSize: '2.2rem' }}>🇹🇭</span>
                    </div>
                    <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.25rem' }}>ThaiD</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: 0 }}>
                      แอปพลิเคชันยืนยันตัวตนอิเล็กทรอนิกส์<br />กรมการปกครอง กระทรวงมหาดไทย
                    </p>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>
                      แอปพลิเคชัน TRD-LEX ขอเชื่อมโยงสิทธิ์:
                    </p>
                    <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: 0 }}>
                      {['ตรวจสอบเลขบัตรประชาชน', 'ตรวจสอบชื่อ-นามสกุล', 'ดึงข้อมูลทะเบียนสัญญาเช่าราชพัสดุ'].map(item => (
                        <li key={item} style={{ color: '#a5f3fc', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                          <span>✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    id="thaid-login-btn"
                    onClick={() => { setAuthDone(true); }}
                    style={{
                      width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                      color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none',
                      cursor: 'pointer', boxShadow: '0 4px 16px rgba(25,118,210,0.4)',
                      transition: 'all var(--transition)',
                    }}
                  >
                    🔐 ดำเนินการเข้าสู่ระบบผ่าน ThaiD
                  </button>
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ต้องการลงทะเบียนยืนยันตัวตน?{' '}
                  <a href="https://thaid.bora.dopa.go.th" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
                    คู่มือดาวน์โหลดแอปพลิเคชัน ThaiD →
                  </a>
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(16,185,129,0.1)', border: '3px solid var(--success)',
                  margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem',
                }}>✓</div>
                <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>ยืนยันสิทธิ์ผู้เช่าสำเร็จ</h3>
                <p style={{ marginBottom: '0.5rem' }}>ข้อมูลประจำตัวผู้ถือครองสัญญาราชพัสดุ</p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1.25rem', background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-full)', border: '1px solid var(--border)',
                  fontSize: '0.9rem', marginBottom: '1.75rem',
                }}>
                  <span>🇹🇭</span>
                  <span style={{ fontWeight: 700 }}>นายสมชาย ทดสอบ</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>[ ตรวจสอบสิทธิ์แล้ว ]</span>
                </div>
                <br />
                <button id="next-step-1-btn" className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
                  ถัดไป: เลือกสัญญาเช่าของคุณ →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Select Tenant's Lease Contracts ── */}
        {step === 2 && (
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
              <h2 style={{ marginBottom: '0.5rem' }}>รายการสัญญาเช่าที่ราชพัสดุของคุณ</h2>
              <p style={{ margin: 0 }}>
                ตรวจพบสัญญาเช่าที่ราชพัสดุที่ผูกกับรหัสประจำตัวของท่านจำนวน <strong>{MY_CONTRACTS.length} รายการ</strong> กรุณาเลือกสัญญาที่ต้องการนำเสนอโอนสิทธิ์
              </p>
            </div>

            {/* List of Contracts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              {MY_CONTRACTS.map((contract) => {
                const isSelected = selectedContract?.contractNo === contract.contractNo;
                const isExpanded = expandedContractNo === contract.contractNo;

                return (
                  <div
                    key={contract.contractNo}
                    style={{
                      border: isSelected ? '2px solid #0d8c5c' : '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      background: isSelected ? 'rgba(13,140,92,0.02)' : '#fff',
                      transition: 'all 0.2s ease',
                      overflow: 'hidden',
                      boxShadow: isSelected ? '0 4px 15px rgba(13,140,92,0.1)' : '0 2px 5px rgba(0,0,0,0.02)'
                    }}
                  >
                    {/* Header bar of contract card */}
                    <div style={{
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSelectContract(contract)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: isSelected ? '#0d8c5c' : 'var(--surface-2)',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        }}>
                          {contract.propertyType === 'building' ? '🏢' : contract.propertyType === 'agricultural' ? '🌾' : '🏜️'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>สัญญาเลขที่: {contract.contractNo}</span>
                            {isSelected && <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.67rem' }}>✓ เลือกอยู่</span>}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            📍 {contract.subdistrict}, {contract.district}, {contract.province}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{
                            padding: '0.35rem 0.75rem', fontSize: '0.78rem', height: 'auto',
                            borderColor: isExpanded ? 'var(--primary)' : 'var(--border)'
                          }}
                          onClick={() => setExpandedContractNo(isExpanded ? null : contract.contractNo)}
                        >
                          {isExpanded ? '▲ ซ่อนรายละเอียด' : '🔍 รายละเอียดสัญญา'}
                        </button>
                        
                        <button
                          type="button"
                          style={{
                            padding: '0.45rem 1rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)',
                            background: isSelected ? '#0d8c5c' : 'var(--primary)',
                            color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                          }}
                          onClick={() => {
                            handleSelectContract(contract);
                            setStep(3);
                          }}
                        >
                          โอนสิทธิ์สัญญานี้
                        </button>
                      </div>
                    </div>

                    {/* Official expanded details drawer from Treasury registry */}
                    {isExpanded && (
                      <div style={{ padding: '1.25rem', background: 'var(--surface-2)', fontSize: '0.82rem', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '1.1rem' }}>🏛️</span>
                          <strong style={{ color: 'var(--primary)' }}>ข้อมูลทะเบียนจดทะเบียน กรมธนารักษ์ (ระบบเรียลไทม์)</strong>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div><strong>ผู้เช่าถือครอง:</strong> นายสมชาย ทดสอบ</div>
                          <div><strong>ประเภทสัญญาเช่า:</strong> เช่าจัดหาประโยชน์ (ประเภท {contract.propertyType === 'building' ? 'อาคารสิ่งปลูกสร้าง' : contract.propertyType === 'agricultural' ? 'เกษตรกรรม' : 'ที่ดินว่างเปล่า'})</div>
                          <div><strong>พื้นที่ระบุตามสัญญา:</strong> {fmt(contract.area)} ตารางเมตร</div>
                          <div><strong>ย่านผังเมืองตามสี:</strong> โซน{contract.zoneType}</div>
                          <div><strong>วันเริ่มต้นสัญญาเช่า:</strong> 1 ตุลาคม {contract.leaseExpiryYear - 30}</div>
                          <div><strong>วันสิ้นสุดสัญญาเช่า:</strong> 30 กันยายน {contract.leaseExpiryYear} (คงเหลือ {contract.leaseYearsRemaining} ปี)</div>
                          <div><strong>อัตราค่าเช่ารายเดือนปัจจุบัน:</strong> ฿{fmt(contract.monthlyRent)} บาท/เดือน</div>
                          <div><strong>สถานะชำระค่าธรรมเนียม:</strong> 🟢 ปกติ (ไม่มีหนี้สินค้างชำระกับกองคลังกรมธนารักษ์)</div>
                        </div>
                        <div style={{
                          marginTop: '0.75rem', padding: '0.5rem 0.85rem', background: '#fff', borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                          <span style={{ fontSize: '1rem' }}>📍</span>
                          <span><strong>พิกัดขอบเขตกรมที่ดิน:</strong> ละติจูด {contract.lat}, ลองจิจูด {contract.lng} (อิงตามหมุดหลักเขตราชพัสดุ)</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <button id="back-step-2-btn" className="btn btn-outline" onClick={() => setStep(1)}>← ย้อนกลับ</button>
              <button
                id="next-step-2-btn"
                className="btn btn-primary"
                onClick={() => setStep(3)}
                disabled={!selectedContract}
                style={{ opacity: selectedContract ? 1 : 0.4 }}
              >
                ถัดไป: ข้อมูลรายละเอียด & ยืนยันตำแหน่ง →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Property Details, Utilities & Map Confirmation ── */}
        {step === 3 && selectedContract && (
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏢</div>
              <h2 style={{ marginBottom: '0.5rem' }}>กรอกรายละเอียด & ยืนยันตำแหน่งแปลงที่ดิน</h2>
              <p>ระบุสิ่งอำนวยความสะดวกสาธารณูปโภค รายละเอียดประกาศ และตรวจสอบพิกัดราชพัสดุจริง</p>
            </div>

            {/* 📋 Official Information (Read Only from Treasury Database) */}
            <div style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem'
            }}>
              <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800 }}>
                📋 ข้อมูลสำคัญราชการ (สัญญาสิทธิ์: {selectedContract.contractNo})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.82rem' }}>
                <div><strong>ขนาดพื้นที่:</strong> {fmt(form.area)} ตร.ม.</div>
                <div><strong>เขต/อำเภอ:</strong> {form.district} ({form.province})</div>
                <div><strong>ผังเมืองย่าน:</strong> {form.zoneType}</div>
              </div>
            </div>

            {/* 📝 T&C Interactive Utilities Grid */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ fontWeight: 800 }}>⚡ เลือกติ๊กสาธารณูปโภคที่ให้บริการปัจจุบัน:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                  { id: 'pea', label: 'การไฟฟ้า (MEA/PEA)', logo: '/logo-pea-circle.png', color: '#7b1fa2' },
                  { id: 'pwa', label: 'การประปา (MWA/PWA)', logo: '/logo-pwa-circle.png', color: '#0288d1' },
                  { id: 'ais', label: 'อินเทอร์เน็ต AIS Fibre', logo: '/logo-ais.png', color: '#8bc34a' },
                  { id: 'true', label: 'อินเทอร์เน็ต True Online', logo: '/logo-true.png', color: '#d32f2f' },
                  { id: 'drainage', label: 'ท่อระบายน้ำทิ้ง', icon: '🛣️', color: '#555555' },
                  { id: 'light', label: 'เสาไฟทางหลวงส่องสว่าง', icon: '💡', color: '#fbc02d' },
                ].map(util => {
                  const isChecked = form.utilities.includes(util.id);
                  return (
                    <button
                      key={util.id}
                      type="button"
                      onClick={() => toggleUtility(util.id)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: isChecked ? '2.5px solid #0d8c5c' : '1.5px solid var(--border)',
                        background: isChecked ? 'rgba(13, 140, 92, 0.05)' : '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {util.logo ? (
                        <div style={{ position: 'relative', width: 24, height: 24, borderRadius: '50%', overflow: 'hidden' }}>
                          <Image src={getAssetUrl(util.logo)} alt={util.label} fill style={{ objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <span style={{ fontSize: '1.2rem' }}>{util.icon}</span>
                      )}
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: isChecked ? 700 : 500,
                        color: isChecked ? '#0d8c5c' : 'var(--text-muted)',
                        textAlign: 'left',
                        lineHeight: 1.2
                      }}>
                        {util.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 📝 Listing Title & Details input */}
            <div className="form-group">
              <label className="form-label" htmlFor="listing-title">หัวข้อประกาศให้พรีเซนต์ความน่าสนใจ <span className="required">*</span></label>
              <input
                id="listing-title"
                className="form-input"
                placeholder="เช่น ทำเลติดถนนสีลม ใกล้รถไฟฟ้า เหมาะสำหรับการพาณิชย์"
                value={form.title}
                onChange={e => handleFormChange('title', e.target.value)}
              />
            </div>

            {/* 🏢 Category Form Sections */}
            {form.propertyType === 'building' && (
              <div style={{
                background: 'rgba(212, 146, 10, 0.03)', border: '1px solid rgba(212, 146, 10, 0.2)',
                borderLeft: '5px solid var(--accent)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem'
              }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700 }}>🏢 คุณสมบัติของอาคาร / สิ่งปลูกสร้างเพิ่มเติม:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="floors">จำนวนชั้น</label>
                    <input id="floors" className="form-input" type="number" placeholder="เช่น 2" value={form.floors} onChange={e => handleFormChange('floors', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="buildingArea">พื้นที่ใช้สอยภายใน (ตร.ม.)</label>
                    <input id="buildingArea" className="form-input" type="number" placeholder="เช่น 220" value={form.buildingArea} onChange={e => handleFormChange('buildingArea', e.target.value)} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="roomsDetail">รายละเอียดห้องภายใน</label>
                  <input id="roomsDetail" className="form-input" placeholder="เช่น 4 ห้องทำงาน 2 ห้องน้ำ" value={form.roomsDetail} onChange={e => handleFormChange('roomsDetail', e.target.value)} />
                </div>
              </div>
            )}

            {form.propertyType === 'vacant' && (
              <div style={{
                background: 'rgba(120, 53, 4, 0.03)', border: '1px solid rgba(120, 53, 4, 0.2)',
                borderLeft: '5px solid #78350f', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem'
              }}>
                <h4 style={{ color: '#78350f', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700 }}>🏜️ สภาพที่ดินว่างเปล่าเพิ่มเติม:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="landFilled">การปรับระดับที่ดิน</label>
                    <select id="landFilled" className="form-select" value={form.landFilled} onChange={e => handleFormChange('landFilled', e.target.value)}>
                      <option value="">-- เลือกสภาพดิน --</option>
                      <option value="yes">✓ ถมที่ดินแล้วเสมอถนน</option>
                      <option value="no">✗ ยังไม่ถมที่ดิน</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="accessRoadType">ประเภทถนนทางเข้าออก</label>
                    <input id="accessRoadType" className="form-input" placeholder="เช่น ถนนคอนกรีตสาธารณะ" value={form.accessRoadType} onChange={e => handleFormChange('accessRoadType', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {form.propertyType === 'agricultural' && (
              <div style={{
                background: 'rgba(22, 163, 74, 0.03)', border: '1px solid rgba(22, 163, 74, 0.2)',
                borderLeft: '5px solid #16a34a', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem'
              }}>
                <h4 style={{ color: '#16a34a', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700 }}>🌾 สภาพการเกษตรเพิ่มเติม:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="irrigation">ระบบแหล่งน้ำชลประทาน</label>
                    <select id="irrigation" className="form-select" value={form.irrigation} onChange={e => handleFormChange('irrigation', e.target.value)}>
                      <option value="">-- เลือกชลประทาน --</option>
                      <option value="yes">✓ มีชลประทานหลัก</option>
                      <option value="no">✗ ไม่มีระบบชลประทาน</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="soilType">ประเภทของดิน</label>
                    <input id="soilType" className="form-input" placeholder="เช่น ดินร่วนปนเหนียว" value={form.soilType} onChange={e => handleFormChange('soilType', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="listing-desc">คำอธิบายรายละเอียดเพิ่มเติมที่น่าสนใจ</label>
              <textarea
                id="listing-desc"
                className="form-textarea"
                placeholder="ระบุความน่าสนใจของทำเล อัตราค่าสัญญายาวนาน หรือสิทธิตามกฎหมายที่โอนให้ครบถ้วน..."
                value={form.description}
                onChange={e => handleFormChange('description', e.target.value)}
              />
            </div>

            {/* 📷 Image Upload Section */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ fontWeight: 800 }}>📷 อัปโหลดรูปภาพแปลงที่ดิน/อาคาร และรูปถ่ายทางอากาศ (ระเบียบกรมธนารักษ์) <span className="required">*</span></label>
              
              <div 
                onClick={() => document.getElementById('image-upload-input').click()}
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'var(--surface-2)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#f0f4ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-2)'; }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>📸</div>
                <p style={{ fontWeight: 700, margin: '0 0 0.25rem', color: 'var(--text)' }}>คลิกเพื่ออัปโหลดรูปภาพ</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: 0 }}>JPG, PNG ขนาดสูงสุด 5MB ต่อรูป (อัปโหลดรูปจริง โฉนด หรือภาพถ่ายทางอากาศ)</p>
                <input 
                  id="image-upload-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Grid of Thumbnails */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {uploadedImages.map((img, idx) => (
                  <div 
                    key={idx}
                    style={{
                      width: 90,
                      height: 90,
                      position: 'relative',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                  >
                    <img 
                      src={getAssetUrl(img)} 
                      alt="preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: 'rgba(239, 68, 68, 0.95)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {uploadedImages.length === 0 && (
                  <div style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.03)',
                    border: '1px dashed rgba(239, 68, 68, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--danger)',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    fontWeight: 600
                  }}>
                    ⚠️ ต้องมีไฟล์ภาพถ่ายอย่างน้อย 1 ภาพเพื่อใช้เป็นหลักฐานประกอบคำขอโอนสิทธิ์
                  </div>
                )}
              </div>
            </div>

            {/* 📍 Location Confirmation Map */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ fontWeight: 800 }}>📍 ยืนยันพิกัดและขอบเขตแปลงที่ดินจากฐานข้อมูลกรมธนารักษ์:</label>
              <div style={{ height: 260, position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '0.875rem' }}>
                <MapComponent
                  lat={mapCoords.lat}
                  lng={mapCoords.lng}
                  title={selectedContract.title}
                />
              </div>
              <div style={{
                background: 'rgba(212,146,10,0.06)', border: '1px solid rgba(212,146,10,0.15)',
                borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
              }}>
                <input
                  id="confirm-location-checkbox"
                  type="checkbox"
                  checked={locationConfirmed}
                  onChange={e => setLocationConfirmed(e.target.checked)}
                  style={{ marginTop: '0.2rem', cursor: 'pointer' }}
                />
                <label htmlFor="confirm-location-checkbox" style={{ fontSize: '0.82rem', color: 'var(--text)', cursor: 'pointer', lineHeight: 1.4, fontWeight: 600 }}>
                  ฉันขอยืนยันว่าขอบเขตและตำแหน่งแปลงพิกัด (ละติจูด {mapCoords.lat}, ลองจิจูด {mapCoords.lng}) ที่ปรากฏในแผนที่ ตรงตามความเป็นจริงของสัญญาเช่าราชพัสดุและที่ดินในครอบครอง
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <button id="back-step-3-btn" className="btn btn-outline" onClick={() => setStep(2)}>← ย้อนกลับ</button>
              <button
                id="next-step-3-btn"
                className="btn btn-primary"
                onClick={() => setStep(4)}
                disabled={!form.title || !locationConfirmed || uploadedImages.length === 0}
                style={{ opacity: (form.title && locationConfirmed && uploadedImages.length > 0) ? 1 : 0.4 }}
              >
                ถัดไป: ตั้งราคา & ยืนยอมทางกฎหมาย →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Price, Legal Warnings & Submission ── */}
        {step === 4 && selectedContract && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2.5rem' }}>
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💰</div>
                <h2 style={{ marginBottom: '0.5rem' }}>ระบุค่าตอบแทนโอนสิทธิ์ & อนุมัติกฎหมาย</h2>
                <p>กำหนดมูลค่าโอนสิทธิสัญญา และตรวจสอบอัตราประเมินราชการเพื่อความโปร่งใส</p>
              </div>

              {/* Price input */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="listing-price">ค่าตอบแทนเสนอโอนสิทธิการเช่า (บาท) <span className="required">*</span></label>
                <input
                  id="listing-price"
                  className="form-input"
                  type="number"
                  placeholder="เช่น 1500000"
                  value={form.price}
                  onChange={e => handleFormChange('price', e.target.value)}
                  style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                />
                {form.price && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 700, marginTop: '0.35rem' }}>
                    💵 เสนอโอนสิทธิ์มูลค่า: ฿{fmt(form.price)} บาท
                  </p>
                )}
              </div>

              {/* 📊 Government Rate Estimations */}
              <div style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem'
              }}>
                <h4 style={{ margin: '0 0 0.875rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800 }}>
                  📊 การประมาณการอัตราค่าเช่าฉบับใหม่และค่าธรรมเนียมเบื้องต้น:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>อัตราค่าเช่าเดิม (เดิมตามสัญญา):</span>
                    <strong style={{ color: 'var(--text-light)' }}>฿{fmt(selectedContract.monthlyRent)} / เดือน</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.5rem' }}>
                    <span>อัตราค่าเช่าประมาณการใหม่หลังโอนเปลี่ยนชื่อ:</span>
                    <strong style={{ color: 'var(--primary-light)', fontSize: '0.9rem' }}>฿{fmt(getEstimatedNewRent())} / เดือน*</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>ค่าธรรมเนียมการโอนสิทธิ์ประมาณการราชการ:</span>
                    <strong style={{ color: 'var(--accent)' }}>฿{fmt(getEstimatedTransferFee())} บาท*</strong>
                  </div>
                </div>

                {/* ⚠️ CRITICAL WARNING BANNER */}
                <div style={{
                  padding: '1rem', background: '#fffbeb', border: '1px solid #fef3c7', borderLeft: '5px solid #d97706',
                  borderRadius: 'var(--radius-md)', color: '#92400e', fontSize: '0.78rem', lineHeight: 1.6
                }}>
                  <strong>⚠️ คำชี้แจงสำคัญ: การประเมินราคาด้านการเช่าราชการนี้เป็นเพียงการประมาณการเท่านั้น</strong><br />
                  ตัวเลขอัตราค่าเช่าใหม่และค่าธรรมเนียมที่แสดงเป็นผลลัพธ์คำนวณเบื้องต้นอ้างอิงจากเกณฑ์ทั่วไป อัตราสิ้นสุดที่แท้จริงของการโอนสิทธิเช่าที่ราชพัสดุจะต้องได้รับการตรวจสอบประเมินราคาที่ดินแบบรายหมุดแปลงพิกัดจริง ณ สำนักงานธนารักษ์พื้นที่ในวันจัดทำคำขอเป็นทางการ
                </div>
              </div>

              {/* ⚖️ Legal terms and conditions agreement */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.75rem'
              }}>
                <h4 style={{ color: 'var(--danger)', margin: '0 0 0.75rem', fontSize: '0.85rem', fontWeight: 800 }}>
                  ⚖️ ข้อความยินยอม สิทธิทางกฎหมาย และคำตักเตือนกรมธนารักษ์:
                </h4>
                <div style={{
                  fontSize: '0.76rem', lineHeight: 1.6, color: 'var(--text-muted)',
                  maxHeight: 140, overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1rem'
                }}>
                  ๑. ข้าพเจ้าขอรับรองและยินยอมให้กรมธนารักษ์และผู้พัฒนาระบบ ดึงข้อมูลและตรวจสอบรายละเอียดสัญญาราชพัสดุจากระบบฐานข้อมูลกลางเพื่อเผยแพร่เป็นตลาดรองโอนสิทธิเช่า<br />
                  ๒. ข้าพเจ้ารับทราบว่าที่ดินราชพัสดุเป็นของแผ่นดิน <strong>ไม่สามารถทำการซื้อขายกรรมสิทธิ์ขาดได้</strong> การดำเนินการนี้เป็นเพียงการยื่นเสนอขอโอนสิทธิ์สัญญาการเช่าเปลี่ยนตัวผู้เช่าเท่านั้น<br />
                  ๓. การกรอกข้อมูลเท็จ ปิดบังข้อยกเว้นทางกฎหมายของแปลง หรือพิกัดไม่ตรงกับสภาพการครอบครองจริง มีโทษปรับและเพิกถอนสัญญาเช่าตามพระราชบัญญัติที่ราชพัสดุ พ.ศ. ๒๕๖๒ และประมวลกฎหมายอาญา<br />
                  ๔. ผู้โอนสิทธิ์และผู้รับโอนสิทธิ์มีหน้าที่ในการชำระค่าธรรมเนียมตามกฎกระทรวงและระเบียบกระทรวงการคลัง ณ สำนักงานธนารักษ์เขตพื้นที่ตามขั้นตอนกฎหมายกำหนด
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <input
                    id="accept-legal-checkbox"
                    type="checkbox"
                    checked={acceptLegal}
                    onChange={e => setAcceptLegal(e.target.checked)}
                    style={{ marginTop: '0.2rem', cursor: 'pointer' }}
                  />
                  <label htmlFor="accept-legal-checkbox" style={{ fontSize: '0.82rem', color: 'var(--text)', cursor: 'pointer', lineHeight: 1.4, fontWeight: 700 }}>
                    ข้าพเจ้ายอมรับข้อกำหนดทางกฎหมายข้างต้น และรับทราบว่าการประมาณการอัตราค่าเช่าเป็นเพียงการประมาณการเบื้องต้นเท่านั้น
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                <button id="back-step-4-btn" className="btn btn-outline" onClick={() => setStep(3)}>← ย้อนกลับ</button>
                <button
                  id="submit-listing-btn"
                  className="btn btn-accent btn-lg"
                  onClick={handleSubmit}
                  disabled={!form.price || !acceptLegal}
                  style={{ opacity: (form.price && acceptLegal) ? 1 : 0.4 }}
                >
                  ✅ ยอมรับเงื่อนไขและส่งลงประกาศโอนสิทธิ์
                </button>
              </div>
            </div>

            {/* Preview Card */}
            {form.price && (
              <div className="card" style={{ padding: '1.75rem', border: '2px solid var(--primary-light)', background: '#fff' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '1rem' }}>👁️ ตัวอย่างพรีวิวใบประกาศโอนสิทธิ์เช่า (TRD-LEX):</h3>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <div style={{
                    width: 80, height: 80, flexShrink: 0, borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem',
                    color: '#fff',
                  }}>
                    {form.propertyType === 'building' ? '🏢' : form.propertyType === 'agricultural' ? '🌾' : '🏜️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem', color: 'var(--text)' }}>{form.title}</h4>
                    <p style={{ fontSize: '0.8rem', margin: '0 0 0.5rem', color: 'var(--text-muted)' }}>
                      📍 อำเภอ{form.district}, {form.province} • เนื้อที่: {fmt(form.area)} ตร.ม. • ย่าน: {form.zoneType}
                    </p>
                    <div style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '0.75rem',
                      fontSize: '0.78rem', color: 'var(--text-muted)'
                    }}>
                      <strong>💡 สิ่งอำนวยความสะดวกสาธารณูปโภคที่ติ๊กนำเสนอ:</strong><br />
                      {form.utilities.length > 0 ? (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                          {form.utilities.map(u => {
                            const labels = {
                              pea: '⚡ ไฟฟ้า PEA/MEA',
                              pwa: '💧 น้ำประปา PWA/MWA',
                              ais: '📶 AIS Fibre',
                              true: '📶 True Online',
                              drainage: '🛣️ ท่อระบายน้ำ',
                              light: '💡 ไฟทางหลวง'
                            };
                            return (
                              <span key={u} style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem' }}>
                                {labels[u] || u}
                              </span>
                            );
                          })}
                        </div>
                      ) : 'ไม่มีระบุเพิ่มเติม'}
                    </div>

                    <div style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '0.75rem',
                      fontSize: '0.78rem', color: 'var(--text-muted)'
                    }}>
                      <strong>📷 รูปภาพที่แนบประกอบ ({uploadedImages.length} รูป):</strong>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        {uploadedImages.map((img, i) => (
                          <div 
                            key={i} 
                            style={{ 
                              width: 50, 
                              height: 50, 
                              position: 'relative', 
                              borderRadius: 4, 
                              overflow: 'hidden',
                              border: '1px solid var(--border)' 
                            }}
                          >
                            <img src={getAssetUrl(img)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#0d8c5c', fontSize: '1.2rem' }}>฿{fmt(form.price)}</span>
                      <span style={{
                        padding: '0.18rem 0.6rem', background: 'rgba(13,140,92,0.08)',
                        color: '#0d8c5c', borderRadius: 'var(--radius-full)', fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>ค่าตอบแทนสิทธิการเช่าราชพัสดุ</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
