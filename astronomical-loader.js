/**
 * INTELLIGENT ASTRONOMICAL CITY-VIEW WEBSITE LOADER
 * Controller & Scene Orchestrator with Precision Mathematical Lunar Engine
 * 
 * Coordinates:
 * - Real-time Astronomy Engine (NOAA Solar, Meeus Lunar, NASA Eclipse, IANA Timezones)
 * - 100vw × 100vh Living Vector City Environment
 * - True Mathematical SVG Lunar Phase Terminator & Cycle Simulation
 * - 3-Layer Parallax Clouds, Birds, Traffic, Window Illuminations
 * - Interactive Developer Astronomical Lab / Debug Drawer
 * - Automatic Portfolio Light/Dark Mode Hand-off
 */

(function () {
    'use strict';

    let astroContext = null;
    let isIntroActive = false;
    let transitionTimer = null;
    let simulatedDate = null;
    let simulatedLocation = null;
    let simulatedEclipse = null;       // 'solar' | 'lunar' | null
    let simulatedMoonProgress = null;  // 0.0 to 1.0 (or null for real astronomical calculation)

    /**
     * Compute mathematically exact SVG path for any lunar phase
     * phaseProgress: 0.0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 0.75 = Last Quarter, 1.0 = New Moon
     * radius: lunar radius in SVG user coordinates (default 26px)
     */
    function getMoonSVGPath(phaseProgress, radius = 26) {
        const r = radius;
        let p = phaseProgress % 1.0;
        if (p < 0) p += 1.0;

        // Near New Moon: completely unlit
        if (p < 0.018 || p > 0.982) {
            return '';
        }

        // Near Full Moon: full illuminated disc
        if (Math.abs(p - 0.5) < 0.018) {
            return `M 0 ${-r} A ${r} ${r} 0 1 1 0 ${r} A ${r} ${r} 0 1 1 0 ${-r} Z`;
        }

        const phi = p * 2 * Math.PI;
        const cosPhi = Math.cos(phi);
        const rx = Math.max(0.1, Math.abs(cosPhi) * r);

        const isWaxing = (p < 0.5);
        const isCrescent = (p < 0.25 || p > 0.75);

        // Circular outer limb:
        // Waxing (p < 0.5): bright limb is on the right -> sweep = 1
        // Waning (p > 0.5): bright limb is on the left -> sweep = 0
        const sweepLimb = isWaxing ? 1 : 0;

        // Elliptical terminator from (0, r) back to (0, -r):
        // Crescent: terminator curves in same direction as limb
        // Gibbous: terminator curves in opposite direction (convex into unlit side)
        const sweepTerm = isWaxing ? (isCrescent ? 1 : 0) : (isCrescent ? 0 : 1);

        return `M 0 ${-r} A ${r} ${r} 0 0 ${sweepLimb} 0 ${r} A ${rx.toFixed(2)} ${r} 0 0 ${sweepTerm} 0 ${-r} Z`;
    }

    /**
     * Helper to resolve phase name, emoji icon, age in days, and illumination %
     */
    function getLunarDescription(phaseProgress) {
        let p = phaseProgress % 1.0;
        if (p < 0) p += 1.0;
        const days = p * 29.530588853;
        const illum = Math.round(((1 - Math.cos(p * 2 * Math.PI)) / 2) * 100);

        if (p < 0.03 || p > 0.97) {
            return { name: 'New Moon', code: 'new_moon', icon: '🌑', days: days.toFixed(1), illum };
        }
        if (p < 0.22) {
            return { name: 'Waxing Crescent', code: 'waxing_crescent', icon: '🌒', days: days.toFixed(1), illum };
        }
        if (p < 0.28) {
            return { name: 'First Quarter', code: 'first_quarter', icon: '🌓', days: days.toFixed(1), illum };
        }
        if (p < 0.47) {
            return { name: 'Waxing Gibbous', code: 'waxing_gibbous', icon: '🌔', days: days.toFixed(1), illum };
        }
        if (p < 0.53) {
            return { name: 'Full Moon', code: 'full_moon', icon: '🌕', days: days.toFixed(1), illum };
        }
        if (p < 0.72) {
            return { name: 'Waning Gibbous', code: 'waning_gibbous', icon: '🌖', days: days.toFixed(1), illum };
        }
        if (p < 0.78) {
            return { name: 'Third / Last Quarter', code: 'last_quarter', icon: '🌗', days: days.toFixed(1), illum };
        }
        return { name: 'Waning Crescent', code: 'waning_crescent', icon: '🌘', days: days.toFixed(1), illum };
    }

    /**
     * Generate HTML for background skyline towers
     */
    function renderBackgroundSkyline() {
        const heights = [45, 62, 38, 75, 50, 68, 55, 82, 48, 65, 72, 42, 58];
        let html = '';
        heights.forEach((h, i) => {
            const width = 5 + (i % 3) * 2;
            html += `<div class="bg-tower" style="width: ${width}%; height: ${h}%;"></div>`;
        });
        return html;
    }

    /**
     * Generate HTML for midground architectural skyscrapers with window grids
     */
    function renderMidgroundSkyline() {
        const buildings = [
            { w: 10, h: 58, rows: 6, cols: 3, antenna: false },
            { w: 13, h: 72, rows: 8, cols: 4, antenna: true },
            { w: 11, h: 48, rows: 5, cols: 3, antenna: false },
            { w: 16, h: 88, rows: 10, cols: 4, antenna: true, isHero: true }, // Hero Tower
            { w: 12, h: 65, rows: 7, cols: 4, antenna: false },
            { w: 14, h: 78, rows: 9, cols: 4, antenna: true },
            { w: 10, h: 52, rows: 6, cols: 3, antenna: false }
        ];

        let html = '';
        buildings.forEach((b, bi) => {
            let windowsHTML = '';
            for (let r = 0; r < b.rows; r++) {
                for (let c = 0; c < b.cols; c++) {
                    const isLitWarm = ((bi * 7 + r * 3 + c) % 3 === 0);
                    const isLitViolet = ((bi * 5 + r * 2 + c) % 7 === 0);
                    const litClass = isLitWarm ? 'lit-warm' : (isLitViolet ? 'lit-violet' : '');
                    windowsHTML += `<div class="city-window ${litClass}"></div>`;
                }
            }

            const antennaHTML = b.antenna ? `
                <div class="tower-spire-antenna">
                    <div class="aviation-blinker"></div>
                </div>
            ` : '';

            html += `
                <div class="mid-building" style="width: ${b.w}%; height: ${b.h}%;">
                    ${antennaHTML}
                    <div class="window-grid" style="grid-template-columns: repeat(${b.cols}, 1fr);">
                        ${windowsHTML}
                    </div>
                </div>
            `;
        });
        return html;
    }

    /**
     * Generate sidewalk elements (street lamps, trees)
     */
    function renderSidewalkElements() {
        let html = '';
        const items = ['lamp', 'tree', 'tree', 'lamp', 'tree', 'lamp', 'tree', 'tree', 'lamp'];
        items.forEach(type => {
            if (type === 'lamp') {
                html += `
                    <div class="street-lamp-post">
                        <div class="lamp-head">
                            <div class="lamp-bulb"></div>
                        </div>
                        <div class="lamp-light-cone"></div>
                    </div>
                `;
            } else {
                html += `
                    <div class="street-tree">
                        <div class="tree-canopy"></div>
                        <div class="tree-trunk"></div>
                    </div>
                `;
            }
        });
        return html;
    }

    /**
     * Generate night stars coordinates
     */
    function renderStars() {
        let html = '';
        const coords = [
            { t: 8, l: 12 }, { t: 15, l: 24 }, { t: 22, l: 38 }, { t: 9, l: 45 },
            { t: 18, l: 58 }, { t: 12, l: 68 }, { t: 25, l: 78 }, { t: 7, l: 86 },
            { t: 28, l: 16 }, { t: 32, l: 88 }, { t: 14, l: 94 }, { t: 20, l: 6 },
            { t: 29, l: 50 }, { t: 6, l: 32 }, { t: 24, l: 62 }, { t: 11, l: 75 }
        ];
        coords.forEach(c => {
            html += `<div class="city-star" style="top: ${c.t}%; left: ${c.l}%;"></div>`;
        });
        return html;
    }

    /**
     * Build the entire living city DOM
     */
    function buildCityDOM() {
        let loader = document.getElementById('astro-city-loader');
        if (loader) loader.remove();

        loader = document.createElement('div');
        loader.id = 'astro-city-loader';
        loader.setAttribute('role', 'dialog');
        loader.setAttribute('aria-modal', 'true');
        loader.setAttribute('aria-label', 'Intelligent Astronomical City Loader');

        loader.innerHTML = `
            <!-- Top HUD Bar -->
            <div class="astro-top-bar">
                <div class="astro-telemetry-badge" id="astro-hud-badge">
                    <span class="astro-status-pulse"></span>
                    <span class="astro-city-label" id="hud-city-label">CALIBRATING CITY...</span>
                    <span style="opacity: 0.4;">•</span>
                    <span id="hud-time-label">--:--</span>
                    <span class="astro-phase-tag" id="hud-phase-tag">ASTRONOMICAL SYNC</span>
                </div>

                <div class="astro-actions">
                    <button type="button" class="astro-go-back-btn" id="astro-go-back-btn" aria-label="Go back to portfolio" style="display: none;">
                        <span>&larr;</span>
                        <span>Go Back</span>
                    </button>
                    <button type="button" class="astro-debug-toggle-btn" id="astro-debug-btn" title="Open Astronomical Lab">
                        <span>⚡</span>
                        <span>Astro Lab</span>
                    </button>
                    <button type="button" class="astro-skip-btn" id="astro-skip-btn" aria-label="Skip to portfolio">
                        <span>Skip Intro</span>
                        <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
            </div>

            <!-- Full-Screen Living City Viewport Stage -->
            <div class="city-viewport-stage" id="city-viewport-stage">
                <!-- Atmospheric Sky Backdrop -->
                <div class="city-sky-backdrop" id="city-sky-backdrop"></div>

                <!-- Celestial Canvas (Sun, Moon, Stars) -->
                <div class="city-celestial-canvas">
                    <!-- Night Stars -->
                    <div class="celestial-stars-layer" id="celestial-stars-layer">
                        ${renderStars()}
                    </div>

                    <!-- Sun -->
                    <div class="celestial-sun-body" id="celestial-sun">
                        <div class="celestial-sun-corona"></div>
                    </div>

                    <!-- Precision Vector Mathematical Moon -->
                    <div class="celestial-moon-body" id="celestial-moon">
                        <svg id="moon-svg" viewBox="-32 -32 64 64" width="56" height="56">
                            <defs>
                                <filter id="moon-halo-glow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="2.5" result="blur1" />
                                    <feGaussianBlur stdDeviation="6" result="blur2" />
                                    <feMerge>
                                        <feMergeNode in="blur2" />
                                        <feMergeNode in="blur1" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                                <clipPath id="moon-disk-clip">
                                    <circle cx="0" cy="0" r="26" />
                                </clipPath>
                            </defs>

                            <!-- Unlit Dark Disk / Earthshine -->
                            <circle cx="0" cy="0" r="26" fill="#141624" stroke="rgba(255, 255, 255, 0.22)" stroke-width="0.8" />
                            
                            <!-- Faint Maria on unlit side -->
                            <g opacity="0.18" clip-path="url(#moon-disk-clip)">
                                <ellipse cx="-8" cy="-6" rx="8" ry="6" fill="#0A0B12" />
                                <ellipse cx="10" cy="4" rx="9" ry="7" fill="#0A0B12" />
                                <circle cx="4" cy="-12" r="5" fill="#0A0B12" />
                                <circle cx="-5" cy="12" r="7" fill="#0A0B12" />
                            </g>

                            <!-- Dynamically Computed Illuminated Lunar Path -->
                            <g clip-path="url(#moon-disk-clip)">
                                <path id="moon-lit-path" d="" fill="#F8F6EB" filter="url(#moon-halo-glow)" />
                                <!-- Detailed Lunar Craters / Maria visible across illuminated surface -->
                                <g id="moon-lit-craters" opacity="0.16" fill="#3D3A30">
                                    <ellipse cx="-8" cy="-6" rx="8" ry="6" />
                                    <ellipse cx="10" cy="4" rx="9" ry="7" />
                                    <circle cx="4" cy="-12" r="5" />
                                    <circle cx="-5" cy="12" r="7" />
                                    <!-- Tycho impact crater ray system -->
                                    <circle cx="6" cy="16" r="2.5" fill="#FFF" opacity="0.6" />
                                    <circle cx="6" cy="16" r="1.5" fill="#555" />
                                </g>
                            </g>

                            <!-- Outer atmospheric rim -->
                            <circle cx="0" cy="0" r="27" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="0.5" opacity="0.4" />
                        </svg>
                    </div>
                </div>

                <!-- 3-Layer Parallax Clouds -->
                <div class="city-clouds-layer clouds-bg">
                    <div class="cloud-cluster cloud-drift-slow" style="top: 12%;">
                        <div class="cloud-bubble" style="width: 140px; height: 42px;"></div>
                    </div>
                </div>
                <div class="city-clouds-layer clouds-mid">
                    <div class="cloud-cluster cloud-drift-medium" style="top: 22%;">
                        <div class="cloud-bubble" style="width: 180px; height: 50px;"></div>
                    </div>
                </div>
                <div class="city-clouds-layer clouds-fg">
                    <div class="cloud-cluster cloud-drift-fast" style="top: 8%;">
                        <div class="cloud-bubble" style="width: 110px; height: 35px;"></div>
                    </div>
                </div>

                <!-- Daytime Birds Flocking -->
                <div class="city-birds-flock bird-flight-path" id="city-birds">
                    <span class="bird-wing-flap" style="font-size: 14px; color: #2B3A4A;">🕊️</span>
                    <span class="bird-wing-flap" style="font-size: 11px; margin-left: 12px; color: #2B3A4A;">🕊️</span>
                    <span class="bird-wing-flap" style="font-size: 9px; margin-left: 8px; margin-top: -6px; color: #2B3A4A;">🕊️</span>
                </div>

                <!-- Vector Architectural Skyline -->
                <div class="city-skyline-container">
                    <div class="skyline-layer-bg">
                        ${renderBackgroundSkyline()}
                    </div>
                    <div class="skyline-layer-mid">
                        ${renderMidgroundSkyline()}
                    </div>
                </div>

                <!-- Foreground Street, Sidewalk, Streetlights & Traffic -->
                <div class="city-foreground-street">
                    <div class="city-sidewalk">
                        ${renderSidewalkElements()}
                    </div>
                    <div class="city-road-surface">
                        <div class="road-centerline-dashes"></div>
                        <div class="crosswalk-stripes">
                            <div class="crosswalk-stripe"></div>
                            <div class="crosswalk-stripe"></div>
                            <div class="crosswalk-stripe"></div>
                            <div class="crosswalk-stripe"></div>
                        </div>

                        <!-- Moving Traffic -->
                        <div class="traffic-vehicle car-eastbound">
                            <div class="headlight-beam"></div>
                            <div style="width: 32px; height: 12px; background: #222538; border-radius: 4px;"></div>
                            <div class="taillight-dot"></div>
                        </div>
                        <div class="traffic-vehicle car-westbound">
                            <div class="taillight-dot"></div>
                            <div style="width: 28px; height: 11px; background: #323548; border-radius: 4px;"></div>
                            <div class="headlight-beam" style="transform: scaleX(-1);"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Contextual Status & Progress -->
            <div class="astro-status-container">
                <div class="astro-context-message" id="astro-status-text">CALIBRATING LOCAL SKYLINE...</div>
                <div class="astro-progress-bar-track">
                    <div class="astro-progress-bar-fill" id="astro-progress-fill"></div>
                </div>
            </div>

            <!-- Developer Astronomical Lab Drawer -->
            <div class="astro-debug-drawer" id="astro-debug-drawer">
                <div class="debug-header">
                    <span>⚡ ASTRONOMICAL LAB</span>
                    <button type="button" id="debug-close-btn" style="background:none;border:none;color:#FFF;cursor:pointer;font-size:14px;">✕</button>
                </div>

                <!-- Time of Day Slider -->
                <div class="debug-field-group">
                    <div class="debug-label">Time of Day: <span id="debug-time-display">12:00</span></div>
                    <input type="range" class="debug-slider" id="debug-time-slider" min="0" max="1439" value="720">
                </div>

                <!-- Astronomical Phase Presets -->
                <div class="debug-field-group">
                    <div class="debug-label">Solar Presets</div>
                    <div class="debug-btn-grid">
                        <button type="button" class="debug-preset-btn" data-preset="dawn">Dawn</button>
                        <button type="button" class="debug-preset-btn" data-preset="sunrise">Sunrise</button>
                        <button type="button" class="debug-preset-btn" data-preset="noon">Noon</button>
                        <button type="button" class="debug-preset-btn" data-preset="sunset">Sunset</button>
                        <button type="button" class="debug-preset-btn" data-preset="dusk">Dusk</button>
                        <button type="button" class="debug-preset-btn" data-preset="midnight">Midnight</button>
                    </div>
                </div>

                <!-- Dedicated Moon Cycle Controls -->
                <div class="debug-field-group">
                    <div class="debug-label">Moon Cycle: <span id="debug-moon-phase-name" style="color:#C9B8FF;font-weight:600;">Auto</span></div>
                    <div class="debug-btn-grid" style="grid-template-columns: repeat(4, 1fr);">
                        <button type="button" class="debug-preset-btn" data-moon="0.0">🌑 New</button>
                        <button type="button" class="debug-preset-btn" data-moon="0.125">🌒 Waxing</button>
                        <button type="button" class="debug-preset-btn" data-moon="0.25">🌓 1st Qtr</button>
                        <button type="button" class="debug-preset-btn" data-moon="0.375">🌔 Gibbous</button>
                        <button type="button" class="debug-preset-btn" data-moon="0.5">🌕 Full</button>
                        <button type="button" class="debug-preset-btn" data-moon="0.625">🌖 Gibbous</button>
                        <button type="button" class="debug-preset-btn" data-moon="0.75">🌗 Last Qtr</button>
                        <button type="button" class="debug-preset-btn" data-moon="0.875">🌘 Waning</button>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
                        <span style="font-size:0.6rem;color:#888;">0d</span>
                        <input type="range" class="debug-slider" id="debug-moon-slider" min="0" max="1000" value="500" style="flex:1;" title="Scrub through 29.5-day synodic lunar cycle">
                        <span style="font-size:0.6rem;color:#888;">29.5d</span>
                        <button type="button" id="debug-reset-moon-btn" class="debug-preset-btn" style="padding:2px 6px;font-size:0.6rem;" title="Reset to today's real calculated moon">Auto</button>
                    </div>
                </div>

                <!-- Eclipse Simulation -->
                <div class="debug-field-group">
                    <div class="debug-label">Eclipse Events</div>
                    <div class="debug-btn-grid" style="grid-template-columns: 1fr 1fr;">
                        <button type="button" class="debug-preset-btn" data-eclipse="solar">☀️ Solar Eclipse</button>
                        <button type="button" class="debug-preset-btn" data-eclipse="lunar">🌕 Blood Moon</button>
                    </div>
                </div>

                <!-- Location Selector -->
                <div class="debug-field-group">
                    <div class="debug-label">Global City Preset</div>
                    <select class="debug-select" id="debug-city-select">
                        <option value="Asia/Kolkata">Mumbai / New Delhi, India</option>
                        <option value="America/New_York">New York, USA</option>
                        <option value="Europe/London">London, UK</option>
                        <option value="Asia/Tokyo">Tokyo, Japan</option>
                        <option value="Atlantic/Reykjavik">Reykjavik, Iceland (Polar)</option>
                        <option value="Australia/Sydney">Sydney, Australia</option>
                        <option value="America/Los_Angeles">San Francisco, USA</option>
                    </select>
                </div>

                <!-- Telemetry Readout -->
                <div class="debug-telemetry-readout" id="debug-telemetry-text">
                    Calculating solar azimuth & lunar coordinates...
                </div>
            </div>
        `;

        document.body.prepend(loader);
        document.body.classList.add('astro-loader-active');

        // Bind interactive controls
        bindControls();
    }

    /**
     * Bind buttons, skip, debug drawer, and sliders
     */
    function bindControls() {
        const goBackBtn = document.getElementById('astro-go-back-btn');
        if (goBackBtn) {
            goBackBtn.addEventListener('click', (e) => {
                e.preventDefault();
                launchPortfolioTransition();
            });
        }

        const skipBtn = document.getElementById('astro-skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.preventDefault();
                completeLoaderImmediately();
            });
        }

        const debugBtn = document.getElementById('astro-debug-btn');
        const debugDrawer = document.getElementById('astro-debug-drawer');
        const debugClose = document.getElementById('debug-close-btn');

        if (debugBtn && debugDrawer) {
            debugBtn.addEventListener('click', (e) => {
                e.preventDefault();
                debugDrawer.classList.toggle('is-open');
            });
        }
        if (debugClose && debugDrawer) {
            debugClose.addEventListener('click', () => {
                debugDrawer.classList.remove('is-open');
            });
        }

        // Time slider in debug lab
        const timeSlider = document.getElementById('debug-time-slider');
        const timeDisplay = document.getElementById('debug-time-display');
        if (timeSlider) {
            timeSlider.addEventListener('input', (e) => {
                const minutes = parseInt(e.target.value, 10);
                const h = Math.floor(minutes / 60);
                const m = minutes % 60;
                timeDisplay.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

                const d = new Date(simulatedDate || new Date());
                d.setHours(h, m, 0);
                simulatedDate = d;
                simulatedEclipse = null;
                updateAstronomicalState();
            });
        }

        // Solar Presets
        document.querySelectorAll('.debug-preset-btn[data-preset]').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                simulatedEclipse = null;
                const d = new Date(simulatedDate || new Date());

                if (preset === 'dawn') d.setHours(5, 30, 0);
                if (preset === 'sunrise') d.setHours(6, 45, 0);
                if (preset === 'noon') d.setHours(12, 15, 0);
                if (preset === 'sunset') d.setHours(18, 20, 0);
                if (preset === 'dusk') d.setHours(19, 15, 0);
                if (preset === 'midnight') d.setHours(0, 0, 0);

                simulatedDate = d;
                if (timeSlider) {
                    timeSlider.value = d.getHours() * 60 + d.getMinutes();
                    timeDisplay.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
                }
                updateAstronomicalState();
            });
        });

        // Dedicated Moon Phase Buttons
        document.querySelectorAll('.debug-preset-btn[data-moon]').forEach(btn => {
            btn.addEventListener('click', () => {
                const progress = parseFloat(btn.dataset.moon);
                simulatedMoonProgress = progress;
                const moonSlider = document.getElementById('debug-moon-slider');
                if (moonSlider) {
                    moonSlider.value = Math.round(progress * 1000);
                }
                updateAstronomicalState();
            });
        });

        // Dedicated Moon Slider (Continuous 29.5-day scrub)
        const moonSlider = document.getElementById('debug-moon-slider');
        if (moonSlider) {
            moonSlider.addEventListener('input', (e) => {
                const fraction = parseInt(e.target.value, 10) / 1000.0;
                simulatedMoonProgress = fraction;
                updateAstronomicalState();
            });
        }

        // Reset to Real Astronomical Moon
        const resetMoonBtn = document.getElementById('debug-reset-moon-btn');
        if (resetMoonBtn) {
            resetMoonBtn.addEventListener('click', () => {
                simulatedMoonProgress = null;
                updateAstronomicalState();
            });
        }

        // Eclipse Simulation Buttons
        document.querySelectorAll('.debug-preset-btn[data-eclipse]').forEach(btn => {
            btn.addEventListener('click', () => {
                simulatedEclipse = btn.dataset.eclipse;
                updateAstronomicalState();
            });
        });

        // City selector
        const citySelect = document.getElementById('debug-city-select');
        if (citySelect) {
            citySelect.addEventListener('change', (e) => {
                const tz = e.target.value;
                simulatedLocation = window.AstronomyEngine.resolveLocationFromTimezone(tz);
                updateAstronomicalState();
            });
        }
    }

    /**
     * Compute and render the living astronomical state onto the city scene
     */
    async function updateAstronomicalState() {
        if (!window.AstronomyEngine) return;

        const date = simulatedDate || new Date();
        astroContext = await window.AstronomyEngine.resolveAstronomicalEnvironment(date, simulatedLocation);

        const solar = astroContext.solar;
        const realLunar = astroContext.lunar;
        const location = astroContext.location;
        const elev = solar.elevation;

        // Elements
        const sky = document.getElementById('city-sky-backdrop');
        const sun = document.getElementById('celestial-sun');
        const moon = document.getElementById('celestial-moon');
        const moonLitPath = document.getElementById('moon-lit-path');
        const cityLabel = document.getElementById('hud-city-label');
        const timeLabel = document.getElementById('hud-time-label');
        const phaseTag = document.getElementById('hud-phase-tag');
        const telemetryText = document.getElementById('debug-telemetry-text');
        const viewport = document.getElementById('city-viewport-stage');
        const debugMoonPhaseName = document.getElementById('debug-moon-phase-name');

        // Formatted local time
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

        // Update HUD
        if (cityLabel) cityLabel.textContent = `${location.city.toUpperCase()}, ${location.country.toUpperCase()}`;
        if (timeLabel) timeLabel.textContent = timeStr;

        // Reset sky classes
        if (sky) sky.className = 'city-sky-backdrop';
        if (viewport) viewport.classList.remove('solar-eclipse-active', 'lunar-eclipse-active');

        // ------------------------------------------------------------------
        // Lunar Phase Geometry Calculation & Vector SVG Render
        // ------------------------------------------------------------------
        const activeMoonProgress = (simulatedMoonProgress !== null) ? simulatedMoonProgress : realLunar.phaseProgress;
        const activeLunarDesc = getLunarDescription(activeMoonProgress);

        if (debugMoonPhaseName) {
            const modeNote = (simulatedMoonProgress !== null) ? ' (Custom)' : ' (Auto)';
            debugMoonPhaseName.textContent = `${activeLunarDesc.icon} ${activeLunarDesc.name}${modeNote}`;
        }

        const isBloodMoon = (simulatedEclipse === 'lunar' || (astroContext.eclipse.activeEclipse && astroContext.eclipse.activeEclipse.category === 'Lunar'));
        const isSolarEclipse = (simulatedEclipse === 'solar' || (astroContext.eclipse.activeEclipse && astroContext.eclipse.activeEclipse.category === 'Solar'));

        // Generate mathematical SVG illuminated path
        const svgPathString = getMoonSVGPath(activeMoonProgress, 26);
        if (moonLitPath) {
            moonLitPath.setAttribute('d', svgPathString);
            moonLitPath.setAttribute('fill', isBloodMoon ? '#D63031' : '#F8F6EB');
        }

        // ------------------------------------------------------------------
        // Atmospheric Sky & Celestial Placement
        // ------------------------------------------------------------------
        if (isSolarEclipse) {
            if (sky) sky.classList.add('sky-solar-eclipse');
            if (viewport) viewport.classList.add('solar-eclipse-active');
            if (phaseTag) phaseTag.textContent = 'TOTAL SOLAR ECLIPSE';
            if (sun) {
                sun.style.left = '50%';
                sun.style.top = '28%';
                sun.style.opacity = '1';
            }
            if (moon) moon.style.opacity = '0';
        } else if (isBloodMoon) {
            if (sky) sky.classList.add('sky-lunar-eclipse');
            if (viewport) viewport.classList.add('lunar-eclipse-active');
            if (phaseTag) phaseTag.textContent = 'TOTAL LUNAR BLOOD MOON';
            if (sun) sun.style.opacity = '0';
            if (moon) {
                moon.style.left = '52%';
                moon.style.top = '22%';
                moon.style.opacity = '1';
            }
        } else {
            // Standard Astronomical Sky Transition
            if (elev > 40) {
                if (sky) sky.classList.add('sky-solar-noon');
                if (phaseTag) phaseTag.textContent = 'SOLAR MIDDAY';
            } else if (elev > 5) {
                if (sky) sky.classList.add('sky-daylight');
                if (phaseTag) phaseTag.textContent = 'DAYLIGHT OS';
            } else if (elev > 0) {
                const isMorn = (solar.phase === 'SUNRISE');
                if (sky) sky.classList.add(isMorn ? 'sky-sunrise' : 'sky-sunset');
                if (phaseTag) phaseTag.textContent = isMorn ? 'GOLDEN SUNRISE' : 'GOLDEN SUNSET';
            } else if (elev >= -6) {
                const isMorn = (solar.phase === 'CIVIL_DAWN');
                if (sky) sky.classList.add(isMorn ? 'sky-civil-dawn' : 'sky-civil-dusk');
                if (phaseTag) phaseTag.textContent = isMorn ? 'CIVIL DAWN' : 'CIVIL DUSK';
            } else if (elev >= -12) {
                const isMorn = (solar.phase === 'NAUTICAL_DAWN');
                if (sky) sky.classList.add(isMorn ? 'sky-nautical-dawn' : 'sky-nautical-dusk');
                if (phaseTag) phaseTag.textContent = isMorn ? 'NAUTICAL DAWN' : 'NAUTICAL DUSK';
            } else if (elev >= -18) {
                if (sky) sky.classList.add('sky-astronomical-twilight');
                if (phaseTag) phaseTag.textContent = `TWILIGHT • ${activeLunarDesc.icon} ${activeLunarDesc.name.toUpperCase()}`;
            } else {
                if (sky) sky.classList.add('sky-night');
                if (phaseTag) phaseTag.textContent = `NIGHT OS • ${activeLunarDesc.icon} ${activeLunarDesc.name.toUpperCase()}`;
            }

            // Position Sun along true celestial arc
            if (sun) {
                if (elev > -5) {
                    const xPercent = Math.min(88, Math.max(12, ((solar.azimuth - 70) / 200) * 100));
                    const yPercent = Math.max(10, 50 - (elev / 70) * 38);
                    sun.style.left = `${xPercent.toFixed(1)}%`;
                    sun.style.top = `${yPercent.toFixed(1)}%`;
                    sun.style.opacity = Math.min(1, Math.max(0, (elev + 4) / 6));
                } else {
                    sun.style.opacity = '0';
                }
            }

            // Position Moon & configure lunar phase visibility
            if (moon) {
                // Moon is visible at night, dusk, dawn, or whenever being actively simulated/tested in Astro Lab
                const isMoonTime = (elev <= 8 || simulatedMoonProgress !== null || isBloodMoon);
                if (isMoonTime) {
                    moon.style.left = (elev > 0) ? '70%' : '65%';
                    moon.style.top = '22%';
                    moon.style.opacity = '1';
                } else {
                    moon.style.opacity = '0';
                }
            }
        }

        // Telemetry Text
        if (telemetryText) {
            telemetryText.innerHTML = `
                <strong>Solar Elevation:</strong> ${elev.toFixed(1)}° (${solar.label})<br>
                <strong>Solar Azimuth:</strong> ${solar.azimuth.toFixed(1)}°<br>
                <strong>Lunar Phase:</strong> ${activeLunarDesc.icon} ${activeLunarDesc.name}<br>
                <strong>Illumination:</strong> ${activeLunarDesc.illum}% (Cycle Day ${activeLunarDesc.days})<br>
                <strong>Eclipse State:</strong> ${isSolarEclipse ? 'SOLAR ACTIVE' : (isBloodMoon ? 'LUNAR ACTIVE' : 'None active')}<br>
                <strong>Recommended Theme:</strong> ${astroContext.isDaytime ? 'LIGHT' : 'DARK'}
            `;
        }
    }

    /**
     * Smooth progressive loading status messages
     */
    function runLoadingTimeline() {
        isIntroActive = true;
        const statusText = document.getElementById('astro-status-text');
        const progressFill = document.getElementById('astro-progress-fill');

        const steps = [
            { t: 0, text: 'CALIBRATING LOCAL SKYLINE...', p: 20 },
            { t: 500, text: 'ALIGNING SOLAR HORIZON...', p: 45 },
            { t: 1100, text: 'SYNCHRONIZING LUNAR CYCLE...', p: 70 },
            { t: 1800, text: 'CONFIGURING PORTFOLIO OS...', p: 90 },
            { t: 2400, text: 'ENTERING PORTFOLIO...', p: 100 }
        ];

        steps.forEach(step => {
            setTimeout(() => {
                if (!isIntroActive) return;
                if (statusText) statusText.textContent = step.text;
                if (progressFill) progressFill.style.width = `${step.p}%`;
            }, step.t);
        });

        // Trigger cinematic camera forward dolly transition at 2.6s
        setTimeout(() => {
            if (!isIntroActive) return;
            launchPortfolioTransition();
        }, 2600);
    }

    /**
     * Camera dolly zoom forward into city street and seamless reveal of portfolio
     */
    function launchPortfolioTransition() {
        const stage = document.getElementById('city-viewport-stage');
        const loader = document.getElementById('astro-city-loader');

        if (stage) {
            stage.classList.add('city-camera-dolly-out');
        }

        // Apply synchronized Light or Dark mode to website
        const targetTheme = (astroContext && astroContext.isDaytime) ? 'light' : 'dark';
        if (window.applyTheme) {
            window.applyTheme(targetTheme);
        } else {
            const htmlEl = document.documentElement;
            if (targetTheme === 'dark') {
                htmlEl.classList.remove('light');
                htmlEl.classList.add('dark');
            } else {
                htmlEl.classList.remove('dark');
                htmlEl.classList.add('light');
            }
        }

        setTimeout(() => {
            if (loader) loader.style.opacity = '0';
        }, 250);

        setTimeout(() => {
            completeLoaderImmediately();
        }, 650);
    }

    /**
     * Finish loader and clean up
     */
    function completeLoaderImmediately() {
        isIntroActive = false;
        if (transitionTimer) clearTimeout(transitionTimer);

        const targetTheme = (astroContext && astroContext.isDaytime) ? 'light' : 'dark';
        if (window.applyTheme) {
            window.applyTheme(targetTheme);
        }

        const loader = document.getElementById('astro-city-loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            setTimeout(() => {
                loader.remove();
            }, 300);
        }

        document.body.classList.remove('astro-loader-active');
        sessionStorage.setItem('rupak_astro_loader_seen', 'true');

        window.dispatchEvent(new CustomEvent('portfolio:ready', {
            detail: { context: astroContext }
        }));
    }

    /**
     * Expose global replay function in interactive Play Mode
     */
    window.replayAstronomicalLoader = function () {
        document.documentElement.classList.remove('skip-loader-instant');
        simulatedDate = null;
        simulatedLocation = null;
        simulatedEclipse = null;
        simulatedMoonProgress = null;
        buildCityDOM();
        updateAstronomicalState();

        // Interactive Play Mode: let user play with city and astronomical lab
        isIntroActive = false; // Disable 2.6s auto-dismiss
        if (transitionTimer) clearTimeout(transitionTimer);

        const goBackBtn = document.getElementById('astro-go-back-btn');
        const skipBtn = document.getElementById('astro-skip-btn');
        const debugDrawer = document.getElementById('astro-debug-drawer');
        const debugBtn = document.getElementById('astro-debug-btn');
        const statusText = document.getElementById('astro-status-text');
        const progressFill = document.getElementById('astro-progress-fill');

        if (goBackBtn) goBackBtn.style.display = 'inline-flex';
        if (skipBtn) skipBtn.style.display = 'none';
        if (debugDrawer) debugDrawer.classList.add('is-open');
        if (debugBtn) debugBtn.classList.add('active');
        if (statusText) statusText.textContent = 'PLAY MODE • EXPLORE WITH ASTRO LAB • TAP GO BACK TO RETURN';
        if (progressFill) progressFill.style.width = '100%';
    };

    /**
     * Init entry point
     */
    async function init() {
        const urlParams = new URLSearchParams(window.location.search);
        const forceReplay = urlParams.has('intro') || urlParams.has('replay') || urlParams.has('city') || urlParams.has('preset') || urlParams.has('moon');
        const alreadySeen = sessionStorage.getItem('rupak_astro_loader_seen');

        if (!alreadySeen || forceReplay) {
            document.documentElement.classList.remove('skip-loader-instant');
            buildCityDOM();
            await updateAstronomicalState();

            // Reduced motion instant bypass
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                completeLoaderImmediately();
                return;
            }

            runLoadingTimeline();
        } else {
            const existingLoader = document.getElementById('astro-city-loader');
            if (existingLoader) existingLoader.remove();
            document.body.classList.remove('astro-loader-active');
        }

        // Attach Replay to nav button
        document.addEventListener('DOMContentLoaded', () => {
            const replayBtn = document.getElementById('replay-intro-btn');
            if (replayBtn) {
                replayBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.replayAstronomicalLoader();
                });
            }
        });
    }

    init();
})();
