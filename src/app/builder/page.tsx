"use client";

import { ContractsForm } from "@/components/ContractsForm";

/**
 * What am I doing now?
 * - [ ] ERC20
 * - [ ] ERC721
 * - [ ] ERC1155
 */

// import { useState } from "react";

// const Code = () => {
//   const [code, setCode] = useState(`
// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// // 

// contract MyToken is ERC20 {
//     constructor() ERC20("MyToken", "MTK") {}
// }
//   `);

//   return (
//     <div>
//       <div>
//         <h2>Contract type:</h2>

//         <input
//           type="radio"
//           id="erc20"
//           name="erc20"
//           value="erc20"
//           defaultChecked
//         />
//         <label htmlFor="erc20">ERC20</label>

//         <input type="radio" id="erc721" name="erc721" value="erc721" />
//         <label htmlFor="erc721">ERC721</label>

//         <input type="radio" id="erc1155" name="erc1155" value="erc1155" />
//         <label htmlFor="erc1155">ERC1155</label>
//       </div>

//       <div>
//         <h2>Library:</h2>

//         <input
//           type="radio"
//           id="openzeppelin"
//           name="openzeppelin"
//           value="openzeppelin"
//           defaultChecked
//         />
//         <label htmlFor="openzeppelin">OpenZeppelin</label>

//         <input type="radio" id="solmate" name="solmate" value="solmate" />
//         <label htmlFor="solmate">Solmate</label>

//         <input type="radio" id="solady" name="solady" value="solady" />
//         <label htmlFor="solady">Solady</label>
//       </div>

//       <div>
//         <h2>Contract settings:</h2>

//         <input type="text" placeholder="Name" />
//         <input type="text" placeholder="Symbol" />
//         <input type="text" placeholder="Decimals" />

//         <div>
//           <input type="checkbox" id="scales" name="scales" />
//           <label htmlFor="scales">Scales</label>
//         </div>
//       </div>

//       <textarea
//         className="text-gray-900 w-full h-96"
//         value={code}
//         data-lpignore
//         onChange={(e) => setCode(e.target.value)}
//       />
//     </div>
//   );
// };

export default function Builder() {
  return <ContractsForm />;
}
