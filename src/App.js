import Home from "./Components/Home/home.js";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./Components/Login/login.js";
import Reset from "./Components/Login/reset.js";
import Signup from "./Components/SignUp/signup.js";
import { AuthContextProvider } from "./Components/Context/AuthContext";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ShoppingList from "./Components/ShoppingList/Shoppinglist.js";
import Navbar from "./Components/Navbar/navbar_new";
import RecipeViewer from "./Components/Home/viewer.js";
import Footer from "./Components/Footer/footer.js";
import RecipeBook from "./Components/RecipeBook/recipe.js";
import Myprofile from "./Components/User_Profile/MyProfile";
import Dashboard from "./Components/Dashboard/Dashboard.js";
import Users from "./Components/Dashboard/Data_tables/Users";
import Recipes from "./Components/Dashboard/Data_tables/Recipes";
import Change from "./Components/User_Profile/change";
import Planner from "./Components/MealPlanner/Planner";
import { ToastContainer } from "react-toastify";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import MyProfile from "./Components/User_Profile/MyProfile";
// import SearchUser from "./Components/Home/SearchUser";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    if (isLoaded === true) window.location.reload();
    setIsLoaded(false);
  }, []);

  const navbar = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/RecipeViewer",
      element: <RecipeViewer />,
    },
    {
      path: "/shoppinglist",
      element: <ShoppingList />,
    },
    {
      path: "/mealplanner",
      element: <Planner />,
    },
    {
      path: "/recipebook",
      element: <RecipeBook />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/reset",
      element: <Reset />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/dashboard/users",
      element: <Users />,
    },
    {
      path: "/dashboard/recipes",
      element: <Recipes />,
    },
    {
      path: "/myprofile",
      element: <MyProfile />,
    },
    {
      path: "/change",
      element: <Change />,
    },
  ];

  return (
    <>
      <div className="menu">
        <BrowserRouter>
          <AuthContextProvider>
            {window.location.pathname !== "/login" &&
            window.location.pathname !== "/signup" &&
            window.location.pathname !== "/dashboard" &&
            window.location.pathname !== "/dashboard/users" &&
            window.location.pathname !== "/dashboard/recipes" ? (
              <Navbar />
            ) : (
              <></>
            )}
            <Routes>
              {navbar.map((item, index) => (
                <Route path={item.path} element={item.element} />
              ))}
            </Routes>
            {window.location.pathname !== "/login" &&
            window.location.pathname !== "/signup" &&
            window.location.pathname !== "/dashboard" &&
            window.location.pathname !== "/dashboard/users" &&
            window.location.pathname !== "/dashboard/recipes" ? (
              <Footer />
            ) : (
              <></>
            )}
          </AuthContextProvider>
        </BrowserRouter>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
}
export default App;
