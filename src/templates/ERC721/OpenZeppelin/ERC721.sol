// SPDX-License-Identifier: <%= license %>
pragma solidity <%= pragma %>;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
<% if (burn) { %>import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";<% } %>
<% if (pause) { %>import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";<% } %>
<% if (ownable) { %>import "@openzeppelin/contracts/access/Ownable.sol";<% } %>
<% if (roles) { %>import "@openzeppelin/contracts/access/AccessControl.sol";<% } %>

contract <%= tokenName %> is ERC721<% if (burn) { %>, ERC721Burnable<% } %><% if (pause) { %>, ERC721Pausable<% } %><% if (ownable) { %>, Ownable<% } %><% if (roles) { %>, AccessControl<% } %> {
    <% if (roles && pause) { %>
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    <% } %>

    <% if (roles && mint) { %>
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    <% } %>
    
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

    <% if (pause) { %>
    function pause() public <% if (roles) { %> onlyRole(PAUSER_ROLE) <% } %><% if (ownable) { %> onlyOwner <% } %> {
        _pause();
    }

    function unpause() public <% if (roles) { %> onlyRole(PAUSER_ROLE) <% } %><% if (ownable) { %> onlyOwner <% } %> {
        _unpause();
    }

    // The following functions are overrides required by Solidity.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
    <% } %>
    
    <% if (roles) { %>
    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    <% } %>
}