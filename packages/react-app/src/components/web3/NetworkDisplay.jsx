import React, { useRef, useState, useEffect, useCallback } from "react";
import Web3Modal from "web3modal";

import "./networkDisplay.scss";
import { getChainData } from "./helpers/utilities";
import Address from "./Address";
import { useUserSigner, useContractLoader } from "../../web3hooks";
import store from "../../stores";
import { setContracts } from "../../stores/Web3Store";

const { ethers } = require("ethers");

export default function NetworkDisplay() {
  const [injectedProvider, setInjectedProvider] = useState();
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

  useEffect(async () => {
    console.log("init");
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
      const _chainId = providerNetwork.chainId;
      setCurrChainId(_chainId);
    }
  }, [injectedProvider]);

  useEffect(() => {
    if (contracts) {
      store.dispatch(setContracts(contracts));
    }
  }, [contracts]);

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
          <div>You are on the wrong Network</div>
        )}
        {!isConnected && (
          <button onClick={onConnect}>Connect to Metamask</button>
        )}
      </div>
    </>
  );
}
