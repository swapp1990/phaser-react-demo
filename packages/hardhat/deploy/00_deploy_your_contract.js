// deploy/00_deploy_your_contract.js

// const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Character", {
    from: deployer,
    //args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
  });

  const characterContract = await ethers.getContract("Character", deployer);
  const names = ["Jason", "Emily", "Max"];
  await characterContract.mintMultipleCharacters(names);
};
module.exports.tags = ["Character"];
