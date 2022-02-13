import React, { useRef, useState, useEffect } from "react";
import { EventEnum, reactEvents } from "../../events/EventsCenter";
import { useAppSelector } from "../../hooks";

export default function Player() {
  const [characters, setCharacters] = useState([]);
  const web3Contracts = useAppSelector((state) => state.web3.contracts);
  useEffect(() => {
    if (web3Contracts) {
      setOwnedCharacters();
    }
  }, [web3Contracts]);

  async function setOwnedCharacters() {
    const charsMinted = await web3Contracts.Character.lastTokenId();
    console.log({ charsMinted });
    const charsOwned = [];
    for (let tokenId = 0; tokenId <= charsMinted; tokenId++) {
      const character = await web3Contracts.Character.ownedCharacters(tokenId);
      let charObj = { name: character.name, active: true };
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

  const playerWindow = (
    <div className="profile">
      <div>
        {characters.map((g, i) => (
          <div
            className={`itemSelect ${g.active ? " itemSelected" : ""}`}
            key={i}
            onClick={() => onCharacterChange(g, i)}
          >
            {g.name}
          </div>
        ))}
      </div>
      <div className="profileInfo">
        <div className="profileName">Adam</div>
      </div>
    </div>
  );

  return (
    <>
      <div>{playerWindow}</div>
    </>
  );
}
