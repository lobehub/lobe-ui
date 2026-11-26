import { StatCard } from '@lobehub/ui/dashboard';
import { TrendingUp } from 'lucide-react';

// Sample data from the A2UI playground `Stat` (CopilotKit a2ui-playground, MIT).
export default () => (
  <StatCard
    delta="+12.4%"
    hint="vs. September, 1,284 active accounts"
    label="Monthly recurring revenue"
    mark={TrendingUp}
    value="$48.2k"
    variant="a2ui"
  />
);
