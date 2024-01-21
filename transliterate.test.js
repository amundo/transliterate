import {transliterate} from './transliterate.js'
import { 
  equal,
  assert,
  assertEquals,
  assertNotEquals,
  assertStrictEquals,
  assertStringIncludes,
  assertMatch,
  assertNotMatch,
  assertArrayIncludes,
  assertObjectMatch,
  assertThrows,
  assertThrowsAsync } from "https://deno.land/std@0.95.0/testing/asserts.ts"

let greekOrthography = [
  { ancient: 'Α', modern: 'A' },
  { ancient: 'α', modern: 'a' },
  { ancient: 'Β', modern: 'B' },
  { ancient: 'β', modern: 'b' },
  { ancient: 'Γ', modern: 'G' },
  { ancient: 'γ', modern: 'g' },
  { ancient: 'Δ', modern: 'D' },
  { ancient: 'δ', modern: 'd' },
  { ancient: 'Ε', modern: 'E' },
  { ancient: 'ε', modern: 'e' },
  { ancient: 'Ζ', modern: 'Z' },
  { ancient: 'ζ', modern: 'z' },
  { ancient: 'Η', modern: 'E' },
  { ancient: 'η', modern: 'e' },
  { ancient: 'Θ', modern: 'Th' },
  { ancient: 'θ', modern: 'th' },
  { ancient: 'Ι', modern: 'I' },
  { ancient: 'ι', modern: 'i' },
  { ancient: 'Κ', modern: 'K' },
  { ancient: 'κ', modern: 'k' },
  { ancient: 'Λ', modern: 'L' },
  { ancient: 'λ', modern: 'l' },
  { ancient: 'Μ', modern: 'M' },
  { ancient: 'μ', modern: 'm' },
  { ancient: 'Ν', modern: 'N' },
  { ancient: 'ν', modern: 'n' },
  { ancient: 'Ξ', modern: 'X' },
  { ancient: 'ξ', modern: 'x' },
  { ancient: 'Ο', modern: 'O' },
  { ancient: 'ο', modern: 'o' },
  { ancient: 'Π', modern: 'P' },
  { ancient: 'π', modern: 'p' },
  { ancient: 'Ρ', modern: 'R' },
  { ancient: 'ρ', modern: 'r' },
  { ancient: 'Σ', modern: 'S' },
  { ancient: 'σ', modern: 's' },
  { ancient: 'ς', modern: 's' },
  { ancient: 'Τ', modern: 'T' },
  { ancient: 'τ', modern: 't' },
  { ancient: 'Υ', modern: 'Y' },
  { ancient: 'υ', modern: 'y' },
  { ancient: 'Φ', modern: 'F' },
  { ancient: 'φ', modern: 'f' },
  { ancient: 'Χ', modern: 'Ch' },
  { ancient: 'χ', modern: 'ch' },
  { ancient: 'Ψ', modern: 'Ps' },
  { ancient: 'ψ', modern: 'ps' },
  { ancient: 'Ω', modern: 'O' },
  { ancient: 'ω', modern: 'o' }
]

Deno.test("transliterate aaa AAA", () => 
  assertEquals(
    transliterate(
      'aaa', 
      [{lower: "a", upper: "A"}],
      "lower",
      "upper"
    ),
    "AAA"
  )
)

 
Deno.test("transliterate cha qa", () => 
assertEquals(
  transliterate(
    'cha', 
    [{from: "ch", to: "q"}],
    "from",
    "to"
  ),
  "qa"
)
)