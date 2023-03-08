declare let axios: any;
declare let API_URL: string;
declare let API_KEY_ID: string;
declare function del(url: string): Promise<any>;
declare function get(url: string): Promise<any>;
declare function patch(url: string, props?: unknown): Promise<any>;
declare function post(url: string, props?: unknown): Promise<any>;
declare function sanitize(data?: any): any;
declare function config(): {
    headers: {
        authorization: string;
    };
};
declare function handleError(err: any): void;
interface IToknizeOptions {
    apiKeyId?: string;
    apiUrl?: string;
}
