import { RecipeCard } from '@lobehub/ui';

import { recipe } from './data';

export default () => <RecipeCard {...recipe} style={{ maxWidth: 780 }} variant="a2ui" />;
