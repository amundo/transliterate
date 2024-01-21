/**
 * @function escape
 * @param {string} unescaped - The string to be escaped
 * @throws {TypeError} If the provided parameter is not a string
 * @returns {string} The escaped string
 */
let  escape = unescaped => { 
  if(typeof unescaped != 'string'){ 
    throw new TypeError(`alphabet in definition not a string: ${unescaped}`) 
  }

  return unescaped.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1")
}

/**
 * @function phonemize
 * @param {string} text - The text to be phonemized
 * @param {Array} orthography - The orthography array
 * @param {string} orthographyName - The name of the orthography
 * @returns {Array} - An array of phonemes
 */
let phonemize = (text, orthography, orthographyName) => {
  if (typeof text !== 'string') {
    throw new TypeError("Text must be a string")
  }
  if (!Array.isArray(orthography)) {
    throw new TypeError("Orthography must be an array")
  }
  if (typeof orthographyName !== 'string') {
    throw new TypeError("Orthography name must be a string")
  }
  if (orthography.some(phoneme => typeof phoneme[orthographyName] !== 'string')) {
    throw new TypeError("Invalid element in orthography array")
  }

  let phonemes = orthography.map(phoneme => phoneme[orthographyName])
  phonemes.sort((a,b) => (a.length < b.length) ? 1 : -1)

  phonemes = phonemes.map(phoneme => escape(phoneme))

  let pattern = `(${phonemes.join('|')})`
  let splitter = new RegExp(pattern, 'g')

  return text
    .split(splitter)
    .filter(x => x)
}

/**
 * @function transliterate
 * @param {string} text - The text to be transliterated
 * @param {Array} orthography - The orthography array
 * @param {string} from - The starting orthography
 * @param {string} to - The target orthography
 * @returns {string} - The transliterated text
 */
let transliterate = (text, orthography, from, to) => {
  if (typeof text !== 'string') {
    throw new TypeError("Text must be a string")
  }

  if (!Array.isArray(orthography)) {
    throw new TypeError("Orthography must be an array")
  }

  if (typeof from !== 'string' || typeof to !== 'string') {
    throw new TypeError("Orthography names must be strings")
  }

  if (orthography.some(letter => typeof letter[from] === 'undefined' || typeof letter[to] === 'undefined')) {
    throw new Error("Orthography array does not contain required keys")
  }

  let substitutions = orthography.reduce((substitutions, letter) => {
    substitutions[letter[from]] = letter[to]  
    return substitutions
  }, {})

  let phonemeList = phonemize(text, orthography, from)

  return phonemeList
    .map(phoneme => 
      substitutions[phoneme] ? substitutions[phoneme] : phoneme
    )
    .join('')
}


export {transliterate}
