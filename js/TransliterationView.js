"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TransliterationTableView = (function () {
  function TransliterationTableView(transliterator) {
    _classCallCheck(this, TransliterationTableView);

    this.transliterator = transliterator;
  }

  _createClass(TransliterationTableView, {
    json2table: {
      value: function json2table(data, columns) {
        var table = document.createElement("table");

        var headers = columns || Object.keys(data[0]);
        var ths = headers.map(function (h) {
          return "<th>" + h + "</th>";
        }).join("");
        var thead = "<thead><tr>" + ths + "</tr></thead>";
        table.insertAdjacentHTML("afterbegin", thead);
        var tbody = table.appendChild(document.createElement("tbody"));

        data.forEach(function (d) {
          var tr = document.createElement("tr");
          headers.forEach(function (header) {
            var td = document.createElement("td");
            td.textContent = d[header];
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });

        return table;
      }
    },
    render: {
      value: function render(columns) {
        var _this = this;

        var cmp = new Intl.Collator("es", { sensitivity: "base" });
        var alphabet = this.transliterator.alphabet;
        var columns = columns || this.transliterator.orthographies;
        alphabet = alphabet.sort(function (a, b) {
          return cmp.compare(a.practical, b.practical);
        });

        alphabet = alphabet.filter(function (c) {
          var orthographies = _this.transliterator.orthographies;
          var transliterations = Object.keys(c).map(function (k) {
            return c[k];
          });
          return new Set(transliterations).size != 1;
        });

        return this.json2table(alphabet, columns);
      }
    }
  });

  return TransliterationTableView;
})();

var TransliterationEditorView = (function () {
  function TransliterationEditorView(transliterator) {
    _classCallCheck(this, TransliterationEditorView);

    this.transliterator = transliterator;
  }

  _createClass(TransliterationEditorView, {
    renderChooser: {
      value: function renderChooser(orthography) {
        return "<label>\n      <input name=\"from\" value=\"" + orthography + "\" type=\"radio\">\n      " + orthography + "\n    </label>\n    ";
      }
    },
    template: {
      value: function template() {
        return "\n      <section class=before>\n        <div class=chooser>" + this.transliterator.orthographies.map(function (fromOrthography) {
          return "\n          <label><input name=\"from\" value=\"" + fromOrthography + "\" type=\"radio\" />" + fromOrthography + "</label>\n        ";
        }).join("\n") + "\n        </div>\n        <textarea spellcheck=\"false\"></textarea>\n      </section>\n\n      <section class=after>\n        <div class=chooser>" + this.transliterator.orthographies.map(function (toOrthography) {
          return "\n          <label><input name=\"to\" value=\"" + toOrthography + "\" type=\"radio\" />" + toOrthography + "</label>\n        ";
        }).join("\n") + "\n        </div>\n        <textarea spellcheck=\"false\"></textarea>\n      </section>\n    ";
      }
    },
    render: {
      value: function render() {
        var container = document.createElement("section");
        container.classList.add("transliterationEditor");
        container.innerHTML = this.template();
        var a = container.querySelector(".before input[name=\"from\"]:last-child");
        var b = container.querySelector(".after  input[name=\"to\"]:first-child");

        container.querySelector(".before label:first-child").querySelector("input").checked = true;
        container.querySelector(".after label:last-child").querySelector("input").checked = true;
        this.el = container;
        this.listen();
        return this.el;
      }
    },
    runTransliteration: {
      value: function runTransliteration() {
        var before = this.el.querySelector(".before textarea");
        var after = this.el.querySelector(".after textarea");
        var from = this.el.querySelector(".before input[type=\"radio\"]:checked").value;
        var to = this.el.querySelector(".after  input[type=\"radio\"]:checked").value;
        var transliterated = this.transliterator.transliterate(from, to, before.value);
        after.value = transliterated;
      }
    },
    listen: {
      value: function listen() {
        var _this = this;

        var tas = [].concat(_toConsumableArray(this.el.querySelectorAll("textarea")));
        var radios = [].concat(_toConsumableArray(this.el.querySelectorAll("input[type=\"radio\"]")));

        tas.forEach(function (ta) {
          ta.addEventListener("change", function () {
            _this.runTransliteration();
          });
          ta.addEventListener("keyup", function () {
            _this.runTransliteration();
          });
        });

        radios.forEach(function (radio) {
          radio.addEventListener("change", function (ev) {
            _this.runTransliteration();
          });
          radio.addEventListener("keyup", function (ev) {
            _this.runTransliteration();
          });
        });
      }
    }
  });

  return TransliterationEditorView;
})();

var TransliterationInputView = (function () {
  function TransliterationInputView(transliterator, input) {
    _classCallCheck(this, TransliterationInputView);

    this.input = input;
    this.data = {};
    this.transliterator = transliterator;
    this.listen();
  }

  _createClass(TransliterationInputView, {
    render: {
      value: function render() {
        var _this = this;

        [].concat(_toConsumableArray(document.querySelectorAll("p.transliterated"))).forEach(function (p) {
          p.remove();
        });

        var orthographies = this.transliterator.orthographies;

        orthographies.forEach(function (o) {
          _this.input.dataset[o] = _this.data[o] = _this.transliterator.transliterate(_this.input.lang, o, _this.input.value);
        });

        orthographies.forEach(function (o) {
          if (o != _this.input.lang) {
            _this.input.insertAdjacentHTML("afterend", "<p class=transliterated lang=\"" + o + "\"><small>" + o + "</small> " + _this.input.dataset[o] + "</p>");
          }
        });
      }
    },
    listen: {
      value: function listen() {
        var _this = this;

        this.input.addEventListener("keyup", function (ev) {
          return _this.render();
        });
      }
    }
  });

  return TransliterationInputView;
})();

var TransliterationLayout = (function () {
  function TransliterationLayout(transliterator) {
    _classCallCheck(this, TransliterationLayout);

    this.transliterator = transliterator;

    this.table = new TransliterationTableView(this.transliterator);
    this.editor = new TransliterationEditorView(this.transliterator);

    this.container = document.createElement("section");
    this.container.classList.add("transliterationLayout");
  }

  _createClass(TransliterationLayout, {
    render: {
      value: function render() {
        this.container.appendChild(this.table.render());
        this.container.appendChild(this.editor.render());
        return this.container;
      }
    }
  });

  return TransliterationLayout;
})();