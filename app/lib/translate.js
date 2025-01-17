(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = 'function' == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw ((a.code = 'MODULE_NOT_FOUND'), a);
                }
                var p = (n[i] = { exports: {} });
                e[i][0].call(
                    p.exports,
                    function (r) {
                        var n = e[i][1][r];
                        return o(n || r);
                    },
                    p,
                    p.exports,
                    r,
                    e,
                    n,
                    t
                );
            }
            return n[i].exports;
        }
        for (
            var u = 'function' == typeof require && require, i = 0;
            i < t.length;
            i++
        )
            o(t[i]);
        return o;
    }
    return r;
})()(
    {
        1: [
            function (require, module, exports) {
                // shim for using process in browser
                var process = (module.exports = {});

                // cached from whatever global is present so that test runners that stub it
                // don't break things.  But we need to wrap it in a try catch in case it is
                // wrapped in strict mode code which doesn't define any globals.  It's inside a
                // function because try/catches deoptimize in certain engines.

                var cachedSetTimeout;
                var cachedClearTimeout;

                function defaultSetTimout() {
                    throw new Error('setTimeout has not been defined');
                }
                function defaultClearTimeout() {
                    throw new Error('clearTimeout has not been defined');
                }
                (function () {
                    try {
                        if (typeof setTimeout === 'function') {
                            cachedSetTimeout = setTimeout;
                        } else {
                            cachedSetTimeout = defaultSetTimout;
                        }
                    } catch (e) {
                        cachedSetTimeout = defaultSetTimout;
                    }
                    try {
                        if (typeof clearTimeout === 'function') {
                            cachedClearTimeout = clearTimeout;
                        } else {
                            cachedClearTimeout = defaultClearTimeout;
                        }
                    } catch (e) {
                        cachedClearTimeout = defaultClearTimeout;
                    }
                })();
                function runTimeout(fun) {
                    if (cachedSetTimeout === setTimeout) {
                        //normal enviroments in sane situations
                        return setTimeout(fun, 0);
                    }
                    // if setTimeout wasn't available but was latter defined
                    if (
                        (cachedSetTimeout === defaultSetTimout ||
                            !cachedSetTimeout) &&
                        setTimeout
                    ) {
                        cachedSetTimeout = setTimeout;
                        return setTimeout(fun, 0);
                    }
                    try {
                        // when when somebody has screwed with setTimeout but no I.E. maddness
                        return cachedSetTimeout(fun, 0);
                    } catch (e) {
                        try {
                            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                            return cachedSetTimeout.call(null, fun, 0);
                        } catch (e) {
                            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                            return cachedSetTimeout.call(this, fun, 0);
                        }
                    }
                }
                function runClearTimeout(marker) {
                    if (cachedClearTimeout === clearTimeout) {
                        //normal enviroments in sane situations
                        return clearTimeout(marker);
                    }
                    // if clearTimeout wasn't available but was latter defined
                    if (
                        (cachedClearTimeout === defaultClearTimeout ||
                            !cachedClearTimeout) &&
                        clearTimeout
                    ) {
                        cachedClearTimeout = clearTimeout;
                        return clearTimeout(marker);
                    }
                    try {
                        // when when somebody has screwed with setTimeout but no I.E. maddness
                        return cachedClearTimeout(marker);
                    } catch (e) {
                        try {
                            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                            return cachedClearTimeout.call(null, marker);
                        } catch (e) {
                            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                            return cachedClearTimeout.call(this, marker);
                        }
                    }
                }
                var queue = [];
                var draining = false;
                var currentQueue;
                var queueIndex = -1;

                function cleanUpNextTick() {
                    if (!draining || !currentQueue) {
                        return;
                    }
                    draining = false;
                    if (currentQueue.length) {
                        queue = currentQueue.concat(queue);
                    } else {
                        queueIndex = -1;
                    }
                    if (queue.length) {
                        drainQueue();
                    }
                }

                function drainQueue() {
                    if (draining) {
                        return;
                    }
                    var timeout = runTimeout(cleanUpNextTick);
                    draining = true;

                    var len = queue.length;
                    while (len) {
                        currentQueue = queue;
                        queue = [];
                        while (++queueIndex < len) {
                            if (currentQueue) {
                                currentQueue[queueIndex].run();
                            }
                        }
                        queueIndex = -1;
                        len = queue.length;
                    }
                    currentQueue = null;
                    draining = false;
                    runClearTimeout(timeout);
                }

                process.nextTick = function (fun) {
                    var args = new Array(arguments.length - 1);
                    if (arguments.length > 1) {
                        for (var i = 1; i < arguments.length; i++) {
                            args[i - 1] = arguments[i];
                        }
                    }
                    queue.push(new Item(fun, args));
                    if (queue.length === 1 && !draining) {
                        runTimeout(drainQueue);
                    }
                };

                // v8 likes predictible objects
                function Item(fun, array) {
                    this.fun = fun;
                    this.array = array;
                }
                Item.prototype.run = function () {
                    this.fun.apply(null, this.array);
                };
                process.title = 'browser';
                process.browser = true;
                process.env = {};
                process.argv = [];
                process.version = ''; // empty string to avoid regexp issues
                process.versions = {};

                function noop() {}

                process.on = noop;
                process.addListener = noop;
                process.once = noop;
                process.off = noop;
                process.removeListener = noop;
                process.removeAllListeners = noop;
                process.emit = noop;
                process.prependListener = noop;
                process.prependOnceListener = noop;

                process.listeners = function (name) {
                    return [];
                };

                process.binding = function (name) {
                    throw new Error('process.binding is not supported');
                };

                process.cwd = function () {
                    return '/';
                };
                process.chdir = function (dir) {
                    throw new Error('process.chdir is not supported');
                };
                process.umask = function () {
                    return 0;
                };
            },
            {}
        ],
        2: [
            function (require, module, exports) {
                window.translate = require('google-translate-open-api').default;
            },
            { 'google-translate-open-api': 28 }
        ],
        3: [
            function (require, module, exports) {
                module.exports = require('./lib/axios');
            },
            { './lib/axios': 5 }
        ],
        4: [
            function (require, module, exports) {
                (function (process) {
                    'use strict';

                    var utils = require('./../utils');
                    var settle = require('./../core/settle');
                    var buildURL = require('./../helpers/buildURL');
                    var parseHeaders = require('./../helpers/parseHeaders');
                    var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
                    var createError = require('../core/createError');
                    var btoa =
                        (typeof window !== 'undefined' &&
                            window.btoa &&
                            window.btoa.bind(window)) ||
                        require('./../helpers/btoa');

                    module.exports = function xhrAdapter(config) {
                        return new Promise(function dispatchXhrRequest(
                            resolve,
                            reject
                        ) {
                            var requestData = config.data;
                            var requestHeaders = config.headers;

                            if (utils.isFormData(requestData)) {
                                delete requestHeaders['Content-Type']; // Let the browser set it
                            }

                            var request = new XMLHttpRequest();
                            var loadEvent = 'onreadystatechange';
                            var xDomain = false;

                            // For IE 8/9 CORS support
                            // Only supports POST and GET calls and doesn't returns the response headers.
                            // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
                            if (
                                process.env.NODE_ENV !== 'test' &&
                                typeof window !== 'undefined' &&
                                window.XDomainRequest &&
                                !('withCredentials' in request) &&
                                !isURLSameOrigin(config.url)
                            ) {
                                request = new window.XDomainRequest();
                                loadEvent = 'onload';
                                xDomain = true;
                                request.onprogress = function handleProgress() {};
                                request.ontimeout = function handleTimeout() {};
                            }

                            // HTTP basic authentication
                            if (config.auth) {
                                var username = config.auth.username || '';
                                var password = config.auth.password || '';
                                requestHeaders.Authorization =
                                    'Basic ' + btoa(username + ':' + password);
                            }

                            request.open(
                                config.method.toUpperCase(),
                                buildURL(
                                    config.url,
                                    config.params,
                                    config.paramsSerializer
                                ),
                                true
                            );

                            // Set the request timeout in MS
                            request.timeout = config.timeout;

                            // Listen for ready state
                            request[loadEvent] = function handleLoad() {
                                if (
                                    !request ||
                                    (request.readyState !== 4 && !xDomain)
                                ) {
                                    return;
                                }

                                // The request errored out and we didn't get a response, this will be
                                // handled by onerror instead
                                // With one exception: request that using file: protocol, most browsers
                                // will return status as 0 even though it's a successful request
                                if (
                                    request.status === 0 &&
                                    !(
                                        request.responseURL &&
                                        request.responseURL.indexOf('file:') ===
                                            0
                                    )
                                ) {
                                    return;
                                }

                                // Prepare the response
                                var responseHeaders =
                                    'getAllResponseHeaders' in request
                                        ? parseHeaders(
                                              request.getAllResponseHeaders()
                                          )
                                        : null;
                                var responseData =
                                    !config.responseType ||
                                    config.responseType === 'text'
                                        ? request.responseText
                                        : request.response;
                                var response = {
                                    data: responseData,
                                    // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
                                    status:
                                        request.status === 1223
                                            ? 204
                                            : request.status,
                                    statusText:
                                        request.status === 1223
                                            ? 'No Content'
                                            : request.statusText,
                                    headers: responseHeaders,
                                    config: config,
                                    request: request
                                };

                                settle(resolve, reject, response);

                                // Clean up request
                                request = null;
                            };

                            // Handle low level network errors
                            request.onerror = function handleError() {
                                // Real errors are hidden from us by the browser
                                // onerror should only fire if it's a network error
                                reject(
                                    createError(
                                        'Network Error',
                                        config,
                                        null,
                                        request
                                    )
                                );

                                // Clean up request
                                request = null;
                            };

                            // Handle timeout
                            request.ontimeout = function handleTimeout() {
                                reject(
                                    createError(
                                        'timeout of ' +
                                            config.timeout +
                                            'ms exceeded',
                                        config,
                                        'ECONNABORTED',
                                        request
                                    )
                                );

                                // Clean up request
                                request = null;
                            };

                            // Add xsrf header
                            // This is only done if running in a standard browser environment.
                            // Specifically not if we're in a web worker, or react-native.
                            if (utils.isStandardBrowserEnv()) {
                                var cookies = require('./../helpers/cookies');

                                // Add xsrf header
                                var xsrfValue =
                                    (config.withCredentials ||
                                        isURLSameOrigin(config.url)) &&
                                    config.xsrfCookieName
                                        ? cookies.read(config.xsrfCookieName)
                                        : undefined;

                                if (xsrfValue) {
                                    requestHeaders[
                                        config.xsrfHeaderName
                                    ] = xsrfValue;
                                }
                            }

                            // Add headers to the request
                            if ('setRequestHeader' in request) {
                                utils.forEach(
                                    requestHeaders,
                                    function setRequestHeader(val, key) {
                                        if (
                                            typeof requestData ===
                                                'undefined' &&
                                            key.toLowerCase() === 'content-type'
                                        ) {
                                            // Remove Content-Type if data is undefined
                                            delete requestHeaders[key];
                                        } else {
                                            // Otherwise add header to the request
                                            request.setRequestHeader(key, val);
                                        }
                                    }
                                );
                            }

                            // Add withCredentials to request if needed
                            if (config.withCredentials) {
                                request.withCredentials = true;
                            }

                            // Add responseType to request if needed
                            if (config.responseType) {
                                try {
                                    request.responseType = config.responseType;
                                } catch (e) {
                                    // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
                                    // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
                                    if (config.responseType !== 'json') {
                                        throw e;
                                    }
                                }
                            }

                            // Handle progress if needed
                            if (
                                typeof config.onDownloadProgress === 'function'
                            ) {
                                request.addEventListener(
                                    'progress',
                                    config.onDownloadProgress
                                );
                            }

                            // Not all browsers support upload events
                            if (
                                typeof config.onUploadProgress === 'function' &&
                                request.upload
                            ) {
                                request.upload.addEventListener(
                                    'progress',
                                    config.onUploadProgress
                                );
                            }

                            if (config.cancelToken) {
                                // Handle cancellation
                                config.cancelToken.promise.then(
                                    function onCanceled(cancel) {
                                        if (!request) {
                                            return;
                                        }

                                        request.abort();
                                        reject(cancel);
                                        // Clean up request
                                        request = null;
                                    }
                                );
                            }

                            if (requestData === undefined) {
                                requestData = null;
                            }

                            // Send the request
                            request.send(requestData);
                        });
                    };
                }.call(this, require('_process')));
            },
            {
                '../core/createError': 11,
                './../core/settle': 14,
                './../helpers/btoa': 18,
                './../helpers/buildURL': 19,
                './../helpers/cookies': 21,
                './../helpers/isURLSameOrigin': 23,
                './../helpers/parseHeaders': 25,
                './../utils': 27,
                _process: 1
            }
        ],
        5: [
            function (require, module, exports) {
                'use strict';

                var utils = require('./utils');
                var bind = require('./helpers/bind');
                var Axios = require('./core/Axios');
                var defaults = require('./defaults');

                /**
                 * Create an instance of Axios
                 *
                 * @param {Object} defaultConfig The default config for the instance
                 * @return {Axios} A new instance of Axios
                 */
                function createInstance(defaultConfig) {
                    var context = new Axios(defaultConfig);
                    var instance = bind(Axios.prototype.request, context);

                    // Copy axios.prototype to instance
                    utils.extend(instance, Axios.prototype, context);

                    // Copy context to instance
                    utils.extend(instance, context);

                    return instance;
                }

                // Create the default instance to be exported
                var axios = createInstance(defaults);

                // Expose Axios class to allow class inheritance
                axios.Axios = Axios;

                // Factory for creating new instances
                axios.create = function create(instanceConfig) {
                    return createInstance(
                        utils.merge(defaults, instanceConfig)
                    );
                };

                // Expose Cancel & CancelToken
                axios.Cancel = require('./cancel/Cancel');
                axios.CancelToken = require('./cancel/CancelToken');
                axios.isCancel = require('./cancel/isCancel');

                // Expose all/spread
                axios.all = function all(promises) {
                    return Promise.all(promises);
                };
                axios.spread = require('./helpers/spread');

                module.exports = axios;

                // Allow use of default import syntax in TypeScript
                module.exports.default = axios;
            },
            {
                './cancel/Cancel': 6,
                './cancel/CancelToken': 7,
                './cancel/isCancel': 8,
                './core/Axios': 9,
                './defaults': 16,
                './helpers/bind': 17,
                './helpers/spread': 26,
                './utils': 27
            }
        ],
        6: [
            function (require, module, exports) {
                'use strict';

                /**
                 * A `Cancel` is an object that is thrown when an operation is canceled.
                 *
                 * @class
                 * @param {string=} message The message.
                 */
                function Cancel(message) {
                    this.message = message;
                }

                Cancel.prototype.toString = function toString() {
                    return 'Cancel' + (this.message ? ': ' + this.message : '');
                };

                Cancel.prototype.__CANCEL__ = true;

                module.exports = Cancel;
            },
            {}
        ],
        7: [
            function (require, module, exports) {
                'use strict';

                var Cancel = require('./Cancel');

                /**
                 * A `CancelToken` is an object that can be used to request cancellation of an operation.
                 *
                 * @class
                 * @param {Function} executor The executor function.
                 */
                function CancelToken(executor) {
                    if (typeof executor !== 'function') {
                        throw new TypeError('executor must be a function.');
                    }

                    var resolvePromise;
                    this.promise = new Promise(function promiseExecutor(
                        resolve
                    ) {
                        resolvePromise = resolve;
                    });

                    var token = this;
                    executor(function cancel(message) {
                        if (token.reason) {
                            // Cancellation has already been requested
                            return;
                        }

                        token.reason = new Cancel(message);
                        resolvePromise(token.reason);
                    });
                }

                /**
                 * Throws a `Cancel` if cancellation has been requested.
                 */
                CancelToken.prototype.throwIfRequested = function throwIfRequested() {
                    if (this.reason) {
                        throw this.reason;
                    }
                };

                /**
                 * Returns an object that contains a new `CancelToken` and a function that, when called,
                 * cancels the `CancelToken`.
                 */
                CancelToken.source = function source() {
                    var cancel;
                    var token = new CancelToken(function executor(c) {
                        cancel = c;
                    });
                    return {
                        token: token,
                        cancel: cancel
                    };
                };

                module.exports = CancelToken;
            },
            { './Cancel': 6 }
        ],
        8: [
            function (require, module, exports) {
                'use strict';

                module.exports = function isCancel(value) {
                    return !!(value && value.__CANCEL__);
                };
            },
            {}
        ],
        9: [
            function (require, module, exports) {
                'use strict';

                var defaults = require('./../defaults');
                var utils = require('./../utils');
                var InterceptorManager = require('./InterceptorManager');
                var dispatchRequest = require('./dispatchRequest');

                /**
                 * Create a new instance of Axios
                 *
                 * @param {Object} instanceConfig The default config for the instance
                 */
                function Axios(instanceConfig) {
                    this.defaults = instanceConfig;
                    this.interceptors = {
                        request: new InterceptorManager(),
                        response: new InterceptorManager()
                    };
                }

                /**
                 * Dispatch a request
                 *
                 * @param {Object} config The config specific for this request (merged with this.defaults)
                 */
                Axios.prototype.request = function request(config) {
                    /*eslint no-param-reassign:0*/
                    // Allow for axios('example/url'[, config]) a la fetch API
                    if (typeof config === 'string') {
                        config = utils.merge(
                            {
                                url: arguments[0]
                            },
                            arguments[1]
                        );
                    }

                    config = utils.merge(
                        defaults,
                        this.defaults,
                        { method: 'get' },
                        config
                    );
                    config.method = config.method.toLowerCase();

                    // Hook up interceptors middleware
                    var chain = [dispatchRequest, undefined];
                    var promise = Promise.resolve(config);

                    this.interceptors.request.forEach(
                        function unshiftRequestInterceptors(interceptor) {
                            chain.unshift(
                                interceptor.fulfilled,
                                interceptor.rejected
                            );
                        }
                    );

                    this.interceptors.response.forEach(
                        function pushResponseInterceptors(interceptor) {
                            chain.push(
                                interceptor.fulfilled,
                                interceptor.rejected
                            );
                        }
                    );

                    while (chain.length) {
                        promise = promise.then(chain.shift(), chain.shift());
                    }

                    return promise;
                };

                // Provide aliases for supported request methods
                utils.forEach(
                    ['delete', 'get', 'head', 'options'],
                    function forEachMethodNoData(method) {
                        /*eslint func-names:0*/
                        Axios.prototype[method] = function (url, config) {
                            return this.request(
                                utils.merge(config || {}, {
                                    method: method,
                                    url: url
                                })
                            );
                        };
                    }
                );

                utils.forEach(
                    ['post', 'put', 'patch'],
                    function forEachMethodWithData(method) {
                        /*eslint func-names:0*/
                        Axios.prototype[method] = function (url, data, config) {
                            return this.request(
                                utils.merge(config || {}, {
                                    method: method,
                                    url: url,
                                    data: data
                                })
                            );
                        };
                    }
                );

                module.exports = Axios;
            },
            {
                './../defaults': 16,
                './../utils': 27,
                './InterceptorManager': 10,
                './dispatchRequest': 12
            }
        ],
        10: [
            function (require, module, exports) {
                'use strict';

                var utils = require('./../utils');

                function InterceptorManager() {
                    this.handlers = [];
                }

                /**
                 * Add a new interceptor to the stack
                 *
                 * @param {Function} fulfilled The function to handle `then` for a `Promise`
                 * @param {Function} rejected The function to handle `reject` for a `Promise`
                 *
                 * @return {Number} An ID used to remove interceptor later
                 */
                InterceptorManager.prototype.use = function use(
                    fulfilled,
                    rejected
                ) {
                    this.handlers.push({
                        fulfilled: fulfilled,
                        rejected: rejected
                    });
                    return this.handlers.length - 1;
                };

                /**
                 * Remove an interceptor from the stack
                 *
                 * @param {Number} id The ID that was returned by `use`
                 */
                InterceptorManager.prototype.eject = function eject(id) {
                    if (this.handlers[id]) {
                        this.handlers[id] = null;
                    }
                };

                /**
                 * Iterate over all the registered interceptors
                 *
                 * This method is particularly useful for skipping over any
                 * interceptors that may have become `null` calling `eject`.
                 *
                 * @param {Function} fn The function to call for each interceptor
                 */
                InterceptorManager.prototype.forEach = function forEach(fn) {
                    utils.forEach(this.handlers, function forEachHandler(h) {
                        if (h !== null) {
                            fn(h);
                        }
                    });
                };

                module.exports = InterceptorManager;
            },
            { './../utils': 27 }
        ],
        11: [
            function (require, module, exports) {
                'use strict';

                var enhanceError = require('./enhanceError');

                /**
                 * Create an Error with the specified message, config, error code, request and response.
                 *
                 * @param {string} message The error message.
                 * @param {Object} config The config.
                 * @param {string} [code] The error code (for example, 'ECONNABORTED').
                 * @param {Object} [request] The request.
                 * @param {Object} [response] The response.
                 * @returns {Error} The created error.
                 */
                module.exports = function createError(
                    message,
                    config,
                    code,
                    request,
                    response
                ) {
                    var error = new Error(message);
                    return enhanceError(error, config, code, request, response);
                };
            },
            { './enhanceError': 13 }
        ],
        12: [
            function (require, module, exports) {
                'use strict';

                var utils = require('./../utils');
                var transformData = require('./transformData');
                var isCancel = require('../cancel/isCancel');
                var defaults = require('../defaults');
                var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
                var combineURLs = require('./../helpers/combineURLs');

                /**
                 * Throws a `Cancel` if cancellation has been requested.
                 */
                function throwIfCancellationRequested(config) {
                    if (config.cancelToken) {
                        config.cancelToken.throwIfRequested();
                    }
                }

                /**
                 * Dispatch a request to the server using the configured adapter.
                 *
                 * @param {object} config The config that is to be used for the request
                 * @returns {Promise} The Promise to be fulfilled
                 */
                module.exports = function dispatchRequest(config) {
                    throwIfCancellationRequested(config);

                    // Support baseURL config
                    if (config.baseURL && !isAbsoluteURL(config.url)) {
                        config.url = combineURLs(config.baseURL, config.url);
                    }

                    // Ensure headers exist
                    config.headers = config.headers || {};

                    // Transform request data
                    config.data = transformData(
                        config.data,
                        config.headers,
                        config.transformRequest
                    );

                    // Flatten headers
                    config.headers = utils.merge(
                        config.headers.common || {},
                        config.headers[config.method] || {},
                        config.headers || {}
                    );

                    utils.forEach(
                        [
                            'delete',
                            'get',
                            'head',
                            'post',
                            'put',
                            'patch',
                            'common'
                        ],
                        function cleanHeaderConfig(method) {
                            delete config.headers[method];
                        }
                    );

                    var adapter = config.adapter || defaults.adapter;

                    return adapter(config).then(
                        function onAdapterResolution(response) {
                            throwIfCancellationRequested(config);

                            // Transform response data
                            response.data = transformData(
                                response.data,
                                response.headers,
                                config.transformResponse
                            );

                            return response;
                        },
                        function onAdapterRejection(reason) {
                            if (!isCancel(reason)) {
                                throwIfCancellationRequested(config);

                                // Transform response data
                                if (reason && reason.response) {
                                    reason.response.data = transformData(
                                        reason.response.data,
                                        reason.response.headers,
                                        config.transformResponse
                                    );
                                }
                            }

                            return Promise.reject(reason);
                        }
                    );
                };
            },
            {
                '../cancel/isCancel': 8,
                '../defaults': 16,
                './../helpers/combineURLs': 20,
                './../helpers/isAbsoluteURL': 22,
                './../utils': 27,
                './transformData': 15
            }
        ],
        13: [
            function (require, module, exports) {
                'use strict';

                /**
                 * Update an Error with the specified config, error code, and response.
                 *
                 * @param {Error} error The error to update.
                 * @param {Object} config The config.
                 * @param {string} [code] The error code (for example, 'ECONNABORTED').
                 * @param {Object} [request] The request.
                 * @param {Object} [response] The response.
                 * @returns {Error} The error.
                 */
                module.exports = function enhanceError(
                    error,
                    config,
                    code,
                    request,
                    response
                ) {
                    error.config = config;
                    if (code) {
                        error.code = code;
                    }
                    error.request = request;
                    error.response = response;
                    return error;
                };
            },
            {}
        ],
        14: [
            function (require, module, exports) {
                'use strict';

                var createError = require('./createError');

                /**
                 * Resolve or reject a Promise based on response status.
                 *
                 * @param {Function} resolve A function that resolves the promise.
                 * @param {Function} reject A function that rejects the promise.
                 * @param {object} response The response.
                 */
                module.exports = function settle(resolve, reject, response) {
                    var validateStatus = response.config.validateStatus;
                    // Note: status is not exposed by XDomainRequest
                    if (
                        !response.status ||
                        !validateStatus ||
                        validateStatus(response.status)
                    ) {
                        resolve(response);
                    } else {
                        reject(
                            createError(
                                'Request failed with status code ' +
                                    response.status,
                                response.config,
                                null,
                                response.request,
                                response
                            )
                        );
                    }
                };
            },
            { './createError': 11 }
        ],
        15: [
            function (require, module, exports) {
                'use strict';

                var utils = require('./../utils');

                /**
                 * Transform the data for a request or a response
                 *
                 * @param {Object|String} data The data to be transformed
                 * @param {Array} headers The headers for the request or response
                 * @param {Array|Function} fns A single function or Array of functions
                 * @returns {*} The resulting transformed data
                 */
                module.exports = function transformData(data, headers, fns) {
                    /*eslint no-param-reassign:0*/
                    utils.forEach(fns, function transform(fn) {
                        data = fn(data, headers);
                    });

                    return data;
                };
            },
            { './../utils': 27 }
        ],
        16: [
            function (require, module, exports) {
                (function (process) {
                    'use strict';

                    var utils = require('./utils');
                    var normalizeHeaderName = require('./helpers/normalizeHeaderName');

                    var DEFAULT_CONTENT_TYPE = {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };

                    function setContentTypeIfUnset(headers, value) {
                        if (
                            !utils.isUndefined(headers) &&
                            utils.isUndefined(headers['Content-Type'])
                        ) {
                            headers['Content-Type'] = value;
                        }
                    }

                    function getDefaultAdapter() {
                        var adapter;
                        if (typeof XMLHttpRequest !== 'undefined') {
                            // For browsers use XHR adapter
                            adapter = require('./adapters/xhr');
                        } else if (typeof process !== 'undefined') {
                            // For node use HTTP adapter
                            adapter = require('./adapters/http');
                        }
                        return adapter;
                    }

                    var defaults = {
                        adapter: getDefaultAdapter(),

                        transformRequest: [
                            function transformRequest(data, headers) {
                                normalizeHeaderName(headers, 'Content-Type');
                                if (
                                    utils.isFormData(data) ||
                                    utils.isArrayBuffer(data) ||
                                    utils.isBuffer(data) ||
                                    utils.isStream(data) ||
                                    utils.isFile(data) ||
                                    utils.isBlob(data)
                                ) {
                                    return data;
                                }
                                if (utils.isArrayBufferView(data)) {
                                    return data.buffer;
                                }
                                if (utils.isURLSearchParams(data)) {
                                    setContentTypeIfUnset(
                                        headers,
                                        'application/x-www-form-urlencoded;charset=utf-8'
                                    );
                                    return data.toString();
                                }
                                if (utils.isObject(data)) {
                                    setContentTypeIfUnset(
                                        headers,
                                        'application/json;charset=utf-8'
                                    );
                                    return JSON.stringify(data);
                                }
                                return data;
                            }
                        ],

                        transformResponse: [
                            function transformResponse(data) {
                                /*eslint no-param-reassign:0*/
                                if (typeof data === 'string') {
                                    try {
                                        data = JSON.parse(data);
                                    } catch (e) {
                                        /* Ignore */
                                    }
                                }
                                return data;
                            }
                        ],

                        timeout: 0,

                        xsrfCookieName: 'XSRF-TOKEN',
                        xsrfHeaderName: 'X-XSRF-TOKEN',

                        maxContentLength: -1,

                        validateStatus: function validateStatus(status) {
                            return status >= 200 && status < 300;
                        }
                    };

                    defaults.headers = {
                        common: {
                            Accept: 'application/json, text/plain, */*'
                        }
                    };

                    utils.forEach(
                        ['delete', 'get', 'head'],
                        function forEachMethodNoData(method) {
                            defaults.headers[method] = {};
                        }
                    );

                    utils.forEach(
                        ['post', 'put', 'patch'],
                        function forEachMethodWithData(method) {
                            defaults.headers[method] = utils.merge(
                                DEFAULT_CONTENT_TYPE
                            );
                        }
                    );

                    module.exports = defaults;
                }.call(this, require('_process')));
            },
            {
                './adapters/http': 4,
                './adapters/xhr': 4,
                './helpers/normalizeHeaderName': 24,
                './utils': 27,
                _process: 1
            }
        ],
        17: [
            function (require, module, exports) {
                'use strict';

                module.exports = function bind(fn, thisArg) {
                    return function wrap() {
                        var args = new Array(arguments.length);
                        for (var i = 0; i < args.length; i++) {
                            args[i] = arguments[i];
                        }
                        return fn.apply(thisArg, args);
                    };
                };
            },
            {}
        ],
        18: [
            function (require, module, exports) {
                'use strict';

                // btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

                var chars =
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

                function E() {
                    this.message = 'String contains an invalid character';
                }
                E.prototype = new Error();
                E.prototype.code = 5;
                E.prototype.name = 'InvalidCharacterError';

                function btoa(input) {
                    var str = String(input);
                    var output = '';
                    for (
                        // initialize result and counter
                        var block, charCode, idx = 0, map = chars;
                        // if the next str index does not exist:
                        //   change the mapping table to "="
                        //   check if d has no fractional digits
                        str.charAt(idx | 0) || ((map = '='), idx % 1);
                        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
                        output += map.charAt(
                            63 & (block >> (8 - (idx % 1) * 8))
                        )
                    ) {
                        charCode = str.charCodeAt((idx += 3 / 4));
                        if (charCode > 0xff) {
                            throw new E();
                        }
                        block = (block << 8) | charCode;
                    }
                    return output;
                }

                module.exports = btoa;
            },
            {}
        ],
        19: [
            function (require, module, exports) {
                'use strict';

                var utils = require('./../utils');

                function encode(val) {
                    return encodeURIComponent(val)
                        .replace(/%40/gi, '@')
                        .replace(/%3A/gi, ':')
                        .replace(/%24/g, '$')
                        .replace(/%2C/gi, ',')
                        .replace(/%20/g, '+')
                        .replace(/%5B/gi, '[')
                        .replace(/%5D/gi, ']');
                }

                /**
                 * Build a URL by appending params to the end
                 *
                 * @param {string} url The base of the url (e.g., http://www.google.com)
                 * @param {object} [params] The params to be appended
                 * @returns {string} The formatted url
                 */
                module.exports = function buildURL(
                    url,
                    params,
                    paramsSerializer
                ) {
                    /*eslint no-param-reassign:0*/
                    if (!params) {
                        return url;
                    }

                    var serializedParams;
                    if (paramsSerializer) {
                        serializedParams = paramsSerializer(params);
                    } else if (utils.isURLSearchParams(params)) {
                        serializedParams = params.toString();
                    } else {
                        var parts = [];

                        utils.forEach(params, function serialize(val, key) {
                            if (val === null || typeof val === 'undefined') {
                                return;
                            }

                            if (utils.isArray(val)) {
                                key = key + '[]';
                            }

                            if (!utils.isArray(val)) {
                                val = [val];
                            }

                            utils.forEach(val, function parseValue(v) {
                                if (utils.isDate(v)) {
                                    v = v.toISOString();
                                } else if (utils.isObject(v)) {
                                    v = JSON.stringify(v);
                                }
                                parts.push(encode(key) + '=' + encode(v));
                            });
                        });

                        serializedParams = parts.join('&');
                    }

                    if (serializedParams) {
                        url +=
                            (url.indexOf('?') === -1 ? '?' : '&') +
                            serializedParams;
                    }

                    return url;
                };
            },
            { './../utils': 27 }
        ],
        20: [
            function (require, module, exports) {
                'use strict';

                /**
                 * Creates a new URL by combining the specified URLs
                 *
                 * @param {string} baseURL The base URL
                 * @param {string} relativeURL The relative URL
                 * @returns {string} The combined URL
                 */
                module.exports = function combineURLs(baseURL, relativeURL) {
                    return relativeURL
                        ? baseURL.replace(/\/+$/, '') +
                              '/' +
                              relativeURL.replace(/^\/+/, '')
                        : baseURL;
                };
            },
            {}
        ],
        21: [
            function (require, module, exports) {
                'use strict';

                var utils = require('./../utils');

                module.exports = utils.isStandardBrowserEnv()
                    ? // Standard browser envs support document.cookie
                      (function standardBrowserEnv() {
                          return {
                              write: function write(
                                  name,
                                  value,
                                  expires,
                                  path,
                                  domain,
                                  secure
                              ) {
                                  var cookie = [];
                                  cookie.push(
                                      name + '=' + encodeURIComponent(value)
                                  );

                                  if (utils.isNumber(expires)) {
                                      cookie.push(
                                          'expires=' +
                                              new Date(expires).toGMTString()
                                      );
                                  }

                                  if (utils.isString(path)) {
                                      cookie.push('path=' + path);
                                  }

                                  if (utils.isString(domain)) {
                                      cookie.push('domain=' + domain);
                                  }

                                  if (secure === true) {
                                      cookie.push('secure');
                                  }

                                  document.cookie = cookie.join('; ');
                              },

                              read: function read(name) {
                                  var match = document.cookie.match(
                                      new RegExp(
                                          '(^|;\\s*)(' + name + ')=([^;]*)'
                                      )
                                  );
                                  return match
                                      ? decodeURIComponent(match[3])
                                      : null;
                              },

                              remove: function remove(name) {
                                  this.write(name, '', Date.now() - 86400000);
                              }
                          };
                      })()
                    : // Non standard browser env (web workers, react-native) lack needed support.
                      (function nonStandardBrowserEnv() {
                          return {
                              write: function write() {},
                              read: function read() {
                                  return null;
                              },
                              remove: function remove() {}
                          };
                      })();
            },
            { './../utils': 27 }
        ],
        22: [
            function (require, module, exports) {
                'use strict';

                /**
                 * Determines whether the specified URL is absolute
                 *
                 * @param {string} url The URL to test
                 * @returns {boolean} True if the specified URL is absolute, otherwise false
                 */
                module.exports = function isAbsoluteURL(url) {
                    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
                    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
                    // by any combination of letters, digits, plus, period, or hyphen.
                    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
                };
            },
            {}
        ],
        23: [
            function (require, module, exports) {
                'use strict';

                var utils = require('./../utils');

                module.exports = utils.isStandardBrowserEnv()
                    ? // Standard browser envs have full support of the APIs needed to test
                      // whether the request URL is of the same origin as current location.
                      (function standardBrowserEnv() {
                          var msie = /(msie|trident)/i.test(
                              navigator.userAgent
                          );
                          var urlParsingNode = document.createElement('a');
                          var originURL;

                          /**
                           * Parse a URL to discover it's components
                           *
                           * @param {String} url The URL to be parsed
                           * @returns {Object}
                           */
                          function resolveURL(url) {
                              var href = url;

                              if (msie) {
                                  // IE needs attribute set twice to normalize properties
                                  urlParsingNode.setAttribute('href', href);
                                  href = urlParsingNode.href;
                              }

                              urlParsingNode.setAttribute('href', href);

                              // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
                              return {
                                  href: urlParsingNode.href,
                                  protocol: urlParsingNode.protocol
                                      ? urlParsingNode.protocol.replace(
                                            /:$/,
                                            ''
                                        )
                                      : '',
                                  host: urlParsingNode.host,
                                  search: urlParsingNode.search
                                      ? urlParsingNode.search.replace(/^\?/, '')
                                      : '',
                                  hash: urlParsingNode.hash
                                      ? urlParsingNode.hash.replace(/^#/, '')
                                      : '',
                                  hostname: urlParsingNode.hostname,
                                  port: urlParsingNode.port,
                                  pathname:
                                      urlParsingNode.pathname.charAt(0) === '/'
                                          ? urlParsingNode.pathname
                                          : '/' + urlParsingNode.pathname
                              };
                          }

                          originURL = resolveURL(window.location.href);

                          /**
                           * Determine if a URL shares the same origin as the current location
                           *
                           * @param {String} requestURL The URL to test
                           * @returns {boolean} True if URL shares the same origin, otherwise false
                           */
                          return function isURLSameOrigin(requestURL) {
                              var parsed = utils.isString(requestURL)
                                  ? resolveURL(requestURL)
                                  : requestURL;
                              return (
                                  parsed.protocol === originURL.protocol &&
                                  parsed.host === originURL.host
                              );
                          };
                      })()
                    : // Non standard browser envs (web workers, react-native) lack needed support.
                      (function nonStandardBrowserEnv() {
                          return function isURLSameOrigin() {
                              return true;
                          };
                      })();
            },
            { './../utils': 27 }
        ],
        24: [
            function (require, module, exports) {
                'use strict';

                var utils = require('../utils');

                module.exports = function normalizeHeaderName(
                    headers,
                    normalizedName
                ) {
                    utils.forEach(headers, function processHeader(value, name) {
                        if (
                            name !== normalizedName &&
                            name.toUpperCase() === normalizedName.toUpperCase()
                        ) {
                            headers[normalizedName] = value;
                            delete headers[name];
                        }
                    });
                };
            },
            { '../utils': 27 }
        ],
        25: [
            function (require, module, exports) {
                'use strict';

                var utils = require('./../utils');

                // Headers whose duplicates are ignored by node
                // c.f. https://nodejs.org/api/http.html#http_message_headers
                var ignoreDuplicateOf = [
                    'age',
                    'authorization',
                    'content-length',
                    'content-type',
                    'etag',
                    'expires',
                    'from',
                    'host',
                    'if-modified-since',
                    'if-unmodified-since',
                    'last-modified',
                    'location',
                    'max-forwards',
                    'proxy-authorization',
                    'referer',
                    'retry-after',
                    'user-agent'
                ];

                /**
                 * Parse headers into an object
                 *
                 * ```
                 * Date: Wed, 27 Aug 2014 08:58:49 GMT
                 * Content-Type: application/json
                 * Connection: keep-alive
                 * Transfer-Encoding: chunked
                 * ```
                 *
                 * @param {String} headers Headers needing to be parsed
                 * @returns {Object} Headers parsed into an object
                 */
                module.exports = function parseHeaders(headers) {
                    var parsed = {};
                    var key;
                    var val;
                    var i;

                    if (!headers) {
                        return parsed;
                    }

                    utils.forEach(headers.split('\n'), function parser(line) {
                        i = line.indexOf(':');
                        key = utils.trim(line.substr(0, i)).toLowerCase();
                        val = utils.trim(line.substr(i + 1));

                        if (key) {
                            if (
                                parsed[key] &&
                                ignoreDuplicateOf.indexOf(key) >= 0
                            ) {
                                return;
                            }
                            if (key === 'set-cookie') {
                                parsed[key] = (parsed[key]
                                    ? parsed[key]
                                    : []
                                ).concat([val]);
                            } else {
                                parsed[key] = parsed[key]
                                    ? parsed[key] + ', ' + val
                                    : val;
                            }
                        }
                    });

                    return parsed;
                };
            },
            { './../utils': 27 }
        ],
        26: [
            function (require, module, exports) {
                'use strict';

                /**
                 * Syntactic sugar for invoking a function and expanding an array for arguments.
                 *
                 * Common use case would be to use `Function.prototype.apply`.
                 *
                 *  ```js
                 *  function f(x, y, z) {}
                 *  var args = [1, 2, 3];
                 *  f.apply(null, args);
                 *  ```
                 *
                 * With `spread` this example can be re-written.
                 *
                 *  ```js
                 *  spread(function(x, y, z) {})([1, 2, 3]);
                 *  ```
                 *
                 * @param {Function} callback
                 * @returns {Function}
                 */
                module.exports = function spread(callback) {
                    return function wrap(arr) {
                        return callback.apply(null, arr);
                    };
                };
            },
            {}
        ],
        27: [
            function (require, module, exports) {
                'use strict';

                var bind = require('./helpers/bind');
                var isBuffer = require('is-buffer');

                /*global toString:true*/

                // utils is a library of generic helper functions non-specific to axios

                var toString = Object.prototype.toString;

                /**
                 * Determine if a value is an Array
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is an Array, otherwise false
                 */
                function isArray(val) {
                    return toString.call(val) === '[object Array]';
                }

                /**
                 * Determine if a value is an ArrayBuffer
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
                 */
                function isArrayBuffer(val) {
                    return toString.call(val) === '[object ArrayBuffer]';
                }

                /**
                 * Determine if a value is a FormData
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is an FormData, otherwise false
                 */
                function isFormData(val) {
                    return (
                        typeof FormData !== 'undefined' &&
                        val instanceof FormData
                    );
                }

                /**
                 * Determine if a value is a view on an ArrayBuffer
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
                 */
                function isArrayBufferView(val) {
                    var result;
                    if (
                        typeof ArrayBuffer !== 'undefined' &&
                        ArrayBuffer.isView
                    ) {
                        result = ArrayBuffer.isView(val);
                    } else {
                        result =
                            val &&
                            val.buffer &&
                            val.buffer instanceof ArrayBuffer;
                    }
                    return result;
                }

                /**
                 * Determine if a value is a String
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is a String, otherwise false
                 */
                function isString(val) {
                    return typeof val === 'string';
                }

                /**
                 * Determine if a value is a Number
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is a Number, otherwise false
                 */
                function isNumber(val) {
                    return typeof val === 'number';
                }

                /**
                 * Determine if a value is undefined
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if the value is undefined, otherwise false
                 */
                function isUndefined(val) {
                    return typeof val === 'undefined';
                }

                /**
                 * Determine if a value is an Object
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is an Object, otherwise false
                 */
                function isObject(val) {
                    return val !== null && typeof val === 'object';
                }

                /**
                 * Determine if a value is a Date
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is a Date, otherwise false
                 */
                function isDate(val) {
                    return toString.call(val) === '[object Date]';
                }

                /**
                 * Determine if a value is a File
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is a File, otherwise false
                 */
                function isFile(val) {
                    return toString.call(val) === '[object File]';
                }

                /**
                 * Determine if a value is a Blob
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is a Blob, otherwise false
                 */
                function isBlob(val) {
                    return toString.call(val) === '[object Blob]';
                }

                /**
                 * Determine if a value is a Function
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is a Function, otherwise false
                 */
                function isFunction(val) {
                    return toString.call(val) === '[object Function]';
                }

                /**
                 * Determine if a value is a Stream
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is a Stream, otherwise false
                 */
                function isStream(val) {
                    return isObject(val) && isFunction(val.pipe);
                }

                /**
                 * Determine if a value is a URLSearchParams object
                 *
                 * @param {Object} val The value to test
                 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
                 */
                function isURLSearchParams(val) {
                    return (
                        typeof URLSearchParams !== 'undefined' &&
                        val instanceof URLSearchParams
                    );
                }

                /**
                 * Trim excess whitespace off the beginning and end of a string
                 *
                 * @param {String} str The String to trim
                 * @returns {String} The String freed of excess whitespace
                 */
                function trim(str) {
                    return str.replace(/^\s*/, '').replace(/\s*$/, '');
                }

                /**
                 * Determine if we're running in a standard browser environment
                 *
                 * This allows axios to run in a web worker, and react-native.
                 * Both environments support XMLHttpRequest, but not fully standard globals.
                 *
                 * web workers:
                 *  typeof window -> undefined
                 *  typeof document -> undefined
                 *
                 * react-native:
                 *  navigator.product -> 'ReactNative'
                 */
                function isStandardBrowserEnv() {
                    if (
                        typeof navigator !== 'undefined' &&
                        navigator.product === 'ReactNative'
                    ) {
                        return false;
                    }
                    return (
                        typeof window !== 'undefined' &&
                        typeof document !== 'undefined'
                    );
                }

                /**
                 * Iterate over an Array or an Object invoking a function for each item.
                 *
                 * If `obj` is an Array callback will be called passing
                 * the value, index, and complete array for each item.
                 *
                 * If 'obj' is an Object callback will be called passing
                 * the value, key, and complete object for each property.
                 *
                 * @param {Object|Array} obj The object to iterate
                 * @param {Function} fn The callback to invoke for each item
                 */
                function forEach(obj, fn) {
                    // Don't bother if no value provided
                    if (obj === null || typeof obj === 'undefined') {
                        return;
                    }

                    // Force an array if not already something iterable
                    if (typeof obj !== 'object') {
                        /*eslint no-param-reassign:0*/
                        obj = [obj];
                    }

                    if (isArray(obj)) {
                        // Iterate over array values
                        for (var i = 0, l = obj.length; i < l; i++) {
                            fn.call(null, obj[i], i, obj);
                        }
                    } else {
                        // Iterate over object keys
                        for (var key in obj) {
                            if (
                                Object.prototype.hasOwnProperty.call(obj, key)
                            ) {
                                fn.call(null, obj[key], key, obj);
                            }
                        }
                    }
                }

                /**
                 * Accepts varargs expecting each argument to be an object, then
                 * immutably merges the properties of each object and returns result.
                 *
                 * When multiple objects contain the same key the later object in
                 * the arguments list will take precedence.
                 *
                 * Example:
                 *
                 * ```js
                 * var result = merge({foo: 123}, {foo: 456});
                 * console.log(result.foo); // outputs 456
                 * ```
                 *
                 * @param {Object} obj1 Object to merge
                 * @returns {Object} Result of all merge properties
                 */
                function merge(/* obj1, obj2, obj3, ... */) {
                    var result = {};
                    function assignValue(val, key) {
                        if (
                            typeof result[key] === 'object' &&
                            typeof val === 'object'
                        ) {
                            result[key] = merge(result[key], val);
                        } else {
                            result[key] = val;
                        }
                    }

                    for (var i = 0, l = arguments.length; i < l; i++) {
                        forEach(arguments[i], assignValue);
                    }
                    return result;
                }

                /**
                 * Extends object a by mutably adding to it the properties of object b.
                 *
                 * @param {Object} a The object to be extended
                 * @param {Object} b The object to copy properties from
                 * @param {Object} thisArg The object to bind function to
                 * @return {Object} The resulting value of object a
                 */
                function extend(a, b, thisArg) {
                    forEach(b, function assignValue(val, key) {
                        if (thisArg && typeof val === 'function') {
                            a[key] = bind(val, thisArg);
                        } else {
                            a[key] = val;
                        }
                    });
                    return a;
                }

                module.exports = {
                    isArray: isArray,
                    isArrayBuffer: isArrayBuffer,
                    isBuffer: isBuffer,
                    isFormData: isFormData,
                    isArrayBufferView: isArrayBufferView,
                    isString: isString,
                    isNumber: isNumber,
                    isObject: isObject,
                    isUndefined: isUndefined,
                    isDate: isDate,
                    isFile: isFile,
                    isBlob: isBlob,
                    isFunction: isFunction,
                    isStream: isStream,
                    isURLSearchParams: isURLSearchParams,
                    isStandardBrowserEnv: isStandardBrowserEnv,
                    forEach: forEach,
                    merge: merge,
                    extend: extend,
                    trim: trim
                };
            },
            { './helpers/bind': 17, 'is-buffer': 33 }
        ],
        28: [
            function (require, module, exports) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                var translate_1 = require('./translate');
                var util_1 = require('./util');
                exports.parseMultiple = util_1.parseMultiple;
                var language_1 = require('./language');
                exports.isSupport = language_1.isSupport;
                exports.getAllLanguage = language_1.getAllLanguage;
                exports.getAllCode = language_1.getAllCode;
                function translate(value, options) {
                    // {tld: "cn"}
                    var text;
                    if (typeof value === 'string') {
                        text = [value];
                        !options.format && (options.format = 'text');
                    } else {
                        text = value;
                        !options.format && (options.format = 'html');
                    }
                    return translate_1.default(text, options);
                }
                exports.default = translate;
            },
            { './language': 29, './translate': 31, './util': 32 }
        ],
        29: [
            function (require, module, exports) {
                'use strict';
                /**
                 *
                 * Generated from https://translate.google.com
                 *
                 * The languages that Google Translate supports (as of 5/15/16) alongside with their ISO 639-1 codes
                 * See https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
                 */
                Object.defineProperty(exports, '__esModule', { value: true });
                var langs = {
                    Automatic: 'auto',
                    Afrikaans: 'af',
                    Albanian: 'sq',
                    Amharic: 'am',
                    Arabic: 'ar',
                    Armenian: 'hy',
                    Azerbaijani: 'az',
                    Basque: 'eu',
                    Belarusian: 'be',
                    Bengali: 'bn',
                    Bosnian: 'bs',
                    Bulgarian: 'bg',
                    Catalan: 'ca',
                    Cebuano: 'ceb',
                    Chichewa: 'ny',
                    'Chinese Simplified': 'zh-cn',
                    'Chinese Traditional': 'zh-tw',
                    Corsican: 'co',
                    Croatian: 'hr',
                    Czech: 'cs',
                    Danish: 'da',
                    Dutch: 'nl',
                    English: 'en',
                    Esperanto: 'eo',
                    Estonian: 'et',
                    Filipino: 'tl',
                    Finnish: 'fi',
                    French: 'fr',
                    Frisian: 'fy',
                    Galician: 'gl',
                    Georgian: 'ka',
                    German: 'de',
                    Greek: 'el',
                    Gujarati: 'gu',
                    'Haitian Creole': 'ht',
                    Hausa: 'ha',
                    Hawaiian: 'haw',
                    Hebrew: 'iw',
                    Hindi: 'hi',
                    Hmong: 'hmn',
                    Hungarian: 'hu',
                    Icelandic: 'is',
                    Igbo: 'ig',
                    Indonesian: 'id',
                    Irish: 'ga',
                    Italian: 'it',
                    Japanese: 'ja',
                    Javanese: 'jw',
                    Kannada: 'kn',
                    Kazakh: 'kk',
                    Khmer: 'km',
                    Korean: 'ko',
                    'Kurdish (Kurmanji)': 'ku',
                    Kyrgyz: 'ky',
                    Lao: 'lo',
                    Latin: 'la',
                    Latvian: 'lv',
                    Lithuanian: 'lt',
                    Luxembourgish: 'lb',
                    Macedonian: 'mk',
                    Malagasy: 'mg',
                    Malay: 'ms',
                    Malayalam: 'ml',
                    Maltese: 'mt',
                    Maori: 'mi',
                    Marathi: 'mr',
                    Mongolian: 'mn',
                    'Myanmar (Burmese)': 'my',
                    Nepali: 'ne',
                    Norwegian: 'no',
                    Pashto: 'ps',
                    Persian: 'fa',
                    Polish: 'pl',
                    Portuguese: 'pt',
                    Punjabi: 'ma',
                    Romanian: 'ro',
                    Russian: 'ru',
                    Samoan: 'sm',
                    'Scots Gaelic': 'gd',
                    Serbian: 'sr',
                    Sesotho: 'st',
                    Shona: 'sn',
                    Sindhi: 'sd',
                    Sinhala: 'si',
                    Slovak: 'sk',
                    Slovenian: 'sl',
                    Somali: 'so',
                    Spanish: 'es',
                    Sundanese: 'su',
                    Swahili: 'sw',
                    Swedish: 'sv',
                    Tajik: 'tg',
                    Tamil: 'ta',
                    Telugu: 'te',
                    Thai: 'th',
                    Turkish: 'tr',
                    Ukrainian: 'uk',
                    Urdu: 'ur',
                    Uyghur: 'ug',
                    Uzbek: 'uz',
                    Vietnamese: 'vi',
                    Welsh: 'cy',
                    Xhosa: 'xh',
                    Yiddish: 'yi',
                    Yoruba: 'yo',
                    Zulu: 'zu'
                };
                function isSupport(language) {
                    return Boolean(getCode(language));
                }
                exports.isSupport = isSupport;
                function getCode(language) {
                    if (!language) {
                        return false;
                    }
                    if (langs[language]) {
                        return langs[language];
                    }
                    var keys = Object.keys(langs).filter(function (item) {
                        var lowerLan = language.toLowerCase();
                        return langs[item] === lowerLan;
                    });
                    if (keys[0]) {
                        return langs[keys[0]];
                    }
                    return false;
                }
                exports.getCode = getCode;
                function getAllLanguage() {
                    return Object.keys(langs);
                }
                exports.getAllLanguage = getAllLanguage;
                function getAllCode() {
                    return Object.keys(langs).map(function (item) {
                        return langs[item];
                    });
                }
                exports.getAllCode = getAllCode;
                exports.default = langs;
            },
            {}
        ],
        30: [
            function (require, module, exports) {
                /**
                 * Last update: 2016/06/26
                 * https://translate.google.com/translate/releases/twsfe_w_20160620_RC00/r/js/desktop_module_main.js
                 *
                 * Everything between 'BEGIN' and 'END' was copied from the url above.
                 * fork from https://github.com/vitalets/google-translate-token
                 * for support brower
                 */

                var axios = require('axios-https-proxy-fix');

                /* eslint-disable */
                // BEGIN

                function sM(a) {
                    var b;
                    if (null !== yr) b = yr;
                    else {
                        b = wr(String.fromCharCode(84));
                        var c = wr(String.fromCharCode(75));
                        b = [b(), b()];
                        b[1] = c();
                        b = (yr = window[b.join(c())] || '') || '';
                    }
                    var d = wr(String.fromCharCode(116)),
                        c = wr(String.fromCharCode(107)),
                        d = [d(), d()];
                    d[1] = c();
                    c = '&' + d.join('') + '=';
                    d = b.split('.');
                    b = Number(d[0]) || 0;
                    for (var e = [], f = 0, g = 0; g < a.length; g++) {
                        var l = a.charCodeAt(g);
                        128 > l
                            ? (e[f++] = l)
                            : (2048 > l
                                  ? (e[f++] = (l >> 6) | 192)
                                  : (55296 == (l & 64512) &&
                                    g + 1 < a.length &&
                                    56320 == (a.charCodeAt(g + 1) & 64512)
                                        ? ((l =
                                              65536 +
                                              ((l & 1023) << 10) +
                                              (a.charCodeAt(++g) & 1023)),
                                          (e[f++] = (l >> 18) | 240),
                                          (e[f++] = ((l >> 12) & 63) | 128))
                                        : (e[f++] = (l >> 12) | 224),
                                    (e[f++] = ((l >> 6) & 63) | 128)),
                              (e[f++] = (l & 63) | 128));
                    }
                    a = b;
                    for (f = 0; f < e.length; f++)
                        (a += e[f]), (a = xr(a, '+-a^+6'));
                    a = xr(a, '+-3^+b+-f');
                    a ^= Number(d[1]) || 0;
                    0 > a && (a = (a & 2147483647) + 2147483648);
                    a %= 1e6;
                    return c + (a.toString() + '.' + (a ^ b));
                }

                var yr = null;
                var wr = function (a) {
                        return function () {
                            return a;
                        };
                    },
                    xr = function (a, b) {
                        for (var c = 0; c < b.length - 2; c += 3) {
                            var d = b.charAt(c + 2),
                                d = 'a' <= d ? d.charCodeAt(0) - 87 : Number(d),
                                d = '+' == b.charAt(c + 1) ? a >>> d : a << d;
                            a =
                                '+' == b.charAt(c)
                                    ? (a + d) & 4294967295
                                    : a ^ d;
                        }
                        return a;
                    };

                // END
                /* eslint-enable */

                window.TKK = '0';

                function updateTKK(opts) {
                    opts = opts || { tld: 'com' };
                    return new Promise(function (resolve, reject) {
                        var now = Math.floor(Date.now() / 3600000);

                        if (window.TKK == '0')
                            if (localStorage.getItem('TKK') != null)
                                window.TKK = localStorage.getItem('TKK');

                        if (Number(window.TKK.split('.')[0]) === now) {
                            resolve();
                        } else {
                            axios({
                                url:
                                    `${window.corsProxy}https://translate.google.` +
                                    opts.tld,
                                proxy: opts.proxy
                            })
                                .then(function (res) {
                                    var matches = res.data.match(
                                        /tkk:\s?'(.+?)'/i
                                    );

                                    if (matches) {
                                        window.TKK = matches[1];
                                        localStorage.setItem('TKK', matches[1]);
                                    }

                                    /**
                                     * Note: If the regex or the eval fail, there is no need to worry. The server will accept
                                     * relatively old seeds.
                                     */

                                    resolve();
                                })
                                .catch(function (err) {
                                    var e = new Error();
                                    e.code = 'BAD_NETWORK';
                                    e.message = err.message;
                                    reject(e);
                                });
                        }
                    });
                }

                function get(text, opts) {
                    return updateTKK(opts)
                        .then(function () {
                            var tk = sM(text);
                            tk = tk.replace('&tk=', '');
                            return { name: 'tk', value: tk };
                        })
                        .catch(function (err) {
                            throw err;
                        });
                }

                module.exports.get = get;
            },
            { 'axios-https-proxy-fix': 3 }
        ],
        31: [
            function (require, module, exports) {
                'use strict';
                var __assign =
                    (this && this.__assign) ||
                    function () {
                        __assign =
                            Object.assign ||
                            function (t) {
                                for (
                                    var s, i = 1, n = arguments.length;
                                    i < n;
                                    i++
                                ) {
                                    s = arguments[i];
                                    for (var p in s)
                                        if (
                                            Object.prototype.hasOwnProperty.call(
                                                s,
                                                p
                                            )
                                        )
                                            t[p] = s[p];
                                }
                                return t;
                            };
                        return __assign.apply(this, arguments);
                    };
                Object.defineProperty(exports, '__esModule', { value: true });
                var translateToken = require('./token');
                var axios_https_proxy_fix_1 = require('axios-https-proxy-fix');
                var util_1 = require('./util');
                var language_1 = require('./language');
                function handletranslate(data, extra) {
                    var e;
                    if (extra.from) {
                        if (!language_1.isSupport(extra.from)) {
                            e = new Error();
                            e.language = extra.from;
                        }
                    }
                    if (!language_1.isSupport(extra.to)) {
                        e = new Error();
                        e.language = extra.to;
                    }
                    if (e) {
                        e.code = 400;
                        e.message =
                            "The language '" +
                            e.language +
                            "' is not supported";
                        return new Promise(function (_, reject) {
                            reject(e);
                        });
                    }
                    var tld = extra.tld || 'com';
                    return translateToken
                        .get(data.join(''), {
                            tld: tld,
                            proxy: extra.proxy || false
                        })
                        .then(function (res) {
                            var query = {
                                anno: 3,
                                client: 'webapp',
                                format: extra.format,
                                v: 1.0,
                                key: null,
                                logld: 'vTE_20190506_00',
                                sl: extra.from || 'auto',
                                tl: extra.to || 'zh-CN',
                                hl: 'zh-CN',
                                sp: 'nmt',
                                tc: 2,
                                sr: 1,
                                tk: res.value,
                                mode: 1
                            };
                            var headers = {
                                'content-type':
                                    'application/x-www-form-urlencoded',
                                Accept: 'application/json, text/plain, */*',
                                'X-Requested-With': 'XMLHttpRequest'
                            };
                            /*if (
                                typeof extra.isUserAgent === 'undefined' ||
                                extra.isUserAgent
                            ) {
                                headers['User-Agent'] = extra.userAgent
                                    ? extra.userAgent
                                    : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36';
                            }*/
                            var options = __assign(
                                {
                                    method: 'POST',
                                    headers: headers,
                                    data: util_1.arrayStringify(data),
                                    url: '/translate_a/t',
                                    baseURL:
                                        `${window.corsProxy}https://translate.google.` +
                                        tld,
                                    params: query,
                                    proxy: extra.proxy || false
                                },
                                extra.config
                            );
                            var browersUrl = window.corsProxy;
                            if (extra.browersUrl) {
                                browersUrl = extra.browersUrl;
                            }
                            if (extra.browers) {
                                options.baseURL = browersUrl + options.baseURL;
                            }
                            return axios_https_proxy_fix_1.default(options);
                        });
                }
                exports.default = handletranslate;
            },
            {
                './language': 29,
                './token': 30,
                './util': 32,
                'axios-https-proxy-fix': 3
            }
        ],
        32: [
            function (require, module, exports) {
                'use strict';
                Object.defineProperty(exports, '__esModule', { value: true });
                function arrayStringify(data) {
                    return data
                        .map(function (item) {
                            return 'q=' + encodeURIComponent(item);
                        })
                        .join('&');
                }
                exports.arrayStringify = arrayStringify;
                function parseMultiple(list) {
                    var translateMap = list.map(function (item) {
                        var text = item[0][0][0];
                        if (text.indexOf('<b>') > -1) {
                            return rmHtml(text);
                        }
                        return text;
                    });
                    return translateMap;
                }
                exports.parseMultiple = parseMultiple;
                function rmHtml(value) {
                    return value
                        .match(/<b>(.*?)<\/b>/g)
                        .map(function (item) {
                            return item.match(/<b>(.*)<\/b>/)[1];
                        })
                        .join('');
                }
            },
            {}
        ],
        33: [
            function (require, module, exports) {
                /*!
                 * Determine if an object is a Buffer
                 *
                 * @author   Feross Aboukhadijeh <https://feross.org>
                 * @license  MIT
                 */

                // The _isBuffer check is for Safari 5-7 support, because it's missing
                // Object.prototype.constructor. Remove this eventually
                module.exports = function (obj) {
                    return (
                        obj != null &&
                        (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
                    );
                };

                function isBuffer(obj) {
                    return (
                        !!obj.constructor &&
                        typeof obj.constructor.isBuffer === 'function' &&
                        obj.constructor.isBuffer(obj)
                    );
                }

                // For Node v0.10 support. Remove this eventually.
                function isSlowBuffer(obj) {
                    return (
                        typeof obj.readFloatLE === 'function' &&
                        typeof obj.slice === 'function' &&
                        isBuffer(obj.slice(0, 0))
                    );
                }
            },
            {}
        ]
    },
    {},
    [2]
);
