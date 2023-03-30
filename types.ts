export interface ISetupOptions {
    apiKeyId?: string,
    apiUrl?: string,
}

export interface IToken {
    id: string
    type?: string,
    //group?:string,
    refId?: string,
    payload?: string | object
    uses?: number
    maxUses?: number
    expiresAt?: Date
    isRevoked?: boolean
    isEncrypted?: boolean
    isActive?: boolean
    isExpired?: boolean
    accountId?: string
    createdAt?: Date
    modifiedAt?: Date
}

export interface ITokenInput {
    type: string,
    accountId?: string
    refId?: string,
    payload?: string | object
    maxUses?: number
    expiresAt?: Date
}