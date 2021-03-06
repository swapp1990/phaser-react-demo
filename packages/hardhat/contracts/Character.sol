pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

pragma experimental ABIEncoderV2;

contract Character is ERC721, Ownable  {
	using SafeMath for uint256;
  	uint256 private _tokenIds;
	uint public lastTokenId;

	struct Character {
		uint256 tokenId;
		string name;
		bool exists;
	}

	mapping (uint256 => Character) public ownedCharacters;

	struct LB_entry {
		string name;
		uint256 coins;
		uint256 killed;
	}
	LB_entry[] public lbEntries;

	event CharacterMinted(
        uint256 tokenId
    );
	event LbAdded();
	constructor() public ERC721("Character", "CHR") {

  	}

	function mintMultipleCharacters(string[] memory names) public {
		for(uint i=0; i<names.length; i++) {
			uint256 id = _tokenIds;
     		_mint(msg.sender, id);
			lastTokenId = id;
			Character storage chr = ownedCharacters[id];
			chr.tokenId = id;
			chr.name = names[i];
			chr.exists = true;
			_tokenIds = _tokenIds+1;
		}
		emit CharacterMinted(lastTokenId);
	}

	function addLbEntry(LB_entry[] memory entries) public {
		delete lbEntries;
		for(uint i=0; i<entries.length; i++) {
			LB_entry memory entry = entries[i];
			lbEntries.push(entry);
		}
		emit LbAdded();
	}

	function getLbEntriesCount() public view returns (uint256) {
		return lbEntries.length;
	}

	function getCharacterName(uint256 tokenId) public view returns (string memory) {
		return ownedCharacters[tokenId].name;
	}

	function tokenURI(uint256 id) public view override returns (string memory) {
		require(_exists(id), "not exist");
		return "";
	}
}