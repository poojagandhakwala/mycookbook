import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../Context/firebase";
import "./viewer.css";
import * as dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function RecipeViewer() {
  
  const location = useLocation();

  const img = location.state.img;
  const idd = location.state.id;
  const path = location.state.p;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [cooktime, setCooktime] = useState("");
  const [preptime, setPreptime] = useState("");
  const [ing, setIng] = useState([]);
  const [steps, setSteps] = useState([]);
  const [time, setTime] = useState({ date: "", day: "" });
  const [popup, setPopup] = useState(false);
  const [err,setErr]=useState(false);
  let [index,setIndex]=useState();

  const [updaterecipes,setUpdaterecipes]=useState({
    name:"",
    category:"",
    prepTime:"",
    cookTime:"",
    ingredients:[""],
    steps:[""],
    id:""
  })
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (path === "") rec();
    else userrec();
  }, []);

  const [user, loading, error] = useAuthState(auth);
  let [userid, setUserid] = useState("");
  let us = "";
  let [pathh, setPathh] = useState("");
  const fetchUserId = async () => {
    try {
      const q = query(
        collection(db, "LoginData"),
        where("uid", "==", user?.uid)
      );
      const docSnap = await getDocs(q);
      docSnap.forEach((doc1) => {
        console.log("ID=" + doc1.id, " => ", doc1.data());
        if (userid !== doc1.id) {
          setUserid(doc1.id);
        }
        if (us === "") {
          us = doc1.id;
        }
        setPathh(`LoginData/${doc1.id}`);
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    if (user) fetchUserId();
  }, [user, loading]);

  const rec = async () => {
    const docRef = doc(db, "Recipes", idd);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setName(docSnap.get("name"));
      setCategory(docSnap.get("category"));
      setPreptime(docSnap.get("prepTime"));
      setCooktime(docSnap.get("cookTime"));
      setIng(docSnap.get("ingredients"));
      setSteps(docSnap.get("steps"));
      setUrl(docSnap.get("imgurl"));
      const time_created=docSnap.get('timestamp');
      setTime({date:dayjs.unix(time_created.seconds).
          format('DD/MM/YYYY'), day:dayjs.unix(time_created.seconds).
          format('dddd')});

      console.log("Document Title:", name);
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const userrec = async () => {
    const docRef = doc(db, path + `/Recipes_user`, idd);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let info = [];
      setName(docSnap.get("name"));
      setCategory(docSnap.get("category"));
      setPreptime(docSnap.get("prepTime"));
      setCooktime(docSnap.get("cookTime"));
      setIng(docSnap.get("ingredients"));
      setSteps(docSnap.get("steps"));
      setUrl(docSnap.get("url"));
      const time_created = docSnap.get("timestamp");
      const formatDate = new Date(
        time_created.seconds * 1000 + time_created.nanoseconds / 1000000
      );
      setTime({
        date: dayjs.unix(time_created.seconds).format("DD/MM/YYYY"),
        day: dayjs.unix(time_created.seconds).format("dddd"),
      });
      console.log(url);
      console.log("Document Title:", name);
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  let [upindex,setUpindex]=useState();
  const fetchUpdateData=async(id1)=>{
    try {
      const q = doc(db,"Recipes",id1)
      const docSnap = await getDoc(q);
      if(docSnap.exists())
      {
        setUpdaterecipes(docSnap.data(),{id:id1});
      }
      else
      {
        const docRef2 = doc(db, path + `/Recipes_user`, id1);
        const docSnap2 = await getDoc(docRef2); 
        setUpdaterecipes(docSnap2.data(),{id:id1});
      }
    } catch (err) {
        console.log(err);
    }
  }

  const handleUpdateIngredient= (e,i)=>{
    const ingredientsClone = [...updaterecipes.ingredients]
    ingredientsClone[i]=e.target.value
    setUpdaterecipes({
        ...updaterecipes,
        ingredients: ingredientsClone
    })
  }
  const handleUpdateIngredientCount = () => {
    setUpdaterecipes({
      ...updaterecipes,
      ingredients: [...updaterecipes.ingredients, ""]
    })
  }
  const handleUpdateStep= (e,i)=>{
    const stepsClone = [...updaterecipes.steps]
        stepsClone[i]=e.target.value
        setUpdaterecipes({
            ...updaterecipes,
            steps: stepsClone
        })
  }
  const handleUpdateStepCount = () => {
    setUpdaterecipes({
      ...updaterecipes,
      steps: [...updaterecipes.steps, ""]
    })
  }
  let removeUpdateFields = (i) => {
    let newupdaterecipes = [...updaterecipes.ingredients];
        newupdaterecipes.pop(i);
        setUpdaterecipes({
            ...updaterecipes,
            ingredients: newupdaterecipes
   })
  }

  const handleUpdate=async () => {
    try {
      const docRef = doc(db, path + `/Recipes_user`, idd);
      const docSnap = await getDoc(docRef); 
      if(docSnap.exists())
      {
        await updateDoc
        (docRef,{
          category:updaterecipes.category,
          cookTime:updaterecipes.cookTime,
          prepTime:updaterecipes.prepTime,
          ingredients:updaterecipes.ingredients,
          steps:updaterecipes.steps,
        }, {merge:true})
        alert("Update successfully");
      }  
      setPopup(false);
      window.location.reload();
      setName("");
      setCategory("");
      setPreptime("");
      setCooktime("");
      setIng("");
      setSteps("");
      setUrl("");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="container my-3">
        <div className="row ">
          <div className="col-md-5">
            <h2  style={{color:'#e43e01'}} >{name}</h2>
            <h6>
              Category: {category}
            </h6>
            <p>
              {time.date} {time.day}
            </p>
            <img src={url} style={{height:'350px',maxWidth:'350px'}}/>
          </div>
          <div className="col-md-6 my-3 side-container">
            <h5>Preparation time:</h5>
            <p> {preptime} </p>
            <h5>Cooking time:</h5> <p> {cooktime} </p>
            <h5>Ingredients</h5>
            <ul style={{fontSize:"20px"}}> 
              {ing.map((ing,i)=>(
              <li key={i}>
                {ing}
              </li> 
              ))}                      
            </ul>
          </div>
          <div className="col-lg-12 my-3">
            <h5>Steps</h5>
            <ol style={{fontSize:"20px"}}>
              {steps.map((steps, i) => (
                <li key={i}>{steps}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
       {(path!=="") ? <button
          className="add"
          onClick={() => {
            fetchUpdateData(idd);
            setPopup(!popup);
          }}
        >
          <FontAwesomeIcon icon={faEdit} style={{fontSize:'40px'}}></FontAwesomeIcon>
        </button>
        :<></>}
        {popup &&  
          <div className="popup" 
          style={{backgroundColor:"#dfe6f5bb"}}>
            <div className="popup-inner">
              <div className='form-group'>
                <label>Name</label>
                <input type='text' style={{backgroundColor:"lightgrey"}} 
                value={updaterecipes.name}  
                onFocus={()=>{setErr(true)}} 
                readonly 
                />
                {err &&
                  <div>
                    <span style={{color:"red"}}>
                    You can't update Recipe Name
                    </span>
                  </div>}
              </div> 
              <div className='form-group'>
                <label>Category</label>
                <input type='text' 
                value={updaterecipes.category}
                onChange={(e)=>{setUpdaterecipes({...updaterecipes,category:e.target.value});}}             
                />
              </div>
              <div className='form-group'>
                <label>Cook Time</label>
                <input type='text' 
                value={updaterecipes.cookTime}
                onChange={(e)=>{setUpdaterecipes({...updaterecipes,cookTime:e.target.value});}}             
                />
              </div>
              <div className='form-group'>
                <label>Preparation Time</label>
                <input type='text' 
                value={updaterecipes.prepTime}
                onChange={(e)=>{setUpdaterecipes({...updaterecipes,prepTime:e.target.value});}}             
                />
              </div>    
              <div className='form-group'>
                <label>Ingredients</label>
                {
                  updaterecipes.ingredients?.map((ingredient,i)=>(
                  <input type='text' key={i}
                  value={ingredient}
                  placeholder={`Ingredient ${i+1}`}
                  onChange={(e) => {handleUpdateIngredient(e, i); 
                  setUpindex(i)}} 
                  />
                  ))
                }
                <button type="button" className='button' 
                  onClick={handleUpdateIngredientCount}>Add Ingredient</button>
                  {upindex ? <button type="button" className="button remove" onClick={() => 
                    removeUpdateFields(index)}>
                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button>:<></> }
              </div>   
              <div className='form-group'>
                <br></br>
                <label>Steps</label>
                {updaterecipes.steps?.map((step,i)=>(
                <input type='text' key={i}
                value={step}
                placeholder={`Step ${i+1}`}
                onChange={(e) => {handleUpdateStep(e, i);
                }} 
                />
                ))}

                <button type="button" onClick={handleUpdateStepCount}>Add Step</button>            
              </div>
              <div className="buttons" >
                <button type="submit"  
                onClick={()=>{handleUpdate()}}> Update </button>
                <button type="button" 
                className="remove"
                onClick={()=>setPopup(!popup)} 
                >Close</button>
                </div>
          </div>
          </div>}
    </>
  );
}
export default RecipeViewer;
