import axios from "axios";
import { API_PUBLIC_KEY } from "./env";

const baseUrl = axios.create({ baseURL: "https://stationapi.veriff.com/" });
const session = "/v1/sessions";

// Create sessions from data
export const createSession = (data) => {
  return baseUrl.post(session, data, {
    headers: {
      "X-AUTH-CLIENT": API_PUBLIC_KEY,
      "Content-Type": "application/json",
    },
  });
};

export const postMedia = (data) => {
  console.log("this is daata", data);
  return baseUrl.post(session + `/${data.sessionid}/media`, data.payload, {
    headers: {
      "X-AUTH-CLIENT": API_PUBLIC_KEY,
      "Content-Type": "application/json",
      "X-HMAC-SIGNATURE": data.signature,
    },
  });
};

export const getMedia = (data) => {
  return baseUrl.get(`/v1/media/${data.mediaId}`, {
    headers: {
      "X-AUTH-CLIENT": API_PUBLIC_KEY,
      "X-HMAC-SIGNATURE": data.signature,
    },
  });
};

export const verify = (data) => {
  return baseUrl.patch(session + `/${data.sessionId}`, data.payload, {
    headers: {
      "X-AUTH-CLIENT": API_PUBLIC_KEY,
      "Content-Type": "application/json",
      "X-HMAC-SIGNATURE": data.signature,
    },
  });
};
