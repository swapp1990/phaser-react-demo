import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

import phaserGame from "../PhaserGame";
import Game from "../phaser/scenes/Game";

// import { getColorByString } from '../util'
// import { useAppDispatch, useAppSelector } from '../hooks'
// import { MessageType, setFocused, setShowChat } from '../stores/ChatStore'

const Backdrop = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 400px;
  width: 500px;
  max-height: 50%;
  max-width: 50%;
`;

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const FabWrapper = styled.div`
  margin-top: auto;
`;

const ChatHeader = styled.div`
  position: relative;
  height: 35px;
  background: #000000a7;
  border-radius: 10px 10px 0px 0px;

  h3 {
    color: #fff;
    margin: 7px;
    font-size: 17px;
    text-align: center;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

const ChatBox = styled(Box)`
  height: 100%;
  width: 100%;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0px 2px;

  p {
    margin: 3px;
    text-shadow: 0.3px 0.3px black;
    font-size: 15px;
    font-weight: bold;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  span {
    color: white;
    font-weight: normal;
  }

  .notification {
    color: grey;
    font-weight: normal;
  }

  :hover {
    background: #3a3a3a;
  }
`;

const InputWrapper = styled.form`
  box-shadow: 10px 10px 10px #00000018;
  border: 1px solid #42eacb;
  border-radius: 0px 0px 10px 10px;
  display: flex;
  flex-direction: row;
  background: linear-gradient(180deg, #000000c1, #242424c0);
`;

const InputTextField = styled(InputBase)`
  border-radius: 0px 0px 10px 10px;
  input {
    padding: 5px;
  }
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 54px;
  right: 16px;
`;

const dateFormatter = new Intl.DateTimeFormat("en", {
  timeStyle: "short",
  dateStyle: "short",
});

const Message = ({ chatMessage, messageType }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <MessageWrapper
      onMouseEnter={() => {
        setTooltipOpen(true);
      }}
      onMouseLeave={() => {
        setTooltipOpen(false);
      }}
    ></MessageWrapper>
  );
};

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  // const focused = useAppSelector((state) => state.chat.focused)
  // const showChat = useAppSelector((state) => state.chat.showChat)
  // const dispatch = useAppDispatch()
  const game = phaserGame.scene.keys.game as Game;

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // if (event.key === 'Escape') {
    //   // move focus back to the game
    //   inputRef.current?.blur()
    //   dispatch(setShowChat(false))
    // }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // event.preventDefault()
    // // move focus back to the game
    // inputRef.current?.blur()
    // const val = inputValue.trim()
    // setInputValue('')
    // if (val) {
    //   game.network.addChatMessage(val)
    //   game.myPlayer.updateDialogBubble(val)
    // }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //   if (focused) {
  //     inputRef.current?.focus()
  //   }
  // }, [focused])

  // useEffect(() => {
  //   scrollToBottom()
  // }, [chatMessages, showChat])

  return (
    <Backdrop>
      <Wrapper>
        <>
          <ChatHeader>
            <h3>Chat</h3>
            <IconButton
              aria-label="close dialog"
              className="close"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </ChatHeader>
          <ChatBox>
            <div ref={messagesEndRef} />
            {showEmojiPicker && (
              <EmojiPickerWrapper>
                <Picker
                  theme="dark"
                  showSkinTones={false}
                  showPreview={false}
                  exclude={["recent", "flags"]}
                />
              </EmojiPickerWrapper>
            )}
          </ChatBox>
          <InputWrapper onSubmit={handleSubmit}>
            <InputTextField
              inputRef={inputRef}
              fullWidth
              placeholder="Press Enter to chat"
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
            />
            <IconButton
              aria-label="emoji"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <InsertEmoticonIcon />
            </IconButton>
          </InputWrapper>
        </>
      </Wrapper>
    </Backdrop>
  );
}
