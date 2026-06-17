type PersonInput = {
  name: string;
  url: string;
  jobTitle?: string;
  sameAs?: string[];
};

type CreativeWorkInput = {
  name: string;
  url: string;
  author: string;
  description?: string;
  datePublished?: string;
};

export function personSchema(input: PersonInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    url: input.url,
    ...(input.jobTitle && { jobTitle: input.jobTitle }),
    ...(input.sameAs && { sameAs: input.sameAs }),
  };
}

export function creativeWorkSchema(input: CreativeWorkInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.name,
    url: input.url,
    author: { "@type": "Person", name: input.author },
    ...(input.description && { description: input.description }),
    ...(input.datePublished && { datePublished: input.datePublished }),
  };
}

type ArticleInput = {
  title: string;
  url: string;
  author: string;
  datePublished?: string;
  description?: string;
};

export function articleSchema(input: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    url: input.url,
    author: { "@type": "Person", name: input.author },
    ...(input.datePublished && { datePublished: input.datePublished }),
    ...(input.description && { description: input.description }),
  };
}

export function breadcrumbListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, n) => ({
      "@type": "ListItem",
      position: n + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

type CollectionInput = {
  name: string;
  url: string;
  description?: string;
};

export function collectionPageSchema(input: CollectionInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    url: input.url,
    ...(input.description && { description: input.description }),
  };
}
