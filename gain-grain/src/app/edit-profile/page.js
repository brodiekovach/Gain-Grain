"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";

export default function EditProfile() {
  const [user, setUser] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
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
      if(profilePic) {
        const formData = new FormData();
        formData.append('profilePic', profilePic);

        const uploadResponse = await fetch('/api/profile/upload-profilePic', {
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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleProfileSave}>
          <div className="mt-4">
            <div className="flex flex-col">
              {/* change your name */}
              <label className="text-lg">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded-md"
              />
              </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-col">
            {/* change your username */}
              <label className="text-lg">Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border p-2 rounded-md"
              />
          </div>
          <div className="mt-4">
            {/* change your bio */}
            <div className="flex flex-col">
              <label className="text-lg">Bio:</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="border p-2 rounded-md"
              />
              </div>
            </div>

            <div className="flex flex-col mt-4">
              {/* add a profile picture */}
              <label className="text-lg">Profile Picture:</label>
              <input
                  type="file"
                  accept="image/*"
                  id="profilePic"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
            </div>

            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
