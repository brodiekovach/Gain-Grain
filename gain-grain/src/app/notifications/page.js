"use client"
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Link from 'next/link';

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

<<<<<<< HEAD
  const handleDismiss = async(id) => {
    try {
      const response = await fetch('/api/notifications/dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      if (response.ok) {
        setNotifications(notifications.filter((notif, index) => index !== id));
      }
    } catch (error) {
      console.error("Failed to dismiss notification:", error);
    }

  };
=======
  const handleDismiss = async(index, notif) => {
    setNotifications(notifications.filter((_, i) => i !== index));
>>>>>>> refs/remotes/origin/main

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
<<<<<<< HEAD
            
            <div
              key={index}
              className={`notification-item p-4 mb-2 rounded-lg shadow-md ${getNotificationStyle(notif.type || 'info')}`}
=======
            <div
              key={index}
              className={`notification-item p-4 mb-2 rounded-lg shadow-md`}
>>>>>>> refs/remotes/origin/main
            >
              <div className="flex justify-between items-center">
                <span>{notif}</span>
                <button
                  className="ml-4 text-red-500 font-bold"
<<<<<<< HEAD
                  onClick={() => handleDismiss(index)}
=======
                  onClick={() => handleDismiss(index, notif)}
>>>>>>> refs/remotes/origin/main
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
