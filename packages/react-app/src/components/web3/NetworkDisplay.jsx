import React, { useRef, useState, useEffect, useCallback } from "react";
import Web3Modal from "web3modal";

import "./networkDisplay.scss";
import { getChainData } from "./helpers/utilities";
import Address from "./Address";
import { useUserSigner, useContractLoader, useGasPrice } from "../../web3hooks";
import store from "../../stores";
import {
  setContracts,
  setConnected,
  setTransactor,
} from "../../stores/Web3Store";
import { EventEnum, reactEvents } from "../../events/EventsCenter";
import { NETWORKS } from "./helpers/constants";
import Transactor from "./helpers/Transactor";

const { ethers } = require("ethers");

export default function NetworkDisplay() {
  const [injectedProvider, setInjectedProvider] = useState();
  const [targetNetwork, setTargetNetwork] = useState();
  const [localProvider, setLocalProvider] = useState();
  const [currChainId, setCurrChainId] = useState(-1);
  const [address, setAddress] = useState();
  const [isConnected, setIsConnected] = useState(false);

  const selectedChainId = 4; //rinkeby

  const getNetwork = () => getChainData(selectedChainId).network;
  const web3Modal = new Web3Modal({
    cacheProvider: true,
    network: getNetwork(),
  });

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet using localProvider.
  const userSigner = useUserSigner(injectedProvider, localProvider);
  const contracts = useContractLoader(injectedProvider);
  //   const gasPrice = useGasPrice(targetNetwork, "fast");
  const tx = Transactor(userSigner);

  useEffect(async () => {
    console.log("init");
    reactEvents.on(EventEnum.CONNECT_WEB3, handleConnect, this);
    reactEvents.on(EventEnum.MINT_CHARS, handleMint, this);

    return () => {};
  }, []);

  useEffect(async () => {
    if (userSigner) {
      const newAddress = await userSigner.getAddress();
      setAddress(newAddress);
    }
  }, [userSigner]);

  useEffect(async () => {
    if (injectedProvider) {
      const providerNetwork = await injectedProvider.getNetwork();
      console.log(providerNetwork.name);
      const _chainId = providerNetwork.chainId;
      setCurrChainId(_chainId);
      if (providerNetwork.chainId == selectedChainId) {
        setTargetNetwork(NETWORKS[providerNetwork.name]);
      }
    }
  }, [injectedProvider]);

  useEffect(() => {
    if (contracts) {
      store.dispatch(setContracts(contracts));
    }
  }, [contracts]);

  useEffect(() => {
    if (tx) {
      //   console.log("setting transactor");
      store.dispatch(setTransactor(tx));
    }
  }, [tx]);

  function handleConnect() {
    onConnect();
  }
  const handleMint = () => {
    // onMint();
  };

  //   const loadWeb3Modal = useCallback(async () => {
  //     const provider = await web3Modal.connect();
  //     provider.on("close", () => {
  //       console.log("close");
  //     });
  //     provider.on("disconnect", (code, reason) => {
  //       console.log(code, reason);
  //     });
  //     setInjectedProvider(new ethers.providers.Web3Provider(provider));
  //   }, [setInjectedProvider]);

  async function onConnect() {
    try {
      const provider = await web3Modal.connect();
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
      setIsConnected(true);
      store.dispatch(setConnected(true));
    } catch (e) {
      console.log("Could not get a wallet connection", e);
      setIsConnected(false);
      return;
    }
  }

  return (
    <>
      <div className="displayPanel">
        {address && <Address address={address}></Address>}
        {isConnected && selectedChainId !== currChainId && (
          <div style={{ backgroundColor: "red" }}>
            Wrong Network! Switch to Rinkeby & refresh page
          </div>
        )}
        {/* {!isConnected && (
          <button onClick={onConnect}>Connect to Metamask</button>
        )} */}
      </div>
    </>
  );
}
