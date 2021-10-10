import * as React from 'react';
import { render } from '@testing-library/react';

import { FirstShotComponent } from './components/first-shot';
import { APITypes } from './utils/sample-package';

test('first shot component should render correctly', () => {
  const ref = React.createRef<APITypes>();

  render(<FirstShotComponent ref={ref} />);
  expect(ref.current).toBeDefined();
  expect(ref.current?.doSomething).toBeDefined();
  expect(ref.current?.doSomething()).toBe('Hah!');
});
