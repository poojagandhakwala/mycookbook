import React from "react";
import Note from "./Note";
import "./NoteContainer.css";


function NoteContainer(props) {

  // const reverArray = (arr) => {
  //   const array = [];
  //   if(props.notes)
  //   {
  //   for (let i = arr.length - 1; i >= 0; --i) {
  //     array.push(arr[i]);
  //   }
  // }
  //   return array;
  // };
  const notes = props.notes;

  // let notes = props.notes;
  
let usernotes = props.usernotes;
// usernotes=usernotes.toString();
// usernotes=usernotes.split(' ');

let idd=props.userid;

  return (
    <>
    <div className="note-container">
      <div className="note-container_notes mx-5 custom-scroll">
      {
         (usernotes?.length > 0) ? (
            <Note
              color={props.color}
              userid={idd}
              docidd={props.docid}
              usernote={props.usernotes}
              usertitle={props.title}
              deleteNote={props.deleteNote}
              updateText={props.updateText}
              timestampp={props.timestamp}
            />
        ):(<></>)} 

        {(notes?.length >= 0) ? (
            <Note
              title={props.title}
              userid={idd}
              note={props.notes}
              deleteNote={props.deleteNote}
              updateText={props.updateText}
            />
        ) :(<></>)}
        
        
      </div>    
       
      </div>
    </>
  );
}
export default NoteContainer;