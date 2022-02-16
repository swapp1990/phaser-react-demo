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

  const [lbEntryName, setLbEntryName] = useState("");
  const [canAdd, setCanAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [currEntries, setCurrEntries] = useState([]);

  useEffect(() => {
    if (web3Contracts) {
    }
  }, [web3Contracts]);

  useEffect(() => {
    console.log("Init addleaderboard");
    init();
  }, []);

  async function init() {
    let currEntries = await getCurrentEntries();
    currEntries = currEntries.sort((a, b) => {
      return b.coins - a.coins;
    });
    console.log(currEntries);
    let canAdd = true;
    if (currEntries.length >= 5) {
      let lastPosCoins = currEntries[currEntries.length - 1].coins;
      console.log({ lastPosCoins });
      if (coinsCollected <= lastPosCoins) {
        canAdd = false;
        console.log("cannot add");
      }
    }
    setCanAdd(canAdd);
    setCurrEntries(currEntries);
  }

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

  const addToLb = async () => {
    console.log("addToLb");
    if (!canAdd) return;
    const lbEntry = {
      name: lbEntryName,
      coins: coinsCollected,
      killed: aliensKilled,
    };
    let entries = [...currEntries];
    entries.push(lbEntry);
    entries = entries.sort((a, b) => {
      return b.coins - a.coins;
    });
    entries = entries.slice(0, 5);
    // const lbEntries = [lbEntry];
    setAdding(true);
    await transactor(web3Contracts.Character.addLbEntry(entries), (update) => {
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
    });
  };

  const onClose = () => {
    store.dispatch(resetState({}));
    props.handleCloseEvent();
  };

  const addLbDialog = (
    <div className="dialogWrapper">
      <h1>Game Over!</h1>
      <h4>Aliens Killed: {aliensKilled}</h4>
      <h4>Coins Collected: {coinsCollected}</h4>
      {canAdd && (
        <>
          <h2>Congratulations!</h2>
          <h4>
            You are on the leaderboard. Complete the transaction to record it on
            chain.
          </h4>
        </>
      )}
      {!canAdd && (
        <>
          <h4>Better Luck next time</h4>
          <button onClick={onClose}>Close</button>
        </>
      )}
      {canAdd && !added && (
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
      {canAdd && added && <button onClick={onClose}>Close</button>}
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
