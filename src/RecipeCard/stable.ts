import { stableClasses } from '@/utils/bem';

export const recipeCardClasses = stableClasses({
  block: 'recipe-card',
  dataAttributes: ['variant'],
  elements: [
    'cover',
    'header',
    'title',
    'chips',
    'chip',
    'tag',
    'content',
    'ingredients',
    'count',
    'progress',
    'ingredient',
    'steps',
    'step',
    'step-number',
  ],
});
