# Whot Replay API

## Server

```text
Transport: HTTP/JSON and Server-Sent Events
Development address: https://whotreplay.92.205.183.108.sslip.io
Production address: <to be provisioned>
```

All endpoints are under:

```text
/api
```

Request and response content type:

```http
Content-Type: application/json
```

Whot Replay shares the Whot Africa user account and coin balance. Deposits and
withdrawals are handled by the Whot Africa server, which owns the payment
providers. Replays are public to watch; betting and wallet operations require
authentication.

## Authentication

### POST `/api/auth/signup`

#### Request

```json
{
  "full_name": "Ada Player",
  "email": "ada@example.com",
  "password": "secure-password",
  "country": "Nigeria"
}
```

All fields are required.

#### Success: `201 Created`

```json
{
  "user_id": "66b123456789012345678901",
  "unique_id": "a1b2c3"
}
```

#### Errors

```json
{
  "error": "email already taken"
}
```

| Status | Meaning |
| --- | --- |
| `400` | Invalid request or missing field |
| `409` | Email already exists |
| `500` | Account creation failure |

### POST `/api/auth/login`

Authenticates an existing SimplyWhot-compatible user.

#### Request

```json
{
  "email": "ada@example.com",
  "password": "secure-password"
}
```

#### Success: `200 OK`

```json
{
  "ret": 0,
  "token": "jwt-token",
  "msg": "Signed in successfully!"
}
```

The JWT expires after 30 minutes.

#### Failure: `200 OK`

```json
{
  "ret": 1,
  "msg": "Email or Password is incorrect."
}
```

## Watching replays

Watching is public. No authentication is required to browse the schedule or
stream a game, so anyone can watch.

### GET `/api/replays`

Returns upcoming, open, and currently broadcasting games, soonest first, with
their schedule.

#### Success: `200 OK`

```json
{
  "replays": [
    {
      "id": "room-number",
      "status": "open",
      "bets_open_at": "2026-09-10T09:57:00Z",
      "bets_lock_at": "2026-09-10T09:59:00Z",
      "stream_start_at": "2026-09-10T10:00:00Z",
      "stream_end_at": "2026-09-10T10:07:00Z",
      "players": [
        { "player_index": 0, "userid": "u1", "full_name": "Ada", "avatar": "default", "team": "orange" },
        { "player_index": 1, "userid": "u2", "full_name": "Bola", "avatar": "default", "team": "blue" }
      ]
    }
  ]
}
```

`status` is `scheduled` before betting opens, `open` while betting is allowed,
and `locked` once betting has closed (the stream may still be waiting or
running). Each game has a scheduled timeline: betting opens at `bets_open_at`,
closes at `bets_lock_at`, the stream runs from `stream_start_at` to
`stream_end_at`, and the round settles at `stream_end_at`.

This endpoint is public and viewer-facing, so it deliberately omits betting
market data (pools, stakers, market state). Authenticated clients get that from
[`GET /api/games`](#get-apigames).

### GET `/api/replays/{id}/stream`

Streams a replay over Server-Sent Events (`text/event-stream`). Public.

The stream waits until betting is locked and `stream_start_at` is reached before
revealing anything, then emits events paced across the stream window so every
viewer sees the same game at the same time. Reconnecting clients can resume with
the standard `Last-Event-ID` header or a `?from=<seq>` query parameter.

Event types:

| `event:` | When | Data |
| --- | --- | --- |
| `scheduled` | Before the stream starts (betting or the lock→stream gap) | `{ "game_id", "status", "bets_open_at", "bets_lock_at", "stream_start_at", "events_total" }` |
| `start` | Once locked and the stream start is reached | `{ "game_id", "players", "initial_hands", "initial_last_card", "initial_deck", "turn_array", "events_total", "stream_start_at", "stream_end_at" }` |
| `frame` | One per recorded event, with `id:` set to the event `seq` | The replay event |
| `end` | After the last frame | `{ "game_id", "winner_player_index", "winner_team", "final_hands" }` |
| `error` | On failure | `{ "error" }` |

While waiting for the broadcast to start, the server sends periodic `: waiting`
comments to keep the connection alive.

#### Example

```text
event: start
data: {"game_id":"room-number","players":[...],"events_total":29,"stream_start_at":"2026-09-10T10:00:00Z"}

id: 1
event: frame
data: {"seq":1,"type":"DEAL","payload":{...},"createdtime":"..."}

id: 2
event: frame
data: {"seq":2,"type":"NEXT_TURN","payload":{...},"createdtime":"..."}

event: end
data: {"game_id":"room-number","winner_player_index":0,"winner_team":"orange","final_hands":[...]}
```

### Replay events

Each `frame` carries one recorded game event:

```json
{ "seq": 3, "type": "PLAY_CARD", "payload": { ... }, "createdtime": "..." }
```

`type` is one of:

| `type` | payload |
| --- | --- |
| `DEAL` | `{ player_cards_list, last_card, deck, turn_array }` |
| `NEXT_TURN` | `{ player_index, turn_index, special_card, last_card, deck_card_count }` |
| `PLAY_CARD` | `{ player_index, card, previous_last_card, new_last_card, remaining_cards }` |
| `PICK_CARD` | `{ player_index, cards, deck_card_count, player_cards, special_card }` |
| `SELECT_SUIT` | `{ player_index, suit, previous_last_card, new_last_card }` |

Cards are `{ "suit": <int>, "number": <int> }`. `number` is the face value
(1–14, or 20 for Whot). `suit` is an index:

| `suit` | shape |
| --- | --- |
| 0 | Circles |
| 1 | Triangles |
| 2 | Crosses |
| 3 | Squares |
| 4 | Stars |
| 5 | Whot (wild) |

`SELECT_SUIT` carries the `suit` a player chose after playing a Whot (20).

## Betting

Betting is pari-mutuel: all stakes form a pool, and the winning side splits the
pool in proportion to their stakes, minus a configurable fee. A replay has one
round with status `scheduled` → `open` → `locked` → `settled`.

Each round is scheduled with a timeline: betting opens at `bets_open_at`, closes
at `bets_lock_at`, the stream runs from `stream_start_at` to `stream_end_at`, and
the round is settled at `stream_end_at` (the result is known server-side, so
settlement is immediate). Bets are accepted only while the round is `open` and
before `bets_lock_at`.

### GET `/api/games`

Lists the betting markets, including pools and participation. Requires
`Authorization: Bearer <jwt-token>` because it exposes market data.

#### Success: `200 OK`

```json
{
  "games": [
    {
      "id": "room-number",
      "status": "open",
      "market_state": "gathering",
      "bets_open_at": "2026-09-10T09:57:00Z",
      "bets_lock_at": "2026-09-10T09:59:00Z",
      "stream_start_at": "2026-09-10T10:00:00Z",
      "stream_end_at": "2026-09-10T10:07:00Z",
      "orange_pool": 0,
      "blue_pool": 0,
      "orange_stakers": 0,
      "blue_stakers": 0,
      "players": [
        { "player_index": 0, "userid": "u1", "full_name": "Ada", "avatar": "default", "team": "orange" },
        { "player_index": 1, "userid": "u2", "full_name": "Bola", "avatar": "default", "team": "blue" }
      ]
    }
  ]
}
```

`market_state` is `gathering` until both sides clear the participation floor,
after which it is `live`. While gathering, odds are not final and the pool cap
is not enforced. `orange_pool` / `blue_pool` are the total coin staked per side
and `orange_stakers` / `blue_stakers` are the number of stakes per side.

### Pool cap and the participation floor

The pool does not balance itself, and a lone stake against an empty side is not a
real market. So the majority side is capped at `cap_percent` (default 80%) of the
total pool, but the cap only applies once the market is real:

- Each side must clear a participation floor — at least `min_stakers_per_side`
  (default 5) stakers and `min_pool_per_side` (default ₦2,000).
- Until **both** sides clear the floor the round is `gathering`: stakes are
  accepted, the cap is not enforced, and odds are not final.
- Once both sides clear the floor the round is `live` and the cap is enforced:
  a stake that would push a side past `cap_percent` of the pool is rejected.
- If betting closes before both sides clear the floor, the leg is **voided** and
  every stake is refunded. A truly one-sided leg is a selection problem, not
  something the cap should fix.

These thresholds and the cap live in the `replay_settings` document
(`cap_percent`, `min_stakers_per_side`, `min_pool_per_side`, `betting_fee_percent`,
`min_bet`, `max_bet`).

### Betting products

A round has a `product` (set when opened by an admin):

- `standard` (default) — the 80% cap, participation floor and void rule above.
- `longshot` — a higher cap (`longshot_cap_percent`, default 95%) with capped
  exposure: `longshot_max_stake` per user and `longshot_max_pool` for the whole
  round. It has no participation floor and no void/refund; it is meant for thin,
  high-variance markets where the minority side can pay many multiples.

All betting endpoints require:

```http
Authorization: Bearer <jwt-token>
```

### POST `/api/bets`

Places a bet against the shared coin balance.

#### Request

```json
{
  "game_id": "room-number",
  "team": "orange",
  "amount": 500,
  "slip_code": "A1B2C3D4E5"
}
```

`team` is `orange` or `blue`. `slip_code` is optional: omit it and the server
creates a new code (returned in the response); pass an existing code to add the
bet to the same shareable slip.

#### Success: `201 Created`

```json
{
  "id": "66b123456789012345678901",
  "game_id": "room-number",
  "team": "orange",
  "amount": 500,
  "status": "placed",
  "payout": 0,
  "slip_code": "A1B2C3D4E5",
  "createdtime": "2026-09-10T12:00:00Z"
}
```

#### Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid team, invalid amount, or insufficient coin balance |
| `409` | Betting is not open, or the side has reached the pool cap |

### GET `/api/bets`

Returns the authenticated user's bets, newest first.

Each bet's `status` is `placed`, `won`, `lost`, or `refunded` (a voided leg
refunds the stake).

#### Success: `200 OK`

```json
{
  "bets": []
}
```

### GET `/api/slips/{code}`

Loads a shared bet slip by its code. Public, so a friend can open a slip without
an account. A slip is a group of independent bets; each settles against its own
game.

#### Success: `200 OK`

```json
{
  "code": "A1B2C3D4E5",
  "total_stake": 1500,
  "createdtime": "2026-09-10T12:00:00Z",
  "bets": [
    {
      "game_id": "room-number",
      "team": "orange",
      "amount": 500,
      "status": "placed",
      "players": [
        { "player_index": 0, "userid": "u1", "full_name": "Ada", "avatar": "default", "team": "orange" },
        { "player_index": 1, "userid": "u2", "full_name": "Bola", "avatar": "default", "team": "blue" }
      ]
    }
  ],
  "accumulator_bets": [
    { "accumulator_id": "66b123456789012345678903", "combo": "OB", "amount": 500, "status": "placed" }
  ]
}
```

`bets` holds single-match bets and `accumulator_bets` holds accumulator bets
(omitted when none). Both share the same slip `code`.

#### Errors

| Status | Meaning |
| --- | --- |
| `404` | No slip with that code |

## Accumulators

A pool-based accumulator combines several legs into one market. Stakers pick a
full combination of outcomes (one side per leg); every combination's stakes form
one shared pool, so the product is self-funding and never needs a float. Rake and
payout work the same as a single match.

Combination keys are ordered strings of `O` (orange) and `B` (blue), one
character per leg. A 3-leg accumulator has 8 combinations (`OOO` … `BBB`).

Betting closes as soon as any leg starts. The accumulator settles once every leg
has settled; the stakers on the winning combination split the payout pool
proportionally. A winning combination nobody staked simply leaves the payout pool
as margin.

All endpoints require:

```http
Authorization: Bearer <jwt-token>
```

### GET `/api/accumulators`

Lists open and live accumulators with their combination pools.

#### Success: `200 OK`

```json
{
  "accumulators": [
    {
      "id": "66b123456789012345678901",
      "status": "open",
      "legs": [
        { "game_id": "room-1", "players": [ ... ] },
        { "game_id": "room-2", "players": [ ... ] }
      ],
      "total_pool": 0,
      "combo_pools": { "OO": 0, "OB": 0, "BO": 0, "BB": 0 },
      "combo_stakers": { "OO": 0, "OB": 0, "BO": 0, "BB": 0 },
      "fee_percent": 10,
      "cap_percent": 80,
      "createdtime": "2026-09-10T12:00:00Z"
    }
  ]
}
```

### POST `/api/accumulators/bets`

#### Request

```json
{
  "accumulator_id": "66b123456789012345678901",
  "combo": "OB",
  "amount": 500,
  "slip_code": "A1B2C3D4E5"
}
```

`combo` must have one `O`/`B` per leg. `slip_code` is optional.

#### Success: `201 Created`

```json
{
  "id": "66b123456789012345678902",
  "accumulator_id": "66b123456789012345678901",
  "combo": "OB",
  "amount": 500,
  "status": "placed",
  "payout": 0,
  "slip_code": "A1B2C3D4E5",
  "createdtime": "2026-09-10T12:00:00Z"
}
```

#### Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid combination, invalid amount, or insufficient coin |
| `404` | Accumulator not found |
| `409` | Betting is not open, or the combination has reached the pool cap |

### GET `/api/accumulators/bets`

Returns the authenticated user's accumulator bets, newest first.

### Admin endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/admin/accumulators` | Create an accumulator from `{ "game_ids": [...] }` |
| `POST` | `/api/admin/accumulators/{id}/lock` | Close betting |
| `POST` | `/api/admin/accumulators/{id}/settle` | Settle and pay out (all legs must be settled) |

Accumulators are locked automatically when any leg starts and settled
automatically once every leg has settled.

## Wallet

Whot Replay uses the shared Whot Africa coin balance (`users.coin`). There is no
separate replay wallet. Bank details for withdrawals live on the shared `users`
document, so they are the same across both apps.

All wallet endpoints require:

```http
Authorization: Bearer <jwt-token>
```

### GET `/api/wallet`

#### Success: `200 OK`

```json
{
  "balance": 0,
  "withdrawal_account": {
    "account_name": "",
    "bank_name": "",
    "account_number": ""
  }
}
```

### POST `/api/wallet/deposit`

Starts a deposit through Whot Africa. The client opens `url` to complete
payment. The provider webhook credits the shared coin balance.

Requires `Authorization: Bearer <jwt-token>`.

#### Request

```json
{
  "amount": 5000,
  "provider": "opay"
}
```

`provider` is optional and defaults to `opay`. Supported providers: `opay`,
`paystack`, `marasoftpay`, `payaza`, `nomba`, `credo`, `crypto`, `palmpay`.

#### Success: `200 OK`

```json
{
  "url": "https://checkout.opayweb.com/...",
  "reference": "66b123456789012345678901"
}
```

`reference` is the Whot Africa transaction id used to poll the deposit status.

#### Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid amount |
| `502` | Whot Africa could not start the deposit |
| `503` | Deposits are not configured |

### POST `/api/wallet/deposit/status`

Requires `Authorization: Bearer <jwt-token>`.

#### Request

```json
{
  "reference": "66b123456789012345678901"
}
```

#### Success: `200 OK`

```json
{
  "status": "pending"
}
```

`status` is `pending`, `success`, or `failed`.

#### Errors

| Status | Meaning |
| --- | --- |
| `404` | No such deposit for this user |

### POST `/api/wallet/withdraw`

Requests a withdrawal. Whot Africa converts the coin to cash and queues the
payout for its existing approval flow.

Requires `Authorization: Bearer <jwt-token>`.

#### Request

```json
{
  "amount": 5000
}
```

#### Success: `200 OK`

```json
{
  "msg": "withdrawal requested"
}
```

#### Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid amount |
| `502` | Whot Africa rejected the withdrawal (insufficient coin, missing bank details, limits) |
| `503` | Withdrawals are not configured |

### PUT `/api/wallet/withdrawal-account`

Updates the withdrawal account. Because it is stored on the shared `users`
document, this also updates the account in Whot Africa.

#### Request

```json
{
  "account_name": "Ada Player",
  "bank_name": "Example Bank",
  "account_number": "0123456789"
}
```

#### Success: `200 OK`

```json
{
  "msg": "withdrawal account updated"
}
```

#### Errors

| Status | Meaning |
| --- | --- |
| `400` | A required field is missing |
| `500` | Update failed |

### GET `/api/wallet/transactions`

Returns the authenticated user's deposit and withdrawal history, newest first
(up to 50).

#### Success: `200 OK`

```json
{
  "transactions": [
    {
      "type": "deposit",
      "amount": 5000,
      "status": "success",
      "createdtime": "2026-09-10T12:00:00Z"
    }
  ]
}
```

`type` is `deposit` or `withdrawal`. `status` is `pending`, `success`, `failed`,
or `reverted`.
