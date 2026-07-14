import api from "./axios";

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const getUserProfile = async (username) => {
    const response = await api.get(
        `/users/profile/${username}`
    );

    return response.data;
};

export const toggleFollow = async (userId) => {
    const response = await api.put(`/users/${userId}/follow`);
    return response.data;
};