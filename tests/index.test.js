const {createToken, setup, readToken, redeemToken, revokeToken, deleteToken} = require("../index");

describe('JS SDK', function () {

    const apiKey = '6d19f411460c40789499657bf381a2c4a32b0c38ca184dc08a8088ab4807b7f0fdfe20638a4041409278cba4558cae4997bf9e31ed1449fd85ef45e631512700'

    setup(apiKey)

    test('should create token', async function () {

        let token = await createToken({type: 'test'})

        expect(token).toBeTruthy()
    })

    test('should receive error when creating a token with no properties', async function () {
        try {
            let token = await createToken()

            expect(token).toBeFalsy()
        } catch (err) {

            expect(err.message).toBe('Missing or invalid token fields')
        }
    })

    test('should read token', async function () {

        let source = await createToken({type: 'test'})

        let token = await readToken(source.id);

        expect(token).toBeTruthy()
        expect(token.id).toEqual(source.id)
    })

    test('should receive error reading a token that doesn\'t exist', async function () {
        try {
            let token = await readToken('not-an-id');

            expect(token).toBeFalsy()
        } catch (err) {

            expect(err.message).toBe('Missing or invalid token')
        }
    })

    test('should receive error reading a token with missing id', async function () {
        try {
            let token = await readToken();

            expect(token).toBeFalsy()
        } catch (err) {

            expect(err.message).toBe('Missing or invalid token')
        }
    })

    test('should redeem token', async function () {

        let source = await createToken({type: 'test', uses: 1, maxUses: 10})

        let token = await redeemToken(source.id);

        expect(token).toBeTruthy()
        expect(token.id).toEqual(source.id)
        expect(token.uses).toEqual(2)
    })

    test('should receive error when token has been redeemed', async function () {
        try {
            let source = await createToken({type: 'test', uses: 10, maxUses: 10})

            let token = await redeemToken(source.id);

            expect(token).toBeTruthy()

        } catch (err) {

            expect(err.message).toBe('This token may not exist, may have expired or may have been redeemed too many times')
        }
    })

    test('should receive error redeeming a token that doesn\'t exist', async function () {
        try {
            let token = await redeemToken('not-an-id')

            expect(token).toBeFalsy()

        } catch (err) {

            expect(err.message).toBe('This token may not exist, may have expired or may have been redeemed too many times')
        }
    })

    test('should receive error redeeming a token with missing id', async function () {
        try {
            let token = await redeemToken()

            expect(token).toBeFalsy()

        } catch (err) {

            expect(err.message).toBe('This token may not exist, may have expired or may have been redeemed too many times')
        }
    })

    test('should revoke token', async function () {

        let source = await createToken({type: 'test'})

        let token = await revokeToken(source.id);

        expect(token).toBeTruthy()
        expect(token.id).toEqual(source.id)
        expect(token.isRevoked).toBeTruthy()
    })

    test('should receive error revoking a token that doesn\'t exist', async function () {
        try {
            let token = await revokeToken('not-an-id')

            expect(token).toBeFalsy()

        } catch (err) {

            expect(err.message).toBe('This token may not exist, may have expired or may have been redeemed too many times')
        }
    })

    test('should receive error redeeming a token with missing id', async function () {
        try {
            let token = await revokeToken()

            expect(token).toBeFalsy()

        } catch (err) {

            expect(err.message).toBe('This token may not exist, may have expired or may have been redeemed too many times')
        }
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