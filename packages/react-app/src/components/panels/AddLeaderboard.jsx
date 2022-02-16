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

export default function AddLeaderboard(props) {
  const web3Contracts = useAppSelector((state) => state.web3.contracts);
  const metamaskConnected = useAppSelector((state) => state.web3.connected);
  const transactor = useAppSelector((state) => state.web3.transactor);
  const coinsCollected = useAppSelector((state) => state.pickup.coinsCollected);
  const aliensKilled = useAppSelector((state) => state.pickup.aliensKilled);

  useEffect(() => {
    if (web3Contracts) {
    }
  }, [web3Contracts]);

  async function onConnect() {
    reactEvents.emit(EventEnum.CONNECT_WEB3, {});
  }

  async function getCurrentEntries() {
    const lbEntriesCount = await web3Contracts.Character.getLbEntriesCount();
    console.log({ lbEntriesCount: lbEntriesCount.toNumber() });
    let dataSourceT = [];
    for (let i = 0; i < lbEntriesCount; i++) {
      const lbEntry = await web3Contracts.Character.lbEntries(i);
      dataSourceT.push({
        key: i,
        name: lbEntry.name,
        coins: lbEntry.coins.toNumber(),
        killed: lbEntry.killed.toNumber(),
      });
    }
    return dataSourceT;
  }

  const [lbEntryName, setLbEntryName] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const addToLb = async () => {
    console.log("addToLb");
    let currEntries = await getCurrentEntries();

    const lbEntry = {
      name: lbEntryName,
      coins: coinsCollected,
      killed: aliensKilled,
    };
    currEntries.push(lbEntry);
    // const lbEntries = [lbEntry];
    setAdding(true);
    await transactor(
      web3Contracts.Character.addLbEntry(currEntries),
      (update) => {
        if (update) {
          if (update.status === "confirmed" || update.status === 1) {
            console.log("Added");
          }
          if (update.events) {
            console.log({ event: update.events.length });
            reactEvents.emit(EventEnum.REFRESH_LB);
            setAdding(false);
            setLbEntryName("");
            setAdded(true);
          }
          if (update.code) {
            setAdding(false);
            setLbEntryName("");
          }
        } else {
          setAdding(false);
          setLbEntryName("");
        }
      }
    );
  };

  const onClose = () => {
    store.dispatch(resetState({}));
    props.handleCloseEvent();
  };

  const addLbDialog = (
    <div className="dialogWrapper">
      <h1>Game Over!</h1>
      <h2>Congratulations!</h2>
      <h4>Aliens Killed: {aliensKilled}</h4>
      <h4>Coins Collected: {coinsCollected}</h4>
      <h4>
        You are #1 on the leaderboard. Complete the transaction to record it on
        chain.
      </h4>
      {!added && (
        <div className="addLb">
          <input
            placeholder="name ..."
            type="text"
            value={lbEntryName}
            onChange={(e) => setLbEntryName(e.target.value)}
          ></input>
          <button disabled={lbEntryName === "" || adding} onClick={addToLb}>
            <span>{adding ? "Adding ..." : "Add"}</span>
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      )}
      {added && <button onClick={onClose}>Close</button>}
    </div>
  );
  const popupWindow = (
    <div className="popupWindow">
      {!metamaskConnected && (
        <button onClick={onConnect}>Connect to Metamask</button>
      )}
      {metamaskConnected && addLbDialog}
    </div>
  );
  return <div className="backdrop">{popupWindow}</div>;
}
