import * as TooltipModule from '@base-ui/react/tooltip';

type BaseTooltipNamespace = typeof TooltipModule.Tooltip;

const BaseTooltip = ((TooltipModule as any).Tooltip ?? (TooltipModule as any)) as BaseTooltipNamespace;

export { BaseTooltip };
export type { BaseTooltipNamespace };
