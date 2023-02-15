import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  // state pour l'affichage des btn connexion et inscription
  const [isBtn, setIsBtn] = useState(false);

  // animation griffes de wolverine
  const refWolverine = useRef(null);

  // s'éxécute après le montage du composant == après return
  useEffect(
    () => {
      // ajoute une classe pour l'affichage des griffe de wolverine
      refWolverine.current.classList.add("startingImg");

      setTimeout(() => {
        refWolverine.current.classList.remove("startingImg");
        setIsBtn(true);
      }, 3000);
    },
    // le useEffect s'effectuera qu'une seul fois == au montage
    []
  );

  const onLeftOver = () => {
    refWolverine.current.classList.add("leftImg");
  };

  const onRightOver = () => {
    refWolverine.current.classList.add("rightImg");
  };

  const clearImg = () => {
    if(refWolverine.current.classList.contains("leftImg")){
      refWolverine.current.classList.remove("leftImg");
    } else {
      refWolverine.current.classList.remove("rightImg");
    }
  };

  const displayBtn = isBtn && (
    <>
      <div onMouseOver={onLeftOver} onMouseOut={clearImg} className="leftBox">
        <Link to="/signup" className="btn-welcome">Inscription</Link>
      </div>
      <div onMouseOver={onRightOver} onMouseOut={clearImg} className="rightBox">
        <Link to="/login" className="btn-welcome">Connexion</Link>
      </div>
    </>
  );

  return (
    <main ref={refWolverine} className="welcomePage">
      {displayBtn}
    </main>
  );
};

export default Landing;
