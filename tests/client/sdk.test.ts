import path from 'path'
require('dotenv').config({path:path.resolve(process.cwd(), '.env')})
import {describe} from "@jest/globals";
import {createToken, deleteToken, readToken, redeemToken, revokeToken} from 'x-tkn'
// import {createToken, deleteToken, readToken, redeemToken, revokeToken} from '../../dist'

describe('sdk', () => {

    describe('createToken', () => {

        it('should create token', async () => {

            const token = await createToken({
                type: 'test',
            });

            expect(token).toBeTruthy();
        });
    })

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
})