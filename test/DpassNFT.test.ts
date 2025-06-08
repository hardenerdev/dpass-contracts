'use strict'

const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe('DappHomes', function () {
    async function deployDpassNFTFixture() {
        const [owner, otherAccount] = await ethers.getSigners()

        const DpassNFT = await ethers.getContractFactory('DpassNFT')
        const dpassNFT = await DpassNFT.deploy(owner)

        return { dpassNFT, owner, otherAccount }
    }

    describe('deployment', function () {
        it('should set the right owner', async function () {
            const { dpassNFT, owner } = await loadFixture(
                deployDpassNFTFixture
            )

            expect(await dpassNFT.owner()).to.equal(owner.address)
        })

        it('should be initially unpaused', async function () {
            const { dpassNFT, owner } = await loadFixture(
                deployDpassNFTFixture
            )

            expect(await dpassNFT.paused()).to.equal(false)
        })
    })

    describe('pausable', function () {
        it('should be paused by owner', async function () {
            const { dpassNFT, owner, otherAccount } = await loadFixture(
                deployDpassNFTFixture
            )

            await dpassNFT.pause()

            expect(await dpassNFT.paused()).to.equal(true)
        })

        it('should be paused only by owner', async function () {
            const { dpassNFT, owner, otherAccount } = await loadFixture(
                deployDpassNFTFixture
            )

            await expect(dpassNFT.connect(otherAccount).pause())
                .to.be.revertedWithCustomError(dpassNFT, 'OwnableUnauthorizedAccount')
                .withArgs(otherAccount.address)
        })

        it('should be unpaused by owner', async function () {
            const { dpassNFT, owner, otherAccount } = await loadFixture(
                deployDpassNFTFixture
            )

            await dpassNFT.pause()
            await dpassNFT.unpause()

            expect(await dpassNFT.paused()).to.equal(false)
        })

        it('should be unpaused only by owner', async function () {
            const { dpassNFT, owner, otherAccount } = await loadFixture(
                deployDpassNFTFixture
            )

            await expect(dpassNFT.connect(otherAccount).unpause())
                .to.be.revertedWithCustomError(dpassNFT, 'OwnableUnauthorizedAccount')
                .withArgs(otherAccount.address)
        })

        it('should fail when re-pause', async function () {
            const { dpassNFT, owner, otherAccount } = await loadFixture(
                deployDpassNFTFixture
            )

            await dpassNFT.pause()

            await expect(dpassNFT.pause())
                .to.be.revertedWithCustomError(dpassNFT, 'EnforcedPause')
        })

        it('should fail when re-unpaused', async function () {
            const { dpassNFT, owner, otherAccount } = await loadFixture(
                deployDpassNFTFixture
            )

            await expect(dpassNFT.unpause())
                .to.be.revertedWithCustomError(dpassNFT, 'ExpectedPause')
        })

        it('safe mint should fail when paused', async function () {
            const { dpassNFT, owner, otherAccount } = await loadFixture(
                deployDpassNFTFixture
            )

            await dpassNFT.pause()

            await expect(dpassNFT.safeMint(otherAccount))
                .to.be.revertedWithCustomError(dpassNFT, 'EnforcedPause')
        })
    })
})
