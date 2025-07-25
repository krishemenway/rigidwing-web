import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { Layout } from "Common/Layout";
import { Login } from "Users/Login";
import { ServerService } from "Servers/ServerService";
import { ConnectToServer } from "Servers/ConnectToServer";

export const RequireServerAndUser: React.FC<{ children: React.ReactNode }> = (props) => {
	const servers = useObservable(ServerService.Instance.Servers);

	if (servers.length === 0) {
		return <Layout direction="column" alignItems="center"><ConnectToServer /></Layout>;
	}

	if (!servers[0].UserId) {
		return <Login />;
	}

	return <>{React.Children.map(props.children, (c) => c)}</>;
};
