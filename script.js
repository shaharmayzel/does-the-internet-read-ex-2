/**
 * Behavioral Targeting — Builder (Catalog version, 12 items)
 * HOW TO USE (Quick):
 * 1) Paste signal lines in the ACTIONS ZONE (below).
 * 2) Paste rule packs inside evaluateSegment() where it says PASTE HERE (Segments).
 * 3) Click Reset, act like your persona, watch the message flip.
 */

// ---------- Simple traits store ----------
var KEY = "bt_traits";
function readTraits() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
function writeTraits(obj) { localStorage.setItem(KEY, JSON.stringify(obj)); }
function incTrait(name) { var t = readTraits(); t[name] = (t[name] || 0) + 1; writeTraits(t); render(); }
function setTrait(name, val) { var t = readTraits(); t[name] = val; writeTraits(t); render(); }
function resetTraits() { localStorage.removeItem(KEY); render(); }

// ---------- Demo catalog data (12 items) ----------
var products = [
    { id: "hp1", title: "UltraFocus Headphones", price: 199, cat: "audio", img: "https://picsum.photos/seed/hp1/400/300" },
    { id: "spk2", title: "Mini Boom Speaker", price: 79, cat: "audio", img: "https://picsum.photos/seed/spk2/400/300" },
    { id: "kb3", title: "Mechanical Keyboard Pro", price: 129, cat: "peripherals", img: "https://picsum.photos/seed/kb3/400/300" },
    { id: "ms4", title: "Precision Mouse", price: 59, cat: "peripherals", img: "https://picsum.photos/seed/ms4/400/300" },
    { id: "mn5", title: "4K Monitor 27”", price: 329, cat: "peripherals", img: "https://picsum.photos/seed/mn5/400/300" },
    { id: "wb6", title: "HD Webcam", price: 89, cat: "peripherals", img: "https://picsum.photos/seed/wb6/400/300" },
    { id: "sd7", title: "1TB SD Card", price: 159, cat: "accessories", img: "https://picsum.photos/seed/sd7/400/300" },
    { id: "ch8", title: "USB-C Charger 65W", price: 49, cat: "power", img: "https://picsum.photos/seed/ch8/400/300" },
    { id: "dt9", title: "Desk Tripod", price: 39, cat: "accessories", img: "https://picsum.photos/seed/dt9/400/300" },
    { id: "mc10", title: "Podcast Mic", price: 149, cat: "audio", img: "https://picsum.photos/seed/mc10/400/300" },
    { id: "hs11", title: "Gaming Headset", price: 109, cat: "audio", img: "https://picsum.photos/seed/hs11/400/300" },
    { id: "sp12", title: "Smart Plug Duo", price: 35, cat: "smart", img: "https://picsum.photos/seed/sp12/400/300" }
];

var state = { q: "", cat: "all" };

function filterProducts() {
    var q = state.q.trim().toLowerCase();
    var cat = state.cat;
    return products.filter(function (p) {
        var okCat = (cat === "all") || (p.cat === cat);
        var okText = !q || p.title.toLowerCase().indexOf(q) !== -1;
        return okCat && okText;
    });
}

// Generate selectors reference string
function buildSelectorsList() {
    return products.map(function (p) {
        return [
            "#card-" + p.id,
            "#img-" + p.id,
            "#priceBtn-" + p.id,
            "#specsLink-" + p.id,
            "#addToCart-" + p.id
        ].join("  ");
    }).join("\n");
}

// ---------- Render catalog ----------
function renderCatalog() {
    var c = document.getElementById("catalog");
    if (!c) return;
    var list = filterProducts();
    c.innerHTML = list.map(function (p) {
        return (
            '<article class="card-prod" id="card-' + p.id + '">' +
            '<div class="prod-img hover-target" id="img-' + p.id + '">' +
            '<img src="' + p.img + '" alt="' + p.title + '">' +
            '</div>' +
            '<div class="prod-body">' +
            '<h3 class="prod-title">' + p.title + '</h3>' +
            '<div class="price-row">' +
            '<span class="price">$' + p.price + '</span>' +
            '<button class="btn price-btn" id="priceBtn-' + p.id + '" type="button">Price details</button>' +
            '</div>' +
            '<div class="links">' +
            '<a href="#" class="specs-link" id="specsLink-' + p.id + '">View specs</a>' +
            '<button class="btn primary add-btn" id="addToCart-' + p.id + '" type="button">Add to cart</button>' +
            '</div>' +
            '</div>' +
            '</article>'
        );
    }).join("");
    var sel = document.getElementById("selectorsBox");
    if (sel) sel.textContent = buildSelectorsList();

    // Rewire events for newly rendered items
    wirePerItemEvents();
}

function wirePerItemEvents() {
    // Price clicks per item + global
    products.forEach(function (p) {
        var btn = document.getElementById("priceBtn-" + p.id);
        if (btn) {
            btn.addEventListener("click", function () {
                incTrait("price_clicks_total");
                incTrait("price_clicks_" + p.id);
            });
        }
    });

    // Long hover on image per item (>= 1s)
    products.forEach(function (p) {
        var img = document.getElementById("img-" + p.id);
        if (!img) return;
        var timer = null;
        img.addEventListener("mouseenter", function () {
            timer = setTimeout(function () { incTrait("img_long_hover_" + p.id); }, 1000);
        });
        img.addEventListener("mouseleave", function () { clearTimeout(timer); });
    });

    // Add to cart per item
    products.forEach(function (p) {
        var add = document.getElementById("addToCart-" + p.id);
        if (add) {
            add.addEventListener("click", function () {
                incTrait("cart_clicks_" + p.id);
            });
        }
    });

    // Specs click (prevent nav and count)
    products.forEach(function (p) {
        var a = document.getElementById("specsLink-" + p.id);
        if (a) {
            a.addEventListener("click", function (ev) {
                ev.preventDefault();
                incTrait("specs_clicks_" + p.id);
            });
        }
    });
}

// ---------- Sum helper for per-item counters ----------
function sumByPrefix(prefix) {
    var t = readTraits();
    var total = 0;
    Object.keys(t).forEach(function (k) {
        if (k.indexOf(prefix) === 0) total += (t[k] || 0);
    });
    return total;
}

// ---------- Segment evaluation ----------
function evaluateSegment() {
    var t = readTraits();
    var msg = "No segment yet.";

    // Prefilled examples (edit/keep):
    if (sumByPrefix("price_clicks_total") >= 7) {
        msg = "Price-obsessed: show discounts site-wide.";
    } else if (sumByPrefix("img_long_hover_") >= 3) {
        msg = "Tech-curious: highlight detailed comparisons.";
    } else if ((t.visits || 0) >= 3 && (t.time20s || 0) >= 1) {
        msg = "High-intent visitor: offer free shipping.";
    }

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // PASTE HERE (Segments): paste ONE rule pack below (no edits needed)
    // Example of the exact spot shown in the cheatsheet Skeleton.
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    var msgEl = document.getElementById("message");
    if (msgEl) msgEl.textContent = msg;
}

// ---------- Render traits + message ----------
function render() {
    var box = document.getElementById("traitsBox");
    if (box) box.textContent = JSON.stringify(readTraits(), null, 2);
    evaluateSegment();
}

// ---------- Wire events ----------
document.addEventListener("DOMContentLoaded", function () {
    renderCatalog();

    // Count a visit & time-on-page bucket
    incTrait("visits");
    setTimeout(function () { incTrait("time20s"); }, 20000);

    // URL param (?campaign=ad)
    var params = new URLSearchParams(window.location.search);
    var campaign = params.get("campaign");
    if (campaign) setTrait("campaign", campaign);

    // Search
    var search = document.getElementById("searchBox");
    if (search) {
        search.addEventListener("input", function () { state.q = search.value || ""; renderCatalog(); });
    }

    // Chips
    document.querySelectorAll(".chip").forEach(function (chip) {
        chip.addEventListener("click", function () {
            document.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
            chip.classList.add("active");
            state.cat = chip.getAttribute("data-cat") || "all";
            renderCatalog();
        });
    });

    // Reset traits
    var resetBtn = document.getElementById("reset");
    if (resetBtn) {
        resetBtn.addEventListener("click", function () { resetTraits(); });
    }

    // ===================== ACTIONS ZONE (paste signals below) =====================
    // Paste 2–4 signal lines from the cheatsheet under this line.
    // Example:
    // document.querySelectorAll('.price-btn').forEach(b=>b.onclick=()=>incTrait('price_clicks_total'));
    // ===============================================================================

    // Initial render of traits/message
    render();
});

/* ============================================================================
   REFERENCE CHEATSHEET (keep): paste in the zones above.
============================================================================ */
