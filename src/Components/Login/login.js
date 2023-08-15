import React from 'react';
import { useState , useEffect } from 'react';
import { GoogleButton } from 'react-google-button';
import './login.css';
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithGoogle } from "../Context/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faEye }  from '@fortawesome/free-solid-svg-icons';
import {signInWithEmailAndPassword} from 'firebase/auth';

const Login=()=>{

  const [errmsg,setErrmsg]=useState("");
  const logInWithEmailAndPassword = async (email, password) => {
    setErrmsg("");
    try {                   
      await signInWithEmailAndPassword(auth, email, password);
    } 
    catch (err) {
          if(err.code === 'auth/user-not-found')
          {
            setErrmsg('User Not Found!Please Sign-up first.');
          }
          else if(err.code === 'auth/wrong-password')
          {  setErrmsg("Password incorrect.")}
          else
          setErrmsg(err.message);
     } 
  };



    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [user, loading,] = useAuthState(auth);
    const [passwordShown,setpasswordShown] = useState(false);
    const [focused, setFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);   

    useEffect(()=>{
      setIsLoaded(true);
      if(isLoaded===true) window.location.reload();
      setIsLoaded(false);

    },[]);

    const handleFetch = () => {
      setIsLoading(true);
      fetch("https://reqres.in/api/users?page=0")
        .then((respose) => respose.json())
        .then((respose) => {
          loading(respose.data)
       });
   };
    
    const navigate = useNavigate();
    useEffect(() => {
      if (loading) {
        // maybe trigger a loading screen
        return;
      }
      if (user) navigate("/");
    }, [user, loading, navigate]);
    
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
      <>
        <div className='login-container'> 
          <div className="auth-wrapper my-3">
            <div className="auth-inner-login">

              <form onSubmit={handleSubmit} className="Form-login">
                <h3>Welcome</h3>

                <div className="mb-3">
                  
                  <input
                    value={email}
                    onBlur={handleFocus} focused={focused.toString()}
                    onChange={handleEMailChange}
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                  />
                  {email !=="" && <span className="error-msg">It should be a valid email address!</span>}
                </div>

                <div className="mb-0">
                  
                  <input
                    onChange={handlePasswordChange}
                    type={passwordShown ? "text" : "password"}
                    className="form-control input-group-button"
                    placeholder="Password"
                  />
                  <button className="btn" onClick={togglePassword} style={{marginTop:'-75px', marginLeft:'275px'}}>
                   {passwordShown===true ?<FontAwesomeIcon icon={faEye} style={{color:'0275d8'}}></FontAwesomeIcon> : <FontAwesomeIcon icon={faEyeSlash} style={{color:'0275d8'}}></FontAwesomeIcon> }
                  </button>
                </div>
                <p className="forgot-password text-right mb-3">
                <Link to="/reset">Forgot password?</Link>
              </p>

              <div className="mb-3">
                <div className="custom-control custom-checkbox">
                <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customCheck1"
                    style={{marginBottom:'-20px', marginLeft:'-160px'}}
                  />
                  <label className="custom-control-label" htmlFor="customCheck1" style={{marginLeft:'20px'}}>
                    Remember me
                  </label>
                  
                </div>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary" onClick={() => {logInWithEmailAndPassword(email,password);}}>
                  Login
                </button>
               <span className='err-msg'>{errmsg}</span>
               
              </div>

              <p className='or'> or </p>

              <div className='max-w-[240px] mx-4 py-4'>
                  <GoogleButton onClick={signInWithGoogle} style={{backgroundColor:'#167bff',width:'300px'}} label='Login with Google'/>
              </div>

              <p>
                Don't have an account? <Link to="/signup">SignUp</Link> now.
              </p>
              <Link to="/">Back to Home</Link>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }

export default Login;