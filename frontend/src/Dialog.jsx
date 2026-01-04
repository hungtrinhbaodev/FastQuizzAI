import { useEffect, useState } from 'react';
import {FaTimesCircle} from 'react-icons/fa'
import AppConst from './services/AppConst';
import './Dialog.css';

const Dialog = ({dialogData, onClose, children}) => {

  const isOpen = dialogData.usage !== AppConst.DIALOG_USAGE.NONE;

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  const onCloseWrapper = () => {
    if (dialogData.canClose && isAnimating) {
      onClose();
    }
  }

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`dialog-backdrop ${isAnimating ? 'active' : 'closing'}`} 
      onClick={onCloseWrapper}
    >
      <div 
        className="dialog-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ width: dialogData.width, height: dialogData.height, maxWidth: '100vw' }}
      >
        <div className="dialog-header">
          <label className='title'>{dialogData.title}</label>
          {dialogData.canClose && (
            <FaTimesCircle 
              className="close-x" 
              onClick={() => {onCloseWrapper()}}
            />
          )}
        </div>
        <div className="dialog-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;