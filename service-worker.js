/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/iss-tracker/bower_components/google-apis/google-maps-api.html","2c4413a928c652e5b9d4fa4b5e5615f2"],["/iss-tracker/bower_components/google-map/google-map-marker.html","c87033bd3f3378cc077bbd4c7f41676e"],["/iss-tracker/bower_components/google-map/google-map.html","7b6d62ce7b316cfb93617aa040503d0a"],["/iss-tracker/bower_components/iron-a11y-keys-behavior/iron-a11y-keys-behavior.html","de57201642e8aa7eadebad45ca7b35e7"],["/iss-tracker/bower_components/iron-ajax/iron-ajax.html","0e549efa574d0bdda759893a51390e00"],["/iss-tracker/bower_components/iron-ajax/iron-request.html","08b1c759435db3caa2b9378ccd686e39"],["/iss-tracker/bower_components/iron-behaviors/iron-button-state.html","2034e45c1e5117b83033713cda6a0b4f"],["/iss-tracker/bower_components/iron-behaviors/iron-control-state.html","d57c6bfd619425b963c65c312a054ab2"],["/iss-tracker/bower_components/iron-checked-element-behavior/iron-checked-element-behavior.html","0e28003f171922990b2a8ea1ccb9d130"],["/iss-tracker/bower_components/iron-flex-layout/iron-flex-layout.html","40fbf9b980a269b5507022f32f9b413c"],["/iss-tracker/bower_components/iron-form-element-behavior/iron-form-element-behavior.html","b7b67529241d4996945b71a1c09f01b0"],["/iss-tracker/bower_components/iron-image/iron-image.html","0367b237486a99f74bf5ee140e95b3c8"],["/iss-tracker/bower_components/iron-jsonp-library/iron-jsonp-library.html","a82bca8ebc31b43bbb4db734e918578c"],["/iss-tracker/bower_components/iron-menu-behavior/iron-menu-behavior.html","bb8aada82d13df5b839923fc817484b2"],["/iss-tracker/bower_components/iron-menu-behavior/iron-menubar-behavior.html","e86b1a7fd638275ca05880ca0f6aa3eb"],["/iss-tracker/bower_components/iron-meta/iron-meta.html","d3401c6909ebd2a7da37f6bf5fae988b"],["/iss-tracker/bower_components/iron-resizable-behavior/iron-resizable-behavior.html","5eaa8354f13c3334cfdd1438089dd429"],["/iss-tracker/bower_components/iron-selector/iron-multi-selectable.html","802945ddfc16eb03e8b605fff57cebb9"],["/iss-tracker/bower_components/iron-selector/iron-selectable.html","b9248a704cc4895f7ecbccff8efd0edf"],["/iss-tracker/bower_components/iron-selector/iron-selection.html","30b5a0f391d92c70156b1830fb3bd0c6"],["/iss-tracker/bower_components/iron-selector/iron-selector.html","b16e67c27ef856b12149a467cc5223b0"],["/iss-tracker/bower_components/iron-validatable-behavior/iron-validatable-behavior.html","7baac7bb9d9812449b62290a46f070d7"],["/iss-tracker/bower_components/paper-behaviors/paper-checked-element-behavior.html","377ef379e22b072ffcd6374c63b90d62"],["/iss-tracker/bower_components/paper-behaviors/paper-inky-focus-behavior.html","3b088afa4531829d1a5b79d3bf5978f1"],["/iss-tracker/bower_components/paper-behaviors/paper-ripple-behavior.html","574608962bf3eb67383391cf8513d56b"],["/iss-tracker/bower_components/paper-card/paper-card.html","cf118e71bee637199ece0a506f3acd17"],["/iss-tracker/bower_components/paper-checkbox/paper-checkbox.html","c59f48813759864a7e8d4e84510db3ce"],["/iss-tracker/bower_components/paper-radio-button/paper-radio-button.html","0fda5b08994b26fe158a519d53de8e32"],["/iss-tracker/bower_components/paper-radio-group/paper-radio-group.html","3ca3e093d9684ee1f40b2bb3b380a70f"],["/iss-tracker/bower_components/paper-ripple/paper-ripple.html","b4cc3ee650f23101e9a4a0be44968a1a"],["/iss-tracker/bower_components/paper-styles/color.html","549925227bc04f9c17b52e2e35cd2e26"],["/iss-tracker/bower_components/paper-styles/default-theme.html","5357609d26772a270098c0e3ebb1bb98"],["/iss-tracker/bower_components/paper-styles/element-styles/paper-material-styles.html","8d8d619e6f98be2c5d7e49ca022e423c"],["/iss-tracker/bower_components/paper-styles/shadow.html","1f23a65a20ed44812df26a9c16468e3f"],["/iss-tracker/bower_components/polymer/lib/elements/array-selector.html","841dc72edc195009030cac467dcaccad"],["/iss-tracker/bower_components/polymer/lib/elements/custom-style.html","08afb86580116b7e4d39d43a39cd1d08"],["/iss-tracker/bower_components/polymer/lib/elements/dom-bind.html","41004de9dca438cb73383a94fe646d1f"],["/iss-tracker/bower_components/polymer/lib/elements/dom-if.html","c1fc3b3b3ddd0989b627cb0bfc520cb6"],["/iss-tracker/bower_components/polymer/lib/elements/dom-module.html","51f4c371c9410959c3feca850c742712"],["/iss-tracker/bower_components/polymer/lib/elements/dom-repeat.html","8ea3b0cf97eb7232f5f9a561d36115b3"],["/iss-tracker/bower_components/polymer/lib/legacy/class.html","72a154ebb7232938bdc65e94b13d7508"],["/iss-tracker/bower_components/polymer/lib/legacy/legacy-element-mixin.html","7b796531a0b47ac74059df0ada681333"],["/iss-tracker/bower_components/polymer/lib/legacy/mutable-data-behavior.html","727424c73ce82a221dd5d55dae8bfb7e"],["/iss-tracker/bower_components/polymer/lib/legacy/polymer-fn.html","80b9a95b6f9627267b498fae324c8aec"],["/iss-tracker/bower_components/polymer/lib/legacy/polymer.dom.html","44aedb235eec8a562cb3ad63bb1033ee"],["/iss-tracker/bower_components/polymer/lib/legacy/templatizer-behavior.html","e259e4210ec65f4c25459720ce7b71b0"],["/iss-tracker/bower_components/polymer/lib/mixins/dir-mixin.html","db536a9ada8cdc0fb2fc010e59fbc5e5"],["/iss-tracker/bower_components/polymer/lib/mixins/element-mixin.html","a2607ad7b0e6e857edf8bb438dbd8030"],["/iss-tracker/bower_components/polymer/lib/mixins/gesture-event-listeners.html","11c9f3ad714623f52dea07e6afaa2b30"],["/iss-tracker/bower_components/polymer/lib/mixins/mutable-data.html","0c86e6cf2ad4f58a247cbb4e3b8fe365"],["/iss-tracker/bower_components/polymer/lib/mixins/properties-changed.html","941485133606f5066c9d713748ca896f"],["/iss-tracker/bower_components/polymer/lib/mixins/properties-mixin.html","b89faebafe8686dffaeb79a3abc83162"],["/iss-tracker/bower_components/polymer/lib/mixins/property-accessors.html","7287eb3f0383d7e8da9a3b18e569ed7e"],["/iss-tracker/bower_components/polymer/lib/mixins/property-effects.html","3f82d74daf72dbfaa8a652e42751c8af"],["/iss-tracker/bower_components/polymer/lib/mixins/template-stamp.html","30a841e5dc48ec28ae2ec04c071c6205"],["/iss-tracker/bower_components/polymer/lib/utils/array-splice.html","02e37f7a718cb6724e4c1101fd9fe693"],["/iss-tracker/bower_components/polymer/lib/utils/async.html","2f5b326d88e8030cd26781095235fd6c"],["/iss-tracker/bower_components/polymer/lib/utils/boot.html","b60843623cc8cb524686f5c9c77b77e0"],["/iss-tracker/bower_components/polymer/lib/utils/case-map.html","3348b08018d83d39a4447a6bbaa896af"],["/iss-tracker/bower_components/polymer/lib/utils/debounce.html","bdb9a2e69ead51e6b8bf27583d040e27"],["/iss-tracker/bower_components/polymer/lib/utils/flattened-nodes-observer.html","0e34b65431c3aca1e492f459f0f64623"],["/iss-tracker/bower_components/polymer/lib/utils/flush.html","02cf15aa4ad4cc7edc87d6c5724d2c0f"],["/iss-tracker/bower_components/polymer/lib/utils/gestures.html","23630718c66b674e8cd0cfd942b2b653"],["/iss-tracker/bower_components/polymer/lib/utils/html-tag.html","95f4ef70c3d2d142f390a98470c194b4"],["/iss-tracker/bower_components/polymer/lib/utils/import-href.html","d6093e9c471580c1cb35f7686c772fde"],["/iss-tracker/bower_components/polymer/lib/utils/mixin.html","5ec7b79aa4871070458783ac7c2980a9"],["/iss-tracker/bower_components/polymer/lib/utils/path.html","279780f8fac6e7f4048f3895f7a05fda"],["/iss-tracker/bower_components/polymer/lib/utils/render-status.html","c14138dff3da4d203b9bdca9bd93b929"],["/iss-tracker/bower_components/polymer/lib/utils/resolve-url.html","5bc2e90748b9845386f19a1eee5d1191"],["/iss-tracker/bower_components/polymer/lib/utils/settings.html","4f688f5909f8493a10a5012176c911cc"],["/iss-tracker/bower_components/polymer/lib/utils/style-gather.html","1e10e8f6f06cf5d4f976e3fd905f1252"],["/iss-tracker/bower_components/polymer/lib/utils/templatize.html","8c31c01b8471caf635004e0ca99a27b1"],["/iss-tracker/bower_components/polymer/lib/utils/unresolved.html","50b8ec3ab60b6b40f4cf4fc931027b80"],["/iss-tracker/bower_components/polymer/polymer-element.html","26c3b3b8ee7b81243474c7d95636d157"],["/iss-tracker/bower_components/polymer/polymer.html","72d557b84da0412316b422d8325ad25c"],["/iss-tracker/bower_components/shadycss/apply-shim.html","5b73ef5bfcac4955f6c24f55ea322eb1"],["/iss-tracker/bower_components/shadycss/apply-shim.min.js","e1adb71a5f681fab6f137f8ddd60d745"],["/iss-tracker/bower_components/shadycss/custom-style-interface.html","7e28230b85cdcc2488e87172c3395d52"],["/iss-tracker/bower_components/shadycss/custom-style-interface.min.js","72c0678c9e5acee7852cd040f59a214e"],["/iss-tracker/bower_components/webcomponentsjs/webcomponents-loader.js","596ad3dc06dfb78ecdc6bcee1d653f04"],["/iss-tracker/index.html","2036d02309a3ad6df20ee3cf0eecac48"],["/iss-tracker/manifest.json","3884a43e7dd626c245f7f61d1c08158c"],["/iss-tracker/src/iss-tracker.html","26974dd0053b6272034a67143e83efb3"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function (body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function (whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function (kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function (kv) {
        return ignoreUrlParametersMatching.every(function (ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function (kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function (item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function (requests) {
    return requests.map(function (request) {
      return request.url;
    });
  }).then(function (urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return setOfCachedUrls(cache).then(function (cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function (cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function (response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function (responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function () {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function (event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.keys().then(function (existingRequests) {
        return Promise.all(
          existingRequests.map(function (existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function () {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function (event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = '';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = 'index.html';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted(["\\/[^\\/\\.]*(\\?|$)"], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function (cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function (response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function (e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});


// *** Start of auto-included sw-toolbox code. ***
/* 
 Copyright 2016 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/!function (e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.toolbox=e()}}(function (){return function e(t,n,r){function o(c,s){if(!n[c]){if(!t[c]){var a="function"==typeof require&&require;if(!s&&a)return a(c,!0);if(i)return i(c,!0);var u=new Error("Cannot find module '"+c+"'");throw u.code="MODULE_NOT_FOUND",u}var f=n[c]={exports:{}};t[c][0].call(f.exports,function (e){var n=t[c][1][e];return o(n?n:e)},f,f.exports,e,t,n,r)}return n[c].exports}for(var i="function"==typeof require&&require,c=0;c<r.length;c++)o(r[c]);return o}({1:[function (e,t,n){"use strict";function r(e,t){t=t||{};var n=t.debug||m.debug;n&&console.log("[sw-toolbox] "+e)}function o(e){var t;return e&&e.cache&&(t=e.cache.name),t=t||m.cache.name,caches.open(t)}function i(e,t){t=t||{};var n=t.successResponses||m.successResponses;return fetch(e.clone()).then(function (r){return"GET"===e.method&&n.test(r.status)&&o(t).then(function (n){n.put(e,r).then(function (){var r=t.cache||m.cache;(r.maxEntries||r.maxAgeSeconds)&&r.name&&c(e,n,r)})}),r.clone()})}function c(e,t,n){var r=s.bind(null,e,t,n);d=d?d.then(r):r()}function s(e,t,n){var o=e.url,i=n.maxAgeSeconds,c=n.maxEntries,s=n.name,a=Date.now();return r("Updating LRU order for "+o+". Max entries is "+c+", max age is "+i),g.getDb(s).then(function (e){return g.setTimestampForUrl(e,o,a)}).then(function (e){return g.expireEntries(e,c,i,a)}).then(function (e){r("Successfully updated IDB.");var n=e.map(function (e){return t.delete(e)});return Promise.all(n).then(function (){r("Done with cache cleanup.")})}).catch(function (e){r(e)})}function a(e,t,n){return r("Renaming cache: ["+e+"] to ["+t+"]",n),caches.delete(t).then(function (){return Promise.all([caches.open(e),caches.open(t)]).then(function (t){var n=t[0],r=t[1];return n.keys().then(function (e){return Promise.all(e.map(function (e){return n.match(e).then(function (t){return r.put(e,t)})}))}).then(function (){return caches.delete(e)})})})}function u(e,t){return o(t).then(function (t){return t.add(e)})}function f(e,t){return o(t).then(function (t){return t.delete(e)})}function h(e){e instanceof Promise||p(e),m.preCacheItems=m.preCacheItems.concat(e)}function p(e){var t=Array.isArray(e);if(t&&e.forEach(function (e){"string"==typeof e||e instanceof Request||(t=!1)}),!t)throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");return e}function l(e,t,n){if(!e)return!1;if(t){var r=e.headers.get("date");if(r){var o=new Date(r);if(o.getTime()+1e3*t<n)return!1}}return!0}var d,m=e("./options"),g=e("./idb-cache-expiration");t.exports={debug:r,fetchAndCache:i,openCache:o,renameCache:a,cache:u,uncache:f,precache:h,validatePrecacheInput:p,isResponseFresh:l}},{"./idb-cache-expiration":2,"./options":4}],2:[function (e,t,n){"use strict";function r(e){return new Promise(function (t,n){var r=indexedDB.open(u+e,f);r.onupgradeneeded=function (){var e=r.result.createObjectStore(h,{keyPath:p});e.createIndex(l,l,{unique:!1})},r.onsuccess=function (){t(r.result)},r.onerror=function (){n(r.error)}})}function o(e){return e in d||(d[e]=r(e)),d[e]}function i(e,t,n){return new Promise(function (r,o){var i=e.transaction(h,"readwrite"),c=i.objectStore(h);c.put({url:t,timestamp:n}),i.oncomplete=function (){r(e)},i.onabort=function (){o(i.error)}})}function c(e,t,n){return t?new Promise(function (r,o){var i=1e3*t,c=[],s=e.transaction(h,"readwrite"),a=s.objectStore(h),u=a.index(l);u.openCursor().onsuccess=function (e){var t=e.target.result;if(t&&n-i>t.value[l]){var r=t.value[p];c.push(r),a.delete(r),t.continue()}},s.oncomplete=function (){r(c)},s.onabort=o}):Promise.resolve([])}function s(e,t){return t?new Promise(function (n,r){var o=[],i=e.transaction(h,"readwrite"),c=i.objectStore(h),s=c.index(l),a=s.count();s.count().onsuccess=function (){var e=a.result;e>t&&(s.openCursor().onsuccess=function (n){var r=n.target.result;if(r){var i=r.value[p];o.push(i),c.delete(i),e-o.length>t&&r.continue()}})},i.oncomplete=function (){n(o)},i.onabort=r}):Promise.resolve([])}function a(e,t,n,r){return c(e,n,r).then(function (n){return s(e,t).then(function (e){return n.concat(e)})})}var u="sw-toolbox-",f=1,h="store",p="url",l="timestamp",d={};t.exports={getDb:o,setTimestampForUrl:i,expireEntries:a}},{}],3:[function (e,t,n){"use strict";function r(e){var t=a.match(e.request);t?e.respondWith(t(e.request)):a.default&&"GET"===e.request.method&&0===e.request.url.indexOf("http")&&e.respondWith(a.default(e.request))}function o(e){s.debug("activate event fired");var t=u.cache.name+"$$$inactive$$$";e.waitUntil(s.renameCache(t,u.cache.name))}function i(e){return e.reduce(function (e,t){return e.concat(t)},[])}function c(e){var t=u.cache.name+"$$$inactive$$$";s.debug("install event fired"),s.debug("creating cache ["+t+"]"),e.waitUntil(s.openCache({cache:{name:t}}).then(function (e){return Promise.all(u.preCacheItems).then(i).then(s.validatePrecacheInput).then(function (t){return s.debug("preCache list: "+(t.join(", ")||"(none)")),e.addAll(t)})}))}e("serviceworker-cache-polyfill");var s=e("./helpers"),a=e("./router"),u=e("./options");t.exports={fetchListener:r,activateListener:o,installListener:c}},{"./helpers":1,"./options":4,"./router":6,"serviceworker-cache-polyfill":16}],4:[function (e,t,n){"use strict";var r;r=self.registration?self.registration.scope:self.scope||new URL("./",self.location).href,t.exports={cache:{name:"$$$toolbox-cache$$$"+r+"$$$",maxAgeSeconds:null,maxEntries:null},debug:!1,networkTimeoutSeconds:null,preCacheItems:[],successResponses:/^0|([123]\d\d)|(40[14567])|410$/}},{}],5:[function (e,t,n){"use strict";var r=new URL("./",self.location),o=r.pathname,i=e("path-to-regexp"),c=function (e,t,n,r){t instanceof RegExp?this.fullUrlRegExp=t:(0!==t.indexOf("/")&&(t=o+t),this.keys=[],this.regexp=i(t,this.keys)),this.method=e,this.options=r,this.handler=n};c.prototype.makeHandler=function (e){var t;if(this.regexp){var n=this.regexp.exec(e);t={},this.keys.forEach(function (e,r){t[e.name]=n[r+1]})}return function (e){return this.handler(e,t,this.options)}.bind(this)},t.exports=c},{"path-to-regexp":15}],6:[function (e,t,n){"use strict";function r(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}var o=e("./route"),i=e("./helpers"),c=function (e,t){for(var n=e.entries(),r=n.next(),o=[];!r.done;){var i=new RegExp(r.value[0]);i.test(t)&&o.push(r.value[1]),r=n.next()}return o},s=function (){this.routes=new Map,this.routes.set(RegExp,new Map),this.default=null};["get","post","put","delete","head","any"].forEach(function (e){s.prototype[e]=function (t,n,r){return this.add(e,t,n,r)}}),s.prototype.add=function (e,t,n,c){c=c||{};var s;t instanceof RegExp?s=RegExp:(s=c.origin||self.location.origin,s=s instanceof RegExp?s.source:r(s)),e=e.toLowerCase();var a=new o(e,t,n,c);this.routes.has(s)||this.routes.set(s,new Map);var u=this.routes.get(s);u.has(e)||u.set(e,new Map);var f=u.get(e),h=a.regexp||a.fullUrlRegExp;f.has(h.source)&&i.debug('"'+t+'" resolves to same regex as existing route.'),f.set(h.source,a)},s.prototype.matchMethod=function (e,t){var n=new URL(t),r=n.origin,o=n.pathname;return this._match(e,c(this.routes,r),o)||this._match(e,[this.routes.get(RegExp)],t)},s.prototype._match=function (e,t,n){if(0===t.length)return null;for(var r=0;r<t.length;r++){var o=t[r],i=o&&o.get(e.toLowerCase());if(i){var s=c(i,n);if(s.length>0)return s[0].makeHandler(n)}}return null},s.prototype.match=function (e){return this.matchMethod(e.method,e.url)||this.matchMethod("any",e.url)},t.exports=new s},{"./helpers":1,"./route":5}],7:[function (e,t,n){"use strict";function r(e,t,n){return n=n||{},i.debug("Strategy: cache first ["+e.url+"]",n),i.openCache(n).then(function (t){return t.match(e).then(function (t){var r=n.cache||o.cache,c=Date.now();return i.isResponseFresh(t,r.maxAgeSeconds,c)?t:i.fetchAndCache(e,n)})})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],8:[function (e,t,n){"use strict";function r(e,t,n){return n=n||{},i.debug("Strategy: cache only ["+e.url+"]",n),i.openCache(n).then(function (t){return t.match(e).then(function (e){var t=n.cache||o.cache,r=Date.now();if(i.isResponseFresh(e,t.maxAgeSeconds,r))return e})})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],9:[function (e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: fastest ["+e.url+"]",n),new Promise(function (r,c){var s=!1,a=[],u=function (e){a.push(e.toString()),s?c(new Error('Both cache and network failed: "'+a.join('", "')+'"')):s=!0},f=function (e){e instanceof Response?r(e):u("No result returned")};o.fetchAndCache(e.clone(),n).then(f,u),i(e,t,n).then(f,u)})}var o=e("../helpers"),i=e("./cacheOnly");t.exports=r},{"../helpers":1,"./cacheOnly":8}],10:[function (e,t,n){t.exports={networkOnly:e("./networkOnly"),networkFirst:e("./networkFirst"),cacheOnly:e("./cacheOnly"),cacheFirst:e("./cacheFirst"),fastest:e("./fastest")}},{"./cacheFirst":7,"./cacheOnly":8,"./fastest":9,"./networkFirst":11,"./networkOnly":12}],11:[function (e,t,n){"use strict";function r(e,t,n){n=n||{};var r=n.successResponses||o.successResponses,c=n.networkTimeoutSeconds||o.networkTimeoutSeconds;return i.debug("Strategy: network first ["+e.url+"]",n),i.openCache(n).then(function (t){var s,a,u=[];if(c){var f=new Promise(function (r){s=setTimeout(function (){t.match(e).then(function (e){var t=n.cache||o.cache,c=Date.now(),s=t.maxAgeSeconds;i.isResponseFresh(e,s,c)&&r(e)})},1e3*c)});u.push(f)}var h=i.fetchAndCache(e,n).then(function (e){if(s&&clearTimeout(s),r.test(e.status))return e;throw i.debug("Response was an HTTP error: "+e.statusText,n),a=e,new Error("Bad response")}).catch(function (r){return i.debug("Network or response error, fallback to cache ["+e.url+"]",n),t.match(e).then(function (e){if(e)return e;if(a)return a;throw r})});return u.push(h),Promise.race(u)})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],12:[function (e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: network only ["+e.url+"]",n),fetch(e)}var o=e("../helpers");t.exports=r},{"../helpers":1}],13:[function (e,t,n){"use strict";var r=e("./options"),o=e("./router"),i=e("./helpers"),c=e("./strategies"),s=e("./listeners");i.debug("Service Worker Toolbox is loading"),self.addEventListener("install",s.installListener),self.addEventListener("activate",s.activateListener),self.addEventListener("fetch",s.fetchListener),t.exports={networkOnly:c.networkOnly,networkFirst:c.networkFirst,cacheOnly:c.cacheOnly,cacheFirst:c.cacheFirst,fastest:c.fastest,router:o,options:r,cache:i.cache,uncache:i.uncache,precache:i.precache}},{"./helpers":1,"./listeners":3,"./options":4,"./router":6,"./strategies":10}],14:[function (e,t,n){t.exports=Array.isArray||function (e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],15:[function (e,t,n){function r(e,t){for(var n,r=[],o=0,i=0,c="",s=t&&t.delimiter||"/";null!=(n=x.exec(e));){var f=n[0],h=n[1],p=n.index;if(c+=e.slice(i,p),i=p+f.length,h)c+=h[1];else{var l=e[i],d=n[2],m=n[3],g=n[4],v=n[5],w=n[6],y=n[7];c&&(r.push(c),c="");var b=null!=d&&null!=l&&l!==d,E="+"===w||"*"===w,R="?"===w||"*"===w,k=n[2]||s,$=g||v;r.push({name:m||o++,prefix:d||"",delimiter:k,optional:R,repeat:E,partial:b,asterisk:!!y,pattern:$?u($):y?".*":"[^"+a(k)+"]+?"})}}return i<e.length&&(c+=e.substr(i)),c&&r.push(c),r}function o(e,t){return s(r(e,t))}function i(e){return encodeURI(e).replace(/[\/?#]/g,function (e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function c(e){return encodeURI(e).replace(/[?#]/g,function (e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function s(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function (n,r){for(var o="",s=n||{},a=r||{},u=a.pretty?i:encodeURIComponent,f=0;f<e.length;f++){var h=e[f];if("string"!=typeof h){var p,l=s[h.name];if(null==l){if(h.optional){h.partial&&(o+=h.prefix);continue}throw new TypeError('Expected "'+h.name+'" to be defined')}if(v(l)){if(!h.repeat)throw new TypeError('Expected "'+h.name+'" to not repeat, but received `'+JSON.stringify(l)+"`");if(0===l.length){if(h.optional)continue;throw new TypeError('Expected "'+h.name+'" to not be empty')}for(var d=0;d<l.length;d++){if(p=u(l[d]),!t[f].test(p))throw new TypeError('Expected all "'+h.name+'" to match "'+h.pattern+'", but received `'+JSON.stringify(p)+"`");o+=(0===d?h.prefix:h.delimiter)+p}}else{if(p=h.asterisk?c(l):u(l),!t[f].test(p))throw new TypeError('Expected "'+h.name+'" to match "'+h.pattern+'", but received "'+p+'"');o+=h.prefix+p}}else o+=h}return o}}function a(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function u(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function f(e,t){return e.keys=t,e}function h(e){return e.sensitive?"":"i"}function p(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return f(e,t)}function l(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(g(e[o],t,n).source);var i=new RegExp("(?:"+r.join("|")+")",h(n));return f(i,t)}function d(e,t,n){return m(r(e,n),t,n)}function m(e,t,n){v(t)||(n=t||n,t=[]),n=n||{};for(var r=n.strict,o=n.end!==!1,i="",c=0;c<e.length;c++){var s=e[c];if("string"==typeof s)i+=a(s);else{var u=a(s.prefix),p="(?:"+s.pattern+")";t.push(s),s.repeat&&(p+="(?:"+u+p+")*"),p=s.optional?s.partial?u+"("+p+")?":"(?:"+u+"("+p+"))?":u+"("+p+")",i+=p}}var l=a(n.delimiter||"/"),d=i.slice(-l.length)===l;return r||(i=(d?i.slice(0,-l.length):i)+"(?:"+l+"(?=$))?"),i+=o?"$":r&&d?"":"(?="+l+"|$)",f(new RegExp("^"+i,h(n)),t)}function g(e,t,n){return v(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?p(e,t):v(e)?l(e,t,n):d(e,t,n)}var v=e("isarray");t.exports=g,t.exports.parse=r,t.exports.compile=o,t.exports.tokensToFunction=s,t.exports.tokensToRegExp=m;var x=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},{isarray:14}],16:[function (e,t,n){!function (){var e=Cache.prototype.addAll,t=navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);if(t)var n=t[1],r=parseInt(t[2]);e&&(!t||"Firefox"===n&&r>=46||"Chrome"===n&&r>=50)||(Cache.prototype.addAll=function (e){function t(e){this.name="NetworkError",this.code=19,this.message=e}var n=this;return t.prototype=Object.create(Error.prototype),Promise.resolve().then(function (){if(arguments.length<1)throw new TypeError;return e=e.map(function (e){return e instanceof Request?e:String(e)}),Promise.all(e.map(function (e){"string"==typeof e&&(e=new Request(e));var n=new URL(e.url).protocol;if("http:"!==n&&"https:"!==n)throw new t("Invalid scheme");return fetch(e.clone())}))}).then(function (r){if(r.some(function (e){return!e.ok}))throw new t("Incorrect response status");return Promise.all(r.map(function (t,r){return n.put(e[r],t)}))}).then(function (){})},Cache.prototype.add=function (e){return this.addAll([e])})}()},{}]},{},[13])(13)});


// *** End of auto-included sw-toolbox code. ***



// Runtime cache configuration, using the sw-toolbox library.

toolbox.router.get(/\/bower_components\/webcomponentsjs\/.*.js/, toolbox.fastest, {"cache":{"name":"webcomponentsjs-polyfills-cache"}});




