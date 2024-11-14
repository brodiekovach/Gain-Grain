"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";

export default function EditProfile() {
  const [user, setUser] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [pic, setPic] = useState('');
  const [profilePicPath, setProfilePicPath] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile/get-user-from-session', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if(data.success) {
          setUser(data.user);
          setUserId(data.user._id)
          setUsername(data.user.username);
          setName(data.user.name);
          setBio(data.user.bio);
          setProfilePicPath(data.user.profilePic);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      const findUserResponse = await fetch('/api/profile/get-user-by-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const findUserResult = await findUserResponse.json();
      if ((user.username != username) && findUserResult.success) {
        setError('Username already exists.');
        return;
      }
    } catch (err) {
      setError(err.message);
      return;
    }

    let updatedProfilePicPath = profilePicPath;

    try {
      if(pic) {
        const formData = new FormData();
        formData.append('pic', pic);

        const uploadResponse = await fetch('/api/profile/upload-pic', {
          method: 'POST',
          body: formData,
        });
  
        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
          setError(uploadResult.message);
          return;
        }

        updatedProfilePicPath = '/uploads/' + uploadResult.fileName;
      }

      const updateResponse = await fetch('/api/profile/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, username, name, bio, profilePicPath: updatedProfilePicPath }),
      });

      const updateResult = await updateResponse.json();
      if (!updateResult.success) {
        setError(updateResult.message);
        return;
      }

      window.location.href = `/profile/?userId=${userId}`;
    } catch (err) {
      setError(err.message);
      return;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8 max-w-lg border-2 border-blue-300 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-black text-center mb-6">Edit Profile</h1>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleProfileSave} className="bg-white shadow-md rounded-lg p-6 space-y-6">
          
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="profilePic" className="text-black text-lg mb-2">Profile Picture</label>
          <div className="relative mb-3 flex flex-col items-center">
            {profilePicPath && (
              
              <img
                src={profilePicPath}
                alt="Current Profile Picture"
                className="w-24 h-24 rounded-full object-cover border mb-4"
              />
            )}
            <input
              type="file"
              accept="image/*"
              id="profilePic"
              onChange={(e) => setPic(e.target.files[0])}
              className="file:bg-black file:text-white file:py-1 file:px-4 file:rounded file:border-none file:cursor-pointer"
            />
          </div>
        </div>

          <div>
            <label className="text-black text-lg font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="text-black text-lg font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="text-black text-lg font-medium mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              rows="4"
            />
          </div>

          <button className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
