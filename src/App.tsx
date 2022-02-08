import styled from "styled-components";

import Chat from "./components/Chat";

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

function App() {
  let ui: JSX.Element;
  // ui = <Chat />
  ui = <></>;
  return <Backdrop>{ui}</Backdrop>;
}
export default App;
