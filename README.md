# Krosai Widget

[![circle-ci](https://img.shields.io/circleci/project/github/Wolox/react-chat-widget.svg)](https://circleci.com/gh/Wolox/react-chat-widget)
[![npm](https://img.shields.io/npm/v/react-chat-widget.svg)](https://www.npmjs.com/package/react-chat-widget)

[![FEArmy](./assets/FEA_open_source_sm.png)](https://github.com/orgs/Wolox/teams/front-end-army/members)

## Features

- Assistant Call Feature
- Assistant Chat Feature
- Easy to use

![demonstration](./assets/chat-demonstration.gif)

## Installation

#### npm

```bash
npm install --save krosai-widget
```

#### yarn

```bash
yarn add krosai-widget
```

## Usage

1- Add the Widget component to your root component

```js
import React from "react";
import { Widget } from "krosai-widget";

function App() {
  return (
    <div className="App">
      <Widget />
    </div>
  );
}

export default App;
```

2- The only required prop you need to use is the `widget_id`, which will receive the widget details from the custom widget on the console.

```js
import React from "react";
import { Widget } from "krosai-widget";

function App() {
  };

  return (
    <div className="App">
      <Widget widget_id={"Kros00000000000000"} />
    </div>
  );
}

export default App;
```

## API

#### Props

| prop          | type   | required | default value | description          |
| ------------- | ------ | -------- | ------------- | -------------------- |
| **widget_id** | string | =>       | YES           | 'Kros00000000000000' | This is the prop you pass, will receive the full details of the widget when submitted |

#### Widget components

##### Custom Launcher

You can use a custom component for the Launcher if you need one that's not the default, simply use the **launcher** prop:

```

`Kros00000000000000` is your widget ID that will be used to get the components of your widget as seen in the example. By default, the ID passed by that prop, will receive the details of the custom widget parameter.

## About

This project is maintained by [Martín Callegari](https://github.com/mcallegari10) and it was written by [Wolox](http://www.wolox.com.ar).

![Wolox](https://raw.githubusercontent.com/Wolox/press-kit/master/logos/logo_banner.png)
```
