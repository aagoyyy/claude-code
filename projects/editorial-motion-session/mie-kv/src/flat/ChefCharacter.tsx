import React from "react";

export type ChefExpression = "happy" | "neutral" | "sad" | "angry" | "surprised";

export interface ChefCharacterProps {
  expression?: ChefExpression;
  blink?: boolean;
  mouthOpen?: boolean;
  headRotation?: number;
  armRotation?: number;
  showSpatula?: boolean;
  className?: string;
}

/** SVG-only, deterministic, Remotion-ready cartoon chef character. */
export const ChefCharacter: React.FC<ChefCharacterProps> = ({
  expression = "happy",
  blink = false,
  mouthOpen = false,
  headRotation = 0,
  armRotation = 0,
  showSpatula = true,
  className,
}) => {
  const stroke = "#38231f";
  const skin = "#f4c79f";
  const red = "#bd292e";

  const mouth = (() => {
    switch (expression) {
      case "sad":
        return <path d="M414 350 Q450 320 486 350" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />;
      case "angry":
        return <path d="M414 344 Q450 354 486 344 L479 359 Q450 366 421 359Z" fill="#713033" stroke={stroke} strokeWidth="5" />;
      case "surprised":
        return <ellipse cx="450" cy="350" rx="15" ry="22" fill="#713033" stroke={stroke} strokeWidth="5" />;
      case "neutral":
        return <path d="M416 347 Q450 355 484 347" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />;
      default:
        return mouthOpen
          ? <path d="M408 337 Q450 365 492 337 Q486 389 450 389 Q414 389 408 337Z" fill="#713033" stroke={stroke} strokeWidth="5" />
          : <path d="M408 337 Q450 361 492 337 Q484 379 450 379 Q416 379 408 337Z" fill="#fff" stroke={stroke} strokeWidth="5" />;
    }
  })();

  return (
    <svg className={className} viewBox="0 0 900 1000" xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Cartoon chef holding a spatula"
      style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id="chef-apron-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c93438" /><stop offset=".55" stopColor={red} /><stop offset="1" stopColor="#8e2027" />
        </linearGradient>
        <linearGradient id="chef-skin-gradient" x1="0" y1="0" x2=".9" y2="1">
          <stop offset="0" stopColor="#ffdab8" /><stop offset="1" stopColor={skin} />
        </linearGradient>
      </defs>

      {/* Rear hair */}
      <path d="M326 222 Q306 151 348 105 Q376 56 438 58 Q474 25 525 54 Q575 42 600 91 Q639 128 607 220 L578 244 L331 247Z"
        fill="#211817" stroke={stroke} strokeWidth="8" strokeLinejoin="round" />
      <path d="M345 145 Q371 86 439 87 Q480 55 524 82 Q570 74 594 126 Q550 107 514 111 Q455 95 399 119 Q365 133 345 145Z" fill="#342421" />
      <path d="M370 104 Q400 78 438 83 M504 78 Q543 75 566 98" fill="none" stroke="#6b5148" strokeWidth="8" strokeLinecap="round" />

      {/* Neck */}
      <path d="M405 392 L405 475 Q450 506 495 475 L495 392Z" fill="url(#chef-skin-gradient)" stroke={stroke} strokeWidth="7" />

      {/* Jacket / torso */}
      <path d="M400 456 Q346 466 302 512 Q245 565 232 665 L218 920 L682 920 L668 665 Q655 560 598 512 Q554 466 500 456 Q476 491 450 491 Q424 491 400 456Z"
        fill="#fffaf1" stroke={stroke} strokeWidth="8" strokeLinejoin="round" />
      <path d="M400 456 L450 516 L500 456 L526 479 L480 544 L450 520 L420 544 L374 479Z"
        fill="#f3eee6" stroke={stroke} strokeWidth="7" strokeLinejoin="round" />
      <path d="M450 520 L424 566 L450 590 L476 566Z" fill="#fff" stroke={stroke} strokeWidth="5" />
      <path d="M302 514 Q266 573 260 682 L250 852 Q267 883 294 884 L316 668Z" fill="#e8e0d5" opacity=".72" />
      <path d="M598 514 Q638 566 645 678 L655 858 Q634 882 610 878 L585 669Z" fill="#e8e0d5" opacity=".65" />
      <path d="M330 584 Q318 705 326 910 M570 584 Q584 720 574 910" fill="none" stroke="#d4c9bc" strokeWidth="5" />
      <circle cx="352" cy="626" r="9" fill="#f5eee4" stroke={stroke} strokeWidth="4" />
      <circle cx="348" cy="680" r="9" fill="#f5eee4" stroke={stroke} strokeWidth="4" />

      {/* Apron straps and apron */}
      <path d="M385 474 L353 579 L378 589 L411 484Z M515 474 L547 579 L522 589 L489 484Z"
        fill={red} stroke={stroke} strokeWidth="7" strokeLinejoin="round" />
      <rect x="350" y="566" width="30" height="34" rx="6" fill="#b77a36" stroke={stroke} strokeWidth="6" />
      <rect x="520" y="566" width="30" height="34" rx="6" fill="#b77a36" stroke={stroke} strokeWidth="6" />
      <path d="M354 583 Q450 568 546 583 L570 920 L330 920Z" fill="url(#chef-apron-gradient)" stroke={stroke} strokeWidth="8" strokeLinejoin="round" />
      <path d="M405 750 Q450 742 495 750 L500 832 Q450 845 400 832Z" fill="#b9272e" stroke={stroke} strokeWidth="6" strokeLinejoin="round" />
      <path d="M408 758 L492 758" stroke="#e35b58" strokeWidth="5" opacity=".65" />

      {/* Left sleeve and arm */}
      <path d="M294 535 Q257 555 243 640 Q229 718 242 815 Q250 856 280 868 L302 839 Q283 804 291 733 L315 614Z"
        fill="#fffaf1" stroke={stroke} strokeWidth="8" strokeLinejoin="round" />
      <path d="M242 816 Q257 829 288 822 L299 851 Q278 879 251 861Z" fill={skin} stroke={stroke} strokeWidth="7" />

      {/* Right sleeve / arm */}
      <g transform={`rotate(${armRotation} 602 570)`}>
        <path d="M593 532 Q642 514 677 550 Q705 581 691 638 L669 700 Q654 730 626 716 L605 691 Q633 653 632 614 Q629 579 593 576Z"
          fill="#fffaf1" stroke={stroke} strokeWidth="8" strokeLinejoin="round" />
        <path d="M653 675 Q677 659 699 676 L712 718 Q704 752 675 759 L649 738Z"
          fill="url(#chef-skin-gradient)" stroke={stroke} strokeWidth="7" />
      </g>

      {/* Head, independently rotatable */}
      <g transform={`rotate(${headRotation} 450 280)`}>
        {/* Ears */}
        <path d="M337 253 Q306 230 312 291 Q319 337 348 326 L362 291Z" fill={skin} stroke={stroke} strokeWidth="7" />
        <path d="M563 253 Q594 230 588 291 Q581 337 552 326 L538 291Z" fill={skin} stroke={stroke} strokeWidth="7" />
        <path d="M328 273 Q337 267 342 292 M572 273 Q563 267 558 292" fill="none" stroke="#d99d76" strokeWidth="6" strokeLinecap="round" />

        {/* Face */}
        <path d="M335 173 Q450 117 565 173 L565 292 Q565 400 450 430 Q335 400 335 292Z"
          fill="url(#chef-skin-gradient)" stroke={stroke} strokeWidth="8" strokeLinejoin="round" />
        <path d="M342 365 Q450 423 558 365 Q535 412 450 430 Q365 412 342 365Z" fill="#e6ae88" opacity=".45" />
        <ellipse cx="381" cy="318" rx="25" ry="14" fill="#f29b83" opacity=".5" />
        <ellipse cx="519" cy="318" rx="25" ry="14" fill="#f29b83" opacity=".5" />

        {/* Eyebrows */}
        {expression === "angry" ? (
          <><path d="M365 244 L426 261 M474 261 L535 244" stroke={stroke} strokeWidth="11" strokeLinecap="round" /></>
        ) : (
          <><path d="M366 251 Q395 230 426 251 M474 251 Q505 230 534 251" fill="none" stroke={stroke} strokeWidth="10" strokeLinecap="round" /></>
        )}

        {/* Eyes */}
        {blink ? (
          <path d="M376 280 Q397 294 418 280 M482 280 Q503 294 524 280" fill="none" stroke={stroke} strokeWidth="8" strokeLinecap="round" />
        ) : (
          <>
            <ellipse cx="397" cy="266" rx="14" ry="18" fill="#fff" />
            <ellipse cx="400" cy="268" rx="9" ry="13" fill="#38231f" />
            <circle cx="404" cy="262" r="4" fill="#fff" />
            <ellipse cx="503" cy="266" rx="14" ry="18" fill="#fff" />
            <ellipse cx="506" cy="268" rx="9" ry="13" fill="#38231f" />
            <circle cx="510" cy="262" r="4" fill="#fff" />
          </>
        )}

        {/* Nose and mouth */}
        <path d="M450 286 Q434 323 450 331 Q464 338 477 324" fill="none" stroke="#d99d76" strokeWidth="8" strokeLinecap="round" />
        {mouth}

        {/* Front hair */}
        <path d="M327 234 Q306 170 342 112 Q377 56 438 62 Q484 24 530 58 Q586 51 610 117 Q625 164 584 235 Q564 184 520 174 Q453 151 389 181 Q355 196 327 234Z"
          fill="#211817" stroke={stroke} strokeWidth="8" strokeLinejoin="round" />
        <path d="M355 145 Q393 91 448 96 Q506 88 570 132 Q535 115 492 118 Q420 108 372 160Z" fill="#342421" />
        <path d="M378 103 Q413 77 452 85 M500 78 Q541 78 563 99" fill="none" stroke="#6d554c" strokeWidth="8" strokeLinecap="round" />

        {/* Red patterned headband */}
        <path d="M326 208 Q450 178 574 208 L574 245 Q450 215 326 245Z" fill={red} stroke={stroke} strokeWidth="7" strokeLinejoin="round" />
        <path d="M331 222 Q450 194 569 222" fill="none" stroke="#f16c65" strokeWidth="5" />
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={i} transform={`translate(${350 + i * 33} 222)`}>
            <path d="M0 -7 L8 0 L0 7 L-8 0Z" fill="none" stroke="#fff0df" strokeWidth="4" />
            <circle cx="0" cy="0" r="2.5" fill="#fff0df" />
          </g>
        ))}
      </g>

      {/* Spatula */}
      {showSpatula && (
        <g>
          <path d="M735 475 L748 475 L758 188 L734 188Z" fill="#95552f" stroke={stroke} strokeWidth="7" />
          <path d="M703 55 Q705 31 729 34 L786 37 Q810 39 809 64 L805 175 Q804 191 786 198 L719 196 L696 169Z"
            fill="#bdc5cb" stroke={stroke} strokeWidth="8" strokeLinejoin="round" />
          <path d="M722 66 L734 66 L729 151 L715 151Z" fill="#edf1f2" />
          <path d="M749 70 Q749 65 755 65 Q761 65 761 71 L760 126 Q760 133 754 133 Q748 133 748 126Z M773 71 Q773 65 779 66 Q785 66 785 72 L784 126 Q784 133 778 133 Q772 133 772 126Z"
            fill="none" stroke={stroke} strokeWidth="5" />
        </g>
      )}
    </svg>
  );
};

export default ChefCharacter;
