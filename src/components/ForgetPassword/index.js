import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [isBtn, setIsBtn] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const onChangeInput = (e) => {
    setEmail(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault();

    sendPasswordResetEmail(auth, email)
    .then(() => {
      // Email verification sent!
      setError(null);
      setSuccess("Email verification sent!");
      setEmail("")

      setTimeout(() => {
        navigate('/login');
      }, 5000);
    })
    .catch((error) => {
      // An error happened.
      setError(error);
      setEmail("");
    });
  }

  // gestion erreurs
  // const errorMsg = error !== "" && <span>{error.message}</span>

  useEffect(() => {
    if(email !== '') {
      setIsBtn(true);
    }
  }, [email])

  const btnSubmit =
    isBtn ? (
      <button type="submit">Récupérer</button>
    ) : (
      <button type="submit" disabled>
        Récupérer
      </button>
    );

  return (
    <div className='signUpLoginBox'>
      <div className="slContainer">
      <div className="formBoxLeftLogin"></div>
        <div className="formBoxRight">
          <div className="formContent">
            
            { success && <span 
              style={{
                border: '1px solid green',
                background: 'green',
                color: 'white'
              }}
            >{success}</span>
            }

            {error && <span>{error.message}</span>}
            <h2>Mot de passe oublié</h2>
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
              {btnSubmit}
            </form>
            <div className="linkContainer">
              <Link to="/login" className="simpleLink">Déjà inscrit ? Connectez-vous</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword