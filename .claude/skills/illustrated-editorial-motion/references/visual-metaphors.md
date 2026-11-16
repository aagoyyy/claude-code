# Visual metaphor engine

Do not illustrate every sentence literally. For each sentence decide the *idea*, then pick the object that carries it. Prefer metaphors that read in <1 s, reuse the existing library, and show change over time.

| Idea in the script | Preferred visual | Library pieces |
|---|---|---|
| Profit / earning | coin columns that stack higher; bars where `jual` > `modal`; "+Rp" tag popping | `CostChart`, `CoinColumn`, `Coin4`, label motion |
| Operating costs | receipts / utility bills sliding in, coins leaving a wallet, itemised panel counting to a total | `InfoPanel`, `Receipt`, wallet (to build) |
| Market competition | two storefronts side by side, one crowded vs one empty, split comparison | `Warung` x2, split-comparison composition |
| Growth | expanding bar/line graph, stacked coins, shop count growing (houses turning red) | `IsoBlock`, `CoinColumn`, `ArrowDraw` |
| Efficiency | organised workflow: items moving along a line, connected diagram, hands passing objects | `ArrowDraw`, `StorytellingScene` |
| Risk / loss | coins falling out of a bowl/wallet, shrinking bar, red tag | coin physics, `Coin4` |
| Time / break-even | calendar pages, clock, repeating bowls counting up to a target | `Notebook`, count-up numbers |
| Value / pricing | the same object with two price tags (cost vs sell) | `SwingTag2`, `PriceTagArt` |
| Process | top-down step panels "01 / 02 / 03" with category labels | `TopDownTable`, `CategoryLabel` |

## How to decide
1. Write the sentence's meaning in 5 words ("each bowl earns Rp 5.000").
2. List 2 candidate visuals: one literal, one metaphorical; choose the metaphor if it also shows a *number* or a *change*.
3. Check it against the previous scene (different composition? different background?).
4. Record the choice in the storyboard `Visual concept` column.

Example (V4 demo): "Modal 7.000, jual 12.000" -> not a bowl with a price, but a paper chart pinned on the table: two bars grow, coin columns stack on top, a "+5.000" tag pops. The ending is a wide street scene where a vendor presents the bowl and coin stacks pop up next to it.
