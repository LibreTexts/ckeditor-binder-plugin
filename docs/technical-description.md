# Ckeditor-binder-plugin Developer Guide

> This document is intended for developers who wish to contribute to ckeditor-binder-plugin. Prior knowledge in HTML and Javascript is required to understand this document.

## Introduction

Ckeditor-binder-plugin is a [CKEditor](https://ckeditor.com/) plugin that allows users to insert executable code blocks from the editor. It is developed by the [Libretexts organization](https://libretexts.org/) [jupyter team](https://jupyter.libretexts.org/hub/static/external/pages/about.html) for textbook authors to create free interactive textbooks. These textbooks contain executable code blocks for students to modify and run code examples while reading. Ckeditor-binder-plugin aims to remove the technical barrier of inserting executable code blocks to make the process as easy as possible.

## Plugin UI Components

When the plugin is registered, three UI components will be available on CKEditor: __enableBinder button__, __binderDialog__, and __thebelab widget__.

![Image of the UI Components](image/UI-demonstartion.png)

__EnableBinder button__: The button displayed on the toolbar that opens __binderDialog__ when clicked. It is registered via `editor.ui.addButton`.

__BinderDialog__: The dialog window that allows users to edit, run, and configure code they wish to insert. It is registered using `editor.dialog.add`.

__Thebelab widget__: The UI component that will be inserted to the editor. It contains the inserted code and its output. This is registered using `editor.widgets.add`.

## How does it work?

This section introduces the five components this plugin uses and how they interact with each other. The five components are: __CKEditor__, __Thebelab__, __Binderhub__, __Jupyterhub__, and __Jupyter notebook__.

![How Does it Work?](image/how-does-it-work.jpg)

* __CKEditor__: An HTML editor that dominates the web world. Basically every online editor you've used is a distribution of it.
* __Thebelab__: A JavaScript code that transforms specific HTML structures into executable code blocks.
* __Binderhub__: A web server that allows users to build Jupyter Notebooks from a public repository. It uses Jupyterhub underneath the hood.
* __Jupyterhub__: A web server that allows users to run Jupyter Notebooks on the web.
* __Jupyter Notebook__: A web interface where users can execute code snippets and get immediate results.

### The Plugin Inserts HTML for Thebelab

As a plugin of CKEditor, we can make use of functionalities provided by the CKEditor API which includes adding buttons, creating dialog windows, and inserting whatever HTML we want. The general idea is to let users input the code on the dialog, and we will insert the following HTML to the editor:

```html
<pre data-executable="true">
  <!-- the user's code here... -->
</pre>
<div data-output="true">
  <!-- the output here... -->
</div>
```

The HTML structure above is defined by Thebelab. When it comes to displaying the HTML to readers, we will include thebelab's JavaScript code which parses every HTML tag with `data-executable` set into an interactive code block. Any following tag that has the attribute `data-output` will be set as the default output of the code block.

### Thebelab Connects with Binderhub

After the code blocks are initiated, Thebelab will connect to a Binderhub instance hosted on a specific URL set by us. It will provide binderhub two important information:

* __Repository URL__: A URL of a public repository that contains configurations on how to set up the environment for a Jupyter Notebook.
* __Kernel Option__: What programming language the code blocks are written in.

> See [jupyter wiki page](https://github.com/jupyter/jupyter/wiki/Jupyter-kernels) for available kernel options.

### Binderhub Connects with Jupyterhub to Build A Jupyter Notebook

After Binderhub received the information, it will try to build a [Docker](https://www.docker.com/) image with the configurations on the repository using the tool [repo2docker](https://github.com/jupyter/repo2docker). After the first build, Binderhub will cache the image so that it doesn't have to rebuild it the next time.

After the image is built, Binderhub will connect to Jupyterhub to start the Jupyter Notebook using the image. After the notebook is created, Thebelab will be told where to access the notebook. With this information, Thebelab can now send code snippets to the notebook and receive the output to display.

> For more information on how Binderhub works, check out the [official repository](https://github.com/jupyterhub/binderhub).

## Development Environment

This section introduces three tools that are used to set up the development environment:

__Yarn__: A package management tool for Node.js and JavaScript. It helps to manage all the packages we use as well as maintaining the correct versions of them. Yarn creates a `yarn.lock` file that holds the information of the packages and their version. This will allow anyone who has this file to run `yarn install` to get the same development environment.

__Webpack__: Defined as a static module bundler for modern JavaScript applications on their [official website](https://webpack.js.org/concepts/). We use Webpack to combine and compress multiple JavaScript source files into a single file. This reduces load time because it will only take a single request to get the code. The commands for Webpack has been simplified using Yarn. The development build is set to `yarn start`, and the production build is set to `yarn build`.

__ESlint__: A JavaScript linter that reports invalid code styles using a set of rules set by the user. In this project, we use Airbnb's open-source [ESlint configuration](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base).

> See Airbnb's [JavaScript repository](https://github.com/airbnb/javascript) for the reason for each rule.

