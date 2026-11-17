import React from "react";

export type ChefExpression = "happy" | "neutral" | "sad" | "surprised" | "worried";
export interface ChefCharacterProps {
  expression?: ChefExpression;
  blink?: boolean;
  mouthOpen?: boolean;
  headRotation?: number;
  spatulaRotation?: number;
  leftArmRotation?: number;
  showSpatula?: boolean;
  showSteam?: boolean;
  className?: string;
}

/**
 * Master Chef — detailed 2D vector illustration for Remotion.
 *
 * Design basis: the supplied chef-at-the-counter reference.
 * All visible artwork is native SVG. No raster images, canvas, WebGL or 3D.
 * For animation, derive every numeric prop from useCurrentFrame().
 */
export const ChefMasterV2: React.FC<ChefCharacterProps> = ({
  expression = "happy",
  blink = false,
  mouthOpen = false,
  headRotation = 0,
  spatulaRotation = 0,
  leftArmRotation = 0,
  showSpatula = true,
  showSteam = false,
  className,
}) => {
  const ink = "#30211d";

  const mouth = (() => {
    switch (expression) {
      case "neutral":
        return <path d="M217 329 Q250 336 283 329" fill="none" stroke={ink} strokeWidth="4.8" strokeLinecap="round" />;
      case "sad":
        return <path d="M214 340 Q250 307 286 340" fill="none" stroke={ink} strokeWidth="5.2" strokeLinecap="round" />;
      case "worried":
        return <path d="M220 340 Q250 322 280 340" fill="none" stroke={ink} strokeWidth="4.8" strokeLinecap="round" />;
      case "surprised":
        return <ellipse cx="250" cy="337" rx="12" ry="18" fill="#713638" stroke={ink} strokeWidth="4.5" />;
      default:
        return mouthOpen
          ? <path d="M207 319 Q250 348 293 319 Q286 373 250 376 Q214 373 207 319Z" fill="#642f32" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          : <path d="M208 319 Q250 349 292 319 Q284 361 250 363 Q216 361 208 319Z" fill="#fffdf8" stroke={ink} strokeWidth="5" strokeLinejoin="round" />;
    }
  })();

  const browLeft = expression === "sad" || expression === "worried"
    ? "M184 240 Q204 216 231 245"
    : expression === "surprised"
    ? "M184 235 Q207 210 232 236"
    : "M184 246 Q207 222 232 246";
  const browRight = expression === "sad" || expression === "worried"
    ? "M269 245 Q296 216 316 240"
    : expression === "surprised"
    ? "M268 236 Q293 210 316 235"
    : "M268 246 Q293 222 316 246";

  return (
    <svg
      className={className}
      viewBox="0 0 560 760"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Detailed vector illustration of a smiling chef wearing a red bandana and apron"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="mc-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffdbb6" />
          <stop offset=".25" stopColor="#f7c394" />
          <stop offset=".62" stopColor="#e9a575" />
          <stop offset="1" stopColor="#c77e55" />
        </linearGradient>
        <linearGradient id="mc-face" x1=".12" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#ffd7ae" />
          <stop offset=".38" stopColor="#f6c092" />
          <stop offset=".76" stopColor="#e9a576" />
          <stop offset="1" stopColor="#d58b60" />
        </linearGradient>
        <linearGradient id="mc-coat" x1="0" y1="0" x2="1" y2=".1">
          <stop offset="0" stopColor="#d9d4cd" />
          <stop offset=".12" stopColor="#f4f0e9" />
          <stop offset=".28" stopColor="#fffefa" />
          <stop offset=".58" stopColor="#f5f1eb" />
          <stop offset=".82" stopColor="#fffefa" />
          <stop offset="1" stopColor="#d9d2c9" />
        </linearGradient>
        <linearGradient id="mc-apron" x1="0" y1="0" x2="1" y2=".15">
          <stop offset="0" stopColor="#8f2025" />
          <stop offset=".2" stopColor="#b9272c" />
          <stop offset=".5" stopColor="#c83236" />
          <stop offset=".78" stopColor="#b3262c" />
          <stop offset="1" stopColor="#821b22" />
        </linearGradient>
        <linearGradient id="mc-hair" x1=".15" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#49332c" />
          <stop offset=".28" stopColor="#211816" />
          <stop offset=".72" stopColor="#120e0d" />
          <stop offset="1" stopColor="#30201c" />
        </linearGradient>
        <linearGradient id="mc-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#777f86" />
          <stop offset=".18" stopColor="#dfe3e5" />
          <stop offset=".43" stopColor="#aeb6bc" />
          <stop offset=".68" stopColor="#e7e9e9" />
          <stop offset="1" stopColor="#747d84" />
        </linearGradient>
        <linearGradient id="mc-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#60351f" />
          <stop offset=".35" stopColor="#a76839" />
          <stop offset=".62" stopColor="#8c512e" />
          <stop offset="1" stopColor="#4d2c1e" />
        </linearGradient>
        <radialGradient id="mc-cheek">
          <stop offset="0" stopColor="#e98575" stopOpacity=".48" />
          <stop offset="1" stopColor="#e98575" stopOpacity="0" />
        </radialGradient>
        <clipPath id="mc-face-clip">
          <path d="M172 174 Q250 132 328 174 L326 274 Q323 354 250 382 Q177 354 174 274Z" />
        </clipPath>
      </defs>

      {/* Neck, behind the coat */}
      <path d="M222 360 L222 430 Q250 451 278 430 L278 360Z"
        fill="url(#mc-skin)" stroke={ink} strokeWidth="5.5" />
      <path d="M224 394 Q250 411 276 394 L276 430 Q250 448 224 430Z"
        fill="#bd7955" opacity=".42" />

      {/* Jacket main silhouette */}
      <path d="M211 411 Q177 416 143 443 Q111 469 100 530 L84 748 L416 748 L400 530 Q389 469 357 443 Q323 416 289 411 Q273 439 250 442 Q227 439 211 411Z"
        fill="url(#mc-coat)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
      {/* Shoulder cap seams and tailored folds */}
      <path d="M144 448 Q168 451 188 480 L163 503 L135 474Z M356 448 Q332 451 312 480 L337 503 L365 474Z"
        fill="#f4f0e9" stroke={ink} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M112 526 Q104 572 122 616 M448 526" fill="none" stroke="#d4ccc2" strokeWidth="4" strokeLinecap="round" />
      <path d="M127 557 Q144 569 145 593 M371 552 Q354 570 351 596"
        fill="none" stroke="#d5cdc4" strokeWidth="4" strokeLinecap="round" />
      <path d="M118 624 Q135 640 131 663 M382 625 Q366 646 369 667"
        fill="none" stroke="#e1dad1" strokeWidth="3.5" strokeLinecap="round" />
      {/* Chef collar */}
      <path d="M211 406 Q216 438 250 454 Q284 438 289 406 L287 433 Q273 462 250 468 Q227 462 213 433Z"
        fill="#fffefa" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M214 415 Q228 438 250 454 Q272 438 286 415"
        fill="none" stroke="#d4ccc2" strokeWidth="3.5" />
      <path d="M242 447 L250 459 L258 447" fill="none" stroke="#d8d0c7" strokeWidth="3" />
      {/* Double-breasted buttons */}
      <circle cx="216" cy="477" r="7.5" fill="#eee9e1" stroke="#c9beb3" strokeWidth="2.5" />
      <circle cx="284" cy="477" r="7.5" fill="#eee9e1" stroke="#c9beb3" strokeWidth="2.5" />
      <circle cx="216" cy="477" r="2.2" fill="#fff" />
      <circle cx="284" cy="477" r="2.2" fill="#fff" />

      {/* Left arm, sleeve cuff and hand resting near counter */}
      <g transform={`rotate(${leftArmRotation} 146 585)`}>
        <path d="M145 451 Q112 469 99 523 Q88 568 105 628 L123 691 Q138 712 165 699 L178 678 Q158 634 165 584 L185 491Z"
          fill="url(#mc-coat)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
        <path d="M104 626 Q123 642 151 632" fill="none" stroke="#d8d0c7" strokeWidth="4" />
        <path d="M118 674 Q139 690 166 676 L179 710 Q171 733 145 733 Q122 727 115 704Z"
          fill="url(#mc-skin)" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
        <path d="M125 687 Q141 699 160 692" fill="none" stroke="#ffdbb9" strokeWidth="4" strokeLinecap="round" />
        <path d="M134 706 Q146 712 158 706" fill="none" stroke="#c67d56" strokeWidth="2.8" strokeLinecap="round" opacity=".65" />
      </g>

      {/* Right sleeve and forearm */}
      <path d="M355 451 Q389 469 402 514 Q411 550 393 591 L372 620 Q348 634 328 612 L321 587 Q344 557 337 521 L321 489Z"
        fill="url(#mc-coat)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
      <path d="M365 477 Q383 500 385 532 M392 550 Q385 577 365 592"
        fill="none" stroke="#d6cec5" strokeWidth="4" strokeLinecap="round" />

      {/* Apron straps */}
      <path d="M190 419 L169 518 L198 527 L220 431Z M310 419 L331 518 L302 527 L280 431Z"
        fill="#b5282d" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
      <path d="M174 501 L202 501 L205 529 L172 529Z M298 501 L326 501 L329 529 L296 529Z"
        fill="#b88748" stroke={ink} strokeWidth="4" />
      <rect x="182" y="506" width="12" height="14" rx="2" fill="#e3b96e" />
      <rect x="306" y="506" width="12" height="14" rx="2" fill="#e3b96e" />
      <circle cx="188" cy="523" r="3" fill="#76502e" />
      <circle cx="312" cy="523" r="3" fill="#76502e" />

      {/* Apron body */}
      <path d="M172 521 Q250 531 328 521 L350 748 L150 748Z"
        fill="url(#mc-apron)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
      <path d="M178 545 Q250 557 322 545" fill="none" stroke="#ed6960" strokeWidth="4.5" opacity=".85" />
      <path d="M180 553 Q250 565 320 553" fill="none" stroke="#791a20" strokeWidth="2.5" opacity=".65" />
      <path d="M265 575 L320 575 L320 649 Q292 657 265 649Z"
        fill="#ad252b" stroke="#711a20" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M271 583 L314 583" fill="none" stroke="#e65c58" strokeWidth="3.5" opacity=".8" />
      <path d="M271 642 Q292 648 314 642" fill="none" stroke="#761b21" strokeWidth="2.5" opacity=".6" />
      <path d="M158 724 Q250 733 342 724" fill="none" stroke="#761a20" strokeWidth="3" opacity=".65" />

      {/* Steam wisps: optional, frame-animated by parent */}
      {showSteam && (
        <g fill="none" stroke="#fff4e7" strokeWidth="5" strokeLinecap="round" opacity=".72">
          <path d="M220 628 C199 603 236 587 218 561 C205 544 220 531 226 519" />
          <path d="M250 628 C226 598 270 578 250 551 C237 532 250 520 257 505" />
          <path d="M280 628 C261 603 297 584 280 560 C268 543 281 531 287 520" />
        </g>
      )}

      {/* Head group */}
      <g transform={`rotate(${headRotation} 250 276)`}>
        {/* Ears */}
        <path d="M174 230 Q151 211 148 249 Q145 286 176 300 L190 267Z"
          fill="url(#mc-face)" stroke={ink} strokeWidth="5.5" />
        <path d="M326 230 Q349 211 352 249 Q355 286 324 300 L310 267Z"
          fill="url(#mc-face)" stroke={ink} strokeWidth="5.5" />
        <path d="M157 246 Q168 239 177 269 M343 246 Q332 239 323 269"
          fill="none" stroke="#c9845b" strokeWidth="4" strokeLinecap="round" />

        {/* Face silhouette */}
        <path d="M172 174 Q250 132 328 174 L326 274 Q323 354 250 382 Q177 354 174 274Z"
          fill="url(#mc-face)" stroke={ink} strokeWidth="6.5" strokeLinejoin="round" />
        <g clipPath="url(#mc-face-clip)">
          <ellipse cx="193" cy="302" rx="27" ry="18" fill="url(#mc-cheek)" />
          <ellipse cx="307" cy="302" rx="27" ry="18" fill="url(#mc-cheek)" />
          <path d="M185 347 Q250 383 315 347" fill="none" stroke="#c77f58" strokeWidth="4" opacity=".35" />
          <path d="M184 193 Q250 165 316 193" fill="none" stroke="#fff0d9" strokeWidth="5" opacity=".6" />
          <path d="M185 285 Q194 291 203 287 M297 287 Q306 291 315 285" fill="none" stroke="#d99168" strokeWidth="2.5" opacity=".45" />
        </g>

        {/* Eyebrows */}
        <path d={browLeft} fill="none" stroke={ink} strokeWidth="8.5" strokeLinecap="round" />
        <path d={browRight} fill="none" stroke={ink} strokeWidth="8.5" strokeLinecap="round" />

        {/* Eyes */}
        {blink ? (
          <g fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round">
            <path d="M190 267 Q210 279 230 267" />
            <path d="M270 267 Q290 279 310 267" />
          </g>
        ) : (
          <>
            <ellipse cx="210" cy="269" rx="12.5" ry="16" fill="#fffdf9" />
            <ellipse cx="212" cy="270" rx="7.6" ry="11.5" fill="#211916" />
            <circle cx="216" cy="265" r="3.5" fill="#fff" />
            <ellipse cx="290" cy="269" rx="12.5" ry="16" fill="#fffdf9" />
            <ellipse cx="288" cy="270" rx="7.6" ry="11.5" fill="#211916" />
            <circle cx="284" cy="265" r="3.5" fill="#fff" />
          </>
        )}

        {/* Nose bridge, tip and nostril accents */}
        <path d="M250 273 C244 288 237 302 243 309 C249 317 263 313 268 304"
          fill="none" stroke="#c98259" strokeWidth="7" strokeLinecap="round" />
        <path d="M242 310 Q250 316 260 311" fill="none" stroke="#a96549" strokeWidth="3" strokeLinecap="round" />
        <path d="M246 280 Q250 273 253 271" fill="none" stroke="#ffdfbd" strokeWidth="2.5" strokeLinecap="round" opacity=".8" />

        {/* Mouth and teeth */}
        {mouth}
        {expression === "happy" && !mouthOpen && (
          <path d="M216 330 Q250 347 284 330 Q278 343 250 345 Q222 343 216 330Z" fill="#fff" opacity=".96" />
        )}

        {/* Bandana fabric, knot ends and printed motif */}
        <path d="M165 185 Q250 151 335 185 L332 226 Q250 201 168 226Z"
          fill="#c52d32" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
        <path d="M172 193 Q250 164 328 193" fill="none" stroke="#f87970" strokeWidth="3.5" />
        <path d="M170 217 Q250 193 332 217" fill="none" stroke="#851d24" strokeWidth="2.5" opacity=".8" />
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={i} transform={`translate(${177 + i * 14.6} ${198 - Math.sin((i / 10) * Math.PI) * 5})`}>
            <path d="M0 -5.8 L5 0 L0 5.8 L-5 0Z" fill="none" stroke="#fff0df" strokeWidth="2.3" />
            <path d="M-2.5 -8 L0 -10 L2.5 -8" fill="none" stroke="#fff0df" strokeWidth="1.4" />
            <circle cx="0" cy="0" r="1.3" fill="#fff0df" />
          </g>
        ))}

        {/* Hairline fringe over the bandana */}
        <path d="M164 190 C150 166 157 142 175 130 C176 103 199 91 219 102 C237 79 264 83 276 100 C301 88 325 105 327 129 C348 143 348 169 335 193 Q318 172 301 168 Q278 151 253 160 Q220 150 194 173Z"
          fill="url(#mc-hair)" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
        <path d="M176 145 Q190 117 211 128 Q229 101 249 124 Q270 100 289 126 Q310 113 326 145"
          fill="none" stroke="#6d5147" strokeWidth="5" strokeLinecap="round" />
        <path d="M180 164 Q199 141 220 155 M232 143 Q251 126 271 146 M282 151 Q302 136 321 161"
          fill="none" stroke="#4e3730" strokeWidth="6" strokeLinecap="round" />
        <path d="M185 178 Q202 160 219 171 M245 163 Q261 150 278 166 M294 166 Q309 158 320 177"
          fill="none" stroke="#6b4d43" strokeWidth="4" strokeLinecap="round" opacity=".8" />
      </g>

      {/* Spatula: behind fingers, with metal blade and wooden handle */}
      {showSpatula && (
        <g transform={`rotate(${spatulaRotation} 405 500)`}>
          <path d="M397 525 L415 525 L430 254 L408 252Z"
            fill="url(#mc-wood)" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
          <path d="M410 273 L425 273 L420 344" fill="none" stroke="#c0804d" strokeWidth="3.5" />
          <path d="M399 163 Q400 147 417 148 L458 151 Q475 152 474 170 L467 239 Q466 254 452 260 L411 256 L395 240Z"
            fill="url(#mc-metal)" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
          <path d="M411 170 L424 170 L418 237 L406 235Z" fill="#f3f5f4" opacity=".85" />
          <path d="M439 171 L449 172 L444 240" fill="none" stroke="#9ca5ab" strokeWidth="3.5" />
          <path d="M457 166 Q467 169 464 187 L458 235" fill="none" stroke="#737d84" strokeWidth="3" opacity=".65" />
        </g>
      )}

      {/* Right forearm and gripping hand drawn over the spatula shaft */}
      <g>
        <path d="M365 574 Q370 535 384 505 Q395 483 416 488 Q437 493 440 518 L435 581 Q431 616 407 626 Q381 629 366 608Z"
          fill="url(#mc-skin)" stroke={ink} strokeWidth="5.5" strokeLinejoin="round" />
        <path d="M380 592 Q394 605 416 594" fill="none" stroke="#c67d55" strokeWidth="3.5" strokeLinecap="round" />
        {/* Palm wraps around handle */}
        <path d="M391 490 Q385 475 397 463 Q409 452 423 462 L440 478 Q449 490 439 502 Q429 513 414 504 L402 499Z"
          fill="url(#mc-skin)" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
        {/* Four curved fingers */}
        <path d="M400 473 Q415 480 437 480 Q448 482 447 493 Q446 504 434 504 L406 497"
          fill="none" stroke={ink} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M397 486 Q414 494 438 494 Q448 496 445 507 Q442 516 430 513 L405 505"
          fill="none" stroke={ink} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M398 499 Q415 508 434 508 Q444 510 440 520 Q436 529 424 524 L402 516"
          fill="none" stroke={ink} strokeWidth="4.5" strokeLinecap="round" />
        {/* Thumb */}
        <path d="M400 480 Q387 473 381 485 Q375 498 386 510 Q395 519 407 511"
          fill="url(#mc-skin)" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
        <path d="M389 486 Q393 495 402 498" fill="none" stroke="#ffd8b5" strokeWidth="3" strokeLinecap="round" />
        <path d="M410 477 Q423 482 435 480" fill="none" stroke="#ffd9b7" strokeWidth="2.8" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export default ChefMasterV2;
