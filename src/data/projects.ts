/**
 * /projects — every builder project, as tiles. MOCKUP (2026-09-29, localhost).
 * The home page's Building row is the featured cut of this list.
 *
 * Sources, so nothing here is invented: each `line` is the repo's own GitHub
 * description or README (lightly edited), or the copy its tile already uses;
 * `status` is the latest GitHub release tag, "live" for a site that answered
 * 200 on 2026-09-29, "playtest" for the r0guelike Pages build, else "repo";
 * `updated` is the repo's last push per `gh repo list risukisu` that day.
 * Public repos and public sites only, plus project-r0guelike (private repo,
 * public playtest build), added at the owner's request.
 *
 * `tile` names a project's own tile (the page maps it to the component);
 * without one it gets the plain ProjectTile. `span` is its width in the
 * page's 6-column bento.
 *
 * TODO before it ships: read `updated` and `status` from the GitHub API at
 * build (the daily rebuild keeps them fresh) instead of this snapshot.
 */
export type Link = { label: "site" | "repo" | "read" | "play"; href: string };

export type TileKey = "marketing-skills" | "marketing-skills-repo" | "statusline" | "roguelike" | "skillcraft" | "blog" | "grug";

export type Project = {
  name: string;
  line: string;
  status: string;
  links: Link[];
  stack?: string;
  updated?: string; // YYYY-MM-DD, last push
  hue: string; // the shadow hue of its tile, or a site hue
  tile?: TileKey;
  span: 2 | 3 | 4 | 6;
};

export type Group = { id: string; title: string; note?: string; projects: Project[] };

const gh = (repo: string): Link => ({ label: "repo", href: `https://github.com/risukisu/${repo}` });

export const groups: Group[] = [
  {
    id: "claude-code",
    title: "For Claude Code",
    projects: [
      {
        name: "marketing-skills",
        line: "Marketing skills for Claude Code: SEO audits, content strategy, CRO, launches, reporting, and copy.",
        status: "v1.1.1",
        links: [{ label: "site", href: "https://skillcraft.cloud/marketing-skills" }, gh("marketing-skills")],
        stack: "Python",
        updated: "2026-09-28",
        hue: "#2b9d68",
        tile: "marketing-skills",
        span: 4,
      },
      {
        name: "marketing-skills repo",
        line: "The README's two install lines and the license.",
        status: "v1.1.1",
        links: [gh("marketing-skills")],
        hue: "#0e8fa6",
        tile: "marketing-skills-repo",
        span: 2,
      },
      {
        name: "claude-code-statusline",
        line: "Four lines under the Claude Code prompt: context, limits, git, and a companion. Node, zero dependencies.",
        status: "v1.1.0",
        links: [gh("claude-code-statusline")],
        stack: "JavaScript",
        updated: "2026-09-28",
        hue: "#0e8fa6",
        tile: "statusline",
        span: 2,
      },
      {
        name: "ci-agent",
        line: "A competitive intelligence agent: it scrapes competitor websites and ad libraries, then writes the report. Runs on Claude Code.",
        status: "repo",
        links: [gh("ci-agent")],
        stack: "JavaScript",
        updated: "2026-09-11",
        hue: "#2257d6",
        span: 4,
      },
    ],
  },
  {
    id: "games",
    title: "Games",
    projects: [
      {
        name: "project-r0guelike",
        line: "A turn-based tile roguelike with an ADOM feel, modernized. Canvas 2D and TypeScript, no engine.",
        status: "playtest",
        links: [{ label: "play", href: "https://risukisu.github.io/project-r0guelike/" }],
        stack: "TypeScript",
        updated: "2026-09-29",
        hue: "#b88c51",
        tile: "roguelike",
        span: 6,
      },
    ],
  },
  {
    id: "sites",
    title: "Sites",
    projects: [
      {
        name: "SkillCraft",
        line: "Skills for high-performing AI operators.",
        status: "live",
        links: [{ label: "site", href: "https://skillcraft.cloud" }],
        stack: "Next.js",
        updated: "2026-09-28",
        hue: "#c2652b",
        tile: "skillcraft",
        span: 2,
      },
      {
        name: "risu.pl",
        line: "My personal blog, a collection of my memory fragments, in a dark terminal look.",
        status: "live",
        links: [{ label: "site", href: "https://risu.pl" }, gh("blog")],
        stack: "Astro",
        updated: "2026-09-27",
        hue: "#23915a",
        tile: "blog",
        span: 2,
      },
      {
        name: "abialas.pl",
        line: "This site. It rebuilds every morning, so the GitHub year on the home page stays current.",
        status: "v0.2.0",
        links: [{ label: "site", href: "https://abialas.pl" }, gh("abialas.pl")],
        stack: "Astro",
        updated: "2026-09-29",
        hue: "#15324e",
        span: 2,
      },
    ],
  },
  {
    id: "writing",
    title: "Writing",
    projects: [
      {
        name: "Grug-Brained Marketer",
        line: "A newsletter for people tired of marketing content that sounds smart but says nothing.",
        status: "live",
        links: [{ label: "read", href: "https://grugbrained.substack.com" }],
        stack: "Substack",
        hue: "#b85a1f",
        tile: "grug",
        span: 3,
      },
      {
        name: "Grug manifesto",
        line: "Twelve rules for marketers tired of complexity.",
        status: "repo",
        links: [gh("grug-manifesto")],
        stack: "HTML",
        updated: "2026-04-06",
        hue: "#b85a1f",
        span: 3,
      },
    ],
  },
  {
    id: "tools",
    title: "Small tools",
    projects: [
      {
        name: "vanilla-stats",
        line: "A single-file GA4 traffic analyzer. Drop in CSVs and get year-over-year comparisons, algorithm-update impact, and SERP event overlays.",
        status: "repo",
        links: [gh("vanilla-stats")],
        stack: "HTML",
        updated: "2026-08-12",
        hue: "#a5700c",
        span: 3,
      },
      {
        name: "campfire-api",
        line: "The guestbook API behind the campfire on risu.pl.",
        status: "live",
        links: [{ label: "site", href: "https://risu.pl/campfire" }, gh("campfire-api")],
        stack: "JavaScript",
        updated: "2026-08-12",
        hue: "#23915a",
        span: 3,
      },
    ],
  },
  {
    id: "earlier",
    title: "Earlier",
    note: "Still public, no longer where the work happens.",
    projects: [
      {
        name: "Marketing OS",
        line: "A marketing operations system on Claude Code: 22 skills for strategy, content, growth, and operations.",
        status: "repo",
        links: [gh("marketing_os_public")],
        updated: "2026-04-09",
        hue: "#5f7384",
        span: 3,
      },
    ],
  },
];
