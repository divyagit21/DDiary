import { useEffect } from "react";
import './CustomAlert.css'
const CustomAlert = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose(); 
      }, 1500);
      
      return () => clearTimeout(timer); 
    }
  }, [message, onClose]);
  
  if (!message) return null;
  return (
    <div className="custom-alert">
      <span className="custom-alert-message">{message}</span>
      <button className="custom-alert-close" onClick={onClose} aria-label="Close alert">×</button>
    </div>
  );
};

export default CustomAlert;
