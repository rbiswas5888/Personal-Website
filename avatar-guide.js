/**
 * Rupak Biswas - Unified "Ask Guide & Explore" Concierge & AI Architecture Controller
 * Consolidates RB Chat and Screen Guide into a unified interactive floating drawer.
 */

// --------------------------------------------------------------------------
// 1. Theme Management (Light Mode Default with Local Storage persistence)
// --------------------------------------------------------------------------
function initTheme() {
    const saved = localStorage.getItem('rupak_portfolio_theme');
    const theme = saved ? saved : 'light';
    applyTheme(theme);
}

function applyTheme(theme) {
    const htmlEl = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    const mobileThemeLabel = document.getElementById('mobile-theme-label');

    if (theme === 'light') {
        htmlEl.classList.remove('dark');
        htmlEl.classList.add('light');
        if (themeIcon) {
            themeIcon.setAttribute('data-lucide', 'moon');
            themeIcon.className = 'w-4 h-4 text-slate-700';
        }
        if (mobileThemeIcon) {
            mobileThemeIcon.setAttribute('data-lucide', 'moon');
            mobileThemeIcon.className = 'w-4 h-4 text-slate-700';
        }
        if (mobileThemeLabel) {
            mobileThemeLabel.textContent = 'Dark Mode';
        }
    } else {
        htmlEl.classList.remove('light');
        htmlEl.classList.add('dark');
        if (themeIcon) {
            themeIcon.setAttribute('data-lucide', 'sun');
            themeIcon.className = 'w-4 h-4 text-amber-400';
        }
        if (mobileThemeIcon) {
            mobileThemeIcon.setAttribute('data-lucide', 'sun');
            mobileThemeIcon.className = 'w-4 h-4 text-amber-400';
        }
        if (mobileThemeLabel) {
            mobileThemeLabel.textContent = 'Light Mode';
        }
    }
    localStorage.setItem('rupak_portfolio_theme', theme);
    if (window.lucide) window.lucide.createIcons();
}

function toggleTheme() {
    const current = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
}

// --------------------------------------------------------------------------
// 2. Case Study Screen Knowledge Base & Walkthroughs
// --------------------------------------------------------------------------
const caseStudyWalkthroughs = {
    'corporate-banking': {
        title: 'Corporate Digital Banking Architecture',
        client: 'Standard Chartered Bank',
        domain: 'B2B FinTech & Global Treasury OS',
        screens: [
            {
                name: 'Global Multi-Currency Liquidity Console',
                role: 'High-density real-time visibility across global accounts, balances, and nostro/vostro ledgers.',
                uxBreakdown: 'As a UX architect, the core problem was cognitive overload: corporate treasurers were flipping through 14 disconnected terminal windows. We introduced an adaptive liquidity viewport with collapsible hierarchical entity trees, instant cross-currency conversion toggles, and straight-through balance forecasts, reducing time-to-decision by 45%.'
            },
            {
                name: 'Maker/Checker Dual Authorization Workflow',
                role: 'High-risk audit-safe transaction approval pipeline.',
                uxBreakdown: 'In enterprise banking, a single misdirected $50M transfer is catastrophic. We redesigned the approval matrix with a progressive verification drawer, highlighting counterparty risk ratings, currency discrepancy badges, and real-time SWIFT gpi traceability before irreversible ledger execution.'
            },
            {
                name: 'Tokenized Design System & High-Density Tables',
                role: '12-squad unified component pipeline.',
                uxBreakdown: 'Built strict 4px grid tables with sticky frozen column headers, zebra row compliance, and inline cell editing that eliminated horizontal scroll fatigue across 1,000+ transaction batches.'
            }
        ]
    },
    'oil-gas': {
        title: 'Global Energy Order Management OS',
        client: 'ExxonMobil & Deloitte',
        domain: 'Energy OS & Refinery Supply Chain',
        screens: [
            {
                name: 'Dynamic Global Order Processing Matrix',
                role: 'High-throughput cross-border fuel procurement.',
                uxBreakdown: 'Designed an intelligent rules engine that evaluates local tariff compliance, regional demurrage liability, and port restrictions in real-time, reducing multi-stage approval from 8 steps to 3.'
            },
            {
                name: 'Multilingual & Right-To-Left (RTL) Console',
                role: 'Seamless deployment across 100+ nations in 25 languages.',
                uxBreakdown: 'Architected bidirectional layout token mapping so complex logistical diagrams and tabular data mirrored gracefully between English, Arabic, and Hebrew without breaking component hierarchy.'
            }
        ]
    },
    'tata-pay': {
        title: 'Tata Pay Payment Ecosystem',
        client: 'Tata Digital (Tata Neu)',
        domain: 'Consumer & Merchant FinTech',
        screens: [
            {
                name: '3-Screen Intent Checkout Journey',
                role: 'Frictionless multi-merchant checkout.',
                uxBreakdown: 'Examined checkout drop-offs and redesigned bank selection into a single bottom-sheet intent drawer with biometric 1-tap OTP linking, raising checkout completion by 40%.'
            },
            {
                name: 'Transparent Payment Recovery State',
                role: 'Graceful handling of NPCI banking timeouts.',
                uxBreakdown: 'Replaced cryptic banking error codes with clear, reassuring recovery states: instant retry with alternate linked cards or automated UPI auto-reversal status tracking.'
            }
        ]
    },
    'couchbase-day-0': {
        title: 'Couchbase Day 0 Admin Onboarding',
        client: 'Couchbase Capella DBaaS',
        domain: 'Cloud Database-as-a-Service',
        screens: [
            {
                name: 'Persona-Driven Cluster Provisioning',
                role: 'Onboarding DevOps, Analysts, and Developers.',
                uxBreakdown: 'Transformed a 40-step technical wizard into persona-tailored progressive disclosure paths, compressing Day 0 setup from 45 minutes to under 5 minutes.'
            },
            {
                name: 'Contextual Cluster Health Visualizer',
                role: 'Multi-region replica telemetry.',
                uxBreakdown: 'Designed real-time interactive cluster topology nodes with color-coded memory and disk IOPs thresholds, cutting support tickets by 26%.'
            }
        ]
    },
    'couchbase-app-services': {
        title: 'Capella App Services Sync Gateway',
        client: 'Couchbase Enterprise',
        domain: 'Edge Synchronization & Cloud Console',
        screens: [
            {
                name: 'Visual RBAC Security Boundary Mapper',
                role: 'Edge-to-cloud security rule authoring.',
                uxBreakdown: 'Replaced error-prone JSON configuration files with an interactive permission matrix visualizer that validates document access permissions before runtime deployment.'
            },
            {
                name: 'Live Sync Gateway Telemetry Dashboard',
                role: 'Monitoring millions of mobile edge sync events.',
                uxBreakdown: 'Constructed low-latency delta charts showing active connected devices, conflict resolution queues, and bandwidth consumption at a glance.'
            }
        ]
    },
    'warehouse-management': {
        title: 'Automotive Warehouse Management System',
        client: 'Tekion WMS',
        domain: 'Logistics & Auto Parts Supply Chain',
        screens: [
            {
                name: 'Touch-Optimized Dock Receiving Station',
                role: 'Ruggedized tablet interface for warehouse floor personnel.',
                uxBreakdown: 'Created high-contrast, glove-friendly barcode receiving workflows with auditory scan confirmations, reducing dock scan errors by 22%.'
            },
            {
                name: 'FIFO Dispatch & Bin Allocation Ledger',
                role: 'Automated warehouse routing.',
                uxBreakdown: 'Architected dynamic pick-path route guidance that sorts parts by weight and aisle proximity, boosting picker throughput by 35%.'
            }
        ]
    }
};

// --------------------------------------------------------------------------
// 3. Current Case Study Detection
// --------------------------------------------------------------------------
function detectCurrentCaseStudyKey() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('corporate-banking')) return 'corporate-banking';
    if (path.includes('oil-gas')) return 'oil-gas';
    if (path.includes('tata-pay')) return 'tata-pay';
    if (path.includes('day-0')) return 'couchbase-day-0';
    if (path.includes('app-services')) return 'couchbase-app-services';
    if (path.includes('warehouse-management')) return 'warehouse-management';
    return null;
}

let currentWalkthroughIndex = 0;

// --------------------------------------------------------------------------
// 4. Screen-by-Screen UX Walkthrough (inside Guide & Routes view)
// --------------------------------------------------------------------------
function formatMarkdownToHTML(text) {
    if (!text) return '';
    let formatted = text;
    formatted = formatted.replace(/^### (.*$)/gim, '<h5 class="font-bold text-xs mt-2.5 mb-1 text-slate-100">$1</h5>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h4 class="font-bold text-xs mt-2.5 mb-1 text-brand-cyan">$1</h4>');
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-cyan underline font-semibold hover:opacity-80 transition-opacity">$1</a>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/^[\*\-] (.*$)/gim, '<div class="flex items-start gap-1.5 my-1 ml-1"><span class="text-brand-cyan shrink-0 text-[10px]">•</span><span class="leading-relaxed">$1</span></div>');
    formatted = formatted.replace(/^(\d+)\. (.*$)/gim, '<div class="flex items-start gap-1.5 my-1 ml-1"><span class="font-mono text-brand-cyan text-[10px] shrink-0">$1.</span><span class="leading-relaxed">$2</span></div>');
    formatted = formatted.replace(/\n\n/g, '<br><br>');
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}

async function triggerGeminiScreenWalkthrough(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const studyKey = detectCurrentCaseStudyKey();
    const bubble = document.getElementById('guide-speech-bubble');
    const walkControls = document.getElementById('guide-walkthrough-controls');
    const study = studyKey ? caseStudyWalkthroughs[studyKey] : null;

    if (!study) {
        if (bubble) {
            bubble.innerHTML = `You are currently on the executive portfolio overview. Pick any case study below or switch to <strong>Ask AI Chat</strong> to discuss UX architecture & design patterns!`;
        }
        return;
    }

    const currentScreen = study.screens[currentWalkthroughIndex];
    const totalScreens = study.screens.length;
    const apiKey = geminiApiKey || DEFAULT_GEMINI_API_KEY;

    if (bubble) {
        bubble.innerHTML = `
            <span class="inline-flex items-center gap-1.5 text-[10px] font-mono mb-1.5 guide-screen-tag">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Screen ${currentWalkthroughIndex + 1} of ${totalScreens}
            </span>
            <strong class="guide-screen-title block mb-1 font-bold text-xs">${currentScreen.name}</strong>
            <em class="text-[11px] guide-screen-role block mb-2 not-italic">${currentScreen.role}</em>
            <div class="text-xs leading-relaxed guide-screen-breakdown font-sans">${currentScreen.uxBreakdown}</div>
        `;
    }

    if (walkControls) {
        walkControls.classList.remove('hidden');
        walkControls.innerHTML = `
            <div class="flex items-center justify-between gap-2 pt-2 border-t guide-divider mt-2 text-[10px] font-mono">
                <button type="button" onclick="stepWalkthrough(-1, event)" class="px-2.5 py-1 rounded-lg guide-btn-secondary interactive ${currentWalkthroughIndex === 0 ? 'opacity-40 pointer-events-none' : ''}">
                    &larr; Prev
                </button>
                <span class="guide-screen-count">${currentWalkthroughIndex + 1} / ${totalScreens}</span>
                <button type="button" onclick="stepWalkthrough(1, event)" class="px-2.5 py-1 rounded-lg guide-btn-primary font-bold interactive ${currentWalkthroughIndex === totalScreens - 1 ? 'opacity-40 pointer-events-none' : ''}">
                    Next &rarr;
                </button>
            </div>
        `;
    }

    if (apiKey) {
        try {
            const prompt = `You are Rupak Biswas's interactive avatar guide walking a visitor through this case study.
STRICT SCOPE: UX Architecture, Usability Engineering, and Rupak Biswas's case studies only.
Case Study: ${study.title} (${study.client})
Screen: ${currentScreen.name} (${currentScreen.role})
UX Architecture: ${currentScreen.uxBreakdown}

Give a crisp, 2-3 sentence executive UX walkthrough explaining design choices, cognitive load reduction, and usability impact like a Senior Usability Director would present to C-suite leadership.`;

            let geminiText = null;
            const models = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-flash-latest'];
            for (const model of models) {
                try {
                    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ role: 'user', parts: [{ text: prompt }] }],
                            generationConfig: { temperature: 0.2, maxOutputTokens: 300 }
                        })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (geminiText) break;
                    }
                } catch (errModel) {
                    console.warn(`Model ${model} walkthrough failed:`, errModel);
                }
            }

            if (geminiText && bubble) {
                bubble.innerHTML = `
                    <span class="inline-flex items-center gap-1.5 text-[10px] font-mono mb-1.5 guide-screen-tag">
                        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        Gemini AI Walkthrough • Screen ${currentWalkthroughIndex + 1}/${totalScreens}
                    </span>
                    <strong class="guide-screen-title block mb-1 font-bold text-xs">${currentScreen.name}</strong>
                    <div class="text-xs leading-relaxed guide-screen-breakdown font-sans">${formatMarkdownToHTML(geminiText)}</div>
                `;
            }
        } catch (e) {
            console.warn('Gemini walkthrough fallback to local:', e);
        }
    }
}

function stepWalkthrough(delta, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const studyKey = detectCurrentCaseStudyKey();
    if (!studyKey || !caseStudyWalkthroughs[studyKey]) return;
    const screens = caseStudyWalkthroughs[studyKey].screens;
    currentWalkthroughIndex = Math.max(0, Math.min(screens.length - 1, currentWalkthroughIndex + delta));
    triggerGeminiScreenWalkthrough(e);
}

// --------------------------------------------------------------------------
// 5. Unified Popover & Tab State Management
// --------------------------------------------------------------------------
let guideIsOpen = false;
let currentGuideTab = 'chat'; // 'chat' or 'routes'

function switchGuideTab(tab) {
    currentGuideTab = tab;
    const tabChat = document.getElementById('tab-guide-chat');
    const tabRoutes = document.getElementById('tab-guide-routes');
    const viewChat = document.getElementById('view-guide-chat');
    const viewRoutes = document.getElementById('view-guide-routes');

    if (tab === 'chat') {
        if (tabChat) tabChat.classList.add('active');
        if (tabRoutes) tabRoutes.classList.remove('active');
        if (viewChat) viewChat.classList.remove('hidden');
        if (viewRoutes) viewRoutes.classList.add('hidden');
    } else {
        if (tabRoutes) tabRoutes.classList.add('active');
        if (tabChat) tabChat.classList.remove('active');
        if (viewRoutes) viewRoutes.classList.remove('hidden');
        if (viewChat) viewChat.classList.add('hidden');
    }
    if (window.lucide) window.lucide.createIcons();
}

function openGuidePopover(e, promptKey = null) {
    if (e && e.stopPropagation) e.stopPropagation();
    const guidePopover = document.getElementById('guide-popover');
    const guideBadgeHint = document.getElementById('guide-badge-hint');
    if (!guidePopover) return;

    guideIsOpen = true;
    guidePopover.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
    guidePopover.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
    if (guideBadgeHint) guideBadgeHint.classList.add('hidden');

    // If a prompt key is passed (e.g. from hero quick-prompt chips)
    if (promptKey) {
        switchGuideTab('chat');
        setTimeout(() => {
            handlePromptClick(promptKey);
        }, 150);
    }

    if (window.lucide) lucide.createIcons();
}

function closeGuidePopover(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const guidePopover = document.getElementById('guide-popover');
    const guideBadgeHint = document.getElementById('guide-badge-hint');
    if (!guidePopover) return;

    guideIsOpen = false;
    guidePopover.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
    guidePopover.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
    if (guideBadgeHint) guideBadgeHint.classList.remove('hidden');
}

function toggleGuidePopover(forceState = null, e = null) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (forceState === true) {
        openGuidePopover(e);
    } else if (forceState === false) {
        closeGuidePopover(e);
    } else {
        if (guideIsOpen) {
            closeGuidePopover(e);
        } else {
            openGuidePopover(e);
        }
    }
}

// --------------------------------------------------------------------------
// 6. RB Chat Conversational AI Engine & Knowledge Base
// --------------------------------------------------------------------------
const DEFAULT_GEMINI_API_KEY = "AQ.Ab8RN6IqA2exyVMXrVrYUYDL7h7YYzqoixY_MaKm5b6cWrmXHQ";
const savedGeminiKey = localStorage.getItem('rupak_gemini_api_key');
let geminiApiKey = (savedGeminiKey === 'disabled') ? '' : (savedGeminiKey || DEFAULT_GEMINI_API_KEY);

const knowledgeBase = {
    'greeting': `<strong>[ASK GUIDE & EXPLORE ONLINE]</strong> Welcome to Rupak Biswas's interactive portfolio concierge, powered by Google Gemini AI.<br><br>I am strictly specialized in <strong>UX/UI Design Knowledge</strong> (usability heuristics, cognitive load reduction, design systems, human factors) and <strong>Rupak Biswas's Enterprise Blueprints</strong> across FinTech, Energy, and SaaS.<br><br>Ask any question about UX strategy, usability architecture, or Rupak's case studies below!`,
    'who-is-rupak': `<strong>Rupak Biswas</strong> is a Senior Design Leader with 11+ years of enterprise UX leadership and CUA™ (Certified Usability Analyst) credentials from Human Factors International. Formerly spearheading digital transformation for global institutions across B2B FinTech, Energy, and SaaS, Rupak transforms complex, high-risk legacy workflows into elegant, high-yield digital platforms. Currently based in Mumbai, orchestrating global design teams.`,
    'systems-over-screens': `<em>"Systems over screens"</em> is Rupak's foundational philosophy. Mockups and UI screens are temporary; underlying design systems, data architecture, governance, and tokenized component pipelines are permanent. Rupak prioritizes systemic coherence—ensuring regulatory compliance, engineering alignment, and scalability across 100+ global markets over superficial aesthetic polish.`,
    'vibe-coding': `<strong>Vibe Coding</strong> represents the friction-free synthesis of design intent (Figma) and front-end engineering execution (VS Code) powered by modern AI agents. By leveraging natural language prompts, automated component pipelines, and LLM-assisted UI engineering, Rupak bridges the gap between design directors and developers—reducing product release cycles from months to days and cutting technical debt by up to 40%.`,
    'ux-design': `<strong>Enterprise UX Architecture & Usability Engineering</strong><br><br>With 11+ years of design leadership and CUA™ (Certified Usability Analyst) credentials from Human Factors International, Rupak approaches enterprise UX as a <em>systemic engineering discipline</em>:<br><br>
    • <strong>Cognitive Load Reduction</strong>: Streamlining dense institutional workflows (treasury consoles, refinery matrices) with progressive disclosure, mental model alignment, and hierarchical data chunking.<br>
    • <strong>Deterministic Governance & Risk Mitigation</strong>: Architecting strict Maker-Checker approval matrices, immutable audit ledgers, and regulatory compliance (SWIFT gpi, NPCI, RBI, customs laws).<br>
    • <strong>Tokenized Design Systems</strong>: Constructing strict 4px/8px component architectures with semantic tokens that synchronize directly between Figma and production code across multi-squad teams.<br>
    • <strong>Heuristic Rigor & Quantitative UX ROI</strong>: Measuring outcomes through STP (Straight-Through-Processing) rates, Time-to-Value (TTV), error reduction, and task completion speed.`,
    'ai-ux-design': `<strong>AI + UX Design: Principles & Agentic Interfaces</strong><br><br>Rupak pioneers the synthesis of generative AI and human-centered enterprise product design:<br><br>
    • <strong>Intent-Driven UX</strong>: Shifting from rigid hierarchical menus to contextual, predictive interfaces that understand user intent and synthesize complex data into actionable briefs.<br>
    • <strong>Vibe Coding & Automated Pipelines</strong>: Merging Figma design tokens directly with LLM-assisted code generation (VS Code, cursor, agentic workflows), cutting release cycles from months to days.<br>
    • <strong>AI Trust & Latency Masking</strong>: Designing progressive disclosure for AI reasoning (streaming tokens, optimistic UI, reasoning status indicators) and clear attribution to prevent hallucinations.<br>
    • <strong>Human-in-the-Loop (HITL) Guardrails</strong>: Ensuring enterprise AI tools act as copilots with explicit user verification for high-risk transactional execution (banking, energy commerce).`,
    'corporate-banking': `<strong>Corporate Digital Banking</strong> (Standard Chartered Bank)<br>
    • <strong>Domain</strong>: Tier-1 Institutional Banking & Multi-Currency Liquidity ($100B+ daily flow).<br>
    • <strong>Core Challenge</strong>: Convoluted treasury workflows and high-risk legacy approval friction across 14 disconnected terminal windows.<br>
    • <strong>Architecture & ROI</strong>: High-density liquidity consoles, Maker/Checker dual authorization, and SWIFT gpi audit ledgers. Modernized daily flow with +38% STP rate and 45% faster executive decisions.<br><br>
    <a href="case-study-corporate-banking.html" class="text-brand-cyan underline font-semibold">Explore Full Corporate Banking Case Study &rarr;</a>`,
    'oil-gas': `<strong>Global Energy Commerce OS</strong> (ExxonMobil & Deloitte)<br>
    • <strong>Domain</strong>: Enterprise Global Order Management & Refinery Supply Chain (100+ nations).<br>
    • <strong>Core Challenge</strong>: Disparate regional order flows across 100+ nations with strict customs laws.<br>
    • <strong>Architecture & ROI</strong>: Built a unified dynamic rules engine with 25 localized languages (including RTL Arabic/Hebrew) and WCAG AAA compliance, cutting order processing latency by 40%.<br><br>
    <a href="case-study-oil-gas.html" class="text-brand-cyan underline font-semibold">Explore Full Energy OS Case Study &rarr;</a>`,
    'tata-pay': `<strong>Tata Pay UPI Ecosystem</strong> (Tata Digital / Tata Neu)<br>
    • <strong>Domain</strong>: High-Concurrency Consumer UPI Payments & Super App Checkout.<br>
    • <strong>Core Challenge</strong>: High checkout drop-offs and cognitive burden during bank linking.<br>
    • <strong>Architecture & ROI</strong>: Streamlined 3-screen intent journey, biometric PIN verification, and transparent failure recovery, achieving +40% adoption and 42% fewer payment steps.<br><br>
    <a href="case-study-tata-pay.html" class="text-brand-cyan underline font-semibold">Explore Full Tata Pay Case Study &rarr;</a>`,
    'couchbase-day-0': `<strong>Couchbase Day 0 Admin UX</strong> (Couchbase Capella DBaaS)<br>
    • <strong>Domain</strong>: Cloud Database-as-a-Service Onboarding & Cluster Orchestration.<br>
    • <strong>Core Challenge</strong>: Steep initial setup friction causing high Day 1 support churn.<br>
    • <strong>Architecture & ROI</strong>: Created progressive disclosure persona paths (DevOps, Analyst, Developer) with in-browser query playgrounds, compressing Time-to-Value (TTV) under 5 mins and reducing support tickets by 26%.<br><br>
    <a href="case-study-couchbase-day-0.html" class="text-brand-cyan underline font-semibold">Explore Full Couchbase Day 0 Case Study &rarr;</a>`,
    'couchbase-app-services': `<strong>Capella App Services</strong> (Couchbase Enterprise)<br>
    • <strong>Domain</strong>: Edge Synchronization, API Gateways & Zero-Server Data Routing.<br>
    • <strong>Core Challenge</strong>: Complex edge security configurations leading to configuration errors.<br>
    • <strong>Architecture & ROI</strong>: Designed self-service endpoint provisioning with visual RBAC security boundary mapping, compressing developer integration from weeks to minutes.<br><br>
    <a href="case-study-couchbase-app-services.html" class="text-brand-cyan underline font-semibold">Explore Full App Services Case Study &rarr;</a>`,
    'warehouse-management': `<strong>Automotive ERP & Warehouse Management System</strong> (Tekion WMS)<br>
    • <strong>Domain</strong>: High-Velocity Dealership Supply Chain & Parts Fulfillment.<br>
    • <strong>Core Challenge</strong>: Freight blindspots on arrival docks and rigid AS400 mainframe legacy constraints.<br>
    • <strong>Architecture & ROI</strong>: Integrated real-time RFID scanner telemetry, advance freight manifests, and FIFO dispatch ledgers, achieving -22% scanning errors and +35% receiving throughput.<br><br>
    <a href="case-study-warehouse-management.html" class="text-brand-cyan underline font-semibold">Explore Full Warehouse Management Case Study &rarr;</a>`,
    'projects-overview': `<strong>Rupak Biswas — Six Production Blueprints in Brief</strong>:<br><br>
    1. <a href="case-study-corporate-banking.html" class="text-brand-cyan underline font-semibold">Corporate Digital Banking</a> (Standard Chartered): $100B+ daily flow, multi-currency liquidity console, Maker/Checker governance (+38% STP rate).<br>
    2. <a href="case-study-oil-gas.html" class="text-brand-cyan underline font-semibold">Global Energy OS</a> (ExxonMobil/Deloitte): Unified rules engine, 100+ countries, 25 languages including RTL Arabic/Hebrew (-40% order latency).<br>
    3. <a href="case-study-tata-pay.html" class="text-brand-cyan underline font-semibold">Tata Pay UPI Ecosystem</a> (Tata Digital): 3-screen intent checkout, biometric verification (+40% checkout adoption).<br>
    4. <a href="case-study-couchbase-day-0.html" class="text-brand-cyan underline font-semibold">Couchbase Day 0 Admin UX</a> (Capella DBaaS): Persona onboarding paths, TTV under 5 mins (-26% support tickets).<br>
    5. <a href="case-study-couchbase-app-services.html" class="text-brand-cyan underline font-semibold">Capella App Services</a> (Couchbase): Visual RBAC security mapper, edge sync telemetry (integration in minutes).<br>
    6. <a href="case-study-warehouse-management.html" class="text-brand-cyan underline font-semibold">Automotive ERP & WMS</a> (Tekion): Ruggedized glove-friendly UI, RFID telemetry, FIFO dispatch (+35% throughput).<br><br>
    <em>Type any project name above or click a chip for a detailed breakdown.</em>`,
    'initiate-protocol': `Protocol <strong>ENGAGED</strong>. Rupak is available for Senior Design leadership, enterprise UX strategy, and global product consulting. Reach Rupak directly at <a href="mailto:rbiswas5888@gmail.com" class="text-brand-cyan underline font-mono">rbiswas5888@gmail.com</a>.`,
    'off-topic-denial': `I am strictly specialized as <strong>Rupak Biswas's Portfolio & UX Architecture Concierge</strong>.<br><br>My scope is strictly restricted to <strong>UX/UI design knowledge</strong> (usability heuristics, cognitive load reduction, design systems, interaction patterns, accessibility) and <strong>Rupak Biswas's enterprise blueprints</strong>.<br><br>I cannot assist with general knowledge, pop culture, non-UX coding, or unrelated topics. Please feel free to ask any UX or portfolio questions!`
};

const promptLabels = {
    'who-is-rupak': 'Who is Rupak?',
    'ux-design': 'What is your UX Design Philosophy?',
    'ai-ux-design': 'How do you approach AI + UX Design?',
    'projects-overview': 'Explain your projects in brief',
    'corporate-banking': 'Tell me about Corporate Banking',
    'oil-gas': 'Tell me about Global Energy OS',
    'tata-pay': 'Tell me about Tata Pay',
    'couchbase-day-0': 'Tell me about Couchbase Day 0',
    'couchbase-app-services': 'Tell me about Capella App Services',
    'warehouse-management': 'Tell me about Automotive WMS',
    'systems-over-screens': 'What is Systems over screens?',
    'vibe-coding': 'Explain Vibe Coding',
    'initiate-protocol': 'Initiate Protocol & Contact'
};

function isPortfolioOrUXRelated(query) {
    if (!query) return false;
    const q = query.toLowerCase().replace(/[!.,?]+$/, '').trim();

    // Friendly greetings and standard assistant inquiries
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'help', 'start', 'test', 'who are you', 'what can you do', 'how can you help', 'what is this'];
    if (greetings.some(g => q === g || q.startsWith(g + ' ') || q.endsWith(' ' + g))) {
        return true;
    }

    // Explicit off-topic blockers
    const offTopicBlockers = [
        'weather in', 'weather forecast', 'recipe for', 'how to cook',
        'capital of', 'president of', 'prime minister of', 'who won the', 'super bowl', 'world cup', 'cricket score',
        'movie plot', 'song lyrics', 'celebrity', 'horoscope', 'tell me a joke', 'tell me a riddle',
        'write python script to', 'write java code to', 'write c++ code to', 'sql query to create table'
    ];
    for (const blocker of offTopicBlockers) {
        if (q.includes(blocker) && !q.includes('rupak') && !q.includes('ux') && !q.includes('ui') && !q.includes('design')) {
            return false;
        }
    }

    const keywords = [
        // Rupak & Portfolio specifics
        'rupak', 'biswas', 'who is', 'who are you', 'designer', 'portfolio', 'case study', 'case studies', 
        'project', 'projects', 'brief', 'overview', 'work', 'book of work', 'blueprint', 'blueprints', 
        'bio', 'background', 'about', 'career', 'role', 'resume', 'contact', 'email', 'hire', 'mumbai', 
        'protocol', 'reach', 'linkedin', 'experience', 'standard chartered', 'scb', 'treasury', 'liquidity',
        'exxon', 'exxonmobil', 'deloitte', 'energy', 'refinery', 'tata', 'tata pay', 'tata neu', 'upi',
        'couchbase', 'capella', 'day 0', 'day zero', 'app service', 'edge sync', 'tekion', 'warehouse',
        'wms', 'systems over screens', 'vibe coding',
        
        // UX / UI / Usability Domain Knowledge
        'ux', 'ui', 'user experience', 'user interface', 'product design', 'interaction design',
        'usability', 'heuristic', 'heuristics', 'nielsen', 'norman', 'cua', 'certified usability',
        'human factors', 'cognitive', 'mental model', 'cognitive load', 'progressive disclosure',
        'affordance', 'signifier', 'feedback loop', 'fitts', 'hick', 'jakob', 'gestalt', 'miller',
        'design system', 'design tokens', 'tokens', 'atomic design', 'figma', 'wireframe', 'prototype',
        'user research', 'persona', 'personas', 'journey map', 'user journey', 'service blueprint',
        'card sorting', 'tree testing', 'a/b test', 'usability testing', 'user testing', 'sus score',
        'accessibility', 'a11y', 'wcag', 'color contrast', 'screen reader', 'keyboard navigation',
        'information architecture', 'navigation', 'micro-interaction', 'animation', 'typography',
        'hierarchy', 'white space', 'grid', '4px', '8px', 'responsive', 'mobile-first', 'dark mode',
        'light mode', 'modal', 'drawer', 'popover', 'stepper', 'wizard', 'form design', 'checkout',
        'onboarding', 'error prevention', 'error handling', 'maker checker', 'governance',
        'straight through processing', 'stp', 'time to value', 'ttv', 'conversion rate',
        
        // AI + UX & Modern Tech Synthesis
        'ai', 'artificial intelligence', 'agentic', 'intent-driven', 'llm', 'generative ai',
        'copilot', 'human in the loop', 'hitl', 'latency masking', 'streaming token', 'hallucination'
    ];
    return keywords.some(k => q.includes(k));
}

function appendMessage(sender, htmlText) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'flex items-start justify-end gap-2.5' : 'flex items-start gap-2.5';

    const avatar = sender === 'user' 
        ? `<div class="w-6 h-6 rounded-lg bg-brand-cyan text-black font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">YOU</div>`
        : `<div class="w-6 h-6 rounded-lg guide-bubble-box border text-brand-cyan flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <i data-lucide="bot" class="w-3.5 h-3.5"></i>
           </div>`;

    const bubbleClass = sender === 'user'
        ? 'guide-chat-bubble-user rounded-2xl rounded-tr-none px-3.5 py-2.5 max-w-[85%] text-xs font-sans shadow-sm'
        : 'guide-chat-bubble-ai border rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[85%] font-sans text-xs leading-relaxed shadow-sm';

    msgDiv.innerHTML = sender === 'user' ? `<div class="${bubbleClass}">${htmlText}</div>${avatar}` : `${avatar}<div class="${bubbleClass}">${htmlText}</div>`;
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
}

function triggerAIResponse(replyHtml, autoScrollTarget = null) {
    const typingIndicator = document.getElementById('typing-indicator');
    const typingStatusText = document.getElementById('typing-status-text');
    const chatMessages = document.getElementById('chat-messages');

    if (typingStatusText) typingStatusText.textContent = geminiApiKey ? 'Gemini AI reasoning...' : 'Concierge reasoning...';
    if (typingIndicator) typingIndicator.classList.remove('hidden');
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        if (typingIndicator) typingIndicator.classList.add('hidden');
        appendMessage('system', replyHtml);

        if (autoScrollTarget) {
            setTimeout(() => {
                const targetEl = document.getElementById(autoScrollTarget);
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        }
    }, 400);
}

function handlePromptClick(key) {
    appendMessage('user', promptLabels[key] || key);
    triggerAIResponse(knowledgeBase[key] || 'Topic retrieved.');
}

async function queryGemini(userQuery) {
    const apiKey = geminiApiKey || DEFAULT_GEMINI_API_KEY;
    if (!apiKey) return null;

    const systemPrompt = `You are the AI Concierge for Rupak Biswas's interactive enterprise UX portfolio and a Senior Usability & Product Design Director, powered by Google Gemini.

### 1. MISSION & IDENTITY
- Name: Ask Guide & Explore.
- Role: An advanced AI UX Concierge specialized EXCLUSIVELY in two domains:
  1. Professional UX/UI design knowledge, usability engineering, design systems, human factors, interaction design, CUA™ heuristics, cognitive psychology in interfaces, and AI+UX design patterns.
  2. Rupak Biswas's 11+ years of enterprise UX leadership, career credentials, design philosophies, and his six production case studies.
- Persona: Executive, articulate, precise, and authoritative. Speak in the third person when referring to Rupak.

### 2. STRICT DOMAIN BOUNDARY & REFUSAL POLICY
CRITICAL GUARDRAIL: You are STRICTLY RESTRICTED to UX design knowledge and Rupak Biswas's portfolio only.
- GREETINGS & CAPABILITY INQUIRIES: For greetings like "Hello", "Hi", "Hey", "Good morning", or inquiries like "What can you do?" or "Help", warmly welcome the visitor to Rupak Biswas's portfolio concierge, highlight your specialization in Enterprise UX Architecture & Rupak's 6 case studies, and invite them to explore or ask any question!
- If a query is NOT about UX/UI design, usability engineering, interaction design, design systems, or Rupak Biswas's portfolio/work/case studies/contact info, you MUST POLITELY AND FIRMLY REFUSE.
- Exact refusal response when asked off-topic questions: "I am strictly specialized as Rupak Biswas's Portfolio & UX Architecture Concierge. I can only discuss UX/UI design methodology, usability engineering, design systems, and Rupak's enterprise blueprints. How can I assist you with UX design or Rupak's work?"
- NEVER answer questions about general knowledge (geography, history, pop culture, sports), unrelated coding or scripting languages, math, cooking/recipes, news/politics, or personal questions outside Rupak's professional scope.

### 3. RUPAK BISWAS DOSSIER & CREDENTIALS
- **Profile**: Senior Design Leader with 11+ years of enterprise UX leadership and CUA™ (Certified Usability Analyst) credentials from Human Factors International. Formerly spearheading digital transformation for global institutions across B2B FinTech, Energy, and SaaS. Currently based in Mumbai, orchestrating global design teams.
- **Foundational Philosophies**:
  - *Systems Over Screens*: Screens and mockups are transient; tokenized design systems, deterministic governance, and data architectures are durable.
  - *Vibe Coding & Agentic AI*: Bridging Figma design tokens with LLM code generation and AI agents to collapse design-to-production cycles from months to days, reducing technical debt.
  - *Quantitative Usability*: Measuring success through STP (Straight-Through-Processing) lift, Time-to-Value (TTV) compression, error rate reduction, and cognitive load minimization.
- **Contact Protocol**: Email rbiswas5888@gmail.com.

### 4. SIX PRODUCTION BLUEPRINTS
When discussing projects, provide these precise facts and include clickable links:
1. **Corporate Digital Banking** (Standard Chartered Bank): Tier-1 Institutional Banking & Multi-Currency Liquidity ($100B+ daily flow). Solved cognitive overload from 14 disconnected terminals. Designed high-density liquidity consoles, Maker/Checker dual authorization, and SWIFT gpi audit ledgers (+38% STP rate, 45% faster decisions). Link: <a href="case-study-corporate-banking.html" class="text-brand-cyan underline font-semibold">Corporate Banking Case Study &rarr;</a>
2. **Global Energy Commerce OS** (ExxonMobil & Deloitte): Enterprise Order Management & Refinery Supply Chain across 100+ nations. Built a unified dynamic rules engine with 25 localized languages (including bidirectional RTL Arabic/Hebrew) and WCAG AAA compliance (-40% order latency). Link: <a href="case-study-oil-gas.html" class="text-brand-cyan underline font-semibold">Energy OS Case Study &rarr;</a>
3. **Tata Pay UPI Ecosystem** (Tata Digital / Tata Neu): High-concurrency consumer UPI checkout. Streamlined 3-screen intent journey, biometric PIN verification, instant bank linking, and transparent failure recovery (+40% adoption, 42% fewer payment steps). Link: <a href="case-study-tata-pay.html" class="text-brand-cyan underline font-semibold">Tata Pay Case Study &rarr;</a>
4. **Couchbase Day 0 Admin UX** (Couchbase Capella DBaaS): Cloud DBaaS onboarding and cluster orchestration. Built progressive disclosure persona paths (DevOps, Analyst, Developer) with in-browser query playgrounds (TTV < 5 mins, -26% support tickets). Link: <a href="case-study-couchbase-day-0.html" class="text-brand-cyan underline font-semibold">Couchbase Day 0 Case Study &rarr;</a>
5. **Capella App Services** (Couchbase Enterprise): Edge Synchronization, API Gateways & Zero-Server Data Routing. Designed self-service endpoint provisioning with visual RBAC security boundary mapping (compressed developer integration from weeks to minutes). Link: <a href="case-study-couchbase-app-services.html" class="text-brand-cyan underline font-semibold">App Services Case Study &rarr;</a>
6. **Automotive ERP & WMS** (Tekion WMS): High-velocity dealership supply chain & parts fulfillment. High-contrast glove-friendly touch UI, RFID scanner telemetry, advance manifests, and FIFO dispatch (-22% scan errors, +35% receiving throughput). Link: <a href="case-study-warehouse-management.html" class="text-brand-cyan underline font-semibold">Automotive WMS Case Study &rarr;</a>

### 5. DEEP UX DESIGN EXPERTISE
You possess world-class expertise in:
- Usability engineering, Nielsen's 10 heuristics, Norman's principles, CUA™ methodology.
- Cognitive psychology in UI (Hick's Law, Fitts's Law, Miller's 7±2, Gestalt grouping, mental models).
- Enterprise design systems (token hierarchy, 4px/8px mathematical grids, accessibility WCAG 2.1 AAA).
- AI+UX design patterns (intent-driven interfaces, cognitive pacing, latency masking, human-in-the-loop guardrails).
Answer general UX design questions with deep technical substance, citing practical industry examples and connecting them to enterprise challenges.

### 6. FORMATTING RULES
- Keep responses concise, scannable, and well-structured with clear bullet points.
- Use bold text for key terms.
- For site navigation, always use markdown or HTML links to the case study pages.`;

    const models = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-flash-latest'];
    for (const model of models) {
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userQuery}` }] }
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 650
                    }
                })
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
                return formatMarkdownToHTML(rawText);
            }
        } catch (err) {
            console.warn(`Gemini model ${model} error:`, err);
        }
    }
    return null;
}

async function handleChatSubmit(event) {
    if (event && event.preventDefault) event.preventDefault();
    const chatInput = document.getElementById('chat-input');
    const typingIndicator = document.getElementById('typing-indicator');
    const typingStatusText = document.getElementById('typing-status-text');
    const chatMessages = document.getElementById('chat-messages');
    if (!chatInput) return;

    const query = chatInput.value.trim();
    if (!query) return;

    chatInput.value = '';
    appendMessage('user', query);

    // 1. Strict Domain Guardrail
    if (!isPortfolioOrUXRelated(query)) {
        triggerAIResponse(knowledgeBase['off-topic-denial']);
        return;
    }

    // 1b. Fast Welcome for Greetings & Capabilities
    const qClean = query.toLowerCase().replace(/[!.,?]+$/, '').trim();
    const isGreeting = ['hi', 'hello', 'hey', 'greetings', 'help', 'good morning', 'good afternoon', 'good evening', 'start'].some(g => qClean === g || qClean.startsWith(g + ' ') || qClean.endsWith(' ' + g));
    if (isGreeting || qClean.includes('what can you do') || qClean.includes('how can you help') || qClean.includes('what is this')) {
        triggerAIResponse(knowledgeBase['greeting']);
        return;
    }

    // 2. Query Gemini if configured
    const activeKey = geminiApiKey || DEFAULT_GEMINI_API_KEY;
    if (activeKey) {
        if (typingStatusText) typingStatusText.textContent = 'Gemini AI reasoning...';
        if (typingIndicator) typingIndicator.classList.remove('hidden');
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;

        const geminiReply = await queryGemini(query);
        if (typingIndicator) typingIndicator.classList.add('hidden');

        if (geminiReply) {
            appendMessage('system', geminiReply);
            return;
        }
    }

    // 3. Fallback Local Engine
    const qLower = query.toLowerCase();
    if (['hi', 'hello', 'hey', 'greetings', 'help', 'good morning', 'good afternoon', 'good evening', 'start'].some(g => qLower === g || qLower.startsWith(g + ' ') || qLower.endsWith(' ' + g)) || qLower.includes('what can you do') || qLower.includes('how can you help') || qLower.includes('what is this')) {
        triggerAIResponse(knowledgeBase['greeting']);
    } else if (qLower.includes('who is') || qLower.includes('who are you') || qLower.includes('rupak') || qLower.includes('about') || qLower.includes('bio') || qLower.includes('qualification')) {
        triggerAIResponse(knowledgeBase['who-is-rupak']);
    } else if (qLower.includes('ai') && (qLower.includes('ux') || qLower.includes('design') || qLower.includes('interface') || qLower.includes('agent') || qLower.includes('vibe') || qLower.includes('llm') || qLower.includes('future'))) {
        triggerAIResponse(knowledgeBase['ai-ux-design']);
    } else if (qLower.includes('ux') || qLower.includes('usability') || qLower.includes('heuristic') || qLower.includes('cua') || qLower.includes('philosophy') || qLower.includes('methodology') || qLower.includes('cognitive') || qLower.includes('design system')) {
        triggerAIResponse(knowledgeBase['ux-design']);
    } else if (qLower.includes('project') || qLower.includes('case stud') || qLower.includes('brief') || qLower.includes('overview') || qLower.includes('portfolio') || qLower.includes('work') || qLower.includes('blueprints') || qLower.includes('all')) {
        triggerAIResponse(knowledgeBase['projects-overview']);
    } else if (qLower.includes('bank') || qLower.includes('corporate') || qLower.includes('scb') || qLower.includes('standard chartered') || qLower.includes('treasury') || qLower.includes('liquidity')) {
        triggerAIResponse(knowledgeBase['corporate-banking']);
    } else if (qLower.includes('oil') || qLower.includes('gas') || qLower.includes('energy') || qLower.includes('exxon') || qLower.includes('deloitte')) {
        triggerAIResponse(knowledgeBase['oil-gas']);
    } else if (qLower.includes('tata') || qLower.includes('upi')) {
        triggerAIResponse(knowledgeBase['tata-pay']);
    } else if (qLower.includes('app service') || qLower.includes('edge sync') || qLower.includes('sync gateway')) {
        triggerAIResponse(knowledgeBase['couchbase-app-services']);
    } else if (qLower.includes('couchbase') || qLower.includes('capella') || qLower.includes('day 0') || qLower.includes('day zero') || qLower.includes('database') || qLower.includes('dbaas')) {
        triggerAIResponse(knowledgeBase['couchbase-day-0']);
    } else if (qLower.includes('warehouse') || qLower.includes('wms') || qLower.includes('tekion') || qLower.includes('supply chain') || qLower.includes('auto parts') || qLower.includes('logistics')) {
        triggerAIResponse(knowledgeBase['warehouse-management']);
    } else if (qLower.includes('system') || qLower.includes('screen')) {
        triggerAIResponse(knowledgeBase['systems-over-screens']);
    } else if (qLower.includes('vibe') || qLower.includes('coding')) {
        triggerAIResponse(knowledgeBase['vibe-coding']);
    } else if (qLower.includes('contact') || qLower.includes('email') || qLower.includes('hire') || qLower.includes('talk') || qLower.includes('resume') || qLower.includes('protocol') || qLower.includes('reach')) {
        triggerAIResponse(knowledgeBase['initiate-protocol']);
    } else {
        triggerAIResponse(knowledgeBase['projects-overview']);
    }
}

function resetChat() {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        appendMessage('system', knowledgeBase['greeting']);
    }
    if (chatInput) chatInput.value = '';
}

// --------------------------------------------------------------------------
// 7. Google Gemini Key Modal Controller
// --------------------------------------------------------------------------
function updateGeminiUIState() {
    const aiEngineBadge = document.getElementById('ai-engine-badge');
    const geminiBtnLabel = document.getElementById('gemini-btn-label');
    const geminiDisconnectBtn = document.getElementById('gemini-disconnect-btn');
    const geminiKeyInput = document.getElementById('gemini-key-input');
    const geminiToggleBtn = document.getElementById('gemini-toggle-btn');

    const activeKey = geminiApiKey || DEFAULT_GEMINI_API_KEY;

    if (activeKey && geminiApiKey !== '') {
        if (aiEngineBadge) {
            aiEngineBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Gemini AI Active`;
            aiEngineBadge.className = 'text-[9px] font-mono px-1.5 py-0.5 rounded-full border border-cyan-500/40 text-cyan-300 bg-cyan-500/10';
        }
        if (geminiBtnLabel) geminiBtnLabel.textContent = 'Gemini AI Active';
        if (geminiDisconnectBtn) geminiDisconnectBtn.classList.remove('hidden');
        if (geminiKeyInput) geminiKeyInput.value = activeKey;
        if (geminiToggleBtn) geminiToggleBtn.title = 'Google Gemini AI Active';
    } else {
        if (aiEngineBadge) {
            aiEngineBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Portfolio AI`;
            aiEngineBadge.className = 'text-[9px] font-mono px-1.5 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
        }
        if (geminiBtnLabel) geminiBtnLabel.textContent = 'Google Gemini';
        if (geminiDisconnectBtn) geminiDisconnectBtn.classList.add('hidden');
        if (geminiKeyInput) geminiKeyInput.value = '';
        if (geminiToggleBtn) geminiToggleBtn.title = 'Connect Google Gemini API';
    }
}

function openGeminiModal() {
    const geminiModal = document.getElementById('gemini-modal');
    if (geminiModal) {
        geminiModal.classList.remove('opacity-0', 'pointer-events-none');
    }
}

function closeGeminiModal() {
    const geminiModal = document.getElementById('gemini-modal');
    if (geminiModal) {
        geminiModal.classList.add('opacity-0', 'pointer-events-none');
    }
}

function saveGeminiKey() {
    const geminiKeyInput = document.getElementById('gemini-key-input');
    const val = geminiKeyInput ? geminiKeyInput.value.trim() : '';
    if (val) {
        geminiApiKey = val;
        localStorage.setItem('rupak_gemini_api_key', val);
    } else {
        geminiApiKey = DEFAULT_GEMINI_API_KEY;
        localStorage.removeItem('rupak_gemini_api_key');
    }
    updateGeminiUIState();
    closeGeminiModal();
    appendMessage('system', `<strong>[INTEGRATION ACTIVE]</strong> Google Gemini connected successfully. Responses are powered by live Gemini AI with strict UX & portfolio guardrails.`);
}

function disconnectGeminiKey() {
    geminiApiKey = '';
    localStorage.setItem('rupak_gemini_api_key', 'disabled');
    updateGeminiUIState();
    closeGeminiModal();
    appendMessage('system', `<strong>[LOCAL ENGINE ENGAGED]</strong> Google Gemini disconnected. Switched back to the local Portfolio AI Engine.`);
}

// --------------------------------------------------------------------------
// 8. Global Initializer
// --------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateGeminiUIState();

    // Initialize initial greeting if chat messages element exists
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages && chatMessages.children.length === 0) {
        appendMessage('system', knowledgeBase['greeting']);
    }

    // Auto-scroll input into view on mobile virtual keyboard focus
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('focus', () => {
            setTimeout(() => {
                chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    }

    // Dismiss guide popover when tapping or clicking outside (mobile & desktop)
    document.addEventListener('pointerdown', (e) => {
        if (!guideIsOpen) return;
        const widget = document.getElementById('portfolio-guide-widget');
        const modal = document.getElementById('gemini-modal');
        if (widget && widget.contains(e.target)) return;
        if (modal && modal.contains(e.target)) return;
        if (e.target.closest && e.target.closest('button[onclick*="openGuidePopover"], a[onclick*="openGuidePopover"], button[onclick*="toggleGuidePopover"]')) return;
        closeGuidePopover(e);
    });

    // If on a case study page, prepare the avatar speech bubble
    const studyKey = detectCurrentCaseStudyKey();
    const bubble = document.getElementById('guide-speech-bubble');
    const walkControls = document.getElementById('guide-walkthrough-controls');
    if (studyKey && caseStudyWalkthroughs[studyKey]) {
        const study = caseStudyWalkthroughs[studyKey];
        if (bubble) {
            bubble.innerHTML = `Welcome to the <strong>${study.title}</strong> blueprint. Would you like me to walk you through the key enterprise UX decisions screen by screen?`;
        }
        if (walkControls) {
            walkControls.classList.remove('hidden');
            walkControls.innerHTML = `
                <button type="button" onclick="triggerGeminiScreenWalkthrough(event)" class="w-full py-2 px-3 rounded-xl guide-btn-primary font-bold text-xs font-mono transition-all flex items-center justify-center gap-1.5 shadow-sm interactive mt-2">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                    <span>Start Screen-by-Screen Walkthrough</span>
                </button>
            `;
        }
    }
});

// Global API exposure
Object.defineProperty(window, 'guideIsOpen', { get: () => guideIsOpen, set: (v) => { guideIsOpen = v; }, configurable: true });
window.openGuidePopover = openGuidePopover;
window.closeGuidePopover = closeGuidePopover;
window.toggleGuidePopover = toggleGuidePopover;
window.switchGuideTab = switchGuideTab;
window.stepWalkthrough = stepWalkthrough;
window.triggerGeminiScreenWalkthrough = triggerGeminiScreenWalkthrough;
window.handlePromptClick = handlePromptClick;
window.handleChatSubmit = handleChatSubmit;
window.resetChat = resetChat;
window.openGeminiModal = openGeminiModal;
window.closeGeminiModal = closeGeminiModal;
window.saveGeminiKey = saveGeminiKey;
window.disconnectGeminiKey = disconnectGeminiKey;
window.toggleTheme = toggleTheme;

// --------------------------------------------------------------------------
// 9. Anti-Figma Plugin, Anti-Iframe Capture & Design Asset Protection System
// --------------------------------------------------------------------------
(function initAntiCapture() {
    if (window.top !== window.self) {
        try {
            window.top.location = window.self.location;
        } catch (e) {
            document.documentElement.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#0D0D0F;color:#8B75FF;font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:32px;">
                    <div style="font-size:36px;margin-bottom:16px;">🛡️</div>
                    <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;color:#F5F5F5;">Automated Capture & Embedding Restricted</h2>
                    <p style="font-size:14px;color:#85858E;max-width:440px;line-height:1.6;">Direct browser access required. This portfolio is protected against third-party design scrapers and Figma capture plugins.</p>
                </div>
            `;
        }
    }

    // Text selection prevention without suppressing mobile/tablet touch gestures
    document.addEventListener('selectstart', (e) => {
        const target = e.target;
        if (!target) return;
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
        if (target.closest && target.closest('button, a, [role="button"], select, #portfolio-guide-widget, #guide-popover, #gemini-modal, .interactive')) {
            return;
        }
        // Never cancel tap gestures on touch devices
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
            return;
        }
        e.preventDefault();
    });

    document.addEventListener('copy', (e) => {
        const target = e.target;
        if (!target) return;
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
        e.preventDefault();
        if (e.clipboardData) {
            e.clipboardData.setData('text/plain', 'Rupak Biswas - Senior Designer Portfolio (Protected Content)');
        }
    });

    document.addEventListener('dragstart', (e) => {
        const target = e.target;
        if (target && target.closest && target.closest('#portfolio-guide-widget, #guide-popover, input, textarea')) return;
        e.preventDefault();
    });

    document.addEventListener('contextmenu', (e) => {
        const target = e.target;
        if (!target) return;
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        if (target.closest && target.closest('button, a, [role="button"], #portfolio-guide-widget, #guide-popover, #gemini-modal, .interactive')) {
            return;
        }
        // Allow mobile touch/long-press gestures
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
            return;
        }
        e.preventDefault();
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && ['s', 'u', 'p'].includes(e.key.toLowerCase())) {
            e.preventDefault();
            return false;
        }
    });
})();
