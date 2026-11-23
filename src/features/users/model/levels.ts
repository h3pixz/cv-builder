export type LevelItem = {
  name: string;
  /** Numeric level used by the `Level` meter. */
  level: number;
  /** Raw mastery/proficiency value shown next to the meter. */
  levelLabel: string;
};

export type LevelGroup = {
  id: string;
  name: string;
  items: LevelItem[];
};
