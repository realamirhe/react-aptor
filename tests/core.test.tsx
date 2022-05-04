import { renderHook } from '@testing-library/react-hooks';
import React, { useRef } from 'react';
import useAptor from 'react-aptor';

/**
 * NOTE: the stability of test are not guaranteed cause they totally
 * relied on the structure of this file
 */
describe('React aptor hook flow check', () => {
  afterEach(() => jest.clearAllMocks());

  const MOCK_INSTANCE = {
    version: '0.0.1',
    getVersion() {
      return this.version as string;
    },
  };
  interface APITypes {
    version: string;
    get_version: () => string;
  }

  const ref = { current: jest.fn() };
  const params = {};
  const instantiate = jest.fn(() => MOCK_INSTANCE);

  const getAPIDefaultMode = () => ({ ready: false });

  const getAPI = jest.fn(
    (instance: null | typeof MOCK_INSTANCE, _params?: typeof params) => {
      if (instance === null) return getAPIDefaultMode;

      return () => ({
        version: instance.version,
        get_version: instance.getVersion,
      });
    }
  );

  test('Hook basic props must be called with correct order', () => {
    const destroy = jest.fn();
    renderHook(() => useAptor(ref, { instantiate, getAPI, destroy, params }));

    expect(instantiate).toBeCalledTimes(1);
    expect(instantiate).toBeCalledWith(null, params);

    expect(getAPI).toBeCalledTimes(2);
    expect(destroy).toBeCalledTimes(0);
  });

  describe('The useImperativeHandle section', () => {
    // useImperativeHandle
    const useImperativeHandleMock = jest.fn();
    const spy = jest
      .spyOn(React, 'useImperativeHandle')
      .mockImplementation(useImperativeHandleMock);

    afterAll(() => spy.mockRestore());

    test('The useImperativeHandle should be called with correct order', () => {
      renderHook(() => useAptor(ref, { instantiate, getAPI, params }));
      expect(useImperativeHandleMock).toBeCalledTimes(2);
    });

    test('The useImperativeHandle must be called with correct values', () => {
      renderHook(() => useAptor(ref, { instantiate, getAPI, params }));

      expect(useImperativeHandleMock.mock.calls[0][0]).toBe(ref);
      expect(useImperativeHandleMock.mock.calls[0][1]).toBe(getAPIDefaultMode);
      expect(useImperativeHandleMock.mock.calls[0][2][0]).toBe(
        getAPIDefaultMode
      );
      expect(useImperativeHandleMock.mock.calls[1][0]).toBe(ref);
      expect(useImperativeHandleMock.mock.calls[1][1]).not.toBe(
        getAPIDefaultMode
      );
      expect(useImperativeHandleMock.mock.calls[1][2][0]).not.toEqual(
        getAPIDefaultMode
      );
    });
  });

  test('The hook must return correct value', () => {
    const { result } = renderHook(() => {
      const ref = useRef<APITypes>(jest.fn() as any);
      useAptor(ref, { instantiate, getAPI, params });
      return ref;
    });
    const ref = result.current;

    expect(ref.current.version).toBe('0.0.1');
    expect(ref.current.get_version()).toBe('0.0.1');
    ref.current.version = '0.0.2';
    expect(ref.current.get_version()).toBe(ref.current.version);
  });

  test('The getAPI must be called with correct values', () => {
    renderHook(() => useAptor(ref, { instantiate, getAPI, params }));

    expect(getAPI.mock.calls[0]![0]).toBe(null);
    expect(getAPI.mock.calls[0]![1]).toBe(params);

    expect(getAPI.mock.calls[1]![0]).toBe(MOCK_INSTANCE);
    expect(getAPI.mock.calls[1]![1]).toBe(params);
  });

  describe('The useState section', () => {
    test('The useState should be called with correct order', () => {
      // useState
      const setState = jest.fn();
      const useStateMock = (initState: unknown) => [initState, setState];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock as any);

      renderHook(() => useAptor(ref, { instantiate, getAPI, params }));

      expect(setState).toBeCalledTimes(1);
      expect(setState).toBeCalledWith(MOCK_INSTANCE);
    });
  });
});
