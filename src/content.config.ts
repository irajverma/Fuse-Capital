import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image: img }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Funded Experts'),
    tags: z.array(z.string()).optional(),
    coverImage: img().optional(),
    authorImage: img().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
