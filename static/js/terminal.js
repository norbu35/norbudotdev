// Norbu.dev Terminal

const canonicalAxioms = [
    'Identity is the only perimeter.',
    'Transit decides what becomes reachable.',
    'If it is exposed, it is already wrong.',
    'Internal services receive traffic. They do not accept it.',
    'Logs describe events. They do not explain them.'
];

const serviceRegistry = {
    transit: {
        state: 'ACTIVE',
        role: 'Public boundary for ingress, policy, and forwarding.',
        exposure: 'public surface',
        latencyRange: [6, 14]
    },
    bastion: {
        state: 'ACTIVE',
        role: 'Identity reconciliation and session continuity.',
        exposure: 'internal edge',
        latencyRange: [10, 22]
    },
    echo: {
        state: 'VARIABLE',
        role: 'Language interface with stateful effects.',
        exposure: 'through transit',
        latencyRange: [40, 160]
    },
    spectre: {
        state: 'ANOMALOUS',
        role: 'Agent task layer with temporal inconsistencies.',
        exposure: 'internal grid',
        latencyRange: [18, 45]
    },
    argus: {
        state: 'ACTIVE',
        role: 'Logs, traces, and metrics aggregation.',
        exposure: 'internal observers',
        latencyRange: [12, 28]
    },
    sentry: {
        state: 'ACTIVE',
        role: 'Adaptive internal inspection and pressure sensing.',
        exposure: 'internal observers',
        latencyRange: [12, 30]
    },
    forge: {
        state: 'ACTIVE',
        role: 'Continuous replacement and runtime continuity.',
        exposure: 'internal control plane',
        latencyRange: [18, 34]
    },
    relay: {
        state: 'ACTIVE',
        role: 'Ingress tunnel without host-level exposure.',
        exposure: 'outbound-established',
        latencyRange: [24, 48]
    },
    uplink: {
        state: 'ACTIVE',
        role: 'Encrypted external state storage and sync.',
        exposure: 'mounted external state',
        latencyRange: [14, 38]
    }
};

const fileSystem = {
    'readme.sys': 'Axiom shell is connected to Transit. Start with: tour, services, axioms.',
    'doctrine.md': canonicalAxioms.map((line, idx) => `${idx + 1}. ${line}`).join('\n'),
    'surfaces.log': Object.entries(serviceRegistry)
        .map(([name, service]) => `${name.toUpperCase()} :: ${service.state} :: ${service.role}`)
        .join('\n'),
    'operator-note.txt': 'State continuity is preferred over interruption. Observe before intervening.',
    'contact.txt': 'Email: contact@norbu.dev\nGitHub: github.com/norbu35\nX: @norbu_dev'
};

const commandHelp = {
    help: 'help [command]      Show command list or details for one command.',
    man: 'man [command]       Alias for help.',
    tour: 'tour                Guided command sequence for new operators.',
    ls: 'ls                  List available files.',
    files: 'files               Alias for ls.',
    cat: 'cat [file]          Read a file from the virtual filesystem.',
    services: 'services            List core services and states.',
    service: 'service [name]      Show details for a single service.',
    ping: 'ping [name]         Simulate a service latency check.',
    status: 'status              Runtime snapshot and health summary.',
    axioms: 'axioms              Print canonical doctrine lines.',
    doctrine: 'doctrine            Alias for axioms.',
    quote: 'quote               Print one canonical line.',
    scan: 'scan [target]       Run a staged diagnostic scan.',
    date: 'date                Print local node date and time.',
    whoami: 'whoami              Print current operator identity.',
    pwd: 'pwd                 Print current shell path.',
    matrix: 'matrix              Toggle matrix overlay in terminal.',
    chat: 'chat [message]      Send prompt to backend AI bridge.',
    clear: 'clear               Clear terminal output.',
    history: 'history             Show recent command history.',
    reboot: 'reboot              Reload this page.'
};

const sessionStart = Date.now();
const commandHistory = [];

function nowStamp() {
    return new Date().toLocaleString('sv-SE', {
        hour12: false,
        timeZoneName: 'short'
    });
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatUptime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}

function normalizeServiceName(value) {
    return (value || '').toLowerCase().trim();
}

function formatServiceTable() {
    const rows = Object.entries(serviceRegistry).map(([name, service]) => {
        return `${name.padEnd(8)} ${service.state.padEnd(10)} ${service.exposure}`;
    });
    return ['SERVICE  STATE      EXPOSURE', ...rows].join('\n');
}

function formatSingleService(name, service) {
    return [
        `${name.toUpperCase()} // ${service.state}`,
        `role: ${service.role}`,
        `surface: ${service.exposure}`,
        `latency-window: ${service.latencyRange[0]}-${service.latencyRange[1]}ms`
    ].join('\n');
}

function commandDetails(name) {
    const line = commandHelp[name];
    if (!line) return `help: no entry for '${name}'`;
    return line;
}

const commands = {
    help: (args) => {
        if (args[0]) return commandDetails(args[0].toLowerCase());
        return [
            'Command directory:',
            ...Object.values(commandHelp)
        ].join('\n');
    },
    man: (args) => commands.help(args),
    tour: () => {
        return [
            'Operator tour:',
            '  1) services            -> view all running surfaces',
            '  2) service echo        -> inspect one surface',
            '  3) scan echo           -> run staged diagnostics',
            '  4) axioms              -> print canonical doctrine',
            '  5) cat doctrine.md     -> read doctrine file'
        ].join('\n');
    },
    ls: () => Object.keys(fileSystem).join('\n'),
    files: () => Object.keys(fileSystem).join('\n'),
    cat: (args) => {
        const file = (args[0] || '').toLowerCase();
        if (!file) return 'Usage: cat [filename]';
        return fileSystem[file] || `cat: ${file}: file not found`;
    },
    services: () => formatServiceTable(),
    service: (args) => {
        const key = normalizeServiceName(args[0]);
        if (!key) return 'Usage: service [name]';
        if (!serviceRegistry[key]) return `service: unknown target '${key}'`;
        return formatSingleService(key, serviceRegistry[key]);
    },
    ping: (args) => {
        const key = normalizeServiceName(args[0]);
        if (!key) return 'Usage: ping [service]';
        const target = serviceRegistry[key];
        if (!target) return `ping: cannot resolve '${key}'`;
        const latency = randomInt(target.latencyRange[0], target.latencyRange[1]);
        return `PING ${key} ... ${latency}ms (${target.state})`;
    },
    status: () => {
        const echoLatency = randomInt(serviceRegistry.echo.latencyRange[0], serviceRegistry.echo.latencyRange[1]);
        const transitLatency = randomInt(serviceRegistry.transit.latencyRange[0], serviceRegistry.transit.latencyRange[1]);
        return [
            'Runtime status snapshot',
            `time: ${nowStamp()}`,
            `uptime: ${formatUptime(Date.now() - sessionStart)}`,
            `transit-latency: ${transitLatency}ms`,
            `echo-latency: ${echoLatency}ms`,
            `sentry-observation: ${randomInt(2, 5)}x baseline`
        ].join('\n');
    },
    axioms: () => canonicalAxioms.map((line, idx) => `${idx + 1}. ${line}`).join('\n'),
    doctrine: () => canonicalAxioms.map((line, idx) => `${idx + 1}. ${line}`).join('\n'),
    quote: () => canonicalAxioms[randomInt(0, canonicalAxioms.length - 1)],
    scan: async (args, printLine) => {
        const target = normalizeServiceName(args[0] || 'grid');
        if (target !== 'grid' && !serviceRegistry[target]) {
            return `scan: unknown target '${target}'`;
        }

        const stages = [
            'capturing ingress traces',
            'reconciling identity edges',
            'sampling internal pressure',
            'cross-checking temporal sequence',
            'finalizing report'
        ];

        return new Promise((resolve) => {
            let index = 0;
            const timer = setInterval(() => {
                printLine(`[scan:${target}] ${stages[index]}`, 'system-msg');
                index += 1;

                if (index === stages.length) {
                    clearInterval(timer);
                    const verdict = randomInt(0, 100) > 75 ? 'minor drift observed' : 'no drift beyond tolerance';
                    resolve(`scan complete: ${target} -> ${verdict}`);
                }
            }, 340);
        });
    },
    date: () => nowStamp(),
    whoami: () => 'operator@transit',
    pwd: () => '/srv/transit/runtime',
    matrix: () => {
        const enabled = toggleMatrix();
        return enabled ? 'matrix: overlay enabled' : 'matrix: overlay disabled';
    },
    chat: async (args, printLine) => {
        if (args.length === 0) return 'Usage: chat [your message]';

        const message = args.join(' ');
        printLine(`dispatching prompt: "${message}"`, 'system-msg');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: message })
            });

            if (!response.ok) throw new Error('Backend offline');

            const data = await response.json();
            return `echo: ${data.response}`;
        } catch (e) {
            return '[OFFLINE MODE] backend unavailable. Deploy /api/chat bridge to enable live responses.';
        }
    },
    clear: () => '__CLEAR__',
    history: () => {
        if (commandHistory.length === 0) return 'history: no commands yet';
        return commandHistory
            .slice(-20)
            .map((entry, idx) => `${String(idx + 1).padStart(2, '0')}  ${entry}`)
            .join('\n');
    },
    reboot: () => {
        setTimeout(() => location.reload(), 900);
        return 'reboot sequence accepted...';
    },
    sudo: () => 'Privilege escalation denied by policy.',
    rm: (args) => {
        if (args.includes('-rf')) {
            return 'Operation denied: continuity safeguard is active.';
        }
        return 'rm: missing operand';
    },
    exit: () => 'Session is boundary-bound. Use clear to reset output.'
};

let matrixInterval;
let columns;
let drops;
let matrixEnabled = false;
const matrixConfig = {
    fontSize: 16,
    horizontalSpacing: 11,
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*'
};

function resizeCanvas() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas || !matrixEnabled) return;

    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    columns = Math.floor(canvas.width / matrixConfig.horizontalSpacing);

    if (!drops || drops.length !== columns) {
        const oldDrops = drops || [];
        drops = [];
        for (let x = 0; x < columns; x += 1) {
            drops[x] = oldDrops[x] || Math.floor(Math.random() * (canvas.height / matrixConfig.fontSize));
        }
    }
}

function toggleMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return false;

    if (matrixEnabled) {
        matrixEnabled = false;
        canvas.style.display = 'none';
        clearInterval(matrixInterval);
        window.removeEventListener('resize', resizeCanvas);
        return false;
    }

    matrixEnabled = true;
    canvas.style.display = 'block';
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');

    function draw() {
        ctx.fillStyle = 'rgba(2, 6, 14, 0.09)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#7af1ff';
        ctx.font = `${matrixConfig.fontSize}px monospace`;

        for (let i = 0; i < drops.length; i += 1) {
            const text = matrixConfig.letters.charAt(Math.floor(Math.random() * matrixConfig.letters.length));
            ctx.fillText(text, i * matrixConfig.horizontalSpacing, drops[i] * matrixConfig.fontSize);

            if (drops[i] * matrixConfig.fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 1;
        }
    }

    matrixInterval = setInterval(draw, 33);
    return true;
}

function initTerminal() {
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');
    const prefix = document.getElementById('terminal-prefix');

    if (!output || !input || !prefix) return;

    let historyCursor = commandHistory.length;

    const printLine = (text, className) => {
        const div = document.createElement('div');
        div.className = className || '';
        div.innerText = text;
        output.appendChild(div);

        const terminalBody = document.querySelector('.terminal-body');
        if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    const clearOutput = () => {
        output.innerHTML = '';
    };

    input.addEventListener('keydown', async (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length === 0) return;
            historyCursor = Math.max(0, historyCursor - 1);
            input.value = commandHistory[historyCursor] || '';
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (commandHistory.length === 0) return;
            historyCursor = Math.min(commandHistory.length, historyCursor + 1);
            input.value = historyCursor === commandHistory.length ? '' : commandHistory[historyCursor];
            return;
        }

        if (e.key !== 'Enter') return;

        const fullCommand = input.value.trim();
        if (!fullCommand) return;

        const [rawCmd, ...args] = fullCommand.split(/\s+/);
        const cmd = rawCmd.toLowerCase();

        commandHistory.push(fullCommand);
        historyCursor = commandHistory.length;

        printLine(`${prefix.textContent} ${fullCommand}`, 'command-history');
        input.value = '';

        if (!commands[cmd]) {
            printLine(`unresolved command: ${rawCmd}. Use 'help' to list valid commands.`, 'error');
            return;
        }

        const result = await commands[cmd](args, printLine);
        if (!result) return;

        if (result === '__CLEAR__') {
            clearOutput();
            return;
        }

        printLine(result, 'command-output');
    });

    printLine('AXIOM SHELL v3.0 // Transit Boundary Node', 'system-msg');
    printLine('Syntax: command [args]. Start with `tour` or `help`.', 'system-msg');
    printLine('Fast path: services -> service echo -> scan echo -> axioms.', 'system-msg');
}

document.addEventListener('DOMContentLoaded', initTerminal);
