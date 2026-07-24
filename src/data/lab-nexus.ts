/**
 * LAB DATA — nexus-homepage prototypes (2026-07-23). Throwaway with the
 * /lab/ routes once a variant wins. Every URL verified against
 * `gh repo list risukisu` — ga4-analyzer / vanilla-stats have no public
 * repo yet, so they are deliberately absent.
 */
export type NexusBox = {
  href: string;
  name: string;
  where?: string; // mono destination line
  desc?: string; // one honest sentence (md boxes)
  variant?: "grug" | "linkedin" | "github" | "skillcraft" | "x" | "terminal";
  icon?: string; // img path rendered before the name
  soon?: boolean; // not-yet-public badge (lab D: marketing-skills)
};

// ── Lab D rosters ──────────────────────────────────────────────────
// Top row: newsletter (dedicated GrugTile) + these two. Squirrel
// belongs to the risu/blog brand, NOT SkillCraft (owner call, lab D).
export const followD: NexusBox[] = [
  {
    href: "https://www.linkedin.com/in/andrzejbialas/",
    name: "LinkedIn",
    where: "in/andrzejbialas",
    desc: "Where I show up between essays.",
    variant: "linkedin",
  },
  {
    href: "https://risu.pl",
    name: "Blog",
    where: "risu.pl",
    desc: "The personal blog — random memories.",
    variant: "terminal",
    icon: "/squirrel.png",
  },
];

export const builtD: NexusBox[] = [
  {
    href: "https://skillcraft.cloud",
    name: "SkillCraft",
    where: "skillcraft.cloud",
    desc: "Marketplace for Claude skills.",
    variant: "skillcraft",
  },
  {
    href: "https://github.com/risukisu/claude-code-statusline",
    name: "Statusline",
    where: "github · MIT",
    desc: "3-line terminal dashboard for Claude Code. Zero deps.",
    variant: "terminal",
  },
  {
    href: "https://github.com/risukisu/marketing_os_public",
    name: "Marketing OS",
    where: "github · public",
    desc: "22 marketing skills for Claude Code.",
  },
  {
    href: "https://github.com/risukisu/grug-manifesto",
    name: "Grug Manifesto",
    where: "github · public",
    desc: "Twelve rules for marketers tired of complexity.",
  },
  {
    href: "https://github.com/risukisu/marketing-skills",
    name: "Marketing Skills",
    where: "github · open-sourcing soon",
    desc: "The full marketing skills library for Claude Code.",
    soon: true,
  },
];

export const follow: NexusBox[] = [
  {
    href: "https://grugbrained.substack.com",
    name: "Newsletter",
    where: "Grug-Brained Marketer",
    desc: "Plain words about marketing, in your inbox.",
    variant: "grug",
  },
  {
    href: "https://www.linkedin.com/in/andrzejbialas/",
    name: "LinkedIn",
    where: "in/andrzejbialas",
    desc: "Where I show up between essays.",
    variant: "linkedin",
  },
];

export const built: NexusBox[] = [
  {
    href: "https://skillcraft.cloud",
    name: "SkillCraft",
    where: "skillcraft.cloud",
    desc: "Marketplace for Claude skills.",
    variant: "skillcraft",
  },
  {
    href: "https://github.com/risukisu/claude-code-statusline",
    name: "Statusline",
    where: "github · MIT",
    desc: "3-line terminal dashboard for Claude Code. Zero deps.",
    variant: "terminal",
  },
  {
    href: "https://github.com/risukisu/marketing_os_public",
    name: "Marketing OS",
    where: "github · public",
    desc: "22 marketing skills for Claude Code.",
  },
  {
    href: "https://github.com/risukisu/grug-manifesto",
    name: "Grug Manifesto",
    where: "github · public",
    desc: "Twelve rules for marketers tired of complexity.",
  },
];

export const read: NexusBox[] = [
  { href: "/writing", name: "Essays", where: "on this site" },
  { href: "https://risu.pl", name: "Blog", where: "risu.pl", variant: "terminal" },
];

export const more: NexusBox[] = [
  { href: "/work", name: "Résumé", where: "career + PDF" },
  { href: "https://github.com/risukisu", name: "GitHub", where: "github.com/risukisu", variant: "github" },
  { href: "https://x.com/risu_kisu", name: "X", where: "@risu_kisu", variant: "x" },
];
