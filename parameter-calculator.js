// js/parameter-calculator.js
class ParameterCalculator {
    constructor() {
        this.performanceBaseline = {
            low: { size: 1.05, time: 1.03, memory: 1.04 },
            medium: { size: 1.15, time: 1.08, memory: 1.12 },
            high: { size: 1.25, time: 1.15, memory: 1.20 },
            ultra: { size: 1.40, time: 1.25, memory: 1.35 }
        };

        this.techniqueWeights = {
            controlFlow: 0.35,
            stringEncryption: 0.25,
            bogusCode: 0.20,
            fakeLooks: 0.15,
            cycles: 0.05
        };

        this.initEventListeners();
    }

    initEventListeners() {
        // Real-time calculation on parameter changes
        document.querySelectorAll('#obfuscation-level, #cycles, #bogus-code, #string-encryption, #fake-looks').forEach(element => {
            element.addEventListener('change', () => this.calculateAllParameters());
            element.addEventListener('input', () => this.calculateAllParameters());
        });
    }

    calculateAllParameters() {
        const config = this.getCurrentConfig();
        const results = this.calculateObfuscationMetrics(config);
        this.updateSecurityScore(results);
        this.updatePerformanceImpact(results);
        this.updateComplexityMetrics(results);
        this.generateRecommendations(config, results);
    }

    getCurrentConfig() {
        return {
            level: document.getElementById('obfuscation-level').value,
            cycles: parseInt(document.getElementById('cycles').value),
            bogusPercentage: parseInt(document.getElementById('bogus-code').value),
            stringEncryption: document.getElementById('string-encryption').checked,
            fakeLooks: document.getElementById('fake-looks').checked
        };
    }

    calculateObfuscationMetrics(config) {
        const baseMetrics = this.getBaseMetrics(config.level);
        const complexity = this.calculateComplexityScore(config);
        const performance = this.calculatePerformanceImpact(config);
        const security = this.calculateSecurityScore(config, complexity);
        
        return {
            bogusInstructions: this.calculateBogusInstructions(config),
            encryptedStrings: this.calculateEncryptedStrings(config),
            fakeLooks: this.calculateFakeLooks(config),
            controlFlowFunctions: this.calculateControlFlowFunctions(config),
            complexityScore: complexity,
            securityScore: security,
            performanceImpact: performance,
            recommendedSettings: this.getRecommendedSettings(config, complexity)
        };
    }

    getBaseMetrics(level) {
        const metrics = {
            low: { baseBogus: 500, baseStrings: 20, baseFakes: 5, baseComplexity: 30 },
            medium: { baseBogus: 1500, baseStrings: 50, baseFakes: 12, baseComplexity: 60 },
            high: { baseBogus: 4000, baseStrings: 100, baseFakes: 25, baseComplexity: 85 },
            ultra: { baseBogus: 8000, baseStrings: 200, baseFakes: 50, baseComplexity: 95 }
        };
        return metrics[level] || metrics.medium;
    }

    calculateBogusInstructions(config) {
        const base = this.getBaseMetrics(config.level).baseBogus;
        const bogusMultiplier = config.bogusPercentage / 15; // 15% is medium baseline
        const cycleMultiplier = 1 + (config.cycles - 1) * 0.3;
        
        return Math.round(base * bogusMultiplier * cycleMultiplier);
    }

    calculateEncryptedStrings(config) {
        if (!config.stringEncryption) return 0;
        
        const base = this.getBaseMetrics(config.level).baseStrings;
        const cycleMultiplier = 1 + (config.cycles - 1) * 0.2;
        
        return Math.round(base * cycleMultiplier);
    }

    calculateFakeLooks(config) {
        if (!config.fakeLooks) return 0;
        
        const base = this.getBaseMetrics(config.level).baseFakes;
        const cycleMultiplier = 1 + (config.cycles - 1) * 0.25;
        
        return Math.round(base * cycleMultiplier);
    }

    calculateControlFlowFunctions(config) {
        const baseFunctions = { low: 3, medium: 8, high: 20, ultra: 40 };
        const base = baseFunctions[config.level] || baseFunctions.medium;
        const cycleMultiplier = 1 + (config.cycles - 1) * 0.4;
        
        return Math.round(base * cycleMultiplier);
    }

    calculateComplexityScore(config) {
        let score = this.getBaseMetrics(config.level).baseComplexity;
        
        // Adjust for cycles
        score += (config.cycles - 1) * 8;
        
        // Adjust for bogus code percentage
        score += (config.bogusPercentage - 15) * 0.8;
        
        // Adjust for features
        if (config.stringEncryption) score += 12;
        if (config.fakeLooks) score += 8;
        
        return Math.min(Math.round(score), 100);
    }

    calculateSecurityScore(config, complexity) {
        let security = complexity * 0.7; // Base security from complexity
        
        // Bonus for specific techniques
        if (config.stringEncryption) security += 15;
        if (config.level === 'high' || config.level === 'ultra') security += 10;
        if (config.cycles > 2) security += 5;
        
        return Math.min(Math.round(security), 100);
    }

    calculatePerformanceImpact(config) {
        const base = this.performanceBaseline[config.level];
        const cycleMultiplier = 1 + (config.cycles - 1) * 0.08;
        const bogusMultiplier = 1 + (config.bogusPercentage / 100) * 0.3;
        
        return {
            size: ((base.size * cycleMultiplier * bogusMultiplier - 1) * 100).toFixed(1),
            time: ((base.time * cycleMultiplier - 1) * 100).toFixed(1),
            memory: ((base.memory * cycleMultiplier - 1) * 100).toFixed(1)
        };
    }

    updateSecurityScore(results) {
        document.getElementById('report-score').textContent = `${results.securityScore}/100`;
        
        // Update security indicator
        this.updateSecurityIndicator(results.securityScore);
    }

    updateSecurityIndicator(score) {
        const indicator = document.getElementById('security-indicator') || this.createSecurityIndicator();
        indicator.innerHTML = this.generateSecurityBadge(score);
    }

    createSecurityIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'security-indicator';
        indicator.className = 'security-indicator';
        document.querySelector('.result-card').appendChild(indicator);
        return indicator;
    }

    generateSecurityBadge(score) {
        let level, color, icon;
        
        if (score >= 90) {
            level = 'Maximum Security';
            color = '#10b981';
            icon = 'fa-shield-check';
        } else if (score >= 75) {
            level = 'High Security';
            color = '#3b82f6';
            icon = 'fa-shield-alt';
        } else if (score >= 60) {
            level = 'Medium Security';
            color = '#f59e0b';
            icon = 'fa-shield';
        } else {
            level = 'Basic Protection';
            color = '#ef4444';
            icon = 'fa-shield-virus';
        }
        
        return `
            <div class="security-badge" style="border-left-color: ${color}">
                <i class="fas ${icon}" style="color: ${color}"></i>
                <span>${level}</span>
                <small>${score}/100</small>
            </div>
        `;
    }

    updatePerformanceImpact(results) {
        document.getElementById('metric-size').textContent = `+${results.performanceImpact.size}%`;
        document.getElementById('metric-time').textContent = `+${results.performanceImpact.time}%`;
        document.getElementById('metric-memory').textContent = `+${results.performanceImpact.memory}%`;
        
        // Add color coding based on impact level
        this.colorCodePerformanceMetrics(results.performanceImpact);
    }

    colorCodePerformanceMetrics(impact) {
        const metrics = ['size', 'time', 'memory'];
        metrics.forEach(metric => {
            const element = document.getElementById(`metric-${metric}`);
            const value = parseFloat(impact[metric]);
            
            if (value < 10) {
                element.style.color = '#10b981'; // Green
            } else if (value < 25) {
                element.style.color = '#f59e0b'; // Yellow
            } else {
                element.style.color = '#ef4444'; // Red
            }
        });
    }

    updateComplexityMetrics(results) {
        // Update the main report values
        document.getElementById('report-bogus').textContent = results.bogusInstructions.toLocaleString();
        document.getElementById('report-strings').textContent = results.encryptedStrings;
        document.getElementById('report-fakes').textContent = results.fakeLooks;
        
        // Add complexity visualization
        this.updateComplexityVisualization(results.complexityScore);
    }

    updateComplexityVisualization(complexity) {
        let complexityElement = document.getElementById('complexity-visualization');
        if (!complexityElement) {
            complexityElement = document.createElement('div');
            complexityElement.id = 'complexity-visualization';
            complexityElement.className = 'complexity-visualization';
            document.querySelector('.result-card').appendChild(complexityElement);
        }
        
        complexityElement.innerHTML = this.generateComplexityBar(complexity);
    }

    generateComplexityBar(complexity) {
        return `
            <div class="complexity-bar">
                <div class="complexity-label">Obfuscation Complexity</div>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${complexity}%"></div>
                    <div class="bar-marker low" style="left: 25%"></div>
                    <div class="bar-marker medium" style="left: 50%"></div>
                    <div class="bar-marker high" style="left: 75%"></div>
                </div>
                <div class="complexity-value">${complexity}%</div>
            </div>
        `;
    }

    generateRecommendations(config, results) {
        const recommendations = this.analyzeConfiguration(config, results);
        this.displayRecommendations(recommendations);
    }

    analyzeConfiguration(config, results) {
        const recommendations = [];
        
        // Analyze security vs performance trade-off
        if (results.securityScore > 90 && parseFloat(results.performanceImpact.time) > 20) {
            recommendations.push({
                type: 'warning',
                message: 'High performance impact detected. Consider reducing obfuscation cycles.',
                suggestion: 'Try reducing cycles to 2-3 for better performance.'
            });
        }
        
        if (config.bogusPercentage > 30) {
            recommendations.push({
                type: 'info',
                message: 'High bogus code percentage may affect maintainability.',
                suggestion: 'Keep bogus code below 30% for better debug capability.'
            });
        }
        
        if (config.level === 'low' && config.stringEncryption) {
            recommendations.push({
                type: 'success',
                message: 'Good balance: String encryption adds security with minimal performance cost.',
                suggestion: 'Consider enabling control flow obfuscation for better protection.'
            });
        }
        
        if (results.securityScore < 60) {
            recommendations.push({
                type: 'error',
                message: 'Low security level detected.',
                suggestion: 'Increase obfuscation level to Medium or enable additional features.'
            });
        }
        
        return recommendations;
    }

    displayRecommendations(recommendations) {
        let container = document.getElementById('recommendations-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'recommendations-container';
            container.className = 'recommendations-container';
            document.querySelector('.demo-results').appendChild(container);
        }
        
        if (recommendations.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        container.innerHTML = `
            <h4>Recommendations</h4>
            ${recommendations.map(rec => `
                <div class="recommendation ${rec.type}">
                    <i class="fas fa-${this.getRecommendationIcon(rec.type)}"></i>
                    <div class="recommendation-content">
                        <div class="recommendation-message">${rec.message}</div>
                        <div class="recommendation-suggestion">${rec.suggestion}</div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    getRecommendationIcon(type) {
        const icons = {
            warning: 'exclamation-triangle',
            info: 'info-circle',
            success: 'check-circle',
            error: 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    }

    getRecommendedSettings(config, complexity) {
        const recommendations = {};
        
        if (complexity < 50) {
            recommendations.level = config.level === 'low' ? 'medium' : config.level;
            recommendations.cycles = Math.min(config.cycles + 1, 5);
        }
        
        if (complexity > 80 && parseFloat(this.calculatePerformanceImpact(config).time) > 15) {
            recommendations.cycles = Math.max(config.cycles - 1, 1);
        }
        
        return recommendations;
    }

    // Method to calculate optimal settings for target security level
    calculateOptimalSettings(targetSecurity = 80, maxPerformanceImpact = 15) {
        const levels = ['low', 'medium', 'high', 'ultra'];
        
        for (let level of levels) {
            for (let cycles = 1; cycles <= 5; cycles++) {
                const testConfig = {
                    level: level,
                    cycles: cycles,
                    bogusPercentage: 15,
                    stringEncryption: true,
                    fakeLooks: true
                };
                
                const results = this.calculateObfuscationMetrics(testConfig);
                const performanceImpact = parseFloat(results.performanceImpact.time);
                
                if (results.securityScore >= targetSecurity && performanceImpact <= maxPerformanceImpact) {
                    return {
                        level: level,
                        cycles: cycles,
                        bogusPercentage: 15,
                        stringEncryption: true,
                        fakeLooks: true,
                        securityScore: results.securityScore,
                        performanceImpact: performanceImpact
                    };
                }
            }
        }
        
        return null; // No configuration meets criteria
    }

    // Export current configuration
    exportConfiguration() {
        const config = this.getCurrentConfig();
        const results = this.calculateObfuscationMetrics(config);
        
        return {
            configuration: config,
            metrics: results,
            command: this.generateCommandLine(config),
            timestamp: new Date().toISOString()
        };
    }

    generateCommandLine(config) {
        let command = `./llvm_obfuscator -i input.bc -o output_obfuscated`;
        command += ` -l ${config.level}`;
        command += ` -c ${config.cycles}`;
        command += ` -b ${config.bogusPercentage}`;
        if (config.stringEncryption) command += ' --string-encryption';
        if (config.fakeLooks) command += ' --fake-looks';
        
        return command;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.parameterCalculator = new ParameterCalculator();
    
    // Add CSS for new elements
    const style = document.createElement('style');
    style.textContent = `
        .security-indicator {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
        }
        
        .security-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem;
            background: #f8fafc;
            border-left: 4px solid;
            border-radius: 0.375rem;
        }
        
        .security-badge i {
            font-size: 1.25rem;
        }
        
        .security-badge span {
            font-weight: 600;
            flex: 1;
        }
        
        .security-badge small {
            color: #6b7280;
        }
        
        .complexity-visualization {
            margin-top: 1rem;
        }
        
        .complexity-bar {
            background: #f8fafc;
            padding: 1rem;
            border-radius: 0.5rem;
        }
        
        .complexity-label {
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 0.5rem;
        }
        
        .bar-container {
            position: relative;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin: 0.5rem 0;
        }
        
        .bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
            border-radius: 4px;
            transition: width 0.5s ease;
        }
        
        .bar-marker {
            position: absolute;
            top: -2px;
            width: 2px;
            height: 12px;
            background: #9ca3af;
        }
        
        .bar-marker::after {
            content: attr(data-level);
            position: absolute;
            top: 15px;
            left: -10px;
            font-size: 0.75rem;
            color: #6b7280;
        }
        
        .bar-marker.low::after { content: 'Low'; }
        .bar-marker.medium::after { content: 'Medium'; }
        .bar-marker.high::after { content: 'High'; }
        
        .complexity-value {
            text-align: center;
            font-weight: 600;
            color: #1f2937;
        }
        
        .recommendations-container {
            margin-top: 1.5rem;
        }
        
        .recommendations-container h4 {
            margin-bottom: 1rem;
            color: #1f2937;
        }
        
        .recommendation {
            display: flex;
            gap: 0.75rem;
            padding: 1rem;
            margin-bottom: 0.75rem;
            border-radius: 0.5rem;
            border-left: 4px solid;
        }
        
        .recommendation.warning {
            background: #fffbeb;
            border-left-color: #f59e0b;
            color: #92400e;
        }
        
        .recommendation.info {
            background: #eff6ff;
            border-left-color: #3b82f6;
            color: #1e40af;
        }
        
        .recommendation.success {
            background: #f0fdf4;
            border-left-color: #10b981;
            color: #065f46;
        }
        
        .recommendation.error {
            background: #fef2f2;
            border-left-color: #ef4444;
            color: #991b1b;
        }
        
        .recommendation i {
            font-size: 1.25rem;
            margin-top: 0.125rem;
        }
        
        .recommendation-content {
            flex: 1;
        }
        
        .recommendation-message {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .recommendation-suggestion {
            font-size: 0.875rem;
            opacity: 0.9;
        }
    `;
    document.head.appendChild(style);
});

// Utility functions for external use
window.ObfuscationCalculator = {
    calculateOptimal: (targetSecurity, maxPerformanceImpact) => {
        return window.parameterCalculator.calculateOptimalSettings(targetSecurity, maxPerformanceImpact);
    },
    
    exportConfig: () => {
        return window.parameterCalculator.exportConfiguration();
    },
    
    generateCommand: (config) => {
        return window.parameterCalculator.generateCommandLine(config);
    }
};