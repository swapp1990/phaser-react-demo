import React, { useRef, useState, useEffect } from "react";
import {
  EventEnum,
  phaserEvents,
  reactEvents,
} from "../../events/EventsCenter";
import { useAppSelector } from "../../hooks";
import "./mint.scss";
import Spritesheet from "react-responsive-spritesheet";

export default function MintCharacter() {
  const [spriteSheet, setSpriteSheet] = useState();
  const [characters, setCharacters] = useState([]);
  const availableCharacters = [
    {
      name: "Jason",
      startFrame: 1,
    },
    {
      name: "Sarah",
      startFrame: 4,
    },
    {
      name: "Max",
      startFrame: 7,
    },
    {
      name: "Layla",
      startFrame: 10,
    },
    {
      name: "Dwayne",
      startFrame: 49,
    },
    {
      name: "Brand",
      startFrame: 55,
    },
  ];
  const [currCharIdx, setCurrCharIdx] = useState(0);
  const [selectedChars, setSelectedChars] = useState([]);
  const metamaskConnected = useAppSelector((state) => state.web3.connected);
  const web3Contracts = useAppSelector((state) => state.web3.contracts);
  const transactor = useAppSelector((state) => state.web3.transactor);

  useEffect(() => {
    if (web3Contracts) {
      setOwnedCharacters();
    }
  }, [web3Contracts]);

  useEffect(() => {
    if (characters) {
      //   console.log({ characters });
    }
  }, [characters]);

  async function setOwnedCharacters() {
    const charsMinted = await web3Contracts.Character.lastTokenId();
    // console.log({ charsMinted: charsMinted.toNumber() + 1 });
    const charsOwned = [];
    for (let tokenId = 1; tokenId <= charsMinted; tokenId++) {
      const character = await web3Contracts.Character.ownedCharacters(tokenId);
      let charObj = { name: character.name };
      charsOwned.push(charObj);
    }
    setCharacters(charsOwned);
  }

  async function onConnect() {
    reactEvents.emit(EventEnum.CONNECT_WEB3, {});
  }

  function onSelectChar() {
    // console.log("onSelectChar");
    let prevChars = [...selectedChars];
    prevChars.push(currCharIdx);
    setSelectedChars(prevChars);
  }

  function onUnSelectChar() {
    let prevChars = [...selectedChars];
    prevChars = prevChars.filter((item) => item !== currCharIdx);
    setSelectedChars(prevChars);
  }

  function onNextChar() {
    // console.log(currCharIdx, availableCharacters.length);
    if (currCharIdx < availableCharacters.length - 1) {
      setCurrCharIdx(currCharIdx + 1);
      spriteSheet.setStartAt(availableCharacters[currCharIdx + 1].startFrame);
      spriteSheet.setEndAt(availableCharacters[currCharIdx + 1].startFrame + 2);
    }
  }

  function onPlay() {
    console.log("onPlay");
    reactEvents.emit(EventEnum.PLAYER_MINTED);
    phaserEvents.emit(EventEnum.GAME_INIT);
  }

  const onMint = async () => {
    if (characters.length > 0) return;
    let selectedCharArr = selectedChars.map(
      (ci) => availableCharacters[ci].name
    );
    console.log(selectedCharArr);
    const result = await transactor(
      web3Contracts.Character.mintMultipleCharacters(selectedCharArr),
      (update) => {
        if (update) {
          if (update.status === "confirmed" || update.status === 1) {
            console.log("Minted");
          }
          if (update.events) {
            console.log({ event: update.events.length });
            setOwnedCharacters();
          }
        } else {
        }
      }
    );
  };

  function isSelected() {
    return selectedChars.includes(currCharIdx);
  }

  const mintedViewer = (
    <div>
      <h1>Minted</h1>
      <div className="charsList">
        <div className="mainCharBox">
          <h3>{availableCharacters[currCharIdx].name}</h3>

          <div className="sprite">
            <Spritesheet
              image={`assets/rpggame/characters.png`}
              widthFrame={26}
              heightFrame={36}
              steps={96}
              fps={5}
              loop={true}
              startAt={1}
              endAt={3}
              getInstance={(spritesheet) => {
                setSpriteSheet(spritesheet);
              }}
            />
          </div>
          <div className="btmMenu">
            <button onClick={onNextChar}>Next</button>
          </div>
          <div className="btmMenu">
            <button onClick={onPlay}>Play Game</button>
          </div>
        </div>
        <div className="gearsList"></div>
      </div>
    </div>
  );
  const characterSelection = (
    <div>
      <h2>Mint Characters</h2>
      <h3>
        Selected Characters (Max 3):
        {selectedChars.map((ci, i) => (
          <span key={i}>{availableCharacters[ci].name}, </span>
        ))}
      </h3>
      <div className="charsList">
        <div className="mainCharBox">
          <h3>{availableCharacters[currCharIdx].name}</h3>

          <div className="sprite">
            <button disabled={currCharIdx <= 0}>Prev</button>
            <Spritesheet
              image={`assets/rpggame/characters.png`}
              widthFrame={26}
              heightFrame={36}
              steps={96}
              fps={5}
              loop={true}
              startAt={1}
              endAt={3}
              getInstance={(spritesheet) => {
                setSpriteSheet(spritesheet);
              }}
            />
            <button
              disabled={currCharIdx >= availableCharacters.length - 1}
              onClick={onNextChar}
            >
              Next
            </button>
          </div>
          <div className="btmMenu">
            {!isSelected() && <button onClick={onSelectChar}>Select</button>}
            {isSelected() && <button onClick={onUnSelectChar}>UnSelect</button>}

            <button disabled={selectedChars.length === 0} onClick={onMint}>
              Mint
            </button>
          </div>
        </div>
        <div className="gearsList"></div>
      </div>
    </div>
  );
  const popupWindow = (
    <div className="popupWindow">
      {!metamaskConnected && (
        <button onClick={onConnect}>Connect to Metamask</button>
      )}
      {metamaskConnected && characters.length == 0 && characterSelection}
      {metamaskConnected && characters.length > 0 && mintedViewer}
    </div>
  );
  return <div className="backdrop">{popupWindow}</div>;
}
