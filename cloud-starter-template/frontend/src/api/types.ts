import type { components } from './schema';

type Schemas = components['schemas'];

export type CreateItem = Schemas['CreateItem'];
export type ErrorResponse = Schemas['ErrorResponse'];
export type HealthResponse = Schemas['HealthResponse'];
export type Item = Schemas['Item'];
export type ItemPage = Schemas['Page_Item_'];
