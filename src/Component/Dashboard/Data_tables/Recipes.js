import {
    collection,
    onSnapshot,
    doc,
    addDoc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,orderBy,
    serverTimestamp
} from "firebase/firestore";
import { auth, db} from '../../Context/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import DashboardHeader from '../components/DashboardHeader/index.js';
import {calculateRange, sliceData} from '../utils/table-pagination';
import './users.css';
import DoneIcon from '../assets/icons/done.svg';
import CancelIcon from '../assets/icons/cancel.svg';
import RefundedIcon from '../assets/icons/refunded.svg';
import SideBar from "../components/Sidebar";
import sidebar_menu from '../constants/sidebar-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAdd, faClose, faTrash} from '@fortawesome/free-solid-svg-icons';
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import {storage} from '../../Context/firebase';
import './Recipes.css'
// import '../../Home/Home.css'


const Recipes_data = ()=>{
    const [data,setData] = useState({
        name:"",
        category:"",
        prepTime:"",
        cookTime:"",
        ingredients:[""],
        steps:[""],
    })
    const [errors,setErrors]=useState({});
    let [index,setIndex]=useState();
    const {name, category, ingredients,steps}=data;  
    const [image, setImage] = useState(null);
    const [isSubmit, setIsSubmit] = useState(0);
    const [progress, setProgress] = useState(false);
    const [url, setUrl] = useState(""); 

   const [recipes,setRecipes]=useState([])
    const navigate= useNavigate();
    let us="";
    const [user, loading, error] = useAuthState(auth);
    let [userid, setUserid] = useState("");
    // let [users,setUsers]=useState([]);
    let [pathh,setPathh]=useState("");
    const [popup,setPopup]=useState(false);
    const [updaterecipes,setUpdaterecipes]=useState({
        name:"",
        category:"",
        prepTime:"",
        cookTime:"",
        ingredients:[""],
        steps:[""],
        id:""
    })


    const [popupActive,setPopupActive]=useState(false);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState([]);


    const fetchRecipedata = async () => {
        try {
            // const q = query(collection(db, "Recipes"));
            // const querySnapshot = await getDocs(q); 
            // querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
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
            // })
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };
    useEffect(() => {
            if (loading) return;
            if (!user) return navigate("/");
            fetchRecipedata();
                           
    }, [loading]);
    
    useEffect(()=>{
        setPagination(calculateRange(recipes, 5));
        setRecipes(sliceData(recipes, page, 5));
    },[]);

    // Change Page 
    const __handleChangePage = (new_page) => {
        setPage(new_page);
        setRecipes(sliceData(recipes, new_page, 5));
    }


    const handleDelete = async (id,n) => {
        
        try {
           if(window.confirm("Are you sure want Delete ?"))
           {
          await deleteDoc(doc(db, `Recipes`, id));
          setRecipes(recipes.filter((item) => item.id !== id));
          alert("Recipe deleted of id = "+id+"Name= "+n);
           }
        } catch (err) {
          console.log(err);
        }
      };
      
      const [err,setErr]=useState(false);
      let [updateId,setUpdateId]=useState("");

      const fetchData=async(id1)=>{

        try {
            setUpdateId(id1);
            const q = doc(db,"Recipes",id1)//,where("name","==",n));
            const docSnap = await getDoc(q);
            // const dat=q.data();
            if(docSnap.exists())
            {
                // alert(q.id);
                // alert("Id = "+q.id+" Name = "+docSnap.get('name'));
                setUpdaterecipes(docSnap.data(),{id:id1});
            }
        } catch (err) {
            console.log(err);
        }
      }
      let [upindex,setUpindex]=useState();

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

    const [viewRecipes,setViewRecipes]=useState([]);
    const [view,setView]=useState(false);
    const [namee,setNamee]=useState("");
    const [categoryy,setCategoryy]=useState("");
    const [cooktime,setCooktime]=useState("");
    const [preptime,setPreptime]=useState("");
    const [ing,setIng]=useState([]);
    const [stepps,setStepps]=useState([]);
    const [id,setId]=useState('');


    const handleView = async (idd) => {
        // try {
            // setView(id);
            // alert("parameter id = "+id);
            const recipeRef = doc(db, "Recipes",idd);
            const docSnap=await getDoc(recipeRef);

            if(docSnap.exists())
            {  
                setId(idd);
                setNamee(docSnap.get('name'));
                setCategoryy(docSnap.get('category'));
                setPreptime(docSnap.get('prepTime'));
                setCooktime(docSnap.get('cookTime'));
                setIng(docSnap.get('ingredients'));
                setStepps(docSnap.get('steps'));
            }
            // })
            // const dat=q.data();
          
                // alert(q.id);
                // alert("Id = "+q.id+" Name = "+docSnap.get('name'));
                // setUpdaterecipes(docSnap.data(),{id:id1});
            
        // } catch (err) {
        //     console.log(err);
        //   }
    }
      const handleUpdate=async () => {
        try {
            alert("Id = "+updateId);
            const recipeRef = doc(db, "Recipes",updateId);
            const docSnap=await getDoc(recipeRef);
            // alert("Id = "+updateId);
            if(docSnap.exists())
            {
            alert("docsnap exists");
                await updateDoc
                (recipeRef,{
                    category:updaterecipes.category,
                    cookTime:updaterecipes.cookTime,
                    prepTime:updaterecipes.prepTime,
                    ingredients:updaterecipes.ingredients,
                    steps:updaterecipes.steps,
                    // updaterecipes,
                    // timestamp:serverTimestamp()
                }, {merge:true})
            }
           
            alert("Update successfully");
            navigate("/dashboard/recipes");
            setUpdaterecipes({
                name:"",
                category:"",
                prepTime:"",
                cookTime:"",
                ingredients:[""],
                steps:[""],
              })
        } catch (err) {
            console.log(err);
        }

       }
       
    const handleSubmit = async (e) =>{
    e.preventDefault();
    let errors= validate();
    if(Object.keys(errors).length)  return setErrors(errors);
    setIsSubmit(true);
    await addDoc(collection(db,`Recipes`),{
        ...data,
        url,
        timestamp:serverTimestamp()
        }); 
    alert("Data added successfully.");
    navigate("/dashboard/recipes");      
    setData({
        name:"",
        category:"",
        prepTime:"",
        cookTime:"",
        ingredients:[""],
        steps:[""],
    })
    setPopupActive(false);
    // db.collection("Recipes").doc(my_id).set({
    //     ...data,
    //     url,
    //     timestamp: serverTimestamp()
    //   });



    // db.collection("Recipes").add({
    //     ...data,
    //     id: my_id,
    //     timestamp:serverTimestamp()
    // });  
    // await add(collection(db,`Recipes`),{
    //     ...data,
    //     url,
    //     id:my_id,
    //     timestamp:serverTimestamp()
    //     });  
    
    } 

      useEffect(()=>{
        const handleUpload = () => {
            const name=new Date().getTime() + image.name;
            const imageRef =ref(storage,`images/${image.name}`);
            const uploadTask = uploadBytesResumable(imageRef, image);
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress = 
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(progress);
                switch(snapshot.state)
                {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
              },(error) => {
                console.log(error);
              },
              () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
                        setUrl((prev) => ({...prev,url:downloadURL}))
                    })
                }
                );
              }
            image && handleUpload()
      },[image]);

      const validate= () =>{
        let errors={};
        if(!name){
            errors.name="Name is required."
        }
        if(!category){
            errors.category="Category is required."
        }
        if(!ingredients){
          errors.ingredients="Ingredients are required."
        }
        if(!steps){
          errors.steps="Steps are required."
        }
        return errors;
      }
      
    const [focused, setFocused] = useState(false);
    const handleFocus = (e) => {
        if(e.target.value !=="")
        { setFocused(true); }
        else {  setFocused(false);  }
      };
    // const handleView = id =>{
    //     const recipesClone = [...recipes]

    //     recipesClone.forEach(recipe =>{
    //         if(recipe.id === id) {
    //             recipe.viewing = !recipe.viewing
    //         }
    //         })
    //     setRecipes(recipesClone)
    // }
    const handleIngredient= (e,i)=>{
        const ingredientsClone = [...data.ingredients]
        ingredientsClone[i]=e.target.value
        setData({
            ...data,
            ingredients: ingredientsClone
        })
      }
      const handleIngredientCount = () => {
          setData({
            ...data,
            ingredients: [...data.ingredients, ""]
          })
        }
        const handleStep = (e, i) => {
            const stepsClone = [...data.steps]
            stepsClone[i] = e.target.value
            setData({
                ...data,
                steps: stepsClone
            })
          }
    const handleStepCount = () => {
        setData({
            ...data,
            steps: [...data.steps, ""]
        })
        }
    let removeFields = (i) => {
        let newData = [...data.ingredients];
        newData.pop(i);
        setData({
            ...data,
            ingredients: newData
        })
    }


    return(
    <>
        <SideBar menu={sidebar_menu}/>
        <div className='dashboard-content'>
        <DashboardHeader
                    btnText="New Recipe" onClick={() =>{setPopupActive(!popupActive); 
                        {!(user)?alert("Please login!"):<></>}}} />
                <div className='dashboard-content-container'>
                    <div className='dashboard-content-header'>
                        <h2>Recipes List</h2>
                        <div className='dashboard-content-search'>
                            <input
                                type='text'
                                value={search}
                                placeholder='Search..'
                                className='dashboard-content-input'
                                onChange={(e)=>setSearch(e.target.value)}
                                />
                        </div>
                    </div>
                    {recipes.length !== 0 ?
                    <h6>Total Recipes = {recipes.length}</h6>
                    :<></>}
                    <table>
                        <thead className="dashboard_tbl">
                            <th>ID</th>
                            <th>NAME</th>
                            <th>CATEGORY</th>
                            <th>VIEW</th>
                            <th>EDIT</th>
                            <th>DELETE</th>
                            <th>IMAGE</th>
                        </thead>

                        {recipes.length !== 0 ?
                            <tbody>
                                {recipes.filter(
                                (item) => {
                                if(search === " ")
                                { return item; }
                                else if(
                                    item.name.toLowerCase().
                                    includes(search)
                                )
                                {return item;}})  
                                .map((recipe, index) => (
                                    <tr key={index}>
                                        <td><span>{recipe.id}</span></td>
                                        <td><span>{recipe.name}</span></td>
                                        <td><span>{recipe.category}</span></td>
                                        {/* <td><span>{recipe.cooktime}</span></td> */}
                                        {/* <td><span>{recipe.preptime}</span></td> */}
                                        <td>
                                        <button className="btn-primary"
                                         onClick={()=>{handleView(recipe.id)
                                        setView(!view)}}
                                         >View</button>
                                         {(view)&&  
                                        <div className="popup" 
                                        style={{ 
                                        backgroundColor:"#dfe6f5bb"
                                        }}>
                                            
                                        <div className="popup-innr" 
                                        style={{
                                            height:'100%',
                                            display:'block',
                                            justifyContent:'center'}}>
                                        <table style={{
                                            position:'relative',
                                            overflowX:'hidden',
                                        
                                        }}>
                                    <button type="button" 
                                        style={{display:'block',
                                        marginTop:'10px',
                                        marginRight:'-1000px',float:'right'}}
                                        onClick={()=>setView(false)} 
                                        // className="remove"
                                        ><FontAwesomeIcon icon={faClose}/></button>
                                        
                                        <thead>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Cooking Time</th>
                                            <th>Preparation Time</th>
                                            <th>Ingredients</th>
                                            <th>Steps</th>
                                            
                                        </thead>
                                        {
                                        // (viewRecipes?.length>0)?
                                        <tbody>
                                        
                                        <tr>
                                            <td>{id}</td>
                                            <td>{namee}</td>
                                            <td>{categoryy}</td>
                                            <td>{cooktime}</td>
                                            <td>{preptime}</td>
                                            <td>
                                            {ing.map((ingredient,i)=>
                                             (<li key={i}>{ingredient}</li>))}
                                            </td>
                                            <td>
                                            
                                            {stepps.map((rid,i)=>
                                             (<li key={i}>{rid}</li>))}
                                            
                                            </td>
                                        </tr>
                                        {/* )) */}
                                        
                                        </tbody>
                                    //     : <div className='dashboard-content-footer'>
                                    //     <span className='empty-table'>No data</span>
                                    // </div>
                                    }

                                        </table>
                                        </div>
                                        </div>
                                        // :(<></>)
                                        }
                                        </td>
                                        <td>
                                            <div>                                          
                                            <button className="btn-primary" onClick={()=>{ 
                                            fetchData(recipe.id);
                                            setPopup(true);
                                            // handleUpdate(recipe.name)
                                            }}>Edit </button>
                                            
                                            </div>
                                        </td>
                                        <td>
                                        <button className="btn"><FontAwesomeIcon icon={faTrash}
                                        onClick={() => handleDelete(recipe.id,recipe.name)}
                                        ></FontAwesomeIcon>
                                        </button>
                                        </td>
                                        <td>
                                            <div>
                                                <img 
                                                    src={recipe.imgurl}
                                                    className='dashboard-content-avatar'
                                                    alt={recipe.name}
                                                    style={{width:"100px",height:"100px"}}
                                                    />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        : null}
                    </table>
                    {popup &&  
                    <div className="popup" 
                    style={{backgroundColor:"#dfe6f5bb"}}>
                        <div className="popup-inner">
                        {/* {alert(updaterecipes.id)} */}
                        <div className='form-group'>

                        <label>Name</label>
                        <input type='text' style={{backgroundColor:"lightgrey"}} 
                        value={updaterecipes.name}  
                        // onClick={setErr(true)}
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
                            {upindex ? <button type="button" className="button remove" onClick={() => removeUpdateFields(index)}>
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
                            // setUpdateIndex(i)
                        }} 
                            />
                        ))}
                        

                        <button type="button" onClick={handleUpdateStepCount}>Add Step</button>

                        {/* <button type="button" className='button' onClick={handleUpdateStepCount}>
                            Add Ingredient
                            </button>
                        {index ? <button type="button" className="button remove" 
                        onClick={() => removeUpdateFields(index)}>
                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button>:<></> } */}
                      
                      </div>
                        <div className="buttons" >
                                <button type="submit"  
                                // className="btn-primary"
                                // disabled={progress !== null && progress<100} 
                                onClick={()=>{handleUpdate()}}> Update </button>
                                <button type="button" 
                                className="remove"
                                onClick={()=>setPopup(!popup)} 
                                // className="remove"
                                >Close</button>
                            </div>
                    </div>
                    </div>}

                    {recipes.length !== 0 ?
                        <div className='dashboard-content-footer'>
                            {pagination.map((item, index) => (
                                <span 
                                    key={index} 
                                    className={item === page ? 'active-pagination' : 'pagination'}
                                    onClick={() => __handleChangePage(item)}
                                    >
                                        {item}
                                </span>
                            ))}
                        </div>
                    : 
                        <div className='dashboard-content-footer'>
                            <span className='empty-table'>No data</span>
                        </div>
                    }
                </div>
            </div>

            {(user) && popupActive && <div className='popup'>
                        <div className='popup-inner'>
                            <h2> Add a new Recipe </h2>
                            <form onSubmit={handleSubmit}>
                                <div className='form-group'>
                                    <label>Name</label>
                                    <input type='text' 
                                    value={data.name}
                                    onBlur={handleFocus} focused={focused.toString()}
                                    onChange={(e)=>{setData({...data,name:e.target.value});}}             
                                    pattern="^[A-Za-z\s]+$"
                                    placeholder="Recipe name"
                                    required='true'/>
                                {data.name!=="" && <span className="error-msg">Please enter alphabetic characters only</span>}
                                </div>
                                <div className='form-group'>
                                    <label>Category</label>
                                    <input type='text' 
                                    value={data.category} 
                                    onBlur={handleFocus} focused={focused.toString()}
                                    onChange={(e)=>{setData({...data,category:e.target.value})}} 
                                    pattern="^[A-Za-z\s]+$"
                                    placeholder="Recipe Category"
                                    required='true'/>
                                    {(data.category !== "") && <span className="error-msg">Please enter alphabetic characters only</span>}
                                </div>
                                
                                <div className='form-group'>
                                    <label>Preparation Time</label>
                                    <input type='text' 
                                    value={data.prepTime} 
                                    onBlur={handleFocus} focused={focused.toString()}
                                    pattern="^[A-Za-z0-9\s.-]+$"
                                    onChange={e =>setData({...data,prepTime:e.target.value})} />
                                    {(data.prepTime !== "") && <span className="error-msg">Please enter alpha-numeric characters only</span>}
                                </div>
                                <div className='form-group'>
                                    <label>Cooking Time</label>
                                    <input type='text' 
                                    value={data.cookTime} 
                                    onBlur={handleFocus} focused={focused.toString()}
                                    onChange={e =>setData({...data,cookTime:e.target.value})}
                                    pattern="^[A-Za-z0-9\s.-]+$" />
                                    {(data.cookTime !== "") && <span className="error-msg">Please enter alpha-numeric characters only</span>}
                                </div>
                                <div className='form-group'>
                                    <label>Ingredients</label>                               
                                    { 
                                        data.ingredients.map((ingredient , i)=>(
                                        <>  
                                        <input 
                                            type="text" 
                                            error={errors.ingredients ? {content: errors.ingredients} : null}
                                            required
                                            key={i}
                                            value={ingredient} 
                                            placeholder={`Ingredient ${i+1}`}
                                            onChange={(e) => {handleIngredient(e, i); setIndex(i)}} /> 
                                        </>  
                                        ))
                                    }
                                    <button type="button" className='button' onClick={handleIngredientCount}>Add Ingredient</button>
                                        {index ? <button type="button" className="button remove" onClick={() => removeFields(index)}>
                                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button>:<></> }
                                </div>

                                <div className='form-group'>
                                    <label>Steps</label>
                                        {
                                            data.steps.map((step, i) => (
                                            <textarea 
                                                type="text"
                                                error={errors.steps ? {content: errors.steps} : null}
                                                required
                                                key={i}
                                                value={step} 
                                                placeholder={`Step ${i+1}`}
                                                onChange={e => handleStep(e, i)} />
                                            ))
                                        }
                                    <button type="button" onClick={handleStepCount}>Add Step</button>
                                </div> 

                                 <div className="image" style={{display:"flex"}}>
                                    <input type="file" accept="image/*" onChange={(e)=>setImage(e.target.files[0])}/>
                                    {/*      <button>Upload</button> onClick={handleUpload} */}
                                    <progress value={progress} max="100" />
                                </div>

                                <div className="buttons">
                                    <button type="submit" 
                                    disabled={progress !== null && progress<100} 
                                    > Submit </button>
                                    <button type="button" onClick={()=>setPopupActive(!popupActive)} 
                                    className="remove">Close</button>
                                </div>
                            </form>
                            {/* { JSON.stringify(data)} */}
                        </div>
                    </div> }
    </>
    );
}
export default Recipes_data;