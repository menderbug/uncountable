import { useState } from 'react';
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  Settings,
} from 'tabler-icons-react';
import { MantineLogo } from '@mantine/ds';

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]
    }`,
    marginBottom: 120,
  },

  tabs: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  tabsList: {
    borderBottom: '0 !important',
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    },

    '&[data-active]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
    },
  },
}));

interface HeaderTabsProps {
  user: { name: string; image: string };
  tabs: string[];
}

export function HeaderTabs({ user, tabs }: HeaderTabsProps) {
  const { classes, theme, cx } = useStyles();
  const [activeTab, setActiveTab] = useState<string | null>('first');

  return (
    <div className={classes.header}>
      <Container>
	  	<Tabs 
		  value={activeTab} 
		  onTabChange={setActiveTab}
          defaultValue="table"
          variant="outline"
          classNames={{
            root: classes.tabs,
            tabsList: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>
		    <Tabs.Tab value='table'>Raw Table</Tabs.Tab>
			<Tabs.Tab value='scatter'>Scatter Plots</Tabs.Tab>
			<Tabs.Tab value='histogram'>Histograms</Tabs.Tab>
		  </Tabs.List>
		  <Tabs.Tab value='table'>aaaaaaaaaaaaaaa</Tabs.Tab>
		  <Tabs.Tab value='scatter'>bbbbbbbbbb</Tabs.Tab>
		  <Tabs.Tab value='histogram'>ccccccccccccc</Tabs.Tab>
        </Tabs>
      </Container>
    </div>
  );
}