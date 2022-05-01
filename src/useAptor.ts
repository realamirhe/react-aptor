import type { DependencyList, Ref, RefObject } from 'react';
import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

// types:api
export type APIObject = Record<string, any>; // function, class, ... as api-value
export type APIGenerator = () => APIObject;
export type GetAPI<T> = (instance: T | null, prams?: any) => APIGenerator;
// types:configuration
export type Instantiate<T, U extends HTMLElement = HTMLElement> = (
  node: U | null,
  params?: any
) => T | null;
export type Destroy<T> = (instance: T | null, params?: any) => void;

export interface AptorConfiguration<T, U extends HTMLElement = HTMLElement> {
  getAPI: GetAPI<T>;
  instantiate: Instantiate<T, U>;
  destroy?: Destroy<T>;
  params?: any;
}

/**
 * react aptor(api-connector) a hook which connect api to react itself
 * @param ref - react forwarded ref
 * @param {Object} configuration - configuration object for setup
 * @param {Array} [deps=[]] - react dependencies array
 * @return domRef - can be bound to dom element
 */
export default function useAptor<T, U extends HTMLElement = HTMLElement>(
  ref: Ref<APIObject>,
  configuration: AptorConfiguration<T, U>,
  deps: DependencyList = []
): RefObject<U> {
  const [instance, setInstance] = useState<T | null>(null);
  const domRef = useRef<U | null>(null);
  const { instantiate, destroy, getAPI, params } = configuration;

  useEffect(() => {
    const instanceReference = instantiate(domRef.current, params);
    setInstance(instanceReference);
    return () => {
      if (destroy) destroy(instanceReference, params);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const api = useMemo(() => getAPI(instance, params), [instance]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useImperativeHandle(ref, api, [api]);

  return domRef;
}
