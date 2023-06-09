import React, { useState } from "react";
import styled from "styled-components";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import InputEmoji from "react-input-emoji";

const ChatInput = ({ handleSendMsg }) => {
  const [msg, setMsg] = useState("");

  const handleInputChange = (value) => {
    setMsg(value);
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    const form = event.target.closest("form");
    if (form) {
      const trimmedMsg = msg.trim();
      if (trimmedMsg) {
        handleSendMsg(trimmedMsg);
        setMsg("");
      }
    }
  };

  return (
    <Container>
      <form className="input-container">
        <InputEmoji
          value={msg}
          onChange={handleInputChange}
          cleanOnEnter
          placeholder="Enter your message"
          className = "input"
        />
        <button type="button" className="submit" onClick={handleButtonClick}>
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
};

export default ChatInput;

const Container = styled.div`
  background-color: #080420;
  padding: 0 2rem;
  padding-bottom: 0.3rem;
  @media screen and (max-width: 719px) {
    padding: 0;
  }
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-content: center;
    gap: 2rem;
    background-color: #ffffff34;  
    @media screen and (max-width: 719px) {
      gap: 0
    }
    .input {
      width: 90%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      border: 2px solid yellow;
      &::selection {
        background-color: 9186f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      @media screen and (max-width: 719px) {
        padding: 1vw;
      }
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 30px;
        color: white;
        transition: all 0.2s ease-in;
        @media screen and (max-width: 719px) {
          font-size: 8vw;
        }
      }
    }
  }
`;
