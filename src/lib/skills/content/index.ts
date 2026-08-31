/**
 * Skills content index — loads individual lesson files and merges them
 * into the same shape the rest of the app expects.
 *
 * Each content/<track>-<order>.json exports { source, lessons: Lesson[] }.
 * This file assembles them so catalog.ts can import a single array.
 */

import type { Lesson } from "../catalog"

// ── Individual lesson imports ───────────────────────────────
import html01 from "./html-01.json"
import html02 from "./html-02.json"
import html03 from "./html-03.json"
import html04 from "./html-04.json"
import html05 from "./html-05.json"
import html06 from "./html-06.json"
import html07 from "./html-07.json"
import html08 from "./html-08.json"
import html09 from "./html-09.json"
import html10 from "./html-10.json"
import html11 from "./html-11.json"
import html12 from "./html-12.json"
import html13 from "./html-13.json"
import html14 from "./html-14.json"
import html15 from "./html-15.json"
import html16 from "./html-16.json"
import html17 from "./html-17.json"
import html18 from "./html-18.json"
import html19 from "./html-19.json"
import html20 from "./html-20.json"
import html21 from "./html-21.json"

import css22 from "./css-22.json"
import css23 from "./css-23.json"
import css24 from "./css-24.json"
import css25 from "./css-25.json"
import css26 from "./css-26.json"
import css27 from "./css-27.json"
import css28 from "./css-28.json"
import css29 from "./css-29.json"
import css30 from "./css-30.json"
import css31 from "./css-31.json"
import css32 from "./css-32.json"
import css33 from "./css-33.json"
import css34 from "./css-34.json"
import css35 from "./css-35.json"
import css36 from "./css-36.json"
import css37 from "./css-37.json"
import css38 from "./css-38.json"
import css39 from "./css-39.json"
import css40 from "./css-40.json"
import css41 from "./css-41.json"
import css42 from "./css-42.json"
import css43 from "./css-43.json"
import css44 from "./css-44.json"
import css45 from "./css-45.json"
import css46 from "./css-46.json"
import css47 from "./css-47.json"
import css48 from "./css-48.json"
import css49 from "./css-49.json"
import css50 from "./css-50.json"
import css51 from "./css-51.json"

// ── Merge all lessons ───────────────────────────────────────
const allModules = [
  html01, html02, html03, html04, html05, html06, html07,
  html08, html09, html10, html11, html12, html13, html14,
  html15, html16, html17, html18, html19, html20, html21,
  css22, css23, css24, css25, css26, css27, css28,
  css29, css30, css31, css32, css33, css34, css35,
  css36, css37, css38, css39, css40, css41, css42,
  css43, css44, css45, css46, css47, css48, css49,
  css50, css51,
]

export const source = allModules[0]?.source ?? ""

export const lessons: Lesson[] = allModules.flatMap(
  (m) => (m.lessons as Lesson[]) ?? [],
)
