import {Tabs, TabsRef} from "flowbite-react";
import Videos from "./Videos";
import {Search} from "./Search";
import {Downloads} from "./Downloads";
import {HostConfig} from "../domain/Messages";
import {useRef, useState} from "react";

export const MainTab = (props: HostConfig) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabsRef = useRef<TabsRef>(null);

  return (
    <Tabs.Group
      aria-label="Default tabs"
      style="pills"
      ref={tabsRef}
      onActiveTabChange={tab => setActiveTab(tab)}
    >
      <Tabs.Item active={true} title="Video">
        <Videos host={props.host} />
      </Tabs.Item>
      <Tabs.Item title="Search">
        <Search host={props.host} />
      </Tabs.Item>
      <Tabs.Item title="Download">
        <Downloads host={props.host} isActive={activeTab == 2} />
      </Tabs.Item>
    </Tabs.Group>
  )
}