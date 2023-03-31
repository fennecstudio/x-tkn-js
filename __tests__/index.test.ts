import path from 'path'

require('dotenv').config({path: path.resolve(process.cwd(), '__tests__/.env')})

import {
    createSecurityToken, createSessionToken, createToken, deleteToken, extendExpiration,
    listTokens, readToken, redeemToken, revokeToken, updateToken
} from "../index";

describe('JS SDK', function () {

    describe('createToken', function () {

        test('should create token', async function () {

            let token = await createToken({type: 'test'})

            expect(token).toBeTruthy()
        })

        test('should create token with json payload', async function () {

            let token = await createToken({type: 'test', payload: {hello: 'world'}})

            expect(token).toBeTruthy()
        })

        test('should receive null when creating a token with no properties', async function () {
            try {
                let token = await createToken()

                expect(token).toBeFalsy()
            } catch (err: any) {

                expect(err.message).toBe('Missing or invalid token fields')
            }
        })
    })

    describe('createSecurityToken', function () {

        test('should create security token', async function () {

            let refId = 'some-user-id';
            let ttl = {hours: 2}

            let token = await createSecurityToken(refId, ttl)

            expect(token).toBeTruthy()
            expect(token!.refId).toBe(refId)
            expect(token!.maxUses).toBe(1)
        })
    })

    describe('createSessionToken', function () {

        test('should create security token', async function () {

            let refId = 'some-user-id';
            let ttl = {hours: 2}

            let token = await createSessionToken(refId, ttl)

            expect(token).toBeTruthy()
            expect(token!.refId).toBe(refId)
            expect(token!.maxUses).toBeFalsy()
        })
    })

    describe('listTokens', function () {

        test('should list tokens', async function () {

            await createToken({type: 'test', refId: 'some-user-id-1'})
            await createToken({type: 'test', refId: 'some-user-id-0'})

            let {tokens, count} = await listTokens()

            expect(tokens).toBeTruthy()
            expect(tokens.length).toBeGreaterThanOrEqual(2)
            expect(count).toBeGreaterThanOrEqual(2)
        })

        test('should list token with parameters', async function () {

            let now = (new Date()).getTime();
            let refId = 'some-user-id-' + now

            await createToken({type: 'test', refId})
            await createToken({type: 'test', refId})

            let {tokens, count} = await listTokens({refId}, {createdAt: 'desc'}, 0, 10)

            expect(tokens).toBeTruthy()
            expect(tokens.length).toBe(2)
            expect(count).toBe(2)
        })
    })

    describe('readToken', function () {

        test('should read token', async function () {

            let source = await createToken({type: 'test'})

            let token = await readToken(source!.id);

            expect(token).toBeTruthy()
            expect(token?.id).toEqual(source.id)
        })

        test('should receive null reading a token that doesn\'t exist', async function () {

            let token = await readToken('not-an-id');

            expect(token).toBeNull()
        })

        test('should receive null reading a token with missing id', async function () {

            // @ts-ignore
            let token = await readToken();

            expect(token).toBeNull()
        })
    })

    describe('redeemToken', function () {

        test('should redeem token', async function () {

            let source = await createToken({type: 'test', maxUses: 10})

            let token = await redeemToken(source.id);

            expect(token).toBeTruthy()
            expect(token?.id).toEqual(source.id)
            expect(token?.uses).toEqual(1)
        })

        test('should receive null when token has been already been redeemed', async function () {

            let source = await createToken({type: 'test', maxUses: 1})

            await redeemToken(source.id)
            let token = await redeemToken(source.id);

            expect(token).toBeNull()
        })

        test('should receive null redeeming a token that doesn\'t exist', async function () {

            let token = await redeemToken('not-an-id')

            expect(token).toBe(null)
        })

        test('should receive null redeeming a token with missing id', async function () {

            // @ts-ignore
            let token = await redeemToken()

            expect(token).toBe(null)
        })
    })

    describe('revokeToken', function () {

        test('should revoke token', async function () {

            let source = await createToken({type: 'test'})

            let token = await revokeToken(source.id);

            expect(token).toBeTruthy()
            expect(token?.id).toEqual(source.id)
            expect(token?.isRevoked).toBeTruthy()
        })

        test('should receive null when revoking a token that doesn\'t exist', async function () {

            let token = await revokeToken('not-an-id')

            expect(token).toBe(null)
        })

        test('should receive null when redeeming a token with missing id', async function () {

            // @ts-ignore
            let token = await revokeToken()

            expect(token).toBe(null)
        })
    })

    describe('deleteToken', function () {

        test('should delete token', async function () {

            let source = await createToken({type: 'test'})

            await deleteToken(source.id);

            expect(true).toBeTruthy()
        })

        test('should fail silently when deleting a token that doesn\'t exist', async function () {

            await deleteToken('not-an-id')

            expect(true).toBeTruthy()
        })
    })

    describe('updateToken', function () {

        test('should update a tokens type', async function () {

            let token = await createToken({type: 'test'})

            let updated = await updateToken(token.id, {type: 'test2'})

            expect(token).toBeTruthy()
            expect(updated).toBeTruthy()
            expect(updated?.type).toBe('test2')
        })

        test('should update a tokens maxUses', async function () {

            let token = await createToken({type: 'test', maxUses: 10})

            let updated = await updateToken(token.id, {maxUses: 100})

            expect(token).toBeTruthy()
            expect(updated).toBeTruthy()
            expect(updated?.maxUses).toBe(100)
        })

        test('should update a tokens refId', async function () {

            let token = await createToken({type: 'test', refId: 'hello'})

            let updated = await updateToken(token.id, {refId: 'world'})

            expect(token).toBeTruthy()
            expect(updated).toBeTruthy()
            expect(updated?.refId).toBe('world')
        })

        test('should update a tokens payload', async function () {

            let token = await createToken({type: 'test', payload: {hello: 'world'}})

            let payload = {foo: 'bar'}
            let updated = await updateToken(token.id, {payload})

            expect(token).toBeTruthy()
            expect(updated).toBeTruthy()
            expect(updated?.payload).toEqual(payload)
        })

        test('should update a tokens expiration', async function () {

            let token = await createToken({type: 'test', expiresAt: new Date()})

            let expiresAt = new Date('2040-01-01')
            let updated = await updateToken(token.id, {expiresAt})

            expect(token).toBeTruthy()
            expect(updated).toBeTruthy()
            expect(updated?.expiresAt).toEqual(expiresAt.toISOString())
        })
    })

    describe('extendExpiration', function () {

        test('should extend the expiration date of a token', async function () {

            let token = await createToken({type: 'test', expiresAt: new Date()})

            let updated = await extendExpiration(token.id, {days: 1})

            expect(token).toBeTruthy()
            expect(updated).toBeTruthy()
            // @ts-ignore
            expect(updated?.expiresAt > token?.expiresAt).toBe(true)
        })
    })
})