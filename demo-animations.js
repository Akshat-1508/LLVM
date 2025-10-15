// js/demo-animations.js
class ObfuscationDemo {
    constructor() {
        this.levels = {
            low: { bogus: 5, strings: 20, fakes: 2, score: 65, size: 5, time: 3, memory: 4 },
            medium: { bogus: 15, strings: 45, fakes: 8, score: 87, size: 15, time: 8, memory: 12 },
            high: { bogus: 25, strings: 75, fakes: 15, score: 94, size: 25, time: 15, memory: 20 },
            ultra: { bogus: 40, strings: 95, fakes: 25, score: 98, size: 40, time: 25, memory: 35 }
        };
    }

    updateDemo() {
        const level = document.getElementById('obfuscation-level').value;
        const cycles = parseInt(document.getElementById('cycles').value);
        const bogusPercentage = parseInt(document.getElementById('bogus-code').value);
        const stringEncryption = document.getElementById('string-encryption').checked;
        const fakeLooks = document.getElementById('fake-looks').checked;

        const base = this.levels[level];
        
        // Calculate values based on parameters
        const bogusInstructions = Math.round(base.bogus * (bogusPercentage / 15) * cycles);
        const encryptedStrings = stringEncryption ? Math.round(base.strings * cycles) : 0;
        const fakeLookCount = fakeLooks ? Math.round(base.fakes * cycles) : 0;
        const securityScore = this.calculateSecurityScore(level, cycles, bogusPercentage, stringEncryption, fakeLooks);
        
        // Update report
        document.getElementById('report-level').textContent = this.capitalize(level);
        document.getElementById('report-cycles').textContent = cycles;
        document.getElementById('report-bogus').textContent = bogusInstructions.toLocaleString();
        document.getElementById('report-strings').textContent = encryptedStrings;
        document.getElementById('report-fakes').textContent = fakeLookCount;
        document.getElementById('report-score').textContent = `${securityScore}/100`;
        
        // Update performance metrics
        document.getElementById('metric-size').textContent = `+${base.size}%`;
        document.getElementById('metric-time').textContent = `+${base.time}%`;
        document.getElementById('metric-memory').textContent = `+${base.memory}%`;
    }

    calculateSecurityScore(level, cycles, bogusPercentage, stringEncryption, fakeLooks) {
        let score = this.levels[level].score;
        
        // Adjust based on cycles
        score += (cycles - 1) * 3;
        
        // Adjust based on bogus code percentage
        score += (bogusPercentage - 15) * 0.2;
        
        // Adjust based on features
        if (stringEncryption) score += 5;
        if (fakeLooks) score += 3;
        
        return Math.min(Math.round(score), 100);
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    runObfuscationDemo() {
        const runButton = document.querySelector('.demo-controls .btn-primary');
        const originalText = runButton.innerHTML;
        
        // Show loading state
        runButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        runButton.disabled = true;
        
        // Simulate processing time
        setTimeout(() => {
            this.animateResults();
            runButton.innerHTML = '<i class="fas fa-check"></i> Obfuscation Complete!';
            
            // Reset button after delay
            setTimeout(() => {
                runButton.innerHTML = originalText;
                runButton.disabled = false;
            }, 2000);
        }, 1500);
    }

    animateResults() {
        const elements = [
            'report-bogus',
            'report-strings', 
            'report-fakes',
            'report-score'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            const finalValue = element.textContent;
            element.textContent = '0';
            this.animateValue(element, 0, parseInt(finalValue.replace(/,/g, '')), 1000);
        });
    }

    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}

// Initialize demo
const demo = new ObfuscationDemo();

// Global functions for HTML event handlers
function updateDemo() {
    demo.updateDemo();
}

function runObfuscationDemo() {
    demo.runObfuscationDemo();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    demo.updateDemo();
});