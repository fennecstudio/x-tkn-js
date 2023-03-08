# Toknize

Toknize is an API that provides Stateful Web Tokens.

An API Key is required and can be obtained at https://toknize.io by signing up for a free account.

## Installation
```js
npm install toknize --save
```

## Setup
The Toknize SDK needs your API Key in order to authenticate correctly.
This can be done in one of two ways
#### Environment Variable
```shell
TOKNIZE_API_KEY_ID=YOUR_API_KEY
```
#### In Code
```js
import {toknize} from 'toknize'

toknize({apiKeyId: YOUR_API_KEY})
```

## Methods

### createToken(data)
```js
import {createToken} from 'toknize'

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

### deleteToken(tokenId)
```js
import {deleteToken} from 'toknize'

// ...

await deleteToken('some-token-id')

```

### readToken(tokenId)
```js
import {readToken} from 'toknize'

// ...

let token = await readToken('some-token-id')

```

### redeemToken(tokenId)
```js
import {redeemToken} from 'toknize'

// ...

let token = await redeemToken('some-token-id')

```

### revokeToken(tokenId)
```js
import {revokeToken} from 'toknize'

// ...

let token = await revokeToken('some-token-id')

```


