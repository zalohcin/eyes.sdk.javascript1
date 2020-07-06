exports.blurElement=function(arg){
var s=function(){"use strict";return function(e){var t=(void 0===e?{}:e).element,n=void 0===t?document.activeElement:t;return n&&n.blur(),n}}();
return s(arg)
}
exports.focusElement=function(arg){
var s=function(){"use strict";return function(n){var t=(void 0===n?{}:n).element;t&&t.focus()}}();
return s(arg)
}
exports.getContextInfo=function(arg){
var s=function(){"use strict";var t=function(t){var e=(void 0===t?{}:t).element,n="",r=e.ownerDocument;if(!r)return n;for(var o=e;o!==r;){var c=Array.prototype.filter.call(o.parentNode.childNodes,(function(t){return t.tagName===o.tagName})).indexOf(o);n="/"+o.tagName+"["+(c+1)+"]"+n,o=o.parentNode}return n};return function(){var e,n,r;try{e=window.top.document===window.document}catch(t){e=!1}try{n=!window.parent.document===window.document}catch(t){n=!0}if(!n)try{r=t(window.frameElement)}catch(t){r=null}return{isRoot:e,isCORS:n,selector:r,documentElement:document.documentElement}}}();
return s(arg)
}
exports.getDocumentEntireSize=function(arg){
var s=function(){"use strict";return function(){var t=document.documentElement.scrollWidth,e=document.documentElement.scrollHeight,n=document.documentElement.clientHeight,c=document.body.scrollWidth,o=document.body.scrollHeight,d=document.body.clientHeight;return{width:Math.max(t,c),height:Math.max(n,e,d,o)}}}();
return s(arg)
}
exports.getElementComputedStyleProperties=function(arg){
var s=function(){"use strict";return function(e){var t=void 0===e?{}:e,r=t.element,n=t.properties,o=void 0===n?[]:n,u=window.getComputedStyle(r);return console.log(r),u?o.map((function(e){return u.getPropertyValue(e)})):[]}}();
return s(arg)
}
exports.getElementEntireSize=function(arg){
var s=function(){"use strict";return function(t){var i=(void 0===t?{}:t).element;return{width:Math.max(i.clientWidth,i.scrollWidth),height:Math.max(i.clientHeight,i.scrollHeight)}}}();
return s(arg)
}
exports.getElementFixedAncestor=function(arg){
var s=function(){"use strict";return function(e){for(var t=(void 0===e?{}:e).element;t.offsetParent&&t.offsetParent!==document.body&&t.offsetParent!==document.documentElement;)t=t.offsetParent;return"fixed"===window.getComputedStyle(t).getPropertyValue("position")?t:null}}();
return s(arg)
}
exports.getElementOffsets=function(arg){
var s=function(){"use strict";var e=function(e){var r=(void 0===e?{}:e).element;return r?{x:r.scrollLeft,y:r.scrollTop}:{x:window.scrollX||window.pageXOffset,y:window.scrollY||window.pageYOffset}};var r=function(e){var r=void 0===e?{}:e,t=r.element,n=r.properties;return(void 0===n?[]:n).map((function(e){return t.style[e]}))};var t=function(e){var t=(void 0===e?{}:e).element,n=void 0===t?document.documentElement:t,o=r({element:n,properties:["transform","webkitTransform"]}),i=Object.keys(o).reduce((function(e,r){if(o[r]){var t=o[r].match(/^translate\(\s*(\-?[\d, \.]+)px,\s*(\-?[\d, \.]+)px\s*\)/);if(!t)throw new Error("Can't parse CSS transition: "+o[r]+"!");e.push({x:Math.round(-parseFloat(t[1])),y:Math.round(-parseFloat(t[2]))})}return e}),[]);if(!i.every((function(e){return i[0].x===e.x||i[0].y===e.y})))throw new Error("Got different css positions!");return i[0]||{x:0,y:0}};return function(r){var n=(void 0===r?{}:r).element,o=e({element:n}),i=t({element:n});return{x:o.x+i.x,y:o.y+i.y}}}();
return s(arg)
}
exports.getElementProperties=function(arg){
var s=function(){"use strict";return function(r){var n=void 0===r?{}:r,t=n.element,e=n.properties;return(void 0===e?[]:e).map((function(r){return t[r]}))}}();
return s(arg)
}
exports.getElementRect=function(arg){
var s=function(){"use strict";var e=function(e){for(var t=(void 0===e?{}:e).element;t.offsetParent&&t.offsetParent!==document.body&&t.offsetParent!==document.documentElement;)t=t.offsetParent;return"fixed"===window.getComputedStyle(t).getPropertyValue("position")?t:null};var t=function(e){var t=(void 0===e?{}:e).element;return t.scrollWidth>t.clientWidth||t.scrollHeight>t.clientHeight};var n=function(e){var t=(void 0===e?{}:e).element;return t?{x:t.scrollLeft,y:t.scrollTop}:{x:window.scrollX||window.pageXOffset,y:window.scrollY||window.pageYOffset}};return function(o){var i=void 0===o?{}:o,r=i.element,l=i.isClient,d=void 0!==l&&l,f=r.getBoundingClientRect(),a={x:f.left,y:f.top,width:f.width,height:f.height};if(d){var w=window.getComputedStyle(r);a.x+=parseInt(w.getPropertyValue("border-left-width")),a.y+=parseInt(w.getPropertyValue("border-top-width")),a.width=r.clientWidth,a.height=r.clientHeight}var s=e({element:r});if(s){var c=t({element:s});if(s!==r&&c){var u=n({element:s});a.x+=u.x,a.y+=u.y}}else a.x+=window.scrollX||window.pageXOffset,a.y+=window.scrollY||window.pageYOffset;return a}}();
return s(arg)
}
exports.getElementScrollOffset=function(arg){
var s=function(){"use strict";return function(o){var e=(void 0===o?{}:o).element;return e?{x:e.scrollLeft,y:e.scrollTop}:{x:window.scrollX||window.pageXOffset,y:window.scrollY||window.pageYOffset}}}();
return s(arg)
}
exports.getElementStyleProperties=function(arg){
var s=function(){"use strict";return function(r){var t=void 0===r?{}:r,e=t.element,n=t.properties;return(void 0===n?[]:n).map((function(r){return e.style[r]}))}}();
return s(arg)
}
exports.getElementTranslateOffset=function(arg){
var s=function(){"use strict";var r=function(r){var t=void 0===r?{}:r,e=t.element,n=t.properties;return(void 0===n?[]:n).map((function(r){return e.style[r]}))};return function(t){var e=(void 0===t?{}:t).element,n=void 0===e?document.documentElement:e,o=r({element:n,properties:["transform","webkitTransform"]}),i=Object.keys(o).reduce((function(r,t){if(o[t]){var e=o[t].match(/^translate\(\s*(\-?[\d, \.]+)px,\s*(\-?[\d, \.]+)px\s*\)/);if(!e)throw new Error("Can't parse CSS transition: "+o[t]+"!");r.push({x:Math.round(-parseFloat(e[1])),y:Math.round(-parseFloat(e[2]))})}return r}),[]);if(!i.every((function(r){return i[0].x===r.x||i[0].y===r.y})))throw new Error("Got different css positions!");return i[0]||{x:0,y:0}}}();
return s(arg)
}
exports.getElementXpath=function(arg){
var s=function(){"use strict";return function(e){var r=(void 0===e?{}:e).element,t="",n=r.ownerDocument;if(!n)return t;for(var a=r;a!==n;){var o=Array.prototype.filter.call(a.parentNode.childNodes,(function(e){return e.tagName===a.tagName})).indexOf(a);t="/"+a.tagName+"["+(o+1)+"]"+t,a=a.parentNode}return t}}();
return s(arg)
}
exports.getViewportSize=function(arg){
var s=function(){"use strict";return function(){var e=0,t=0;return window.innerHeight?t=window.innerHeight:document.documentElement&&document.documentElement.clientHeight?t=document.documentElement.clientHeight:document.body&&document.body.clientHeight&&(t=document.body.clientHeight),window.innerWidth?e=window.innerWidth:document.documentElement&&document.documentElement.clientWidth?e=document.documentElement.clientWidth:document.body&&document.body.clientWidth&&(e=document.body.clientWidth),{width:e,height:t}}}();
return s(arg)
}
exports.isElementScrollable=function(arg){
var s=function(){"use strict";return function(t){var e=(void 0===t?{}:t).element;return e.scrollWidth>e.clientWidth||e.scrollHeight>e.clientHeight}}();
return s(arg)
}
exports.scrollTo=function(arg){
var s=function(){"use strict";return function(o){var l=void 0===o?{}:o,e=l.element,r=void 0===e?document.documentElement:e,t=l.offset;return r.scrollTo?r.scrollTo(t.x,t.y):(r.scrollLeft=t.x,r.scrollTop=t.y),{x:r.scrollLeft,y:r.scrollTop}}}();
return s(arg)
}
exports.setElementAttribute=function(arg){
var s=function(){"use strict";return function(t){var e=t.element,r=t.attr,n=t.value;e.setAttribute(r,n)}}();
return s(arg)
}
exports.setElementStyleProperty=function(arg){
var s=function(){"use strict";return function(e){var t=void 0===e?{}:e,r=t.element,n=t.property,u=t.value,s=r.style[n];return r.style[n]=u,s}}();
return s(arg)
}
exports.translateTo=function(arg){
var s=function(){"use strict";var e=function(e){var t=void 0===e?{}:e,r=t.element,n=t.property,o=t.value,u=r.style[n];return r.style[n]=o,u};return function(t){var r=void 0===t?{}:t,n=r.offset,o=r.element,u=void 0===o?document.documentElement:o,a="translate("+-n.x+"px, "+-n.y+"px)";return e({element:u,property:"transform",value:a}),e({element:u,property:"webkitTransform",value:a}),n}}();
return s(arg)
}