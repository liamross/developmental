---
title: Passing React Children
date: '2019-10-13'
description: 'Different ways to pass children into components.'
tags: ['javascript', 'react']
---

If you are building anything other than a dead-simple React component, you will
inevitably have to pass one component into another.

Take, for example, a component which has the sole purpose of adding a label
above any field passed into it. As a first pass, perhaps that component has a
`<label>` inside, and takes the field as `children`. That seems alright, right?

```jsx
function Label({children}) {
  return (
    <>
      <label>{"Hey, I'm the label!"}</label>
      {children}
    </>
  );
}
```

But what if we want to use the label's
[HTML `for`](https://www.w3schools.com/tags/att_for.asp) attribute
([`htmlFor` in React](https://reactjs.org/docs/dom-elements.html#htmlfor) --
since for is reserved in JavaScript). This gives us a way to tie the `<label>`
to the field that it is labelling based on the field's `id`. This would require
both the label component and the field child to have the same `id`. How would we
achieve this?

```jsx{2}
function Label({children}) {
  // How do we get this into children???
  const id = generateRandomId();
  return (
    <>
      <label htmlFor={id}>{"Hey, I'm the label!"}</label>
      {children}
    </>
  );
}
```

Problems like these will pop up as you develop components, and depending on your
needs there will be some good ways, some bad ways, and some ways that just don't
work at all. Here are some of the primary ways to pass sub components:

1. Passing `SubComponent` as `children`
1. Passing `SubComponent` in uninitialized
1. Cloning `SubComponent` as `children`
1. Passing `SubComponent` inside an onRender function

> **_Note:_** All of the examples are going to involve putting `SubComponent`
> into `Component`.

## 1. Passing `SubComponent` as `children`

The simplest way to pass in children is to use the `children` prop. This is
achieved by nesting one component inside another (or by passing it as the
`children` prop, but this is generally discouraged).

> **_When to use:_** When **all** props for `SubComponent` can be set
> **outside** of `Component`.

```jsx{4-5,19}
import React from 'react';
import ReactDOM from 'react-dom';

function Component({children}) {
  return <div>{children}</div>;
}

function SubComponent({title, description}) {
  return (
    <>
      <h3>{title}</h3>
      <p>{description}</p>
    </>
  );
}

ReactDOM.render(
  <Component>
    <SubComponent title="Hello, World!" description="Goodnight, Moon!" />
  </Component>,
  document.getElementById('root'),
);
```

You can see in this example that children is used inside of `Component` and that
`title` and `description` are provided to `SubComponent` outside of `Component`.

> **_Does this solve our label problem:_** No, since there's no way to pass the
> `id` to the sub component.

## 2. Passing `SubComponent` in uninitialized

This is essentially for the opposite case of passing it as `children`. You pass
the uninitialized `SubComponent` in and let `Component` initialize it
internally.

> **_When to use:_** When **all** props for `SubComponent` come from
> **inside** > `Component`.

```jsx{4,9,24}
import React from 'react';
import ReactDOM from 'react-dom';

function Component({inner: Inner}) {
  const title = 'Hello, World!';
  const description = 'Goodnight, Moon!';
  return (
    <div>
      <Inner title={title} description={description} />
    </div>
  );
}

function SubComponent({title, description}) {
  return (
    <>
      <h3>{title}</h3>
      <p>{description}</p>
    </>
  );
}

ReactDOM.render(
  <Component inner={SubComponent} />,
  document.getElementById('root'),
);
```

Just remember that custom JSX elements must be capitalized, so you see that
`inner` is renamed to `Inner` above.

> **_Does this solve our label problem:_** Well, technically yes... you can set
> the `id` for both the label and the freshly-initialized field. However, a
> field with no props set externally is pretty useless, since it will have
> nothing in it. We need some way to both set props externally, but allow
> `Component` to set some as well.

## 3. Cloning `SubComponent` as `children`

Cloning basically allows you to make a copy of a React element with all of the
refs and keys intact, and then overwrite any prop individually.

> **_When to use:_** When **some** props that `SubComponent` has come from
> **inside** of `Component`, or `Component` needs to overwrite some props in
> `SubComponent`.

```jsx{5-6,20}
import React from 'react';
import ReactDOM from 'react-dom';

function Component({children}) {
  const description = 'Goodnight, Moon!';
  return <div>{React.cloneElement(children, {description})}</div>;
}

function SubComponent({title, description}) {
  return (
    <>
      <h3>{title}</h3>
      <p>{description}</p>
    </>
  );
}

ReactDOM.render(
  <Component>
    <SubComponent title="Hello, World!" />
  </Component>,
  document.getElementById('root'),
);
```

Here you'll notice that only `title` is set on the `SubComponent`, with
`description` being set inside of `Component`.

> **_Does this solve our label problem:_** Yes! This is actually a pretty good
> way to solve our label problem, as it basically allows us to have a mix of
> props set externally and internally within `Component`.

## 4. Passing `SubComponent` inside an onRender function

Using onRender functions is generally reserved for a very specific case: when
you need to conditionally adjust `SubComponent` based on something coming from
inside `Component`.

> **_When to use:_** When something that comes from `Component` must be handled
> to render `SubComponent`.

```jsx{5-6,20-25}
import React from 'react';
import ReactDOM from 'react-dom';

function Component({onRenderInner}) {
  const isNight = true;
  return <div>{onRenderInner(isNight)}</div>;
}

function SubComponent({title, description}) {
  return (
    <>
      <h3>{title}</h3>
      <p>{description}</p>
    </>
  );
}

ReactDOM.render(
  <Component
    onRenderInner={isNight => (
      <SubComponent
        title="Hello, World!"
        description={isNight ? 'Goodnight, Moon!' : 'Morning, Sun!'}
      />
    )}
  />,
  document.getElementById('root'),
);
```

You'll notice that `isNight` isn't a prop for `SubComponent` and so you can't
clone it and override the prop, nor does `Component` really know what the
significance of it being night is. Instead, it passes it out to `SubComponent`
to handle as it wishes. In this case, `SubComponent` will display different
descriptions. Obviously if `isNight` always causes the same two descriptions in
`SubComponent`, you could do the clone and optionally add each as the
`description` prop.

That's the distinction between cloning and using onRenders: an onRender will
leave the logic to the sub component, whereas cloning lets the component decide.

> **_Does this solve our label problem:_** Yes, but probably not in the best
> way. In our label problem, we **always** want to set the `id` of the field,
> but if we pass it out in an onRender that may not happen. Save onRenders for
> when there are multiple ways to handle the information coming out of
> `Component`.

## 5. Wait you said there were only 4

Well there are always more ways to do things! Let's tackle one more.

Suppose you want to solve the same label problem. You've settled on cloning
because that seemed like the best option. However, some of the fields are
wrapped in other components which give them a cool border, and you don't want to
have to pass `id` through those and into the fields.

Let's solve this problem using React's
[Context API](https://reactjs.org/docs/context.html).

```jsx{11,21,26-30}
import React from 'react';
import ReactDOM from 'react-dom';

const LabelId = React.createContext('');

function Label({children}) {
  const id = 'generated_id';
  return (
    <>
      <label htmlFor={id}>{"Hey, I'm the label!"}</label>
      <LabelId.Provider value={id}>{children}</LabelId.Provider>
    </>
  );
}

function BorderWrapper({children}) {
  return <div style={{border: '1px solid black'}}>{children}</div>;
}

function Input(inputProps) {
  const id = React.useContext(LabelId);
  return <input {...inputProps} id={id} />;
}

ReactDOM.render(
  <Label>
    <BorderWrapper>
      <Input />
    </BorderWrapper>
  </Label>,
  document.getElementById('root'),
);
```

In the above example, the `Label` component is providing the `id` for
consumption by any children, no matter how deeply nested they are. While this
pattern could be overkill when `Input` is a direct child of `Label` (just use
clone!), it is yet another way to provide values from inside the parent.

That pretty much covers the primary ways to pass in children. Each one serves a
purpose, and together they will allow you to build sophisticated React
applications!
