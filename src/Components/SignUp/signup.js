import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../Context/firebase.js";
import './signup.css';
import { GoogleButton } from 'react-google-button';
//import { UserAuth } from '../Context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faEye }  from '@fortawesome/free-solid-svg-icons';

const Signup=()=>{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading] = useAuthState(auth);
  const [passwordShown,setpasswordShown] = useState(false);
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) return navigate("/");
  }, [user, loading, navigate]);

    // const { googleSignUp } = UserAuth();
    // const handleGoogleSignup = async () =>{
    //     try{
    //         await googleSignUp()
    //     }catch(error) {
    //         console.log(error)
    //     }
    // }

  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };

  const handleFocus = (e) => {
    if(e.target.value !=="")
    { setFocused(true); }
    else {  setFocused(false);  }
  };
  
  function handleEMailChange(event){
      setEmail(event.target.value);
  }
  function handlePasswordChange(event){
      setPassword(event.target.value);
  }
  function handleSubmit(event){
      event.preventDefault();
  }
  const togglePassword = () =>{
    setpasswordShown(!passwordShown);
  };

    return (
        <div className='signup-container'> 
        <div className="auth-wrapper my-5">
        <div className="auth-inner-signup">

      <form onClick={handleSubmit} className="Form">
        <h3>Sign Up</h3>

        <div className="mb-3 user">
          <label>Name </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)} 
            type="text"
            className="form-control"
            placeholder="Name"
            pattern="^[A-Za-z0-9@_]{5,16}$"
            required="true"
            onBlur={handleFocus}
            focused={focused.toString()}
          />
          {name!=="" && <span className="error-msg">Username should be 5-16 characters!</span>}
        </div>

        <div className="mb-3 mail">
          <label>Email address</label>
          <input
            value={email}
            onChange={handleEMailChange}
            type="email"
            className="form-control"
            placeholder="Enter email"
            required="true"
            onBlur={handleFocus} 
            focused={focused.toString()}
          />
          {email !=="" && <span className="error-msg">It should be a valid email address!</span>}
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            value={password}
            onChange={handlePasswordChange}
            type={passwordShown ? "text" : "password"}
            className="form-control input-group-button"
            placeholder="Enter password"
            pattern="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,20}"
            required="true"
            onBlur={handleFocus} 
            focused={focused.toString()}
          />
          <button className="btn" onClick={togglePassword} style={{marginTop:'-75px',marginLeft:'280px'}}>
            {passwordShown===true ?<FontAwesomeIcon icon={faEye} style={{color:'0275d8'}}></FontAwesomeIcon> : 
            <FontAwesomeIcon icon={faEyeSlash} style={{color:'0275d8'}}></FontAwesomeIcon> }
          </button>
          {password !=="" && <span className="error-msg">Password should be 6-20 characters and include at least 1 letter, 1 number and 1 special character!</span>}
          </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary" onClick={register}>
            Sign Up
          </button>
        </div>
        <p class="or"> or </p>
        <div className='max-w-[240px] m-auto py-4'>
            <GoogleButton onClick={signInWithGoogle} style={{backgroundColor:'#167bff',width:'300px', marginLeft:'20px'}} label='Signup with Google'/>
        </div>

        <p>
          Already registered <Link to='/login'>Log In?</Link>
        </p>
      </form>
      </div>
      </div>
      </div>
    );
}
export default Signup;