import { useEffect, useState } from 'react'
import { signOut } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import {Tooltip as ReactTooltip} from 'react-tooltip';

const Logout = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  // permet d'éxécuter le logout si checked === true
  useEffect(() => {
    if (isChecked) {
      // firebase
      signOut(auth).then(() => {
        navigate("/", { replace: true });
      }).catch((error) => {
        console.log(error)
      });
    }
  }, [isChecked]);

  return (
    <div className='logoutContainer'>
      <label className='switch'>
        <input 
          type='checkbox'
          checked={isChecked} 
          onChange={() => setIsChecked(!isChecked)}
        />
        <span id="logout" className='slider round' data-tooltip-content="Déconnexion"></span>
      </label>
      <ReactTooltip
        place='left'
        effect='solid'
        anchorId="logout"
      />
    </div>
  )
}

export default Logout