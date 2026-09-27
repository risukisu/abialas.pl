/**
 * GA4 for abialas.pl — its own property in the "risu" GA account, not
 * risu.pl's (owner call 2026-09-27). Consent setup mirrors risu.pl:
 * Advanced Consent Mode, everything denied until the visitor accepts,
 * choice kept in localStorage under `cookie-consent`.
 *
 * Empty = no analytics and no cookie banner: Analytics.astro and
 * CookieConsent.astro render nothing. A build can override it with
 * PUBLIC_GA_ID (local testing).
 */
// Property "abialas.pl" (556161396), web stream for https://abialas.pl.
export const GA_ID = "G-Y1TK5QC2QD";

/** localStorage key, same as risu.pl so the two sites read alike. */
export const CONSENT_KEY = "cookie-consent";
