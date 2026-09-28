/**
 * Shared copy for the /dev marketing-skills tile options. Lifted verbatim
 * from nexus/MarketingSkillsTile.astro (itself verbatim from the library's
 * brand/source/hero.html).
 */
export const PAIRS: [string, string, string][] = [
  ["“audit the whole site”", "/seo-audit", "#3fd68c"],
  ["“this page isn’t converting”", "/cro", "#e8a13d"],
  ["“sounds like AI wrote it”", "/copy-deslop", "#7c8cf0"],
  ["“the blog brings no leads”", "/content-strategy", "#f08a6b"],
  ["“what would Ogilvy say?”", "/marketing-council", "#b58cf5"],
];
export const HOLD = 2.6; // s each pair stays
export const LOOP = PAIRS.length * HOLD;
export const TAGLINE = "A working marketer’s skill library for Claude Code.";
export const SR = "You say “audit the whole site”, it runs /seo-audit — and four more pairs like it.";
