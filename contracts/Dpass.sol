// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {Pausable} from '@openzeppelin/contracts/utils/Pausable.sol';
import {DpassNFT} from './DpassNFT.sol';

contract Dpass is Ownable, Pausable {
    // NFT price set and update by owner
    uint256 public price;
    // NFT address
    DpassNFT public dpassNFT;

    // event: new token minted
    event TokenMinted(address indexed, uint256 indexed);
    // event: price updated
    event UpdatePrice(uint256);

    /**
     * constructor
     * @param initialOwner contract owner
     * @param initialPrice initial price
     */
    constructor(address initialOwner, uint256 initialPrice)
        Ownable(initialOwner)
    {
        require(
            initialPrice > 0,
            'Price should be > 0'
        );

        dpassNFT = new DpassNFT(initialOwner);
        price = initialPrice;
    }

    /**
     * get NFT when price is payed
     */
    function getDpassNFT() public payable whenNotPaused returns (uint256 token) {
        require(
            msg.value >= price,
            "Cannot buy NFT, not enouth funds."
        );

        uint256 tokenId = dpassNFT.safeMint(msg.sender);
        emit TokenMinted(msg.sender, tokenId);

        return tokenId;
    }

    /**
     * set new NFT price
     * @param newPrice updated NFT price
     */
    function updatePrice(uint256 newPrice) public onlyOwner whenNotPaused {
        require(
            price > 0,
            'Price should be > 0'
        );

        price = newPrice;
        emit UpdatePrice(price);
    }

    /**
     * pause by owner onlye when not paused
     */
    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    /**
     * unpause by owner onlye when paused
     */
    function unpause() public onlyOwner whenPaused {
        _unpause();
    }

    /**
     * get contract balance
     */
    function getBalance() public view returns (uint256 balance) {
        return address(this).balance;
    }

    /**
     * withdraw contract funds
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}
