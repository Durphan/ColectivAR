export type AppConfig = {
	readonly baseUrl: string;
	readonly clientId: string | undefined;
	readonly clientSecret: string | undefined;
	readonly fullUrl: string;
	readonly log_level: string;
	readonly port: number;
	readonly failureThreshold: number;
	readonly timeout: number;
};
