import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import custom_axios from "../axios/AxiosSetup";
import { getLoginInfo } from "../utils/LoginInfo";
// Icons
import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import "./users.css";
import { detailsUser } from "../slices/userInfo";
const Login = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  let email = useRef();
  let password = useRef();
  useEffect(() => {
    if (getLoginInfo()) return navigate("/app/list-produits");
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const loginApp = async () => {
    if (email.current.value == "" || password.current.value == "") {
      toast.info("Please fill the information");
      return;
    }
    const response = await axios.post("http://localhost:5000/api/users/login", {
      email: email.current.value,
      password: password.current.value,
    });
    localStorage.setItem("token", response.data.token);

    console.log(response);
    if (response.data.success == 0) {
      toast.warn("Invalid User");
      return;
    } else {
      dispatch(detailsUser(response.data.results));
      dispatchEvent(new Event("storage"));
      navigate("/app/list-produits");
    }

    // navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-secondary-100 p-8 rounded-xl shadow-2xl w-auto lg:w-[450px]">
        <div className="mb-8">
          <button className="flex items-center justify-center py-3 px-4 gap-4 bg-secondary-900 w-full rounded-full mb-8 text-gray-100">
            <img src="/logo.webp" className="w-20 h-20 rounded-xl" />
            Yazasnkrs Group
          </button>
          <div className="relative mb-4">
            <RiMailLine className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
            <input
              ref={email}
              type="email"
              className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
              placeholder="Email:"
            />
          </div>
          <div className="relative mb-8">
            <RiLockLine className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
            <input
              ref={password}
              type={showPassword ? "text" : "password"}
              className="py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg"
              placeholder="Password:"
            />
            {showPassword ? (
              <RiEyeOffLine
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-primary"
              />
            ) : (
              <RiEyeLine
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-primary"
              />
            )}
          </div>
          <div>
            <button
              onClick={loginApp}
              className="bg-primary text-black uppercase font-bold text-sm w-full py-3 px-4 rounded-lg"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
