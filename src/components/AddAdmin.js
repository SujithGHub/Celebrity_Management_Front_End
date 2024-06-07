import { Autocomplete, Button, FormControl, TextField } from "@mui/material"
import { TextFieldInput } from "../common/TextField"
import { useEffect, useState } from "react"
import axiosInstance from "../util/Interceptor";
import { toast } from "react-toastify";
import { isEmpty } from "../util/Validation";

export default function AddAdmin() {
    const [role, setRole] = useState([]);
    const [user, setUser] = useState(null);
    const [userError, setUserError] = useState({
        nameError:false,
        mailIdError:false

})

    useEffect(() => {
        getRole();
    }, [])
    const changeHandler = (event) => {
        console.log(event.target.name+"Error");
        setUserError((prev)=>({
            ...prev,[event.target.name+"Error"]:false
        }))
        setUser((prev) => ({
            ...prev, [event.target.name]: event.target.value
        })
        )
    }
    const AddUser = () => {
        // if(user?.mailId=='' && user?.password ==''){
        //     toast.error("Fields are Required")
        // }
        if (isEmpty(user?.name)) {
            setUserError((prev) => ({ ...prev, nameError: true }));
            return
        } else {
            setUserError((prev) => ({ ...prev, nameError: false }));
        }
        if (isEmpty(user?.mailId)) {
            setUserError((prev) => ({ ...prev, mailIdError: true }));
            return
        } else {
            setUserError((prev) => ({ ...prev, mailIdError: false }));
        }
        const roles = role.filter(item => item.name === 'ADMIN')
        const updatedUser = { ...user, roleId: roles[0]?.id }
        axiosInstance.post(`/user`, updatedUser).then((res) => {
            setUser();
            toast.success('Admin Added Successfully')
        }).catch(() => { })
    }
    const getRole = () => {
        axiosInstance.get(`/role/get-all`, role).then((res) => {
            setRole(res);
        }).catch(() => { })
    }


    return (
        <div>
            <h2 style={{ display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>Add Admin</h2>
            <div className="col" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <FormControl autoComplete="hidden" style={{ width: '40%'}}>
                    <div className="row" style={{ padding: '1rem' }}  >
                        <TextField
                            id="standard-basic"
                            label="Name"
                            type={'name'}
                            variant="filled"
                            name="name"
                            value={user?.name || ""}
                            error={userError.nameError}
                            onChange={(event) => changeHandler(event)}
                        /></div>
                    <div className="row" style={{ padding: '1rem' }}>
                        <TextField
                            id="standard-basic"
                            label="E-mail"
                            type={'email'}
                            autoComplete="off"
                            variant="filled"
                            name="mailId"
                            error={userError.mailIdError}
                            value={user?.mailId || ""}
                            inputProps={{ autoComplete: 'new-mailId' }}
                            onChange={(event) => changeHandler(event)}
                        /></div>
                    <div className="row" style={{ padding: '1rem' }}>
                        <form autoComplete="off"/>
                        <TextField
                            id="standard-basic"
                            label="password"
                            type={'password'}
                            autoComplete="new-password"
                            inputProps={{ autoComplete: 'new-password' }}
                            variant="filled"
                            name="password"
                            value={user?.password || ""}
                            onChange={(event) => changeHandler(event)}
                        />
                    </div>
                    <div className="row" style={{ padding: '1rem' }}>
                        <TextField
                            id="standard-basic"
                            label="Phone Number"
                            type={'number'}
                            variant="filled"
                            name="phoneNumber"
                            value={user?.phoneNumber || ""}
                            onChange={(event) => changeHandler(event)}
                        /></div>
                </FormControl>
                <Button onClick={() => AddUser()} variant="contained" style={{ display: 'flex' }}>Add</Button>
            </div>
        </div>
    )
}