class Instance {
  name = 'Instance';

  doSomething() {
    return 'Hah!';
  }
}

export const getAPI = (instance: Instance | null, params: any) => {
  if (!instance)
    return () =>
      new Proxy(
        { doSomething: () => 'Hah!' },
        {
          get(target, p, __) {
            if (p === 'doSomething') return Reflect.get(target, p);
            return () => {};
          },
        }
      );

  return () => ({
    doSomething: instance.doSomething.bind(this),
  });
};

export type APITypes = ReturnType<ReturnType<typeof getAPI>>;

export const instantiate = (node: any, params: any) => new Instance();
