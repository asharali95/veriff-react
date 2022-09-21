import axios from "axios";
import { sha256 } from "js-sha256";
import { API_PRIVATE_KEY, API_PUBLIC_KEY } from "./env";

const baseUrl = axios.create({ baseURL: "https://stationapi.veriff.com/" });
const auth = axios.create({ baseURL: "http://localhost:8001/api/v1/auth" });
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

export const getAllMediaFromSession = (data) => {
  var hash = sha256.hmac.create(API_PRIVATE_KEY);
  hash.update(data.sessionId);
  return baseUrl.get(`/v1/sessions/${data.sessionId}/media`, {
    headers: {
      "X-AUTH-CLIENT": API_PUBLIC_KEY,
      "X-HMAC-SIGNATURE": hash,
    },
  });
};

export const getDecision = (data) => {
  return baseUrl.get(session + `/${data.sessionId}/decision`, {
    headers: {
      "X-AUTH-CLIENT": API_PUBLIC_KEY,
      "Content-Type": "application/json",
      "X-HMAC-SIGNATURE": data.signature,
    },
  });
};

//auth apis
export const login = (data) => {
  return auth.post("/login", data);
};
export const signup = (data) => {
  return auth.post("/signup", data);
};
