import React, { useEffect, useRef } from 'react';

const NotificationPanel = ({ notifications, onClear }) => {
  const notificationSound = useRef(null);

  useEffect(() => {
    // Play notification sound when new notification arrives
    if (notifications.length > 0) {
      // Create audio context for notification sound
      if ('AudioContext' in window || 'webkitAudioContext' in window) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();

        // Create a simple beep sound
        const playNotificationSound = (type) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          // Different frequencies for different notification types
          const frequencies = {
            emergency: 800,
            success: 600,
            info: 500
          };

          oscillator.frequency.setValueAtTime(frequencies[type] || 500, audioContext.currentTime);
          oscillator.type = 'sine';

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        };

        if (notifications.length > 0) {
          playNotificationSound(notifications[0].type);
        }
      }
    }
  }, [notifications.length]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'emergency': return '#dc2626';
      case 'success': return '#059669';
      case 'info': return '#2563eb';
      default: return '#6b7280';
    }
  };

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h3>🔔 Live Notifications</h3>
        {notifications.length > 0 && (
          <button onClick={onClear} className="clear-btn">
            Clear All
          </button>
        )}
      </div>

      <div className="notifications-container">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <div className="no-notifications-icon">🔕</div>
            <p>No notifications yet</p>
            <span>Emergency alerts will appear here</span>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification notification-${notification.type}`}
              style={{ '--notification-color': getNotificationColor(notification.type) }}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-timestamp">
                  {notification.timestamp}
                </div>
              </div>
              <div className="notification-pulse"></div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .notification-panel {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin: 1rem;
          overflow: hidden;
          border: 2px solid #f3f4f6;
        }

        .panel-header {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .clear-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .notifications-container {
          max-height: 400px;
          overflow-y: auto;
          padding: 1rem;
        }

        .no-notifications {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        .no-notifications-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .no-notifications p {
          margin: 0 0 0.5rem 0;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .no-notifications span {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .notification {
          display: flex;
          align-items: flex-start;
          padding: 1rem;
          margin-bottom: 0.75rem;
          border-radius: 12px;
          border-left: 4px solid var(--notification-color);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
          backdrop-filter: blur(10px);
          position: relative;
          animation: slideIn 0.3s ease-out;
          transition: all 0.2s ease;
        }

        .notification:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .notification-emergency {
          background: linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(252, 231, 243, 0.9) 100%);
          border-left-color: #dc2626;
        }

        .notification-success {
          background: linear-gradient(135deg, rgba(240, 253, 250, 0.9) 0%, rgba(236, 253, 245, 0.9) 100%);
          border-left-color: #059669;
        }

        .notification-info {
          background: linear-gradient(135deg, rgba(239, 246, 255, 0.9) 0%, rgba(219, 234, 254, 0.9) 100%);
          border-left-color: #2563eb;
        }

        .notification-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
        }

        .notification-message {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .notification-timestamp {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        .notification-pulse {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 8px;
          height: 8px;
          background: var(--notification-color);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        .notifications-container::-webkit-scrollbar {
          width: 6px;
        }

        .notifications-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .notifications-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .notifications-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (max-width: 768px) {
          .notification-panel {
            margin: 0.5rem;
          }

          .panel-header {
            padding: 1rem;
          }

          .notifications-container {
            padding: 0.75rem;
            max-height: 300px;
          }

          .notification {
            padding: 0.75rem;
            margin-bottom: 0.5rem;
          }

          .notification-icon {
            font-size: 1.25rem;
            margin-right: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationPanel;
