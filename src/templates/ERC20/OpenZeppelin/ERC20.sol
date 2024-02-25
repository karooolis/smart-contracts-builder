// SPDX-License-Identifier: <%= license %>
pragma solidity <%= pragma %>;

<%= imports %>

contract <%= tokenName %> is
  <% if (upgradeability == "none") { %>
      ERC20
      <% if (burn) { %>, ERC20Burnable<% } %>
      <% if (pause) { %>, ERC20Pausable<% } %>
      <% if (permit) { %>, ERC20Permit<% } %>
      <% if (ownable) { %>, Ownable<% } %>
      <% if (roles) { %>, AccessControl<% } %>
  <% } else { %>
      Initializable,
      ERC20Upgradeable
      <% if (burn) { %>, ERC20BurnableUpgradeable<% } %>
      <% if (pause) { %>, ERC20PausableUpgradeable<% } %>
      <% if (permit) { %>, ERC20PermitUpgradeable<% } %>
      <% if (ownable) { %>, OwnableUpgradeable<% } %>
      <% if (roles) { %>, AccessControlUpgradeable<% } %>
  <% } %> {

  <% if (roles) { %>
  <% if (mint) { %>bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");<% } %>
  <% if (pause) { %>bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");<% } %>
  <% if (upgradeability == "uups") { %>bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");<% } %>
  <% } %>

  constructor(
      <% if (ownable) { %>address initialOwner<% } %>
      <% if (roles) { %>
          address defaultAdmin,
          address pauser,
          address minter
      <% } %>
  )
  <% if (upgradeability == "none") { %>
      ERC20("<%= tokenName %>", "<%= tokenSymbol %>")
      <% if (ownable) { %>Ownable(initialOwner)<% } %>
      <% if (permit) { %>ERC20Permit("<%= tokenName %>")<% } %>
  <% } %>
  {
      <% if (upgradeability == "none") { %>
          <% if (premint) { %>
              _mint(msg.sender, <%= initialSupply %>  * 10 ** decimals());
          <% } %>

          <% if (roles) { %>
              _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
              <% if (mint) { %>_grantRole(MINTER_ROLE, minter);<% } %>
              <% if (pause) { %>_grantRole(PAUSER_ROLE, pauser);<% } %>
          <% } %>
      <% } else { %>
          _disableInitializers();
      <% } %>
  }

  <% if (upgradeability != "none") { %>
  function initialize(
      <% if (ownable) { %>address initialOwner<% } %>
      <% if (roles) { %>
          address defaultAdmin,
          address pauser,
          address minter
      <% } %>
  ) initializer public {
      __ERC20_init("<%= tokenName %>", "<%= tokenSymbol %>");
      <% if (permit) { %>__ERC20Permit_init("<%= tokenName %>");<% } %>
      <% if (burn) { %>__ERC20Burnable_init();<% } %>
      <% if (pause) { %>__ERC20Pausable_init();<% } %>
      <% if (ownable) { %>__Ownable_init(initialOwner);<% } %>
      <% if (roles) { %>__AccessControl_init();<% } %>
      <% if (upgradeability == "uups") { %>__UUPSUpgradeable_init();<% } %>

      <% if (roles) { %>
          _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
          <% if (mint) { %>_grantRole(MINTER_ROLE, minter);<% } %>
          <% if (pause) { %>_grantRole(PAUSER_ROLE, pauser);<% } %>
          <% if (upgradeability == "uups") { %>_grantRole(UPGRADER_ROLE, upgrader);<% } %>
      <% } %>

      <% if (premint) { %>
          _mint(msg.sender, <%= initialSupply %>  * 10 ** decimals());
      <% } %>
  }
  <% } %>

  <% if (upgradeability == "uups") { %>
  function _authorizeUpgrade(address newImplementation)
      internal
      onlyOwner
      override
  {}
  <% } %>

  <% if (mint) { %>
  function mint(address to, uint256 amount) public <% if (ownable) { %> onlyOwner <% } %> <% if (roles) { %> onlyRole(MINTER_ROLE) <% } %> {
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

  // The following functions are overrides required by Solidity.
  function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
      super._update(from, to, value);
  }
  <% } %>
}