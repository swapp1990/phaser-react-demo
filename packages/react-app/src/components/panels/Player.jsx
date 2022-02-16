import React, { useRef, useState, useEffect } from "react";
import {
  EventEnum,
  phaserEvents,
  reactEvents,
} from "../../events/EventsCenter";
import { Table } from "antd";
import { useAppSelector } from "../../hooks";
import "./player.scss";

export default function Player() {
  const [characters, setCharacters] = useState([]);
  const [spawnedOnce, setSpawnedOnce] = useState(false);
  const [initOnce, setInitOnce] = useState(false);
  const web3Contracts = useAppSelector((state) => state.web3.contracts);
  useEffect(() => {
    if (web3Contracts) {
      setOwnedCharacters();
      reactEvents.on(EventEnum.REFRESH_LB, handleRefreshLb, this);
      handleRefreshLb();
    }
  }, [web3Contracts]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (characters && characters.length > 0 && !initOnce) {
      phaserEvents.on(EventEnum.CHAR_DIED, handleCharDied, this);
      phaserEvents.on(EventEnum.GAME_INIT, handleGameInit, this);
      setInitOnce(true);
    }
  }, [characters]);

  async function setOwnedCharacters() {
    const charsMinted = await web3Contracts.Character.lastTokenId();
    // console.log({ charsMinted });
    const charsOwned = [];
    for (let tokenId = 0; tokenId <= charsMinted; tokenId++) {
      const character = await web3Contracts.Character.ownedCharacters(tokenId);
      let charObj = { name: character.name, active: false, alive: true };
      charsOwned.push(charObj);
    }
    setCharacters(charsOwned);
  }

  function onCharacterChange(c, i) {
    let newState = [...characters];
    if (!newState[i].alive) return;
    newState.forEach((item) => {
      item.active = false;
    });
    newState[i].active = true;
    setCharacters(newState);
    reactEvents.emit(EventEnum.PLAYER_UPDATED, c);
  }

  function handleCharDied(name) {
    let newState = [...characters];
    let idx = newState.findIndex((c) => c.name === name);
    // console.log(idx, name, newState);
    newState[idx].alive = false;
    // console.log(newState);
    setCharacters(newState);
    let newChar = newState.find((c) => c.alive === true);
    // console.log({ newChar });
    if (newChar) {
      if (!spawnedOnce) {
        reactEvents.emit(EventEnum.SPAWN_NEW_CHAR, newChar);
        setSpawnedOnce(true);
      }
    } else {
      reactEvents.emit(EventEnum.GAME_OVER);
      setSpawnedOnce(false);
    }
  }

  function handleGameInit() {
    let newState = [...characters];
    newState.forEach((item) => {
      item.active = false;
      item.alive = true;
    });
    newState[0].active = true;
    setCharacters(newState);
    if (!spawnedOnce) {
      console.log("game init");
      reactEvents.emit(EventEnum.SPAWN_NEW_CHAR, newState[0]);
      setSpawnedOnce(true);
    }
  }

  const playerWindow = (
    <div className="profile">
      <h1>Characters</h1>
      <div className="selection">
        {characters.map((g, i) => (
          <div
            className={`itemSelect ${g.active ? " itemSelected" : ""}`}
            key={i}
            onClick={() => onCharacterChange(g, i)}
          >
            <div className={g.active ? "active char" : "char"}>
              <div className="name">{g.name}</div>
              <div className="status">{g.alive ? "Alive" : "Dead"}</div>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="profileInfo">
        <div className="profileName">Adam</div>
      </div> */}
    </div>
  );

  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Coins Collected",
      dataIndex: "coins",
      key: "coins",
    },
    {
      title: "Aliens Killed",
      dataIndex: "killed",
      key: "killed",
    },
  ];

  async function handleRefreshLb() {
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
    dataSourceT = dataSourceT.sort((a, b) => {
      return b.coins - a.coins;
    });
    setDataSource(dataSourceT);
  }

  const leaderBoardWindow = (
    <div className="lbWrapper">
      <h1>Leaderboard</h1>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size="small"
      />
    </div>
  );

  return (
    <div className="sideWrapper">
      {playerWindow}
      {leaderBoardWindow}
    </div>
  );
}
