<h1 align="center">React Aptor</h1>
<p align="center"><img src="https://github.com/realamirhe/react-aptor/raw/master/doc/assets/logo.svg" alt="react aptor logo" width="450"></p>
<p align="center">
Minimal API Connector for react
  <br>
  <img src="https://img.shields.io/badge/Tree%20Shakeable-d4e157" alt="tree-shakeable" />
  <img src="https://img.shields.io/badge/Zero%20Dependencies-ffbfbf" alt="zero dependencies" />
  <img src="https://img.shields.io/badge/Side%20Effect%20Free-ffeb3b" alt="side-effect free" />
</p>	
<p align="center">
  <a href="https://npmjs.org/package/react-aptor">
    <img src="https://img.shields.io/npm/dt/react-aptor.svg" alt="downloads" />
  </a>
  <a href="https://bundlephobia.com/result?p=react-aptor">
    <img src="https://img.shields.io/bundlephobia/minzip/react-aptor.svg" alt="bundle size" />
  </a>
 <!-- <a href="https://lgtm.com/projects/g/realamirhe/react-aptor/context:javascript">
    <img src="https://img.shields.io/lgtm/grade/javascript/g/realamirhe/react-aptor.svg?logo=lgtm&logoWidth=18" alt="Language grade: JavaScript" />
  </a> -->
  <a href="https://paka.dev/npm/react-aptor@latest/api">
    <img src="https://paka.dev/badges/v0/cute.svg" alt="Docs" />
  </a>
</p>

---

English | <a href="https://github.com/realamirhe/react-aptor/blob/master/doc/localization/fa.md">Persian</a> | (<a href="https://github.com/realamirhe/react-aptor/issues/new">add your language</a>)

Don’t waste your time by finding react version of your favorite javascript package, keep control of your `API` now.

**Documentation**: You can find the react-aptor documentation [on the website](https://ahimico.github.io/docs/react-aptor/tutorials-overview).

## Why

Most packages are developed separately in JavaScript for increasing generality being library/framework agnostic.

Connecting vanilla third parties to react is not a routine task especially for those that need to change the DOM.
On the other hand, these packages might be developed by different teams, hence development progress can be one step behind the original or even be terminated at any time. Also, wrong abstraction or bad design patterns may interrupt the progress of these `react-xyz` packages.

If you are still not convinced you can read this [article](https://dev.to/amirhe/aptor-is-all-you-need-3din)

**Other Concerns**:

- Finding DOM nodes by ReactDOM.findDOMNode
- Extensively usage of memorization to improve performance or prevent extra re-renders
- Another duplication layer for all API definitions in react that increase the project size
- Rely on a global scope (e.g. window) for internal settings (making it impossible to have more than one instance)
- backward compatible updates of the base package need another update for the react-xyz package

## react-aptor

We strive to solve all mentioned problems at once and for all.

## Features

<details>
	<summary>Small</summary>
    Zero-dependency with less than 1 kilobyte in size (327 B 😱) <a href="https://bundlephobia.com/result?p=react-aptor">react-aptor</a>
</details>

<details>
    <summary>Manageable</summary>
Your used/defined APIs are entirely under your control. Make it possible to define a slice of APIs that you are surely going to use.
</details>

<details>
    <summary>React-ish</summary>
    Developed with lots of care, try to be zero-anti-pattern in react.
</details>

<details>
    <summary>Simple</summary>
    It's as simple as that. 💛
</details>

<details>
    <summary>Typescript</summary>
    Feel free to contribute or suggest any changes in <a href="https://github.com/amirHossein-Ebrahimi/react-aptor/issues">issues page</a>
</details>

## How to use

Connect your react app to any third party in three-step

1. Define the instantiate function
2. Define the get API function
3. Connect API to react by `useAptor`

---

1. Define the **instantiate** function.

```js
import Something from 'some-third-party';

export default function instantiate(node, params) {
  return new Something(node, params);
}
```

This function will return an instance of the third-party package. You have access to node (DOM-node\*) and params.

> The `node` is passed by react-aptor as a reference to DOM that is occasionally used as a wrapper for embedding UI.
> The DOM-node\* will become more clear in the third step.
>
> The `params` are optional parameters that are passed by react-aptor and defined by you. see the third step.
> The params will be passed by you and will be more clear in the third step.
>
> name this file **construct.js** as convention ✨.

2. Define the **get API** function.

```js
export default function getAPI(instance, params) {
  // return corresponding API Object
  return () => ({
    api_key: () => {
      /* api definition using instance and params */
      console.log(instance);
    },
  });
}
```

The react-aptor will pass the latest instance of your third party which has been defined in the first step by the **instantiate** function along with **params** to **getAPI** function.

> The `instance` is returned instance of your third party.
> Technically it is exactly going to be **instantiate(node, params)**
>
> The `params` are optional parameters that are passed by react-aptor and defined by you. see the third step.
> The params will be passed by you and will be more clear in the third step.
>
> name this file **api.js** as convention ✨.

3. **Connect API to react** by `useAptor`

```jsx
import useAptor from 'react-aptor';
import getAPI from './api';
import instantiate from './construct';

const Connector = (props, ref) => {
  const aptorRef = useAptor(ref, {
    getAPI,
    instantiate,
    /* params: anything */
  });

  return <div ref={aptorRef} />;
};

export default React.forwardRef(Connector);
```

> name this file **connector.jsx** as convention ✨
> If you are using react 17 or newer version, you can also name it **connector.js**

**useAptor in one look**

```jsx
const aptorRef = useAptor(ref, configuration, deps);
```

**ref**
For the connection phase, you need to define a **forwardRef** component. The `useAptor` hook needs forwarded-ref as the first argument, this is necessary to bind all your defined API to this ref.

**configuration**
As the configuration argument you need to pass defined **instantiate** (defined in the first step ☝️), **getAPI** (defined in the second step ☝️) and your custom params argument. The useAptor hook will return you a ref (`aptorRef`) which you can bind to your DOM node.

> The `params` doesn't have any limitation, it can be any arbitrary type e.g. undefined, number, string, or an object containing all of them. The params will be then passed to your instantiate and getAPI function, as you saw in the first and second steps.
> Params is the best place to connect props to your low-level API it means ”No Need” for extra function generation 🥳

**deps**
Is the same as Dependencies array default value is `[]` but you can override it as the third and last argument of useAptor. It may be needed in a situation in which you want to force re-instantiate by some prop change. It will use shallow comparison (as react do) for dependency array and will call your `instantiate` & `getAPI` in a row.

### API usage

```jsx
const Main = () => {
  const ref = createRef();

  const apiKeyHandler = () => {
    if (ref.current) {
      ref.current.api_key();
    }
  };

  return (
    <div>
      <Connector ref={ref} />
      <Button onClick={apiKeyHandler}>api call</Button>
    </div>
  );
};
```

Pass **createRef** to the Connector component (made in the third step), and then you can access all of the APIs inside **ref.current**

### 💡 Using of optional chaining

> function call can be much more readable with [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) & related [babel plugin](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining)

```jsx
const apiKeyHandler = () => ref.current?.api_key();
```

### 💡 Better naming

> In case you need `ref.current` more than one time, it is a good idea to rename it in the first place

```jsx
const apiKeyHandler = () => {
  const { current: api } = ref; // store ref.current in `api`
  if (api) {
    api.api_key();
  }
};
```

### 💡 Can I remove if check-in handlers

Cause the default value for ref can be undefined (in **createRef**) and null (in **useRef**) Typescript will complain about possibility for not-existence of apis. [see more](https://fettblog.eu/typescript-react/hooks/#useref).
In a normal world react will bind your API to the given ref after the Connector mount

If you're using ref in useEffect or somewhere which is guaranteed to have the ref bounded to values, you can return a proxy object in your `getAPI` function to bind all api functions simultaneously.

```js
export default function getAPI(thirdParty, params) {
  if (!thirdParty)
    return () =>
      new Proxy(
        {},
        {
          get: (_, prop) => {
            // Possible to mock differently for different props
            return noop;
          },
        }
      );

  return () => ({
    api_key() {
      // third-party is defined here for sure :)
      console.log(thirdParty);
    },
  });
}
```

### 💡 Micro API instructions

> You can access all of your APIs via `this` keyword

```js
export default function getAPI(sound, params) {
  return () => ({
    _state() {
      return sound.getState();
    },

    play() {
      if (this._state() === 'LOADED') sound.play();
    },
  });
}
```

> It's better to start the name of these internal functions with `_`

### 💡 The `this` problem in API object

In a case, you see this keyword usage in third-party API
you must specify `this` something other than returned API object.
The following examples are for howler integration using react-aptor:

```js
{
  // ❌ It doesn't work
  state: howler.state,

  // 🆗 this is Okay
  state: howler.state.bind(howler),
  // 🆗 this is also Okay
  state: () => howler.state(),
  // 🆗 this is also Okay, too
  state() {
    return howler.state();
  }
}
```

### 💡 How to get API-Object type

You can use something like the follwing:

```ts
export type APITypes = ReturnType<ReturnType<typeof getAPI>>;
```

### 💡 How to make a custom react integration package using react-aptor

1. Name your package **raptor-something** :)
2. Use minimum possible configuration for your API
3. Interact to props change in your component using `useEffect` and proper `deps` array
4. Bind another ref to your Connector using the fork-ref idea

For another possible usage see our production ready examples:

- **[plyr-react](https://github.com/chintan9/plyr-react)**
- **[raptor-howler-example](https://github.com/amirHossein-Ebrahimi/raptor-howler/tree/master/example)**

## core

### **ref** _`required`_

The react **useRef** or **createRef** ref instance which has been passed throw **react.forwardRef** method.
your API will be stored in this ref.

### **configuration** _`required`_

- ### **instantiate** _`required`_

  > function(node, params): Instance

  A function that receives probable bounded-node and params. It then returns an instance of your third party.

- ### **destroy**

  > function(previousInstance, params): void

  A function that receives previously created instances and params. It is useful when you want to perform the cleanup before new instance creation. e.g. **remove event listeners**, **free up allocated memories**, **destroy internally** & etc

- ### **getAPI** _`required`_

  > function(Instance, params): ApiObject

  A function that receives instances of your third-party and params. It then returns a key-value pair object for API handlers.

- ### **params** `any`

  Params can have any arbitrary type and can be used with props or pre-defined options.

### **deps** `[]`

React dependencies array for re-instantiating your third-party packages. It will call `instantiate` with the latest node, params whenever shallow comparison for with the previous deps array finds inequality.

---

## **Donation**

💻 Developer/Maintainer (**BTC**):
`1KMz71heaNaE6myAssRH54rUKXPdbwZp5j`

🎨 Designer (**BTC**):
`bc1q9fahyct3lrdz47pjf4kfxvsyum2dm74v2hv9xl`

## Color Palettes

![#c7589e](https://i.stack.imgur.com/YuJd9.png '#c7589e')
![#ed5b6e](https://i.stack.imgur.com/7ssUA.png '#ed5b6e')
![#f9b919](https://i.stack.imgur.com/31VUW.png '#f9b919')
![#26abe2](https://i.stack.imgur.com/y3o2u.png '#26abe2')
![#129f4d](https://i.stack.imgur.com/mWeRk.png '#129f4d')

## Samples

**NOTE**: Add your favorite package to the following list by creating a [new issue](https://github.com/realamirhe/react-aptor/issues).

<a href="https://codesandbox.io/s/react-aptor--fabric-hp50c" title="codesandbox | fabric.js">
  <img src="https://i.stack.imgur.com/GLnt7.png" width="150">
</a>
<a href="https://codesandbox.io/s/react-aptor--quill-iqwcd" title="codesandbox | quill.js">
  <img src="https://i.stack.imgur.com/wVBVM.png" width="150">
</a>
&nbsp;&nbsp;
<a href="https://github.com/realamirhe/raptor-howler" title="github | react-howler">
  <img src="https://raw.githubusercontent.com/realamirhe/raptor-howler/master/doc/assets/logo.svg" width="150">
</a>

<a href="https://stackblitz.com/edit/react-aptor-rivejs" title="stackblitz | rive.js">
  <img src="https://i.stack.imgur.com/SYdgf.png" width="150">
</a>

<a href="https://codesandbox.io/s/react-aptor--howler-4o8t4" title="codesandbox | howler.js">
  <img src="https://i.stack.imgur.com/bmvAc.png" width="150" height="150">
</a>

<p align="center">
   <a href="./doc/samples.md"> ⭐ SEE ALL SAMPLES 🌟</a>
</p>
