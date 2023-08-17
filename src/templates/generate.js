const ejs = require("ejs");
const fs = require("fs");

// Load the template
const template = fs.readFileSync("ERC20.ejs", "utf-8");

// Define values for placeholders
const data = {
  tokenName: "MyToken",
  tokenSymbol: "MTK",
  initialSupply: 1000000,
  premint: true,
  mint: true,
  burn: true,
  pause: true,
  permit: true,
  ownable: true, // Whether to make the contract ownable
  roles: true, // Whether to incorporate roles for specific actions
};

// Render the contract
const renderedContract = ejs.render(template, data);

console.log(renderedContract);
