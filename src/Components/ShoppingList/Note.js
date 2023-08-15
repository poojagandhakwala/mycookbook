import React, { useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Note.css";
import {
  collection,
  collectionGroup,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  limit,
  where,orderBy,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { auth, db,Fire } from "../Context/firebase";
import {Link ,useMatch, useNavigate, useResolvedPath, useLocation} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faWindows } from '@fortawesome/free-brands-svg-icons';

let timer = 500,
  timeout;
function Note(props) {

const [list,setList]=useState([]);
const [errors,setErrors]=useState({});
const [isSubmit,setIsSubmit]=useState(false);
const [url, setUrl] = useState("");
const navigate= useNavigate();
// const [notes,setNotes]=useState("");
const [data,setData] = useState({
  titles:"",
  notes:"",
  color:""
})
const [showButton,setShowButton]=useState(false);
const {titles,notes,color}=data;
//const noteCollectionRef= query(collection(db,"NOtes"))
const [user, loading, error] = useAuthState(auth);

let [userid, setUserid] = useState("");
  const validate= () =>{
    let errors={};
    if(!notes){
        errors.notes="Name is required."
    }
    return errors;
  }

  const notify = () => toast("ShoppingList added!");
  const del_notify = () => toast("ShoppingList deleted!");
  const upd_notify = () => toast("ShoppingList updated!");


  const handleUpdate = async (e,docid) =>{
    e.preventDefault();
    let errors= validate();
    if(Object.keys(errors).length)  return setErrors(errors);
    // setIsSubmit(true);
    const q = query(collection(db, `LoginData/${props.userid}/ShoppingLists`), where("userid", "==", props.userid));
    const docs = await getDocs(q);
    let myId="";
    let useridd=props.userid;
    try
    {
    if(docid)
      {
        const DocRef = doc(collection(db, `LoginData/${props.userid}/ShoppingLists`),`${docid}`);
          useridd=props.userid;
          await updateDoc(
            DocRef, {
             ...data,
          });
          {upd_notify()}
          window.location.reload();      
            setData({
              titles:"",
              notes:[""]
            })
      }
    }
    catch(err) {
      console.error(err);
  }
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    let errors= validate();
    if(Object.keys(errors).length)  return setErrors(errors);
    let useridd=0;
    const q = query(collection(db, `LoginData/${props.userid}/ShoppingLists`), where("userid", "==", parseInt(props.userid,10)));
    const docs = await getDocs(q);
    let myId="";
    if(docs.docs.length === 0)
    {
      myId=props.userid+"301";
      var id_no=parseInt(myId,10);
      {
        const DocRef = doc(collection(db, `LoginData/${props.userid}/ShoppingLists`),`${id_no}`);
          useridd=parseInt(props.userid,10);
          
          setDoc(DocRef, {
            ...data,
            userid:useridd,
            timestamp:serverTimestamp()
          });
          notify();
          window.location.reload();
          navigate("/shoppinglist");      
            setData({
              titles:"",
             notes:[""] 
            })
      }   
    }
    else
    { 
      const lastdocRef= query(collection(db,`LoginData/${props.userid}/ShoppingLists`),orderBy("timestamp",'desc'),limit(1));
      const docSnap = await getDocs(lastdocRef);
      docSnap.forEach((doc)=> 
      {
        myId=doc.id;
      });
      myId=parseInt(myId,10);
      myId+=1;
      myId=myId.toString();
      var id_no=parseInt(myId,10);
      {
      const newDocRef = doc(collection(db, `LoginData/${props.userid}/ShoppingLists`),`${id_no}`);
          useridd=parseInt(props.userid,10);
          setDoc(newDocRef, {
            ...data,
            userid:useridd,
            timestamp:serverTimestamp()
          });
          {notify()}
          window.location.reload();
          navigate("/shoppinglist");      
            setData({
              titles:"",
              notes:[""]
            })
      }
    }

  } 
  const handleDelete = async (docid,n) => {
    if(window.confirm("Are you sure want to delete?"))
    {try {
      const docRef = doc(collection(db, `LoginData/${props.userid}/ShoppingLists`),`${docid}`);
      await deleteDoc(docRef);
      del_notify();
    } catch (err) {
      console.log(err);
    }
  }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return;     
}, [user, loading]);


  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    const monthNames = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    let hrs = date.getHours();
    let amPm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs ? hrs : "12";
    hrs = hrs > 12 ? (hrs = 24 - hrs) : hrs;

    let min = date.getMinutes();
    min = min < 10 ? "0" + min : min;

    let day = date.getDate();
    const month = monthNames[date.getMonth()];

    return `${hrs}:${min} ${amPm} ${day} ${month}`;
  };

  const debounce = (func) => {
    clearTimeout(timeout);
    timeout = setTimeout(func, timer);
  };

  const updateText = (text, id) => {
    debounce(() => props.updateText(text, id));
  };

  return (
    <>
    <div className="note" 
    style={(props.note)?{ backgroundColor: props.note[0].col }:
    ((props.usernote)?{backgroundColor:props.color}:
    {backgroundColor:"yellowgreen"})
   }>
     {(props.usernote)?(
      <>
      <input type='text' className="note_title" 
        placeholder='Title'
        id="noteTitle"
        value= {props.titles}
        defaultValue={props.usertitle} 
        onChange={(e) => {setShowButton(true);
          setData(
          {...data,
            titles:e.target.value,
            notes:props.usernote,
            color:props.color
          });}}
      />
       <textarea type='text' 
      className="note_text custom-scroll usernotes" 
      error={errors.steps ? {content: errors.steps} : null}
      value= {props.notes} 
      defaultValue={props.usernote}
      onChange={(e) =>{
        setShowButton(true);
        setData(
        {...data,
          titles:props.usertitle,
          notes:e.target.value,
        color:props.color});} }
      />
      
      </>):(<></>)}
    
    {(props.note)?
    (<>
      <input type='text' className="note_title" 
      id="noteTitle"
      placeholder='Title'
      value= {props.title} 
      onChange={(e) => {setShowButton(true);
        setData(
        {...data,
          titles:document.getElementById('noteTitle').value
        })}}
      ></input>
     <textarea type='text' 
      className="note_text" 
      error={errors.steps ? {content: errors.steps} : null}
      value= {props.notes} 
      onChange={(e) => {setShowButton(true);
        setData(
        {...data,
           titles:document.getElementById('noteTitle').value,
          //  ('#noteTitle').val(),
          //:e.target.value,
          notes:e.target.value,
          color:props.note[0].col
        })}} />
        </>
      ):(<></>)}
     
      {(showButton)?
       <div 
       className="note_footer" 
       >

       {(props.docidd)?(
         <button onClick=
         {(e) =>
          (data.notes==="")?alert("Please add any item in list or delete the list"):
           handleUpdate(e,props.docidd)}
          style={{marginTop:'13px'}}
         >
           Update</button>
       ):(
         <button onClick={(e) => {
          (data.notes==="")?alert("Please add any item in list!"):
             handleSubmit(e)
           }}> Save </button>
       )}
        <FontAwesomeIcon icon={faTrash}
            style={{cursor: "pointer",
            marginTop:"25px"
            }
            }
            alt="DELETE"
            onClick={()=>{if(props.docidd)
              {handleDelete(props.docidd)}}}/>
          </div>
          :  <>
          <FontAwesomeIcon icon={faTrash}
                style={{cursor: "pointer",
                marginTop:"15px",
                marginLeft:"180px"}}
                alt="DELETE"
                onClick={()=>{if(props.docidd)
                  {handleDelete(props.docidd)}}}
              /></> }
      <div className="note_footer" style={{float:'right'}}>
        {props.timestampp}
      </div>    
    </div>
    </>
  );
}

export default Note;