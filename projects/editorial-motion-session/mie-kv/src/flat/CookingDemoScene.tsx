import React from "react";

/**
 * CookingDemoScene
 * Full 9:16 SVG scene based on the user's supplied reference image.
 * Designed as a single scalable vector composition for Remotion.
 * No raster artwork, external models, canvas, or image assets.
 */

type Props = {
  steam?: boolean;
  blink?: boolean;
  chefExpression?: "happy" | "neutral";
};

const ink = "#30211f";

export const CookingDemoScene: React.FC<Props> = ({
  steam = true,
  blink = false,
  chefExpression = "happy",
}) => {
  const mouth =
    chefExpression === "neutral" ? (
      <path d="M164 230 Q180 234 196 230" fill="none" stroke={ink} strokeWidth="2.7" strokeLinecap="round" />
    ) : (
      <path d="M160 225 Q180 242 200 225 Q196 245 180 246 Q164 245 160 225Z" fill="#fffaf1" stroke={ink} strokeWidth="2.7" strokeLinejoin="round" />
    );

  return (
    <svg
      viewBox="0 0 360 640"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vector illustration of a chef cooking soup for three customers in a warm tiled kitchen"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="k-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0d5" />
          <stop offset="1" stopColor="#f6dfb9" />
        </linearGradient>
        <linearGradient id="k-counter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4b36b" />
          <stop offset=".45" stopColor="#d98c45" />
          <stop offset="1" stopColor="#b96c35" />
        </linearGradient>
        <linearGradient id="k-wood-shelf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c47b3f" />
          <stop offset=".5" stopColor="#a85e2e" />
          <stop offset="1" stopColor="#81451f" />
        </linearGradient>
        <linearGradient id="k-chef-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd4a5" />
          <stop offset=".55" stopColor="#f2b47f" />
          <stop offset="1" stopColor="#d88e5f" />
        </linearGradient>
        <linearGradient id="k-coat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ddd6ca" />
          <stop offset=".22" stopColor="#fffdf8" />
          <stop offset=".55" stopColor="#f8f5ee" />
          <stop offset=".82" stopColor="#fffdf8" />
          <stop offset="1" stopColor="#d9d1c6" />
        </linearGradient>
        <linearGradient id="k-apron" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#99252a" />
          <stop offset=".42" stopColor="#c93438" />
          <stop offset=".72" stopColor="#b92b31" />
          <stop offset="1" stopColor="#8d2027" />
        </linearGradient>
        <linearGradient id="k-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#49332d" />
          <stop offset=".5" stopColor="#211715" />
          <stop offset="1" stopColor="#100d0c" />
        </linearGradient>
        <linearGradient id="k-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#858e95" />
          <stop offset=".25" stopColor="#eef1f1" />
          <stop offset=".7" stopColor="#b9c1c7" />
          <stop offset="1" stopColor="#737d84" />
        </linearGradient>
        <linearGradient id="k-bowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset=".68" stopColor="#f4eee3" />
          <stop offset="1" stopColor="#d9cbb8" />
        </linearGradient>
        <radialGradient id="k-lamp-glow">
          <stop offset="0" stopColor="#fff8b5" stopOpacity=".95" />
          <stop offset=".35" stopColor="#ffe77b" stopOpacity=".4" />
          <stop offset="1" stopColor="#ffe77b" stopOpacity="0" />
        </radialGradient>
        <pattern id="k-tile" width="82" height="43" patternUnits="userSpaceOnUse">
          <rect width="82" height="43" fill="#f8eedc" />
          <rect x="1" y="1" width="80" height="40" rx="4" fill="#fff9ed" stroke="#dfc9a7" strokeWidth="1.4" />
          <path d="M5 5 H77" stroke="#fff" strokeWidth="1.2" opacity=".8" />
        </pattern>
        <pattern id="k-woodgrain" width="90" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 5 Q24 1 48 5 T96 5 M12 14 Q35 10 61 14 T100 14" fill="none" stroke="#a96132" strokeWidth=".8" opacity=".35" />
        </pattern>
        <clipPath id="k-soup-clip">
          <ellipse cx="180" cy="359" rx="66" ry="10" />
        </clipPath>
      </defs>

      {/* Background wall */}
      <rect width="360" height="640" fill="url(#k-wall)" />
      <rect x="0" y="187" width="360" height="211" fill="url(#k-tile)" />
      <rect x="0" y="187" width="360" height="211" fill="#fff0d5" opacity=".12" />

      {/* Hanging lamp */}
      <path d="M180 0 V72" stroke="#29201c" strokeWidth="3" />
      <path d="M173 72 Q180 65 187 72 L188 80 L172 80Z" fill="#302722" />
      <path d="M145 105 Q149 74 180 72 Q211 74 215 105 Q199 109 180 109 Q161 109 145 105Z"
        fill="#292522" stroke="#1d1917" strokeWidth="2" />
      <path d="M151 101 Q161 82 180 81 Q199 82 209 101" fill="none" stroke="#55463b" strokeWidth="2" />
      <ellipse cx="180" cy="111" rx="18" ry="4" fill="#fff6be" />
      <ellipse cx="180" cy="132" rx="76" ry="42" fill="url(#k-lamp-glow)" />

      {/* Shelf and jars */}
      <rect x="4" y="108" width="352" height="8" rx="1" fill="url(#k-wood-shelf)" stroke="#57351f" strokeWidth="1.4" />
      <path d="M5 116 H355 L350 123 H10Z" fill="#8b4d29" stroke="#5b351f" strokeWidth="1" />
      {[
        { x: 23, c: "#b82d32", cap: "#8f2228" },
        { x: 68, c: "#80502f", cap: "#54351f" },
        { x: 111, c: "#5a8b5d", cap: "#38623e" },
        { x: 270, c: "#f1b51e", cap: "#b77e13" },
        { x: 313, c: "#356cae", cap: "#244b7c" },
      ].map((jar, i) => (
        <g key={i}>
          <rect x={jar.x} y="77" width="30" height="31" rx="5" fill={jar.c} stroke="#30211d" strokeWidth="1.6" />
          <rect x={jar.x + 2} y="72" width="26" height="7" rx="2" fill={jar.cap} stroke="#30211d" strokeWidth="1.4" />
          <rect x={jar.x + 3} y="84" width="24" height="10" rx="1" fill="#fff6e8" />
          <path d={`M${jar.x + 5} 80 V103`} stroke="#fff" strokeWidth="2" opacity=".35" />
          <path d={`M${jar.x + 3} 104 Q${jar.x + 15} 108 ${jar.x + 27} 104`} fill="none" stroke="#fff" strokeWidth="1.2" opacity=".35" />
        </g>
      ))}

      {/* Chef body behind the cooking pot */}
      <path d="M147 247 Q126 248 111 265 Q95 281 88 322 L82 367 L111 390 L250 390 L277 367 L270 310 Q266 273 239 255 Q221 247 211 245Z"
        fill="url(#k-coat)" stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
      {/* Shoulder and jacket folds */}
      <path d="M111 269 Q101 290 98 318 L92 348 M247 269 Q262 290 265 320 L260 348"
        fill="none" stroke="#d2c9bd" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M105 294 Q116 300 120 316 M250 290 Q241 302 240 316"
        fill="none" stroke="#e0d8ce" strokeWidth="2" />
      {/* Neck */}
      <path d="M166 224 L166 258 Q180 270 194 258 L194 224Z" fill="url(#k-chef-skin)" stroke={ink} strokeWidth="2.2" />
      {/* Collar */}
      <path d="M157 245 Q164 262 180 269 Q196 262 203 245 L198 265 Q190 276 180 278 Q170 276 162 265Z"
        fill="#fffdf8" stroke={ink} strokeWidth="2.1" />
      <path d="M161 249 Q170 263 180 269 Q190 263 199 249" fill="none" stroke="#d5cdc2" strokeWidth="1.3" />

      {/* Left sleeve and resting arm */}
      <path d="M111 269 Q91 278 85 307 Q78 332 89 354 L101 368 Q111 374 119 364 L116 347 Q108 329 119 300Z"
        fill="url(#k-coat)" stroke={ink} strokeWidth="2.4" />
      <path d="M88 350 Q100 360 115 352 L119 368 Q113 381 99 379 Q87 375 84 363Z"
        fill="url(#k-chef-skin)" stroke={ink} strokeWidth="2.1" />
      <path d="M90 357 Q100 365 112 360" fill="none" stroke="#ffd6b0" strokeWidth="1.5" />

      {/* Right sleeve and forearm */}
      <path d="M241 267 Q263 277 270 302 Q275 323 266 341 L253 353 Q242 355 235 345 L238 330 Q245 313 232 293Z"
        fill="url(#k-coat)" stroke={ink} strokeWidth="2.4" />
      <path d="M245 335 Q254 340 265 333 L272 350 Q271 365 258 367 Q245 365 241 353Z"
        fill="url(#k-chef-skin)" stroke={ink} strokeWidth="2.2" />

      {/* Apron straps */}
      <path d="M143 249 L133 302 L145 306 L157 253Z M203 249 L215 302 L227 306 L217 253Z"
        fill="#b92d32" stroke={ink} strokeWidth="2.1" />
      <rect x="133" y="294" width="13" height="11" rx="2" fill="#c4934d" stroke="#543a25" strokeWidth="1.3" />
      <rect x="212" y="294" width="13" height="11" rx="2" fill="#c4934d" stroke="#543a25" strokeWidth="1.3" />
      <circle cx="139.5" cy="299.5" r="2.2" fill="#f0c77b" />
      <circle cx="218.5" cy="299.5" r="2.2" fill="#f0c77b" />

      {/* Apron bib and body */}
      <path d="M133 300 Q180 308 227 300 L237 399 L123 399Z"
        fill="url(#k-apron)" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M137 312 Q180 318 223 312" fill="none" stroke="#ed6c63" strokeWidth="2" opacity=".85" />
      <path d="M139 318 Q180 324 221 318" fill="none" stroke="#8f2026" strokeWidth="1.2" opacity=".7" />
      <path d="M184 326 L211 326 L211 371 Q197 375 184 371Z" fill="#a9252b" stroke="#762027" strokeWidth="1.8" />
      <path d="M188 330 H207" stroke="#e45d59" strokeWidth="1.4" />
      <path d="M126 390 Q180 397 234 390" fill="none" stroke="#791b21" strokeWidth="1.5" opacity=".65" />

      {/* Chef head and hair */}
      <g>
        {/* Rear hair silhouette */}
        <path d="M145 191 Q137 176 146 163 Q144 148 158 145 Q164 130 180 137 Q195 126 207 141 Q225 141 225 159 Q235 173 224 193 L213 208 L148 208Z"
          fill="url(#k-hair)" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M146 166 Q150 149 165 153 Q173 137 187 148 Q201 133 211 151 Q225 151 226 169"
          fill="none" stroke="#60463b" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M149 178 Q160 159 174 167 Q185 151 198 165 Q212 153 223 176"
          fill="none" stroke="#49332c" strokeWidth="3.4" strokeLinecap="round" />
        {/* Ears */}
        <path d="M148 188 Q137 181 138 198 Q139 214 153 216 L160 201Z" fill="url(#k-chef-skin)" stroke={ink} strokeWidth="2.2" />
        <path d="M212 188 Q223 181 222 198 Q221 214 207 216 L200 201Z" fill="url(#k-chef-skin)" stroke={ink} strokeWidth="2.2" />
        {/* Face */}
        <path d="M151 174 Q180 158 209 174 L208 211 Q207 239 180 250 Q153 239 152 211Z"
          fill="url(#k-chef-skin)" stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
        <ellipse cx="159" cy="218" rx="8" ry="5" fill="#ed927d" opacity=".5" />
        <ellipse cx="201" cy="218" rx="8" ry="5" fill="#ed927d" opacity=".5" />
        {/* Eyebrows */}
        <path d="M157 194 Q166 187 174 194 M186 194 Q195 187 204 194"
          fill="none" stroke={ink} strokeWidth="3.3" strokeLinecap="round" />
        {/* Eyes */}
        {blink ? (
          <path d="M158 204 Q166 208 174 204 M186 204 Q194 208 202 204"
            fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <>
            <ellipse cx="166" cy="203" rx="4.2" ry="5.5" fill="#fff" />
            <ellipse cx="194" cy="203" rx="4.2" ry="5.5" fill="#fff" />
            <ellipse cx="167" cy="204" rx="2.4" ry="3.5" fill="#211917" />
            <ellipse cx="193" cy="204" rx="2.4" ry="3.5" fill="#211917" />
            <circle cx="168" cy="202" r="1.2" fill="#fff" />
            <circle cx="194" cy="202" r="1.2" fill="#fff" />
          </>
        )}
        {/* Nose */}
        <path d="M180 207 Q175 218 179 221 Q184 224 188 219"
          fill="none" stroke="#c98259" strokeWidth="2.6" strokeLinecap="round" />
        {mouth}
        {/* Bandana */}
        <path d="M145 176 Q180 160 215 176 L213 193 Q180 182 147 193Z"
          fill="#c82e34" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M149 179 Q180 166 211 179" fill="none" stroke="#f47770" strokeWidth="1.4" />
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={i}
            d={`M${151 + i * 7.2} ${181 - Math.sin((i / 8) * Math.PI) * 2} l2 -2 l2 2 l-2 2Z`}
            fill="none" stroke="#fff0df" strokeWidth="1" />
        ))}
        {/* Front hair curls framing bandana */}
        <path d="M145 180 Q138 163 151 153 Q158 138 172 147 Q185 133 196 146 Q212 139 218 157 Q227 165 216 181 Q206 169 195 169 Q180 162 168 172 Q155 167 145 180Z"
          fill="url(#k-hair)" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M151 158 Q160 145 171 154 Q182 140 193 153 Q205 144 214 161"
          fill="none" stroke="#705247" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M153 169 Q164 155 175 164 M181 157 Q194 148 204 162"
          fill="none" stroke="#49342e" strokeWidth="2.7" strokeLinecap="round" />
      </g>

      {/* Spatula, behind gripping hand */}
      <g>
        <path d="M260 323 L267 325 L275 211 L264 210Z" fill="#85502f" stroke={ink} strokeWidth="2.2" />
        <path d="M266 218 L272 219 L269 268" fill="none" stroke="#c0804c" strokeWidth="1.6" />
        <path d="M257 167 Q258 160 266 160 L279 162 Q285 163 284 170 L280 197 Q279 203 273 204 L260 202 L255 195Z"
          fill="url(#k-metal)" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M263 169 L268 169 L265 194 L260 193Z" fill="#fff" opacity=".75" />
        <path d="M274 169 L278 170 L275 195" fill="none" stroke="#89939a" strokeWidth="1.3" />
      </g>

      {/* Gripping hand over spatula */}
      <path d="M254 292 Q250 282 256 278 Q261 274 268 280 L273 287 Q278 296 272 303 Q266 309 258 303Z"
        fill="url(#k-chef-skin)" stroke={ink} strokeWidth="2.2" />
      <path d="M254 286 Q262 291 272 290 M254 294 Q263 300 272 297"
        fill="none" stroke="#c77f56" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M255 284 Q249 279 253 272 Q258 266 265 271 L273 280 Q277 286 271 291 Q265 296 259 290Z"
        fill="url(#k-chef-skin)" stroke={ink} strokeWidth="2.2" />
      <path d="M256 274 Q264 277 270 284" fill="none" stroke="#ffdab7" strokeWidth="1.4" />

      {/* Cooking pot */}
      <ellipse cx="180" cy="360" rx="67" ry="10" fill="#171819" />
      <path d="M113 358 Q180 372 247 358 L237 394 Q180 408 123 394Z"
        fill="#292b2d" stroke="#171819" strokeWidth="2.5" />
      <path d="M122 366 Q180 378 238 366 L233 390 Q180 400 127 390Z"
        fill="#383b3e" opacity=".8" />
      <ellipse cx="180" cy="358" rx="67" ry="10" fill="#171819" stroke="#111" strokeWidth="2" />
      <ellipse cx="180" cy="357" rx="62" ry="7.5" fill="#f5a91d" stroke="#3a2920" strokeWidth="1.5" />
      <path d="M124 358 Q180 367 236 358" fill="none" stroke="#ffd35c" strokeWidth="2" opacity=".8" />

      {/* Steam from pot and bowls */}
      {steam && (
        <g fill="none" stroke="#fff7e9" strokeWidth="4.2" strokeLinecap="round" opacity=".78">
          <path d="M164 354 C151 338 174 328 164 312 C157 302 165 295 169 290" />
          <path d="M180 354 C164 337 193 324 180 307 C172 296 181 286 186 281" />
          <path d="M194 354 C182 340 206 328 195 313 C188 303 197 297 201 291" />
          <path d="M79 433 C68 418 88 409 78 395 C73 388 78 381 82 376" />
          <path d="M278 432 C265 416 289 406 278 391 C272 383 278 377 282 372" />
        </g>
      )}

      {/* Counter back lip */}
      <rect x="0" y="397" width="360" height="9" fill="#c27a3d" stroke="#60391f" strokeWidth="1.5" />
      <path d="M0 399 H360" stroke="#f6c17d" strokeWidth="2" />

      {/* Counter top */}
      <rect x="0" y="406" width="360" height="100" fill="url(#k-counter)" />
      <rect x="0" y="406" width="360" height="100" fill="url(#k-woodgrain)" />
      <path d="M0 408 H360 M0 495 H360" stroke="#8d4e2a" strokeWidth="2" opacity=".65" />
      <path d="M0 412 H360" stroke="#ffd09a" strokeWidth="2" opacity=".7" />

      {/* Three soup bowls */}
      {[82, 180, 278].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy="466" rx="43" ry="6" fill="#794523" opacity=".28" />
          <path d={`M${x - 41} 431 Q${x - 38} 470 ${x} 474 Q${x + 38} 470 ${x + 41} 431Z`}
            fill="url(#k-bowl)" stroke={ink} strokeWidth="2.2" />
          <path d={`M${x - 39} 441 Q${x} 450 ${x + 39} 441`} fill="none" stroke="#d9c9b5" strokeWidth="1.3" />
          <path d={`M${x - 40} 449 Q${x} 458 ${x + 40} 449`} fill="none" stroke="#bf3034" strokeWidth="5" />
          <ellipse cx={x} cy="431" rx="41" ry="9" fill="#f6ad23" stroke={ink} strokeWidth="1.7" />
          <ellipse cx={x} cy="430" rx="37" ry="6.3" fill="#ffca42" />
          {/* egg */}
          <path d={`M${x - 13} 426 Q${x - 14} 417 ${x - 5} 417 Q${x + 4} 416 ${x + 8} 423 Q${x + 11} 430 ${x + 3} 434 Q${x - 7} 436 ${x - 13} 426Z`}
            fill="#fffdf4" stroke="#8d6848" strokeWidth="1.1" />
          <ellipse cx={x - 1} cy="425" rx="5" ry="4" fill="#ffbf26" stroke="#d88a18" strokeWidth=".8" />
          {/* herbs */}
          <path d={`M${x + 15} 425 q-5 -6 -8 -1 q4 0 4 5 q4 -8 9 -3 q-5 1 -5 5 q7 -4 9 1 q-6 -1 -8 2 q-4 -4 -7 -2Z`}
            fill="#57914a" />
          <path d={`M${x - 27} 420 Q${x - 12} 414 ${x + 4} 418`} fill="none" stroke="#fff1b7" strokeWidth="1.2" opacity=".8" />
        </g>
      ))}

      {/* Counter front fascia */}
      <rect x="0" y="506" width="360" height="16" fill="#c17a3d" stroke="#75431f" strokeWidth="1.5" />
      <path d="M0 509 H360" stroke="#f4bd7c" strokeWidth="2" />
      <rect x="0" y="522" width="360" height="118" fill="#f4dfbd" />

      {/* Audience: left customer, back of head and blue shirt */}
      <g>
        <path d="M-15 640 L-9 606 Q-2 579 23 569 L58 569 Q88 581 100 607 L111 640Z"
          fill="#36588d" stroke={ink} strokeWidth="2.4" />
        <path d="M20 558 L20 580 Q39 590 57 580 L57 558Z" fill="url(#k-chef-skin)" stroke={ink} strokeWidth="2" />
        <path d="M5 500 Q8 468 38 465 Q68 466 76 501 L70 531 Q62 549 39 551 Q16 548 8 531Z"
          fill="url(#k-hair)" stroke={ink} strokeWidth="2.4" />
        <path d="M9 495 Q18 473 34 477 Q47 463 59 480 Q71 484 73 504 Q61 494 52 499 Q35 487 22 501Z"
          fill="#30221e" />
        <path d="M4 510 Q-1 507 2 521 Q4 532 13 535 L17 522Z M73 510 Q80 507 77 521 Q75 532 66 535 L63 522Z"
          fill="url(#k-chef-skin)" stroke={ink} strokeWidth="1.8" />
        <path d="M-3 605 Q31 590 69 605 L101 622 L111 640 H-15Z" fill="#304d7d" opacity=".75" />
        <path d="M18 572 Q39 580 60 572 L69 587 Q39 595 9 587Z" fill="#d9e2ed" stroke={ink} strokeWidth="1.5" />
      </g>

      {/* Audience: center customer with navy cap and red shirt */}
      <g>
        <path d="M104 640 L111 607 Q122 580 151 570 L208 570 Q237 580 250 607 L260 640Z"
          fill="#b83232" stroke={ink} strokeWidth="2.4" />
        <path d="M159 551 L159 580 Q180 591 201 580 L201 551Z" fill="url(#k-chef-skin)" stroke={ink} strokeWidth="2" />
        <path d="M144 505 Q145 475 180 471 Q215 475 216 505 L212 533 Q205 553 180 556 Q155 553 148 533Z"
          fill="url(#k-hair)" stroke={ink} strokeWidth="2.2" />
        <path d="M144 504 Q142 467 180 463 Q218 467 216 504 Q201 491 180 491 Q159 491 144 504Z"
          fill="#263b64" stroke={ink} strokeWidth="2.4" />
        <path d="M145 499 Q180 486 215 499 L213 520 Q180 512 147 520Z" fill="#314b78" />
        <path d="M163 508 Q180 501 197 508 L198 520 Q180 516 162 520Z" fill="#272321" stroke="#1c1918" strokeWidth="1.3" />
        <path d="M108 609 Q180 581 251 609 L260 640 H104Z" fill="#c63c39" opacity=".75" />
        <path d="M143 576 Q180 586 217 576 L228 591 Q180 604 132 591Z" fill="#a92a2c" stroke={ink} strokeWidth="1.5" />
      </g>

      {/* Audience: right customer with pink hijab and green clothing */}
      <g>
        <path d="M248 640 Q253 608 272 589 Q296 570 331 579 Q355 590 370 619 L370 640Z"
          fill="#648c57" stroke={ink} strokeWidth="2.4" />
        <path d="M255 614 Q260 575 282 549 Q296 532 317 535 Q348 542 359 577 Q365 602 350 620 Q331 640 298 640 L265 640Z"
          fill="#ed86a4" stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M283 551 Q293 522 321 520 Q347 522 359 551 Q367 577 357 604 Q348 623 328 635 Q338 611 324 591 Q311 571 283 551Z"
          fill="#f39ab5" stroke="#b95c7a" strokeWidth="1.3" />
        <path d="M296 542 Q312 532 326 540 M311 547 Q325 559 329 579 M340 552 Q350 574 345 598"
          fill="none" stroke="#d56f91" strokeWidth="2.2" strokeLinecap="round" opacity=".8" />
        <path d="M258 612 Q273 583 290 575 Q298 600 321 615 Q337 626 354 618 L360 640 H248Z"
          fill="#6c965d" stroke={ink} strokeWidth="1.8" />
        <path d="M276 604 Q291 613 301 630" fill="none" stroke="#83aa70" strokeWidth="2" />
      </g>
    </svg>
  );
};

export default CookingDemoScene;
