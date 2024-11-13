'use client';

import Navbar from '../../../components/Navbar'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreateBlogPost = () => {
    const [userId, setUserId] = useState('');
    const [postContent, setPostContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');

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
    
            if (data.success) {
              setUserId(data.user._id);
            }
          } catch (error) {
            console.error(error);
            return;
          }
        };
    
        fetchUserData();
      }, []);

    const handleChange = (value) => {
        setPostContent(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, title, content: postContent }), 
            });

            const blogResult = await response.json();

            if(!blogResult.success) {
                setError('Failed to submit blog post');
                return;
            }

            const savedPost = await fetch('/api/posts/save-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId,
                    postType: 'Blog',
                    postData: {
                        title, 
                        content: postContent,
                        date: new Date(),
                    }
                }),
            });

            const postResult = await savedPost.json();

            if(!postResult.success) {
                setError('Failed to submit post');
                return;
            } else {
                console.log('Blog post submitted');
                setSuccess('Blog post submitted successfully!');
                setPostContent(''); 
                await new Promise(r => setTimeout(r, 2000));
                window.location.href = '/post';
            }
        } catch (error) {
            console.error('Error submitting blog post:', error);
            setError('Error submitting blog post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col overflow-hidden">
            <Navbar /> 
            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Create a Blog Post</h1>
                <form onSubmit={handleSubmit}>
                    <label className="text-lg">:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded-md"
                    />
                    <ReactQuill
                        value={postContent}
                        onChange={handleChange}
                        placeholder="Write your blog post..."
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['link', 'image'],
                                ['clean']
                            ],
                        }}
                        formats={[
                            'header', 'bold', 'italic', 'underline', 'strike',
                            'list', 'bullet', 'link', 'image',
                        ]}
                        className="mb-4"
                    />
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading} 
                    >
                        {loading ? 'Submitting...' : 'Submit Post'}
                    </button>
                </form>

                {success && <p className="text-green-500 mt-4">{success}</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default CreateBlogPost;
