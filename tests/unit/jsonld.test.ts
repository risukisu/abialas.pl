import { describe, it, expect } from "vitest";
import {
  personSchema,
  creativeWorkSchema,
  articleSchema,
  breadcrumbListSchema,
  collectionPageSchema,
} from "../../src/lib/jsonld";

describe("jsonld helpers", () => {
  it("personSchema returns valid schema.org Person JSON", () => {
    const p = personSchema({
      name: "Andrzej Białas",
      url: "https://abialas.pl",
      jobTitle: "Marketing Director",
      sameAs: ["https://www.linkedin.com/in/andrzejbialas/"],
    });
    expect(p["@context"]).toBe("https://schema.org");
    expect(p["@type"]).toBe("Person");
    expect(p.name).toBe("Andrzej Białas");
    expect(p.sameAs).toContain("https://www.linkedin.com/in/andrzejbialas/");
  });

  it("creativeWorkSchema returns valid CreativeWork JSON", () => {
    const w = creativeWorkSchema({
      name: "How I run marketing",
      url: "https://abialas.pl/writing/how-i-run-marketing",
      author: "Andrzej Białas",
      description: "A system for running marketing as engineering.",
    });
    expect(w["@type"]).toBe("CreativeWork");
    expect(w.name).toBe("How I run marketing");
    expect(w.author).toEqual({ "@type": "Person", name: "Andrzej Białas" });
  });
});

describe("jsonld helpers — article / breadcrumb / collection", () => {
  it("articleSchema includes headline, author, datePublished", () => {
    const a = articleSchema({
      title: "MOS",
      url: "https://abialas.pl/writing/mos",
      author: "Andrzej Białas",
      datePublished: "2024-03-01",
      description: "x",
    });
    expect(a["@type"]).toBe("Article");
    expect(a.headline).toBe("MOS");
    expect(a.datePublished).toBe("2024-03-01");
  });
  it("breadcrumbListSchema numbers positions from 1", () => {
    const b = breadcrumbListSchema([
      { name: "Home", url: "https://abialas.pl/" },
      { name: "System", url: "https://abialas.pl/system" },
    ]);
    expect(b.itemListElement[0].position).toBe(1);
    expect(b.itemListElement[1].name).toBe("System");
  });
  it("collectionPageSchema sets name + url", () => {
    const c = collectionPageSchema({
      name: "The Marketing Operating System",
      url: "https://abialas.pl/system",
      description: "x",
    });
    expect(c["@type"]).toBe("CollectionPage");
  });
});
