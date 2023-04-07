# X-TKN

X-TKN is an API that provides Stateful Web Tokens.

An API Key is required and can be obtained at https://x-tkn.com by signing up for a free account.

# Installation

```js
npm install x-tkn --save
```

# Setup



The Toknize SDK needs your API Key in order to authenticate correctly.
This can be done in one of two ways
#### Environment Variable
```shell
X_TKN_API_KEY_ID=YOUR_API_KEY
```
#### In Code
```js
import {setup} from 'x-tkn'

setup(YOUR_API_KEY)
```

# The Token Object



- `id`: string -
The unique identifier for the token.


- `type`: string -
The type of the token, which can be used to classify tokens for different purposes.


- `refId`: string -
A reference identifier for the token, which can be used to associate the token with a specific entity, such as a user.


- `payload`: boolean -
The payload of the token, which can be a string or an object. This can be used to store additional information related to the token, such as user details or permissions.


- `uses`: number -
The number of times the token has been used.


- `maxUses`: number -
The maximum number of times the token can be used before it becomes invalid.


- `expiresAt`: Date -
The date and time when the token expires. After this time, the token is no longer valid.


- `isRevoked`: boolean -
Indicates if the token has been revoked. If true, the token is no longer valid, even if it has not expired.


- `isEncrypted`: boolean -
Indicates if the token is encrypted at rest.


- `isActive`: boolean -
Indicates if the token is active, which means it has not been revoked, has not expired and has not reached it's maximum uses.


- `isExpired`: boolean -
Indicates if the token is expired. If true, the token is no longer valid, even if it has not been revoked.


- `accountId`: string -
The unique identifier of the account associated with the token. This can be used to link the token to a specific user, organization, or other entity within the application.


- `createdAt`: Date -
The date and time when the token was created. This can be used for auditing purposes or to determine the age of the token.


- `modifiedAt`: Date -
The date and time when the token was last modified. This can be used for auditing purposes or to track changes to the token's properties.



# SDK Methods





## createToken(data)

**PARAMETERS**

- `type`: string - The type of the token, which can be used to classify tokens for different purposes


- `refId`: string - Optional. A reference identifier for the token, which can be used to associate the token with a specific entity, such as a user.


- `payload`: boolean - Optional. The payload of the token, which can be a string or an object. This can be used to store additional information related to the token, such as user details or permissions.


- `uses`: number - Optional. The number of times the token has been used.


- `maxUses`: number - Optional. The maximum number of times the token can be used before it becomes invalid.


- `expiresAt`: Date - Optional. The date and time when the token expires. After this time, the token is no longer valid.


**RETURNS**

A `token` object

**EXAMPLE**

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



## createSecurityToken(refId, ttl)

A security token is a specific token that is assigned to user (or other object), can only be redeemed once and 
has a configurable expiration date.

**PARAMETERS**

- `refId`: string -
  Optional. The id of the user or other object that the token is assigned to


- `ttl`: {days: number, hours: number, minutes: number, seconds: number} -
  Optional. The time to live of the token. 

**RETURNS**

A `token` object

**EXAMPLE**

```js
import {createSecurityToken} from 'x-tkn'

let refId = "some-user-id"
let ttl = {minutes: 15}

let token = await createSecurityToken(refId, ttl)
```



## createSessionToken(refId, ttl)

A session token is a specific token that is assigned to user (or other object), has a configurable expiration date
and can be redeemed multiple times.  Session tokens can extend their expiration date by using 
the `extendExpiration` method.

**PARAMETERS**

- `refId`: string -
  Optional. The id of the user or other object that the token is assigned to


- `ttl`: {days: number, hours: number, minutes: number, seconds: number} -
  Optional. The additional amount time before the token expires.

**RETURNS**

A `token` object

**EXAMPLE**

```js

import {createSessionToken} from 'x-tkn'

let refId = "some-user-id"
let ttl = {hours: 2}

let token = await createSessionToken(refId, ttl)
```


## createShortCode(refId, ttl)

A short code is a 6-8 digit code that is assigned to a security token. 
The short code can be used to redeem the security token.  
It is commonly used for 2FA or device authentication workflows.  
A short code token can be read and reedemed like any other token.  
When redeeming the short code token, the generated short code is used as the `shortCode` parameter in `redeemToken(tokenId, shortCode)`

**PARAMETERS**

- `refId`: string -
  Optional. The id of the user or other object that the token is assigned to


- `ttl`: {days: number, hours: number, minutes: number, seconds: number} -
  Optional. The additional amount time before the token expires.

**RETURNS**

A `token` object

**EXAMPLE**

```js

import {createShortCode} from 'x-tkn'

let refId = "some-user-id"
let ttl = {hours: 2}

let token = await createShortCode(refId, ttl)
let shortCode = token.shortCode
```


## deleteToken(tokenId)

**PARAMETERS**

- `tokenId`: string -
  The unique identifier of the token to delete

**RETURNS**

void

**EXAMPLE**

```js
import {deleteToken} from 'x-tkn'

await deleteToken('some-token-id')
```



## extendExpiration(tokenId, ttl)
This method extends

**PARAMETERS**

- `tokenId`: string -
  The unique identifier of the token to delete


- `ttl`: {days: number, hours: number, minutes: number, seconds: number} -
  The time to live of the token. 

**RETURNS**

A `token` object

**EXAMPLE**

```js
import {readToken} from 'x-tkn'

let token = await readToken('some-token-id')
```



## readToken(tokenId)
The `readToken` method returns a `token` object for the specified token id.  
- If the token has limited uses, this method will NOT increment the token's use count.

**PARAMETERS**

- `tokenId`: string -
  The unique identifier of the token to delete

**RETURNS**

A `token` object

**EXAMPLE**

```js
import {readToken} from 'x-tkn'

let token = await readToken('some-token-id')
```



## redeemToken(tokenId, shortCode)
The `redeemToken` method returns a `token` object for the specified token id and is used for limited use tokens.
Calling this method will increment the token's `use` count.
- If the token is expired, it will return `null`.
- If the token has reached it's maximum uses, it will return `null`.
- If the token has been revoked, it will return `null`.
- If the short code is provided but does not match the one assigned to the token, it will return `null`.

**PARAMETERS**

- `tokenId`: string -
  The unique identifier of the token to delete

- `shortCode`: string -
  Optional. A 6-8 digit code that is used to further validate the token.

**RETURNS**

A `token` object

**EXAMPLE**

```js
import {redeemToken} from 'x-tkn'

let token = await redeemToken('some-token-id')
```



## revokeToken(tokenId)
The `revokeToken` method explicity revokes a token ensuring that any future attempts to redeem it will fail.

**PARAMETERS**

`tokenId`: string -
The unique identifier of the token to delete

**RETURNS**

A `token` object

**EXAMPLE**

```js
import {revokeToken} from 'x-tkn'

let token = await revokeToken('some-token-id')
```


