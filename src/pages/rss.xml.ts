import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { sortByDate, publishedOnly } from "../lib/pieces";

export async function GET(context: APIContext) {
  const all = await getCollection("writing");
  const items = sortByDate(publishedOnly(all));
  return rss({
    title: "Andrzej Białas — Writing",
    description: "Essays on marketing systems, plainly.",
    site: context.site ?? "https://abialas.pl",
    items: items.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.summary ?? "",
      link: `/writing/${p.slug}/`,
    })),
  });
}
