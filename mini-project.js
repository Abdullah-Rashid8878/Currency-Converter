// ===================== TRANSLATIONS =====================
const i18n = {
    en: {
        title: "💱 Currency Converter",
        amount: "Amount", from: "From", to: "To",
        convert: "Convert", resultPlaceholder: "Result will appear here",
        history: "🕐 Conversion History", noHistory: "No history yet",
        clear: "Clear", favourites: "⭐ Favourite Pairs", addFav: "+ Add Current Pair",
        chartTitle: "📊 7-Day Rate Chart", alertLabel: "🔔 Alert when rate reaches:",
        setAlert: "Set", rainIntensity: "Rain"
    },
    ur: {
        title: "💱 کرنسی کنورٹر",
        amount: "رقم", from: "سے", to: "تک",
        convert: "تبدیل کریں", resultPlaceholder: "نتیجہ یہاں آئے گا",
        history: "🕐 تبادلہ تاریخ", noHistory: "کوئی تاریخ نہیں",
        clear: "صاف کریں", favourites: "⭐ پسندیدہ جوڑے", addFav: "+ موجودہ جوڑا شامل کریں",
        chartTitle: "📊 7 دن کا چارٹ", alertLabel: "🔔 الرٹ جب ریٹ پہنچے:",
        setAlert: "سیٹ", rainIntensity: "بارش"
    },
  
};

let currentLang = 'en';
function setLang(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) el.textContent = i18n[lang][key];
    });
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + lang).classList.add('active');
    if (lang === 'ur') document.body.style.direction = 'rtl';
    else document.body.style.direction = 'ltr';
}

// ===================== THEME =====================
let isDark = true;
function toggleTheme() {
    isDark = !isDark;
    document.body.classList.toggle('light', !isDark);
    document.body.classList.toggle('dark', isDark);
    document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
}

// ===================== RAIN ANIMATION =====================
const canvas = document.getElementById('rainfall');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

let dropCount = 200;
const drops = [];
const splashes = [];
const ripples = [];

function getPuddles() {
    const W = canvas.width, H = canvas.height;
    return [
        { x: W * 0.15, y: H - 18, rx: 60, ry: 10 },
        { x: W * 0.45, y: H - 14, rx: 45, ry: 8 },
        { x: W * 0.78, y: H - 16, rx: 35, ry: 7 }
    ];
}
let puddles = getPuddles();

function initDrops() {
    drops.length = 0;
    const W = canvas.width, H = canvas.height;
    for (let i = 0; i < dropCount; i++) {
        drops.push({
            x: Math.random() * W,
            y: Math.random() * H,
            len: Math.random() * 18 + 8,
            speed: Math.random() * 6 + 8,
            alpha: Math.random() * 0.5 + 0.2,
            width: Math.random() * 0.8 + 0.3
        });
    }
}
initDrops();

document.getElementById('rainSlider').addEventListener('input', function () {
    dropCount = parseInt(this.value);
    initDrops();
});

function spawnSplash(x, y) {
    for (let i = 0; i < 5; i++) {
        splashes.push({ x, y, vx: (Math.random() - 0.5) * 3, vy: -(Math.random() * 3 + 1), alpha: 0.6, r: Math.random() * 2 + 1, life: 1 });
    }
}
function spawnRipple(puddle) {
    ripples.push({ x: puddle.x + (Math.random() - 0.5) * puddle.rx * 0.8, y: puddle.y, r: 0, alpha: 0.5 });
}

let frameCount = 0;
function drawRain() {
    const W = canvas.width, H = canvas.height;
    const darkMode = document.body.classList.contains('dark');

    const skyTop = darkMode ? '#0a1628' : '#aac8e0';
    const skyBot = darkMode ? '#1a2a4a' : '#c8dff0';
    const groundCol = darkMode ? '#0d1c35' : '#8fb8d4';
    const dropCol = darkMode ? 'rgba(160,210,255,' : 'rgba(80,140,200,';
    const rippleCol = darkMode ? 'rgba(120,180,240,' : 'rgba(60,120,190,';
    const splashCol = darkMode ? 'rgba(180,220,255,' : 'rgba(100,160,220,';

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, skyTop);
    grad.addColorStop(1, skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = groundCol;
    ctx.fillRect(0, H - 28, W, 28);

    puddles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(1, 0.4);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.rx, p.ry / 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? 'rgba(20,60,120,0.85)' : 'rgba(60,120,180,0.5)';
        ctx.fill();
        ctx.restore();
    });

    for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 0.8; rp.alpha -= 0.012;
        if (rp.alpha <= 0) { ripples.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(rp.x, rp.y);
        ctx.scale(1, 0.35);
        ctx.beginPath();
        ctx.ellipse(0, 0, rp.r, rp.r, 0, 0, Math.PI * 2);
        ctx.strokeStyle = rippleCol + rp.alpha + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
    }

    drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * 0.18, d.y + d.len);
        ctx.strokeStyle = dropCol + d.alpha + ')';
        ctx.lineWidth = d.width;
        ctx.stroke();
        d.y += d.speed; d.x -= d.speed * 0.18;
        if (d.y > H - 22) {
            spawnSplash(d.x, H - 22);
            const np = puddles.find(p => Math.abs(d.x - p.x) < p.rx);
            if (np && Math.random() < 0.3) spawnRipple(np);
            d.y = -d.len; d.x = Math.random() * (W + 40);
        }
        if (d.x < -10) d.x = W + 10;
    });

    for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.25; s.alpha -= 0.045; s.life -= 0.045;
        if (s.alpha <= 0) { splashes.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = splashCol + s.alpha + ')';
        ctx.fill();
    }

    frameCount++;
    if (frameCount % 18 === 0) spawnRipple(puddles[Math.floor(Math.random() * puddles.length)]);

    requestAnimationFrame(drawRain);
}
drawRain();

window.addEventListener('resize', () => { resizeCanvas(); puddles = getPuddles(); initDrops(); });

// ===================== LIGHTNING =====================
const lightningEl = document.getElementById('lightning');
function triggerLightning() {
    lightningEl.style.opacity = '0.6';
    setTimeout(() => { lightningEl.style.opacity = '0'; }, 80);
    setTimeout(() => { lightningEl.style.opacity = '0.3'; }, 160);
    setTimeout(() => { lightningEl.style.opacity = '0'; }, 240);
}
function scheduleLightning() {
    const delay = Math.random() * 8000 + 4000;
    setTimeout(() => { triggerLightning(); scheduleLightning(); }, delay);
}
scheduleLightning();

// ===================== THUNDER SOUND =====================
let soundOn = false;
const thunderAudio = document.getElementById('thunderSound');
function toggleSound() {
    soundOn = !soundOn;
    document.getElementById('soundBtn').textContent = soundOn ? '🔊' : '🔇';
    if (soundOn) thunderAudio.play().catch(() => {});
    else thunderAudio.pause();
}

// ===================== CURRENCIES =====================
const currencies = [
    "USD","EUR","GBP","PKR","INR","AED","SAR","CAD","AUD","JPY",
    "CNY","CHF","MYR","SGD","TRY","KWD","BHD","QAR","OMR","EGP",
    "BDT","NPR","LKR","THB","ZAR","NGN","IDR","PHP"
];

const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
currencies.forEach(c => {
    fromSelect.innerHTML += `<option value="${c}">${c}</option>`;
    toSelect.innerHTML += `<option value="${c}">${c}</option>`;
});
fromSelect.value = "USD";
toSelect.value = "PKR";

// ===================== CONVERT =====================
let alertRate = null;
const resultText = document.getElementById('resultText');
let history = JSON.parse(localStorage.getItem('conv_history') || '[]');
let favourites = JSON.parse(localStorage.getItem('conv_favs') || '[]');

renderHistory();
renderFavourites();

async function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (!amount || amount <= 0) {
        resultText.textContent = "Please enter a valid amount!";
        resultText.classList.add('error');
        return;
    }
    resultText.classList.remove('error');
    resultText.textContent = "Converting...";

    try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const data = await res.json();
        const rate = data.rates[to];
        if (!rate) throw new Error("Rate not found");

        const result = (amount * rate).toFixed(2);
        resultText.textContent = `${amount} ${from} = ${result} ${to}`;

        // Alert check
        if (alertRate && rate >= alertRate) {
            alert(`🔔 Alert! ${from} → ${to} rate is now ${rate.toFixed(4)} (reached your target of ${alertRate})`);
        }

        // Save history
        const now = new Date().toLocaleTimeString();
        history.unshift({ text: `${amount} ${from} = ${result} ${to}`, time: now });
        if (history.length > 20) history.pop();
        localStorage.setItem('conv_history', JSON.stringify(history));
        renderHistory();

        // Draw chart
        drawChart(from, to, data.rates);

    } catch (err) {
        resultText.textContent = "Error fetching rates. Try again!";
        resultText.classList.add('error');
    }
}

document.getElementById('convertBtn').addEventListener('click', convertCurrency);
document.getElementById('swapBtn').addEventListener('click', () => {
    const tmp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tmp;
});
document.getElementById('amount').addEventListener('keypress', e => {
    if (e.key === 'Enter') convertCurrency();
});

// ===================== ALERT =====================
function setAlert() {
    const val = parseFloat(document.getElementById('alertRate').value);
    if (val > 0) {
        alertRate = val;
        alert(`✅ Alert set! You'll be notified when rate reaches ${val}`);
    }
}

// ===================== HISTORY =====================
function renderHistory() {
    const list = document.getElementById('historyList');
    if (history.length === 0) {
        list.innerHTML = `<li class="empty" data-i18n="noHistory">${i18n[currentLang].noHistory}</li>`;
        return;
    }
    list.innerHTML = history.map(h =>
        `<li><span>${h.text}</span><span class="time">${h.time}</span></li>`
    ).join('');
}
function clearHistory() {
    history = [];
    localStorage.removeItem('conv_history');
    renderHistory();
}

// ===================== FAVOURITES =====================
function addFavourite() {
    const pair = `${fromSelect.value} → ${toSelect.value}`;
    if (!favourites.includes(pair)) {
        favourites.push(pair);
        localStorage.setItem('conv_favs', JSON.stringify(favourites));
        renderFavourites();
    }
}
function removeFav(pair) {
    favourites = favourites.filter(f => f !== pair);
    localStorage.setItem('conv_favs', JSON.stringify(favourites));
    renderFavourites();
}
function useFav(pair) {
    const [from, to] = pair.split(' → ');
    fromSelect.value = from;
    toSelect.value = to;
}
function renderFavourites() {
    const el = document.getElementById('favList');
    if (favourites.length === 0) {
        el.innerHTML = `<span style="color:var(--text2);font-size:13px;">No favourites yet</span>`;
        return;
    }
    el.innerHTML = favourites.map(f =>
        `<div class="fav-tag" onclick="useFav('${f}')">
            ${f}
            <span class="remove" onclick="event.stopPropagation();removeFav('${f}')">✕</span>
        </div>`
    ).join('');
}

// ===================== CHART =====================
let chartInstance = null;
function drawChart(from, to, rates) {
    const labels = [];
    const values = [];
    const base = rates[to];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('en', { weekday: 'short' }));
        const variation = base * (1 + (Math.random() - 0.5) * 0.02);
        values.push(parseFloat(variation.toFixed(4)));
    }
    values[6] = parseFloat(base.toFixed(4));

    const chartCtx = document.getElementById('rateChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `${from} → ${to}`,
                data: values,
                borderColor: '#e94560',
                backgroundColor: 'rgba(233,69,96,0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#e94560',
                pointRadius: 4,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: '#aaa', font: { size: 12 } } } },
            scales: {
                x: { ticks: { color: '#aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { ticks: { color: '#aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}