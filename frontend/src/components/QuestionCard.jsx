import React from "react";
import './QuestionCard.css'

const QuestionCard = ({ question, value, onChange }) => {
    const handleClick = (num) => {
        if (value === num) {
            onChange(null);
        } else {
            onChange(num);
        }
    };
    console.log("render ");
    return (
        <div className="question-card">
            <p className="question-text">{question}</p>
            <div className="scale-buttons">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        className={`scale-btn ${value === num ? "selected" : ""}`}
                        onClick={() => handleClick(num)}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default React.memo(QuestionCard);
