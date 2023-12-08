export interface IWSstate {
	msg: any;
	guid: string;
	socketIOAddress: string;
	socketIOPath: string;
	state: {
		connected: boolean;
		connecting: boolean;
		connectError: boolean;
		connectionError: boolean;
		lastConnectionError: null | string | Error;
		subscribed: boolean;
		connectCount: number;
		secondsToNextAttempt: number;
		lastPing?: Date;
		lastPong?: Date;
		zoneId?: number;
	};
}
