// ============== SCROLL ANIMATIONS ==============
const readingProgress = document.getElementById('readingProgress');
const scrollRevealElements = document.querySelectorAll('.scroll-animate, section, .stat-card, .slide-left, .slide-right, .about-title, .about-paragraph');

// Intersection Observer for scroll animations
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Add staggered delay to children
      const children = entry.target.children;
      Array.from(children).forEach((child, index) => {
        if (!child.classList.contains('visible')) {
          child.style.transitionDelay = `${index * 60}ms`;
          child.classList.add('visible');
        }
      });

      // Trigger counter animation for stat cards
      if (entry.target.classList.contains('stat-card')) {
        const counter = entry.target.querySelector('.counter');
        if (counter && counter.textContent === '0') {
          const target = parseInt(entry.target.dataset.target);
          const suffix = entry.target.dataset.suffix || '';
          animateCounterExpo(counter, target, suffix);
        }
      }
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

// Observe all elements that should animate on scroll
scrollRevealElements.forEach(el => {
  el.classList.add('scroll-reveal');
  scrollObserver.observe(el);
});

// Counter animation with easeOutExpo curve
function animateCounterExpo(element, target, suffix) {
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // easeOutExpo curve
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(eased * target);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Reading progress bar
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    readingProgress.style.width = `${progress}%`;
  }, 16);
}, { passive: true });

// Debounced nav dot update
let navTimeout;
const sections = ['hero', 'about', 'stack', 'projects', 'contact'];
const navDots = document.querySelectorAll('.nav-dot');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('href') === `#${id}`) {
          dot.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(id => {
  const section = document.getElementById(id);
  if (section) navObserver.observe(section);
});

// ============== ABOUT ANIMATIONS ==============
const aboutSection = document.getElementById('about');
let aboutHasTyped = false;
let aboutHasAnimated = false;

function typeParagraph(text, element, callback) {
  element.textContent = '';
  let charIndex = 0;

  function typeChar() {
    if (charIndex < text.length) {
      element.textContent += text[charIndex];
      charIndex++;
      setTimeout(typeChar, 18);
    } else {
      if (callback) callback();
    }
  }

  typeChar();
}

function animateAboutSection() {
  if (aboutHasAnimated) return;
  aboutHasAnimated = true;

  const p1 = document.getElementById('typing-text-1');
  const p2 = document.getElementById('typing-text-2');

  // Start typing paragraph 1
  const text1 = "Full-Stack Developer with 14+ years of experience architecting scalable web applications. I specialize in React ecosystems, Node.js backends, and cloud infrastructure on AWS.";
  const text2 = "Previously led engineering teams at fintech startups, building high-traffic platforms serving millions of users. Now focused on consulting and building products that matter.";

  // Add cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.textContent = '▌';
  p1.parentNode.appendChild(cursor);

  // Start typing
  p1.classList.add('typing');
  typeParagraph(text1, p1, () => {
    // Paragraph 1 done, remove cursor from p1
    cursor.remove();

    // Add cursor for p2
    const cursor2 = document.createElement('span');
    cursor2.className = 'typing-cursor';
    cursor2.textContent = '▌';
    p2.parentNode.appendChild(cursor2);

    p2.classList.add('typing');
    typeParagraph(text2, p2, () => {
      // Both done, remove cursor
      cursor2.remove();
    });
  });
}

function animateStats() {
  const statCards = document.querySelectorAll('.stat-card');
  const durations = [800, 900, 850, 1200]; // ms for each counter

  statCards.forEach((card, index) => {
    card.classList.add('animated');

    const numberEl = card.querySelector('.stat-number');
    const target = parseInt(card.dataset.target);
    const suffix = card.dataset.suffix || '';

    // Counter animation with easeOutExpo
    setTimeout(() => {
      animateCounterExpo(numberEl, target, suffix, durations[index], () => {
        // After counter finishes, pulse glow
        setTimeout(() => {
          card.classList.add('pulse-glow');
          setTimeout(() => {
            card.classList.remove('pulse-glow');
          }, 600);
        }, 100);
      });
    }, 300 + index * 80); // Stagger box entrance + 300ms delay
  });
}

function animateCounterExpo(element, target, suffix, duration, callback) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(eased * target);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (callback) callback();
    }
  }

  requestAnimationFrame(update);
}

function animateInfoCards() {
  const leftCard = document.querySelector('.info-card-left');
  const rightCard = document.querySelector('.info-card-right');

  if (leftCard) {
    leftCard.classList.add('animated');
  }
  if (rightCard) {
    rightCard.classList.add('animated');
  }
}

// About section observer
const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Start typing animation if not done
      if (!aboutHasTyped) {
        aboutHasTyped = true;
        setTimeout(() => {
          animateAboutSection();
        }, 300);
      }

      // Animate stats after a delay
      setTimeout(() => {
        animateStats();
      }, 800);

      // Animate info cards after stats
      setTimeout(() => {
        animateInfoCards();
      }, 2000);

      aboutObserver.disconnect();
    }
  });
}, { threshold: 0.3, rootMargin: '0px' });

if (aboutSection) {
  aboutObserver.observe(aboutSection);
}

// Info cards mouse position for radial glow
document.querySelectorAll('.info-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

// ============== STACK ANIMATIONS ==============
const stackSection = document.getElementById('stack');

// Animate label letters
function animateStackLabel() {
  const labelText = document.querySelector('.stack-label-text');
  if (!labelText) return;

  const text = labelText.textContent;
  labelText.innerHTML = '';

  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.textContent = text[i] === ' ' ? ' ' : text[i];
    span.style.animationDelay = `${i * 80}ms`;
    labelText.appendChild(span);
  }
}

// Animate heading words
function animateStackHeading() {
  const headingLeft = document.querySelector('.heading-word-left');
  const headingRight = document.querySelector('.heading-word-right');
  if (headingLeft) headingLeft.style.animationDelay = '400ms';
  if (headingRight) headingRight.style.animationDelay = '400ms';
}

// Animate skill cards and rows
function animateSkillCards() {
  const leftCard = document.querySelector('.skill-card-left');
  const rightCard = document.querySelector('.skill-card-right');

  if (leftCard) {
    leftCard.classList.add('animated');
    leftCard.style.animationDelay = '700ms';
    animateSkillRows(leftCard);
  }
  if (rightCard) {
    rightCard.classList.add('animated');
    rightCard.style.animationDelay = '850ms';
    animateSkillRows(rightCard);
  }
}

function animateSkillRows(card) {
  const rows = card.querySelectorAll('.skill-row');
  rows.forEach((row, index) => {
    const name = row.querySelector('.skill-name');
    const percent = row.querySelector('.skill-percent');
    const fill = row.querySelector('.skill-fill');

    // Animate skill name
    if (name) {
      name.style.opacity = '0';
      setTimeout(() => {
        name.style.opacity = '1';
      }, 900 + index * 100);
    }

    // Animate percentage counter
    if (percent) {
      const target = parseInt(percent.textContent);
      percent.textContent = '0%';
      setTimeout(() => {
        animateCounterExpo(percent, target, '%');
      }, 900 + index * 100);
    }

    // Animate progress bar fill
    if (fill) {
      setTimeout(() => {
        const percent = fill.dataset.percent;
        fill.style.transform = `scaleX(${percent / 100})`;
      }, 1200 + index * 100);
    }
  });
}

// Animate tools grid
function animateToolsGrid() {
  const tools = document.querySelectorAll('.tool-card');
  const rotations = [-15, 12, -8, 10, -12, 8, -10, 15];

  tools.forEach((tool, index) => {
    tool.style.setProperty('--rotate', `${rotations[index]}deg`);
    tool.style.animationDelay = `${1200 + index * 60}ms`;
    setTimeout(() => {
      tool.classList.add('animated');
    }, 1200 + index * 60);
  });
}

// Counter animation with easeOutExpo
function animateCounterExpo(element, target, suffix = '') {
  const duration = 1000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(eased * target);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Stack section observer
const stackObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('stack-animated')) {
      entry.target.classList.add('stack-animated');

      // Trigger all animations
      setTimeout(() => {
        animateStackLabel();
        animateStackHeading();
        animateSkillCards();
        animateToolsGrid();
      }, 300);

      stackObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

if (stackSection) {
  stackObserver.observe(stackSection);
}

// ============== MOUSE MOVE 3D EFFECT ==============
const codeWindow = document.getElementById('codeWindow');
const perspectiveContainer = document.querySelector('.perspective-container');

if (codeWindow && perspectiveContainer) {
  perspectiveContainer.addEventListener('mousemove', (e) => {
    const rect = perspectiveContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const rotateY = ((mouseX - centerX) / rect.width) * 20;
    const rotateX = ((centerY - mouseY) / rect.height) * 20;

    codeWindow.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  perspectiveContainer.addEventListener('mouseleave', () => {
    codeWindow.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}


// Remove typewriter effect - text now shows immediately with scroll animation

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Cursor Trail Effect
const cursorTrail = document.getElementById('cursorTrail');
let lastTrailTime = 0;

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastTrailTime > 30) {
    lastTrailTime = now;

    const trail = cursorTrail.cloneNode();
    trail.classList.add('active');
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    document.body.appendChild(trail);

    setTimeout(() => {
      trail.remove();
    }, 800);
  }
});

// Parallax Effect
document.addEventListener('mousemove', (e) => {
  const shapes = document.querySelectorAll('.parallax-shape');
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const mouseX = e.clientX - centerX;
  const mouseY = e.clientY - centerY;

  shapes.forEach(shape => {
    const speed = parseFloat(shape.dataset.speed) || 0.02;
    const x = (mouseX * speed);
    const y = (mouseY * speed);
    shape.style.transform = `translate(${x}px, ${y}px)`;
  });
});


// Status Widget
const statusWidget = document.getElementById('statusWidget');
const widgetToggle = document.getElementById('widgetToggle');
const collapseBtn = document.getElementById('collapseBtn');
const collapseIcon = document.getElementById('collapseIcon');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

let isOpen = true;
let isWorking = true;
let currentProgress = 65;

// Animate in on page load
setTimeout(() => {
  statusWidget.classList.add('animate-in');
}, 1500);

// Agent button - open terminal
const agentBtn = document.getElementById('agentBtn');
setTimeout(() => {
  agentBtn.classList.add('animate-in');
}, 1600);

agentBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  openTerminal();
});

// Toggle collapse
widgetToggle.addEventListener('click', (e) => {
  if (e.target.closest('#collapseBtn')) return;
  isOpen = !isOpen;
  statusWidget.classList.toggle('collapsed', !isOpen);
  collapseIcon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(-90deg)';
});

collapseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  isOpen = !isOpen;
  statusWidget.classList.toggle('collapsed', !isOpen);
  collapseIcon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(-90deg)';
});

// Toggle status (click on status row)
document.querySelector('#widgetToggle > div:first-child').addEventListener('click', () => {
  isWorking = !isWorking;
  statusDot.classList.toggle('open', isWorking);
  statusDot.classList.toggle('busy', !isWorking);
  statusText.textContent = isWorking ? 'Open to Work' : 'Busy';
});

// Progress bar animation
function animateProgress() {
  if (currentProgress >= 100) {
    currentProgress = 0;
  } else {
    currentProgress += Math.random() * 2;
    if (currentProgress > 100) currentProgress = 100;
  }
  progressFill.style.width = currentProgress.toFixed(0) + '%';
  progressText.textContent = Math.floor(currentProgress) + '%';
}

setInterval(animateProgress, 2000);

// ============== TERMINAL ==============
const terminalOverlay = document.getElementById('terminalOverlay');
const terminalWindow = document.getElementById('terminalWindow');
const terminalContent = document.getElementById('terminalContent');
const terminalOutput = document.getElementById('terminalOutput');
const terminalInput = document.getElementById('terminalInput');
const terminalScanlines = document.getElementById('terminalScanlines');
const terminalTaskbar = document.getElementById('terminalTaskbar');
const matrixCanvas = document.getElementById('matrixCanvas');

// Terminal state
let terminalHistory = [];
let historyIndex = -1;
let hasBooted = sessionStorage.getItem('terminalBooted') === 'true';
let currentInput = '';
let isMinimized = false;

// Boot sequence messages
const bootMessages = [
  { text: 'Initializing shell environment...', delay: 100 },
  { text: 'Loading profile: ~/.ashrafulrc', delay: 80 },
  { text: 'Connecting to portfolio server... OK', delay: 120 },
  { text: 'Welcome to Ashraful\'s Portfolio OS v2.0', delay: 60 }
];

const asciiLogo = `
   ███████╗ █████╗ ████████╗██╗   ██╗██╗  ██╗
  ██╔════╝██╔══██╗╚══██╔══╝██║   ██║██║ ██╔╝
  █████╗  ███████║   ██║   ██║   ██║█████╔╝
  ██╔══╝  ██╔══██║   ██║   ██║   ██║██╔═██╗
  ██║     ██║  ██║   ██║   ╚██████╔╝██║  ██╗
  ╚═╝     ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
        ════════════════════════════════
            WELCOME TO MY WORLD
        ════════════════════════════════`;

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addOutput(text, type = '') {
  const line = document.createElement('div');
  line.className = `terminal-line output ${type}`;
  line.innerHTML = escapeHtml(text);
  terminalOutput.appendChild(line);
  terminalContent.scrollTop = terminalContent.scrollHeight;
}

function addAsciiOutput(text, type = '') {
  const line = document.createElement('div');
  line.className = `terminal-line output ${type} ascii-art`;
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalContent.scrollTop = terminalContent.scrollHeight;
}

function showPrompt() {
  // Remove existing prompt if any
  const existingPrompt = terminalContent.querySelector('.terminal-input-line');
  if (existingPrompt) existingPrompt.remove();

  const promptLine = document.createElement('div');
  promptLine.className = 'terminal-input-line';
  promptLine.innerHTML = `
    <span class="terminal-prompt">
      <span class="prompt-user">ashraful</span><span class="prompt-at">@</span><span class="prompt-host">portfolio</span>:<span class="prompt-path">~</span><span class="prompt-symbol">$</span>
    </span>
    <span class="terminal-input-display"></span>
    <span class="terminal-cursor">█</span>
  `;
  terminalContent.appendChild(promptLine);
  currentInput = '';

  // Focus and handle input directly
  const display = promptLine.querySelector('.terminal-input-display');
  display.textContent = '';

  // Add keyboard event listener directly to terminal content
  terminalContent.setAttribute('tabindex', '0');
  terminalContent.focus();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = currentInput.trim();
      currentInput = '';
      display.textContent = '';

      // Add command to output
      const cmdLine = document.createElement('div');
      cmdLine.className = 'terminal-line command';
      cmdLine.innerHTML = `<span class="prompt-user">ashraful</span><span class="prompt-at">@</span><span class="prompt-host">portfolio</span>:<span class="prompt-path">~</span><span class="prompt-symbol">$</span> ${escapeHtml(cmd)}`;
      terminalOutput.appendChild(cmdLine);

      // Add to history
      if (cmd) {
        terminalHistory.push(cmd);
        historyIndex = terminalHistory.length;
      }

      // Execute command
      const [command, ...args] = cmd.split(' ');

      if (command === '') {
        showPrompt();
      } else if (terminalCommands[command]) {
        terminalCommands[command](args);
        if (command !== 'matrix') {
          showPrompt();
        }
      } else if (command === 'ls' || command === 'whoami' || command === 'pwd' || command === 'date' || command === 'cat' || command === 'echo') {
        if (command === 'whoami') addOutput('ashraful - Full-Stack Developer', 'output-success');
        else if (command === 'pwd') addOutput('/home/ashraful/portfolio', 'output');
        else if (command === 'date') addOutput(new Date().toString(), 'output');
        else if (command === 'ls') addOutput('about.txt  projects.txt  skills.txt  contact.txt', 'output');
        else if (command === 'cat') {
          if (args[0] && terminalFiles[args[0]]) addOutput(terminalFiles[args[0]], 'output-success');
          else addOutput(`cat: ${args[0] || ''}: No such file`, 'output-error');
        } else if (command === 'echo') addOutput(args.join(' '), 'output-success');
        showPrompt();
      } else {
        addOutput(`bash: ${command}: command not found`, 'output-error');
        addOutput('Type \'help\' to see available commands.', 'output-muted');
        showPrompt();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        currentInput = terminalHistory[historyIndex] || '';
        display.textContent = currentInput;
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < terminalHistory.length - 1) {
        historyIndex++;
        currentInput = terminalHistory[historyIndex] || '';
      } else {
        historyIndex = terminalHistory.length;
        currentInput = '';
      }
      display.textContent = currentInput;
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = currentInput.toLowerCase();
      const cmds = Object.keys(terminalCommands);
      const match = cmds.find(c => c.startsWith(partial));
      if (match) {
        currentInput = match;
        display.textContent = currentInput;
      }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      terminalOutput.innerHTML = '';
      showPrompt();
    } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      addOutput('^C', 'output-muted');
      showPrompt();
    } else if (e.key === 'Backspace') {
      currentInput = currentInput.slice(0, -1);
      display.textContent = currentInput;
    } else if (e.key === 'Escape') {
      closeTerminal();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      currentInput += e.key;
      display.textContent = currentInput;
    }
  };

  terminalContent.onkeydown = handleKeyDown;
}

async function typeText(text, element, speed = 30) {
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    terminalContent.scrollTop = terminalContent.scrollHeight;
    await new Promise(resolve => setTimeout(resolve, speed));
  }
}

async function runBootSequence() {
  terminalScanlines.classList.add('active');
  await new Promise(resolve => setTimeout(resolve, 400));
  terminalScanlines.classList.remove('active');

  for (const msg of bootMessages) {
    addOutput(msg.text, 'output-info');
    await new Promise(resolve => setTimeout(resolve, msg.delay));
  }

  await new Promise(resolve => setTimeout(resolve, 300));
  addAsciiOutput(asciiLogo, 'output-success');
  await new Promise(resolve => setTimeout(resolve, 500));

  showPrompt();
  sessionStorage.setItem('terminalBooted', 'true');
}

function quickBlink() {
  addOutput('', 'output-muted');
  showPrompt();
}

function openTerminal() {
  closeCommandPalette();
  terminalOverlay.classList.add('active');
  terminalTaskbar.classList.remove('visible');

  if (!hasBooted) {
    runBootSequence();
    hasBooted = true;
  } else {
    quickBlink();
  }

  setTimeout(() => {
    const input = document.getElementById('terminalInput');
    if (input) input.focus();
  }, 100);
}

function closeTerminal() {
  terminalOverlay.classList.remove('active');
  terminalWindow.classList.remove('fullscreen');
  terminalTaskbar.classList.remove('visible');
}

function minimizeTerminal() {
  terminalOverlay.classList.remove('active');
  terminalTaskbar.classList.add('visible');
  terminalWindow.classList.remove('fullscreen');
}

function restoreTerminal() {
  terminalTaskbar.classList.remove('visible');
  terminalOverlay.classList.add('active');
  const input = document.getElementById('terminalInput');
  if (input) input.focus();
}

function toggleFullscreen() {
  terminalWindow.classList.toggle('fullscreen');
}

// Terminal commands
const terminalCommands = {
  help: () => {
    addOutput('╔══════════════════════════════════════════════════════════════╗', 'output-muted');
    addOutput('║                    AVAILABLE COMMANDS                        ║', 'output-muted');
    addOutput('╠══════════════════════════════════════════════════════════════╣', 'output-muted');
    addOutput('║  about            - Display developer profile                 ║', 'output');
    addOutput('║  skills           - Show animated skill bars                  ║', 'output');
    addOutput('║  projects         - List featured projects                    ║', 'output');
    addOutput('║  contact          - Show contact information                 ║', 'output');
    addOutput('║  social           - Display social links                     ║', 'output');
    addOutput('║  experience       - Show career timeline                     ║', 'output');
    addOutput('║  download-cv      - Download resume PDF                      ║', 'output');
    addOutput('║  theme [color]    - Change accent color (blue/green/purple) ║', 'output');
    addOutput('║  matrix           - Run Matrix rain animation                 ║', 'output');
    addOutput('║  clear            - Clear terminal screen                     ║', 'output');
    addOutput('║  exit             - Close terminal                            ║', 'output');
    addOutput('╚══════════════════════════════════════════════════════════════╝', 'output-muted');
  },

  about: () => {
    addOutput('╔══════════════════════════════════════════════════════════════╗', 'output-muted');
    addOutput('║                    DEVELOPER PROFILE                          ║', 'output-muted');
    addOutput('╠══════════════════════════════════════════════════════════════╣', 'output-muted');
    addOutput('║  Name     : Ashraful Ahad                                     ║', 'output');
    addOutput('║  Role     : Full-Stack Developer & UI Designer               ║', 'output');
    addOutput('║  Exp      : 14+ years                                        ║', 'output');
    addOutput('║  Location : Remote / Worldwide                                ║', 'output');
    addOutput('║  Status   : ● Open to Work                                    ║', 'output-success');
    addOutput('╚══════════════════════════════════════════════════════════════╝', 'output-muted');
  },

  skills: async () => {
    const skills = [
      { name: 'React/Next.js', percent: 95 },
      { name: 'TypeScript', percent: 88 },
      { name: 'Node.js', percent: 90 },
      { name: 'PostgreSQL', percent: 78 },
      { name: 'AWS/Docker', percent: 82 }
    ];

    for (const skill of skills) {
      let bar = '[';
      for (let i = 0; i < 20; i++) {
        const fillPercent = (i + 1) * 5;
        if (fillPercent <= skill.percent) {
          bar += '█';
        } else {
          bar += '░';
        }
      }
      bar += `] ${skill.percent}%`;
      addOutput(`${skill.name.padEnd(15)} ${bar}`, 'output-success');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  },

  projects: () => {
    addOutput('[1] E-Commerce Platform    → FULL-STACK  ● PRODUCTION', 'output-info');
    addOutput('[2] Task Management App     → REAL-TIME   ● PRODUCTION', 'output-info');
    addOutput('[3] Weather Dashboard       → API         ● LIVE', 'output-info');
    addOutput('[4] Portfolio Generator     → SAAS        ● BETA', 'output-info');
    addOutput('', 'output-muted');
    addOutput('Type "projects <number>" for more details', 'output-muted');
  },

  contact: () => {
    addOutput('╔══════════════════════════════════════════════════════════════╗', 'output-muted');
    addOutput('║                      CONTACT INFO                            ║', 'output-muted');
    addOutput('╠══════════════════════════════════════════════════════════════╣', 'output-muted');
    addOutput('║  Email    : hello@ashraful.dev                               ║', 'output');
    addOutput('║  Website  : ashraful.dev                                     ║', 'output');
    addOutput('║  Available for freelance & consulting                       ║', 'output-muted');
    addOutput('╚══════════════════════════════════════════════════════════════╝', 'output-muted');
  },

  social: () => {
    addOutput('→ GitHub   : <span class="terminal-link" onclick="window.open(\'https://github.com/ashrafulahad\', \'_blank\')">github.com/ashrafulahad</span>', 'output-info');
    addOutput('→ LinkedIn : <span class="terminal-link" onclick="window.open(\'https://linkedin.com/in/ashrafulahad\', \'_blank\')">linkedin.com/in/ashrafulahad</span>', 'output-info');
    addOutput('→ Twitter  : <span class="terminal-link" onclick="window.open(\'https://twitter.com/ashrafulahad\', \'_blank\')">@ashrafulahad</span>', 'output-info');
    addOutput('→ Email    : <span class="terminal-link" onclick="window.open(\'mailto:hello@ashraful.dev\', \'_blank\')">hello@ashraful.dev</span>', 'output-info');
  },

  experience: () => {
    addOutput('2010 ──┬── Junior Developer', 'output-info');
    addOutput('       │   Started web journey with HTML/CSS/JS', 'output-muted');
    addOutput('2013 ──┼── Mid-level Engineer', 'output-info');
    addOutput('       │   Moved into React ecosystem', 'output-muted');
    addOutput('2016 ──┼── Senior Developer', 'output-info');
    addOutput('       │   Led frontend architecture', 'output-muted');
    addOutput('2019 ──┼── Tech Lead', 'output-info');
    addOutput('       │   Managed engineering team', 'output-muted');
    addOutput('2022 ──┴── Independent Consultant', 'output-info');
    addOutput('         Building products & consulting', 'output-muted');
  },

  'download-cv': async () => {
    addOutput('Preparing resume.pdf...', 'output-info');
    await new Promise(resolve => setTimeout(resolve, 500));
    addOutput('Downloading [████████████████████] 100%', 'output-success');
    addOutput('✓ resume.pdf saved successfully', 'output-success');
    // Would trigger actual download here
    alert('CV download would start. Replace with actual PDF URL.');
  },

  theme: (args) => {
    const colors = {
      blue: '#3b82f6',
      green: '#00ff88',
      purple: '#a855f7',
      orange: '#f97316',
      red: '#ef4444'
    };

    if (colors[args[0]]) {
      document.documentElement.style.setProperty('--terminal-accent', colors[args[0]]);
      addOutput(`Theme changed to ${args[0]}`, 'output-success');
    } else {
      addOutput('Available themes: blue, green, purple, orange, red', 'output-muted');
    }
  },

  matrix: async () => {
    matrixCanvas.classList.add('active');
    startMatrixRain();
    await new Promise(resolve => setTimeout(resolve, 5000));
    stopMatrixRain();
    matrixCanvas.classList.remove('active');
    showPrompt();
  },

  clear: () => {
    terminalOutput.innerHTML = '';
  },

  exit: () => {
    closeTerminal();
  }
};

function handleTerminalInput(e) {
  const input = e.target;

  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    input.value = '';
    currentInput = '';

    // Add command to output
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line command';
    cmdLine.innerHTML = `<span class="prompt-user">ashraful</span><span class="prompt-at">@</span><span class="prompt-host">portfolio</span>:<span class="prompt-path">~</span><span class="prompt-symbol">$</span> ${escapeHtml(cmd)}`;
    terminalOutput.appendChild(cmdLine);

    // Add to history
    if (cmd) {
      terminalHistory.push(cmd);
      historyIndex = terminalHistory.length;
    }

    // Execute command
    const [command, ...args] = cmd.split(' ');

    if (command === '') {
      showPrompt();
    } else if (terminalCommands[command]) {
      terminalCommands[command](args);
      if (command !== 'matrix') {
        showPrompt();
      }
    } else if (command === 'projects' && args[0]) {
      // Handle projects 1, 2, etc.
      showPrompt();
    } else if (command === 'ls' || command === 'whoami' || command === 'pwd' || command === 'date') {
      // Legacy commands
      if (command === 'whoami') addOutput('ashraful - Full-Stack Developer', 'output-success');
      else if (command === 'pwd') addOutput('/home/ashraful/portfolio', 'output');
      else if (command === 'date') addOutput(new Date().toString(), 'output');
      else addOutput('about.txt  projects.txt  skills.txt  contact.txt', 'output');
      showPrompt();
    } else {
      addOutput(`bash: ${command}: command not found`, 'output-error');
      addOutput('Type \'help\' to see available commands.', 'output-muted');
      showPrompt();
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      input.value = terminalHistory[historyIndex];
      currentInput = terminalHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < terminalHistory.length - 1) {
      historyIndex++;
      input.value = terminalHistory[historyIndex];
      currentInput = terminalHistory[historyIndex];
    } else {
      historyIndex = terminalHistory.length;
      input.value = '';
      currentInput = '';
    }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const partial = input.value.toLowerCase();
    const commands = Object.keys(terminalCommands);
    const match = commands.find(c => c.startsWith(partial));
    if (match) {
      input.value = match;
      currentInput = match;
    }
  } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    terminalOutput.innerHTML = '';
    showPrompt();
  } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    addOutput('^C', 'output-muted');
    showPrompt();
  }
}

// Matrix rain effect
let matrixInterval = null;
const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

function startMatrixRain() {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const columns = Math.floor(canvas.width / 20);
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88';
    ctx.font = '16px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      ctx.fillText(char, i * 20, drops[i] * 20);
      if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  matrixInterval = setInterval(draw, 50);
}

function stopMatrixRain() {
  if (matrixInterval) {
    clearInterval(matrixInterval);
    matrixInterval = null;
  }
}

// Terminal window controls
document.getElementById('terminalClose').addEventListener('click', closeTerminal);
document.getElementById('terminalMinimize').addEventListener('click', minimizeTerminal);
document.getElementById('terminalMaximize').addEventListener('click', toggleFullscreen);
document.getElementById('terminalTaskbar').addEventListener('click', restoreTerminal);

// Terminal content click to focus input
terminalContent.addEventListener('click', () => {
  const input = document.getElementById('terminalInput');
  if (input) input.focus();
});

// ============== COMMAND PALETTE ==============
const commandPaletteOverlay = document.getElementById('commandPaletteOverlay');
const commandPaletteInput = document.getElementById('commandPaletteInput');
const commandPaletteResults = document.getElementById('commandPaletteResults');

const commands = [
  { id: 'about', title: 'About', desc: 'Go to about section', icon: '👤', action: () => scrollToSection('about') },
  { id: 'projects', title: 'Projects', desc: 'View my projects', icon: '📁', action: () => scrollToSection('projects') },
  { id: 'contact', title: 'Contact', desc: 'Get in touch', icon: '✉️', action: () => scrollToSection('contact') },
  { id: 'skills', title: 'Skills', desc: 'View technical stack', icon: '🛠️', action: () => scrollToSection('stack') },
  { id: 'download-cv', title: 'Download CV', desc: 'Download resume', icon: '📄', action: () => { closeCommandPalette(); openTerminal(); setTimeout(() => terminalCommands['download-cv'](), 500); } },
  { id: 'clear', title: 'Clear', desc: 'Clear terminal', icon: '🧹', action: () => { closeCommandPalette(); openTerminal(); setTimeout(() => terminalCommands['clear'](), 500); } },
  { id: 'help', title: 'Help', desc: 'Show all commands', icon: '❓', action: () => { closeCommandPalette(); openTerminal(); } },
  { id: 'terminal', title: 'Terminal', desc: 'Open interactive terminal', icon: '💻', action: () => openTerminal() },
  { id: 'home', title: 'Home', desc: 'Go to home', icon: '🏠', action: () => scrollToSection('hero') },
];

let selectedIndex = 0;
let filteredCommands = [];

function scrollToSection(id) {
  closeCommandPalette();
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderCommands(filter = '') {
  filteredCommands = filter
    ? commands.filter(cmd => cmd.title.toLowerCase().includes(filter.toLowerCase()) || cmd.id.includes(filter.toLowerCase()))
    : commands;

  if (filteredCommands.length === 0) {
    commandPaletteResults.innerHTML = '<div class="text-center text-brand-muted py-8">No commands found</div>';
    return;
  }

  commandPaletteResults.innerHTML = filteredCommands.map((cmd, index) => `
    <div class="command-item ${index === selectedIndex ? 'selected' : ''}" data-index="${index}">
      <div class="command-item-icon">${cmd.icon}</div>
      <div class="command-item-content">
        <div class="command-item-title">${cmd.title}</div>
        <div class="command-item-desc">${cmd.desc}</div>
      </div>
      ${cmd.id === 'terminal' ? '' : '<span class="command-item-shortcut">↩</span>'}
    </div>
  `).join('');

  document.querySelectorAll('.command-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      if (filteredCommands[index]) filteredCommands[index].action();
    });
  });
}

function closeCommandPalette() {
  commandPaletteOverlay.classList.remove('active');
  commandPaletteInput.value = '';
  selectedIndex = 0;
  renderCommands();
}

function openCommandPalette() {
  commandPaletteOverlay.classList.add('active');
  commandPaletteInput.focus();
  renderCommands();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl+K to toggle command palette/terminal
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (terminalOverlay.classList.contains('active')) {
      closeTerminal();
    } else if (commandPaletteOverlay.classList.contains('active')) {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
  }

  // Escape to close
  if (e.key === 'Escape') {
    if (terminalOverlay.classList.contains('active')) {
      closeTerminal();
    } else if (commandPaletteOverlay.classList.contains('active')) {
      closeCommandPalette();
    } else if (terminalTaskbar.classList.contains('visible')) {
      terminalTaskbar.classList.remove('visible');
    }
  }

  // Command palette navigation
  if (commandPaletteOverlay.classList.contains('active')) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1);
      renderCommands(commandPaletteInput.value);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      renderCommands(commandPaletteInput.value);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) filteredCommands[selectedIndex].action();
    }
  }
});

commandPaletteInput.addEventListener('input', (e) => {
  selectedIndex = 0;
  renderCommands(e.target.value);
});

commandPaletteOverlay.addEventListener('click', (e) => {
  if (e.target === commandPaletteOverlay) {
    closeCommandPalette();
  }
});