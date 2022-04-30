import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useAptor from '../src/useAptor';

const MOCK_INSTANCE = {
  version: '0.0.1',
  getVersion() {
    return this.version;
  },
};

describe('React aptor hook flow check', () => {
  afterEach(() => jest.clearAllMocks());

  const ref = { current: jest.fn() };
  const params = {};
  const instantiate = jest.fn(() => MOCK_INSTANCE);

  const getAPIDefaultMode = () => ({ ready: false });

  const getAPI = jest.fn((instance, _params) => {
    if (instance === null) return getAPIDefaultMode;

    return () => ({
      api_version: instance.version,
      get_version: () => instance.getVersion(),
    });
  });

  test('Hook basic props must be called with correct order', () => {
    renderHook(() => useAptor(ref, { instantiate, getAPI, params }));

    expect(instantiate).toBeCalledTimes(1);
    expect(instantiate).toBeCalledWith(null, params);

    expect(getAPI).toBeCalledTimes(2);
  });

  describe('The useImperativeHandle section', () => {
    // useImperativeHandle
    const useImperativeHandleMock = jest.fn();
    jest.spyOn(React, 'useImperativeHandle').mockImplementation(useImperativeHandleMock);

    test('The useImperativeHandle should be called with correct order', () => {
      renderHook(() => useAptor(ref, { instantiate, getAPI, params }));
      expect(useImperativeHandleMock).toBeCalledTimes(2);
    });

    test('The useImperativeHandle must be called with correct values', () => {
      renderHook(() => useAptor(ref, { instantiate, getAPI, params }));

      expect(useImperativeHandleMock.mock.calls[0][0]).toBe(ref);
      expect(useImperativeHandleMock.mock.calls[0][1]).toBe(getAPIDefaultMode);
      expect(useImperativeHandleMock.mock.calls[0][2][0]).toBe(getAPIDefaultMode);

      expect(useImperativeHandleMock.mock.calls[1][0]).toBe(ref);
      expect(useImperativeHandleMock.mock.calls[1][1]).not.toBe(getAPIDefaultMode);
      expect(useImperativeHandleMock.mock.calls[1][2][0]).not.toEqual(getAPIDefaultMode);
    });
  });

  test('The getAPI must be called with correct values', () => {
    renderHook(() => useAptor(ref, { instantiate, getAPI, params }));

    expect(getAPI.mock.calls[0][0]).toBe(null);
    expect(getAPI.mock.calls[0][1]).toBe(params);

    expect(getAPI.mock.calls[1][0]).toBe(MOCK_INSTANCE);
    expect(getAPI.mock.calls[1][1]).toBe(params);
  });

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
