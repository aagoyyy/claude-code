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
 * Detailed 2D editorial-cartoon chef, constructed entirely from SVG.
 * Animation is deterministic: pass values calculated from Remotion's frame.
 */
export const ChefCharacterV3: React.FC<ChefCharacterProps> = ({
  expression = "happy",
  blink = false,
  mouthOpen = false,
  headRotation = 0,
  spatulaRotation = 0,
  showSpatula = true,
  className,
}) => {
  const ink = "#2b1d19";
  const skin = "#f2b98e";
  const red = "#bd292e";

  const mouth = (() => {
    switch (expression) {
      case "sad":
        return <path d="M216 337 Q250 306 284 337" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />;
      case "neutral":
        return <path d="M219 334 Q250 341 281 334" fill="none" stroke={ink} strokeWidth="5.5" strokeLinecap="round" />;
      case "surprised":
        return <ellipse cx="250" cy="338" rx="13" ry="19" fill="#73383b" stroke={ink} strokeWidth="5" />;
      default:
        return mouthOpen
          ? <path d="M209 326 Q250 354 291 326 Q286 375 250 377 Q214 375 209 326Z" fill="#71373a" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
          : <path d="M210 326 Q250 351 290 326 Q283 365 250 365 Q217 365 210 326Z" fill="#fffdf8" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />;
    }
  })();

  const browPaths = expression === "sad"
    ? ["M188 247 Q208 225 232 246", "M268 246 Q292 225 312 247"]
    : expression === "angry"
    ? ["M188 244 L231 256", "M269 256 L312 244"]
    : ["M188 250 Q208 231 232 250", "M268 250 Q292 231 312 250"];

  return (
    <svg
      className={className}
      viewBox="0 0 500 760"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Detailed cartoon chef holding a spatula"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="chef3-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffdab6" />
          <stop offset=".42" stopColor="#f5c294" />
          <stop offset="1" stopColor="#dc9569" />
        </linearGradient>
        <linearGradient id="chef3-face" x1="0" y1="0" x2=".9" y2="1">
          <stop offset="0" stopColor="#ffdbb7" />
          <stop offset=".55" stopColor="#f4bd91" />
          <stop offset="1" stopColor="#e7a477" />
        </linearGradient>
        <linearGradient id="chef3-coat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e8e1d8" />
          <stop offset=".18" stopColor="#fffdf8" />
          <stop offset=".52" stopColor="#f8f4ed" />
          <stop offset=".82" stopColor="#fffdf8" />
          <stop offset="1" stopColor="#ddd5ca" />
        </linearGradient>
        <linearGradient id="chef3-apron" x1="0" y1="0" x2="1" y2=".2">
          <stop offset="0" stopColor="#982128" />
          <stop offset=".25" stopColor="#c83237" />
          <stop offset=".56" stopColor="#c02a31" />
          <stop offset="1" stopColor="#8f1d25" />
        </linearGradient>
        <linearGradient id="chef3-hair" x1="0" y1="0" x2=".8" y2="1">
          <stop offset="0" stopColor="#4b342d" />
          <stop offset=".38" stopColor="#241a18" />
          <stop offset="1" stopColor="#100d0c" />
        </linearGradient>
        <linearGradient id="chef3-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8f989e" />
          <stop offset=".25" stopColor="#eef0ef" />
          <stop offset=".65" stopColor="#c2c9ce" />
          <stop offset="1" stopColor="#858e95" />
        </linearGradient>
        <clipPath id="chef3-face-clip">
          <path d="M169 183 Q250 140 331 183 L327 282 Q323 361 250 389 Q177 361 173 282Z" />
        </clipPath>
      </defs>

      {/* Hair mass behind head: layered silhouette and individual locks */}
      <g>
        <path d="M164 218 Q145 191 158 159 Q149 131 174 112 Q171 83 204 81 Q218 54 249 72 Q278 48 301 75 Q335 65 344 101 Q370 116 352 151 Q365 185 339 226 L318 245 L179 243Z"
          fill="url(#chef3-hair)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
        <path d="M164 161 Q157 132 185 118 Q184 91 211 94 Q228 68 251 91 Q276 66 296 94 Q324 82 332 112 Q355 122 347 151 Q326 140 311 148 Q283 130 259 143 Q226 128 203 151 Q182 145 164 161Z"
          fill="#342522" stroke="#1a1312" strokeWidth="3.5" />
        <path d="M168 175 Q177 143 202 143 Q213 116 237 130 Q257 107 278 129 Q303 110 320 140 Q340 136 348 165"
          fill="none" stroke="#5a4038" strokeWidth="7" strokeLinecap="round" />
        <path d="M175 190 Q188 161 211 164 Q231 141 250 157 Q275 136 294 158 Q321 150 337 181"
          fill="none" stroke="#49332d" strokeWidth="7" strokeLinecap="round" />
        <path d="M181 204 Q200 181 218 185 Q237 164 255 180 Q277 163 294 181 Q315 175 329 198"
          fill="none" stroke="#60473e" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M178 129 Q190 99 215 104 M239 91 Q258 78 276 95 M298 101 Q319 97 327 119"
          fill="none" stroke="#70544a" strokeWidth="4.5" strokeLinecap="round" opacity=".85" />
        <path d="M160 164 Q153 194 169 220 M348 156 Q360 190 337 220"
          fill="none" stroke="#120f0e" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* Neck */}
      <path d="M220 367 L220 432 Q250 454 280 432 L280 367Z"
        fill="url(#chef3-skin)" stroke={ink} strokeWidth="5.5" />
      <path d="M222 402 Q250 420 278 402 L278 432 Q250 450 222 432Z" fill="#d99167" opacity=".45" />

      {/* Torso */}
      <path d="M213 414 Q177 419 148 444 Q116 471 105 526 L91 744 L409 744 L395 526 Q384 471 352 444 Q323 419 287 414 Q272 441 250 443 Q228 441 213 414Z"
        fill="url(#chef3-coat)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
      {/* Shoulder panels and sleeve seams */}
      <path d="M148 448 Q171 455 187 480 L165 504 L139 474Z M352 448 Q329 455 313 480 L335 504 L361 474Z"
        fill="#f1ece4" stroke={ink} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M126 520 Q116 566 128 614 M374 520 Q384 566 372 614"
        fill="none" stroke="#d6cec4" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M137 635 Q151 654 145 680 M363 635 Q349 654 355 680"
        fill="none" stroke="#e0d8ce" strokeWidth="4" strokeLinecap="round" />
      {/* Mandarin collar */}
      <path d="M213 410 Q218 439 250 452 Q282 439 287 410 L286 433 Q272 460 250 466 Q228 460 214 433Z"
        fill="#fffdf8" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M214 416 Q230 434 250 452 Q270 434 286 416"
        fill="none" stroke="#d6cec5" strokeWidth="3.5" />
      <circle cx="216" cy="474" r="7" fill="#eee7dd" stroke="#c9beb2" strokeWidth="2.5" />
      <circle cx="284" cy="474" r="7" fill="#eee7dd" stroke="#c9beb2" strokeWidth="2.5" />

      {/* Left sleeve, forearm and hand */}
      <path d="M151 455 Q119 470 107 520 Q92 572 110 628 L128 690 Q142 711 165 699 L178 678 Q157 632 164 584 L184 493Z"
        fill="url(#chef3-coat)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
      <path d="M119 676 Q137 692 165 677 L178 709 Q170 731 145 731 Q124 726 117 704Z"
        fill="url(#chef3-skin)" stroke={ink} strokeWidth="5.5" />
      <path d="M123 688 Q136 699 158 694" fill="none" stroke="#ffd8b5" strokeWidth="4" strokeLinecap="round" />

      {/* Right sleeve */}
      <path d="M349 455 Q381 469 394 510 Q406 550 387 589 L366 617 Q344 630 326 610 L319 587 Q341 557 334 521 L319 489Z"
        fill="url(#chef3-coat)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
      <path d="M342 481 Q362 502 365 533" fill="none" stroke="#d8d0c7" strokeWidth="4" strokeLinecap="round" />

      {/* Apron straps, metal buckles and apron body */}
      <path d="M190 421 L171 516 L198 524 L219 435Z M310 421 L329 516 L302 524 L281 435Z"
        fill="#ae252c" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M176 500 L201 500 L204 527 L175 527Z M299 500 L324 500 L327 527 L298 527Z"
        fill="#bd8a4b" stroke={ink} strokeWidth="4" />
      <rect x="184" y="506" width="11" height="13" rx="2" fill="#e5bd77" />
      <rect x="307" y="506" width="11" height="13" rx="2" fill="#e5bd77" />
      <path d="M174 520 Q250 531 326 520 L347 744 L153 744Z"
        fill="url(#chef3-apron)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
      <path d="M178 545 Q250 555 322 545" fill="none" stroke="#e65d59" strokeWidth="4.5" opacity=".8" />
      <path d="M181 554 Q250 563 319 554" fill="none" stroke="#7d1c22" strokeWidth="2.5" opacity=".65" />
      <path d="M264 574 L319 574 L319 646 Q291 653 264 646Z"
        fill="#a9242b" stroke="#701a20" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M270 582 L313 582" stroke="#e15a56" strokeWidth="3.5" opacity=".7" />
      <path d="M159 721 Q250 729 341 721" fill="none" stroke="#7f1b22" strokeWidth="3" opacity=".6" />

      {/* Head: face and features */}
      <g transform={`rotate(${headRotation} 250 275)`}>
        {/* Ears */}
        <path d="M171 239 Q146 217 145 255 Q145 293 176 300 L190 270Z"
          fill="url(#chef3-skin)" stroke={ink} strokeWidth="5.5" />
        <path d="M329 239 Q354 217 355 255 Q355 293 324 300 L310 270Z"
          fill="url(#chef3-skin)" stroke={ink} strokeWidth="5.5" />
        <path d="M157 252 Q169 245 175 273 M343 252 Q331 245 325 273"
          fill="none" stroke="#d58d64" strokeWidth="4.5" strokeLinecap="round" />

        {/* Face silhouette */}
        <path d="M169 181 Q250 137 331 181 L327 284 Q323 363 250 391 Q177 363 173 284Z"
          fill="url(#chef3-face)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
        <g clipPath="url(#chef3-face-clip)">
          <ellipse cx="194" cy="308" rx="24" ry="13" fill="#ee987d" opacity=".38" />
          <ellipse cx="306" cy="308" rx="24" ry="13" fill="#ee987d" opacity=".38" />
          <path d="M185 354 Q250 390 315 354" fill="none" stroke="#d58d64" strokeWidth="4" opacity=".35" />
          <path d="M180 202 Q250 169 320 202" fill="none" stroke="#fff0d9" strokeWidth="5" opacity=".55" />
        </g>

        {/* Brows and eyes */}
        <path d={browPaths[0]} fill="none" stroke={ink} strokeWidth="8.5" strokeLinecap="round" />
        <path d={browPaths[1]} fill="none" stroke={ink} strokeWidth="8.5" strokeLinecap="round" />
        {blink ? (
          <>
            <path d="M190 270 Q210 281 230 270 M270 270 Q290 281 310 270"
              fill="none" stroke={ink} strokeWidth="6.5" strokeLinecap="round" />
          </>
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

        {/* Nose with nostril/bridge accents */}
        <path d="M250 276 Q238 305 247 312 Q257 318 267 307"
          fill="none" stroke="#d58b61" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M244 312 Q250 317 258 313" fill="none" stroke="#c77b55" strokeWidth="3" strokeLinecap="round" />
        {mouth}

        {/* Bandana, visible fabric folds */}
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

        {/* Hairline curls over bandana */}
        <path d="M165 194 Q151 164 174 142 Q177 116 204 117 Q220 91 246 108 Q267 88 289 108 Q317 104 329 133 Q350 147 336 193 Q321 168 304 164 Q281 151 255 159 Q218 148 190 171Z"
          fill="url(#chef3-hair)" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
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
            fill="url(#chef3-metal)" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
          <path d="M378 174 L389 174 L384 240 L373 238Z" fill="#f4f5f2" opacity=".85" />
          <path d="M402 174 L411 175 L407 245" fill="none" stroke="#9ba4aa" strokeWidth="3.5" />
          <path d="M418 169 Q429 172 426 188 L421 239" fill="none" stroke="#7e878e" strokeWidth="3" opacity=".7" />

          {/* Hand wrapping the handle: palm, thumb and separated fingers */}
          <path d="M352 480 Q349 460 365 454 Q377 448 389 460 L400 477 Q406 490 395 502 Q386 511 371 502 L359 493Z"
            fill="url(#chef3-skin)" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          <path d="M355 475 Q368 481 392 481 M354 488 Q372 496 397 493"
            fill="none" stroke="#d58e65" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M358 465 Q347 452 356 441 Q367 430 380 440 L396 455 Q405 465 397 475 Q389 484 378 475Z"
            fill="url(#chef3-skin)" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          <path d="M361 448 Q374 453 389 466" fill="none" stroke="#ffd8b7" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};

export default ChefCharacterV3;
