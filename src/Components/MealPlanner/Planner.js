import { useState,useEffect } from "react";
import {
  format,
  subMonths,
  addMonths,
  startOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  getWeek,
  addWeeks,
  subWeeks
} from "date-fns";
import './Planner.css'
import { auth, db } from "../Context/firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  getDoc,
  setDoc,
  getDocs,
  query,
  limit,
  where,orderBy,
  serverTimestamp
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactDatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAd, faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";

const Planner = ({ 
    // showDetailsHandle 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [breaks, setBreaks] = useState([]);
  let [userid, setUserid] = useState(null);
  const [pathh,setPathh]=useState("");
  const [popupActive,setPopupActive]=useState(false);
  const navigate= useNavigate();
  const [data,setData]=useState({
    mealdate:null,
    mealday:"",
    breakfast:"",
    lunch:"",
    dinner:"",
  })
  const [datee,setDatee]=useState("");
  const [dates,setDates]=useState(null);

  const [user, loading, error] = useAuthState(auth);


  const fetchUserId = async () => {
    try {
        const q = query(collection(db, "LoginData"), where("uid", "==", user?.uid));
        let docSnap = await getDocs(q); 
        docSnap.forEach((doc1) => {
            // console.log("ID="+ doc1.id, " => ", doc1.data());
            if(userid !== doc1.id || userid === "")
            {
              setUserid(doc1.id);
              setPathh(`LoginData/${doc1.id}`);
            }
        });
      } catch (err) {
          console.error(err);
        //   alert("An error occured while fetching userid data");
    };
  }

const fetchCurrentMeals=(curr_date)=>{
    let mealRef="";
      mealRef= query(collection(db,pathh+`/Meals`),where("mealdate","==",curr_date)); 
      onSnapshot(mealRef,snapshot=>{
        setData(snapshot.docs.map((doc2,i) =>{
          // console.log("ID= "+doc2.id+" => "+doc2.get('Meal_Date'));
          return{...data,breakfast:doc2.get('breakfast')};
        }))})     
  }
  const fetchMealll=async(mdatee)=>{
      // alert(userid);
      const q= query(collection(db,pathh+`/Meals`));
      // , 
      // where("userid","==",userid),)
      // where("Meal_Date", "==", mdatee));  
        onSnapshot(q,snapshot=>{
          setMeals(snapshot.docs.map(doc =>{
            // alert("Id = "+doc.id);
            // setDatem(mdatee);
          return {
            // ...meals,
              id:doc.id,
              viewing:false,
              ...doc.data()
          }
        }))
        // setAllmeals([...allmeals,newmeals]);
        })
    }

    const [viewMeals,setViewMeals]=useState([]);
    const [showMeals,setShowMeals]=useState(false);

   const handleView= async() => {
    try {
      let mealdata = collection(db,pathh,'/Meals');
      // let docSnap = await getDocs(q);
      // const mealdata= collection(db,`LoginData/${id}`,'Meals');
        onSnapshot(
            mealdata,
            snapshot=>{
            setViewMeals(snapshot.docs.map(doc1 =>{
                return {
                    ...viewMeals,
                    id:doc1.id,
                    ...doc1.data()
                }
            }))
        })
      } catch (err) {
        console.log(err);
      }
   }
   
   
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    fetchUserId();
  }, [user, loading]);

  const changeMonthHandle = (btnType) => {
    if (btnType === "prev") {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    if (btnType === "next") {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const changeWeekHandle = (btnType) => {
    //console.log("current week", currentWeek);
    if (btnType === "prev") {
      //console.log(subWeeks(currentMonth, 1));
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
    }
    if (btnType === "next") {
      //console.log(addWeeks(currentMonth, 1));
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
    }
  };

  const onDateClickHandle = (day, dayStr) => {
    setSelectedDate(day);
    // showDetailsHandle(dayStr);
  };
let cloneDay="";
  const renderDate=()=>{
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              isSameDay(day, new Date())
                ? "today"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={day}
            onClick={() => {
            //  setDatee(format(cloneDay, "dd MMM yy"));
              const dayStr = format(cloneDay, "ccc dd MMM yy");
              onDateClickHandle(cloneDay, dayStr);
            }}
            >
            <span className="number">{formattedDate}</span>

            <span className="bg">
              {formattedDate}
              </span>
            </div>
        )
        day = addDays(day, 1);
      }
        rows.push(
          <div className="row" key={day} onClick={()=>{
            // setPopupActive(true);  
            // setDatee(format(cloneDay, "dd MMM yy"));
            }
            }>
             
            <div className={`col cell`} style={{display:"inline"}}>
              Category
            </div>
            {days} 
          </div>
        )
       
        days = [];
      }
      return <div className="date m-body">{rows}</div>;
  };  

  const renderHeader = () => {
    const dateFormat = "MMM yyyy";
    // console.log("selected day", selectedDate);
    return (
      <div className="header meal-row flex-middle">
        <div className="col col-start">
          {/* <div className="icon" onClick={() => changeMonthHandle("prev")}>
            prev month
          </div> */}
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end">
          {/* <div className="icon" onClick={() => changeMonthHandle("next")}>next month</div> */}
        </div>
      </div>
    );
  };
  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <>
    <div className="days meal-row">
    <div className="col col-center"></div>
      {days}</div>
      </>;
  };
  const renderCells = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let daysBr = [];
    let daysLn = [];
    let daysDn = [];
    let day = startDate;
    let formattedDate = "";
    let cloneDay="";
    let j=0;
    while (day <= endDate) 
    {
      rows.push(
        <div className="meal-row" key={day}>
           <div className={`col cell`} 
           style={{display:"inline"}}>
              Category
            </div>
          {days}
        </div>
        )
      for (let i = 0; i < 7; i++) 
      {
        formattedDate = format(day, dateFormat);
        cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              isSameDay(day, new Date())
                ? "today"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={day}
            onClick={() => {
              // alert("day = "+selectedDate)
              setDatee(format(cloneDay, "dd MMM yy"));
              const dayStr = format(cloneDay, "ccc dd MMM yy");
              onDateClickHandle(cloneDay, dayStr);
            }}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        fetchMealll(format(cloneDay, "dd MMM yy"))
        

        daysBr.push
        (
          <div className={`col cell ${
              isSameDay(day, new Date())
                ? "today"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={daysBr}
            onClick={() => {
              // setDatee(format(cloneDay, "dd MMM yy"));
              // const dayStr = format(cloneDay, "ccc dd MMM yy");
              // onDateClickHandle(cloneDay, dayStr);
            }}
          >  {( 
            meals.map((meal)=>(
            meal.mealdate === 
            format(cloneDay, "dd MMM yy")
            ) ?
            // (meal.brekfast.map((b)=>(
              <p>{meal.breakfast}</p>         
            // )))
            :(<>
            {/* <p>{format(cloneDay, "dd MMM yy")}</p> */}
             </> ) 
          ))
          }
          </div>
        )

        daysLn.push
        (
          <div className={`col cell ${
              isSameDay(day, new Date())
                ? "today"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={daysLn}
            onClick={() => {
              // setDatee(format(cloneDay, "dd MMM yy"));
              // const dayStr = format(cloneDay, "ccc dd MMM yy");
              // onDateClickHandle(cloneDay, dayStr);
            }}
          >  
          {( 
            meals.map((meal)=>
            (meal.mealdate === format(cloneDay, "dd MMM yy")
            ) ?
            <p onClick={()=>{ 
              // alert("Clone day = "+format(cloneDay, "dd MMM yy"))
            }}>{meal.lunch}</p>         
            :<>
            {/* <p>{format(cloneDay, "dd MMM yy")}</p> */}
             </>  
          ))
          }
          </div>
        )
        
        daysDn.push
        (
          <div className={`col cell ${
              isSameDay(day, new Date())
                ? "today"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={daysDn}
            onClick={() => {
              // setDatee(format(cloneDay, "dd MMM yy"));
              // const dayStr = format(cloneDay, "ccc dd MMM yy");
              // onDateClickHandle(cloneDay, dayStr);
              
            }}
          >  {( 
            meals.map((meal)=>(
            meal.mealdate===format(cloneDay, "dd MMM yy")
            ) ?
            <p>{meal.dinner}</p>         
            :<>
            {/* <p>{format(cloneDay, "dd MMM yy")}</p> */}
             </>  
          ))
          }
          </div>
        )

        day = addDays(day, 1);
      }

      // rows.push(
      //   <div className="meal-row" key={day}>
      //     {days}
      //   </div>
      // );
      rows.push(
      <>
      <div className="meal-row br" >
             <div className={`col cell`}>   
              Breakfast
            </div> 
            {daysBr}
      </div>
      <div className="meal-row ln" 
              onClick={()=>{
              // alert("Clone day = "+day)
              }}>
             <div className={`col cell`}>   
              Lunch
            </div> 
            {daysLn}
          </div>
          <div className="meal-row dn" >
             <div className={`col cell`}>   
              Dinner
            </div> 
            {daysDn}
          </div>
          </>)
      days = [];
      daysBr=[];

      daysLn=[];
      daysDn=[];

    }
    return <div className="meal-body">{rows}</div>;
  };
  const renderFooter = () => {
    return (
      <div className="header meal-row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => changeWeekHandle("prev")}>
            prev week
          </div>
        </div>
        <div>{currentWeek}</div>
        <div className="col col-end" onClick={() => changeWeekHandle("next")}>
          <div className="icon">next week</div>
        </div>
      </div>
    );
  };

const notify=()=>{toast("Meal Added!")}

const meal_notify=()=>{toast("Please add any of meal!")}

  const handleSubmit= async (e) =>{
    e.preventDefault();
    // let errors= validate();
    // if(Object.keys(errors).length)  return setErrors(errors);
    // setIsSubmit(true);
    const q = query(collection(db, pathh+`/Meals`), 
    where("userid", "==",parseInt(userid,10)));
    const docs = await getDocs(q);
    let myId="";
    let useridd=0;
    
    if(docs.docs.length === 0)
    {
      myId=userid+"301";
      let d=null;
      d=format(dates,"dd MMM yy");
      var id_no=parseInt(myId,10);
      // if(window.confirm("Want to add in "+myId + "?"))
      {
        const newDocRef = doc(collection(db, `LoginData/${userid}/Meals`),`${id_no}`);
        // alert("My id = "+myId);
          // await 
          useridd = parseInt(userid,10);
          setDoc(newDocRef, {
            ...data,
            userid:useridd,
            mealdate:d,
            timestamp:serverTimestamp()
          });
          notify()
          // alert("Meal added!");
          //  to "+userid+"with doc id "+myId);
          setPopupActive(false);
          navigate("/mealplanner");    
          setDates(null);  
            setData({
              mealdate:null,
              // day:"",
              breakfast:"",
              lunch:"",
              dinner:"",
            })
      }        
    }
    else
    {
      const lastdocRef= query(collection(db,`LoginData/${userid}/Meals`),orderBy("timestamp",'desc'),limit(1));
      const docSnap = await getDocs(lastdocRef);
      docSnap.forEach((doc)=> 
      {
        myId=doc.id;
      });
      myId=parseInt(myId,10);
      myId+=1;
      myId=myId.toString();
      var id_no=parseInt(myId,10);
      const newDocRef = doc(collection(db, `LoginData/${userid}/Meals`),
      `${id_no}`);
        useridd = parseInt(userid,10);
          // {setDates(format(data.mealdate,"dd MMM yy"))}
          let d=null;
          d=format(dates,"dd MMM yy");
         
          {setDoc(newDocRef, {
            ...data,
            userid:useridd,
            mealdate:d,
            timestamp:serverTimestamp()
          });
          notify()
          // alert("Meal added!");
          //  to "+userid+"with doc id "+myId);
          setPopupActive(false);
          navigate("/mealplanner");     
          }
          setDates(null);
          setData({
            mealdate:null,
            // mealday:"",
            breakfast:"",
            lunch:"",
            dinner:"",
          })
    }
}


  return (
   <>
    <div className='containerr'>
      <button 
      className="btn view-meals my-5"
      onClick={()=>{setShowMeals(true); handleView();}}
      > View All Meals</button>
    </div>
    <div></div>
    <div className="calendar" style={{width:"80%",marginLeft:"150px"}}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {popupActive && <div className='popup'
      style={{backgroundColor:'#c688a2a1'}}>
          <div className='popup-inner'>
            <h2> Add a Meal  </h2>
            
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                      <label>Meal Date</label>                     
                       <ReactDatePicker
                      selected={dates}
                      required='true'
                      // value={data.mealdate}
                      value={dates}
                      dateFormat="dd MMM yy"
                      onChange={(e)=>
                        {
                          setDates(e);
                          fetchCurrentMeals(dates)
                        }
                        // setData(
                        // {...data,mealdate:e})
                      }
                      />  
                     {dates === "" && (
                      <span className="error-msg">
                        Please select meal date
                      </span>
                      )}
                      <label>Breakfast</label>
                    <input type='text' 
                      value={data.breakfast} 
                      //  focused={focused.toString()}
                      onChange={(e)=>{setData({...data,breakfast:e.target.value}); 
                      }} 
                      pattern="^[A-Za-z]+$"
                      // placeholder="Recipe Category"
                      />

                    <div className='form-group'>
                      <label>Lunch</label>
                      <input type='text' 
                      value={data.lunch} 
                       
                      //  focused={focused.toString()}
                      onChange={(e)=>{setData({...data,lunch:e.target.value}); 
                      }} 
                      pattern="^[A-Za-z\s]+$"
                      // placeholder="Recipe Category"
                      />
                    </div>
                    <div className='form-group'>
                      <label>Dinner</label>
                      <input type='text' 
                      value={data.dinner} 
                      // onBlur={handleFocus} focused={focused.toString()}
                      onChange={(e)=>{setData({...data,dinner:e.target.value})}} 
                      pattern="^[A-Za-z\s]+$"
                      // placeholder="Recipe Category"
                      />
                    </div>
                    {data.breakfast !== "" && (
                  <span className="error-msg">
                    Please enter alphabetic characters only
                  </span>
                  )}
                    </div>
                    <div className="buttons">
                      <button type="submit" 
                      disabled={dates===null}
                      onClick={()=>{
                        // setDatee(format(cloneDay, "dd MMM yy"));
                      {
                        (data.breakfast==="" && data.lunch === "" &&
                         data.dinner ==="")
                        ?alert("Please add any of meal")
                        :
                        handleSubmit()}}} style={{backgroundColor:'#cc3f7a',border:"none"}}> Save </button>
                      <button type="button" onClick={()=>setPopupActive(false)} className="remove" style={{backgroundColor:'#cc3f7a',border:"none"}}>Close</button>
                    </div>
                
              </form>
          </div>
        </div>
       }
      {renderFooter()}

      {(showMeals)&&  
      <div className="popup" 
      style={{
      backgroundColor:"#ffffff77"
      }}>
      <div className="db-popup-inner" 
          style={{
            borderRadius:'10px',
            backgroundColor:'#c688a2a1',
          minWidth:'630px',height:'400px'}}>
          <table style={{color:'black'}}>
          <button type="button" 
          style={{display:'block',marginRight:'-430px',
          float:'right'}}
          onClick={()=>setShowMeals(false)} 
          // className="remove"
          ><FontAwesomeIcon icon={faClose}/></button>
          <thead style={{color:'black',fontSize:'14px'}}>
            <th>Meal Date</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
          </thead>
        {(viewMeals?.length>0)?
          <tbody>
          {viewMeals.map((s,i)=>
          (
          <tr>
            <td>{s.mealdate}</td>
            <td>{s.breakfast}</td>
            <td>{s.lunch}</td>
            <td>{s.dinner}</td>
          </tr>
          ))}
          </tbody>
          : <div className='dashboard-content-footer'>
          <div className='no-meal'>
            <h2 className=''>No Meals</h2>
            </div>
          </div>}
          </table>
          </div>
      </div>}
     

      <button className="add"
        style={{backgroundColor:'#cc3f7a'}}
        onClick={() => {
          {
            !user ? alert("Please login!") :
            setPopupActive(!popupActive);
          }
        }}
      >
        <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
      </button>
    </div>
   
    </> 
  );
};

export default Planner;
