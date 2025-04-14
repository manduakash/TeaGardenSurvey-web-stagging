import Cookies from "react-cookies";

export const getUserData = () => {
    try {

        const encryptedData = Cookies.load("userData");
        if (!encryptedData) return null; // Prevent decoding undefined

        const decodedData = decodeURIComponent(atob(encryptedData));

        return JSON.parse(decodedData) ?? null;
    } catch (error) {
        console.error("Error retrieving user data:", error);
        return null;
    }
};


export const removeUserData = () => {
    Cookies.remove("userData", { path: "/" });
};
