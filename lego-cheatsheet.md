# Easy Builder – 40‑minute Exercise (Choose One)

Goal: Make the page show a friendly message based on a simple behavior.
Pick ONE mini‑mission below. Copy‑paste ONE signal and ONE rule. Done.

Where to paste (in `student-config.js`):
- Signals: inside `STUDENT_SIGNALS(...)`
- Message rules: inside `STUDENT_SEGMENTS(...)` (return a string or "")

Quick terms (plain English):
- Signals: what you count (the clicks or actions).
- Message rule: how you decide what text to show. Return a string to show it; return '' to show nothing.

Mini‑Mission A — Picture Superfan (click the same picture)
1) Signal (copy‑paste as is)
```js
// Count clicks on each product picture
document.querySelectorAll('.prod-img').forEach(d=>d.onclick=()=>incTrait('img_clicks_'+d.id.replace('img-','')));
```
2) Message rule (copy‑paste as is)
```js
// If total picture clicks across products is 3+, show a simple message
if (sumByPrefix('img_clicks_') >= 3) return 'You really like this!';
return '';
```

Mini‑Mission B — Cart Explorer (click Add to cart)
1) Signal
```js
// Count all Add to cart clicks
document.querySelectorAll('.add-btn').forEach(b=>b.onclick=()=>incTrait('cart_total'));
```
2) Message rule
```js
if ((t.cart_total||0) >= 2) return 'Cart curious — show fast checkout.';
return '';
```

Mini‑Mission C — Specs Seeker (open specs links)
1) Signal
```js
// Count all specs clicks
document.querySelectorAll('.specs-link').forEach(a=>a.onclick=()=>incTrait('specs_total'));
```
2) Message rule
```js
if ((t.specs_total||0) >= 2) return 'Wants details — show comparisons.';
return '';
```

Mini‑Mission D — Price Checker (tap Price details)
1) Signal
```js
// Count all price detail clicks
document.querySelectorAll('.price-btn').forEach(b=>b.onclick=()=>incTrait('price_total'));
```
2) Message rule
```js
if ((t.price_total||0) >= 2) return 'Deal hunter — highlight discounts.';
return '';
```

Mini‑Mission E — Hover Fan (hover and linger on pictures)
1) Signal
```js
// Count long hovers (≥ 1.2s) on any product image
document.querySelectorAll('.prod-img').forEach(d=>{let tm; d.onmouseenter=()=>{tm=setTimeout(()=>incTrait('img_hover_total'),1200)}; d.onmouseleave=()=>clearTimeout(tm);});
```
2) Message rule
```js
if ((t.img_hover_total||0) >= 2) return 'Taking a closer look — show more images.';
return '';
```

Mini‑Mission F — Specific Picture Favorite (pick one product)
1) Signal (choose ONE product ID, e.g., hp1)
```js
// Count clicks on a specific product picture only
document.getElementById('img-hp1').onclick=()=>incTrait('img_clicks_hp1');
```
2) Message rule
```js
if ((t.img_clicks_hp1||0) >= 2) return 'You really like: UltraFocus Headphones.';
return '';
```

Mini‑Mission G — Category Chooser (save chosen category)
1) Signal
```js
// Save the picked category name (audio/peripherals/accessories/power/smart)
document.querySelectorAll('.chip').forEach(ch=>ch.onclick=()=>setTrait('category',ch.getAttribute('data-cat')));
```
2) Message rule
```js
if ((t.category||'') === 'audio') return 'Audio fan — show speakers & headphones.';
return '';
```

How to test (2 minutes)
- Click “Reset traits”.
- Do your chosen action a few times (e.g., click the same picture 3×).
- Watch “Live message” change.

Tips
- “Saved traits” panel shows what’s counted (e.g., `img_clicks_*`, `img_hover_total`, `category`).
- Too easy/hard? Do fewer/more actions. No code change needed. 