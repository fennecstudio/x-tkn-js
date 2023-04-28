import path from 'path'

require('dotenv').config({path: path.resolve(process.cwd(), '../.env')})
import {describe, jest} from "@jest/globals";
// import {
//     createToken, createSecurityToken, createSessionToken, createShortCode, deleteToken, readToken, redeemToken, revokeToken, revokeTokens, updateToken, listTokens
// } from 'x-tkn'
import {
    createToken, createSecurityToken, createSessionToken, createShortCode, deleteToken, readToken, redeemToken, revokeToken, revokeTokens, updateToken, listTokens
} from '../../dist'

describe('sdk', () => {

    jest.setTimeout(20 * 1000)

    it('should create token', async () => {

        const token = await createToken({
            type: 'test',
        });

        expect(token).toBeTruthy();
    });

    it('should create security token', async () => {

        let refId = 'some-user-id';
        let ttl = {hours: 2}

        const token = await createSecurityToken(refId, ttl);

        expect(token).toBeTruthy();
    });

    it('should create session token', async () => {

        let refId = 'some-user-id';
        let ttl = {hours: 2}
        let payload = {some: 'payload'}
        let type = 'some-type'

        const token = await createSessionToken(refId, ttl, payload, type);

        expect(token).toBeTruthy();
        expect(token!.refId).toBe(refId)
        expect(token!.payload).toEqual(payload)
        expect(token!.type).toEqual(type)
        expect(token!.maxUses).toBeFalsy()
    });

    it('should create short code', async () => {

        let refId = 'some-ref-id';
        let ttl = {hours: 2}

        const token = await createShortCode(refId, ttl);

        expect(token).toBeTruthy();
        expect(token?.shortCode).toBeTruthy();
    });

    it('should read token', async () => {

        const source = await createToken({
            type: 'test',
        });

        const token = await readToken(source!.id)

        expect(token).toBeTruthy()
        expect(token!.id).toBe(source!.id)
    });

    it('should redeem token', async () => {

        const source = await createToken({
            type: 'test',
            maxUses: 0
        });

        const token = await redeemToken(source!.id)

        expect(token).toBeTruthy()
        expect(token!.id).toBe(source!.id)
    });

    it('should redeem token', async () => {

        const source = await createToken({
            type: 'test',
            maxUses: 0
        });

        const token = await revokeToken(source!.id)

        expect(token).toBeTruthy()
        expect(token!.id).toBe(source!.id)
        expect(token!.isRevoked).toBe(true)
    });

    it('should delete token', async () => {

        const source = await createToken({
            type: 'test',
            maxUses: 0
        });

        await deleteToken(source!.id)

        const token = await readToken(source!.id)

        expect(token).toBeNull()
    });

    it('should list tokens', async () => {

        const {tokens, count} = await listTokens()

        expect(tokens).toBeTruthy()
        expect(count).toBeGreaterThan(0)
    });

    it('should list tokens by type', async () => {

        const {tokens, count} = await listTokens({type: 'test'})

        let actualCount = tokens?.filter((t: { type: string; }) => t.type === 'test').length

        expect(actualCount).toBe(tokens.length)
        expect(count).toBeGreaterThan(0)
    });

    it('should list tokens by refId', async () => {

        let refId = 'some-user-id-' + Math.random();

        await createToken({type: 'test', refId})

        const {tokens, count} = await listTokens({refId})

        let actualCount = tokens?.filter((t: { refId: string; }) => t.refId === refId).length

        expect(actualCount).toBe(count)
        expect(count).toBe(1)
    });

    it('should revoke token', async function () {

        let source = await createToken({type: 'test'})

        let token = await revokeToken(source.id);

        expect(token).toBeTruthy()
        expect(token?.id).toEqual(source.id)
        expect(token?.isRevoked).toBeTruthy()
    })

    it('should revoke tokens', async function () {

        let type = 'test-' + (new Date()).getTime()
        await createToken({type})
        await createToken({type})

        let {tokens} = await revokeTokens({type});

        expect(tokens).toBeTruthy()
        expect(tokens).toHaveLength(2)
        for (let token of tokens) {
            expect(token?.isRevoked).toBeTruthy()
        }
    })

    it('should update a token', async function () {

        let token = await createToken({type: 'test'})

        let updated = await updateToken(token.id, {type: 'test2'})

        expect(token).toBeTruthy()
        expect(updated).toBeTruthy()
        expect(updated?.type).toBe('test2')
    })

})