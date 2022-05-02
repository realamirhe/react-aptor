import { renderHook } from '@testing-library/react-hooks';
import { createRef } from 'react';
import useAptor from 'react-aptor';

describe('Basic re-rendering', () => {
  const ref = { current: jest.fn() };
  const params = Symbol.for('params');
  const getAPI = jest.fn(() => () => Symbol.for('get-api'));
  const instantiate = jest.fn(() => 'instance');

  test('Changing non dependant must not cause any extra call change', () => {
    const { rerender } = renderHook((configs) => useAptor(ref, configs), {
      initialProps: { instantiate, getAPI, params },
    });

    expect(getAPI).toBeCalledTimes(2);
    expect(instantiate).toBeCalledTimes(1);

    const newParams = Symbol.for('new-params');
    rerender({ instantiate, getAPI, params: newParams });

    expect(getAPI).toBeCalledTimes(2);
    expect(instantiate).toBeCalledTimes(1);

    const newInstance = jest.fn();
    rerender({ instantiate: newInstance, getAPI, params });

    expect(getAPI).toBeCalledTimes(2);
    expect(instantiate).toBeCalledTimes(1);
    expect(newInstance).toBeCalledTimes(0);

    const newGetAPI = jest.fn();
    rerender({ instantiate, getAPI: newGetAPI, params });

    expect(getAPI).toBeCalledTimes(2);
    expect(newGetAPI).toBeCalledTimes(0);
    expect(instantiate).toBeCalledTimes(1);
  });

  // FIXME: this needs to be fixed
  test.skip('Changing array dependency must cause any extra call change', async () => {
    const { rerender, result, waitFor } = renderHook(
      ({ getAPI, deps }) => {
        const ref = createRef();
        useAptor(ref, { instantiate, getAPI, params }, deps);
        return ref;
      },
      { initialProps: { deps: ['initial'], getAPI } }
    );

    expect(getAPI).toBeCalledTimes(2);
    expect(instantiate).toBeCalledTimes(1);

    const newGetAPI = jest.fn(() => () => Symbol.for('new-get-api'));
    rerender({ deps: ['updated'], getAPI: newGetAPI });
    await waitFor(() => result.current.current === Symbol.for('new-get-api'));
    expect(getAPI).toBeCalledTimes(3);
    expect(instantiate).toBeCalledTimes(2);
  });
});
