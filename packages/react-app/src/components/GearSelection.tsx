import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import "./gears.scss";
import { EventEnum, reactEvents } from "../events/EventsCenter";
import { useAppSelector } from "../hooks";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 400px;
  width: 500px;
  max-height: 50%;
  max-width: 50%;
`;

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  position: relative;
  height: 35px;
  background: #000000a7;
  border-radius: 10px 10px 0px 0px;

  h3 {
    color: #fff;
    text-align: center;
  }
`;

const PanelContent = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #00000029;
`;

export default function GearSelection() {
  const [characters, setCharacters] = useState<any[]>([]);

  const web3Contracts = useAppSelector((state) => state.web3.contracts);

  useEffect(() => {
    init();
  }, []);

  function init() {}

  useEffect(() => {
    if (web3Contracts) {
      setOwnedCharacters();
    }
  }, [web3Contracts]);

  async function setOwnedCharacters() {
    const charsMinted = await web3Contracts.Character.lastTokenId();
    console.log({ charsMinted });
    const charsOwned: any[] = [];
    for (let tokenId = 0; tokenId <= charsMinted; tokenId++) {
      const character = await web3Contracts.Character.ownedCharacters(tokenId);
      let charObj = { name: character.name, active: true, alive: true };
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

  return (
    <Backdrop>
      <Wrapper>
        <PanelHeader>
          <h3>Player</h3>
        </PanelHeader>
        <PanelContent>
          <div>
            {characters.map((g, i) => (
              <div
                className={`itemSelect ${g.active ? " itemSelected" : ""}`}
                key={i}
                onClick={() => onCharacterChange(g, i)}
              >
                <div className="char">
                  <div>{g.name}</div>
                  <div>{g.alive ? "Alive" : "Dead"}</div>
                </div>
              </div>
            ))}
          </div>
        </PanelContent>
      </Wrapper>
    </Backdrop>
  );
}
