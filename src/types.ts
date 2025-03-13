import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface Options {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
}

export interface User {
  username: string;
  avatarUrl: string;
}

export interface Recipe {
  id: string;
  name: string;
  cover: null | {
    type: string;
    external: {
      url: string;
    };
  };
  url: string;
  properties: {
    kcal: number | null;
    protein: number | null;
    weight: number | null;
    parentItemRelation: { id: string }[];
    subItemRelations: { id: string }[];
    ingredients: Recipe[];
  };
}

export interface OpenFoodFactsIngredient {
  code?: string;
  product?: {
    brands_tags?: string[];
    carbohydrates_100g?: number;
    'energy-kcal_100g'?: number;
    energy_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    image_url?: string;
    product_name?: string;
    proteins_100g?: number;
    salt_100g?: number;
    serving_quantity?: string;
    serving_quantity_unit?: string;
    stores_tags?: string[];
    sugars_100g?: number;
  };
  status: number;
  status_verbose: string;
}

export type FormItem = { label: string; value: string };

export interface StyleParams {
  [index: string]: string;
}
