import React, { useState, useEffect } from 'react';

const SOSButton = ({ onPress, isActive, userProfile }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);

  const handleMouseDown = () => {
    if (isActive) return;

    setIsPressed(true);

    // Start countdown for long press
    const timer = setTimeout(() => {
      setCountdown(3);
      startCountdown();
    }, 500); // 0.5 second before countdown starts

    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    setIsPressed(false);

    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    if (countdown !== null) {
      setCountdown(null);
    }
  };

  const startCountdown = () => {
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);

      if (count <= 0) {
        clearInterval(countdownInterval);
        setCountdown(null);
        setIsPressed(false);
        onPress();
      }
    }, 1000);
  };

  const handleQuickPress = () => {
    if (!isActive && countdown === null) {
      onPress();
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  return (
    <div className="sos-container">
      <div className="sos-instructions">
        <h3>Emergency SOS</h3>
        <p>Click once for immediate emergency or hold for 3 seconds</p>
        <div className="emergency-types">
          <span className="emergency-type">🚑 Medical</span>
          <span className="emergency-type">🚨 Accident</span>
          <span className="emergency-type">🔥 Fire</span>
          <span className="emergency-type">⚡ Other</span>
        </div>
      </div>

      <div className="sos-button-wrapper">
        <button
          className={`sos-button ${isActive ? 'active' : ''} ${isPressed ? 'pressed' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleQuickPress}
          disabled={isActive}
        >
          <div className="sos-content">
            {countdown !== null ? (
              <div className="countdown">
                <span className="countdown-number">{countdown}</span>
                <span className="countdown-text">Activating...</span>
              </div>
            ) : (
              <>
                <div className="sos-icon">
                  {isActive ? '✅' : '🚨'}
                </div>
                <div className="sos-text">
                  <span className="sos-main">
                    {isActive ? 'EMERGENCY ACTIVE' : 'SOS'}
                  </span>
                  <span className="sos-sub">
                    {isActive ? 'Help is on the way' : 'Emergency'}
                  </span>
                </div>
              </>
            )}
          </div>

          {isActive && (
            <div className="ripple-effect">
              <div className="ripple"></div>
              <div className="ripple"></div>
              <div className="ripple"></div>
            </div>
          )}
        </button>

        {isActive && (
          <div className="emergency-status">
            <div className="status-item">
              <span className="status-icon">📍</span>
              <span className="status-text">Location Shared</span>
            </div>
            <div className="status-item">
              <span className="status-icon">📞</span>
              <span className="status-text">Contacts Notified</span>
            </div>
            <div className="status-item">
              <span className="status-icon">🏥</span>
              <span className="status-text">Hospitals Alerted</span>
            </div>
          </div>
        )}
      </div>

      <div className="quick-info">
        <div className="info-item">
          <span className="info-label">Your Blood Group:</span>
          <span className="info-value">{userProfile.bloodGroup}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Emergency Contact:</span>
          <span className="info-value">{userProfile.emergencyContact}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Medical Conditions:</span>
          <span className="info-value">{userProfile.medicalConditions.join(', ')}</span>
        </div>
      </div>

      <style jsx>{`
        .sos-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
          border-radius: 20px;
          margin: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .sos-instructions {
          text-align: center;
          margin-bottom: 2rem;
        }

        .sos-instructions h3 {
          margin: 0 0 0.5rem 0;
          color: #92400e;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .sos-instructions p {
          margin: 0 0 1rem 0;
          color: #78350f;
          font-size: 0.875rem;
        }

        .emergency-types {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .emergency-type {
          background: rgba(255, 255, 255, 0.7);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          color: #92400e;
          font-weight: 600;
        }

        .sos-button-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sos-button {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
          overflow: hidden;
        }

        .sos-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 12px 32px rgba(220, 38, 38, 0.5);
        }

        .sos-button.pressed {
          transform: scale(0.95);
          box-shadow: 0 4px 16px rgba(220, 38, 38, 0.6);
        }

        .sos-button.active {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          animation: pulse-active 2s infinite;
        }

        .sos-button:disabled {
          cursor: not-allowed;
        }

        .sos-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          z-index: 2;
          position: relative;
        }

        .sos-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .sos-text {
          text-align: center;
        }

        .sos-main {
          display: block;
          font-size: 1.25rem;
          font-weight: bold;
          letter-spacing: 0.05em;
        }

        .sos-sub {
          display: block;
          font-size: 0.875rem;
          opacity: 0.9;
          margin-top: 0.25rem;
        }

        .countdown {
          text-align: center;
        }

        .countdown-number {
          display: block;
          font-size: 4rem;
          font-weight: bold;
          line-height: 1;
        }

        .countdown-text {
          display: block;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .ripple-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
        }

        .ripple {
          position: absolute;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          animation: ripple 2s infinite;
        }

        .ripple:nth-child(1) {
          animation-delay: 0s;
        }

        .ripple:nth-child(2) {
          animation-delay: 0.7s;
        }

        .ripple:nth-child(3) {
          animation-delay: 1.4s;
        }

        .emergency-status {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #059669;
          font-weight: 600;
        }

        .status-icon {
          font-size: 1.25rem;
        }

        .quick-info {
          margin-top: 2rem;
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          min-width: 300px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          padding: 0.25rem 0;
          border-bottom: 1px solid rgba(146, 64, 14, 0.1);
        }

        .info-label {
          font-weight: 600;
          color: #92400e;
          font-size: 0.875rem;
        }

        .info-value {
          color: #78350f;
          font-size: 0.875rem;
          font-weight: 500;
        }

        @keyframes pulse-active {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(5, 150, 105, 0.4);
          }
          50% {
            box-shadow: 0 12px 32px rgba(5, 150, 105, 0.6);
          }
        }

        @keyframes ripple {
          0% {
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            top: -10px;
            left: -10px;
            width: calc(100% + 20px);
            height: calc(100% + 20px);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .sos-button {
            width: 150px;
            height: 150px;
          }

          .sos-icon {
            font-size: 2.5rem;
          }

          .sos-main {
            font-size: 1rem;
          }

          .countdown-number {
            font-size: 3rem;
          }

          .quick-info {
            min-width: auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SOSButton;
