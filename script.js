const KEY = "bt_traits";

const readTraits = () => {
    try {
        const raw = localStorage.getItem(KEY) || "{}";
        return JSON.parse(raw);
    } catch (e) {
        return {};
    }
};

const writeTraits = (obj) => {
    localStorage.setItem(KEY, JSON.stringify(obj));
};

const incTrait = (name) => {
    const traits = readTraits();
    const current = traits[name] || 0;
    traits[name] = current + 1;
    writeTraits(traits);
    render();
};

const setTrait = (name, val) => {
    const traits = readTraits();
    traits[name] = val;
    writeTraits(traits);
    render();
};

const resetTraits = () => {
    localStorage.removeItem(KEY);
    render();
};

const products = [
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

const state = { q: "", cat: "all" };

const byId = (id) => document.getElementById(id);

const filterProducts = () => {
    const q = state.q.trim().toLowerCase();
    const cat = state.cat;
    return products.filter((p) => {
        const okCat = (cat === "all") || (p.cat === cat);
        const okText = !q || p.title.toLowerCase().includes(q);
        return okCat && okText;
    });
};

const buildSelectorsList = () => {
    return products.map((p) => {
        return [
            "#card-" + p.id,
            "#img-" + p.id,
            "#priceBtn-" + p.id,
            "#specsLink-" + p.id,
            "#addToCart-" + p.id
        ].join("  ");
    }).join("\n");
};

const renderProductCard = (p) => {
    return (
        `<article class="card-prod" id="card-${p.id}">
            <div class="prod-img hover-target" id="img-${p.id}">
                <img src="${p.img}" alt="${p.title}">
            </div>
            <div class="prod-body">
                <h3 class="prod-title">${p.title}</h3>
                <div class="price-row">
                    <span class="price">$${p.price}</span>
                    <button class="btn price-btn" id="priceBtn-${p.id}" type="button">Price details</button>
                </div>
                <div class="links">
                    <a href="#" class="specs-link" id="specsLink-${p.id}">View specs</a>
                    <button class="btn primary add-btn" id="addToCart-${p.id}" type="button">Add to cart</button>
                </div>
            </div>
        </article>`
    );
};

const renderCatalog = () => {
    const c = byId("catalog");
    if (!c) return;
    const list = filterProducts();
    c.innerHTML = list.map((p) => renderProductCard(p)).join("");
    const sel = byId("selectorsBox");
    if (sel) sel.textContent = buildSelectorsList();
    wirePerItemEvents();
};

const wirePerItemEvents = () => {
    products.forEach((p) => {
        const btn = byId("priceBtn-" + p.id);
        if (btn) {
            btn.addEventListener("click", () => {
                incTrait("price_clicks_total");
                incTrait("price_clicks_" + p.id);
            });
        }

        const img = byId("img-" + p.id);
        if (img) {
            let timer = null;
            img.addEventListener("mouseenter", () => {
                timer = setTimeout(() => { incTrait("img_long_hover_" + p.id); }, 1000);
            });
            img.addEventListener("mouseleave", () => { clearTimeout(timer); });
        }

        const add = byId("addToCart-" + p.id);
        if (add) {
            add.addEventListener("click", () => {
                incTrait("cart_clicks_" + p.id);
            });
        }

        const a = byId("specsLink-" + p.id);
        if (a) {
            a.addEventListener("click", (ev) => {
                ev.preventDefault();
                incTrait("specs_clicks_" + p.id);
            });
        }
    });
};

window.sumByPrefix = (prefix) => {
    const t = readTraits();
    let total = 0;
    Object.keys(t).forEach((k) => {
        if (k.indexOf(prefix) === 0) total += (t[k] || 0);
    });
    return total;
};

const applySegments = (t) => {
    if (typeof window !== "undefined" && typeof window.STUDENT_SEGMENTS === "function") {
        try { return window.STUDENT_SEGMENTS(t) || ""; } catch (e) { return ""; }
    }
    return "";
};



const wireCustomSignals = () => {
    if (typeof window !== "undefined" && typeof window.STUDENT_SIGNALS === "function") {
        try { window.STUDENT_SIGNALS({ incTrait, setTrait, byId }); } catch (e) { }
    }
};

const evaluateSegment = () => {
    const t = readTraits();
    let msg = "No segment yet.";

    const custom = applySegments(t);
    if (custom) msg = custom;

    const msgEl = byId("message");
    if (msgEl) msgEl.textContent = msg;
};

const render = () => {
    const box = byId("traitsBox");
    if (box) box.textContent = JSON.stringify(readTraits(), null, 2);
    evaluateSegment();
};


document.addEventListener("DOMContentLoaded", () => {
    renderCatalog();

    incTrait("visits");
    setTimeout(() => { incTrait("time20s"); }, 20000);

    const params = new URLSearchParams(window.location.search);
    const campaign = params.get("campaign");
    if (campaign) setTrait("campaign", campaign);

    const search = byId("searchBox");
    if (search) {
        search.addEventListener("input", () => { state.q = search.value || ""; renderCatalog(); });
    }

    document.querySelectorAll(".chip").forEach((chip) => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".chip").forEach((c) => { c.classList.remove("active"); });
            chip.classList.add("active");
            state.cat = chip.getAttribute("data-cat") || "all";
            renderCatalog();
        });
    });

    const resetBtn = byId("reset");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => { resetTraits(); });
    }

    wireCustomSignals();
    render();
});
