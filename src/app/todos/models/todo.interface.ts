export type BaseEntity = { 
  id: string,
  active: boolean
};

export interface TodoInterface extends BaseEntity {
  value: string;
  done: boolean;
}
