import React, { useRef, useState, useEffect } from "react";
import {
  EventEnum,
  phaserEvents,
  reactEvents,
} from "../../events/EventsCenter";
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

  return (
    <>
      <div>{playerWindow}</div>
    </>
  );
}
