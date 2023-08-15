import React, { useEffect, useState } from "react";
//import { Link, useMatch, useResolvedPath } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import './recipebook.css';
import Book from "./book.js";
import { Button, Col, Container, Row } from "react-bootstrap";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
//import print from "./book_new";

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
// import Print from "./book_new";


const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};
// const colstyle = {
//   width: "30%"
// };
// const tableStyle = {
//   width: "100%"
// };

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
            // doc.data() is never undefined for query doc snapshots
            // console.log("ID="+ doc1.id, " => ", doc1.data());
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
                // alert("uscoll " +doc1.id)
                  return {
                      id:doc2.id,
                      ...doc2.data()
                   }
              }))
            });

          const books=collection(db,`LoginData/${idd}/RecipeBooks`);
          onSnapshot(books,snapshot=>{
            setRbooks(snapshot.docs.map(doc2 =>{
              // alert("uscoll " +doc1.id)
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
      // alert(userid);
      const docRef = query(collection(db, `LoginData/${userid}/Recipes_user`));
      //, where ("category", "==", category_name));
      // doc(db, "Recipes");
      const docSnap = await getDocs(docRef);
      docSnap.forEach((doc) => {
        console.log(doc.id);
        // const rcoll=(collection(db,"Recipes"), where ("category", "==", category_name));
        onSnapshot(docRef,snapshot=>{
          setUserecipes(snapshot.docs.map(doc1 =>{
              return {
                  id:doc1.id,
                  // viewing:false,
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

// let checkedValue = []; 
// const [cards,setCards]=useState([{title:""}]);
// const title=[];
// let [index,setIndex]=useState();
const isCheckedd=(e)=>{
  if(e.target.checked)
    return true;
  else
    return false;
}

const [checked, setChecked] = useState([]);
// const isChecked=(event,i)=>{
//   var updatedList = [];
//   if (event.target.checked) {
//     updatedList = [...data.recipes_id, event.target.value];
//     setData(
//       {...data,
//         recipes_id:updatedList,  
//     });
//   } else {
//     if(data.recipes_id.length>1)
//     {
//       console.log("length = ",data.recipes_id.length);
//       updatedList=[];
//       setData(
//        {...data,
//          recipes_id:updatedList,  
//      });
//     }
// }
  // }

//   const isChecked=(e,i)=>{
//   if(e.target.checked)
//   {
//     // checkedValue.push({rid:inputElements[i].value});
//   //  alert("Checked values = "+checkedValue[i].rid);
//     // setBookrecipes(checkedValue);
//     // alert("Bookrecipes values = "+bookrecipes[i].rid);
//     const idClone = [...data.recipes_id]
//     idClone[i] = e.target.value;
//     console.log("in ischecked value ="+idClone[i]);
//     setData(
//       {    ...data,
//         recipes_id:idClone,  
//     });
//     console.log("in ischecked recipes_id= ="+data.recipes_id);
//   }
//   else
//   {
//     setData(
//       {...data,
//         recipes_id,  
//     });
//   }
// }

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
    // if (window.confirm("Want to add first document " + id_no + "?")) 
    {
      const DocRef = doc(
        collection(db, `LoginData/${userid}/RecipeBooks`),
        `${id_no}`
      );
      // console.log("Useridd = "+useridd);  
      useridd = parseInt(userid,10);
      console.log("id_no = "+id_no);  
      console.log("recipes_id = "+recipes_id);  

      setDoc(DocRef, {
        ...data,
        userid: useridd,
        timestamp: serverTimestamp(),
      });      
      notify();
      // alert("Recipebook created");
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
    // myId = myId.toString();
    var id_no=myId;
    // var id_no=parseInt(myId,10);
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
      // alert("Recipebook created");
      setAddpopup(false);
      navigate("/recipebook");
      setData({
        titles:"",
        recipes_id:[],
      });
  }
  // setAddpopup(false);
}
const del_notify=()=>{toast("Recipebook deleted!");}
const handleDelete = async (docid) => {
  if(window.confirm("Are you sure want to delete?"))
  {
    try {
    const docRef = doc(collection(db, `LoginData/${userid}/RecipeBooks`),`${docid}`);
    await deleteDoc(docRef);
    // setUsers(users.filter((item) => item.id !== id));
    // alert("Recipebook deleted of id = "+docid);
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
    // fetchRecipe("Dessert");
    // if(userid) 
    // fetchUserRecipe();
  }, [user, loading,]);



  return(
      <>
      <Container>
      <Row>
      {/* <Col md={4}> */}
      <div className="book-templates" style={{marginTop:"150px"}}>
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
         {/* <FontAwesomeIcon icon={faPlus}  style={{height:"50px",marginTop:"40px"}}/> */}
         <Card.Title className="card-titles">Dessert</Card.Title>
         <div style={styles}><Card.Body>
           <Button variant="btn-primary" 
           style={{border:"1px solid grey"}}
           onClick=
            //{print}
           {() =>{setPreview(!preview)}}
           >Preview</Button>
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
                <Card.Body 
                // style={{display:'inline-flex',margin:'-15px'}}
                >
                  <Button variant="btn-primary" 
                style={{border:"1px solid grey"}}

                  onClick=
                  {() =>{setUserpreview(!userpreview);
                  setRequiredBook(rbook.titles)}}
                  >Preview</Button>

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
      {/* </Col> */}
      </Row>
      </Container>
     
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
        {/* <div className='popup'> */}
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
              titles:e.target.value,
              // notes:props.usernote,
              // color:props.color
            });}}
          />
            <label>Recipe Name</label>
            {/* <div style={{display:'inline'}}> */}
            {
               recipes.map((recipe, i) => (
                <div style={{display:'flex',flexDirection:'row'}}>
                  <li>{recipe.name}</li>
                  <input 
                  // className='list-add'
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
            {/* </div> */}
            
            {
              userecipes.map((userecipe, i) => (
                <div style={{display:'flex',flexDirection:'row'}}>
                <li>{userecipe.name}</li>
                <input 
                // className='list-add'
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
              : handleSubmit()}}
            // className="remove"
            >Submit</button>    
            <button type="button" 
            onClick={()=>{setAddpopup(!addpopup); 
              setData({
              titles:"",
              recipes_id:[],
              });
            }} 
            className="remove">Close</button>
              </div>  
            </div>
            </form>
        </div>
        {/* </div> */}
        </div>}

       
      { preview && <div className="book-preview">
          <Book category='Dessert'/>
          {/* <Book urecipeId={userecipes[0].id}/> */}
          {/* {alert(bookrecipes.length)} */}
         
          {/* <Book urecipeId={bookrecipes}/> */}

        </div>
      }
      { userpreview && <div className="book-preview">
      {/* {alert(bookrecipes[0].rid)} */}
          {/* <Book urecipeId={checkedValue}/> */}
          {
          // (bookrecipes?.length > 0) ? 
          // (bookrecipes.map((bookrecipe)=>
          
          (rbooks?.length > 0) ? 
          (rbooks.map((rbook)=>
          (
            <>
               {/* <Book recipeId={bookrecipe.rid}/> */}
              {/* {alert("after calling book for "+ */}
              {/* rbooks.recipes_id)} */}

              {(requiredBook === rbook.titles)?
              (
                <>
                {/* <Print title={rbook.titles}
              recipeId={rbook.recipes_id}/> */}
                {/* {
            alert("requiredBook = "+requiredBook
             + " rbook.titles= "+rbook.titles)} */}
              <Book 
              title={rbook.titles}
              recipeId={rbook.recipes_id}/>
              </>)
                :(<></>)  }       
            </>
            )
            )
          ):(<></>)
        }      
          
        </div>
      }

        {/* <button onClick={bookview} className="mx-5">View</button>*/}
        {/* {bookview}  */}
        {/* <Book/> */}
        {/* {ReactPDF.renderToStream(<Book />)}*/}
        {/* {ReactPDF.render(<Book />, `${__dirname}/example.pdf`)} */}
      </>
  )
};


// function CustomLink({to, children,...props}){
//   const resolvedPath = useResolvedPath(to)
//   const isActive = useMatch({path:resolvedPath.pathname, end: true})
//    return (
//        <li className={isActive ? "active" :""}>
//            <Link to={to} {...props}>
//                {children}
//            </Link>
//        </li>
//    )
// }