// @ts-nocheck

// node_modules/wanakana/esm/index.js
function typeOf(value) {
  if (value === null) {
    return "null";
  }
  if (value !== Object(value)) {
    return typeof value;
  }
  return {}.toString.call(value).slice(8, -1).toLowerCase();
}
function isEmpty(input) {
  if (typeOf(input) !== "string") {
    return true;
  }
  return !input.length;
}
function isCharInRange(char = "", start, end) {
  if (isEmpty(char))
    return false;
  const code = char.charCodeAt(0);
  return start <= code && code <= end;
}
var VERSION = "5.3.1";
var TO_KANA_METHODS = {
  HIRAGANA: "toHiragana",
  KATAKANA: "toKatakana"
};
var ROMANIZATIONS = {
  HEPBURN: "hepburn"
};
var DEFAULT_OPTIONS = {
  useObsoleteKana: false,
  passRomaji: false,
  convertLongVowelMark: true,
  upcaseKatakana: false,
  IMEMode: false,
  romanization: ROMANIZATIONS.HEPBURN
};
var LATIN_UPPERCASE_START = 65;
var LATIN_UPPERCASE_END = 90;
var LOWERCASE_ZENKAKU_START = 65345;
var LOWERCASE_ZENKAKU_END = 65370;
var UPPERCASE_ZENKAKU_START = 65313;
var UPPERCASE_ZENKAKU_END = 65338;
var HIRAGANA_START = 12353;
var HIRAGANA_END = 12438;
var KATAKANA_START = 12449;
var KATAKANA_END = 12540;
var KANJI_START = 19968;
var KANJI_END = 40879;
var KANJI_ITERATION_MARK = 12293;
var PROLONGED_SOUND_MARK = 12540;
var KANA_SLASH_DOT = 12539;
var ZENKAKU_NUMBERS = [65296, 65305];
var ZENKAKU_UPPERCASE = [UPPERCASE_ZENKAKU_START, UPPERCASE_ZENKAKU_END];
var ZENKAKU_LOWERCASE = [LOWERCASE_ZENKAKU_START, LOWERCASE_ZENKAKU_END];
var ZENKAKU_PUNCTUATION_1 = [65281, 65295];
var ZENKAKU_PUNCTUATION_2 = [65306, 65311];
var ZENKAKU_PUNCTUATION_3 = [65339, 65343];
var ZENKAKU_PUNCTUATION_4 = [65371, 65376];
var ZENKAKU_SYMBOLS_CURRENCY = [65504, 65518];
var HIRAGANA_CHARS = [12352, 12447];
var KATAKANA_CHARS = [12448, 12543];
var HANKAKU_KATAKANA = [65382, 65439];
var KATAKANA_PUNCTUATION = [12539, 12540];
var KANA_PUNCTUATION = [65377, 65381];
var CJK_SYMBOLS_PUNCTUATION = [12288, 12351];
var COMMON_CJK = [19968, 40959];
var RARE_CJK = [13312, 19903];
var KANA_RANGES = [
  HIRAGANA_CHARS,
  KATAKANA_CHARS,
  KANA_PUNCTUATION,
  HANKAKU_KATAKANA
];
var JA_PUNCTUATION_RANGES = [
  CJK_SYMBOLS_PUNCTUATION,
  KANA_PUNCTUATION,
  KATAKANA_PUNCTUATION,
  ZENKAKU_PUNCTUATION_1,
  ZENKAKU_PUNCTUATION_2,
  ZENKAKU_PUNCTUATION_3,
  ZENKAKU_PUNCTUATION_4,
  ZENKAKU_SYMBOLS_CURRENCY
];
var JAPANESE_RANGES = [
  ...KANA_RANGES,
  ...JA_PUNCTUATION_RANGES,
  ZENKAKU_UPPERCASE,
  ZENKAKU_LOWERCASE,
  ZENKAKU_NUMBERS,
  COMMON_CJK,
  RARE_CJK
];
var MODERN_ENGLISH = [0, 127];
var HEPBURN_MACRON_RANGES = [
  [256, 257],
  [274, 275],
  [298, 299],
  [332, 333],
  [362, 363]
  // Ū ū
];
var SMART_QUOTE_RANGES = [
  [8216, 8217],
  [8220, 8221]
  // “ ”
];
var ROMAJI_RANGES = [MODERN_ENGLISH, ...HEPBURN_MACRON_RANGES];
var EN_PUNCTUATION_RANGES = [
  [32, 47],
  [58, 63],
  [91, 96],
  [123, 126],
  ...SMART_QUOTE_RANGES
];
function isCharJapanese(char = "") {
  return JAPANESE_RANGES.some(([start, end]) => isCharInRange(char, start, end));
}
function isJapanese(input = "", allowed) {
  const augmented = typeOf(allowed) === "regexp";
  return isEmpty(input) ? false : [...input].every((char) => {
    const isJa = isCharJapanese(char);
    return !augmented ? isJa : isJa || allowed.test(char);
  });
}
var safeIsNaN = Number.isNaN || function ponyfill(value) {
  return typeof value === "number" && value !== value;
};
function isEqual(first, second) {
  if (first === second) {
    return true;
  }
  if (safeIsNaN(first) && safeIsNaN(second)) {
    return true;
  }
  return false;
}
function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (var i = 0; i < newInputs.length; i++) {
    if (!isEqual(newInputs[i], lastInputs[i])) {
      return false;
    }
  }
  return true;
}
function memoizeOne(resultFn, isEqual2) {
  if (isEqual2 === void 0) {
    isEqual2 = areInputsEqual;
  }
  var cache = null;
  function memoized() {
    var newArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i];
    }
    if (cache && cache.lastThis === this && isEqual2(newArgs, cache.lastArgs)) {
      return cache.lastResult;
    }
    var lastResult = resultFn.apply(this, newArgs);
    cache = {
      lastResult,
      lastArgs: newArgs,
      lastThis: this
    };
    return lastResult;
  }
  memoized.clear = function clear() {
    cache = null;
  };
  return memoized;
}
var has = Object.prototype.hasOwnProperty;
function find(iter, tar, key) {
  for (key of iter.keys()) {
    if (dequal(key, tar))
      return key;
  }
}
function dequal(foo, bar) {
  var ctor, len, tmp;
  if (foo === bar)
    return true;
  if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
    if (ctor === Date)
      return foo.getTime() === bar.getTime();
    if (ctor === RegExp)
      return foo.toString() === bar.toString();
    if (ctor === Array) {
      if ((len = foo.length) === bar.length) {
        while (len-- && dequal(foo[len], bar[len]))
          ;
      }
      return len === -1;
    }
    if (ctor === Set) {
      if (foo.size !== bar.size) {
        return false;
      }
      for (len of foo) {
        tmp = len;
        if (tmp && typeof tmp === "object") {
          tmp = find(bar, tmp);
          if (!tmp)
            return false;
        }
        if (!bar.has(tmp))
          return false;
      }
      return true;
    }
    if (ctor === Map) {
      if (foo.size !== bar.size) {
        return false;
      }
      for (len of foo) {
        tmp = len[0];
        if (tmp && typeof tmp === "object") {
          tmp = find(bar, tmp);
          if (!tmp)
            return false;
        }
        if (!dequal(len[1], bar.get(tmp))) {
          return false;
        }
      }
      return true;
    }
    if (ctor === ArrayBuffer) {
      foo = new Uint8Array(foo);
      bar = new Uint8Array(bar);
    } else if (ctor === DataView) {
      if ((len = foo.byteLength) === bar.byteLength) {
        while (len-- && foo.getInt8(len) === bar.getInt8(len))
          ;
      }
      return len === -1;
    }
    if (ArrayBuffer.isView(foo)) {
      if ((len = foo.byteLength) === bar.byteLength) {
        while (len-- && foo[len] === bar[len])
          ;
      }
      return len === -1;
    }
    if (!ctor || typeof foo === "object") {
      len = 0;
      for (ctor in foo) {
        if (has.call(foo, ctor) && ++len && !has.call(bar, ctor))
          return false;
        if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor]))
          return false;
      }
      return Object.keys(bar).length === len;
    }
  }
  return foo !== foo && bar !== bar;
}
var mergeWithDefaultOptions = (opts = {}) => Object.assign({}, DEFAULT_OPTIONS, opts);
function applyMapping(string, mapping, convertEnding) {
  const root = mapping;
  function nextSubtree(tree, nextChar) {
    const subtree = tree[nextChar];
    if (subtree === void 0) {
      return void 0;
    }
    return Object.assign({ "": tree[""] + nextChar }, tree[nextChar]);
  }
  function newChunk(remaining, currentCursor) {
    const firstChar = remaining.charAt(0);
    return parse(Object.assign({ "": firstChar }, root[firstChar]), remaining.slice(1), currentCursor, currentCursor + 1);
  }
  function parse(tree, remaining, lastCursor, currentCursor) {
    if (!remaining) {
      if (convertEnding || Object.keys(tree).length === 1) {
        return tree[""] ? [[lastCursor, currentCursor, tree[""]]] : [];
      }
      return [[lastCursor, currentCursor, null]];
    }
    if (Object.keys(tree).length === 1) {
      return [[lastCursor, currentCursor, tree[""]]].concat(newChunk(remaining, currentCursor));
    }
    const subtree = nextSubtree(tree, remaining.charAt(0));
    if (subtree === void 0) {
      return [[lastCursor, currentCursor, tree[""]]].concat(newChunk(remaining, currentCursor));
    }
    return parse(subtree, remaining.slice(1), lastCursor, currentCursor + 1);
  }
  return newChunk(string, 0);
}
function transform(tree) {
  return Object.entries(tree).reduce((map, [char, subtree]) => {
    const endOfBranch = typeOf(subtree) === "string";
    map[char] = endOfBranch ? { "": subtree } : transform(subtree);
    return map;
  }, {});
}
function getSubTreeOf(tree, string) {
  return string.split("").reduce((correctSubTree, char) => {
    if (correctSubTree[char] === void 0) {
      correctSubTree[char] = {};
    }
    return correctSubTree[char];
  }, tree);
}
function createCustomMapping(customMap = {}) {
  const customTree = {};
  if (typeOf(customMap) === "object") {
    Object.entries(customMap).forEach(([roma, kana]) => {
      let subTree = customTree;
      roma.split("").forEach((char) => {
        if (subTree[char] === void 0) {
          subTree[char] = {};
        }
        subTree = subTree[char];
      });
      subTree[""] = kana;
    });
  }
  return function makeMap(map) {
    const mapCopy = JSON.parse(JSON.stringify(map));
    function transformMap(mapSubtree, customSubtree) {
      if (mapSubtree === void 0 || typeOf(mapSubtree) === "string") {
        return customSubtree;
      }
      return Object.entries(customSubtree).reduce((newSubtree, [char, subtree]) => {
        newSubtree[char] = transformMap(mapSubtree[char], subtree);
        return newSubtree;
      }, mapSubtree);
    }
    return transformMap(mapCopy, customTree);
  };
}
function mergeCustomMapping(map, customMapping) {
  if (!customMapping) {
    return map;
  }
  return typeOf(customMapping) === "function" ? customMapping(map) : createCustomMapping(customMapping)(map);
}
var BASIC_KUNREI = {
  a: "\u3042",
  i: "\u3044",
  u: "\u3046",
  e: "\u3048",
  o: "\u304A",
  k: { a: "\u304B", i: "\u304D", u: "\u304F", e: "\u3051", o: "\u3053" },
  s: { a: "\u3055", i: "\u3057", u: "\u3059", e: "\u305B", o: "\u305D" },
  t: { a: "\u305F", i: "\u3061", u: "\u3064", e: "\u3066", o: "\u3068" },
  n: { a: "\u306A", i: "\u306B", u: "\u306C", e: "\u306D", o: "\u306E" },
  h: { a: "\u306F", i: "\u3072", u: "\u3075", e: "\u3078", o: "\u307B" },
  m: { a: "\u307E", i: "\u307F", u: "\u3080", e: "\u3081", o: "\u3082" },
  y: { a: "\u3084", u: "\u3086", o: "\u3088" },
  r: { a: "\u3089", i: "\u308A", u: "\u308B", e: "\u308C", o: "\u308D" },
  w: { a: "\u308F", i: "\u3090", e: "\u3091", o: "\u3092" },
  g: { a: "\u304C", i: "\u304E", u: "\u3050", e: "\u3052", o: "\u3054" },
  z: { a: "\u3056", i: "\u3058", u: "\u305A", e: "\u305C", o: "\u305E" },
  d: { a: "\u3060", i: "\u3062", u: "\u3065", e: "\u3067", o: "\u3069" },
  b: { a: "\u3070", i: "\u3073", u: "\u3076", e: "\u3079", o: "\u307C" },
  p: { a: "\u3071", i: "\u3074", u: "\u3077", e: "\u307A", o: "\u307D" },
  v: { a: "\u3094\u3041", i: "\u3094\u3043", u: "\u3094", e: "\u3094\u3047", o: "\u3094\u3049" }
};
var SPECIAL_SYMBOLS$1 = {
  ".": "\u3002",
  ",": "\u3001",
  ":": "\uFF1A",
  "/": "\u30FB",
  "!": "\uFF01",
  "?": "\uFF1F",
  "~": "\u301C",
  "-": "\u30FC",
  "\u2018": "\u300C",
  "\u2019": "\u300D",
  "\u201C": "\u300E",
  "\u201D": "\u300F",
  "[": "\uFF3B",
  "]": "\uFF3D",
  "(": "\uFF08",
  ")": "\uFF09",
  "{": "\uFF5B",
  "}": "\uFF5D"
};
var CONSONANTS = {
  k: "\u304D",
  s: "\u3057",
  t: "\u3061",
  n: "\u306B",
  h: "\u3072",
  m: "\u307F",
  r: "\u308A",
  g: "\u304E",
  z: "\u3058",
  d: "\u3062",
  b: "\u3073",
  p: "\u3074",
  v: "\u3094",
  q: "\u304F",
  f: "\u3075"
};
var SMALL_Y$1 = { ya: "\u3083", yi: "\u3043", yu: "\u3085", ye: "\u3047", yo: "\u3087" };
var SMALL_VOWELS = { a: "\u3041", i: "\u3043", u: "\u3045", e: "\u3047", o: "\u3049" };
var ALIASES = {
  sh: "sy",
  ch: "ty",
  cy: "ty",
  chy: "ty",
  shy: "sy",
  j: "zy",
  jy: "zy",
  // exceptions to above rules
  shi: "si",
  chi: "ti",
  tsu: "tu",
  ji: "zi",
  fu: "hu"
};
var SMALL_LETTERS = Object.assign({
  tu: "\u3063",
  wa: "\u308E",
  ka: "\u30F5",
  ke: "\u30F6"
}, SMALL_VOWELS, SMALL_Y$1);
var SPECIAL_CASES = {
  yi: "\u3044",
  wu: "\u3046",
  ye: "\u3044\u3047",
  wi: "\u3046\u3043",
  we: "\u3046\u3047",
  kwa: "\u304F\u3041",
  whu: "\u3046",
  // because it's not thya for てゃ but tha
  // and tha is not てぁ, but てゃ
  tha: "\u3066\u3083",
  thu: "\u3066\u3085",
  tho: "\u3066\u3087",
  dha: "\u3067\u3083",
  dhu: "\u3067\u3085",
  dho: "\u3067\u3087"
};
var AIUEO_CONSTRUCTIONS = {
  wh: "\u3046",
  kw: "\u304F",
  qw: "\u304F",
  q: "\u304F",
  gw: "\u3050",
  sw: "\u3059",
  ts: "\u3064",
  th: "\u3066",
  tw: "\u3068",
  dh: "\u3067",
  dw: "\u3069",
  fw: "\u3075",
  f: "\u3075"
};
function createRomajiToKanaMap$1() {
  const kanaTree = transform(BASIC_KUNREI);
  const subtreeOf = (string) => getSubTreeOf(kanaTree, string);
  Object.entries(CONSONANTS).forEach(([consonant, yKana]) => {
    Object.entries(SMALL_Y$1).forEach(([roma, kana]) => {
      subtreeOf(consonant + roma)[""] = yKana + kana;
    });
  });
  Object.entries(SPECIAL_SYMBOLS$1).forEach(([symbol, jsymbol]) => {
    subtreeOf(symbol)[""] = jsymbol;
  });
  Object.entries(AIUEO_CONSTRUCTIONS).forEach(([consonant, aiueoKana]) => {
    Object.entries(SMALL_VOWELS).forEach(([vowel, kana]) => {
      const subtree = subtreeOf(consonant + vowel);
      subtree[""] = aiueoKana + kana;
    });
  });
  ["n", "n'", "xn"].forEach((nChar) => {
    subtreeOf(nChar)[""] = "\u3093";
  });
  kanaTree.c = JSON.parse(JSON.stringify(kanaTree.k));
  Object.entries(ALIASES).forEach(([string, alternative]) => {
    const allExceptLast = string.slice(0, string.length - 1);
    const last = string.charAt(string.length - 1);
    const parentTree = subtreeOf(allExceptLast);
    parentTree[last] = JSON.parse(JSON.stringify(subtreeOf(alternative)));
  });
  function getAlternatives(string) {
    return [...Object.entries(ALIASES), ...[["c", "k"]]].reduce((list, [alt, roma]) => string.startsWith(roma) ? list.concat(string.replace(roma, alt)) : list, []);
  }
  Object.entries(SMALL_LETTERS).forEach(([kunreiRoma, kana]) => {
    const last = (char) => char.charAt(char.length - 1);
    const allExceptLast = (chars) => chars.slice(0, chars.length - 1);
    const xRoma = `x${kunreiRoma}`;
    const xSubtree = subtreeOf(xRoma);
    xSubtree[""] = kana;
    const parentTree = subtreeOf(`l${allExceptLast(kunreiRoma)}`);
    parentTree[last(kunreiRoma)] = xSubtree;
    getAlternatives(kunreiRoma).forEach((altRoma) => {
      ["l", "x"].forEach((prefix) => {
        const altParentTree = subtreeOf(prefix + allExceptLast(altRoma));
        altParentTree[last(altRoma)] = subtreeOf(prefix + kunreiRoma);
      });
    });
  });
  Object.entries(SPECIAL_CASES).forEach(([string, kana]) => {
    subtreeOf(string)[""] = kana;
  });
  function addTsu(tree) {
    return Object.entries(tree).reduce((tsuTree, [key, value]) => {
      if (!key) {
        tsuTree[key] = `\u3063${value}`;
      } else {
        tsuTree[key] = addTsu(value);
      }
      return tsuTree;
    }, {});
  }
  [...Object.keys(CONSONANTS), "c", "y", "w", "j"].forEach((consonant) => {
    const subtree = kanaTree[consonant];
    subtree[consonant] = addTsu(subtree);
  });
  delete kanaTree.n.n;
  return Object.freeze(JSON.parse(JSON.stringify(kanaTree)));
}
var romajiToKanaMap = null;
function getRomajiToKanaTree() {
  if (romajiToKanaMap == null) {
    romajiToKanaMap = createRomajiToKanaMap$1();
  }
  return romajiToKanaMap;
}
var USE_OBSOLETE_KANA_MAP = createCustomMapping({
  wi: "\u3090",
  we: "\u3091"
});
function IME_MODE_MAP(map) {
  const mapCopy = JSON.parse(JSON.stringify(map));
  mapCopy.n.n = { "": "\u3093" };
  mapCopy.n[" "] = { "": "\u3093" };
  return mapCopy;
}
function isCharUpperCase(char = "") {
  if (isEmpty(char))
    return false;
  return isCharInRange(char, LATIN_UPPERCASE_START, LATIN_UPPERCASE_END);
}
function isCharLongDash(char = "") {
  if (isEmpty(char))
    return false;
  return char.charCodeAt(0) === PROLONGED_SOUND_MARK;
}
function isCharSlashDot(char = "") {
  if (isEmpty(char))
    return false;
  return char.charCodeAt(0) === KANA_SLASH_DOT;
}
function isCharHiragana(char = "") {
  if (isEmpty(char))
    return false;
  if (isCharLongDash(char))
    return true;
  return isCharInRange(char, HIRAGANA_START, HIRAGANA_END);
}
function hiraganaToKatakana(input = "") {
  const kata = [];
  input.split("").forEach((char) => {
    if (isCharLongDash(char) || isCharSlashDot(char)) {
      kata.push(char);
    } else if (isCharHiragana(char)) {
      const code = char.charCodeAt(0) + (KATAKANA_START - HIRAGANA_START);
      const kataChar = String.fromCharCode(code);
      kata.push(kataChar);
    } else {
      kata.push(char);
    }
  });
  return kata.join("");
}
var createRomajiToKanaMap = memoizeOne((IMEMode, useObsoleteKana, customKanaMapping) => {
  let map = getRomajiToKanaTree();
  map = IMEMode ? IME_MODE_MAP(map) : map;
  map = useObsoleteKana ? USE_OBSOLETE_KANA_MAP(map) : map;
  if (customKanaMapping) {
    map = mergeCustomMapping(map, customKanaMapping);
  }
  return map;
}, dequal);
function toKana(input = "", options = {}, map) {
  let config;
  if (!map) {
    config = mergeWithDefaultOptions(options);
    map = createRomajiToKanaMap(config.IMEMode, config.useObsoleteKana, config.customKanaMapping);
  } else {
    config = options;
  }
  return splitIntoConvertedKana(input, config, map).map((kanaToken) => {
    const [start, end, kana] = kanaToken;
    if (kana === null) {
      return input.slice(start);
    }
    const enforceHiragana = config.IMEMode === TO_KANA_METHODS.HIRAGANA;
    const enforceKatakana = config.IMEMode === TO_KANA_METHODS.KATAKANA || [...input.slice(start, end)].every(isCharUpperCase);
    return enforceHiragana || !enforceKatakana ? kana : hiraganaToKatakana(kana);
  }).join("");
}
function splitIntoConvertedKana(input = "", options = {}, map) {
  const { IMEMode, useObsoleteKana, customKanaMapping } = options;
  if (!map) {
    map = createRomajiToKanaMap(IMEMode, useObsoleteKana, customKanaMapping);
  }
  return applyMapping(input.toLowerCase(), map, !IMEMode);
}
var LISTENERS = [];
function makeOnInput(options) {
  let prevInput;
  const mergedConfig = Object.assign({}, mergeWithDefaultOptions(options), {
    IMEMode: options.IMEMode || true
  });
  const preConfiguredMap = createRomajiToKanaMap(mergedConfig.IMEMode, mergedConfig.useObsoleteKana, mergedConfig.customKanaMapping);
  const triggers = [
    ...Object.keys(preConfiguredMap),
    ...Object.keys(preConfiguredMap).map((char) => char.toUpperCase())
  ];
  return function onInput2({ target }) {
    if (target.value !== prevInput && target.dataset.ignoreComposition !== "true") {
      convertInput(target, mergedConfig, preConfiguredMap, triggers);
    }
  };
}
function convertInput(target, options, map, triggers, prevInput) {
  const [head, textToConvert, tail] = splitInput(target.value, target.selectionEnd, triggers);
  const convertedText = toKana(textToConvert, options, map);
  const changed = textToConvert !== convertedText;
  if (changed) {
    const newCursor = head.length + convertedText.length;
    const newValue = head + convertedText + tail;
    target.value = newValue;
    if (tail.length) {
      setTimeout(() => target.setSelectionRange(newCursor, newCursor), 1);
    } else {
      target.setSelectionRange(newCursor, newCursor);
    }
  } else {
    target.value;
  }
}
function onComposition({ type, target, data }) {
  const isMacOS = /Mac/.test(window.navigator && window.navigator.platform);
  if (isMacOS) {
    if (type === "compositionupdate" && isJapanese(data)) {
      target.dataset.ignoreComposition = "true";
    }
    if (type === "compositionend") {
      target.dataset.ignoreComposition = "false";
    }
  }
}
function trackListeners(id, inputHandler, compositionHandler) {
  LISTENERS = LISTENERS.concat({
    id,
    inputHandler,
    compositionHandler
  });
}
function untrackListeners({ id: targetId }) {
  LISTENERS = LISTENERS.filter(({ id }) => id !== targetId);
}
function findListeners(el) {
  return el && LISTENERS.find(({ id }) => id === el.getAttribute("data-wanakana-id"));
}
function splitInput(text = "", cursor = 0, triggers = []) {
  let head;
  let toConvert;
  let tail;
  if (cursor === 0 && triggers.includes(text[0])) {
    [head, toConvert, tail] = workFromStart(text, triggers);
  } else if (cursor > 0) {
    [head, toConvert, tail] = workBackwards(text, cursor);
  } else {
    [head, toConvert] = takeWhileAndSlice(text, (char) => !triggers.includes(char));
    [toConvert, tail] = takeWhileAndSlice(toConvert, (char) => !isJapanese(char));
  }
  return [head, toConvert, tail];
}
function workFromStart(text, catalystChars) {
  return [
    "",
    ...takeWhileAndSlice(text, (char) => catalystChars.includes(char) || !isJapanese(char, /[0-9]/))
  ];
}
function workBackwards(text = "", startIndex = 0) {
  const [toConvert, head] = takeWhileAndSlice([...text.slice(0, startIndex)].reverse(), (char) => !isJapanese(char));
  return [
    head.reverse().join(""),
    toConvert.split("").reverse().join(""),
    text.slice(startIndex)
  ];
}
function takeWhileAndSlice(source = {}, predicate = (x) => !!x) {
  const result = [];
  const { length } = source;
  let i = 0;
  while (i < length && predicate(source[i], i)) {
    result.push(source[i]);
    i += 1;
  }
  return [result.join(""), source.slice(i)];
}
var onInput = ({ target: { value, selectionStart, selectionEnd } }) => console.log("input:", { value, selectionStart, selectionEnd });
var onCompositionStart = () => console.log("compositionstart");
var onCompositionUpdate = ({ target: { value, selectionStart, selectionEnd }, data }) => console.log("compositionupdate", {
  data,
  value,
  selectionStart,
  selectionEnd
});
var onCompositionEnd = () => console.log("compositionend");
var events = {
  input: onInput,
  compositionstart: onCompositionStart,
  compositionupdate: onCompositionUpdate,
  compositionend: onCompositionEnd
};
var addDebugListeners = (input) => {
  Object.entries(events).forEach(([event, handler]) => input.addEventListener(event, handler));
};
var removeDebugListeners = (input) => {
  Object.entries(events).forEach(([event, handler]) => input.removeEventListener(event, handler));
};
var ELEMENTS = ["TEXTAREA", "INPUT"];
var idCounter = 0;
var newId = () => {
  idCounter += 1;
  return `${Date.now()}${idCounter}`;
};
function bind(element = {}, options = {}, debug = false) {
  if (!ELEMENTS.includes(element.nodeName)) {
    throw new Error(`Element provided to Wanakana bind() was not a valid input or textarea element.
 Received: (${JSON.stringify(element)})`);
  }
  if (element.hasAttribute("data-wanakana-id")) {
    return;
  }
  const onInput2 = makeOnInput(options);
  const id = newId();
  const attributes = [
    { name: "data-wanakana-id", value: id },
    { name: "lang", value: "ja" },
    { name: "autoCapitalize", value: "none" },
    { name: "autoCorrect", value: "off" },
    { name: "autoComplete", value: "off" },
    { name: "spellCheck", value: "false" }
  ];
  const previousAttributes = {};
  attributes.forEach((attribute) => {
    previousAttributes[attribute.name] = element.getAttribute(attribute.name);
    element.setAttribute(attribute.name, attribute.value);
  });
  element.dataset.previousAttributes = JSON.stringify(previousAttributes);
  element.addEventListener("input", onInput2);
  element.addEventListener("compositionupdate", onComposition);
  element.addEventListener("compositionend", onComposition);
  trackListeners(id, onInput2, onComposition);
  if (debug === true) {
    addDebugListeners(element);
  }
}
function unbind(element, debug = false) {
  const listeners = findListeners(element);
  if (listeners == null) {
    throw new Error(`Element provided to Wanakana unbind() had no listener registered.
 Received: ${JSON.stringify(element)}`);
  }
  const { inputHandler, compositionHandler } = listeners;
  const attributes = JSON.parse(element.dataset.previousAttributes);
  Object.keys(attributes).forEach((key) => {
    if (attributes[key]) {
      element.setAttribute(key, attributes[key]);
    } else {
      element.removeAttribute(key);
    }
  });
  element.removeAttribute("data-previous-attributes");
  element.removeAttribute("data-ignore-composition");
  element.removeEventListener("input", inputHandler);
  element.removeEventListener("compositionstart", compositionHandler);
  element.removeEventListener("compositionupdate", compositionHandler);
  element.removeEventListener("compositionend", compositionHandler);
  untrackListeners(listeners);
  if (debug === true) {
    removeDebugListeners(element);
  }
}
function isCharRomaji(char = "") {
  if (isEmpty(char))
    return false;
  return ROMAJI_RANGES.some(([start, end]) => isCharInRange(char, start, end));
}
function isRomaji(input = "", allowed) {
  const augmented = typeOf(allowed) === "regexp";
  return isEmpty(input) ? false : [...input].every((char) => {
    const isRoma = isCharRomaji(char);
    return !augmented ? isRoma : isRoma || allowed.test(char);
  });
}
function isCharKatakana(char = "") {
  return isCharInRange(char, KATAKANA_START, KATAKANA_END);
}
function isCharKana(char = "") {
  if (isEmpty(char))
    return false;
  return isCharHiragana(char) || isCharKatakana(char);
}
function isKana(input = "") {
  if (isEmpty(input))
    return false;
  return [...input].every(isCharKana);
}
function isHiragana(input = "") {
  if (isEmpty(input))
    return false;
  return [...input].every(isCharHiragana);
}
function isKatakana(input = "") {
  if (isEmpty(input))
    return false;
  return [...input].every(isCharKatakana);
}
function isCharIterationMark(char = "") {
  if (isEmpty(char))
    return false;
  return char.charCodeAt(0) === KANJI_ITERATION_MARK;
}
function isCharKanji(char = "") {
  return isCharInRange(char, KANJI_START, KANJI_END) || isCharIterationMark(char);
}
function isKanji(input = "") {
  if (isEmpty(input))
    return false;
  return [...input].every(isCharKanji);
}
function isMixed(input = "", options = { passKanji: true }) {
  const chars = [...input];
  let hasKanji = false;
  if (!options.passKanji) {
    hasKanji = chars.some(isKanji);
  }
  return (chars.some(isHiragana) || chars.some(isKatakana)) && chars.some(isRomaji) && !hasKanji;
}
var isCharInitialLongDash = (char, index) => isCharLongDash(char) && index < 1;
var isCharInnerLongDash = (char, index) => isCharLongDash(char) && index > 0;
var isKanaAsSymbol = (char) => ["\u30F6", "\u30F5"].includes(char);
var LONG_VOWELS = {
  a: "\u3042",
  i: "\u3044",
  u: "\u3046",
  e: "\u3048",
  o: "\u3046"
};
function katakanaToHiragana(input = "", toRomaji2, { isDestinationRomaji, convertLongVowelMark } = {}) {
  let previousKana = "";
  return input.split("").reduce((hira, char, index) => {
    if (isCharSlashDot(char) || isCharInitialLongDash(char, index) || isKanaAsSymbol(char)) {
      return hira.concat(char);
    }
    if (convertLongVowelMark && previousKana && isCharInnerLongDash(char, index)) {
      const romaji = toRomaji2(previousKana).slice(-1);
      if (isCharKatakana(input[index - 1]) && romaji === "o" && isDestinationRomaji) {
        return hira.concat("\u304A");
      }
      return hira.concat(LONG_VOWELS[romaji]);
    }
    if (!isCharLongDash(char) && isCharKatakana(char)) {
      const code = char.charCodeAt(0) + (HIRAGANA_START - KATAKANA_START);
      const hiraChar = String.fromCharCode(code);
      previousKana = hiraChar;
      return hira.concat(hiraChar);
    }
    previousKana = "";
    return hira.concat(char);
  }, []).join("");
}
var kanaToHepburnMap = null;
var BASIC_ROMAJI = {
  \u3042: "a",
  \u3044: "i",
  \u3046: "u",
  \u3048: "e",
  \u304A: "o",
  \u304B: "ka",
  \u304D: "ki",
  \u304F: "ku",
  \u3051: "ke",
  \u3053: "ko",
  \u3055: "sa",
  \u3057: "shi",
  \u3059: "su",
  \u305B: "se",
  \u305D: "so",
  \u305F: "ta",
  \u3061: "chi",
  \u3064: "tsu",
  \u3066: "te",
  \u3068: "to",
  \u306A: "na",
  \u306B: "ni",
  \u306C: "nu",
  \u306D: "ne",
  \u306E: "no",
  \u306F: "ha",
  \u3072: "hi",
  \u3075: "fu",
  \u3078: "he",
  \u307B: "ho",
  \u307E: "ma",
  \u307F: "mi",
  \u3080: "mu",
  \u3081: "me",
  \u3082: "mo",
  \u3089: "ra",
  \u308A: "ri",
  \u308B: "ru",
  \u308C: "re",
  \u308D: "ro",
  \u3084: "ya",
  \u3086: "yu",
  \u3088: "yo",
  \u308F: "wa",
  \u3090: "wi",
  \u3091: "we",
  \u3092: "wo",
  \u3093: "n",
  \u304C: "ga",
  \u304E: "gi",
  \u3050: "gu",
  \u3052: "ge",
  \u3054: "go",
  \u3056: "za",
  \u3058: "ji",
  \u305A: "zu",
  \u305C: "ze",
  \u305E: "zo",
  \u3060: "da",
  \u3062: "ji",
  \u3065: "zu",
  \u3067: "de",
  \u3069: "do",
  \u3070: "ba",
  \u3073: "bi",
  \u3076: "bu",
  \u3079: "be",
  \u307C: "bo",
  \u3071: "pa",
  \u3074: "pi",
  \u3077: "pu",
  \u307A: "pe",
  \u307D: "po",
  \u3094\u3041: "va",
  \u3094\u3043: "vi",
  \u3094: "vu",
  \u3094\u3047: "ve",
  \u3094\u3049: "vo"
};
var SPECIAL_SYMBOLS = {
  "\u3002": ".",
  "\u3001": ",",
  "\uFF1A": ":",
  "\u30FB": "/",
  "\uFF01": "!",
  "\uFF1F": "?",
  "\u301C": "~",
  "\u30FC": "-",
  "\u300C": "\u2018",
  "\u300D": "\u2019",
  "\u300E": "\u201C",
  "\u300F": "\u201D",
  "\uFF3B": "[",
  "\uFF3D": "]",
  "\uFF08": "(",
  "\uFF09": ")",
  "\uFF5B": "{",
  "\uFF5D": "}",
  "\u3000": " "
};
var AMBIGUOUS_VOWELS = ["\u3042", "\u3044", "\u3046", "\u3048", "\u304A", "\u3084", "\u3086", "\u3088"];
var SMALL_Y = { \u3083: "ya", \u3085: "yu", \u3087: "yo" };
var SMALL_Y_EXTRA = { \u3043: "yi", \u3047: "ye" };
var SMALL_AIUEO = {
  \u3041: "a",
  \u3043: "i",
  \u3045: "u",
  \u3047: "e",
  \u3049: "o"
};
var YOON_KANA = [
  "\u304D",
  "\u306B",
  "\u3072",
  "\u307F",
  "\u308A",
  "\u304E",
  "\u3073",
  "\u3074",
  "\u3094",
  "\u304F",
  "\u3075"
];
var YOON_EXCEPTIONS = {
  \u3057: "sh",
  \u3061: "ch",
  \u3058: "j",
  \u3062: "j"
};
var SMALL_KANA = {
  \u3063: "",
  \u3083: "ya",
  \u3085: "yu",
  \u3087: "yo",
  \u3041: "a",
  \u3043: "i",
  \u3045: "u",
  \u3047: "e",
  \u3049: "o"
};
var SOKUON_WHITELIST = {
  b: "b",
  c: "t",
  d: "d",
  f: "f",
  g: "g",
  h: "h",
  j: "j",
  k: "k",
  m: "m",
  p: "p",
  q: "q",
  r: "r",
  s: "s",
  t: "t",
  v: "v",
  w: "w",
  x: "x",
  z: "z"
};
function getKanaToHepburnTree() {
  if (kanaToHepburnMap == null) {
    kanaToHepburnMap = createKanaToHepburnMap();
  }
  return kanaToHepburnMap;
}
function getKanaToRomajiTree(romanization) {
  switch (romanization) {
    case ROMANIZATIONS.HEPBURN:
      return getKanaToHepburnTree();
    default:
      return {};
  }
}
function createKanaToHepburnMap() {
  const romajiTree = transform(BASIC_ROMAJI);
  const subtreeOf = (string) => getSubTreeOf(romajiTree, string);
  const setTrans = (string, transliteration) => {
    subtreeOf(string)[""] = transliteration;
  };
  Object.entries(SPECIAL_SYMBOLS).forEach(([jsymbol, symbol]) => {
    subtreeOf(jsymbol)[""] = symbol;
  });
  [...Object.entries(SMALL_Y), ...Object.entries(SMALL_AIUEO)].forEach(([roma, kana]) => {
    setTrans(roma, kana);
  });
  YOON_KANA.forEach((kana) => {
    const firstRomajiChar = subtreeOf(kana)[""][0];
    Object.entries(SMALL_Y).forEach(([yKana, yRoma]) => {
      setTrans(kana + yKana, firstRomajiChar + yRoma);
    });
    Object.entries(SMALL_Y_EXTRA).forEach(([yKana, yRoma]) => {
      setTrans(kana + yKana, firstRomajiChar + yRoma);
    });
  });
  Object.entries(YOON_EXCEPTIONS).forEach(([kana, roma]) => {
    Object.entries(SMALL_Y).forEach(([yKana, yRoma]) => {
      setTrans(kana + yKana, roma + yRoma[1]);
    });
    setTrans(`${kana}\u3043`, `${roma}yi`);
    setTrans(`${kana}\u3047`, `${roma}e`);
  });
  romajiTree["\u3063"] = resolveTsu(romajiTree);
  Object.entries(SMALL_KANA).forEach(([kana, roma]) => {
    setTrans(kana, roma);
  });
  AMBIGUOUS_VOWELS.forEach((kana) => {
    setTrans(`\u3093${kana}`, `n'${subtreeOf(kana)[""]}`);
  });
  return Object.freeze(JSON.parse(JSON.stringify(romajiTree)));
}
function resolveTsu(tree) {
  return Object.entries(tree).reduce((tsuTree, [key, value]) => {
    if (!key) {
      const consonant = value.charAt(0);
      tsuTree[key] = Object.keys(SOKUON_WHITELIST).includes(consonant) ? SOKUON_WHITELIST[consonant] + value : value;
    } else {
      tsuTree[key] = resolveTsu(value);
    }
    return tsuTree;
  }, {});
}
var createKanaToRomajiMap = memoizeOne((romanization, customRomajiMapping) => {
  let map = getKanaToRomajiTree(romanization);
  if (customRomajiMapping) {
    map = mergeCustomMapping(map, customRomajiMapping);
  }
  return map;
}, dequal);
function toRomaji(input = "", options = {}, map) {
  const config = mergeWithDefaultOptions(options);
  if (!map) {
    map = createKanaToRomajiMap(config.romanization, config.customRomajiMapping);
  }
  return splitIntoRomaji(input, config, map).map((romajiToken) => {
    const [start, end, romaji] = romajiToken;
    const makeUpperCase = config.upcaseKatakana && isKatakana(input.slice(start, end));
    return makeUpperCase ? romaji.toUpperCase() : romaji;
  }).join("");
}
function splitIntoRomaji(input, options, map) {
  if (!map) {
    map = createKanaToRomajiMap(options.romanization, options.customRomajiMapping);
  }
  const config = Object.assign({}, { isDestinationRomaji: true }, options);
  return applyMapping(katakanaToHiragana(input, toRomaji, config), map, !options.IMEMode);
}
function isCharEnglishPunctuation(char = "") {
  if (isEmpty(char))
    return false;
  return EN_PUNCTUATION_RANGES.some(([start, end]) => isCharInRange(char, start, end));
}
function toHiragana(input = "", options = {}) {
  const config = mergeWithDefaultOptions(options);
  if (config.passRomaji) {
    return katakanaToHiragana(input, toRomaji, config);
  }
  if (isMixed(input, { passKanji: true })) {
    const convertedKatakana = katakanaToHiragana(input, toRomaji, config);
    return toKana(convertedKatakana.toLowerCase(), config);
  }
  if (isRomaji(input) || isCharEnglishPunctuation(input)) {
    return toKana(input.toLowerCase(), config);
  }
  return katakanaToHiragana(input, toRomaji, config);
}
function toKatakana(input = "", options = {}) {
  const mergedOptions = mergeWithDefaultOptions(options);
  if (mergedOptions.passRomaji) {
    return hiraganaToKatakana(input);
  }
  if (isMixed(input) || isRomaji(input) || isCharEnglishPunctuation(input)) {
    const hiragana = toKana(input.toLowerCase(), mergedOptions);
    return hiraganaToKatakana(hiragana);
  }
  return hiraganaToKatakana(input);
}
function isCharJapanesePunctuation(char = "") {
  if (isEmpty(char) || isCharIterationMark(char))
    return false;
  return JA_PUNCTUATION_RANGES.some(([start, end]) => isCharInRange(char, start, end));
}
var isCharEnSpace = (x) => x === " ";
var isCharJaSpace = (x) => x === "\u3000";
var isCharJaNum = (x) => /[０-９]/.test(x);
var isCharEnNum = (x) => /[0-9]/.test(x);
var TOKEN_TYPES = {
  EN: "en",
  JA: "ja",
  EN_NUM: "englishNumeral",
  JA_NUM: "japaneseNumeral",
  EN_PUNC: "englishPunctuation",
  JA_PUNC: "japanesePunctuation",
  KANJI: "kanji",
  HIRAGANA: "hiragana",
  KATAKANA: "katakana",
  SPACE: "space",
  OTHER: "other"
};
function getType(input, compact = false) {
  const { EN, JA, EN_NUM, JA_NUM, EN_PUNC, JA_PUNC, KANJI, HIRAGANA, KATAKANA, SPACE, OTHER } = TOKEN_TYPES;
  if (compact) {
    switch (true) {
      case isCharJaNum(input):
        return OTHER;
      case isCharEnNum(input):
        return OTHER;
      case isCharEnSpace(input):
        return EN;
      case isCharEnglishPunctuation(input):
        return OTHER;
      case isCharJaSpace(input):
        return JA;
      case isCharJapanesePunctuation(input):
        return OTHER;
      case isCharJapanese(input):
        return JA;
      case isCharRomaji(input):
        return EN;
      default:
        return OTHER;
    }
  } else {
    switch (true) {
      case isCharJaSpace(input):
        return SPACE;
      case isCharEnSpace(input):
        return SPACE;
      case isCharJaNum(input):
        return JA_NUM;
      case isCharEnNum(input):
        return EN_NUM;
      case isCharEnglishPunctuation(input):
        return EN_PUNC;
      case isCharJapanesePunctuation(input):
        return JA_PUNC;
      case isCharKanji(input):
        return KANJI;
      case isCharHiragana(input):
        return HIRAGANA;
      case isCharKatakana(input):
        return KATAKANA;
      case isCharJapanese(input):
        return JA;
      case isCharRomaji(input):
        return EN;
      default:
        return OTHER;
    }
  }
}
function tokenize(input, { compact = false, detailed = false } = {}) {
  if (input == null || isEmpty(input)) {
    return [];
  }
  const chars = [...input];
  let initial = chars.shift();
  let prevType = getType(initial, compact);
  initial = detailed ? { type: prevType, value: initial } : initial;
  const result = chars.reduce((tokens, char) => {
    const currType = getType(char, compact);
    const sameType = currType === prevType;
    prevType = currType;
    let newValue = char;
    if (sameType) {
      newValue = (detailed ? tokens.pop().value : tokens.pop()) + newValue;
    }
    return detailed ? tokens.concat({ type: currType, value: newValue }) : tokens.concat(newValue);
  }, [initial]);
  return result;
}
var isLeadingWithoutInitialKana = (input, leading) => leading && !isKana(input[0]);
var isTrailingWithoutFinalKana = (input, leading) => !leading && !isKana(input[input.length - 1]);
var isInvalidMatcher = (input, matchKanji) => matchKanji && ![...matchKanji].some(isKanji) || !matchKanji && isKana(input);
function stripOkurigana(input = "", { leading = false, matchKanji = "" } = {}) {
  if (!isJapanese(input) || isLeadingWithoutInitialKana(input, leading) || isTrailingWithoutFinalKana(input, leading) || isInvalidMatcher(input, matchKanji)) {
    return input;
  }
  const chars = matchKanji || input;
  const okuriganaRegex = new RegExp(leading ? `^${tokenize(chars).shift()}` : `${tokenize(chars).pop()}$`);
  return input.replace(okuriganaRegex, "");
}
export {
  ROMANIZATIONS,
  TO_KANA_METHODS,
  VERSION,
  bind,
  isHiragana,
  isJapanese,
  isKana,
  isKanji,
  isKatakana,
  isMixed,
  isRomaji,
  stripOkurigana,
  toHiragana,
  toKana,
  toKatakana,
  toRomaji,
  tokenize,
  unbind
};
//# sourceMappingURL=wanakana.js.map
