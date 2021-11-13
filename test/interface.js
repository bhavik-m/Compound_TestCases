const { expect } = require('chai');
const { ethers } = require("hardhat");

describe('Compound-protocol', () => {

    beforeEach(async function () {
        [user, _] = await ethers.getSigners();

        const cTokenArtifact = await artifacts.readArtifact("CErc20Interface");
        const cToken = new ethers.Contract(trollerAddr, cTokenArtifact.abi, ethers.provider);

        const comptrollerArtifact = await artifacts.readArtifact("ComptrollerInterface");
        const troller = new ethers.Contract(trollerAddr, comptrollerArtifact.abi, ethers.provider);



        // troller.connect(user).enterMarket([cDaiAddr, cEthAddr]);

    });

    describe('', () => {
        it("supply", async function () {
            cToken.mint(3000);
            console.log("supplied successfully");
        });

    })


})
