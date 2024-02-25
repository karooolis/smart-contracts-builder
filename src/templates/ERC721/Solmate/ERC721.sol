// SPDX-License-Identifier: <%= license %>
pragma solidity <%= pragma %>;

import "solmate/auth/Auth.sol";

contract <%= tokenName %> is ERC721 {
    constructor() ERC721("<%= tokenName %>", "<%= tokenSymbol %>") {
        <% if (roles) { %>
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        <% if (pause) { %>_setupRole(PAUSER_ROLE, msg.sender);<% } %>
        <% if (mint) { %>_setupRole(MINTER_ROLE, msg.sender);<% } %>
        <% } %>
    }

    <% if (baseURI) { %>
    function _baseURI() internal pure override returns (string memory) {
        return "<%= baseURI %>";
    }
    <% } %>
    
    <% if (mint) { %>
    function mint(address to, uint256 tokenId) public <% if (ownable) { %> onlyOwner <% } %> {
        _mint(to, tokenId);
    }
    <% } %>
}