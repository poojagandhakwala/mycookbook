import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../../../../Images/logo_round_orange.png";
import SideBarItem from "./sidebar-item";
import {logout} from "../../../Context/firebase"
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./styles.css";
import LogoutIcon from "../../assets/icons/logout.svg";

export default function SideBar({ menu }) {
  const location = useLocation();

  const [active, setActive] = useState(1);

  useEffect(() => {
    menu.forEach((element) => {
      if (location.pathname === element.path) {
        setActive(element.id);
      }
    });
  }, [location.pathname]);

  const __navigate = (id) => {
    setActive(id);
  };

  return (
    <nav className="sidebarr">
      <div className="sidebar-container">
        <div className="sidebar-logo-container">
          <img
            src={Logo}
            style={{ width: "200px", height: "200px" }}
            alt="logo"
          />
        </div>

        <div className="sidebar-container">
          <div className="sidebar-items">
            {menu.map((item, index) => (
              <div key={index} onClick={() => __navigate(item.id)}>
                <SideBarItem active={item.id === active} item={item} />
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
          <CustomLink onClick={logout} to="/" style={{ margin: "20px",color:"white" }}>
            <span className="sidebar-item-label">Logout</span>
            </CustomLink>
            <img
              src={LogoutIcon}
              alt="icon-logout"
              className="sidebar-item-icon"
            />
          
          </div>
        </div>
      </div>
    </nav>
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

