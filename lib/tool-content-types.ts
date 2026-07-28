export type ToolContentExample = {
  title: string;
  description: string;
  input: string;
  output: string;
};

export type ToolContentFaq = {
  question: string;
  answer: string;
};

export type ToolPageContent = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  audience: string;
  input: string;
  outcome: string;
  review: string;
  bestFor: string;
  steps: [string, string, string, string];
  useCases: [string, string, string, string];
  commonMistakes: [string, string, string];
  examples: [ToolContentExample, ToolContentExample];
  tips: [string, string, string, string];
  faq: ToolContentFaq[];
  relatedTools: string[];
  keywords: string[];
  updatedAt: string;
  seoScore: number;
};
