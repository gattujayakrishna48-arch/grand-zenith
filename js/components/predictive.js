/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - PREDICTIVE BI & PRICING COMPONENT
   ========================================================================== */

class PredictiveComponent {
    constructor() {
        this.currentMultiplier = 1.0;
    }

    render(container) {
        const forecastData = window.analyticsEngine.get14DayOccupancyForecast();
        const pricingData = window.analyticsEngine.getDynamicPricingRecommendations(this.currentMultiplier);
        const iotAnomalies = window.analyticsEngine.getIoTAnomalyPredictions(window.store.getState().rooms);
        const fmt = (val) => window.store.formatCurrency(val);

        container.innerHTML = `
            <!-- Top AI Insights Header -->
            <div class="ai-briefing-banner" style="background: linear-gradient(135deg, rgba(88, 28, 135, 0.8), rgba(15, 23, 42, 0.9));">
                <div class="ai-briefing-text">
                    <span class="ai-badge" style="background:rgba(236, 72, 153, 0.3);color:#FBCFE8">🔮 Predictive AI &amp; Market Intelligence Engine</span>
                    <h3>Automated Yield Optimization &amp; Preventative Diagnostics</h3>
                    <p>${pricingData.aiReasoning}</p>
                </div>
                <div style="text-align:right">
                    <div style="font-size:0.75rem;color:var(--text-muted)">PROJECTED MONTHLY REVENUE BOOST</div>
                    <div style="font-family:'Outfit',sans-serif;font-size:1.8rem;font-weight:800;color:var(--gold-primary)" id="rev-boost-display">
                        +${fmt(pricingData.projectedRevenueBoost)}
                    </div>
                </div>
            </div>

            <!-- 14-Day Occupancy & Demand Forecast -->
            <div class="glass-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3 class="card-title">14-Day Demand &amp; Occupancy Forecast</h3>
                        <span class="card-subtitle">AI Predictive Model with 95% Confidence Interval Bands</span>
                    </div>
                    <div class="card-action-group" style="display:flex;gap:0.5rem">
                        <span class="badge badge-purple">Monaco Regatta Spike Detect</span>
                    </div>
                </div>
                <div style="height: 320px; position: relative;">
                    <canvas id="chart-predictive-forecast"></canvas>
                </div>
            </div>

            <!-- Dynamic Pricing Optimization Engine -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="glass-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3 class="card-title">Dynamic Pricing Rule Manager</h3>
                            <span class="card-subtitle">Adjust market demand sensitivity multiplier</span>
                        </div>
                    </div>
                    
                    <div class="form-group" style="background:var(--bg-surface);padding:1rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);margin-bottom:1.25rem">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
                            <span class="form-label" style="margin-bottom:0">Demand Sensitivity Factor:</span>
                            <span style="font-weight:700;color:var(--gold-primary);font-size:1.1rem" id="slider-val">${this.currentMultiplier.toFixed(1)}x Surge</span>
                        </div>
                        <div class="slider-container">
                            <span style="font-size:0.75rem;color:var(--text-muted)">Conservative (0.8x)</span>
                            <input type="range" min="0.8" max="1.5" step="0.1" value="${this.currentMultiplier}" class="custom-slider" id="pricing-sensitivity-slider">
                            <span style="font-size:0.75rem;color:var(--gold-primary)">Aggressive (1.5x)</span>
                        </div>
                    </div>

                    <div style="height: 240px; position: relative;">
                        <canvas id="chart-pricing-elasticity"></canvas>
                    </div>

                    <div style="margin-top:1.25rem;text-align:right">
                        <button class="btn btn-gold" id="btn-apply-dynamic-rates">
                            ⚡ Apply AI Recommended Rates to PMS
                        </button>
                    </div>
                </div>

                <!-- IoT Anomaly & Predictive Maintenance Panel -->
                <div class="glass-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3 class="card-title">Predictive Maintenance Anomaly Feed</h3>
                            <span class="card-subtitle">IoT Equipment Failure Early Warning System</span>
                        </div>
                        <span class="badge badge-rose">${iotAnomalies.length} Critical Diagnostics</span>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:0.9rem;max-height:360px;overflow-y:auto">
                        ${iotAnomalies.map(anomaly => `
                            <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-left:4px solid ${anomaly.riskLevel === 'High' ? 'var(--rose-primary)' : 'var(--gold-primary)'};border-radius:var(--radius-md);padding:0.9rem">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem">
                                    <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary)">
                                        Room ${anomaly.roomId} - ${anomaly.component}
                                    </div>
                                    <span class="badge ${anomaly.riskLevel === 'High' ? 'badge-rose' : 'badge-gold'}">
                                        Health Score: ${anomaly.healthScore}/100
                                    </span>
                                </div>
                                <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.4rem">
                                    ${anomaly.message}
                                </div>
                                <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;color:var(--text-muted)">
                                    <span>💡 Action: ${anomaly.recommendation}</span>
                                    <button class="btn btn-secondary btn-sm btn-dispatch-maintenance" data-room="${anomaly.roomId}" data-issue="${anomaly.component}">Dispatch Tech</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Render Charts
        setTimeout(() => {
            window.chartManager.renderPredictiveForecastChart('chart-predictive-forecast', forecastData);
            window.chartManager.renderPricingElasticityChart('chart-pricing-elasticity', pricingData);
        }, 50);

        // Attach Slider Event Listener
        const slider = container.querySelector('#pricing-sensitivity-slider');
        const sliderValDisplay = container.querySelector('#slider-val');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.currentMultiplier = parseFloat(e.target.value);
                sliderValDisplay.textContent = `${this.currentMultiplier.toFixed(1)}x Surge`;
                
                const updatedPricing = window.analyticsEngine.getDynamicPricingRecommendations(this.currentMultiplier);
                container.querySelector('#rev-boost-display').textContent = `+${fmt(updatedPricing.projectedRevenueBoost)}`;
                window.chartManager.renderPricingElasticityChart('chart-pricing-elasticity', updatedPricing);
            });
        }

        // Apply Rates Button
        const applyBtn = container.querySelector('#btn-apply-dynamic-rates');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                window.app.showToast("⚡ Dynamic Rates Applied across all 120 rooms in PMS!", "success");
            });
        }

        // Dispatch Tech Button
        container.querySelectorAll('.btn-dispatch-maintenance').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const room = e.target.dataset.room;
                const issue = e.target.dataset.issue;
                window.store.createMaintenanceTicket(room, issue, "High", "Dave Miller");
                window.app.showToast(`🔧 Dispatch ticket created for Room ${room}!`, "info");
                window.app.renderCurrentTab();
            });
        });
    }
}

window.predictiveComponent = new PredictiveComponent();
