import { renderHook } from '@testing-library/react-hooks';
import useAptor from '../src/useAptor';

const MOCK_INSTANCE = {
  version: '0.0.1',
  getVersion() {
    return this.version;
  },
};

test('hook should respect the architecture life cycle', () => {
  const ref = { current: jest.fn() };
  const instantiate = jest.fn(() => MOCK_INSTANCE);

  renderHook(() =>
    useAptor(ref, {
      instantiate,
      getAPI: (instance) => {
        if (instance === null) return () => ({ ready: false });

        return () => ({
          api_version: instance.version,
          get_version: () => instance.getVersion(),
        });
      },
    })
  );

  expect(instantiate).toBeCalledTimes(1);
});
