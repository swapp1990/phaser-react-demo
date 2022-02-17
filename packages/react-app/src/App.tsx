import styled from "styled-components";
import { Space } from "antd";
import { useAppSelector } from "./hooks";
import Chat from "./components/Chat";
import GearSelection from "./components/GearSelection";
import NetworkDisplay from "./components/web3/NetworkDisplay";
import "./games/PhaserNavMeshGame";

import "./app.scss";
import Player from "./components/panels/Player";
import GameTitle from "./components/panels/GameTitle";
import MintCharacter from "./components/panels/MintCharacter";
import { EventEnum, reactEvents } from "./events/EventsCenter";
import { useEffect, useState } from "react";
import AddLeaderboard from "./components/panels/AddLeaderboard";

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

export default function App() {
  const [playerMinted, setPlayerMinted] = useState(false);
  const [gameOver, setGameover] = useState(false);

  useEffect(() => {
    reactEvents.on(EventEnum.PLAYER_MINTED, handlePlayerMinted);
    reactEvents.on(EventEnum.GAME_OVER, handleGameOver);
  }, []);

  function handlePlayerMinted() {
    console.log("handlePlayerMinted");
    setPlayerMinted(true);
  }

  function handleGameOver() {
    console.log("handleGameOver");
    setGameover(true);
  }

  function handleCloseEvent() {
    console.log("parent: handleCloseEvent");
    setGameover(false);
  }

  function goHome() {
    window.location.replace("http://spaceborn.gg/");
  }

  return (
    <div className="body">
      <div className="side">
        <div className="player">
          <Player />
        </div>
        <div className="items"></div>
      </div>
      <div className="game">
        {!playerMinted && <MintCharacter />}
        {gameOver && (
          <AddLeaderboard
            handleCloseEvent={() => {
              handleCloseEvent();
            }}
          />
        )}
        <div className="header">
          <div className="title" onClick={goHome}>
            Spaceborn
          </div>
          <NetworkDisplay />
        </div>
        <div className="content">
          <div className="title">
            <GameTitle />
          </div>

          <div className="phaser-wrapper" id="game-container"></div>
        </div>
      </div>
    </div>
  );
}
