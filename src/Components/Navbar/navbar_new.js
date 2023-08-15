import React from "react";
import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome,faCalendarDays,faListCheck,faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faUser, faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db} from '../../Components/Context/firebase';
import Logo from "../../Images/logo_round_orange.png";
import DropDown from "../User_Profile/DropDown";

export default function Navbar() {
  const [user, loading] = useAuthState(auth);

  return (
    <>
      <nav className="navbar navbar-expand-lg">
      {/* bg-body-tertiary */}
        <div className='container-fluid '>
          <button className='navbar-toggler' 
          type='button' data-bs-toggle="collapse"
          data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' 
          aria-label='toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>
          
          <div className='collapse navbar-collapse' id="navbarNav">
          <ul className='navbar-nav '>
          <li className='nav-item'>
            <img
            src={Logo}
            alt="logo"
            className="img-logo "
            />
          </li>
          <CustomLink to="/" >
            <FontAwesomeIcon icon={faHome} /> Home
          </CustomLink>
          <CustomLink to="shoppinglist">
            <FontAwesomeIcon icon={faListCheck} /> Shopping List
          </CustomLink>
          <CustomLink to="mealplanner">
            <FontAwesomeIcon icon={faCalendarDays} /> Meal Planner
          </CustomLink>
          <CustomLink to="recipebook">
            <FontAwesomeIcon icon={faBookOpen} /> RecipeBook
          </CustomLink>
          
          {!user ? (
            <CustomLink
              to="/login"
              style={{
                border: "1px solid #c7d1c8",
                borderRadius: "15px",padding:'8px'
              }}
            >
              <FontAwesomeIcon icon={faUser} style={{paddingRight:'5px'}}/>
              LogIn 
            </CustomLink>
          ) : (
            <CustomLink>
              {" "}
              <DropDown />{" "}
            </CustomLink>
          )}
          </ul>
          </div>
        </div>
      </nav>    




        {/* <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className='container-fluid'>
          <button className='navbar-toggler' type='button' data-bs-toggle="collapse"
          data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' 
          aria-label='toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id="navbarNav">
          <ul className='navbar-nav'>
          <img
            src={Logo}
            alt="logo"
            style={{height:'150px',width:'150px'}}
            className="img-logo "
            />  
            <li className='nav-item'>
              <a className='nav-link' href="#home">Home</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='#about'>About</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='#skills'>Skills</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='#projects'>Projects</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='#contact'>Contact</a>
            </li>
          </ul>
          </div>
        </div>
      </nav>  */}
    </>
  );
}

export function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? "active nav-item" : "nav-item"}>
      <Link to={to} {...props} className="nav-link">
        {children}
      </Link>
    </li>
  );
}