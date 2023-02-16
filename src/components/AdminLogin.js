import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import "../css/Admin.css";
import { authHeader, errorHandler } from "../util/Api";
import { REST_API } from "../util/EndPoints";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({

  });

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changeHandler = (e) => {
    setAdmin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    axios.post(`${REST_API}/user/login`, admin, { headers: authHeader() }).then((res) => {
      console.log(res.data.response);
      localStorage.setItem("token", res.data.response)
      const name = admin.mailId.split("@");
      toast.success(`Welcome ${name[0].toUpperCase()}!!!`, {
        position: toast.POSITION.TOP_RIGHT
      });
      navigate("/celebrity-details")
    })
      .catch((error) => {
        errorHandler(error);
      });
  };

  return (
    <div className="admin-login">
      <form className="form" onSubmit={submitHandler}>
        <p style={{ fontSize: "29px" }}>Admin Login</p>
        <TextField
          id="outlined-basic"
          label="E-mail"
          type={'email'}
          variant="outlined"
          name="mailId"
          value={admin.mailId}
          onChange={changeHandler}
        >
          <EmailIcon />
        </TextField>
        <br />
        <FormControl style={{ margin: "0px" }} min="8" variant="outlined" >
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={admin.password}
            onChange={changeHandler}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <br />
        <Button type="submit" style={{ height: "50px", width: "100%" }} variant="contained">
          <b> Login</b>
        </Button><br />
      </form>
    </div>
  );
};


{/*   */}