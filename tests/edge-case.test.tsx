import React, { createRef, useRef } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useAptor } from 'react-aptor';

`WARNING:: ${React} is added for ci-test in react 16.8.0 as temporary fix`;

describe('All getAPI must be accepted and change the output ref', () => {
  const instantiate = jest.fn();
  let ref: { current: jest.Mock } | null = null;
  beforeEach(() => {
    ref = { current: jest.fn() };
  });

  it('Should work with the noop function as return value', () => {
    const getAPI = () => () => {};
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref?.current).toBe(undefined);
  });

  it('Should work with the null as return value', () => {
    const getAPI = () => () => null;
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref?.current).toBe(null);
  });

  it('Should work with the Number as return value', () => {
    const getAPI = () => () => Number;
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref?.current).toBe(Number);
  });

  it('Should work with the Symbol as return value', () => {
    const getAPI = () => () => Symbol.for('return-value');
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref?.current).toBe(Symbol.for('return-value'));
  });

  it('Should work with function as return value', () => {
    const getAPI = () => () => JSON.parse;
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref?.current).toBe(JSON.parse);
  });

  it('Should work with the key-value pair as return value', () => {
    const getAPIReturnValue = { parse: JSON.parse, navigator };
    const getAPI = () => () => getAPIReturnValue;
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref?.current).toBe(getAPIReturnValue);
  });
});

describe('different ref input must work as expected', () => {
  const instantiate = jest.fn();

  it('Should set the current for the useRef as ref argument', () => {
    const getAPI = () => () => Symbol.for('useRef');
    const { result } = renderHook(() => {
      const ref = useRef<symbol>();
      useAptor(ref, { instantiate, getAPI });
      return ref;
    });
    expect(result.current.current).toBe(Symbol.for('useRef'));
  });

  it('Should set the current for the createRef as ref argument', () => {
    const getAPI = () => () => Symbol.for('createRef');
    const { result } = renderHook(() => {
      const ref = createRef<symbol>();
      useAptor(ref, { instantiate, getAPI });
      return ref;
    });
    expect(result.current.current).toBe(Symbol.for('createRef'));
  });

  it('Should set the current for the old-base ref-setters as ref argument', () => {
    const getAPI = () => () => Symbol.for('old-ref-function');
    const { result } = renderHook(() => {
      const oldRef = jest.fn(($node) => $node);
      useAptor(oldRef, { instantiate, getAPI });
      return oldRef;
    });

    expect(result.current).toBeCalledTimes(1);
    expect(result.current).toBeCalledWith(Symbol.for('old-ref-function'));
  });
});
