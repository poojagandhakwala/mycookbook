import DashboardIcon from "../assets/icons/dashboard.svg";
import UserIcon from "../assets/icons/user.svg";
import HomeIcon from "../assets/icons/home.svg";
import RecipeIcon from "../assets/icons/cooking.svg";
import FoodIcon from "../assets/icons/food.svg";


const sidebar_menu = [
  {
    id: 1,
    icon: DashboardIcon,
    path: "/dashboard",
    title: "Dashboard",
  },
  {
    id: 2,
    icon: UserIcon,
    path: "/dashboard/users",
    title: "Users",
  },
  {
    id: 3,
    icon:FoodIcon,
    // icon: RecipeIcon,
    path: "/dashboard/recipes",
    title: "Recipes",
  },
  {
    id: 4,
    icon: HomeIcon,
    path: "/",
    title: "Home",
  },
];

export default sidebar_menu;
