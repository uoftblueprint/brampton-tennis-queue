// api.d.ts
export declare const fetchCurrentState: (locationName: string, retries?: number, delay?: number) => Promise<any>;
export declare const endSession: (locationName: string, firebaseUID: string, retries?: number, delay?: number) => Promise<any>;
export declare const joinGame: (locationName: string, nickname: string, firebaseUID: string, token: string, retries?: number, delay?: number) => Promise<any>;
export declare const leaveQueue: (locationName: string, firebaseUID: string, retries?: number, delay?: number) => Promise<any>;
export declare const sendWebNotification: (locationName: string, uid: string, message: any, retries?: number, delay?: number) => Promise<any>;
export declare const getTaken: (locationName: string, retries?: number, delay?: number) => Promise<any>;
export declare const addUnknowns: (locationName: string, courts: any, retries?: number, delay?: number) => Promise<any>;
export declare const expectedWaitTime: (locationName: string, retries?: number, delay?: number) => Promise<any>;
export declare const subscribeToLocation: (location: string, updateState: Function) => Function;
