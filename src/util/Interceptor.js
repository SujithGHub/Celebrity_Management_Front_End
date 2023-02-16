import React from "react";
import axios from "axios";

 axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
       
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}` ;
            console.log(token)
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        console.log(error)
        return Promise.reject(error);
});

 
