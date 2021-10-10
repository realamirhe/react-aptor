// @ts-ignore
import * as React from 'react';
import useAptor from '../..';
import { instantiate, getAPI } from '../utils/sample-package';
import type {APITypes} from '../utils/sample-package'

export const FirstShotComponent = React.forwardRef<APITypes>(function(_, ref) {
  const aptorRef = useAptor(ref, { instantiate, getAPI, params: null });

  return <div ref={aptorRef as React.MutableRefObject<HTMLDivElement>}/>;
});
