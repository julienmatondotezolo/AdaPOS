// socket.ts
import { io } from "socket.io-client";

const DEV_MODE: string | undefined = process.env.NEXT_PUBLIC_DEBUG_MODE;
const socketUrl: string | undefined = process.env.NEXT_PUBLIC_SOCKET_URL;

export const socket = DEV_MODE ? null : io(socketUrl!);

// // Check if the code is running in a browser environment
// const isBrowser = typeof window !== "undefined";

// // Initialize the socket only if the code is running in the browser
// export const socket = isBrowser ? io("http://localhost:3333") : undefined;
