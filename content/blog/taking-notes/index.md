---
title: Taking Notes
date: '2020-09-26'
description: "The best (according to me) note-taking stack."
tags: ['notion', 'notes']
---

I admit it: I haven't taken notes in a while. Back in university I was generally using OneNote and drawing quick illustrations on the touch screen of my Lenovo. But that was a while ago, and I just recently found a reason to take notes again.

I began the [Coursera machine learning](https://www.coursera.org/learn/machine-learning) and ended up looking into note-taking solutions, trying to figure out which would suit my style and the content of the course best. After bouncing between a few different tools, my final "stack" is:

- [Notion](https://www.notion.so/) for taking notes (you can see the notes [here](https://www.notion.so/Machine-Learning-Notes-fe3bb4e0fab84020a151739f6033e785))
- [Excalidraw](https://excalidraw.com/) for illustrations (I won't discuss this further, but it is a great way to generate quick and easy graphics for notes without getting caught up on perfectionism -- for an example see the graphics on [this page](https://www.notion.so/Linear-Regression-with-One-Variable-c6742a27450f41118b8eb953c99275cf))
- [Jupyter](https://jupyter.org/) for running Python code (not actually required for the course, but I do it anyways so I can learn Python as I work through the course -- you can view the notebooks [here](https://nbviewer.jupyter.org/github/liamross/machine-learning-notes/tree/master/notes/))

I chose these because they ended up working best for me personally, but they may not be the best fit for everyone. However, I'll discuss more why I made the choices I did, and you can decide for yourself.

## Which tool should I use

There have been an abundance of note-taking apps released recently (or not so recently), and many of them would be just as good for this use case. I'm going to go through the ones I considered and explain why I ended up choosing Notion.

### First, some requirements

1. Allows me to take notes easily and quickly
1. Has support for code snippets and math
1. Looks great

### Tools that didn't make the cut

Now for the options that I immediately ruled out:

#### [Evernote](https://evernote.com/)

The old reliable option. Definitely the most well-known out of all the options. Also probably the worst. I almost immediately ruled it out because:

1. No syntax highlighting
1. No latex support (necessary for a course like machine learning with lots of math)
1. Limited formatting options (or at least obvious easy-to-use ones from my quick check)

#### [Roam](https://roamresearch.com/)

The hyped new note-taking tool / early cult formation. People have been going wild for it on twitter, so I figured I'd look into it. At the end of the day I ruled it out for a few reasons:

1. It costs money ($165 USD a year if you pay for a year up front)
1. Notes taken with it don't actually look that good (but that's just, like, my opinion man -- as someone who gets a lot of joy from good looking notes and used to obsess over anatomical illustrations in my anthropology courses)
1. It doesn't offer me anything that other free options don't have (or at least anything that I'd find useful for the kind of notes I'm taking)

### Tools that I tried

And now the options that actually worked. One common pro for all of these options is they are free, or at least offer a free tier which I fall under.

#### [Obsidian](https://obsidian.md/)

I actually started taking notes with Obsidian, since it had [backlinks](https://en.wikipedia.org/wiki/Backlink) which I thought would be useful, especially if I wanted to organize my notes by topic rather than by lecture. However, I ended up switching to [Jupyter](#Jupyter) in order to be able to have the notes be public, and in order to run Python code.

##### Pros of Obsidian

1. Super easy to link between pages using the `[[Some other page]]` syntax. Can also use that syntax for images which is nice
1. Since Obsidian is just a file editor, you own the Markdown files it produces
1. Full latex math support

##### Cons of Obsidian

1. Limited by the fact it's a Markdown editor in terms of formatting and syntax (also no way to format attached images so they aren't full width)
1. Since it is a local application that uses a unique syntax for Markdown, you can't easily share the notes
1. Even though I'm very proficient with Markdown (this blog is written in it!), it sucks to take bad Markdown-looking notes and have the actual nice notes in a different view

#### [Jupyter](https://jupyter.org/)

I switched to Jupyter to share the notes publicly and to run Python algorithms in-line. However, it suffered from the same Markdown weaknesses as Obsidian, and was an even worse tool for actual note-taking. I ended up switching to [Notion](#Notion), but continue to use Jupyter for supplementary Python examples related to my notes. All in all this isn't really Jupyter's fault, since it was never really designed for heavy-duty multi-notebook note-taking. However in my dreams there will one day be a tool with the features of Notion but with the ability for running in-line code.

##### Pros of Jupyter

1. Being able to run Python code in-line is by far the largest benefit of using Jupyter
1. You own the files
1. Full latex math support

##### Cons of Jupyter

1. Absolutely terrible for linking between files. Have to basically do `[Other page](./other_page.ipynd)` each time, and obviously that's even worse if the path isn't that simple. Jupyter definitely wasn't made for that kind of note-taking. Same for images
1. Same cons as Obsidian with relation to being a Markdown editor, although Jupyter has a edit mode for blocks rather than persistent Markdown, so the experience is a bit better. Nonetheless, I still found myself constantly editing then "running" blocks which was slightly inconvenient

#### [Notion](https://www.notion.so/)

Finally, I ended up trying out Notion and it stuck.

##### Pros of Notion

1. Notes look immediately good, and there are more formatting options 
1. Decent latex support. Slightly worse than Obsidian and Jupyter since it only has Katex support, but still good enough for my use cases so far
1. They just recently introduced backlinks which I've found to be quite nice

##### Cons of Notion

1. Takes a while to index new pages so linking to them can be slow for the first bit
1. A con that is specific to moving to Notion from Jupyter is I can no longer run in-line Python. However I still have Jupyter notebooks containing live Python code, and I link to them from the Notion notes so I still get the benefits of Notion and Jupyter
1. No support for tables that aren't databases. A bit of a bummer if you just want to make a simple Markdown table to display some information (like a training set which comes up a lot in the machine learning course)

---

I'm very happy with Notion so far. It allows me to take notes quickly, and hits all the requirement checkboxes. Additionally, it's easy to share as a public site for my notes, which is an added benefit. To see the notes click [here](https://www.notion.so/Machine-Learning-Notes-fe3bb4e0fab84020a151739f6033e785), and to visit the repository with code examples and Jupyter notebooks click [here](https://github.com/liamross/machine-learning-notes).