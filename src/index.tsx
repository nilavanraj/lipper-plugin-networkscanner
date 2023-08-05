import React from "react";
import {
  PluginClient,
  usePlugin,
  createState,
  useValue,
  Layout,
  DetailSidebar,
} from "flipper-plugin";
import { Button, Card, Input } from "antd";
import ApiCards from "./components/ApiCards";
import ApiSiderBar from "./components/ApiSiderBar";
import {
  openDatabase,
  getRequests,
  storeRequest,
  deleteDatabase,
} from "./helper/DBHelper";
import { addOrUpdateResponse } from "./helper/converts";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import UploadFile from "./components/UploadFile";
import { Tabs } from 'antd';
import {GeneralMock} from './GeneralMock'
const { TabPane } = Tabs;

type Data = {
  id: string;
  message?: string;
};

type Events = {
  newData: Data;
  onPingApi: any;
  updateResponse: any;
};
type Method = {
  onPingApi: any;
};
const mockResponses = {
  requests: [],
};
export function plugin(client: PluginClient<Events, Method>) {
  const ApiList = createState(mockResponses.requests);
  const varientDetails = createState({});

  getRequests().then((data) => {
    ApiList.set(data);
    mockResponses.requests = data;
  });
  client.onMessage("updateResponse", (newData) => {
    const apiData = addOrUpdateResponse(mockResponses, newData);
    setApiData();
    if (apiData.method) {
      (async function () {
        await storeRequest(apiData.response, apiData.method);
      })();
    }

  });
  client.onMessage("onPingApi", (newData) => {
    client.send("onPingApi", mockResponses);
  });

  client.addMenuEntry({
    action: "clear",

    handler: async () => {
      deleteDatabase();
      ApiList.set([]);
      mockResponses.requests = []
    },
    accelerator: "ctrl+l",
  });
  async function updateJson(id) {
    const existingRequest = mockResponses.requests.find((request) => {
      return request.url === id?.url && request.method === id?.method;
    });
    let method = "add";
    if (existingRequest){
      method = "put";
      replaceExistingRequest(existingRequest)
    } else
      addExistingRequest(existingRequest)
      setApiData();
      await storeRequest(id, method);
  }

  function setvarientDetails(id) {
    const existingRequest = mockResponses.requests.find((request) => {
      return request.id === id
    });
    varientDetails.set(existingRequest);
  }

  function setApiData() {
    ApiList.set([...mockResponses.requests]);
  }

  function onChangeSearchApi(val) {
    let result = [...mockResponses.requests].filter((item) => {
      return item.url.toLowerCase().includes(val.target.value.toLowerCase());
    });
    if (result.length === 0 && val.length === 0)
      result = mockResponses.requests;
    ApiList.set(result);
  }
  function changeVarients(changeId) {

    const item = varientDetails.get();
    replaceExistingRequest({ ...item, variant: changeId });
    client.send("onPingApi", mockResponses);

    varientDetails.set({ ...item, variant: changeId });
    (async function () {
      await storeRequest(item, 'put');
    })();
  }

  function replaceExistingRequest(data) {
    mockResponses.requests.forEach((request, index) => {
      if (request.id === data.id)
      mockResponses.requests[index] = data;
    });
  }
  function addExistingRequest(data) {
    mockResponses.requests[mockResponses.requests.length] = data;
  }

  return {
    ApiList,
    varientDetails,
    updateJson,
    setvarientDetails,
    changeVarients,
    onChangeSearchApi,
  };
}
const MyTabsComponent = ({plugin}) => {
  const instance = usePlugin(plugin);
  const ApiList = useValue(instance.ApiList);
  const varientDetails = useValue(instance.varientDetails);
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Tab 1" key="1">
  <GeneralMock ApiList={ApiList} instance={instance} varientDetails={varientDetails}/>
      </TabPane>
      <TabPane tab="Tab 2" key="2">
        Content of Tab Pane 2
      </TabPane>
    </Tabs>
  );
};

export default MyTabsComponent;
export function Component() {


  return (
    <Layout.ScrollContainer>
    
      <MyTabsComponent plugin={plugin}/>
      
    </Layout.ScrollContainer>
  );
}
