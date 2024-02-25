<% if (upgradeability == "none") { %>
    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
    <% if (burn) { %>import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";<% } %>
    <% if (pause) { %>import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";<% } %>
    <% if (permit) { %>import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";<% } %>
    <% if (ownable) { %>import "@openzeppelin/contracts/access/Ownable.sol";<% } %>
    <% if (roles) { %>import "@openzeppelin/contracts/access/AccessControl.sol";<% } %>
<% } else { %>
    import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
    import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
    <% if (burn) { %>import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";<% } %>
    <% if (pause) { %>import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";<% } %>
    <% if (permit) { %>import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";<% } %>
    <% if (ownable) { %>import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";<% } %>
    <% if (roles) { %>import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";<% } %>
    <% if (upgradeability == "uups") { %>
        import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
    <% } %>
<% } %>