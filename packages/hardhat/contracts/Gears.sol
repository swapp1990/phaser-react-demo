pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

pragma experimental ABIEncoderV2;

contract Gears is ERC721Enumerable, Ownable {
    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function getRandom(uint256 tokenId) public view returns (uint256) {
        uint256 rand = random(
            string(
                abi.encodePacked(
                    blockhash(block.number - 1),
                    msg.sender,
                    address(this),
                    toString(tokenId)
                )
            )
        );
        return rand % 100;
    }

    using SafeMath for uint256;
    uint256 private _tokenIds;
    uint256 public lastTokenId;

    struct Gear {
        uint256 tokenId;
        uint256 catIdx;
        bool exists;
    }

    string[] private categories = [
        "Weapon",
        "Apparel",
        "Vehicle",
        "Pill",
        "Gizmo"
    ];

    mapping(uint256 => Gear) public mintedGears;

    event GearMinted(uint256 tokenId);

    constructor() public ERC721("Gears", "GEAR") {}

    function mintRandomNft() external {
        uint256 id = _tokenIds;
        // require(id > 0 && id <= 10000, "Token ID invalid");
        _mint(msg.sender, id);

        lastTokenId = id;
        uint256 rand = getRandom(id);
        Gear storage gear = mintedGears[id];
        gear.tokenId = id;
        gear.catIdx = rand % categories.length;
        gear.exists = true;
        _tokenIds = _tokenIds + 1;
        emit GearMinted(lastTokenId);
    }

    function getGearCategory(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        return categories[mintedGears[tokenId].catIdx];
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        require(_exists(id), "not exist");
        return "";
    }
}
