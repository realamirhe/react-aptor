import { DependencyList, createRef } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { APIGenerator, GetAPI, useAptor } from 'react-aptor';

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

  it('Should not cause any extra call change when non dependant arguments change', () => {
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

  it('Should call corresponding life-cycle in the rerendering phase', async () => {
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
  it.skip('Should call corresponding life-cycle when deps array changes', async () => {
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
