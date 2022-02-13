import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";

import phaserGame from "../games/PhaserGame";
import Bootstrap from "../phaser/scenes/Bootstrap";

const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`;

const Wrapper = styled.div`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 120px;
  }
`;

export default function RoomSelectionDialog() {
  const handleConnect = () => {
    console.log("handleConnect");
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
    bootstrap.launchGame();
  };

  return (
    <Backdrop>
      <Wrapper>
        <Title>Welcome to Spaceborn</Title>
        <Content>
          <Button variant="contained" color="secondary" onClick={handleConnect}>
            Connect to public lobby
          </Button>
        </Content>
      </Wrapper>
    </Backdrop>
  );
}
