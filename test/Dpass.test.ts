'use strict'

const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe('Dpass', function () {
    async function deployDpassFixture() {
        const [owner, otherAccount] = await ethers.getSigners()

        const Dpass = await ethers.getContractFactory('Dpass')
        const dpass = await Dpass.deploy(owner, 10)

        return { dpass, owner, otherAccount }
    }

    describe('deployment', function () {
        it('should set the right owner', async function () {
            const { dpass, owner } = await loadFixture(
                deployDpassFixture
            )

            expect(await dpass.owner()).to.equal(owner.address)
        })

        it('should be initially unpaused', async function () {
            const { dpass, owner } = await loadFixture(
                deployDpassFixture
            )

            expect(await dpass.paused()).to.equal(false)
        })
    })

    describe('pausable', function () {
        it('should be paused by owner', async function () {
            const { dpass, owner, otherAccount } = await loadFixture(
                deployDpassFixture
            )

            await dpass.pause()

            expect(await dpass.paused()).to.equal(true)
        })

        it('should be paused only by owner', async function () {
            const { dpass, owner, otherAccount } = await loadFixture(
                deployDpassFixture
            )

            await expect(dpass.connect(otherAccount).pause())
                .to.be.revertedWithCustomError(dpass, 'OwnableUnauthorizedAccount')
                .withArgs(otherAccount.address)
        })

        it('should be unpaused by owner', async function () {
            const { dpass, owner, otherAccount } = await loadFixture(
                deployDpassFixture
            )

            await dpass.pause()
            await dpass.unpause()

            expect(await dpass.paused()).to.equal(false)
        })

        it('should be unpaused only by owner', async function () {
            const { dpass, owner, otherAccount } = await loadFixture(
                deployDpassFixture
            )

            await expect(dpass.connect(otherAccount).unpause())
                .to.be.revertedWithCustomError(dpass, 'OwnableUnauthorizedAccount')
                .withArgs(otherAccount.address)
        })

        it('should fail when re-pause', async function () {
            const { dpass, owner, otherAccount } = await loadFixture(
                deployDpassFixture
            )

            await dpass.pause()

            await expect(dpass.pause())
                .to.be.revertedWithCustomError(dpass, 'EnforcedPause')
        })

        it('should fail when re-unpaused', async function () {
            const { dpass, owner, otherAccount } = await loadFixture(
                deployDpassFixture
            )

            await expect(dpass.unpause())
                .to.be.revertedWithCustomError(dpass, 'ExpectedPause')
        })
    })
})
