import { auth, db,Fire } from '../../Pages/firebase';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    collection,
    collectionGroup,
    onSnapshot,
    doc,
    addDoc,
    getDoc,
    deleteDoc,
    query,
    where,orderBy,
    serverTimestamp
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
// import {fetchUserId} from "../Home";


export function MealData(){
    let uss="";
    let [userid, setUserid] = useState("");
    const [meal,setMeal]=useState([]);

    const [user, loading, error] = useAuthState(auth);
    const navigate= useNavigate();

   const fetchUserId = async () => {
    try {
        const q = query(collection(db, "LoginData"), where("uid", "==", user?.uid));
        const querySnapshot = await getDoc(q); 
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log("ID="+ doc.id, " => ", doc.data());
            setUserid(doc.id); 
            uss=doc.id;
                      
        })
        alert("User id fetched = "+userid);
        
    } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
    }
    }

    const fetchMeal=async()=>{
        const meal=collection(db,`LoginData/${userid}/Meals`);
        // setPathh(`LoginData/${doc.id}/Recipes_user`); 
            onSnapshot(meal,snapshot=>{
                setMeal(snapshot.docs.map(doc1 =>{
                    return {
                        id:doc1.id,
                        viewing:false,
                        ...doc1.data()
                    } 
                }))
        });             

    }
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserId();
        fetchMeal();
}, [user, loading]);

}

// export function mealTable(){

// }