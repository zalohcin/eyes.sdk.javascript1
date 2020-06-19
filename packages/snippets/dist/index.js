exports.blurElement=function(){
var s=function(){"use strict";return function(t){return void 0===t&&(t=document.activeElement),t&&t.blur(),t}}();
return s.apply(this,arguments)
}
exports.findFixedAncestor=function(){
var s=function(){"use strict";return function(t){for(var e=t;e.offsetParent&&e.offsetParent!==document.body&&e.offsetParent!==document.documentElement;)e=e.offsetParent;return"fixed"===window.getComputedStyle(e).getPropertyValue("position")?e:null}}();
return s.apply(this,arguments)
}
exports.focusElement=function(){
var s=function(){"use strict";return function(n){n&&n.focus()}}();
return s.apply(this,arguments)
}
exports.generateElementXpath=function(){
var s=function(){"use strict";return function(r){var e="",t=r.ownerDocument;if(!t)return e;for(var n=r;n!==t;){var a=Array.from(n.parentNode.childNodes).filter((function(r){return r.tagName===n.tagName})).indexOf(n);e="/"+n.tagName+"["+(a+1)+"]"+e,n=n.parentNode}return e}}();
return s.apply(this,arguments)
}
exports.getContextInfo=function(){
var s=function(){"use strict";var t=function(t){var e="",n=t.ownerDocument;if(!n)return e;for(var r=t;r!==n;){var o=Array.from(r.parentNode.childNodes).filter((function(t){return t.tagName===r.tagName})).indexOf(r);e="/"+r.tagName+"["+(o+1)+"]"+e,r=r.parentNode}return e};return function(){var e,n,r;try{e=window.top.document===window.document}catch(t){e=!1}try{n=!window.parent.document===window.document}catch(t){n=!0}if(!n)try{r=t(window.frameElement)}catch(t){r=null}return{isRoot:e,isCORS:n,selector:r,documentElement:document.documentElement}}}();
return s.apply(this,arguments)
}
exports.getDocumentEntireSize=function(){
var s=function(){"use strict";return function(){var t=document.documentElement.scrollWidth,e=document.documentElement.scrollHeight,n=document.documentElement.clientHeight,c=document.body.scrollWidth,o=document.body.scrollHeight,d=document.body.clientHeight;return{width:Math.max(t,c),height:Math.max(n,e,d,o)}}}();
return s.apply(this,arguments)
}
exports.getElementCssProperties=function(){
var s=function(){"use strict";return function(t,r){void 0===r&&(r=[]);var e=window.getComputedStyle(t);return e?r.map((function(t){return e.getPropertyValue(t)})):[]}}();
return s.apply(this,arguments)
}
exports.getElementEntireSize=function(){
var s=function(){"use strict";return function(t){return{width:Math.max(t.clientWidth,t.scrollWidth),height:Math.max(t.clientHeight,t.scrollHeight)}}}();
return s.apply(this,arguments)
}
exports.getElementOverflow=function(){
var s=function(){"use strict";return function(r){return r.style.overflow}}();
return s.apply(this,arguments)
}
exports.getElementProperties=function(){
var s=function(){"use strict";return function(n,r){return void 0===r&&(r=[]),r.map((function(r){return n[r]}))}}();
return s.apply(this,arguments)
}
exports.getElementRect=function(){
var s=function(){"use strict";var t=function(t){for(var e=t;e.offsetParent&&e.offsetParent!==document.body&&e.offsetParent!==document.documentElement;)e=e.offsetParent;return"fixed"===window.getComputedStyle(e).getPropertyValue("position")?e:null};var e=function(t){return t.scrollWidth>t.clientWidth||t.scrollHeight>t.clientHeight};var r=function(t){return t?{x:t.scrollLeft,y:t.scrollTop}:{x:window.scrollX||window.pageXOffset,y:window.scrollY||window.pageYOffset}};return function(o,n){void 0===n&&(n=!1);var i=o.getBoundingClientRect(),l={x:i.left,y:i.top,width:i.width,height:i.height};if(n){var d=window.getComputedStyle(o);l.x+=Number.parseInt(d.getPropertyValue("border-left-width")),l.y+=Number.parseInt(d.getPropertyValue("border-top-width")),l.width=o.clientWidth,l.height=o.clientHeight}var f=t(o);if(f){var w=e(f);if(f!==o&&w){var a=r(f);l.x+=a.x,l.y+=a.y}}else l.x+=window.scrollX||window.pageXOffset,l.y+=window.scrollY||window.pageYOffset;return l}}();
return s.apply(this,arguments)
}
exports.getInnerOffsets=function(){
var s=function(){"use strict";var r=function(r){return r?{x:r.scrollLeft,y:r.scrollTop}:{x:window.scrollX||window.pageXOffset,y:window.scrollY||window.pageYOffset}},t=["transform","-webkit-transform"];var n=function(r){return void 0===r&&(r=document.documentElement),t.reduce((function(t,n){return t[n]=r.style[n],t}),{})};var e=function(r){void 0===r&&(r=document.documentElement);var t=n(r),e=Object.keys(t).reduce((function(r,n){var e=t[n];if(e){var o=e.match(/^translate\(\s*(\-?[\d, \.]+)px,\s*(\-?[\d, \.]+)px\s*\)/);if(!o)throw new Error("Can't parse CSS transition: "+e+"!");r.push({x:Math.round(-parseFloat(o[1])),y:Math.round(-parseFloat(o[2]))})}return r}),[]);if(!e.every((function(r){return e[0].x===r.x||e[0].y===r.y})))throw new Error("Got different css positions!");return e[0]||{x:0,y:0}};return function(t){var n=r(t),o=e(t);return{x:n.x+o.x,y:n.y+o.y}}}();
return s.apply(this,arguments)
}
exports.getScrollOffset=function(){
var s=function(){"use strict";return function(o){return o?{x:o.scrollLeft,y:o.scrollTop}:{x:window.scrollX||window.pageXOffset,y:window.scrollY||window.pageYOffset}}}();
return s.apply(this,arguments)
}
exports.getTransforms=function(){
var s=function(){"use strict";var t=["transform","-webkit-transform"];return function(n){return void 0===n&&(n=document.documentElement),t.reduce((function(t,r){return t[r]=n.style[r],t}),{})}}();
return s.apply(this,arguments)
}
exports.getTranslateOffset=function(){
var s=function(){"use strict";var r=["transform","-webkit-transform"];var t=function(t){return void 0===t&&(t=document.documentElement),r.reduce((function(r,n){return r[n]=t.style[n],r}),{})};return function(r){void 0===r&&(r=document.documentElement);var n=t(r),e=Object.keys(n).reduce((function(r,t){var e=n[t];if(e){var o=e.match(/^translate\(\s*(\-?[\d, \.]+)px,\s*(\-?[\d, \.]+)px\s*\)/);if(!o)throw new Error("Can't parse CSS transition: "+e+"!");r.push({x:Math.round(-parseFloat(o[1])),y:Math.round(-parseFloat(o[2]))})}return r}),[]);if(!e.every((function(r){return e[0].x===r.x||e[0].y===r.y})))throw new Error("Got different css positions!");return e[0]||{x:0,y:0}}}();
return s.apply(this,arguments)
}
exports.getViewportSize=function(){
var s=function(){"use strict";return function(){var e=0,t=0;return window.innerHeight?t=window.innerHeight:document.documentElement&&document.documentElement.clientHeight?t=document.documentElement.clientHeight:document.body&&document.body.clientHeight&&(t=document.body.clientHeight),window.innerWidth?e=window.innerWidth:document.documentElement&&document.documentElement.clientWidth?e=document.documentElement.clientWidth:document.body&&document.body.clientWidth&&(e=document.body.clientWidth),{width:e,height:t}}}();
return s.apply(this,arguments)
}
exports.isElementScrollable=function(){
var s=function(){"use strict";return function(t){return t.scrollWidth>t.clientWidth||t.scrollHeight>t.clientHeight}}();
return s.apply(this,arguments)
}
exports.scrollTo=function(){
var s=function(){"use strict";return function(o,l){return void 0===l&&(l=document.documentElement),l.scrollTo?l.scrollTo(o.x,o.y):(l.scrollTop=o.x,l.scrollLeft=o.y),{x:l.scrollLeft,y:l.scrollTop}}}();
return s.apply(this,arguments)
}
exports.setElementAttribute=function(){
var s=function(){"use strict";return function(t,n,r){t.setAttribute(n,r)}}();
return s.apply(this,arguments)
}
exports.setElementOverflow=function(){
var s=function(){"use strict";return function(r,t){var e=r.style.overflow;return r.style.overflow=t,e}}();
return s.apply(this,arguments)
}
exports.setTransforms=function(){
var s=function(){"use strict";var t=["transform","-webkit-transform"];return function(n,r){void 0===r&&(r=document.documentElement),t.forEach((function(t){r.style[t]="string"==typeof n?n:n[t]}))}}();
return s.apply(this,arguments)
}
exports.translateTo=function(){
var s=function(){"use strict";var t=["transform","-webkit-transform"];var n=function(n,e){void 0===e&&(e=document.documentElement),t.forEach((function(t){e.style[t]="string"==typeof n?n:n[t]}))};return function(t,e){return void 0===e&&(e=document.documentElement),n("translate("+-t.x+"px, "+-t.y+"px)",e),t}}();
return s.apply(this,arguments)
}