import NoteContainer from "./NotesContainer";
import Sidebar from "./Sidebar";
import './Shoppinglist.css';
import React, { useEffect, useState } from 'react';
import 'firebase/storage';
import * as dayjs from "dayjs";
import {
  collection,
  collectionGroup,
  onSnapshot,
  getDocs,
  deleteDoc,
  query,
  where,orderBy,
} from "firebase/firestore";
import { auth, db} from "../Context/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// import { useState,useEffect } from "react";
// import { Preloader} from 'react-preloader-icon';
// import {vegan} from './vegan.png'

function ShoppingList() {
  const [notes, setNotes] = useState(
    // JSON.parse(localStorage.getItem("notes-app")) || 
    []
  );
  const [search, setSearch] = useState("");
  const addNote = (color) => {
    // const tempNotes =  [...notes];
    const tempNotes =  [];
    // alert("Color = "+color);
    tempNotes.push({
      id: Date.now() + "" + Math.floor(Math.random() * 78),
      text: "",
      time: Date.now(),
      col:color,
      title:""
    });
    // alert("Temp notes = "+tempNotes);
    setNotes(tempNotes);
    // alert("Color = "+tempNotes[0].col);
    // alert("Color = "+notes[0].col);

  };

  const deleteNote = (id) => {
    const tempNotes = [...notes];

    const index = tempNotes.findIndex((item) => item.id === id);
    if (index < 0) return;

    tempNotes.splice(index, 1);
    setNotes(tempNotes);
  };

  const updateText = (text, id) => {
    const tempNotes = [...notes];

    const index = tempNotes.findIndex((item) => item.id === id);
    if (index < 0) return;

    tempNotes[index].text = text;
    setNotes(tempNotes);
  };

  // useEffect(() => {
  //   localStorage.setItem("notes-app", JSON.stringify(notes));
  // }, [notes]);


  const [user, loading, error] = useAuthState(auth);
  const [userlists,setUserlists]=useState([]);
  let [userid, setUserid] = useState("");
  let idd="";
        // const [time,setTime]=useState(null);
  const fetchUserId = async () => {
    try {
        const q = query(collection(db, "LoginData"), where("uid", "==", user?.uid));
        const docSnap = await getDocs(q);
        const time_created=null,formatDate=null;
        docSnap.forEach((doc1) => {
            // doc.data() is never undefined for query doc snapshots
            console.log("ID="+ doc1.id, " => ", doc1.data());
            if(userid!==doc1.id)
            {setUserid(doc1.id);}
            if(idd==="")
            {idd=doc1.id}
          })
            const lists=collection(db,`LoginData/${idd}/ShoppingLists`);
            onSnapshot(lists,snapshot=>{
              setUserlists(snapshot.docs.map(doc2 =>{
                // alert("uscoll " +doc1.id)
                  return {
                      id:doc2.id,
                      formatDate: dayjs.unix(doc2.get('timestamp').seconds).
                        format('DD/MM/YYYY'),
                      ...doc2.data()
                   }
              }))
            });             

        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };
    
    useEffect(() => {
      if (loading) return;
      if (!user) return; 
      // navigate("/");
      if(user) fetchUserId();
      
  }, [user, loading]);

  // const __handleSearch = (event) => {
  //   setSearch(event.target.value);
  //   if (event.target.value !== null) {
  //     let search_results = userlists.filter(
  //       (item) =>
  //         item.titles.toLowerCase().includes(search.toLowerCase()) 
  //     );
  //     setUserlists(search_results);
  //   } 
  // };

  return (
    <>
    <div className="list-app">
      <Sidebar addNote={addNote} />
      <div className="shopping-lists">
        {/* {alert("Notes text = "+notes.text)} */}
        {/* <div className="notes"> */}
          {(notes?.length > 0) ? 
              (
          <NoteContainer
            userid={userid}
            // usernotes={""}
            notes={notes}
            deleteNote={deleteNote}
          />
          ) 
          : (
          <></>
        )}

      {(userlists?.length > 0) ? 
          (
            userlists.map((userlist) => (
             <> 
             <NoteContainer
             title={userlist.titles}
             color={userlist.color}
             userid={userid}
             docid={userlist.id}
            usernotes={userlist.notes}
            deleteNote={deleteNote}
            updateText={updateText}
            timestamp={userlist.formatDate}
            />
              </>
            ))
          ) 
           : (
            <></>
          )}
      </div>
    </div>
    {(userlists?.length === 0) ?  
    <div className="container no-list">
      <h2>No Lists yet!</h2></div>:<></>}
          

    </>
  );
}

export default ShoppingList;