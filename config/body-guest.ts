/** Guest trials are browser-bound; network caps also bound cookie resets. */
export const bodyGuestConfig = {
  freeEdits: 1,
  cookieName: 'body_edit_guest',
  cookieMaxAgeSeconds: 365 * 24 * 60 * 60,
  maxTrialsPerNetworkDay: 5,
  maxAttemptsPerNetworkHour: 10,
  maxAttemptsPerGuestHour: 3,
} as const;
