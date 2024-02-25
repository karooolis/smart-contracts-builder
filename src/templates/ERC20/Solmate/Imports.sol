import "solmate/erc20/ERC20.sol";
<% if (pause) { %>import "solmate/utils/Pausable.sol";<% } %>
<% if (ownable) { %>import "solmate/utils/Ownable.sol";<% } %>
<% if (roles) { %>import "solmate/access/AccessControl.sol";<% } %>