import { openDatabase } from "./DBHelper";
import { isEqual } from "lodash";

const RequestTypes = ["post", "put", "patch"];

export function addOrUpdateResponse(mockResponses, unstructuredData) {
  const url = unstructuredData.config.url;
  const method = unstructuredData.config.method;
  const status = unstructuredData.status;
  const body = unstructuredData.data;

  let existingRequest = null;

  if (RequestTypes.includes(method))
    existingRequest = mockResponses.requests.find((request) => {
      return (
        request.url === url &&
        request.method === method &&
        isEqual(request.request, unstructuredData.config.request)
      );
    });

  existingRequest = mockResponses.requests.find((request) => {
    return request.url === url && request.method === method;
  });

  if (existingRequest) {
    // Check if the response variation already exists for the existing request
    const existingResponse = existingRequest.responseVariations.find(
      (variation) => {
        return variation.status === status && isEqual(variation.body, body);
      }
    );
    if (existingResponse) {
      console.log(
        "Response variation already exists for the given URL and method"
      );
      return {};
    } else {
      const newResponse = {
        id: existingRequest.responseVariations.length + 1,
        status: status,
        body,
      };
      existingRequest.responseVariations.unshift(newResponse);
      console.log("New response variation added to the existing request");
      return { response: existingRequest, method: "put" };
    }
  } else {
    // Create a new request with a response variation
    const newRequest = {
      id: mockResponses.requests.length + 1,
      url: url,
      method: method,
      urlMethod: url + method,
      variant: 0,
      responseVariations: [
        {
          id: 1,
          status: status,
          body,
        },
      ],
    };
    if (RequestTypes.includes(method))
      newRequest.request = unstructuredData.config.request;

    mockResponses.requests.unshift(newRequest);
    console.log("New request with response variation added");
    return { response: newRequest, method: "add" };
  }
}
