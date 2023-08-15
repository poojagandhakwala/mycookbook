import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../Context/firebase";
import "./style.css";

export default function DropDown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");

  let [docid, setDocid] = useState("");
  // const fetchUserName = async () => {
  //   try {
  //     const q = query(
  //       collection(db, "LoginData"),
  //       where("uid", "==", user?.uid)
  //     );
  //     const doc = await getDocs(q);
  //     const data = doc.docs[0].data();
  //     setName(data.name);
  //     setPhotourl(data.photo);
  //     doc.forEach((doc1) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       // console.log("ID="+ doc.id, " => ", doc.data());
  //       setDocid(doc1.id);
  //     });
  //     // alert("doc id = "+docid);
  //   } catch (err) {
  //     alert(err);
  //     alert("An error occured while fetching user data");
  //   }
  // };
  const fetchUserName = async () => {
    try {
      const q = query(
        collection(db, "LoginData"),
        where("uid", "==", user?.uid)
      );
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      doc.forEach((doc1) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log("ID="+ doc.id, " => ", doc.data());
        setDocid(doc1.id);
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    fetchUserName();
  }, [user, loading]);

  return (
    <Dropdown
      onMouseLeave={() => setShowDropdown(false)}
      onMouseOver={() => setShowDropdown(true)}
      style={{ width: "50px",marginTop:'-5px' }}
    >
      <Dropdown.Toggle variant="success" id="dropdown-basic"
      
      >
        {/* <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> ?
       <img src = {user ? user.photoURL:""} alt ="profile-image" className="rounded-circle" style={{width:'30px'}}/>  
       Welcome, {(name.split(" "))[0]} */}
        {user.photoURL ? (
          <img
            src={user ? user.photoURL : ""}
            alt="profile-image"
            className="rounded-circle"
            style={{ width: "30px"}}
          />
        ) : (
          <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
        )}
        Welcome, {name.split(" ")[0]}
      </Dropdown.Toggle>

      <Dropdown.Menu show={showDropdown}>
        {
          <CustomLink to="myprofile" style={{ margin: "20px" }}>
            {" "}
            User_Profile{" "}
          </CustomLink>
        }
        {docid === "101" || docid === "102" ? (  
          <CustomLink to="dashboard" style={{ margin: "20px" }}> Dashboard </CustomLink> 
        ) : (
          <></>
        )}
        {
          <CustomLink onClick={logout} style={{ margin: "20px" }}>
            LogOut{" "}
          </CustomLink>
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}
let cnt=0;
export function CustomLink({ to, children, ...props }) {
 
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}  
        {/* {(to==="dashboard") ? window.location.reload() :<></>} */}
      </Link>
      {/* {(to==="dashboard") ? window.location.reload() :<></>} */}
    </li>
    // (to==="dashboard") ? (cnt<2) && ( cnt++,window.location.reload()) :<></>
  );
  
}
