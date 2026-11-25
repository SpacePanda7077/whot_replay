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
- `GET /api/slips/{code}` — a shared accumulator slip: `{code, total_stake, createdtime, accumulator_bets: [{accumulator_id, combo, amount, status, legs: [{game_id, players}]}]}`. `404` if unknown. Single bets have no slip code, so they cannot be shared.
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

Games are shown one batch at a time. One job owns the whole cycle: it generates three games, gives each a market, opens one accumulator over them, and then sleeps until the next timestamp is due. The next batch is created the moment the current one starts playing (`bets_lock_at`), so for the length of a stream two batches are listed together — the one playing (`locked`) and the one waiting (`scheduled`) — and clients tell them apart by `batch_id`. `batch_notice_min_seconds`–`batch_notice_max_seconds` (default 240–480) is the delay before betting opens; `betting_window_seconds` (240) is how long it stays open; the stream starts at lock and lasts `stream_duration_seconds` (60). All three markets of a batch share every timestamp, so they open, lock and settle together and can be combined into one accumulator. A game leaves the list only when it settles. `generation_enabled` in `replay_settings` pauses new batches without a deploy.

The majority side is capped at `cap_percent` (default 80%) once both sides clear the floor (`min_stakers_per_side`, `min_pool_per_side`); before that the market is `gathering`.

Betting closing also applies the **80/20 rule**, once, on the final pot: the pool passes while the `orange` share is between `min_side_percent` (20) and `max_side_percent` (80), inclusive. A market outside that band is `voided` — every stake is refunded in full, `voided: true` is set on the round, and no commission is taken. The round still plays out and settles, so an accumulator leg built on it keeps its winner. A band setting outside (0,100) disables the check.

- `POST /api/bets` — `{game_id, team, amount}`; `team` is `orange`|`blue` (request only). → `201 {id, game_id, amount, status, payout, player, stream_start_at, createdtime}`. `player` is the player backed: `{player_index, full_name}`, where `player_index` 0 is `orange` and 1 is `blue`. No slip code: single bets are not shareable. Errors: `400` invalid, `402` insufficient balance, `409` not open / cap reached.
- `GET /api/bets` — `{bets: [...]}`, newest first, max 100, each entry the same shape as above. `status`: `placed`|`won`|`lost`|`refunded`. `player` and `stream_start_at` are filled from the game, so a settled bet still names who was backed.

## Accumulators

Pick a full combination (one `O`/`B` per leg) over 2–5 legs. Locks when any leg starts; settles when all legs settle. The winning combination splits the pool; an unbacked winner keeps the pool as margin. Listing is public; placing and listing your own bets require auth.

Betting closing freezes the pot, so that is when the **80/20 rule** is applied, once. For each leg separately, the full stake of every ticket is added to the side it picked there; the leg passes while its `orange` share is between `min_side_percent` (20) and `max_side_percent` (80), inclusive. If every leg passes the round runs as normal. If any leg falls outside the band the accumulator is `voided`: every stake is refunded in full, `failed_legs` records which legs failed, and no commission is taken.

- `GET /api/accumulators` — public. `scheduled`, `open` and `locked`: `{id, status, legs[{game_id, players}], total_pool, combo_pools, combo_stakers, bets_open_at, bets_lock_at, fee_percent, cap_percent, createdtime}`. Betting is only accepted while `status` is `open`.
- `POST /api/accumulators/bets` — `{accumulator_id, combo, amount, slip_code?}`; `combo` is one `O`/`B` per leg, positionally matching `legs`. → `201 {id, accumulator_id, combo, amount, status, payout, slip_code, legs[{game_id, player}], createdtime}`, where `player` is `{player_index, full_name}` for the side that leg's `combo` character picks. The returned `slip_code` is the share code for `GET /api/slips/{code}`; sending an existing one joins that slip instead of starting a new one. Errors: `400`, `402`, `404`, `409`.
- `GET /api/accumulators/bets` — `{bets: [...]}`, newest first, max 100, same shape as above. `status`: `placed`|`won`|`lost`|`refunded`.

## Admin

Role `admin` only. The scheduler drives every market itself; the only thing an admin sets is the schedule.

- `GET /api/admin/settings` — the `replay_settings` document.
- `PUT /api/admin/settings` — same fields → `200`. `generation_enabled` pauses new batches; `batch_notice_min/max_seconds` is the wait before betting opens; `betting_window_seconds` how long it stays open; `lock_to_stream_seconds` the gap before the stream; `stream_duration_seconds` how long it plays. `400` when the timing or percentage bounds are impossible.

## Wallet

Uses the shared Whot Africa coin (`users.coin`); withdrawal bank details live on the shared `users` document.

- `GET /api/wallet` → `{balance, withdrawal_account{account_name, bank_name, account_number}}`.
- `GET /api/wallet/banks` — `?country=` (default `nigeria`) → `{banks: [{name, code}]}`. Paystack's active banks, via Whot Africa. `bank_name` in the request below must be one of these **codes** (`"044"`), not the display name — the name is for the dropdown only. `502` when the list cannot be loaded, `503` when withdrawals are not configured.
- `POST /api/wallet/deposit` — `{amount, provider?}` (default `opay`; also `paystack`, `marasoftpay`, `payaza`, `nomba`, `credo`, `crypto`, `palmpay`) → `{url, reference}`. Open `url` to pay. `400`, `502`, `503`.
- `POST /api/wallet/deposit/status` — `{reference}` → `{status}` (`pending`|`success`|`failed`). `404`.
- `POST /api/wallet/withdraw` — `{amount}` → `{msg}`. Coins are converted 1:1 to naira, the amount must clear the minimum and stay under the configured maximum, and the payout waits for an admin approval. `400`, `402` insufficient coin, `502` upstream refused (bank details missing, limits, Paystack), `503`.
- `PUT /api/wallet/withdrawal-account` — `{account_name, bank_name, account_number}` → `{msg}`. `400`, `500`.
- `GET /api/wallet/transactions` — up to 50, newest first: `{type, amount, status, createdtime}`; `type` `deposit`|`withdrawal`, `status` `pending`|`success`|`failed`|`reverted`.
