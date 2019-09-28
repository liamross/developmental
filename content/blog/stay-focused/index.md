---
title: Stay Focused!
date: '2019-09-28'
description: 'Locking focus within a React component.'
tags: ['javascript', 'react']
---

We're going to look at how to trap
[focus](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event)
within the bounds of a React component. That means that whenever this trap is
active and someone presses the <kbd>tab</kbd> key, it will cycle through only
the children inside that component.

> If you want to cheat, you can click
> [here](https://codesandbox.io/s/sharp-snow-46l4c) to view the final product in
> action.

## The why

Trapping a user's focus is an important step in usability, as well as
accessibility. You don't want someone to be able to tab off out of an open
dialog asking them to confirm or cancel a delete action (they might accidentally
click a button in the background when trying to cancel). It's important for
accessibility since some users will navigate solely using their keyboard and
listening to a screen-reader. If you don't trap the focus, they won't know that
their only two options are to confirm or cancel, and they could get lost on the
page.

## The how

There are a lot of solutions out there, and many of them have become pretty
bloated in order to satisfy edge cases. We are going to keep the focus narrow
and the component simple in order for it to be easy to understand and use. In
fact, despite this solution being tiny, we use it internally with no breaking
edge-cases so far. Let's get started.

### Create a selector string

Our first step is to create a selector string that identifies every element that
a user could focus. First we need to know all the different focusable elements
-- I found a great list in the [Micromodal](https://github.com/ghosh/Micromodal)
project (the list shown below can be found
[here](https://github.com/ghosh/Micromodal/blob/e38bc09331f81e3fb05c0533866e1dbe40a06de5/lib/src/index.js#L4-L16)).
Here's it is:

```js
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
];
```

Then we are going to combine these into a single selector string:

```js
export const focusableElementSelector = FOCUSABLE_ELEMENTS.join(',');
```

This can now be used to get all of the focusable elements inside of any DOM node
by using
[`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll):

```js
someDomNode.querySelectorAll(focusableElementSelector));
```

This will be useful later, since we will want to prohibit tabbing to anything
other than that list of focusable elements!

### Create a focus lock component

The only true requirement is that the component has a prop that enables and
disables locked focus. Actually, it has one more requirement: we need some sort
of reference to the outer-most container so that we can target it in order to
use `querySelectorAll`. With this in mind, here are our prop-types and basic
structure of the component:

```js
const propTypes = {
  /** When true, focus is locked within the element. */
  locked: PropTypes.bool,
  /** The child must have an exposed ref. */
  children: PropTypes.element.isRequired,
};

function FocusLock({locked, children}) {
  const focusRef = useRef(null);

  const lockFocus = useCallback(
    event => {
      if (!locked || event.key !== 'Tab' || !focusRef.current) return;

      const focusableElements = Array.from(
        focusRef.current.querySelectorAll(focusableElementSelector),
      );

      // TODO: Do something to lock the focus.
    },
    [locked],
  );

  useEffect(() => {
    document.addEventListener('keydown', lockFocus);
    return () => {
      document.removeEventListener('keydown', lockFocus);
    };
  }, [lockFocus]);

  return cloneElement(children, {ref: focusRef});
}

FocusLock.propTypes = propTypes;
export default FocusLock;
```

Let's break down the different parts before we focus on building out
`lockFocus`.

#### 1. Get a ref

```js{2,9,17}
function FocusLock({locked, children}) {
  const focusRef = useRef(null);

  const lockFocus = useCallback(
    event => {
      if (!locked || event.key !== 'Tab' || !focusRef.current) return;

      const focusableElements = Array.from(
        focusRef.current.querySelectorAll(focusableElementSelector),
      );
      // ...
    },
    [locked],
  );
  // ...

  return cloneElement(children, {ref: focusRef});
}
```

You're doing 3 things with `focusRef`:

1. You are creating it using the
   [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) hook
1. You are using
   [`cloneElement`](https://reactjs.org/docs/react-api.html#cloneelement) to
   attach the ref to the child element
1. You are querying all of the focusable elements from the ref

Once you have the `focusableElements` array, `focusRef`'s job is done. It is
simply a target in order to know where to look for focusable elements.

#### 2. Attach focus lock function to 'keydown' event

```js{3-8}
function FocusLock({locked, children}) {
  // ...
  useEffect(() => {
    document.addEventListener('keydown', lockFocus);
    return () => {
      document.removeEventListener('keydown', lockFocus);
    };
  }, [lockFocus]);
  // ...
}
```

Use the [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect)
hook to add and remove the event listener `lockFocus` whenever the component
mounts, and also whenever `lockFocus` changes.

#### 3. Write the keydown event listener

```js{5,7-9}
function FocusLock({locked, children}) {
  // ...
  const lockFocus = useCallback(
    event => {
      if (!locked || event.key !== 'Tab' || !focusRef.current) return;

      const focusableElements = Array.from(
        focusRef.current.querySelectorAll(focusableElementSelector),
      );

      // TODO: Do something to lock the focus.
    },
    [locked],
  );
  // ...
}
```

Firstly, if the component is not locked, if the key pressed was not
<kbd>tab</kbd>, or if for whatever reason it was unable to get a ref, it will
return early and ignore the event. If that case is not met, it will get all of
the focusable elements inside of the container.

But then what? You have an array of focusable elements (in order!) and a
<kbd>tab</kbd> key has just been pressed. How do we lock the user within a tab
cycle of only the elements in that array?

#### 4. Lock the focus

Finally, we are going to build out the rest of the `lockFocus` function:

```js{11-14,16-23,25-42}
function FocusLock({locked, children}) {
  // ...
  const lockFocus = useCallback(
    event => {
      if (!locked || event.key !== 'Tab' || !focusRef.current) return;

      const focusableElements = Array.from(
        focusRef.current.querySelectorAll(focusableElementDomString),
      );

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      if (
        !document.activeElement ||
        !focusRef.current.contains(document.activeElement)
      ) {
        focusableElements[0].focus();
        event.preventDefault();
        return;
      }

      const focusedItemIndex = focusableElements.indexOf(
        document.activeElement,
      );

      if (
        !event.shiftKey &&
        focusedItemIndex === focusableElements.length - 1
      ) {
        focusableElements[0].focus();
        event.preventDefault();
        return;
      }

      if (event.shiftKey && focusedItemIndex === 0) {
        focusableElements[focusableElements.length - 1].focus();
        event.preventDefault();
        return;
      }
    },
    [locked],
  );
  // ...
}
```

As you can see we've added 3 highlighted groups. The function of these (in
order) is:

1. If there are no focusable nodes within your container, do nothing, but
   prevent the <kbd>tab</kbd> keydown from doing anything
1. If there is no focused element, or if the focused element is outside of your
   container, focus the first focusable element inside the container
1. Find the index of the currently focused element within your container, and
   then:
   - If you're pressing <kbd>tab</kbd> and the element is the last in the
     container, then loop to the beginning
   - If you're pressing <kbd>shift</kbd>+<kbd>tab</kbd> tabbing goes backwards,
     so if the element is the first in the container, then loop to the end

If none of these cases match, then simply allow the tab as normal, it will take
place inside of the container since it is not at the beginning or end!

#### The final product

Well, we made it. Here it is all together!

```js
import PropTypes from 'prop-types';
import {cloneElement, useCallback, useEffect, useRef} from 'react';

const propTypes = {
  /** Is the focus locked within the child? */
  locked: PropTypes.bool,
  /** A child with a targetable ref to lock focus on. */
  children: PropTypes.element.isRequired,
};

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
];

const focusableElementDomString = FOCUSABLE_ELEMENTS.join(', ');

function FocusLock({locked, children}) {
  const focusRef = useRef(null);

  const lockFocus = useCallback(
    event => {
      if (!locked || event.key !== 'Tab' || !focusRef.current) return;

      const focusableElements = Array.from(
        focusRef.current.querySelectorAll(focusableElementDomString),
      );

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      if (
        !document.activeElement ||
        !focusRef.current.contains(document.activeElement)
      ) {
        focusableElements[0].focus();
        event.preventDefault();
        return;
      }

      const focusedItemIndex = focusableElements.indexOf(
        document.activeElement,
      );

      if (
        !event.shiftKey &&
        focusedItemIndex === focusableElements.length - 1
      ) {
        focusableElements[0].focus();
        event.preventDefault();
        return;
      }

      if (event.shiftKey && focusedItemIndex === 0) {
        focusableElements[focusableElements.length - 1].focus();
        event.preventDefault();
        return;
      }
    },
    [locked],
  );

  useEffect(() => {
    document.addEventListener('keydown', lockFocus);
    return () => {
      document.removeEventListener('keydown', lockFocus);
    };
  }, [lockFocus]);

  return cloneElement(children, {ref: focusRef});
}

FocusLock.propTypes = propTypes;
export default FocusLock;
```

### Next steps

So that works pretty well, but what are some improvements that could be made?

#### Blur focused component when lock is enabled

One improvement is that currently, it won't unfocus the last element that was
focused prior to `locked` being enabled. It will wait until the 'keydown' event
fires before it changes anything around focus. In order to unfocus anything
**outside of the container** (if it's inside then it can stay!) when focus is
enabled, we can add another
[`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) to the
component:

```js{3-12}
function FocusLock({locked, children}) {
  // ...
  useEffect(() => {
    if (
      locked &&
      focusRef.current &&
      document.activeElement &&
      !focusRef.current.contains(document.activeElement)
    ) {
      document.activeElement.blur();
    }
  }, [locked]);
  // ...
}
```

This will essentially blur anything outside of the container whenever lock is
enabled.

#### Re-focus last element prior to lock

Another improvement you could make is to focus on the last element that was
focused prior to the focus being locked. This is useful if, for example, you
have a Modal that appears and locks the focus inside of it. When it closes and
the focus is released, you may want to return focus to the same element it was
on before for improved accessibility. Again, it is important to only do this if
the previously-focused element was outside of the lock, since otherwise when you
unlock the focus will jump around. This is done by adding a new prop
`focusLastOnUnlock` and updating the
[`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) from our
previous improvement (Blurring the focused component).

```js{3,7,10-12,14-18,21,29-31,34-40}
const propTypes = {
  /** Re-focus the previous focus element on unlock? */
  focusLastOnUnlock: PropTypes.bool,
  // ...
};

function FocusLock({locked, focusLastOnUnlock, children}) {
  // ...

  // This is a ref for `focusLastOnUnlock`. This won't trigger an update within
  // the `useEffect`.
  const focusLastOnUnlockRef = useRef(focusLastOnUnlock);

  // This keeps the ref current with `focusLastOnUnlock`. We use a ref because
  // we don't want a change in `focusLastOnUnlock` to update the `useEffect`.
  useEffect(() => {
    focusLastOnUnlockRef.current = focusLastOnUnlock;
  }, [focusLastOnUnlock]);

  useEffect(() => {
    let lastFocusedElement;

    if (
      locked &&
      focusRef.current &&
      document.activeElement &&
      !focusRef.current.contains(document.activeElement)
    ) {
      // Only set this if it's outside of the container.
      lastFocusedElement = document.activeElement;
      lastFocusedElement.blur();
    }

    // If you have `focusLastOnUnlock` set to true, the previous locked state
    // true, and a `lastFocusedElement`, then focus the previous element.
    return () => {
      if (focusLastOnUnlockRef.current && locked && lastFocusedElement) {
        lastFocusedElement.focus();
      }
    };
  }, [locked]);
  // ...
}
```

This way, when you toggle `locked` it will focus the `lastFocusedElement` as
long as it was outside of the focus area.

#### The actual final product

If you decided to do those improvements, then here's our actual final product. A
fully-fledged focus lock in under 150 lines!

Click [here](https://codesandbox.io/s/sharp-snow-46l4c) to see a functional
demo!

```js
import PropTypes from 'prop-types';
import {cloneElement, useCallback, useEffect, useRef} from 'react';

const propTypes = {
  /** Is the focus locked within the child? */
  locked: PropTypes.bool,
  /** Re-focus the previous focus element on unlock? */
  focusLastOnUnlock: PropTypes.bool,
  /** A child with a targetable ref to lock focus on. */
  children: PropTypes.element.isRequired,
};

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
];

const focusableElementDomString = FOCUSABLE_ELEMENTS.join(', ');

function FocusLock({locked, focusLastOnUnlock, children}) {
  const focusRef = useRef(null);

  const lockFocus = useCallback(
    event => {
      if (!locked || event.key !== 'Tab' || !focusRef.current) return;

      const focusableElements = Array.from(
        focusRef.current.querySelectorAll(focusableElementDomString),
      );

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      if (
        !document.activeElement ||
        !focusRef.current.contains(document.activeElement)
      ) {
        focusableElements[0].focus();
        event.preventDefault();
        return;
      }

      const focusedItemIndex = focusableElements.indexOf(
        document.activeElement,
      );

      if (
        !event.shiftKey &&
        focusedItemIndex === focusableElements.length - 1
      ) {
        focusableElements[0].focus();
        event.preventDefault();
        return;
      }

      if (event.shiftKey && focusedItemIndex === 0) {
        focusableElements[focusableElements.length - 1].focus();
        event.preventDefault();
        return;
      }
    },
    [locked],
  );

  const focusLastOnUnlockRef = useRef(focusLastOnUnlock);

  useEffect(() => {
    focusLastOnUnlockRef.current = focusLastOnUnlock;
  }, [focusLastOnUnlock]);

  useEffect(() => {
    let lastFocusedElement;

    if (
      locked &&
      focusRef.current &&
      document.activeElement &&
      !focusRef.current.contains(document.activeElement)
    ) {
      lastFocusedElement = document.activeElement;
      lastFocusedElement.blur();
    }

    return () => {
      if (focusLastOnUnlockRef.current && locked && lastFocusedElement) {
        lastFocusedElement.focus();
      }
    };
  }, [locked]);

  useEffect(() => {
    document.addEventListener('keydown', lockFocus);
    return () => {
      document.removeEventListener('keydown', lockFocus);
    };
  }, [lockFocus]);

  return cloneElement(children, {ref: focusRef});
}

FocusLock.propTypes = propTypes;
export default FocusLock;
```
