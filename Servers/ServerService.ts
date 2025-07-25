import { Api, Jellyfin } from "@jellyfin/sdk";
import { ObservableArray } from "@residualeffect/reactor";
import { EditableField } from "Common/EditableField";
import { Receiver } from "Common/Receiver";
import { getSystemApi } from "@jellyfin/sdk/lib/utils/api/system-api";
import { Nullable } from "Common/MissingJavascriptFunctions";

interface JellyfinCredentials {
	Servers: ServerConnection[]
}

export interface ServerConnection {
	Id: string;
	Name: string;

	ManualAddress: string;
	LocalAddress: string;
	LastConnectionMode: ConnectionMode;
	DateLastAccessed: number;
	Version: string;

	AccessToken: string|null;
	UserId: string|null;
	ExchangeToken: string|null;
}

enum ConnectionMode {
	Local = 0,
	Remote = 1,
	Manual = 2,
}

export class ServerService {
	constructor() {
		this.Servers = new ObservableArray(this.LoadServersFromLocalStorage());
		this.ServerHost = new EditableField("LabelServerHost", "");
		this.AddServerResult = new Receiver("UnknownError");
		this._apis = {};
	}

	public get DeviceId() {
		return this._deviceId ?? (this._deviceId = this.FindOrGenerateDeviceId());
	}

	public get DeviceName() {
		return "Web Browser"; // TODO check out the browser.js file and cry
	}

	public get CurrentApi() {
		const currentServer = this.CurrentServer;
		const existingApiOrUndefined = this._apis[currentServer.Id];

		if (existingApiOrUndefined !== undefined) {
			return existingApiOrUndefined;
		}

		return this.ResetApiForCurrentServer();
	}

	public get CurrentServer(): ServerConnection {
		return this.Servers.Value[0];
	}

	public get CurrentUserId(): string {
		return this.CurrentServer.UserId ?? "";
	}

	public TryAddServer(): void {
		this.AddServerResult.Start(async (abort) => this.CheckSystemInfoForHost(this.ServerHost.Current.Value, abort));
	}

	public SelectServerConnection(connection: ServerConnection): void {
		this.Servers.remove(connection);
		this.Servers.unshift(connection);
		this.SetServersToLocalStorage();
		this.ResetApiForCurrentServer();
	}

	public SetAccessTokenForServer(accessToken: string|null, userId: string|null): void {
		const connection = this.CurrentServer;
		connection.AccessToken = accessToken;
		connection.UserId = userId;
		connection.DateLastAccessed = new Date().getTime();

		this.SelectServerConnection(connection);
	}

	public AttemptSetupOfCurrentDomainAsServer(): void {
		if (this.Servers.length === 0) {
			this.CheckSystemInfoForHost(window.location.origin);
		}
	}

	private CheckSystemInfoForHost(host: string, abort?: AbortController): Promise<boolean> {
		return getSystemApi(this.CreateJellyfin().createApi(host)).getPublicSystemInfo({ signal: abort?.signal })
			.then((response) => {
				if (Nullable.HasValue(response.data.Id)) {
					this.Servers.unshift({
						Id: response.data.Id,
						Name: response.data.ServerName!,
						DateLastAccessed: new Date().getTime(),
						ManualAddress: host,
						LastConnectionMode: ConnectionMode.Manual,
						LocalAddress: response.data.LocalAddress!,
						Version: response.data.Version!,
						AccessToken: null,
						ExchangeToken: null,
						UserId: null,
					});
					this.SetServersToLocalStorage();
					this.ResetApiForCurrentServer();
					return true;
				} else {
					throw new Error("UnknownError");
				}
			});
	}

	private ResetApiForCurrentServer(): Api {
		return this._apis[this.CurrentServer.Id] = this.CreateJellyfin().createApi(this.CurrentServer.ManualAddress, this.CurrentServer.AccessToken ?? undefined);
	}

	private SetServersToLocalStorage(): void {
		window.localStorage.setItem("jellyfin_credentials", JSON.stringify({ Servers: this.Servers.Value }));
	}

	private CreateJellyfin(): Jellyfin {
		return new Jellyfin({
			clientInfo: { name: 'Jellyfin Web Upgrayed', version: '0.0.1', },
			deviceInfo: { name: this.DeviceName, id: this.DeviceId },
		});
	}

	private LoadServersFromLocalStorage(): ServerConnection[] {
		const credentials = window.localStorage.getItem("jellyfin_credentials");

		if (credentials === null || credentials.length < 3) {
			return [];
		}

		return (JSON.parse(credentials) as JellyfinCredentials).Servers ?? [];
	}

	private FindOrGenerateDeviceId(): string {
		const localStorageDeviceId = window.localStorage.getItem(this._deviceKey);

		if (localStorageDeviceId !== null) {
			return localStorageDeviceId;
		}

		const keys = [];

		keys.push(navigator.userAgent);
		keys.push(new Date().getTime());

		const deviceId = btoa(keys.join('|')).replaceAll('=', '1');
		window.localStorage.setItem(this._deviceKey, deviceId);
		return deviceId;
	}

	public ServerHost: EditableField;
	public Servers: ObservableArray<ServerConnection>;

	public AddServerResult: Receiver<boolean>;

	private _apis: Record<string, Api>;
	private _deviceId: string|undefined;
	private _deviceKey = "_deviceId2";

	static get Instance(): ServerService {
		return this._instance ?? (this._instance = new ServerService());
	}

	private static _instance: ServerService;
}
