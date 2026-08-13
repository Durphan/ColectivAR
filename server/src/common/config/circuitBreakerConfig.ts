import type { CircuitBreakerConfig } from "../circuitBreaker";
import { config } from "./env";

export const circuitBreakerConfig: CircuitBreakerConfig = {
	failureThreshold: config.failureThreshold,
	timeout: config.timeout,
};
