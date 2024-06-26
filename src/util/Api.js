import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";


const skipOutsideClick = () => {
  toast.dismiss();
}

export function authHeader() {
  // return authorization header with jwt token
  const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

export const logout = () => {
  localStorage.clear();
  window.location = "/"
}

export const errorHandler = (error) => {
  document.addEventListener('click', skipOutsideClick)
  switch (error.response?.status) {
    case 401:
      if (error.response?.data?.message?.includes("Unauthorized User")) {
        toast.error(error.response?.data?.message);
        logout();
      }
      break;
    case 400:
    case 404:
    case 422:
    case 500: toast.error(error.response?.data?.message || "Something went wrong");
      break;
    default: toast("Oops!!! Something went wrong")
  }
};
