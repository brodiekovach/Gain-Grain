"use client";
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";

export default function UploadProgressPicture() {
  const [pic, setPic] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null)

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
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpload = async () => {
    if (!pic) {
      setError('Please select a file to upload.');
      return;
    }

    try {
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

      const progressPicPath = '/uploads/' + uploadResult.fileName;

      const postResponse = await fetch('/api/posts/post-progress-pic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, progressPic: progressPicPath }),
      });

      const result = await postResponse.json();
      if (!result.success) {
        console.error(result.message);
        setError(result.message);
        return;
      }

      const savedPost = await fetch('/api/posts/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            userId: user._id,
            postType: 'ProgressPic',
            postData: {
                progressPic: progressPicPath,
                date: new Date(),
            }
        }),
      });

      const postResult = await savedPost.json();

      if(!postResult.success) {
          setError('Failed to post progress picture.');
          return;
      }

      alert('Progress picture uploaded successfully!');
      window.location.href = '/post'
    } catch (err) {
      console.log(err);
      setError('Failed to upload file.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Upload Progress Picture</h1>
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="mt-4">
          <label className="text-lg">Progress Picture: </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPic(e.target.files[0])}
            className="border p-2 rounded-md"
          />
        </div>

        <button onClick={handleUpload} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
          Upload
        </button>
      </div>
    </div>
  );
}
