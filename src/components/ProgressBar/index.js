import {memo} from "react";

const ProgressBar = ({questionLevel, totalQuestions}) => {

  const getProgressionPourcent = (questionLevel, totalQuestions) => {
    return Math.round((questionLevel / totalQuestions) * 100);
  };  

  return (
    <>
      <div className="percentage">
        <div className="progressPercent">{`Question: ${questionLevel}/${totalQuestions}`}</div>
        <div className="progressPercent">Progression: {getProgressionPourcent(questionLevel, totalQuestions)}%</div>
      </div>
      <div className="progressBar">
        <div className="progressBarChange" style={{ width: `${getProgressionPourcent(questionLevel, totalQuestions)}%` }}></div>
      </div>
    </>
  );
};

// Evite que ce composant soit rendu à chaque click
// uniquement rendu si les params change
export default memo(ProgressBar);
