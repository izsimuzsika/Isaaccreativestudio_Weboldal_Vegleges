
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

    // Clickable shapes animation
    document.querySelectorAll('.click-shape').forEach(shape => {
        shape.addEventListener('click', function() {
            // Create spray effect
            createSprayEffect(this);
            
            // Random animation
            const animations = ['explode', 'slide', 'disappear'];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            
            this.style.animation = `${randomAnimation} 0.5s ease-out forwards`;
            
            setTimeout(() => {
                this.style.animation = '';
                this.style.opacity = '0.6';
            }, 1000);
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
                window.location.href = 'mailto:ilocsmandi@gmail.com?subject=Express Weboldal Kérés&body=Sziasztok! Szeretnék egy express weboldalt rendelni 24 órán belül.';
            } else if (this.textContent.includes('Referenciákat')) {
                document.querySelector('#portfolio').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact button
    document.querySelector('.contact-btn').addEventListener('click', function() {
        createSprayEffect(this);
        window.location.href = 'mailto:ilocsmandi@gmail.com?subject=Weboldal Érdeklődés&body=Sziasztok! Szeretnék egy weboldalt rendelni.';
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
