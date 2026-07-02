# Stellar Invariant Monitoring — Project & Monitor Catalog

## Summary

| # | Project | Category | Data Source | Monitors |
|---|---|---|---|---|
| 1 | Stellar Native Operations | Infrastructure | Horizon (classic) | 9 |
| 2 | Blend | Lending | Soroban | 10 |
| 3 | Soroswap | DEX | Soroban | 5 |
| 4 | Aquarius | DeFi | Horizon + Soroban | 6 |
| 5 | Phoenix | DEX | Soroban | 6 |
| 6 | LumenSwap | DEX | Horizon (classic) | 5 |
| 7 | Axelar | Bridge | Soroban | 6 |
| 8 | SushiSwap | DEX | Soroban | 6 |
| 9 | Scopuly | DEX | Horizon (classic) | 5 |
| 10 | Spiko | Asset Management | Soroban | 5 |
| 11 | Templar | Lending | Soroban | 5 |
| 12 | DeFindex | DeFi | Soroban | 5 |
| 13 | Reflector | Oracle | Soroban | 5 |
| 14 | Allbridge | Bridge | Soroban | 6 |
|   | **Total** |  |  | **84** |

### Coverage by category

| Category | Projects | Monitors |
|---|---|---|
| Lending | 2 | 15 |
| Infrastructure | 1 | 9 |
| DEX (trading venues) | 5 | 27 |
| DeFi (yield / governance) | 2 | 11 |
| Bridge (cross-chain) | 2 | 12 |
| Oracle | 1 | 5 |
| Asset Management | 1 | 5 |

---

## 1. Stellar Native Operations

Core Stellar network operations including payments, account management, and trustlines.

**Category:** Infrastructure · **Data source:** Horizon (Stellar classic)

| Monitor | What it detects | Severity |
|---|---|---|
| Large XLM Transfer | XLM payments exceeding a user-set threshold amount | Warning |
| Large Non-Native Asset Payment | Payments of any issued asset (USDC, AQUA, SCOP, etc.) exceeding per-asset thresholds | Warning |
| New Account Creation Spike | Elevated new-account-creation rate above normal baseline | Info |
| Account Merge to Unknown Address | Account-merge operations (a classic drain vector) to destinations outside a trusted allow-list | Warning |
| Trustline Established for Unknown Asset | Trustlines created for assets not on the trusted-asset list (phishing-asset exposure) | Info |
| Sequence Number Gap / Transaction Failure Spike | Elevated transaction-failure rate on watched accounts (signature or key-rotation problems) | Critical |
| Account Signer Change | Modifications to a watched account's signer set or multisig thresholds (canonical account-takeover signature) | Critical |
| Clawback Event | Asset-issuer clawback operations — legitimate compliance reversal or issuer compromise | Warning |
| Home-Domain Change | Modifications to a watched account's `home_domain` field — trust-signal redirection, phishing setup for issued assets | Warning |

---

## 2. Blend

Stellar-native permissionless lending protocol with pools, backstops, and liquidations.

**Category:** Lending · **Data source:** Soroban

| Monitor | What it detects | Severity |
|---|---|---|
| Large Borrow Event | Borrow events exceeding a threshold amount | Warning |
| Pool Utilization > x% | Pool utilization approaching or exceeding its configured ceiling | Critical |
| Backstop Withdrawal | Completed withdrawals from the backstop module (insiders exiting) | Critical |
| Backstop Queued Withdrawal | Intent signal preceding backstop withdrawal — sophisticated LPs queuing ahead of stress | Warning |
| Oracle Price Update Beyond x% | Oracle price changes exceeding a percentage threshold (volatility or manipulation) | Warning |
| Liquidation Events | Any liquidation event in Blend pools | Critical |
| Liquidation Rate Spike | Elevated rate of liquidations in a rolling window (price-shock or coordinated attack) | Warning |
| Bad Debt Socialization | Bad-debt events where liquidation recovery was insufficient — real financial loss to backstop or suppliers | Critical |
| Pool Admin Rotation | Admin-transfer events on lending pools (pool-takeover vector) | Critical |
| Reserve Parameter Change | Admin changes to reserve interest-rate / collateral-factor / liquidation-threshold parameters | Warning |

---

## 3. Soroswap

Automated market-maker DEX on Soroban with multi-adapter aggregator routing.

**Category:** DEX · **Data source:** Soroban

| Monitor | What it detects | Severity |
|---|---|---|
| New Pair Created | Deployment of a new trading pair on the Soroswap factory | Info |
| Large Single Swap | Individual swaps exceeding a threshold amount | Warning |
| Liquidity Removal Spike | Elevated rate of liquidity-removal events (classic rug-pull signal) | Warning |
| Aggregator Adapter Change | Changes to the aggregator's registered adapter list (admin-surface governance event) | Critical |
| Swap Slippage Exceeded | Swaps where realized slippage exceeds a percentage threshold (MEV or stale-reserves signal) | Warning |

---

## 4. Aquarius

Stellar-native liquidity-management protocol with AMM pools and AQUA/ICE vote-escrow governance.

**Category:** DeFi · **Data source:** Horizon + Soroban

| Monitor | What it detects | Severity |
|---|---|---|
| AQUA Rewards Distribution | AQUA reward distribution events (audit trail) | Info |
| New Vote Submitted | New governance votes submitted to the voting contract | Info |
| Voting Rate Spike | Elevated rate of new votes in a rolling window — coordinated governance brigade | Warning |
| Large AQUA Token Lock | Large AQUA-to-ICE lock events exceeding a threshold | Warning |
| AMM Pool TVL Drop > x% | AMM pool total-value-locked dropping by a significant percentage (exploit or mass exit) | Critical |
| Trustline Authorization Change | Issuer-level authorization changes on AQUA holder trustlines (freeze / unfreeze events) | Warning |

---

## 5. Phoenix

Soroban-native DeFi hub bundling an AMM DEX, multi-hop router, staking layer, vesting contract, and pool factory.

**Category:** DEX · **Data source:** Soroban

| Monitor | What it detects | Severity |
|---|---|---|
| Pool Deployment | Deployment of new Phoenix liquidity pools | Info |
| Large Liquidity Provision | Liquidity-provision events exceeding a threshold (whale LP positioning) | Warning |
| Swap Fee Revenue Spike | Elevated swap-fee collection rates (wash trading or genuine volume surge) | Info |
| Pool Pause / Emergency Stop | Pool pause, freeze, or emergency-stop admin actions | Critical |
| Staking Contract Deposit | Staking deposits exceeding a threshold (reward-dominance positioning) | Info |
| Unusual Vesting Claim | Vesting claims that are oversized OR outside the beneficiary's expected vesting schedule (over-claim or accounting bug) | Warning |

---

## 6. LumenSwap

Stellar DEX user-experience layer built on the native Stellar SDEX and AMM pools, focused on LSP-denominated trading.

**Category:** DEX · **Data source:** Horizon (Stellar classic)

| Monitor | What it detects | Severity |
|---|---|---|
| New AMM Pool Created | Creation of new native AMM liquidity pools (new LSP pair listings) | Info |
| Order Book Depth Collapse | Significant drop in order-book depth on watched asset pairs (liquidity crisis signal) | Critical |
| Large Offer Created | Large sell or buy offers placed on the SDEX | Warning |
| AMM Pool Liquidity Withdrawal | Significant liquidity withdrawals from watched AMM pools | Warning |
| LSP Token Transfer to Exchange Address | LSP-denominated transfers arriving at known exchange deposit addresses (sell-side pressure building) | Warning |

---

## 7. Axelar

Cross-chain interoperability bridge connecting Stellar to other blockchains via General Message Passing (GMP).

**Category:** Bridge · **Data source:** Soroban

| Monitor | What it detects | Severity |
|---|---|---|
| GMP Message Sent from Stellar | Outbound General Message Passing messages from Stellar to other chains | Info |
| Outbound GMP Volume Spike | Elevated rate of outbound GMP messages in a rolling window (exploit-staging or organic growth) | Warning |
| Inbound Token Transfer Minted | Wrapped tokens minted on Stellar from inbound cross-chain transfers | Info |
| Gateway Approved Message Backlog > x | Backlog of approved-but-unexecuted gateway messages exceeds threshold (relayer outage) | Critical |
| Validator Approval Quorum Miss | Cross-chain message batches failing to reach 2/3 validator approval within an expected window | Critical |
| Large Bridge Transfer | Large cross-chain transfers (inbound or outbound) exceeding a threshold | Warning |

---

## 8. SushiSwap

Concentrated-liquidity DEX (Uniswap-V3-style) deployed on Soroban.

**Category:** DEX · **Data source:** Soroban

| Monitor | What it detects | Severity |
|---|---|---|
| Pool Created | Creation of new SushiSwap V3 pools on the factory | Info |
| Position Minted (LP Entry) | New concentrated-liquidity positions minted by LPs | Info |
| Position Burned (LP Exit) | Concentrated-liquidity positions burned (LP exits) | Info |
| Price Crosses Tick Boundary | Pool price crosses a user-configured tick boundary (price-level alert) | Warning |
| Fee Growth Anomaly | Fee accumulators deviating from volume-derived expectations (accounting-bug signal) | Warning |
| Admin-Surface Action | Privileged admin actions on pools or factory — protocol-fee changes, ownership transfer, protocol-fee collection | Warning |

---

## 9. Scopuly

Stellar-classic trading platform and asset-issuance tool with its own SCOP native asset.

**Category:** DEX · **Data source:** Horizon (Stellar classic)

| Monitor | What it detects | Severity |
|---|---|---|
| High-Value SDEX Trades via Identified Accounts | High-value trades originating from identified Scopuly-associated accounts | Warning |
| Token Issuance from Identified Scopuly Issuer | Token-issuance or authorization events from the Scopuly issuer account | Info |
| Wallet Multi-Account Consolidation | Fan-in pattern — many accounts funneling assets to one destination (sweeping / consolidation) | Warning |
| Claimable Balance Created for Unknown Claimant | Claimable balances created for destinations outside the trusted-claimant list (phishing vector) | Info |
| SCOP Token Unusual Movement | SCOP token flows to or from known exchange addresses | Warning |

---

## 10. Spiko

Regulated tokenized money-market funds (EUTBL, USTBL) on Soroban with role-based access control.

**Category:** Asset Management · **Data source:** Soroban

| Monitor | What it detects | Severity |
|---|---|---|
| Token Mint (Subscription) | Fund subscription events via token minting (audit trail for every investor deposit) | Info |
| Token Burn (Redemption) | Fund redemption events via token burning | Info |
| Role Grant / Revoke | Role-management actions on the contract (minter, admin, burner) | Critical |
| Batch Operation Failure | Failures in batch operations on channel-account transactions (subscription pipeline breakage) | Critical |
| TTL Expiry Risk | Contract-storage TTL approaching expiry (user funds at risk of becoming inaccessible) | Warning |

---

## 11. Templar

BTC-backed lending protocol on Soroban with collateral management.

**Category:** Lending · **Data source:** Soroban

| Monitor | What it detects | Severity |
|---|---|---|
| Large Collateral Deposit > x | Collateral deposits exceeding a threshold amount (whale positioning before borrow) | Warning |
| Loan Disbursement Events | Loan disbursements from the protocol | Info |
| Liquidation Triggered | Liquidation events closing underwater positions | Critical |
| Loan Repayment Received | Loan repayments received from borrowers | Info |
| Contract Storage TTL Warning | Contract-storage TTL approaching expiry | Warning |

---

## 12. DeFindex

Soroban-based vault and yield-aggregation platform with strategy rebalancing.

**Category:** DeFi · **Data source:** Soroban

| Monitor | What it detects | Severity |
|---|---|---|
| Vault Deployment | Deployment of new DeFindex vaults via the factory | Info |
| Large Deposits into Vault > x | Vault deposits exceeding a threshold amount | Warning |
| Withdrawal / dfToken Burn | Vault withdrawal events via dfToken burning | Info |
| Strategy Rebalance Triggered | Strategy rebalance or allocation-change admin actions | Warning |
| Emergency Rescue Operation | Emergency rescue operations on vaults (admin-key signal — legitimate or compromised) | Critical |

---

## 13. Reflector

Decentralized oracle protocol providing price feeds to the Stellar DeFi ecosystem.

**Category:** Oracle · **Data source:** Soroban

| Monitor | What it detects | Severity |
|---|---|---|
| Price Update Published > x% | Price updates with deltas exceeding a percentage threshold | Warning |
| Price Feed Goes Stale | Expected periodic price updates failing to arrive within a staleness window | Critical |
| Asset Feed Added / Removed | Assets added to or removed from the oracle's tracked universe | Warning |
| Price Feed Expiry Approaching | Oracle price-record contract storage approaching TTL expiry (cascades across every downstream consumer) | Warning |
| Admin Transaction Submitted | Admin transactions on the oracle contract (governance-significant) | Info |

---

## 14. Allbridge

Cross-chain stablecoin bridge with Core (pool-based) and Classic (validator-multisig) product lines.

**Category:** Bridge · **Data source:** Soroban

| Monitor | What it detects | Severity |
|---|---|---|
| Large Inbound Bridge Deposit > x | Large inbound USDC bridge deposits to the Stellar pool | Warning |
| Large Outbound Bridge Withdrawal > x | Large outbound USDC bridge withdrawals from the Stellar pool | Warning |
| Stellar Pool vUSD Balance Change > x% | Significant changes in the Stellar-pool vUSD virtual reserve (cross-chain-flow imbalance) | Critical |
| Classic Bridge Validator Signing Activity | Elevated Allbridge Classic validator signing activity | Warning |
| USDC Liquidity Pool Depth Drop | Significant drops in USDC liquidity-pool depth (bridge approaching unusable state) | Critical |
| Admin-Surface Action | Privileged admin actions on either Core or Classic — fee adjustments, pause/unpause, admin rotation, validator-set changes | Critical |

---

## Severity levels

| Severity | Meaning | Typical use |
|---|---|---|
| **Critical** | Immediate attention required; suggests compromise, outage, or severe financial impact. | Admin-key events, quorum misses, bad debt, TVL crashes, emergency rescues. |
| **Warning** | Noteworthy event — legitimate in many cases, but worth reviewing. | Large trades, large deposits, elevated volatility, pool pauses. |
| **Info** | Routine activity logged for audit or trend analysis. | Subscription/redemption events, new-pair listings, routine admin actions. |

Severity defaults are set per monitor template based on the underlying event's business impact, but every user can override severity on a per-monitor basis at configuration time.

---

## Delivery channels

When a monitor fires, alerts are delivered through three channels (configured per-user):

1. **In-app real-time notification** — toast alerts in the dashboard + a badge on the firing monitor
2. **Email** — detailed violation message to a configured SMTP destination
3. **Webhook (POST)** — JSON payload to a user-supplied URL for custom integrations

Users can snooze individual alerts (1h / 4h / 24h), acknowledge alerts to mark them as reviewed, and pause monitoring globally or per-project with a single click.

---


*Catalog current as of 2026-04-22. Monitor coverage continues to expand across protocol upgrades and new Stellar ecosystem launches.*
