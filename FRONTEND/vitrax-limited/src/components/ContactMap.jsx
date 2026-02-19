import React, { useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import './ContactMap.css';

const ContactMap = ({ contactInfo }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const nairobiCoords = {
        lat: contactInfo?.coordinates?.latitude || -1.2921,
        lng: contactInfo?.coordinates?.longitude || 36.8219
      };

      const mapOptions = {
        center: nairobiCoords,
        zoom: 15,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#242f3e' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#242f3e' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#746855' }]
          },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }]
          }
        ]
      };

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add custom marker
      const marker = new window.google.maps.Marker({
        position: nairobiCoords,
        map: mapInstanceRef.current,
        title: 'Vitrax Limited - Nairobi',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
              <circle cx="20" cy="20" r="8" fill="#ffffff"/>
              <circle cx="20" cy="20" r="4" fill="#3b82f6"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        }
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">Vitrax Limited</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">${contactInfo?.address?.full_address || 'Nairobi, Kenya'}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });
    };

    loadGoogleMaps();

    return () => {
      if (mapInstanceRef.current) {
        // Cleanup map instance
        mapInstanceRef.current = null;
      }
    };
  }, [contactInfo]);

  return (
    <div className="contact-map-container">
      <div className="map-header">
        <h3>Find Us in Nairobi</h3>
        <p>Visit our showroom in the heart of Kenya's capital</p>
      </div>
      
      <div className="map-wrapper">
        <div ref={mapRef} className="google-map" />
        
        <div className="map-overlay">
          <div className="location-card">
            <div className="location-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="location-info">
              <h4>Our Location</h4>
              <p>{contactInfo?.address?.full_address || 'Westlands Business District, Nairobi, Kenya'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="map-stats">
        <div className="stat-item">
          <div className="stat-icon">
            <FaPhone />
          </div>
          <div className="stat-content">
            <h5>Call Us</h5>
            <p>{contactInfo?.phone?.primary || '+254 700 123 456'}</p>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">
            <FaEnvelope />
          </div>
          <div className="stat-content">
            <h5>Email Us</h5>
            <p>{contactInfo?.email?.primary || 'info@vitrax.co.ke'}</p>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h5>Working Hours</h5>
            <p>{contactInfo?.working_hours?.weekdays || 'Mon-Fri: 8:00 AM - 6:00 PM'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;
