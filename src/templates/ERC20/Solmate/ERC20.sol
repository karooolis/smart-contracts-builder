// SPDX-License-Identifier: <%= license %>
pragma solidity <%= pragma %>;

<%= imports %>

contract <%= tokenName %> is ERC20<% if (pause) { %>, Pausable<% } %><% if (ownable) { %>, Owned(msg.sender)<% } %><% if (roles) { %>, AccessControl<% } %> {
    <% if (roles && pause) { %>
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    <% } %>

    constructor() ERC20("<%= tokenName %>", "<%= tokenSymbol %>") {
        <% if (premint) { %>_mint(msg.sender, <%= initialSupply %> * 10 ** decimals());<% } %>
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

    <% if (burn) { %>
    function burn(uint256 amount) public <% if (ownable) { %> onlyOwner <% } %> {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public <% if (ownable) { %> onlyOwner <% } %> {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "Burn amount exceeds allowance");
        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);
    }
    <% } %>

    <% if (pause) { %>
    function pause() public <% if (roles) { %> onlyRole(PAUSER_ROLE) <% } %><% if (!roles && ownable) { %> onlyOwner <% } %> {
        _pause();
    }

    function unpause() public <% if (roles) { %> onlyRole(PAUSER_ROLE) <% } %><% if (!roles && ownable) { %> onlyOwner <% } %> {
        _unpause();
    }
    <% } %>
}