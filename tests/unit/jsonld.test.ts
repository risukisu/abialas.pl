import { describe, it, expect } from "vitest";
import { personSchema, creativeWorkSchema } from "../../src/lib/jsonld";

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
      name: "Marketing Operating System",
      url: "https://abialas.pl/writing/marketing-operating-system",
      author: "Andrzej Białas",
      description: "A system for running marketing as engineering.",
    });
    expect(w["@type"]).toBe("CreativeWork");
    expect(w.name).toBe("Marketing Operating System");
    expect(w.author).toEqual({ "@type": "Person", name: "Andrzej Białas" });
  });
});
