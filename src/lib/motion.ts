/** Motion tokens shared by animation components. Mirrors CSS easing tokens. */
export const easing = {
  outExpo: [0.16, 1, 0.3, 1],
  soft: [0.22, 1, 0.36, 1],
} as const;

export const duration = {
  fast: 0.25,
  base: 0.5,
  slow: 0.8,
} as const;

export const distance = {
  reveal: 24,
  subtle: 12,
} as const;

/** Trigger reveals slightly before elements fully enter the viewport. */
export const revealViewport = { once: true, margin: "0px 0px -8% 0px" } as const;
