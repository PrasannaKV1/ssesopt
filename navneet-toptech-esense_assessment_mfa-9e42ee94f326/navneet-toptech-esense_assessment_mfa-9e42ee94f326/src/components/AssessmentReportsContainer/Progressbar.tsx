import React from "react";
import Tooltip from '@mui/material/Tooltip';
import './Progressbar.css'

interface ProgressBarProps {
    score: any; // Add a type annotation for the score property
  }

const ProgressBar : React.FC<ProgressBarProps> = ({score}) => {
    const correctPercent = Math.round((score.correctQuestionCount * 100) / score.totalQuestionCount); // correction question percentage
    const revisedPercent = Math.round((score.revisedQuestionsCount * 100) / score.totalQuestionCount); // Revised question percentage
    const skippedPercent = Math.round((score.skippedQuestionCount * 100) / score.totalQuestionCount); // Skipped question percentage
    const incorrectPercent = Math.round((score.incorrectQuestionCount * 100) / score.totalQuestionCount); // incorrection question percentage
    return (
      <>
      <Tooltip title={`${correctPercent} % of its items answered correctly`}>
      <div className="progress-container">
        <div className="student-progress-bar-correct" style={{ width: `${correctPercent}%` }}>
            <span>{correctPercent}%</span>
        </div>
        <div className="student-progress-bar-incorrect" style={{ width: `${incorrectPercent}%` }}></div>
        <div className="student-progress-bar-revised" style={{ width: `${revisedPercent}%` }}></div>
        <div className="student-progress-bar-skipped" style={{ width: `${skippedPercent}%` }}></div>
      </div>
      </Tooltip>
      </>
    );
  };

  export default ProgressBar;