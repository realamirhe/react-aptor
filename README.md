<h1 align="center">React Aptor</h1>
<p align="center"><img src="./doc/assets/logo.svg" width="450"></p>
<p align="center">React API Connector</p>

---

[آموزش فارسی](./doc/localization/fa.md)

Most packages are developed separately in javascript or typescript for increasing generality to make them us in all libraries and frameworks.

Connecting third parties to react is not a routine task. on the other hand, different teams might develop these packages hence development progress can be one step behind the original or terminated at any time.
Also, wrong abstraction or bad design patterns may slow down progress or block it at every new release.

List of some other concerns:

- Finding dom nodes by ReactDOM-findDOMNode
- Extensively usage of memoization to improve performance or prevent extra re-renders
- Large size of the project because of duplication and all API definition in react.
- Rely on a global scope (e.g. window) for package internal setting and making it impossible to have more than one instance.

## react-aptor

We strived to solve them all at once

### Small

The unparsed project size is less than 1 kilobyte (the greatest file is 352 bytes).

### Manageable

Your used/defined APIs are entirely under your control. Make it possible to define a slice of APIs which you are surely going to use.

### React-ish

Developed with lots of care, try to be zero-anti-pattern in react.

### Simple

Simple with a good developer experience.

### Typescript

It was developed in typescript and provide the following on the fly:

- auto-complete
- type-checking

## How to use

Connect your react app to any third party in three-step

1. Define the instantiate function
2. Define the get API function
3. get connected to react by `useAptor`

---

1. **First step**
   > Define the instantiate function.

```js
// construct.js
import Something from 'your-third-party'
export default function instantiate(node, params) =>
  new Something(node, options)
```

This function will return an instance of the third-party package. You have access to node (DOM-node) and params.

> The node is passed by react-aptor as a reference to DOM that is occasionally used as a wrapper for embedding UI.
> Params are optional parameters that are passed by react-aptor and define by you. see the third step.

2. **Second step**

> Define the get API function.

```js
// api.js
export default function getAPI(instance, params) {
  return () => ({
    api_key: () => {
      /* api defenition */
    },
  });
}
```

react-aptor will pass instance and params to your `getAPI` function. The instance is your third-party instance which has been defined in the first step.

> Params are optional parameters that are passed by react-aptor and define by you. see the third step.

3. **Third step**

```jsx
// connector.jsx
import useAptor from "react-aptor";
import getAPI from "./api";
import instantiate from "./construct";

const Connector = (props, ref) => {
  const aptorRef = useAptor(ref, {
    getAPI,
    instantiate,
    /* params: anything */,
  });

  return <div ref={aptorRef} />;
};

export default React.forwardRef(Connector);
```

For the connection phase, you need to define a `forwardRef` component, grab forwarded-ref and pass that as the first argument of`useAptor` hook. As the configuration argument you need to pass defined `instantiate` (defined in the first step), `getAPI` (defined in the second step), and your custom params argument. The useAptor hook will return you a ref (`aptorRef`) with must be bound to your returned DOM node.

The params will be then passed to your `instantiate` and `getAPI` function, as you saw in the first and second steps.
The value of params doesn't have any limitation and it can be any arbitrary type (e.g. `undefined`, `number`, `string`, `object`). You have full access to props in your component and you can define params value by props too.

**Usage Step**

```jsx
const Main = () => {
  const ref = createRef();

  const apiKeyHandler = () => ref.current?.api_key();

  return (
    <div>
      <Connector ref={ref} />
      <Button onClick={apiKeyHandler}>api call</Button>
    </div>
  );
};
```

Pass `createRef` to the Connector component (made in the third step), and then you can access all of the APIs inside `ref.current`

## Full Typescript support

The project was developed by typescript, see samples for more info.

## **Donation**

🎨 Designer (**BTC**):
`bc1q9fahyct3lrdz47pjf4kfxvsyum2dm74v2hv9xl`

💻 Developer/Maintainer (**BTC**):
`bc1qq8qq63ex7svkkjdjn5axu8angfxytvs83nlujk`

## Samples

### [Quill.js](https://github.com/quilljs/quill) + `typescript`

> Quill is a free, open source WYSIWYG editor built for the modern web.  
> <a href="https://codesandbox.io/s/react-aptor--quill-iqwcd"><img src="https://codesandbox.io/static/img/play-codesandbox.svg"></a>

### [Fabric.js](http://fabricjs.com)

> Fabric.js is a powerful and simple. Javascript HTML5 canvas library  
> <a href="https://codesandbox.io/s/react-aptor--fabric-hp50c"><img src="https://codesandbox.io/static/img/play-codesandbox.svg"></a>

### [Rive.js](https://rive.app)

> Create and ship beautiful animations to any platform  
> <a href="https://stackblitz.com/edit/react-aptor-rivejs"><img width="165" src="https://developer.stackblitz.com/img/logo.svg"></a>

