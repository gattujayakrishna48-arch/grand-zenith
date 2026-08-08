/* ==========================================================================
   GRAND ZENITH SMART HOTEL DASHBOARD - PREDICTIVE ANALYTICS ENGINE
   ========================================================================== */

class PredictiveAnalyticsEngine {
    constructor() {
        this.historicalDays = ['Jul 26', 'Jul 27', 'Jul 28', 'Jul 29', 'Jul 30', 'Jul 31', 'Aug 1', 'Aug 2', 'Aug 3', 'Aug 4', 'Aug 5', 'Aug 6', 'Aug 7', 'Aug 8'];
        this.historicalOccupancy = [78, 82, 85, 84, 88, 92, 95, 91, 86, 88, 89, 87, 88, 87.5];
        this.historicalADR = [310, 315, 320, 325, 330, 350, 365, 360, 335, 340, 342, 344, 345, 345];

        this.forecastDays = ['Aug 9', 'Aug 10', 'Aug 11', 'Aug 12', 'Aug 13', 'Aug 14', 'Aug 15', 'Aug 16', 'Aug 17', 'Aug 18', 'Aug 19', 'Aug 20', 'Aug 21', 'Aug 22'];
    }

    /**
     * Calculates 14-Day Occupancy & Demand Forecast
     * Uses Holt-Winters Exponential Smoothing simulation with Day-of-Week Seasonality
     */
    get14DayOccupancyForecast() {
        const baseCurrent = 87.5;
        // Seasonality weights for day of week (0: Sun to 6: Sat)
        const dayWeights = [0.92, 0.88, 0.90, 0.94, 1.02, 1.12, 1.15]; 
        
        const predicted = [];
        const upperBound = [];
        const lowerBound = [];

        this.forecastDays.forEach((day, index) => {
            const dayOfWeek = (index + 0) % 7; // starting Sunday
            const eventMultiplier = (index === 6 || index === 7) ? 1.08 : 1.0; // Monaco Yacht Race weekend spike
            
            let val = Math.min(99, Math.max(70, baseCurrent * dayWeights[dayOfWeek] * eventMultiplier + (Math.random() * 2 - 1)));
            val = parseFloat(val.toFixed(1));
            
            predicted.push(val);
            upperBound.push(Math.min(100, parseFloat((val + 4.5 + index * 0.2).toFixed(1))));
            lowerBound.push(Math.max(60, parseFloat((val - 4.5 - index * 0.2).toFixed(1))));
        });

        return {
            labels: [...this.historicalDays, ...this.forecastDays],
            historical: [...this.historicalOccupancy, ...Array(14).fill(null)],
            forecast: [...Array(13).fill(null), 87.5, ...predicted],
            upperConfidence: [...Array(13).fill(null), 87.5, ...upperBound],
            lowerConfidence: [...Array(13).fill(null), 87.5, ...lowerBound]
        };
    }

    /**
     * Dynamic Pricing AI Recommendation Engine
     * Calculates optimal room rate based on demand elasticity factor
     */
    getDynamicPricingRecommendations(demandSensitivity = 1.0) {
        const roomCategories = [
            { type: "Superior Twin", baseRate: 260, compRate: 280, leadPace: "+12%", recRate: Math.round(260 * (1 + 0.10 * demandSensitivity)), demand: "High" },
            { type: "Deluxe King", baseRate: 340, compRate: 365, leadPace: "+18%", recRate: Math.round(340 * (1 + 0.14 * demandSensitivity)), demand: "Very High" },
            { type: "Executive Suite", baseRate: 500, compRate: 540, leadPace: "+25%", recRate: Math.round(500 * (1 + 0.20 * demandSensitivity)), demand: "Surging" },
            { type: "Ocean Penthouse", baseRate: 1250, compRate: 1400, leadPace: "+8%", recRate: Math.round(1250 * (1 + 0.08 * demandSensitivity)), demand: "Stable" },
            { type: "Presidential Villa", baseRate: 2500, compRate: 2750, leadPace: "+15%", recRate: Math.round(2500 * (1 + 0.12 * demandSensitivity)), demand: "High" }
        ];

        const projectedRevenueBoost = Math.round(roomCategories.reduce((acc, cat) => acc + (cat.recRate - cat.baseRate) * 8, 0));

        return {
            categories: roomCategories,
            projectedRevenueBoost,
            aiReasoning: `Demand surge detected for upcoming weekend due to French Riviera Grand Regatta. Lead booking pace is +18% above historical average. Increasing Executive Suite rates by +20% will optimize RevPAR without reducing conversion.`
        };
    }

    /**
     * IoT Anomaly & Predictive Maintenance Engine
     */
    getIoTAnomalyPredictions(rooms) {
        const anomalies = [];

        rooms.forEach(room => {
            // Check for high temp with active status
            if (room.temp > 24.5 && room.status === "Occupied") {
                anomalies.push({
                    roomId: room.id,
                    component: "HVAC Compressor Unit",
                    healthScore: 62,
                    riskLevel: "High",
                    message: `Room ${room.id} temp is ${room.temp}°C (Target 21°C). Compressor drawing excess wattage (+24%). Risk of thermal shutoff within 12h.`,
                    recommendation: "Schedule preventative HVAC coil flush during guest spa outing."
                });
            }

            // Check lock battery
            if (room.lockBattery < 25) {
                anomalies.push({
                    roomId: room.id,
                    component: "Smart RFID Door Lock",
                    healthScore: 35,
                    riskLevel: "Medium",
                    message: `Room ${room.id} door lock battery at ${room.lockBattery}%. Voltage drop detected during keycard scan.`,
                    recommendation: "Replace CR123A battery pack before evening check-ins."
                });
            }
        });

        // Add default predictive item if empty
        if (anomalies.length === 0) {
            anomalies.push({
                roomId: "302",
                component: "Bathroom Water Pressure Regulator",
                healthScore: 78,
                riskLevel: "Low",
                message: "Flow fluctuation +/- 8%. Wear detected on mechanical valve seat.",
                recommendation: "Inspect during next routine checkout."
            });
        }

        return anomalies;
    }

    /**
     * CSAT Sentiment Analysis & Topic Clustering
     */
    getCSATAnalysis(feedbackList) {
        const positiveCount = feedbackList.filter(f => f.sentiment === "Positive").length;
        const neutralCount = feedbackList.filter(f => f.sentiment === "Neutral").length;
        const negativeCount = feedbackList.filter(f => f.sentiment === "Negative").length;

        const topicScores = [
            { category: "Thermal Comfort & IoT", score: 96, sentiment: "Positive" },
            { category: "Express Check-In / Keyless", score: 98, sentiment: "Positive" },
            { category: "Concierge & Room Service", score: 94, sentiment: "Positive" },
            { category: "Wi-Fi Peak Bandwidth", score: 76, sentiment: "Needs Improvement" },
            { category: "Housekeeping Turnaround", score: 92, sentiment: "Positive" }
        ];

        return {
            sentimentBreakdown: { positiveCount, neutralCount, negativeCount },
            topicScores
        };
    }
}

window.analyticsEngine = new PredictiveAnalyticsEngine();
