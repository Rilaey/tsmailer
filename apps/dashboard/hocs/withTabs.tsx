import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { Tabs } from '@mantine/core';
import { UserContext } from 'context/userContext';

/**
 * Props for the TabsComponent.
 * @interface
 */
interface TabsComponentProps {
  /** Array of tab objects, each containing a label for the tab. */
  tabs: { label: string }[];
  /** Callback function to handle tab changes. */
  onChange: (tab: string) => void;
  /** The label of the currently active tab. */
  activeTab: string;
}

/**
 * Component that renders tabs.
 * @param {TabsComponentProps} props - The component props.
 * @returns {React.ReactElement} - The rendered component.
 */
const TabsComponent: React.FC<TabsComponentProps> = ({
  tabs,
  activeTab = 'dashboard',
  onChange,
}) => {
  return (
    <Tabs defaultValue={activeTab} onChange={(tab) => onChange(tab as string)}>
      <Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.label} value={tab.label}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
};

/**
 * Higher-order component that adds tabs to a component.
 * @function
 * @param {React.FC} WrappedComponent - The component to be wrapped with tabs.
 * @returns {React.FC} - The component with added tabs.
 */
export const withTabs = (WrappedComponent: React.FC): React.FC => {
  /**
   * Component that renders tabs and wraps the provided component.
   * @function
   * @returns {React.ReactElement} - The rendered component.
   */
  const TabsWithRouter: React.FC = () => {
    const router = useRouter();
    const tabs = ['Dashboard', 'Account'];
    // TODO: Create constant file for routes
    const currentTab = router.asPath.split('/')[1] || 'dashboard';

    /**
     * Handles the click event of a tab.
     * @param {string} tab - The clicked tab.
     */
    const handleTabClick = (tab: string) => {
      router.push(
        tab.toLowerCase() === 'dashboard' ? '/' : `/${tab.toLowerCase()}`,
      );
    };

    return (
      <TabsComponent
        activeTab={currentTab}
        onChange={(tab) => handleTabClick(tab)}
        tabs={tabs.map((tab) => ({
          label: tab,
        }))}
      />
    );
  };

  return (props) => {
    const { user } = useContext(UserContext);

    return (
      <>
        {user?.status === 'authenticated' && <TabsWithRouter />}
        <WrappedComponent {...props} />
      </>
    );
  };
};
