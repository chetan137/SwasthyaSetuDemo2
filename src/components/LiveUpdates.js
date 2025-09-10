import React, { useRef, useEffect } from 'react';

const LiveUpdates = ({ updates, isEmergencyActive }) => {
  const updatesEndRef = useRef(null);

  const scrollToBottom = () => {
    updatesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [updates]);

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'info': return '🔄';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📍';
    }
  };

  const getTimeElapsed = (timestamp) => {
    const now = new Date();
    const updateTime = new Date();
    const [hours, minutes, seconds] = timestamp.split(':');
    updateTime.setHours(hours, minutes, seconds);

    const diff = Math.abs(now - updateTime) / 1000;

    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="live-updates">
      <div className="updates-header">
        <h3>📊 Emergency Timeline</h3>
        <div className="status-indicator">
          <div className={`status-dot ${isEmergencyActive ? 'active' : 'inactive'}`}></div>
          <span className="status-text">
            {isEmergencyActive ? 'Live Response' : 'Standby Mode'}
          </span>
        </div>
      </div>

      <div className="updates-container">
        {updates.length === 0 ? (
          <div className="no-updates">
            <div className="no-updates-icon">⏰</div>
            <p>No emergency activity</p>
            <span>Response timeline will appear here during emergencies</span>
          </div>
        ) : (
          <div className="timeline">
            {updates.map((update, index) => (
              <div key={update.id} className={`timeline-item timeline-${update.type}`}>
                <div className="timeline-marker">
                  <div className="timeline-icon">
                    {getUpdateIcon(update.type)}
                  </div>
                  <div className="timeline-connector"></div>
                </div>
                <div className="timeline-content">
                  <div className="update-message">
                    {update.message}
                  </div>
                  <div className="update-meta">
                    <span className="update-time">{update.timestamp}</span>
                    <span className="update-elapsed">{getTimeElapsed(update.timestamp)}</span>
                    <span className="update-step">Step {updates.length - index}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={updatesEndRef} />
          </div>
        )}
      </div>

      {isEmergencyActive && (
        <div className="emergency-footer">
          <div className="emergency-stats">
            <div className="stat-item">
              <span className="stat-value">{updates.length}</span>
              <span className="stat-label">Updates</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {updates.length > 0 ? getTimeElapsed(updates[0].timestamp) : '0s'}
              </span>
              <span className="stat-label">Since Start</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Live</span>
              <span className="stat-label">Status</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .live-updates {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin: 1rem;
          overflow: hidden;
          border: 2px solid #f3f4f6;
          display: flex;
          flex-direction: column;
          max-height: 500px;
        }

        .updates-header {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .updates-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .status-dot.active {
          background: #fbbf24;
          animation: pulse-status 1.5s infinite;
        }

        .status-dot.inactive {
          background: rgba(255, 255, 255, 0.5);
        }

        .status-text {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .updates-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .no-updates {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        .no-updates-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .no-updates p {
          margin: 0 0 0.5rem 0;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .no-updates span {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .timeline {
          position: relative;
        }

        .timeline-item {
          display: flex;
          margin-bottom: 1.5rem;
          position: relative;
          animation: slideInUp 0.3s ease-out;
        }

        .timeline-item:last-child .timeline-connector {
          display: none;
        }

        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 1rem;
          position: relative;
        }

        .timeline-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 3px solid #059669;
          position: relative;
          z-index: 2;
        }

        .timeline-success .timeline-icon {
          border-color: #059669;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        }

        .timeline-info .timeline-icon {
          border-color: #2563eb;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        }

        .timeline-warning .timeline-icon {
          border-color: #d97706;
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        }

        .timeline-connector {
          width: 3px;
          height: 30px;
          background: linear-gradient(to bottom, #059669, #047857);
          margin-top: 5px;
          position: relative;
          z-index: 1;
        }

        .timeline-content {
          flex: 1;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          backdrop-filter: blur(10px);
          position: relative;
        }

        .timeline-content::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 15px;
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-right: 8px solid #e2e8f0;
        }

        .timeline-content::after {
          content: '';
          position: absolute;
          left: -7px;
          top: 15px;
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-right: 8px solid rgba(255, 255, 255, 0.9);
        }

        .update-message {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .update-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .update-time {
          font-weight: 600;
          color: #059669;
        }

        .update-elapsed {
          font-style: italic;
        }

        .update-step {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
          color: #475569;
        }

        .emergency-footer {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          padding: 1rem;
        }

        .emergency-stats {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: bold;
          color: #059669;
        }

        .stat-label {
          display: block;
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-status {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        .updates-container::-webkit-scrollbar {
          width: 6px;
        }

        .updates-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .updates-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .updates-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (max-width: 768px) {
          .live-updates {
            margin: 0.5rem;
          }

          .updates-header {
            padding: 1rem;
          }

          .updates-container {
            padding: 0.75rem;
          }

          .timeline-item {
            margin-bottom: 1rem;
          }

          .timeline-marker {
            margin-right: 0.75rem;
          }

          .timeline-icon {
            width: 32px;
            height: 32px;
            font-size: 1rem;
          }

          .timeline-content {
            padding: 0.75rem;
          }

          .update-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .emergency-stats {
            flex-direction: row;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveUpdates;
