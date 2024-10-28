"use client"
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";

export default function NotificationsPage() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile/get-user-from-session');

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          setNotifications(data.user.notifications);
        }
      } catch (error) {
        console.error("Failed to fetch user data:",error);
      }
    };

    fetchUserData();
  }, []);

  const handleDismiss = async(index, notif) => {
    setNotifications(notifications.filter((_, i) => i !== index));

    try {
      const response = await fetch('/api/notifications/dismiss-notifications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, notif })
      });

      const data = await response.json();

      if (data.success) {
          setNotifications(data.user.notifications);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="notifications-page p-4">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications</p>
        ) : (
          notifications.map((notif, index) => (
            <div
              key={index}
              className={`notification-item p-4 mb-2 rounded-lg shadow-md`}
            >
              <div className="flex items-center">
                {notif.profilePic ? (
                  <img
                    src={notif.profilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg>
                )}
                <div className="flex-grow">
                  <span className="block text-left">{notif}</span>
                  {notif.timestamp && (
                    <span className="text-gray-500 text-sm">{new Date(notif.timestamp).toLocaleString()}</span>
                  )}
                </div>
                <button
                  className="ml-4 text-red-500 font-bold"
                  onClick={() => handleDismiss(index, notif)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
