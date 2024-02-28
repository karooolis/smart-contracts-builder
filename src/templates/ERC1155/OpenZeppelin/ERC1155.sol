// SPDX-License-Identifier: <%= license %>
pragma solidity <%= pragma %>;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
<% if (ownable) { %>import "@openzeppelin/contracts/access/Ownable.sol";<% } %>
<% if (roles) { %>import "@openzeppelin/contracts/access/AccessControl.sol";<% } %>
<% if (burnable) { %>import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";<% } %>
<% if (supplyTracking) { %>import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";} %> 
<% if (pausable) { %>import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";<% } %>

contract <%= tokenName %> is ERC1155,
  <% if (ownable) { %>, Ownable<% } %>
  <% if (burnable) { %>, ERC1155Burnable<% } %>
  <% if (supplyTracking) { %>, ERC1155Supply<% } %>
  <% if (pause) { %>, ERC1155Pausable<% } %>
  <% if (roles) { %>, AccessControl<% } %>
{
    <% if (roles) { %>
      <% if (mintable) { %>bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");<% } %>
      <% if (pausable) { %>bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");<% } %>
    <% } %>

    constructor(
      <% if (ownable) { %>address initialOwner<% } %>
      <% if (roles) { %>
          address defaultAdmin
          <% if (mintable) { %>, address minter<% } %>
          <% if (pausable) { %>, address pauser<% } %>
      <% } %>
    )
    ERC1155(<%= tokenUri %>)
    <% if (ownable) { %>, Ownable(initialOwner)<% } %> {
        <% if (roles) { %>
            _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
            <% if (mintable) { %>_grantRole(MINTER_ROLE, minter);<% } %>
            <% if (pausable) { %>_grantRole(PAUSER_ROLE, pauser);<% } %>
        <% } %>
    }

    <% if (mintable) { %>
      function mint(address account, uint256 id, uint256 amount, bytes memory data)
          public
          <% if (ownable) { %>onlyOwner<% } %>
          <% if (roles) { %>onlyRole(MINTER_ROLE)<% } %>
      {
          _mint(account, id, amount, data);
      }

      function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
          public
          <% if (ownable) { %>onlyOwner<% } %>
          <% if (roles) { %>onlyRole(MINTER_ROLE)<% } %>
      {
          _mintBatch(to, ids, amounts, data);
      }
    <% } %>

    <% if (updateableUri) { %>
      function setURI(string memory newuri) public onlyOwner {
          _setURI(newuri);
      }
    <% } %>

    <% if (pausable) { %>
      function pause()
          public
          <% if (ownable) { %>onlyOwner<% } %>
          <% if (roles) { %>onlyRole(PAUSER_ROLE)<% } %>
      {
          _pause();
      }

      function unpause()
          public
          <% if (ownable) { %>onlyOwner<% } %>
          <% if (roles) { %>onlyRole(PAUSER_ROLE)<% } %>
      {
          _unpause();
      }
    <% } %>

    <% if (supplyTracking || pausable) { %>
      function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
          internal
          override(
            ERC1155
            <% if (supplyTracking) { %>, ERC1155Supply<% } %>
            <% if (pausable) { %>, ERC1155Pausable<% } %>
          )
      {
          super._update(from, to, ids, values);
      }
    <% } %>

    <% if (roles) { %>
      function supportsInterface(bytes4 interfaceId)
          public
          view
          override(ERC1155, AccessControl)
          returns (bool)
      {
          return super.supportsInterface(interfaceId);
      }
    <% } %>
}