import {
    collection,
    onSnapshot,
    getDocs,
    query,
} from "firebase/firestore";
import { auth, db} from '../../Context/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {calculateRange, sliceData} from '../utils/table-pagination';
import './users.css';
import SideBar from "../components/Sidebar";
import sidebar_menu from '../constants/sidebar-menu';
import './Recipes.css'
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Users = ()=>{
    const navigate= useNavigate();
    let us="";
    const [user, loading, error] = useAuthState(auth);
    let [userid, setUserid] = useState("");
    let [pathh,setPathh]=useState("");
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState([]);

    const fetchUserdata = async () => {
        try {
            const q = query(collection(db, "LoginData"));
            const querySnapshot = await getDocs(q); 
            querySnapshot.forEach((doc) => {
                console.log("ID="+ doc.id, " => ", doc.data());        
                setUserid(doc.id); 
                us=doc.id;
                const uscoll=collection(db,`LoginData`);
                setPathh(`LoginData/${doc.id}/Recipes_user`); 
                    onSnapshot(uscoll,snapshot=>{
                        setUsers(snapshot.docs.map(doc1 =>{
                            return {
                                ...users,
                                id:doc1.id,
                                viewing:false,
                                ...doc1.data()
                            } 
                        }))
                });             
            })
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };
    useEffect(() => {
            if (loading) return;
            if (!user) return navigate("/");
            fetchUserdata();
                           
    }, [loading]);
    
    useEffect(()=>{
        setPagination(calculateRange(users, 5));
        setUsers(sliceData(users, page, 5));
    },[]);

    // Change Page 
    const __handleChangePage = (new_page) => {
        setPage(new_page);
        setUsers(sliceData(users, new_page, 5));
    }
    
    const [ recipes_users,setRecipes_users]=useState([]);
    const [ shoppinglists,setShoppinglists]=useState([]);
    const [ meals,setMeals]=useState([]);
    const [ recipebooks,setRecipebooks]=useState([]);
    const [showDropdown,setShowDropdown]=useState(false);
    const [showrecipe,setShowrecipe]=useState(false);
    const [showshopping,setShowshopping]=useState(false);
    const [showmeals,setShowmeals]=useState(false);
    const [showrbooks,setShowrbooks]=useState(false);

    const handleView = async (id) => {
        try {
            let q = collection(db,`LoginData/${id}`,'Recipes_user');
            let docSnap = await getDocs(q);
            const recipedata= collection(db,`LoginData/${id}`,'Recipes_user');
            onSnapshot(
                recipedata,
                snapshot=>{
                setRecipes_users(snapshot.docs.map(doc1 =>{
                    return {
                        ...recipes_users,
                        id:doc1.id,
                        ...doc1.data()
                    }
                }))
            })
            q = collection(db,`LoginData/${id}`,'ShoppingLists');
            docSnap = await getDocs(q);
            const shoppingdata= collection(db,`LoginData/${id}`,'ShoppingLists');
                onSnapshot(
                    shoppingdata,
                    snapshot=>{
                    setShoppinglists(snapshot.docs.map(doc1 =>{
                        return {
                            ...shoppinglists,
                            id:doc1.id,
                            ...doc1.data()
                        }
                    }))
                })
            q = collection(db,`LoginData/${id}`,'Meals');
            docSnap = await getDocs(q);
            const mealdata= collection(db,`LoginData/${id}`,'Meals');
                onSnapshot(
                    mealdata,
                    snapshot=>{
                    setMeals(snapshot.docs.map(doc1 =>{
                        return {
                            ...meals,
                            id:doc1.id,
                            ...doc1.data()
                        }
                    }))
                })
            q = collection(db,`LoginData/${id}`,'RecipeBooks');
            docSnap = await getDocs(q);
            const recipebookdata= collection(db,`LoginData/${id}`,'RecipeBooks');
                onSnapshot(
                    recipebookdata,
                    snapshot=>{
                    setRecipebooks(snapshot.docs.map(doc1 =>{
                        return {
                            ...recipebooks,
                            id:doc1.id,
                            ...doc1.data()
                        }
                    }))
                })
        } catch (err) {
            console.log(err);
          }
    }

    return(
    <>
    <SideBar menu={sidebar_menu}/>
    <div className='dashboard-content'>
        <div className='dashboard-content-container'>
            <div className='dashboard-content-header'>
                <h2>Users List</h2>
                <div className='dashboard-content-search'>
                    <input type='text'
                        value={search}
                        placeholder='Search..'
                        className='dashboard-content-input'
                        onChange={(e)=>setSearch(e.target.value)}
                    />
                </div>
            </div>
            {users.length !== 0 ?
            <h6>Total Users = {users.length}</h6>
            :<></>}
            <table>
            <thead className="dashboard_tbl">
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>AUTH PROVIDER</th>
                <th>IMAGE</th>
                <th>VIEW</th>
            </thead>
            {users.length !== 0 ?
            <tbody>
                {users.filter(
                (item) => {
                if(search === " ")
                { return item; }
                else if(
                    item.name.toLowerCase().
                    includes(search)
                )
                {return item;}}) 
                .map((user, index) => (
                <tr key={index}>
                    <td><span>{user.id}</span></td>
                    <td><span>{user.name}</span></td>
                    <td><span>{user.email}</span></td>
                    <td><span>{user.authProvider}</span></td>
                    
                <td>
                    {/* <div> */}
                    <img 
                        src={user ? user.photo:""}
                        className='dashboard-content-avatar'
                        alt={user.name} 
                        />
                    {/* </div> */}
                </td>
                <td>
                        <div class="btn-group">
                        <button type="button" class="btn btn-primary"
                        // onClick={(e) => {handleView(user.id)}}
                        >View</button>
                        <button type="button" 
                        onClick={(e) => {handleView(user.id)}}
                        class="btn btn-primary dropdown-toggle dropdown-toggle-split" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false">
                            {/* View   */}
                        <span class="visually-hidden">Toggle Dropdown</span>
                        </button>
                        <ul class="dropdown-menu">
                        {
                        (recipes_users?.length>0)?
                        <li>
                            <button className="dropdown-item" style={{fontWeight:'bold',border:'none'}}
                            onClick={() => {
                            setShowrecipe(true)
                            }}> Recipes_user </button>
                        </li>
                        :(<></>)}
                        {(shoppinglists?.length>0)?
                        <li>
                            <button className="dropdown-item"
                            style={{fontWeight:'bold',border:'none'}}
                            onClick={() => {
                            setShowshopping(true)
                            }}> Shopping Lists </button>
                        </li>
                        :(<></>)}
                        {
                        (meals?.length>0)?
                        <li>
                            <button className="dropdown-item"
                            style={{fontWeight:'bold',border:'none'}}
                            onClick={() => {
                            setShowmeals(true)
                            }}> Meals </button>
                        </li>
                        :(<></>)}
                        {
                        (recipebooks?.length>0)?
                        <li>    
                            <button className="dropdown-item"
                            style={{fontWeight:'bold',border:'none'}}
                            onClick={() => {
                            setShowrbooks(true)
                            }}> RecipeBooks </button>
                        </li>
                        :(<></>)}
                        </ul>
                        </div>
                    </td>
                    <td>
                    {(showrecipe)&&  
                    <div className="popup" 
                    style={{
                    backgroundColor:"#ffffff77"
                    }}>
                    <div className="db-popup-inner" 
                    style={{display:'block',
                    backgroundColor:"#dfe6f5bb"
                    ,justifyContent:'center',width:"560px"}}>
                    <table>
                    <button type="button" 
                    style={{display:'block',marginRight:'-410px',
                    float:'right'}}
                    onClick={()=>setShowrecipe(false)} 
                    // className="remove"
                    ><FontAwesomeIcon icon={faClose}/></button>
                    <thead className="dashboard_tbl">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>User ID</th>
                    </thead>
                    {(recipes_users?.length>0)?
                    <tbody>
                    {recipes_users.map((r,i)=>
                    (
                    <tr>
                        <td>{r.id}</td>
                        <td>{r.name}</td>
                        <td>{r.category}</td>
                        <td>{r.userid}</td>
                    </tr>
                    ))}
                    </tbody>
                    : <div className='dashboard-content-footer'>
                    <span className='empty-table'>No data</span>
                    </div>}

                    </table>
                    </div>
                    </div>
                    }
                    {(showshopping)&&  
                     <div className="popup" 
                    style={{
                    backgroundColor:"#ffffff77"
                    }}>
                    <div className="db-popup-inner" 
                    style={{
                    width:'580px'}}>
                    <table>
                    <button type="button" 
                    style={{display:'block',marginRight:'-465px',
                    float:'right'}}
                    onClick={()=>setShowshopping(false)} 
                    ><FontAwesomeIcon icon={faClose}/></button>
                    <thead className="dashboard_tbl">
                        <th>ID</th>
                        <th>Title</th>
                        <th>Color</th>
                        <th>List</th>
                        <th>User ID</th>
                    </thead>
                    {(shoppinglists?.length>0)?
                    <tbody>
                    {shoppinglists.map((s,i)=>
                    (
                    <tr>
                        <td>{s.id}</td>
                        <td>{s.titles}</td>
                        <td>{s.color}</td>
                        <td>{s.notes}</td>
                        <td>{s.userid}</td>
                    </tr>
                    ))}
                    </tbody>
                    : <div className='dashboard-content-footer'>
                    <span className='empty-table'>No data</span>
                </div>}
                </table>
                    </div>
                    </div>
                    }
                    {(showmeals)&&  
                    <div className="popup" 
                    style={{
                    backgroundColor:"#ffffff77"
                    }}>
                    <div className="db-popup-inner" 
                    style={{
                    width:'630px'}}>
                    <table>
                    <button type="button" 
                    style={{display:'block',marginRight:'-510px',
                    float:'right'}}
                    onClick={()=>setShowmeals(false)} 
                    // className="remove"
                    ><FontAwesomeIcon icon={faClose}/></button>
                    <thead className="dashboard_tbl">
                        <th>ID</th>
                        <th>Breakfast</th>
                        <th>Lunch</th>
                        <th>Dinner</th>
                        <th>Meal_Date</th>
                        <th>User ID</th>
                    </thead>
                    {(meals?.length>0)?
                    <tbody>
                    {meals.map((s,i)=>
                    (
                    <tr>
                        <td>{s.id}</td>
                        <td>{s.breakfast}</td>
                        <td>{s.lunch}</td>
                        <td>{s.dinner}</td>
                        <td>{s.mealdate}</td>
                        <td>{s.userid}</td>
                    </tr>
                    ))}
                    </tbody>
                    : <div className='dashboard-content-footer'>
                    <span className='empty-table'>No data</span>
                </div>}
                    </table>
                    </div>
                    </div>
                    }
                    {(showrbooks)&&  
                    <div className="popup" 
                    style={{
                    backgroundColor:"#ffffff77"
                    }}>
                    <div className="db-popup-inner" 
                    style={{
                    width:'580px'}}>
                    <table>
                    <button type="button" 
                    style={{display:'block',marginRight:'-445px',
                    float:'right'}}
                    onClick={()=>setShowrbooks(false)} 
                    ><FontAwesomeIcon icon={faClose}/></button>
                    <thead className="dashboard_tbl">
                        <th>ID</th>
                        <th>Title</th>
                        <th>Recipe ID</th>
                        <th>User ID</th>
                    </thead>
                    {(recipebooks?.length>0)?
                    <tbody>
                    {recipebooks.map((s,i)=>
                    (
                    <tr>
                        <td>{s.id}</td>
                        <td>{s.titles}</td>
                        <td>
                            {s.recipes_id.map((rid,i)=>
                            (<li key={i}>{rid}</li>))}</td>
                        <td>{s.userid}</td>
                    </tr>
                    ))}
                    </tbody>
                    : <div className='dashboard-content-footer'>
                    <span className='empty-table'>No data</span>
                </div>}
                    </table>
                    </div>
                    </div>
                    }
                </td>
                </tr>
                ))}
            </tbody>
            : null}
            </table>
            {users.length !== 0 ?
                <div className='dashboard-content-footer'>
                    {pagination.map((item, index) => (
                        <span 
                            key={index} 
                            className={item === page ? 'active-pagination' : 'pagination'}
                            onClick={() => __handleChangePage(item)} >
                                {item}
                        </span>
                    ))}
                </div>
            :   <div className='dashboard-content-footer'>
                    <span className='empty-table'>No data</span>
                </div>
            }
        </div>
    </div>
    </>
    );
}
export default Users;