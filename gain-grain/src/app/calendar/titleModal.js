import React from 'react';
import './modal.css'; // Import your CSS for styling

const TitleModal = ({ show, onClose, onSave, title, setTitle }) => {
    if (!show) return null;

    const handleSave = () => {
        if (title.trim()) {
            onSave(title); // Save the title using the provided callback
            setTitle(''); // Clear the title after saving
            onClose(); // Close the modal
        } else {
            alert('Please enter a workout title'); // Alert if no title is entered
        }
    };

    return (
        <div className="title-modal-overlay">
            <div className="title-modal-content">
                <h3>Save Workout</h3>
                <div className='title-container'>
                <input    
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} // Update title state on input change
                    placeholder="Enter Workout Title"
                />
                </div>
                <button className='title-btn' onClick={handleSave}>Save</button>
                <button className='title-btn' onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default TitleModal;
