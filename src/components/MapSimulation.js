import React, { useEffect, useState, useRef, useCallback } from 'react';

const MapSimulation = ({ ambulanceLocation, isActive, userProfile }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v11');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [nearestVolunteer, setNearestVolunteer] = useState(null);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [bloodDonors, setBloodDonors] = useState([]);
  const [bestRoute, setBestRoute] = useState(null);
  const [alternateRoutes, setAlternateRoutes] = useState([]);
  const [liveAmbulanceLocations, setLiveAmbulanceLocations] = useState([]);

  // User location from profile
  const userLocation = userProfile ? {
    lat: userProfile.location.lat,
    lng: userProfile.location.lng,
    name: userProfile.name + "'s Location"
  } : { lat: 19.2183, lng: 72.9781, name: "Emergency Location" };

  // Multiple hospitals around Thane
  const hospitalLocations = [
    { lat: 19.2068, lng: 72.9688, name: "Jupiter Hospital Thane", id: "hosp_1", type: "Multi-specialty", beds: 45 },
    { lat: 19.2156, lng: 72.9625, name: "Bethany Hospital", id: "hosp_2", type: "General", beds: 28 },
    { lat: 19.2298, lng: 72.9854, name: "Kaushalya Hospital", id: "hosp_3", type: "Emergency", beds: 15 },
    { lat: 19.1987, lng: 72.9720, name: "Hiranandani Hospital", id: "hosp_4", type: "Multi-specialty", beds: 60 }
  ];

  // Multiple volunteer locations around Thane
  const volunteerLocations = [
    { lat: 19.2200, lng: 72.9750, name: "Volunteer Team A", id: "vol_a", expertise: "First Aid", response: "2 mins" },
    { lat: 19.2150, lng: 72.9820, name: "Volunteer Team B", id: "vol_b", expertise: "Medical Support", response: "3 mins" },
    { lat: 19.2250, lng: 72.9700, name: "Volunteer Team C", id: "vol_c", expertise: "Emergency Response", response: "4 mins" },
    { lat: 19.2100, lng: 72.9850, name: "Volunteer Team D", id: "vol_d", expertise: "Paramedic", response: "2 mins" },
    { lat: 19.2280, lng: 72.9780, name: "Volunteer Team E", id: "vol_e", expertise: "First Aid", response: "5 mins" },
    { lat: 19.2050, lng: 72.9750, name: "Volunteer Team F", id: "vol_f", expertise: "Medical Transport", response: "3 mins" }
  ];

  // Live ambulance locations for demo
  const generateLiveAmbulanceLocations = useCallback(() => {
    return [
      {
        id: "amb_1",
        lat: 19.2089,
        lng: 72.9712,
        name: "Ambulance Alpha",
        status: "Available",
        eta: "4 mins",
        hospital: "Jupiter Hospital"
      },
      {
        id: "amb_2",
        lat: 19.2134,
        lng: 72.9645,
        name: "Ambulance Beta",
        status: "En Route",
        eta: "7 mins",
        hospital: "Bethany Hospital"
      },
      {
        id: "amb_3",
        lat: 19.2267,
        lng: 72.9834,
        name: "Ambulance Gamma",
        status: "Available",
        eta: "6 mins",
        hospital: "Kaushalya Hospital"
      },
      {
        id: "amb_4",
        lat: 19.2012,
        lng: 72.9698,
        name: "Ambulance Delta",
        status: "Busy",
        eta: "12 mins",
        hospital: "Hiranandani Hospital"
      }
    ];
  }, []);

  // Blood donors based on user's blood group
  const generateBloodDonors = useCallback(() => {
    if (!userProfile) return [];

    const userBloodGroup = userProfile.bloodGroup;
    const donorLocations = [
      { lat: 19.2190, lng: 72.9760, name: "Raj Sharma", bloodGroup: userBloodGroup, distance: "0.8 km" },
      { lat: 19.2170, lng: 72.9800, name: "Priya Mehta", bloodGroup: userBloodGroup, distance: "1.2 km" },
      { lat: 19.2220, lng: 72.9720, name: "Amit Kumar", bloodGroup: userBloodGroup, distance: "1.5 km" },
      { lat: 19.2140, lng: 72.9840, name: "Sneha Patel", bloodGroup: userBloodGroup, distance: "1.8 km" }
    ];
    return donorLocations;
  }, [userProfile]);

  // Dynamic ambulance location
  const [currentAmbulanceLocation, setCurrentAmbulanceLocation] = useState(null);

  const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2hldGFuMTM3IiwiYSI6ImNtZmU3aGR1aDAxaDEya3F5eTR3ZWNnNjEifQ.PfMN2i_4QWVI4wTw6Q_Ygw';

  // Calculate distance between two points
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Find nearest volunteer to user location
  const findNearestVolunteer = useCallback(() => {
    let nearest = volunteerLocations[0];
    let minDistance = calculateDistance(
      userLocation.lat, userLocation.lng,
      nearest.lat, nearest.lng
    );

    volunteerLocations.forEach(volunteer => {
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        volunteer.lat, volunteer.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = volunteer;
      }
    });

    nearest.distance = minDistance;
    return nearest;
  }, [userLocation, calculateDistance]);

  // Find nearest hospital
  const findNearestHospital = useCallback(() => {
    let nearest = hospitalLocations[0];
    let minDistance = calculateDistance(
      userLocation.lat, userLocation.lng,
      nearest.lat, nearest.lng
    );

    hospitalLocations.forEach(hospital => {
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        hospital.lat, hospital.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = hospital;
      }
    });

    nearest.distance = minDistance;
    return nearest;
  }, [userLocation, calculateDistance]);

  // Find best ambulance based on availability and distance
  const findBestAmbulance = useCallback(() => {
    const availableAmbulances = liveAmbulanceLocations.filter(amb => amb.status === "Available");
    if (availableAmbulances.length === 0) return liveAmbulanceLocations[0];

    let nearest = availableAmbulances[0];
    let minDistance = calculateDistance(
      userLocation.lat, userLocation.lng,
      nearest.lat, nearest.lng
    );

    availableAmbulances.forEach(ambulance => {
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        ambulance.lat, ambulance.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = ambulance;
      }
    });

    nearest.distance = minDistance;
    return nearest;
  }, [userLocation, calculateDistance, liveAmbulanceLocations]);

  // Get multiple routes and highlight the best one
  const getMultipleRoutes = useCallback(async (map, destination) => {
    const start = [userLocation.lng, userLocation.lat];
    const end = [destination.lng, destination.lat];

    try {
      // Get multiple route alternatives
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(',')};${end.join(',')}?alternatives=true&steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        // Clear existing routes
        for (let i = 0; i < 5; i++) {
          if (map.getSource(`route-${i}`)) {
            map.removeLayer(`route-${i}`);
            map.removeSource(`route-${i}`);
          }
        }

        const routes = data.routes;
        setBestRoute(routes[0]);
        setAlternateRoutes(routes.slice(1));

        // Add best route (highlighted)
        map.addSource('route-0', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: routes[0].geometry
          }
        });

        map.addLayer({
          id: 'route-0',
          type: 'line',
          source: 'route-0',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#dc2626', // Red for best route
            'line-width': 8,
            'line-opacity': 0.9
          }
        });

        // Add glow effect for best route
        map.addLayer({
          id: 'route-0-glow',
          type: 'line',
          source: 'route-0',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#fef3c7',
            'line-width': 12,
            'line-opacity': 0.4,
            'line-blur': 3
          }
        }, 'route-0');

        // Add alternate routes (dimmed)
        routes.slice(1).forEach((route, index) => {
          const routeId = `route-${index + 1}`;

          map.addSource(routeId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          });

          map.addLayer({
            id: routeId,
            type: 'line',
            source: routeId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#6b7280',
              'line-width': 4,
              'line-opacity': 0.5,
              'line-dasharray': [2, 2]
            }
          });
        });

        // Animate ambulance along best route
        animateAmbulance(map, routes[0].geometry.coordinates, destination);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  }, [userLocation, MAPBOX_TOKEN]);

  const animateAmbulance = useCallback((map, routeCoordinates, destination) => {
    let counter = 0;
    const steps = routeCoordinates.length;

    // Remove existing ambulance marker if any
    const existingAmbulance = markersRef.current.find(marker => marker.type === 'ambulance');
    if (existingAmbulance) {
      existingAmbulance.marker.remove();
      markersRef.current = markersRef.current.filter(marker => marker.type !== 'ambulance');
    }

    // Create animated ambulance marker
    const ambulanceMarker = document.createElement('div');
    ambulanceMarker.innerHTML = `
      <div style="
        background: linear-gradient(45deg, #dc2626, #b91c1c);
        border: 3px solid #fff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
        animation: bounce 1s infinite, pulse-emergency 2s infinite;
      ">🚑</div>
    `;

    const ambulanceMapMarker = new window.mapboxgl.Marker(ambulanceMarker)
      .setLngLat(routeCoordinates[0])
      .addTo(map);

    markersRef.current.push({ marker: ambulanceMapMarker, type: 'ambulance' });

    const animate = () => {
      if (counter < steps && isActive) {
        const currentCoord = routeCoordinates[counter];
        ambulanceMapMarker.setLngLat(currentCoord);
        setCurrentAmbulanceLocation({ lat: currentCoord[1], lng: currentCoord[0] });
        counter += Math.ceil(steps / 120); // Slightly faster animation
        setTimeout(() => requestAnimationFrame(animate), 100);
      }
    };

    animate();
  }, [isActive]);

  const addMarkersAndRoute = useCallback((map) => {
    // Generate live ambulance locations
    const ambulances = generateLiveAmbulanceLocations();
    setLiveAmbulanceLocations(ambulances);

    // Clear existing markers
    markersRef.current.forEach(markerObj => markerObj.marker.remove());
    markersRef.current = [];

    // Add user location marker with profile info
    const userMarker = document.createElement('div');
    userMarker.innerHTML = `
      <div style="
        background: linear-gradient(45deg, #dc2626, #b91c1c);
        border: 4px solid #fff;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 4px 16px rgba(220, 38, 38, 0.4);
        ${isActive ? 'animation: pulse-emergency 2s infinite;' : ''}
      ">🆘</div>
    `;
    userMarker.style.cursor = 'pointer';

    const userMapMarker = new window.mapboxgl.Marker(userMarker)
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new window.mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 0.5rem;">
            <h3 style="margin: 0 0 0.5rem 0; color: #dc2626;">${userLocation.name}</h3>
            <div style="font-size: 0.8rem; line-height: 1.4;">
              <p style="margin: 0.25rem 0;"><strong>Patient:</strong> ${userProfile?.name || 'Unknown'}</p>
              <p style="margin: 0.25rem 0;"><strong>Age:</strong> ${userProfile?.age || 'N/A'} years</p>
              <p style="margin: 0.25rem 0;"><strong>Blood Group:</strong> <span style="color: #dc2626; font-weight: bold;">${userProfile?.bloodGroup || 'Unknown'}</span></p>
              <p style="margin: 0.25rem 0;"><strong>Conditions:</strong> ${userProfile?.medicalConditions?.join(', ') || 'None reported'}</p>
              <p style="margin: 0.25rem 0;"><strong>Emergency Contact:</strong> ${userProfile?.emergencyContact || 'Not provided'}</p>
              ${isActive ? '<p style="margin: 0.5rem 0 0 0; color: #dc2626; font-weight: bold;">🚨 EMERGENCY ACTIVE</p>' : ''}
            </div>
          </div>
        `))
      .addTo(map);

    markersRef.current.push({ marker: userMapMarker, type: 'user' });

    // Add live ambulance markers
    ambulances.forEach(ambulance => {
      const ambulanceMarker = document.createElement('div');
      const statusColor = ambulance.status === 'Available' ? '#10b981' :
                         ambulance.status === 'En Route' ? '#f59e0b' : '#ef4444';

      ambulanceMarker.innerHTML = `
        <div style="
          background: ${statusColor};
          border: 3px solid #fff;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
        ">🚑</div>
      `;
      ambulanceMarker.style.cursor = 'pointer';

      const distance = calculateDistance(userLocation.lat, userLocation.lng, ambulance.lat, ambulance.lng);

      const ambulanceMapMarker = new window.mapboxgl.Marker(ambulanceMarker)
        .setLngLat([ambulance.lng, ambulance.lat])
        .setPopup(new window.mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 0.5rem;">
              <h3 style="margin: 0 0 0.5rem 0; color: ${statusColor};">${ambulance.name}</h3>
              <div style="font-size: 0.8rem; line-height: 1.4;">
                <p style="margin: 0.25rem 0;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${ambulance.status}</span></p>
                <p style="margin: 0.25rem 0;"><strong>Hospital:</strong> ${ambulance.hospital}</p>
                <p style="margin: 0.25rem 0;"><strong>Distance:</strong> ${distance.toFixed(1)} km</p>
                <p style="margin: 0.25rem 0;"><strong>ETA:</strong> ${ambulance.eta}</p>
              </div>
            </div>
          `))
        .addTo(map);

      markersRef.current.push({ marker: ambulanceMapMarker, type: 'live-ambulance', id: ambulance.id });
    });

    // Add hospital markers
    hospitalLocations.forEach(hospital => {
      const hospitalMarker = document.createElement('div');
      hospitalMarker.innerHTML = '🏥';
      hospitalMarker.style.fontSize = '24px';
      hospitalMarker.style.cursor = 'pointer';

      const distance = calculateDistance(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng);
      const isNearest = hospital.id === findNearestHospital().id;

      if (isNearest) {
        hospitalMarker.style.border = '3px solid #3b82f6';
        hospitalMarker.style.borderRadius = '50%';
        hospitalMarker.style.backgroundColor = '#eff6ff';
        hospitalMarker.style.padding = '2px';
      }

      const hospitalMapMarker = new window.mapboxgl.Marker(hospitalMarker)
        .setLngLat([hospital.lng, hospital.lat])
        .setPopup(new window.mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 0.5rem;">
              <h3 style="margin: 0 0 0.5rem 0; color: #3b82f6;">${hospital.name}</h3>
              <div style="font-size: 0.8rem; line-height: 1.4;">
                <p style="margin: 0.25rem 0;"><strong>Type:</strong> ${hospital.type}</p>
                <p style="margin: 0.25rem 0;"><strong>Available Beds:</strong> ${hospital.beds}</p>
                <p style="margin: 0.25rem 0;"><strong>Distance:</strong> ${distance.toFixed(1)} km</p>
                <p style="margin: 0.25rem 0;"><strong>ETA:</strong> ${Math.ceil(distance * 4)} mins</p>
                ${isNearest ? '<p style="margin: 0.5rem 0 0 0; color: #3b82f6; font-weight: bold;">🎯 NEAREST HOSPITAL</p>' : ''}
              </div>
            </div>
          `))
        .addTo(map);

      markersRef.current.push({ marker: hospitalMapMarker, type: 'hospital', id: hospital.id });
    });

    // Add volunteer location markers
    volunteerLocations.forEach(volunteer => {
      const volunteerMarker = document.createElement('div');
      volunteerMarker.innerHTML = '👨‍⚕️';
      volunteerMarker.style.fontSize = '20px';
      volunteerMarker.style.cursor = 'pointer';

      const distance = calculateDistance(userLocation.lat, userLocation.lng, volunteer.lat, volunteer.lng);
      const isNearest = volunteer.id === findNearestVolunteer().id;

      if (isNearest) {
        volunteerMarker.style.border = '2px solid #10b981';
        volunteerMarker.style.borderRadius = '50%';
        volunteerMarker.style.backgroundColor = '#ecfdf5';
        volunteerMarker.style.padding = '2px';
      }

      const volunteerMapMarker = new window.mapboxgl.Marker(volunteerMarker)
        .setLngLat([volunteer.lng, volunteer.lat])
        .setPopup(new window.mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 0.5rem;">
              <h3 style="margin: 0 0 0.5rem 0; color: #10b981;">${volunteer.name}</h3>
              <div style="font-size: 0.8rem; line-height: 1.4;">
                <p style="margin: 0.25rem 0;"><strong>Expertise:</strong> ${volunteer.expertise}</p>
                <p style="margin: 0.25rem 0;"><strong>Response Time:</strong> ${volunteer.response}</p>
                <p style="margin: 0.25rem 0;"><strong>Distance:</strong> ${distance.toFixed(1)} km</p>
                ${isNearest ? '<p style="margin: 0.5rem 0 0 0; color: #10b981; font-weight: bold;">🎯 NEAREST VOLUNTEER</p>' : ''}
              </div>
            </div>
          `))
        .addTo(map);

      markersRef.current.push({ marker: volunteerMapMarker, type: 'volunteer', id: volunteer.id });
    });

    // Add blood donor markers if emergency is active
    if (isActive && userProfile) {
      const donors = generateBloodDonors();
      setBloodDonors(donors);

      donors.forEach((donor, index) => {
        const donorMarker = document.createElement('div');
        donorMarker.innerHTML = '🩸';
        donorMarker.style.fontSize = '18px';
        donorMarker.style.cursor = 'pointer';

        const donorMapMarker = new window.mapboxgl.Marker(donorMarker)
          .setLngLat([donor.lng, donor.lat])
          .setPopup(new window.mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 0.5rem;">
                <h3 style="margin: 0 0 0.5rem 0; color: #dc2626;">${donor.name}</h3>
                <div style="font-size: 0.8rem; line-height: 1.4;">
                  <p style="margin: 0.25rem 0;"><strong>Blood Group:</strong> <span style="color: #dc2626; font-weight: bold;">${donor.bloodGroup}</span></p>
                  <p style="margin: 0.25rem 0;"><strong>Distance:</strong> ${donor.distance}</p>
                  <p style="margin: 0.5rem 0 0 0; color: #10b981; font-weight: bold;">🩸 BLOOD DONOR AVAILABLE</p>
                </div>
              </div>
            `))
          .addTo(map);

        markersRef.current.push({ marker: donorMapMarker, type: 'donor', id: `donor_${index}` });
      });
    }

    // Add routes if active - use best route highlighting
    if (isActive) {
      const nearest = findNearestVolunteer();
      const nearestHosp = findNearestHospital();
      setNearestVolunteer(nearest);
      setNearestHospital(nearestHosp);
      getMultipleRoutes(map, nearest);
    }
  }, [userLocation, userProfile, isActive, calculateDistance, findNearestVolunteer, findNearestHospital, getMultipleRoutes, generateBloodDonors, generateLiveAmbulanceLocations]);

  const initializeMap = useCallback(() => {
    if (!window.mapboxgl || mapRef.current) return;

    window.mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [userLocation.lng, userLocation.lat],
      zoom: 13,
      pitch: 45,
      bearing: 0
    });

    mapRef.current = map;

    map.on('load', () => {
      setIsMapLoaded(true);
      addMarkersAndRoute(map);
    });

    map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new window.mapboxgl.FullscreenControl(), 'top-right');
  }, [mapStyle, userLocation.lng, userLocation.lat, MAPBOX_TOKEN, addMarkersAndRoute]);

  useEffect(() => {
    // Check if Mapbox is already loaded
    if (window.mapboxgl) {
      initializeMap();
      return;
    }

    // Load Mapbox GL JS
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.onload = initializeMap;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.forEach(markerObj => markerObj.marker.remove());
      markersRef.current = [];
    };
  }, [initializeMap]);

  useEffect(() => {
    if (mapRef.current && isMapLoaded) {
      mapRef.current.setStyle(mapStyle);
      const handleStyleData = () => {
        setTimeout(() => addMarkersAndRoute(mapRef.current), 1000);
      };
      mapRef.current.on('styledata', handleStyleData);

      return () => {
        if (mapRef.current) {
          mapRef.current.off('styledata', handleStyleData);
        }
      };
    }
  }, [mapStyle, isMapLoaded, addMarkersAndRoute]);

  const getCurrentDistance = () => {
    if (!currentAmbulanceLocation) {
      if (nearestVolunteer) {
        return `${nearestVolunteer.distance.toFixed(1)} km`;
      }
      return "2.3 km";
    }

    const distance = calculateDistance(
      userLocation.lat, userLocation.lng,
      currentAmbulanceLocation.lat, currentAmbulanceLocation.lng
    );
    return `${distance.toFixed(1)} km`;
  };

  const getETA = () => {
    if (!nearestVolunteer) return isActive ? '8-12 mins' : '15-20 mins';

    const baseTime = nearestVolunteer.distance * 3; // Rough estimate: 3 minutes per km
    return isActive ? `${Math.max(2, Math.floor(baseTime))-1}-${Math.floor(baseTime)+2} mins` : `${Math.floor(baseTime)+5}-${Math.floor(baseTime)+10} mins`;
  };

  const mapStyleOptions = [
    { value: 'mapbox://styles/mapbox/streets-v11', label: 'Streets' },
    { value: 'mapbox://styles/mapbox/satellite-v9', label: 'Satellite' },
    { value: 'mapbox://styles/mapbox/satellite-streets-v11', label: 'Satellite Streets' },
    { value: 'mapbox://styles/mapbox/navigation-day-v1', label: 'Navigation' },
    { value: 'mapbox://styles/mapbox/dark-v10', label: 'Dark' },
    { value: 'mapbox://styles/mapbox/light-v10', label: 'Light' }
  ];

  return (
    <div className="map-simulation">
      <div className="map-header">
        <h2>🗺️ Live Emergency Response Map - {userProfile?.location?.address || 'Thane, MH'}</h2>
        <div className="map-controls">
          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value)}
            className="map-style-select"
          >
            {mapStyleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="map-container">
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Enhanced Status Panel with Route Info */}
        <div className="status-panel">
          <div className="status-header">
            <h4>📊 Emergency Status</h4>
            <div className={`status-indicator ${isActive ? 'active' : 'standby'}`}>
              {isActive ? 'ACTIVE' : 'STANDBY'}
            </div>
          </div>

          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Distance to Help:</span>
              <span className="status-value">{getCurrentDistance()}</span>
            </div>
            <div className="status-item">
              <span className="status-label">ETA:</span>
              <span className="status-value">{getETA()}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Patient:</span>
              <span className="status-value">{userProfile?.name || 'Unknown'}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Blood Group:</span>
              <span className="status-value blood-group">{userProfile?.bloodGroup || 'N/A'}</span>
            </div>
          </div>

          {/* Best Route Information */}
          {bestRoute && isActive && (
            <div className="best-route-info">
              <h5>🎯 Optimal Route</h5>
              <div className="route-details">
                <p><strong>Distance:</strong> {(bestRoute.distance / 1000).toFixed(1)} km</p>
                <p><strong>Duration:</strong> {Math.ceil(bestRoute.duration / 60)} mins</p>
                <p><strong>Route Type:</strong> Fastest route</p>
              </div>
              {alternateRoutes.length > 0 && (
                <p className="alternate-routes">
                  {alternateRoutes.length} alternate route{alternateRoutes.length > 1 ? 's' : ''} available
                </p>
              )}
            </div>
          )}

          {nearestVolunteer && (
            <div className="nearest-volunteer">
              <h5>🎯 Nearest Volunteer</h5>
              <p><strong>{nearestVolunteer.name}</strong></p>
              <p>{nearestVolunteer.expertise} • {nearestVolunteer.distance.toFixed(1)} km</p>
            </div>
          )}

          {nearestHospital && (
            <div className="nearest-hospital">
              <h5>🏥 Nearest Hospital</h5>
              <p><strong>{nearestHospital.name}</strong></p>
              <p>{nearestHospital.type} • {nearestHospital.distance.toFixed(1)} km</p>
            </div>
          )}
        </div>

        {/* Live Ambulance Status Panel */}
        {isActive && liveAmbulanceLocations.length > 0 && (
          <div className="ambulance-status-panel">
            <h5>🚑 Live Ambulance Status</h5>
            <div className="ambulance-list">
              {liveAmbulanceLocations.map(ambulance => {
                const distance = calculateDistance(
                  userLocation.lat, userLocation.lng,
                  ambulance.lat, ambulance.lng
                );
                const statusColor = ambulance.status === 'Available' ? '#10b981' :
                                   ambulance.status === 'En Route' ? '#f59e0b' : '#ef4444';

                return (
                  <div key={ambulance.id} className="ambulance-item">
                    <div className="ambulance-info">
                      <span className="ambulance-name">{ambulance.name}</span>
                      <span
                        className="ambulance-status"
                        style={{ color: statusColor }}
                      >
                        {ambulance.status}
                      </span>
                    </div>
                    <div className="ambulance-details">
                      <span>{distance.toFixed(1)} km • {ambulance.eta}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Legend */}
        <div className="map-legend">
          <h5>Map Legend</h5>
          <div className="legend-grid">
            <div className="legend-item">
              <span className="legend-icon">🆘</span>
              <span>Emergency Location</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon">👨‍⚕️</span>
              <span>Volunteers ({volunteerLocations.length})</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon">🏥</span>
              <span>Hospitals ({hospitalLocations.length})</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon">🚑</span>
              <span>Live Ambulances ({liveAmbulanceLocations.length})</span>
            </div>
            {isActive && (
              <>
                <div className="legend-item">
                  <span className="legend-icon">🩸</span>
                  <span>Blood Donors ({bloodDonors.length})</span>
                </div>
                <div className="legend-item">
                  <div className="route-line best"></div>
                  <span>Best Route</span>
                </div>
                <div className="legend-item">
                  <div className="route-line alternate"></div>
                  <span>Alternate Routes</span>
                </div>
              </>
            )}
            <div className="legend-item">
              <div className="route-line green"></div>
              <span>Volunteer Route</span>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {!isMapLoaded && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading Emergency Response Map...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .map-simulation {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin: 1rem;
          overflow: hidden;
          border: 2px solid #f3f4f6;
        }

        .map-header {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .map-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .map-style-select {
          padding: 0.5rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 0.875rem;
          min-width: 120px;
        }

        .map-style-select option {
          background: #047857;
          color: white;
        }

        .map-container {
          position: relative;
          height: 500px;
          background: #f8fafc;
        }

        .status-panel {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.95);
          padding: 1rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          min-width: 220px;
          max-width: 280px;
          z-index: 10;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .status-header h4 {
          margin: 0;
          font-size: 1rem;
          color: #1f2937;
        }

        .status-indicator {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .status-indicator.active {
          background: #fef3c7;
          color: #92400e;
          animation: pulse-status 2s infinite;
        }

        .status-indicator.standby {
          background: #f3f4f6;
          color: #6b7280;
        }

        .status-grid {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .status-label {
          color: #6b7280;
          font-weight: 500;
        }

        .status-value {
          font-weight: 600;
          color: #1f2937;
        }

        .status-value.blood-group {
          background: #fef3c7;
          color: #92400e;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .best-route-info {
          background: rgba(220, 38, 38, 0.1);
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 0.75rem;
          border-left: 3px solid #dc2626;
        }

        .best-route-info h5 {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #dc2626;
          font-weight: 600;
        }

        .route-details p {
          margin: 0.25rem 0;
          font-size: 0.75rem;
          color: #374151;
        }

        .alternate-routes {
          margin: 0.5rem 0 0 0;
          font-size: 0.7rem;
          color: #6b7280;
          font-style: italic;
        }

        .nearest-volunteer,
        .nearest-hospital {
          background: rgba(16, 185, 129, 0.1);
          padding: 0.75rem;
          border-radius: 8px;
          margin-top: 0.75rem;
          border-left: 3px solid #10b981;
        }

        .nearest-hospital {
          background: rgba(59, 130, 246, 0.1);
          border-left-color: #3b82f6;
        }

        .nearest-volunteer h5,
        .nearest-hospital h5 {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #10b981;
        }

        .nearest-hospital h5 {
          color: #3b82f6;
        }

        .nearest-volunteer p,
        .nearest-hospital p {
          margin: 0.25rem 0;
          font-size: 0.75rem;
          color: #374151;
        }

        .ambulance-status-panel {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.95);
          padding: 1rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          min-width: 200px;
          max-width: 250px;
          z-index: 10;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .ambulance-status-panel h5 {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          color: #1f2937;
          font-weight: 600;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .ambulance-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ambulance-item {
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 6px;
          border-left: 3px solid #e5e7eb;
        }

        .ambulance-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .ambulance-name {
          font-weight: 600;
          font-size: 0.75rem;
          color: #1f2937;
        }

        .ambulance-status {
          font-size: 0.7rem;
          font-weight: 600;
        }

        .ambulance-details {
          font-size: 0.7rem;
          color: #6b7280;
        }

        .map-legend {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.95);
          padding: 1rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          z-index: 10;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .map-legend h5 {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          color: #1f2937;
          font-weight: 600;
        }

        .legend-grid {
          display: grid;
          gap: 0.5rem;
          font-size: 0.75rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #374151;
        }

        .legend-icon {
          font-size: 1rem;
          width: 20px;
          text-align: center;
        }

        .route-line {
          width: 20px;
          height: 3px;
          border-radius: 2px;
        }

        .route-line.best {
          background: #dc2626;
          box-shadow: 0 0 4px rgba(220, 38, 38, 0.5);
        }

        .route-line.alternate {
          background: #6b7280;
          border: 1px dashed #9ca3af;
        }

        .route-line.green {
          background: #10b981;
        }

        .route-line.blue {
          background: #3b82f6;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #10b981;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes pulse-status {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes pulse-emergency {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-8px,0);
          }
          70% {
            transform: translate3d(0,-4px,0);
          }
          90% {
            transform: translate3d(0,-2px,0);
          }
        }

        @media (max-width: 768px) {
          .map-simulation {
            margin: 0.5rem;
          }

          .map-header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .map-container {
            height: 400px;
          }

          .status-panel,
          .ambulance-status-panel {
            position: static;
            margin: 1rem;
            min-width: auto;
            max-width: none;
          }

          .map-legend {
            position: static;
            margin: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MapSimulation;
