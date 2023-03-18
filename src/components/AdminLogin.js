import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import "../css/Admin.css";
import axiosInstance from "../util/Interceptor";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    mailId: '',
    password: ''
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event?.preventDefault();
  };

  const changeHandler = (e) => {
    setAdmin((prev) => ({ ...prev, [e.target?.name]: e.target?.value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    axiosInstance.post(`/user/login`, admin).then((res) => {
      localStorage.setItem("token", res?.response)
      const name = admin.mailId?.split("@");
      toast.success(`Welcome ${name[0].toUpperCase()}!!!`, {
        position: toast.POSITION.TOP_RIGHT
      });
      navigate("/enquiry-details")
    })};

  return (
    <div className="admin-login">
      <form className="form" onSubmit={(event) => submitHandler(event)}>
        <p style={{ fontSize: "29px" }}>Admin Login</p>
        <TextField
          id="outlined-basic"
          label="E-mail"
          type={'email'}
          variant="outlined"
          name="mailId"
          value={admin?.mailId}
          onChange={(event) => changeHandler(event)}
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
            value={admin?.password}
            autoComplete="on"
            onChange={(event) => changeHandler(event)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => handleClickShowPassword()}
                  onMouseDown={(e) => handleMouseDownPassword(e)}
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