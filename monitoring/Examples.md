# Smart Contract Monitoring on Stellar — Example Projects & Monitors

## Summary

| Project | Category | Monitors |
|---|---|---|
| Stellar Native Operations | Infrastructure | 8 |
| Blend | Lending | 5 |
| DeFindex | DeFi | 3 |
| Reflector | Oracle | 4 |
| Spiko | Asset Management | 5 |
| SushiSwap | DEX | 5 |
| **Total** |  | **30** |


---

## Stellar Native Operations

Core Stellar network operations including payments, account management, and trustlines.

**Category:** Infrastructure

| Monitor | What it detects | Example Severity |
|---|---|---|
| Large XLM Transfer | XLM payments exceeding a user-set threshold amount | Warning |
| Large Non-Native Asset Payment | Payments of any issued asset (USDC, AQUA, SCOP, etc.) exceeding per-asset thresholds | Warning |
| New Account Creation Spike | Elevated new-account-creation rate above normal baseline | Info |
| Account Merge to Unknown Address | Account-merge operations (a classic drain vector) to destinations outside a trusted allow-list | Warning |
| Trustline Established for Unknown Asset | Trustlines created for assets not on the trusted-asset list (phishing-asset exposure) | Info |
| Sequence Number Gap / Transaction Failure Spike | Elevated transaction-failure rate on watched accounts (signature or key-rotation problems) | Critical |
| Account Signer Change | Modifications to a watched account's signer set or multisig thresholds (canonical account-takeover signature) | Critical |
| Clawback Event | Asset-issuer clawback operations — legitimate compliance reversal or issuer compromise | Warning |

---

## Blend

Stellar-native permissionless lending protocol with pools, backstops, and liquidations.

**Category:** Lending

| Monitor | What it detects | Example Severity |
|---|---|---|
| Large Borrow Event | Borrow events exceeding a threshold amount | Warning |
| Pool Utilization Above Threshold | Pool utilization approaching or exceeding its configured ceiling | Critical |
| Backstop Withdrawal | Completed withdrawals from the backstop module (insiders exiting) | Critical |
| Backstop Queued Withdrawal | Intent signal preceding backstop withdrawal — sophisticated LPs queuing ahead of stress | Warning |
| Oracle Price Update Beyond x% | Oracle price changes exceeding a percentage threshold (volatility or manipulation) | Warning |

---

## DeFindex

Soroban-based vault and yield-aggregation platform with strategy rebalancing.

**Category:** DeFi

| Monitor | What it detects | Example Severity |
|---|---|---|
| Vault Deployment | Deployment of new DeFindex vaults via the factory | Info |
| Large Deposits into Vault > x | Vault deposits exceeding a threshold amount | Warning |
| Emergency Rescue Operation | Emergency rescue operations on vaults (admin-key signal — legitimate or compromised) | Critical |

---

## Reflector

Decentralized oracle protocol providing price feeds to the Stellar DeFi ecosystem.

**Category:** Oracle

| Monitor | What it detects | Example Severity |
|---|---|---|
| Price Update Published > x% | Price updates with deltas exceeding a percentage threshold | Warning |
| Price Feed Goes Stale | Expected periodic price updates failing to arrive within a staleness window | Critical |
| Asset Feed Added / Removed | Assets added to or removed from the oracle's tracked universe | Warning |
| Admin Transaction Submitted | Admin transactions on the oracle contract (governance-significant) | Info |

---

## Spiko

Regulated tokenized money-market funds (EUTBL, USTBL) on Soroban with role-based access control.

**Category:** Asset Management

| Monitor | What it detects | Example Severity |
|---|---|---|
| Token Mint (Subscription) | Fund subscription events via token minting (audit trail for every investor deposit) | Info |
| Token Burn (Redemption) | Fund redemption events via token burning | Info |
| Role Grant / Revoke | Role-management actions on the contract (minter, admin, burner) | Critical |
| Batch Operation Failure | Failures in batch operations on channel-account transactions (subscription pipeline breakage) | Critical |
| TTL Expiry Risk | Contract-storage TTL approaching expiry (user funds at risk of becoming inaccessible) | Warning |

---

## SushiSwap

Concentrated-liquidity DEX (Uniswap-V3-style) deployed on Soroban.

**Category:** DEX

| Monitor | What it detects | Example Severity |
|---|---|---|
| Position Minted (LP Entry) | New concentrated-liquidity positions minted by LPs | Info |
| Position Burned (LP Exit) | Concentrated-liquidity positions burned (LP exits) | Info |
| Price Crosses Tick Boundary | Pool price crosses a user-configured tick boundary (price-level alert) | Warning |
| Fee Growth Anomaly | Fee accumulators deviating from volume-derived expectations (accounting-bug signal) | Warning |
| Admin-Surface Action | Privileged admin actions on pools or factory — protocol-fee changes, ownership transfer, protocol-fee collection | Warning |

---