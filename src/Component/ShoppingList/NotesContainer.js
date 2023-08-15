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
      <div className="note-container_notes custom-scroll">
      {
         (usernotes?.length > 0) ? (
          // notes.map((item) => (
            // {(usernotes===" ") ? (user) : ()}
            <Note
              // key={item.id}
              color={props.color}
              userid={idd}
              docidd={props.docid}
              usernote={props.usernotes}
              usertitle={props.title}
              deleteNote={props.deleteNote}
              updateText={props.updateText}
              timestampp={props.timestamp}
            />
          // ))
        ):(<></>)} 

        {(notes?.length >= 0) ? (
          // notes.map((item) => (
            <Note
              // key={item.id}
              // note={item}
              // color={props.color}
              title={props.title}
              userid={idd}
              note={props.notes}
              deleteNote={props.deleteNote}
              updateText={props.updateText}
            />
          // ))
        ) :(<></>)}
        
        
      </div>    
       
      </div>
    </>
  );
}

export default NoteContainer;





// import React from "react";
// import Note from "./Note";
// import "./NoteContainer.css";

// function NoteContainer(props) {
//   const reverArray = (arr) => {
//     const array = [];

//     for (let i = arr.length - 1; i >= 0; --i) {
//       array.push(arr[i]);
//     }

//     return array;
//   };

//   const notes = reverArray(props.notes);

//   return (
//     <div className="note-container">
//       <div className="note-container_notes custom-scroll">
//         {notes?.length > 0 ? (
//           notes.map((item) => (
//             <Note
//               key={item.id}
//               note={item}
//               deleteNote={props.deleteNote}
//               updateText={props.updateText}
//             />
//           ))
//         ) : (
//           <h3>No Notes present</h3>
//         )}
//         {usernotes?.length > 0 ? (
//           // usernotes.map((item) => (
//             <Note
//               // key={item.id}
//               // userid={idd}
//               docidd={props.docid}
//               note={usernotes}
//               deleteNote={props.deleteNote}
//               updateText={props.updateText}
//             />
//           // ))
//         ) : (
//           <h3>No Notes present</h3>
//         )}
//       </div>
//     </div>
//   );
// }

// export default NoteContainer;