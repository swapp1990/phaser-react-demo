import styled from "styled-components";
import { Space } from "antd";
import { useAppSelector } from "./hooks";
import Chat from "./components/Chat";
import GearSelection from "./components/GearSelection";
import NetworkDisplay from "./components/web3/NetworkDisplay";
import "./games/PhaserNavMeshGame";

import "./app.scss";
import Player from "./components/panels/Player";

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

function App() {
  const computerDialogOpen = useAppSelector(
    (state) => state.computer.computerDialogOpen
  );
  let ui: JSX.Element;
  ui = <GearSelection />;
  if (computerDialogOpen) {
    console.log("computerDialogOpen");
    ui = <Chat />;
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
        <div className="header">
          <div>Spaceborn</div>
          <NetworkDisplay />
        </div>
        <div className="content">
          <div className="phaser-wrapper" id="game-container"></div>
        </div>
      </div>
    </div>
  );
}
export default App;
