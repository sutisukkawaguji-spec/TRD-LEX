'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue in Next.js
const fixMarkerIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

export default function MapComponent({ lat, lng, activeRoute, isExpanded }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    parcelPolygon: null,
    routeLine: null,
    destMarker: null,
  });

  useEffect(() => {
    fixMarkerIcon();

    // Initialize Map
    if (!mapInstanceRef.current && mapRef.current) {
      // 1. Create Map Instance
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 17,
        zoomControl: true,
      });

      // 2. Add Esri Satellite Layer (แผนที่ภาพถ่ายทางอากาศ)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19,
      }).addTo(map);

      // Add Hybrid Label Layer to see streets over satellite images
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // 3. Draw Land Parcel Polygon (รูปแปลงที่ดินจำลองรอบพิกัด)
      const offset = 0.0004; // scale size of parcel
      const parcelCoords = [
        [lat - offset, lng - offset],
        [lat - offset, lng + offset],
        [lat + offset, lng + offset / 2],
        [lat + offset / 2, lng - offset],
      ];

      const polygon = L.polygon(parcelCoords, {
        color: '#fbbf24', // Gold border
        fillColor: '#d4920a',
        fillOpacity: 0.35,
        weight: 3,
        dashArray: '2, 5',
      }).addTo(map);

      polygon.bindPopup('⭐ <strong>รูปแปลงที่ดินราชพัสดุ</strong><br/>พิกัดขอโอนสิทธิ์').openPopup();
      layersRef.current.parcelPolygon = polygon;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng]);

  // Effect to handle map resizing when isExpanded toggles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Use a small timeout to let the CSS transition finish
    const timer = setTimeout(() => {
      map.invalidateSize();
      
      // If there is an active route, refit bounds, otherwise center at parcel
      if (activeRoute) {
        let destLat = lat;
        let destLng = lng;
        if (activeRoute.toUpperCase().includes('BTS') || activeRoute.includes('รถไฟฟ้า')) {
          destLat = lat + 0.0016;
          destLng = lng + 0.0035;
        } else if (activeRoute.toUpperCase().includes('MRT')) {
          destLat = lat + 0.0012;
          destLng = lng - 0.0028;
        } else if (activeRoute.includes('แม่น้ำ') || activeRoute.includes('ท่าเรือ') || activeRoute.includes('ท่าเทียบเรือ') || activeRoute.includes('ริมแม่น้ำ')) {
          destLat = lat - 0.0015;
          destLng = lng - 0.0022;
        } else if (activeRoute.includes('ชายหาด') || activeRoute.includes('ทะเล') || activeRoute.includes('วิวทะเล')) {
          destLat = lat + 0.0025;
          destLng = lng + 0.0015;
        } else {
          destLat = lat + 0.0015;
          destLng = lng + 0.0015;
        }
        const bounds = L.latLngBounds([[lat, lng], [destLat, destLng]]);
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        map.setView([lat, lng], 17);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [isExpanded, lat, lng, activeRoute]);

  // Effect to handle dynamic routing lines when activeRoute changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous route layers
    if (layersRef.current.routeLine) {
      map.removeLayer(layersRef.current.routeLine);
      layersRef.current.routeLine = null;
    }
    if (layersRef.current.destMarker) {
      map.removeLayer(layersRef.current.destMarker);
      layersRef.current.destMarker = null;
    }

    if (!activeRoute) {
      // Zoom back to parcel
      map.setView([lat, lng], 17);
      return;
    }

    // Determine target destination coordinates based on active route name
    let destLat = lat;
    let destLng = lng;
    let label = '';
    let iconEmoji = '';

    if (activeRoute.toUpperCase().includes('BTS') || activeRoute.includes('รถไฟฟ้า')) {
      destLat = lat + 0.0016;
      destLng = lng + 0.0035;
      label = 'สถานีรถไฟฟ้า';
      iconEmoji = '🚈';
    } else if (activeRoute.toUpperCase().includes('MRT')) {
      destLat = lat + 0.0012;
      destLng = lng - 0.0028;
      label = 'สถานีรถไฟฟ้า MRT';
      iconEmoji = '🚇';
    } else if (activeRoute.includes('แม่น้ำ') || activeRoute.includes('ท่าเรือ') || activeRoute.includes('ท่าเทียบเรือ') || activeRoute.includes('ริมแม่น้ำ')) {
      destLat = lat - 0.0015;
      destLng = lng - 0.0022;
      label = 'ท่าเทียบเรือด่วน';
      iconEmoji = '⚓';
    } else if (activeRoute.includes('ชายหาด') || activeRoute.includes('ทะเล') || activeRoute.includes('วิวทะเล')) {
      destLat = lat + 0.0025;
      destLng = lng + 0.0015;
      label = 'ชายหาดสาธารณะ / ชายทะเล';
      iconEmoji = '🏖️';
    } else {
      destLat = lat + 0.0015;
      destLng = lng + 0.0015;
      label = activeRoute;
      iconEmoji = '📍';
    }

    // Draw route line
    const routeCoords = [
      [lat, lng],
      [destLat, destLng],
    ];

    const polyline = L.polyline(routeCoords, {
      color: '#10b981', // Green route line
      weight: 5,
      opacity: 0.85,
      dashArray: '10, 10',
    }).addTo(map);

    // Custom Icon for destination
    const customIcon = L.divIcon({
      html: `<div style="
        font-size: 24px;
        background: white;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid #10b981;
      ">${iconEmoji}</div>`,
      className: 'custom-div-icon',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const marker = L.marker([destLat, destLng], { icon: customIcon }).addTo(map);
    marker.bindPopup(`📍 <strong>${label}</strong><br/>ระยะทางประมาณ 450 เมตร`).openPopup();

    layersRef.current.routeLine = polyline;
    layersRef.current.destMarker = marker;

    // Fit map bounds to show both parcel and destination
    const bounds = L.latLngBounds([[lat, lng], [destLat, destLng]]);
    map.fitBounds(bounds, { padding: [50, 50] });

  }, [activeRoute, lat, lng]);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-md)' }} />
      {/* Legend Map */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(15, 32, 70, 0.95)',
        backdropFilter: 'blur(4px)',
        color: '#fff',
        padding: '0.5rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        zIndex: 1000,
        fontSize: '0.68rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, background: 'rgba(212,146,10,0.35)', border: '2px dashed #fbbf24' }} />
          <span>ขอบเขตแปลงที่ดินราชพัสดุ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ display: 'inline-block', width: 12, height: 4, background: '#10b981', borderTop: '2px dashed #10b981' }} />
          <span>เส้นทางเชื่อมต่อที่เลือก</span>
        </div>
      </div>
    </div>
  );
}
