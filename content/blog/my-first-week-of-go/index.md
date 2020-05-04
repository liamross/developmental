---
title: My First Week of Go
date: '2020-05-03'
description: 'Thoughts on Go from a front end developer.'
tags: ['go', 'learning']
---

Well the last few months have certainly been interesting. One unexpected
positive is that I have ended up with much more time on my hands! So I have:

- Taken another crack at [Rust](https://www.rust-lang.org/)
- Started working through
  [Crafting Interpreters](https://craftinginterpreters.com/) (which has been
  fantastic, both in the content and writing style)
- Taken an actual look at [Svelte](https://svelte.dev/) (not bad, cool approach,
  so much animation built in)
- Tried out [Go](https://golang.org/)

Until this week, I hadn't written a single line of Go, and had only seen it when
briefly checking out the language's website. I had heard a lot of praise
regarding the simplicity and ease of learning, but a few things turned me away:

1. Coming from JavaScript/TypeScript, I wanted to change it up with something
   powerful and low level, and between C++, Go and Rust, I had initially gone
   with Rust
1. Go has no generics, and I took that alongside the "simple to learn" and
   basically assumed that it was lacking the base level of type complexity to do
   things effectively (while I've found this isn't true, simplicity is
   definitely a choice Go has made, and it comes at a cost)

Anyways, fast forward a few weeks and working with Rust was bumming me out.
Primarily, the dev tools just weren't working for me, and a total lack of
hinting when learning a new language was brutal. On top of that, I was starting
to realize that while I wanted something lower level than JavaScript, my use
case (web apps) didn't require something as heavy duty and "safe" as Rust.

> I've since
> [learned in a Hacker News post](https://news.ycombinator.com/item?id=22995466)
> that rust-analyzer is much better than RLS, so maybe I'll give it a try again
> sometime. I don't want to bash Rust, still super excited about it, and using
> it as WebAssembly might be the most applicable use case for me.

With no use case to help me learn Rust and a general frustration with the
developer experience, I decided to give Go a... go. Now that I have, I thought
I'd write on some of the feelings I had regarding this first week, especially
when compared to JavaScript/TypeScript.

## Tabs vs Spaces

Starting off with a heavy hitter. I honestly never thought I'd say this, but Go
has shown me that tabs are better than spaces for indentation. You can set the
tab width to anything you want, so every dev can see the code the way they want
to. If you like 4 spaces you can have it:

```go
func main() {
    fmt.Println("Hello, World!")
}
```

Or, as I am even more surprised to admit since I use 2 space indentation in my
JavaScript/TypeScript code, you can do what I do and set it to 8 spaces like a
lot of Go programmers (and [the docs](https://golang.org/)):

```go
func main() {
        fmt.Println("Hello, World!")
}
```

I can't even explain it, Go code just looks good with 8 space indentation. And
nesting seems to be limited in Go so it's not a big issue to have that large of
an indent.

## The Language

Now for the serious stuff. I'll just start off with some things that I like:

1. Real types! Coming from the TypeScript world where sometimes it can feel like
   a loosely-coupled type layer, this is really nice. The fact that you can
   assert on types, including custom types, is pretty great.
1. It's fast! Man is it fast, especially when you start using goroutines to
   divvy up the work. To be honest this one is smaller, since JavaScript is so
   optimized now, but I guess this point is more about concurrency and
   multithreading than just upfront speed.
1. Readability. It's very clear what is going on, mostly due to the language
   design. It can also be interpreted as verbosity sometimes, but it's really
   grown on me.
1. The type system is really fantastic. Adding methods onto custom types (not
   just structs but custom basic types like string or a slice) is really great.
   To be honest I have only scratched the surface of that, since I'm only a week
   in, but it seems really powerful.

Other than that I've found it really easy to start being productive with,
especially when contrasted with Rust. I even find it quicker to write than
TypeScript sometimes.

Most importantly, I'm building web apps within a week, and I actually have
confidence in the code I'm writing. With Rust, I was always questioning if the
approach I took was the best way.

Now for some of the things I found strange:

1.  The verbosity. No generics is pretty brutal. If you want to build out a
    `Sum` function for summing together any kind of number, that's tough. Why
    not build one for each type?

    ```go
    // SumF64 sums float64 slices. Now do this for every type.
    func SumF64(input []float64) (sum float64) {
      for _, val := range input {
        sum += val
      }
      return
    }
    ```

    People seem to be on both sides of it. I think the concern is that generics
    will introduce complexity, and people like the simplicity of Go. I guess
    that's true, but I also think that they would be a nice addition as long as
    you only used them for things like the above. It's not just generics though,
    there's also lots of repetition with error handling and writing out every
    type in a function even when it's matching an interface. This turns out to
    actually be a positive for readability, but I definitely found it strange at
    first.

1.  There's no `null`. Every type just has a zero value which is still a valid
    value of that type. There's `nil`, but that's just the zero value for some
    things like slice, error or pointer. But the zero value obviously can't
    represent an absence of a value, because for `int` the zero value is `0`,
    and that could be a legitimate `int` value. So people end up taking pointers
    for optional values, and then you pass `nil` to them rather than a valid
    pointer if the value is missing. For example, the ORM
    [gorm](https://gorm.io/) takes pointers to any fields that map to a nullable
    database column, or various other libraries which set you up to return
    pointers from functions so that you can return `nil` if there is an error. I
    get it, zero values mean that a type is always valid for that type, but it
    does seem strange coming from the JavaScript side of things, even a little
    bad, like it's a workaround to not allowing optional function arguments (I
    realize maybe this is just a totally normal way to do things in pointer
    world, but I'm coming from JavaScript where pointers are only talked about
    in hushed whispers). It also means you have to be careful and check if a
    pointer is `nil` before dereferencing it, or you'll get runtime errors.
    Obviously, this makes the language a lot less safe compared to Rust.
1.  Packages and modules stuff. This tripped me up, embarrassingly. Once I got
    Go modules working it was a lot better. Naming your packages on the top of
    the file, packages must share a directory, importing from different packages
    but not having to from your own. It's all very alien to JavaScript (but I
    guess similar to Java -- luckily I'd done a refresher when working through
    Crafting Interpreters).

## Developer Experience

When you first install the go dev tools in VSCode, you get absolutely bombarded
by install prompts, but once that's all over the experience is smooth. I've been
using the
[gopls](https://github.com/golang/tools/blob/master/gopls/doc/vscode.md)
language server, and it has been fantastic. No other language I've tried has
been able to match the dev experience of TypeScript on VSCode, but this comes
really close. If you're interested, this is my go-specific settings in VSCode:

```json
{
  "[go]": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    },
    "editor.tabSize": 8, // Personal preference
    "editor.renderWhitespace": "selection" // Personal preference
  },
  "[go.mod]": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  },
  "gopls": {
    "usePlaceholders": true,
    "staticcheck": false
  }
}
```

## Summary

All in all, I've really liked Go. I'm going to continue building out my project
in it, and it might even become my defacto back-end language. There are even
more things to like about it, like compiling to machine code, or the absolutely
insane start up speed. Overall, it has been a fantastic language to learn, and
I'm excited to see what I can build with Go.
