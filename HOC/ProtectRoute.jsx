import { useEffect, useState } from "react";
import { isAuthenticated } from "../pages/api/authAPIs";
import Cookies from "js-cookie";
import { useStore } from "../store";

const ProtectRoute = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { setUsername } = useStore();

  useEffect(() => isLoggedIn(), []);

  const isLoggedIn = async () => {
    await isAuthenticated(async (data, error) => {
      if (data) {
        const { username } = data;
        setUsername(username);
        setLoggedIn(true);
      } else {
        Cookies.remove("authToken");
        window.location.href = "/login";
      }
    });
  };

  return loggedIn ? children : null;
};

export default ProtectRoute;
