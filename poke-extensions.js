/**
 * poke-extensions.js — Módulo de extensiones para Cloud Trainer Adventure
 * =========================================================================
 * VERSIÓN OPTIMIZADA — sin MutationObserver global, música con visibilityAPI,
 * scheduling de audio conservador, minimap reactivo sin polling.
 */

// ══════════════════════════════════════════════════════════════════════════════
// 1. AUDIO — Música multi-pista + SFX separado
// ══════════════════════════════════════════════════════════════════════════════

let sfxEnabled   = localStorage.getItem('poke_sfx')   !== 'off';
let musicEnabled = localStorage.getItem('poke_music')  !== 'off';
let _musicAudioCtx = null;

// ── Datos musicales (constantes, no se recalculan)
const S16 = 0.09375; // 160 BPM → 1 semicorchea

const PT_CH1=[[493.88,4],[523.25,2],[587.33,4],[783.99,2],[587.33,2],[523.25,2],[493.88,4],[783.99,2],[587.33,4],[587.33,2],[523.25,2],[493.88,2],[0,2],[493.88,2],[523.25,2],[493.88,2],[523.25,8],[0,2],[493.88,2],[523.25,2],[440.0,2],[493.88,2],[392.0,2],[440.0,2],[369.99,2],[493.88,4],[523.25,2],[587.33,4],[783.99,2],[587.33,2],[523.25,2],[493.88,4],[783.99,2],[587.33,4],[587.33,2],[783.99,2],[739.99,2],[659.26,4],[587.33,2],[523.25,4],[440.0,2],[493.88,2],[523.25,2],[587.33,2],[523.25,2],[493.88,2],[440.0,2],[392.0,4],[369.99,4],[523.25,2],[392.0,2],[329.63,2],[392.0,2],[587.33,2],[440.0,2],[369.99,2],[440.0,2],[493.88,2],[392.0,2],[293.66,2],[392.0,2],[493.88,2],[392.0,2],[293.66,2],[392.0,2],[523.25,2],[392.0,2],[329.63,2],[392.0,2],[587.33,2],[440.0,2],[369.99,2],[440.0,2],[493.88,2],[392.0,2],[293.66,2],[392.0,2],[493.88,2],[392.0,2],[293.66,2],[392.0,2],[440.0,2],[329.63,2],[261.63,2],[329.63,2],[440.0,2],[329.63,2],[261.63,2],[329.63,2],[440.0,2],[329.63,2],[261.63,2],[329.63,2],[440.0,2],[329.63,2],[261.63,2],[329.63,2],[369.99,2],[293.66,2],[261.63,2],[293.66,2],[392.0,2],[329.63,2],[261.63,2],[329.63,2],[392.0,2],[329.63,2],[261.63,2],[329.63,2],[369.99,2],[293.66,2],[261.63,2],[293.66,2],[493.88,4],[523.25,2],[587.33,4],[783.99,2],[587.33,2],[523.25,2],[493.88,4],[783.99,2],[587.33,4],[587.33,2],[523.25,2],[493.88,2],[0,2],[493.88,2],[523.25,2],[493.88,2],[523.25,8],[0,2],[493.88,2],[523.25,2],[440.0,2],[493.88,2],[392.0,2],[440.0,2],[369.99,2],[493.88,4],[523.25,2],[587.33,4],[783.99,2],[587.33,2],[523.25,2],[493.88,8],[783.99,4],[739.99,4],[783.99,16]];
const PT_CH2=[[1174.66,2],[1046.5,2],[987.77,2],[880.0,2],[1567.98,2],[1318.51,2],[1479.98,2],[1318.51,2],[1174.66,6],[987.77,2],[783.99,2],[783.99,2],[880.0,2],[987.77,2],[1046.5,10],[739.99,2],[783.99,2],[880.0,2],[987.77,6],[1046.5,1],[987.77,1],[880.0,8],[1174.66,2],[1046.5,2],[987.77,2],[1174.66,2],[1567.98,2],[1479.98,2],[1479.98,2],[1567.98,2],[1318.51,6],[1174.66,2],[1174.66,8],[1046.5,2],[987.77,2],[880.0,2],[783.99,2],[1174.66,2],[1046.5,2],[987.77,2],[880.0,2],[783.99,10],[783.99,2],[880.0,2],[987.77,2],[1046.5,8],[1174.66,6],[1046.5,2],[987.77,8],[0,2],[783.99,2],[880.0,2],[987.77,2],[1046.5,4],[1046.5,4],[1174.66,6],[1046.5,1],[1174.66,1],[987.77,8],[0,2],[987.77,2],[880.0,2],[783.99,2],[880.0,8],[659.26,4],[987.77,4],[880.0,8],[783.99,4],[659.26,4],[739.99,8],[783.99,4],[987.77,4],[987.77,8],[880.0,8],[1174.66,2],[1046.5,2],[987.77,2],[880.0,2],[1567.98,2],[1318.51,2],[1479.98,2],[1318.51,2],[1174.66,6],[987.77,2],[783.99,2],[783.99,2],[880.0,2],[987.77,2],[1046.5,10],[739.99,2],[783.99,2],[880.0,2],[987.77,6],[1046.5,1],[987.77,1],[880.0,8],[1174.66,2],[1046.5,2],[987.77,2],[1174.66,2],[1567.98,2],[1479.98,2],[1479.98,2],[1567.98,2],[1318.51,8],[1174.66,4],[987.77,4],[783.99,16]];
const PT_CH3=[[783.99,6],[659.26,6],[739.99,4],[783.99,6],[880.0,6],[783.99,4],[659.26,6],[739.99,6],[659.26,4],[783.99,6],[659.26,6],[587.33,4],[783.99,6],[659.26,6],[739.99,4],[783.99,6],[880.0,6],[783.99,4],[659.26,6],[739.99,6],[880.0,4],[783.99,6],[659.26,6],[587.33,4],[523.25,8],[587.33,8],[783.99,8],[659.26,4],[587.33,4],[523.25,8],[587.33,8],[783.99,8],[880.0,4],[783.99,4],[659.26,8],[880.0,8],[659.26,8],[783.99,8],[739.99,8],[659.26,8],[659.26,8],[739.99,8],[261.63,16],[293.66,16],[392.0,16],[293.66,16],[440.0,16],[440.0,16],[293.66,16],[293.66,16],[783.99,6],[659.26,6],[739.99,4],[783.99,6],[880.0,6],[783.99,4],[659.26,6],[739.99,6],[659.26,4],[783.99,6],[659.26,6],[587.33,4],[783.99,6],[659.26,6],[739.99,4],[783.99,6],[880.0,6],[783.99,4],[392.0,16]];

const RT_CH1=[[659.25,4],[783.99,4],[880.0,4],[1046.5,4],[987.77,4],[880.0,4],[783.99,4],[659.25,4],[698.46,4],[880.0,4],[932.33,4],[1046.5,4],[1174.66,4],[1046.5,4],[932.33,4],[698.46,4],[659.25,4],[783.99,4],[880.0,4],[1046.5,4],[987.77,4],[880.0,4],[783.99,4],[659.25,4],[523.25,4],[659.25,4],[783.99,4],[880.0,4],[783.99,8],[0,8],[783.99,4],[880.0,4],[987.77,4],[1174.66,4],[1046.5,4],[987.77,4],[880.0,4],[783.99,4],[698.46,4],[880.0,4],[932.33,4],[1174.66,4],[1046.5,4],[932.33,4],[880.0,4],[698.46,4],[659.25,4],[783.99,4],[880.0,4],[1046.5,4],[987.77,4],[880.0,4],[783.99,4],[659.25,4],[523.25,8],[0,4],[523.25,4],[659.25,16]];
const RT_CH2=[[329.63,8],[392.0,8],[440.0,8],[523.25,8],[349.23,8],[440.0,8],[466.16,8],[523.25,8],[329.63,8],[392.0,8],[440.0,8],[523.25,8],[261.63,8],[329.63,8],[392.0,16],[392.0,8],[493.88,8],[523.25,8],[587.33,8],[349.23,8],[440.0,8],[466.16,8],[587.33,8],[329.63,8],[392.0,8],[440.0,8],[523.25,8],[261.63,16],[261.63,16]];
const RT_CH3=[[164.81,16],[174.61,16],[164.81,16],[130.81,16],[196.0,16],[174.61,16],[164.81,16],[130.81,16],[164.81,16],[174.61,16],[164.81,16],[130.81,16],[130.81,32]];

const BT_CH1=[[880,4],[880,2],[880,2],[784,4],[880,4],[0,2],[880,2],[784,2],[659,2],[0,2],[880,4],[880,2],[880,2],[784,4],[880,4],[784,2],[659,2],[587,4],[0,4],[784,4],[784,2],[784,2],[698,4],[784,4],[0,2],[784,2],[698,2],[587,2],[0,2],[784,4],[784,2],[698,2],[659,4],[587,8],[880,2],[880,2],[1047,4],[988,2],[880,2],[784,4],[880,4],[784,2],[784,2],[932,4],[880,2],[784,2],[698,4],[784,4],[659,2],[659,2],[784,4],[740,2],[659,2],[587,4],[659,4],[523,8],[587,4],[659,4],[523,8]];
const BT_CH2=[[220,8],[196,8],[220,8],[196,8],[220,8],[196,8],[220,4],[196,4],[174,8],[220,8],[196,8],[220,8],[196,8],[174,8],[165,8],[196,8],[220,8],[196,8],[220,8],[196,8],[174,8],[165,8],[196,8],[174,8],[165,8],[147,8],[165,8],[174,8],[165,8],[131,8],[147,8],[165,8],[131,8]];
const BT_CH3=[[55,2],[55,2],[55,2],[55,2],[55,2],[55,2],[55,2],[55,2],[52,2],[52,2],[52,2],[52,2],[55,2],[55,2],[55,2],[55,2],[58,2],[58,2],[58,2],[58,2],[55,2],[55,2],[55,2],[55,2],[52,2],[52,2],[52,2],[52,2],[49,2],[49,2],[49,2],[49,2],[55,2],[55,2],[55,2],[55,2],[55,2],[55,2],[55,2],[55,2],[52,2],[52,2],[52,2],[52,2],[49,2],[49,2],[49,2],[49,2],[44,2],[44,2],[44,2],[44,2],[46,2],[46,2],[46,2],[46,2],[49,2],[49,2],[49,2],[49,2],[44,2],[44,2],[44,2],[44,2]];

const E4_CH1=[[392,4],[440,4],[494,4],[0,4],[523,6],[494,2],[440,4],[392,4],[349,4],[392,4],[440,4],[0,4],[466,8],[440,4],[392,4],[523,4],[523,2],[523,2],[587,4],[0,4],[659,6],[587,2],[523,4],[466,4],[440,4],[466,4],[523,4],[0,4],[587,8],[0,8],[659,4],[740,4],[784,4],[0,4],[880,6],[784,2],[740,4],[659,4],[587,4],[659,4],[740,4],[0,4],[784,8],[740,4],[659,4],[880,4],[880,2],[880,2],[988,4],[0,4],[1047,6],[988,2],[880,4],[784,4],[740,4],[784,4],[880,4],[0,4],[988,8],[880,8]];
const E4_CH2=[[196,4],[220,4],[247,4],[261,4],[196,4],[220,4],[247,4],[0,4],[175,4],[196,4],[220,4],[233,4],[233,8],[220,4],[196,4],[261,4],[261,4],[293,4],[261,4],[329,4],[293,4],[261,4],[233,4],[220,4],[233,4],[261,4],[0,4],[293,8],[0,8],[329,4],[370,4],[392,4],[0,4],[440,4],[392,4],[370,4],[329,4],[293,4],[329,4],[370,4],[0,4],[392,8],[370,4],[329,4],[440,4],[440,4],[494,4],[440,4],[523,4],[494,4],[440,4],[392,4],[370,4],[392,4],[440,4],[0,4],[494,8],[440,8]];
const E4_CH3=[[49,4],[49,4],[49,4],[49,4],[44,4],[44,4],[44,4],[44,4],[44,4],[44,4],[44,4],[44,4],[41,4],[41,4],[41,4],[41,4],[49,4],[49,4],[49,2],[49,2],[49,4],[49,4],[52,4],[52,4],[52,4],[52,4],[55,4],[55,4],[55,4],[55,4],[49,4],[49,4],[52,4],[49,4],[44,4],[44,4],[44,4],[44,4],[41,4],[41,4],[41,4],[41,4],[39,4],[39,4],[39,4],[39,4],[41,4],[41,4],[41,4],[41,4],[44,4],[44,4],[44,4],[44,4],[41,4],[41,4],[41,4],[41,4],[39,4],[39,4],[39,4],[39,4],[37,4],[37,4],[37,4],[37,4]];

// ── Estado mínimo de música
let musicActive = false;
let musicScheduler = null;
let currentTrack = 'pallet';
const mst = { ch1:{i:0,t:0}, ch2:{i:0,t:0}, ch3:{i:0,t:0} };

// ── OPTIMIZACIÓN: lookahead reducido + intervalo más largo (250ms vs 80ms)
const MUSIC_TICK_MS   = 250;  // era 80ms → 3x menos llamadas
const MUSIC_LOOKAHEAD = 0.35; // segundos de anticipación (era 0.25)

function _getTrackChannels(){
    if(currentTrack==='route')  return {ch1:RT_CH1, ch2:RT_CH2, ch3:RT_CH3};
    if(currentTrack==='battle') return {ch1:BT_CH1, ch2:BT_CH2, ch3:BT_CH3};
    if(currentTrack==='elite4') return {ch1:E4_CH1, ch2:E4_CH2, ch3:E4_CH3};
    return {ch1:PT_CH1, ch2:PT_CH2, ch3:PT_CH3};
}
function _getMusicCtx(){
    if(!_musicAudioCtx) _musicAudioCtx = new (window.AudioContext||window.webkitAudioContext)();
    return _musicAudioCtx;
}
function _schedCh(ctx, notes, st, type, vol){
    // Solo programa hasta el horizonte de lookahead — evita acumulación de nodos
    while(st.t < ctx.currentTime + MUSIC_LOOKAHEAD){
        const [f, d] = notes[st.i % notes.length];
        const dur = d * S16;
        const t = Math.max(st.t, ctx.currentTime + 0.005);
        if(f > 0){
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.type = type;
            o.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(vol, t + 0.008);
            g.gain.setValueAtTime(vol, t + dur * 0.72);
            g.gain.linearRampToValueAtTime(0, t + dur * 0.95);
            o.start(t); o.stop(t + dur);
        }
        st.t += dur;
        st.i++;
        if(st.i >= notes.length) st.i = 0;
    }
}
function _tickMusic(){
    // OPTIMIZACIÓN: skip si página no visible (pestaña oculta)
    if(document.hidden) return;
    if(!musicEnabled || !musicActive) return;
    try{
        const ctx = _getMusicCtx();
        if(ctx.state === 'suspended') return; // no intentar si suspendido
        const tracks = _getTrackChannels();
        _schedCh(ctx, tracks.ch1, mst.ch1, 'square',   0.07);
        _schedCh(ctx, tracks.ch2, mst.ch2, 'square',   0.05);
        _schedCh(ctx, tracks.ch3, mst.ch3, 'triangle', 0.035);
    }catch(e){ stopMusic(); } // si falla el contexto, detener limpiamente
}

function startMusicTrack(track){
    currentTrack = track;
    if(!musicEnabled) return;
    try{
        const ctx = _getMusicCtx();
        if(ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime + 0.05;
        musicActive = true;
        mst.ch1.i=0; mst.ch1.t=now;
        mst.ch2.i=0; mst.ch2.t=now;
        mst.ch3.i=0; mst.ch3.t=now;
        if(musicScheduler) clearInterval(musicScheduler);
        musicScheduler = setInterval(_tickMusic, MUSIC_TICK_MS);
        _tickMusic();
    }catch(e){}
}

function stopMusic(){
    musicActive = false;
    if(musicScheduler){ clearInterval(musicScheduler); musicScheduler = null; }
}

// Aliases de compatibilidad
function startPalletMusic(){ startMusicTrack('pallet'); }
function startRouteMusic(){  startMusicTrack('route');  }
function startBattleMusic(){ startMusicTrack('battle'); }
function startElite4Music(){ startMusicTrack('elite4'); }
function stopPalletMusic(){  stopMusic(); }
function pausePalletMusic(){ stopMusic(); }
function resumePalletMusicIfSetup(){
    const s = document.getElementById('setup-screen');
    if(s && !s.classList.contains('hidden') && musicEnabled) startMusicTrack('pallet');
}

// OPTIMIZACIÓN: pausar música cuando la pestaña queda oculta
document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){
        if(musicScheduler){ clearInterval(musicScheduler); musicScheduler = null; }
    } else if(musicActive && musicEnabled){
        // Re-sincronizar el scheduler al volver
        if(_musicAudioCtx) mst.ch1.t = mst.ch2.t = mst.ch3.t = _musicAudioCtx.currentTime + 0.05;
        musicScheduler = setInterval(_tickMusic, MUSIC_TICK_MS);
    }
});

function toggleMusic(){
    musicEnabled = !musicEnabled;
    localStorage.setItem('poke_music', musicEnabled ? 'on' : 'off');
    const btn = document.getElementById('music-toggle');
    if(btn) btn.classList.toggle('muted', !musicEnabled);
    if(musicEnabled){
        if(typeof isPracticeMode!=='undefined' && isPracticeMode) startMusicTrack('route');
        else if(typeof isExamMode!=='undefined' && isExamMode) startMusicTrack('elite4');
        else{
            const gs = document.getElementById('game-screen');
            if(gs && !gs.classList.contains('hidden')) startMusicTrack('battle');
            else resumePalletMusicIfSetup();
        }
    } else { stopMusic(); }
}

function toggleSfx(){
    sfxEnabled = !sfxEnabled;
    localStorage.setItem('poke_sfx', sfxEnabled ? 'on' : 'off');
    const btn = document.getElementById('sfx-toggle');
    if(btn) btn.classList.toggle('muted', !sfxEnabled);
    if(typeof window.soundEnabled !== 'undefined') window.soundEnabled = sfxEnabled;
    if(sfxEnabled && typeof playTone === 'function') playTone([523, 659], 80);
}

// Compatibilidad con toggleSound de app.js (delega a toggleSfx)
function toggleSound(){ toggleSfx(); }

// ══════════════════════════════════════════════════════════════════════════════
// 2. MINIMAP — Solo Liga Pokémon, actualización reactiva (no polling)
// ══════════════════════════════════════════════════════════════════════════════

let examFlaggedQuestions = new Set();

function buildMinimapGrid(){
    const grid = document.getElementById('minimap-grid');
    if(!grid || typeof activeQuestionBank === 'undefined') return;
    grid.innerHTML = '';
    activeQuestionBank.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'mq-dot';
        dot.id = `mq-dot-${i}`;
        dot.textContent = i + 1;
        dot.title = `Pregunta ${i + 1}`;
        dot.onclick = () => jumpToQuestion(i);
        grid.appendChild(dot);
    });
    updateMinimapDots();
}

function updateMinimapDots(){
    if(typeof activeQuestionBank === 'undefined' || typeof examUserAnswers === 'undefined') return;
    const curIdx = typeof currentQuestionIndex !== 'undefined' ? currentQuestionIndex : 0;
    activeQuestionBank.forEach((_, i) => {
        const dot = document.getElementById(`mq-dot-${i}`);
        if(!dot) return;
        dot.className = 'mq-dot';
        const answered = (examUserAnswers[i] || []).length > 0;
        const flagged  = examFlaggedQuestions.has(i);
        if(i === curIdx)          dot.classList.add('mq-current');
        else if(flagged&&answered) dot.classList.add('mq-flagged','mq-answered');
        else if(flagged)           dot.classList.add('mq-flagged');
        else if(answered)          dot.classList.add('mq-answered');
        dot.title = `Pregunta ${i+1}${answered?' ✅':''}${flagged?' 🚩':''}`;
    });
    const cur = document.getElementById(`mq-dot-${curIdx}`);
    if(cur) cur.scrollIntoView({block:'nearest', behavior:'smooth'});
}

function jumpToQuestion(idx){
    if(typeof currentQuestionIndex !== 'undefined'){
        currentQuestionIndex = idx;
        if(typeof showQuestion === 'function') showQuestion();
    }
}

function toggleFlag(){
    const btn = document.getElementById('flag-btn');
    if(!btn) return;
    const idx = typeof currentQuestionIndex !== 'undefined' ? currentQuestionIndex : 0;
    if(examFlaggedQuestions.has(idx)){
        examFlaggedQuestions.delete(idx);
        btn.textContent = '🚩 MARCAR DUDA';
        btn.classList.remove('flagged');
        if(typeof showToast === 'function') showToast(`Pregunta ${idx+1} desmarcada`);
    } else {
        examFlaggedQuestions.add(idx);
        btn.textContent = '✅ DUDA MARCADA';
        btn.classList.add('flagged');
        if(typeof showToast === 'function') showToast(`🚩 Pregunta ${idx+1} marcada`);
        if(typeof playTone === 'function') playTone([440, 392], 70);
    }
    updateMinimapDots();
}

// ── Hooks sobre funciones de app.js (reemplazo directo, sin observers)
(function patchShowQuestion(){
    if(typeof showQuestion !== 'function') return;
    const _orig = showQuestion;
    window.showQuestion = function(){
        _orig.apply(this, arguments);
        const isExam = typeof isExamMode !== 'undefined' && isExamMode;
        const minimap = document.getElementById('exam-minimap');
        const flagBtn = document.getElementById('flag-btn');
        if(minimap) minimap.classList.toggle('hidden', !isExam);
        if(flagBtn){
            flagBtn.classList.toggle('hidden', !isExam);
            if(isExam){
                const idx = typeof currentQuestionIndex !== 'undefined' ? currentQuestionIndex : 0;
                flagBtn.textContent = examFlaggedQuestions.has(idx) ? '✅ DUDA MARCADA' : '🚩 MARCAR DUDA';
                flagBtn.classList.toggle('flagged', examFlaggedQuestions.has(idx));
            }
        }
        updateMinimapDots();
    };
})();

(function patchStartGame(){
    if(typeof startGame !== 'function') return;
    const _orig = startGame;
    window.startGame = function(mode){
        _orig.apply(this, arguments);
        examFlaggedQuestions.clear();
        // Música según modo (pequeño delay para dejar que app.js actualice el estado)
        setTimeout(() => {
            if(mode === 'exam')      startElite4Music();
            else if(mode === 'practice') startRouteMusic();
            else                          startBattleMusic();
        }, 150);
        // Minimap solo en examen
        if(mode === 'exam') setTimeout(buildMinimapGrid, 200);
    };
})();

(function patchResetGame(){
    if(typeof resetGame !== 'function') return;
    const _orig = resetGame;
    window.resetGame = function(){
        _orig.apply(this, arguments);
        examFlaggedQuestions.clear();
        setTimeout(resumePalletMusicIfSetup, 150);
    };
})();

(function patchHandleScreenTransition(){
    if(typeof handleScreenTransition !== 'function') return;
    const _orig = handleScreenTransition;
    window.handleScreenTransition = function(cb){
        _orig.apply(this, [cb]);
        setTimeout(() => {
            const setup = document.getElementById('setup-screen');
            if(setup && !setup.classList.contains('hidden')) resumePalletMusicIfSetup();
        }, 300);
    };
})();

// ══════════════════════════════════════════════════════════════════════════════
// 3. GUARDAR / CARGAR PARTIDA
// ══════════════════════════════════════════════════════════════════════════════

function exportSaveData(){
    const u = (typeof getCurrentUser === 'function') ? getCurrentUser() : 'Alumno_Anonimo';
    const caught = JSON.parse(localStorage.getItem('poke_caught') || '{}');
    const medals = JSON.parse(localStorage.getItem('poke_medals') || '{}');
    const myCaught = (caught[u] || []).map(p => [p.id, p.name, p.types, p.count||1]);
    const saveData = {
        v: 2, ts: Date.now(), u,
        xp: parseInt(localStorage.getItem('poke_xp') || '0'),
        pk: myCaught,
        md: medals[u] || {}
    };
    const blob = new Blob([JSON.stringify(saveData)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `save_${u.replace(/\s+/g,'_')}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    if(typeof showToast === 'function') showToast('💾 ¡Partida guardada!\n'+myCaught.length+' Pokémon exportados', 2500);
}

function importSaveData(event){
    const file = event.target.files[0];
    if(!file){ event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = e => {
        try{
            const d = JSON.parse(e.target.result);
            const isV2 = d.v === 2;
            const username = isV2 ? d.u : d.username;
            if(!username){ alert('❌ Archivo de partida inválido.'); return; }
            if(!confirm(`¿Cargar la partida de "${username}"?\nEsto reemplazará tu XP, Pokédex y medallas actuales.`)){
                event.target.value = ''; return;
            }
            if(typeof xp !== 'undefined') window.xp = parseInt(d.xp || 0);
            localStorage.setItem('poke_xp', parseInt(d.xp || 0));
            const all = JSON.parse(localStorage.getItem('poke_caught') || '{}');
            all[username] = isV2
                ? (d.pk || []).map(p => ({id:p[0],name:p[1],types:p[2],count:p[3]||1}))
                : ((d.caught||{})[username] || []);
            localStorage.setItem('poke_caught', JSON.stringify(all));
            const allMed = JSON.parse(localStorage.getItem('poke_medals') || '{}');
            allMed[username] = isV2 ? (d.md||{}) : ((d.medals||{})[username]||{});
            localStorage.setItem('poke_medals', JSON.stringify(allMed));
            localStorage.setItem('aws_sim_username', username);
            const inp = document.getElementById('username-input');
            if(inp) inp.value = username;
            if(typeof updateXpBar === 'function') updateXpBar();
            if(typeof renderMedals === 'function') renderMedals();
            if(typeof updateErrorQuizButtonStatus === 'function') updateErrorQuizButtonStatus();
            if(typeof showToast === 'function') showToast(`📂 ¡Bienvenido, ${username}!\nNivel ${typeof getLevel==='function'?getLevel():1}`, 3500);
            if(typeof playTone === 'function') playTone([523,659,784,1047], 100);
        }catch(err){ alert('❌ Error al cargar: ' + err.message); }
        event.target.value = '';
    };
    reader.readAsText(file);
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. ARRANQUE — sin MutationObserver, sin polling
// ══════════════════════════════════════════════════════════════════════════════
window.addEventListener('load', () => {
    // Estado inicial de botones de audio
    const mb = document.getElementById('music-toggle');
    const sb = document.getElementById('sfx-toggle');
    if(mb) mb.classList.toggle('muted', !musicEnabled);
    if(sb) sb.classList.toggle('muted', !sfxEnabled);

    // Ocultar minimap y flag hasta que sea modo examen
    const minimap = document.getElementById('exam-minimap');
    const flagBtn = document.getElementById('flag-btn');
    if(minimap) minimap.classList.add('hidden');
    if(flagBtn) flagBtn.classList.add('hidden');

    // Migración de IDs de medallas legacy
    if(typeof getMedalData === 'function' && typeof saveMedalData === 'function'){
        const data = getMedalData(); let changed = false;
        for(const u in data){
            if(data[u].level_10  && !data[u].level_25) { data[u].level_25=data[u].level_10; delete data[u].level_10; changed=true; }
            if(data[u].streak_10 && !data[u].streak_15){ data[u].streak_15=data[u].streak_10; delete data[u].streak_10; changed=true; }
        }
        if(changed) saveMedalData(data);
    }
});

// Música en primer gesto (requerido por política de autoplay de navegadores)
document.addEventListener('click', function firstGesture(){
    startPalletMusic();
    document.removeEventListener('click', firstGesture);
}, { once: true });