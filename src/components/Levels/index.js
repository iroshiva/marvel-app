import { memo, useEffect, useState } from "react";
import Stepper from "react-stepper-horizontal";

const Levels = ({ level, levelNames }) => {
  const [levels, setLevels] = useState([]);
  // console.log(level);
  // fn qui prépare l'array pour Stepper à partir des nom des niveaux
  const stepperArray = () =>
    levelNames.map((levelName) => ({ title: levelName.toUpperCase() }));

  useEffect(() => {
    setLevels(stepperArray());
  }, [levelNames]);

  return (
    <div className="levelsContainer" style={{background: "transparent"}}>
      <Stepper 
        steps={levels} 
        activeStep={level} 
        orientation="horizontal" 
        circleTop={0}
        activeTitleColor={"#d31017"}
        activeColor={"#d31017"}
        completeTitleColor={"#E0E0E0"}
        defaultTitleColor={"#E0E0E0"}
        completeColor={"#E0E0E0"}
        completeBarColor={"#E0E0E0"}
        barStyle={"dashed"}
        size={45}
        circleFontSize={20}
      />
    </div>
  );
};

export default memo(Levels);
