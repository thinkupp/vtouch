let elementStyle = document.createElement('div').style;
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  };

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
    return false;
  }
})();

/*
* 添加样式兼容前缀
* */
export function prefixStyle(style) {
  if(vendor === false) {
    return false
  }

  if(vendor === 'standard') {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}


/*
* offset
* */
export const getOffset = function(el) {
  isDOM(el);

  let t = el.offsetTop;
  let l = el.offsetLeft;
  let p = el.offsetParent;

  while (p) {
    t += p.offsetTop;
    l += p.offsetLeft;
    p = p.offsetParent;
  }

  return {
    t,
    l
  }
};

const isDOM = function isDOM(el) {
  const elType = Object.prototype.toString.call(el);
  if(elType.indexOf('HTML') === -1 || elType.indexOf('Element') === -1) throw new TypeError(`${el} 不是一个正确的 DOM 元素！`);
};
