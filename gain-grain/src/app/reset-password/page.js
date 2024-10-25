"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './reset.module.css'

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const [tokenData, setTokenData] = useState(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
      
        if (token) {
            fetch('/api/reset-password/validate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setIsValidToken(true);
                    setTokenData(data.token);
                } else {
                    setErrorMessage(data.message);
                }
            })
            .catch(error => {
                setErrorMessage('Error validating token.');
                console.log('Error: ', error)
            });
        } else {
            setErrorMessage('Please use the correct link sent in the reset password email.')
        }
      }, [searchParams]);

    const handlePasswordReset = async(e) => {
        e.preventDefault();

        if(!newPassword) {
            showAlert('Please enter a new password.');
            return;
        } else if(newPassword.length < 12) {
            showAlert('New password must be at least 12 characters.');
            return;
        } else if(!(/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword))) {
            showAlert('New password must contain uppercase and lowercase letters');
            return;
        } else if(!(/\d/.test(newPassword))) {
            showAlert('New password must contain numbers');
            return;
        } else if(!(/[^A-Za-z0-9]/.test(newPassword))) {
            showAlert('New password must contain a special character');
            return;
        } else if(!confirmNewPassword) {
            showAlert('Please confirm your new password.');
            return;
        }

        if(newPassword !== confirmNewPassword) {
            showAlert('Passwords do not match');
            return;
        }

        try {
            const userEmail = tokenData.email;

            const response = await fetch('/api/reset-password/reset-password-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, newPassword }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                const reset_token = tokenData.reset_token;

                await fetch('/api/reset-password/remove-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ reset_token }),
                });

                showAlert('Password reset successfully. Redirecting to login page...');
                await new Promise(r => setTimeout(r, 3000));
                window.location.href = '/login';
            } else {
                showAlert(data.message || 'Something went wrong');
            }
        } catch (error) {
            showAlert('Failed to reset password. Try again.');
            console.error('Error: ', error);
        }
    }

    const showAlert = (message) => {
        const alertContainer = document.getElementById('alert-container');
        const alertMessage = document.getElementById('alert-message');
    
        alertMessage.textContent = message;
        alertContainer.classList.remove('hidden');
    
        setTimeout(() => {
          alertContainer.classList.add('hidden');
        }, 10000);
    
        document.getElementById('alert-close').addEventListener('click', () => {
          alertContainer.classList.add('hidden');
        });
    };

    return(
        <div className={styles.body}>
            <div id="alert-container" className={`${styles.alert} hidden`}>
                <span id="alert-message"></span>
                <button id="alert-close">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button> {}
            </div>
            <div className={styles.wrapper}>
                <form onSubmit={handlePasswordReset}>
                {isValidToken ? (
                    <>
                        <div className={styles['reset']}>
                            <p className={styles['reset-title']}>Reset Password</p>
                            <p className={styles['reset-message']}>Enter a new password for your account</p>
                        </div>
                        <div className={styles['input-box']}>
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button 
                                className={styles.togglePassword}
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? 'Hide' : 'Show'}  
                            </button>
                        </div>
                        <div className={styles['input-box']}>
                            <input 
                                type={showConfirmedPassword ? 'text' : 'password'} 
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                            <button 
                                className={styles.togglePassword}
                                type="button"
                                onClick={() => setShowConfirmedPassword((prev) => !prev)}
                            >
                                {showConfirmedPassword ? 'Hide' : 'Show'}  
                            </button>
                        </div>
                        <div className={styles.passwordRequirements}>
                            <p className={styles.requirementsTitle}>Password must meet the following requirements:</p>
                            <li className={styles.requirements}>At least 12 characters</li>
                            <li className={styles.requirements}>Contain upper and lowercase letters</li> 
                            <li className={styles.requirements}>Must contain numbers</li>
                            <li className={styles.requirements}>Must contain a special character</li>
                        </div>
                        <button type="submit" className={styles.btn}>Reset Password</button>
                    </>
                ) : (
                    <p className={styles.error}>{errorMessage}</p>
                )}
                </form>
            </div>
        </div>
    );
}