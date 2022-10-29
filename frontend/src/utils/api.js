import axios from "axios";
export const getBestRoutes = async (params) => {
  console.log("SENDING REQUEST", params, JSON.stringify(params));
  const ret = (
    await axios.post(
      "https://2eppuvw3j5.execute-api.ca-central-1.amazonaws.com/getBestRoutes",
      params
    )
  ).data;
  console.log("GOT RESPONSE", ret);
  return ret;
};
export const getAcurateBestRoutes = async (params) => {
  console.log("SENDING REQUEST", params, JSON.stringify(params));
  const ret = (
    await axios.post(
      "https://2eppuvw3j5.execute-api.ca-central-1.amazonaws.com/",
      params
    )
  ).data;
  console.log("GOT RESPONSE", ret);
  return ret;
};
