export interface QuantityRepresentation {
  value: number;
  hundreds: number;
  baskets: number;
  ones: number;
  mode: 'illustrated' | 'numeric_only';
}

/**
 * Deterministic mathematical breakdown for educational visual stimulus.
 *
 * Rules:
 * - 0-9: ones only (individual apples)
 * - 10-99: baskets (groups of 10) + ones (individual apples)
 * - 100: 1 hundred box
 * - >100: numeric_only mode
 */
export function getQuantityRepresentation(val: number): QuantityRepresentation {
  const value = Math.max(0, Math.floor(val || 0));

  if (value > 100) {
    return {
      value,
      hundreds: Math.floor(value / 100),
      baskets: Math.floor((value % 100) / 10),
      ones: value % 10,
      mode: 'numeric_only',
    };
  }

  if (value === 100) {
    return {
      value,
      hundreds: 1,
      baskets: 0,
      ones: 0,
      mode: 'illustrated',
    };
  }

  const baskets = Math.floor(value / 10);
  const ones = value % 10;

  return {
    value,
    hundreds: 0,
    baskets,
    ones,
    mode: 'illustrated',
  };
}
