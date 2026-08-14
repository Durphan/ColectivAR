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
	private _timeoutId: NodeJS.Timeout | null = null;

	constructor(config: CircuitBreakerConfig) {
		this._config = config;
		this._failureCount = 0;
		this._state = "CLOSED";
	}

	private _resetFailureCount(): void {
		this._failureCount = 0;
	}

	private _resetTimeout(): void {
		if (this._timeoutId) {
			clearTimeout(this._timeoutId);
			this._timeoutId = null;
		}
	}

	private _closeCircuit(): void {
		this._state = "CLOSED";
		this._resetFailureCount();
		this._resetTimeout();
	}

	private _openCircuit(): void {
		this._state = "OPEN";
	}

	private _halfOpenCircuit(): void {
		this._state = "HALF_OPEN";
	}

	private _checkFailureThreshold(): void {
		if (this._state !== "CLOSED") {
			return;
		}
		if (this._failureCount >= this._config.failureThreshold) {
			this._openCircuit();
			if (this._timeoutId === null) {
				this._timeoutId = setTimeout(() => {
					this._halfOpenCircuit();
					this._timeoutId = null;
				}, this._config.timeout);
			}
		}
	}

	private _incrementFailureCount(): void {
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
			if (this._state === "CLOSED") {
				this._resetFailureCount();
			}
			if (this._state === "HALF_OPEN") {
				this._closeCircuit();
			}
			return result;
		} catch (error) {
			this._incrementFailureCount();
			return Promise.reject<T>(error);
		}
	}
}
