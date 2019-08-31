---
title: From Zero to React
date: '2019-08-30'
description: 'Fast tracking your way into front-end development.'
tags: ['javascript', 'react', 'learning']
---

I live in Vancouver and there's a huge demand for [React](https://reactjs.org/)
developers. This is not a local phenomenon: web developers are in
[increasingly high demand](https://www.bls.gov/ooh/computer-and-information-technology/web-developers.htm#tab-6).
With a base level of React knowledge you can net a junior developer role paying
upward of
[\$40,000 CAD / year](https://www.glassdoor.ca/Salaries/vancouver-junior-web-developer-salary-SRCH_IL.0,9_IM972_KO10,30.htm),
which places it above
[Metro Vancouver's living wage](https://www.policyalternatives.ca/newsroom/updates/2019-living-wage-metro-vancouver).
And salaries only increase from there, especially if you dive in head first and
actively work to absorb knowledge and build your skills.

These positions are more accessible than ever due to an abundance of resources
available for free online, regardless of background or education. I'm going to
break down the minimal necessary steps required gain a base level of React
ability. **This is not supposed to be a get-hired-quick bait article**. The
intended audience is anyone who is curious or interested in development who is
unsure about the roadmap to a career.

> If you're truly new to this sphere, you may have no web development or React
> knowledge. Here's a quick description of the core concepts:
>
> Every website you visit is built with code. Specifically, it is a combination
> of three ingredients:
>
> 1. [HTML](https://en.wikipedia.org/wiki/HTML)
>
>    - This is a
>      [markup language](https://en.wikipedia.org/wiki/Markup_language) that
>      describes the basic **structure** of the web page. Think of it as the
>      bones; it provides the content and order of the page, but without
>      anything else it will be very basic (just a pile of bones). For example,
>      HTML would make your page header "My cool site".
>      - [Click here for example](https://codesandbox.io/s/just-html-jvjl9)
>        (check out the `index.html` file in the "Explorer" on the left).
>
> 1. [CSS](https://en.wikipedia.org/wiki/CSS)
>
>    - This is a
>      [style sheet language](https://en.wikipedia.org/wiki/Style_sheet_language)
>      that describes the **visual style** of your web page. Think of it as the
>      skin; it provides the appearance of the page, but it requires the bones
>      (HTML) in order to look like something. For example, CSS make your page
>      header orange.
>      - [Click here for example](https://codesandbox.io/s/html-and-css-czec0)
>        (check out the `index.css` file in the "Explorer" on the left).
>
> 1. [JavaScript](https://en.wikipedia.org/wiki/JavaScript)
>    - This is a
>      [scripting language](https://en.wikipedia.org/wiki/Scripting_language)
>      that can **manipulate** your web page. Think of it as the muscles; it
>      provides movement to your bones (HTML) and skin (CSS). For example,
>      JavaScript would make your page header switch between blue and orange
>      every two seconds.
>      - [Click here for example](https://codesandbox.io/s/html-css-and-javascript-vomvp)
>        (check out the `index.js` file in the "Explorer" on the left).
>
> Every site you see can be built using only those three things. So what is
> React?
>
> For more complex sites, it becomes hard to organize and manage all of your
> JavaScript and HTML. Additionally, causing simple manipulations with
> JavaScript can take a lot of code to do, which slows down development. So some
> smart people created
> [JavaScript frameworks](https://en.wikipedia.org/wiki/Single-page_application#JavaScript_frameworks)
> to help others build complex applications with JavaScript. One of those was
> created by Facebook to help build their sites, and it is called React.
>
> Thus ends our history lesson.

I'm going to discuss how to go from zero or minimal coding language to basic
React ability. Obviously this only gets easier if you have some coding ability,
but it's not essential. The whole point is to get coding ability. Additionally,
while I'm talking about what I know (React), this can be extrapolated to either
of the other primary JavaScript frameworks: [Angular](https://angular.io/) and
[Vue](https://vuejs.org/). But don't look at those yet.

A few points I'd like to bring up before diving in:

1. This isn't going to be a miracle article. You still have to learn everything.
   Everyone will take a different amount of time to gain proficiency, and it is
   a tiered approach, where you should be comfortable at every level before
   proceeding to the next.

1. This may not be the best approach for everyone. It requires time and
   persistence, and (in my opinion) a passion for coding. Passion will drive you
   through frustration to success. Although maybe stubbornness will do. Or just
   the drive to earn a living wage. Software development is in a truly unique
   position where anyone can become one, for free, by themselves, and compete on
   equal footing with anyone else. That should not be undervalued.

1. This is not the _best_ way to learn React, it's the fastest. If you take this
   route, you will absolutely miss out on some core fundamentals of general
   programming.

   **Here's the gamble you take with this approach**: I wager that you don't
   need those fundamentals to be a passable React developer. I also wager that
   you can learn a lot of said fundamentals on the job. React itself is very
   [opinionated](https://stackoverflow.com/questions/802050/what-is-opinionated-software),
   which essentially means it directs you into a certain way of doing things.
   This lets you bypass fundamentals because you don't necessarily have to
   understand how things work inside, you just need to know to get React to do
   them, and React will only do them a specific way.

   More opinionated = fewer ways to do things = less to learn.

   Eventually, you can begin to explore the internals, but you don't need that
   for a junior React developer job (and that's the whole point of this
   article!).

## 1. Start with HTML and CSS

```html
<!-- This is HTML. -->
<h1>My cool site</h1>
```

```css
/* And this is CSS. */
h1 {
  color: 'orange';
}
```

This is your bread and butter web development stuff. You can not skip this. You
may have heard that you don't need HTML since React builds your HTML for you.
While this is true, React uses an internal syntax called
[JSX](https://reactjs.org/docs/introducing-jsx.html) that very closely resembles
HTML. Your knowledge of HTML will go a long way in understanding how web pages
are constructed, and will directly influence how quickly you are able to pick up
React. Don't worry about memorizing the tags, learning how to structure HTML is
more important. If you forget how to do something, look it up!

CSS is absolutely essential. You will use it at every stage in your career. A
good knowledge of CSS will allow you to create beautiful web pages. If you want
to start playing around with HTML and CSS, go back to my
[HTML and CSS example](https://codesandbox.io/s/html-and-css-czec0) from
earlier. Just play around with some values to see what happens. The best way to
learn is by doing! However, you do not need to be a master. You just need to
understand how it works, and how to do basic things. If you want to do something
you don't know, look it up! The goal is to become a React developer, and since
you will be using CSS throughout your entire career, you will continuously
learning.

Here's one last thing I'll say with regards to "looking it up". Ignore anyone
who says _"don't keep looking up how to do it, you won't learn it"_. You
absolutely **will** learn it. Everyone looks up basic stuff at every level of
development. When I was making this article I had to look up how to import CSS
into HTML. If you do something enough you'll remember it naturally. And if you
don't then who cares, it takes 2 seconds to look up. That's the magic of the
internet.

## 2. Start to learn JavaScript

```javascript
// This is JavaScript.
var helloWorld = 'Hello, World!';
console.log(helloWorld);
```

You can build a really cool site entirely with HTML and CSS. However, you will
naturally come to a point where you won't be able to go any further. For
example, you may want to display the current time in the top corner, or have a
side menu that opens when you click a button. All of these manipulations require
JavaScript (actually you can do some
[absolutely insane](https://codepen.io/jcoulterdesign/pen/NOMeEb) things with
only HTML and CSS, but that's more for the sake of humour/madness than
practicality).

JavaScript is going to be the largest learning curve before you get to React, so
take your time. Again, go back and play around with the
[HTML, CSS and JavaScript example](https://codesandbox.io/s/html-css-and-javascript-vomvp).
Start making your page do crazy things.
[Here are some tutorials](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
by Mozilla to teach you some basics.

Don't worry so much about concepts like
[object-oriented programming](https://en.wikipedia.org/wiki/Object-oriented_programming).
Despite this being one of the aforementioned "fundamentals", you won't generally
use it in React that much. Let me be super clear though, it is a **huge**
fundamental. If you want to take the time to learn object-oriented programming,
I highly encourage you to. It forms the basis of any university computer degree.
However, this guide is the fast track(!) guide, so we are keeping things fast
here.

Do worry about things like
[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
(but only once you know the basics of JavaScript, including objects and arrays).

Most importantly, build things. Make a personal page for yourself with some
JavaScript in it, make a website for your partner, make a funny e-letter site
for a friend's birthday, etc. And again, don't worry if you have to google every
single thing you do, you **will** learn.

## 3. Start to learn React

```jsx
// This is React.
function MyCoolSite() {
  return <h1>My cool site</h1>;
}
```

React will be your largest learning curve, especially since you fast-tracked
your way through JavaScript.

Here's why React is tricky:

1. **React uses [JSX](https://reactjs.org/docs/introducing-jsx.html)**. If
   you've been learning your JavaScript you will notice that this is not real
   JavaScript. You would be right. It's a little bit of magic in order to make
   the code appear closer to the HTML that will be created by React.

   React uses a tool called [Babel](https://babeljs.io/) to transform this code
   into real JavaScript, and another tool called
   [webpack](https://webpack.js.org/) to run Babel on the code whenever you
   start up your project. You can see this transformation by going to
   [React's home page](https://reactjs.org/) and checking or un-checking the
   "JSX?" box on their code examples. The nice thing is you don't really have to
   understand how this works, just that it does.

   If you start to play around with making a React project, I suggest you use
   [create react app](https://create-react-app.dev/), which bundles all of the
   configuration needed to set up React, so you can just start coding without
   worrying about Babel or webpack or anything other than coding.

1. **React is opinionated.** I mentioned before that this would help you by
   forcing you into a way of doing things that allows you to bypass some of the
   fundamentals. While this is true, it also means you have to learn those
   special ways to do things. This takes time, but you can do it!

1. **React isn't really opinionated.** How's that for a curveball! Perhaps more
   accurately, React **is** opinionated in how you write JavaScript code, but it
   **is not** opinionated in how you compose your web applications built in
   React. There are many solutions for something as simple as moving from one
   page to another. You can use create react app, but you don't have to. You can
   use webpack, or use something else entirely. It will take time to figure out
   what the best solution is, and to learn how to use them.

React has a massive online presence, and you will find ample sites, online
learning courses, tutorials and examples to learn from. Maybe start by looking
at the [React](https://reactjs.org/) site. They have their own tutorial, which
gives lots of good information.

## That's it

I mean, obviously that's not really it. Once you can build things in React it
will be a continued journey of learning how to do more and more advanced things
with it. It may also involve going back and learning some of those missing
fundamentals. However, I feel like React development offers an opportunity that
people can obtain without a traditional computer science approach, even more so
than any other type of development.

Going forward, I recommend that you
[start doing lots of projects](https://en.wikipedia.org/wiki/Project-based_learning)
in React. [Create a GitHub account](https://github.com/join) and begin to create
things. Not only will this help you improve, it will serve as a portfolio when
you want to get a development job.

And then once you get one, teach other people to do it as well. Not only will it
help cement your knowledge, it will afford others the opportunity to investigate
whether they have an interest in it.

Above all, be a sponge for information. Invest your time in learning, because
this will pay you back in opportunities.

Development really can be for anyone. Maybe it's for you?
