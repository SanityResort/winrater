import Color from 'color'

export interface Match {
  score: Score
  id: number
  category: Category
}

export enum Score {
  Win = 1,
  Draw = 0.5,
  Loss = 0
}

export type Category = { name: string; valid: boolean; foreground: Color; background: Color }
export const Blackbox = {
  name: 'Blackbox',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const Competitive = {
  name: 'Competitive',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 0, g: 255, b: 0 })
} as const satisfies Category
export const League = {
  name: 'League',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 0, g: 0, b: 255 })
} as const satisfies Category
export const Ranked = {
  name: 'Ranked',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const Unranked = {
  name: 'Unranked',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const Legacy_Blackbox = {
  name: 'Blackbox 2016',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const Academy = {
  name: 'Academy',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const Faction = {
  name: 'Faction',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const Stunty_Leeg = {
  name: 'Stunty Leeg',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const DivX = {
  name: 'DivX',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const FFB_Test = {
  name: 'FFB Test',
  valid: false,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const Fantasy_Football = {
  name: 'Legacy Test',
  valid: false,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const LRB4 = {
  name: 'LRB4',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const Transfer = {
  name: 'Transfer Division',
  valid: false,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const Transfer2 = {
  name: 'Transfer Division 2',
  valid: false,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const Ladder = {
  name: 'Ladder',
  valid: true,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
export const Unknown = {
  name: 'Unknown',
  valid: false,
  foreground: Color.rgb({ r: 255, g: 255, b: 255 }),
  background: Color.rgb({ r: 255, g: 0, b: 0 })
} as const satisfies Category
