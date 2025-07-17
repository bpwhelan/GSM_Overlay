// @ts-nocheck

// node_modules/dexie/dist/modern/dexie.mjs
var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
var keys = Object.keys;
var isArray = Array.isArray;
if (typeof Promise !== "undefined" && !_global.Promise) {
  _global.Promise = Promise;
}
function extend(obj, extension) {
  if (typeof extension !== "object")
    return obj;
  keys(extension).forEach(function(key) {
    obj[key] = extension[key];
  });
  return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
  return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
  if (typeof extension === "function")
    extension = extension(getProto(proto));
  (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach((key) => {
    setProp(proto, key, extension[key]);
  });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
  defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } : { value: functionOrGetSet, configurable: true, writable: true }, options));
}
function derive(Child) {
  return {
    from: function(Parent) {
      Child.prototype = Object.create(Parent.prototype);
      setProp(Child.prototype, "constructor", Child);
      return {
        extend: props.bind(null, Child.prototype)
      };
    }
  };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
  const pd = getOwnPropertyDescriptor(obj, prop);
  let proto;
  return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
  return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
  return overridedFactory(origFunc);
}
function assert(b) {
  if (!b)
    throw new Error("Assertion Failed");
}
function asap$1(fn) {
  if (_global.setImmediate)
    setImmediate(fn);
  else
    setTimeout(fn, 0);
}
function arrayToObject(array, extractor) {
  return array.reduce((result, item, i) => {
    var nameAndValue = extractor(item, i);
    if (nameAndValue)
      result[nameAndValue[0]] = nameAndValue[1];
    return result;
  }, {});
}
function tryCatch(fn, onerror, args) {
  try {
    fn.apply(null, args);
  } catch (ex) {
    onerror && onerror(ex);
  }
}
function getByKeyPath(obj, keyPath) {
  if (typeof keyPath === "string" && hasOwn(obj, keyPath))
    return obj[keyPath];
  if (!keyPath)
    return obj;
  if (typeof keyPath !== "string") {
    var rv = [];
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      var val = getByKeyPath(obj, keyPath[i]);
      rv.push(val);
    }
    return rv;
  }
  var period = keyPath.indexOf(".");
  if (period !== -1) {
    var innerObj = obj[keyPath.substr(0, period)];
    return innerObj === void 0 ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
  }
  return void 0;
}
function setByKeyPath(obj, keyPath, value) {
  if (!obj || keyPath === void 0)
    return;
  if ("isFrozen" in Object && Object.isFrozen(obj))
    return;
  if (typeof keyPath !== "string" && "length" in keyPath) {
    assert(typeof value !== "string" && "length" in value);
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      setByKeyPath(obj, keyPath[i], value[i]);
    }
  } else {
    var period = keyPath.indexOf(".");
    if (period !== -1) {
      var currentKeyPath = keyPath.substr(0, period);
      var remainingKeyPath = keyPath.substr(period + 1);
      if (remainingKeyPath === "")
        if (value === void 0) {
          if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
            obj.splice(currentKeyPath, 1);
          else
            delete obj[currentKeyPath];
        } else
          obj[currentKeyPath] = value;
      else {
        var innerObj = obj[currentKeyPath];
        if (!innerObj || !hasOwn(obj, currentKeyPath))
          innerObj = obj[currentKeyPath] = {};
        setByKeyPath(innerObj, remainingKeyPath, value);
      }
    } else {
      if (value === void 0) {
        if (isArray(obj) && !isNaN(parseInt(keyPath)))
          obj.splice(keyPath, 1);
        else
          delete obj[keyPath];
      } else
        obj[keyPath] = value;
    }
  }
}
function delByKeyPath(obj, keyPath) {
  if (typeof keyPath === "string")
    setByKeyPath(obj, keyPath, void 0);
  else if ("length" in keyPath)
    [].map.call(keyPath, function(kp) {
      setByKeyPath(obj, kp, void 0);
    });
}
function shallowClone(obj) {
  var rv = {};
  for (var m in obj) {
    if (hasOwn(obj, m))
      rv[m] = obj[m];
  }
  return rv;
}
var concat = [].concat;
function flatten(a) {
  return concat.apply([], a);
}
var intrinsicTypeNames = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten([8, 16, 32, 64].map((num) => ["Int", "Uint", "Float"].map((t) => t + num + "Array")))).filter((t) => _global[t]);
var intrinsicTypes = intrinsicTypeNames.map((t) => _global[t]);
arrayToObject(intrinsicTypeNames, (x) => [x, true]);
var circularRefs = null;
function deepClone(any) {
  circularRefs = typeof WeakMap !== "undefined" && /* @__PURE__ */ new WeakMap();
  const rv = innerDeepClone(any);
  circularRefs = null;
  return rv;
}
function innerDeepClone(any) {
  if (!any || typeof any !== "object")
    return any;
  let rv = circularRefs && circularRefs.get(any);
  if (rv)
    return rv;
  if (isArray(any)) {
    rv = [];
    circularRefs && circularRefs.set(any, rv);
    for (var i = 0, l = any.length; i < l; ++i) {
      rv.push(innerDeepClone(any[i]));
    }
  } else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
    rv = any;
  } else {
    const proto = getProto(any);
    rv = proto === Object.prototype ? {} : Object.create(proto);
    circularRefs && circularRefs.set(any, rv);
    for (var prop in any) {
      if (hasOwn(any, prop)) {
        rv[prop] = innerDeepClone(any[prop]);
      }
    }
  }
  return rv;
}
var { toString } = {};
function toStringTag(o) {
  return toString.call(o).slice(8, -1);
}
var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
var getIteratorOf = typeof iteratorSymbol === "symbol" ? function(x) {
  var i;
  return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function() {
  return null;
};
var NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
  var i, a, x, it;
  if (arguments.length === 1) {
    if (isArray(arrayLike))
      return arrayLike.slice();
    if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
      return [arrayLike];
    if (it = getIteratorOf(arrayLike)) {
      a = [];
      while (x = it.next(), !x.done)
        a.push(x.value);
      return a;
    }
    if (arrayLike == null)
      return [arrayLike];
    i = arrayLike.length;
    if (typeof i === "number") {
      a = new Array(i);
      while (i--)
        a[i] = arrayLike[i];
      return a;
    }
    return [arrayLike];
  }
  i = arguments.length;
  a = new Array(i);
  while (i--)
    a[i] = arguments[i];
  return a;
}
var isAsyncFunction = typeof Symbol !== "undefined" ? (fn) => fn[Symbol.toStringTag] === "AsyncFunction" : () => false;
var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
  debug = value;
  libraryFilter = filter;
}
var libraryFilter = () => true;
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
  if (NEEDS_THROW_FOR_STACK)
    try {
      getErrorWithStack.arguments;
      throw new Error();
    } catch (e) {
      return e;
    }
  return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
  var stack = exception.stack;
  if (!stack)
    return "";
  numIgnoredFrames = numIgnoredFrames || 0;
  if (stack.indexOf(exception.name) === 0)
    numIgnoredFrames += (exception.name + exception.message).split("\n").length;
  return stack.split("\n").slice(numIgnoredFrames).filter(libraryFilter).map((frame) => "\n" + frame).join("");
}
var dexieErrorNames = [
  "Modify",
  "Bulk",
  "OpenFailed",
  "VersionChange",
  "Schema",
  "Upgrade",
  "InvalidTable",
  "MissingAPI",
  "NoSuchDatabase",
  "InvalidArgument",
  "SubTransaction",
  "Unsupported",
  "Internal",
  "DatabaseClosed",
  "PrematureCommit",
  "ForeignAwait"
];
var idbDomErrorNames = [
  "Unknown",
  "Constraint",
  "Data",
  "TransactionInactive",
  "ReadOnly",
  "Version",
  "NotFound",
  "InvalidState",
  "InvalidAccess",
  "Abort",
  "Timeout",
  "QuotaExceeded",
  "Syntax",
  "DataClone"
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
  VersionChanged: "Database version changed by other database connection",
  DatabaseClosed: "Database has been closed",
  Abort: "Transaction aborted",
  TransactionInactive: "Transaction has already completed or failed",
  MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
};
function DexieError(name, msg) {
  this._e = getErrorWithStack();
  this.name = name;
  this.message = msg;
}
derive(DexieError).from(Error).extend({
  stack: {
    get: function() {
      return this._stack || (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
    }
  },
  toString: function() {
    return this.name + ": " + this.message;
  }
});
function getMultiErrorMessage(msg, failures) {
  return msg + ". Errors: " + Object.keys(failures).map((key) => failures[key].toString()).filter((v, i, s) => s.indexOf(v) === i).join("\n");
}
function ModifyError(msg, failures, successCount, failedKeys) {
  this._e = getErrorWithStack();
  this.failures = failures;
  this.failedKeys = failedKeys;
  this.successCount = successCount;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
  this._e = getErrorWithStack();
  this.name = "BulkError";
  this.failures = Object.keys(failures).map((pos) => failures[pos]);
  this.failuresByPos = failures;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce((obj, name) => (obj[name] = name + "Error", obj), {});
var BaseException = DexieError;
var exceptions = errorList.reduce((obj, name) => {
  var fullName = name + "Error";
  function DexieError2(msgOrInner, inner) {
    this._e = getErrorWithStack();
    this.name = fullName;
    if (!msgOrInner) {
      this.message = defaultTexts[name] || fullName;
      this.inner = null;
    } else if (typeof msgOrInner === "string") {
      this.message = `${msgOrInner}${!inner ? "" : "\n " + inner}`;
      this.inner = inner || null;
    } else if (typeof msgOrInner === "object") {
      this.message = `${msgOrInner.name} ${msgOrInner.message}`;
      this.inner = msgOrInner;
    }
  }
  derive(DexieError2).from(BaseException);
  obj[name] = DexieError2;
  return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce((obj, name) => {
  obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
function mapError(domError, message) {
  if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
    return domError;
  var rv = new exceptionMap[domError.name](message || domError.message, domError);
  if ("stack" in domError) {
    setProp(rv, "stack", { get: function() {
      return this.inner.stack;
    } });
  }
  return rv;
}
var fullNameExceptions = errorList.reduce((obj, name) => {
  if (["Syntax", "Type", "Range"].indexOf(name) === -1)
    obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;
function nop() {
}
function mirror(val) {
  return val;
}
function pureFunctionChain(f1, f2) {
  if (f1 == null || f1 === mirror)
    return f2;
  return function(val) {
    return f2(f1(val));
  };
}
function callBoth(on1, on2) {
  return function() {
    on1.apply(this, arguments);
    on2.apply(this, arguments);
  };
}
function hookCreatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res !== void 0)
      arguments[0] = res;
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res2 !== void 0 ? res2 : res;
  };
}
function hookDeletingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    f1.apply(this, arguments);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = this.onerror = null;
    f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
  };
}
function hookUpdatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function(modifications) {
    var res = f1.apply(this, arguments);
    extend(modifications, res);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
  };
}
function reverseStoppableEventChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    if (f2.apply(this, arguments) === false)
      return false;
    return f1.apply(this, arguments);
  };
}
function promisableChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res && typeof res.then === "function") {
      var thiz = this, i = arguments.length, args = new Array(i);
      while (i--)
        args[i] = arguments[i];
      return res.then(function() {
        return f2.apply(thiz, args);
      });
    }
    return f2.apply(this, arguments);
  };
}
var INTERNAL = {};
var LONG_STACKS_CLIP_LIMIT = 100;
var MAX_LONG_STACKS = 20;
var ZONE_ECHO_LIMIT = 100;
var [resolvedNativePromise, nativePromiseProto, resolvedGlobalPromise] = typeof Promise === "undefined" ? [] : (() => {
  let globalP = Promise.resolve();
  if (typeof crypto === "undefined" || !crypto.subtle)
    return [globalP, getProto(globalP), globalP];
  const nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
  return [
    nativeP,
    getProto(nativeP),
    globalP
  ];
})();
var nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise ? () => {
  resolvedGlobalPromise.then(physicalTick);
} : _global.setImmediate ? setImmediate.bind(null, physicalTick) : _global.MutationObserver ? () => {
  var hiddenDiv = document.createElement("div");
  new MutationObserver(() => {
    physicalTick();
    hiddenDiv = null;
  }).observe(hiddenDiv, { attributes: true });
  hiddenDiv.setAttribute("i", "1");
} : () => {
  setTimeout(physicalTick, 0);
};
var asap = function(callback, args) {
  microtickQueue.push([callback, args]);
  if (needsNewPhysicalTick) {
    schedulePhysicalTick();
    needsNewPhysicalTick = false;
  }
};
var isOutsideMicroTick = true;
var needsNewPhysicalTick = true;
var unhandledErrors = [];
var rejectingErrors = [];
var currentFulfiller = null;
var rejectionMapper = mirror;
var globalPSD = {
  id: "global",
  global: true,
  ref: 0,
  unhandleds: [],
  onunhandled: globalError,
  pgp: false,
  env: {},
  finalize: function() {
    this.unhandleds.forEach((uh) => {
      try {
        globalError(uh[0], uh[1]);
      } catch (e) {
      }
    });
  }
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
  if (typeof this !== "object")
    throw new TypeError("Promises must be constructed via new");
  this._listeners = [];
  this.onuncatched = nop;
  this._lib = false;
  var psd = this._PSD = PSD;
  if (debug) {
    this._stackHolder = getErrorWithStack();
    this._prev = null;
    this._numPrev = 0;
  }
  if (typeof fn !== "function") {
    if (fn !== INTERNAL)
      throw new TypeError("Not a function");
    this._state = arguments[1];
    this._value = arguments[2];
    if (this._state === false)
      handleRejection(this, this._value);
    return;
  }
  this._state = null;
  this._value = null;
  ++psd.ref;
  executePromiseTask(this, fn);
}
var thenProp = {
  get: function() {
    var psd = PSD, microTaskId = totalEchoes;
    function then(onFulfilled, onRejected) {
      var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
      const cleanup = possibleAwait && !decrementExpectedAwaits();
      var rv = new DexiePromise((resolve, reject) => {
        propagateToListener(this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
      });
      debug && linkToPreviousPromise(rv, this);
      return rv;
    }
    then.prototype = INTERNAL;
    return then;
  },
  set: function(value) {
    setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
      get: function() {
        return value;
      },
      set: thenProp.set
    });
  }
};
props(DexiePromise.prototype, {
  then: thenProp,
  _then: function(onFulfilled, onRejected) {
    propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
  },
  catch: function(onRejected) {
    if (arguments.length === 1)
      return this.then(null, onRejected);
    var type2 = arguments[0], handler = arguments[1];
    return typeof type2 === "function" ? this.then(null, (err) => err instanceof type2 ? handler(err) : PromiseReject(err)) : this.then(null, (err) => err && err.name === type2 ? handler(err) : PromiseReject(err));
  },
  finally: function(onFinally) {
    return this.then((value) => {
      onFinally();
      return value;
    }, (err) => {
      onFinally();
      return PromiseReject(err);
    });
  },
  stack: {
    get: function() {
      if (this._stack)
        return this._stack;
      try {
        stack_being_generated = true;
        var stacks = getStack(this, [], MAX_LONG_STACKS);
        var stack = stacks.join("\nFrom previous: ");
        if (this._state !== null)
          this._stack = stack;
        return stack;
      } finally {
        stack_being_generated = false;
      }
    }
  },
  timeout: function(ms, msg) {
    return ms < Infinity ? new DexiePromise((resolve, reject) => {
      var handle = setTimeout(() => reject(new exceptions.Timeout(msg)), ms);
      this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
    }) : this;
  }
});
if (typeof Symbol !== "undefined" && Symbol.toStringTag)
  setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.resolve = resolve;
  this.reject = reject;
  this.psd = zone;
}
props(DexiePromise, {
  all: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise(function(resolve, reject) {
      if (values.length === 0)
        resolve([]);
      var remaining = values.length;
      values.forEach((a, i) => DexiePromise.resolve(a).then((x) => {
        values[i] = x;
        if (!--remaining)
          resolve(values);
      }, reject));
    });
  },
  resolve: (value) => {
    if (value instanceof DexiePromise)
      return value;
    if (value && typeof value.then === "function")
      return new DexiePromise((resolve, reject) => {
        value.then(resolve, reject);
      });
    var rv = new DexiePromise(INTERNAL, true, value);
    linkToPreviousPromise(rv, currentFulfiller);
    return rv;
  },
  reject: PromiseReject,
  race: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise((resolve, reject) => {
      values.map((value) => DexiePromise.resolve(value).then(resolve, reject));
    });
  },
  PSD: {
    get: () => PSD,
    set: (value) => PSD = value
  },
  totalEchoes: { get: () => totalEchoes },
  newPSD: newScope,
  usePSD,
  scheduler: {
    get: () => asap,
    set: (value) => {
      asap = value;
    }
  },
  rejectionMapper: {
    get: () => rejectionMapper,
    set: (value) => {
      rejectionMapper = value;
    }
  },
  follow: (fn, zoneProps) => {
    return new DexiePromise((resolve, reject) => {
      return newScope((resolve2, reject2) => {
        var psd = PSD;
        psd.unhandleds = [];
        psd.onunhandled = reject2;
        psd.finalize = callBoth(function() {
          run_at_end_of_this_or_next_physical_tick(() => {
            this.unhandleds.length === 0 ? resolve2() : reject2(this.unhandleds[0]);
          });
        }, psd.finalize);
        fn();
      }, zoneProps, resolve, reject);
    });
  }
});
if (NativePromise) {
  if (NativePromise.allSettled)
    setProp(DexiePromise, "allSettled", function() {
      const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise((resolve) => {
        if (possiblePromises.length === 0)
          resolve([]);
        let remaining = possiblePromises.length;
        const results = new Array(remaining);
        possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then((value) => results[i] = { status: "fulfilled", value }, (reason) => results[i] = { status: "rejected", reason }).then(() => --remaining || resolve(results)));
      });
    });
  if (NativePromise.any && typeof AggregateError !== "undefined")
    setProp(DexiePromise, "any", function() {
      const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise((resolve, reject) => {
        if (possiblePromises.length === 0)
          reject(new AggregateError([]));
        let remaining = possiblePromises.length;
        const failures = new Array(remaining);
        possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then((value) => resolve(value), (failure) => {
          failures[i] = failure;
          if (!--remaining)
            reject(new AggregateError(failures));
        }));
      });
    });
}
function executePromiseTask(promise, fn) {
  try {
    fn((value) => {
      if (promise._state !== null)
        return;
      if (value === promise)
        throw new TypeError("A promise cannot be resolved with itself.");
      var shouldExecuteTick = promise._lib && beginMicroTickScope();
      if (value && typeof value.then === "function") {
        executePromiseTask(promise, (resolve, reject) => {
          value instanceof DexiePromise ? value._then(resolve, reject) : value.then(resolve, reject);
        });
      } else {
        promise._state = true;
        promise._value = value;
        propagateAllListeners(promise);
      }
      if (shouldExecuteTick)
        endMicroTickScope();
    }, handleRejection.bind(null, promise));
  } catch (ex) {
    handleRejection(promise, ex);
  }
}
function handleRejection(promise, reason) {
  rejectingErrors.push(reason);
  if (promise._state !== null)
    return;
  var shouldExecuteTick = promise._lib && beginMicroTickScope();
  reason = rejectionMapper(reason);
  promise._state = false;
  promise._value = reason;
  debug && reason !== null && typeof reason === "object" && !reason._promise && tryCatch(() => {
    var origProp = getPropertyDescriptor(reason, "stack");
    reason._promise = promise;
    setProp(reason, "stack", {
      get: () => stack_being_generated ? origProp && (origProp.get ? origProp.get.apply(reason) : origProp.value) : promise.stack
    });
  });
  addPossiblyUnhandledError(promise);
  propagateAllListeners(promise);
  if (shouldExecuteTick)
    endMicroTickScope();
}
function propagateAllListeners(promise) {
  var listeners = promise._listeners;
  promise._listeners = [];
  for (var i = 0, len = listeners.length; i < len; ++i) {
    propagateToListener(promise, listeners[i]);
  }
  var psd = promise._PSD;
  --psd.ref || psd.finalize();
  if (numScheduledCalls === 0) {
    ++numScheduledCalls;
    asap(() => {
      if (--numScheduledCalls === 0)
        finalizePhysicalTick();
    }, []);
  }
}
function propagateToListener(promise, listener) {
  if (promise._state === null) {
    promise._listeners.push(listener);
    return;
  }
  var cb = promise._state ? listener.onFulfilled : listener.onRejected;
  if (cb === null) {
    return (promise._state ? listener.resolve : listener.reject)(promise._value);
  }
  ++listener.psd.ref;
  ++numScheduledCalls;
  asap(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
  try {
    currentFulfiller = promise;
    var ret, value = promise._value;
    if (promise._state) {
      ret = cb(value);
    } else {
      if (rejectingErrors.length)
        rejectingErrors = [];
      ret = cb(value);
      if (rejectingErrors.indexOf(value) === -1)
        markErrorAsHandled(promise);
    }
    listener.resolve(ret);
  } catch (e) {
    listener.reject(e);
  } finally {
    currentFulfiller = null;
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
    --listener.psd.ref || listener.psd.finalize();
  }
}
function getStack(promise, stacks, limit) {
  if (stacks.length === limit)
    return stacks;
  var stack = "";
  if (promise._state === false) {
    var failure = promise._value, errorName, message;
    if (failure != null) {
      errorName = failure.name || "Error";
      message = failure.message || failure;
      stack = prettyStack(failure, 0);
    } else {
      errorName = failure;
      message = "";
    }
    stacks.push(errorName + (message ? ": " + message : "") + stack);
  }
  if (debug) {
    stack = prettyStack(promise._stackHolder, 2);
    if (stack && stacks.indexOf(stack) === -1)
      stacks.push(stack);
    if (promise._prev)
      getStack(promise._prev, stacks, limit);
  }
  return stacks;
}
function linkToPreviousPromise(promise, prev) {
  var numPrev = prev ? prev._numPrev + 1 : 0;
  if (numPrev < LONG_STACKS_CLIP_LIMIT) {
    promise._prev = prev;
    promise._numPrev = numPrev;
  }
}
function physicalTick() {
  beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
  var wasRootExec = isOutsideMicroTick;
  isOutsideMicroTick = false;
  needsNewPhysicalTick = false;
  return wasRootExec;
}
function endMicroTickScope() {
  var callbacks, i, l;
  do {
    while (microtickQueue.length > 0) {
      callbacks = microtickQueue;
      microtickQueue = [];
      l = callbacks.length;
      for (i = 0; i < l; ++i) {
        var item = callbacks[i];
        item[0].apply(null, item[1]);
      }
    }
  } while (microtickQueue.length > 0);
  isOutsideMicroTick = true;
  needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
  var unhandledErrs = unhandledErrors;
  unhandledErrors = [];
  unhandledErrs.forEach((p) => {
    p._PSD.onunhandled.call(null, p._value, p);
  });
  var finalizers = tickFinalizers.slice(0);
  var i = finalizers.length;
  while (i)
    finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
  function finalizer() {
    fn();
    tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
  }
  tickFinalizers.push(finalizer);
  ++numScheduledCalls;
  asap(() => {
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
  }, []);
}
function addPossiblyUnhandledError(promise) {
  if (!unhandledErrors.some((p) => p._value === promise._value))
    unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
  var i = unhandledErrors.length;
  while (i)
    if (unhandledErrors[--i]._value === promise._value) {
      unhandledErrors.splice(i, 1);
      return;
    }
}
function PromiseReject(reason) {
  return new DexiePromise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
  var psd = PSD;
  return function() {
    var wasRootExec = beginMicroTickScope(), outerScope = PSD;
    try {
      switchToZone(psd, true);
      return fn.apply(this, arguments);
    } catch (e) {
      errorCatcher && errorCatcher(e);
    } finally {
      switchToZone(outerScope, false);
      if (wasRootExec)
        endMicroTickScope();
    }
  };
}
var task = { awaits: 0, echoes: 0, id: 0 };
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props2, a1, a2) {
  var parent = PSD, psd = Object.create(parent);
  psd.parent = parent;
  psd.ref = 0;
  psd.global = false;
  psd.id = ++zone_id_counter;
  var globalEnv = globalPSD.env;
  psd.env = patchGlobalPromise ? {
    Promise: DexiePromise,
    PromiseProp: { value: DexiePromise, configurable: true, writable: true },
    all: DexiePromise.all,
    race: DexiePromise.race,
    allSettled: DexiePromise.allSettled,
    any: DexiePromise.any,
    resolve: DexiePromise.resolve,
    reject: DexiePromise.reject,
    nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
    gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
  } : {};
  if (props2)
    extend(psd, props2);
  ++parent.ref;
  psd.finalize = function() {
    --this.parent.ref || this.parent.finalize();
  };
  var rv = usePSD(psd, fn, a1, a2);
  if (psd.ref === 0)
    psd.finalize();
  return rv;
}
function incrementExpectedAwaits() {
  if (!task.id)
    task.id = ++taskCounter;
  ++task.awaits;
  task.echoes += ZONE_ECHO_LIMIT;
  return task.id;
}
function decrementExpectedAwaits() {
  if (!task.awaits)
    return false;
  if (--task.awaits === 0)
    task.id = 0;
  task.echoes = task.awaits * ZONE_ECHO_LIMIT;
  return true;
}
if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
  incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
  if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
    incrementExpectedAwaits();
    return possiblePromise.then((x) => {
      decrementExpectedAwaits();
      return x;
    }, (e) => {
      decrementExpectedAwaits();
      return rejection(e);
    });
  }
  return possiblePromise;
}
function zoneEnterEcho(targetZone) {
  ++totalEchoes;
  if (!task.echoes || --task.echoes === 0) {
    task.echoes = task.id = 0;
  }
  zoneStack.push(PSD);
  switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
  var zone = zoneStack[zoneStack.length - 1];
  zoneStack.pop();
  switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
  var currentZone = PSD;
  if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
    enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
  }
  if (targetZone === PSD)
    return;
  PSD = targetZone;
  if (currentZone === globalPSD)
    globalPSD.env = snapShot();
  if (patchGlobalPromise) {
    var GlobalPromise = globalPSD.env.Promise;
    var targetEnv = targetZone.env;
    nativePromiseProto.then = targetEnv.nthen;
    GlobalPromise.prototype.then = targetEnv.gthen;
    if (currentZone.global || targetZone.global) {
      Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
      GlobalPromise.all = targetEnv.all;
      GlobalPromise.race = targetEnv.race;
      GlobalPromise.resolve = targetEnv.resolve;
      GlobalPromise.reject = targetEnv.reject;
      if (targetEnv.allSettled)
        GlobalPromise.allSettled = targetEnv.allSettled;
      if (targetEnv.any)
        GlobalPromise.any = targetEnv.any;
    }
  }
}
function snapShot() {
  var GlobalPromise = _global.Promise;
  return patchGlobalPromise ? {
    Promise: GlobalPromise,
    PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
    all: GlobalPromise.all,
    race: GlobalPromise.race,
    allSettled: GlobalPromise.allSettled,
    any: GlobalPromise.any,
    resolve: GlobalPromise.resolve,
    reject: GlobalPromise.reject,
    nthen: nativePromiseProto.then,
    gthen: GlobalPromise.prototype.then
  } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
  var outerScope = PSD;
  try {
    switchToZone(psd, true);
    return fn(a1, a2, a3);
  } finally {
    switchToZone(outerScope, false);
  }
}
function enqueueNativeMicroTask(job) {
  nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
  return typeof fn !== "function" ? fn : function() {
    var outerZone = PSD;
    if (possibleAwait)
      incrementExpectedAwaits();
    switchToZone(zone, true);
    try {
      return fn.apply(this, arguments);
    } finally {
      switchToZone(outerZone, false);
      if (cleanup)
        enqueueNativeMicroTask(decrementExpectedAwaits);
    }
  };
}
function getPatchedPromiseThen(origThen, zone) {
  return function(onResolved, onRejected) {
    return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone), nativeAwaitCompatibleWrap(onRejected, zone));
  };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
  var rv;
  try {
    rv = promise.onuncatched(err);
  } catch (e) {
  }
  if (rv !== false)
    try {
      var event, eventData = { promise, reason: err };
      if (_global.document && document.createEvent) {
        event = document.createEvent("Event");
        event.initEvent(UNHANDLEDREJECTION, true, true);
        extend(event, eventData);
      } else if (_global.CustomEvent) {
        event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
        extend(event, eventData);
      }
      if (event && _global.dispatchEvent) {
        dispatchEvent(event);
        if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
          try {
            _global.onunhandledrejection(event);
          } catch (_) {
          }
      }
      if (debug && event && !event.defaultPrevented) {
        console.warn(`Unhandled rejection: ${err.stack || err}`);
      }
    } catch (e) {
    }
}
var rejection = DexiePromise.reject;
function tempTransaction(db, mode, storeNames, fn) {
  if (!db.idbdb || !db._state.openComplete && (!PSD.letThrough && !db._vip)) {
    if (db._state.openComplete) {
      return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
    }
    if (!db._state.isBeingOpened) {
      if (!db._options.autoOpen)
        return rejection(new exceptions.DatabaseClosed());
      db.open().catch(nop);
    }
    return db._state.dbReadyPromise.then(() => tempTransaction(db, mode, storeNames, fn));
  } else {
    var trans = db._createTransaction(mode, storeNames, db._dbSchema);
    try {
      trans.create();
      db._state.PR1398_maxLoop = 3;
    } catch (ex) {
      if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
        console.warn("Dexie: Need to reopen db");
        db._close();
        return db.open().then(() => tempTransaction(db, mode, storeNames, fn));
      }
      return rejection(ex);
    }
    return trans._promise(mode, (resolve, reject) => {
      return newScope(() => {
        PSD.trans = trans;
        return fn(resolve, reject, trans);
      });
    }).then((result) => {
      return trans._completion.then(() => result);
    });
  }
}
var DEXIE_VERSION = "3.2.5";
var maxString = String.fromCharCode(65535);
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== "undefined" && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = (frame) => !/(dexie\.js|dexie\.min\.js)/.test(frame);
var DBNAMES_DB = "__dbnames";
var READONLY = "readonly";
var READWRITE = "readwrite";
function combine(filter1, filter2) {
  return filter1 ? filter2 ? function() {
    return filter1.apply(this, arguments) && filter2.apply(this, arguments);
  } : filter1 : filter2;
}
var AnyRange = {
  type: 3,
  lower: -Infinity,
  lowerOpen: false,
  upper: [[]],
  upperOpen: false
};
function workaroundForUndefinedPrimKey(keyPath) {
  return typeof keyPath === "string" && !/\./.test(keyPath) ? (obj) => {
    if (obj[keyPath] === void 0 && keyPath in obj) {
      obj = deepClone(obj);
      delete obj[keyPath];
    }
    return obj;
  } : (obj) => obj;
}
var Table = class {
  _trans(mode, fn, writeLocked) {
    const trans = this._tx || PSD.trans;
    const tableName = this.name;
    function checkTableInTransaction(resolve, reject, trans2) {
      if (!trans2.schema[tableName])
        throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
      return fn(trans2.idbtrans, trans2);
    }
    const wasRootExec = beginMicroTickScope();
    try {
      return trans && trans.db === this.db ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(() => trans._promise(mode, checkTableInTransaction, writeLocked), { trans, transless: PSD.transless || PSD }) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
    } finally {
      if (wasRootExec)
        endMicroTickScope();
    }
  }
  get(keyOrCrit, cb) {
    if (keyOrCrit && keyOrCrit.constructor === Object)
      return this.where(keyOrCrit).first(cb);
    return this._trans("readonly", (trans) => {
      return this.core.get({ trans, key: keyOrCrit }).then((res) => this.hook.reading.fire(res));
    }).then(cb);
  }
  where(indexOrCrit) {
    if (typeof indexOrCrit === "string")
      return new this.db.WhereClause(this, indexOrCrit);
    if (isArray(indexOrCrit))
      return new this.db.WhereClause(this, `[${indexOrCrit.join("+")}]`);
    const keyPaths = keys(indexOrCrit);
    if (keyPaths.length === 1)
      return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
    const compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter((ix) => {
      if (ix.compound && keyPaths.every((keyPath) => ix.keyPath.indexOf(keyPath) >= 0)) {
        for (let i = 0; i < keyPaths.length; ++i) {
          if (keyPaths.indexOf(ix.keyPath[i]) === -1)
            return false;
        }
        return true;
      }
      return false;
    }).sort((a, b) => a.keyPath.length - b.keyPath.length)[0];
    if (compoundIndex && this.db._maxKey !== maxString) {
      const keyPathsInValidOrder = compoundIndex.keyPath.slice(0, keyPaths.length);
      return this.where(keyPathsInValidOrder).equals(keyPathsInValidOrder.map((kp) => indexOrCrit[kp]));
    }
    if (!compoundIndex && debug)
      console.warn(`The query ${JSON.stringify(indexOrCrit)} on ${this.name} would benefit of a compound index [${keyPaths.join("+")}]`);
    const { idxByName } = this.schema;
    const idb = this.db._deps.indexedDB;
    function equals(a, b) {
      try {
        return idb.cmp(a, b) === 0;
      } catch (e) {
        return false;
      }
    }
    const [idx, filterFunction] = keyPaths.reduce(([prevIndex, prevFilterFn], keyPath) => {
      const index = idxByName[keyPath];
      const value = indexOrCrit[keyPath];
      return [
        prevIndex || index,
        prevIndex || !index ? combine(prevFilterFn, index && index.multi ? (x) => {
          const prop = getByKeyPath(x, keyPath);
          return isArray(prop) && prop.some((item) => equals(value, item));
        } : (x) => equals(value, getByKeyPath(x, keyPath))) : prevFilterFn
      ];
    }, [null, null]);
    return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
  }
  filter(filterFunction) {
    return this.toCollection().and(filterFunction);
  }
  count(thenShortcut) {
    return this.toCollection().count(thenShortcut);
  }
  offset(offset) {
    return this.toCollection().offset(offset);
  }
  limit(numRows) {
    return this.toCollection().limit(numRows);
  }
  each(callback) {
    return this.toCollection().each(callback);
  }
  toArray(thenShortcut) {
    return this.toCollection().toArray(thenShortcut);
  }
  toCollection() {
    return new this.db.Collection(new this.db.WhereClause(this));
  }
  orderBy(index) {
    return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ? `[${index.join("+")}]` : index));
  }
  reverse() {
    return this.toCollection().reverse();
  }
  mapToClass(constructor) {
    this.schema.mappedClass = constructor;
    const readHook = (obj) => {
      if (!obj)
        return obj;
      const res = Object.create(constructor.prototype);
      for (var m in obj)
        if (hasOwn(obj, m))
          try {
            res[m] = obj[m];
          } catch (_) {
          }
      return res;
    };
    if (this.schema.readHook) {
      this.hook.reading.unsubscribe(this.schema.readHook);
    }
    this.schema.readHook = readHook;
    this.hook("reading", readHook);
    return constructor;
  }
  defineClass() {
    function Class(content) {
      extend(this, content);
    }
    return this.mapToClass(Class);
  }
  add(obj, key) {
    const { auto, keyPath } = this.schema.primKey;
    let objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", (trans) => {
      return this.core.mutate({ trans, type: "add", keys: key != null ? [key] : null, values: [objToAdd] });
    }).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult).then((lastResult) => {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  }
  update(keyOrObject, modifications) {
    if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
      const key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
      if (key === void 0)
        return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
      try {
        if (typeof modifications !== "function") {
          keys(modifications).forEach((keyPath) => {
            setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
          });
        } else {
          modifications(keyOrObject, { value: keyOrObject, primKey: key });
        }
      } catch (_a) {
      }
      return this.where(":id").equals(key).modify(modifications);
    } else {
      return this.where(":id").equals(keyOrObject).modify(modifications);
    }
  }
  put(obj, key) {
    const { auto, keyPath } = this.schema.primKey;
    let objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "put", values: [objToAdd], keys: key != null ? [key] : null })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult).then((lastResult) => {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  }
  delete(key) {
    return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "delete", keys: [key] })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0);
  }
  clear() {
    return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "deleteRange", range: AnyRange })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0);
  }
  bulkGet(keys2) {
    return this._trans("readonly", (trans) => {
      return this.core.getMany({
        keys: keys2,
        trans
      }).then((result) => result.map((res) => this.hook.reading.fire(res)));
    });
  }
  bulkAdd(objects, keysOrOptions, options) {
    const keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    const wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", (trans) => {
      const { auto, keyPath } = this.schema.primKey;
      if (keyPath && keys2)
        throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      const numObjects = objects.length;
      let objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return this.core.mutate({ trans, type: "add", keys: keys2, values: objectsToAdd, wantResults }).then(({ numFailures, results, lastResult, failures }) => {
        const result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(`${this.name}.bulkAdd(): ${numFailures} of ${numObjects} operations failed`, failures);
      });
    });
  }
  bulkPut(objects, keysOrOptions, options) {
    const keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    const wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", (trans) => {
      const { auto, keyPath } = this.schema.primKey;
      if (keyPath && keys2)
        throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      const numObjects = objects.length;
      let objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return this.core.mutate({ trans, type: "put", keys: keys2, values: objectsToPut, wantResults }).then(({ numFailures, results, lastResult, failures }) => {
        const result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(`${this.name}.bulkPut(): ${numFailures} of ${numObjects} operations failed`, failures);
      });
    });
  }
  bulkDelete(keys2) {
    const numKeys = keys2.length;
    return this._trans("readwrite", (trans) => {
      return this.core.mutate({ trans, type: "delete", keys: keys2 });
    }).then(({ numFailures, lastResult, failures }) => {
      if (numFailures === 0)
        return lastResult;
      throw new BulkError(`${this.name}.bulkDelete(): ${numFailures} of ${numKeys} operations failed`, failures);
    });
  }
};
function Events(ctx) {
  var evs = {};
  var rv = function(eventName, subscriber) {
    if (subscriber) {
      var i2 = arguments.length, args = new Array(i2 - 1);
      while (--i2)
        args[i2 - 1] = arguments[i2];
      evs[eventName].subscribe.apply(null, args);
      return ctx;
    } else if (typeof eventName === "string") {
      return evs[eventName];
    }
  };
  rv.addEventType = add;
  for (var i = 1, l = arguments.length; i < l; ++i) {
    add(arguments[i]);
  }
  return rv;
  function add(eventName, chainFunction, defaultFunction) {
    if (typeof eventName === "object")
      return addConfiguredEvents(eventName);
    if (!chainFunction)
      chainFunction = reverseStoppableEventChain;
    if (!defaultFunction)
      defaultFunction = nop;
    var context = {
      subscribers: [],
      fire: defaultFunction,
      subscribe: function(cb) {
        if (context.subscribers.indexOf(cb) === -1) {
          context.subscribers.push(cb);
          context.fire = chainFunction(context.fire, cb);
        }
      },
      unsubscribe: function(cb) {
        context.subscribers = context.subscribers.filter(function(fn) {
          return fn !== cb;
        });
        context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
      }
    };
    evs[eventName] = rv[eventName] = context;
    return context;
  }
  function addConfiguredEvents(cfg) {
    keys(cfg).forEach(function(eventName) {
      var args = cfg[eventName];
      if (isArray(args)) {
        add(eventName, cfg[eventName][0], cfg[eventName][1]);
      } else if (args === "asap") {
        var context = add(eventName, mirror, function fire() {
          var i2 = arguments.length, args2 = new Array(i2);
          while (i2--)
            args2[i2] = arguments[i2];
          context.subscribers.forEach(function(fn) {
            asap$1(function fireEvent() {
              fn.apply(null, args2);
            });
          });
        });
      } else
        throw new exceptions.InvalidArgument("Invalid event config");
    });
  }
}
function makeClassConstructor(prototype, constructor) {
  derive(constructor).from({ prototype });
  return constructor;
}
function createTableConstructor(db) {
  return makeClassConstructor(Table.prototype, function Table2(name, tableSchema, trans) {
    this.db = db;
    this._tx = trans;
    this.name = name;
    this.schema = tableSchema;
    this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
      "creating": [hookCreatingChain, nop],
      "reading": [pureFunctionChain, mirror],
      "updating": [hookUpdatingChain, nop],
      "deleting": [hookDeletingChain, nop]
    });
  });
}
function isPlainKeyRange(ctx, ignoreLimitFilter) {
  return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
}
function addFilter(ctx, fn) {
  ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
  var curr = ctx.replayFilter;
  ctx.replayFilter = curr ? () => combine(curr(), factory()) : factory;
  ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
  ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
  if (ctx.isPrimKey)
    return coreSchema.primaryKey;
  const index = coreSchema.getIndexByKeyPath(ctx.index);
  if (!index)
    throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
  return index;
}
function openCursor(ctx, coreTable, trans) {
  const index = getIndexOrStore(ctx, coreTable.schema);
  return coreTable.openCursor({
    trans,
    values: !ctx.keysOnly,
    reverse: ctx.dir === "prev",
    unique: !!ctx.unique,
    query: {
      index,
      range: ctx.range
    }
  });
}
function iter(ctx, fn, coreTrans, coreTable) {
  const filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
  if (!ctx.or) {
    return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
  } else {
    const set = {};
    const union = (item, cursor, advance) => {
      if (!filter || filter(cursor, advance, (result) => cursor.stop(result), (err) => cursor.fail(err))) {
        var primaryKey = cursor.primaryKey;
        var key = "" + primaryKey;
        if (key === "[object ArrayBuffer]")
          key = "" + new Uint8Array(primaryKey);
        if (!hasOwn(set, key)) {
          set[key] = true;
          fn(item, cursor, advance);
        }
      }
    };
    return Promise.all([
      ctx.or._iterate(union, coreTrans),
      iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
    ]);
  }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
  var mappedFn = valueMapper ? (x, c, a) => fn(valueMapper(x), c, a) : fn;
  var wrappedFn = wrap(mappedFn);
  return cursorPromise.then((cursor) => {
    if (cursor) {
      return cursor.start(() => {
        var c = () => cursor.continue();
        if (!filter || filter(cursor, (advancer) => c = advancer, (val) => {
          cursor.stop(val);
          c = nop;
        }, (e) => {
          cursor.fail(e);
          c = nop;
        }))
          wrappedFn(cursor.value, cursor, (advancer) => c = advancer);
        c();
      });
    }
  });
}
function cmp(a, b) {
  try {
    const ta = type(a);
    const tb = type(b);
    if (ta !== tb) {
      if (ta === "Array")
        return 1;
      if (tb === "Array")
        return -1;
      if (ta === "binary")
        return 1;
      if (tb === "binary")
        return -1;
      if (ta === "string")
        return 1;
      if (tb === "string")
        return -1;
      if (ta === "Date")
        return 1;
      if (tb !== "Date")
        return NaN;
      return -1;
    }
    switch (ta) {
      case "number":
      case "Date":
      case "string":
        return a > b ? 1 : a < b ? -1 : 0;
      case "binary": {
        return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
      }
      case "Array":
        return compareArrays(a, b);
    }
  } catch (_a) {
  }
  return NaN;
}
function compareArrays(a, b) {
  const al = a.length;
  const bl = b.length;
  const l = al < bl ? al : bl;
  for (let i = 0; i < l; ++i) {
    const res = cmp(a[i], b[i]);
    if (res !== 0)
      return res;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function compareUint8Arrays(a, b) {
  const al = a.length;
  const bl = b.length;
  const l = al < bl ? al : bl;
  for (let i = 0; i < l; ++i) {
    if (a[i] !== b[i])
      return a[i] < b[i] ? -1 : 1;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function type(x) {
  const t = typeof x;
  if (t !== "object")
    return t;
  if (ArrayBuffer.isView(x))
    return "binary";
  const tsTag = toStringTag(x);
  return tsTag === "ArrayBuffer" ? "binary" : tsTag;
}
function getUint8Array(a) {
  if (a instanceof Uint8Array)
    return a;
  if (ArrayBuffer.isView(a))
    return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  return new Uint8Array(a);
}
var Collection = class {
  _read(fn, cb) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
  }
  _write(fn) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
  }
  _addAlgorithm(fn) {
    var ctx = this._ctx;
    ctx.algorithm = combine(ctx.algorithm, fn);
  }
  _iterate(fn, coreTrans) {
    return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
  }
  clone(props2) {
    var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
    if (props2)
      extend(ctx, props2);
    rv._ctx = ctx;
    return rv;
  }
  raw() {
    this._ctx.valueMapper = null;
    return this;
  }
  each(fn) {
    var ctx = this._ctx;
    return this._read((trans) => iter(ctx, fn, trans, ctx.table.core));
  }
  count(cb) {
    return this._read((trans) => {
      const ctx = this._ctx;
      const coreTable = ctx.table.core;
      if (isPlainKeyRange(ctx, true)) {
        return coreTable.count({
          trans,
          query: {
            index: getIndexOrStore(ctx, coreTable.schema),
            range: ctx.range
          }
        }).then((count2) => Math.min(count2, ctx.limit));
      } else {
        var count = 0;
        return iter(ctx, () => {
          ++count;
          return false;
        }, trans, coreTable).then(() => count);
      }
    }).then(cb);
  }
  sortBy(keyPath, cb) {
    const parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
    function getval(obj, i) {
      if (i)
        return getval(obj[parts[i]], i - 1);
      return obj[lastPart];
    }
    var order = this._ctx.dir === "next" ? 1 : -1;
    function sorter(a, b) {
      var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
      return aVal < bVal ? -order : aVal > bVal ? order : 0;
    }
    return this.toArray(function(a) {
      return a.sort(sorter);
    }).then(cb);
  }
  toArray(cb) {
    return this._read((trans) => {
      var ctx = this._ctx;
      if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
        const { valueMapper } = ctx;
        const index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          limit: ctx.limit,
          values: true,
          query: {
            index,
            range: ctx.range
          }
        }).then(({ result }) => valueMapper ? result.map(valueMapper) : result);
      } else {
        const a = [];
        return iter(ctx, (item) => a.push(item), trans, ctx.table.core).then(() => a);
      }
    }, cb);
  }
  offset(offset) {
    var ctx = this._ctx;
    if (offset <= 0)
      return this;
    ctx.offset += offset;
    if (isPlainKeyRange(ctx)) {
      addReplayFilter(ctx, () => {
        var offsetLeft = offset;
        return (cursor, advance) => {
          if (offsetLeft === 0)
            return true;
          if (offsetLeft === 1) {
            --offsetLeft;
            return false;
          }
          advance(() => {
            cursor.advance(offsetLeft);
            offsetLeft = 0;
          });
          return false;
        };
      });
    } else {
      addReplayFilter(ctx, () => {
        var offsetLeft = offset;
        return () => --offsetLeft < 0;
      });
    }
    return this;
  }
  limit(numRows) {
    this._ctx.limit = Math.min(this._ctx.limit, numRows);
    addReplayFilter(this._ctx, () => {
      var rowsLeft = numRows;
      return function(cursor, advance, resolve) {
        if (--rowsLeft <= 0)
          advance(resolve);
        return rowsLeft >= 0;
      };
    }, true);
    return this;
  }
  until(filterFunction, bIncludeStopEntry) {
    addFilter(this._ctx, function(cursor, advance, resolve) {
      if (filterFunction(cursor.value)) {
        advance(resolve);
        return bIncludeStopEntry;
      } else {
        return true;
      }
    });
    return this;
  }
  first(cb) {
    return this.limit(1).toArray(function(a) {
      return a[0];
    }).then(cb);
  }
  last(cb) {
    return this.reverse().first(cb);
  }
  filter(filterFunction) {
    addFilter(this._ctx, function(cursor) {
      return filterFunction(cursor.value);
    });
    addMatchFilter(this._ctx, filterFunction);
    return this;
  }
  and(filter) {
    return this.filter(filter);
  }
  or(indexName) {
    return new this.db.WhereClause(this._ctx.table, indexName, this);
  }
  reverse() {
    this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
    if (this._ondirectionchange)
      this._ondirectionchange(this._ctx.dir);
    return this;
  }
  desc() {
    return this.reverse();
  }
  eachKey(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.key, cursor);
    });
  }
  eachUniqueKey(cb) {
    this._ctx.unique = "unique";
    return this.eachKey(cb);
  }
  eachPrimaryKey(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.primaryKey, cursor);
    });
  }
  keys(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.key);
    }).then(function() {
      return a;
    }).then(cb);
  }
  primaryKeys(cb) {
    var ctx = this._ctx;
    if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
      return this._read((trans) => {
        var index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          values: false,
          limit: ctx.limit,
          query: {
            index,
            range: ctx.range
          }
        });
      }).then(({ result }) => result).then(cb);
    }
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.primaryKey);
    }).then(function() {
      return a;
    }).then(cb);
  }
  uniqueKeys(cb) {
    this._ctx.unique = "unique";
    return this.keys(cb);
  }
  firstKey(cb) {
    return this.limit(1).keys(function(a) {
      return a[0];
    }).then(cb);
  }
  lastKey(cb) {
    return this.reverse().firstKey(cb);
  }
  distinct() {
    var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
    if (!idx || !idx.multi)
      return this;
    var set = {};
    addFilter(this._ctx, function(cursor) {
      var strKey = cursor.primaryKey.toString();
      var found = hasOwn(set, strKey);
      set[strKey] = true;
      return !found;
    });
    return this;
  }
  modify(changes) {
    var ctx = this._ctx;
    return this._write((trans) => {
      var modifyer;
      if (typeof changes === "function") {
        modifyer = changes;
      } else {
        var keyPaths = keys(changes);
        var numKeys = keyPaths.length;
        modifyer = function(item) {
          var anythingModified = false;
          for (var i = 0; i < numKeys; ++i) {
            var keyPath = keyPaths[i], val = changes[keyPath];
            if (getByKeyPath(item, keyPath) !== val) {
              setByKeyPath(item, keyPath, val);
              anythingModified = true;
            }
          }
          return anythingModified;
        };
      }
      const coreTable = ctx.table.core;
      const { outbound, extractKey } = coreTable.schema.primaryKey;
      const limit = this.db._options.modifyChunkSize || 200;
      const totalFailures = [];
      let successCount = 0;
      const failedKeys = [];
      const applyMutateResult = (expectedCount, res) => {
        const { failures, numFailures } = res;
        successCount += expectedCount - numFailures;
        for (let pos of keys(failures)) {
          totalFailures.push(failures[pos]);
        }
      };
      return this.clone().primaryKeys().then((keys2) => {
        const nextChunk = (offset) => {
          const count = Math.min(limit, keys2.length - offset);
          return coreTable.getMany({
            trans,
            keys: keys2.slice(offset, offset + count),
            cache: "immutable"
          }).then((values) => {
            const addValues = [];
            const putValues = [];
            const putKeys = outbound ? [] : null;
            const deleteKeys = [];
            for (let i = 0; i < count; ++i) {
              const origValue = values[i];
              const ctx2 = {
                value: deepClone(origValue),
                primKey: keys2[offset + i]
              };
              if (modifyer.call(ctx2, ctx2.value, ctx2) !== false) {
                if (ctx2.value == null) {
                  deleteKeys.push(keys2[offset + i]);
                } else if (!outbound && cmp(extractKey(origValue), extractKey(ctx2.value)) !== 0) {
                  deleteKeys.push(keys2[offset + i]);
                  addValues.push(ctx2.value);
                } else {
                  putValues.push(ctx2.value);
                  if (outbound)
                    putKeys.push(keys2[offset + i]);
                }
              }
            }
            const criteria = isPlainKeyRange(ctx) && ctx.limit === Infinity && (typeof changes !== "function" || changes === deleteCallback) && {
              index: ctx.index,
              range: ctx.range
            };
            return Promise.resolve(addValues.length > 0 && coreTable.mutate({ trans, type: "add", values: addValues }).then((res) => {
              for (let pos in res.failures) {
                deleteKeys.splice(parseInt(pos), 1);
              }
              applyMutateResult(addValues.length, res);
            })).then(() => (putValues.length > 0 || criteria && typeof changes === "object") && coreTable.mutate({
              trans,
              type: "put",
              keys: putKeys,
              values: putValues,
              criteria,
              changeSpec: typeof changes !== "function" && changes
            }).then((res) => applyMutateResult(putValues.length, res))).then(() => (deleteKeys.length > 0 || criteria && changes === deleteCallback) && coreTable.mutate({
              trans,
              type: "delete",
              keys: deleteKeys,
              criteria
            }).then((res) => applyMutateResult(deleteKeys.length, res))).then(() => {
              return keys2.length > offset + count && nextChunk(offset + limit);
            });
          });
        };
        return nextChunk(0).then(() => {
          if (totalFailures.length > 0)
            throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
          return keys2.length;
        });
      });
    });
  }
  delete() {
    var ctx = this._ctx, range = ctx.range;
    if (isPlainKeyRange(ctx) && (ctx.isPrimKey && !hangsOnDeleteLargeKeyRange || range.type === 3)) {
      return this._write((trans) => {
        const { primaryKey } = ctx.table.core.schema;
        const coreRange = range;
        return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then((count) => {
          return ctx.table.core.mutate({ trans, type: "deleteRange", range: coreRange }).then(({ failures, lastResult, results, numFailures }) => {
            if (numFailures)
              throw new ModifyError("Could not delete some values", Object.keys(failures).map((pos) => failures[pos]), count - numFailures);
            return count - numFailures;
          });
        });
      });
    }
    return this.modify(deleteCallback);
  }
};
var deleteCallback = (value, ctx) => ctx.value = null;
function createCollectionConstructor(db) {
  return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
    this.db = db;
    let keyRange = AnyRange, error = null;
    if (keyRangeGenerator)
      try {
        keyRange = keyRangeGenerator();
      } catch (ex) {
        error = ex;
      }
    const whereCtx = whereClause._ctx;
    const table = whereCtx.table;
    const readingHook = table.hook.reading.fire;
    this._ctx = {
      table,
      index: whereCtx.index,
      isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
      range: keyRange,
      keysOnly: false,
      dir: "next",
      unique: "",
      algorithm: null,
      filter: null,
      replayFilter: null,
      justLimit: true,
      isMatch: null,
      offset: 0,
      limit: Infinity,
      error,
      or: whereCtx.or,
      valueMapper: readingHook !== mirror ? readingHook : null
    };
  });
}
function simpleCompare(a, b) {
  return a < b ? -1 : a === b ? 0 : 1;
}
function simpleCompareReverse(a, b) {
  return a > b ? -1 : a === b ? 0 : 1;
}
function fail(collectionOrWhereClause, err, T) {
  var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
  collection._ctx.error = T ? new T(err) : new TypeError(err);
  return collection;
}
function emptyCollection(whereClause) {
  return new whereClause.Collection(whereClause, () => rangeEqual("")).limit(0);
}
function upperFactory(dir) {
  return dir === "next" ? (s) => s.toUpperCase() : (s) => s.toLowerCase();
}
function lowerFactory(dir) {
  return dir === "next" ? (s) => s.toLowerCase() : (s) => s.toUpperCase();
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp2, dir) {
  var length = Math.min(key.length, lowerNeedle.length);
  var llp = -1;
  for (var i = 0; i < length; ++i) {
    var lwrKeyChar = lowerKey[i];
    if (lwrKeyChar !== lowerNeedle[i]) {
      if (cmp2(key[i], upperNeedle[i]) < 0)
        return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
      if (cmp2(key[i], lowerNeedle[i]) < 0)
        return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
      if (llp >= 0)
        return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
      return null;
    }
    if (cmp2(key[i], lwrKeyChar) < 0)
      llp = i;
  }
  if (length < lowerNeedle.length && dir === "next")
    return key + upperNeedle.substr(key.length);
  if (length < key.length && dir === "prev")
    return key.substr(0, upperNeedle.length);
  return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
  var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
  if (!needles.every((s) => typeof s === "string")) {
    return fail(whereClause, STRING_EXPECTED);
  }
  function initDirection(dir) {
    upper = upperFactory(dir);
    lower = lowerFactory(dir);
    compare = dir === "next" ? simpleCompare : simpleCompareReverse;
    var needleBounds = needles.map(function(needle) {
      return { lower: lower(needle), upper: upper(needle) };
    }).sort(function(a, b) {
      return compare(a.lower, b.lower);
    });
    upperNeedles = needleBounds.map(function(nb) {
      return nb.upper;
    });
    lowerNeedles = needleBounds.map(function(nb) {
      return nb.lower;
    });
    direction = dir;
    nextKeySuffix = dir === "next" ? "" : suffix;
  }
  initDirection("next");
  var c = new whereClause.Collection(whereClause, () => createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix));
  c._ondirectionchange = function(direction2) {
    initDirection(direction2);
  };
  var firstPossibleNeedle = 0;
  c._addAlgorithm(function(cursor, advance, resolve) {
    var key = cursor.key;
    if (typeof key !== "string")
      return false;
    var lowerKey = lower(key);
    if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
      return true;
    } else {
      var lowestPossibleCasing = null;
      for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
        var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
        if (casing === null && lowestPossibleCasing === null)
          firstPossibleNeedle = i + 1;
        else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
          lowestPossibleCasing = casing;
        }
      }
      if (lowestPossibleCasing !== null) {
        advance(function() {
          cursor.continue(lowestPossibleCasing + nextKeySuffix);
        });
      } else {
        advance(resolve);
      }
      return false;
    }
  });
  return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
  return {
    type: 2,
    lower,
    upper,
    lowerOpen,
    upperOpen
  };
}
function rangeEqual(value) {
  return {
    type: 1,
    lower: value,
    upper: value
  };
}
var WhereClause = class {
  get Collection() {
    return this._ctx.table.db.Collection;
  }
  between(lower, upper, includeLower, includeUpper) {
    includeLower = includeLower !== false;
    includeUpper = includeUpper === true;
    try {
      if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
        return emptyCollection(this);
      return new this.Collection(this, () => createRange(lower, upper, !includeLower, !includeUpper));
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
  }
  equals(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => rangeEqual(value));
  }
  above(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(value, void 0, true));
  }
  aboveOrEqual(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(value, void 0, false));
  }
  below(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(void 0, value, false, true));
  }
  belowOrEqual(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(void 0, value));
  }
  startsWith(str) {
    if (typeof str !== "string")
      return fail(this, STRING_EXPECTED);
    return this.between(str, str + maxString, true, true);
  }
  startsWithIgnoreCase(str) {
    if (str === "")
      return this.startsWith(str);
    return addIgnoreCaseAlgorithm(this, (x, a) => x.indexOf(a[0]) === 0, [str], maxString);
  }
  equalsIgnoreCase(str) {
    return addIgnoreCaseAlgorithm(this, (x, a) => x === a[0], [str], "");
  }
  anyOfIgnoreCase() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, (x, a) => a.indexOf(x) !== -1, set, "");
  }
  startsWithAnyOfIgnoreCase() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, (x, a) => a.some((n) => x.indexOf(n) === 0), set, maxString);
  }
  anyOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    let compare = this._cmp;
    try {
      set.sort(compare);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    if (set.length === 0)
      return emptyCollection(this);
    const c = new this.Collection(this, () => createRange(set[0], set[set.length - 1]));
    c._ondirectionchange = (direction) => {
      compare = direction === "next" ? this._ascending : this._descending;
      set.sort(compare);
    };
    let i = 0;
    c._addAlgorithm((cursor, advance, resolve) => {
      const key = cursor.key;
      while (compare(key, set[i]) > 0) {
        ++i;
        if (i === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (compare(key, set[i]) === 0) {
        return true;
      } else {
        advance(() => {
          cursor.continue(set[i]);
        });
        return false;
      }
    });
    return c;
  }
  notEqual(value) {
    return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
  }
  noneOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return new this.Collection(this);
    try {
      set.sort(this._ascending);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    const ranges = set.reduce((res, val) => res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]], null);
    ranges.push([set[set.length - 1], this.db._maxKey]);
    return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
  }
  inAnyRange(ranges, options) {
    const cmp2 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
    if (ranges.length === 0)
      return emptyCollection(this);
    if (!ranges.every((range) => range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0)) {
      return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
    }
    const includeLowers = !options || options.includeLowers !== false;
    const includeUppers = options && options.includeUppers === true;
    function addRange2(ranges2, newRange) {
      let i = 0, l = ranges2.length;
      for (; i < l; ++i) {
        const range = ranges2[i];
        if (cmp2(newRange[0], range[1]) < 0 && cmp2(newRange[1], range[0]) > 0) {
          range[0] = min(range[0], newRange[0]);
          range[1] = max(range[1], newRange[1]);
          break;
        }
      }
      if (i === l)
        ranges2.push(newRange);
      return ranges2;
    }
    let sortDirection = ascending;
    function rangeSorter(a, b) {
      return sortDirection(a[0], b[0]);
    }
    let set;
    try {
      set = ranges.reduce(addRange2, []);
      set.sort(rangeSorter);
    } catch (ex) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    let rangePos = 0;
    const keyIsBeyondCurrentEntry = includeUppers ? (key) => ascending(key, set[rangePos][1]) > 0 : (key) => ascending(key, set[rangePos][1]) >= 0;
    const keyIsBeforeCurrentEntry = includeLowers ? (key) => descending(key, set[rangePos][0]) > 0 : (key) => descending(key, set[rangePos][0]) >= 0;
    function keyWithinCurrentRange(key) {
      return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
    }
    let checkKey = keyIsBeyondCurrentEntry;
    const c = new this.Collection(this, () => createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers));
    c._ondirectionchange = (direction) => {
      if (direction === "next") {
        checkKey = keyIsBeyondCurrentEntry;
        sortDirection = ascending;
      } else {
        checkKey = keyIsBeforeCurrentEntry;
        sortDirection = descending;
      }
      set.sort(rangeSorter);
    };
    c._addAlgorithm((cursor, advance, resolve) => {
      var key = cursor.key;
      while (checkKey(key)) {
        ++rangePos;
        if (rangePos === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (keyWithinCurrentRange(key)) {
        return true;
      } else if (this._cmp(key, set[rangePos][1]) === 0 || this._cmp(key, set[rangePos][0]) === 0) {
        return false;
      } else {
        advance(() => {
          if (sortDirection === ascending)
            cursor.continue(set[rangePos][0]);
          else
            cursor.continue(set[rangePos][1]);
        });
        return false;
      }
    });
    return c;
  }
  startsWithAnyOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (!set.every((s) => typeof s === "string")) {
      return fail(this, "startsWithAnyOf() only works with strings");
    }
    if (set.length === 0)
      return emptyCollection(this);
    return this.inAnyRange(set.map((str) => [str, str + maxString]));
  }
};
function createWhereClauseConstructor(db) {
  return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
    this.db = db;
    this._ctx = {
      table,
      index: index === ":id" ? null : index,
      or: orCollection
    };
    const indexedDB2 = db._deps.indexedDB;
    if (!indexedDB2)
      throw new exceptions.MissingAPI();
    this._cmp = this._ascending = indexedDB2.cmp.bind(indexedDB2);
    this._descending = (a, b) => indexedDB2.cmp(b, a);
    this._max = (a, b) => indexedDB2.cmp(a, b) > 0 ? a : b;
    this._min = (a, b) => indexedDB2.cmp(a, b) < 0 ? a : b;
    this._IDBKeyRange = db._deps.IDBKeyRange;
  });
}
function eventRejectHandler(reject) {
  return wrap(function(event) {
    preventDefault(event);
    reject(event.target.error);
    return false;
  });
}
function preventDefault(event) {
  if (event.stopPropagation)
    event.stopPropagation();
  if (event.preventDefault)
    event.preventDefault();
}
var DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated";
var STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1";
var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);
var Transaction = class {
  _lock() {
    assert(!PSD.global);
    ++this._reculock;
    if (this._reculock === 1 && !PSD.global)
      PSD.lockOwnerFor = this;
    return this;
  }
  _unlock() {
    assert(!PSD.global);
    if (--this._reculock === 0) {
      if (!PSD.global)
        PSD.lockOwnerFor = null;
      while (this._blockedFuncs.length > 0 && !this._locked()) {
        var fnAndPSD = this._blockedFuncs.shift();
        try {
          usePSD(fnAndPSD[1], fnAndPSD[0]);
        } catch (e) {
        }
      }
    }
    return this;
  }
  _locked() {
    return this._reculock && PSD.lockOwnerFor !== this;
  }
  create(idbtrans) {
    if (!this.mode)
      return this;
    const idbdb = this.db.idbdb;
    const dbOpenError = this.db._state.dbOpenError;
    assert(!this.idbtrans);
    if (!idbtrans && !idbdb) {
      switch (dbOpenError && dbOpenError.name) {
        case "DatabaseClosedError":
          throw new exceptions.DatabaseClosed(dbOpenError);
        case "MissingAPIError":
          throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
        default:
          throw new exceptions.OpenFailed(dbOpenError);
      }
    }
    if (!this.active)
      throw new exceptions.TransactionInactive();
    assert(this._completion._state === null);
    idbtrans = this.idbtrans = idbtrans || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
    idbtrans.onerror = wrap((ev) => {
      preventDefault(ev);
      this._reject(idbtrans.error);
    });
    idbtrans.onabort = wrap((ev) => {
      preventDefault(ev);
      this.active && this._reject(new exceptions.Abort(idbtrans.error));
      this.active = false;
      this.on("abort").fire(ev);
    });
    idbtrans.oncomplete = wrap(() => {
      this.active = false;
      this._resolve();
      if ("mutatedParts" in idbtrans) {
        globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
      }
    });
    return this;
  }
  _promise(mode, fn, bWriteLock) {
    if (mode === "readwrite" && this.mode !== "readwrite")
      return rejection(new exceptions.ReadOnly("Transaction is readonly"));
    if (!this.active)
      return rejection(new exceptions.TransactionInactive());
    if (this._locked()) {
      return new DexiePromise((resolve, reject) => {
        this._blockedFuncs.push([() => {
          this._promise(mode, fn, bWriteLock).then(resolve, reject);
        }, PSD]);
      });
    } else if (bWriteLock) {
      return newScope(() => {
        var p2 = new DexiePromise((resolve, reject) => {
          this._lock();
          const rv = fn(resolve, reject, this);
          if (rv && rv.then)
            rv.then(resolve, reject);
        });
        p2.finally(() => this._unlock());
        p2._lib = true;
        return p2;
      });
    } else {
      var p = new DexiePromise((resolve, reject) => {
        var rv = fn(resolve, reject, this);
        if (rv && rv.then)
          rv.then(resolve, reject);
      });
      p._lib = true;
      return p;
    }
  }
  _root() {
    return this.parent ? this.parent._root() : this;
  }
  waitFor(promiseLike) {
    var root = this._root();
    const promise = DexiePromise.resolve(promiseLike);
    if (root._waitingFor) {
      root._waitingFor = root._waitingFor.then(() => promise);
    } else {
      root._waitingFor = promise;
      root._waitingQueue = [];
      var store = root.idbtrans.objectStore(root.storeNames[0]);
      (function spin() {
        ++root._spinCount;
        while (root._waitingQueue.length)
          root._waitingQueue.shift()();
        if (root._waitingFor)
          store.get(-Infinity).onsuccess = spin;
      })();
    }
    var currentWaitPromise = root._waitingFor;
    return new DexiePromise((resolve, reject) => {
      promise.then((res) => root._waitingQueue.push(wrap(resolve.bind(null, res))), (err) => root._waitingQueue.push(wrap(reject.bind(null, err)))).finally(() => {
        if (root._waitingFor === currentWaitPromise) {
          root._waitingFor = null;
        }
      });
    });
  }
  abort() {
    if (this.active) {
      this.active = false;
      if (this.idbtrans)
        this.idbtrans.abort();
      this._reject(new exceptions.Abort());
    }
  }
  table(tableName) {
    const memoizedTables = this._memoizedTables || (this._memoizedTables = {});
    if (hasOwn(memoizedTables, tableName))
      return memoizedTables[tableName];
    const tableSchema = this.schema[tableName];
    if (!tableSchema) {
      throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
    }
    const transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
    transactionBoundTable.core = this.db.core.table(tableName);
    memoizedTables[tableName] = transactionBoundTable;
    return transactionBoundTable;
  }
};
function createTransactionConstructor(db) {
  return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
    this.db = db;
    this.mode = mode;
    this.storeNames = storeNames;
    this.schema = dbschema;
    this.chromeTransactionDurability = chromeTransactionDurability;
    this.idbtrans = null;
    this.on = Events(this, "complete", "error", "abort");
    this.parent = parent || null;
    this.active = true;
    this._reculock = 0;
    this._blockedFuncs = [];
    this._resolve = null;
    this._reject = null;
    this._waitingFor = null;
    this._waitingQueue = null;
    this._spinCount = 0;
    this._completion = new DexiePromise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    this._completion.then(() => {
      this.active = false;
      this.on.complete.fire();
    }, (e) => {
      var wasActive = this.active;
      this.active = false;
      this.on.error.fire(e);
      this.parent ? this.parent._reject(e) : wasActive && this.idbtrans && this.idbtrans.abort();
      return rejection(e);
    });
  });
}
function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
  return {
    name,
    keyPath,
    unique,
    multi,
    auto,
    compound,
    src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath)
  };
}
function nameFromKeyPath(keyPath) {
  return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
}
function createTableSchema(name, primKey, indexes) {
  return {
    name,
    primKey,
    indexes,
    mappedClass: null,
    idxByName: arrayToObject(indexes, (index) => [index.name, index])
  };
}
function safariMultiStoreFix(storeNames) {
  return storeNames.length === 1 ? storeNames[0] : storeNames;
}
var getMaxKey = (IdbKeyRange) => {
  try {
    IdbKeyRange.only([[]]);
    getMaxKey = () => [[]];
    return [[]];
  } catch (e) {
    getMaxKey = () => maxString;
    return maxString;
  }
};
function getKeyExtractor(keyPath) {
  if (keyPath == null) {
    return () => void 0;
  } else if (typeof keyPath === "string") {
    return getSinglePathKeyExtractor(keyPath);
  } else {
    return (obj) => getByKeyPath(obj, keyPath);
  }
}
function getSinglePathKeyExtractor(keyPath) {
  const split = keyPath.split(".");
  if (split.length === 1) {
    return (obj) => obj[keyPath];
  } else {
    return (obj) => getByKeyPath(obj, keyPath);
  }
}
function arrayify(arrayLike) {
  return [].slice.call(arrayLike);
}
var _id_counter = 0;
function getKeyPathAlias(keyPath) {
  return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : `[${keyPath.join("+")}]`;
}
function createDBCore(db, IdbKeyRange, tmpTrans) {
  function extractSchema(db2, trans) {
    const tables2 = arrayify(db2.objectStoreNames);
    return {
      schema: {
        name: db2.name,
        tables: tables2.map((table) => trans.objectStore(table)).map((store) => {
          const { keyPath, autoIncrement } = store;
          const compound = isArray(keyPath);
          const outbound = keyPath == null;
          const indexByKeyPath = {};
          const result = {
            name: store.name,
            primaryKey: {
              name: null,
              isPrimaryKey: true,
              outbound,
              compound,
              keyPath,
              autoIncrement,
              unique: true,
              extractKey: getKeyExtractor(keyPath)
            },
            indexes: arrayify(store.indexNames).map((indexName) => store.index(indexName)).map((index) => {
              const { name, unique, multiEntry, keyPath: keyPath2 } = index;
              const compound2 = isArray(keyPath2);
              const result2 = {
                name,
                compound: compound2,
                keyPath: keyPath2,
                unique,
                multiEntry,
                extractKey: getKeyExtractor(keyPath2)
              };
              indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
              return result2;
            }),
            getIndexByKeyPath: (keyPath2) => indexByKeyPath[getKeyPathAlias(keyPath2)]
          };
          indexByKeyPath[":id"] = result.primaryKey;
          if (keyPath != null) {
            indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
          }
          return result;
        })
      },
      hasGetAll: tables2.length > 0 && "getAll" in trans.objectStore(tables2[0]) && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
    };
  }
  function makeIDBKeyRange(range) {
    if (range.type === 3)
      return null;
    if (range.type === 4)
      throw new Error("Cannot convert never type to IDBKeyRange");
    const { lower, upper, lowerOpen, upperOpen } = range;
    const idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
    return idbRange;
  }
  function createDbCoreTable(tableSchema) {
    const tableName = tableSchema.name;
    function mutate({ trans, type: type2, keys: keys2, values, range }) {
      return new Promise((resolve, reject) => {
        resolve = wrap(resolve);
        const store = trans.objectStore(tableName);
        const outbound = store.keyPath == null;
        const isAddOrPut = type2 === "put" || type2 === "add";
        if (!isAddOrPut && type2 !== "delete" && type2 !== "deleteRange")
          throw new Error("Invalid operation type: " + type2);
        const { length } = keys2 || values || { length: 1 };
        if (keys2 && values && keys2.length !== values.length) {
          throw new Error("Given keys array must have same length as given values array.");
        }
        if (length === 0)
          return resolve({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
        let req;
        const reqs = [];
        const failures = [];
        let numFailures = 0;
        const errorHandler = (event) => {
          ++numFailures;
          preventDefault(event);
        };
        if (type2 === "deleteRange") {
          if (range.type === 4)
            return resolve({ numFailures, failures, results: [], lastResult: void 0 });
          if (range.type === 3)
            reqs.push(req = store.clear());
          else
            reqs.push(req = store.delete(makeIDBKeyRange(range)));
        } else {
          const [args1, args2] = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null];
          if (isAddOrPut) {
            for (let i = 0; i < length; ++i) {
              reqs.push(req = args2 && args2[i] !== void 0 ? store[type2](args1[i], args2[i]) : store[type2](args1[i]));
              req.onerror = errorHandler;
            }
          } else {
            for (let i = 0; i < length; ++i) {
              reqs.push(req = store[type2](args1[i]));
              req.onerror = errorHandler;
            }
          }
        }
        const done = (event) => {
          const lastResult = event.target.result;
          reqs.forEach((req2, i) => req2.error != null && (failures[i] = req2.error));
          resolve({
            numFailures,
            failures,
            results: type2 === "delete" ? keys2 : reqs.map((req2) => req2.result),
            lastResult
          });
        };
        req.onerror = (event) => {
          errorHandler(event);
          done(event);
        };
        req.onsuccess = done;
      });
    }
    function openCursor2({ trans, values, query: query2, reverse, unique }) {
      return new Promise((resolve, reject) => {
        resolve = wrap(resolve);
        const { index, range } = query2;
        const store = trans.objectStore(tableName);
        const source = index.isPrimaryKey ? store : store.index(index.name);
        const direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
        const req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
        req.onerror = eventRejectHandler(reject);
        req.onsuccess = wrap((ev) => {
          const cursor = req.result;
          if (!cursor) {
            resolve(null);
            return;
          }
          cursor.___id = ++_id_counter;
          cursor.done = false;
          const _cursorContinue = cursor.continue.bind(cursor);
          let _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
          if (_cursorContinuePrimaryKey)
            _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
          const _cursorAdvance = cursor.advance.bind(cursor);
          const doThrowCursorIsNotStarted = () => {
            throw new Error("Cursor not started");
          };
          const doThrowCursorIsStopped = () => {
            throw new Error("Cursor not stopped");
          };
          cursor.trans = trans;
          cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
          cursor.fail = wrap(reject);
          cursor.next = function() {
            let gotOne = 1;
            return this.start(() => gotOne-- ? this.continue() : this.stop()).then(() => this);
          };
          cursor.start = (callback) => {
            const iterationPromise = new Promise((resolveIteration, rejectIteration) => {
              resolveIteration = wrap(resolveIteration);
              req.onerror = eventRejectHandler(rejectIteration);
              cursor.fail = rejectIteration;
              cursor.stop = (value) => {
                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                resolveIteration(value);
              };
            });
            const guardedCallback = () => {
              if (req.result) {
                try {
                  callback();
                } catch (err) {
                  cursor.fail(err);
                }
              } else {
                cursor.done = true;
                cursor.start = () => {
                  throw new Error("Cursor behind last entry");
                };
                cursor.stop();
              }
            };
            req.onsuccess = wrap((ev2) => {
              req.onsuccess = guardedCallback;
              guardedCallback();
            });
            cursor.continue = _cursorContinue;
            cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
            cursor.advance = _cursorAdvance;
            guardedCallback();
            return iterationPromise;
          };
          resolve(cursor);
        }, reject);
      });
    }
    function query(hasGetAll2) {
      return (request) => {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const { trans, values, limit, query: query2 } = request;
          const nonInfinitLimit = limit === Infinity ? void 0 : limit;
          const { index, range } = query2;
          const store = trans.objectStore(tableName);
          const source = index.isPrimaryKey ? store : store.index(index.name);
          const idbKeyRange = makeIDBKeyRange(range);
          if (limit === 0)
            return resolve({ result: [] });
          if (hasGetAll2) {
            const req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
            req.onsuccess = (event) => resolve({ result: event.target.result });
            req.onerror = eventRejectHandler(reject);
          } else {
            let count = 0;
            const req = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange) : source.openKeyCursor(idbKeyRange);
            const result = [];
            req.onsuccess = (event) => {
              const cursor = req.result;
              if (!cursor)
                return resolve({ result });
              result.push(values ? cursor.value : cursor.primaryKey);
              if (++count === limit)
                return resolve({ result });
              cursor.continue();
            };
            req.onerror = eventRejectHandler(reject);
          }
        });
      };
    }
    return {
      name: tableName,
      schema: tableSchema,
      mutate,
      getMany({ trans, keys: keys2 }) {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const store = trans.objectStore(tableName);
          const length = keys2.length;
          const result = new Array(length);
          let keyCount = 0;
          let callbackCount = 0;
          let req;
          const successHandler = (event) => {
            const req2 = event.target;
            if ((result[req2._pos] = req2.result) != null)
              ;
            if (++callbackCount === keyCount)
              resolve(result);
          };
          const errorHandler = eventRejectHandler(reject);
          for (let i = 0; i < length; ++i) {
            const key = keys2[i];
            if (key != null) {
              req = store.get(keys2[i]);
              req._pos = i;
              req.onsuccess = successHandler;
              req.onerror = errorHandler;
              ++keyCount;
            }
          }
          if (keyCount === 0)
            resolve(result);
        });
      },
      get({ trans, key }) {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const store = trans.objectStore(tableName);
          const req = store.get(key);
          req.onsuccess = (event) => resolve(event.target.result);
          req.onerror = eventRejectHandler(reject);
        });
      },
      query: query(hasGetAll),
      openCursor: openCursor2,
      count({ query: query2, trans }) {
        const { index, range } = query2;
        return new Promise((resolve, reject) => {
          const store = trans.objectStore(tableName);
          const source = index.isPrimaryKey ? store : store.index(index.name);
          const idbKeyRange = makeIDBKeyRange(range);
          const req = idbKeyRange ? source.count(idbKeyRange) : source.count();
          req.onsuccess = wrap((ev) => resolve(ev.target.result));
          req.onerror = eventRejectHandler(reject);
        });
      }
    };
  }
  const { schema, hasGetAll } = extractSchema(db, tmpTrans);
  const tables = schema.tables.map((tableSchema) => createDbCoreTable(tableSchema));
  const tableMap = {};
  tables.forEach((table) => tableMap[table.name] = table);
  return {
    stack: "dbcore",
    transaction: db.transaction.bind(db),
    table(name) {
      const result = tableMap[name];
      if (!result)
        throw new Error(`Table '${name}' not found`);
      return tableMap[name];
    },
    MIN_KEY: -Infinity,
    MAX_KEY: getMaxKey(IdbKeyRange),
    schema
  };
}
function createMiddlewareStack(stackImpl, middlewares) {
  return middlewares.reduce((down, { create }) => ({ ...down, ...create(down) }), stackImpl);
}
function createMiddlewareStacks(middlewares, idbdb, { IDBKeyRange, indexedDB: indexedDB2 }, tmpTrans) {
  const dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
  return {
    dbcore
  };
}
function generateMiddlewareStacks({ _novip: db }, tmpTrans) {
  const idbdb = tmpTrans.db;
  const stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
  db.core = stacks.dbcore;
  db.tables.forEach((table) => {
    const tableName = table.name;
    if (db.core.schema.tables.some((tbl) => tbl.name === tableName)) {
      table.core = db.core.table(tableName);
      if (db[tableName] instanceof db.Table) {
        db[tableName].core = table.core;
      }
    }
  });
}
function setApiOnPlace({ _novip: db }, objs, tableNames, dbschema) {
  tableNames.forEach((tableName) => {
    const schema = dbschema[tableName];
    objs.forEach((obj) => {
      const propDesc = getPropertyDescriptor(obj, tableName);
      if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
        if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
          setProp(obj, tableName, {
            get() {
              return this.table(tableName);
            },
            set(value) {
              defineProperty(this, tableName, { value, writable: true, configurable: true, enumerable: true });
            }
          });
        } else {
          obj[tableName] = new db.Table(tableName, schema);
        }
      }
    });
  });
}
function removeTablesApi({ _novip: db }, objs) {
  objs.forEach((obj) => {
    for (let key in obj) {
      if (obj[key] instanceof db.Table)
        delete obj[key];
    }
  });
}
function lowerVersionFirst(a, b) {
  return a._cfg.version - b._cfg.version;
}
function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
  const globalSchema = db._dbSchema;
  const trans = db._createTransaction("readwrite", db._storeNames, globalSchema);
  trans.create(idbUpgradeTrans);
  trans._completion.catch(reject);
  const rejectTransaction = trans._reject.bind(trans);
  const transless = PSD.transless || PSD;
  newScope(() => {
    PSD.trans = trans;
    PSD.transless = transless;
    if (oldVersion === 0) {
      keys(globalSchema).forEach((tableName) => {
        createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
      });
      generateMiddlewareStacks(db, idbUpgradeTrans);
      DexiePromise.follow(() => db.on.populate.fire(trans)).catch(rejectTransaction);
    } else
      updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
  });
}
function updateTablesAndIndexes({ _novip: db }, oldVersion, trans, idbUpgradeTrans) {
  const queue = [];
  const versions = db._versions;
  let globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
  let anyContentUpgraderHasRun = false;
  const versToRun = versions.filter((v) => v._cfg.version >= oldVersion);
  versToRun.forEach((version) => {
    queue.push(() => {
      const oldSchema = globalSchema;
      const newSchema = version._cfg.dbschema;
      adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
      adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
      globalSchema = db._dbSchema = newSchema;
      const diff = getSchemaDiff(oldSchema, newSchema);
      diff.add.forEach((tuple) => {
        createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
      });
      diff.change.forEach((change) => {
        if (change.recreate) {
          throw new exceptions.Upgrade("Not yet support for changing primary key");
        } else {
          const store = idbUpgradeTrans.objectStore(change.name);
          change.add.forEach((idx) => addIndex(store, idx));
          change.change.forEach((idx) => {
            store.deleteIndex(idx.name);
            addIndex(store, idx);
          });
          change.del.forEach((idxName) => store.deleteIndex(idxName));
        }
      });
      const contentUpgrade = version._cfg.contentUpgrade;
      if (contentUpgrade && version._cfg.version > oldVersion) {
        generateMiddlewareStacks(db, idbUpgradeTrans);
        trans._memoizedTables = {};
        anyContentUpgraderHasRun = true;
        let upgradeSchema = shallowClone(newSchema);
        diff.del.forEach((table) => {
          upgradeSchema[table] = oldSchema[table];
        });
        removeTablesApi(db, [db.Transaction.prototype]);
        setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema), upgradeSchema);
        trans.schema = upgradeSchema;
        const contentUpgradeIsAsync = isAsyncFunction(contentUpgrade);
        if (contentUpgradeIsAsync) {
          incrementExpectedAwaits();
        }
        let returnValue;
        const promiseFollowed = DexiePromise.follow(() => {
          returnValue = contentUpgrade(trans);
          if (returnValue) {
            if (contentUpgradeIsAsync) {
              var decrementor = decrementExpectedAwaits.bind(null, null);
              returnValue.then(decrementor, decrementor);
            }
          }
        });
        return returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue) : promiseFollowed.then(() => returnValue);
      }
    });
    queue.push((idbtrans) => {
      if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
        const newSchema = version._cfg.dbschema;
        deleteRemovedTables(newSchema, idbtrans);
      }
      removeTablesApi(db, [db.Transaction.prototype]);
      setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
      trans.schema = db._dbSchema;
    });
  });
  function runQueue() {
    return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
  }
  return runQueue().then(() => {
    createMissingTables(globalSchema, idbUpgradeTrans);
  });
}
function getSchemaDiff(oldSchema, newSchema) {
  const diff = {
    del: [],
    add: [],
    change: []
  };
  let table;
  for (table in oldSchema) {
    if (!newSchema[table])
      diff.del.push(table);
  }
  for (table in newSchema) {
    const oldDef = oldSchema[table], newDef = newSchema[table];
    if (!oldDef) {
      diff.add.push([table, newDef]);
    } else {
      const change = {
        name: table,
        def: newDef,
        recreate: false,
        del: [],
        add: [],
        change: []
      };
      if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge) {
        change.recreate = true;
        diff.change.push(change);
      } else {
        const oldIndexes = oldDef.idxByName;
        const newIndexes = newDef.idxByName;
        let idxName;
        for (idxName in oldIndexes) {
          if (!newIndexes[idxName])
            change.del.push(idxName);
        }
        for (idxName in newIndexes) {
          const oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
          if (!oldIdx)
            change.add.push(newIdx);
          else if (oldIdx.src !== newIdx.src)
            change.change.push(newIdx);
        }
        if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
          diff.change.push(change);
        }
      }
    }
  }
  return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
  const store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
  indexes.forEach((idx) => addIndex(store, idx));
  return store;
}
function createMissingTables(newSchema, idbtrans) {
  keys(newSchema).forEach((tableName) => {
    if (!idbtrans.db.objectStoreNames.contains(tableName)) {
      createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
    }
  });
}
function deleteRemovedTables(newSchema, idbtrans) {
  [].slice.call(idbtrans.db.objectStoreNames).forEach((storeName) => newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName));
}
function addIndex(store, idx) {
  store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
}
function buildGlobalSchema(db, idbdb, tmpTrans) {
  const globalSchema = {};
  const dbStoreNames = slice(idbdb.objectStoreNames, 0);
  dbStoreNames.forEach((storeName) => {
    const store = tmpTrans.objectStore(storeName);
    let keyPath = store.keyPath;
    const primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
    const indexes = [];
    for (let j = 0; j < store.indexNames.length; ++j) {
      const idbindex = store.index(store.indexNames[j]);
      keyPath = idbindex.keyPath;
      var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
      indexes.push(index);
    }
    globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
  });
  return globalSchema;
}
function readGlobalSchema({ _novip: db }, idbdb, tmpTrans) {
  db.verno = idbdb.version / 10;
  const globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
  db._storeNames = slice(idbdb.objectStoreNames, 0);
  setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
}
function verifyInstalledSchema(db, tmpTrans) {
  const installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
  const diff = getSchemaDiff(installedSchema, db._dbSchema);
  return !(diff.add.length || diff.change.some((ch) => ch.add.length || ch.change.length));
}
function adjustToExistingIndexNames({ _novip: db }, schema, idbtrans) {
  const storeNames = idbtrans.db.objectStoreNames;
  for (let i = 0; i < storeNames.length; ++i) {
    const storeName = storeNames[i];
    const store = idbtrans.objectStore(storeName);
    db._hasGetAll = "getAll" in store;
    for (let j = 0; j < store.indexNames.length; ++j) {
      const indexName = store.indexNames[j];
      const keyPath = store.index(indexName).keyPath;
      const dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
      if (schema[storeName]) {
        const indexSpec = schema[storeName].idxByName[dexieName];
        if (indexSpec) {
          indexSpec.name = indexName;
          delete schema[storeName].idxByName[dexieName];
          schema[storeName].idxByName[indexName] = indexSpec;
        }
      }
    }
  }
  if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
    db._hasGetAll = false;
  }
}
function parseIndexSyntax(primKeyAndIndexes) {
  return primKeyAndIndexes.split(",").map((index, indexNum) => {
    index = index.trim();
    const name = index.replace(/([&*]|\+\+)/g, "");
    const keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
    return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
  });
}
var Version = class {
  _parseStoresSpec(stores, outSchema) {
    keys(stores).forEach((tableName) => {
      if (stores[tableName] !== null) {
        var indexes = parseIndexSyntax(stores[tableName]);
        var primKey = indexes.shift();
        if (primKey.multi)
          throw new exceptions.Schema("Primary key cannot be multi-valued");
        indexes.forEach((idx) => {
          if (idx.auto)
            throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
          if (!idx.keyPath)
            throw new exceptions.Schema("Index must have a name and cannot be an empty string");
        });
        outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
      }
    });
  }
  stores(stores) {
    const db = this.db;
    this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
    const versions = db._versions;
    const storesSpec = {};
    let dbschema = {};
    versions.forEach((version) => {
      extend(storesSpec, version._cfg.storesSource);
      dbschema = version._cfg.dbschema = {};
      version._parseStoresSpec(storesSpec, dbschema);
    });
    db._dbSchema = dbschema;
    removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
    setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
    db._storeNames = keys(dbschema);
    return this;
  }
  upgrade(upgradeFunction) {
    this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
    return this;
  }
};
function createVersionConstructor(db) {
  return makeClassConstructor(Version.prototype, function Version2(versionNumber) {
    this.db = db;
    this._cfg = {
      version: versionNumber,
      storesSource: null,
      dbschema: {},
      tables: {},
      contentUpgrade: null
    };
  });
}
function getDbNamesTable(indexedDB2, IDBKeyRange) {
  let dbNamesDB = indexedDB2["_dbNamesDB"];
  if (!dbNamesDB) {
    dbNamesDB = indexedDB2["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
      addons: [],
      indexedDB: indexedDB2,
      IDBKeyRange
    });
    dbNamesDB.version(1).stores({ dbnames: "name" });
  }
  return dbNamesDB.table("dbnames");
}
function hasDatabasesNative(indexedDB2) {
  return indexedDB2 && typeof indexedDB2.databases === "function";
}
function getDatabaseNames({ indexedDB: indexedDB2, IDBKeyRange }) {
  return hasDatabasesNative(indexedDB2) ? Promise.resolve(indexedDB2.databases()).then((infos) => infos.map((info) => info.name).filter((name) => name !== DBNAMES_DB)) : getDbNamesTable(indexedDB2, IDBKeyRange).toCollection().primaryKeys();
}
function _onDatabaseCreated({ indexedDB: indexedDB2, IDBKeyRange }, name) {
  !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).put({ name }).catch(nop);
}
function _onDatabaseDeleted({ indexedDB: indexedDB2, IDBKeyRange }, name) {
  !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).delete(name).catch(nop);
}
function vip(fn) {
  return newScope(function() {
    PSD.letThrough = true;
    return fn();
  });
}
function idbReady() {
  var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
  if (!isSafari || !indexedDB.databases)
    return Promise.resolve();
  var intervalId;
  return new Promise(function(resolve) {
    var tryIdb = function() {
      return indexedDB.databases().finally(resolve);
    };
    intervalId = setInterval(tryIdb, 100);
    tryIdb();
  }).finally(function() {
    return clearInterval(intervalId);
  });
}
function dexieOpen(db) {
  const state = db._state;
  const { indexedDB: indexedDB2 } = db._deps;
  if (state.isBeingOpened || db.idbdb)
    return state.dbReadyPromise.then(() => state.dbOpenError ? rejection(state.dbOpenError) : db);
  debug && (state.openCanceller._stackHolder = getErrorWithStack());
  state.isBeingOpened = true;
  state.dbOpenError = null;
  state.openComplete = false;
  const openCanceller = state.openCanceller;
  function throwIfCancelled() {
    if (state.openCanceller !== openCanceller)
      throw new exceptions.DatabaseClosed("db.open() was cancelled");
  }
  let resolveDbReady = state.dbReadyResolve, upgradeTransaction = null, wasCreated = false;
  const tryOpenDB = () => new DexiePromise((resolve, reject) => {
    throwIfCancelled();
    if (!indexedDB2)
      throw new exceptions.MissingAPI();
    const dbName = db.name;
    const req = state.autoSchema ? indexedDB2.open(dbName) : indexedDB2.open(dbName, Math.round(db.verno * 10));
    if (!req)
      throw new exceptions.MissingAPI();
    req.onerror = eventRejectHandler(reject);
    req.onblocked = wrap(db._fireOnBlocked);
    req.onupgradeneeded = wrap((e) => {
      upgradeTransaction = req.transaction;
      if (state.autoSchema && !db._options.allowEmptyDB) {
        req.onerror = preventDefault;
        upgradeTransaction.abort();
        req.result.close();
        const delreq = indexedDB2.deleteDatabase(dbName);
        delreq.onsuccess = delreq.onerror = wrap(() => {
          reject(new exceptions.NoSuchDatabase(`Database ${dbName} doesnt exist`));
        });
      } else {
        upgradeTransaction.onerror = eventRejectHandler(reject);
        var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
        wasCreated = oldVer < 1;
        db._novip.idbdb = req.result;
        runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
      }
    }, reject);
    req.onsuccess = wrap(() => {
      upgradeTransaction = null;
      const idbdb = db._novip.idbdb = req.result;
      const objectStoreNames = slice(idbdb.objectStoreNames);
      if (objectStoreNames.length > 0)
        try {
          const tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
          if (state.autoSchema)
            readGlobalSchema(db, idbdb, tmpTrans);
          else {
            adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
            if (!verifyInstalledSchema(db, tmpTrans)) {
              console.warn(`Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.`);
            }
          }
          generateMiddlewareStacks(db, tmpTrans);
        } catch (e) {
        }
      connections.push(db);
      idbdb.onversionchange = wrap((ev) => {
        state.vcFired = true;
        db.on("versionchange").fire(ev);
      });
      idbdb.onclose = wrap((ev) => {
        db.on("close").fire(ev);
      });
      if (wasCreated)
        _onDatabaseCreated(db._deps, dbName);
      resolve();
    }, reject);
  }).catch((err) => {
    if (err && err.name === "UnknownError" && state.PR1398_maxLoop > 0) {
      state.PR1398_maxLoop--;
      console.warn("Dexie: Workaround for Chrome UnknownError on open()");
      return tryOpenDB();
    } else {
      return DexiePromise.reject(err);
    }
  });
  return DexiePromise.race([
    openCanceller,
    (typeof navigator === "undefined" ? DexiePromise.resolve() : idbReady()).then(tryOpenDB)
  ]).then(() => {
    throwIfCancelled();
    state.onReadyBeingFired = [];
    return DexiePromise.resolve(vip(() => db.on.ready.fire(db.vip))).then(function fireRemainders() {
      if (state.onReadyBeingFired.length > 0) {
        let remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
        state.onReadyBeingFired = [];
        return DexiePromise.resolve(vip(() => remainders(db.vip))).then(fireRemainders);
      }
    });
  }).finally(() => {
    state.onReadyBeingFired = null;
    state.isBeingOpened = false;
  }).then(() => {
    return db;
  }).catch((err) => {
    state.dbOpenError = err;
    try {
      upgradeTransaction && upgradeTransaction.abort();
    } catch (_a) {
    }
    if (openCanceller === state.openCanceller) {
      db._close();
    }
    return rejection(err);
  }).finally(() => {
    state.openComplete = true;
    resolveDbReady();
  });
}
function awaitIterator(iterator) {
  var callNext = (result) => iterator.next(result), doThrow = (error) => iterator.throw(error), onSuccess = step(callNext), onError = step(doThrow);
  function step(getNext) {
    return (val) => {
      var next = getNext(val), value = next.value;
      return next.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
    };
  }
  return step(callNext)();
}
function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
  var i = arguments.length;
  if (i < 2)
    throw new exceptions.InvalidArgument("Too few arguments");
  var args = new Array(i - 1);
  while (--i)
    args[i - 1] = arguments[i];
  scopeFunc = args.pop();
  var tables = flatten(args);
  return [mode, tables, scopeFunc];
}
function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
  return DexiePromise.resolve().then(() => {
    const transless = PSD.transless || PSD;
    const trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
    const zoneProps = {
      trans,
      transless
    };
    if (parentTransaction) {
      trans.idbtrans = parentTransaction.idbtrans;
    } else {
      try {
        trans.create();
        db._state.PR1398_maxLoop = 3;
      } catch (ex) {
        if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
          console.warn("Dexie: Need to reopen db");
          db._close();
          return db.open().then(() => enterTransactionScope(db, mode, storeNames, null, scopeFunc));
        }
        return rejection(ex);
      }
    }
    const scopeFuncIsAsync = isAsyncFunction(scopeFunc);
    if (scopeFuncIsAsync) {
      incrementExpectedAwaits();
    }
    let returnValue;
    const promiseFollowed = DexiePromise.follow(() => {
      returnValue = scopeFunc.call(trans, trans);
      if (returnValue) {
        if (scopeFuncIsAsync) {
          var decrementor = decrementExpectedAwaits.bind(null, null);
          returnValue.then(decrementor, decrementor);
        } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
          returnValue = awaitIterator(returnValue);
        }
      }
    }, zoneProps);
    return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then((x) => trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"))) : promiseFollowed.then(() => returnValue)).then((x) => {
      if (parentTransaction)
        trans._resolve();
      return trans._completion.then(() => x);
    }).catch((e) => {
      trans._reject(e);
      return rejection(e);
    });
  });
}
function pad(a, value, count) {
  const result = isArray(a) ? a.slice() : [a];
  for (let i = 0; i < count; ++i)
    result.push(value);
  return result;
}
function createVirtualIndexMiddleware(down) {
  return {
    ...down,
    table(tableName) {
      const table = down.table(tableName);
      const { schema } = table;
      const indexLookup = {};
      const allVirtualIndexes = [];
      function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
        const keyPathAlias = getKeyPathAlias(keyPath);
        const indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
        const keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
        const isVirtual = keyTail > 0;
        const virtualIndex = {
          ...lowLevelIndex,
          isVirtual,
          keyTail,
          keyLength,
          extractKey: getKeyExtractor(keyPath),
          unique: !isVirtual && lowLevelIndex.unique
        };
        indexList.push(virtualIndex);
        if (!virtualIndex.isPrimaryKey) {
          allVirtualIndexes.push(virtualIndex);
        }
        if (keyLength > 1) {
          const virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
          addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
        }
        indexList.sort((a, b) => a.keyTail - b.keyTail);
        return virtualIndex;
      }
      const primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
      indexLookup[":id"] = [primaryKey];
      for (const index of schema.indexes) {
        addVirtualIndexes(index.keyPath, 0, index);
      }
      function findBestIndex(keyPath) {
        const result2 = indexLookup[getKeyPathAlias(keyPath)];
        return result2 && result2[0];
      }
      function translateRange(range, keyTail) {
        return {
          type: range.type === 1 ? 2 : range.type,
          lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
          lowerOpen: true,
          upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
          upperOpen: true
        };
      }
      function translateRequest(req) {
        const index = req.query.index;
        return index.isVirtual ? {
          ...req,
          query: {
            index,
            range: translateRange(req.query.range, index.keyTail)
          }
        } : req;
      }
      const result = {
        ...table,
        schema: {
          ...schema,
          primaryKey,
          indexes: allVirtualIndexes,
          getIndexByKeyPath: findBestIndex
        },
        count(req) {
          return table.count(translateRequest(req));
        },
        query(req) {
          return table.query(translateRequest(req));
        },
        openCursor(req) {
          const { keyTail, isVirtual, keyLength } = req.query.index;
          if (!isVirtual)
            return table.openCursor(req);
          function createVirtualCursor(cursor) {
            function _continue(key) {
              key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(cursor.key.slice(0, keyLength).concat(req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
            }
            const virtualCursor = Object.create(cursor, {
              continue: { value: _continue },
              continuePrimaryKey: {
                value(key, primaryKey2) {
                  cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
                }
              },
              primaryKey: {
                get() {
                  return cursor.primaryKey;
                }
              },
              key: {
                get() {
                  const key = cursor.key;
                  return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                }
              },
              value: {
                get() {
                  return cursor.value;
                }
              }
            });
            return virtualCursor;
          }
          return table.openCursor(translateRequest(req)).then((cursor) => cursor && createVirtualCursor(cursor));
        }
      };
      return result;
    }
  };
}
var virtualIndexMiddleware = {
  stack: "dbcore",
  name: "VirtualIndexMiddleware",
  level: 1,
  create: createVirtualIndexMiddleware
};
function getObjectDiff(a, b, rv, prfx) {
  rv = rv || {};
  prfx = prfx || "";
  keys(a).forEach((prop) => {
    if (!hasOwn(b, prop)) {
      rv[prfx + prop] = void 0;
    } else {
      var ap = a[prop], bp = b[prop];
      if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
        const apTypeName = toStringTag(ap);
        const bpTypeName = toStringTag(bp);
        if (apTypeName !== bpTypeName) {
          rv[prfx + prop] = b[prop];
        } else if (apTypeName === "Object") {
          getObjectDiff(ap, bp, rv, prfx + prop + ".");
        } else if (ap !== bp) {
          rv[prfx + prop] = b[prop];
        }
      } else if (ap !== bp)
        rv[prfx + prop] = b[prop];
    }
  });
  keys(b).forEach((prop) => {
    if (!hasOwn(a, prop)) {
      rv[prfx + prop] = b[prop];
    }
  });
  return rv;
}
function getEffectiveKeys(primaryKey, req) {
  if (req.type === "delete")
    return req.keys;
  return req.keys || req.values.map(primaryKey.extractKey);
}
var hooksMiddleware = {
  stack: "dbcore",
  name: "HooksMiddleware",
  level: 2,
  create: (downCore) => ({
    ...downCore,
    table(tableName) {
      const downTable = downCore.table(tableName);
      const { primaryKey } = downTable.schema;
      const tableMiddleware = {
        ...downTable,
        mutate(req) {
          const dxTrans = PSD.trans;
          const { deleting, creating, updating } = dxTrans.table(tableName).hook;
          switch (req.type) {
            case "add":
              if (creating.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "put":
              if (creating.fire === nop && updating.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "delete":
              if (deleting.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "deleteRange":
              if (deleting.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => deleteRange(req), true);
          }
          return downTable.mutate(req);
          function addPutOrDelete(req2) {
            const dxTrans2 = PSD.trans;
            const keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
            if (!keys2)
              throw new Error("Keys missing");
            req2 = req2.type === "add" || req2.type === "put" ? { ...req2, keys: keys2 } : { ...req2 };
            if (req2.type !== "delete")
              req2.values = [...req2.values];
            if (req2.keys)
              req2.keys = [...req2.keys];
            return getExistingValues(downTable, req2, keys2).then((existingValues) => {
              const contexts = keys2.map((key, i) => {
                const existingValue = existingValues[i];
                const ctx = { onerror: null, onsuccess: null };
                if (req2.type === "delete") {
                  deleting.fire.call(ctx, key, existingValue, dxTrans2);
                } else if (req2.type === "add" || existingValue === void 0) {
                  const generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                  if (key == null && generatedPrimaryKey != null) {
                    key = generatedPrimaryKey;
                    req2.keys[i] = key;
                    if (!primaryKey.outbound) {
                      setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                    }
                  }
                } else {
                  const objectDiff = getObjectDiff(existingValue, req2.values[i]);
                  const additionalChanges = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                  if (additionalChanges) {
                    const requestedValue = req2.values[i];
                    Object.keys(additionalChanges).forEach((keyPath) => {
                      if (hasOwn(requestedValue, keyPath)) {
                        requestedValue[keyPath] = additionalChanges[keyPath];
                      } else {
                        setByKeyPath(requestedValue, keyPath, additionalChanges[keyPath]);
                      }
                    });
                  }
                }
                return ctx;
              });
              return downTable.mutate(req2).then(({ failures, results, numFailures, lastResult }) => {
                for (let i = 0; i < keys2.length; ++i) {
                  const primKey = results ? results[i] : keys2[i];
                  const ctx = contexts[i];
                  if (primKey == null) {
                    ctx.onerror && ctx.onerror(failures[i]);
                  } else {
                    ctx.onsuccess && ctx.onsuccess(
                      req2.type === "put" && existingValues[i] ? req2.values[i] : primKey
                    );
                  }
                }
                return { failures, results, numFailures, lastResult };
              }).catch((error) => {
                contexts.forEach((ctx) => ctx.onerror && ctx.onerror(error));
                return Promise.reject(error);
              });
            });
          }
          function deleteRange(req2) {
            return deleteNextChunk(req2.trans, req2.range, 1e4);
          }
          function deleteNextChunk(trans, range, limit) {
            return downTable.query({ trans, values: false, query: { index: primaryKey, range }, limit }).then(({ result }) => {
              return addPutOrDelete({ type: "delete", keys: result, trans }).then((res) => {
                if (res.numFailures > 0)
                  return Promise.reject(res.failures[0]);
                if (result.length < limit) {
                  return { failures: [], numFailures: 0, lastResult: void 0 };
                } else {
                  return deleteNextChunk(trans, { ...range, lower: result[result.length - 1], lowerOpen: true }, limit);
                }
              });
            });
          }
        }
      };
      return tableMiddleware;
    }
  })
};
function getExistingValues(table, req, effectiveKeys) {
  return req.type === "add" ? Promise.resolve([]) : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
}
function getFromTransactionCache(keys2, cache, clone) {
  try {
    if (!cache)
      return null;
    if (cache.keys.length < keys2.length)
      return null;
    const result = [];
    for (let i = 0, j = 0; i < cache.keys.length && j < keys2.length; ++i) {
      if (cmp(cache.keys[i], keys2[j]) !== 0)
        continue;
      result.push(clone ? deepClone(cache.values[i]) : cache.values[i]);
      ++j;
    }
    return result.length === keys2.length ? result : null;
  } catch (_a) {
    return null;
  }
}
var cacheExistingValuesMiddleware = {
  stack: "dbcore",
  level: -1,
  create: (core) => {
    return {
      table: (tableName) => {
        const table = core.table(tableName);
        return {
          ...table,
          getMany: (req) => {
            if (!req.cache) {
              return table.getMany(req);
            }
            const cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
            if (cachedResult) {
              return DexiePromise.resolve(cachedResult);
            }
            return table.getMany(req).then((res) => {
              req.trans["_cache"] = {
                keys: req.keys,
                values: req.cache === "clone" ? deepClone(res) : res
              };
              return res;
            });
          },
          mutate: (req) => {
            if (req.type !== "add")
              req.trans["_cache"] = null;
            return table.mutate(req);
          }
        };
      }
    };
  }
};
function isEmptyRange(node) {
  return !("from" in node);
}
var RangeSet = function(fromOrTree, to) {
  if (this) {
    extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
  } else {
    const rv = new RangeSet();
    if (fromOrTree && "d" in fromOrTree) {
      extend(rv, fromOrTree);
    }
    return rv;
  }
};
props(RangeSet.prototype, {
  add(rangeSet) {
    mergeRanges(this, rangeSet);
    return this;
  },
  addKey(key) {
    addRange(this, key, key);
    return this;
  },
  addKeys(keys2) {
    keys2.forEach((key) => addRange(this, key, key));
    return this;
  },
  [iteratorSymbol]() {
    return getRangeSetIterator(this);
  }
});
function addRange(target, from, to) {
  const diff = cmp(from, to);
  if (isNaN(diff))
    return;
  if (diff > 0)
    throw RangeError();
  if (isEmptyRange(target))
    return extend(target, { from, to, d: 1 });
  const left = target.l;
  const right = target.r;
  if (cmp(to, target.from) < 0) {
    left ? addRange(left, from, to) : target.l = { from, to, d: 1, l: null, r: null };
    return rebalance(target);
  }
  if (cmp(from, target.to) > 0) {
    right ? addRange(right, from, to) : target.r = { from, to, d: 1, l: null, r: null };
    return rebalance(target);
  }
  if (cmp(from, target.from) < 0) {
    target.from = from;
    target.l = null;
    target.d = right ? right.d + 1 : 1;
  }
  if (cmp(to, target.to) > 0) {
    target.to = to;
    target.r = null;
    target.d = target.l ? target.l.d + 1 : 1;
  }
  const rightWasCutOff = !target.r;
  if (left && !target.l) {
    mergeRanges(target, left);
  }
  if (right && rightWasCutOff) {
    mergeRanges(target, right);
  }
}
function mergeRanges(target, newSet) {
  function _addRangeSet(target2, { from, to, l, r }) {
    addRange(target2, from, to);
    if (l)
      _addRangeSet(target2, l);
    if (r)
      _addRangeSet(target2, r);
  }
  if (!isEmptyRange(newSet))
    _addRangeSet(target, newSet);
}
function rangesOverlap(rangeSet1, rangeSet2) {
  const i1 = getRangeSetIterator(rangeSet2);
  let nextResult1 = i1.next();
  if (nextResult1.done)
    return false;
  let a = nextResult1.value;
  const i2 = getRangeSetIterator(rangeSet1);
  let nextResult2 = i2.next(a.from);
  let b = nextResult2.value;
  while (!nextResult1.done && !nextResult2.done) {
    if (cmp(b.from, a.to) <= 0 && cmp(b.to, a.from) >= 0)
      return true;
    cmp(a.from, b.from) < 0 ? a = (nextResult1 = i1.next(b.from)).value : b = (nextResult2 = i2.next(a.from)).value;
  }
  return false;
}
function getRangeSetIterator(node) {
  let state = isEmptyRange(node) ? null : { s: 0, n: node };
  return {
    next(key) {
      const keyProvided = arguments.length > 0;
      while (state) {
        switch (state.s) {
          case 0:
            state.s = 1;
            if (keyProvided) {
              while (state.n.l && cmp(key, state.n.from) < 0)
                state = { up: state, n: state.n.l, s: 1 };
            } else {
              while (state.n.l)
                state = { up: state, n: state.n.l, s: 1 };
            }
          case 1:
            state.s = 2;
            if (!keyProvided || cmp(key, state.n.to) <= 0)
              return { value: state.n, done: false };
          case 2:
            if (state.n.r) {
              state.s = 3;
              state = { up: state, n: state.n.r, s: 0 };
              continue;
            }
          case 3:
            state = state.up;
        }
      }
      return { done: true };
    }
  };
}
function rebalance(target) {
  var _a, _b;
  const diff = (((_a = target.r) === null || _a === void 0 ? void 0 : _a.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
  const r = diff > 1 ? "r" : diff < -1 ? "l" : "";
  if (r) {
    const l = r === "r" ? "l" : "r";
    const rootClone = { ...target };
    const oldRootRight = target[r];
    target.from = oldRootRight.from;
    target.to = oldRootRight.to;
    target[r] = oldRootRight[r];
    rootClone[r] = oldRootRight[l];
    target[l] = rootClone;
    rootClone.d = computeDepth(rootClone);
  }
  target.d = computeDepth(target);
}
function computeDepth({ r, l }) {
  return (r ? l ? Math.max(r.d, l.d) : r.d : l ? l.d : 0) + 1;
}
var observabilityMiddleware = {
  stack: "dbcore",
  level: 0,
  create: (core) => {
    const dbName = core.schema.name;
    const FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
    return {
      ...core,
      table: (tableName) => {
        const table = core.table(tableName);
        const { schema } = table;
        const { primaryKey } = schema;
        const { extractKey, outbound } = primaryKey;
        const tableClone = {
          ...table,
          mutate: (req) => {
            const trans = req.trans;
            const mutatedParts = trans.mutatedParts || (trans.mutatedParts = {});
            const getRangeSet = (indexName) => {
              const part = `idb://${dbName}/${tableName}/${indexName}`;
              return mutatedParts[part] || (mutatedParts[part] = new RangeSet());
            };
            const pkRangeSet = getRangeSet("");
            const delsRangeSet = getRangeSet(":dels");
            const { type: type2 } = req;
            let [keys2, newObjs] = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [[], req.values] : [];
            const oldCache = req.trans["_cache"];
            return table.mutate(req).then((res) => {
              if (isArray(keys2)) {
                if (type2 !== "delete")
                  keys2 = res.results;
                pkRangeSet.addKeys(keys2);
                const oldObjs = getFromTransactionCache(keys2, oldCache);
                if (!oldObjs && type2 !== "add") {
                  delsRangeSet.addKeys(keys2);
                }
                if (oldObjs || newObjs) {
                  trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                }
              } else if (keys2) {
                const range = { from: keys2.lower, to: keys2.upper };
                delsRangeSet.add(range);
                pkRangeSet.add(range);
              } else {
                pkRangeSet.add(FULL_RANGE);
                delsRangeSet.add(FULL_RANGE);
                schema.indexes.forEach((idx) => getRangeSet(idx.name).add(FULL_RANGE));
              }
              return res;
            });
          }
        };
        const getRange = ({ query: { index, range } }) => {
          var _a, _b;
          return [
            index,
            new RangeSet((_a = range.lower) !== null && _a !== void 0 ? _a : core.MIN_KEY, (_b = range.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY)
          ];
        };
        const readSubscribers = {
          get: (req) => [primaryKey, new RangeSet(req.key)],
          getMany: (req) => [primaryKey, new RangeSet().addKeys(req.keys)],
          count: getRange,
          query: getRange,
          openCursor: getRange
        };
        keys(readSubscribers).forEach((method) => {
          tableClone[method] = function(req) {
            const { subscr } = PSD;
            if (subscr) {
              const getRangeSet = (indexName) => {
                const part = `idb://${dbName}/${tableName}/${indexName}`;
                return subscr[part] || (subscr[part] = new RangeSet());
              };
              const pkRangeSet = getRangeSet("");
              const delsRangeSet = getRangeSet(":dels");
              const [queriedIndex, queriedRanges] = readSubscribers[method](req);
              getRangeSet(queriedIndex.name || "").add(queriedRanges);
              if (!queriedIndex.isPrimaryKey) {
                if (method === "count") {
                  delsRangeSet.add(FULL_RANGE);
                } else {
                  const keysPromise = method === "query" && outbound && req.values && table.query({
                    ...req,
                    values: false
                  });
                  return table[method].apply(this, arguments).then((res) => {
                    if (method === "query") {
                      if (outbound && req.values) {
                        return keysPromise.then(({ result: resultingKeys }) => {
                          pkRangeSet.addKeys(resultingKeys);
                          return res;
                        });
                      }
                      const pKeys = req.values ? res.result.map(extractKey) : res.result;
                      if (req.values) {
                        pkRangeSet.addKeys(pKeys);
                      } else {
                        delsRangeSet.addKeys(pKeys);
                      }
                    } else if (method === "openCursor") {
                      const cursor = res;
                      const wantValues = req.values;
                      return cursor && Object.create(cursor, {
                        key: {
                          get() {
                            delsRangeSet.addKey(cursor.primaryKey);
                            return cursor.key;
                          }
                        },
                        primaryKey: {
                          get() {
                            const pkey = cursor.primaryKey;
                            delsRangeSet.addKey(pkey);
                            return pkey;
                          }
                        },
                        value: {
                          get() {
                            wantValues && pkRangeSet.addKey(cursor.primaryKey);
                            return cursor.value;
                          }
                        }
                      });
                    }
                    return res;
                  });
                }
              }
            }
            return table[method].apply(this, arguments);
          };
        });
        return tableClone;
      }
    };
  }
};
function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
  function addAffectedIndex(ix) {
    const rangeSet = getRangeSet(ix.name || "");
    function extractKey(obj) {
      return obj != null ? ix.extractKey(obj) : null;
    }
    const addKeyOrKeys = (key) => ix.multiEntry && isArray(key) ? key.forEach((key2) => rangeSet.addKey(key2)) : rangeSet.addKey(key);
    (oldObjs || newObjs).forEach((_, i) => {
      const oldKey = oldObjs && extractKey(oldObjs[i]);
      const newKey = newObjs && extractKey(newObjs[i]);
      if (cmp(oldKey, newKey) !== 0) {
        if (oldKey != null)
          addKeyOrKeys(oldKey);
        if (newKey != null)
          addKeyOrKeys(newKey);
      }
    });
  }
  schema.indexes.forEach(addAffectedIndex);
}
var Dexie$1 = class _Dexie$1 {
  constructor(name, options) {
    this._middlewares = {};
    this.verno = 0;
    const deps = _Dexie$1.dependencies;
    this._options = options = {
      addons: _Dexie$1.addons,
      autoOpen: true,
      indexedDB: deps.indexedDB,
      IDBKeyRange: deps.IDBKeyRange,
      ...options
    };
    this._deps = {
      indexedDB: options.indexedDB,
      IDBKeyRange: options.IDBKeyRange
    };
    const { addons } = options;
    this._dbSchema = {};
    this._versions = [];
    this._storeNames = [];
    this._allTables = {};
    this.idbdb = null;
    this._novip = this;
    const state = {
      dbOpenError: null,
      isBeingOpened: false,
      onReadyBeingFired: null,
      openComplete: false,
      dbReadyResolve: nop,
      dbReadyPromise: null,
      cancelOpen: nop,
      openCanceller: null,
      autoSchema: true,
      PR1398_maxLoop: 3
    };
    state.dbReadyPromise = new DexiePromise((resolve) => {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise((_, reject) => {
      state.cancelOpen = reject;
    });
    this._state = state;
    this.name = name;
    this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
    this.on.ready.subscribe = override(this.on.ready.subscribe, (subscribe) => {
      return (subscriber, bSticky) => {
        _Dexie$1.vip(() => {
          const state2 = this._state;
          if (state2.openComplete) {
            if (!state2.dbOpenError)
              DexiePromise.resolve().then(subscriber);
            if (bSticky)
              subscribe(subscriber);
          } else if (state2.onReadyBeingFired) {
            state2.onReadyBeingFired.push(subscriber);
            if (bSticky)
              subscribe(subscriber);
          } else {
            subscribe(subscriber);
            const db = this;
            if (!bSticky)
              subscribe(function unsubscribe() {
                db.on.ready.unsubscribe(subscriber);
                db.on.ready.unsubscribe(unsubscribe);
              });
          }
        });
      };
    });
    this.Collection = createCollectionConstructor(this);
    this.Table = createTableConstructor(this);
    this.Transaction = createTransactionConstructor(this);
    this.Version = createVersionConstructor(this);
    this.WhereClause = createWhereClauseConstructor(this);
    this.on("versionchange", (ev) => {
      if (ev.newVersion > 0)
        console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`);
      else
        console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`);
      this.close();
    });
    this.on("blocked", (ev) => {
      if (!ev.newVersion || ev.newVersion < ev.oldVersion)
        console.warn(`Dexie.delete('${this.name}') was blocked`);
      else
        console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${ev.oldVersion / 10}`);
    });
    this._maxKey = getMaxKey(options.IDBKeyRange);
    this._createTransaction = (mode, storeNames, dbschema, parentTransaction) => new this.Transaction(mode, storeNames, dbschema, this._options.chromeTransactionDurability, parentTransaction);
    this._fireOnBlocked = (ev) => {
      this.on("blocked").fire(ev);
      connections.filter((c) => c.name === this.name && c !== this && !c._state.vcFired).map((c) => c.on("versionchange").fire(ev));
    };
    this.use(virtualIndexMiddleware);
    this.use(hooksMiddleware);
    this.use(observabilityMiddleware);
    this.use(cacheExistingValuesMiddleware);
    this.vip = Object.create(this, { _vip: { value: true } });
    addons.forEach((addon) => addon(this));
  }
  version(versionNumber) {
    if (isNaN(versionNumber) || versionNumber < 0.1)
      throw new exceptions.Type(`Given version is not a positive number`);
    versionNumber = Math.round(versionNumber * 10) / 10;
    if (this.idbdb || this._state.isBeingOpened)
      throw new exceptions.Schema("Cannot add version when database is open");
    this.verno = Math.max(this.verno, versionNumber);
    const versions = this._versions;
    var versionInstance = versions.filter((v) => v._cfg.version === versionNumber)[0];
    if (versionInstance)
      return versionInstance;
    versionInstance = new this.Version(versionNumber);
    versions.push(versionInstance);
    versions.sort(lowerVersionFirst);
    versionInstance.stores({});
    this._state.autoSchema = false;
    return versionInstance;
  }
  _whenReady(fn) {
    return this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip) ? fn() : new DexiePromise((resolve, reject) => {
      if (this._state.openComplete) {
        return reject(new exceptions.DatabaseClosed(this._state.dbOpenError));
      }
      if (!this._state.isBeingOpened) {
        if (!this._options.autoOpen) {
          reject(new exceptions.DatabaseClosed());
          return;
        }
        this.open().catch(nop);
      }
      this._state.dbReadyPromise.then(resolve, reject);
    }).then(fn);
  }
  use({ stack, create, level, name }) {
    if (name)
      this.unuse({ stack, name });
    const middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
    middlewares.push({ stack, create, level: level == null ? 10 : level, name });
    middlewares.sort((a, b) => a.level - b.level);
    return this;
  }
  unuse({ stack, name, create }) {
    if (stack && this._middlewares[stack]) {
      this._middlewares[stack] = this._middlewares[stack].filter((mw) => create ? mw.create !== create : name ? mw.name !== name : false);
    }
    return this;
  }
  open() {
    return dexieOpen(this);
  }
  _close() {
    const state = this._state;
    const idx = connections.indexOf(this);
    if (idx >= 0)
      connections.splice(idx, 1);
    if (this.idbdb) {
      try {
        this.idbdb.close();
      } catch (e) {
      }
      this._novip.idbdb = null;
    }
    state.dbReadyPromise = new DexiePromise((resolve) => {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise((_, reject) => {
      state.cancelOpen = reject;
    });
  }
  close() {
    this._close();
    const state = this._state;
    this._options.autoOpen = false;
    state.dbOpenError = new exceptions.DatabaseClosed();
    if (state.isBeingOpened)
      state.cancelOpen(state.dbOpenError);
  }
  delete() {
    const hasArguments = arguments.length > 0;
    const state = this._state;
    return new DexiePromise((resolve, reject) => {
      const doDelete = () => {
        this.close();
        var req = this._deps.indexedDB.deleteDatabase(this.name);
        req.onsuccess = wrap(() => {
          _onDatabaseDeleted(this._deps, this.name);
          resolve();
        });
        req.onerror = eventRejectHandler(reject);
        req.onblocked = this._fireOnBlocked;
      };
      if (hasArguments)
        throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
      if (state.isBeingOpened) {
        state.dbReadyPromise.then(doDelete);
      } else {
        doDelete();
      }
    });
  }
  backendDB() {
    return this.idbdb;
  }
  isOpen() {
    return this.idbdb !== null;
  }
  hasBeenClosed() {
    const dbOpenError = this._state.dbOpenError;
    return dbOpenError && dbOpenError.name === "DatabaseClosed";
  }
  hasFailed() {
    return this._state.dbOpenError !== null;
  }
  dynamicallyOpened() {
    return this._state.autoSchema;
  }
  get tables() {
    return keys(this._allTables).map((name) => this._allTables[name]);
  }
  transaction() {
    const args = extractTransactionArgs.apply(this, arguments);
    return this._transaction.apply(this, args);
  }
  _transaction(mode, tables, scopeFunc) {
    let parentTransaction = PSD.trans;
    if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
      parentTransaction = null;
    const onlyIfCompatible = mode.indexOf("?") !== -1;
    mode = mode.replace("!", "").replace("?", "");
    let idbMode, storeNames;
    try {
      storeNames = tables.map((table) => {
        var storeName = table instanceof this.Table ? table.name : table;
        if (typeof storeName !== "string")
          throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
        return storeName;
      });
      if (mode == "r" || mode === READONLY)
        idbMode = READONLY;
      else if (mode == "rw" || mode == READWRITE)
        idbMode = READWRITE;
      else
        throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
      if (parentTransaction) {
        if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
          if (onlyIfCompatible) {
            parentTransaction = null;
          } else
            throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
        }
        if (parentTransaction) {
          storeNames.forEach((storeName) => {
            if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
              if (onlyIfCompatible) {
                parentTransaction = null;
              } else
                throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
            }
          });
        }
        if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
          parentTransaction = null;
        }
      }
    } catch (e) {
      return parentTransaction ? parentTransaction._promise(null, (_, reject) => {
        reject(e);
      }) : rejection(e);
    }
    const enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
    return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, () => this._whenReady(enterTransaction)) : this._whenReady(enterTransaction);
  }
  table(tableName) {
    if (!hasOwn(this._allTables, tableName)) {
      throw new exceptions.InvalidTable(`Table ${tableName} does not exist`);
    }
    return this._allTables[tableName];
  }
};
var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol.observable : "@@observable";
var Observable = class {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(x, error, complete) {
    return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
  }
  [symbolObservable]() {
    return this;
  }
};
function extendObservabilitySet(target, newSet) {
  keys(newSet).forEach((part) => {
    const rangeSet = target[part] || (target[part] = new RangeSet());
    mergeRanges(rangeSet, newSet[part]);
  });
  return target;
}
function liveQuery(querier) {
  let hasValue = false;
  let currentValue = void 0;
  const observable = new Observable((observer) => {
    const scopeFuncIsAsync = isAsyncFunction(querier);
    function execute(subscr) {
      if (scopeFuncIsAsync) {
        incrementExpectedAwaits();
      }
      const exec = () => newScope(querier, { subscr, trans: null });
      const rv = PSD.trans ? usePSD(PSD.transless, exec) : exec();
      if (scopeFuncIsAsync) {
        rv.then(decrementExpectedAwaits, decrementExpectedAwaits);
      }
      return rv;
    }
    let closed = false;
    let accumMuts = {};
    let currentObs = {};
    const subscription = {
      get closed() {
        return closed;
      },
      unsubscribe: () => {
        closed = true;
        globalEvents.storagemutated.unsubscribe(mutationListener);
      }
    };
    observer.start && observer.start(subscription);
    let querying = false, startedListening = false;
    function shouldNotify() {
      return keys(currentObs).some((key) => accumMuts[key] && rangesOverlap(accumMuts[key], currentObs[key]));
    }
    const mutationListener = (parts) => {
      extendObservabilitySet(accumMuts, parts);
      if (shouldNotify()) {
        doQuery();
      }
    };
    const doQuery = () => {
      if (querying || closed)
        return;
      accumMuts = {};
      const subscr = {};
      const ret = execute(subscr);
      if (!startedListening) {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
        startedListening = true;
      }
      querying = true;
      Promise.resolve(ret).then((result) => {
        hasValue = true;
        currentValue = result;
        querying = false;
        if (closed)
          return;
        if (shouldNotify()) {
          doQuery();
        } else {
          accumMuts = {};
          currentObs = subscr;
          observer.next && observer.next(result);
        }
      }, (err) => {
        querying = false;
        hasValue = false;
        observer.error && observer.error(err);
        subscription.unsubscribe();
      });
    };
    doQuery();
    return subscription;
  });
  observable.hasValue = () => hasValue;
  observable.getValue = () => currentValue;
  return observable;
}
var domDeps;
try {
  domDeps = {
    indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
    IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
  };
} catch (e) {
  domDeps = { indexedDB: null, IDBKeyRange: null };
}
var Dexie = Dexie$1;
props(Dexie, {
  ...fullNameExceptions,
  delete(databaseName) {
    const db = new Dexie(databaseName, { addons: [] });
    return db.delete();
  },
  exists(name) {
    return new Dexie(name, { addons: [] }).open().then((db) => {
      db.close();
      return true;
    }).catch("NoSuchDatabaseError", () => false);
  },
  getDatabaseNames(cb) {
    try {
      return getDatabaseNames(Dexie.dependencies).then(cb);
    } catch (_a) {
      return rejection(new exceptions.MissingAPI());
    }
  },
  defineClass() {
    function Class(content) {
      extend(this, content);
    }
    return Class;
  },
  ignoreTransaction(scopeFunc) {
    return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
  },
  vip,
  async: function(generatorFn) {
    return function() {
      try {
        var rv = awaitIterator(generatorFn.apply(this, arguments));
        if (!rv || typeof rv.then !== "function")
          return DexiePromise.resolve(rv);
        return rv;
      } catch (e) {
        return rejection(e);
      }
    };
  },
  spawn: function(generatorFn, args, thiz) {
    try {
      var rv = awaitIterator(generatorFn.apply(thiz, args || []));
      if (!rv || typeof rv.then !== "function")
        return DexiePromise.resolve(rv);
      return rv;
    } catch (e) {
      return rejection(e);
    }
  },
  currentTransaction: {
    get: () => PSD.trans || null
  },
  waitFor: function(promiseOrFunction, optionalTimeout) {
    const promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
    return PSD.trans ? PSD.trans.waitFor(promise) : promise;
  },
  Promise: DexiePromise,
  debug: {
    get: () => debug,
    set: (value) => {
      setDebug(value, value === "dexie" ? () => true : dexieStackFrameFilter);
    }
  },
  derive,
  extend,
  props,
  override,
  Events,
  on: globalEvents,
  liveQuery,
  extendObservabilitySet,
  getByKeyPath,
  setByKeyPath,
  delByKeyPath,
  shallowClone,
  deepClone,
  getObjectDiff,
  cmp,
  asap: asap$1,
  minKey,
  addons: [],
  connections,
  errnames,
  dependencies: domDeps,
  semVer: DEXIE_VERSION,
  version: DEXIE_VERSION.split(".").map((n) => parseInt(n)).reduce((p, c, i) => p + c / Math.pow(10, i * 2))
});
Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);
if (typeof dispatchEvent !== "undefined" && typeof addEventListener !== "undefined") {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (updatedParts) => {
    if (!propagatingLocally) {
      let event;
      if (isIEOrEdge) {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, true, true, updatedParts);
      } else {
        event = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
          detail: updatedParts
        });
      }
      propagatingLocally = true;
      dispatchEvent(event);
      propagatingLocally = false;
    }
  });
  addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, ({ detail }) => {
    if (!propagatingLocally) {
      propagateLocally(detail);
    }
  });
}
function propagateLocally(updateParts) {
  let wasMe = propagatingLocally;
  try {
    propagatingLocally = true;
    globalEvents.storagemutated.fire(updateParts);
  } finally {
    propagatingLocally = wasMe;
  }
}
var propagatingLocally = false;
if (typeof BroadcastChannel !== "undefined") {
  const bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
  if (typeof bc.unref === "function") {
    bc.unref();
  }
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
    if (!propagatingLocally) {
      bc.postMessage(changedParts);
    }
  });
  bc.onmessage = (ev) => {
    if (ev.data)
      propagateLocally(ev.data);
  };
} else if (typeof self !== "undefined" && typeof navigator !== "undefined") {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
    try {
      if (!propagatingLocally) {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(STORAGE_MUTATED_DOM_EVENT_NAME, JSON.stringify({
            trig: Math.random(),
            changedParts
          }));
        }
        if (typeof self["clients"] === "object") {
          [...self["clients"].matchAll({ includeUncontrolled: true })].forEach((client) => client.postMessage({
            type: STORAGE_MUTATED_DOM_EVENT_NAME,
            changedParts
          }));
        }
      }
    } catch (_a) {
    }
  });
  if (typeof addEventListener !== "undefined") {
    addEventListener("storage", (ev) => {
      if (ev.key === STORAGE_MUTATED_DOM_EVENT_NAME) {
        const data = JSON.parse(ev.newValue);
        if (data)
          propagateLocally(data.changedParts);
      }
    });
  }
  const swContainer = self.document && navigator.serviceWorker;
  if (swContainer) {
    swContainer.addEventListener("message", propagateMessageLocally);
  }
}
function propagateMessageLocally({ data }) {
  if (data && data.type === STORAGE_MUTATED_DOM_EVENT_NAME) {
    propagateLocally(data.changedParts);
  }
}
DexiePromise.rejectionMapper = mapError;
setDebug(debug, dexieStackFrameFilter);

// node_modules/dexie-export-import/dist/dexie-export-import.mjs
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function getSchemaString(table) {
  var primKeyAndIndexes = [table.schema.primKey].concat(table.schema.indexes);
  return primKeyAndIndexes.map(function(index) {
    return index.src;
  }).join(",");
}
function extractDbSchema(exportedDb) {
  var schema = {};
  for (var _i = 0, _a = exportedDb.tables; _i < _a.length; _i++) {
    var table = _a[_i];
    schema[table.name] = table.schema;
  }
  return schema;
}
function readBlobAsync(blob, type2) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onabort = function(ev) {
      return reject(new Error("file read aborted"));
    };
    reader.onerror = function(ev) {
      return reject(ev.target.error);
    };
    reader.onload = function(ev) {
      return resolve(ev.target.result);
    };
    if (type2 === "binary")
      reader.readAsArrayBuffer(blob);
    else
      reader.readAsText(blob);
  });
}
function readBlobSync(blob, type2) {
  if (typeof FileReaderSync === "undefined") {
    throw new Error("FileReaderSync missing. Reading blobs synchronously requires code to run from within a web worker. Use TSON.encapsulateAsync() to do it from the main thread.");
  }
  var reader = new FileReaderSync();
  var data = type2 === "binary" ? reader.readAsArrayBuffer(blob) : reader.readAsText(blob);
  return data;
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}
var typeson = createCommonjsModule(function(module, exports) {
  (function(global2, factory) {
    module.exports = factory();
  })(commonjsGlobal, function() {
    function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }
    function _asyncToGenerator(fn) {
      return function() {
        var self2 = this, args = arguments;
        return new Promise(function(resolve, reject) {
          var gen = fn.apply(self2, args);
          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }
          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }
          _next(void 0);
        });
      };
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props2) {
      for (var i = 0; i < props2.length; i++) {
        var descriptor = props2[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function ownKeys(object, enumerableOnly) {
      var keys3 = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys3.push.apply(keys3, symbols);
      }
      return keys3;
    }
    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
        return arr2;
      }
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function _iterableToArray(iter2) {
      if (Symbol.iterator in Object(iter2) || Object.prototype.toString.call(iter2) === "[object Arguments]") return Array.from(iter2);
    }
    function _iterableToArrayLimit(arr, i) {
      if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
        return;
      }
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = void 0;
      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance");
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
    var TypesonPromise = function TypesonPromise2(f) {
      _classCallCheck(this, TypesonPromise2);
      this.p = new Promise(f);
    };
    TypesonPromise.__typeson__type__ = "TypesonPromise";
    if (typeof Symbol !== "undefined") {
      TypesonPromise.prototype[Symbol.toStringTag] = "TypesonPromise";
    }
    TypesonPromise.prototype.then = function(onFulfilled, onRejected) {
      var _this = this;
      return new TypesonPromise(function(typesonResolve, typesonReject) {
        _this.p.then(function(res) {
          typesonResolve(onFulfilled ? onFulfilled(res) : res);
        })["catch"](function(res) {
          return onRejected ? onRejected(res) : Promise.reject(res);
        }).then(typesonResolve, typesonReject);
      });
    };
    TypesonPromise.prototype["catch"] = function(onRejected) {
      return this.then(null, onRejected);
    };
    TypesonPromise.resolve = function(v) {
      return new TypesonPromise(function(typesonResolve) {
        typesonResolve(v);
      });
    };
    TypesonPromise.reject = function(v) {
      return new TypesonPromise(function(typesonResolve, typesonReject) {
        typesonReject(v);
      });
    };
    ["all", "race"].forEach(function(meth) {
      TypesonPromise[meth] = function(promArr) {
        return new TypesonPromise(function(typesonResolve, typesonReject) {
          Promise[meth](promArr.map(function(prom) {
            return prom && prom.constructor && prom.constructor.__typeson__type__ === "TypesonPromise" ? prom.p : prom;
          })).then(typesonResolve, typesonReject);
        });
      };
    });
    var _ref = {}, toStr = _ref.toString, hasOwn2 = {}.hasOwnProperty, getProto2 = Object.getPrototypeOf, fnToString = hasOwn2.toString;
    function isThenable(v, catchCheck) {
      return isObject(v) && typeof v.then === "function" && (!catchCheck || typeof v["catch"] === "function");
    }
    function toStringTag2(val) {
      return toStr.call(val).slice(8, -1);
    }
    function hasConstructorOf(a, b) {
      if (!a || _typeof(a) !== "object") {
        return false;
      }
      var proto = getProto2(a);
      if (!proto) {
        return b === null;
      }
      var Ctor = hasOwn2.call(proto, "constructor") && proto.constructor;
      if (typeof Ctor !== "function") {
        return b === null;
      }
      if (b === Ctor) {
        return true;
      }
      if (b !== null && fnToString.call(Ctor) === fnToString.call(b)) {
        return true;
      }
      if (typeof b === "function" && typeof Ctor.__typeson__type__ === "string" && Ctor.__typeson__type__ === b.__typeson__type__) {
        return true;
      }
      return false;
    }
    function isPlainObject(val) {
      if (!val || toStringTag2(val) !== "Object") {
        return false;
      }
      var proto = getProto2(val);
      if (!proto) {
        return true;
      }
      return hasConstructorOf(val, Object);
    }
    function isUserObject(val) {
      if (!val || toStringTag2(val) !== "Object") {
        return false;
      }
      var proto = getProto2(val);
      if (!proto) {
        return true;
      }
      return hasConstructorOf(val, Object) || isUserObject(proto);
    }
    function isObject(v) {
      return v && _typeof(v) === "object";
    }
    function escapeKeyPathComponent(keyPathComponent) {
      return keyPathComponent.replace(/~/g, "~0").replace(/\./g, "~1");
    }
    function unescapeKeyPathComponent(keyPathComponent) {
      return keyPathComponent.replace(/~1/g, ".").replace(/~0/g, "~");
    }
    function getByKeyPath2(obj, keyPath) {
      if (keyPath === "") {
        return obj;
      }
      var period = keyPath.indexOf(".");
      if (period > -1) {
        var innerObj = obj[unescapeKeyPathComponent(keyPath.slice(0, period))];
        return innerObj === void 0 ? void 0 : getByKeyPath2(innerObj, keyPath.slice(period + 1));
      }
      return obj[unescapeKeyPathComponent(keyPath)];
    }
    function setAtKeyPath(obj, keyPath, value) {
      if (keyPath === "") {
        return value;
      }
      var period = keyPath.indexOf(".");
      if (period > -1) {
        var innerObj = obj[unescapeKeyPathComponent(keyPath.slice(0, period))];
        return setAtKeyPath(innerObj, keyPath.slice(period + 1), value);
      }
      obj[unescapeKeyPathComponent(keyPath)] = value;
      return obj;
    }
    function getJSONType(value) {
      return value === null ? "null" : Array.isArray(value) ? "array" : _typeof(value);
    }
    var keys2 = Object.keys, isArray2 = Array.isArray, hasOwn$1 = {}.hasOwnProperty, internalStateObjPropsToIgnore = ["type", "replaced", "iterateIn", "iterateUnsetNumeric"];
    function nestedPathsFirst(a, b) {
      if (a.keypath === "") {
        return -1;
      }
      var as = a.keypath.match(/\./g) || 0;
      var bs = b.keypath.match(/\./g) || 0;
      if (as) {
        as = as.length;
      }
      if (bs) {
        bs = bs.length;
      }
      return as > bs ? -1 : as < bs ? 1 : a.keypath < b.keypath ? -1 : a.keypath > b.keypath;
    }
    var Typeson = /* @__PURE__ */ function() {
      function Typeson2(options) {
        _classCallCheck(this, Typeson2);
        this.options = options;
        this.plainObjectReplacers = [];
        this.nonplainObjectReplacers = [];
        this.revivers = {};
        this.types = {};
      }
      _createClass(Typeson2, [{
        key: "stringify",
        value: function stringify(obj, replacer, space, opts) {
          opts = _objectSpread2({}, this.options, {}, opts, {
            stringification: true
          });
          var encapsulated = this.encapsulate(obj, null, opts);
          if (isArray2(encapsulated)) {
            return JSON.stringify(encapsulated[0], replacer, space);
          }
          return encapsulated.then(function(res) {
            return JSON.stringify(res, replacer, space);
          });
        }
        /**
         * Also sync but throws on non-sync result.
         * @param {Any} obj
         * @param {JSONReplacer|string[]} replacer
         * @param {number|string} space
         * @param {object} opts
         * @returns {string}
         */
      }, {
        key: "stringifySync",
        value: function stringifySync(obj, replacer, space, opts) {
          return this.stringify(obj, replacer, space, _objectSpread2({
            throwOnBadSyncType: true
          }, opts, {
            sync: true
          }));
        }
        /**
         *
         * @param {Any} obj
         * @param {JSONReplacer|string[]} replacer
         * @param {number|string} space
         * @param {object} opts
         * @returns {Promise<string>}
         */
      }, {
        key: "stringifyAsync",
        value: function stringifyAsync(obj, replacer, space, opts) {
          return this.stringify(obj, replacer, space, _objectSpread2({
            throwOnBadSyncType: true
          }, opts, {
            sync: false
          }));
        }
        /**
         * Parse Typeson back into an obejct.
         * Initial arguments works identical to those of `JSON.parse()`.
         * @param {string} text
         * @param {function} reviver This JSON reviver has nothing to do with
         *   our revivers.
         * @param {object} opts
         * @returns {external:JSON}
         */
      }, {
        key: "parse",
        value: function parse(text, reviver, opts) {
          opts = _objectSpread2({}, this.options, {}, opts, {
            parse: true
          });
          return this.revive(JSON.parse(text, reviver), opts);
        }
        /**
        * Also sync but throws on non-sync result.
        * @param {string} text
        * @param {function} reviver This JSON reviver has nothing to do with
        *   our revivers.
        * @param {object} opts
        * @returns {external:JSON}
        */
      }, {
        key: "parseSync",
        value: function parseSync(text, reviver, opts) {
          return this.parse(text, reviver, _objectSpread2({
            throwOnBadSyncType: true
          }, opts, {
            sync: true
          }));
        }
        /**
        * @param {string} text
        * @param {function} reviver This JSON reviver has nothing to do with
        *   our revivers.
        * @param {object} opts
        * @returns {Promise} Resolves to `external:JSON`
        */
      }, {
        key: "parseAsync",
        value: function parseAsync(text, reviver, opts) {
          return this.parse(text, reviver, _objectSpread2({
            throwOnBadSyncType: true
          }, opts, {
            sync: false
          }));
        }
        /**
         *
         * @param {Any} obj
         * @param {object} stateObj
         * @param {object} [opts={}]
         * @returns {string[]|false}
         */
      }, {
        key: "specialTypeNames",
        value: function specialTypeNames(obj, stateObj) {
          var opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          opts.returnTypeNames = true;
          return this.encapsulate(obj, stateObj, opts);
        }
        /**
         *
         * @param {Any} obj
         * @param {PlainObject} stateObj
         * @param {PlainObject} [opts={}]
         * @returns {Promise|GenericArray|PlainObject|string|false}
         */
      }, {
        key: "rootTypeName",
        value: function rootTypeName(obj, stateObj) {
          var opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          opts.iterateNone = true;
          return this.encapsulate(obj, stateObj, opts);
        }
        /**
         * Encapsulate a complex object into a plain Object by replacing
         * registered types with plain objects representing the types data.
         *
         * This method is used internally by `Typeson.stringify()`.
         * @param {Any} obj - Object to encapsulate.
         * @param {PlainObject} stateObj
         * @param {PlainObject} opts
         * @returns {Promise|GenericArray|PlainObject|string|false}
         */
      }, {
        key: "encapsulate",
        value: function encapsulate(obj, stateObj, opts) {
          opts = _objectSpread2({
            sync: true
          }, this.options, {}, opts);
          var _opts = opts, sync = _opts.sync;
          var that = this, types = {}, refObjs = [], refKeys = [], promisesDataRoot = [];
          var cyclic = "cyclic" in opts ? opts.cyclic : true;
          var _opts2 = opts, encapsulateObserver = _opts2.encapsulateObserver;
          var ret = _encapsulate("", obj, cyclic, stateObj || {}, promisesDataRoot);
          function finish(ret2) {
            var typeNames = Object.values(types);
            if (opts.iterateNone) {
              if (typeNames.length) {
                return typeNames[0];
              }
              return Typeson2.getJSONType(ret2);
            }
            if (typeNames.length) {
              if (opts.returnTypeNames) {
                return _toConsumableArray(new Set(typeNames));
              }
              if (!ret2 || !isPlainObject(ret2) || // Also need to handle if this is an object with its
              //   own `$types` property (to avoid ambiguity)
              hasOwn$1.call(ret2, "$types")) {
                ret2 = {
                  $: ret2,
                  $types: {
                    $: types
                  }
                };
              } else {
                ret2.$types = types;
              }
            } else if (isObject(ret2) && hasOwn$1.call(ret2, "$types")) {
              ret2 = {
                $: ret2,
                $types: true
              };
            }
            if (opts.returnTypeNames) {
              return false;
            }
            return ret2;
          }
          function checkPromises(_x, _x2) {
            return _checkPromises.apply(this, arguments);
          }
          function _checkPromises() {
            _checkPromises = _asyncToGenerator(
              /* @__PURE__ */ regeneratorRuntime.mark(function _callee2(ret2, promisesData) {
                var promResults;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return Promise.all(promisesData.map(function(pd) {
                          return pd[1].p;
                        }));
                      case 2:
                        promResults = _context2.sent;
                        _context2.next = 5;
                        return Promise.all(promResults.map(
                          /* @__PURE__ */ function() {
                            var _ref2 = _asyncToGenerator(
                              /* @__PURE__ */ regeneratorRuntime.mark(function _callee(promResult) {
                                var newPromisesData, _promisesData$splice, _promisesData$splice2, prData, _prData, keyPath, cyclic2, stateObj2, parentObj, key, detectedType, encaps, isTypesonPromise, encaps2;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                  while (1) {
                                    switch (_context.prev = _context.next) {
                                      case 0:
                                        newPromisesData = [];
                                        _promisesData$splice = promisesData.splice(0, 1), _promisesData$splice2 = _slicedToArray(_promisesData$splice, 1), prData = _promisesData$splice2[0];
                                        _prData = _slicedToArray(prData, 7), keyPath = _prData[0], cyclic2 = _prData[2], stateObj2 = _prData[3], parentObj = _prData[4], key = _prData[5], detectedType = _prData[6];
                                        encaps = _encapsulate(keyPath, promResult, cyclic2, stateObj2, newPromisesData, true, detectedType);
                                        isTypesonPromise = hasConstructorOf(encaps, TypesonPromise);
                                        if (!(keyPath && isTypesonPromise)) {
                                          _context.next = 11;
                                          break;
                                        }
                                        _context.next = 8;
                                        return encaps.p;
                                      case 8:
                                        encaps2 = _context.sent;
                                        parentObj[key] = encaps2;
                                        return _context.abrupt("return", checkPromises(ret2, newPromisesData));
                                      case 11:
                                        if (keyPath) {
                                          parentObj[key] = encaps;
                                        } else if (isTypesonPromise) {
                                          ret2 = encaps.p;
                                        } else {
                                          ret2 = encaps;
                                        }
                                        return _context.abrupt("return", checkPromises(ret2, newPromisesData));
                                      case 13:
                                      case "end":
                                        return _context.stop();
                                    }
                                  }
                                }, _callee);
                              })
                            );
                            return function(_x3) {
                              return _ref2.apply(this, arguments);
                            };
                          }()
                        ));
                      case 5:
                        return _context2.abrupt("return", ret2);
                      case 6:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              })
            );
            return _checkPromises.apply(this, arguments);
          }
          function _adaptBuiltinStateObjectProperties(stateObj2, ownKeysObj, cb) {
            Object.assign(stateObj2, ownKeysObj);
            var vals = internalStateObjPropsToIgnore.map(function(prop) {
              var tmp = stateObj2[prop];
              delete stateObj2[prop];
              return tmp;
            });
            cb();
            internalStateObjPropsToIgnore.forEach(function(prop, i) {
              stateObj2[prop] = vals[i];
            });
          }
          function _encapsulate(keypath, value, cyclic2, stateObj2, promisesData, resolvingTypesonPromise, detectedType) {
            var ret2;
            var observerData = {};
            var $typeof = _typeof(value);
            var runObserver = encapsulateObserver ? function(obj2) {
              var type2 = detectedType || stateObj2.type || Typeson2.getJSONType(value);
              encapsulateObserver(Object.assign(obj2 || observerData, {
                keypath,
                value,
                cyclic: cyclic2,
                stateObj: stateObj2,
                promisesData,
                resolvingTypesonPromise,
                awaitingTypesonPromise: hasConstructorOf(value, TypesonPromise)
              }, {
                type: type2
              }));
            } : null;
            if (["string", "boolean", "number", "undefined"].includes($typeof)) {
              if (value === void 0 || $typeof === "number" && (isNaN(value) || value === -Infinity || value === Infinity)) {
                if (stateObj2.replaced) {
                  ret2 = value;
                } else {
                  ret2 = replace(keypath, value, stateObj2, promisesData, false, resolvingTypesonPromise, runObserver);
                }
                if (ret2 !== value) {
                  observerData = {
                    replaced: ret2
                  };
                }
              } else {
                ret2 = value;
              }
              if (runObserver) {
                runObserver();
              }
              return ret2;
            }
            if (value === null) {
              if (runObserver) {
                runObserver();
              }
              return value;
            }
            if (cyclic2 && !stateObj2.iterateIn && !stateObj2.iterateUnsetNumeric && value && _typeof(value) === "object") {
              var refIndex = refObjs.indexOf(value);
              if (refIndex < 0) {
                if (cyclic2 === true) {
                  refObjs.push(value);
                  refKeys.push(keypath);
                }
              } else {
                types[keypath] = "#";
                if (runObserver) {
                  runObserver({
                    cyclicKeypath: refKeys[refIndex]
                  });
                }
                return "#" + refKeys[refIndex];
              }
            }
            var isPlainObj = isPlainObject(value);
            var isArr = isArray2(value);
            var replaced = (
              // Running replace will cause infinite loop as will test
              //   positive again
              (isPlainObj || isArr) && (!that.plainObjectReplacers.length || stateObj2.replaced) || stateObj2.iterateIn ? (
                // Optimization: if plain object and no plain-object
                //   replacers, don't try finding a replacer
                value
              ) : replace(keypath, value, stateObj2, promisesData, isPlainObj || isArr, null, runObserver)
            );
            var clone;
            if (replaced !== value) {
              ret2 = replaced;
              observerData = {
                replaced
              };
            } else {
              if (keypath === "" && hasConstructorOf(value, TypesonPromise)) {
                promisesData.push([keypath, value, cyclic2, stateObj2, void 0, void 0, stateObj2.type]);
                ret2 = value;
              } else if (isArr && stateObj2.iterateIn !== "object" || stateObj2.iterateIn === "array") {
                clone = new Array(value.length);
                observerData = {
                  clone
                };
              } else if (!["function", "symbol"].includes(_typeof(value)) && !("toJSON" in value) && !hasConstructorOf(value, TypesonPromise) && !hasConstructorOf(value, Promise) && !hasConstructorOf(value, ArrayBuffer) || isPlainObj || stateObj2.iterateIn === "object") {
                clone = {};
                if (stateObj2.addLength) {
                  clone.length = value.length;
                }
                observerData = {
                  clone
                };
              } else {
                ret2 = value;
              }
            }
            if (runObserver) {
              runObserver();
            }
            if (opts.iterateNone) {
              return clone || ret2;
            }
            if (!clone) {
              return ret2;
            }
            if (stateObj2.iterateIn) {
              var _loop = function _loop3(key2) {
                var ownKeysObj = {
                  ownKeys: hasOwn$1.call(value, key2)
                };
                _adaptBuiltinStateObjectProperties(stateObj2, ownKeysObj, function() {
                  var kp = keypath + (keypath ? "." : "") + escapeKeyPathComponent(key2);
                  var val = _encapsulate(kp, value[key2], Boolean(cyclic2), stateObj2, promisesData, resolvingTypesonPromise);
                  if (hasConstructorOf(val, TypesonPromise)) {
                    promisesData.push([kp, val, Boolean(cyclic2), stateObj2, clone, key2, stateObj2.type]);
                  } else if (val !== void 0) {
                    clone[key2] = val;
                  }
                });
              };
              for (var key in value) {
                _loop(key);
              }
              if (runObserver) {
                runObserver({
                  endIterateIn: true,
                  end: true
                });
              }
            } else {
              keys2(value).forEach(function(key2) {
                var kp = keypath + (keypath ? "." : "") + escapeKeyPathComponent(key2);
                var ownKeysObj = {
                  ownKeys: true
                };
                _adaptBuiltinStateObjectProperties(stateObj2, ownKeysObj, function() {
                  var val = _encapsulate(kp, value[key2], Boolean(cyclic2), stateObj2, promisesData, resolvingTypesonPromise);
                  if (hasConstructorOf(val, TypesonPromise)) {
                    promisesData.push([kp, val, Boolean(cyclic2), stateObj2, clone, key2, stateObj2.type]);
                  } else if (val !== void 0) {
                    clone[key2] = val;
                  }
                });
              });
              if (runObserver) {
                runObserver({
                  endIterateOwn: true,
                  end: true
                });
              }
            }
            if (stateObj2.iterateUnsetNumeric) {
              var vl = value.length;
              var _loop2 = function _loop22(i2) {
                if (!(i2 in value)) {
                  var kp = keypath + (keypath ? "." : "") + i2;
                  var ownKeysObj = {
                    ownKeys: false
                  };
                  _adaptBuiltinStateObjectProperties(stateObj2, ownKeysObj, function() {
                    var val = _encapsulate(kp, void 0, Boolean(cyclic2), stateObj2, promisesData, resolvingTypesonPromise);
                    if (hasConstructorOf(val, TypesonPromise)) {
                      promisesData.push([kp, val, Boolean(cyclic2), stateObj2, clone, i2, stateObj2.type]);
                    } else if (val !== void 0) {
                      clone[i2] = val;
                    }
                  });
                }
              };
              for (var i = 0; i < vl; i++) {
                _loop2(i);
              }
              if (runObserver) {
                runObserver({
                  endIterateUnsetNumeric: true,
                  end: true
                });
              }
            }
            return clone;
          }
          function replace(keypath, value, stateObj2, promisesData, plainObject, resolvingTypesonPromise, runObserver) {
            var replacers = plainObject ? that.plainObjectReplacers : that.nonplainObjectReplacers;
            var i = replacers.length;
            while (i--) {
              var replacer = replacers[i];
              if (replacer.test(value, stateObj2)) {
                var type2 = replacer.type;
                if (that.revivers[type2]) {
                  var existing = types[keypath];
                  types[keypath] = existing ? [type2].concat(existing) : type2;
                }
                Object.assign(stateObj2, {
                  type: type2,
                  replaced: true
                });
                if ((sync || !replacer.replaceAsync) && !replacer.replace) {
                  if (runObserver) {
                    runObserver({
                      typeDetected: true
                    });
                  }
                  return _encapsulate(keypath, value, cyclic && "readonly", stateObj2, promisesData, resolvingTypesonPromise, type2);
                }
                if (runObserver) {
                  runObserver({
                    replacing: true
                  });
                }
                var replaceMethod = sync || !replacer.replaceAsync ? "replace" : "replaceAsync";
                return _encapsulate(keypath, replacer[replaceMethod](value, stateObj2), cyclic && "readonly", stateObj2, promisesData, resolvingTypesonPromise, type2);
              }
            }
            return value;
          }
          return promisesDataRoot.length ? sync && opts.throwOnBadSyncType ? function() {
            throw new TypeError("Sync method requested but async result obtained");
          }() : Promise.resolve(checkPromises(ret, promisesDataRoot)).then(finish) : !sync && opts.throwOnBadSyncType ? function() {
            throw new TypeError("Async method requested but sync result obtained");
          }() : opts.stringification && sync ? [finish(ret)] : sync ? finish(ret) : Promise.resolve(finish(ret));
        }
        /**
         * Also sync but throws on non-sync result.
         * @param {*} obj
         * @param {object} stateObj
         * @param {object} opts
         * @returns {*}
         */
      }, {
        key: "encapsulateSync",
        value: function encapsulateSync(obj, stateObj, opts) {
          return this.encapsulate(obj, stateObj, _objectSpread2({
            throwOnBadSyncType: true
          }, opts, {
            sync: true
          }));
        }
        /**
         * @param {*} obj
         * @param {object} stateObj
         * @param {object} opts
         * @returns {*}
         */
      }, {
        key: "encapsulateAsync",
        value: function encapsulateAsync(obj, stateObj, opts) {
          return this.encapsulate(obj, stateObj, _objectSpread2({
            throwOnBadSyncType: true
          }, opts, {
            sync: false
          }));
        }
        /**
         * Revive an encapsulated object.
         * This method is used internally by `Typeson.parse()`.
         * @param {object} obj - Object to revive. If it has `$types` member, the
         *   properties that are listed there will be replaced with its true type
         *   instead of just plain objects.
         * @param {object} opts
         * @throws TypeError If mismatch between sync/async type and result
         * @returns {Promise|*} If async, returns a Promise that resolves to `*`
         */
      }, {
        key: "revive",
        value: function revive(obj, opts) {
          var types = obj && obj.$types;
          if (!types) {
            return obj;
          }
          if (types === true) {
            return obj.$;
          }
          opts = _objectSpread2({
            sync: true
          }, this.options, {}, opts);
          var _opts3 = opts, sync = _opts3.sync;
          var keyPathResolutions = [];
          var stateObj = {};
          var ignore$Types = true;
          if (types.$ && isPlainObject(types.$)) {
            obj = obj.$;
            types = types.$;
            ignore$Types = false;
          }
          var that = this;
          function executeReviver(type2, val) {
            var _ref2 = that.revivers[type2] || [], _ref3 = _slicedToArray(_ref2, 1), reviver = _ref3[0];
            if (!reviver) {
              throw new Error("Unregistered type: " + type2);
            }
            if (sync && !("revive" in reviver)) {
              return val;
            }
            return reviver[sync && reviver.revive ? "revive" : !sync && reviver.reviveAsync ? "reviveAsync" : "revive"](val, stateObj);
          }
          function revivePlainObjects() {
            var plainObjectTypes = [];
            Object.entries(types).forEach(function(_ref4) {
              var _ref5 = _slicedToArray(_ref4, 2), keypath = _ref5[0], type2 = _ref5[1];
              if (type2 === "#") {
                return;
              }
              [].concat(type2).forEach(function(type3) {
                var _ref6 = that.revivers[type3] || [null, {}], _ref7 = _slicedToArray(_ref6, 2), plain = _ref7[1].plain;
                if (!plain) {
                  return;
                }
                plainObjectTypes.push({
                  keypath,
                  type: type3
                });
                delete types[keypath];
              });
            });
            if (!plainObjectTypes.length) {
              return void 0;
            }
            return plainObjectTypes.sort(nestedPathsFirst).reduce(
              function reducer(possibleTypesonPromise2, _ref8) {
                var keypath = _ref8.keypath, type2 = _ref8.type;
                if (isThenable(possibleTypesonPromise2)) {
                  return possibleTypesonPromise2.then(function(val2) {
                    return reducer(val2, {
                      keypath,
                      type: type2
                    });
                  });
                }
                var val = getByKeyPath2(obj, keypath);
                val = executeReviver(type2, val);
                if (hasConstructorOf(val, TypesonPromise)) {
                  return val.then(function(v) {
                    var newVal2 = setAtKeyPath(obj, keypath, v);
                    if (newVal2 === v) {
                      obj = newVal2;
                    }
                    return void 0;
                  });
                }
                var newVal = setAtKeyPath(obj, keypath, val);
                if (newVal === val) {
                  obj = newVal;
                }
                return void 0;
              },
              void 0
              // This argument must be explicit
            );
          }
          var revivalPromises = [];
          function _revive(keypath, value, target, clone, key) {
            if (ignore$Types && keypath === "$types") {
              return void 0;
            }
            var type2 = types[keypath];
            var isArr = isArray2(value);
            if (isArr || isPlainObject(value)) {
              var _clone = isArr ? new Array(value.length) : {};
              keys2(value).forEach(function(k2) {
                var val2 = _revive(keypath + (keypath ? "." : "") + escapeKeyPathComponent(k2), value[k2], target || _clone, _clone, k2);
                var set = function set2(v) {
                  if (hasConstructorOf(v, Undefined)) {
                    _clone[k2] = void 0;
                  } else if (v !== void 0) {
                    _clone[k2] = v;
                  }
                  return v;
                };
                if (hasConstructorOf(val2, TypesonPromise)) {
                  revivalPromises.push(val2.then(function(ret2) {
                    return set(ret2);
                  }));
                } else {
                  set(val2);
                }
              });
              value = _clone;
              while (keyPathResolutions.length) {
                var _keyPathResolutions$ = _slicedToArray(keyPathResolutions[0], 4), _target = _keyPathResolutions$[0], keyPath = _keyPathResolutions$[1], _clone2 = _keyPathResolutions$[2], k = _keyPathResolutions$[3];
                var val = getByKeyPath2(_target, keyPath);
                if (val !== void 0) {
                  _clone2[k] = val;
                } else {
                  break;
                }
                keyPathResolutions.splice(0, 1);
              }
            }
            if (!type2) {
              return value;
            }
            if (type2 === "#") {
              var _ret = getByKeyPath2(target, value.slice(1));
              if (_ret === void 0) {
                keyPathResolutions.push([target, value.slice(1), clone, key]);
              }
              return _ret;
            }
            return [].concat(type2).reduce(function reducer(val2, typ) {
              if (hasConstructorOf(val2, TypesonPromise)) {
                return val2.then(function(v) {
                  return reducer(v, typ);
                });
              }
              return executeReviver(typ, val2);
            }, value);
          }
          function checkUndefined(retrn) {
            return hasConstructorOf(retrn, Undefined) ? void 0 : retrn;
          }
          var possibleTypesonPromise = revivePlainObjects();
          var ret;
          if (hasConstructorOf(possibleTypesonPromise, TypesonPromise)) {
            ret = possibleTypesonPromise.then(function() {
              return obj;
            });
          } else {
            ret = _revive("", obj, null);
            if (revivalPromises.length) {
              ret = TypesonPromise.resolve(ret).then(function(r) {
                return TypesonPromise.all([
                  // May be a TypesonPromise or not
                  r
                ].concat(revivalPromises));
              }).then(function(_ref9) {
                var _ref10 = _slicedToArray(_ref9, 1), r = _ref10[0];
                return r;
              });
            }
          }
          return isThenable(ret) ? sync && opts.throwOnBadSyncType ? function() {
            throw new TypeError("Sync method requested but async result obtained");
          }() : hasConstructorOf(ret, TypesonPromise) ? ret.p.then(checkUndefined) : ret : !sync && opts.throwOnBadSyncType ? function() {
            throw new TypeError("Async method requested but sync result obtained");
          }() : sync ? checkUndefined(ret) : Promise.resolve(checkUndefined(ret));
        }
        /**
         * Also sync but throws on non-sync result.
         * @param {Any} obj
         * @param {object} opts
         * @returns {Any}
         */
      }, {
        key: "reviveSync",
        value: function reviveSync(obj, opts) {
          return this.revive(obj, _objectSpread2({
            throwOnBadSyncType: true
          }, opts, {
            sync: true
          }));
        }
        /**
        * @param {Any} obj
        * @param {object} opts
        * @returns {Promise} Resolves to `*`
        */
      }, {
        key: "reviveAsync",
        value: function reviveAsync(obj, opts) {
          return this.revive(obj, _objectSpread2({
            throwOnBadSyncType: true
          }, opts, {
            sync: false
          }));
        }
        /**
         * Register types.
         * For examples on how to use this method, see
         *   {@link https://github.com/dfahlander/typeson-registry/tree/master/types}.
         * @param {object.<string,Function[]>[]} typeSpecSets - Types and
         *   their functions [test, encapsulate, revive];
         * @param {object} opts
         * @returns {Typeson}
         */
      }, {
        key: "register",
        value: function register(typeSpecSets, opts) {
          opts = opts || {};
          [].concat(typeSpecSets).forEach(function R(typeSpec) {
            var _this = this;
            if (isArray2(typeSpec)) {
              return typeSpec.map(function(typSpec) {
                return R.call(_this, typSpec);
              });
            }
            typeSpec && keys2(typeSpec).forEach(function(typeId) {
              if (typeId === "#") {
                throw new TypeError("# cannot be used as a type name as it is reserved for cyclic objects");
              } else if (Typeson2.JSON_TYPES.includes(typeId)) {
                throw new TypeError("Plain JSON object types are reserved as type names");
              }
              var spec = typeSpec[typeId];
              var replacers = spec && spec.testPlainObjects ? this.plainObjectReplacers : this.nonplainObjectReplacers;
              var existingReplacer = replacers.filter(function(r) {
                return r.type === typeId;
              });
              if (existingReplacer.length) {
                replacers.splice(replacers.indexOf(existingReplacer[0]), 1);
                delete this.revivers[typeId];
                delete this.types[typeId];
              }
              if (typeof spec === "function") {
                var Class = spec;
                spec = {
                  test: function test2(x) {
                    return x && x.constructor === Class;
                  },
                  replace: function replace2(x) {
                    return _objectSpread2({}, x);
                  },
                  revive: function revive2(x) {
                    return Object.assign(Object.create(Class.prototype), x);
                  }
                };
              } else if (isArray2(spec)) {
                var _spec = spec, _spec2 = _slicedToArray(_spec, 3), test = _spec2[0], replace = _spec2[1], revive = _spec2[2];
                spec = {
                  test,
                  replace,
                  revive
                };
              }
              if (!spec || !spec.test) {
                return;
              }
              var replacerObj = {
                type: typeId,
                test: spec.test.bind(spec)
              };
              if (spec.replace) {
                replacerObj.replace = spec.replace.bind(spec);
              }
              if (spec.replaceAsync) {
                replacerObj.replaceAsync = spec.replaceAsync.bind(spec);
              }
              var start = typeof opts.fallback === "number" ? opts.fallback : opts.fallback ? 0 : Infinity;
              if (spec.testPlainObjects) {
                this.plainObjectReplacers.splice(start, 0, replacerObj);
              } else {
                this.nonplainObjectReplacers.splice(start, 0, replacerObj);
              }
              if (spec.revive || spec.reviveAsync) {
                var reviverObj = {};
                if (spec.revive) {
                  reviverObj.revive = spec.revive.bind(spec);
                }
                if (spec.reviveAsync) {
                  reviverObj.reviveAsync = spec.reviveAsync.bind(spec);
                }
                this.revivers[typeId] = [reviverObj, {
                  plain: spec.testPlainObjects
                }];
              }
              this.types[typeId] = spec;
            }, this);
          }, this);
          return this;
        }
      }]);
      return Typeson2;
    }();
    var Undefined = function Undefined2() {
      _classCallCheck(this, Undefined2);
    };
    Undefined.__typeson__type__ = "TypesonUndefined";
    Typeson.Undefined = Undefined;
    Typeson.Promise = TypesonPromise;
    Typeson.isThenable = isThenable;
    Typeson.toStringTag = toStringTag2;
    Typeson.hasConstructorOf = hasConstructorOf;
    Typeson.isObject = isObject;
    Typeson.isPlainObject = isPlainObject;
    Typeson.isUserObject = isUserObject;
    Typeson.escapeKeyPathComponent = escapeKeyPathComponent;
    Typeson.unescapeKeyPathComponent = unescapeKeyPathComponent;
    Typeson.getByKeyPath = getByKeyPath2;
    Typeson.getJSONType = getJSONType;
    Typeson.JSON_TYPES = ["null", "boolean", "number", "string", "array", "object"];
    return Typeson;
  });
});
var structuredCloning = createCommonjsModule(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    function _typeof$1(e2) {
      return (_typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
        return typeof e3;
      } : function(e3) {
        return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
      })(e2);
    }
    function _classCallCheck$1(e2, t2) {
      if (!(e2 instanceof t2)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties$1(e2, t2) {
      for (var r2 = 0; r2 < t2.length; r2++) {
        var n2 = t2[r2];
        n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e2, n2.key, n2);
      }
    }
    function _defineProperty$1(e2, t2, r2) {
      return t2 in e2 ? Object.defineProperty(e2, t2, { value: r2, enumerable: true, configurable: true, writable: true }) : e2[t2] = r2, e2;
    }
    function ownKeys$1(e2, t2) {
      var r2 = Object.keys(e2);
      if (Object.getOwnPropertySymbols) {
        var n2 = Object.getOwnPropertySymbols(e2);
        t2 && (n2 = n2.filter(function(t3) {
          return Object.getOwnPropertyDescriptor(e2, t3).enumerable;
        })), r2.push.apply(r2, n2);
      }
      return r2;
    }
    function _toConsumableArray$1(e2) {
      return function _arrayWithoutHoles$1(e3) {
        if (Array.isArray(e3)) return _arrayLikeToArray$1(e3);
      }(e2) || function _iterableToArray$1(e3) {
        if ("undefined" != typeof Symbol && Symbol.iterator in Object(e3)) return Array.from(e3);
      }(e2) || function _unsupportedIterableToArray$1(e3, t2) {
        if (!e3) return;
        if ("string" == typeof e3) return _arrayLikeToArray$1(e3, t2);
        var r2 = Object.prototype.toString.call(e3).slice(8, -1);
        "Object" === r2 && e3.constructor && (r2 = e3.constructor.name);
        if ("Map" === r2 || "Set" === r2) return Array.from(e3);
        if ("Arguments" === r2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r2)) return _arrayLikeToArray$1(e3, t2);
      }(e2) || function _nonIterableSpread$1() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }();
    }
    function _arrayLikeToArray$1(e2, t2) {
      (null == t2 || t2 > e2.length) && (t2 = e2.length);
      for (var r2 = 0, n2 = new Array(t2); r2 < t2; r2++) n2[r2] = e2[r2];
      return n2;
    }
    function _typeof(e2) {
      return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof2(e3) {
        return typeof e3;
      } : function _typeof2(e3) {
        return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
      })(e2);
    }
    function _classCallCheck(e2, t2) {
      if (!(e2 instanceof t2)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(e2, t2) {
      for (var r2 = 0; r2 < t2.length; r2++) {
        var n2 = t2[r2];
        n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e2, n2.key, n2);
      }
    }
    function _defineProperty(e2, t2, r2) {
      return t2 in e2 ? Object.defineProperty(e2, t2, { value: r2, enumerable: true, configurable: true, writable: true }) : e2[t2] = r2, e2;
    }
    function ownKeys(e2, t2) {
      var r2 = Object.keys(e2);
      if (Object.getOwnPropertySymbols) {
        var n2 = Object.getOwnPropertySymbols(e2);
        t2 && (n2 = n2.filter(function(t3) {
          return Object.getOwnPropertyDescriptor(e2, t3).enumerable;
        })), r2.push.apply(r2, n2);
      }
      return r2;
    }
    function _objectSpread2(e2) {
      for (var t2 = 1; t2 < arguments.length; t2++) {
        var r2 = null != arguments[t2] ? arguments[t2] : {};
        t2 % 2 ? ownKeys(Object(r2), true).forEach(function(t3) {
          _defineProperty(e2, t3, r2[t3]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(r2)) : ownKeys(Object(r2)).forEach(function(t3) {
          Object.defineProperty(e2, t3, Object.getOwnPropertyDescriptor(r2, t3));
        });
      }
      return e2;
    }
    function _slicedToArray(e2, t2) {
      return function _arrayWithHoles(e3) {
        if (Array.isArray(e3)) return e3;
      }(e2) || function _iterableToArrayLimit(e3, t3) {
        if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e3))) return;
        var r2 = [], n2 = true, i2 = false, o2 = void 0;
        try {
          for (var a2, c2 = e3[Symbol.iterator](); !(n2 = (a2 = c2.next()).done) && (r2.push(a2.value), !t3 || r2.length !== t3); n2 = true) ;
        } catch (e4) {
          i2 = true, o2 = e4;
        } finally {
          try {
            n2 || null == c2.return || c2.return();
          } finally {
            if (i2) throw o2;
          }
        }
        return r2;
      }(e2, t2) || _unsupportedIterableToArray(e2, t2) || function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }();
    }
    function _toConsumableArray(e2) {
      return function _arrayWithoutHoles(e3) {
        if (Array.isArray(e3)) return _arrayLikeToArray(e3);
      }(e2) || function _iterableToArray(e3) {
        if ("undefined" != typeof Symbol && Symbol.iterator in Object(e3)) return Array.from(e3);
      }(e2) || _unsupportedIterableToArray(e2) || function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }();
    }
    function _unsupportedIterableToArray(e2, t2) {
      if (e2) {
        if ("string" == typeof e2) return _arrayLikeToArray(e2, t2);
        var r2 = Object.prototype.toString.call(e2).slice(8, -1);
        return "Object" === r2 && e2.constructor && (r2 = e2.constructor.name), "Map" === r2 || "Set" === r2 ? Array.from(e2) : "Arguments" === r2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r2) ? _arrayLikeToArray(e2, t2) : void 0;
      }
    }
    function _arrayLikeToArray(e2, t2) {
      (null == t2 || t2 > e2.length) && (t2 = e2.length);
      for (var r2 = 0, n2 = new Array(t2); r2 < t2; r2++) n2[r2] = e2[r2];
      return n2;
    }
    var e = function TypesonPromise(e2) {
      _classCallCheck(this, TypesonPromise), this.p = new Promise(e2);
    };
    e.__typeson__type__ = "TypesonPromise", "undefined" != typeof Symbol && (e.prototype[Symbol.toStringTag] = "TypesonPromise"), e.prototype.then = function(t2, r2) {
      var n2 = this;
      return new e(function(e2, i2) {
        n2.p.then(function(r3) {
          e2(t2 ? t2(r3) : r3);
        }).catch(function(e3) {
          return r2 ? r2(e3) : Promise.reject(e3);
        }).then(e2, i2);
      });
    }, e.prototype.catch = function(e2) {
      return this.then(null, e2);
    }, e.resolve = function(t2) {
      return new e(function(e2) {
        e2(t2);
      });
    }, e.reject = function(t2) {
      return new e(function(e2, r2) {
        r2(t2);
      });
    }, ["all", "race"].forEach(function(t2) {
      e[t2] = function(r2) {
        return new e(function(e2, n2) {
          Promise[t2](r2.map(function(e3) {
            return e3 && e3.constructor && "TypesonPromise" === e3.constructor.__typeson__type__ ? e3.p : e3;
          })).then(e2, n2);
        });
      };
    });
    var t = {}.toString, r = {}.hasOwnProperty, n = Object.getPrototypeOf, i = r.toString;
    function isThenable(e2, t2) {
      return isObject(e2) && "function" == typeof e2.then && (!t2 || "function" == typeof e2.catch);
    }
    function toStringTag2(e2) {
      return t.call(e2).slice(8, -1);
    }
    function hasConstructorOf(e2, t2) {
      if (!e2 || "object" !== _typeof(e2)) return false;
      var o2 = n(e2);
      if (!o2) return null === t2;
      var a2 = r.call(o2, "constructor") && o2.constructor;
      return "function" != typeof a2 ? null === t2 : t2 === a2 || (null !== t2 && i.call(a2) === i.call(t2) || "function" == typeof t2 && "string" == typeof a2.__typeson__type__ && a2.__typeson__type__ === t2.__typeson__type__);
    }
    function isPlainObject(e2) {
      return !(!e2 || "Object" !== toStringTag2(e2)) && (!n(e2) || hasConstructorOf(e2, Object));
    }
    function isObject(e2) {
      return e2 && "object" === _typeof(e2);
    }
    function escapeKeyPathComponent(e2) {
      return e2.replace(/~/g, "~0").replace(/\./g, "~1");
    }
    function unescapeKeyPathComponent(e2) {
      return e2.replace(/~1/g, ".").replace(/~0/g, "~");
    }
    function getByKeyPath2(e2, t2) {
      if ("" === t2) return e2;
      var r2 = t2.indexOf(".");
      if (r2 > -1) {
        var n2 = e2[unescapeKeyPathComponent(t2.slice(0, r2))];
        return void 0 === n2 ? void 0 : getByKeyPath2(n2, t2.slice(r2 + 1));
      }
      return e2[unescapeKeyPathComponent(t2)];
    }
    function setAtKeyPath(e2, t2, r2) {
      if ("" === t2) return r2;
      var n2 = t2.indexOf(".");
      return n2 > -1 ? setAtKeyPath(e2[unescapeKeyPathComponent(t2.slice(0, n2))], t2.slice(n2 + 1), r2) : (e2[unescapeKeyPathComponent(t2)] = r2, e2);
    }
    function _await(e2, t2, r2) {
      return r2 ? t2 ? t2(e2) : e2 : (e2 && e2.then || (e2 = Promise.resolve(e2)), t2 ? e2.then(t2) : e2);
    }
    var o = Object.keys, a = Array.isArray, c = {}.hasOwnProperty, u = ["type", "replaced", "iterateIn", "iterateUnsetNumeric"];
    function _async(e2) {
      return function() {
        for (var t2 = [], r2 = 0; r2 < arguments.length; r2++) t2[r2] = arguments[r2];
        try {
          return Promise.resolve(e2.apply(this, t2));
        } catch (e3) {
          return Promise.reject(e3);
        }
      };
    }
    function nestedPathsFirst(e2, t2) {
      if ("" === e2.keypath) return -1;
      var r2 = e2.keypath.match(/\./g) || 0, n2 = t2.keypath.match(/\./g) || 0;
      return r2 && (r2 = r2.length), n2 && (n2 = n2.length), r2 > n2 ? -1 : r2 < n2 ? 1 : e2.keypath < t2.keypath ? -1 : e2.keypath > t2.keypath;
    }
    var s = function() {
      function Typeson(e2) {
        _classCallCheck(this, Typeson), this.options = e2, this.plainObjectReplacers = [], this.nonplainObjectReplacers = [], this.revivers = {}, this.types = {};
      }
      return function _createClass(e2, t2, r2) {
        return t2 && _defineProperties(e2.prototype, t2), r2 && _defineProperties(e2, r2), e2;
      }(Typeson, [{ key: "stringify", value: function stringify(e2, t2, r2, n2) {
        n2 = _objectSpread2(_objectSpread2(_objectSpread2({}, this.options), n2), {}, { stringification: true });
        var i2 = this.encapsulate(e2, null, n2);
        return a(i2) ? JSON.stringify(i2[0], t2, r2) : i2.then(function(e3) {
          return JSON.stringify(e3, t2, r2);
        });
      } }, { key: "stringifySync", value: function stringifySync(e2, t2, r2, n2) {
        return this.stringify(e2, t2, r2, _objectSpread2(_objectSpread2({ throwOnBadSyncType: true }, n2), {}, { sync: true }));
      } }, { key: "stringifyAsync", value: function stringifyAsync(e2, t2, r2, n2) {
        return this.stringify(e2, t2, r2, _objectSpread2(_objectSpread2({ throwOnBadSyncType: true }, n2), {}, { sync: false }));
      } }, { key: "parse", value: function parse(e2, t2, r2) {
        return r2 = _objectSpread2(_objectSpread2(_objectSpread2({}, this.options), r2), {}, { parse: true }), this.revive(JSON.parse(e2, t2), r2);
      } }, { key: "parseSync", value: function parseSync(e2, t2, r2) {
        return this.parse(e2, t2, _objectSpread2(_objectSpread2({ throwOnBadSyncType: true }, r2), {}, { sync: true }));
      } }, { key: "parseAsync", value: function parseAsync(e2, t2, r2) {
        return this.parse(e2, t2, _objectSpread2(_objectSpread2({ throwOnBadSyncType: true }, r2), {}, { sync: false }));
      } }, { key: "specialTypeNames", value: function specialTypeNames(e2, t2) {
        var r2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        return r2.returnTypeNames = true, this.encapsulate(e2, t2, r2);
      } }, { key: "rootTypeName", value: function rootTypeName(e2, t2) {
        var r2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        return r2.iterateNone = true, this.encapsulate(e2, t2, r2);
      } }, { key: "encapsulate", value: function encapsulate(t2, r2, n2) {
        var i2 = _async(function(t3, r3) {
          return _await(Promise.all(r3.map(function(e2) {
            return e2[1].p;
          })), function(n3) {
            return _await(Promise.all(n3.map(_async(function(n4) {
              var o2 = false, a2 = [], c2 = _slicedToArray(r3.splice(0, 1), 1), u2 = _slicedToArray(c2[0], 7), s3 = u2[0], f3 = u2[2], l3 = u2[3], p3 = u2[4], y3 = u2[5], v3 = u2[6], b3 = _encapsulate(s3, n4, f3, l3, a2, true, v3), d3 = hasConstructorOf(b3, e);
              return function _invoke(e2, t4) {
                var r4 = e2();
                return r4 && r4.then ? r4.then(t4) : t4(r4);
              }(function() {
                if (s3 && d3) return _await(b3.p, function(e2) {
                  return p3[y3] = e2, o2 = true, i2(t3, a2);
                });
              }, function(e2) {
                return o2 ? e2 : (s3 ? p3[y3] = b3 : t3 = d3 ? b3.p : b3, i2(t3, a2));
              });
            }))), function() {
              return t3;
            });
          });
        }), s2 = (n2 = _objectSpread2(_objectSpread2({ sync: true }, this.options), n2)).sync, f2 = this, l2 = {}, p2 = [], y2 = [], v2 = [], b2 = !("cyclic" in n2) || n2.cyclic, d2 = n2.encapsulateObserver, h2 = _encapsulate("", t2, b2, r2 || {}, v2);
        function finish(e2) {
          var t3 = Object.values(l2);
          if (n2.iterateNone) return t3.length ? t3[0] : Typeson.getJSONType(e2);
          if (t3.length) {
            if (n2.returnTypeNames) return _toConsumableArray(new Set(t3));
            e2 && isPlainObject(e2) && !c.call(e2, "$types") ? e2.$types = l2 : e2 = { $: e2, $types: { $: l2 } };
          } else isObject(e2) && c.call(e2, "$types") && (e2 = { $: e2, $types: true });
          return !n2.returnTypeNames && e2;
        }
        function _adaptBuiltinStateObjectProperties(e2, t3, r3) {
          Object.assign(e2, t3);
          var n3 = u.map(function(t4) {
            var r4 = e2[t4];
            return delete e2[t4], r4;
          });
          r3(), u.forEach(function(t4, r4) {
            e2[t4] = n3[r4];
          });
        }
        function _encapsulate(t3, r3, i3, u2, s3, v3, b3) {
          var h3, g2 = {}, m2 = _typeof(r3), O2 = d2 ? function(n3) {
            var o2 = b3 || u2.type || Typeson.getJSONType(r3);
            d2(Object.assign(n3 || g2, { keypath: t3, value: r3, cyclic: i3, stateObj: u2, promisesData: s3, resolvingTypesonPromise: v3, awaitingTypesonPromise: hasConstructorOf(r3, e) }, { type: o2 }));
          } : null;
          if (["string", "boolean", "number", "undefined"].includes(m2)) return void 0 === r3 || Number.isNaN(r3) || r3 === Number.NEGATIVE_INFINITY || r3 === Number.POSITIVE_INFINITY ? (h3 = u2.replaced ? r3 : replace(t3, r3, u2, s3, false, v3, O2)) !== r3 && (g2 = { replaced: h3 }) : h3 = r3, O2 && O2(), h3;
          if (null === r3) return O2 && O2(), r3;
          if (i3 && !u2.iterateIn && !u2.iterateUnsetNumeric && r3 && "object" === _typeof(r3)) {
            var _2 = p2.indexOf(r3);
            if (!(_2 < 0)) return l2[t3] = "#", O2 && O2({ cyclicKeypath: y2[_2] }), "#" + y2[_2];
            true === i3 && (p2.push(r3), y2.push(t3));
          }
          var j2, S2 = isPlainObject(r3), T2 = a(r3), w2 = (S2 || T2) && (!f2.plainObjectReplacers.length || u2.replaced) || u2.iterateIn ? r3 : replace(t3, r3, u2, s3, S2 || T2, null, O2);
          if (w2 !== r3 ? (h3 = w2, g2 = { replaced: w2 }) : "" === t3 && hasConstructorOf(r3, e) ? (s3.push([t3, r3, i3, u2, void 0, void 0, u2.type]), h3 = r3) : T2 && "object" !== u2.iterateIn || "array" === u2.iterateIn ? (j2 = new Array(r3.length), g2 = { clone: j2 }) : (["function", "symbol"].includes(_typeof(r3)) || "toJSON" in r3 || hasConstructorOf(r3, e) || hasConstructorOf(r3, Promise) || hasConstructorOf(r3, ArrayBuffer)) && !S2 && "object" !== u2.iterateIn ? h3 = r3 : (j2 = {}, u2.addLength && (j2.length = r3.length), g2 = { clone: j2 }), O2 && O2(), n2.iterateNone) return j2 || h3;
          if (!j2) return h3;
          if (u2.iterateIn) {
            var A2 = function _loop(n3) {
              var o2 = { ownKeys: c.call(r3, n3) };
              _adaptBuiltinStateObjectProperties(u2, o2, function() {
                var o3 = t3 + (t3 ? "." : "") + escapeKeyPathComponent(n3), a2 = _encapsulate(o3, r3[n3], Boolean(i3), u2, s3, v3);
                hasConstructorOf(a2, e) ? s3.push([o3, a2, Boolean(i3), u2, j2, n3, u2.type]) : void 0 !== a2 && (j2[n3] = a2);
              });
            };
            for (var P2 in r3) A2(P2);
            O2 && O2({ endIterateIn: true, end: true });
          } else o(r3).forEach(function(n3) {
            var o2 = t3 + (t3 ? "." : "") + escapeKeyPathComponent(n3);
            _adaptBuiltinStateObjectProperties(u2, { ownKeys: true }, function() {
              var t4 = _encapsulate(o2, r3[n3], Boolean(i3), u2, s3, v3);
              hasConstructorOf(t4, e) ? s3.push([o2, t4, Boolean(i3), u2, j2, n3, u2.type]) : void 0 !== t4 && (j2[n3] = t4);
            });
          }), O2 && O2({ endIterateOwn: true, end: true });
          if (u2.iterateUnsetNumeric) {
            for (var I2 = r3.length, C2 = function _loop2(n3) {
              if (!(n3 in r3)) {
                var o2 = t3 + (t3 ? "." : "") + n3;
                _adaptBuiltinStateObjectProperties(u2, { ownKeys: false }, function() {
                  var t4 = _encapsulate(o2, void 0, Boolean(i3), u2, s3, v3);
                  hasConstructorOf(t4, e) ? s3.push([o2, t4, Boolean(i3), u2, j2, n3, u2.type]) : void 0 !== t4 && (j2[n3] = t4);
                });
              }
            }, N2 = 0; N2 < I2; N2++) C2(N2);
            O2 && O2({ endIterateUnsetNumeric: true, end: true });
          }
          return j2;
        }
        function replace(e2, t3, r3, n3, i3, o2, a2) {
          for (var c2 = i3 ? f2.plainObjectReplacers : f2.nonplainObjectReplacers, u2 = c2.length; u2--; ) {
            var p3 = c2[u2];
            if (p3.test(t3, r3)) {
              var y3 = p3.type;
              if (f2.revivers[y3]) {
                var v3 = l2[e2];
                l2[e2] = v3 ? [y3].concat(v3) : y3;
              }
              return Object.assign(r3, { type: y3, replaced: true }), !s2 && p3.replaceAsync || p3.replace ? (a2 && a2({ replacing: true }), _encapsulate(e2, p3[s2 || !p3.replaceAsync ? "replace" : "replaceAsync"](t3, r3), b2 && "readonly", r3, n3, o2, y3)) : (a2 && a2({ typeDetected: true }), _encapsulate(e2, t3, b2 && "readonly", r3, n3, o2, y3));
            }
          }
          return t3;
        }
        return v2.length ? s2 && n2.throwOnBadSyncType ? function() {
          throw new TypeError("Sync method requested but async result obtained");
        }() : Promise.resolve(i2(h2, v2)).then(finish) : !s2 && n2.throwOnBadSyncType ? function() {
          throw new TypeError("Async method requested but sync result obtained");
        }() : n2.stringification && s2 ? [finish(h2)] : s2 ? finish(h2) : Promise.resolve(finish(h2));
      } }, { key: "encapsulateSync", value: function encapsulateSync(e2, t2, r2) {
        return this.encapsulate(e2, t2, _objectSpread2(_objectSpread2({ throwOnBadSyncType: true }, r2), {}, { sync: true }));
      } }, { key: "encapsulateAsync", value: function encapsulateAsync(e2, t2, r2) {
        return this.encapsulate(e2, t2, _objectSpread2(_objectSpread2({ throwOnBadSyncType: true }, r2), {}, { sync: false }));
      } }, { key: "revive", value: function revive(t2, r2) {
        var n2 = t2 && t2.$types;
        if (!n2) return t2;
        if (true === n2) return t2.$;
        var i2 = (r2 = _objectSpread2(_objectSpread2({ sync: true }, this.options), r2)).sync, c2 = [], u2 = {}, s2 = true;
        n2.$ && isPlainObject(n2.$) && (t2 = t2.$, n2 = n2.$, s2 = false);
        var l2 = this;
        function executeReviver(e2, t3) {
          var r3 = _slicedToArray(l2.revivers[e2] || [], 1)[0];
          if (!r3) throw new Error("Unregistered type: " + e2);
          return i2 && !("revive" in r3) ? t3 : r3[i2 && r3.revive ? "revive" : !i2 && r3.reviveAsync ? "reviveAsync" : "revive"](t3, u2);
        }
        var p2 = [];
        function checkUndefined(e2) {
          return hasConstructorOf(e2, f) ? void 0 : e2;
        }
        var y2, v2 = function revivePlainObjects() {
          var r3 = [];
          if (Object.entries(n2).forEach(function(e2) {
            var t3 = _slicedToArray(e2, 2), i3 = t3[0], o2 = t3[1];
            "#" !== o2 && [].concat(o2).forEach(function(e3) {
              _slicedToArray(l2.revivers[e3] || [null, {}], 2)[1].plain && (r3.push({ keypath: i3, type: e3 }), delete n2[i3]);
            });
          }), r3.length) return r3.sort(nestedPathsFirst).reduce(function reducer(r4, n3) {
            var i3 = n3.keypath, o2 = n3.type;
            if (isThenable(r4)) return r4.then(function(e2) {
              return reducer(e2, { keypath: i3, type: o2 });
            });
            var a2 = getByKeyPath2(t2, i3);
            if (hasConstructorOf(a2 = executeReviver(o2, a2), e)) return a2.then(function(e2) {
              var r5 = setAtKeyPath(t2, i3, e2);
              r5 === e2 && (t2 = r5);
            });
            var c3 = setAtKeyPath(t2, i3, a2);
            c3 === a2 && (t2 = c3);
          }, void 0);
        }();
        return hasConstructorOf(v2, e) ? y2 = v2.then(function() {
          return t2;
        }) : (y2 = function _revive(t3, r3, i3, u3, l3) {
          if (!s2 || "$types" !== t3) {
            var y3 = n2[t3], v3 = a(r3);
            if (v3 || isPlainObject(r3)) {
              var b2 = v3 ? new Array(r3.length) : {};
              for (o(r3).forEach(function(n3) {
                var o2 = _revive(t3 + (t3 ? "." : "") + escapeKeyPathComponent(n3), r3[n3], i3 || b2, b2, n3), a2 = function set(e2) {
                  return hasConstructorOf(e2, f) ? b2[n3] = void 0 : void 0 !== e2 && (b2[n3] = e2), e2;
                };
                hasConstructorOf(o2, e) ? p2.push(o2.then(function(e2) {
                  return a2(e2);
                })) : a2(o2);
              }), r3 = b2; c2.length; ) {
                var d2 = _slicedToArray(c2[0], 4), h2 = d2[0], g2 = d2[1], m2 = d2[2], O2 = d2[3], _2 = getByKeyPath2(h2, g2);
                if (void 0 === _2) break;
                m2[O2] = _2, c2.splice(0, 1);
              }
            }
            if (!y3) return r3;
            if ("#" === y3) {
              var j2 = getByKeyPath2(i3, r3.slice(1));
              return void 0 === j2 && c2.push([i3, r3.slice(1), u3, l3]), j2;
            }
            return [].concat(y3).reduce(function reducer(t4, r4) {
              return hasConstructorOf(t4, e) ? t4.then(function(e2) {
                return reducer(e2, r4);
              }) : executeReviver(r4, t4);
            }, r3);
          }
        }("", t2, null), p2.length && (y2 = e.resolve(y2).then(function(t3) {
          return e.all([t3].concat(p2));
        }).then(function(e2) {
          return _slicedToArray(e2, 1)[0];
        }))), isThenable(y2) ? i2 && r2.throwOnBadSyncType ? function() {
          throw new TypeError("Sync method requested but async result obtained");
        }() : hasConstructorOf(y2, e) ? y2.p.then(checkUndefined) : y2 : !i2 && r2.throwOnBadSyncType ? function() {
          throw new TypeError("Async method requested but sync result obtained");
        }() : i2 ? checkUndefined(y2) : Promise.resolve(checkUndefined(y2));
      } }, { key: "reviveSync", value: function reviveSync(e2, t2) {
        return this.revive(e2, _objectSpread2(_objectSpread2({ throwOnBadSyncType: true }, t2), {}, { sync: true }));
      } }, { key: "reviveAsync", value: function reviveAsync(e2, t2) {
        return this.revive(e2, _objectSpread2(_objectSpread2({ throwOnBadSyncType: true }, t2), {}, { sync: false }));
      } }, { key: "register", value: function register(e2, t2) {
        return t2 = t2 || {}, [].concat(e2).forEach(function R(e3) {
          var r2 = this;
          if (a(e3)) return e3.map(function(e4) {
            return R.call(r2, e4);
          });
          e3 && o(e3).forEach(function(r3) {
            if ("#" === r3) throw new TypeError("# cannot be used as a type name as it is reserved for cyclic objects");
            if (Typeson.JSON_TYPES.includes(r3)) throw new TypeError("Plain JSON object types are reserved as type names");
            var n2 = e3[r3], i2 = n2 && n2.testPlainObjects ? this.plainObjectReplacers : this.nonplainObjectReplacers, o2 = i2.filter(function(e4) {
              return e4.type === r3;
            });
            if (o2.length && (i2.splice(i2.indexOf(o2[0]), 1), delete this.revivers[r3], delete this.types[r3]), "function" == typeof n2) {
              var c2 = n2;
              n2 = { test: function test(e4) {
                return e4 && e4.constructor === c2;
              }, replace: function replace(e4) {
                return _objectSpread2({}, e4);
              }, revive: function revive(e4) {
                return Object.assign(Object.create(c2.prototype), e4);
              } };
            } else if (a(n2)) {
              var u2 = _slicedToArray(n2, 3);
              n2 = { test: u2[0], replace: u2[1], revive: u2[2] };
            }
            if (n2 && n2.test) {
              var s2 = { type: r3, test: n2.test.bind(n2) };
              n2.replace && (s2.replace = n2.replace.bind(n2)), n2.replaceAsync && (s2.replaceAsync = n2.replaceAsync.bind(n2));
              var f2 = "number" == typeof t2.fallback ? t2.fallback : t2.fallback ? 0 : Number.POSITIVE_INFINITY;
              if (n2.testPlainObjects ? this.plainObjectReplacers.splice(f2, 0, s2) : this.nonplainObjectReplacers.splice(f2, 0, s2), n2.revive || n2.reviveAsync) {
                var l2 = {};
                n2.revive && (l2.revive = n2.revive.bind(n2)), n2.reviveAsync && (l2.reviveAsync = n2.reviveAsync.bind(n2)), this.revivers[r3] = [l2, { plain: n2.testPlainObjects }];
              }
              this.types[r3] = n2;
            }
          }, this);
        }, this), this;
      } }]), Typeson;
    }(), f = function Undefined() {
      _classCallCheck(this, Undefined);
    };
    f.__typeson__type__ = "TypesonUndefined", s.Undefined = f, s.Promise = e, s.isThenable = isThenable, s.toStringTag = toStringTag2, s.hasConstructorOf = hasConstructorOf, s.isObject = isObject, s.isPlainObject = isPlainObject, s.isUserObject = function isUserObject(e2) {
      if (!e2 || "Object" !== toStringTag2(e2)) return false;
      var t2 = n(e2);
      return !t2 || (hasConstructorOf(e2, Object) || isUserObject(t2));
    }, s.escapeKeyPathComponent = escapeKeyPathComponent, s.unescapeKeyPathComponent = unescapeKeyPathComponent, s.getByKeyPath = getByKeyPath2, s.getJSONType = function getJSONType(e2) {
      return null === e2 ? "null" : Array.isArray(e2) ? "array" : _typeof(e2);
    }, s.JSON_TYPES = ["null", "boolean", "number", "string", "array", "object"];
    for (var l = { userObject: { test: function test(e2, t2) {
      return s.isUserObject(e2);
    }, replace: function replace(e2) {
      return function _objectSpread2$1(e3) {
        for (var t2 = 1; t2 < arguments.length; t2++) {
          var r2 = null != arguments[t2] ? arguments[t2] : {};
          t2 % 2 ? ownKeys$1(Object(r2), true).forEach(function(t3) {
            _defineProperty$1(e3, t3, r2[t3]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(r2)) : ownKeys$1(Object(r2)).forEach(function(t3) {
            Object.defineProperty(e3, t3, Object.getOwnPropertyDescriptor(r2, t3));
          });
        }
        return e3;
      }({}, e2);
    }, revive: function revive(e2) {
      return e2;
    } } }, p = [{ arrayNonindexKeys: { testPlainObjects: true, test: function test(e2, t2) {
      return !!Array.isArray(e2) && (Object.keys(e2).some(function(e3) {
        return String(Number.parseInt(e3)) !== e3;
      }) && (t2.iterateIn = "object", t2.addLength = true), true);
    }, replace: function replace(e2, t2) {
      return t2.iterateUnsetNumeric = true, e2;
    }, revive: function revive(e2) {
      if (Array.isArray(e2)) return e2;
      var t2 = [];
      return Object.keys(e2).forEach(function(r2) {
        var n2 = e2[r2];
        t2[r2] = n2;
      }), t2;
    } } }, { sparseUndefined: { test: function test(e2, t2) {
      return void 0 === e2 && false === t2.ownKeys;
    }, replace: function replace(e2) {
      return 0;
    }, revive: function revive(e2) {
    } } }], y = { undef: { test: function test(e2, t2) {
      return void 0 === e2 && (t2.ownKeys || !("ownKeys" in t2));
    }, replace: function replace(e2) {
      return 0;
    }, revive: function revive(e2) {
      return new s.Undefined();
    } } }, v = { StringObject: { test: function test(e2) {
      return "String" === s.toStringTag(e2) && "object" === _typeof$1(e2);
    }, replace: function replace(e2) {
      return String(e2);
    }, revive: function revive(e2) {
      return new String(e2);
    } }, BooleanObject: { test: function test(e2) {
      return "Boolean" === s.toStringTag(e2) && "object" === _typeof$1(e2);
    }, replace: function replace(e2) {
      return Boolean(e2);
    }, revive: function revive(e2) {
      return new Boolean(e2);
    } }, NumberObject: { test: function test(e2) {
      return "Number" === s.toStringTag(e2) && "object" === _typeof$1(e2);
    }, replace: function replace(e2) {
      return Number(e2);
    }, revive: function revive(e2) {
      return new Number(e2);
    } } }, b = [{ nan: { test: function test(e2) {
      return Number.isNaN(e2);
    }, replace: function replace(e2) {
      return "NaN";
    }, revive: function revive(e2) {
      return Number.NaN;
    } } }, { infinity: { test: function test(e2) {
      return e2 === Number.POSITIVE_INFINITY;
    }, replace: function replace(e2) {
      return "Infinity";
    }, revive: function revive(e2) {
      return Number.POSITIVE_INFINITY;
    } } }, { negativeInfinity: { test: function test(e2) {
      return e2 === Number.NEGATIVE_INFINITY;
    }, replace: function replace(e2) {
      return "-Infinity";
    }, revive: function revive(e2) {
      return Number.NEGATIVE_INFINITY;
    } } }], d = { date: { test: function test(e2) {
      return "Date" === s.toStringTag(e2);
    }, replace: function replace(e2) {
      var t2 = e2.getTime();
      return Number.isNaN(t2) ? "NaN" : t2;
    }, revive: function revive(e2) {
      return "NaN" === e2 ? new Date(Number.NaN) : new Date(e2);
    } } }, h = { regexp: { test: function test(e2) {
      return "RegExp" === s.toStringTag(e2);
    }, replace: function replace(e2) {
      return { source: e2.source, flags: (e2.global ? "g" : "") + (e2.ignoreCase ? "i" : "") + (e2.multiline ? "m" : "") + (e2.sticky ? "y" : "") + (e2.unicode ? "u" : "") };
    }, revive: function revive(e2) {
      var t2 = e2.source, r2 = e2.flags;
      return new RegExp(t2, r2);
    } } }, g = { map: { test: function test(e2) {
      return "Map" === s.toStringTag(e2);
    }, replace: function replace(e2) {
      return _toConsumableArray$1(e2.entries());
    }, revive: function revive(e2) {
      return new Map(e2);
    } } }, m = { set: { test: function test(e2) {
      return "Set" === s.toStringTag(e2);
    }, replace: function replace(e2) {
      return _toConsumableArray$1(e2.values());
    }, revive: function revive(e2) {
      return new Set(e2);
    } } }, O = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", _ = new Uint8Array(256), j = 0; j < O.length; j++) _[O.charCodeAt(j)] = j;
    var S = function encode3(e2, t2, r2) {
      null == r2 && (r2 = e2.byteLength);
      for (var n2 = new Uint8Array(e2, t2 || 0, r2), i2 = n2.length, o2 = "", a2 = 0; a2 < i2; a2 += 3) o2 += O[n2[a2] >> 2], o2 += O[(3 & n2[a2]) << 4 | n2[a2 + 1] >> 4], o2 += O[(15 & n2[a2 + 1]) << 2 | n2[a2 + 2] >> 6], o2 += O[63 & n2[a2 + 2]];
      return i2 % 3 == 2 ? o2 = o2.slice(0, -1) + "=" : i2 % 3 == 1 && (o2 = o2.slice(0, -2) + "=="), o2;
    }, T = function decode3(e2) {
      var t2, r2, n2, i2, o2 = e2.length, a2 = 0.75 * e2.length, c2 = 0;
      "=" === e2[e2.length - 1] && (a2--, "=" === e2[e2.length - 2] && a2--);
      for (var u2 = new ArrayBuffer(a2), s2 = new Uint8Array(u2), f2 = 0; f2 < o2; f2 += 4) t2 = _[e2.charCodeAt(f2)], r2 = _[e2.charCodeAt(f2 + 1)], n2 = _[e2.charCodeAt(f2 + 2)], i2 = _[e2.charCodeAt(f2 + 3)], s2[c2++] = t2 << 2 | r2 >> 4, s2[c2++] = (15 & r2) << 4 | n2 >> 2, s2[c2++] = (3 & n2) << 6 | 63 & i2;
      return u2;
    }, w = { arraybuffer: { test: function test(e2) {
      return "ArrayBuffer" === s.toStringTag(e2);
    }, replace: function replace(e2, t2) {
      t2.buffers || (t2.buffers = []);
      var r2 = t2.buffers.indexOf(e2);
      return r2 > -1 ? { index: r2 } : (t2.buffers.push(e2), S(e2));
    }, revive: function revive(e2, t2) {
      if (t2.buffers || (t2.buffers = []), "object" === _typeof$1(e2)) return t2.buffers[e2.index];
      var r2 = T(e2);
      return t2.buffers.push(r2), r2;
    } } }, A = "undefined" == typeof self ? commonjsGlobal : self, P = {};
    ["Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array"].forEach(function(e2) {
      var t2 = e2, r2 = A[t2];
      r2 && (P[e2.toLowerCase()] = { test: function test(e3) {
        return s.toStringTag(e3) === t2;
      }, replace: function replace(e3, t3) {
        var r3 = e3.buffer, n2 = e3.byteOffset, i2 = e3.length;
        t3.buffers || (t3.buffers = []);
        var o2 = t3.buffers.indexOf(r3);
        return o2 > -1 ? { index: o2, byteOffset: n2, length: i2 } : (t3.buffers.push(r3), { encoded: S(r3), byteOffset: n2, length: i2 });
      }, revive: function revive(e3, t3) {
        t3.buffers || (t3.buffers = []);
        var n2, i2 = e3.byteOffset, o2 = e3.length, a2 = e3.encoded, c2 = e3.index;
        return "index" in e3 ? n2 = t3.buffers[c2] : (n2 = T(a2), t3.buffers.push(n2)), new r2(n2, i2, o2);
      } });
    });
    var I = { dataview: { test: function test(e2) {
      return "DataView" === s.toStringTag(e2);
    }, replace: function replace(e2, t2) {
      var r2 = e2.buffer, n2 = e2.byteOffset, i2 = e2.byteLength;
      t2.buffers || (t2.buffers = []);
      var o2 = t2.buffers.indexOf(r2);
      return o2 > -1 ? { index: o2, byteOffset: n2, byteLength: i2 } : (t2.buffers.push(r2), { encoded: S(r2), byteOffset: n2, byteLength: i2 });
    }, revive: function revive(e2, t2) {
      t2.buffers || (t2.buffers = []);
      var r2, n2 = e2.byteOffset, i2 = e2.byteLength, o2 = e2.encoded, a2 = e2.index;
      return "index" in e2 ? r2 = t2.buffers[a2] : (r2 = T(o2), t2.buffers.push(r2)), new DataView(r2, n2, i2);
    } } }, C = { IntlCollator: { test: function test(e2) {
      return s.hasConstructorOf(e2, Intl.Collator);
    }, replace: function replace(e2) {
      return e2.resolvedOptions();
    }, revive: function revive(e2) {
      return new Intl.Collator(e2.locale, e2);
    } }, IntlDateTimeFormat: { test: function test(e2) {
      return s.hasConstructorOf(e2, Intl.DateTimeFormat);
    }, replace: function replace(e2) {
      return e2.resolvedOptions();
    }, revive: function revive(e2) {
      return new Intl.DateTimeFormat(e2.locale, e2);
    } }, IntlNumberFormat: { test: function test(e2) {
      return s.hasConstructorOf(e2, Intl.NumberFormat);
    }, replace: function replace(e2) {
      return e2.resolvedOptions();
    }, revive: function revive(e2) {
      return new Intl.NumberFormat(e2.locale, e2);
    } } };
    function string2arraybuffer(e2) {
      for (var t2 = new Uint8Array(e2.length), r2 = 0; r2 < e2.length; r2++) t2[r2] = e2.charCodeAt(r2);
      return t2.buffer;
    }
    var N = { file: { test: function test(e2) {
      return "File" === s.toStringTag(e2);
    }, replace: function replace(e2) {
      var t2 = new XMLHttpRequest();
      if (t2.overrideMimeType("text/plain; charset=x-user-defined"), t2.open("GET", URL.createObjectURL(e2), false), t2.send(), 200 !== t2.status && 0 !== t2.status) throw new Error("Bad File access: " + t2.status);
      return { type: e2.type, stringContents: t2.responseText, name: e2.name, lastModified: e2.lastModified };
    }, revive: function revive(e2) {
      var t2 = e2.name, r2 = e2.type, n2 = e2.stringContents, i2 = e2.lastModified;
      return new File([string2arraybuffer(n2)], t2, { type: r2, lastModified: i2 });
    }, replaceAsync: function replaceAsync(e2) {
      return new s.Promise(function(t2, r2) {
        var n2 = new FileReader();
        n2.addEventListener("load", function() {
          t2({ type: e2.type, stringContents: n2.result, name: e2.name, lastModified: e2.lastModified });
        }), n2.addEventListener("error", function() {
          r2(n2.error);
        }), n2.readAsBinaryString(e2);
      });
    } } }, k = { bigint: { test: function test(e2) {
      return "bigint" == typeof e2;
    }, replace: function replace(e2) {
      return String(e2);
    }, revive: function revive(e2) {
      return BigInt(e2);
    } } }, E = { bigintObject: { test: function test(e2) {
      return "object" === _typeof$1(e2) && s.hasConstructorOf(e2, BigInt);
    }, replace: function replace(e2) {
      return String(e2);
    }, revive: function revive(e2) {
      return new Object(BigInt(e2));
    } } }, B = { cryptokey: { test: function test(e2) {
      return "CryptoKey" === s.toStringTag(e2) && e2.extractable;
    }, replaceAsync: function replaceAsync(e2) {
      return new s.Promise(function(t2, r2) {
        crypto.subtle.exportKey("jwk", e2).catch(function(e3) {
          r2(e3);
        }).then(function(r3) {
          t2({ jwk: r3, algorithm: e2.algorithm, usages: e2.usages });
        });
      });
    }, revive: function revive(e2) {
      var t2 = e2.jwk, r2 = e2.algorithm, n2 = e2.usages;
      return crypto.subtle.importKey("jwk", t2, r2, true, n2);
    } } };
    return [l, y, p, v, b, d, h, { imagedata: { test: function test(e2) {
      return "ImageData" === s.toStringTag(e2);
    }, replace: function replace(e2) {
      return { array: _toConsumableArray$1(e2.data), width: e2.width, height: e2.height };
    }, revive: function revive(e2) {
      return new ImageData(new Uint8ClampedArray(e2.array), e2.width, e2.height);
    } } }, { imagebitmap: { test: function test(e2) {
      return "ImageBitmap" === s.toStringTag(e2) || e2 && e2.dataset && "ImageBitmap" === e2.dataset.toStringTag;
    }, replace: function replace(e2) {
      var t2 = document.createElement("canvas");
      return t2.getContext("2d").drawImage(e2, 0, 0), t2.toDataURL();
    }, revive: function revive(e2) {
      var t2 = document.createElement("canvas"), r2 = t2.getContext("2d"), n2 = document.createElement("img");
      return n2.addEventListener("load", function() {
        r2.drawImage(n2, 0, 0);
      }), n2.src = e2, t2;
    }, reviveAsync: function reviveAsync(e2) {
      var t2 = document.createElement("canvas"), r2 = t2.getContext("2d"), n2 = document.createElement("img");
      return n2.addEventListener("load", function() {
        r2.drawImage(n2, 0, 0);
      }), n2.src = e2, createImageBitmap(t2);
    } } }, N, { file: N.file, filelist: { test: function test(e2) {
      return "FileList" === s.toStringTag(e2);
    }, replace: function replace(e2) {
      for (var t2 = [], r2 = 0; r2 < e2.length; r2++) t2[r2] = e2.item(r2);
      return t2;
    }, revive: function revive(e2) {
      return new (function() {
        function FileList() {
          _classCallCheck$1(this, FileList), this._files = arguments[0], this.length = this._files.length;
        }
        return function _createClass$1(e3, t2, r2) {
          return t2 && _defineProperties$1(e3.prototype, t2), r2 && _defineProperties$1(e3, r2), e3;
        }(FileList, [{ key: "item", value: function item(e3) {
          return this._files[e3];
        } }, { key: Symbol.toStringTag, get: function get() {
          return "FileList";
        } }]), FileList;
      }())(e2);
    } } }, { blob: { test: function test(e2) {
      return "Blob" === s.toStringTag(e2);
    }, replace: function replace(e2) {
      var t2 = new XMLHttpRequest();
      if (t2.overrideMimeType("text/plain; charset=x-user-defined"), t2.open("GET", URL.createObjectURL(e2), false), t2.send(), 200 !== t2.status && 0 !== t2.status) throw new Error("Bad Blob access: " + t2.status);
      return { type: e2.type, stringContents: t2.responseText };
    }, revive: function revive(e2) {
      var t2 = e2.type, r2 = e2.stringContents;
      return new Blob([string2arraybuffer(r2)], { type: t2 });
    }, replaceAsync: function replaceAsync(e2) {
      return new s.Promise(function(t2, r2) {
        var n2 = new FileReader();
        n2.addEventListener("load", function() {
          t2({ type: e2.type, stringContents: n2.result });
        }), n2.addEventListener("error", function() {
          r2(n2.error);
        }), n2.readAsBinaryString(e2);
      });
    } } }].concat("function" == typeof Map ? g : [], "function" == typeof Set ? m : [], "function" == typeof ArrayBuffer ? w : [], "function" == typeof Uint8Array ? P : [], "function" == typeof DataView ? I : [], "undefined" != typeof Intl ? C : [], "undefined" != typeof crypto ? B : [], "undefined" != typeof BigInt ? [k, E] : []);
  });
});
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup = new Uint8Array(256);
for (i = 0; i < chars.length; i++) {
  lookup[chars.codePointAt(i)] = i;
}
var i;
var encode = function encode2(arraybuffer, byteOffset, lngth) {
  if (lngth === null || lngth === void 0) {
    lngth = arraybuffer.byteLength;
  }
  var bytes = new Uint8Array(
    arraybuffer,
    byteOffset || 0,
    // Default needed for Safari
    lngth
  );
  var len = bytes.length;
  var base64 = "";
  for (var _i = 0; _i < len; _i += 3) {
    base64 += chars[bytes[_i] >> 2];
    base64 += chars[(bytes[_i] & 3) << 4 | bytes[_i + 1] >> 4];
    base64 += chars[(bytes[_i + 1] & 15) << 2 | bytes[_i + 2] >> 6];
    base64 += chars[bytes[_i + 2] & 63];
  }
  if (len % 3 === 2) {
    base64 = base64.slice(0, -1) + "=";
  } else if (len % 3 === 1) {
    base64 = base64.slice(0, -2) + "==";
  }
  return base64;
};
var decode = function decode2(base64) {
  var len = base64.length;
  var bufferLength = base64.length * 0.75;
  var p = 0;
  var encoded1, encoded2, encoded3, encoded4;
  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }
  var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
  for (var _i2 = 0; _i2 < len; _i2 += 4) {
    encoded1 = lookup[base64.codePointAt(_i2)];
    encoded2 = lookup[base64.codePointAt(_i2 + 1)];
    encoded3 = lookup[base64.codePointAt(_i2 + 2)];
    encoded4 = lookup[base64.codePointAt(_i2 + 3)];
    bytes[p++] = encoded1 << 2 | encoded2 >> 4;
    bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }
  return arraybuffer;
};
var _global2 = typeof self === "undefined" ? global : self;
var exportObj = {};
[
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array"
].forEach(function(typeName) {
  var arrType = typeName;
  var TypedArray = _global2[arrType];
  if (TypedArray) {
    exportObj[typeName.toLowerCase() + "2"] = {
      test: function(x) {
        return typeson.toStringTag(x) === arrType;
      },
      replace: function(_a) {
        var buffer = _a.buffer, byteOffset = _a.byteOffset, length = _a.length;
        return {
          buffer,
          byteOffset,
          length
        };
      },
      revive: function(b64Obj) {
        var buffer = b64Obj.buffer, byteOffset = b64Obj.byteOffset, length = b64Obj.length;
        return new TypedArray(buffer, byteOffset, length);
      }
    };
  }
});
var arrayBuffer = {
  arraybuffer: {
    test: function(x) {
      return typeson.toStringTag(x) === "ArrayBuffer";
    },
    replace: function(b) {
      return encode(b, 0, b.byteLength);
    },
    revive: function(b64) {
      var buffer = decode(b64);
      return buffer;
    }
  }
};
var TSON = new typeson().register(structuredCloning);
var readBlobsSynchronously = "FileReaderSync" in self;
var blobsToAwait = [];
var blobsToAwaitPos = 0;
TSON.register([
  arrayBuffer,
  exportObj,
  {
    blob2: {
      test: function(x) {
        return typeson.toStringTag(x) === "Blob";
      },
      replace: function(b) {
        if (b.isClosed) {
          throw new Error("The Blob is closed");
        }
        if (readBlobsSynchronously) {
          var data = readBlobSync(b, "binary");
          var base64 = encode(data, 0, data.byteLength);
          return {
            type: b.type,
            data: base64
          };
        } else {
          blobsToAwait.push(b);
          var result = {
            type: b.type,
            data: { start: blobsToAwaitPos, end: blobsToAwaitPos + b.size }
          };
          blobsToAwaitPos += b.size;
          return result;
        }
      },
      finalize: function(b, ba) {
        b.data = encode(ba, 0, ba.byteLength);
      },
      revive: function(_a) {
        var type2 = _a.type, data = _a.data;
        return new Blob([decode(data)], { type: type2 });
      }
    }
  }
]);
TSON.mustFinalize = function() {
  return blobsToAwait.length > 0;
};
TSON.finalize = function(items) {
  return __awaiter(void 0, void 0, void 0, function() {
    var allChunks, _i, items_1, item, types, arrayType, keyPath, typeName, typeSpec, b;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          return [4, readBlobAsync(new Blob(blobsToAwait), "binary")];
        case 1:
          allChunks = _a.sent();
          if (items) {
            for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
              item = items_1[_i];
              if (item.$types) {
                types = item.$types;
                arrayType = types.$;
                if (arrayType)
                  types = types.$;
                for (keyPath in types) {
                  typeName = types[keyPath];
                  typeSpec = TSON.types[typeName];
                  if (typeSpec && typeSpec.finalize) {
                    b = Dexie$1.getByKeyPath(item, arrayType ? "$." + keyPath : keyPath);
                    typeSpec.finalize(b, allChunks.slice(b.start, b.end));
                  }
                }
              }
            }
          }
          blobsToAwait = [];
          return [
            2
            /*return*/
          ];
      }
    });
  });
};
var DEFAULT_ROWS_PER_CHUNK = 2e3;
function exportDB(db, options) {
  return __awaiter(this, void 0, void 0, function() {
    function exportAll() {
      return __awaiter(this, void 0, void 0, function() {
        var tablesRowCounts, emptyExportJson, posEndDataArray, firstJsonSlice, filter, transform, _loop_1, _i, tables_1, tableName;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, Promise.all(targetTables.map(function(table) {
                return table.count();
              }))];
            case 1:
              tablesRowCounts = _a.sent();
              tablesRowCounts.forEach(function(rowCount, i) {
                return tables[i].rowCount = rowCount;
              });
              progress.totalRows = tablesRowCounts.reduce(function(p, c) {
                return p + c;
              });
              emptyExportJson = JSON.stringify(emptyExport, void 0, prettyJson ? 2 : void 0);
              posEndDataArray = emptyExportJson.lastIndexOf("]");
              firstJsonSlice = emptyExportJson.substring(0, posEndDataArray);
              slices.push(firstJsonSlice);
              filter = options.filter;
              transform = options.transform;
              _loop_1 = function(tableName2) {
                var table, primKey, inbound, LIMIT, emptyTableExport, emptyTableExportJson, posEndRowsArray, lastKey, lastNumRows, mayHaveMoreRows, _loop_2, state_1;
                return __generator(this, function(_b) {
                  switch (_b.label) {
                    case 0:
                      table = db.table(tableName2);
                      primKey = table.schema.primKey;
                      inbound = !!primKey.keyPath;
                      LIMIT = options.numRowsPerChunk || DEFAULT_ROWS_PER_CHUNK;
                      emptyTableExport = inbound ? {
                        tableName: table.name,
                        inbound: true,
                        rows: []
                      } : {
                        tableName: table.name,
                        inbound: false,
                        rows: []
                      };
                      emptyTableExportJson = JSON.stringify(emptyTableExport, void 0, prettyJson ? 2 : void 0);
                      if (prettyJson) {
                        emptyTableExportJson = emptyTableExportJson.split("\n").join("\n    ");
                      }
                      posEndRowsArray = emptyTableExportJson.lastIndexOf("]");
                      slices.push(emptyTableExportJson.substring(0, posEndRowsArray));
                      lastKey = null;
                      lastNumRows = 0;
                      mayHaveMoreRows = true;
                      _loop_2 = function() {
                        var chunkedCollection, values, filteredValues, transformedValues, tsonValues, json, keys2, keyvals, tsonTuples, json;
                        return __generator(this, function(_c) {
                          switch (_c.label) {
                            case 0:
                              if (progressCallback) {
                                Dexie$1.ignoreTransaction(function() {
                                  return progressCallback(progress);
                                });
                              }
                              chunkedCollection = lastKey == null ? table.limit(LIMIT) : table.where(":id").above(lastKey).limit(LIMIT);
                              return [4, chunkedCollection.toArray()];
                            case 1:
                              values = _c.sent();
                              if (values.length === 0)
                                return [2, "break"];
                              if (lastKey != null && lastNumRows > 0) {
                                slices.push(",");
                                if (prettyJson) {
                                  slices.push("\n      ");
                                }
                              }
                              mayHaveMoreRows = values.length === LIMIT;
                              if (!inbound) return [3, 4];
                              filteredValues = filter ? values.filter(function(value) {
                                return filter(tableName2, value);
                              }) : values;
                              transformedValues = transform ? filteredValues.map(function(value) {
                                return transform(tableName2, value).value;
                              }) : filteredValues;
                              tsonValues = transformedValues.map(function(value) {
                                return TSON.encapsulate(value);
                              });
                              if (!TSON.mustFinalize()) return [3, 3];
                              return [4, Dexie$1.waitFor(TSON.finalize(tsonValues))];
                            case 2:
                              _c.sent();
                              _c.label = 3;
                            case 3:
                              json = JSON.stringify(tsonValues, void 0, prettyJson ? 2 : void 0);
                              if (prettyJson)
                                json = json.split("\n").join("\n      ");
                              slices.push(new Blob([json.substring(1, json.length - 1)]));
                              lastNumRows = transformedValues.length;
                              lastKey = values.length > 0 ? Dexie$1.getByKeyPath(values[values.length - 1], primKey.keyPath) : null;
                              return [3, 8];
                            case 4:
                              return [4, chunkedCollection.primaryKeys()];
                            case 5:
                              keys2 = _c.sent();
                              keyvals = keys2.map(function(key, i) {
                                return [key, values[i]];
                              });
                              if (filter)
                                keyvals = keyvals.filter(function(_a2) {
                                  var key = _a2[0], value = _a2[1];
                                  return filter(tableName2, value, key);
                                });
                              if (transform)
                                keyvals = keyvals.map(function(_a2) {
                                  var key = _a2[0], value = _a2[1];
                                  var transformResult = transform(tableName2, value, key);
                                  return [transformResult.key, transformResult.value];
                                });
                              tsonTuples = keyvals.map(function(tuple) {
                                return TSON.encapsulate(tuple);
                              });
                              if (!TSON.mustFinalize()) return [3, 7];
                              return [4, Dexie$1.waitFor(TSON.finalize(tsonTuples))];
                            case 6:
                              _c.sent();
                              _c.label = 7;
                            case 7:
                              json = JSON.stringify(tsonTuples, void 0, prettyJson ? 2 : void 0);
                              if (prettyJson)
                                json = json.split("\n").join("\n      ");
                              slices.push(new Blob([json.substring(1, json.length - 1)]));
                              lastNumRows = keyvals.length;
                              lastKey = keys2.length > 0 ? keys2[keys2.length - 1] : null;
                              _c.label = 8;
                            case 8:
                              progress.completedRows += values.length;
                              return [
                                2
                                /*return*/
                              ];
                          }
                        });
                      };
                      _b.label = 1;
                    case 1:
                      if (!mayHaveMoreRows) return [3, 3];
                      return [5, _loop_2()];
                    case 2:
                      state_1 = _b.sent();
                      if (state_1 === "break")
                        return [3, 3];
                      return [3, 1];
                    case 3:
                      slices.push(emptyTableExportJson.substr(posEndRowsArray));
                      progress.completedTables += 1;
                      if (progress.completedTables < progress.totalTables) {
                        slices.push(",");
                      }
                      return [
                        2
                        /*return*/
                      ];
                  }
                });
              };
              _i = 0, tables_1 = tables;
              _a.label = 2;
            case 2:
              if (!(_i < tables_1.length)) return [3, 5];
              tableName = tables_1[_i].name;
              return [5, _loop_1(tableName)];
            case 3:
              _a.sent();
              _a.label = 4;
            case 4:
              _i++;
              return [3, 2];
            case 5:
              slices.push(emptyExportJson.substr(posEndDataArray));
              progress.done = true;
              if (progressCallback) {
                Dexie$1.ignoreTransaction(function() {
                  return progressCallback(progress);
                });
              }
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    var skipTables, targetTables, slices, tables, prettyJson, emptyExport, progressCallback, progress;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          options = options || {};
          skipTables = options.skipTables ? options.skipTables : [];
          targetTables = db.tables.filter(function(x) {
            return !skipTables.includes(x.name);
          });
          slices = [];
          tables = targetTables.map(function(table) {
            return {
              name: table.name,
              schema: getSchemaString(table),
              rowCount: 0
            };
          });
          prettyJson = options.prettyJson;
          emptyExport = {
            formatName: "dexie",
            formatVersion: 1,
            data: {
              databaseName: db.name,
              databaseVersion: db.verno,
              tables,
              data: []
            }
          };
          progressCallback = options.progressCallback;
          progress = {
            done: false,
            completedRows: 0,
            completedTables: 0,
            totalRows: NaN,
            totalTables: tables.length
          };
          _a.label = 1;
        case 1:
          _a.trys.push([1, , 6, 7]);
          if (!options.noTransaction) return [3, 3];
          return [4, exportAll()];
        case 2:
          _a.sent();
          return [3, 5];
        case 3:
          return [4, db.transaction("r", db.tables, exportAll)];
        case 4:
          _a.sent();
          _a.label = 5;
        case 5:
          return [3, 7];
        case 6:
          TSON.finalize();
          return [
            7
            /*endfinally*/
          ];
        case 7:
          return [2, new Blob(slices, { type: "text/json" })];
      }
    });
  });
}
var VERSION = 1;
var fakeStream = { Stream: function() {
} };
var clarinet_1 = createCommonjsModule(function(module, exports) {
  (function(clarinet) {
    var env = typeof process === "object" && process.env ? process.env : self;
    clarinet.parser = function(opt) {
      return new CParser(opt);
    };
    clarinet.CParser = CParser;
    clarinet.CStream = CStream;
    clarinet.createStream = createStream;
    clarinet.MAX_BUFFER_LENGTH = 10 * 1024 * 1024;
    clarinet.DEBUG = env.CDEBUG === "debug";
    clarinet.INFO = env.CDEBUG === "debug" || env.CDEBUG === "info";
    clarinet.EVENTS = [
      "value",
      "string",
      "key",
      "openobject",
      "closeobject",
      "openarray",
      "closearray",
      "error",
      "end",
      "ready"
    ];
    var buffers = {
      textNode: void 0,
      numberNode: ""
    }, streamWraps = clarinet.EVENTS.filter(function(ev) {
      return ev !== "error" && ev !== "end";
    }), S = 0, Stream;
    clarinet.STATE = {
      BEGIN: S++,
      VALUE: S++,
      OPEN_OBJECT: S++,
      CLOSE_OBJECT: S++,
      OPEN_ARRAY: S++,
      CLOSE_ARRAY: S++,
      TEXT_ESCAPE: S++,
      STRING: S++,
      BACKSLASH: S++,
      END: S++,
      OPEN_KEY: S++,
      CLOSE_KEY: S++,
      TRUE: S++,
      TRUE2: S++,
      TRUE3: S++,
      FALSE: S++,
      FALSE2: S++,
      FALSE3: S++,
      FALSE4: S++,
      NULL: S++,
      NULL2: S++,
      NULL3: S++,
      NUMBER_DECIMAL_POINT: S++,
      NUMBER_DIGIT: S++
      // [0-9]
    };
    for (var s_ in clarinet.STATE) clarinet.STATE[clarinet.STATE[s_]] = s_;
    S = clarinet.STATE;
    const Char = {
      tab: 9,
      // \t
      lineFeed: 10,
      // \n
      carriageReturn: 13,
      // \r
      space: 32,
      // " "
      doubleQuote: 34,
      // "
      plus: 43,
      // +
      comma: 44,
      // ,
      minus: 45,
      // -
      period: 46,
      // .
      _0: 48,
      // 0
      _9: 57,
      // 9
      colon: 58,
      // :
      E: 69,
      // E
      openBracket: 91,
      // [
      backslash: 92,
      // \
      closeBracket: 93,
      // ]
      a: 97,
      // a
      b: 98,
      // b
      e: 101,
      // e 
      f: 102,
      // f
      l: 108,
      // l
      n: 110,
      // n
      r: 114,
      // r
      s: 115,
      // s
      t: 116,
      // t
      u: 117,
      // u
      openBrace: 123,
      // {
      closeBrace: 125
      // }
    };
    if (!Object.create) {
      Object.create = function(o) {
        function f() {
          this["__proto__"] = o;
        }
        f.prototype = o;
        return new f();
      };
    }
    if (!Object.getPrototypeOf) {
      Object.getPrototypeOf = function(o) {
        return o["__proto__"];
      };
    }
    if (!Object.keys) {
      Object.keys = function(o) {
        var a = [];
        for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
        return a;
      };
    }
    function checkBufferLength(parser) {
      var maxAllowed = Math.max(clarinet.MAX_BUFFER_LENGTH, 10), maxActual = 0;
      for (var buffer in buffers) {
        var len = parser[buffer] === void 0 ? 0 : parser[buffer].length;
        if (len > maxAllowed) {
          switch (buffer) {
            case "text":
              closeText(parser);
              break;
            default:
              error(parser, "Max buffer length exceeded: " + buffer);
          }
        }
        maxActual = Math.max(maxActual, len);
      }
      parser.bufferCheckPosition = clarinet.MAX_BUFFER_LENGTH - maxActual + parser.position;
    }
    function clearBuffers(parser) {
      for (var buffer in buffers) {
        parser[buffer] = buffers[buffer];
      }
    }
    var stringTokenPattern = /[\\"\n]/g;
    function CParser(opt) {
      if (!(this instanceof CParser)) return new CParser(opt);
      var parser = this;
      clearBuffers(parser);
      parser.bufferCheckPosition = clarinet.MAX_BUFFER_LENGTH;
      parser.q = parser.c = parser.p = "";
      parser.opt = opt || {};
      parser.closed = parser.closedRoot = parser.sawRoot = false;
      parser.tag = parser.error = null;
      parser.state = S.BEGIN;
      parser.stack = new Array();
      parser.position = parser.column = 0;
      parser.line = 1;
      parser.slashed = false;
      parser.unicodeI = 0;
      parser.unicodeS = null;
      parser.depth = 0;
      emit(parser, "onready");
    }
    CParser.prototype = {
      end: function() {
        end(this);
      },
      write,
      resume: function() {
        this.error = null;
        return this;
      },
      close: function() {
        return this.write(null);
      }
    };
    try {
      Stream = fakeStream.Stream;
    } catch (ex) {
      Stream = function() {
      };
    }
    function createStream(opt) {
      return new CStream(opt);
    }
    function CStream(opt) {
      if (!(this instanceof CStream)) return new CStream(opt);
      this._parser = new CParser(opt);
      this.writable = true;
      this.readable = true;
      this.bytes_remaining = 0;
      this.bytes_in_sequence = 0;
      this.temp_buffs = { "2": new Buffer(2), "3": new Buffer(3), "4": new Buffer(4) };
      this.string = "";
      var me = this;
      Stream.apply(me);
      this._parser.onend = function() {
        me.emit("end");
      };
      this._parser.onerror = function(er) {
        me.emit("error", er);
        me._parser.error = null;
      };
      streamWraps.forEach(function(ev) {
        Object.defineProperty(
          me,
          "on" + ev,
          {
            get: function() {
              return me._parser["on" + ev];
            },
            set: function(h) {
              if (!h) {
                me.removeAllListeners(ev);
                me._parser["on" + ev] = h;
                return h;
              }
              me.on(ev, h);
            },
            enumerable: true,
            configurable: false
          }
        );
      });
    }
    CStream.prototype = Object.create(
      Stream.prototype,
      { constructor: { value: CStream } }
    );
    CStream.prototype.write = function(data) {
      data = new Buffer(data);
      for (var i = 0; i < data.length; i++) {
        var n = data[i];
        if (this.bytes_remaining > 0) {
          for (var j = 0; j < this.bytes_remaining; j++) {
            this.temp_buffs[this.bytes_in_sequence][this.bytes_in_sequence - this.bytes_remaining + j] = data[j];
          }
          this.string = this.temp_buffs[this.bytes_in_sequence].toString();
          this.bytes_in_sequence = this.bytes_remaining = 0;
          i = i + j - 1;
          this._parser.write(this.string);
          this.emit("data", this.string);
          continue;
        }
        if (this.bytes_remaining === 0 && n >= 128) {
          if (n >= 194 && n <= 223) this.bytes_in_sequence = 2;
          if (n >= 224 && n <= 239) this.bytes_in_sequence = 3;
          if (n >= 240 && n <= 244) this.bytes_in_sequence = 4;
          if (this.bytes_in_sequence + i > data.length) {
            for (var k = 0; k <= data.length - 1 - i; k++) {
              this.temp_buffs[this.bytes_in_sequence][k] = data[i + k];
            }
            this.bytes_remaining = i + this.bytes_in_sequence - data.length;
            return true;
          } else {
            this.string = data.slice(i, i + this.bytes_in_sequence).toString();
            i = i + this.bytes_in_sequence - 1;
            this._parser.write(this.string);
            this.emit("data", this.string);
            continue;
          }
        }
        for (var p = i; p < data.length; p++) {
          if (data[p] >= 128) break;
        }
        this.string = data.slice(i, p).toString();
        this._parser.write(this.string);
        this.emit("data", this.string);
        i = p - 1;
        continue;
      }
    };
    CStream.prototype.end = function(chunk) {
      if (chunk && chunk.length) this._parser.write(chunk.toString());
      this._parser.end();
      return true;
    };
    CStream.prototype.on = function(ev, handler) {
      var me = this;
      if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
        me._parser["on" + ev] = function() {
          var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          args.splice(0, 0, ev);
          me.emit.apply(me, args);
        };
      }
      return Stream.prototype.on.call(me, ev, handler);
    };
    CStream.prototype.destroy = function() {
      clearBuffers(this._parser);
      this.emit("close");
    };
    function emit(parser, event, data) {
      if (clarinet.INFO) console.log("-- emit", event, data);
      if (parser[event]) parser[event](data);
    }
    function emitNode(parser, event, data) {
      closeValue(parser);
      emit(parser, event, data);
    }
    function closeValue(parser, event) {
      parser.textNode = textopts(parser.opt, parser.textNode);
      if (parser.textNode !== void 0) {
        emit(parser, event ? event : "onvalue", parser.textNode);
      }
      parser.textNode = void 0;
    }
    function closeNumber(parser) {
      if (parser.numberNode)
        emit(parser, "onvalue", parseFloat(parser.numberNode));
      parser.numberNode = "";
    }
    function textopts(opt, text) {
      if (text === void 0) {
        return text;
      }
      if (opt.trim) text = text.trim();
      if (opt.normalize) text = text.replace(/\s+/g, " ");
      return text;
    }
    function error(parser, er) {
      closeValue(parser);
      er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
      er = new Error(er);
      parser.error = er;
      emit(parser, "onerror", er);
      return parser;
    }
    function end(parser) {
      if (parser.state !== S.VALUE || parser.depth !== 0)
        error(parser, "Unexpected end");
      closeValue(parser);
      parser.c = "";
      parser.closed = true;
      emit(parser, "onend");
      CParser.call(parser, parser.opt);
      return parser;
    }
    function isWhitespace(c) {
      return c === Char.carriageReturn || c === Char.lineFeed || c === Char.space || c === Char.tab;
    }
    function write(chunk) {
      var parser = this;
      if (this.error) throw this.error;
      if (parser.closed) return error(
        parser,
        "Cannot write after close. Assign an onready handler."
      );
      if (chunk === null) return end(parser);
      var i = 0, c = chunk.charCodeAt(0), p = parser.p;
      if (clarinet.DEBUG) console.log("write -> [" + chunk + "]");
      while (c) {
        p = c;
        parser.c = c = chunk.charCodeAt(i++);
        if (p !== c) parser.p = p;
        else p = parser.p;
        if (!c) break;
        if (clarinet.DEBUG) console.log(i, c, clarinet.STATE[parser.state]);
        parser.position++;
        if (c === Char.lineFeed) {
          parser.line++;
          parser.column = 0;
        } else parser.column++;
        switch (parser.state) {
          case S.BEGIN:
            if (c === Char.openBrace) parser.state = S.OPEN_OBJECT;
            else if (c === Char.openBracket) parser.state = S.OPEN_ARRAY;
            else if (!isWhitespace(c))
              error(parser, "Non-whitespace before {[.");
            continue;
          case S.OPEN_KEY:
          case S.OPEN_OBJECT:
            if (isWhitespace(c)) continue;
            if (parser.state === S.OPEN_KEY) parser.stack.push(S.CLOSE_KEY);
            else {
              if (c === Char.closeBrace) {
                emit(parser, "onopenobject");
                this.depth++;
                emit(parser, "oncloseobject");
                this.depth--;
                parser.state = parser.stack.pop() || S.VALUE;
                continue;
              } else parser.stack.push(S.CLOSE_OBJECT);
            }
            if (c === Char.doubleQuote) parser.state = S.STRING;
            else error(parser, 'Malformed object key should start with "');
            continue;
          case S.CLOSE_KEY:
          case S.CLOSE_OBJECT:
            if (isWhitespace(c)) continue;
            parser.state === S.CLOSE_KEY ? "key" : "object";
            if (c === Char.colon) {
              if (parser.state === S.CLOSE_OBJECT) {
                parser.stack.push(S.CLOSE_OBJECT);
                closeValue(parser, "onopenobject");
                this.depth++;
              } else closeValue(parser, "onkey");
              parser.state = S.VALUE;
            } else if (c === Char.closeBrace) {
              emitNode(parser, "oncloseobject");
              this.depth--;
              parser.state = parser.stack.pop() || S.VALUE;
            } else if (c === Char.comma) {
              if (parser.state === S.CLOSE_OBJECT)
                parser.stack.push(S.CLOSE_OBJECT);
              closeValue(parser);
              parser.state = S.OPEN_KEY;
            } else error(parser, "Bad object");
            continue;
          case S.OPEN_ARRAY:
          case S.VALUE:
            if (isWhitespace(c)) continue;
            if (parser.state === S.OPEN_ARRAY) {
              emit(parser, "onopenarray");
              this.depth++;
              parser.state = S.VALUE;
              if (c === Char.closeBracket) {
                emit(parser, "onclosearray");
                this.depth--;
                parser.state = parser.stack.pop() || S.VALUE;
                continue;
              } else {
                parser.stack.push(S.CLOSE_ARRAY);
              }
            }
            if (c === Char.doubleQuote) parser.state = S.STRING;
            else if (c === Char.openBrace) parser.state = S.OPEN_OBJECT;
            else if (c === Char.openBracket) parser.state = S.OPEN_ARRAY;
            else if (c === Char.t) parser.state = S.TRUE;
            else if (c === Char.f) parser.state = S.FALSE;
            else if (c === Char.n) parser.state = S.NULL;
            else if (c === Char.minus) {
              parser.numberNode += "-";
            } else if (Char._0 <= c && c <= Char._9) {
              parser.numberNode += String.fromCharCode(c);
              parser.state = S.NUMBER_DIGIT;
            } else error(parser, "Bad value");
            continue;
          case S.CLOSE_ARRAY:
            if (c === Char.comma) {
              parser.stack.push(S.CLOSE_ARRAY);
              closeValue(parser, "onvalue");
              parser.state = S.VALUE;
            } else if (c === Char.closeBracket) {
              emitNode(parser, "onclosearray");
              this.depth--;
              parser.state = parser.stack.pop() || S.VALUE;
            } else if (isWhitespace(c))
              continue;
            else error(parser, "Bad array");
            continue;
          case S.STRING:
            if (parser.textNode === void 0) {
              parser.textNode = "";
            }
            var starti = i - 1, slashed = parser.slashed, unicodeI = parser.unicodeI;
            STRING_BIGLOOP: while (true) {
              if (clarinet.DEBUG)
                console.log(
                  i,
                  c,
                  clarinet.STATE[parser.state],
                  slashed
                );
              while (unicodeI > 0) {
                parser.unicodeS += String.fromCharCode(c);
                c = chunk.charCodeAt(i++);
                parser.position++;
                if (unicodeI === 4) {
                  parser.textNode += String.fromCharCode(parseInt(parser.unicodeS, 16));
                  unicodeI = 0;
                  starti = i - 1;
                } else {
                  unicodeI++;
                }
                if (!c) break STRING_BIGLOOP;
              }
              if (c === Char.doubleQuote && !slashed) {
                parser.state = parser.stack.pop() || S.VALUE;
                parser.textNode += chunk.substring(starti, i - 1);
                parser.position += i - 1 - starti;
                break;
              }
              if (c === Char.backslash && !slashed) {
                slashed = true;
                parser.textNode += chunk.substring(starti, i - 1);
                parser.position += i - 1 - starti;
                c = chunk.charCodeAt(i++);
                parser.position++;
                if (!c) break;
              }
              if (slashed) {
                slashed = false;
                if (c === Char.n) {
                  parser.textNode += "\n";
                } else if (c === Char.r) {
                  parser.textNode += "\r";
                } else if (c === Char.t) {
                  parser.textNode += "	";
                } else if (c === Char.f) {
                  parser.textNode += "\f";
                } else if (c === Char.b) {
                  parser.textNode += "\b";
                } else if (c === Char.u) {
                  unicodeI = 1;
                  parser.unicodeS = "";
                } else {
                  parser.textNode += String.fromCharCode(c);
                }
                c = chunk.charCodeAt(i++);
                parser.position++;
                starti = i - 1;
                if (!c) break;
                else continue;
              }
              stringTokenPattern.lastIndex = i;
              var reResult = stringTokenPattern.exec(chunk);
              if (reResult === null) {
                i = chunk.length + 1;
                parser.textNode += chunk.substring(starti, i - 1);
                parser.position += i - 1 - starti;
                break;
              }
              i = reResult.index + 1;
              c = chunk.charCodeAt(reResult.index);
              if (!c) {
                parser.textNode += chunk.substring(starti, i - 1);
                parser.position += i - 1 - starti;
                break;
              }
            }
            parser.slashed = slashed;
            parser.unicodeI = unicodeI;
            continue;
          case S.TRUE:
            if (c === Char.r) parser.state = S.TRUE2;
            else error(parser, "Invalid true started with t" + c);
            continue;
          case S.TRUE2:
            if (c === Char.u) parser.state = S.TRUE3;
            else error(parser, "Invalid true started with tr" + c);
            continue;
          case S.TRUE3:
            if (c === Char.e) {
              emit(parser, "onvalue", true);
              parser.state = parser.stack.pop() || S.VALUE;
            } else error(parser, "Invalid true started with tru" + c);
            continue;
          case S.FALSE:
            if (c === Char.a) parser.state = S.FALSE2;
            else error(parser, "Invalid false started with f" + c);
            continue;
          case S.FALSE2:
            if (c === Char.l) parser.state = S.FALSE3;
            else error(parser, "Invalid false started with fa" + c);
            continue;
          case S.FALSE3:
            if (c === Char.s) parser.state = S.FALSE4;
            else error(parser, "Invalid false started with fal" + c);
            continue;
          case S.FALSE4:
            if (c === Char.e) {
              emit(parser, "onvalue", false);
              parser.state = parser.stack.pop() || S.VALUE;
            } else error(parser, "Invalid false started with fals" + c);
            continue;
          case S.NULL:
            if (c === Char.u) parser.state = S.NULL2;
            else error(parser, "Invalid null started with n" + c);
            continue;
          case S.NULL2:
            if (c === Char.l) parser.state = S.NULL3;
            else error(parser, "Invalid null started with nu" + c);
            continue;
          case S.NULL3:
            if (c === Char.l) {
              emit(parser, "onvalue", null);
              parser.state = parser.stack.pop() || S.VALUE;
            } else error(parser, "Invalid null started with nul" + c);
            continue;
          case S.NUMBER_DECIMAL_POINT:
            if (c === Char.period) {
              parser.numberNode += ".";
              parser.state = S.NUMBER_DIGIT;
            } else error(parser, "Leading zero not followed by .");
            continue;
          case S.NUMBER_DIGIT:
            if (Char._0 <= c && c <= Char._9) parser.numberNode += String.fromCharCode(c);
            else if (c === Char.period) {
              if (parser.numberNode.indexOf(".") !== -1)
                error(parser, "Invalid number has two dots");
              parser.numberNode += ".";
            } else if (c === Char.e || c === Char.E) {
              if (parser.numberNode.indexOf("e") !== -1 || parser.numberNode.indexOf("E") !== -1)
                error(parser, "Invalid number has two exponential");
              parser.numberNode += "e";
            } else if (c === Char.plus || c === Char.minus) {
              if (!(p === Char.e || p === Char.E))
                error(parser, "Invalid symbol in number");
              parser.numberNode += String.fromCharCode(c);
            } else {
              closeNumber(parser);
              i--;
              parser.state = parser.stack.pop() || S.VALUE;
            }
            continue;
          default:
            error(parser, "Unknown state: " + parser.state);
        }
      }
      if (parser.position >= parser.bufferCheckPosition)
        checkBufferLength(parser);
      return parser;
    }
  })(exports);
});
function JsonStream(blob) {
  var pos = 0;
  var parser = JsonParser(true);
  var rv = {
    pullAsync: function(numBytes) {
      return __awaiter(this, void 0, void 0, function() {
        var slize, jsonPart, result;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              slize = blob.slice(pos, pos + numBytes);
              pos += numBytes;
              return [4, readBlobAsync(slize, "text")];
            case 1:
              jsonPart = _a.sent();
              result = parser.write(jsonPart);
              rv.result = result || {};
              return [2, result];
          }
        });
      });
    },
    pullSync: function(numBytes) {
      var slize = blob.slice(pos, pos + numBytes);
      pos += numBytes;
      var jsonPart = readBlobSync(slize, "text");
      var result = parser.write(jsonPart);
      rv.result = result || {};
      return result;
    },
    done: function() {
      return parser.done();
    },
    eof: function() {
      return pos >= blob.size;
    },
    result: {}
  };
  return rv;
}
function JsonParser(allowPartial) {
  var parser = clarinet_1.parser();
  var level = 0;
  var result;
  var stack = [];
  var obj;
  var key;
  var done = false;
  var array = false;
  parser.onopenobject = function(newKey) {
    var newObj = {};
    newObj.incomplete = true;
    if (!result)
      result = newObj;
    if (obj) {
      stack.push([key, obj, array]);
      if (allowPartial) {
        if (array) {
          obj.push(newObj);
        } else {
          obj[key] = newObj;
        }
      }
    }
    obj = newObj;
    key = newKey;
    array = false;
    ++level;
  };
  parser.onkey = function(newKey) {
    return key = newKey;
  };
  parser.onvalue = function(value) {
    return array ? obj.push(value) : obj[key] = value;
  };
  parser.oncloseobject = function() {
    var _a;
    delete obj.incomplete;
    key = null;
    if (--level === 0) {
      done = true;
    } else {
      var completedObj = obj;
      _a = stack.pop(), key = _a[0], obj = _a[1], array = _a[2];
      if (!allowPartial) {
        if (array) {
          obj.push(completedObj);
        } else {
          obj[key] = completedObj;
        }
      }
    }
  };
  parser.onopenarray = function() {
    var newObj = [];
    newObj.incomplete = true;
    if (!result)
      result = newObj;
    if (obj) {
      stack.push([key, obj, array]);
      if (allowPartial) {
        if (array) {
          obj.push(newObj);
        } else {
          obj[key] = newObj;
        }
      }
    }
    obj = newObj;
    array = true;
    key = null;
    ++level;
  };
  parser.onclosearray = function() {
    var _a;
    delete obj.incomplete;
    key = null;
    if (--level === 0) {
      done = true;
    } else {
      var completedObj = obj;
      _a = stack.pop(), key = _a[0], obj = _a[1], array = _a[2];
      if (!allowPartial) {
        if (array) {
          obj.push(completedObj);
        } else {
          obj[key] = completedObj;
        }
      }
    }
  };
  return {
    write: function(jsonPart) {
      parser.write(jsonPart);
      return result;
    },
    done: function() {
      return done;
    }
  };
}
var DEFAULT_KILOBYTES_PER_CHUNK = 1024;
function importDB(exportedData, options) {
  return __awaiter(this, void 0, void 0, function() {
    var CHUNK_SIZE, stream, dbExport, db;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          options = options || {};
          CHUNK_SIZE = options.chunkSizeBytes || DEFAULT_KILOBYTES_PER_CHUNK * 1024;
          return [4, loadUntilWeGotEnoughData(exportedData, CHUNK_SIZE)];
        case 1:
          stream = _a.sent();
          dbExport = stream.result.data;
          db = new Dexie$1(dbExport.databaseName);
          db.version(dbExport.databaseVersion).stores(extractDbSchema(dbExport));
          return [4, importInto(db, stream, options)];
        case 2:
          _a.sent();
          return [2, db];
      }
    });
  });
}
function importInto(db, exportedData, options) {
  return __awaiter(this, void 0, void 0, function() {
    function importAll() {
      return __awaiter(this, void 0, void 0, function() {
        var _loop_1, _i2, _a2, tableExport, state_1;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              _loop_1 = function(tableExport2) {
                var tableName, table2, tableSchemaStr, sourceRows, rows, i, obj, filter, transform, filteredRows, _c, keys2, values;
                return __generator(this, function(_d) {
                  switch (_d.label) {
                    case 0:
                      if (skipTables.includes(tableExport2.tableName))
                        return [2, "continue"];
                      if (!tableExport2.rows)
                        return [2, "break"];
                      if (!tableExport2.rows.incomplete && tableExport2.rows.length === 0)
                        return [2, "continue"];
                      if (progressCallback) {
                        Dexie$1.ignoreTransaction(function() {
                          return progressCallback(progress);
                        });
                      }
                      tableName = tableExport2.tableName;
                      table2 = db.table(tableName);
                      tableSchemaStr = dbExport.tables.filter(function(t) {
                        return t.name === tableName;
                      })[0].schema;
                      if (!table2) {
                        if (!options.acceptMissingTables)
                          throw new Error("Exported table ".concat(tableExport2.tableName, " is missing in installed database"));
                        else
                          return [2, "continue"];
                      }
                      if (!options.acceptChangedPrimaryKey && tableSchemaStr.split(",")[0] != table2.schema.primKey.src) {
                        throw new Error("Primary key differs for table ".concat(tableExport2.tableName, ". "));
                      }
                      sourceRows = tableExport2.rows;
                      rows = [];
                      for (i = 0; i < sourceRows.length; i++) {
                        obj = sourceRows[i];
                        if (!obj.incomplete) {
                          rows.push(TSON.revive(obj));
                        } else {
                          break;
                        }
                      }
                      filter = options.filter;
                      transform = options.transform;
                      filteredRows = filter ? tableExport2.inbound ? rows.filter(function(value) {
                        return filter(tableName, value);
                      }) : rows.filter(function(_a3) {
                        var key = _a3[0], value = _a3[1];
                        return filter(tableName, value, key);
                      }) : rows;
                      if (transform) {
                        filteredRows = filteredRows.map(tableExport2.inbound ? function(value) {
                          return transform(tableName, value).value;
                        } : function(_a3) {
                          var key = _a3[0], value = _a3[1];
                          var res = transform(tableName, value, key);
                          return [res.key, res.value];
                        });
                      }
                      _c = tableExport2.inbound ? [void 0, filteredRows] : [filteredRows.map(function(row) {
                        return row[0];
                      }), rows.map(function(row) {
                        return row[1];
                      })], keys2 = _c[0], values = _c[1];
                      if (!options.overwriteValues) return [3, 2];
                      return [4, table2.bulkPut(values, keys2)];
                    case 1:
                      _d.sent();
                      return [3, 4];
                    case 2:
                      return [4, table2.bulkAdd(values, keys2)];
                    case 3:
                      _d.sent();
                      _d.label = 4;
                    case 4:
                      progress.completedRows += rows.length;
                      if (!rows.incomplete) {
                        progress.completedTables += 1;
                      }
                      sourceRows.splice(0, rows.length);
                      return [
                        2
                        /*return*/
                      ];
                  }
                });
              };
              _i2 = 0, _a2 = dbExport.data;
              _b.label = 1;
            case 1:
              if (!(_i2 < _a2.length)) return [3, 4];
              tableExport = _a2[_i2];
              return [5, _loop_1(tableExport)];
            case 2:
              state_1 = _b.sent();
              if (state_1 === "break")
                return [3, 4];
              _b.label = 3;
            case 3:
              _i2++;
              return [3, 1];
            case 4:
              while (dbExport.data.length > 0 && dbExport.data[0].rows && !dbExport.data[0].rows.incomplete) {
                dbExport.data.splice(0, 1);
              }
              if (!(!jsonStream.done() && !jsonStream.eof())) return [3, 8];
              if (!readBlobsSynchronously2) return [3, 5];
              jsonStream.pullSync(CHUNK_SIZE);
              return [3, 7];
            case 5:
              return [4, Dexie$1.waitFor(jsonStream.pullAsync(CHUNK_SIZE))];
            case 6:
              _b.sent();
              _b.label = 7;
            case 7:
              return [3, 9];
            case 8:
              return [3, 10];
            case 9:
              return [3, 0];
            case 10:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    var CHUNK_SIZE, jsonStream, dbExportFile, readBlobsSynchronously2, dbExport, skipTables, progressCallback, progress, _i, _a, table;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          options = options || {};
          CHUNK_SIZE = options.chunkSizeBytes || DEFAULT_KILOBYTES_PER_CHUNK * 1024;
          return [4, loadUntilWeGotEnoughData(exportedData, CHUNK_SIZE)];
        case 1:
          jsonStream = _b.sent();
          dbExportFile = jsonStream.result;
          readBlobsSynchronously2 = "FileReaderSync" in self;
          dbExport = dbExportFile.data;
          skipTables = options.skipTables ? options.skipTables : [];
          if (!options.acceptNameDiff && db.name !== dbExport.databaseName)
            throw new Error("Name differs. Current database name is ".concat(db.name, " but export is ").concat(dbExport.databaseName));
          if (!options.acceptVersionDiff && db.verno !== dbExport.databaseVersion) {
            throw new Error("Database version differs. Current database is in version ".concat(db.verno, " but export is ").concat(dbExport.databaseVersion));
          }
          progressCallback = options.progressCallback;
          progress = {
            done: false,
            completedRows: 0,
            completedTables: 0,
            totalRows: dbExport.tables.reduce(function(p, c) {
              return p + c.rowCount;
            }, 0),
            totalTables: dbExport.tables.length
          };
          if (progressCallback) {
            Dexie$1.ignoreTransaction(function() {
              return progressCallback(progress);
            });
          }
          if (!options.clearTablesBeforeImport) return [3, 5];
          _i = 0, _a = db.tables;
          _b.label = 2;
        case 2:
          if (!(_i < _a.length)) return [3, 5];
          table = _a[_i];
          if (skipTables.includes(table.name))
            return [3, 4];
          return [4, table.clear()];
        case 3:
          _b.sent();
          _b.label = 4;
        case 4:
          _i++;
          return [3, 2];
        case 5:
          if (!options.noTransaction) return [3, 7];
          return [4, importAll()];
        case 6:
          _b.sent();
          return [3, 9];
        case 7:
          return [4, db.transaction("rw", db.tables, importAll)];
        case 8:
          _b.sent();
          _b.label = 9;
        case 9:
          progress.done = true;
          if (progressCallback) {
            Dexie$1.ignoreTransaction(function() {
              return progressCallback(progress);
            });
          }
          return [
            2
            /*return*/
          ];
      }
    });
  });
}
function loadUntilWeGotEnoughData(exportedData, CHUNK_SIZE) {
  return __awaiter(this, void 0, void 0, function() {
    var stream, dbExportFile;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          stream = "slice" in exportedData ? JsonStream(exportedData) : exportedData;
          _a.label = 1;
        case 1:
          if (!!stream.eof()) return [3, 3];
          return [4, stream.pullAsync(CHUNK_SIZE)];
        case 2:
          _a.sent();
          if (stream.result.data && stream.result.data.data)
            return [3, 3];
          return [3, 1];
        case 3:
          dbExportFile = stream.result;
          if (!dbExportFile || dbExportFile.formatName != "dexie")
            throw new Error("Given file is not a dexie export");
          if (dbExportFile.formatVersion > VERSION) {
            throw new Error("Format version ".concat(dbExportFile.formatVersion, " not supported"));
          }
          if (!dbExportFile.data) {
            throw new Error("No data in export file");
          }
          if (!dbExportFile.data.databaseName) {
            throw new Error("Missing databaseName in export file");
          }
          if (!dbExportFile.data.databaseVersion) {
            throw new Error("Missing databaseVersion in export file");
          }
          if (!dbExportFile.data.tables) {
            throw new Error("Missing tables in export file");
          }
          return [2, stream];
      }
    });
  });
}
Dexie$1.prototype.export = function(options) {
  return exportDB(this, options);
};
Dexie$1.prototype.import = function(blob, options) {
  return importInto(this, blob, options);
};
Dexie$1.import = function(blob, options) {
  return importDB(blob, options);
};
export {
  Dexie$1 as Dexie
};
/*! Bundled license information:

dexie-export-import/dist/dexie-export-import.mjs:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
//# sourceMappingURL=dexie.js.map
