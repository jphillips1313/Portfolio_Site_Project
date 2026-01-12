package middleware

import (
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
)

type visitor struct {
	lastSeen time.Time
	count    int
}

var (
	visitors = make(map[string]*visitor)
	mu       sync.RWMutex
)

// RateLimitConfig holds rate limiting configuration
type RateLimitConfig struct {
	MaxRequests int           // Max requests allowed
	Window      time.Duration // Time window for max requests
	BlockTime   time.Duration // How long to block after exceeding limit
}

// RateLimit middleware limits login attempts
func RateLimit(config RateLimitConfig) fiber.Handler {
	// Clean up old visitors periodically
	go func() {
		for {
			time.Sleep(time.Minute)
			mu.Lock()
			for ip, v := range visitors {
				if time.Since(v.lastSeen) > config.Window {
					delete(visitors, ip)
				}
			}
			mu.Unlock()
		}
	}()

	return func(c *fiber.Ctx) error {
		ip := c.IP()

		mu.Lock()
		v, exists := visitors[ip]

		if !exists {
			visitors[ip] = &visitor{
				lastSeen: time.Now(),
				count:    1,
			}
			mu.Unlock()
			return c.Next()
		}

		// Check if visitor is within time window
		if time.Since(v.lastSeen) > config.Window {
			// Reset count for new window
			v.count = 1
			v.lastSeen = time.Now()
			mu.Unlock()
			return c.Next()
		}

		// Check if visitor exceeded limit
		if v.count >= config.MaxRequests {
			mu.Unlock()
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Too many login attempts. Please try again later.",
			})
		}

		// Increment count
		v.count++
		v.lastSeen = time.Now()
		mu.Unlock()

		return c.Next()
	}
}
