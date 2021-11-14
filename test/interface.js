const { messagePrefix } = require('@ethersproject/hash');
const { expect, util } = require('chai');
const { ethers } = require("hardhat");


describe('Compound-protocol', () => {

    const trollerAddr = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B";
    const CDAI = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
    const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
    const CETH = "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5"
    const acc = "0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0";


    const dai = ethers.utils.parseUnits("0.000001", 18);
    const eth = ethers.utils.parseEther("1", 18);
    const ethB = ethers.utils.parseEther("0.5", 18);

    describe('ERC20 Testing', () => {

        let cTokenArtifact, cToken, troller, token, comptrollerArtifact, tokenArtifact;


        beforeEach(async function () {
            [user, _] = await ethers.getSigners();
            cTokenArtifact = await artifacts.readArtifact("CErc20Interface");
            cToken = new ethers.Contract(CDAI, cTokenArtifact.abi, ethers.provider);

            comptrollerArtifact = await artifacts.readArtifact("ComptrollerInterface");
            troller = new ethers.Contract(trollerAddr, comptrollerArtifact.abi, ethers.provider);

            tokenArtifact = await artifacts.readArtifact("IERC20");
            token = new ethers.Contract(DAI, tokenArtifact.abi, ethers.provider);

            await hre.network.provider.request({
                method: "hardhat_impersonateAccount",
                params: [acc],
            });

            const signer = await ethers.getSigner(acc);

            console.log(dai);
            await token.connect(signer).transfer(user.address, dai);


            await hre.network.provider.request({
                method: "hardhat_stopImpersonatingAccount",
                params: [acc],
            });

        });

        it("supply erc20", async function () {
            // console.log(await token.connect(user).balanceOf(user.address));
            console.log(1, (await token.connect(user).balanceOf(user.address)).toString());
            await token.connect(user).approve(CDAI, dai);
            await cToken.connect(user).mint(dai);
            console.log(2, (await token.connect(user).balanceOf(user.address)).toString());
            // await cToken.connect(user).redeemUnderlying(dai);
            console.log("supplied dai successfully");
        });

        it("borrow erc20", async function () {

            await troller.connect(user).enterMarkets([CDAI]);
            await cToken.connect(user).borrow(dai / 2);

        });

        it("Repay Borrow erc20", async function () {
            console.log(1, (await token.connect(user).balanceOf(user.address)).toString());
            // await troller.connect(user).enterMarkets([CDAI]);
            await token.connect(user).approve(CDAI, dai);
            await cToken.connect(user).repayBorrow(dai / 2);
            console.log("repayed");

        });

        it("redeem erc20", async function () {

            console.log(1, (await token.connect(user).balanceOf(user.address)).toString());
            await cToken.connect(user).redeemUnderlying(dai);
            console.log("redeemed")
        });

    })

    describe('Eth-testing', () => {

        let cTokenArtifact, cToken, troller, token, comptrollerArtifact, tokenArtifact;


        beforeEach(async function () {
            [user, _] = await ethers.getSigners();
            cTokenArtifact = await artifacts.readArtifact("CErc20Interface");
            cToken = new ethers.Contract(CDAI, cTokenArtifact.abi, ethers.provider);

            comptrollerArtifact = await artifacts.readArtifact("ComptrollerInterface");
            troller = new ethers.Contract(trollerAddr, comptrollerArtifact.abi, ethers.provider);

            tokenArtifact = await artifacts.readArtifact("IERC20");
            token = new ethers.Contract(DAI, tokenArtifact.abi, ethers.provider);

            CEthArtifact = await artifacts.readArtifact("CEthInterface");

            CEth = new ethers.Contract(CETH, CEthArtifact.abi, ethers.provider);


        });

        it("Supply eth", async function () {
            // token.balanceOf(user);
            // console.log(user.address);
            // console.log(await token.connect(user).balanceOf(user.address));
            // console.log(1, (await token.connect(user).balanceOf(user.address)).toString());


            await token.connect(user).approve(CDAI, dai);
            await CEth.connect(user).mint({ value: eth });


            // console.log(2, (await token.connect(user).balanceOf(user.address)).toString());
            // await cToken.connect(user).redeemUnderlying(dai);
            console.log("supplied ETH");
        });

        it("borrow eth", async function () {
            // console.log(1, (await token.connect(user).balanceOf(user.address)).toString());
            await troller.connect(user).enterMarkets([CETH]);
            await CEth.connect(user).borrow(ethB);
            console.log("borrowed ETH");
        });

        it("redeem eth", async function () {
            // console.log(1, (await token.connect(user).balanceOf(user.address)).toString());
            await CEth.connect(user).redeem(eth);
            console.log("redeemed ETH")
        });

        it("Repay Borrow eth", async function () {
            // console.log(1, (await token.connect(user).balanceOf(user.address)).toString());

            console.log(eth);
            await CEth.connect(user).repayBorrow({ value: ethB });
            console.log("repayed ETH");




        })


    })

})
