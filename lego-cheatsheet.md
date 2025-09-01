# Builder – 45‑min Lego Exercise (Persona‑first)

You will build a simple “targeting detector”. First plan a persona. Then paste 2–4 signal lines and 1–2 rule lines. That’s it.

Where to paste
- Actions (signals): paste code in PASTE HERE (Actions)
- Segments (rules): inside function `evaluateSegment()`, PASTE HERE (Segments)

Step 1 — Make a persona (write, no code, 3–5 min)
Fill the blanks (1–2 lines):
- Name: __________ (example: “Audio Deal Hunter”)
- Goal: __________ (example: “Find audio discounts quickly”)
- Signals I’ll track (pick 2–3): price clicks, add to cart, specs clicks, long hover, search used, category chosen
- Message to show: __________

Step 2 — Add ONLY the signals you picked (paste into Actions, 10–15 min)
Each line records a behavior into a trait (saved in the browser). Paste only what you need.

- Price details (count all clicks across all products by this user)
```js
document.querySelectorAll('.price-btn').forEach(b=>b.onclick=()=>incTrait('price_clicks_total'));
```

- Add to cart (count all clicks across all products)
```js
document.querySelectorAll('.add-btn').forEach(b=>b.onclick=()=>incTrait('cart_clicks_total'));
```

- Specs link (count all spec link clicks)
```js
document.querySelectorAll('.specs-link').forEach(a=>a.onclick=()=>incTrait('specs_total'));
```

- Long hover on a product card (≥ 1.2s = intent)
```js
document.querySelectorAll('.card-prod').forEach(c=>{let t; c.onmouseenter=()=>{t=setTimeout(()=>incTrait('card_hover_'+c.id.replace('card-','')),1200)}; c.onmouseleave=()=>clearTimeout(t);});
```

- Search used (type 2+ letters)
```js
var sb=document.getElementById('searchBox'); if(sb) sb.oninput=()=>{ if((sb.value||'').length>=2) incTrait('search_used') };
```

- Category chosen (save the picked category name: audio/peripherals/...)
```js
document.querySelectorAll('.chip').forEach(ch=>ch.onclick=()=>setTrait('category',ch.getAttribute('data-cat')));
```

Step 3 — Add ONE ready‑made rule that matches your persona (paste into Segments, 15–20 min)
Rules read traits and set the final message `msg`.

Notes for rules
- Numbers: use `(t.NAME ?? 0)` so missing becomes 0
- Text: use `(t.NAME ?? '')`
- Sum many items: `sumByPrefix('PREFIX_')`
- Priority: later rules overwrite earlier ones (or use `else if`)

Pick ONE rule pack (no edits needed)

A) Deal Hunter (AND: search + category=audio + 2+ price clicks)
```js
if ((t.search_used ?? 0) >= 1 && (t.category ?? '') === 'audio' && (t.price_clicks_total ?? 0) >= 2) {
  msg = 'Audio deals: bundle + discount.';
}
```

B) Research Mode (OR: specs ≥2 OR many long hovers)
```js
if ((t.specs_total ?? 0) >= 2 || sumByPrefix('card_hover_') >= 3) {
  msg = 'Research mode: show comparisons.';
}
```

C) Cart Lover (sum all cart clicks across items)
```js
if (sumByPrefix('cart_clicks_') >= 3) {
  msg = 'Cart-lover: free shipping.';
}
```

D) Return Visitor (visited again AND stayed 20s once)
```js
if ((t.visits ?? 0) >= 2 && (t.time20s ?? 0) >= 1) {
  msg = 'Welcome back — free shipping unlocked.';
}
```

Step 4 — Test (1–2 min)
- Click “Reset traits”
- Act like your persona (do the signals you picked)
- Watch “Saved traits”; when your rule is true, “Live message” changes
- Too hard? lower numbers (e.g., 2 → 1). Too easy? raise them.

Extra (optional)
- Add a second rule pack under the first to create a “plan B” message. The last matching rule wins. 