import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useBackgroundStyles } from "Common/AppStyles";
import { Button } from "Common/Button";
import { EditIcon } from "Common/EditIcon";
import { HyperLink } from "Common/HyperLink";
import { JellyfinIcon } from "Common/JellyfinIcon";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { Loading } from "Common/Loading";
import { AnchoredModal, CenteredModal } from "Common/Modal";
import { TranslatedText } from "Common/TranslatedText";
import { IconForItem } from "Items/IconForItem";
import { MenuIcon } from "NavigationBar/MenuIcon";
import { Search } from "NavigationBar/Search";
import { DashboardIcon } from "ServerAdmin/DashboardIcon";
import { ServerService } from "Servers/ServerService";
import { AuthorizeQuickConnect } from "Users/AuthorizeQuickConnect";
import { LoginService } from "Users/LoginService";
import { SettingsIcon } from "Users/SettingsIcon";
import { SignOutIcon } from "Users/SignOutIcon";
import { UserViewStore } from "Users/UserViewStore";
import { LinkToItem } from "Items/LinkToItem";

const NavigationButton: React.FC<{ onClick?: (element: HTMLButtonElement) => void; }> = (props) => {
	return <Button direction="row" type="button" disabled={props.onClick === undefined} onClick={props.onClick ?? (() => { })} py={4} px={4}><MenuIcon size="22" /></Button>;
}

const NavigationMenuLinkStyles: Partial<StyleLayoutProps> = { width: "100%", px: 16, py: 8, gap: 8 };
const OpenNavigationButton: React.FC<{ libraries: BaseItemDto[] }> = (props) => {
	const background = useBackgroundStyles();
	const [anchor, setOpenAnchor] = React.useState<HTMLElement|null>(null);
	const closeNavigation = () => setOpenAnchor(null);

	return (
		<>
			<NavigationButton onClick={(element) => { setOpenAnchor(element); }} />
			<AnchoredModal alternatePanel open={anchor !== null} onClosed={closeNavigation} opensInDirection="right" anchorElement={anchor}>
				<Layout direction="column" maxWidth={300}>
					<HyperLink direction="row" to="/" gap={16} className={background.transparent} py={16} px={16}>
						<JellyfinIcon size="48" />

						<Layout direction="column" gap={4} justifyContent="center">
							<h6>{ServerService.Instance.CurrentServer.Name}</h6>
							<p>{ServerService.Instance.CurrentServer.Version}</p>
						</Layout>
					</HyperLink>

					<Layout direction="column">
						<NavigationDivider />
						<Layout direction="row" elementType="h3" py={16} px={16}><TranslatedText textKey="HeaderLibraries" /></Layout>
						<ListOf
							direction="row" wrap
							items={props.libraries}
							forEachItem={(library, index) => (
								<LinkToItem
									key={library.Id ?? index.toString()} item={library}
									direction="column" alignItems="center" px={8} py={8} gap={8}
									width={{ itemsPerRow: 3, gap: 0 }}
									className={background.transparent}
								>
									<Layout direction="row" justifyContent="center"><IconForItem item={library} size={24} /></Layout>
									<Layout direction="row" justifyContent="center">{library.Name}</Layout>
								</LinkToItem>
							)}
						/>
					</Layout>

					<Layout direction="column">
						<NavigationDivider />
						<Layout direction="row" elementType="h3" py={16} px={16}><TranslatedText textKey="HeaderAdmin" /></Layout>

						<HyperLink className={background.transparent} {...NavigationMenuLinkStyles} direction="row" to="/Dashboard">
							<Layout direction="row" justifyContent="center"><DashboardIcon size={24} /></Layout>
							<Layout direction="row" justifyContent="center"><TranslatedText textKey="TabDashboard" /></Layout>
						</HyperLink>

						<HyperLink className={background.transparent} {...NavigationMenuLinkStyles} direction="row" to="/Metadata">
							<Layout direction="row" justifyContent="center"><EditIcon size={24} /></Layout>
							<Layout direction="row" justifyContent="center"><TranslatedText textKey="MetadataManager" /></Layout>
						</HyperLink>
					</Layout>

					<Layout direction="column">
						<NavigationDivider />
						<Layout direction="row" elementType="h3" py={16} px={16}><TranslatedText textKey="UserMenu" /></Layout>

						<HyperLink className={background.transparent} {...NavigationMenuLinkStyles} direction="row" to="/Settings">
							<Layout direction="row" justifyContent="center"><SettingsIcon size={24} /></Layout>
							<Layout direction="row" justifyContent="center"><TranslatedText textKey="Settings" /></Layout>
						</HyperLink>

						<AuthorizeQuickConnectButton onOpened={closeNavigation} />

						<Button className={background.transparent} {...NavigationMenuLinkStyles} direction="row" type="button" onClick={() => { closeNavigation(); LoginService.Instance.SignOut(); }}>
							<Layout direction="row" justifyContent="center"><SignOutIcon size={24} /></Layout>
							<Layout direction="row" justifyContent="center"><TranslatedText textKey="ButtonSignOut" /></Layout>
						</Button>
					</Layout>
				</Layout>
			</AnchoredModal>
		</>
	);
};

const AuthorizeQuickConnectButton: React.FC<{ onOpened: () => void }> = (props) => {
	const background = useBackgroundStyles();
	const [authorizeQuickConnectOpen, setAuthorizeQuickConnectOpen] = React.useState(false);

	return (
		<>
			<Button className={background.transparent} {...NavigationMenuLinkStyles} direction="row" type="button" onClick={() => { props.onOpened(); setAuthorizeQuickConnectOpen(true); }}>
				<Layout direction="row" justifyContent="center"><EditIcon size={24} /></Layout>
				<Layout direction="row" justifyContent="center"><TranslatedText textKey="QuickConnect" /></Layout>
			</Button>

			<CenteredModal open={authorizeQuickConnectOpen} onClosed={() => { setAuthorizeQuickConnectOpen(false); }}>
				<AuthorizeQuickConnect />
			</CenteredModal>
		</>
	);
};

const NavigationDivider: React.FC = () => {
	return <hr style={{ width: "100%", margin: "0", borderWidth: "thin" }} />;
}

export const NavigationBar: React.FC<{ icon?: React.ReactElement; }> = (props) => {
	const background = useBackgroundStyles();

	React.useEffect(() => { UserViewStore.Instance.LoadUserViews(); }, []);

	return (
		<Layout className={background.panel} direction="row" gap={16} px={16} py={8} width="calc(100% + 32px)" mx={-16}>
			<Loading
				receivers={[UserViewStore.Instance.UserViews]}
				whenNotStarted={<NavigationButton />}
				whenLoading={<NavigationButton />}
				whenError={() => <NavigationButton />}
				whenReceived={(libraries) => <OpenNavigationButton libraries={libraries} />}
			/>
			{props.icon && (<Layout direction="row" alignItems="center">{props.icon}</Layout>)}
			<Layout direction="row" alignItems="center"><Search /></Layout>
		</Layout>
	);
};
