import type { RecipeCardProps } from '@lobehub/ui';

// Sample data from the A2UI playground `RecipeCard` (CopilotKit a2ui-playground, MIT).
export const recipe: RecipeCardProps = {
  difficulty: 'Easy',
  image:
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1000&q=80&auto=format&fit=crop',
  ingredients: [
    '200 g farfalle',
    '2 cups fresh basil leaves',
    '30 g pine nuts, toasted',
    '1 clove garlic',
    '40 g parmesan, grated',
    '80 ml olive oil',
    '150 g cherry tomatoes',
  ],
  servings: 2,
  steps: [
    'Cook the farfalle in well salted water until al dente. Save a cup of pasta water.',
    'Blend basil, pine nuts, garlic and parmesan, then stream in the olive oil until smooth.',
    'Blister the tomatoes in a hot pan with a little oil, about 3 minutes.',
    'Toss pasta with pesto and a splash of pasta water until glossy, then top with the tomatoes.',
  ],
  tags: ['Vegetarian'],
  time: '25 min',
  title: 'Basil pesto farfalle with blistered tomatoes',
};
