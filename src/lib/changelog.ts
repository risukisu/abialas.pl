/**
 * The site's change history, read from git at build time for
 * /dev/changelog/. Subject lines only: bodies can carry working notes
 * that were never meant for a page. deploy.yml checks out the full
 * history (fetch-depth: 0); a shallow clone is reported, not hidden.
 */
import { execFileSync } from "node:child_process";

export const REPO = "https://github.com/risukisu/abialas.pl";

export interface Change {
  sha: string;
  short: string;
  /** Commit date, YYYY-MM-DD in the committer's time zone. */
  date: string;
  /** The prefix before the first colon ("css", "skills tile"), if any. */
  area?: string;
  text: string;
}

export interface Changelog {
  changes: Change[];
  shallow: boolean;
  /** The commit this build was made from. */
  head?: { sha: string; short: string };
}

const git = (args: string[]) =>
  execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

/** "css: real italics" → area "css", text "real italics". */
export function splitSubject(subject: string): Pick<Change, "area" | "text"> {
  const m = subject.match(/^([\w .\/()-]{1,32}): (.+)$/);
  return m ? { area: m[1], text: m[2] } : { text: subject };
}

export function readChangelog(): Changelog {
  try {
    const log = git(["log", "--no-merges", "--format=%H%x1f%h%x1f%cs%x1f%s"]);
    const changes = log
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [sha, short, date, subject] = line.split("\x1f");
        return { sha, short, date, ...splitSubject(subject) };
      });
    const shallow = git(["rev-parse", "--is-shallow-repository"]).trim() === "true";
    const sha = git(["rev-parse", "HEAD"]).trim();
    return { changes, shallow, head: { sha, short: sha.slice(0, 7) } };
  } catch {
    return { changes: [], shallow: false };
  }
}

/** Newest day first, each day's changes in commit order (newest first). */
export function byDay(changes: Change[]): [string, Change[]][] {
  const days = new Map<string, Change[]>();
  for (const c of changes) days.set(c.date, [...(days.get(c.date) ?? []), c]);
  return [...days.entries()];
}
