import { IChainData } from "./types";
import supportedChains from "./chains";

export function getChainData(chainId: number): IChainData {
  const chainData = supportedChains.filter(
    (chain: any) => chain.chain_id === chainId
  )[0];
  //   console.log(chainData);
  return chainData;
}
