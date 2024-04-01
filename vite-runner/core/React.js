function createTextNode(text) {
  console.log("heiheihei!!!!!!!")

  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
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


let nextWorkOfUnit = null; //正在进行的任务
function workLoop(deadLine){
  //是否让步
  let  shouldYield = false;

  while(!shouldYield){
    //执行任务
    //判断是否有任务需要执行
    //如果没有任务需要执行，则让出时间片
    //如果时间片用完，则继续执行任务
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    shouldYield = deadline.timeRemaining() < 1
  }
  //如果有任务需要执行，则继续执行任务
  requesIdleCallback(workLoop);

}

requesIdleCallback(workLoop)

//实现任务及步骤
function performWorkOfUnit(work){

  //1.创建dom 设置处理props属性
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type)

      Object.keys(el.props).forEach((key) => {
        if (key !== "children") {
          dom[key] = el.props[key]
        }

  //2.对子节点进行转化转成链表形式,设置指针   parent、child 、sibling

  //3.返回下一个任务





}



function render(el, container) {
  // const dom =
  //   el.type === "TEXT_ELEMENT"
  //     ? document.createTextNode("")
  //     : document.createElement(el.type);

  // id class 设置属性
  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });

  const children = el.props.children;
  children.forEach((child) => {
    render(child, dom);
  });

  //插入到容器中
  container.append(dom);
}

const React = {
  render,
  createElement,
};

console.log(888,React.createElement("div", null, "9999"))


export default React
