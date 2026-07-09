'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    image: '/hero-01.jpg',
    title: 'ย่านสีลม-บางรัก',
    desc: 'ทำเลค้าขายและธุรกิจใจกลางเมืองหลวง ใกล้รถไฟฟ้า',
  },
  {
    image: '/hero-02.jpg',
    title: 'แม่ริม เชียงใหม่',
    desc: 'ที่ดินเกษตรกรรมบรรยากาศดี ศักยภาพสูง',
  },
  {
    image: '/hero-03.jpg',
    title: 'ริมแม่น้ำเจ้าพระยา',
    desc: 'ทำเลท่องเที่ยว พักผ่อนหย่อนใจ และร้านอาหารริมน้ำ',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 'clamp(280px, 45vw, 400px)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-xl)',
      border: '3px solid rgba(255, 255, 255, 0.15)',
    }}>
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: idx === current ? 1 : 0,
          }}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              transform: idx === current ? 'scale(1.05)' : 'scale(1.0)',
              transition: 'transform 4s ease-out',
            }}
            priority={idx === 0}
          />
          
          {/* Overlay gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 32, 70, 0.85) 0%, rgba(15, 32, 70, 0.2) 60%, transparent 100%)',
          }} />

          {/* Caption */}
          <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '1.5rem',
            right: '1.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
          }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'var(--accent-bright)',
              color: 'var(--primary-dark)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '0.4rem',
              display: 'inline-block',
            }}>
              ทำเลเด่น
            </span>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.2rem 0' }}>{slide.title}</h4>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', margin: 0, lineHeight: 1.4 }}>{slide.desc}</p>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div style={{
        position: 'absolute',
        bottom: '0.75rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        gap: '0.5rem',
        background: 'rgba(0,0,0,0.3)',
        padding: '0.35rem 0.65rem',
        borderRadius: 'var(--radius-full)',
        backdropFilter: 'blur(4px)',
      }}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`ไปที่สไลด์ ${idx + 1}`}
            style={{
              width: idx === current ? 16 : 8,
              height: 8,
              borderRadius: 'var(--radius-full)',
              background: idx === current ? 'var(--accent-bright)' : 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
