
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });


    // Easter eggs
    document.querySelectorAll('.easter-egg').forEach(egg => {
        egg.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            showEasterEggMessage(message, this);
        });
    });

    // CTA button effects
    document.querySelectorAll('.cta-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            createRippleEffect(this);
            
            // Handle button actions
            if (this.textContent.includes('Express Weboldalt')) {
                document.querySelector('#contact').scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (this.textContent.includes('Referenciákat')) {
                document.querySelector('#portfolio').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact buttons
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            createSprayEffect(this);
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Card hover effects
    document.querySelectorAll('.service-card, .portfolio-card, .extra-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform += ' scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.02)', '');
        });
    });

    // Parallax effect for graffiti shapes
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.graffiti-shape').forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Random graffiti shapes movement
    setInterval(() => {
        document.querySelectorAll('.graffiti-shape').forEach(shape => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            shape.style.transform += ` translate(${randomX}px, ${randomY}px)`;
            
            setTimeout(() => {
                shape.style.transform = shape.style.transform.replace(` translate(${randomX}px, ${randomY}px)`, '');
            }, 2000);
        });
    }, 5000);

    // Rocket animation - launches once after 20 seconds
    function launchRocket() {
        const rocket = document.getElementById('rocket');
        if (rocket && !rocket.classList.contains('rocket-flying')) {
            rocket.classList.add('rocket-flying');
            
            // Play whoosh sound
            playSound('whoosh');
            
            setTimeout(() => {
                rocket.classList.remove('rocket-flying');
                rocket.style.display = 'none';
            }, 2500);
        }
    }
    
    // Single rocket launch after 20 seconds
    setTimeout(launchRocket, 20000);

    // Fun click effects with emojis
    document.addEventListener('click', function(e) {
        // Don't trigger on links or buttons
        if (e.target.closest('a, button, .nav-link, .cta-btn')) {
            playSound('click');
            return;
        }
        
        createClickBurst(e.clientX, e.clientY);
    });
});

// Helper functions
function createSprayEffect(element) {
    for (let i = 0; i < 5; i++) {
        const spray = document.createElement('div');
        spray.className = 'spray-effect';
        
        const rect = element.getBoundingClientRect();
        spray.style.left = (rect.left + Math.random() * rect.width) + 'px';
        spray.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(spray);
        
        setTimeout(() => {
            spray.remove();
        }, 500);
    }
}

function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'rgba(0, 0, 0, 0.3)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    
    const rect = element.getBoundingClientRect();
    ripple.style.left = (rect.left + rect.width / 2 - 10) + 'px';
    ripple.style.top = (rect.top + rect.height / 2 - 10) + 'px';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showEasterEggMessage(message, element) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.position = 'absolute';
    messageDiv.style.background = '#000000';
    messageDiv.style.color = '#ffffff';
    messageDiv.style.padding = '10px 20px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.fontWeight = 'bold';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.animation = 'fadeInUp 0.5s ease-out';
    
    const rect = element.getBoundingClientRect();
    messageDiv.style.left = (rect.left - 50) + 'px';
    messageDiv.style.top = (rect.top - 60) + 'px';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            messageDiv.remove();
        }, 500);
    }, 2000);
}

// CSS animations added via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes explode {
        0% { transform: scale(1) rotate(0deg); opacity: 1; }
        50% { transform: scale(1.5) rotate(180deg); opacity: 0.5; }
        100% { transform: scale(2) rotate(360deg); opacity: 0; }
    }
    
    @keyframes slide {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(200px); opacity: 0; }
    }
    
    @keyframes disappear {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
`;
document.head.appendChild(style);

// Sound effect functions
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'click') {
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } else if (type === 'whoosh') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 1);
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        }
    } catch (e) {
        // Audio not supported, fail silently
    }
}

// Click burst effect with random emojis
function createClickBurst(x, y) {
    const emojis = ['✨', '🌟', '💫', '⭐', '🎨', '🔥', '💥', '🎉'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const burst = document.createElement('div');
    burst.className = 'click-burst';
    burst.textContent = emoji;
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    burst.style.fontSize = '30px';
    
    document.body.appendChild(burst);
    
    setTimeout(() => {
        burst.remove();
    }, 600);
}

// Confetti effect (for special moments)
function createConfetti() {
    const colors = ['#ff0066', '#00ff88', '#0088ff', '#ffff00', '#ff8800'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.animation = `confetti-fall ${2 + Math.random() * 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confetti-fall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(${window.innerHeight + 100}px) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Easter egg: type "egyedi" to trigger confetti
let typedKeys = '';
document.addEventListener('keypress', function(e) {
    typedKeys += e.key.toLowerCase();
    if (typedKeys.includes('egyedi')) {
        createConfetti();
        typedKeys = '';
    }
    // Keep only last 10 characters
    if (typedKeys.length > 10) {
        typedKeys = typedKeys.slice(-10);
    }
});
