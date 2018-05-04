import { TParser } from './types';

type TPredicate = (...args: any[]) => boolean;

export const fetchData = (parse: TParser) => (url: string): Promise<any> => {
  return fetch(url)
    .then(
      (res: Response) =>
        res.ok
          ? res.text()
          : res.text().then(str => Promise.reject(new Error(str)))
    )
    .then(parse);
};

export const notString = (value: any): boolean => typeof value !== 'string';

export const pipeP = (...fns: Function[]) => (...args: any[]): Promise<any> =>
  fns.reduce(
    (prev: Promise<any>, fn: Function) => prev.then(v => fn(v)),
    Promise.resolve(args)
  );
export const some = (predicate: TPredicate) => (arr: any[]): boolean =>
  arr.some(predicate);

/**
 * @param obj flat object with primitives or arrays of primitives as values
 * @returns query string for obj
 */
export const createQS = (obj: Object): string =>
  Object.entries(obj)
    .map(([key, valueOrValues]) => {
      return Array.isArray(valueOrValues)
        ? valueOrValues.map(v => `${key}[]=${v}`).join('&')
        : `${key}=${valueOrValues}`;
    })
    .join('&');
