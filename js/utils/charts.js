/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - CHART UTILITIES (CHART.JS WRAPPERS)
   ========================================================================== */

class ChartManager {
    constructor() {
        this.chartInstances = {};
    }

    destroyChart(canvasId) {
        if (this.chartInstances[canvasId]) {
            this.chartInstances[canvasId].destroy();
            delete this.chartInstances[canvasId];
        }
    }

    /**
     * Render Executive Revenue & RevPAR Trend Line Chart
     */
    renderRevenueTrendChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        this.destroyChart(canvasId);

        const ctx = canvas.getContext('2d');
        
        // Gradient fill
        const gradient1 = ctx.createLinearGradient(0, 0, 0, 300);
        gradient1.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
        gradient1.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

        const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
        gradient2.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
        gradient2.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

        this.chartInstances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Total Revenue ($)',
                        data: [28500, 31200, 33400, 34800, 41500, 44200, 36225],
                        borderColor: '#F59E0B',
                        backgroundColor: gradient1,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#F59E0B',
                        pointRadius: 4
                    },
                    {
                        label: 'RevPAR ($)',
                        data: [237.5, 260.0, 278.3, 290.0, 345.8, 368.3, 301.8],
                        borderColor: '#06B6D4',
                        backgroundColor: gradient2,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#06B6D4',
                        pointRadius: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#94A3B8', font: { family: 'Inter', size: 12 } }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderWidth: 1,
                        titleColor: '#F8FAFC',
                        bodyColor: '#CBD5E1'
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94A3B8', font: { family: 'Inter' } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94A3B8', font: { family: 'Inter' } }
                    }
                }
            }
        });
    }

    /**
     * Render Occupancy Breakdown Donut Chart
     */
    renderOccupancyDonutChart(canvasId, metrics) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        this.destroyChart(canvasId);

        const ctx = canvas.getContext('2d');

        this.chartInstances[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Occupied', 'Clean & Ready', 'Dirty / Pending', 'Out of Order / Maint.'],
                datasets: [{
                    data: [metrics.occupiedCount, metrics.cleanCount, metrics.dirtyCount, metrics.outOfOrderCount],
                    backgroundColor: [
                        '#F59E0B', // Occupied (Amber)
                        '#10B981', // Clean (Emerald)
                        '#F43F5E', // Dirty (Rose)
                        '#EC4899'  // Maintenance (Pink)
                    ],
                    borderWidth: 2,
                    borderColor: '#0F172A'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94A3B8', font: { family: 'Inter', size: 11 }, padding: 15 }
                    }
                }
            }
        });
    }

    /**
     * Render 14-Day Predictive Forecast Area Chart with Confidence Bands
     */
    renderPredictiveForecastChart(canvasId, forecastData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        this.destroyChart(canvasId);

        const ctx = canvas.getContext('2d');

        this.chartInstances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: forecastData.labels,
                datasets: [
                    {
                        label: 'Historical Occupancy %',
                        data: forecastData.historical,
                        borderColor: '#10B981',
                        borderWidth: 3,
                        pointRadius: 3,
                        tension: 0.2
                    },
                    {
                        label: 'AI Forecasted Occupancy %',
                        data: forecastData.forecast,
                        borderColor: '#A855F7',
                        borderDash: [5, 5],
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#A855F7',
                        tension: 0.3
                    },
                    {
                        label: 'Upper Confidence (95%)',
                        data: forecastData.upperConfidence,
                        borderColor: 'transparent',
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        fill: '+1',
                        pointRadius: 0
                    },
                    {
                        label: 'Lower Confidence (95%)',
                        data: forecastData.lowerConfidence,
                        borderColor: 'transparent',
                        backgroundColor: 'transparent',
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#94A3B8', font: { family: 'Inter', size: 11 } }
                    },
                    tooltip: {
                        backgroundColor: '#0F172A',
                        borderColor: '#A855F7',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94A3B8', font: { family: 'Inter' } }
                    },
                    y: {
                        min: 50,
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94A3B8', font: { family: 'Inter' }, callback: v => v + '%' }
                    }
                }
            }
        });
    }

    /**
     * Render Dynamic Pricing Elasticity Bar Chart
     */
    renderPricingElasticityChart(canvasId, pricingData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        this.destroyChart(canvasId);

        const ctx = canvas.getContext('2d');

        const labels = pricingData.categories.map(c => c.type);
        const currentRates = pricingData.categories.map(c => c.baseRate);
        const recommendedRates = pricingData.categories.map(c => c.recRate);

        this.chartInstances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Current Rack Rate ($)',
                        data: currentRates,
                        backgroundColor: 'rgba(148, 163, 184, 0.5)',
                        borderRadius: 6
                    },
                    {
                        label: 'AI Recommended Dynamic Rate ($)',
                        data: recommendedRates,
                        backgroundColor: 'rgba(245, 158, 11, 0.85)',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#94A3B8', font: { family: 'Inter', size: 11 } }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94A3B8' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94A3B8', callback: v => '$' + v }
                    }
                }
            }
        });
    }
}

window.chartManager = new ChartManager();
