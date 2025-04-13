import { getUserData } from "@/utils/cookies";
import Cookies from "react-cookies";
const BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL;

// common api method
export const callAPI = async (url, request_body = {}) => {
    try {
        // const authToken = Cookies.load("data");

        const HEADERS = {
            "Content-Type": "application/json",
        };

        const requestOptions = {
            method: "POST",
            headers: new Headers(HEADERS),
            body: JSON.stringify(request_body),
            redirect: "follow",
        };

        const response = await fetch(`${BASE_URL}${url}`, requestOptions);

        const user_data = Cookies.load("userData");
        console.log("User Data:", user_data); // Debugging

        if (!user_data) {
            Cookies.remove("userData");
            location.href = "/session-expired";
        } else {
            const result = await response.json(); // Assuming the API returns JSON
            return result;
        }
    } catch (error) {
        throw error; // Propagate error to the caller
    }
};