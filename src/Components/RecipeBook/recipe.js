import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import './recipebook.css';
import Book from "./book.js";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  limit,
  where,orderBy,
  serverTimestamp, 
} from "firebase/firestore";import { auth, db, storage } from '../Context/firebase';
import {ref,getDownloadURL} from 'firebase/storage'; 
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

export default function RecipeBook(){
  
  const [preview,setPreview]=useState(false);
  const [userpreview,setUserpreview]=useState(false);

  const [addpopup,setAddpopup]=useState(false);

  const [recipe_infos,setRecipe_infos]=useState([]);
  const navigate = useNavigate();

  const [user, loading] = useAuthState(auth);
  let [userid, setUserid] = useState(null);
  const [pathh,setPathh]=useState("");
  const [userecipes,setUserecipes]=useState([]);
  const [recipes,setRecipes]=useState([]);
  const [rbooks,setRbooks]=useState([]);
  const [requiredBook,setRequiredBook]=useState("");
  let idd="";

  const fetchUserId = async () => {
    try {
        const q = query(collection(db, "LoginData"), where("uid", "==", user?.uid));
        const docSnap = await getDocs(q); 
        docSnap.forEach((doc1) => {
            if(userid !==doc1.id || userid === ""){setUserid(doc1.id); }
            if(idd==="")
            {idd=doc1.id}
          })
          const uscoll=collection(db,`Recipes`);
                    onSnapshot(uscoll,snapshot=>{
                        setRecipes(snapshot.docs.map(doc1 =>{
                            return {
                                ...recipes,
                                id:doc1.id,
                                viewing:false,
                                ...doc1.data()
                            } 
                        }))
                });
            const rec=collection(db,`LoginData/${idd}/Recipes_user`);
            onSnapshot(rec,snapshot=>{
              setUserecipes(snapshot.docs.map(doc2 =>{
                  return {
                      id:doc2.id,
                      ...doc2.data()
                   }
              }))
            });

          const books=collection(db,`LoginData/${idd}/RecipeBooks`);
          onSnapshot(books,snapshot=>{
            setRbooks(snapshot.docs.map(doc2 =>{
                return {
                    id:doc2.id,
                    ...doc2.data()
                  }
            }))
          });    
      } catch (err) {
          console.error(err);
          alert("An error occured while fetching userid data");
      }
    };

  const fetchUserRecipe = async () => {
    try 
    {
      const docRef = query(collection(db, `LoginData/${userid}/Recipes_user`));
      const docSnap = await getDocs(docRef);
      docSnap.forEach((doc) => {
        console.log(doc.id);
        onSnapshot(docRef,snapshot=>{
          setUserecipes(snapshot.docs.map(doc1 =>{
              return {
                  id:doc1.id,
                  ...doc1.data()
              } 
          }))
        }); 
    })
  }catch(err){
      console.error(err);
      alert("An error occured while fetching user recipe data");
    }
};

const [bookrecipes,setBookrecipes]=useState([{rid:""}]);
const [data,setData] = useState({
  titles:"",
  recipes_id:[],
});
const {titles,recipes_id}=data;
const isCheckedd=(e)=>{
  if(e.target.checked)
    return true;
  else
    return false;
}

const [checked, setChecked] = useState([]);
const [peopleInfo, setPeopleInfo] = useState([]);
const isChecked=(e,i)=>{
  let tempPeopleInfo = data.recipes_id;
  if (tempPeopleInfo.some((people) => people.id === e.target.value)) {
    tempPeopleInfo = tempPeopleInfo.filter((people) => people.id !== e.target.value);
  } else {
    tempPeopleInfo.push(e.target.value);
  }
  setPeopleInfo(tempPeopleInfo);
setData({
  ...data,recipes_id:tempPeopleInfo
})
}
const notify=()=>{toast("Recipebook created")}
const handleSubmit = async (e) => {
  e.preventDefault();
  const q = query(
    collection(db, `LoginData/${userid}/RecipeBooks`),
    where("userid", "==", parseInt(userid,10))
  );
  const docs = await getDocs(q);
  let myId = "";
  let useridd = 0;
  if (docs.docs.length === 0) 
  {
    myId = userid + "501";
    var id_no=parseInt(myId,10);
    {
      const DocRef = doc(
        collection(db, `LoginData/${userid}/RecipeBooks`),
        `${id_no}`
      );
      useridd = parseInt(userid,10);
      console.log("id_no = "+id_no);  
      console.log("recipes_id = "+recipes_id);  

      setDoc(DocRef, {
        ...data,
        userid: useridd,
        timestamp: serverTimestamp(),
      });      
      notify();
      setAddpopup(false);
      navigate("/recipebook");
      setData({
        titles:"",
        recipes_id:[],
      });
    }
  } 
  else 
  {
    const lastdocRef = query(
      collection(db, `LoginData/${userid}/RecipeBooks`),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const docSnap = await getDocs(lastdocRef);
    docSnap.forEach((doc) => {
      myId = doc.id;
    });
    myId = parseInt(myId, 10);
    myId += 1;
    var id_no=myId;
      const newDocRef = doc(
        collection(db, `LoginData/${userid}/RecipeBooks`),
        `${id_no}`
      );
      useridd = parseInt(userid,10);
      console.log("useridd= "+useridd);
      console.log("recipes_id = "+recipes_id);  

      setDoc(newDocRef, {
        ...data,
        userid: useridd,
        timestamp: serverTimestamp(),
      });      
      notify();
      setAddpopup(false);
      navigate("/recipebook");
      setData({
        titles:"",
        recipes_id:[],
      });
  }
}
const del_notify=()=>{toast("Recipebook deleted!");}
const handleDelete = async (docid) => {
  if(window.confirm("Are you sure want to delete?"))
  {
    try {
    const docRef = doc(collection(db, `LoginData/${userid}/RecipeBooks`),`${docid}`);
    await deleteDoc(docRef);
    del_notify(); 
    
  } catch (err) {
    console.log(err);
  }
}
};

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserId();
  }, [user, loading,]);

  return(
      <>
      <div className='container'>
      <div className='row'>
      <div className="book-templates">
        <Card
         className="recipebook-card"> 
        <button  style={{height:"11rem"}}
        onClick={()=>setAddpopup(true)}
        > 
          <FontAwesomeIcon icon={faPlus}  
          style={{height:"90px",
        marginTop:"10px"
        }}/>
        Create RecipeBook</button>
        </Card>
        <div className="recipebook-cardd">
        <Card style={{width:"10rem"}} 
        className="col-md-12" > 
         <Card.Title className="card-titles">Dessert</Card.Title>
         <div style={styles}><Card.Body>
           <button className="btn" 
            style={{backgroundColor:'#e96100',color:'white'}}
            onClick={() =>{setPreview(!preview)}}
           >Preview</button>
         </Card.Body>
         </div>
        </Card>
        </div>
        {
          (rbooks.length>0)?(
            rbooks.map((rbook,i)=>
          (    
            <div className="recipebook-cardd" 
            >
            <Card style={{width:"10rem"}} 
            className="col-md-12"> 
              <Card.Title className="card-titles"> 
                {/* Title = */}
                {rbook.titles}
                </Card.Title>
              <div style={styles}>
                <Card.Body>
                  <button className="btn" 
                  style={{backgroundColor:'#e96100',color:'white'}}
                  onClick=
                  {() =>{setUserpreview(!userpreview);
                  setRequiredBook(rbook.titles)}}
                  >Preview</button>

                  <FontAwesomeIcon icon={faTrash}
                    style={{cursor: "pointer",
                    marginTop:"22px",
                    //  marginLeft:"180px"
                    }
                    }
                    alt="DELETE"
                    onClick={()=>{
                      {handleDelete(rbook.id)}}}
                    // onClick={() => props.deleteNote(props.note.id)}
                  />
                </Card.Body>
                
              </div>
            </Card> 
            </div>
           
          )) ):(<></>)
        } 
      </div>
      </div>
      </div>
     
      {
      // (user) && 
      addpopup && 
      <div className='popup '
        style={{height:'100%',width:'400px',
        padding:'50px 5px',
        paddingTop:'60px',
        margin:'100px 450px',
        backgroundColor:'#ffffffe7',
        border:'1px grey solid',
        borderRadius:'10px'}}
      >
        <div className="Form popup-inner">

          <h2> Select Recipes </h2>
          <form onSubmit={handleSubmit}>
          <div className='form-group'>
          <label>Book Title</label>
          <input type='text'
          className='booktitle'
          placeholder='Title'
          id="bookTitle"
          value= {data.titles}
          onChange={(e) => {
            setData(
            {...data,
              titles:e.target.value
            });}}
          />
            <label>Recipe Name</label>
            {
               recipes.map((recipe, i) => (
                <div style={{display:'flex',flexDirection:'row'}}>
                  <li>{recipe.name}</li>
                  <input 
                  className="addtobook
                  form-check-input" 
                  type="checkbox" 
                  id="chk" 
                  value={recipe.id} 
                  key={i}
                  onChange={(e)=>{ e.target.checked ? isChecked(e,i)
                    :<></>
                  }}
                  />
                </div>
                ))
            }            
            {
              userecipes.map((userecipe, i) => (
              <div style={{display:'flex',flexDirection:'row'}}>
                <li>{userecipe.name}</li>
                <input 
                className="addtobook
                form-check-input" 
                type="checkbox" 
                name="ingredients" id="chk" 
                value={userecipe.id} 
                key={i}
                placeholder={`Recipe ${i+1}`}
                onChange={(e)=>{isChecked(e,i)}}
                />
              </div>
              ))
            }
            <div className="buttons" style={{padding:'2px'}}>
              <button type="submit"
              onClick={()=>{
              (data.recipes_id===[] || data.titles==="")?
              alert("Please select any recipe!") 
              : handleSubmit()}}>
                  Submit
              </button>    
              <button type="button" 
              onClick={()=>{setAddpopup(!addpopup); 
                setData({
                titles:"",
                recipes_id:[],
                });
              }} className="remove">
                Close
              </button>
              </div>  
            </div>
            </form>
        </div>
        </div>}
      { preview && 
        <div className="book-preview">
          <Book category='Dessert'/>
        </div>
      }
      { userpreview && <div className="book-preview">
        {          
          (rbooks?.length > 0) ? 
          (rbooks.map((rbook)=>
          (
            <>
              {(requiredBook === rbook.titles)?
              (
                <Book 
                title={rbook.titles}
                recipeId={rbook.recipes_id}/>
              )
              :(<></>)  }       
            </>
            )
            )
          ):(<></>)
        }      
        </div>
      }
      </>
  )
};