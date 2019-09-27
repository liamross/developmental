---
title: I18n in a React Application
date: '2019-08-26'
description: 'How to easily add multi-language support to any React project.'
tags: ['javascript', 'react']
---

If you are working on an application that will require multiple-language
support, then you've probably already given some thought to
[internationalization (I18n) and localization](https://en.wikipedia.org/wiki/Internationalization_and_localization).
Whether you have or not, here is my suggestion:

**_Do not wait until you need additional languages to implement localization in
your application._**

Implementing an effective localization framework early will save you from
mountains of mindless refactoring and copy-pasting later on.

> This article will reference the following repositories and articles. You can
> check them out before reading, but they will also be linked below.
>
> - [React's Context API](https://reactjs.org/docs/context.html) - a data
>   sharing system within React
> - [AirBnB's Polyglot.js library](https://airbnb.io/polyglot.js/) - an
>   internationalization helper library
> - [Localize Toolkit](https://github.com/xneelo/localize-toolkit) - the final
>   product

## Starting off simple

At the most simple, a localization framework takes some sort of key and returns
the phrase for it in the current language. This could look something like this:

```jsx
import React from 'react';

let language = 'en';

const englishPhrases = {hello_world: 'Hello World!'};
const frenchPhrases = {hello_world: 'Bonjour Monde!'};

const availablePhrases = {en: englishPhrases, fr: frenchPhrases};

const t = key => {
  const phrases = availablePhrases[language];
  return phrases[key];
};

// Then to use it:
const SomeLocalizedComponent = () => {
  return <p>{t('hello_world')}</p>;
};
```

This is great, but you will notice that it's not really the "React way". If the
language changes while `SomeLocalizedComponent` is mounted, it won't update the
`t('hello_world')`. We can solve this issue by using
[React's Context API](https://reactjs.org/docs/context.html).

## The React way

Ok, so let's take a crack at it using context. First off, we will use the same
simple function we defined before and build off of that.

```jsx
import React from 'react';

const LocalizeContext = React.createContext({
  setLanguage: () => {},
  t: () => {},
});

const englishPhrases = {hello_world: 'Hello World!'};
const frenchPhrases = {hello_world: 'Bonjour Monde!'};

const availablePhrases = {en: englishPhrases, fr: frenchPhrases};

const LocalizeProvider = ({children}) => {
  const [language, setLanguage] = React.useState('en');

  const t = key => {
    const phrases = availablePhrases[language];
    return phrases[key];
  };

  return (
    <LocalizeContext.Provider value={{setLanguage, t}}>
      {children}
    </LocalizeContext.Provider>
  );
};

// Then to use it (must be wrapped in the Provider for the context to work):

const App = () => {
  <LocalizeProvider>
    <SomeLocalizedComponent />
  </LocalizeProvider>;
};

const SomeLocalizedComponent = () => {
  const localize = React.useContext(LocalizeContext);

  return <p>{localize.t('hello_world')}</p>;
};
```

A little more complicated, but not too bad. The provider context exposes the
same `t` function as before, but also exposes a function `setLanguage` in order
to change the language the "React way". React uses a lot of patterns from the
[functional programming paradigm](https://en.wikipedia.org/wiki/Functional_programming).
As such, it can only observe changes when you call update functions. It is
unable to react (heh) when a variable value changes. Great, so let's break down
what's changed.

### Creating the context

First, you need to create the context that will be consumed in order to use the
localization:

```jsx{3-6}
import React from 'react';

const LocalizeContext = React.createContext({
  setLanguage: () => {},
  t: () => {},
});
```

Here we create the context. We put placeholders in for the two functions just in
case you try to use the context outside of the `LocalizeProvider` we just
constructed. Your functions will be useless without having a provider, so make
sure to wrap your root App component in the provider so that you can use the
`LocalizeContext` throughout your entire application.

### Exposing the localization functions

Next, you need to pass down the functions for setting the language and
translating your phrases:

```jsx{2,10-12}
const LocalizeProvider = ({children}) => {
  const [language, setLanguage] = React.useState('en');

  const t = key => {
    const phrases = availablePhrases[language];
    return phrases[key];
  };

  return (
    <LocalizeContext.Provider value={{setLanguage, t}}>
      {children}
    </LocalizeContext.Provider>
  );
};
```

You can see that the language has been moved into a React state instead of being
a variable. This allows you to set the language in a way React can detect: using
the `setLanguage` function exposed by `useState`.

Also notice how both `setLanguage` and `t` are being set in the value prop of
the provider. Anything that consumes the context has access to both of those
functions, which means that any child can set the language, or translate a key.

## Great, let's make it better

So you got it working, but there are many ways to improve the performance. Hooks
have unlocked a bunch of ways to simplify how components are written, while
still selectively optimizing how functions within them are memoized. While this
is useful for optimization, it is extremely important, even vital when using
context. When components consume functions or variables from the context value,
and then use them inside of a `useEffect`, it's important that these values do
not update unless they absolutely need to, as every update will trigger the
`useEffect`. Here are some optimizations we can do.

```jsx{14-16,18-29,31-38}
import React from 'react';

const LocalizeContext = React.createContext({
  setLanguage: () => {},
  t: () => {},
});

const englishPhrases = {hello_world: 'Hello World!'};
const frenchPhrases = {hello_world: 'Bonjour Monde!'};

const availablePhrases = {en: englishPhrases, fr: frenchPhrases};

const LocalizeProvider = ({children}) => {
  // 1. This is actually perfect as it is. `setLanguage` references a static
  //    function, so you know that this will remain constant despite reloads.
  const [language, setLanguage] = React.useState('en');

  // 2. Memoizing the const `t` ensures that it will remain a reference to the
  //    same function unless `language` is updated, as shown by the dependency
  //    array (the array `[language]`). This is great, as we want the function
  //    to be called again every time the language changes so that an updated
  //    translation is displayed.
  const t = React.useCallback(
    key => {
      const phrases = availablePhrases[language];
      return phrases[key];
    },
    [language],
  );

  // 3. Memoizing the value returned will ensure that components that consume
  //    LocalizeContext will only reload when this value changes. As you can
  //    see in the dependency list (the array `[t]`), this value will update
  //    only when `t` updates. Since `setLanguage` is a reference to a static
  //    setter function, this does not need to be included in the dependency
  //    array. Since `t` will only ever change when `language` does, components
  //    that consume from the context will only update when `language` changes.
  const value = React.useMemo(() => ({setLanguage, t}), [t]);

  return (
    <LocalizeContext.Provider value={value}>
      {children}
    </LocalizeContext.Provider>
  );
};

const LocalizedComponent = () => {
  const localize = React.useContext(LocalizeContext);

  return <p>{localize.t('hello_world')}</p>;
};
```

These changes ensure that we are optimizing our updates, which is very important
since it's likely that most components in your application will be utilizing the
`LocalizeContext`.

In our first pass using context, all components that consume the context would
reload every time anything in your React tree changed, since the changes would
propagate up to the `children` prop, causing the provider to reload (which wraps
all of your components), which would create a brand new object for `value`,
causing a refresh in all children.

With these optimizations, changes to children do nothing to change the `value`
object, only changes to the language. This means we will avoid unnecessary
reloads, and only update children when the language changes. This is exactly
what we want: dynamic updates to all translated strings every time the language
changes.

## But wait, there's more

You'd be fine with that if you don't require any complexity beyond simple
translation. However there are a few things lacking in this ~30 line example
that you'll find in the
[final product (Localize Toolkit)](https://github.com/xneelo/localize-toolkit):

1. A system for organizing phrases would be beneficial. In this example, they
   all reside at the base level of their object. It would be nice to be able to
   nest the object in order to organize based on page or common uses.
1. It would be nice to be able to use templating strings to insert dynamic
   content into the translated phrase. For example, the key `hello_name` could
   map to the phrase `'Hello %{name}'` and allow you to set name to be
   `'John Doe'`.

1. It would be nice to fetch phrases from an API. This would save space on the
   front-end by storing the large phrase objects on the back-end and fetching
   them as needed.
1. It would be nice to have a caching system for storing fetched phrases in
   order to avoid unnecessary API calls to fetch new languages.

The first two points are solved by the localization framework itself. In the
case of the [Localize Toolkit](https://github.com/xneelo/localize-toolkit), this
meant including [AirBnB's Polyglot.js library](https://airbnb.io/polyglot.js/).
While all of these things are achievable yourself, sometimes it's better to use
someone's pre-tested, proved solution. In the case of Polyglot.js, this means
you get nesting and organization out of the box, as well as string interpolation
and pluralization. Will I likely implement my own solution down the road in the
Localize Toolkit? Probably, but it is a lot of work for something that is
already built and works perfectly.

The last two issues can easily be solved by adding functions within the body of
the `LocalizeProvider`. I encourage you to browse the code and documentation for
the [Localize Toolkit](https://github.com/xneelo/localize-toolkit) to see how
they were implemented.

If you want to play around with the final product, here are some examples:

1. [Minimal example](https://codesandbox.io/s/20-localize-toolkit-minimal-u3333)
   - The absolute bare-bones example of using Localize Toolkit
1. [Full example](https://codesandbox.io/s/v63mqkm95y)
   - A full example with faked API calls to fetch new languages
1. [Overlay pattern example](https://codesandbox.io/s/0n6xy6800)
   - The full example, but with additional features to avoid remounting on
     language fetch by using an overlay for loading
1. [Pseudo Localization](https://codesandbox.io/s/20-localize-toolkit-pseudo-localization-lpp1q)
   - An example using pseudo localization (useful for testing how other
     languages might look without having to add them)

Ok, that pretty much does it. It's not a very complex tool, but it provides you
with an efficient and versatile system for implementing multiple languages in
your application. Obviously the actual toolkit is a fair bit more complex and
exposes more functions and variables, but in essence the use case is the same.

Good luck with your localization.
