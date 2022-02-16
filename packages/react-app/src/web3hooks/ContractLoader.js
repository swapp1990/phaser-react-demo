import { useEffect, useState } from "react";

const { ethers } = require("ethers");

export default function useContractLoader(providerOrSigner, config = {}) {
  const [contracts, setContracts] = useState();
  useEffect(() => {
    // console.log(providerOrSigner);
    let active = true;
    async function loadContracts() {
      if (providerOrSigner && typeof providerOrSigner !== "undefined") {
        console.log(`loading contracts`);
        try {
          let provider;
          let signer;
          let accounts;

          if (
            providerOrSigner &&
            typeof providerOrSigner.listAccounts === "function"
          ) {
            accounts = await providerOrSigner.listAccounts();
          }

          if (ethers.Signer.isSigner(providerOrSigner)) {
            signer = providerOrSigner;
            provider = signer.provider;
          } else if (accounts && accounts.length > 0) {
            signer = providerOrSigner.getSigner();
            provider = providerOrSigner;
          } else {
            signer = providerOrSigner;
            provider = providerOrSigner;
          }

          const providerNetwork = await provider.getNetwork();
          const _chainId = config.chainId || providerNetwork.chainId;
          let contractList = {};
          try {
            contractList =
              config.hardhatContracts || require("./hardhat_contracts.json");
            console.log(_chainId);
          } catch (e) {
            console.log(e);
          }
          let combinedContracts = {};
          if (contractList[_chainId]) {
            for (const hardhatNetwork in contractList[_chainId]) {
              if (
                Object.prototype.hasOwnProperty.call(
                  contractList[_chainId],
                  hardhatNetwork
                )
              ) {
                if (
                  !config.hardhatNetworkName ||
                  hardhatNetwork === config.hardhatNetworkName
                ) {
                  combinedContracts = {
                    ...combinedContracts,
                    ...contractList[_chainId][hardhatNetwork].contracts,
                  };
                }
              }
            }
          }
          combinedContracts = { ...combinedContracts };
          const newContracts = Object.keys(combinedContracts).reduce(
            (accumulator, contractName) => {
              const _address =
                config.customAddresses &&
                Object.keys(config.customAddresses).includes(contractName)
                  ? config.customAddresses[contractName]
                  : combinedContracts[contractName].address;
              accumulator[contractName] = new ethers.Contract(
                _address,
                combinedContracts[contractName].abi,
                signer
              );
              return accumulator;
            },
            {}
          );
          if (active) setContracts(newContracts);
        } catch (e) {
          console.log("ERROR LOADING CONTRACTS!!", e);
        }
      }
    }
    loadContracts();
    return () => {
      active = false;
    };
  }, [providerOrSigner]);
  return contracts;
}
