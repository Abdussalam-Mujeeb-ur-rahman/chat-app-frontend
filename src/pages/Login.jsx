import React, {useState, useEffect} from "react";
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

const Login = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        password: "",
    })

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    };

    useEffect(() => {
        if(localStorage.getItem('chat-app-user')){
            navigate('/'); 
        }
    }, [])

    const handleSubmit = async(event) => {
        event.preventDefault();
        if(handleValidation()){
            const {password, username} = values;
            
            const {data} = await axios.post(loginRoute, {
                username, password
            });

            if(data.status === false){
                toast.error(data.message, toastOptions)
            }
            if(data.status === true){
                localStorage.setItem('chat-app-user', JSON.stringify(data.isUser));
                navigate('/');
            }
        }
    }

    const handleValidation = () => {
        const {password, username} = values;

        if(password === ""){
            toast.error('Password cannot be empty!', toastOptions);
            return false;
        }else if(username.length === ''){
            toast.error('Username cannot be empty!', toastOptions);
            return false;
        }

        return true;
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value});
     }


    return (
        <>
        <FormContainer>
            <form onSubmit={(event) => { handleSubmit(event) }}>
                <div className="brand">
                    <h1>Chatme</h1>
                </div>
                <input type='text' placeholder='username' name='username' min="3" onChange={(e) => { handleChange(e) }} />
                <input type='password' placeholder='password' name='password' min="8" onChange={(e) => { handleChange(e) }} />
                <button type="submit">Log In</button>
                <span>Don't have an account?, <Link to='/register'>signup</Link></span>
            </form>
        </FormContainer>
        <ToastContainer />
        </>
    )
}

const FormContainer = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #131324;
overflow: auto;

@media screen and (max-width: 719px) {
    gap: 0;
}

.brand{
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    @media screen and (max-width: 719px) {
        gap: 0;
        width: 80%;
    }

    h1{
        color: white;
        text-transform: uppercase;
        @media screen and (max-width: 719px) {
            text-transform: capitalize;
        }
    }
}
form{
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;

    @media screen and (max-width: 719px) {
        gap: 4vw;
        padding: 8vw;
        justify-content: center;
        align-items: center;
    }

    input{
        background-color: transparent;
        padding: 1rem;
        border: 0.1rem solid #4e0eff;
        border-radius: 0.4rem; 
        color: white;
        width: 100%;
        font-size: 1rem;
        &:focus{
            border: 0.1rem solid #997af0;
            outline: none;
        }
        @media screen and (max-width: 719px) {
            width: 80%;
        }
    }

    button{
        background-color: #997af0;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.5s all ease-in-out;
        &:hover{
            background-color: #4e0eff;
        }
        @media screen and (max-width: 719px) {
            padding: 4vw;
            width: 80%;
        }
    }

    span{
        color: white;
        text-transform: uppercase;

        @media screen and (max-width: 719px) {
            font-size: 4vw;
            width: 80%
        }

        a{
            color: #4e0eff;
            text-decoration: none;
            font-weigth: bold;
        }
    }
}
`;

export default Login;