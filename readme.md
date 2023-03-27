# x-tkn

x-tkn is an API that provides Stateful Web Tokens.

An API Key is required and can be obtained at https://x-tkn.com by signing up for a free account.

## Installation
```js
npm install x-tkn --save
```

## Setup
The Toknize SDK needs your API Key in order to authenticate correctly.
This can be done in one of two ways
#### Environment Variable
```shell
X_TKN_API_KEY_ID=YOUR_API_KEY
```
#### In Code
```js
import {setup} from 'x-tkn'

setup({apiKeyId: YOUR_API_KEY})
```

## The Token Object



## SDK Methods

### createToken(data)
```js
import {createToken} from 'x-tkn'

// ...

let data = {
    type: 'session',
    payload: {'hello': 'world'},
    uses: 0,
    maxUses: 1,
    expiresAt: new Date('2040-07-10 15:00:00.000')
}

let token = await createToken(data)

```

### createSecurityToken(data)
A security token is a specific token that is assigned to user (or other object), can only be redeemed once and has a configurable expiration date.
- *refId*: string - The id of the user or other object that the token is assigned to
- *ttl*: {days: number, hours: number, minutes: number, seconds: number} - The time to live of the token. If not provided, the token will never expire.

```js
import {createSecurityToken} from 'x-tkn'

let refId = "some-user-id"
let ttl = {days: 1}

let token = await createSecurityToken(refId, ttl)

```

### deleteToken(tokenId)
```js
import {deleteToken} from 'x-tkn'

await deleteToken('some-token-id')

```

### readToken(tokenId)
```js
import {readToken} from 'x-tkn'

let token = await readToken('some-token-id')

```

### redeemToken(tokenId)
```js
import {redeemToken} from 'x-tkn'

let token = await redeemToken('some-token-id')

```

### revokeToken(tokenId)
```js
import {revokeToken} from 'x-tkn'

let token = await revokeToken('some-token-id')

```


