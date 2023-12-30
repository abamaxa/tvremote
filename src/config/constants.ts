//export const IS_BROWSER = typeof window !== 'undefined';
//export const IS_SERVER = typeof window === 'undefined';

export const API_URL = process.env.API_URL as string;

export const FORCE_PLAYER_MODE = process.env.FORCE_PLAYER_MODE === "true";
