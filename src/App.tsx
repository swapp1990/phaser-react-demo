import styled from "styled-components";
import { useAppSelector } from "./hooks";
import Chat from "./components/Chat";

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
  // ui = <Chat />
  ui = <></>;
  if (computerDialogOpen) {
    console.log("computerDialogOpen");
    ui = <Chat />;
  }
  return <Backdrop>{ui}</Backdrop>;
}
export default App;
