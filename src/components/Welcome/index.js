import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, user } from "../firebase/firebaseConfig";
import { getDoc } from "firebase/firestore";
import Logout from "../Logout";
import Quizz from "../Quizz";
import Loader from "../Loader";

const Welcome = () => {
  const navigate = useNavigate();
  const [userSession, setUserSession] = useState(null);
  const [userData, setUserData] = useState({});

  // vérification de session firebase
  useEffect(() => {
    const listener = onAuthStateChanged(auth, (user) => {
      user ? setUserSession(user) : navigate("/");
    });

    if (!!userSession) {
      const colRef = user(userSession.uid);
      getDoc(colRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const docData = snapshot.data();
            setUserData(docData);
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }

    // on enlève le listener au démontage du component
    return listener();
  }, [userSession]);

  return !userSession ? (
    <Loader
      text="Loading..."
      styling={{ textAlign: "center", color: "#fff" }}
    />
  ) : (
    <div className="quiz-bg">
      <div className="container">
        <Logout />
        <Quizz data={userData} />
      </div>
    </div>
  );
};

export default Welcome;
