---
title: React with TypeScript v3.7
date: '2019-12-29'
description: 'How some of the new features of TypeScript v3.7 work with React.'
tags: ['react', 'typescript']
---

With
[version 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html),
TypeScript has released some powerful new features. These dramatically improve
React dev experience, so I thought I'd touch on a few of them, especially now
that I've been using them in production code for a bit.

## Optional chaining

> [Link to TypeScript handbook](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining)

Essentially, optional chaining allows you to attempt to access nested properties
that may or may not exist. Specifically, if you run into a null or undefined, it
will prevent you from accessing any deeper, rather than throwing an error. You
may have seen errors like these before:

```sh
Uncaught TypeError: Cannot read property 'c' of undefined

Uncaught TypeError: a.b.c is not a function
```

And to counter that perhaps you did something like this:

```js
if (a && a.b && a.b.c) {
  c();
}
```

Well now you can do this and it has the same effect:

```ts
a?.b?.c?.();
```

### How does it help with React

One example of how this effects React development would be with Redux stores.
Let's say that the store has a `user`, which is either null if no one is signed
in, or an object describing the user. Keep in mind this isn't Redux specific --
this could be a context or even just local state.

```ts
interface User {
  id: string;
  firstName: string;
  lastName: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postal?: string;
  };
}
```

If we want to display the country as a title, we can do so like this:

```ts
const title: string | undefined = useSelector(
  (s: State) => s.user?.address?.country,
);
```

## Nullish coalescing

> [Link to TypeScript handbook](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing)

Nullish coalescing allows you to fallback on a value whenever something is
undefined or null. For example, if you have a value that could be undefined or
null, and you want a default for it, you can use the `??` operator like this:

```ts
function getTitle(title?: string): string {
  return title ?? 'Default title';
}
```

### How does it help with React

One way this can be used is as a fallback for optional chaining. Since optional
chaining will "exit early" if it encounters a null or undefined, you can add the
`??` operator to the end to allow for fallbacks:

```ts
const title: string = useSelector(
  (s: State) => s.user?.address?.country ?? 'Canada',
);
```

One more advanced case is when you want to create a component that is optionally
controlled. A good example of this is the base HTML `input`. If you provide the
`value` prop, then typing in the `input` won't change anything unless you also
update the `value`. However, if you do not provide a `value`, the `input`
contains its own internal state, and typing will update the value.

Let's do something similar. We will create a button which, when clicked, will
update the count shown inside of it. It takes a prop `count` and a callback
`onClick`. If `count` is given, it will be a controlled component, but if not it
will fallback to it's own internal state.

```tsx
interface CountButtonProps {
  count?: number;
  onClick?: (newCount: number) => void;
}

const CountButton = (props: CountButtonProps) => {
  const [stateCount, setStateCount] = useState(0);
  const count = props.count ?? stateCount;

  const onClick = () => {
    setStateCount(count + 1);
    props.onClick?.(count + 1);
  };

  return <button onClick={onClick}></button>;
};
```

As you can see, the inner state will only be used as a fallback when props.count
is undefined. This is important because previously, you may have been tempted to
do the following:

```ts
const count = props.count || stateCount;
```

However, if `props.count` was `0`, this would have still defaulted to
`stateCount`, giving us incorrect behavior (since 0 is falsy). The `??` operator
is much more effective whenever you're dealing with numbers which could be `0`,
or strings that could be `''`.

---

That just about covers it. Obviously the 3.7 release featured a bunch of useful
stuff, but optional chaining and nullish coalescing were two features that have
the largest impact on React development. I hope that these new features help
with your React development as well.
