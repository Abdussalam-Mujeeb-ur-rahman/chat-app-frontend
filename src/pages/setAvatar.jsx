import React, { useState, useEffect } from "react";
import styled, { keyframes } from 'styled-components';
import { defer, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from 'buffer';


export default function setAvatar() {

    const api = 'https://api.multiavatar.com/45678945';
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    // const [imageUrls, setImageUrls] = useState([]);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    };

    useEffect( () => {
        if (!localStorage.getItem("chat-app-user")) { navigate('/login') };
    }, [])

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error('please select an avatar!', toastOptions);
        } else {
            const user = await JSON.parse(localStorage.getItem('chat-app-user'));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar]
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem('chat-app-user', JSON.stringify(user));
                navigate('/');
            } else {
                toast.error('Error setting avatar. Please try again!', toastOptions);
            }
        }
    };

    // useEffect(() => {
    //     const data = [];
    //     for(let i=0; i<4; i++){
    //         const image = axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
    //         // const buffer = new Buffer(image.data);
    //         // data.push(buffer.toString('base64'));
    //         console.log(image)
    //     }
    //     setAvatars(data);
    //     setIsLoading(false);
    // }, [])

    // useEffect(() => {
    //     const random = Math.floor(Math.random() * 1000);
    //     const data = [];
    //     fetch(`https://api.multiavatar.com/45678945/${random}`)
    //       .then(data => {
    //         setImageUrls([data.url]);
    //       });
    //   }, []);

    useEffect(() => {
        const data = [];
        const random = Math.floor(Math.random() * 1000);

        async function fetchAvatar() {
            const image = await axios.get(`${api}/${random}`);
            const buffer = new Buffer(image.data);
            data.push(buffer.toString('base64'));
            setAvatars(data);

            setIsLoading(false);
        }
        fetchAvatar();
    }, [])


    return (
        <>
            {
                isLoading ? <Container>
                    <div className="loader">loading...</div>
                </Container> : (

                    <Container>
                        <div className="title-container">
                            <h1>
                                Pick an avatar as your profile picture
                            </h1>
                        </div>
                        {/* <div>
                    {imageUrls.map((url, index) => (
                        <>
                        <img key={index} src={url} alt={`Image ${index}`} />
                        </>
                        
                    ))}
                </div> */}
                        <div className="avatars">
                            {
                                avatars.map((avatar, index) => {
                                    return (
                                        <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                                            <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <button className="submit-btn" onClick={setProfilePicture}>Set as Profile Picture</button>
                    </Container>
                )
            }
            <ToastContainer />
        </>
    )
}

const loader = keyframes`
to{color: rgba(255, 255, 255, 0.1)}
`;

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: 3rem;
background-color: #131324;
height: 100vh;
width: 100wh;
border: 2px solid red;
.loader{
    width: 100px;
    height: 100px;
    color: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotate(0deg);
    animation: ${loader} 5s ease-out infinite
}
.title-container{
    h1{
        color: white;
        padding: 1rem;
    }
    @media screen and (max-width: 719px) {
        font-size: 3vw;
    }
}
.avatars{
    display: flex;
    gap: 2rem;
    @media screen and (max-width: 719px){
        gap: 4vw;
    }
    .avatar{
        border: 0.4rem solid transparent;
        padding: 0.4rem;
        border-radius: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.5s ease-in-out;
        img{
            height: 6rem;
            @media screen and (max-width: 719px) {
                height: 20vw
            }
        }
    }
    .selected{
        border: 0.4rem solid #4e0eff;
    }
}
.submit-btn {
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
    @media screen and (max-width: 719px) {
        padding: 4vw;
    }
    &:hover{
        background-color: #4e0eff;
    } 
}
`;