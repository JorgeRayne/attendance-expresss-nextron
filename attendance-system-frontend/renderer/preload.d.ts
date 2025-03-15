import { IpcHandler } from "../main/preload";

declare global {
  interface Window {
    timeInterval?: NodeJS.Timeout; // Make the type optional since it may not exist at all times.
  }
}

export {};
