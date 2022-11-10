import '../nav.css'; 
import React from 'react'
import {Link ,useMatch, useResolvedPath} from "react-router-dom";

function Navbar() {
    return (
        <>
        {/* <nav className='nav'>
            <Link to="/" className=''></Link>
        </nav> */}
        <div className="navbar">
            <ul>
                <CustomLink to="/home">Home</CustomLink>
                <CustomLink to="shoppingList">Shopping List</CustomLink>
                <CustomLink to="mealPlanner">Meal Planner</CustomLink>
                <CustomLink to="cookBooks">Cookbooks</CustomLink>
            </ul>
        </div>
        </>
    );
}
export default Navbar;
function CustomLink({to, children,...props}){
   const resolvedPath = useResolvedPath(to)
   const isActive = useMatch({path:resolvedPath.pathname, end: true})
    return (
        <li className={isActive ? "active" :""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}