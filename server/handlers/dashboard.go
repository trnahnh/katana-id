package handlers

import (
	"context"
	"net/http"
	"time"

	"katanaid/database"
	"katanaid/middleware"
	"katanaid/util"
)

// =============================================================================
// TYPES
// =============================================================================

type DailyCount struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
}

type ServiceUsage struct {
	ServiceName string       `json:"service_name"`
	ServiceKey  string       `json:"service_key"`
	TotalCalls  int          `json:"total_calls"`
	RecentCalls []DailyCount `json:"recent_calls"`
}

type DashboardStatsResponse struct {
	TotalCalls int            `json:"total_calls"`
	Services   []ServiceUsage `json:"services"`
	TimeRange  string         `json:"time_range"`
}

// =============================================================================
// HANDLER
// =============================================================================

func GetDashboardStats(w http.ResponseWriter, r *http.Request) {
	_, ok := middleware.GetUserFromContext(r.Context())
	if !ok {
		util.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "Unauthorized"})
		return
	}

	// Parse time range (default: 7d)
	timeRange := r.URL.Query().Get("range")
	if timeRange == "" {
		timeRange = "7d"
	}

	days := parseTimeRange(timeRange)
	startDate := time.Now().AddDate(0, 0, -days)

	ctx := r.Context()
	services := []ServiceUsage{}
	totalCalls := 0

	// Generative Identity - from analyses table (global, no user filter)
	identityUsage := getGlobalServiceUsage(ctx, "Generative Identity", "generative-identity",
		`SELECT DATE(created_at) as date, COUNT(*) as count 
		 FROM analyses 
		 WHERE created_at >= $1 
		 GROUP BY DATE(created_at) 
		 ORDER BY date`,
		`SELECT COUNT(*) FROM analyses WHERE created_at >= $1`,
		startDate, days)
	services = append(services, identityUsage)
	totalCalls += identityUsage.TotalCalls

	// Email Fraud - from spam_checks table (no user_id, count all)
	emailFraudUsage := getGlobalServiceUsage(ctx, "Email Fraud", "email-fraud",
		`SELECT DATE(checked_at) as date, COUNT(*) as count 
		 FROM spam_checks 
		 WHERE checked_at >= $1 
		 GROUP BY DATE(checked_at) 
		 ORDER BY date`,
		`SELECT COUNT(*) FROM spam_checks WHERE checked_at >= $1`,
		startDate, days)
	services = append(services, emailFraudUsage)
	totalCalls += emailFraudUsage.TotalCalls

	// CAPTCHA - from captcha_sessions table
	captchaUsage := getGlobalServiceUsage(ctx, "CAPTCHA", "captcha",
		`SELECT DATE(created_at) as date, COUNT(*) as count 
		 FROM captcha_sessions 
		 WHERE created_at >= $1 
		 GROUP BY DATE(created_at) 
		 ORDER BY date`,
		`SELECT COUNT(*) FROM captcha_sessions WHERE created_at >= $1`,
		startDate, days)
	services = append(services, captchaUsage)
	totalCalls += captchaUsage.TotalCalls

	// Trust Score - from device_fingerprints table (global, no user filter)
	trustUsage := getGlobalServiceUsage(ctx, "Trust Score", "trust",
		`SELECT DATE(created_at) as date, COUNT(*) as count 
		 FROM device_fingerprints 
		 WHERE created_at >= $1 
		 GROUP BY DATE(created_at) 
		 ORDER BY date`,
		`SELECT COUNT(*) FROM device_fingerprints WHERE created_at >= $1`,
		startDate, days)
	services = append(services, trustUsage)
	totalCalls += trustUsage.TotalCalls

	// Traffic Analytics - placeholder (no table yet)
	trafficUsage := ServiceUsage{
		ServiceName: "Traffic Analytics",
		ServiceKey:  "traffic-analytics",
		TotalCalls:  0,
		RecentCalls: generateEmptyDays(days),
	}
	services = append(services, trafficUsage)

	// Email Service - placeholder (no table yet)
	emailServiceUsage := ServiceUsage{
		ServiceName: "Email Service",
		ServiceKey:  "email-service",
		TotalCalls:  0,
		RecentCalls: generateEmptyDays(days),
	}
	services = append(services, emailServiceUsage)

	util.WriteJSON(w, http.StatusOK, DashboardStatsResponse{
		TotalCalls: totalCalls,
		Services:   services,
		TimeRange:  timeRange,
	})
}

// =============================================================================
// HELPERS
// =============================================================================

func parseTimeRange(timeRange string) int {
	switch timeRange {
	case "30d":
		return 30
	case "90d":
		return 90
	default:
		return 7
	}
}

func getServiceUsage(ctx context.Context, userID int, name, key, dailyQuery, totalQuery string, startDate time.Time, days int) ServiceUsage {
	usage := ServiceUsage{
		ServiceName: name,
		ServiceKey:  key,
		TotalCalls:  0,
		RecentCalls: generateEmptyDays(days),
	}

	// Get total count
	err := database.DB.QueryRow(ctx, totalQuery, userID, startDate).Scan(&usage.TotalCalls)
	if err != nil {
		return usage
	}

	// Get daily counts
	rows, err := database.DB.Query(ctx, dailyQuery, userID, startDate)
	if err != nil {
		return usage
	}
	defer rows.Close()

	dailyCounts := make(map[string]int)
	for rows.Next() {
		var date time.Time
		var count int
		if err := rows.Scan(&date, &count); err == nil {
			dailyCounts[date.Format("2006-01-02")] = count
		}
	}

	// Merge with empty days
	for i := range usage.RecentCalls {
		if count, ok := dailyCounts[usage.RecentCalls[i].Date]; ok {
			usage.RecentCalls[i].Count = count
		}
	}

	return usage
}

func getGlobalServiceUsage(ctx context.Context, name, key, dailyQuery, totalQuery string, startDate time.Time, days int) ServiceUsage {
	usage := ServiceUsage{
		ServiceName: name,
		ServiceKey:  key,
		TotalCalls:  0,
		RecentCalls: generateEmptyDays(days),
	}

	// Get total count
	err := database.DB.QueryRow(ctx, totalQuery, startDate).Scan(&usage.TotalCalls)
	if err != nil {
		return usage
	}

	// Get daily counts
	rows, err := database.DB.Query(ctx, dailyQuery, startDate)
	if err != nil {
		return usage
	}
	defer rows.Close()

	dailyCounts := make(map[string]int)
	for rows.Next() {
		var date time.Time
		var count int
		if err := rows.Scan(&date, &count); err == nil {
			dailyCounts[date.Format("2006-01-02")] = count
		}
	}

	// Merge with empty days
	for i := range usage.RecentCalls {
		if count, ok := dailyCounts[usage.RecentCalls[i].Date]; ok {
			usage.RecentCalls[i].Count = count
		}
	}

	return usage
}

func generateEmptyDays(days int) []DailyCount {
	result := make([]DailyCount, days)
	for i := 0; i < days; i++ {
		date := time.Now().AddDate(0, 0, -days+i+1)
		result[i] = DailyCount{
			Date:  date.Format("2006-01-02"),
			Count: 0,
		}
	}
	return result
}
