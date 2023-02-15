import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig';

const Login = () => {
  const navigate = useNavigate();
  const intialInputsDatas = {
    email: '',
    password: '',
  }

  const [inputsDatas, setInputsDatas] = useState(intialInputsDatas);
  const { email, password } = inputsDatas;

  const [isBtn, setIsBtn] = useState(false);
  const [error, setError] = useState("");

  const onChangeInput = (e) => {
    setInputsDatas({...inputsDatas, [e.target.id]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setInputsDatas(intialInputsDatas);

      // replace true => pour pas que l'utilisateur puisse retourner en arrière dans l'historique de navigation
      navigate('/welcome', { replace: true });
    })
    .catch((error) => {
      setError(error);
      setInputsDatas(intialInputsDatas);
    });
  }

  // gestion erreurs
  const errorMsg = error !== "" && <span>{error.message}</span>

  useEffect(() => {
    if(password.length > 5 && email !== '') {
      setIsBtn(true);
    }
  }, [password, email])

  const btnSubmit =
    isBtn ? (
      <button type="submit">Connexion</button>
    ) : (
      <button type="submit" disabled>
        Connexion
      </button>
    );

  return (
    <div className='signUpLoginBox'>
      <div className="slContainer">
      <div className="formBoxLeftLogin"></div>
        <div className="formBoxRight">
          <div className="formContent">
            {errorMsg}
            <h2>Connexion</h2>
            <form 
            onSubmit={onSubmit}
            >
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
              {btnSubmit}
            </form>
            <div className="linkContainer">
              <Link to="/signup" className="simpleLink">Nouveau sur Marvel Quizz ? Inscrivez-vous maintenant !</Link>
              <br />
              <Link to="/forgot-password" className="simpleLink">Mot de passe oublié ? Récupérez-le ici.</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login