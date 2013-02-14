/*! Mopidy.js - built 2013-02-09
 * http://www.mopidy.com/
 * Copyright (c) 2013 Stein Magnus Jodal and contributors
 * Licensed under the Apache License, Version 2.0 */
function Mopidy(e){if(!(this instanceof Mopidy))return new Mopidy(e);this._settings=this._configure(e||{}),this._console=this._getConsole(),this._backoffDelay=this._settings.backoffDelayMin,this._pendingRequests={},this._webSocket=null,bane.createEventEmitter(this),this._delegateEvents(),this._settings.autoConnect&&this.connect()}(typeof define=="function"&&define.amd&&function(e){define(e)}||typeof module=="object"&&function(e){module.exports=e()}||function(e){this.bane=e()})(function(){"use strict";function t(e,t,n){var r,i=n.length;if(i>0){for(r=0;r<i;++r)n[r](e,t);return}setTimeout(function(){throw t.message=e+" listener threw error: "+t.message,t},0)}function n(e){if(typeof e!="function")throw new TypeError("Listener is not function");return e}function r(e){return e.supervisors||(e.supervisors=[]),e.supervisors}function i(e,t){return e.listeners||(e.listeners={}),t&&!e.listeners[t]&&(e.listeners[t]=[]),t?e.listeners[t]:e.listeners}function s(e){return e.errbacks||(e.errbacks=[]),e.errbacks}function o(o){function u(e,n,r){try{n.listener.apply(n.thisp||o,r)}catch(i){t(e,i,s(o))}}return o=o||{},o.on=function(e,t,s){if(typeof e=="function")return r(this).push({listener:e,thisp:t});i(this,e).push({listener:n(t),thisp:s})},o.off=function(e,t){var n,o,u,a;if(!e){n=r(this),n.splice(0,n.length),o=i(this);for(u in o)o.hasOwnProperty(u)&&(n=i(this,u),n.splice(0,n.length));n=s(this),n.splice(0,n.length);return}typeof e=="function"?(n=r(this),t=e):n=i(this,e);if(!t){n.splice(0,n.length);return}for(u=0,a=n.length;u<a;++u)if(n[u].listener===t){n.splice(u,1);return}},o.once=function(e,t,n){var r=function(){o.off(e,r),t.apply(this,arguments)};o.on(e,r,n)},o.bind=function(e,t){var n,r,i;if(!t)for(n in e)typeof e[n]=="function"&&this.on(n,e[n],e);else for(r=0,i=t.length;r<i;++r){if(typeof e[t[r]]!="function")throw new Error("No such method "+t[r]);this.on(t[r],e[t[r]],e)}return e},o.emit=function(t){var n=r(this),s=e.call(arguments),o,a;for(o=0,a=n.length;o<a;++o)u(t,n[o],s);n=i(this,t).slice(),s=e.call(arguments,1);for(o=0,a=n.length;o<a;++o)u(t,n[o],s)},o.errback=function(e){this.errbacks||(this.errbacks=[]),this.errbacks.push(n(e))},o}var e=Array.prototype.slice;return{createEventEmitter:o}}),function(e){"use strict";e(["module"],function(){function r(e,t,n,r){return i(e).then(t,n,r)}function i(e){var t,n;return e instanceof o?t=e:(l(e)&&typeof e.valueOf=="function"&&(e=e.valueOf()),l(e)?(n=f(),e.then(n.resolve,n.reject,n.progress),t=n.promise):t=u(e)),t}function s(e){return r(e,function(e){return a(e)})}function o(e){this.then=e}function u(e){var t=new o(function(t){try{return i(t?t(e):e)}catch(n){return a(n)}});return t}function a(e){var t=new o(function(t,n){try{return n?i(n(e)):a(e)}catch(r){return a(r)}});return t}function f(){function h(e,t,n){return u(e,t,n)}function p(e){return c(e)}function d(e){return c(a(e))}function v(e){return l(e)}var e,t,r,s,u,l,c;return t=new o(h),e={then:h,resolve:p,reject:d,progress:v,promise:t,resolver:{resolve:p,reject:d,progress:v}},r=[],s=[],u=function(e,t,n){var i,o;return i=f(),o=n?function(e){try{i.progress(n(e))}catch(t){i.progress(t)}}:i.progress,r.push(function(n){n.then(e,t).then(i.resolve,i.reject,o)}),s.push(o),i.promise},l=function(e){return y(s,e),e},c=function(e){return e=i(e),u=e.then,c=i,l=w,y(r,e),s=r=n,e},e}function l(e){return e&&typeof e.then=="function"}function c(e,t,n,i,s){return b(2,arguments),r(e,function(e){function g(e){p(e)}function y(e){h(e)}var o,u,a,l,c,h,p,d,v,m;v=e.length>>>0,o=Math.max(0,Math.min(t,v)),a=[],u=v-o+1,l=[],c=f();if(!o)c.resolve(a);else{d=c.progress,p=function(e){l.push(e),--u||(h=p=w,c.reject(l))},h=function(e){a.push(e),--o||(h=p=w,c.resolve(a))};for(m=0;m<v;++m)m in e&&r(e[m],y,g,d)}return c.then(n,i,s)})}function h(e,t,n,r){function i(e){return t?t(e[0]):e[0]}return c(e,1,i,n,r)}function p(e,t,n,r){return b(1,arguments),v(e,E).then(t,n,r)}function d(){return v(arguments,E)}function v(e,t){return r(e,function(e){var n,i,s,o,u,a,l;s=i=e.length>>>0,n=[],l=f();if(!s)l.resolve(n);else{u=l.reject,o=function(i,o){r(i,t).then(function(e){n[o]=e,--s||l.resolve(n)},u)};for(a=0;a<i;a++)a in e?o(e[a],a):--s}return l.promise})}function m(n,i){var s=t.call(arguments,1);return r(n,function(t){var n;return n=t.length,s[0]=function(e,t,s){return r(e,function(e){return r(t,function(t){return i(e,t,s,n)})})},e.apply(t,s)})}function g(e,t,n){var i=arguments.length>2;return r(e,function(e){return t.resolve(i?n:e)},t.reject,t.progress)}function y(e,t){var n,r=0;while(n=e[r++])n(t)}function b(e,t){var n,r=t.length;while(r>e){n=t[--r];if(n!=null&&typeof n!="function")throw new Error("arg "+r+" must be a function")}}function w(){}function E(e){return e}var e,t,n;return r.defer=f,r.resolve=i,r.reject=s,r.join=d,r.all=p,r.some=c,r.any=h,r.map=v,r.reduce=m,r.chain=g,r.isPromise=l,o.prototype={always:function(e,t){return this.then(e,e,t)},otherwise:function(e){return this.then(n,e)}},t=[].slice,e=[].reduce||function(e){var t,n,r,i,s;s=0,t=Object(this),i=t.length>>>0,n=arguments;if(n.length<=1)for(;;){if(s in t){r=t[s++];break}if(++s>=i)throw new TypeError}else r=n[1];for(;s<i;++s)s in t&&(r=e(r,t[s],s,t));return r},r})}(typeof define=="function"&&define.amd?define:function(e,t){typeof exports=="object"?module.exports=t():this.when=t()}),Mopidy.prototype._configure=function(e){return e.webSocketUrl=e.webSocketUrl||"ws://"+document.location.host+"/mopidy/ws/",e.autoConnect!==!1&&(e.autoConnect=!0),e.backoffDelayMin=e.backoffDelayMin||1e3,e.backoffDelayMax=e.backoffDelayMax||64e3,e},Mopidy.prototype._getConsole=function(){var e=window.console||{};return e.log=e.log||function(){},e.warn=e.warn||function(){},e.error=e.error||function(){},e},Mopidy.prototype._delegateEvents=function(){this.off("websocket:close"),this.off("websocket:error"),this.off("websocket:incomingMessage"),this.off("websocket:open"),this.off("state:offline"),this.on("websocket:close",this._cleanup),this.on("websocket:error",this._handleWebSocketError),this.on("websocket:incomingMessage",this._handleMessage),this.on("websocket:open",this._resetBackoffDelay),this.on("websocket:open",this._getApiSpec),this.on("state:offline",this._reconnect)},Mopidy.prototype.connect=function(){if(this._webSocket){if(this._webSocket.readyState===WebSocket.OPEN)return;this._webSocket.close()}this._webSocket=this._settings.webSocket||new WebSocket(this._settings.webSocketUrl),this._webSocket.onclose=function(e){this.emit("websocket:close",e)}.bind(this),this._webSocket.onerror=function(e){this.emit("websocket:error",e)}.bind(this),this._webSocket.onopen=function(){this.emit("websocket:open")}.bind(this),this._webSocket.onmessage=function(e){this.emit("websocket:incomingMessage",e)}.bind(this)},Mopidy.prototype._cleanup=function(e){Object.keys(this._pendingRequests).forEach(function(t){var n=this._pendingRequests[t];delete this._pendingRequests[t],n.reject({message:"WebSocket closed",closeEvent:e})}.bind(this)),this.emit("state:offline")},Mopidy.prototype._reconnect=function(){this.emit("reconnectionPending",{timeToAttempt:this._backoffDelay}),setTimeout(function(){this.emit("reconnecting"),this.connect()}.bind(this),this._backoffDelay),this._backoffDelay=this._backoffDelay*2,this._backoffDelay>this._settings.backoffDelayMax&&(this._backoffDelay=this._settings.backoffDelayMax)},Mopidy.prototype._resetBackoffDelay=function(){this._backoffDelay=this._settings.backoffDelayMin},Mopidy.prototype.close=function(){this.off("state:offline",this._reconnect),this._webSocket.close()},Mopidy.prototype._handleWebSocketError=function(e){this._console.warn("WebSocket error:",e.stack||e)},Mopidy.prototype._send=function(e){var t=when.defer();switch(this._webSocket.readyState){case WebSocket.CONNECTING:t.resolver.reject({message:"WebSocket is still connecting"});break;case WebSocket.CLOSING:t.resolver.reject({message:"WebSocket is closing"});break;case WebSocket.CLOSED:t.resolver.reject({message:"WebSocket is closed"});break;default:e.jsonrpc="2.0",e.id=this._nextRequestId(),this._pendingRequests[e.id]=t.resolver,this._webSocket.send(JSON.stringify(e)),this.emit("websocket:outgoingMessage",e)}return t.promise},Mopidy.prototype._nextRequestId=function(){var e=-1;return function(){return e+=1,e}}(),Mopidy.prototype._handleMessage=function(e){try{var t=JSON.parse(e.data);t.hasOwnProperty("id")?this._handleResponse(t):t.hasOwnProperty("event")?this._handleEvent(t):this._console.warn("Unknown message type received. Message was: "+e.data)}catch(n){if(!(n instanceof SyntaxError))throw n;this._console.warn("WebSocket message parsing failed. Message was: "+e.data)}},Mopidy.prototype._handleResponse=function(e){if(!this._pendingRequests.hasOwnProperty(e.id)){this._console.warn("Unexpected response received. Message was:",e);return}var t=this._pendingRequests[e.id];delete this._pendingRequests[e.id],e.hasOwnProperty("result")?t.resolve(e.result):e.hasOwnProperty("error")?(t.reject(e.error),this._console.warn("Server returned error:",e.error)):(t.reject({message:"Response without 'result' or 'error' received",data:{response:e}}),this._console.warn("Response without 'result' or 'error' received. Message was:",e))},Mopidy.prototype._handleEvent=function(e){var t=e.event,n=e;delete n.event,this.emit("event:"+this._snakeToCamel(t),n)},Mopidy.prototype._getApiSpec=function(){this._send({method:"core.describe"}).then(this._createApi.bind(this),this._handleWebSocketError).then(null,this._handleWebSocketError)},Mopidy.prototype._createApi=function(e){var t=function(e){return function(){var t=Array.prototype.slice.call(arguments);return this._send({method:e,params:t})}.bind(this)}.bind(this),n=function(e){var t=e.split(".");return t.length>=1&&t[0]==="core"&&(t=t.slice(1)),t},r=function(e){var t=this;return e.forEach(function(e){e=this._snakeToCamel(e),t[e]=t[e]||{},t=t[e]}.bind(this)),t}.bind(this),i=function(i){var s=n(i),o=this._snakeToCamel(s.slice(-1)[0]),u=r(s.slice(0,-1));u[o]=t(i),u[o].description=e[i].description,u[o].params=e[i].params}.bind(this);Object.keys(e).forEach(i),this.emit("state:online")},Mopidy.prototype._snakeToCamel=function(e){return e.replace(/(_[a-z])/g,function(e){return e.toUpperCase().replace("_","")})};