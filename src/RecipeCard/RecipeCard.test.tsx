import { fireEvent, render, screen } from '@testing-library/react';

import RecipeCard from './RecipeCard';

const props = {
  difficulty: 'Easy',
  ingredients: ['200 g farfalle', '1 clove garlic', '80 ml olive oil'],
  servings: 2,
  steps: ['Cook the pasta.', 'Blend the pesto.'],
  tags: ['Vegetarian'],
  time: '25 min',
  title: 'Pesto farfalle',
};

describe('RecipeCard', () => {
  test('renders chips, the checklist and numbered steps', () => {
    const { container } = render(<RecipeCard {...props} />);
    expect(screen.getByText('25 min')).toBeTruthy();
    expect(screen.getByText('2 servings')).toBeTruthy();
    expect(screen.getByText('Vegetarian')).toBeTruthy();
    expect(screen.getByText('0/3')).toBeTruthy();
    expect(container.querySelectorAll('.lobe-recipe-card__ingredient')).toHaveLength(3);
    const numbers = [...container.querySelectorAll('.lobe-recipe-card__step-number')];
    expect(numbers.map((n) => n.textContent)).toEqual(['1', '2']);
  });

  test('ticks ingredients off and reports the indexes', () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <RecipeCard {...props} variant="a2ui" onCheckedChange={onCheckedChange} />,
    );
    const boxes = container.querySelectorAll('[role="checkbox"]');
    fireEvent.click(boxes[2]);
    fireEvent.click(boxes[0]);
    expect(onCheckedChange).toHaveBeenLastCalledWith([0, 2]);
    expect(screen.getByText('2/3')).toBeTruthy();
    expect(container.querySelectorAll('.lobe-recipe-card__ingredient[data-checked]')).toHaveLength(
      2,
    );
  });

  test('follows a controlled checked list', () => {
    render(<RecipeCard {...props} checked={[1]} />);
    expect(screen.getByText('1/3')).toBeTruthy();
  });

  test('defaults to the lobe-ui variant and switches to a2ui', () => {
    const { container, rerender } = render(<RecipeCard {...props} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    const defaultClass = root.className;
    rerender(<RecipeCard {...props} variant="a2ui" />);
    expect(root.dataset.variant).toBe('a2ui');
    expect(root.className).not.toBe(defaultClass);
  });
});
