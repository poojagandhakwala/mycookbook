import { PDFViewer,Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer/lib/react-pdf.browser.es.js';
// import { pdfjs } from "react-pdf";
import { PDFDownloadLink} from '@react-pdf/renderer';
import {doc,getDoc,getDocs,onSnapshot,query,where,collection} from "firebase/firestore";
import { auth, db, storage } from '../Context/firebase';
import { useEffect, useState } from 'react';
import {ref,getDownloadURL} from 'firebase/storage'; 
import { useAuthState } from "react-firebase-hooks/auth";
import './book.css';
import Logo from "../../Images/logo_round_orange.png";
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
//import PDFDocument from '@react-pdf/pdfkit';

const styles = StyleSheet.create({
    // page: {
    //   flexDirection: 'row',
    //   backgroundColor: '#E4E4E4'
    // },
    // section: {
    //   margin: 10,
    //   padding: 10,
    //   flexGrow: 1
    // },
    title:{
      color:"tomato",
    },
    content:{
      fontSize:"18px",
      // display:"block",
      listType:"number",
      // flexDirection: 'column',
      // width: 200
    },
    listcontent:{
      listType:'number',
      // display:'block',
     
      // flexDirection: 'column'
    },
    // img:{
    //    height:"200px",
    //   width:"200px",
    //   // backgroundColor:"pink",
    //   display:"inline",
    // },
    page: {
      backgroundColor:"white",
      color: "black",
       margin: "5px",
      padding: "5px",
    },
    section: {
      margin: "5px",
      padding: "5px",
      // flexGrow: 1,  
      // display:"block",
    },
    viewer: {
      width: window.innerWidth, //the pdf viewer will take up all of the width and height
      height: window.innerHeight,
      
    },
  });

function Book(props){
  
    const [recipe_infos,setRecipe_infos]=useState([]);
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    let [userid, setUserid] = useState("");
    const [pathh,setPathh]=useState("");
    const [recipebooks,setRecipebooks]=useState([]);
    const [userecipebooks,setUserecipebooks]=useState([])

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
          // docSnap.forEach((doc) => {
            // console.log(doc.id);
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
        // })
      }catch(err){
          console.error(err);
          alert("An error occured while fetching recipe data");
        }
    };
  //   const fetchUserRecipe = async () => {
  //     try 
  //     {
  //       // alert(userid);
  //       const docRef = query(collection(db, `LoginData/${userid}/Recipes_user`));
  //       //, where ("category", "==", category_name));
  //       // doc(db, "Recipes");
  //       const docSnap = await getDocs(docRef);
  //       docSnap.forEach((doc) => {
  //         console.log(doc.id);
  //         // const rcoll=(collection(db,"Recipes"), where ("category", "==", category_name));
  //         onSnapshot(docRef,snapshot=>{
  //           setUserecipes(snapshot.docs.map(doc1 =>{
  //               return {
  //                   id:doc1.id,
  //                   // viewing:false,
  //                   ...doc1.data()
  //               } 
  //           }))
  //         }); 
  //     })
  //   }catch(err){
  //       console.error(err);
  //       alert("An error occured while fetching user recipe data");
  //     }
  // };
  

  //   {name:"",
  //   category:"",
  //   cookTime:"",
  //   prepTime:"",
  //   ingredients:[""],
  //   steps:[""],
  // }
  // ]);
  // let userecipebooks=[];

  const fetchUserRecipeBook = async () => 
  {
    try 
    {
      let recipeidRef="",recipeRef="",docsnap2="";
      let recipe_ids=props.recipeId;
      recipe_ids=recipe_ids.toString();
      recipe_ids=recipe_ids.split(',');
      // alert("Exists = "+recipe_ids.length);
      let temp=[],temp1=[];
      for(var i=0;i<recipe_ids.length;i++)
      {
          const docRef=doc(db,"Recipes",recipe_ids[i]);
          const ds=await getDoc(docRef);
          if(ds.exists()){
            // alert("Exists = "+recipe_ids[i]);
            temp.push(
              {   id:ds.id,
                  name:ds.get("name"),
                  category:ds.get("category"),
                  prepTime:ds.get('prepTime'),
                  cookTime:ds.get('cookTime'),
                  ingredients:ds.get('ingredients'),
                  steps:ds.get('steps')
              })
          }
          else 
          {
            const docRef1=doc(db,pathh+'/Recipes_user',recipe_ids[i]);
            const  ds1=await getDoc(docRef1);
          if(ds1.exists()){
              temp1.push(
              {   id:ds1.id,
                  name:ds1.get("name"),
                  category:ds1.get("category"),
                  prepTime:ds1.get('prepTime'),
                  cookTime:ds1.get('cookTime'),
                  ingredients:ds1.get('ingredients'),
                  steps:ds1.get('steps')
              })
            } 
          }
      }
      setRecipebooks(temp);
      setUserecipebooks(temp1);

      // if(props.recipeId)
      // {  
       
      //     // recipeRef=collection(db,"Recipes");
      //     // onSnapshot(recipeRef,snapshot=>{
      //     //   // alert('length='+snapshot.docs.length);
      //     //   setRecipebooks(snapshot.docs.map((doc1,i) =>{
      //     //     if(doc1.id===recipe_ids[i])
      //     //     { 
      //     //       // console.log(doc2.id);
      //     //       return{
      //     //             // id:doc2.id,
      //     //             ...doc1.data()
      //     //       }
      //     //     } 
      //     //     else{return 0;}
      //     //     }))
      //     // });
      //     recipeidRef = collection(db,pathh+`/Recipes_user`);
      //     // docSnap2 = await getDocs(recipeidRef);
      //     onSnapshot(recipeidRef,snapshot=>{
      //       setUserecipebooks(
      //       snapshot.docs.map((doc2,i) =>{
      //         if(doc2.id===recipe_ids[i])
      //         {
      //           return{
      //                 // id:doc2.id,
      //                 ...doc2.data()
      //           }
      //         } 
      //         else{return 0;}
      //         })
      //       )
      //     });
      //   }
    // {alert('length = '+userecipebooks.length)}
  }catch(err){
      console.error(err);
      // alert("An error occured while fetching user recipe data");
    }
}
   useEffect(() => {
            if (loading) return;
            if (!user) return navigate("/");
            console.clear();
            fetchUserId();

            // fetchRecipe("Dessert");
            // if(userid) 
            // fetchUserRecipe();
    }, [user, loading,]);
    useEffect(()=>{
      if(props.recipeId)  fetchUserRecipeBook();
      if(props.category)  fetchRecipe(props.category);
      
    })
    
    return (
      <>  
    {/* {alert('lengthhh='+userecipebooks.length)} */}
    <PDFViewer style={styles.viewer} >
      <Document title={props.title}>

      {((recipe_infos.length>0)? 
       recipe_infos.map((recipe,i)=>
       (
       <>
        <Page size="A4" style={styles.page}>
          <View 
          style={styles.section} 
          // key={userecipebooks.id}
          >
            <Text style={styles.title}> 
            Title: 
            {recipe.name}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>Category: 
              {recipe.category}
            </Text>
                    
            <Text>Cooking Time: 
              {recipe.cookTime}
            </Text>

            <Text>Preparation Time: 
              {recipe.prepTime}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>Ingredients:</Text>
          </View>
            <View style={styles.listcontent}>
              {recipe.ingredients.map((ing,i)=>(
              <li key={i}>
                <Text >{ ing }</Text>
              </li>
            ))}  
          </View>
          <View style={styles.section}>
          <Text style={styles.content}>Steps: 
            <Text><ol>
              {recipe.steps.map((step,i)=>(
                  <li key={i}>
                    <Text style={styles.listcontent}>
                      {step}
                      </Text>
                    </li>
              ))}
            </ol> 
          </Text>
          </Text>
        </View> 
          </Page>
      </>
          ))
       :<></>)
      }
      {/* {userecipes.map((userrecipe,i)=>(
      <>
        <Page size="A4" style={styles.page}>
        
            <View style={styles.section} key={userrecipe.id}>
              <Text style={styles.title}> Title: {userrecipe.name}</Text>
              <Text>Category: {userrecipe.category}</Text>
            </View>
          
            <View style={styles.section}>
              <Text>Ingregients:</Text>
            <Text style={styles.content}>
              {userrecipe.ingredients}</Text>
            </View>
            <View style={styles.section}>
            <Text style={styles.content}>Steps: </Text>
            <Text> {userrecipe.steps}</Text>
            </View>
           
      </Page>
      </>
          ))} */}

    {/* {userecipebooks.map((userecipebook,i)=>( */}
{/* {alert(Array.isArray(userecipebooks))} */}
    {/* {alert('l='+userecipebooks.length)} */}
    {/* {alert("in pdf = "+userecipebooks[0].name)} */}

   {((recipebooks.length>0)? 
    recipebooks.map((recipebook,i)=> 
     (
     <>
      {(recipebook!==0)?
        <> 
          <Page size="A4" style={styles.page}>
          <View 
          style={styles.section} 
          // key={userecipebooks.id}
          >
            <Text style={styles.title}> 
            Title: 
            {recipebook.name}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>Category: 
              {recipebook.category}
            </Text>
                    
            <Text>Cooking Time: 
              {recipebook.cookTime}
            </Text>

            <Text>Preparation Time: 
              {recipebook.prepTime}
            </Text>
          </View>
  
          <View style={styles.section}>
            <Text>Ingredients:</Text>
          
            <View style={styles.listcontent}>
              {recipebook.ingredients.map((ing,i)=>(
              <li key={i}>
                <Text >{ ing }</Text>
              </li>
            ))}  
          </View>
          </View>
          <View style={styles.section}>
          <Text style={styles.content}>Steps: 
            <Text><ol>
              {recipebook.steps.map((step,i)=>(
                  <li key={i}>
                    <Text>
                      {step}
                      </Text>
                    </li>
              ))}
            </ol> 
          </Text>
          </Text>
        </View> 
          </Page>
        </>
        :<></>} 
     </>
     ))
     :<></>
    )
    }  
    {
    // (props.recipeId)?
     ((userecipebooks.length>0)? 
     userecipebooks.map((userecipebook,i)=> 
      (
      <>
        {(userecipebook!==0)?
        <> 
        <Page size="A4" style={styles.page}>
        <View 
          style={styles.section} 
          // key={userecipebooks.id}
          >
            <Text style={styles.title}> 
            Title: 
            {userecipebook.name}
            </Text>
        </View>
        <View style={styles.section}>
            <Text>Category: 
              {userecipebook.category}
            </Text>
                    
          <Text>Cooking Time: 
              {userecipebook.cookTime}
            </Text>
        
        <Text>Preparation Time: 
            {userecipebook.prepTime}
          </Text>
        </View>
      
        <View style={styles.section}>
          <Text>Ingredients:</Text>
          <View style={styles.listcontent}>
          {userecipebook.ingredients.map((ing,i)=>(
            <li key={i}>
              <Text >{ ing }</Text>
            </li>
          ))} 
        </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.content}>Steps: 
            <ol>
            {userecipebook.steps.map((step,i)=>(
                <li key={i}>
                  <Text style={styles.listcontent}>
                {step}
                </Text>
              </li>
              ))}
            </ol> 
          </Text>
        </View>
        </Page>
        </>
        :
        <></>}
      </>
      )):<></>
      )
      // :(<></>)
    }
    </Document> 
    </PDFViewer>
    </>
    );
  }
export default Book;





{/* <p>Image from imagedata url</p>
      <img  style={styles.img} src={imageDataURL} alt=""/>
      <p>Image from local storage</p>

      <img  style={styles.img} src={Logo} alt=""/> */}
      {/* const doc = new PDFDocument();
      doc.image(imageDataURL, {
        fit: [250, 250],
        align: 'center',
        valign: 'center'
      }); */}


{/* <Text>{recipe_info.url}</Text> */}

            {/* <Image cache={false} style={styles.img} src="https://firebasestorage.googleapis.com/v0/b/cookbook-755f8.appspot.com/o/cheesecake.jpg"/>
            {{uri:recipe_info.url}}
            {{uri:"https://firebasestorage.googleapis.com/v0/b/cookbook-755f8.appspot.com/o/cheesecake.jpg?alt=media&token=57e16400-01a7-4a00-9405-e2e73eae7383"}}
            {recipe_info.imgurl}
            {Logo} */}
            {/* {ImageUrl[i]} */}

{/* <Page>
      <Image style={styles.img} src={Logo}/>
      <img  style={styles.img} src={Logo} alt=""/>

      <View style={styles.section}>
        <img  style={styles.img} src={imageDataURL} alt="image"/>
        <Text>Image from local storage </Text>
        <Image style={styles.img} src={Logo}/>
        <Text>Image from imagedata url </Text>
         {imageDataURL && ( 
        <Image
          src={imageDataURL}
          style={{ width: '100%', height: 'auto' }}
        />
       )} 
      </View>
      </Page> */}

         {/* 
          <Text>Section #1</Text>
          <Text>Hello</Text>
          
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View> */}









//  // alert(userid);
//       // const docRef = query(collection(db, `LoginData/${userid}/Recipes_user`));
//       // const docSnap = await getDocs(docRef);
//       alert(props.urecipeId);
//       let recipeidRef="",docSnap="";
//       for(var i=0;i<=props.urecipeId.length;i++)
//       {
//         recipeidRef = doc(collection(db,
//           `LoginData/${userid}/Recipes_user`),
//           "101201");
//           // `${props.urecipeId}`);
//           // `${props.urecipeId[i]}`);
//         docSnap = await getDoc(recipeidRef);
//         setUserecipebooks(...docSnap.data());
//         // docSnap.forEach((doc) => {
//           // console.log(doc.id);
//           // const rcoll=(collection(db,"Recipes"), where ("category", "==", category_name));
//           // onSnapshot(recipeidRef,snapshot=>{
//             // setUserecipebooks(snapshot.docs.map(doc1 =>{
//             //     return {
//             //         id:doc1.id,
//             //         // viewing:false,
//             //         ...doc1.data()
//             //     } 
//             // }))
//       //     }); 
//       // })
//       }