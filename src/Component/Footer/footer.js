import logo from "../Images/logo_round_orange.png";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./footer.css";
import ScrollToTop from "./ScrollToTop";

export default function Footer() {
  return (
    <div className='containerr'>
      <footer className="text-center text-black " >
        <div className="container pt-4">
          <section className="p-4 ">
            <a href="/" className="my-2 mx-2 btn-floating" 
            style={{textDecoration:'none',color:'black',}}>Home </a>
            <a href="/shoppinglist" className="my-2 mx-2 btn-floating" 
            style={{textDecoration:'none',color:'black',}}>Shopping List  </a>
          <a href="/mealplanner" className="my-2 mx-2 btn-floating" 
            style={{textDecoration:'none',color:'black',}}>Meal Planner</a>
          <a href="/recipebook" className="my-2 mx-2 btn-floating" 
            style={{textDecoration:'none',color:'black',}}>Recipe Book</a>
          <a href="/aboutus" className="my-2 mx-2 btn-floating" 
            style={{textDecoration:'none',color:'black',}}>About Us</a></section>
          <section className="my-3">
            <div className="m-2 mb-3">
              <a className="btn btn-link btn-floating btn-lg text-dark m-1 "
                href="https://twitter.com/">
                <i className="fa fa-twitter"
                />
              </a>
              <a className="btn btn-link btn-floating btn-lg text-dark m-1 "
                href="https://facebook.com/">
                <i className="fa fa-facebook"
                />
              </a>
              <a className="btn btn-link btn-floating btn-lg text-dark m-1 "
                href="https://instagram.com/">
                <i className="fa fa-instagram"/>
              </a>
            </div>
          </section>
          <div className="mb-0">
            <p>cookbook@gmail.com </p>
            <p>© 2023 Copyright  Cookbook </p>
          </div>
        </div>
      </footer>



      {/* <div className="footer">
        <div className="footer-inner">
          <div className="f-logo">
          <img src={logo} alt=" " 
          className="imageLogo" />
            <div className="f-info">
              <p>Developed by</p>
              <h6>Pooja Gandhakwala</h6>
              <p>pnmodi124@gmail.com</p>
              <h6>Sejal Patel</h6>
              <p>patelsejal0402@gmail.com</p>
            </div>
          </div>
          <div className="f-content">
            <ScrollToTop />
            <ul className="f-link">
              <CustomLink to="/">
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
              <CustomLink to="aboutus">
                <FontAwesomeIcon icon={faUsers} /> About Us
              </CustomLink>
            </ul>
          </div>
          <div className="footer-copyright">
            <p>cookbook@gmail.com </p>
            <p> © 2023 Copyright</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
