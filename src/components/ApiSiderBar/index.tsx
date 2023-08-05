import {
  Layout,
  PluginClient,
  usePlugin,
  createState,
  useValue,
  theme,
  styled,
  DataInspector,
  DetailSidebar,
} from "flipper-plugin";
import { Typography, Card } from "antd";
import React from "react";
import { Button } from "antd";
import JsonToFile from "../../helper/JsonToFile";

function ApiSiderBar(row, onClick) {
  console.log(row);
  return (
    <Layout.Container gap pad>
      <Typography.Title level={4}>Api Details</Typography.Title>
      <Button
              type="primary"
              onClick={() => {
                JsonToFile(row);
              }}
            >
              Download
            </Button>
      {row?.responseVariations?.map?.((val, index) => (
        <div>
          <div>
            <Button
              onClick={() => {
                onClick(index);
              }}
              style={{
                backgroundColor: row.variant == index ? "red" : "transparent",
                color: row.variant == index ? "white" : "black",
              }}
            >
              {row.variant == index ? `Active Now` : `Active`}
            </Button>
           
            <Typography.Text>{`Varition ${index}`}</Typography.Text>
          </div>

          <DataInspector data={val} expandRoot />
        </div>
      ))}
    </Layout.Container>
  );
}

export default ApiSiderBar;
