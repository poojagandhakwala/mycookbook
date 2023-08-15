import {Route,Routes} from "react-router-dom";
import SideBar from './components/Sidebar';
import sidebar_menu from './constants/sidebar-menu';
import './Dashboard.css';
import Home from "../Home/home";
import { useEffect, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db} from '../Context/firebase';
import {
    collection,
    getCountFromServer,
    onSnapshot,
    getDocs,query, where, doc, getDoc
} from "firebase/firestore";

import {useState} from "react";

const Dashboard = ()=>{

    const [user, loading, error] = useAuthState(auth);
    const [totalUsers,setTotalUsers]=useState("");
    const [totalRecipes,setTotalRecipes]=useState("");
    let [userid, setUserid] = useState("");
    const [users, setUsers] = useState([]);

    const fetchUserdata = async () => {
        try {
            const coll = collection(db, "LoginData");
            const snapshot=await getCountFromServer(coll);
            setTotalUsers(snapshot.data().count);

            const col=collection(db,"Recipes");
            const snapshots=await getCountFromServer(col);
            setTotalRecipes(snapshots.data().count);

            const q = (collection(db, "LoginData"));
            const id=["101","102","103"];
            let temp=[];
            for(var i=0;i<2;i++)
            {
                const docRef=doc(db,"LoginData",id[i]);
                const ds=await getDoc(docRef);
                temp.push(
                    {id:ds.id,
                        name:ds.get("name"),
                        email:ds.get("email"),
                        authProvider:ds.get("authProvider"),
                        photo:ds.get("photo")
                    })
                    // setUsers(temp);
            }
            // alert(users.length)
            setUsers(temp);
            // const docRef=doc(db,"LoginData","101");
            // const ds=await getDoc(docRef);
            // setUsers(
            //     {
            //         ...users,
            //         id:ds.id,
            //         viewing:false,
            //         name:ds.get("name"),
            //         email:ds.get("email"),
            //         authProvider:ds.get("authProvider")
            //     }
            // );

           
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };
    const refresh=()=>{
        // while(reload<1)
        // {
        // reload=reload+1;
        window.location.reload(true);
        // if(reload===1)
            // break;
        // }
    }
    // window.addEvent
    useMemo(()=>{
        // if(reload<1)
            // refresh();
        // else
        // alert(reload);
      },[user]);

      useEffect(()=>{
        fetchUserdata();
      },[])
    return(
    <>

        {/* <BrowserRouter> */}
    
      <div className='dashboard-container'>
        <SideBar menu={sidebar_menu} />
    
        <div className='dashboard-body'>
              <Routes>
                  <Route path="*" element={<div></div>} />
                  <Route exact path="/" element={<div></div>} />
                  {/* <Route exact path="/users" element={<Users/>} /> */}

                  <Route exact path="/locations" element={<div></div>} />
                  <Route exact path="/profile" element={<div></div>} />
                  <Route exact path="/home" element={Home} />

              </Routes>
          </div>
        
        <div style={{height:'200px',width:'300px',
        marginLeft:'300px',marginTop:'50px',borderRadius:'10%',
        backgroundColor:"lightgrey",textAlign:"center"}}>
            <main>
            <p style={{
            fontSize:'30px',fontWeight:'bolder'}}>
                Total Users: {totalUsers}
                </p>
            </main>
        </div>    
        <div style={{height:'200px',width:'300px',
        marginLeft:'300px',marginTop:'50px',borderRadius:'10%',
        backgroundColor:"lightblue",textAlign:"center"}}>
            <main>
            <p style={{
            fontSize:'30px',fontWeight:'bolder'}}>
            Total Recipes: {totalRecipes}
           </p>
           </main>
        </div> 
        
       

        </div>
        <div className='dashboard-content'>

        <div className='dashboard-content-container'>
        <div className='dashboard-content-header'>
                <h2>Admin List</h2>  
            </div>
        <table >
            <thead className="dashboard_tbl">
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>AUTH PROVIDER</th>
                <th>IMAGE</th>
            </thead>
            {users.length !== 0 ?
            <tbody>
             {users.map((user, index) => (
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
                    </tr>
                    ))}
                </tbody>
             : <div className='dashboard-content-footer'>
             <span className='empty-table'>No data</span>
         </div>} 
            </table>
        </div>
        </div>
    {/* </BrowserRouter> */}
    </>
    );
}
export default Dashboard;