'use client';

import clsx from 'clsx';
import { ChefHat, Clock, type LucideIcon, Users } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

import { Checkbox } from '@/Checkbox';
import cardsMessages from '@/i18n/resources/en/cards';
import { useTranslation } from '@/i18n/useTranslation';
import CoverImage from '@/internal/a2ui/CoverImage';
import { domainStyles } from '@/internal/a2ui/domain';
import { a2uiStyles, a2uiToneSoft } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';

import { recipeCardClasses } from './stable';
import { styles } from './style';
import type { RecipeCardProps } from './type';

/**
 * A recipe: cover image, title, time / servings / difficulty chips, an ingredient checklist
 * with a progress bar, and numbered steps; two columns once the card is 520px wide. A plain
 * lobe-ui card (`default`) or the A2UI playground card (`a2ui`). Adapted from CopilotKit
 * a2ui-playground (MIT), `renderers/domain.tsx` RecipeCard.
 */
const RecipeCard = memo<RecipeCardProps>(
  ({
    checked: checkedProp,
    className,
    classNames,
    defaultChecked,
    difficulty,
    image,
    ingredients: ingredientsProp,
    onCheckedChange,
    ref,
    servings,
    steps: stepsProp,
    style,
    styles: customStyles,
    tags: tagsProp,
    texts,
    time,
    title,
    variant = 'default',
    ...rest
  }) => {
    const isA2ui = variant === 'a2ui';
    const { t } = useTranslation(cardsMessages);
    const ingredients = (ingredientsProp ?? []).filter((s) => typeof s === 'string');
    const steps = (stepsProp ?? []).filter((s) => typeof s === 'string');
    const tags = (tagsProp ?? []).filter((tag) => typeof tag === 'string' && tag);

    const [innerChecked, setInnerChecked] = useState<number[]>(() => defaultChecked ?? []);
    const checked = new Set(checkedProp ?? innerChecked);
    const toggle = useCallback(
      (index: number) => {
        const next = new Set(checkedProp ?? innerChecked);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        const list = [...next].sort((a, b) => a - b);
        if (checkedProp === undefined) setInnerChecked(list);
        onCheckedChange?.(list);
      },
      [checkedProp, innerChecked, onCheckedChange],
    );
    const doneCount = ingredients.filter((_, i) => checked.has(i)).length;

    const meta = [
      time ? { icon: Clock, value: time } : null,
      typeof servings === 'number'
        ? {
            icon: Users,
            value: (texts?.servings ?? t('recipeCard.servings')).replace(
              '{count}',
              String(servings),
            ),
          }
        : null,
      difficulty ? { icon: ChefHat, value: difficulty } : null,
    ].filter(Boolean) as { icon: LucideIcon; value: string }[];

    const label = isA2ui ? a2uiStyles.label : styles.dLabel;

    return (
      <div
        ref={ref}
        {...rest}
        {...styleProps(
          isA2ui
            ? [a2uiStyles.base, a2uiStyles.card, styles.root]
            : [domainStyles.dCard, styles.root],
          clsx(recipeCardClasses(), className, classNames?.root),
          { ...style, ...customStyles?.root },
        )}
        data-variant={variant}
      >
        {image ? (
          <div
            {...styleProps(
              styles.cover,
              clsx(recipeCardClasses('cover'), classNames?.cover),
              customStyles?.cover,
            )}
          >
            <CoverImage alt={typeof title === 'string' ? title : ''} src={image} />
            <div {...styleProps(styles.coverFade)} />
          </div>
        ) : null}
        <div
          {...styleProps(
            [styles.header, image ? styles.headerWithCover : styles.headerNoCover],
            clsx(recipeCardClasses('header'), classNames?.header),
            customStyles?.header,
          )}
        >
          <span
            {...styleProps([styles.title, !isA2ui && styles.dTitle], recipeCardClasses('title'))}
          >
            {title}
          </span>
          {meta.length > 0 || tags.length > 0 ? (
            <div {...styleProps(domainStyles.chips, recipeCardClasses('chips'))}>
              {meta.map((m) =>
                isA2ui ? (
                  <span key={m.value} {...styleProps(domainStyles.chip, recipeCardClasses('chip'))}>
                    <m.icon aria-hidden size={12} />
                    {m.value}
                  </span>
                ) : (
                  <Tag
                    className={recipeCardClasses('chip')}
                    icon={<m.icon size={12} />}
                    key={m.value}
                  >
                    {m.value}
                  </Tag>
                ),
              )}
              {tags.map((tag) =>
                isA2ui ? (
                  <span
                    key={tag}
                    {...styleProps(
                      [domainStyles.chip, a2uiToneSoft.accent],
                      recipeCardClasses('tag'),
                    )}
                  >
                    {tag}
                  </span>
                ) : (
                  <Tag className={recipeCardClasses('tag')} color="purple" key={tag}>
                    {tag}
                  </Tag>
                ),
              )}
            </div>
          ) : null}
        </div>
        <div {...styleProps(styles.content, recipeCardClasses('content'))}>
          <div
            {...styleProps(
              styles.column,
              clsx(recipeCardClasses('ingredients'), classNames?.ingredients),
              customStyles?.ingredients,
            )}
          >
            <div {...styleProps(styles.sectionHead)}>
              <span {...styleProps(label)}>
                {texts?.ingredients ?? t('recipeCard.ingredients')}
              </span>
              <span
                {...styleProps(
                  [styles.count, !isA2ui && styles.dCount],
                  recipeCardClasses('count'),
                )}
              >
                {doneCount}/{ingredients.length}
              </span>
            </div>
            <div
              aria-hidden
              {...styleProps(
                [styles.progress, !isA2ui && styles.dProgress],
                recipeCardClasses('progress'),
              )}
            >
              <div
                {...styleProps([styles.progressBar, !isA2ui && styles.dProgressBar], undefined, {
                  width: `${ingredients.length > 0 ? (doneCount / ingredients.length) * 100 : 0}%`,
                })}
              />
            </div>
            <ul {...styleProps(styles.list)}>
              {ingredients.map((ingredient, i) => {
                const isDone = checked.has(i);
                return (
                  <li key={i}>
                    <label
                      data-checked={isDone || undefined}
                      {...styleProps(
                        [styles.ingredient, !isA2ui && styles.dIngredient],
                        recipeCardClasses('ingredient'),
                      )}
                    >
                      <Checkbox
                        checked={isDone}
                        style={{ flexShrink: 0, marginTop: isA2ui ? 1 : 3 }}
                        // The playground's unticked box keeps the stronger input hairline.
                        styles={
                          isA2ui && !isDone
                            ? { checkbox: { borderColor: 'var(--lobe-color-border)' } }
                            : undefined
                        }
                        onChange={() => toggle(i)}
                      />
                      <span
                        {...styleProps([
                          styles.ingredientText,
                          !isA2ui && styles.dIngredientText,
                          isDone && styles.done,
                        ])}
                      >
                        {ingredient}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
          <div
            {...styleProps(
              styles.column,
              clsx(recipeCardClasses('steps'), classNames?.steps),
              customStyles?.steps,
            )}
          >
            <span {...styleProps(label)}>{texts?.steps ?? t('recipeCard.steps')}</span>
            <ol {...styleProps(styles.steps)}>
              {steps.map((step, i) => (
                <li key={i} {...styleProps(styles.step, recipeCardClasses('step'))}>
                  <span
                    {...styleProps(
                      [styles.stepNumber, isA2ui ? a2uiToneSoft.accent : styles.dStepNumber],
                      recipeCardClasses('step-number'),
                    )}
                  >
                    {i + 1}
                  </span>
                  <span {...styleProps([styles.stepText, !isA2ui && styles.dStepText])}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  },
);

RecipeCard.displayName = 'RecipeCard';

export default RecipeCard;
