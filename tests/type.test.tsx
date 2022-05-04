import React, {
  DependencyList,
  MutableRefObject,
  RefObject,
  useRef,
} from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { APIGenerator, AptorConfiguration, useAptor } from 'react-aptor';

`WARNING:: ${React} is added for ci-test in react 16.8.0 as temporary fix`;

type AssertEqual<Type, Expected> = Type extends Expected
  ? Expected extends Type
    ? true
    : never
  : never;

describe('Check validity of types', () => {
  const params = Symbol.for('params') as symbol;
  type TParams = typeof params;
  const instance = Symbol.for('instance') as symbol;
  type TInstance = typeof instance;
  const instantiate = jest.fn<TInstance, [HTMLElement | null, TParams?]>(
    () => instance
  );
  const getAPI = jest.fn<APIGenerator, [TInstance | null, TParams?]>(
    () => () => Symbol.for('get-api')
  );
  type APITypes = ReturnType<typeof getAPI>;
  const destroy = jest.fn<void, [TInstance | null, TParams?]>();

  type Configuration = AptorConfiguration<TInstance, HTMLElement, TParams>;
  const deps: DependencyList = [];

  it('should have correct types for setState', () => {
    const { result } = renderHook(() => {
      const ref = useRef<APITypes>();
      useAptor(ref, { instantiate, destroy, getAPI, params }, deps);
      return ref;
    });

    const setState: AssertEqual<
      typeof result.current.current,
      ReturnType<Configuration['getAPI']>
    > = true;
    expect(setState).toBe(true);
  });

  it('should only accept the correct ref types', () => {
    type AptorRef = Parameters<typeof useAptor>[0];
    //  ======== FALSY nature type ============
    // @ts-expect-error object can not be assigned to ref
    // eslint-disable-next-line @typescript-eslint/ban-types
    const empty: AssertEqual<{}, AptorRef> = true;
    expect(empty).toBe(true);

    // @ts-expect-error semi ref object can not be assigned to ref
    const wrongRef: AssertEqual<{ current: undefined }, AptorRef> = true;
    expect(wrongRef).toBe(true);

    //  ======== TRUTHY nature type ============
    const mutableRefObject: AssertEqual<
      MutableRefObject<unknown>,
      AptorRef
    > = true;
    expect(mutableRefObject).toBe(true);

    const refObject: AssertEqual<RefObject<unknown>, AptorRef> = true;
    expect(refObject).toBe(true);

    const mutableRefObject_16_8: AssertEqual<
      MutableRefObject<unknown | undefined>,
      AptorRef
    > = true;
    expect(mutableRefObject_16_8).toBe(true);

    const refFallback: AssertEqual<null, AptorRef> = true;
    expect(refFallback).toBe(true);
  });

  it('should have correct signature for instantiate type', () => {
    type Instantiate = Configuration['instantiate'];
    // @ts-expect-error must not use aptor as a third-party caller
    const instantiateZeroParameter: AssertEqual<() => TInstance, Instantiate> =
      true;
    expect(instantiateZeroParameter).toBe(true);

    // @ts-expect-error instance might be null till the correct dom node is bounded
    const instanceNonNullArgument: AssertEqual<
      (node: HTMLElement) => TInstance,
      Instantiate
    > = true;
    expect(instanceNonNullArgument).toBe(true);

    const instanceNonNullReturn: AssertEqual<
      (node: HTMLElement | null) => TInstance,
      Instantiate
    > = true;
    expect(instanceNonNullReturn).toBe(true);

    const instantiateOneParameter: AssertEqual<
      (node: HTMLElement | null) => TInstance,
      Instantiate
    > = true;
    expect(instantiateOneParameter).toBe(true);

    const instantiateTwoParameter: AssertEqual<
      (node: HTMLElement | null, params?: TParams) => TInstance,
      Instantiate
    > = true;
    expect(instantiateTwoParameter).toBe(true);
  });

  it('should have correct signature for destroy type', () => {
    type Destroy = Configuration['destroy'];

    const undefinedDestroy: AssertEqual<undefined, Destroy> = true;
    expect(undefinedDestroy).toBe(true);
    // @ts-expect-error destroy will receive the instance & optional params, don't use it for pure out of aptor sideEffects
    // eslint-disable-next-line @typescript-eslint/ban-types
    const destroyZeroParameter: AssertEqual<() => {}, Destroy> = true;
    expect(destroyZeroParameter).toBe(true);

    // @ts-expect-error destroy input is the latest TInstance, so if you need null, you might reconsider your TInstance type
    const destroyNullArgument: AssertEqual<
      (instance: TInstance | null) => void,
      Destroy
    > = true;
    expect(destroyNullArgument).toBe(true);

    // @ts-expect-error destroy should not return any value cause it is ignored
    const destroyReturnValue: AssertEqual<
      (instance: TInstance) => number | string | bigint | symbol,
      Destroy
    > = true;
    expect(destroyReturnValue).toBe(true);

    const destroyOneParameter: AssertEqual<
      (instance: TInstance) => void,
      Destroy
    > = true;
    expect(destroyOneParameter).toBe(true);

    const destroyTwoParameter: AssertEqual<
      (instance: TInstance, params?: TParams) => void,
      Destroy
    > = true;
    expect(destroyTwoParameter).toBe(true);
  });
});
