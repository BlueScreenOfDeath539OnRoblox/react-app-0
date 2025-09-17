import React, { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import './CaptchaVerification.css';

function CaptchaVerification({ onVerify }) {
    const [isVerified, setIsVerified] = useState(false);

    const handleVerify = (token) => {
        if (token) {
            setIsVerified(true);
            if (onVerify) onVerify(true);
            // Store verification in sessionStorage so it persists during the session
            sessionStorage.setItem('captchaVerified', 'true');
        }
    };

    useEffect(() => {
        // Check if already verified in this session
        const verified = sessionStorage.getItem('captchaVerified');
        if (verified === 'true') {
            setIsVerified(true);
            if (onVerify) onVerify(true);
        }
    }, [onVerify]);

    if (isVerified) {
        return null;
    }

    return (
        <div className="captcha-overlay">
            <div className="captcha-container">
                <h2>Verify you're human</h2>
                <ReCAPTCHA
                    sitekey="6Ldg_csrAAAAABu59hKTmu-nF5pSnqweGyt5_P1E"
                    onChange={handleVerify}
                />
            </div>
        </div>
    );
}

export default CaptchaVerification;