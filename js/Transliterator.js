"use strict";

var _taggedTemplateLiteral = function (strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Transliterator = (function () {
  function Transliterator(alphabet, orthographies) {
    _classCallCheck(this, Transliterator);

    this.alphabet = alphabet;
    this.orthographies = orthographies || Object.keys(this.alphabet[0]);
  }

  _createClass(Transliterator, {
    escape: {

      // if a string to be transliterated contains any characters which have special
      // meaning in regular expressions, escape them

      value: function escape(raw) {
        return raw.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
      }
    },
    validate: {
      value: function validate() {}
    },
    transliterate: {
      value: function transliterate(from, to, text) {
        var rules = this.alphabet.map(function (grapheme) {
          return [grapheme[from], grapheme[to]];
        });

        rules.sort(function (a, b) {

          if (a[1] == b[0]) {
            // feeding
            return -1;
          }
          if (a[0].length > b[0].length) {
            // longest input not first
            return -1;
          }
          return 1;
        });

        rules.forEach(function (rule, i) {
          var before = String.raw(_taggedTemplateLiteral(["", ""], ["", ""]), rule[0]),
              after = String.raw(_taggedTemplateLiteral(["", ""], ["", ""]), rule[1]);

          text = text.replace(before, after);
        });

        return text;
      }
    }
  });

  return Transliterator;
})();

// check rules