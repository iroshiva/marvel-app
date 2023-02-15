import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, user } from "../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { setDoc } from "firebase/firestore";

const Signup = () => {
  const navigate = useNavigate();
  const intialInputsDatas = {
    pseudo: "",
    email: "",
    password: "",
    confirmPasssword: "",
  };

  const [loginDatas, setLoginDatas] = useState(intialInputsDatas);
  const [error, setError] = useState("");

  const { pseudo, email, password, confirmPasssword } = loginDatas;

  const btnSubmit =
    pseudo !== "" ||
    email !== "" ||
    password !== "" ||
    password !== confirmPasssword ? (
      <button type="submit">Inscription</button>
    ) : (
      <button type="submit" disabled>
        Inscription
      </button>
    );

  // gestion erreurs
  const errorMsg = error !== "" && <span>{error.message}</span>

  const onChangeInput = (e) => {
    setLoginDatas({
      ...loginDatas,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // auth firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        // on créé une entrée dans la base de données
        return setDoc(user(authUser.user.uid), {
          pseudo,
          email,
        })
      })
      .then((response) => {
        setLoginDatas({ ...intialInputsDatas });
        navigate('/welcome')
      })
      .catch((error) => {
        setError(error);
        setLoginDatas({ ...intialInputsDatas });
      });
  };

  return (
    <div className="signUpLoginBox">
      <div className="slContainer">
        <div className="formBoxLeftSignup"></div>
        <div className="formBoxRight">
          <div className="formContent">
            {errorMsg}
            <h2>Inscription</h2>
            <form onSubmit={onSubmit}>
              <div className="inputBox">
                <input
                  id="pseudo"
                  type="text"
                  required
                  autoComplete="off"
                  value={pseudo}
                  onChange={(e) => onChangeInput(e)}
                />
                <label htmlFor="pseudo">Pseudo</label>
              </div>
              <div className="inputBox">
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => onChangeInput(e)}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="inputBox">
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="off"
                  value={password}
                  onChange={(e) => onChangeInput(e)}
                />
                <label htmlFor="password">Mot de passe</label>
              </div>
              <div className="inputBox">
                <input
                  id="confirmPasssword"
                  type="password"
                  required
                  autoComplete="off"
                  value={confirmPasssword}
                  onChange={(e) => onChangeInput(e)}
                />
                <label htmlFor="confirmPasssword">
                  Confirmer le mot de passe
                </label>
              </div>
              {btnSubmit}
            </form>
            <div className="linkContainer">
              <Link to="/login" className="simpleLink">Déjà inscrit ? Connectez-vous</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
