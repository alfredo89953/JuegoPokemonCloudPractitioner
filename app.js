/**
 * SimCert - Cloud Trainer Adventure (AWS Certified Cloud Practitioner)
 * Core Application Engine (app.js)
 * * Desarrollado bajo especificaciones PWA y Vanilla JavaScript de alto rendimiento.
 */

// ==================================================================
// 1. CONSTANTES DE LORE Y CONFIGURACIONES BASE
// ==================================================================
const pokeLore = {
    "lambda": { "name": "Abra", "desc": "Aparece y desaparece sin dejar rastro. Ejecuta su poder sin servidores." },
    "s3": { "name": "Snorlax", "desc": "Almacena TODO en su inmenso estómago. Nunca se llena (capacidad casi ilimitada)." },
    "ec2": { "name": "Machamp", "desc": "Fuerza bruta computable. Tú controlas de forma directa cada músculo de la máquina." },
    "rds": { "name": "Slowbro", "desc": "Lento pero altamente confiable. Automatiza y gestiona las bases de datos por ti." },
    "cloudfront": { "name": "Pidgeot", "desc": "Ultra veloz. Entrega contenido multimedia desde el borde del mundo a toda prisa." },
    "iam": { "name": "Alakazam", "desc": "Controla estrictamente quién puede hacer qué. Solo los sabios autorizados acceden." },
    "vpc": { "name": "Mewtwo", "desc": "Tu ecosistema de red privada y oculta. Nadie entra sin tu control mental exacto." },
    "route 53": { "name": "Kadabra", "desc": "El gran cartero de Internet. Traduce dominios y sabe dónde está cada servidor." },
    "auto scaling": { "name": "Ditto", "desc": "Se adapta y clona según la carga competitiva. Multiplica unidades si el peligro escala." },
    "cloudwatch": { "name": "Haunter", "desc": "Siempre vigilando oculto entre las sombras de tu infraestructura." }
};

const wildPokemonTable = [
    { id: 1, name: "Bulbasaur", types: ["Planta", "Veneno"], rate: 7, flavor: "Crece con el tiempo. Como Auto Scaling, se fortalece con la demanda." },
    { id: 3, name: "Venusaur", types: ["Planta", "Veneno"], rate: 2, flavor: "La naturaleza en equilibrio. Como EKS gestionando pods de Kubernetes en armonía." },
    { id: 4, name: "Charmander", types: ["Fuego"], rate: 7, flavor: "Potencia pura. Como EC2, tú controlas cada llamarada de su cola." },
    { id: 6, name: "Charizard", types: ["Fuego", "Volador"], rate: 2, flavor: "¡Domina los cielos! Como EC2 con GPU optimizada: poder máximo para cargas críticas." },
    { id: 7, name: "Squirtle", types: ["Agua"], rate: 7, flavor: "Defensa sólida como RDS: gestiona el agua (datos) con gran confiabilidad." },
    { id: 9, name: "Blastoise", types: ["Agua"], rate: 2, flavor: "Cañones de agua de alta presión. Como RDS Multi-AZ: resiliencia máxima de datos." },
    { id: 16, name: "Pidgey", types: ["Normal", "Volador"], rate: 15, flavor: "Un Pokémon común pero veloz. Como CloudFront, aparece en todas partes." },
    { id: 19, name: "Rattata", types: ["Normal"], rate: 15, flavor: "Rápido y ágil. Igual que Lambda: pequeño pero siempre listo para actuar." },
    { id: 25, name: "Pikachu", types: ["Eléctrico"], rate: 5, flavor: "Energía instantánea. Como Lambda: descarga su poder y desaparece sin servidor." },
    { id: 26, name: "Raichu", types: ["Eléctrico"], rate: 2, flavor: "Evolución del rayo. Como Lambda@Edge: velocidad máxima en el borde de la red." },
    { id: 41, name: "Zubat", types: ["Veneno", "Volador"], rate: 12, flavor: "Navega en la oscuridad usando sonar. Como CloudWatch, monitorea sin ser visto." },
    { id: 43, name: "Oddish", types: ["Planta", "Veneno"], rate: 10, flavor: "Absorbe nutrientes del suelo. Como S3, acumula todo lo que puede." },
    { id: 52, name: "Meowth", types: ["Normal"], rate: 6, flavor: "Siempre buscando monedas. Como Cost Explorer, rastrea cada centavo en AWS." },
    { id: 54, name: "Psyduck", types: ["Agua", "Psíquico"], rate: 6, flavor: "Confundido por los datos. Como Athena, analiza todo con su mente (SQL)." },
    { id: 59, name: "Arcanine", types: ["Fuego"], rate: 2, flavor: "Legendario en velocidad. Como CloudFront con caché agresivo: entrega instantánea." },
    { id: 60, name: "Poliwag", types: ["Agua"], rate: 10, flavor: "Gira en remolinos de datos. Como SQS, mantiene el flujo de mensajes constante." },
    { id: 65, name: "Alakazam", types: ["Psíquico"], rate: 2, flavor: "IAM personificado: controla el acceso con telepatía. Potencia mental suprema." },
    { id: 68, name: "Machamp", types: ["Lucha"], rate: 2, flavor: "EC2 puro: cuatro brazos para cargas de trabajo masivas. Fuerza bruta total." },
    { id: 69, name: "Bellsprout", types: ["Planta", "Veneno"], rate: 10, flavor: "Flexible y adaptable, como Elastic Beanstalk desplegando apps." },
    { id: 74, name: "Geodude", types: ["Roca", "Tierra"], rate: 7, flavor: "Resistente y estable. Como EBS: almacenamiento de bloques sólido como la roca." },
    { id: 92, name: "Gastly", types: ["Fantasma", "Veneno"], rate: 5, flavor: "Invisible como un microservicio. Perfectamente encapsulado en contenedor." },
    { id: 94, name: "Gengar", types: ["Fantasma", "Veneno"], rate: 2, flavor: "La amenaza invisible. Como AWS WAF: detecta y neutraliza ataques oscuros." },
    { id: 130, name: "Gyarados", types: ["Agua", "Volador"], rate: 1, flavor: "¡Evolución feroz! Como un desastre en producción que se convierte en fortaleza." },
    { id: 131, name: "Lapras", types: ["Agua", "Hielo"], rate: 1, flavor: "Transporta a través del mar de datos. Como AWS Direct Connect: conexión directa y tranquila." },
    { id: 144, name: "Articuno", types: ["Hielo", "Volador"], rate: 0.5, flavor: "¡LEGENDARIO! Como AWS Glacier: congela datos por eras. Frío y eterno." },
    { id: 145, name: "Zapdos", types: ["Eléctrico", "Volador"], rate: 0.5, flavor: "¡LEGENDARIO! Como Amazon Kinesis: procesa millones de eventos eléctricos en tiempo real." },
    { id: 146, name: "Moltres", types: ["Fuego", "Volador"], rate: 0.5, flavor: "¡LEGENDARIO! Como AWS Batch: procesa trabajos masivos con fuego y determinación." },
    { id: 150, name: "Mewtwo", types: ["Psíquico"], rate: 0.3, flavor: "¡EL MÁS PODEROSO! Como una arquitectura Multi-Region con VPC peering: nada lo detiene." },
    { id: 151, name: "Mew", types: ["Psíquico"], rate: 0.2, flavor: "¡ULTRA RARO! Como AWS Well-Architected Framework: contiene toda la sabiduría de la nube." }
];

const MEDALS_DEF = [
    { id: "trivia_nodeath", icon: "🪨", name: "Medalla Roca", desc: "Completa Batalla sin morir 10 veces", mode: "trivia", target: 10 },
    { id: "errors_nodeath", icon: "🌊", name: "Medalla Cascada", desc: "Completa Revancha sin morir 10 veces", mode: "errors", target: 10 },
    { id: "exam_nodeath", icon: "⚡", name: "Medalla Trueno", desc: "Completa Liga sin morir 10 veces", mode: "exam", target: 10 },
    { id: "practice_nodeath", icon: "🌈", name: "Medalla Arco Iris", desc: "Completa Práctica sin morir 10 veces", mode: "practice", target: 10 },
    { id: "pokemon_caught_10", icon: "🎖️", name: "Medalla Pokéball", desc: "Captura 10 Pokémon en Práctica", mode: "any", target: 10, stat: "caught" },
    { id: "pokemon_caught_50", icon: "🏆", name: "Medalla Master", desc: "Captura 50 Pokémon en Práctica", mode: "any", target: 50, stat: "caught" },
    { id: "level_10", icon: "⭐", name: "Medalla XP", desc: "Alcanza el Nivel 10", mode: "any", target: 10, stat: "level" },
    { id: "streak_10", icon: "🔥", name: "Medalla Llama", desc: "Consigue una racha de 10 correctas", mode: "any", target: 10, stat: "streak" }
];

const dailyTips = [
    "☁️ EC2 = máquinas virtuales. Tú controlas el SO.",
    "🪣 S3 es almacenamiento de objetos, no de archivos.",
    "⚡ Lambda es serverless: solo pagas cuando se ejecuta.",
    "🔐 IAM controla quién hace qué dentro de AWS.",
    "🌐 CloudFront es la CDN de AWS (caché global).",
    "📊 CloudWatch monitorea métricas y logs.",
    "🏗️ VPC es tu red privada dentro de AWS.",
    "🔁 Auto Scaling ajusta capacidad según la demanda.",
    "🛒 RDS es bases de datos gestionadas.",
    "🛡️ AWS Shield protege contra ataques DDoS.",
    "💲 Pago por uso: solo pagas lo que consumes.",
    "🌍 Regiones y Zonas de Disponibilidad = alta disponibilidad.",
    "📦 ECR almacena imágenes Docker; ECS/EKS las ejecuta.",
    "🔑 KMS gestiona claves de cifrado en AWS.",
    "📬 SQS es una cola de mensajes para desacoplar servicios."
];

const difficulties = {
    easy: { lives: 5, questions: 5, time: 45, multiplier: 0.2 },
    medium: { lives: 3, questions: 10, time: 30, multiplier: 0.15 },
    hard: { lives: 1, questions: 15, time: 15, multiplier: 0.1 }
};

// ==================================================================
// 2. ESTADO GLOBAL DE LA APLICACIÓN (MEMORIA VOLÁTIL / RUNTIME)
// ==================================================================
let masterQuestionBank = [];
let activeQuestionBank = [];
let currentQuestionIndex = 0;
let score = 0;
let lives = 3;
let timerInterval = null;
let timeLeft = 0;
let totalTimeAllocated = 30;
let isMultiSelect = false;
let targetAnswersCount = 1;
let userSelectedOptions = [];
let isExamMode = false;
let isErrorMode = false;
let isPracticeMode = false;
let examUserAnswers = {};
let examQuestionsOrder = [];
let noDeathThisRound = true;
let selectedConfig = difficulties.easy;

// Atributos de Progresión P2P
let xp = parseInt(localStorage.getItem('poke_xp') || '0');
let streak = 0;
let maxStreakThisRound = 0;
let soundEnabled = localStorage.getItem('poke_sound') !== 'off';
let audioCtx = null;

// Lógica de Captura Salvaje
let wildPokemon = null;
let captureProgress = 0;
const CAPTURE_REQUIRED = 10;

// ==================================================================
// 3. CAPA DE PERSISTENCIA ROBUSTA (LOCALSTORAGE MANAGER)
// ==================================================================
const SimCertState = {
    STORAGE_KEY: 'simcert_active_session_data',

    saveState() {
        try {
            const stateObj = {
                progress: {
                    currentQuestionIndex,
                    score,
                    lives,
                    isExamMode,
                    isErrorMode,
                    isPracticeMode,
                    examUserAnswers,
                    examQuestionsOrder,
                    noDeathThisRound,
                    streak,
                    maxStreakThisRound,
                    captureProgress,
                    wildPokemon,
                    activeQuestionBank // Persiste el mazo recortado actual para reenganche directo
                },
                preferences: {
                    soundEnabled,
                    selectedConfigKey: Object.keys(difficulties).find(k => difficulties[k].lives === selectedConfig.lives) || 'easy',
                    username: document.getElementById('username-input')?.value.trim() || 'Alumno_Anonimo'
                },
                theme: {
                    darkMode: true // Reservado para futuras implementaciones de stylesheets dinámicos
                }
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateObj));
        } catch (e) {
            console.error('[Engine State] Error al serializar el estado actual:', e);
            if (e.name === 'QuotaExceededError') {
                showToast('⚠️ Memoria llena en el dispositivo. No se pudo guardar la sesión de entrenamiento.');
            }
        }
    },

    loadState() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return false;

            const parsed = JSON.parse(data);
            
            // Asignación controlada al motor en ejecución
            if (parsed.progress) {
                currentQuestionIndex = parsed.progress.currentQuestionIndex ?? 0;
                score = parsed.progress.score ?? 0;
                lives = parsed.progress.lives ?? 3;
                isExamMode = parsed.progress.isExamMode ?? false;
                isErrorMode = parsed.progress.isErrorMode ?? false;
                isPracticeMode = parsed.progress.isPracticeMode ?? false;
                examUserAnswers = parsed.progress.examUserAnswers ?? {};
                examQuestionsOrder = parsed.progress.examQuestionsOrder ?? [];
                noDeathThisRound = parsed.progress.noDeathThisRound ?? true;
                streak = parsed.progress.streak ?? 0;
                maxStreakThisRound = parsed.progress.maxStreakThisRound ?? 0;
                captureProgress = parsed.progress.captureProgress ?? 0;
                wildPokemon = parsed.progress.wildPokemon ?? null;
                activeQuestionBank = parsed.progress.activeQuestionBank ?? [];
            }

            if (parsed.preferences) {
                soundEnabled = parsed.preferences.soundEnabled ?? true;
                selectedConfig = difficulties[parsed.preferences.selectedConfigKey] || difficulties.easy;
            }

            return true;
        } catch (e) {
            console.error('[Engine State] Error al parsear estado persistido corrupto:', e);
            this.clearSession();
            return false;
        }
    },

    clearSession() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (e) { /* Silenciar fallos en entornos ultra-restrictivos */ }
    }
};

// ==================================================================
// 4. SISTEMA DE AUDIO NATIVO (WEB AUDIO API)
// ==================================================================
function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playTone(freqs, duration = 80, type = 'square') {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioCtx();
        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator(), gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = type;
            const t = ctx.currentTime + i * (duration / 1000);
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + duration / 1000);
            osc.start(t); osc.stop(t + duration / 1000 + 0.05);
        });
    } catch (e) {}
}

function playSoundCorrect()   { playTone([523, 659, 784], 90); }
function playSoundIncorrect() { playTone([330, 247, 196], 110); }
function playSoundStart()     { playTone([392, 523, 659, 784], 100); }
function playSoundCapture()   { playTone([523, 659, 784, 1047], 120); }
function playSoundFlee()      { playTone([247, 196, 147], 100); }
function playSoundMedal()     { playTone([784, 1047, 1319, 1568], 130); }

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('poke_sound', soundEnabled ? 'on' : 'off');
    document.getElementById('sound-toggle').textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playTone([523, 659], 80);
    SimCertState.saveState();
}

// ==================================================================
// 5. TOAST NOTIFICATIONS INTERFACES
// ==================================================================
function showToast(message, duration = 2800) {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = message; c.appendChild(t);
    setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 350); }, duration);
}

// ==================================================================
// 6. MOTOR DE SISTEMA DE EXPERIENCIA (XP) Y STREAKS
// ==================================================================
function getLevel() { return Math.floor(xp / XP_PER_LEVEL) + 1; }
function getXpInLevel() { return xp % XP_PER_LEVEL; }
const XP_PER_LEVEL = 100;

function awardXP(amount) {
    const prevLevel = getLevel();
    xp = Math.max(0, xp + amount);
    localStorage.setItem('poke_xp', xp);
    updateXpBar();
    const newLevel = getLevel();
    if (newLevel > prevLevel) {
        showToast(`⭐ ¡NIVEL ${newLevel}!\n¡Entrenador más fuerte!`);
        playTone([880, 1100, 1320], 120);
        checkMedal('level_10');
    }
}

function updateXpBar() {
    const fill = document.getElementById('xp-bar-fill');
    const label = document.getElementById('xp-label');
    if (!fill || !label) return;
    fill.style.width = getXpInLevel() + '%';
    label.textContent = `${getXpInLevel()} / ${XP_PER_LEVEL} XP — Lv.${getLevel()}`;
}

function updateStreak(isCorrect) {
    const el = document.getElementById('streak-display');
    if (!el) return;
    if (isCorrect) {
        streak++;
        if (streak > maxStreakThisRound) maxStreakThisRound = streak;
        if (streak >= 3) {
            el.textContent = `🔥 RACHA x${streak} — ¡SÚPER CALIENTE!`;
            el.classList.add('fire'); setTimeout(() => el.classList.remove('fire'), 600);
            if (streak % 3 === 0) showToast(`🔥 ¡RACHA DE ${streak}!\n+${streak >= 3 ? 15 : 10} XP EXTRA`);
            awardXP(streak >= 3 ? 15 : 10);
        } else {
            el.textContent = streak >= 2 ? `✨ RACHA x${streak}` : '';
            awardXP(10);
        }
        if (streak >= 10) checkMedal('streak_10');
    } else {
        if (streak >= 3) showToast(`💔 Racha de ${streak} perdida...`);
        streak = 0; el.textContent = '';
        awardXP(-15); // Penalización controlada de XP por error
    }
}

// ==================================================================
// 7. SISTEMA DE RECOMPENSAS (MEDALLAS)
// ==================================================================
function getMedalData() { return JSON.parse(localStorage.getItem('poke_medals') || '{}'); }
function saveMedalData(d) { localStorage.setItem('poke_medals', JSON.stringify(d)); }
function getCurrentUser() { return document.getElementById('username-input')?.value.trim() || 'Alumno_Anonimo'; }

function getMedalProgress(medalId) {
    const d = getMedalData(); const u = getCurrentUser();
    return (d[u] || {})[medalId] || { count: 0, earned: false };
}

function incrementMedalProgress(medalId) {
    const d = getMedalData(); const u = getCurrentUser();
    if (!d[u]) d[u] = {};
    if (!d[u][medalId]) d[u][medalId] = { count: 0, earned: false };
    d[u][medalId].count++;
    const def = MEDALS_DEF.find(m => m.id === medalId);
    if (def && d[u][medalId].count >= def.target && !d[u][medalId].earned) {
        d[u][medalId].earned = true;
        saveMedalData(d);
        return true;
    }
    saveMedalData(d);
    return false;
}

function checkMedal(medalId) {
    const prog = getMedalProgress(medalId);
    if (prog.earned) return;
    const def = MEDALS_DEF.find(m => m.id === medalId);
    if (!def) return;

    if (def.stat === 'level') {
        if (getLevel() >= def.target) {
            const d = getMedalData(); const u = getCurrentUser();
            if (!d[u]) d[u] = {};
            d[u][medalId] = { count: def.target, earned: true };
            saveMedalData(d); announceNewMedal(def);
        }
    } else if (def.stat === 'caught') {
        const caught = getCaughtPokemon().length;
        const d = getMedalData(); const u = getCurrentUser();
        if (!d[u]) d[u] = {};
        d[u][medalId] = { count: caught, earned: caught >= def.target };
        saveMedalData(d);
        if (caught >= def.target) announceNewMedal(def);
    } else if (def.stat === 'streak') {
        if (maxStreakThisRound >= def.target) {
            const d = getMedalData(); const u = getCurrentUser();
            if (!d[u]) d[u] = {};
            d[u][medalId] = { count: def.target, earned: true };
            saveMedalData(d); announceNewMedal(def);
        }
    }
}

function checkNodeathMedal(mode) {
    const medalId = mode + '_nodeath';
    const def = MEDALS_DEF.find(m => m.id === medalId);
    if (!def) return;
    if (getMedalProgress(medalId).earned) return;
    if (incrementMedalProgress(medalId)) announceNewMedal(def);
}

function announceNewMedal(def) {
    showToast(`🏅 ¡NUEVA MEDALLA!\n${def.icon} ${def.name}`, 4000);
    playSoundMedal();
    const targetEl = document.getElementById('results-medal-earned');
    if (targetEl) {
        targetEl.classList.remove('hidden');
        targetEl.textContent = `${def.icon} ¡MEDALLA ${def.name.toUpperCase()} GANADA!`;
    }
    renderMedals();
}

function renderMedals() {
    const grid = document.getElementById('medals-grid');
    if (!grid) return;
    grid.innerHTML = '';
    MEDALS_DEF.forEach(def => {
        const prog = getMedalProgress(def.id);
        const card = document.createElement('div');
        card.className = 'medal-badge' + (prog.earned ? ' earned' : ' locked');
        card.title = `${def.desc} (${prog.count || 0}/${def.target})`;
        card.innerHTML = `<span class="medal-icon">${def.icon}</span><span class="medal-name">${def.name}</span><span class="medal-count">${prog.count || 0}/${def.target}</span>`;
        grid.appendChild(card);
    });
}

// ==================================================================
// 8. SUBSISTEMA MODO PRÁCTICA (POKÉMON SALVAJES Y POKÉDEX)
// ==================================================================
function pickWildPokemon() {
    const total = wildPokemonTable.reduce((s, p) => s + p.rate, 0);
    let r = Math.random() * total;
    for (const p of wildPokemonTable) {
        r -= p.rate;
        if (r <= 0) return { ...p };
    }
    return { ...wildPokemonTable[0] };
}

function spawnWildPokemon() {
    wildPokemon = pickWildPokemon();
    captureProgress = 0;
    updateCaptureUI();
    document.getElementById('wild-title').textContent = '¡Un Pokémon salvaje apareció!';
    document.getElementById('wild-sprite').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${wildPokemon.id}.png`;
    document.getElementById('wild-sprite').className = 'wild-pokemon-sprite';
    document.getElementById('wild-name').textContent = `#${wildPokemon.id} ${wildPokemon.name.toUpperCase()}`;
    document.getElementById('wild-types').innerHTML = wildPokemon.types.map(t => `<span class="pokemon-type-badge">${t}</span>`).join(' ');
    document.getElementById('wild-flavor').textContent = wildPokemon.flavor;
    document.getElementById('wild-flee-msg').classList.add('hidden');
    document.getElementById('wild-overlay').classList.remove('hidden');
    playTone([330, 262, 294, 330], 110);
    SimCertState.saveState();
}

function updateCaptureUI() {
    const pct = (captureProgress / CAPTURE_REQUIRED) * 100;
    document.getElementById('capture-bar').style.width = pct + '%';
    document.getElementById('capture-count').textContent = `${captureProgress} / ${CAPTURE_REQUIRED} respuestas correctas`;
}

function closeWildOverlay() { document.getElementById('wild-overlay').classList.add('hidden'); }

function fleeFromBattle() {
    wildPokemon = null; captureProgress = 0;
    playSoundFlee();
    document.getElementById('wild-overlay').classList.add('hidden');
    showToast(`🏃 ¡Escapaste!\nEl Pokémon huyó...`);
    spawnNextWildSoon();
}

function spawnNextWildSoon() { window._wildCountdown = 3 + Math.floor(Math.random() * 3); SimCertState.saveState(); }

function onPracticeCorrect() {
    captureProgress++;
    updateCaptureUI();
    if (captureProgress >= CAPTURE_REQUIRED) catchPokemon();
    else SimCertState.saveState();
}

function onPracticeWrong() {
    if (!window._practiceWrongCount) window._practiceWrongCount = 0;
    window._practiceWrongCount++;
    if (window._practiceWrongCount >= 2 && wildPokemon) pokemonEscape();
    else SimCertState.saveState();
}

function pokemonEscape() {
    const name = wildPokemon ? wildPokemon.name : '???';
    document.getElementById('wild-flee-msg').textContent = `¡${name.toUpperCase()} huyó!`;
    document.getElementById('wild-flee-msg').classList.remove('hidden');
    document.getElementById('wild-sprite').classList.add('pokeball-throw');
    playSoundFlee();
    showToast(`😢 ¡${name} escapó!\nResponde bien para la próxima.`);
    wildPokemon = null; captureProgress = 0; window._practiceWrongCount = 0;
    updateCaptureUI();
    setTimeout(() => { document.getElementById('wild-overlay').classList.add('hidden'); spawnNextWildSoon(); }, 1200);
}

function catchPokemon() {
    const p = wildPokemon;
    document.getElementById('wild-title').textContent = '¡Pokémon capturado!';
    document.getElementById('wild-sprite').style.animation = 'flashWhite .5s ease 3, pokeBounce 1s ease infinite';
    playSoundCapture();
    addCaughtPokemon(p);
    showToast(`⭐ ¡${p.name.toUpperCase()} capturado!\n+50 XP`, 3500);
    awardXP(50);
    checkMedal('pokemon_caught_10'); checkMedal('pokemon_caught_50');
    wildPokemon = null; captureProgress = 0; window._practiceWrongCount = 0;
    setTimeout(() => { document.getElementById('wild-overlay').classList.add('hidden'); spawnNextWildSoon(); }, 2500);
}

function getCaughtPokemon() {
    const u = getCurrentUser();
    const all = JSON.parse(localStorage.getItem('poke_caught') || '{}');
    return all[u] || [];
}

function addCaughtPokemon(p) {
    const u = getCurrentUser();
    const all = JSON.parse(localStorage.getItem('poke_caught') || '{}');
    if (!all[u]) all[u] = [];
    if (!all[u].find(c => c.id === p.id)) all[u].push({ id: p.id, name: p.name, types: p.types });
    localStorage.setItem('poke_caught', JSON.stringify(all));
}

function showPokedexScreen() {
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('pokedex-screen').classList.remove('hidden');
    renderPokedex();
}

function closePokedexScreen() {
    document.getElementById('pokedex-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
}

function renderPokedex() {
    const caught = getCaughtPokemon();
    const coll = document.getElementById('pokemon-collection');
    if (!coll) return;
    coll.innerHTML = '';
    document.getElementById('pokedex-count-label').textContent = `${caught.length} / 151 capturados`;
    for (let i = 1; i <= 151; i++) {
        const found = caught.find(c => c.id === i);
        const card = document.createElement('div');
        if (found) {
            card.className = 'pokemon-card'; card.title = `${found.name} (${found.types.join('/')})`;
            card.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png" alt="${found.name}"><div class="poke-num">#${String(i).padStart(3, '0')}</div><div class="poke-name">${found.name.toUpperCase()}</div>`;
        } else {
            card.className = 'pokemon-card empty'; card.title = `#${i} — Sin capturar`;
            card.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png" alt="???" style="filter:brightness(0)"><div class="poke-num">#${String(i).padStart(3, '0')}</div><div class="poke-name">???</div>`;
        }
        coll.appendChild(card);
    }
}

// ==================================================================
// 9. NAVEGACIÓN Y EFECTOS VISUALES
// ==================================================================
function handleScreenTransition(cb) {
    const overlay = document.getElementById('transition-overlay');
    if (!overlay) return cb();
    overlay.style.display = 'block';
    setTimeout(() => { overlay.style.opacity = '1'; }, 10);
    setTimeout(() => { cb(); overlay.style.opacity = '0'; setTimeout(() => { overlay.style.display = 'none'; }, 250); }, 300);
}

function confirmQuitGame() {
    if (confirm('¿Abandonar la batalla y volver a Pueblo Paleta?')) {
        handleScreenTransition(() => {
            clearInterval(timerInterval);
            SimCertState.clearSession();
            ExamMap.setVisible(false);
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('wild-overlay').classList.add('hidden');
            document.getElementById('setup-screen').classList.remove('hidden');
            updateErrorQuizButtonStatus(); renderMedals();
        });
    }
}

function typeWriterEffect(element, text, speed = 12, onDone) {
    element.innerHTML = ''; let i = 0;
    clearInterval(window.typeWriterInterval);
    const cursor = document.createElement('span'); cursor.className = 'tw-cursor'; cursor.textContent = '▶';
    element.appendChild(cursor);
    window.typeWriterInterval = setInterval(() => {
        if (i < text.length) {
            element.insertBefore(document.createTextNode(text.charAt(i)), cursor); i++;
        } else {
            clearInterval(window.typeWriterInterval); cursor.remove();
            if (onDone) onDone();
        }
    }, speed);
}

// ==================================================================
// 10. CARGADORES DE TRIVIA COMPLEMENTARIOS
// ==================================================================
function selectDifficulty(level, el) {
    selectedConfig = difficulties[level];
    document.querySelectorAll('.btn-diff').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    SimCertState.saveState();
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getErrorQuestions() {
    const metrics = JSON.parse(localStorage.getItem('aws_sim_metrics')) || {};
    return masterQuestionBank.filter(q => {
        const key = `${q.sourceExam || 'Desconocido'}_${q.questionId || 'sin_id'}`;
        const item = metrics[key];
        if (item) {
            const t = item.correctCount + item.incorrectCount;
            if (t > 0) return (item.correctCount / t) * 100 < 70;
        }
        return false;
    });
}

function updateErrorQuizButtonStatus() {
    const btn = document.getElementById('error-quiz-btn');
    if (!btn) return;
    if (masterQuestionBank.length === 0) { btn.classList.add('hidden'); btn.disabled = true; return; }
    const eq = getErrorQuestions(); btn.classList.remove('hidden');
    if (eq.length > 0) { btn.disabled = false; btn.innerText = `💀 REVANCHA — Pokémon Debilitados (${Math.min(15, eq.length)} disponibles)`; }
    else { btn.disabled = true; btn.innerText = '💀 REVANCHA — Todo en orden en el Centro Pokémon'; }
}

// ==================================================================
// 10B. MÓDULO MAPA DE PREGUNTAS — LIGA POKÉMON
// ==================================================================
const ExamMap = {
    /** Renderiza ambas versiones (side panel + inline) del mapa */
    render() {
        if (!isExamMode) return;
        const total = activeQuestionBank.length;

        // Contadores resumen
        const answeredCount = Object.keys(examUserAnswers).filter(k => examUserAnswers[k] && examUserAnswers[k].length > 0).length;
        const remaining = total - answeredCount;
        const currentNum = currentQuestionIndex + 1;

        // Actualizar contadores en ambas versiones
        ['', '-il'].forEach(suffix => {
            const ac = document.getElementById(`map-answered-count${suffix}`);
            const rc = document.getElementById(`map-remaining-count${suffix}`);
            const cn = document.getElementById(`map-current-num${suffix}`);
            if (ac) ac.textContent = answeredCount;
            if (rc) rc.textContent = remaining;
            if (cn) cn.textContent = currentNum;
        });

        // Generar celdas para ambos grids
        ['exam-map-grid-side', 'exam-map-grid-inline'].forEach(gridId => {
            const grid = document.getElementById(gridId);
            if (!grid) return;
            grid.innerHTML = '';

            for (let i = 0; i < total; i++) {
                const cell = document.createElement('button');
                cell.className = 'map-cell';
                cell.title = `Pregunta ${i + 1}`;
                cell.textContent = i + 1;
                cell.setAttribute('aria-label', `Ir a pregunta ${i + 1}`);

                const hasAnswer = examUserAnswers[i] && examUserAnswers[i].length > 0;

                if (i === currentQuestionIndex) {
                    cell.classList.add('map-current');
                } else if (hasAnswer) {
                    cell.classList.add('map-answered');
                } else {
                    cell.classList.add('map-empty');
                }

                // Navegar directo a la pregunta al hacer click
                cell.addEventListener('click', () => {
                    if (i !== currentQuestionIndex) {
                        currentQuestionIndex = i;
                        showQuestion();
                    }
                });

                grid.appendChild(cell);
            }
        });
    },

    /** Muestra u oculta el mapa según el modo de juego activo */
    setVisible(visible) {
        const sidePanel = document.getElementById('exam-question-map');
        const toggleBtn = document.getElementById('exam-map-toggle-btn');
        const inlineMap = document.getElementById('exam-map-inline');

        if (!sidePanel) return;

        const isDesktop = window.innerWidth > 1100;

        if (visible) {
            if (isDesktop) {
                sidePanel.style.display = 'block';
                if (toggleBtn) toggleBtn.style.display = 'none';
                if (inlineMap) inlineMap.classList.add('hidden');
            } else {
                sidePanel.style.display = 'none';
                if (toggleBtn) toggleBtn.style.display = 'block';
                // inlineMap comienza oculto hasta que el usuario lo abre
            }
        } else {
            sidePanel.style.display = 'none';
            if (toggleBtn) toggleBtn.style.display = 'none';
            if (inlineMap) inlineMap.classList.add('hidden');
        }
    },

    /** Toggle del mapa inline en mobile/tablet */
    toggleInline() {
        const inlineMap = document.getElementById('exam-map-inline');
        const btn = document.getElementById('exam-map-toggle-btn');
        if (!inlineMap) return;

        const isHidden = inlineMap.classList.contains('hidden');
        inlineMap.classList.toggle('hidden', !isHidden);
        if (btn) btn.textContent = isHidden
            ? '🗺️ MAPA DE RUTA — CERRAR ▲'
            : '🗺️ MAPA DE RUTA — VER PREGUNTAS ▼';

        if (isHidden) ExamMap.render(); // Renderizar al abrir
    }
};

// ==================================================================
// 11. MOTOR PRINCIPAL DE JUEGO Y FLUJO DE LOGICA
// ==================================================================
function startGame(mode) {
    isExamMode = (mode === 'exam'); isErrorMode = (mode === 'errors'); isPracticeMode = (mode === 'practice');
    examUserAnswers = {}; examQuestionsOrder = [];
    noDeathThisRound = true; maxStreakThisRound = 0; streak = 0;
    document.getElementById('streak-display').textContent = '';
    if (document.getElementById('results-medal-earned')) document.getElementById('results-medal-earned').classList.add('hidden');
    window._practiceWrongCount = 0;

    if (isExamMode) {
        let sh = shuffleArray([...masterQuestionBank]);
        activeQuestionBank = sh.slice(0, Math.min(65, sh.length));
        totalTimeAllocated = 90 * 60; timeLeft = totalTimeAllocated;
        activeQuestionBank.forEach(q => examQuestionsOrder.push(shuffleArray([...q.options])));
        document.getElementById('hud-lives-label').innerText = 'MODO:';
        document.getElementById('hud-lives').innerText = '📝 LIGA';
        ExamMap.setVisible(true);
    } else if (isErrorMode) {
        activeQuestionBank = shuffleArray([...getErrorQuestions()]).slice(0, 15);
        lives = 5; document.getElementById('hud-lives-label').innerText = 'HP:'; updateLivesUI();
    } else if (isPracticeMode) {
        activeQuestionBank = shuffleArray([...masterQuestionBank]);
        lives = 99; document.getElementById('hud-lives-label').innerText = '🌿'; document.getElementById('hud-lives').innerText = 'PRÁCTICA';
        document.getElementById('timer-bar-container').style.display = 'none';
        document.getElementById('hud-time').innerText = '∞'; window._wildCountdown = 1;
    } else {
        const metrics = JSON.parse(localStorage.getItem('aws_sim_metrics')) || {};
        let pool = [...masterQuestionBank].map(q => {
            const key = `${q.sourceExam || 'Desconocido'}_${q.questionId || 'sin_id'}`;
            return { questionData: q, appearances: metrics[key] ? (metrics[key].correctCount + metrics[key].incorrectCount) : 0 };
        });
        pool.sort((a, b) => a.appearances !== b.appearances ? a.appearances - b.appearances : Math.random() - .5);
        activeQuestionBank = pool.slice(0, Math.min(selectedConfig.questions, pool.length)).map(i => i.questionData);
        lives = selectedConfig.lives; totalTimeAllocated = selectedConfig.time;
        document.getElementById('hud-lives-label').innerText = 'HP:'; updateLivesUI();
    }
    if (!isExamMode) ExamMap.setVisible(false);

    currentQuestionIndex = 0; score = 0;
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    if (!isPracticeMode) document.getElementById('timer-bar-container').style.display = '';

    if (isExamMode) { clearInterval(timerInterval); timerInterval = setInterval(updateGlobalExamTimer, 1000); updateTimerUI(); }
    
    const pBar = document.getElementById('practice-progress-bar');
    if (pBar) pBar.classList.toggle('hidden', !isPracticeMode);
    if (document.getElementById('hint-btn')) document.getElementById('hint-btn').disabled = isExamMode;

    playSoundStart(); showQuestion();
}

function showQuestion() {
    document.getElementById('explanation-container').classList.add('hidden');
    document.getElementById('notes-container').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('confirm-btn').classList.add('hidden');
    document.getElementById('prev-btn').classList.add('hidden');

    if (isPracticeMode && currentQuestionIndex >= activeQuestionBank.length) {
        activeQuestionBank = shuffleArray([...masterQuestionBank]); currentQuestionIndex = 0;
    }

    if (activeQuestionBank.length === 0) {
        showToast('⚠️ Error: No hay preguntas cargadas en el mazo activo.');
        confirmQuitGame(); return;
    }

    const qData = activeQuestionBank[currentQuestionIndex];
    typeWriterEffect(document.getElementById('question-text'), qData.question);

    isMultiSelect = Array.isArray(qData.correctAnswer);
    targetAnswersCount = isMultiSelect ? qData.correctAnswer.length : 1;
    userSelectedOptions = examUserAnswers[currentQuestionIndex] || [];

    const badgeCont = document.getElementById('badge-container');
    if (badgeCont) {
        badgeCont.innerHTML = '';
        if (isMultiSelect) {
            const b = document.createElement('span'); b.className = 'multi-indicator';
            b.innerText = `⚠️ MOVIMIENTO COMBINADO — Selecciona exactamente ${targetAnswersCount}`;
            badgeCont.appendChild(b);
        }
    }

    document.getElementById('hud-progress').innerText = `${currentQuestionIndex + 1}/${isPracticeMode ? '∞' : activeQuestionBank.length}`;

    if (isPracticeMode && wildPokemon) {
        const pgb = document.getElementById('practice-progress-bar');
        if (pgb) pgb.textContent = `🎯 CAPTURA: ${captureProgress}/${CAPTURE_REQUIRED} — ${wildPokemon.name.toUpperCase()}`;
    }

    let curOptions = examQuestionsOrder[currentQuestionIndex] || shuffleArray([...qData.options]);
    if (!examQuestionsOrder[currentQuestionIndex]) examQuestionsOrder[currentQuestionIndex] = curOptions;

    const optsContainer = document.getElementById('options-container');
    optsContainer.innerHTML = '';
    curOptions.forEach(opt => {
        const btn = document.createElement('button'); btn.className = 'option-btn'; btn.innerText = opt;
        if (userSelectedOptions.includes(opt)) btn.classList.add('selected-state');
        btn.onclick = () => handleOptionClick(btn, opt);
        optsContainer.appendChild(btn);
    });

    const hintBtn = document.getElementById('hint-btn'), hintBox = document.getElementById('hint-box');
    if (hintBtn) hintBtn.disabled = isExamMode;
    if (hintBox) { hintBox.classList.add('hidden'); hintBox.textContent = ''; }

    if (!isExamMode && !isPracticeMode) {
        const tl = qData.question.length + qData.options.reduce((s, o) => s + o.length, 0);
        totalTimeAllocated = Math.ceil(tl * (isErrorMode ? 0.2 : selectedConfig.multiplier)); timeLeft = totalTimeAllocated;
        document.getElementById('hud-time').innerText = `${timeLeft}s`;
        const bar = document.getElementById('timer-bar');
        bar.style.width = '100%'; bar.style.backgroundColor = 'var(--poke-green)';
        clearInterval(timerInterval); timerInterval = setInterval(updateTriviaTimer, 1000);
    } else if (isExamMode) {
        if (currentQuestionIndex > 0) document.getElementById('prev-btn').classList.remove('hidden');
        const nb = document.getElementById('next-btn');
        nb.innerText = currentQuestionIndex === activeQuestionBank.length - 1 ? 'FINALIZAR LIGA' : 'SIGUIENTE BATALLA ▶';
        nb.classList.remove('hidden');
    }

    if (isPracticeMode && !wildPokemon) {
        if (!window._wildCountdown || window._wildCountdown <= 0) spawnWildPokemon();
        else window._wildCountdown--;
    }

    updateXpBar();
    if (isExamMode) ExamMap.render();
    SimCertState.saveState();
}

// ==================================================================
// 12. GESTION DE TIMERS DE COMBATE
// ==================================================================
function updateTriviaTimer() {
    timeLeft--; document.getElementById('hud-time').innerText = `${timeLeft}s`;
    const pct = (timeLeft / totalTimeAllocated) * 100;
    const bar = document.getElementById('timer-bar');
    if (bar) {
        bar.style.width = `${pct}%`;
        bar.style.backgroundColor = pct > 50 ? 'var(--poke-green)' : (pct > 20 ? 'var(--poke-yellow)' : 'var(--poke-red)');
    }
    if (timeLeft <= 0) {
        clearInterval(timerInterval); noDeathThisRound = false; lives--;
        updateLivesUI(); processTriviaEvaluation(true);
    }
}

function updateGlobalExamTimer() {
    timeLeft--; updateTimerUI();
    if (timeLeft <= 0) { clearInterval(timerInterval); alert('¡El tiempo en la Liga Pokémon ha terminado!'); endGame(); }
}

function updateTimerUI() {
    let m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    document.getElementById('hud-time').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
    const bar = document.getElementById('timer-bar');
    if (bar) bar.style.width = `${(timeLeft / totalTimeAllocated) * 100}%`;
}

// ==================================================================
// 13. MANEJADORES DE RESPUESTAS E INTERACCIONES
// ==================================================================
function handleOptionClick(button, option) {
    if (!isExamMode) {
        if (!isMultiSelect) {
            clearInterval(timerInterval); userSelectedOptions.push(option);
            button.classList.add('selected-state'); processTriviaEvaluation(false);
        } else {
            if (userSelectedOptions.includes(option)) {
                userSelectedOptions = userSelectedOptions.filter(i => i !== option); button.classList.remove('selected-state');
            } else if (userSelectedOptions.length < targetAnswersCount) {
                userSelectedOptions.push(option); button.classList.add('selected-state');
            }
            const cb = document.getElementById('confirm-btn');
            if (cb) cb.classList.toggle('hidden', userSelectedOptions.length !== targetAnswersCount);
        }
    } else {
        if (userSelectedOptions.includes(option)) {
            userSelectedOptions = userSelectedOptions.filter(i => i !== option); button.classList.remove('selected-state');
        } else {
            if (!isMultiSelect) {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected-state'));
                userSelectedOptions = [option]; button.classList.add('selected-state');
            } else if (userSelectedOptions.length < targetAnswersCount) {
                userSelectedOptions.push(option); button.classList.add('selected-state');
            }
        }
        examUserAnswers[currentQuestionIndex] = userSelectedOptions;
    }
    SimCertState.saveState();
}

function confirmMultiAnswer() {
    clearInterval(timerInterval);
    if (document.getElementById('confirm-btn')) document.getElementById('confirm-btn').classList.add('hidden');
    processTriviaEvaluation(false);
}

function trackQuestionStats(qData, isCorrect) {
    const src = qData.sourceExam || 'Desconocido', qId = qData.questionId || 'sin_id';
    const key = `${src}_${qId}`;
    let ls = JSON.parse(localStorage.getItem('aws_sim_metrics')) || {};
    if (!ls[key]) ls[key] = { sourceExam: src, questionId: qId, questionText: qData.question, correctCount: 0, incorrectCount: 0 };
    if (isCorrect) ls[key].correctCount++; else ls[key].incorrectCount++;
    localStorage.setItem('aws_sim_metrics', JSON.stringify(ls));
}

function processTriviaEvaluation(timeout) {
    const qData = activeQuestionBank[currentQuestionIndex];
    const answers = isMultiSelect ? qData.correctAnswer : [qData.correctAnswer];
    const hasAllCorrect = userSelectedOptions.every(o => answers.includes(o));
    const hasExactLen = userSelectedOptions.length === answers.length;
    let isCorrect = hasAllCorrect && hasExactLen && !timeout;

    if (!isPracticeMode) {
        if (isCorrect) score++;
        else if (!timeout) { noDeathThisRound = false; lives--; updateLivesUI(); }
        updateStreak(isCorrect);
        if (!isCorrect && !timeout) awardXP(-5);
    } else {
        if (isCorrect) { score++; onPracticeCorrect(); window._practiceWrongCount = 0; updateStreak(true); }
        else if (!timeout) { onPracticeWrong(); updateStreak(false); }
    }

    trackQuestionStats(qData, isCorrect);
    if (isCorrect) playSoundCorrect(); else playSoundIncorrect();

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true; const txt = btn.innerText;
        if (answers.includes(txt)) btn.className = 'option-btn correct';
        else if (userSelectedOptions.includes(txt)) btn.className = 'option-btn incorrect';
    });

    if (qData.explanation) {
        let loreHTML = ''; const srch = (qData.question + ' ' + qData.explanation).toLowerCase();
        for (let k in pokeLore) {
            if (srch.includes(k)) { loreHTML = `<span class="lore-pill">💡 <strong>${pokeLore[k].name}:</strong> ${pokeLore[k].desc}</span>`; break; }
        }
        document.getElementById('explanation-container').classList.remove('hidden');
        document.getElementById('explanation-text').innerHTML = loreHTML;
        document.getElementById('explanation-text').appendChild(document.createTextNode(qData.explanation));
    }

    if (isErrorMode) showNotesSection(qData);
    if (document.getElementById('hint-btn')) document.getElementById('hint-btn').disabled = true;

    const nb = document.getElementById('next-btn');
    if (nb) {
        nb.innerText = isPracticeMode ? 'SIGUIENTE ENCUENTRO ▶' : ((lives <= 0 || currentQuestionIndex === activeQuestionBank.length - 1) ? 'VER RESULTADOS' : 'SIGUIENTE BATALLA ▶');
        nb.classList.remove('hidden');
    }
    SimCertState.saveState();
}

// ==================================================================
// 14. NAVEGACIÓN ENTRE PREGUNTAS Y TERMINACIÓN DE EVENTOS
// ==================================================================
function nextQuestion() {
    if (isPracticeMode) { currentQuestionIndex++; showQuestion(); return; }
    if (!isExamMode) {
        if (lives <= 0 || currentQuestionIndex === activeQuestionBank.length - 1) endGame();
        else { currentQuestionIndex++; showQuestion(); }
    } else {
        if (currentQuestionIndex === activeQuestionBank.length - 1) {
            if (confirm('¿Finalizar tu participación en la Liga Pokémon?')) endGame();
        } else { currentQuestionIndex++; showQuestion(); }
    }
}

function prevQuestion() { if (isExamMode && currentQuestionIndex > 0) { currentQuestionIndex--; showQuestion(); } }

function endGame() {
    clearInterval(timerInterval);
    ExamMap.setVisible(false);
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('wild-overlay').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    document.querySelector('.timer-bar-container').style.display = '';  

    let totalQ = activeQuestionBank.length;
    if (isExamMode) {
        score = 0;
        activeQuestionBank.forEach((qData, idx) => {
            let ua = examUserAnswers[idx] || [];
            if (ua.length > 0) {
                let ca = Array.isArray(qData.correctAnswer) ? qData.correctAnswer : [qData.correctAnswer];
                if (ua.every(o => ca.includes(o)) && ua.length === ca.length) { score++; trackQuestionStats(qData, true); }
                else trackQuestionStats(qData, false);
            }
        });
    }

    const pct = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
    document.getElementById('results-score').innerText = `${score} / ${totalQ}`;
    document.getElementById('results-percentage').innerText = `${pct}% DE ALCANCE`;

    renderStars(pct);
    const msgEl = document.getElementById('results-message'), rs = document.getElementById('results-screen');
    rs.style.animation = 'none';

    if (pct >= 90) { rs.style.animation = 'bounce .5s ease infinite'; msgEl.innerHTML = '🏆 <strong style="color:var(--poke-yellow)">¡ERES EL MEJOR QUE JAMÁS HUBO!</strong><br>Has conquistado la cima, Maestro Cloud.'; }
    else if (pct >= 70) { rs.style.animation = 'bounce .6s ease 2'; msgEl.innerHTML = '⚡ <strong style="color:#64DD17">¡POKÉMON ENEMIGO DERROTADO!</strong><br>Buen trabajo. Certificación a tu alcance.'; }
    else if (pct >= 50) { rs.style.animation = 'shake .4s ease'; msgEl.innerHTML = '😤 <strong style="color:var(--poke-yellow)">¡CASI TRIUNFAS!</strong><br>Entrena más en el Centro Pokémon.'; }
    else { rs.style.animation = 'shake .3s ease 2'; msgEl.innerHTML = '💀 <strong style="color:var(--poke-red)">TUS POKÉMON SE HAN DEBILITADO.</strong><br>¡No te rindas! Reorganiza tu mochila.'; }

    const bonus = pct >= 90 ? 50 : (pct >= 70 ? 30 : (pct >= 50 ? 10 : 0));
    if (bonus > 0) { awardXP(bonus); showToast(`🏆 +${bonus} XP por completar la ronda!`); }

    if (noDeathThisRound && !isPracticeMode) checkNodeathMedal(isExamMode ? 'exam' : (isErrorMode ? 'errors' : 'trivia'));
    checkMedal('streak_10'); renderMedals(); updateXpBar();
    SimCertState.clearSession(); // Limpieza del estado temporal al terminar el juego con éxito
}

function renderStars(pct) {
    const row = document.getElementById('stars-row'); if (!row) return; row.innerHTML = '';
    const n = pct >= 90 ? 3 : (pct >= 70 ? 2 : (pct >= 50 ? 1 : 0));
    for (let i = 0; i < 3; i++) {
        const s = document.createElement('span'); s.className = 'star-icon';
        s.textContent = i < n ? '⭐' : '☆'; s.style.animationDelay = `${i * .2}s`; row.appendChild(s);
    }
}

// ==================================================================
// 15. PANEL DE ESTADÍSTICAS E HISTORIAL
// ==================================================================
function showStatsPanel() {
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('stats-screen').classList.remove('hidden');
    const metrics = JSON.parse(localStorage.getItem('aws_sim_metrics')) || {};
    const tbody = document.getElementById('stats-table-body'); if (!tbody) return; tbody.innerHTML = '';
    let list = Object.values(metrics);
    document.getElementById('total-distinct-count').innerText = list.length;
    list.sort((a, b) => {
        let ra = a.correctCount / (a.correctCount + a.incorrectCount), rb = b.correctCount / (b.correctCount + b.incorrectCount);
        return ra !== rb ? ra - rb : b.incorrectCount - a.incorrectCount;
    });
    if (list.length === 0) { tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-muted);">Sin registros. Entra en combate primero.</td></tr>`; return; }
    list.forEach(item => {
        let tot = item.correctCount + item.incorrectCount; let pct = Math.round((item.correctCount / tot) * 100);
        let col = pct >= 80 ? '#64DD17' : (pct >= 50 ? 'var(--poke-yellow)' : 'var(--poke-red)');
        let row = document.createElement('tr');
        row.innerHTML = `<td>Nivel ${item.sourceExam}</td><td style="font-family:monospace;color:var(--poke-yellow);font-weight:bold;">${item.questionId}</td><td style="max-width:230px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${item.questionText}">${item.questionText}</td><td style="text-align:center;color:#64DD17;font-weight:bold;">${item.correctCount}</td><td style="text-align:center;color:var(--poke-red);font-weight:bold;">${item.incorrectCount}</td><td style="text-align:center;font-weight:bold;color:${col}">${pct}%</td>`;
        tbody.appendChild(row);
    });
}

function closeStatsPanel() {
    document.getElementById('stats-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
    updateErrorQuizButtonStatus(); renderMedals();
}

function clearLocalStorageStats() {
    if (confirm('¿Borrar tu Pokédex de combate? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('aws_sim_metrics'); showStatsPanel(); updateErrorQuizButtonStatus();
    }
}

function updateLivesUI() {
    if (isPracticeMode) return;
    let hs = ''; for (let i = 0; i < lives; i++) hs += '❤️';
    const max = isErrorMode ? 5 : selectedConfig.lives;
    for (let i = lives; i < max; i++) hs += '🖤';
    document.getElementById('hud-lives').innerText = hs || '💀 DEBILITADO';
}

function resetGame() {
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
    updateErrorQuizButtonStatus(); renderMedals();
}

function useHint() {
    const qData = activeQuestionBank[currentQuestionIndex]; if (!qData) return;
    const btn = document.getElementById('hint-btn'), box = document.getElementById('hint-box');
    const answers = isMultiSelect ? qData.correctAnswer : [qData.correctAnswer];
    const wrongBtns = [...document.querySelectorAll('.option-btn:not(:disabled)')].filter(b => !answers.some(a => b.innerText.includes(a)));
    if (wrongBtns.length > 0) {
        const rm = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];
        rm.style.opacity = '.3'; rm.disabled = true; rm.style.textDecoration = 'line-through';
    }
    awardXP(-10); if (btn) btn.disabled = true;
    if (box) {
        box.classList.remove('hidden');
        const hints = [
            "💡 Piensa en qué servicio AWS te libera de gestionar infraestructura.",
            "💡 Recuerda la diferencia entre IaaS, PaaS y SaaS.",
            "💡 ¿El servicio es regional o global? Eso suele ser clave.",
            "💡 Piensa en cuál opción tiene la menor responsabilidad del cliente.",
            "💡 Si es 'managed', AWS gestiona el hardware por ti.",
            "💡 EC2 = tú gestionas; Lambda = AWS gestiona. ¿Cuál aplica?",
            "💡 S3 es para objetos, EBS para bloques, EFS para archivos.",
            "💡 Recuerda: el Modelo de Responsabilidad Compartida divide tareas."
        ];
        box.textContent = hints[Math.floor(Math.random() * hints.length)];
    }
    playTone([523, 440], 80); SimCertState.saveState();
}

// ==================================================================
// 16. SISTEMA DE ANOTACIONES TÁCTICAS
// ==================================================================
function showNotesSection(qData) {
    document.getElementById('notes-container').classList.remove('hidden');
    const cu = getCurrentUser(), src = qData.sourceExam || 'Desconocido', qId = qData.questionId || 'sin_id';
    const metrics = JSON.parse(localStorage.getItem('aws_sim_metrics')) || {};
    const item = metrics[`${src}_${qId}`] || {};
    let allNotes = item.notes ? { ...item.notes } : {};
    if (item.note) { allNotes['Mi Nota Antigua'] = item.note; }
    
    const disp = document.getElementById('note-text-display'); if (!disp) return; disp.innerHTML = '';
    const valid = Object.keys(allNotes).filter(u => allNotes[u] && allNotes[u].trim() !== '');
    if (valid.length === 0) { disp.innerHTML = '<span style="font-style:italic;color:var(--text-muted);">Sin notas estratégicas registradas.</span>'; }
    else {
        valid.forEach(u => {
            const isMe = (u === cu); const d = document.createElement('div');
            d.style.cssText = `margin-bottom:10px;padding:10px;border-radius:4px;background:${isMe ? 'var(--poke-sky)' : '#1C1C1C'};border-left:${isMe ? '4px solid var(--poke-yellow)' : '4px solid var(--poke-red)'};`;
            d.innerHTML = `<strong style="color:var(--poke-yellow);font-size:.85rem;">👤 ${u} ${isMe ? '(Tú)' : ''}:</strong><p style="color:white;margin:4px 0 0;white-space:pre-line;font-size:1rem;">${allNotes[u]}</p>`;
            disp.appendChild(d);
        });
    }
    document.getElementById('note-textarea').value = allNotes[cu] || '';
    toggleNoteEdit(false);
}

function toggleNoteEdit(isEdit) {
    document.getElementById('note-display-mode').classList.toggle('hidden', isEdit);
    document.getElementById('note-edit-mode').classList.toggle('hidden', !isEdit);
    if (isEdit) document.getElementById('note-textarea').focus();
}

function saveQuestionNote() {
    const cu = getCurrentUser(), qData = activeQuestionBank[currentQuestionIndex];
    const src = qData.sourceExam || 'Desconocido', qId = qData.questionId || 'sin_id', key = `${src}_${qId}`;
    const noteText = document.getElementById('note-textarea').value;
    let metrics = JSON.parse(localStorage.getItem('aws_sim_metrics')) || {};
    if (!metrics[key]) metrics[key] = { sourceExam: src, questionId: qId, questionText: qData.question, correctCount: 0, incorrectCount: 0 };
    if (!metrics[key].notes) { metrics[key].notes = {}; }
    if (noteText.trim() === '') delete metrics[key].notes[cu]; else metrics[key].notes[cu] = noteText;
    localStorage.setItem('aws_sim_metrics', JSON.stringify(metrics));
    showNotesSection(qData);
}

function exportMyNotes() {
    const cu = getCurrentUser(), metrics = JSON.parse(localStorage.getItem('aws_sim_metrics')) || {};
    let exp = { username: cu, notes: {} };
    Object.keys(metrics).forEach(k => { const it = metrics[k]; if (it.notes && it.notes[cu]) exp.notes[k] = { sourceExam: it.sourceExam, questionId: it.questionId, questionText: it.questionText, text: it.notes[cu] }; });
    if (Object.keys(exp.notes).length === 0) { alert('No tienes tácticas guardadas para exportar.'); return; }
    const a = document.createElement('a'); a.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exp, null, 2)));
    a.setAttribute('download', `pokedex_notas_${cu.replace(/\s+/g, '_')}.json`); document.body.appendChild(a); a.click(); a.remove();
}

async function importNotesFromFolder(event) {
    const files = Array.from(event.target.files).filter(f => f.name.toLowerCase().endsWith('.json'));
    if (files.length === 0) { alert('No se encontraron archivos .json válidos.'); event.target.value = ''; return; }
    let metrics = JSON.parse(localStorage.getItem('aws_sim_metrics')) || {};
    let totalU = 0, totalN = 0, users = [];
    await Promise.all(files.map(file => new Promise(resolve => {
        const r = new FileReader();
        r.onload = e => {
            try {
                const d = JSON.parse(e.target.result);
                if (d.username && d.notes) {
                    const u = d.username; if (!users.includes(u)) { users.push(u); totalU++; }
                    Object.keys(d.notes).forEach(k => {
                        const n = d.notes[k];
                        if (!metrics[k]) metrics[k] = { sourceExam: n.sourceExam || 'Desconocido', questionId: n.questionId || 'sin_id', questionText: n.questionText || '', correctCount: 0, incorrectCount: 0 };
                        if (!metrics[k].notes) metrics[k].notes = {}; metrics[k].notes[u] = n.text; totalN++;
                    });
                }
            } catch (err) { console.error(`Error de parseo en: ${file.name}`, err); }
            resolve();
        }; r.readAsText(file);
    })));
    localStorage.setItem('aws_sim_metrics', JSON.stringify(metrics));
    alert(totalN > 0 ? `¡Pokédex sincronizada!\n• Archivos: ${files.length}\n• Notas: ${totalN}\n• Entrenadores: ${totalU} (${users.join(', ')})` : 'Sincronización vacía.');
    event.target.value = '';
}

function showDailyTip() {
    const today = new Date().toDateString(), last = localStorage.getItem('poke_tip_day');
    if (last === today) return;
    localStorage.setItem('poke_tip_day', today);
    const tip = dailyTips[new Date().getDate() % dailyTips.length];
    setTimeout(() => showToast(`🧑‍🔬 PROF. OAK DICE:\n${tip}`, 5000), 1200);
}

// ==================================================================
// 17. MANEJADOR EXCLUSIVO DE CARGA DE ARCHIVOS JSON DE EXÁMENES
// ==================================================================
async function handleFolderUpload(e) {
    const files = e.target.files; masterQuestionBank = []; let loadedFilesCount = 0;
    const uploadTextEl = document.getElementById('upload-text');
    if (uploadTextEl) uploadTextEl.innerText = "Cargando Pokédex... ████████░░░░ 65%";
    
    for (let file of files) {
        if (file.name.endsWith('.json') && !file.name.startsWith('pokedex_notas_')) {
            try {
                const text = await file.text(); const data = JSON.parse(text);
                const examId = file.name.replace('.json', '');
                const proc = item => { item.sourceExam = examId; return item; };
                if (Array.isArray(data)) masterQuestionBank.push(...data.map(proc));
                else if (typeof data === 'object' && data !== null) masterQuestionBank.push(proc(data));
                loadedFilesCount++;
            } catch (err) { console.error(`Error en archivo ${file.name}:`, err); }
        }
    }
    if (masterQuestionBank.length > 0) {
        if (uploadTextEl) uploadTextEl.innerText = '🎒 MOCHILA CONTRATADA — ¡BANCO CARGADO!';
        const st = document.getElementById('status-loaded');
        if (st) { st.innerText = `¡${loadedFilesCount} módulos con ${masterQuestionBank.length} preguntas listas para el combate!`; st.classList.remove('hidden'); }
        document.getElementById('start-btn').disabled = false;
        document.getElementById('exam-start-btn').disabled = false;
        document.getElementById('practice-start-btn').disabled = false;
        updateErrorQuizButtonStatus();
    } else {
        if (uploadTextEl) uploadTextEl.innerText = '❌ Error en carga. Intenta de nuevo.';
        alert('No se encontraron archivos JSON de examen válidos.');
    }
}

// ==================================================================
// 18. CAPA ASÍNCRONA DE INICIALIZACIÓN DE REGISTROS (SERVICE WORKER)
// ==================================================================
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    console.log('[PWA Shell] Service Worker registrado bajo scope: ', reg.scope);
                    reg.addEventListener('updatefound', () => {
                        const installingWorker = reg.installing;
                        installingWorker.addEventListener('statechange', () => {
                            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showToast('🚀 ¡Actualización instalada!\nCierra y reabre la app para refrescar el App Shell.', 5000);
                            }
                        });
                    });
                })
                .catch(err => console.warn('[PWA Shell] Registro SW cancelado de forma segura:', err));
        });
    }
}

// ==================================================================
// 19. CICLO DE VIDA ORQUESTADOR (DOM CONTENT LOADED)
// ==================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar PWA Capabilities
    initServiceWorker();

    // Enlace semántico de inputs de ficheros locales
    const folderInput = document.getElementById('folder-input');
    if (folderInput) folderInput.addEventListener('change', handleFolderUpload);

    const usernameInput = document.getElementById('username-input');
    if (usernameInput) {
        usernameInput.addEventListener('input', e => {
            localStorage.setItem('aws_sim_username', e.target.value.trim());
            SimCertState.saveState();
        });
        const savedUser = localStorage.getItem('aws_sim_username');
        if (savedUser) usernameInput.value = savedUser;
    }

    // Configuración de audio UI inicial
    document.getElementById('sound-toggle').textContent = soundEnabled ? '🔊' : '🔇';

    // Inicializar Renderizadores estáticos locales
    updateXpBar();
    renderMedals();
    showDailyTip();

    // Intentar recuperar sesión persistida previa por el módulo de estado
    const wasRestored = SimCertState.loadState();
    if (wasRestored && activeQuestionBank && activeQuestionBank.length > 0) {
        setTimeout(() => {
            if (confirm('⚔️ Detectamos una simulación interrumpida de forma imprevista.\n¿Deseas restaurar la partida para no perder tus vidas actuales?')) {
                document.getElementById('setup-screen').classList.add('hidden');
                document.getElementById('game-screen').classList.remove('hidden');
                updateLivesUI();
                if (isExamMode) {
                    clearInterval(timerInterval);
                    timerInterval = setInterval(updateGlobalExamTimer, 1000);
                }
                showQuestion();
                showToast('Aventura reanudada con éxito.');
            } else {
                SimCertState.clearSession();
                updateErrorQuizButtonStatus();
            }
        }, 600);
    }
});
//Funcion para agregar los datos a la API de AWS
async function saveProgressToCloud() {
    const username = localStorage.getItem('aws_sim_username') || 'trainer_default';
    
    // Recopilamos el estado actual idéntico a tu lógica de exportación
    const progressData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('aws_sim_') || key.startsWith('poke_') || key.startsWith('pokedex_')) {
            progressData[key] = localStorage.getItem(key);
        }
    }

    try {
        const response = await fetch('https://TU-API-GATEWAY-URL.amazonaws.com/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, data: progressData })
        });
        
        if (response.ok) {
            showToast("☁️ ¡Progreso sincronizado en la nube de AWS!");
        }
    } catch (error) {
        console.error("Error al sincronizar con AWS:", error);
    }
}

// ==========================================
// COMPARTIR Y RECIBIR POKÉDEX (JSON)
// ==========================================

function exportMyNotes() {
    const pokedexData = {};
    let hasData = false;

    // Recolectar solo los datos relevantes del simulador
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('aws_sim_') || key.startsWith('poke_') || key.startsWith('pokedex_')) {
            pokedexData[key] = localStorage.getItem(key);
            hasData = true;
        }
    }

    if (!hasData) {
        alert("Tu Pokédex está vacía. ¡Juega un poco antes de compartirla!");
        return;
    }

    // Generar archivo JSON y descargarlo silenciosamente
    const jsonString = JSON.stringify(pokedexData);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "pokedex_backup.json";
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}

function importNotesFromFolder(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Inyectar los datos en el localStorage
            for (const key in importedData) {
                if (key.startsWith('aws_sim_') || key.startsWith('poke_') || key.startsWith('pokedex_')) {
                    localStorage.setItem(key, importedData[key]);
                }
            }

            alert("¡Pokédex recibida y sincronizada con éxito!");
            
            // Recargar la página para aplicar los cambios en la interfaz
            window.location.reload();
            
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            alert("Error: El archivo seleccionado no es válido.");
        }
        
        // Limpiar el input para permitir volver a cargar el mismo archivo si es necesario
        event.target.value = '';
    };

    reader.readAsText(file);
}