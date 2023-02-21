import { Tabs } from '@mantine/core';
import { TableComponent } from "./TableComponent"
import { ProcessedData } from "../App"
import { ReactElement } from 'react';

export interface NavProps { table: ProcessedData[] }

export function HeaderTabs (props: NavProps): ReactElement {

	const expData = props.table

	return (
		<Tabs defaultValue="gallery">
		<Tabs.List>
			<Tabs.Tab value="gallery">Gallery</Tabs.Tab>
			<Tabs.Tab value="messages">Messages</Tabs.Tab>
			<Tabs.Tab value="settings">Settings</Tabs.Tab>
		</Tabs.List>

		<Tabs.Panel value="gallery" pt="xs">
			<TableComponent table={expData}/>
		</Tabs.Panel>

		<Tabs.Panel value="messages" pt="xs">
			Messages tab content
		</Tabs.Panel>

		<Tabs.Panel value="settings" pt="xs">
			Settings tab content
		</Tabs.Panel>
		</Tabs>
	);
}