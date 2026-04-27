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
