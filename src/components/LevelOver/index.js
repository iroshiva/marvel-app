import { forwardRef, memo, useEffect, useState } from "react";
import { GiTrophyCup } from "react-icons/gi";
import Loader from "../Loader";
import Modal from "../Modal";
import axios from "axios";

const LevelOver = forwardRef(
  (
    { levelNames, score, totalQuestions, percent, quizLevel, nextLevel },
    ref
  ) => {
    const averageGrade = totalQuestions / 2;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [characterData, setCharacterData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;
    const API_HASH = process.env.REACT_APP_MARVEL_HASH;

    // if (score < averageGrade) {
    //   setTimeout(() => {
    //     nextLevel(quizLevel);
    //   }, 3000);
    // }

    const showModal = (heroId) => {
      setIsModalOpen(true);

      const storageItem = JSON.parse(localStorage.getItem("marvelCharacter"));
      if (storageItem && storageItem.id === heroId) {
        setCharacterData(storageItem);
        setIsLoading(false);
      } else {
        axios
          .get(
            `https://gateway.marvel.com/v1/public/characters/${heroId}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${API_HASH}`
          )
          .then((response) => {
            localStorage.setItem(
              "marvelCharacter",
              JSON.stringify(response.data.data.results[0])
            );
            localStorage.setItem("marvelStorageDate", Date.now());
            setCharacterData(response.data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const hideModal = () => {
      setIsModalOpen(false);
      setIsLoading(true);
    };

    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const dataDisplay =
      score >= averageGrade ? (
        ref.map((question, index) => {
          return (
            <tr key={question.id}>
              <td>{question.question}</td>
              <td>{question.answer}</td>
              <td>
                <button
                  className="btnInfo"
                  onClick={() => showModal(question.heroId)}
                >
                  Infos
                </button>
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan="3">
            <Loader
              styling={{ textAlign: "center", color: "red" }}
              text="Pas de réponses!"
            />
          </td>
        </tr>
      );

    const messageDisplay =
      score >= averageGrade ? (
        <>
          {quizLevel < levelNames.length ? (
            <>
              <p className="successMsg">Bravo, passez au niveau suivant !</p>
              <button
                className="btnResult success"
                onClick={() => nextLevel(quizLevel)}
              >
                Niveau suivant
              </button>
            </>
          ) : (
            <>
              <p className="successMsg">
                <GiTrophyCup size="50px" /> Bravo, vous êtes un expert !
              </p>
              <button
                className="btnResult gameOver"
                onClick={() => nextLevel(0)}
              >
                Accueil
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <p className="failureMsg">Vous avez échoué !</p>
          <button
            className="btnResult success"
            onClick={() => nextLevel(quizLevel)}
          >
            Restart
          </button>
        </>
      );

    const modalContent = !isLoading ? (
      <>
        <div className="modalHeader">
          <h2>{characterData.data.results[0].name}</h2>
        </div>
        <div className="modalBody">
          <div className="comicImage">
            <img
              src={
                characterData.data.results[0].thumbnail.path +
                "." +
                characterData.data.results[0].thumbnail.extension
              }
              alt={characterData.data.results[0].name}
            />
            {characterData.attributionText}
          </div>
          <div className="comicDetails">
            <h3>Description</h3>
            {characterData.data.results[0].description ? (
              <p>{characterData.data.results[0].description}</p>
            ) : (
              <p>Description indisponible</p>
            )}
            <h3>Plus d'informations</h3>
            {characterData.data.results[0].urls &&
              characterData.data.results[0].urls.map((url, index) => {
                return (
                  <a
                    key={index}
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {capitalizeFirstLetter(url.type)}
                  </a>
                );
              })}
          </div>
        </div>
        <div className="modalFooter">
          <button className="modalBtn" onClick={hideModal}>
            Fermer
          </button>
        </div>
      </>
    ) : (
      <>
        <div className="modalHeader">
          <h2>Réponse de Marvel</h2>
        </div>
        <div className="modalBody">
          <Loader
            styling={{ textAlign: "center", color: "red" }}
            text="Chargement..."
          />
        </div>
        <div className="modalFooter">
          <button className="modalBtn">Fermer</button>
        </div>
      </>
    );

    // fn qui évalue le nombre de jours depuis la dernière requête
    // si >= 15 jours => clear storage
    const checkDataAge = (dataAge) => {
      const today = new Date();
      const timeDifference = today - dataAge;

      // calcul nbre de jours de diff
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      if (daysDifference >= 15) {
        localStorage.clear();
        localStorage.setItem("marvelStorageDate", Date.now());
      }
    };

    useEffect(() => {
      if (localStorage.getItem("marvelStorageDate")) {
        const storageDate = localStorage.getItem("marvelStorageDate");
        checkDataAge(storageDate);
      }
    }, []);

    return (
      <>
        <div className="stepsBtnContainer">{messageDisplay}</div>
        <div className="pourcentage">
          <div className="progressPercent">Réussite: {percent}%</div>
          <div className="progressPercent">{`Note: ${score}/${totalQuestions}`}</div>
        </div>
        <hr />
        <p>Les réponses aux questions posées</p>
        <div className="answerContainer">
          <table className="answers">
            <thead>
              <tr>
                <th>Question</th>
                <th>Réponse</th>
                <th>Infos</th>
              </tr>
            </thead>
            <tbody>{dataDisplay}</tbody>
          </table>
        </div>

        <Modal showModal={isModalOpen}>{modalContent}</Modal>
      </>
    );
  }
);

export default memo(LevelOver);
