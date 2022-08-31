import axios from "axios";

const baseUrl = axios.create({ baseURL: "https://stationapi.veriff.com/" });
const session = "/v1/sessions";

// Create sessions from data
export const createSession = (data) => {
  return baseUrl.post(session, data, {
    headers: {
      "X-AUTH-CLIENT": "4395d9dc-a8ac-476d-a003-e728886b84cb",
      "Content-Type": "application/json",
    },
  });
};
