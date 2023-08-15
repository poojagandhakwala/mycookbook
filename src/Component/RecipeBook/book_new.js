import jsPDF from "jspdf";
import {doc,getDoc,getDocs,onSnapshot,query,where,collection} from "firebase/firestore";
import { auth, db, storage } from '../Context/firebase';
import { useEffect, useState } from 'react';
import {ref,getDownloadURL} from 'firebase/storage'; 
import { useAuthState } from "react-firebase-hooks/auth";
import './book.css';
import Logo from "../../Images/logo_round_orange.png";
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';


export default function DownloadPDF(props){
  
    const [recipe_infos,setRecipe_infos]=useState([]);
    const navigate = useNavigate();
  
    const [user, loading] = useAuthState(auth);
    let [userid, setUserid] = useState("");
    const [pathh,setPathh]=useState("");

    const [name,setName]=useState("");
    const [category,setCategory]=useState("");
    const [cooktime,setCooktime]=useState("");
    const [preptime,setPreptime]=useState("");
    const [ings,setIngs]=useState([]);
    const [steps,setSteps]=useState([]);
    const [url,setUrl]=useState("") 
    
    const [imageDataURL, setImageDataURL] = useState(null);
    const [userecipes,setUserecipes]=useState([]);


    const fetchUserId = async () => {
    try {
        const q = query(collection(db, "LoginData"), where("uid", "==", user?.uid));
        let docSnap = await getDocs(q); 
        docSnap.forEach((doc1) => {
            // doc.data() is never undefined for query doc snapshots
            console.log("ID="+ doc1.id, " => ", doc1.data());
            if(userid !==doc1.id || userid === "")
            {
              setUserid(doc1.id); 
              setPathh(`LoginData/${doc1.id}`);
            }
            // us=doc.id;
            ///Recipes_user`); 
            // setPathh(`LoginData/${doc.id}/Recipes_user`); 
        });
        // alert(props.urecipeId[0]);
        // if(props.recipeId)  fetchUserRecipeBook();
      } catch (err) {
          console.error(err);
          alert("An error occured while fetching userid data");
    };
  }

    const fetchRecipe = async (category_name) => {
        try 
        {
          const docRef = query(collection(db, "Recipes"), where ("category", "==", category_name));
          // doc(db, "Recipes");
          const docSnap = await getDocs(docRef);
          docSnap.forEach((doc) => {
            console.log(doc.id);
            // const rcoll=(collection(db,"Recipes"), where ("category", "==", category_name));
            onSnapshot(docRef,snapshot=>{
              setRecipe_infos(snapshot.docs.map(doc1 =>{
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
          alert("An error occured while fetching recipe data");
        }
    };
    const [recipebooks,setRecipebooks]=useState([]);
    const [userecipebooks,setUserecipebooks]=useState([])
    const fetchUserRecipeBook = async () => 
  {
    try 
    {
      let recipeidRef="",recipeRef="",docsnap2="";
      let recipe_ids=props.recipeId;
      recipe_ids=recipe_ids.toString();
      recipe_ids=recipe_ids.split(',');
      if(props.recipeId)
      {   
          recipeRef=collection(db,"Recipes");
          onSnapshot(recipeRef,snapshot=>{
            // alert('length='+snapshot.docs.length);
            setRecipebooks(snapshot.docs.map((doc1,i) =>{
              if(doc1.id===recipe_ids[i])
              { 
                // console.log(doc2.id);
                return{
                      // id:doc2.id,
                      ...doc1.data()
                }
              } 
              else{return 0;}
              }))
          });
          recipeidRef = collection(db,pathh+`/Recipes_user`);
          // docSnap2 = await getDocs(recipeidRef);
          onSnapshot(recipeidRef,snapshot=>{
            setUserecipebooks(
            snapshot.docs.map((doc2,i) =>{
              if(doc2.id===recipe_ids[i])
              {
                return{
                      // id:doc2.id,
                      ...doc2.data()
                }
              } 
              else{return 0;}
              })
            )
          });
        }
    // {alert('length = '+userecipebooks.length)}
  }catch(err){
      console.error(err);
      // alert("An error occured while fetching user recipe data");
    }
}
     useEffect(() => {
              if (loading) return;
              if (!user) return navigate("/");
              fetchUserId();
              // fetchRecipe("Dessert");
              // if(userid) 
              // fetchUserRecipe();
  
      }, [user, loading,]);
      useEffect(()=>{
        if(props.recipeId)  fetchUserRecipeBook();
      })

      const pdf = new jsPDF("p", "mm", "a4");
        
        if(userecipebooks.length>0)
        {
            pdf.text("Title: ",100, 50);
            pdf.text(userecipebooks.name);
            var string = pdf.output('datauristring');
            var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
              var x = window.open();
              x.document.open();
              x.document.write(embed);
              x.document.close();
        }
                    // Category: 
                    // {/* {userecipebooks.category} */}
                    // {u.category}
        
        //   )
        //   )):()
        //   ):()}

     
};