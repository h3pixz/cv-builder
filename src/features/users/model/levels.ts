export type LevelItem = {
  name: string;
  level: number;
  levelLabel: string;
};

export type LevelGroup = {
  id: string;
  name: string;
  items: LevelItem[];
};
