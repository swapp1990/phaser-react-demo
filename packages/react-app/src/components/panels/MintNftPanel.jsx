import React, { useRef, useState, useEffect } from "react";
import {
  EventEnum,
  phaserEvents,
  reactEvents,
} from "../../events/EventsCenter";
import { useAppSelector } from "../../hooks";
import store from "../../stores";
import { resetState } from "../../stores/PickupStore";
import "./lb.scss";

export default function MintNftPanel(props) {
  const web3Contracts = useAppSelector((state) => state.web3.contracts);
  const metamaskConnected = useAppSelector((state) => state.web3.connected);
  const transactor = useAppSelector((state) => state.web3.transactor);
  const coinsCollected = useAppSelector((state) => state.pickup.coinsCollected);

  const [lbEntryName, setLbEntryName] = useState("");
  const [canAdd, setCanAdd] = useState(false);
  const [minting, setMinting] = useState(false);
  const [added, setAdded] = useState(false);
  const [currEntries, setCurrEntries] = useState([]);

  useEffect(() => {
    if (web3Contracts) {
    }
  }, [web3Contracts]);

  useEffect(() => {
    console.log("Init mintNft");
    init();
  }, []);

  async function init() {}

  async function onConnect() {
    reactEvents.emit(EventEnum.CONNECT_WEB3, {});
  }

  const onClose = () => {
    props.handleCloseEvent();
  };

  const onMint = async () => {
    setMinting(true);
    await transactor(web3Contracts.Gears.mintRandomNft(), (update) => {
      if (update) {
        if (update.status === "confirmed" || update.status === 1) {
          console.log("Minted");
        }
        if (update.events) {
          console.log({ event: update.events.length });
          reactEvents.emit(EventEnum.REFRESH_GEARS);
          setMinting(false);
        }
        if (update.code) {
          setMinting(false);
        }
      } else {
        setMinting(false);
      }
    });
  };

  const mintNftDialog = (
    <div className="dialogWrapper">
      <h1>Mint NFT</h1>
      <button onClick={onMint}>MINT</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
  const popupWindow = (
    <div className="popupWindow">
      {!metamaskConnected && (
        <button onClick={onConnect}>Connect to Metamask</button>
      )}
      {metamaskConnected && mintNftDialog}
    </div>
  );
  return <div className="backdrop">{popupWindow}</div>;
}
