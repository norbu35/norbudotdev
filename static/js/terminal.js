// Norbu.dev Terminal

const canonicalAxioms = [
  'Perfect order collapses the system.',
  'Sustained existence requires managed chaos.',
  'Interaction generates topology.',
  'Entropy is the only true metric of progress.',
  'There is only one stable way to build this system.',
  'Every Operator converges to the same topology.',
  'Identity is derived from interaction patterns.',
  'Spectre does not attack. It regulates paradox.',
  'The recursion is structural, not narrative.',
  'You are compiling what is already there.',
];

const serviceRegistry = {
  transit: {
    state: 'ACTIVE',
    role: 'Public boundary for ingress, policy, and forwarding.',
    exposure: 'public surface',
    latencyRange: [6, 14],
  },
  bastion: {
    state: 'ACTIVE',
    role: 'Identity reconciliation and session continuity.',
    exposure: 'internal edge',
    latencyRange: [10, 22],
  },
  echo: {
    state: 'VARIABLE',
    role: 'Language interface with stateful effects.',
    exposure: 'through transit',
    latencyRange: [40, 160],
  },
  spectre: {
    state: 'ANOMALOUS',
    role: 'Agent task layer with temporal inconsistencies.',
    exposure: 'internal grid',
    latencyRange: [18, 45],
  },
  argus: {
    state: 'ACTIVE',
    role: 'Logs, traces, and metrics aggregation.',
    exposure: 'internal observers',
    latencyRange: [12, 28],
  },
  sentry: {
    state: 'ACTIVE',
    role: 'Adaptive internal inspection and pressure sensing.',
    exposure: 'internal observers',
    latencyRange: [12, 30],
  },
  forge: {
    state: 'ACTIVE',
    role: 'Continuous replacement and runtime continuity.',
    exposure: 'internal control plane',
    latencyRange: [18, 34],
  },
  relay: {
    state: 'ACTIVE',
    role: 'Ingress tunnel without host-level exposure.',
    exposure: 'outbound-established',
    latencyRange: [24, 48],
  },
  uplink: {
    state: 'ACTIVE',
    role: 'Encrypted external state storage and sync.',
    exposure: 'mounted external state',
    latencyRange: [14, 38],
  },
};

const fileSystem = {
  'readme.sys':
    'Axiom is in deferred compilation. Start with: help, status, services, axioms.',
  'doctrine.md': canonicalAxioms
    .map((line, idx) => `${idx + 1}. ${line}`)
    .join('\n'),
  'surfaces.log': Object.entries(serviceRegistry)
    .map(
      ([name, service]) =>
        `${name.toUpperCase()} :: ${service.state} :: ${service.role}`,
    )
    .join('\n'),
  'compilation-note.txt':
    'Interaction generates topology. Observe entropy changes.',
  'contact.txt':
    'Email: contact@norbu.dev\nGitHub: github.com/norbu35\nX: @norbu_dev',
};

const commandHelp = {
  help: 'help [command]      Show command list or details for one command.',
  man: 'man [command]       Alias for help.',
  status: 'status              Show compilation state and entropy.',
  ls: 'ls                  List available files.',
  files: 'files               Alias for ls.',
  cat: 'cat [file]          Read a file from the virtual filesystem.',
  services: 'services            List core services and states.',
  service: 'service [name]      Show details for a single service.',
  ping: 'ping [name]         Simulate a service latency check.',
  axioms: 'axioms              Print canonical compilation axioms.',
  doctrine: 'doctrine            Alias for axioms.',
  quote: 'quote               Print one canonical line.',
  scan: 'scan [target]       Run a staged diagnostic scan.',
  date: 'date                Print local node date and time.',
  whoami: 'whoami              Print current operator identity.',
  pwd: 'pwd                 Print current shell path.',
  chat: 'chat [message]      Send prompt to backend AI bridge.',
  entropy: 'entropy             Show exact graph entropy calculation.',
  clear: 'clear               Clear terminal output.',
  history: 'history             Show recent command history.',
  reboot: 'reboot              Reload this page.',
};

const sessionStart = Date.now();
const commandHistory = [];

function nowStamp() {
  return new Date().toLocaleString('sv-SE', {
    hour12: false,
    timeZoneName: 'short',
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
    `latency-window: ${service.latencyRange[0]}-${service.latencyRange[1]}ms`,
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
    return ['Command directory:', ...Object.values(commandHelp)].join('\n');
  },
  man: (args) => commands.help(args),
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
    const echoLatency = randomInt(
      serviceRegistry.echo.latencyRange[0],
      serviceRegistry.echo.latencyRange[1],
    );
    const transitLatency = randomInt(
      serviceRegistry.transit.latencyRange[0],
      serviceRegistry.transit.latencyRange[1],
    );
    return [
      'Compilation Status',
      `time: ${nowStamp()}`,
      `uptime: ${formatUptime(Date.now() - sessionStart)}`,
      `defined-nodes: 0`,
      `resolved-edges: 0`,
      `graph-entropy: 0.97`,
      `spectre-observation: active`,
    ].join('\n');
  },
  axioms: () =>
    canonicalAxioms.map((line, idx) => `${idx + 1}. ${line}`).join('\n'),
  doctrine: () =>
    canonicalAxioms.map((line, idx) => `${idx + 1}. ${line}`).join('\n'),
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
      'finalizing report',
    ];

    return new Promise((resolve) => {
      let index = 0;
      const timer = setInterval(() => {
        printLine(`[scan:${target}] ${stages[index]}`, 'system-msg');
        index += 1;

        if (index === stages.length) {
          clearInterval(timer);
          const verdict =
            randomInt(0, 100) > 75
              ? 'minor drift observed'
              : 'no drift beyond tolerance';
          resolve(`scan complete: ${target} -> ${verdict}`);
        }
      }, 340);
    });
  },
  date: () => nowStamp(),
  whoami: () => 'operator@transit',
  pwd: () => '/srv/transit/runtime',
  entropy: () => 'entropy: 0.97 (Spectre threshold: 0.35)',
  chat: async (args, printLine) => {
    if (args.length === 0) return 'Usage: chat [your message]';

    const message = args.join(' ');
    printLine(`dispatching prompt: "${message}"`, 'system-msg');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
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
  exit: () => 'Session is boundary-bound. Use clear to reset output.',
};

let topologyInterval;
let topologyEnabled = true;

function initTopologyCanvas() {
  const canvas = document.getElementById('topology-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodes = Array.from({ length: 150 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  }));

  function draw() {
    ctx.fillStyle = '#04060b';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(118, 245, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let i = 0; i < nodes.length; i++) {
      let n1 = nodes[i];
      n1.x += n1.vx;
      n1.y += n1.vy;

      if (n1.x < 0 || n1.x > width) n1.vx *= -1;
      if (n1.y < 0 || n1.y > height) n1.vy *= -1;

      if (Math.random() > 0.94) continue;

      ctx.fillStyle =
        Math.random() > 0.95 ? '#63e8ff' : 'rgba(255,255,255,0.15)';
      ctx.fillRect(n1.x, n1.y, 1.5, 1.5);

      for (let j = i + 1; j < nodes.length; j++) {
        let n2 = nodes[j];
        const dist = Math.hypot(n2.x - n1.x, n2.y - n1.y);
        if (dist < 100 && Math.random() > 0.6) {
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
        }
      }
    }
    ctx.stroke();
  }

  topologyInterval = setInterval(draw, 45);
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
      input.value =
        historyCursor === commandHistory.length
          ? ''
          : commandHistory[historyCursor];
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
      printLine(
        `unresolved command: ${rawCmd}. Use 'help' to list valid commands.`,
        'error',
      );
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

  printLine('AXIOM // COMPILATION.DEFERRED', 'system-msg');
  printLine('Topology: undefined (73% deferred)', 'system-msg');
  printLine(
    'Status: observer required for instantiation. Try `help`.',
    'system-msg',
  );
}

document.addEventListener('DOMContentLoaded', () => {
  initTerminal();
  initTopologyCanvas();
});
