import { useEffect, useState } from 'react';
import AppConst from './services/AppConst';
import './Loading.css';

const Loading = ({ loadingData }) => {

    const isLoading = loadingData.getLoadingUsage() !== AppConst.DIALOG_USAGE.NONE;
    const message = loadingData.getLoadingMessage();

    const [shouldRender, setShouldRender] = useState(isLoading);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setShouldRender(true);
            // Small delay to ensure the DOM is ready for the "open" animation
            setTimeout(() => setIsAnimating(true), 10);
            document.body.style.overflow = 'hidden';
        } else {
            setIsAnimating(false);
            // Wait for the CSS animation (0.3s) before removing from DOM
            const timer = setTimeout(() => setShouldRender(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!shouldRender) return null;

    return (
        <div className={`loading-backdrop ${isAnimating ? 'active' : 'closing'}`}>
            <div className="loading-content">
                <div className="loading-spinner"></div>
                <label className="loading-message">{message}</label>
            </div>
        </div>
    );
};

export default Loading;