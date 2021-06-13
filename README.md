<h1 align="center">React Aptor</h1>
<p align="center"><img src="./doc/assets/logo.svg" alt="react aptor logo" width="450"></p>
<p align="center">Minimal API Connector for react</p>
<p align="center">
  <a href="https://github.com/amirHossein-Ebrahimi/react-aptor/blob/master/license">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="license" />
  </a>
  <a href="https://npmjs.org/package/react-aptor">
    <img src="https://img.shields.io/npm/dt/react-aptor.svg" alt="downloads" />
  </a>
  <a href="https://bundlephobia.com/result?p=react-aptor">
    <img src="https://img.shields.io/bundlephobia/minzip/react-aptor.svg" alt="downloads" />
</a>
</p>

---

<p align="right">
   <a href="./doc/localization/fa.md">آموزش فارسی</a>
</p>
Don’t waste your time by finding react version of your favorite javascript package, keep control of your `API` now.

## Why

Most packages are developed separately in JavaScript for increasing generality being library/framework agnostic.

Connecting vanilla third parties to react is not a routine task especially those that need to change the DOM.
On the other hand, these packages might be developed by different teams, hence development progress can be one step behind of the original or even be terminated at any time. Also, wrong abstraction or bad design patterns may interrupt the progress of these react`-something` packages.

**Concerns**:

- on finding DOM nodes by `ReactDOM.findDOMNode`
- Extensively usage of memorization to improve performance or prevent extra re-renders
- Other duplication layer for all API definition in react that increase the project size.
- Rely on a global scope (e.g. window) for internal setting (making it impossible to have more than one instance).

## react-aptor

We strive to solve all mentioned problems at once and for all.

## Features

<details>
	<summary>Small</summary>
    Zero-dependency with less than 1 kilobyte in size (327 B 😱) <a href="https://bundlephobia.com/result?p=react-aptor">react-aptor</a>
</details>

<details>
    <summary>Manageable</summary>
Your used/defined APIs are entirely under your control. Make it possible to define a slice of APIs which you are surely going to use.
</details>

<details>
    <summary>React-ish</summary>
    Developed with lots of care, try to be zero-anti-pattern in react.
</details>

<details>
    <summary>Simple</summary>
    💛
</details>

<details>
    <summary>Typescript</summary>
    🔥
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
> The `params` are optional parameters that are passed by react-aptor and define by you. see the third step.
> The params will be passed by you and will be more clear in third step.
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

The react-aptor will pass the latest instance of your third-party which has been defined in the first step by **instantiate** function along with **params** to **getAPI** function.

> The `instance` is returned instance of your third-party.
> Technically it is exactly going to be **instantiate(node, params)**
>
> The `params` are optional parameters that are passed by react-aptor and define by you. see the third step.
> The params will be passed by you and will be more clear in third step.
>
> name this file **api.js** as convention ✨.

3. **Connect API to react** by `useAptor`

```jsx
//
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
For the connection phase, you need to define a **forwardRef** component. The `useAptor` hook needs forwarded-ref as the first argument, this is necessary to bind all your defined api to this ref.

**configuration**
As the configuration argument you need to pass defined **instantiate** (defined in the first step ☝️), **getAPI** (defined in the second step ☝️) and your custom params argument. The useAptor hook will return you a ref (`aptorRef`) which you can bind to your DOM node.

> The `params` doesn't have any limitation, it can be any arbitrary type e.g. undefined, number, string or an object containing all of them. The params will be then passed to your instantiate and getAPI function, as you saw in the first and second steps.
> Params is the best place to connect props to your low-level api it means ”No Need” for extra function generation 🥳

**deps**
Is the same as Dependencies array default value is `[]` but you can override it as the third and lat argument of useAptor. It maybe needed in situation which you want to force re-instantiate by some prop change. It will use shallow comparison (as react do) for deps array and will call your `instantiate` & `getApI` in a row.

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

### Using of optional chaining

> function call can be much more readable with [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) & related [babel plugin](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining)

```jsx
const apiKeyHandler = () => ref.current?.api_key();
```

### Better naming

> In case you need `ref.current` more than one time, it is a good idea to rename it at the first place

```jsx
const apiKeyHandler = () => {
  const { current: api } = ref; // store ref.current in `api`
  if (api) {
    api.api_key();
  }
};
```

### Can I remove if check in handlers

Cause the default value for ref can be undefined (in **createRef**) and null (in **useRef**) Typescript will complain about possibility for not-existence of apis. [see more](https://fettblog.eu/typescript-react/hooks/#useref).
In normal world react will bind your API to given ref after the Connector mount

### Micro api instructions

> You can access all of you apis via `this` keyword

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

> It's better to start name of this internal functions with `_`

## core

### Options

#### ref _`required`_

The react **useRef** or **createRef** ref instance which has been passed throw **react.forwardRef** method.
your api will be stored in this ref.

#### configuration _`required`_

- ##### instantiate _`required`_

  > function(node, params): Instance

  A function that receives probable bounded-node and params. It then returns an instance of your third-party.

- ##### getAPI _`required`_

  > function(Instance, params): ApiObject

  A function which receives instance of you third-party and params. It then returns a key-value pair object for api handlers.

- ##### params `any`

  Params can have any arbitrary type and can be used with props or pre-defined options.

#### deps `[]`

React dependencies array for re-instantiating your third-party-packages. It will call `instantiate` with latest node, params when ever shallow comparison for with the previous deps array finds inequality.

---

## **Donation**

🎨 Designer (**BTC**):
`bc1q9fahyct3lrdz47pjf4kfxvsyum2dm74v2hv9xl`

💻 Developer/Maintainer (**BTC**):
`bc1qq8qq63ex7svkkjdjn5axu8angfxytvs83nlujk`

## Samples

### [Quill.js](https://github.com/quilljs/quill) + `typescript`

> Quill is a free, open source WYSIWYG editor built for the modern web. <img src="https://img.shields.io/github/stars/quilljs/quill?style=social" /> > <a href="https://codesandbox.io/s/react-aptor--quill-iqwcd"><img src="https://codesandbox.io/static/img/play-codesandbox.svg"></a>

### [Fabric.js](http://fabricjs.com)

> Fabric.js is a powerful and simple. Javascript HTML5 canvas library. <img src="https://img.shields.io/github/stars/fabricjs/fabric.js?style=social" /> > <a href="https://codesandbox.io/s/react-aptor--fabric-hp50c"><img src="https://codesandbox.io/static/img/play-codesandbox.svg"></a>

### [Rive.js](https://rive.app)

> Create and ship beautiful animations to any platform. <img src="https://img.shields.io/github/stars/rive-app/rive-wasm?style=social" /> > <a href="https://stackblitz.com/edit/react-aptor-rivejs"><img width="165" src="https://developer.stackblitz.com/img/logo.svg"></a>

### [Howler.js](https://howlerjs.com)

> Audio library for the modern web. <img src="https://img.shields.io/github/stars/goldfire/howler.js?style=social" /> > <a href="https://codesandbox.io/s/react-aptor--howler-4o8t4"><img src="https://codesandbox.io/static/img/play-codesandbox.svg"></a>

### [Reveal.js](https://revealjs.com)

> HTML presentation framework create fully featured and beautiful presentations. <img src="https://img.shields.io/github/stars/hakimel/reveal.js?style=social" /> > <a href="https://codesandbox.io/s/react-aptor--reveal-dwrke"><img src="https://codesandbox.io/static/img/play-codesandbox.svg"></a>

<p align="center">
   <a href="./doc/samples.md"> ⭐ SEE ALL SAMPLES 🌟</a>
</p>
