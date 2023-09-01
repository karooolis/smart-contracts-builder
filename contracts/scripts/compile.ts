const fs = require("fs");
const path = require("path");

async function main() {
  // Read the artifact file
  const artifactPath = "../artifacts/contracts/MockERC20.sol/MyToken.json";

  // path.join(
  //   __dirname,
  //   "./artifacts/contracts/MockERC20.sol/MyToken.json"
  // );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Print the bytecode
  console.log("Bytecode:", artifact.bytecode);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
