import "server-only";
/** Grava um token de sessão (ver `signed-session`) num cookie httpOnly seguro. */
export declare function setSignedCookie(name: string, token: string, maxAgeMs: number): Promise<void>;
export declare function clearSignedCookie(name: string): Promise<void>;
export declare function readSignedCookie(name: string): Promise<string | undefined>;
