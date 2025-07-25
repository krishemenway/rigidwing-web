import * as React from "react";
import { BaseItemKind, CollectionType } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf } from "Common/ListOf";
import { IconForItemKind } from "Items/IconForItemKind";
import { Layout } from "Common/Layout";

export const Icons: React.FC = () => {
	return (
		<Layout direction="column" alignItems="center" py={32} gap={32}>
			<Layout direction="row">Item Types</Layout>
			<ListOf
				direction="row" wrap gap={32} maxWidth={800}
				items={Object.keys(BaseItemKind).map((t) => t as BaseItemKind).filter((i) => i !== "CollectionFolder")}
				forEachItem={(kind) => (
					<Layout key={kind} direction="column" alignItems="center" grow basis={0}>
						<IconForItemKind itemKind={kind} size={32} />
						<Layout direction="row">{kind}</Layout>
					</Layout>
				)}
			/>

			<Layout direction="row">Collection Types</Layout>
			<ListOf
				items={Object.keys(CollectionType).map((c) => c as CollectionType)}
				direction="row" wrap gap={32} maxWidth={800}
				forEachItem={(collectionType) => (
					<Layout key={collectionType} direction="column" alignItems="center" grow basis={0}>
						<IconForItemKind itemKind="CollectionFolder" collectionType={collectionType} size={32} />
						<Layout direction="row">{collectionType}</Layout>
					</Layout>
				)}
			/>
		</Layout>
	);
};
