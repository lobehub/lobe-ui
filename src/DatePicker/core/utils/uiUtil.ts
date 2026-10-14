// ====================== Mode ======================
export function getRealPlacement(placement: string | undefined, rtl: boolean) {
  if (placement !== undefined) {
    return placement;
  }
  return rtl ? 'bottomRight' : 'bottomLeft';
}
