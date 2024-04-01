### mini-react实现

本文档部分参考：https://newstu.github.io/min-react/develop/jsx.html

一.目标确定

模仿react的api ,实现界面展示hello,react

```react
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```



```react
<div id="root">
  <div id="app">
    Hello React
  </div>
</div>
```

转成vnode 写法

```react
const vnode = {
  type: "div",
  props: {
    id: "root",
    children: [
      {
        type: "div",
        props: {
          id: "app",
          children: "Hello React",
        },
      },
    ],
  },
}
```



1.动态实现

```react
function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    }
  }
}

// type表示元素类型，props表示元素的属性，是个对象，children表示子元素，剩余参数
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children:children.map(child=> {
        return typeof child === "object" ? child : createTextNode(child)
      })
    }
  }
}


function render(el, container) {
  const   dom = el.type === "TEXT_ELEMENT" ? document.createTextNode('') : document.createElement(el.type);

  // 添加属性
  Object.keys(el.props).forEach(key=> {
    if(key !== "children"){
      dom[key] = el.props[key];
    }
  })

  const {children}= el.props
   // 递归渲染子元素
  if(Array.isArray(children)){
    children.forEach(child=> {
      render(child, dom);
    })
  }

  container.appendChild(dom);
}


const App = createElement("div", { id: "app" }, "Hello React",'2024')
console.log(App,7788)

// {
//     "type": "div",
//     "props": {
//         "id": "app",
//         "children": [
//             {
//                 "type": "TEXT_ELEMENT",
//                 "props": {
//                     "nodeValue": "Hello React",
//                     "children": []
//                 }
//             },
//             {
//                 "type": "TEXT_ELEMENT",
//                 "props": {
//                     "nodeValue": "2024",
//                     "children": []
//                 }
//             }
//         ]
//     }
// }

render(App, document.getElementById("root"))  //默认方式渲染

//按照 react方式渲染
const  ReactDom = {
  createRoot(container){
    return {
      render(App){
        render(App, container)
      }
    }
  }
}

ReactDom.createRoot(document.getElementById("root")).render(App)
```

**React.js** 将`createTextNode` `createElement` `render`三个方法放入`core/React.js`中

```react
const React = {
  render,
  createElement,
};

export default React;
```



**ReactDOM.js**

将 ReactDOM 放入`core/ReactDOM.js`中，并导出

```react
import React from './React.js'

const ReactDOM = {
	createRoot:(container) =>{
 		render:(App) =>React.render(App,container)
	}
}
export default  ReactDOM
```

**App.js**

```react
import React from "./core/React.js";

const App = React.createElement("div", { id: "app" }, "hello", " world");

export default App;
```

**main.js**

```react
import App from "./App.js";
import ReactDOM from "./core/ReactDOM.js";

ReactDOM.createRoot(document.getElementById("root")).render(App);
```





---

二、使用jsx



Jsx 无法被直接解析，需要通过打包工具转化为js,使用vite 作为打包工具

![image-20240401145542335](/Users/coco/Library/Application Support/typora-user-images/image-20240401145542335.png)



将App.js 里的App使用jsx的方式定义

```react
//旧的
const OldApp = React.createElement("div", { id: "app" }, "hello", " world");

//jsx写法
const  App = <div id='app'> hello world </div>;
console.log(App)

{
    "type": "div",
    "props": {
        "id": "app",
        "children": [
            {
                "type": "TEXT_ELEMENT",
                "props": {
                    "nodeValue": "hi-mini-react",
                    "children": []
                }
            }
        ]
    }
}
```


