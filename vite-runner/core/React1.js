//该版本未重构优化

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
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}

function render(el, container) {
  //创建根fiber,设为下一次任务
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  }
}


let nextWorkOfUnit = null; //正在进行的任务
function workLoop(deadLine){
  //是否让步
  let  shouldYield = false;

  //执行任务，空闲且有任务
  while(!shouldYield && nextWorkOfUnit){
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
    console.log("nextWorkOfUnit", nextWorkOfUnit)

    //当空闲时间小于1毫秒就退出回调，让步等待浏览器再次空闲
    shouldYield = deadLine.timeRemaining() < 1
  }
  //如果有任务需要执行，则继续执行任务
  requestIdleCallback(workLoop);

}

requestIdleCallback(workLoop)


function  createDom(fiber){
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
  console.log("dom", dom)

  //处理属性
  Object.keys(fiber.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = fiber.props[key]
    }
  })

  // 子节点dom添加到父节点dom之后
  fiber.parent?.dom.appendChild(dom)

  return dom
}



//实现任务及步骤
function performWorkOfUnit(fiber){
  //1.创建dom 设置处理props属性
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  //2.对子节点进行转化链表形式,设置指针   parent、child 、sibling
  const children = fiber.props.children
  let prevChild = null

  children.forEach((child, index) => {
    // console.log(child);
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      child: null,
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

  //3.返回下一个任务
  // 有子节点直接返回
  if (fiber.child) return fiber.child

  // 没有子节点,判断是否有兄弟节点
  if (fiber.sibling) return fiber.sibling

  // 没有兄弟节点,找父节点的兄弟节点
  if (fiber.parent) {
    return fiber.parent?.sibling
  }
}






const React = {
  render,
  createElement,
}

// console.log(888,React.createElement("div", null, "9999"))

export default React
