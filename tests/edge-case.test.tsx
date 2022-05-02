import { renderHook } from '@testing-library/react-hooks';
import { createRef, useRef } from 'react';
import useAptor from 'react-aptor';

describe('All getAPI must be accepted and change the output ref', () => {
  const instantiate = jest.fn();
  let ref = null;
  beforeEach(() => {
    ref = { current: jest.fn() };
  });

  test('The noop return function should work', () => {
    const getAPI = () => () => {};
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref.current).toBe(undefined);
  });

  test('The null return value should work', () => {
    const getAPI = () => () => null;
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref.current).toBe(null);
  });

  test('The Number class return value should work', () => {
    const getAPI = () => () => Number;
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref.current).toBe(Number);
  });

  test('The Symbol return value should work', () => {
    const getAPI = () => () => Symbol.for('return-value');
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref.current).toBe(Symbol.for('return-value'));
  });

  test('The function return value should work', () => {
    const getAPI = () => () => JSON.parse;
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref.current).toBe(JSON.parse);
  });

  test('The key-value pair return value should work', () => {
    const getAPIReturnValue = { parse: JSON.parse, navigator };
    const getAPI = () => () => getAPIReturnValue;
    renderHook(() => useAptor(ref, { instantiate, getAPI }));
    expect(ref.current).toBe(getAPIReturnValue);
  });
});

describe('different ref input must work as expected', () => {
  const instantiate = jest.fn();

  test('The useRef should work', () => {
    const getAPI = () => () => Symbol.for('useRef');
    const { result } = renderHook(() => {
      const ref = useRef<Symbol>();
      useAptor(ref, { instantiate, getAPI });
      return ref;
    });
    expect(result.current.current).toBe(Symbol.for('useRef'));
  });

  test('The createRef should work', () => {
    const getAPI = () => () => Symbol.for('createRef');
    const { result } = renderHook(() => {
      const ref = createRef<Symbol>();
      useAptor(ref, { instantiate, getAPI });
      return ref;
    });
    expect(result.current.current).toBe(Symbol.for('createRef'));
  });

  test('The old class base ref function should work', () => {
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
