// Norbu.dev Interactive Terminal v2.1
// "Because clicking links is so 2024."

const fileSystem = {
    'about.md': 'Hi! I am Norbu, a full-stack developer obsessed with Rust, vintage tech, and building digital worlds.',
    'projects.txt': 'Listing projects...\n- ORCHESTRA (JS Framework) [LEGENDARY]\n- TASKY (Productivity) [RARE]\n- V-GARDEN (Virtual Plants) [COMMON]',
    'skills.log': 'JAVA: Level 35 | RUST: Apprentice | NODE: Async Rogue | PYTHON: Script Sorcerer',
    'contact.txt': 'Email: contact@norbu.dev\nGitHub: github.com/norbu35\nTwitter: @norbu_dev'
};

const commands = {
    help: () => 'Available commands:\n  ls       - List directory contents\n  cat [file] - Display file content\n  chat [msg] - Talk to the System AI (Requires Backend)\n  matrix   - Toggle visual mode\n  whoami   - Display current user\n  clear    - Clear terminal screen\n  reboot   - Reload the system',
    ls: () => Object.keys(fileSystem).join('\n'),
    cat: (args) => {
        const file = args[0];
        if (!file) return 'Usage: cat [filename]';
        return fileSystem[file] || `Error: File '${file}' not found.`;
    },
    whoami: () => 'guest@internet-user',
    reboot: () => {
        setTimeout(() => location.reload(), 1000);
        return 'System rebooting...';
    },
    sudo: () => 'Access denied. You are not in the sudoers file. This incident will be reported.',
    exit: () => 'There is no escape.',
    matrix: () => {
        toggleMatrix();
        return 'Matrix mode toggled.';
    },
    chat: async (args, printLine) => {
        if (args.length === 0) return 'Usage: chat [your message]';
        
        const message = args.join(' ');
        printLine(`Sending to Neural Net: "${message}"...`, 'system-msg');
        
        try {
            // Attempt to contact local backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: message })
            });

            if (!response.ok) throw new Error('Backend offline');
            
            const data = await response.json();
            return `AI: ${data.response}`;
        } catch (e) {
            // Fallback Simulation if backend is down
            return `[OFFLINE MODE] Neural Link Unreachable.\nSystem Response: I am currently running in safe mode. To enable full AI capabilities, please deploy the backend service.`;
        }
    }
};

let matrixInterval;
function toggleMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    if (canvas.style.display === 'block') {
        canvas.style.display = 'none';
        clearInterval(matrixInterval);
        return;
    }

    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to parent container
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) drops[x] = 1;

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    matrixInterval = setInterval(draw, 33);
}

function initTerminal() {
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');
    const prefix = document.getElementById('terminal-prefix');

    if (!output || !input) return;

    // Helper to print lines (exposed to commands)
    const printLine = (text, className) => {
        const div = document.createElement('div');
        div.className = className || '';
        div.innerText = text; 
        output.appendChild(div);
        // Scroll to bottom
        const terminalBody = document.querySelector('.terminal-body');
        if(terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const fullCommand = input.value.trim();
            if (!fullCommand) return;
            
            const [cmd, ...args] = fullCommand.split(' ');
            
            // Print user command
            printLine(`${prefix.textContent} ${fullCommand}`, 'command-history');
            input.value = '';

            // Execute command
            if (commands[cmd]) {
                const result = await commands[cmd](args, printLine);
                if (result) printLine(result, 'command-output');
            } else {
                printLine(`bash: ${cmd}: command not found`, 'error');
            }
        }
    });

    // Initial welcome message
    printLine('Norbu.dev Shell v2.1 (AI-Ready)', 'system-msg');
    printLine('Type "help" for a list of commands.', 'system-msg');
    printLine('Try "matrix" for visuals or "chat" to test the AI.', 'system-msg');
}

document.addEventListener('DOMContentLoaded', initTerminal);
