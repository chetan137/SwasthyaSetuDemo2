import React, { useState, useEffect } from 'react';

const Header = ({ userProfile }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-section">
          <h1 className="app-title">
            <span className="logo-icon">🏥</span>
            Swasthya Setu
          </h1>
          <p className="app-subtitle">Emergency Response System</p>
        </div>
      </div>

      <div className="header-center">
        <div className="emergency-info">
          <div className="hotline">
            <span className="hotline-label">Emergency Hotline:</span>
            <span className="hotline-number">108</span>
          </div>
          <div className="location-indicator">
            <span className="location-icon">📍</span>
            <span className="location-text">{userProfile.location.address}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="user-section">
          <div className="user-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="user-details">
            <span className="user-name">{userProfile.name}</span>
            <span className="blood-type">{userProfile.bloodGroup}</span>
          </div>
          <div className="current-time">
            <span className="time-label">Current Time:</span>
            <span className="time-value">
              {currentTime.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .app-header {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          flex: 1;
        }

        .logo-section {
          display: flex;
          flex-direction: column;
        }

        .app-title {
          display: flex;
          align-items: center;
          margin: 0;
          font-size: 1.75rem;
          font-weight: bold;
          letter-spacing: -0.025em;
        }

        .logo-icon {
          margin-right: 0.75rem;
          font-size: 2rem;
        }

        .app-subtitle {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.9;
          font-weight: 400;
          margin-left: 2.75rem;
          margin-top: -0.25rem;
        }

        .header-center {
          flex: 2;
          display: flex;
          justify-content: center;
        }

        .emergency-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .hotline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .hotline-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .hotline-number {
          font-size: 1.25rem;
          font-weight: bold;
          color: #fef3c7;
        }

        .location-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .location-icon {
          font-size: 1rem;
        }

        .header-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .user-avatar {
          background: rgba(255, 255, 255, 0.2);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-icon {
          font-size: 1.25rem;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .blood-type {
          font-size: 0.75rem;
          background: #fef3c7;
          color: #92400e;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
          align-self: flex-start;
        }

        .current-time {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .time-label {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .time-value {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          font-size: 0.875rem;
          color: #fef3c7;
        }

        @media (max-width: 768px) {
          .app-header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .header-left,
          .header-center,
          .header-right {
            flex: none;
          }

          .emergency-info {
            flex-direction: row;
            gap: 1rem;
          }

          .user-section {
            gap: 0.5rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
