"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Transliterator = (function () {
  function Transliterator(alphabet) {
    _classCallCheck(this, Transliterator);

    this.alphabet = alphabet;
  }

  _createClass(Transliterator, {
    escape: {

      // if a string to be transliterated contains any characters which have special
      // meaning in regular expressions, escape them

      value: function escape(raw) {
        return raw.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
      }
    },
    transliterate: {
      value: function transliterate(from, to, text) {
        var _this = this;

        if (!this.alphabet) {
          return text;
        }var rules = this.alphabet.map(function (grapheme) {
          return [grapheme[from], grapheme[to]];
        });

        //console.log(rules.map(r => `${r[0]} ${r[1]}`).join('\n'));

        rules.sort(function (a, b) {

          var feeding = function (a, b) {
            return a[1] == b[0];
          };

          return feeding || a[0].length < b[0].length ? -1 : 1;
        });

        rules.forEach(function (rule, i) {
          var before = _this.escape(rule[0]),
              after = _this.escape(rule[1]),
              re = new RegExp(before, "g");

          var wastext = text;
          text = text.replace(re, rule[1]);
          if (before.match(re) && ["sh", "j", "x", "y"].indexOf(before) > -1 || ["sh", "j", "x", "y"].indexOf(after) > -1 && wastext != text) {
            console.log("[" + wastext + "→" + text + "] " + i + ": «" + before + "→" + after + "» (" + from + "»" + to + ") ");
          }
        });

        return text;
      }
    }
  });

  return Transliterator;
})();

//console.log('\n');