/**
 * Nexus rosters — the homepage's link tiles (spec 2026-08-17).
 * GrugTile / SkillCraftTile / MarketingSkillsTile are component-owned
 * and do NOT appear here. Statusline / Marketing OS / Grug Manifesto
 * were removed for launch (post-launch revisit; Marketing OS likely
 * deprecated). URLs verified against `gh repo list risukisu` during
 * the lab arc; ga4-analyzer / vanilla-stats join when public.
 */
export type NexusBox = {
  href: string;
  name: string;
  where?: string; // mono destination line
  desc?: string; // one honest sentence
  variant?: "grug" | "linkedin" | "github" | "skillcraft" | "x" | "terminal";
  icon?: string; // img path rendered before the name
  soon?: boolean; // not-yet-public badge
};

export const follow: NexusBox[] = [
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

export const more: NexusBox[] = [
  { href: "/work", name: "Résumé", where: "career + PDF" },
  { href: "https://github.com/risukisu", name: "GitHub", where: "github.com/risukisu", variant: "github" },
  { href: "https://x.com/risu_kisu", name: "X", where: "@risu_kisu", variant: "x" },
];
