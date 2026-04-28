import type { CollectionEntry } from "astro:content";

type PieceLike = {
  data: {
    order: number;
    status: "published" | "draft";
    featured?: boolean;
  };
};

export function sortByOrder<T extends PieceLike>(pieces: T[]): T[] {
  return [...pieces].sort((a, b) => a.data.order - b.data.order);
}

export function publishedOnly<T extends PieceLike>(pieces: T[]): T[] {
  return pieces.filter((p) => p.data.status === "published");
}

export function featuredPieces<T extends PieceLike>(pieces: T[], limit = 3): T[] {
  return sortByOrder(publishedOnly(pieces).filter((p) => p.data.featured)).slice(0, limit);
}

export type WritingEntry = CollectionEntry<"writing">;
