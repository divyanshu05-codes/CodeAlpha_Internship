import api from "./axios";

export const getPosts = async () => {
    const response = await api.get("/posts");
    return response.data;
};

export const createPost = async (content) => {
    const response = await api.post("/posts", {
        content,
    });

    return response.data;
};

export const toggleLike = async (postId) => {
    const response = await api.put(
        `/posts/${postId}/like`
    );

    return response.data;
};

export const addComment = async (postId, text) => {
    const response = await api.post(
        `/posts/${postId}/comments`,
        { text }
    );

    return response.data;
};

export const deletePost = async (postId) => {
    const response = await api.delete(
        `/posts/${postId}`
    );

    return response.data;
};