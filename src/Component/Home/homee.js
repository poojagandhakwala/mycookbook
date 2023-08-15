import React, { useEffect, useState } from "react";
import {
  Link,
  useMatch,
  useNavigate,
  useResolvedPath,
  useLocation,
} from "react-router-dom";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { getDatabase, push, set } from "firebase/database";
import { ref as refernce } from "firebase/database";
import { auth, db } from "../Context/firebase";
import "./home_new.css";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import RecipeViewer from "./RecipeViewer";
import { useAuthState } from "react-firebase-hooks/auth";
import { storage } from "../Context/firebase";
import "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import fooddish from "../../Images/home(2).png"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const recipeCollectionRef = query(collection(db, "Recipes"), orderBy("name"));
  const [userecipes, setUserecipes] = useState([]);
  let us = "";
  const [show, setShow] = useState(false);  
  const [data, setData] = useState({
    name: "",
    category: "",
    prepTime: "",
    cookTime: "",
    ingredients: [""],
    steps: [""],
  });
  const { name, category, ingredients, steps } = data;
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();
  const [alertt,setAlertt]=useState();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    onSnapshot(recipeCollectionRef, (snapshot) => {
      setRecipes(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            viewing: false,
            ...doc.data(),
          };
        })
      );
    });
  }, []);

  const [user, loading, error] = useAuthState(auth);
  let [userid, setUserid] = useState(null);

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
      const uscoll = collection(db, `LoginData/${us}/Recipes_user`);
      onSnapshot(uscoll, (snapshot) => {
        setUserecipes(
          snapshot.docs.map((doc2) => {
            return {
              id: doc2.id,
              viewing: false,
              ...doc2.data(),
            };
          })
        );
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserId();
  }, [user, loading]);
  // const showAlert=(msg)=>{
  //   setAlertt(msg)
  //   setTimeout(()=>{
  //     setAlertt(null);
  //   },1500);
  // }
  useEffect(() => {
    const handleUpload = () => {
      const name = new Date().getTime() + image.name;
      const imageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(imageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUrl(downloadURL);
          });
        }
      );
    };
    image && handleUpload();
  }, [image]);

  const validate = () => {
    let errors = {};
    if (!name) {
      errors.name = "Name is required.";
    }
    if (!category) {
      errors.category = "Category is required.";
    }
    if (!ingredients) {
      errors.ingredients = "Ingredients are required.";
    }
    if (!steps) {
      errors.steps = "Steps are required.";
    }
    return errors;
  };
  const notify = () => toast("Recipe added!");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    const q = query(
      collection(db, `LoginData/${userid}/Recipes_user`),
      where("userid", "==", parseInt(userid,10))
    );
    const docs = await getDocs(q);
    let myId = "";
    let useridd = 0;
    if (docs.docs.length === 0) 
    {
      myId = userid + "201";
      var id_no=parseInt(myId,10);
      if (window.confirm("Want to add first document " + id_no + "?")) 
      {
        const DocRef = doc(
          collection(db, `LoginData/${userid}/Recipes_user`),
          `${id_no}`
        );
        useridd = parseInt(userid,10);
        setDoc(DocRef, {
          ...data,
          url,
          userid: useridd,
          timestamp: serverTimestamp(),
        });  
        // {showAlert("Submitted")}  
        // setIsSubmit(true);
        {notify()}
        // {alert("Recipe added!")}
        navigate("/");
        setProgress(0);
        setData({
          name: "",
          category: "",
          prepTime: "",
          cookTime: "",
          ingredients: [""],
          steps: [""],
        });
      }
    } 
    else {
      const lastdocRef = query(
        collection(db, `LoginData/${userid}/Recipes_user`),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      const docSnap = await getDocs(lastdocRef);
      docSnap.forEach((doc) => {
        myId = doc.id;
      });
      myId = parseInt(myId, 10);
      myId += 1;
      myId = myId.toString();
      var id_no=parseInt(myId,10);
        const newDocRef = doc(
          collection(db, `LoginData/${userid}/Recipes_user`),
          `${id_no}`
        );
        useridd = parseInt(userid,10);
        setDoc(newDocRef, {
          ...data,
          url,
          userid: useridd,
          timestamp: serverTimestamp(),
        });
        // setIsSubmit(true);
        notify()
        // {alert("Recipe added!");}
        setProgress(0);
        navigate("/");
        setData({
          name: "",
          category: "",
          prepTime: "",
          cookTime: "",
          ingredients: [""],
          steps: [""],
        });
    }
    setPopupActive(false);
    // {showAlert("Submiited")}  
  };
  const [focused, setFocused] = useState(false);
  const handleFocus = (e) => {
    if (e.target.value !== "") {
      setFocused(true);
    } else {
      setFocused(false);
    }
  };

  const handleIngredient = (e, i) => {
    const ingredientsClone = [...data.ingredients];
    ingredientsClone[i] = e.target.value;
    setData({
      ...data,
      ingredients: ingredientsClone,
    });
  };
  const handleIngredientCount = () => {
    setData({
      ...data,
      ingredients: [...data.ingredients, ""],
    });
  };
  const handleStep = (e, i) => {
    const stepsClone = [...data.steps];
    stepsClone[i] = e.target.value;
    setData({
      ...data,
      steps: stepsClone,
    });
  };
  const handleStepCount = () => {
    setData({
      ...data,
      steps: [...data.steps, ""],
    });
  };
  let removeFields = (i) => {
    let newData = [...data.ingredients];
    newData.pop(i);
    setData({
      ...data,
      ingredients: newData,
    });
  };

  const removeRecipe = (id) => {
    try {
      if (window.confirm("Are you sure want to delete?")) {
        deleteDoc(doc(db, `LoginData/${userid}/Recipes_user`, id));
      }
    } catch (err) {
      console.log(err);
    }
  };
  let [index, setIndex] = useState();

  return (
    <>
      <div className="text-center main">
        <div className="container d-flex align-items-center 
        text-center h-100 w-100 mt-1">
            <div className="quotes mx-5 px-5">
              <h2
              style={{color:'black'}}
              ></h2>
            </div>
        </div>
        </div>
        <div className="container search mt-5">
            <input className="searchInput form-control" type="text" name=""
            style={{float:'center'}}
            value={search} placeholder=" Search..." 
            onChange={(e)=>setSearch(e.target.value)}
            />
          <button className="btn searchIcon">
            <FontAwesomeIcon icon={faSearch} style={{color:'black'}}> </FontAwesomeIcon>
          </button>
        </div>
        <button className="add"
          onClick={() => {
            setPopupActive(!popupActive);
            {
              !user ? alert("Please login!") : <></>;
            }
          }}
        >
          <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
        </button>

        <div className="container d-flex align-items-center mx-5">
          <div className="row justify-items-center mx-5 mt-5" 
          >
          {recipes.filter(
            (item) => {
              if(search === " ")
              { return item; }
              else if(
                item.name.toLowerCase().
                includes(search)
              )
            {return item;}})                       
            .map((recipe, i) => (    
            <>
              <div className="card col-md-3 m-3" key={recipe.id}
                style={{ width: "18rem" }}>
                <img className="card-img-top"
                  style={{ width: "286px", height: "240px",marginLeft:'-12px' }}
                  src={recipe.imgurl}/>
                <div className='card-body'>
                  <h5 className="card-title">
                    {recipe.name}
                  </h5>
                  <div className="card-subtitle">
                    {recipe.category}
                  </div>
                  <CustomLink to="/RecipeViewer" 
                  state={{ img: i, id: recipe.id, p: "", userid: us }} >
                    <button className="btn" style={{backgroundColor:'#e96100',
                    color:'white',float:'right',width:'100%',marginTop:'15px'}} 
                    onClick={() => { RecipeViewer(); }} >
                      See Recipe
                    </button>
                  </CustomLink>
                </div>
              </div>
            </>        
            ))}
            {userecipes.filter(
            (item) => {
              if(search === " ")
              { return item; }
              else if(
                item.name.toLowerCase().
                includes(search)
              )
            {return item;}})                       
            .map((userecipe, i) => (    
            <>
              <div className="card col-md-3 m-3" key={userecipe.id}
                style={{ width: "18rem" }}>
                <img className="card-img-top"
                  style={{ width: "286px", height: "240px",marginLeft:'-12px' }}
                  src={userecipe.url}/>
                <div className='card-body'>
                  <h5 className="card-title">
                    {userecipe.name}
                  </h5>
                  <div className="card-subtitle">
                    {userecipe.category}
                  </div>
                  <CustomLink to="/RecipeViewer" 
                  state={{ img: i, id: userecipe.id, p: pathh}} >
                    <button className="btn" style={{backgroundColor:'#e96100',
                    color:'white',float:'right',width:'100%',marginTop:'15px'}} 
                    onClick={() => { RecipeViewer(); }} >
                      See Recipe
                    </button>
                  </CustomLink>
                </div>
              </div>
            </>        
            ))}
          </div>
        </div>

        {/* <div className="recipes">
          <Container>
          <div className="home-r row" >
              { recipes.filter(
                (item) => {
                  if(search === " ")
                  { return item; }
                  else if(
                    item.name.toLowerCase().
                    includes(search)
                  )
                  {return item;}})                       
                  .map((recipe, i) => (
                <div className="home-col">
                  <div className="recipe" key={recipe.id}>
                    <Card style={{ width: "18rem" }}>
                      <Card.Img
                        variant="top"
                        src={recipe.imgurl}
                        style={{ width: "286px", height: "240px" }}
                      />
                      <Card.Body>
                        <Card.Title>{recipe.name}</Card.Title>
                        <Card.Subtitle>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: recipe.category,
                            }}
                          ></p>
                        </Card.Subtitle>
                        <Card.Text>
                          {recipe.viewing && (
                            <div>
                              <h4>Ingredients</h4>
                              <ul>
                                {recipe.ingredients.map((ingredient, i) => (
                                  <li key={i}>{ingredient}</li>
                                ))}
                              </ul>
                              <h4>Steps</h4>
                              <ol>
                                {recipe.steps.map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </Card.Text>
                        <CustomLink
                          to="/RecipeViewer"
                          state={{ img: i, id: recipe.id, p: "", userid: us }}
                        >
                          <Button
                            variant="btn" onClick={() => { RecipeViewer(); }} >
                            See Recipe
                          </Button>
                        </CustomLink>
                      </Card.Body>
                    </Card>                    
                  </div>
                </div>
              ))}
              {userecipes.filter(
                (item) => {
                  if(search === " ")
                  { return item;     }
                  else if(
                    item.name.toLowerCase().
                    includes(search)
                  )
                  {return item;} })  
                .map((userecipe, i) => (
                <div className="home-col">
                  <div className="recipe" key={userecipe.id}>
                    <Card style={{ width: "18rem" }} className="cols-xs-6">
                      <Card.Img variant="top"
                        src={userecipe.url}
                        style={{ width: "286px", height: "240px" }}/>
                      <Card.Body>
                        <Card.Title>{userecipe.name}</Card.Title>
                        <Card.Subtitle>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: userecipe.category,
                            }}
                          ></p>
                        </Card.Subtitle>
                        <Card.Text>
                          {userecipe.viewing && (
                            <div>
                              <h4>Ingredients</h4>
                              <h4>{userecipe.ingredients}</h4>
                              <ul>
                                {userecipe.ingredients.map((ingredient, i) => (
                                  <li key={i}>{ingredient}</li>
                                ))}
                              </ul>
                              <h4>Steps</h4>
                              <ol>
                                {userecipe.steps.map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </Card.Text>
                        <CustomLink
                          to="/RecipeViewer"
                          state={{ img: i, id: userecipe.id, p: pathh }}
                        >
                          <Button
                            variant="btn"
                            onClick={() => {
                              RecipeViewer();
                            }}
                          >
                            See Recipe
                          </Button>
                        </CustomLink>

                        <Button
                          variant="btn"
                          className="remove"
                          onClick={() => removeRecipe(userecipe.id)}
                        >
                          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div> */}
    {user && popupActive && (
        <div className="popup">
          <div className="popup-inner">
            <h2> Add a new Recipe </h2>
            <form onSubmit={handleSubmit} >
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={data.name}
                  onBlur={handleFocus} focused={focused.toString()}
                  onChange={(e) => {
                    setData({ ...data, name: e.target.value });
                  }}
                  pattern="^[A-Za-z\s]+$"
                  placeholder="Recipe name"
                  required="true"
                />
                {data.name !== "" && (
                <span className="error-msg">
                  Please enter alphabetic characters only
                </span>
                )}
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={data.category}
                  onBlur={handleFocus}
                  focused={focused.toString()}
                  onChange={(e) => {
                    setData({ ...data, category: e.target.value });
                  }}
                  pattern="^[A-Za-z\s]+$"
                  placeholder="Recipe Category"
                  required="true"
                />
                {data.category !== "" && (
                  <span className="error-msg">
                    Please enter alphabetic characters only
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>Preparation Time</label>
                <input
                  type="text"
                  value={data.prepTime}
                  onBlur={handleFocus}
                  focused={focused.toString()}
                  pattern="^[A-Za-z0-9\s.-]+$"
                  onChange={(e) =>
                    setData({ ...data, prepTime: e.target.value })
                  }
                />
                {data.prepTime !== "" && (
                  <span className="error-msg">
                    Please enter alpha-numeric characters only
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>Cooking Time</label>
                <input
                  type="text"
                  value={data.cookTime}
                  onBlur={handleFocus}
                  focused={focused.toString()}
                  onChange={(e) =>
                    setData({ ...data, cookTime: e.target.value })
                  }
                  pattern="^[A-Za-z0-9\s.-]+$"
                />
                {data.cookTime !== "" && (
                  <span className="error-msg">
                    Please enter alpha-numeric characters only
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>Ingredients</label>
                {data.ingredients.map((ingredient, i) => (
                  <>
                    <input
                      type="text"
                      error={
                        errors.ingredients
                          ? { content: errors.ingredients }
                          : null }
                      required key={i}
                      value={ingredient}
                      placeholder={`Ingredient ${i + 1}`}
                      onChange={(e) => {
                        handleIngredient(e, i);
                        setIndex(i);
                      }}
                    />
                  </>
                ))}
                <button type="button" className="button" onClick={handleIngredientCount}>
                  Add Ingredient
                </button>
                {index ? (
                  <button type="button"
                    className="button remove"
                    onClick={() => removeFields(index)} >
                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  </button>
                ) : (
                  <></>
                )}
              </div> 
              <div className="form-group">
                <label>Steps</label>
                {data.steps.map((step, i) => (
                  <textarea
                    type="text"
                    error={errors.steps ? { content: errors.steps } : null}
                    required key={i} value={step}
                    placeholder={`Step ${i + 1}`}
                    onChange={(e) => handleStep(e, i)} />
                  ))
                }
                <button type="button" onClick={handleStepCount}>
                  Add Step
                </button>
              </div>
              <div className="image" style={{ display: "flex" }}>
                <input type="file" accept="image/*" 
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <progress value={progress} max="100" />
              </div>
              <div className="buttons">
                <button type="submit" disabled={progress !== null && progress < 100}
                >
                  Submit
                </button>
                <button type="button"
                  onClick={() => setPopupActive(!popupActive)}
                  className="remove" >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )} 
    </>
  );
}

function CustomLink({ to, children, ...props }) {
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
