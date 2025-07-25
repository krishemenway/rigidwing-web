import * as React from "react";
import { BaseItemDto, BaseItemKind, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { useComputed } from "@residualeffect/rereactor";
import { createStyles, useBackgroundStyles } from "Common/AppStyles";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { ItemListFilters } from "ItemList/ItemListFilters";
import { ImageShape, ItemImage } from "Items/ItemImage";
import { ItemService } from "Items/ItemsService";
import { LinkToItem } from "Items/LinkToItem";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { ItemListViewOptionsService } from "ItemList/ItemListViewOptionsService";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { ResponsiveBreakpoint, useBreakpoint } from "Common/ResponsiveBreakpointContext";

export const ItemListView: React.FC<{ paramName: string; itemKind: BaseItemKind }> = (props) => {
	const routeParams = useParams();
	const libraryId = routeParams[props.paramName];
	const itemList = React.useMemo(() => ItemService.Instance.FindOrCreateItemList(libraryId), [libraryId]);

	React.useEffect(() => itemList.LoadWithAbort(), [libraryId]);
	React.useEffect(() => SettingsStore.Instance.LoadSettings(libraryId), [libraryId]);

	if (!Nullable.HasValue(libraryId)) {
		return <PageWithNavigation itemKind={props.itemKind}><NotFound /></PageWithNavigation>;
	}

	return (
		<PageWithNavigation itemKind={props.itemKind}>
			<Loading
				receivers={[itemList.List, SettingsStore.Instance.Settings]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenReceived={(items, settings) => <ItemsGrid id={libraryId} items={items} settings={settings} itemKind={props.itemKind} />}
			/>
		</PageWithNavigation>
	);
};

const ItemsGrid: React.FC<{ id: string, items: BaseItemDto[]; itemKind: BaseItemKind; settings: Settings }> = (props) => {
	const breakpoint = useBreakpoint();
	const itemKindService = BaseItemKindServiceFactory.FindOrNull(props.itemKind);
	const viewOptions = React.useMemo(() => new ItemListViewOptionsService(props.id, props.settings, itemKindService), [props.id, props.settings, itemKindService])

	const filteredAndSortedItems = useComputed(() => {
		const filterFunc = viewOptions.ViewOptions.Value.FilterFunc.Value;
		const sortFunc = viewOptions.ViewOptions.Value.SortByFunc.Value;

		return props.items.filter(filterFunc).sort(sortFunc);
	});

	return (
		<Layout direction="column" gap={16} py={16}>
			<ItemListFilters service={viewOptions} />

			<ListOf
				items={filteredAndSortedItems}
				direction="row" wrap gap={10}
				forEachItem={(item, index) => (
					<ItemsGridItem
						item={item}
						shape={itemKindService?.primaryShape ?? ImageShape.Portrait}
						itemsPerRow={breakpoint === ResponsiveBreakpoint.Desktop ? 9 : breakpoint === ResponsiveBreakpoint.Tablet ? 6 : 2}
						key={item.Id ?? index.toString()}
					/>
				)}
			/>
		</Layout>
	);
};

const ItemsGridItem: React.FC<{ item: BaseItemDto; imageType?: ImageType; shape: ImageShape; itemsPerRow: number }> = (props) => {
	const background = useBackgroundStyles();
	const classes = useItemGridClasses();
	const width = props.shape !== ImageShape.Landscape ? 220 : 330;
	const height = props.shape !== ImageShape.Portrait ? 220 : 330;
	const shapeClass = props.shape === ImageShape.Landscape ? classes.landscape : props.shape == ImageShape.Portrait ? classes.portrait : classes.square;

	return (
		<LinkToItem item={props.item} className={`${background.transparent} ${shapeClass}`} direction="column" justifyContent="center" alignItems="center" py={8} px={8} gap={16} width={{ itemsPerRow: props.itemsPerRow, gap: 10 }}>
			<ItemImage item={props.item} className={classes.itemImage} type={props.imageType ?? ImageType.Primary} fillWidth={width} fillHeight={height} />
			<Layout direction="column" py={4} textAlign="center">{props.item.Name}</Layout>
		</LinkToItem>
	);
}

const useItemGridClasses = createStyles({
	landscape: { },
	portrait: {	},
	square: { },

	itemImage: {
		maxWidth: "100%",
		objectFit: "contain",
	},
});
