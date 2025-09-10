import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SOSButton from './components/SOSButton';
import NotificationPanel from './components/NotificationPanel';
import LiveUpdates from './components/LiveUpdates';
import MapSimulation from './components/MapSimulation';
import './App.css';

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [ambulanceLocation, setAmbulanceLocation] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [hasLowBalance, setHasLowBalance] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Rahul Sharma",
    age: 32,
    bloodGroup: "O+",
    phone: "+91 9876543210",
    emergencyContact: "+91 9876543211",
    medicalConditions: ["Diabetes", "Hypertension"],
    location: { lat: 19.2183, lng: 72.9781, address: "Thane West, Maharashtra" },
    balance: 5.50 // Simulated low balance
  });

  // Check if user has low balance for emergency messaging
  useEffect(() => {
    if (userProfile.balance < 10) {
      setHasLowBalance(true);
    }
  }, [userProfile.balance]);

  // Auto-hide intro after 8 seconds or manual skip
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  // Emergency messaging for low balance users
  const sendEmergencyMessage = async () => {
    addNotification("📱 Emergency SMS sent via free service", "success");
    addLiveUpdate("Low balance detected - Using emergency SMS gateway", "info");

    // Simulate emergency SMS workflow
    setTimeout(() => {
      addNotification("🆘 Emergency contacts notified via SMS", "success");
      addLiveUpdate("Family and emergency services alerted", "success");
    }, 2000);

    setTimeout(() => {
      addNotification("🏥 Nearest hospital contacted directly", "info");
      addLiveUpdate("Hospital emergency department informed", "info");
    }, 4000);
  };

  // Demo emergency workflow simulation
  const triggerEmergencyWorkflow = async () => {
    setIsEmergencyActive(true);

    // Check for low balance and provide alternative
    if (hasLowBalance) {
      addNotification("⚠️ Low balance detected - Using emergency mode", "warning");
      addLiveUpdate("Emergency mode activated - Free services enabled", "warning");
      await sendEmergencyMessage();
    }

    // Initial SOS alert
    addNotification("🚨 SOS Alert Triggered!", "emergency");
    addLiveUpdate("Emergency SOS activated - Location shared", "success");

    // Simulate real-time responses
    setTimeout(() => {
      addNotification("🏥 Hospital notified: Jupiter Hospital Thane", "info");
      addLiveUpdate("Nearest hospital contacted - Ambulance dispatching", "info");
    }, 2000);

    setTimeout(() => {
      addNotification("🚑 Ambulance dispatched - ETA 8 mins", "success");
      addLiveUpdate("Ambulance #MH02-AB-1234 en route", "success");
    }, 4000);

    setTimeout(() => {
      addNotification("🩸 Blood donor matched: 2 O+ donors nearby", "info");
      addLiveUpdate("Emergency blood donors contacted in area", "info");
    }, 6000);

    setTimeout(() => {
      addNotification("👨‍⚕️ Volunteer Team A responding - ETA 3 mins", "success");
      addLiveUpdate("First aid volunteer dispatched to location", "success");
    }, 8000);

    setTimeout(() => {
      addNotification("🚦 Green corridor activated on route", "info");
      addLiveUpdate("Traffic signals coordinated for faster response", "info");
    }, 10000);

    setTimeout(() => {
      addNotification("👨‍⚕️ Volunteer arrived - providing first aid", "success");
      addLiveUpdate("Medical volunteer reached patient location", "success");
    }, 15000);

    setTimeout(() => {
      addNotification("🚑 Ambulance arrived at location", "success");
      addLiveUpdate("Patient being transferred to Jupiter Hospital", "success");
    }, 25000);

    setTimeout(() => {
      addNotification("🏥 Patient reached hospital safely", "success");
      addLiveUpdate("Emergency response completed successfully", "success");
      setIsEmergencyActive(false);
    }, 35000);
  };

  const addNotification = (message, type) => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Auto remove after 12 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 12000);
  };

  const addLiveUpdate = (message, type) => {
    const newUpdate = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setLiveUpdates(prev => [newUpdate, ...prev]);
  };

  const handleSOSPress = () => {
    if (!isEmergencyActive) {
      triggerEmergencyWorkflow();
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const skipIntro = () => {
    setShowIntro(false);
  };

  // Intro Screen Component
  if (showIntro) {
    return (
      <div className="intro-screen">
        <video
          autoPlay
          muted
          loop
          className="intro-video"
          poster="/api/placeholder/1920/1080"
        >
          <source src="v3.mp4" type="video/mp4" />
          <div className="video-fallback"></div>
        </video>

        <div className="intro-overlay">
          <div className="intro-content">
            <div className="logo-animation">
              <div className="logo-icon">🏥</div>
              <h1 className="app-title">Swasthya Setu</h1>
            </div>

            <div className="tagline">
              <h2>Emergency Response System</h2>
              <p>Connecting Lives • Saving Time • Building Hope</p>
            </div>

            <div className="intro-features">
              <div className="feature-item">
                <span className="feature-icon">🚨</span>
                <span>Instant SOS Alert</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚑</span>
                <span>Ambulance Dispatch</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🩸</span>
                <span>Blood Donor Network</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👨‍⚕️</span>
                <span>Volunteer Support</span>
              </div>
            </div>

            <div className="emergency-note">
              <div className="emergency-highlight">
                <span className="emergency-icon">📱</span>
                <div className="emergency-text">
                  <strong>No Balance? No Problem!</strong>
                  <p>Emergency services work even without mobile balance</p>
                </div>
              </div>
            </div>

            <button className="skip-intro-btn" onClick={skipIntro}>
              Enter Dashboard
              <span className="skip-arrow">→</span>
            </button>
          </div>
        </div>

        <style jsx>{`
          .intro-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            z-index: 9999;
          }

          .intro-video {
            position: absolute;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            transform: translate(-50%, -50%);
            object-fit: cover;
          }

          .video-fallback {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg,
              rgba(220, 38, 38, 0.9) 0%,
              rgba(185, 28, 28, 0.8) 50%,
              rgba(5, 150, 105, 0.9) 100%);
          }

          .intro-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg,
              rgba(0, 0, 0, 0.7) 0%,
              rgba(220, 38, 38, 0.3) 50%,
              rgba(0, 0, 0, 0.7) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .intro-content {
            text-align: center;
            color: white;
            max-width: 600px;
            padding: 2rem;
          }

          .logo-animation {
            margin-bottom: 2rem;
            animation: logoEntrance 1.5s ease-out;
          }

          .logo-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: pulse 2s infinite;
          }

          .app-title {
            font-size: 3.5rem;
            font-weight: bold;
            margin: 0;
            background: linear-gradient(45deg, #fff, #fbbf24);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: titleGlow 3s ease-in-out infinite;
          }

          .tagline {
            margin-bottom: 3rem;
            animation: fadeInUp 2s ease-out 0.5s both;
          }

          .tagline h2 {
            font-size: 1.5rem;
            margin: 0 0 0.5rem 0;
            font-weight: 600;
          }

          .tagline p {
            font-size: 1rem;
            opacity: 0.9;
            margin: 0;
          }

          .intro-features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 3rem;
            animation: fadeInUp 2s ease-out 1s both;
          }

          .feature-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .feature-icon {
            font-size: 1.5rem;
          }

          .emergency-note {
            margin-bottom: 3rem;
            animation: fadeInUp 2s ease-out 1.5s both;
          }

          .emergency-highlight {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2));
            padding: 1.5rem;
            border-radius: 16px;
            border: 2px solid rgba(34, 197, 94, 0.3);
            backdrop-filter: blur(15px);
          }

          .emergency-icon {
            font-size: 2rem;
          }

          .emergency-text {
            text-align: left;
          }

          .emergency-text strong {
            display: block;
            font-size: 1.125rem;
            margin-bottom: 0.25rem;
            color: #fbbf24;
          }

          .emergency-text p {
            margin: 0;
            font-size: 0.875rem;
            opacity: 0.9;
          }

          .skip-intro-btn {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            border: none;
            padding: 1rem 2rem;
            font-size: 1.125rem;
            font-weight: 600;
            border-radius: 50px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0 auto;
            transition: all 0.3s ease;
            animation: fadeInUp 2s ease-out 2s both;
          }

          .skip-intro-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
          }

          .skip-arrow {
            transition: transform 0.3s ease;
          }

          .skip-intro-btn:hover .skip-arrow {
            transform: translateX(5px);
          }

          @keyframes logoEntrance {
            0% {
              opacity: 0;
              transform: scale(0.5) translateY(-50px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes titleGlow {
            0%, 100% {
              text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            }
            50% {
              text-shadow: 0 0 30px rgba(251, 191, 36, 0.8);
            }
          }

          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @media (max-width: 768px) {
            .intro-content {
              padding: 1rem;
            }

            .app-title {
              font-size: 2.5rem;
            }

            .intro-features {
              grid-template-columns: 1fr;
            }

            .emergency-highlight {
              flex-direction: column;
              text-align: center;
            }

            .emergency-text {
              text-align: center;
            }
          }
        `}</style>
      </div>
    );
  }

  // Main Application
  return (
    <div className="app">
      <Header userProfile={userProfile} />

      <div className="main-content">
        <div className="emergency-section">
          <div className="user-info-card">
            <h3>👤 Emergency Profile</h3>
            <div className="profile-details">
              <div className="profile-item">
                <span className="label">Name:</span>
                <span className="value">{userProfile.name}</span>
              </div>
              <div className="profile-item">
                <span className="label">Age:</span>
                <span className="value">{userProfile.age} years</span>
              </div>
              <div className="profile-item">
                <span className="label">Blood Group:</span>
                <span className="value blood-group">{userProfile.bloodGroup}</span>
              </div>
              <div className="profile-item">
                <span className="label">Phone:</span>
                <span className="value">{userProfile.phone}</span>
              </div>
              <div className="profile-item">
                <span className="label">Balance:</span>
                <span className={`value ${hasLowBalance ? 'low-balance' : ''}`}>
                  ₹{userProfile.balance.toFixed(2)}
                </span>
              </div>
              <div className="profile-item">
                <span className="label">Medical Conditions:</span>
                <span className="value">{userProfile.medicalConditions.join(", ")}</span>
              </div>
              <div className="profile-item">
                <span className="label">Location:</span>
                <span className="value">{userProfile.location.address}</span>
              </div>
            </div>

            {hasLowBalance && (
              <div className="low-balance-alert">
                <span className="alert-icon">⚠️</span>
                <div className="alert-text">
                  <strong>Low Balance Detected</strong>
                  <p>Emergency services will use free SMS/USSD gateway</p>
                </div>
              </div>
            )}
          </div>

          <SOSButton
            onPress={handleSOSPress}
            isActive={isEmergencyActive}
            userProfile={userProfile}
            hasLowBalance={hasLowBalance}
          />
        </div>

        <div className="response-section">
          <NotificationPanel
            notifications={notifications}
            onClear={clearNotifications}
          />

          <LiveUpdates
            updates={liveUpdates}
            isEmergencyActive={isEmergencyActive}
          />
        </div>

        <div className="map-section">
          <MapSimulation
            ambulanceLocation={ambulanceLocation}
            isActive={isEmergencyActive}
            userProfile={userProfile}
          />
        </div>
      </div>

      {isEmergencyActive && (
        <div className="emergency-overlay">
          <div className="emergency-status">
            <div className="pulsing-dot"></div>
            <span>Emergency Response Active</span>
            {hasLowBalance && (
              <span className="emergency-mode">• Free Emergency Mode</span>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .low-balance-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
          padding: 1rem;
          border-radius: 12px;
          border-left: 4px solid #f59e0b;
          margin-top: 1rem;
        }

        .alert-icon {
          font-size: 1.5rem;
        }

        .alert-text strong {
          display: block;
          color: #92400e;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .alert-text p {
          margin: 0;
          color: #78350f;
          font-size: 0.75rem;
        }

        .value.low-balance {
          color: #dc2626;
          font-weight: 700;
          background: #fef2f2;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .emergency-mode {
          color: #fbbf24;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default App;
