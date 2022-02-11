import styled from "styled-components";
import { useAppSelector } from "./hooks";
import Chat from "./components/Chat";
import GearSelection from "./components/GearSelection";
import NetworkDisplay from "./components/web3/NetworkDisplay";

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
    <div>
      <NetworkDisplay />
      <Backdrop>{ui}</Backdrop>
    </div>
  );
}
export default App;
