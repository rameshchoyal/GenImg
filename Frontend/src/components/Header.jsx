// import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useEffect, useState } from "react";

const Header = () => {
  // const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [userdata, setUserdata] = useState({});
  console.log("response", userdata);

  const getUser = () => {
    axios
      .get("http://127.0.0.1:6005/login/success", {
        withCredentials: true,
      })
      .then((response) => {
        setUserdata(response.data.user);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const logout = () => {
    window.open("http://localhost:6005/logout", "_self");
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleSignOut = () => {};

  return (
    <div className=" absolute inset-x-0 top-0 bg-gradient-to-b  from-black py-2 px-8 z-10 flex flex-col md:flex-row justify-between ">
      <img
        className="w-48 mx-auto md:mx-0 "
        src="https://cdn.openart.ai/assets/home/openart_logo_20240529.svg"
        alt="logo"
      />

      <div className="flex flex-wrap my-1 md:my-7 justify-between">
        {user && (
          <img
            className="hidden md:inline-block w-8 h-8 mx-2"
            src={user?.photoURL}
            alt="usericon"
          />
        )}
        <button
          className="text-white font-bold bg-black px-3 py-1 rounded-lg mx-2 border border-gray-500 hover:bg-gray-800 focus:outline-none  focus:ring-gray-600"
          onClick={handleSignOut}
        >
          {user ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </div>
  );
};

export default Header;
