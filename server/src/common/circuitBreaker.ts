export type CircuitBreakerConfig = {
	readonly failureThreshold: number;
	readonly timeout: number;
};

type circuitBreakerWrapper<T> = () => Promise<T>;

type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
	private _config: CircuitBreakerConfig;
	private _failureCount: number;
	private _state: CircuitBreakerState;

	constructor(config: CircuitBreakerConfig) {
		this._config = config;
		this._failureCount = 0;
		this._state = "CLOSED";
	}

	public getState(): CircuitBreakerState {
		return this._state;
	}

	private closeCircuit(): void {
		this._state = "CLOSED";
		this._failureCount = 0;
	}

	private _openCircuit(): void {
		this._state = "OPEN";
	}

	private _halfOpenCircuit(): void {
		this._state = "HALF_OPEN";
	}

	private _checkFailureThreshold(): void {
		if (this._failureCount >= this._config.failureThreshold) {
			this._openCircuit();
			setTimeout(() => {
				this._halfOpenCircuit();
			}, this._config.timeout);
		}
	}

	private incrementFailureCount(): void {
		this._failureCount++;
		this._checkFailureThreshold();
	}

	public async execute<T>(fn: circuitBreakerWrapper<T>): Promise<T> {
		if (this._state === "OPEN") {
			return Promise.reject<T>(
				new Error("Circuit breaker is open. Cannot execute function."),
			);
		}
		try {
			const result = await fn();
			if (this._state === "HALF_OPEN") {
				this.closeCircuit();
			}
			return result;
		} catch (error) {
			this.incrementFailureCount();
			return Promise.reject<T>(error);
		}
	}
}
