import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubSquare } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import "./aboutus.css";
import Admin1 from "../Images/ppooja.jpg"
import Admin2 from "../Images/sejal_aboutus.jpg"
import bowl from "../Images/about-data-bowl.jpg"

const aboutus = () => {
  return (
    <div className="container">
        <div className="row aboutus-section">
          <div className="col-md-4 contentaboutus">
            <h1>About Us Page</h1>
            <p>Some information about our team.</p>
            
          </div>
          <div className="col-md-7">
            <img src={bowl} style={{width:'100%',float:'right'}}/>
          </div>
        </div>
        <h2 style={{ textAlign: "center", marginBottom: "3%" }}>Our Team</h2>
        <div className="container">
        <div className="row m-5" style={{justifyContent:'center'}}>

        <div className="card col-md-3 mx-5" style={{width:'22rem'}}>
          <div className="card-img-top">
          <img
            src={Admin1}
            alt="Pooja"
            className=" rounded-circle"
            style={{ width:'200px',height:'200px',margin:'8px 25px',
            marginLeft:'60px' }}/>
          </div>
          <div className="card-body">
            <div className="card-title">
            <h2>Pooja Gandhakwala</h2>
          </div>
          <p className='card-subtitle'>pnmodi124@gmail.com</p>
          <div className="iconsaboutus mt-3">
            <a href="https://www.linkedin.com/in/pooja-gandhakwala">
              <FontAwesomeIcon icon={faGithubSquare} style={{width:'35px',height:'35px',margin:'5px'}}/>
            </a>
            <a href="https://github.com/poojagandhakwala">
              <FontAwesomeIcon icon={faLinkedin} style={{width:'35px',height:'35px',margin:'5px'}}/>
            </a>
            <a href="www.twitter.com">
              <FontAwesomeIcon icon={faTwitterSquare} style={{width:'35px',height:'35px',margin:'5px'}}/>
            </a>
          </div>
          </div>
        </div>
        <div className="card col-md-3 mx-5" style={{width:'22rem'}}>
          <div className="card-img-top">
          <img
          src={Admin2}
          // src="https://firebasestorage.googleapis.com/v0/b/cookbook-755f8.appspot.com/o/IMG_20230412_210317.jpg?alt=media&token=f5d5ab4a-afbf-4868-a52a-a6e699b9667f"
          alt="sejal"
          className="rounded-circle"
          // style={{ width:'30vh',height:'30vh',margin:'8% 25% ' }}
          style={{ width:'200px',height:'200px',margin:'8px 25px',
          marginLeft:'60px' }}
          />
          </div>
          <div className="card-body">
            <div className="card-title justify-content-center">
              <h2>Sejal Patel</h2>
            </div>
          <p className='card-subtitle'>patelsejal0402@gmail.com</p>
          <div className="iconsaboutus mt-3">
            <FontAwesomeIcon icon={faGithubSquare} style={{width:'35px',height:'35px',margin:'5px'}}/>
            <FontAwesomeIcon icon={faLinkedin} style={{width:'35px',height:'35px',margin:'5px'}}/>
            <FontAwesomeIcon icon={faTwitterSquare} style={{width:'35px',height:'35px',margin:'5px'}}/>
          </div>          
        </div>
        </div>
        </div>
        </div>
    </div>
  );
};

export default aboutus;
