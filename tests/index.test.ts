import path from 'path'
require('dotenv').config({path:path.resolve(process.cwd(), 'tests/.env')})

import {createSecurityToken, createToken, setup, readToken, redeemToken, revokeToken, deleteToken} from "../index";

describe('JS SDK', function () {

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

    test('should create security token', async function () {

        let refId = 'some-user-id';
        let ttl = {hours: 2}

        let token = await createSecurityToken(refId, ttl)

        expect(token).toBeTruthy()
        expect(token!.refId).toBe(refId)
    })

    test('should read token', async function () {

        let source = await createToken({type: 'test'})

        let token = await readToken(source.id);

        expect(token).toBeTruthy()
        expect(token.id).toEqual(source.id)
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

    test('should redeem token', async function () {

        let source = await createToken({type: 'test', uses: 1, maxUses: 10})

        let token = await redeemToken(source.id);

        expect(token).toBeTruthy()
        expect(token.id).toEqual(source.id)
        expect(token.uses).toEqual(2)
    })

    test('should receive null when token has been already been redeemed', async function () {

        let source = await createToken({type: 'test', uses: 10, maxUses: 10})

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

    test('should revoke token', async function () {

        let source = await createToken({type: 'test'})

        let token = await revokeToken(source.id);

        expect(token).toBeTruthy()
        expect(token.id).toEqual(source.id)
        expect(token.isRevoked).toBeTruthy()
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