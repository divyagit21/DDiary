import './ConfirmationAlert.css'
const ConfirmationAlert = ({ isOpen, onClose, onConfirm,message,type}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button className="modal-btn confirm" onClick={onConfirm}>Yes, {type}</button>
          <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationAlert;
