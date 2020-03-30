# CKeditor Binder Plugin
![](https://github.com/LibreTexts/ckeditor-binder-plugin/workflows/Sync%20to%20DigitalOcean%20Spaces/badge.svg?branch=master)

A CKeditor plugin that makes adding binder enabled pre tags easy.

## Installation

```
yarn install
```

## Start Dev Server

```
yarn start
```

## Build Prod Version

```
yarn build
```

## Linter

This repo follows Airbnb Javascript guide, see [here](https://github.com/airbnb/javascript) for more information.


## Usage with LibreTexts

CKEditor is a rich text editor which enables the user to write content directly inside web pages or online applications. Through the Binder Plugin, authors of textbooks have the option to include code within in their textbook pages to create a more interactive experience for their students.

![](tutorialVisuals/ckePlugin.png)  
*Location and description of plugin*



Currently the plugin supports Python 3, Julia, R, Octave, and SageMath. Additionally, all languages with the exception of SageMath support syntax highlighting for an easier scripting experience. 

![](tutorialVisuals/ckePlugin.png/languages.png)
*Language Options*



### Step-by-Step Process to use CKEditor Binder Plugin


#### Creating a new page
Authors have the option to add code to a new page.
![](tutorialVisuals/newPage.gif)
