import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import ChatInput from "./ChatInput";
import Messages from "./Messages";
import axios from "axios";

// routes
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const scrollRef = useRef();

  // first func
  // useEffect( async () => {
  //     const response = await axios.post(getAllMessagesRoute, {
  //         from: currentUser._id,
  //         to: currentChat._id,
  //     });
  //     setMessages(response.data);
  // }, [currentChat]);

  //second func
  // async function getAllMessages() {
  //     const response = await axios.post(getAllMessagesRoute, {
  //       from: currentUser._id,
  //       to: currentChat._id,
  //     });
  //     setMessages(response.data);
  //   }

  //   useEffect(() => {
  //     getAllMessages();
  //   }, [currentChat]);

  // third func - getting all messages from current user and current chat.
  useEffect(() => {
    let cancelRequest;

    async function getAllMessages() {
      const { token, cancel } = axios.CancelToken.source();
      cancelRequest = cancel;

      try {
        if (currentChat) {
          const response = await axios.post(
            getAllMessagesRoute,
            {
              from: currentUser._id,
              to: currentChat._id,
            }
          );
          if (Array.isArray(response.data.projectMessages)) {
            setMessages(response.data.projectMessages);
          } else {
            console.log("Response is not an array:", response.data);
            console.log(response.data);
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.log(`error cancelling request! ${error.message}`);
        }
      }
    }

    getAllMessages();

    return () => {
      if (cancelRequest) {
        cancelRequest();
      }
    };
  }, [currentChat]);

  // handling send message
  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => {
          return (
            <div ref={scrollRef} key={index}>
              <div
                className={`message ${message.fromSelf ? "sent" : "received"}`}
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
        ;
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
};

export default ChatContainer;

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
   

  @media screen and (max-width: 719px) {
    height: 68vh;
    overflow: auto;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    @media screen and (max-width: 719px) {
        padding:0 1vw;
      }
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      @media screen and (max-width: 719px) {
        gap: 2vw;
      }
      .avatar {
        @media screen and (max-width: 719px) {
            height: 12vw;
          }
        img {
          height: 3rem;
          @media screen and (max-width: 719px) {
            height: 100%;
          }
        }
       
      }
      .username {
        color: white;
        @media screen and (max-width: 719px) {
            font-size: 4vw;
          }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    @media screen and (max-width: 719px) {
        padding: 2vw;
        width: 100%;
      }
    &::webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
            background-color: #ffffff39;
            width: 0.1rem;
            border-radius: 1rem;
        }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        over-word-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (max-width: 719px) {
            font-size: 4vw;
            padding: 3vw;
          }
      }
    }
    .sent {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
