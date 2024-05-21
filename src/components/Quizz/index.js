import React, { Component } from "react";
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";
import { QuizMarvel } from "../quizMarvel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LevelOver from "../LevelOver";
import { FaChevronRight } from "react-icons/fa";

const initialState = {
  quizLevel: 0,
  maxQuestions: 10,
  storedQuestions: [],
  idQuestion: 0,
  question: null,
  options: [],
  userAnswer: null,
  btnDisabled: true,
  score: 0,
  showWelcomeMsg: true,
  isLevelEnd: false,
  percent: null,
};

// variable qui ne subit pas de changement
const levelNames = ["debutant", "confirme", "expert"];

class Quizz extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
    this.storedDataRef = React.createRef();
  }

  // permet de récupérer les questions d'un niveau
  // en arg == le nom du niveau
  // va servir à chercher les questions du niveau dans l'objet QuizMarvel
  loadQuestions = (levelName) => {
    // on cherche les questions en rapport au levelName
    console.log(levelName, QuizMarvel[0].quizz);
    const fetchedArrayQuiz = QuizMarvel[0].quizz[levelName];

    if (
      fetchedArrayQuiz &&
      fetchedArrayQuiz.length >= this.state.maxQuestions
    ) {
      // on stocke les questions du levelName dans une ref
      // va servir pour comparer la reponse de l'uti à la réponse souhaitée
      // ET afficher le résumé à la fin d'un niveau
      this.storedDataRef.current = fetchedArrayQuiz;

      // permet de récupérer toutes les questions du niveau sans leur réponse !!!!
      const newArray = fetchedArrayQuiz.map(({ answer, ...keepRest }) => {
        // console.log(keepRest);
        return keepRest;
      });

      this.setState({
        storedQuestions: newArray,
      });
    }
  };

  showToastMsg = (pseudo) => {
    if (this.state.showWelcomeMsg) {
      this.setState({ showWelcomeMsg: false });
      toast.warn(`Bienvenu ${pseudo} et bonne chance`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  componentDidMount() {
    // on éxécute la fn qui charge les questions du niveau
    // le state.quizLevel va servir à donner le nom du niveau pour ensuite charger les questions du niveau
    this.loadQuestions(levelNames[this.state.quizLevel]);
  }

  componentDidUpdate(prevProps, prevState) {
    // destructuring du state
    const { storedQuestions, idQuestion, score, isLevelEnd } = this.state;
    // une fois les questions d'un niveau chargé
    // pour toutes les questions du niveau
    if (
      prevState.storedQuestions !== storedQuestions &&
      storedQuestions.length - 1
    ) {
      // on cherche la question et les propositions en fonction de l'id de la question
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options,
      });
    }

    // suite au click sur next question
    // l'idQuestion a été incrementée
    if (idQuestion !== prevState.idQuestion && storedQuestions.length - 1) {
      // au passe à la question et propositions suivantes
      // on réinitialise les autres states
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options,
        btnDisabled: true,
        userAnswer: null,
      });
    }

    // affichage notification d'accueil de l'utilisateur
    if (this.props.data.pseudo !== prevProps.data.pseudo) {
      this.showToastMsg(this.props.data.pseudo);
    }

    // suite au nextLevel
    // console.log(prevState.isLevelEnd);
    if (isLevelEnd !== prevState.isLevelEnd) {
      // lors de la fin du questionnaire d'un niveau
      // on récup le score en pourcentage
      const gradePercent = this.getPercent(storedQuestions.length, score);

      this.levelOver(gradePercent);
    }
  }

  // au clic sur une question
  // on enregistre la réponse == propsition cliquée
  onHandleAnswer = (option) => {
    this.setState({
      btnDisabled: false,
      userAnswer: option,
    });
  };

  // method qui permet de passer à la question suivante dans un niveau
  nextQuestion = () => {
    // console.log(this.state.storedQuestions.length);
    if (this.state.idQuestion === this.state.storedQuestions.length - 1) {
      this.setState({
        // on passe à la question suivante
        isLevelEnd: true,
      });
    } else {
      // si pas la fin des questions d'un niveau
      this.setState((prevState) => ({
        // on passe à la question suivante
        idQuestion: prevState.idQuestion + 1,
      }));
    }

    // on récup la réponse souhaitée à la question
    const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;

    // si la réponse de l'uti est bonne
    if (goodAnswer === this.state.userAnswer) {
      // +1 point
      this.setState((prevState) => ({
        score: prevState.score + 1,
      }));

      // notifications réussite
      toast.success("🦄 +1 point", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        bodyClassName: "toastify-color",
      });
    } else {
      // notifications échoué
      toast.error("🦄 0 point !", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  // method qui permet de passer au prochain niveau dans le component LevelOver
  nextLevel = (quizLevel) => {
    // console.log(quizLevel);
    this.setState({
      ...initialState,
      quizLevel: quizLevel,
    });
    this.loadQuestions(levelNames[quizLevel]);
  };

  // method qui retourne le score en pourcentage
  getPercent = (totalQuestions, score) => (score / totalQuestions) * 100;

  // fn qui permet de passer à la liste des question / réponses à la fin d'un niveau
  // éxécutée dans le composant LevelOver
  levelOver = (percent) => {
    // selon le score on va envoyer en props dans LevelOver
    if (percent >= 50) {
      this.setState({
        quizLevel: this.state.quizLevel + 1,
        percent: percent,
      });
    } else {
      this.setState({
        percent: percent,
      });
    }
  };

  render() {
    // destructuring du state
    const {
      quizLevel,
      maxQuestions,
      storedQuestions,
      idQuestion,
      question,
      options,
      userAnswer,
      btnDisabled,
      score,
      isLevelEnd,
      percent,
    } = this.state;

    const displayOptions = options.map((option, index) => {
      return (
        <p
          key={index}
          className={`answerOptions ${
            userAnswer === option ? "selected" : null
          }`}
          onClick={() => this.onHandleAnswer(option)}
        >
          <FaChevronRight /> {option}
        </p>
      );
    });

    return isLevelEnd ? (
      <LevelOver
        ref={this.storedDataRef.current}
        levelNames={levelNames}
        score={score}
        totalQuestions={storedQuestions.length}
        percent={percent}
        quizLevel={quizLevel}
        nextLevel={this.nextLevel}
      />
    ) : (
      <>
        <Levels level={quizLevel} levelNames={levelNames} />
        <ProgressBar
          questionLevel={idQuestion + 1}
          totalQuestions={storedQuestions.length}
        />
        <h2>{question}</h2>
        {displayOptions}
        <button
          className="btnSubmit"
          disabled={btnDisabled}
          onClick={this.nextQuestion}
        >
          {this.state.idQuestion < maxQuestions - 1 ? "Suivant" : "Terminer"}
        </button>
        <ToastContainer />
      </>
    );
  }
}

export default Quizz;
