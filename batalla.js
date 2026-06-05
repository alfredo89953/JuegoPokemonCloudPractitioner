/**
 * batalla.js — Módulo del Coliseo de Apuestas
 * Cloud Trainer Adventure · Sistema de Apuestas Exclusivo de Modo Batalla
 *
 * Responsabilidades:
 *   1. Leer Pokémon capturados del usuario desde localStorage (misma clave que app.js)
 *   2. Renderizar la sala de apuestas y permitir seleccionar un Pokémon
 *   3. Escribir la apuesta activa en localStorage para que app.js la consuma al finalizar
 *   4. Exponer BetSystem.resolveResult(didWin, pct) para que app.js lo invoque en endGame()
 */

// ==================================================================
// CLAVE COMPARTIDA CON app.js — No modificar sin actualizar ambos lados
// ==================================================================
const BET_KEY   = 'simcert_active_bet';   // { username, pokemon, config, difficulty }
const CAUGHT_KEY = 'poke_caught';
const XP_KEY     = 'poke_xp';

// ==================================================================
// UTILIDADES COMPARTIDAS (duplicadas mínimas para no depender de app.js)
// ==================================================================
const BetUtils = {
    getCurrentUser() {
        return localStorage.getItem('aws_sim_username') || 'Alumno_Anonimo';
    },
    getCaughtPokemon() {
        const u = this.getCurrentUser();
        const all = JSON.parse(localStorage.getItem(CAUGHT_KEY) || '{}');
        return all[u] || [];
    },
    removeCaughtPokemon(pokemonId) {
        const u = this.getCurrentUser();
        const all = JSON.parse(localStorage.getItem(CAUGHT_KEY) || '{}');
        if (!all[u]) return;
        all[u] = all[u].filter(p => p.id !== pokemonId);
        localStorage.setItem(CAUGHT_KEY, JSON.stringify(all));
    },
    addCaughtPokemon(pokemon) {
        const u = this.getCurrentUser();
        const all = JSON.parse(localStorage.getItem(CAUGHT_KEY) || '{}');
        if (!all[u]) all[u] = [];
        if (!all[u].find(p => p.id === pokemon.id)) {
            all[u].push({ id: pokemon.id, name: pokemon.name, types: pokemon.types });
        }
        localStorage.setItem(CAUGHT_KEY, JSON.stringify(all));
    },
    addXP(amount) {
        const current = parseInt(localStorage.getItem(XP_KEY) || '0');
        localStorage.setItem(XP_KEY, Math.max(0, current + amount));
    },
    getXP() {
        return parseInt(localStorage.getItem(XP_KEY) || '0');
    }
};

// ==================================================================
// SISTEMA DE APUESTAS — API PÚBLICA
// ==================================================================
const BetSystem = {

    /** Pokémon seleccionado actualmente en la UI (antes de confirmar) */
    _selectedPokemon: null,

    /** Configuración de dificultad elegida en la sala de apuestas */
    _selectedDifficulty: 'medium',

    // ------------------------------------------------------------------
    // PERSISTENCIA DE LA APUESTA ACTIVA
    // ------------------------------------------------------------------

    /** Guarda la apuesta en localStorage para que app.js la lea al terminar */
    saveBet(pokemon, difficulty) {
        const bet = {
            username:   BetUtils.getCurrentUser(),
            pokemon:    pokemon,          // { id, name, types }
            difficulty: difficulty,       // 'easy' | 'medium' | 'hard'
            timestamp:  Date.now()
        };
        localStorage.setItem(BET_KEY, JSON.stringify(bet));
    },

    /** Lee la apuesta activa. Retorna null si no existe. */
    loadBet() {
        try {
            const raw = localStorage.getItem(BET_KEY);
            if (!raw) return null;
            const bet = JSON.parse(raw);
            // Validar que pertenece al usuario activo
            if (bet.username !== BetUtils.getCurrentUser()) return null;
            return bet;
        } catch { return null; }
    },

    /** Elimina la apuesta activa (tras resolverla) */
    clearBet() {
        localStorage.removeItem(BET_KEY);
    },

    // ------------------------------------------------------------------
    // RESOLUCIÓN DEL RESULTADO — Llamado desde app.js en endGame()
    // ------------------------------------------------------------------

    /**
     * Resuelve la apuesta activa según el resultado del Modo Batalla.
     * Debe ser invocado desde endGame() en app.js SOLO cuando el modo es trivia.
     *
     * @param {boolean} didWin  - true si pct >= 70 (umbral de victoria)
     * @param {number}  pct     - porcentaje de acierto (0-100)
     * @returns {{ outcome: 'win'|'lose'|'none', message: string, xpDelta: number }}
     */
    resolveResult(didWin, pct) {
        const bet = this.loadBet();
        if (!bet) return { outcome: 'none', message: '', xpDelta: 0 };

        // Validar que el usuario es el mismo que apostó
        if (bet.username !== BetUtils.getCurrentUser()) {
            this.clearBet();
            return { outcome: 'none', message: '', xpDelta: 0 };
        }

        let outcome, message, xpDelta;

        if (didWin) {
            // VICTORIA: conserva su Pokémon + recibe XP extra proporcional al resultado
            xpDelta = pct >= 90 ? 80 : (pct >= 70 ? 50 : 30);
            BetUtils.addXP(xpDelta);

            // Premio adicional por dificultad
            const diffBonus = { easy: 0, medium: 20, hard: 50 };
            const bonus = diffBonus[bet.difficulty] || 0;
            if (bonus > 0) BetUtils.addXP(bonus);
            xpDelta += bonus;

            // Premio especial: regala un Pokémon random de premio si ganó bien
            let prizePokemon = null;
            if (pct >= 70) {
                prizePokemon = this._pickPrizePokemon(bet.pokemon.id);
                if (prizePokemon) BetUtils.addCaughtPokemon(prizePokemon);
            }

            outcome  = 'win';
            message  = prizePokemon
                ? `🏆 ¡VICTORIA! Conservas a ${bet.pokemon.name.toUpperCase()} y capturas a ${prizePokemon.name.toUpperCase()} como trofeo. +${xpDelta} XP`
                : `🏆 ¡VICTORIA! Conservas a ${bet.pokemon.name.toUpperCase()}. +${xpDelta} XP`;

        } else {
            // DERROTA: pierde el Pokémon apostado
            BetUtils.removeCaughtPokemon(bet.pokemon.id);
            xpDelta = -20;
            BetUtils.addXP(xpDelta);

            outcome = 'lose';
            message = `💀 ¡DERROTA! ${bet.pokemon.name.toUpperCase()} ha huido para siempre... −20 XP`;
        }

        this.clearBet();
        return { outcome, message, xpDelta };
    },

    /**
     * Selecciona un Pokémon de premio para el ganador.
     * Escoge uno de la wildPokemonTable del proyecto (ids conocidos),
     * evitando duplicar al Pokémon apostado y los ya capturados.
     * @private
     */
    _pickPrizePokemon(excludeId) {
        // Pool de posibles premios (subconjunto de rango común 1-99)
        const PRIZE_POOL = [
            { id: 1,  name: 'Bulbasaur',  types: ['Planta', 'Veneno'] },
            { id: 4,  name: 'Charmander', types: ['Fuego'] },
            { id: 7,  name: 'Squirtle',   types: ['Agua'] },
            { id: 25, name: 'Pikachu',    types: ['Eléctrico'] },
            { id: 52, name: 'Meowth',     types: ['Normal'] },
            { id: 54, name: 'Psyduck',    types: ['Agua', 'Psíquico'] },
            { id: 60, name: 'Poliwag',    types: ['Agua'] },
            { id: 41, name: 'Zubat',      types: ['Veneno', 'Volador'] },
            { id: 43, name: 'Oddish',     types: ['Planta', 'Veneno'] },
            { id: 69, name: 'Bellsprout', types: ['Planta', 'Veneno'] },
        ];
        const caught = BetUtils.getCaughtPokemon().map(p => p.id);
        const eligible = PRIZE_POOL.filter(p => p.id !== excludeId && !caught.includes(p.id));
        if (eligible.length === 0) return null;
        return eligible[Math.floor(Math.random() * eligible.length)];
    },

    // ------------------------------------------------------------------
    // RENDERIZADO DE LA UI — Sala de Apuestas (llamado desde batalla.html)
    // ------------------------------------------------------------------

    /** Inicializa toda la UI de la sala de apuestas */
    initUI() {
        this._renderUserInfo();
        this._renderDifficultySelector();
        this._renderPokemonGrid();
        this._bindConfirmButton();
        this._checkExistingBet();
    },

    /** Muestra el nombre del entrenador activo */
    _renderUserInfo() {
        const el = document.getElementById('bet-trainer-name');
        if (el) el.textContent = BetUtils.getCurrentUser();
        const xpEl = document.getElementById('bet-trainer-xp');
        if (xpEl) xpEl.textContent = `${BetUtils.getXP()} XP`;
    },

    /** Renderiza los selectores de dificultad */
    _renderDifficultySelector() {
        document.querySelectorAll('.bet-diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.bet-diff-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this._selectedDifficulty = btn.dataset.diff;
                this._updateConfirmButton();
            });
        });
        // Seleccionar medium por defecto
        const defaultBtn = document.querySelector('.bet-diff-btn[data-diff="medium"]');
        if (defaultBtn) defaultBtn.classList.add('selected');
    },

    /** Renderiza el grid de Pokémon capturados disponibles para apostar */
    _renderPokemonGrid() {
        const grid    = document.getElementById('bet-pokemon-grid');
        const warning = document.getElementById('bet-empty-warning');
        const section = document.getElementById('bet-pokemon-section');
        if (!grid) return;

        const caught = BetUtils.getCaughtPokemon();
        grid.innerHTML = '';

        if (caught.length === 0) {
            if (warning) warning.classList.remove('hidden');
            if (section) section.classList.add('hidden');
            this._disableConfirm('Sin Pokémon para apostar');
            return;
        }

        if (warning) warning.classList.add('hidden');
        if (section) section.classList.remove('hidden');

        caught.forEach(pokemon => {
            const card = document.createElement('button');
            card.className = 'bet-pokemon-card';
            card.dataset.id = pokemon.id;
            card.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png"
                     alt="${pokemon.name}" class="bet-poke-sprite">
                <span class="bet-poke-num">#${String(pokemon.id).padStart(3, '0')}</span>
                <span class="bet-poke-name">${pokemon.name.toUpperCase()}</span>
                <span class="bet-poke-types">${pokemon.types.join(' / ')}</span>
            `;
            card.addEventListener('click', () => this._selectPokemon(pokemon, card));
            grid.appendChild(card);
        });

        this._updateConfirmButton();
    },

    /** Maneja la selección de un Pokémon en el grid */
    _selectPokemon(pokemon, cardEl) {
        document.querySelectorAll('.bet-pokemon-card').forEach(c => c.classList.remove('selected'));
        cardEl.classList.add('selected');
        this._selectedPokemon = pokemon;

        // Actualizar el panel de preview
        const preview = document.getElementById('bet-preview-panel');
        const previewImg  = document.getElementById('bet-preview-img');
        const previewName = document.getElementById('bet-preview-name');
        const previewType = document.getElementById('bet-preview-type');

        if (preview)      preview.classList.remove('hidden');
        if (previewImg)   previewImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
        if (previewName)  previewName.textContent = pokemon.name.toUpperCase();
        if (previewType)  previewType.textContent = pokemon.types.join(' · ');

        this._updateConfirmButton();
    },

    /** Enlaza el botón de confirmar apuesta */
    _bindConfirmButton() {
        const btn = document.getElementById('bet-confirm-btn');
        if (!btn) return;
        btn.addEventListener('click', () => this._confirmBet());
    },

    /** Valida y confirma la apuesta, redirigiendo a index.html con parámetros */
    _confirmBet() {
        if (!this._selectedPokemon) {
            this._flashError('¡Elige un Pokémon para apostar primero!');
            return;
        }
        const difficulty = this._selectedDifficulty || 'medium';

        // Guardar apuesta en localStorage
        this.saveBet(this._selectedPokemon, difficulty);

        // Redirigir a index.html pasando modo y dificultad por query string
        const params = new URLSearchParams({
            mode:       'trivia',
            difficulty: difficulty,
            bet:        '1'           // Bandera para que app.js sepa que viene de una apuesta
        });
        window.location.href = `index (1).html?${params.toString()}`;
    },

    /** Actualiza el estado visual/habilitación del botón de confirmar */
    _updateConfirmButton() {
        const btn = document.getElementById('bet-confirm-btn');
        if (!btn) return;
        const canBet = !!this._selectedPokemon;
        btn.disabled = !canBet;
        btn.textContent = canBet
            ? `⚔️ ¡APOSTAR A ${this._selectedPokemon.name.toUpperCase()} Y ENTRAR AL COMBATE!`
            : '⚔️ SELECCIONA UN POKÉMON PARA APOSTAR';
    },

    _disableConfirm(label) {
        const btn = document.getElementById('bet-confirm-btn');
        if (btn) { btn.disabled = true; btn.textContent = label; }
    },

    /** Muestra un mensaje de error parpadeante en la UI */
    _flashError(msg) {
        const el = document.getElementById('bet-error-msg');
        if (!el) return;
        el.textContent = msg;
        el.classList.remove('hidden');
        setTimeout(() => el.classList.add('hidden'), 3000);
    },

    /**
     * Si ya existe una apuesta guardada (partida interrumpida),
     * ofrece al usuario continuar o cancelarla.
     */
    _checkExistingBet() {
        const existing = this.loadBet();
        if (!existing) return;

        const banner = document.getElementById('bet-existing-banner');
        const bannerMsg = document.getElementById('bet-existing-msg');
        if (banner && bannerMsg) {
            bannerMsg.textContent = `Apuesta pendiente: ${existing.pokemon.name.toUpperCase()} en dificultad ${existing.difficulty.toUpperCase()}`;
            banner.classList.remove('hidden');
        }
    }
};

// ==================================================================
// BOOTSTRAP — Se ejecuta cuando el DOM está listo
// ==================================================================
document.addEventListener('DOMContentLoaded', () => BetSystem.initUI());