import { renderHook } from '@testing-library/react-hooks';
import { createRef, DependencyList } from 'react';
import useAptor, { APIGenerator, GetAPI } from 'react-aptor';

describe('Basic re-rendering', () => {
  beforeEach(() => jest.clearAllMocks());

  const ref = { current: jest.fn() };
  const params = Symbol.for('params') as symbol;
  type TParams = typeof params;
  const instance = Symbol.for('instance') as symbol;
  type TInstance = typeof instance;
  const instantiate = jest.fn<TInstance | null, [HTMLElement | null, TParams?]>(
    () => instance
  );
  const getAPI = jest.fn<APIGenerator, [TInstance | null, TParams?]>(
    () => () => Symbol.for('get-api')
  );
  const destroy = jest.fn<void, [TInstance | null, TParams?]>();

  test('Changing non dependant must not cause any extra call change', () => {
    const { rerender } = renderHook((configs) => useAptor(ref, configs), {
      initialProps: {
        instantiate,
        getAPI,
        destroy,
        params,
      },
    });

    expect(getAPI).toBeCalledTimes(2);
    expect(instantiate).toBeCalledTimes(1);

    const newParams = Symbol('new-params');
    rerender({ instantiate, getAPI, params: newParams, destroy });

    expect(getAPI).toBeCalledTimes(2);
    expect(instantiate).toBeCalledTimes(1);
    expect(destroy).toBeCalledTimes(0);

    const newInstance = jest.fn();
    rerender({ instantiate: newInstance, getAPI, params, destroy });

    expect(getAPI).toBeCalledTimes(2);
    expect(instantiate).toBeCalledTimes(1);
    expect(newInstance).toBeCalledTimes(0);
    expect(destroy).toBeCalledTimes(0);

    const newGetAPI = jest.fn();
    rerender({ instantiate, getAPI: newGetAPI, params, destroy });

    expect(getAPI).toBeCalledTimes(2);
    expect(newGetAPI).toBeCalledTimes(0);
    expect(instantiate).toBeCalledTimes(1);
    expect(destroy).toBeCalledTimes(0);

    const newDestroy = jest.fn();
    rerender({ instantiate, getAPI, params, destroy: newDestroy });

    expect(getAPI).toBeCalledTimes(2);
    expect(newGetAPI).toBeCalledTimes(0);
    expect(instantiate).toBeCalledTimes(1);
    expect(destroy).toBeCalledTimes(0);
    expect(newDestroy).toBeCalledTimes(0);
  });

  test('Rerender must cause the corresponding life-cycle to be called', async () => {
    const { rerender } = renderHook(
      ({
        deps,
        getAPI,
      }: {
        deps: DependencyList;
        getAPI: GetAPI<typeof instance, typeof params>;
      }) => useAptor(ref, { instantiate, getAPI, destroy, params }, deps),
      {
        initialProps: { deps: ['initial'], getAPI },
      }
    );

    expect(getAPI).toBeCalledTimes(2);
    expect(instantiate).toBeCalledTimes(1);
    expect(destroy).toBeCalledTimes(0);

    rerender({
      deps: ['updated'],
      getAPI: jest.fn(
        (_instance: TInstance | null) => () => Symbol.for('new-get-api')
      ),
    });
    expect(destroy).toBeCalledTimes(1);
    expect(instantiate).toBeCalledTimes(2);
    expect(destroy).toBeCalledWith(instance, params);

    // FIXME: wait for not working in hook case
    // await waitForNextUpdate();
    // await waitFor(() => expect(ref.current).toBe(Symbol.for('get-api')));
    // expect(getAPI).toBeCalledTimes(3);
  });

  // FIXME: this needs to be fixed
  test.skip('Changing array dependency must cause any extra call change', async () => {
    const { rerender, result, waitFor } = renderHook(
      ({ getAPI, deps }) => {
        const ref = createRef();
        useAptor(ref, { instantiate, getAPI, destroy, params }, deps);
        return ref;
      },
      { initialProps: { deps: ['initial'], getAPI } }
    );

    expect(getAPI).toBeCalledTimes(2);
    expect(instantiate).toBeCalledTimes(1);

    const newGetAPI = jest.fn(
      (_instance: TInstance | null) => () => Symbol.for('new-get-api')
    );
    rerender({ deps: ['updated'], getAPI: newGetAPI });
    await waitFor(() => result.current.current === Symbol.for('new-get-api'));
    expect(getAPI).toBeCalledTimes(3);
    expect(instantiate).toBeCalledTimes(2);
    expect(destroy).toBeCalledTimes(1);
    expect(destroy).toBeCalledWith(instance, params);
  });
});
