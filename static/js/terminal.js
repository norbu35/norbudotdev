// Norbu.dev Interactive Terminal v2.0
// "Because clicking links is so 2024."

const fileSystem = {
    'about.md': 'Hi! I am Norbu, a full-stack developer obsessed with Rust, vintage tech, and building digital worlds.',
    'projects.txt': 'Listing projects...
- ORCHESTRA (JS Framework) [LEGENDARY]
- TASKY (Productivity) [RARE]
- V-GARDEN (Virtual Plants) [COMMON]',
    'skills.log': 'JAVA: Level 35 | RUST: Apprentice | NODE: Async Rogue | PYTHON: Script Sorcerer',
    'contact.txt': 'Email: contact@norbu.dev
GitHub: github.com/norbu35
Twitter: @norbu_dev'
};

const commands = {
    help: () => 'Available commands:
  ls       - List directory contents
  cat [file] - Display file content
  whoami   - Display current user
  clear    - Clear terminal screen
  reboot   - Reload the system',
    ls: () => Object.keys(fileSystem).join('
'),
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
    exit: () => 'There is no escape.'
};

function initTerminal() {
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');
    const prefix = document.getElementById('terminal-prefix');

    if (!output || !input) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const fullCommand = input.value.trim();
            const [cmd, ...args] = fullCommand.split(' ');
            
            // Print user command
            printLine(`${prefix.textContent} ${fullCommand}`, 'command-history');
            
            // Execute command
            if (cmd) {
                if (commands[cmd]) {
                    const response = commands[cmd](args);
                    if (response) printLine(response, 'command-output');
                } else {
                    printLine(`bash: ${cmd}: command not found`, 'error');
                }
            }
            
            input.value = '';
            window.scrollTo(0, document.body.scrollHeight);
        }
    });

    function printLine(text, className) {
        const div = document.createElement('div');
        div.className = className || '';
        div.innerText = text; // Use innerText for safety
        output.appendChild(div);
    }
    
    // Initial welcome message
    printLine('Norbu.dev Shell v2.0.1', 'system-msg');
    printLine('Type "help" for a list of commands.', 'system-msg');
}

document.addEventListener('DOMContentLoaded', initTerminal);
