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
 * Front-facing illustrated chef, built entirely from editable SVG paths.
 * Intended for Remotion. Drive all motion with props derived from useCurrentFrame().
 */
export const ChefCharacterV2: React.FC<ChefCharacterProps> = ({
  expression = "happy",
  blink = false,
  mouthOpen = false,
  headRotation = 0,
  spatulaRotation = 0,
  showSpatula = true,
  className,
}) => {
  const ink = "#241b19";
  const skin = "#f2b985";
  const skinLight = "#ffd0a0";
  const skinShade = "#d99161";
  const red = "#b92c2d";
  const jacket = "#fffaf2";

  const mouth = (() => {
    if (expression === "sad") {
      return <path d="M218 326 Q250 300 282 326" fill="none" stroke={ink} strokeWidth="5.5" strokeLinecap="round" />;
    }
    if (expression === "neutral") {
      return <path d="M219 324 Q250 331 281 324" fill="none" stroke={ink} strokeWidth="5.5" strokeLinecap="round" />;
    }
    if (expression === "surprised") {
      return <ellipse cx="250" cy="330" rx="12" ry="18" fill="#71363a" stroke={ink} strokeWidth="4.5" />;
    }
    return mouthOpen
      ? <path d="M211 316 Q250 343 289 316 Q282 362 250 362 Q218 362 211 316Z" fill="#71363a" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
      : <path d="M211 316 Q250 340 289 316 Q281 350 250 350 Q219 350 211 316Z" fill="#fff" stroke={ink} strokeWidth="5" strokeLinejoin="round" />;
  })();

  return (
    <svg
      className={className}
      viewBox="0 0 500 760"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Front-facing cartoon chef in a white jacket and red apron holding a spatula"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="chefSkin" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={skinLight} />
          <stop offset=".65" stopColor={skin} />
          <stop offset="1" stopColor="#e9a16e" />
        </linearGradient>
        <linearGradient id="chefCoat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#eee9e1" />
          <stop offset=".25" stopColor="#fffdf8" />
          <stop offset=".75" stopColor="#fffaf2" />
          <stop offset="1" stopColor="#e8e1d8" />
        </linearGradient>
        <linearGradient id="chefApron" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9f2228" />
          <stop offset=".45" stopColor="#c83235" />
          <stop offset="1" stopColor="#a62229" />
        </linearGradient>
        <linearGradient id="chefHair" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#44302a" />
          <stop offset=".45" stopColor="#211917" />
          <stop offset="1" stopColor="#100e0e" />
        </linearGradient>
      </defs>

      {/* Hair silhouette behind the head */}
      <g>
        <path d="M169 176 C151 158 154 132 173 116 C170 94 194 80 216 83 C230 60 261 62 278 78 C302 65 329 81 330 103 C354 111 363 138 348 158 L333 207 L169 207Z"
          fill="url(#chefHair)" stroke={ink} strokeWidth="6" strokeLinejoin="round" />
        <path d="M170 144 C158 124 178 105 194 108 C193 89 216 84 230 99 C244 75 272 78 282 99 C303 81 326 96 324 116 C346 123 349 146 333 161 C308 144 284 151 260 144 C226 137 197 158 170 144Z"
          fill="#30221f" stroke="#1b1514" strokeWidth="4" strokeLinejoin="round" />
        <path d="M183 123 Q197 94 222 101 Q237 83 257 99 Q278 82 297 102 Q321 98 334 124"
          fill="none" stroke="#57413a" strokeWidth="7" strokeLinecap="round" />
        <path d="M174 151 Q191 133 207 142 M292 137 Q319 128 334 148"
          fill="none" stroke="#100e0e" strokeWidth="9" strokeLinecap="round" />
      </g>

      {/* Neck */}
      <path d="M220 363 L220 425 Q250 444 280 425 L280 363Z"
        fill="url(#chefSkin)" stroke={ink} strokeWidth="5" />

      {/* Torso / jacket */}
      <path d="M214 411 Q179 416 150 440 Q119 464 108 516 L91 744 L409 744 L392 516 Q381 464 350 440 Q321 416 286 411 Q271 437 250 438 Q229 437 214 411Z"
        fill="url(#chefCoat)" stroke={ink} strokeWidth="6" strokeLinejoin="round" />
      {/* Jacket side folds */}
      <path d="M145 471 Q124 528 130 615 M355 471 Q376 528 370 615"
        fill="none" stroke="#d8d0c7" strokeWidth="5" strokeLinecap="round" />
      <path d="M119 555 Q137 575 132 608 M381 555 Q363 575 368 608"
        fill="none" stroke="#e2d9cf" strokeWidth="4" strokeLinecap="round" />
      {/* Mandarin collar */}
      <path d="M214 406 Q222 434 250 444 Q278 434 286 406 L286 431 Q273 454 250 460 Q227 454 214 431Z"
        fill="#fffdf8" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
      <path d="M214 411 L237 440 L250 458 L263 440 L286 411"
        fill="none" stroke="#d5cec5" strokeWidth="3.5" />

      {/* Left sleeve and arm (hanging down) */}
      <path d="M151 451 Q118 464 106 510 Q91 566 109 627 L128 689 Q141 712 164 702 L178 680 Q157 635 163 585 L184 491Z"
        fill="url(#chefCoat)" stroke={ink} strokeWidth="6" strokeLinejoin="round" />
      <path d="M126 680 Q145 690 166 678 L177 709 Q169 730 145 730 Q126 724 119 704Z"
        fill="url(#chefSkin)" stroke={ink} strokeWidth="5" />

      {/* Right sleeve, forearm and hand holding spatula */}
      <g>
        <path d="M348 451 Q383 466 394 507 Q404 547 386 584 L366 614 Q345 627 327 610 L319 588 Q341 557 334 522 L319 480Z"
          fill="url(#chefCoat)" stroke={ink} strokeWidth="6" strokeLinejoin="round" />
        <path d="M347 592 Q366 583 383 599 L380 665 Q373 689 351 692 Q331 685 328 664 L333 619Z"
          fill="url(#chefSkin)" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
      </g>

      {/* Apron straps */}
      <path d="M191 421 L174 514 L197 522 L218 435Z M309 421 L326 514 L303 522 L282 435Z"
        fill={red} stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M178 500 L201 500 L204 523 L177 523Z M299 500 L322 500 L325 523 L298 523Z"
        fill="#b98242" stroke={ink} strokeWidth="4" />
      <circle cx="190" cy="511" r="4" fill="#e8bd72" />
      <circle cx="312" cy="511" r="4" fill="#e8bd72" />

      {/* Apron front */}
      <path d="M174 515 Q250 524 326 515 L347 744 L153 744Z"
        fill="url(#chefApron)" stroke={ink} strokeWidth="6" strokeLinejoin="round" />
      <path d="M175 541 Q250 550 325 541" fill="none" stroke="#e65b55" strokeWidth="4" opacity=".75" />
      <path d="M263 568 L319 568 L319 641 Q291 649 263 641Z"
        fill="#b52a30" stroke="#762126" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M269 576 L313 576" stroke="#e35c58" strokeWidth="3" opacity=".65" />

      {/* Head, independently rotatable */}
      <g transform={`rotate(${headRotation} 250 270)`}>
        {/* Ears */}
        <path d="M170 238 Q146 218 145 255 Q145 292 174 297 L188 271Z"
          fill="url(#chefSkin)" stroke={ink} strokeWidth="5" />
        <path d="M330 238 Q354 218 355 255 Q355 292 326 297 L312 271Z"
          fill="url(#chefSkin)" stroke={ink} strokeWidth="5" />
        <path d="M158 250 Q169 245 173 270 M342 250 Q331 245 327 270"
          fill="none" stroke={skinShade} strokeWidth="4" strokeLinecap="round" />

        {/* Face */}
        <path d="M171 178 Q250 137 329 178 L326 279 Q322 357 250 383 Q178 357 174 279Z"
          fill="url(#chefSkin)" stroke={ink} strokeWidth="6" strokeLinejoin="round" />
        <path d="M185 332 Q250 375 315 332 Q296 372 250 383 Q204 372 185 332Z"
          fill="#e6a06e" opacity=".32" />

        {/* Eyebrows */}
        <path d="M190 226 Q211 209 231 225 M269 225 Q289 209 310 226"
          fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" />

        {/* Eyes */}
        {blink ? (
          <path d="M194 247 Q210 257 225 247 M275 247 Q290 257 306 247"
            fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />
        ) : (
          <>
            <ellipse cx="210" cy="251" rx="10" ry="13" fill="#fffdf8" />
            <ellipse cx="212" cy="252" rx="6.5" ry="9" fill="#241b19" />
            <circle cx="215" cy="248" r="2.8" fill="#fff" />
            <ellipse cx="290" cy="251" rx="10" ry="13" fill="#fffdf8" />
            <ellipse cx="288" cy="252" rx="6.5" ry="9" fill="#241b19" />
            <circle cx="285" cy="248" r="2.8" fill="#fff" />
          </>
        )}

        {/* Nose */}
        <path d="M250 257 Q239 282 248 288 Q257 292 265 284"
          fill="none" stroke="#d68e61" strokeWidth="6" strokeLinecap="round" />

        {/* Mouth */}
        {mouth}

        {/* Bandana */}
        <path d="M166 188 Q250 157 334 188 L331 222 Q250 197 169 222Z"
          fill="#c52e31" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
        <path d="M174 194 Q250 170 326 194" fill="none" stroke="#f06a60" strokeWidth="3" />
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i} transform={`translate(${181 + i * 17.2} ${196 - Math.sin((i / 8) * Math.PI) * 5})`}>
            <path d="M0 -6 L5 0 L0 6 L-5 0Z" fill="none" stroke="#ffe8d8" strokeWidth="2.5" />
            <path d="M-3 -9 L0 -12 L3 -9" fill="none" stroke="#ffe8d8" strokeWidth="1.5" />
          </g>
        ))}
        {/* Front curls / hairline */}
        <path d="M165 192 Q151 163 174 142 Q177 117 204 116 Q220 92 246 108 Q267 88 288 108 Q318 105 329 133 Q350 145 336 188 Q320 166 305 161 Q281 149 255 157 Q218 146 190 169Z"
          fill="url(#chefHair)" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
        <path d="M179 148 Q194 119 216 132 Q233 107 251 128 Q273 104 291 130 Q311 119 326 148"
          fill="none" stroke="#58423a" strokeWidth="5" strokeLinecap="round" />
        <path d="M183 169 Q204 153 222 160 M272 155 Q301 145 319 166"
          fill="none" stroke="#171211" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* Spatula and gripping hand, in front of arm */}
      {showSpatula && (
        <g transform={`rotate(${spatulaRotation} 375 520)`}>
          {/* Handle */}
          <path d="M369 522 L385 522 L397 277 L378 275Z"
            fill="#92542f" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          <path d="M375 286 L391 286 L388 352" fill="none" stroke="#c17a43" strokeWidth="3" />
          {/* Blade */}
          <path d="M367 170 Q368 157 382 157 L422 160 Q436 161 435 176 L429 244 Q428 257 416 262 L379 258 L364 243Z"
            fill="#c5cbd0" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          <path d="M378 174 L389 174 L384 241 L373 239Z" fill="#f0f2f2" opacity=".8" />
          <path d="M402 174 L411 175 L407 244" fill="none" stroke="#a3abb1" strokeWidth="3" />
          {/* Fingers wrapping handle */}
          <path d="M359 496 Q348 488 352 475 Q357 464 369 469 L389 477 Q402 483 399 495 Q397 506 384 505 L369 501Z"
            fill="url(#chefSkin)" stroke={ink} strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M354 478 Q371 484 392 485 M354 490 Q372 496 394 496"
            fill="none" stroke="#d99161" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M357 471 Q350 456 362 448 Q374 441 385 451 L399 466 Q405 475 396 482 Q387 488 378 479Z"
            fill="url(#chefSkin)" stroke={ink} strokeWidth="4.5" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
};

export default ChefCharacterV2;
