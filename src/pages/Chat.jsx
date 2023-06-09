import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
import Logout from "../components/Logout";

const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    let cancelRequest;

    async function fetchData() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { token, cancel } = axios.CancelToken.source();
          cancelRequest = cancel;
          try {
            const data = await axios.get(
              `${allUsersRoute}/${currentUser._id}`,
              { cancelToken: token }
            );

            setContacts(data.data);
          } catch (error) {
            if (axios.isCancel(error)) {
              console.log("Request canceled", error.message);
            } else {
              // Handle other errors
              console.log(`error cancelling request!`);
            }
          }
        } else {
          navigate("/setAvatar");
        }
      }
    }

    fetchData();

    return () => {
      if (cancelRequest) {
        cancelRequest();
      }
    };
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="log-user">
        {currentUser && (
          <div className="Current-User">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUser.username}</h2>
            </div>
          </div>
        )}
        <Logout />
      </div>

      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && currentChat === undefined
          ? currentUser && <Welcome user={currentUser} />
          : currentUser &&
            currentChat && (
              <ChatContainer
                currentChat={currentChat}
                currentUser={currentUser}
                socket={socket}
              />
            )}
        {}
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  @media screen and (max-width: 719px) {
    gap: 2vh;
  }

  .log-user {
    display: flex;
    justify-content: flex-end;
    gap: 2vh;
    width: 90vw;
    @media screen and (max-width: 719px) {
      justify-content: space-between;
    }
  }

  .container {
    height: 90vh;
    width: 90vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    justify-content: space-between;

    @media screen and (max-width: 719px) {
      display: flex;
      flex-direction: column;
      height: 80vh;
      padding: 1vw;
      border-radius: 0 0 5vw 5vw;
    }

    @media screen and (min-width: 720px) and (max-width: 1000px) {
      grid-template-columns: 35% 65%;
    }
  }

  .Current-User{
    display: none;
    justify-content: center;
    align-items: center;
    gap: 2vw;
    @media screen and (max-width: 719px) {
        display: flex;
      } 
      .avatar{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 12vw;
        img{
            @media screen and (max-width: 719px) {
            height: 100%;
          } 
        }
        
    }
    .username{
        h2{
          color: white;
        }
    }
    @media screen and (min-width: 720px) and (max-width: 1000px) {
        gap: 0.5rem;
        .username {
            h2 {
                font-size: 1rem;
            }
        }
    }
}
`;

export default Chat;
