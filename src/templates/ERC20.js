export const ERC20 = `
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
<% if (burn) { %>import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";<% } %>
<% if (pause) { %>import "@openzeppelin/contracts/security/Pausable.sol";<% } %>
<% if (permit) { %>import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";<% } %>
<% if (ownable) { %>import "@openzeppelin/contracts/access/Ownable.sol";<% } %>
<% if (roles) { %>import "@openzeppelin/contracts/access/AccessControl.sol";<% } %>

contract <%= tokenName %> is ERC20<% if (mint || burn) { %>, ERC20Burnable<% } %><% if (pause) { %>, Pausable<% } %><% if (permit) { %>, ERC20Permit<% } %><% if (ownable) { %>, Ownable<% } %><% if (roles) { %>, AccessControl<% } %> {
    <% if (roles && pause) { %>
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    <% } %>
    
    constructor() ERC20("<%= tokenName %>", "<%= tokenSymbol %>") <% if (permit) { %>ERC20Permit("<%= tokenName %>")<% } %> {
        <% if (premint) { %>_mint(msg.sender, <%= initialSupply %>  * 10 ** decimals());<% } %>
        <% if (roles) { %>
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        <% if (roles) { %>_grantRole(PAUSER_ROLE, msg.sender);<% } %>
        <% } %>
    }

    <% if (mint) { %>
    function mint(address to, uint256 amount) public <% if (ownable) { %> onlyOwner <% } %> {
        _mint(to, amount);
    }
    <% } %>

    <% if (pause) { %>
    function pause() public <% if (roles) { %> onlyRole(PAUSER_ROLE) <% } %><% if (!roles && ownable) { %> onlyOwner <% } %> {
        _pause();
    }

    function unpause() public <% if (roles) { %> onlyRole(PAUSER_ROLE) <% } %><% if (!roles && ownable) { %> onlyOwner <% } %> {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
    <% } %>
}
`;
