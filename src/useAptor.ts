import type { DependencyList, Ref, RefObject } from 'react';
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

// types:api
// NOTE: There is no limitation in api return value
// Every thing it returns will directly get placed in the `ref.current`
export type APIGenerator = () => any;

export type GetAPI<TInstance, TParams> = (
  instance: TInstance | null,
  prams?: TParams
) => APIGenerator;

// types:configuration
export type Instantiate<TInstance, TElement, TParams> = (
  node: TElement | null,
  params?: TParams
) => TInstance | null;

export type Destroy<TInstance, TParams> = (
  instance: TInstance | null,
  params?: TParams
) => void;

export interface AptorConfiguration<TInstance, TElement, TParams> {
  getAPI: GetAPI<TInstance, TParams>;
  instantiate: Instantiate<TInstance, TElement, TParams>;
  destroy?: Destroy<TInstance, TParams>;
  params?: TParams;
}

/**
 * react aptor(api-connector) a hook which connect api to react itself
 * @param ref - react forwarded ref
 * @param {Object} configuration - configuration object for setup
 * @param {Array} [deps=[]] - react dependencies array
 * @return domRef - can be bound to dom element
 */
export default function useAptor<
  TInstance,
  TElement extends HTMLElement = HTMLElement,
  TParams = unknown
>(
  ref: Ref<unknown>,
  configuration: AptorConfiguration<TInstance, TElement, TParams>,
  deps: DependencyList = []
): RefObject<TElement> {
  const [instance, setInstance] = useState<TInstance | null>(null);
  const domRef = useRef<TElement | null>(null);
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
