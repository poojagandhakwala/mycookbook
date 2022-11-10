import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar.js';
import Home from "./Components/Home.js";
import ShoppingList from "./Components/ShoppingList.js";
import MealPlanner from "./Components/MealPlanner.js";
import CookBook from "./Components/CookBook.js";
import {Route,Routes} from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/home" element={<Home/>} />
          <Route path="/shoppinglist" element={<ShoppingList/>} />
          <Route path="/mealplanner" element={<MealPlanner/>} />
          <Route path="/cookbooks" element={<CookBook/>} />
        </Routes>
      </div>
    </>
    
  );
}

export default App;
