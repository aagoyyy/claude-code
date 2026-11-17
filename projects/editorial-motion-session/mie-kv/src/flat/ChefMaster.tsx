import React from "react";

export type ChefExpression = "happy" | "neutral" | "sad" | "surprised";

export interface ChefCharacterProps {
  expression?: ChefExpression;
  blink?: boolean;
  mouthOpen?: boolean;
  headRotation?: number;
  spatulaRotation?: number;
  showSpatula?: boolean;
  className?: string;
}

/**
 * Master chef character — hand-built SVG illustration.
 * Keep the paths and proportions as the canonical character design.
 * For Remotion, derive blink/mouthOpen/headRotation/spatulaRotation from useCurrentFrame().
 */
export const ChefMaster: React.FC<ChefCharacterProps> = ({
  expression = "happy",
  blink = false,
  mouthOpen = false,
  headRotation = 0,
  spatulaRotation = 0,
  showSpatula = true,
  className,
}) => {
  const ink = "#2b201d";

  const mouth = (() => {
    if (expression === "neutral") {
      return <path d="M215 337 Q250 345 285 337" fill="none" stroke={ink} strokeWidth="5.5" strokeLinecap="round" />;
    }
    if (expression === "sad") {
      return <path d="M211 344 Q250 309 289 344" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />;
    }
    if (expression === "surprised") {
      return <ellipse cx="250" cy="341" rx="13" ry="19" fill="#733b3b" stroke={ink} strokeWidth="5" />;
    }
    return mouthOpen
      ? <path d="M207 327 Q250 356 293 327 Q286 381 250 383 Q214 381 207 327Z" fill="#743638" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
      : <path d="M209 326 Q250 354 291 326 Q284 368 250 368 Q216 368 209 326Z" fill="#fffdf8" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />;
  })();

  const brows = expression === "sad"
    ? <>
        <path d="M184 246 Q205 222 231 247" />
        <path d="M269 247 Q295 222 316 246" />
      </>
    : expression === "surprised"
    ? <>
        <path d="M184 239 Q207 218 232 239" />
        <path d="M268 239 Q293 218 316 239" />
      </>
    : <>
        <path d="M184 249 Q207 226 232 249" />
        <path d="M268 249 Q293 226 316 249" />
      </>;

  return (
    <svg
      className={className}
      viewBox="0 0 500 760"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustrated chef with red bandana, white chef jacket, red apron and spatula"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="chefMasterSkin" x1="0" y1="0" x2="0.95" y2="1">
          <stop offset="0" stopColor="#ffdbb8" />
          <stop offset=".42" stopColor="#f6c397" />
          <stop offset="1" stopColor="#e7a071" />
        </linearGradient>
        <linearGradient id="chefMasterCoat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e7e0d7" />
          <stop offset=".18" stopColor="#fffdf8" />
          <stop offset=".53" stopColor="#f8f5ef" />
          <stop offset=".82" stopColor="#fffdf8" />
          <stop offset="1" stopColor="#ded7ce" />
        </linearGradient>
        <linearGradient id="chefMasterApron" x1="0" y1="0" x2="1" y2=".15">
          <stop offset="0" stopColor="#98232a" />
          <stop offset=".24" stopColor="#c83237" />
          <stop offset=".55" stopColor="#c12d33" />
          <stop offset="1" stopColor="#922129" />
        </linearGradient>
        <linearGradient id="chefMasterHair" x1="0" y1="0" x2=".8" y2="1">
          <stop offset="0" stopColor="#49332d" />
          <stop offset=".43" stopColor="#241a18" />
          <stop offset="1" stopColor="#100d0c" />
        </linearGradient>
        <linearGradient id="chefMasterMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#89939a" />
          <stop offset=".28" stopColor="#f0f2f1" />
          <stop offset=".68" stopColor="#c5cbd0" />
          <stop offset="1" stopColor="#858e95" />
        </linearGradient>
        <clipPath id="chefMasterFaceClip">
          <path d="M169 180 Q250 137 331 180 L327 282 Q323 362 250 390 Q177 362 173 282Z" />
        </clipPath>
      </defs>

      {/* Back hair silhouette and curls */}
      <g>
        <path d="M163 211 C148 190 151 169 160 151 C151 126 166 103 187 96 C188 69 215 59 235 74 C253 52 279 59 291 77 C317 67 339 85 338 109 C359 123 361 148 346 168 C354 191 344 214 330 232 L177 234Z"
          fill="url(#chefMasterHair)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
        <path d="M166 153 Q158 124 185 111 Q185 86 211 89 Q229 67 248 91 Q271 66 292 91 Q321 82 329 111 Q352 122 344 151 Q324 140 310 151 Q285 132 261 146 Q232 131 208 151 Q184 144 166 153Z"
          fill="#33231f" stroke="#1b1412" strokeWidth="3.5" />
        <path d="M168 163 Q176 135 199 137 Q213 111 235 127 Q254 106 273 128 Q299 108 316 137 Q337 133 346 160"
          fill="none" stroke="#5a4037" strokeWidth="7" strokeLinecap="round" />
        <path d="M174 183 Q185 154 207 158 Q225 135 246 153 Q268 133 287 154 Q313 145 334 177"
          fill="none" stroke="#4a342d" strokeWidth="7" strokeLinecap="round" />
        <path d="M181 200 Q198 176 218 180 Q236 159 254 177 Q275 159 293 178 Q315 171 328 195"
          fill="none" stroke="#60473e" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M179 126 Q194 97 216 105 M237 91 Q254 78 274 96 M298 105 Q318 99 327 121"
          fill="none" stroke="#70534a" strokeWidth="4.5" strokeLinecap="round" />
      </g>

      {/* Neck */}
      <path d="M220 369 L220 433 Q250 455 280 433 L280 369Z"
        fill="url(#chefMasterSkin)" stroke={ink} strokeWidth="5.5" />
      <path d="M222 405 Q250 425 278 405 L278 433 Q250 451 222 433Z" fill="#d99168" opacity=".42" />

      {/* Jacket silhouette */}
      <path d="M213 414 Q178 419 148 444 Q116 471 105 526 L91 744 L409 744 L395 526 Q384 471 352 444 Q322 419 287 414 Q272 441 250 443 Q228 441 213 414Z"
        fill="url(#chefMasterCoat)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
      {/* Jacket shoulder and sleeve tailoring */}
      <path d="M148 449 Q171 454 188 481 L165 504 L138 474Z M352 449 Q329 454 312 481 L335 504 L362 474Z"
        fill="#f1ece5" stroke={ink} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M125 521 Q115 568 129 617 M375 521 Q385 568 371 617"
        fill="none" stroke="#d3cbc1" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M137 633 Q151 653 145 681 M363 633 Q349 653 355 681"
        fill="none" stroke="#e0d8ce" strokeWidth="4" strokeLinecap="round" />
      <path d="M153 472 Q169 482 177 502 M347 472 Q331 482 323 502"
        fill="none" stroke="#d9d1c8" strokeWidth="3.5" />
      {/* Mandarin collar and buttons */}
      <path d="M213 410 Q219 439 250 452 Q281 439 287 410 L286 433 Q272 460 250 466 Q228 460 214 433Z"
        fill="#fffdf8" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M214 416 Q230 435 250 452 Q270 435 286 416"
        fill="none" stroke="#d4ccc2" strokeWidth="3.5" />
      <circle cx="216" cy="475" r="7" fill="#eee8df" stroke="#c9beb3" strokeWidth="2.5" />
      <circle cx="284" cy="475" r="7" fill="#eee8df" stroke="#c9beb3" strokeWidth="2.5" />

      {/* Left sleeve and resting hand */}
      <path d="M151 455 Q119 470 107 520 Q92 572 110 628 L128 690 Q142 711 165 699 L178 678 Q157 632 164 584 L184 493Z"
        fill="url(#chefMasterCoat)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
      <path d="M119 676 Q137 692 165 677 L178 709 Q170 731 145 731 Q124 726 117 704Z"
        fill="url(#chefMasterSkin)" stroke={ink} strokeWidth="5.5" />
      <path d="M124 689 Q139 700 159 694" fill="none" stroke="#ffdab8" strokeWidth="4" strokeLinecap="round" />

      {/* Right sleeve */}
      <path d="M349 455 Q381 469 394 510 Q406 550 387 589 L366 617 Q344 630 326 610 L319 587 Q341 557 334 521 L319 489Z"
        fill="url(#chefMasterCoat)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
      <path d="M345 480 Q362 501 365 533 M373 572 Q366 590 351 599"
        fill="none" stroke="#d8d0c7" strokeWidth="4" strokeLinecap="round" />

      {/* Apron straps, buckles and bib */}
      <path d="M190 421 L171 516 L198 524 L219 435Z M310 421 L329 516 L302 524 L281 435Z"
        fill="#ae252c" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M176 500 L201 500 L204 527 L175 527Z M299 500 L324 500 L327 527 L298 527Z"
        fill="#bd8a4b" stroke={ink} strokeWidth="4" />
      <rect x="184" y="506" width="11" height="13" rx="2" fill="#e5bd77" />
      <rect x="307" y="506" width="11" height="13" rx="2" fill="#e5bd77" />
      <path d="M174 520 Q250 531 326 520 L347 744 L153 744Z"
        fill="url(#chefMasterApron)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
      <path d="M178 545 Q250 555 322 545" fill="none" stroke="#e65d59" strokeWidth="4.5" opacity=".8" />
      <path d="M181 554 Q250 563 319 554" fill="none" stroke="#811c23" strokeWidth="2.5" opacity=".65" />
      <path d="M264 574 L319 574 L319 646 Q291 653 264 646Z"
        fill="#a9242b" stroke="#701a20" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M270 582 L313 582" stroke="#e15a56" strokeWidth="3.5" opacity=".7" />
      <path d="M159 721 Q250 729 341 721" fill="none" stroke="#7f1b22" strokeWidth="3" opacity=".6" />

      {/* Head group */}
      <g transform={`rotate(${headRotation} 250 275)`}>
        {/* Ears */}
        <path d="M171 239 Q146 217 145 255 Q145 293 176 300 L190 270Z"
          fill="url(#chefMasterSkin)" stroke={ink} strokeWidth="5.5" />
        <path d="M329 239 Q354 217 355 255 Q355 293 324 300 L310 270Z"
          fill="url(#chefMasterSkin)" stroke={ink} strokeWidth="5.5" />
        <path d="M157 252 Q169 245 175 273 M343 252 Q331 245 325 273"
          fill="none" stroke="#d58d64" strokeWidth="4.5" strokeLinecap="round" />

        {/* Face */}
        <path d="M169 180 Q250 137 331 180 L327 282 Q323 362 250 390 Q177 362 173 282Z"
          fill="url(#chefMasterSkin)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
        <g clipPath="url(#chefMasterFaceClip)">
          <ellipse cx="194" cy="309" rx="24" ry="13" fill="#ee987d" opacity=".42" />
          <ellipse cx="306" cy="309" rx="24" ry="13" fill="#ee987d" opacity=".42" />
          <path d="M183 352 Q250 391 317 352" fill="none" stroke="#d58d64" strokeWidth="4" opacity=".32" />
          <path d="M181 201 Q250 169 319 201" fill="none" stroke="#fff0d9" strokeWidth="5" opacity=".5" />
        </g>

        {/* Brows */}
        <g fill="none" stroke={ink} strokeWidth="8.5" strokeLinecap="round">{brows}</g>

        {/* Eyes */}
        {blink ? (
          <path d="M190 270 Q210 281 230 270 M270 270 Q290 281 310 270"
            fill="none" stroke={ink} strokeWidth="6.5" strokeLinecap="round" />
        ) : (
          <>
            <ellipse cx="210" cy="271" rx="12" ry="15" fill="#fffdf9" />
            <ellipse cx="212" cy="272" rx="7.5" ry="11" fill="#241b19" />
            <circle cx="216" cy="267" r="3.3" fill="#fff" />
            <ellipse cx="290" cy="271" rx="12" ry="15" fill="#fffdf9" />
            <ellipse cx="288" cy="272" rx="7.5" ry="11" fill="#241b19" />
            <circle cx="284" cy="267" r="3.3" fill="#fff" />
          </>
        )}

        {/* Nose */}
        <path d="M250 276 Q238 305 247 312 Q257 318 267 307"
          fill="none" stroke="#d58b61" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M244 312 Q250 317 258 313" fill="none" stroke="#c77b55" strokeWidth="3" strokeLinecap="round" />

        {mouth}

        {/* Red patterned bandana */}
        <path d="M165 190 Q250 157 335 190 L332 224 Q250 199 168 224Z"
          fill="#c52c32" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
        <path d="M172 197 Q250 169 328 197" fill="none" stroke="#f36d66" strokeWidth="3.5" />
        <path d="M171 215 Q250 191 331 215" fill="none" stroke="#8f1d25" strokeWidth="2.5" opacity=".75" />
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i} transform={`translate(${181 + i * 17.2} ${198 - Math.sin((i / 8) * Math.PI) * 5})`}>
            <path d="M0 -6 L5 0 L0 6 L-5 0Z" fill="none" stroke="#ffe9dc" strokeWidth="2.6" />
            <circle cx="0" cy="0" r="1.5" fill="#ffe9dc" />
          </g>
        ))}

        {/* Front curls */}
        <path d="M165 194 Q151 164 174 142 Q177 116 204 117 Q220 91 246 108 Q267 88 289 108 Q317 104 329 133 Q350 147 336 193 Q321 168 304 164 Q281 151 255 159 Q218 148 190 171Z"
          fill="url(#chefMasterHair)" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
        <path d="M179 148 Q194 119 216 132 Q233 107 251 128 Q273 104 291 130 Q311 119 326 148"
          fill="none" stroke="#6a4d43" strokeWidth="5" strokeLinecap="round" />
        <path d="M180 166 Q200 145 220 158 M235 144 Q255 128 273 148 M281 151 Q302 137 320 162"
          fill="none" stroke="#4c352e" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* Spatula shaft and blade */}
      {showSpatula && (
        <g transform={`rotate(${spatulaRotation} 377 520)`}>
          <path d="M370 527 L386 527 L398 273 L378 271Z"
            fill="#92552f" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
          <path d="M379 286 L392 286 L388 350" fill="none" stroke="#c48650" strokeWidth="3.5" />
          <path d="M367 169 Q368 155 383 156 L422 159 Q437 160 436 176 L430 245 Q429 259 416 264 L379 260 L364 244Z"
            fill="url(#chefMasterMetal)" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
          <path d="M378 174 L389 174 L384 240 L373 238Z" fill="#f4f5f2" opacity=".85" />
          <path d="M402 174 L411 175 L407 245" fill="none" stroke="#9ba4aa" strokeWidth="3.5" />
          {/* Hand wraps across the handle */}
          <path d="M352 480 Q349 460 365 454 Q377 448 389 460 L400 477 Q406 490 395 502 Q386 511 371 502 L359 493Z"
            fill="url(#chefMasterSkin)" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          <path d="M355 475 Q368 481 392 481 M354 488 Q372 496 397 493"
            fill="none" stroke="#d58e65" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M358 465 Q347 452 356 441 Q367 430 380 440 L396 455 Q405 465 397 475 Q389 484 378 475Z"
            fill="url(#chefMasterSkin)" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          <path d="M361 448 Q374 453 389 466" fill="none" stroke="#ffd8b7" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};

export default ChefMaster;
