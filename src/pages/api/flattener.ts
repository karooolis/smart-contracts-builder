const { merge } = require("sol-merger");

async function merger() {
  // Get the merged code as a string
  const mergedCode = await merge("../../../contracts/contracts/Test.sol");
  // Print it out or write it to a file etc.
  console.log(mergedCode);
}

merger();
