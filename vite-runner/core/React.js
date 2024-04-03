function createTextNode(text) {
  console.log("heiheihei!!!!!!!")
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextNode(child) : child
      }),
    },
  }
}

function render(el, container) {
  //创建根 fiber，设为下一次的单元任务
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  }
}

let nextWorkOfUnit = null

function workLoop(deadline) {
  let shouldYield = false
  console.log('nextWorkOfUnit',nextWorkOfUnit)
  // debugger

  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    console.log('nextWorkOfUnit',nextWorkOfUnit)
    shouldYield = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop)
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type)
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber) {
  const children = fiber.props.children
  let prevChild = null
  children.forEach((child, index) => {
    console.log('child',child)
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}

function performWorkOfUnit(fiber) {
  // debugger
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    console.log('dom',dom)

    fiber.parent.dom.append(dom)

    updateProps(dom, fiber.props)
  }

  initChildren(fiber)

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }

  return fiber.parent?.sibling
}

requestIdleCallback(workLoop)

const React = {
  render,
  createElement,
}



//mani.js调用
// ReactDOM.createRoot(document.querySelector("#root")).render(App)

{/*
<div id="root">
  <div id='app'></div>
</div>
*/}

// {
//   type: "div",
//   props: {
//     id: "app",
//     children: [
//       {
//        type:'TEXT_ELEMENT',
//        props: {
//          nodeValue: 'hello world',
//          children: []
//        }
//       }
//     ]
//   }
// }

export default React
