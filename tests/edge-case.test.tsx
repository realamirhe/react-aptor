import { renderHook } from '@testing-library/react-hooks';
import useAptor from '../src/useAptor';

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
