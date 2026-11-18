# Whot Replay API

HTTP/JSON + Server-Sent Events, all under `/api`. Content-Type: `application/json`.

Shares the Whot Africa user account and coin balance. Markets and odds are public; betting and wallet require `Authorization: Bearer <jwt-token>`.

## Auth

- `POST /api/auth/signup` — `{full_name, email, password, country}` → `201 {user_id, unique_id}`. All fields required.
- `POST /api/auth/login` — `{email, password}` → `200 {ret, token, email, msg}`. Token lasts 30 minutes.
- `POST /api/auth/social` — `{id_token}` from the Auth0 SPA SDK → `200 {ret, token, email, msg}`, the same shape as login. The token is verified against the tenant's published keys, issuer and client ID; the account is looked up by `auth0_id`, then by email, and created on first sign-in. Accounts created this way carry `password: "social"`, matching SimplyWhot, so the same account works in both products. An unverified email is refused rather than linked. `401` invalid token, `403` blocked, deleted or unverified email, `503` not configured (`AUTH0_DOMAIN` + `AUTH0_CLIENT_ID`).
## Public

- `GET /api/games` — the batch currently on show: `max_selected_replays` games that share one `batch_id`, betting window and stream time. Each has `id`, `batch_id`, `status`, `market_state` (`gathering`|`live`), `voided`, timeline, pools, stakers and players.
- `GET /api/games/{id}/stream` — SSE replay. Waits until betting is locked, then emits frames paced across the stream window. Resume with `Last-Event-ID` or `?from=<seq>`.
  - `scheduled` `{game_id, status, bets_open_at, bets_lock_at, stream_start_at, events_total}`
  - `start` `{game_id, players, initial_hands, initial_last_card, initial_deck, turn_array, events_total, stream_start_at, stream_end_at}`
  - `frame` — the replay event, with `id:` set to the event `seq`
  - `end` `{game_id, winner_player_index, winner_team, final_hands}`
- `GET /api/slips/{code}` — shared slip `{code, total_stake, createdtime, bets[], accumulator_bets[]}`. `404` if unknown.
- `GET /api/odds` — SSE decimal odds for every live market. `odds(outcome) = (total_pool + N*V) * (1 - fee) / (outcome_pool + V)`, where `V` is `opening_liquidity`. Join with `/api/games` and `/api/accumulators` by `id`.
  - `snapshot` — array of `{id, odds, legs?}` on connect
  - `odds` — one `{id, odds, legs?}` per accepted bet
  - `closed` — `{id, closed: true}` on lock/settle

`odds` keys are `orange`/`blue` for a game, or a combo (`OB`, …) for an accumulator.

Accumulator messages also carry `legs`: `[{game_id, orange, blue, orange_percent, passed}]`, the
split of that accumulator's own tickets on each leg. `passed` is the 80/20 verdict for the leg.

Replay event `type`: `DEAL`, `NEXT_TURN`, `PLAY_CARD`, `PICK_CARD`, `SELECT_SUIT`. Card `{suit, number}`: suit 0 Circles, 1 Triangles, 2 Crosses, 3 Squares, 4 Stars, 5 Whot; number 1–14 or 20 (Whot).

## Betting

Pari-mutuel: stakes form a pool, the winning side splits it minus `betting_fee_percent`. Round status: `scheduled → open → locked → settled`.

Games are shown one batch at a time. A batch is inserted as `scheduled` once every round of the previous batch has settled, so a game is always listed while betting is still ahead of it and stays listed through `locked` until it settles. `batch_notice_min_seconds`–`batch_notice_max_seconds` (default 300–420) is the delay before betting opens. All legs of a batch share `bets_open_at`, `bets_lock_at`, `stream_start_at` and `stream_end_at`, so they open, lock and settle together and can be combined into one accumulator.

The majority side is capped at `cap_percent` (default 80%) once both sides clear the floor (`min_stakers_per_side`, `min_pool_per_side`); before that the market is `gathering`.

Betting closing also applies the **80/20 rule**, once, on the final pot: the pool passes while the `orange` share is between `min_side_percent` (20) and `max_side_percent` (80), inclusive. A market outside that band is `voided` — every stake is refunded in full, `voided: true` is set on the round, and no commission is taken. The round still plays out and settles, so an accumulator leg built on it keeps its winner. A band setting outside (0,100) disables the check.

- `POST /api/bets` — `{game_id, team, amount, slip_code?}`; `team` is `orange`|`blue` (request only). → `201 {id, game_id, amount, status, payout, slip_code, player, stream_start_at, createdtime}`. `player` is the player backed: `{player_index, full_name}`, where `player_index` 0 is `orange` and 1 is `blue`. Errors: `400` invalid, `402` insufficient balance, `409` not open / cap reached.
- `GET /api/bets` — `{bets: [...]}`, newest first, max 100, each entry the same shape as above. `status`: `placed`|`won`|`lost`|`refunded`. `player` and `stream_start_at` are filled from the game, so a settled bet still names who was backed.

## Accumulators

Pick a full combination (one `O`/`B` per leg) over 2–5 legs. Locks when any leg starts; settles when all legs settle. The winning combination splits the pool; an unbacked winner keeps the pool as margin. Listing is public; placing and listing your own bets require auth.

Betting closing freezes the pot, so that is when the **80/20 rule** is applied, once. For each leg separately, the full stake of every ticket is added to the side it picked there; the leg passes while its `orange` share is between `min_side_percent` (20) and `max_side_percent` (80), inclusive. If every leg passes the round runs as normal. If any leg falls outside the band the accumulator is `voided`: every stake is refunded in full, `failed_legs` records which legs failed, and no commission is taken.

- `GET /api/accumulators` — public. `scheduled`, `open` and `locked`: `{id, status, legs[{game_id, players}], total_pool, combo_pools, combo_stakers, bets_open_at, bets_lock_at, fee_percent, cap_percent, createdtime}`. Betting is only accepted while `status` is `open`.
- `POST /api/accumulators/bets` — `{accumulator_id, combo, amount, slip_code?}`; `combo` is one `O`/`B` per leg, positionally matching `legs`. → `201 {id, accumulator_id, combo, amount, status, payout, slip_code, legs[{game_id, player}], createdtime}`, where `player` is `{player_index, full_name}` for the side that leg's `combo` character picks. Errors: `400`, `402`, `404`, `409`.
- `GET /api/accumulators/bets` — `{bets: [...]}`, newest first, max 100, same shape as above. `status`: `placed`|`won`|`lost`|`refunded`.
- Admin: `POST /api/admin/accumulators` `{game_ids}`, `POST /api/admin/accumulators/{id}/lock`, `POST /api/admin/accumulators/{id}/settle`. Settling a `voided` accumulator is a `409`.

## Wallet

Uses the shared Whot Africa coin (`users.coin`); withdrawal bank details live on the shared `users` document.

- `GET /api/wallet` → `{balance, withdrawal_account{account_name, bank_name, account_number}}`.
- `POST /api/wallet/deposit` — `{amount, provider?}` (default `opay`; also `paystack`, `marasoftpay`, `payaza`, `nomba`, `credo`, `crypto`, `palmpay`) → `{url, reference}`. Open `url` to pay. `400`, `502`, `503`.
- `POST /api/wallet/deposit/status` — `{reference}` → `{status}` (`pending`|`success`|`failed`). `404`.
- `POST /api/wallet/withdraw` — `{amount}` → `{msg}`. `400`, `502`, `503`.
- `PUT /api/wallet/withdrawal-account` — `{account_name, bank_name, account_number}` → `{msg}`. `400`, `500`.
- `GET /api/wallet/transactions` — up to 50, newest first: `{type, amount, status, createdtime}`; `type` `deposit`|`withdrawal`, `status` `pending`|`success`|`failed`|`reverted`.
