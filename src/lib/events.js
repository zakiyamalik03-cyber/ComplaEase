import { EventEmitter } from "events";

export const complaintEvents = new EventEmitter();
// Allow unlimited listeners in dev environments to avoid warnings on HMR
complaintEvents.setMaxListeners(0);

export function emitComplaintUpdate(payload) {
  complaintEvents.emit("update", payload);
}