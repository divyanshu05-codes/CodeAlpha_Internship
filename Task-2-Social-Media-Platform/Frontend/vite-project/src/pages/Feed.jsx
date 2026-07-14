import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
    getPosts,
    createPost,
    toggleLike,
    addComment,
    deletePost,
} from "../api/post.api";


function Feed() {
    const { user } = useAuth();

    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");

    const [commentTexts, setCommentTexts] =
        useState({});

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] = useState("");


    // ========================================
    // LOAD POSTS
    // ========================================

    const loadPosts = async () => {
        try {
            setError("");

            const data = await getPosts();

            setPosts(data.posts || []);
        } catch (error) {
            console.error(error);

            setError("Unable to load posts");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadPosts();
    }, []);


    // ========================================
    // CREATE POST
    // ========================================

    const handleCreatePost = async (event) => {
        event.preventDefault();

        if (!content.trim()) {
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const data = await createPost(content);

            setPosts((previousPosts) => [
                data.post,
                ...previousPosts,
            ]);

            setContent("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to create post"
            );
        } finally {
            setSubmitting(false);
        }
    };


    // ========================================
    // LIKE / UNLIKE
    // ========================================

    const handleLike = async (postId) => {
        try {
            const data = await toggleLike(postId);

            setPosts((previousPosts) =>
                previousPosts.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            likes: data.likes,
                        }
                        : post
                )
            );
        } catch (error) {
            console.error(error);
        }
    };


    // ========================================
    // ADD COMMENT
    // ========================================

    const handleComment = async (
        event,
        postId
    ) => {
        event.preventDefault();

        const text = commentTexts[postId];

        if (!text?.trim()) {
            return;
        }

        try {
            const data = await addComment(
                postId,
                text
            );

            setPosts((previousPosts) =>
                previousPosts.map((post) =>
                    post._id === postId
                        ? {
                            ...post,

                            comments: [
                                ...post.comments,
                                data.comment,
                            ],
                        }
                        : post
                )
            );

            setCommentTexts((previous) => ({
                ...previous,
                [postId]: "",
            }));
        } catch (error) {
            console.error(error);
        }
    };


    // ========================================
    // DELETE POST
    // ========================================

    const handleDelete = async (postId) => {
        const confirmed = window.confirm(
            "Delete this post?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deletePost(postId);

            setPosts((previousPosts) =>
                previousPosts.filter(
                    (post) => post._id !== postId
                )
            );
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to delete post"
            );
        }
    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {
        return (
            <main className="feed-page">
                <p>Loading posts...</p>
            </main>
        );
    }


    return (
        <main className="feed-page">

            <section className="feed-header">

                <h1>ConnectHub Feed</h1>

                <p>
                    Welcome back,{" "}
                    <strong>{user?.name}</strong>
                </p>

            </section>


            {/* CREATE POST */}

            <form
                className="create-post-card"
                onSubmit={handleCreatePost}
            >

                <textarea
                    placeholder="What's happening?"
                    value={content}
                    maxLength={1000}

                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                />

                <div className="create-post-footer">

                    <span>
                        {content.length}/1000
                    </span>

                    <button
                        type="submit"
                        disabled={
                            submitting ||
                            !content.trim()
                        }
                    >
                        {submitting
                            ? "Posting..."
                            : "Post"}
                    </button>

                </div>

            </form>


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {/* POSTS */}

            <section className="posts-list">

                {posts.length === 0 ? (

                    <div className="empty-feed">
                        <h2>No posts yet</h2>

                        <p>
                            Create the first post on
                            ConnectHub.
                        </p>
                    </div>

                ) : (

                    posts.map((post) => {

                        const likedByCurrentUser =
                            post.likes?.some(
                                (likeId) =>
                                    likeId.toString() ===
                                    user?._id?.toString()
                            );


                        const isOwner =
                            post.author?._id ===
                            user?._id;


                        return (

                            <article
                                className="post-card"
                                key={post._id}
                            >

                                <header className="post-header">

                                    <div>

                                        <strong>
                                            {post.author?.name}
                                        </strong>

                                        <p>
                                            @{post.author?.username}
                                        </p>

                                    </div>


                                    {isOwner && (

                                        <button
                                            className="delete-button"

                                            onClick={() =>
                                                handleDelete(
                                                    post._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    )}

                                </header>


                                <p className="post-content">
                                    {post.content}
                                </p>


                                <div className="post-actions">

                                    <button
                                        className={
                                            likedByCurrentUser
                                                ? "liked-button"
                                                : ""
                                        }

                                        onClick={() =>
                                            handleLike(
                                                post._id
                                            )
                                        }
                                    >

                                        {likedByCurrentUser
                                            ? "Unlike"
                                            : "Like"}

                                        {" "}

                                        ({post.likes?.length || 0})

                                    </button>


                                    <span>
                                        Comments (
                                        {post.comments?.length || 0}
                                        )
                                    </span>

                                </div>


                                {/* COMMENTS */}

                                <section className="comments-section">

                                    {post.comments?.map(
                                        (comment) => (

                                            <div
                                                className="comment"
                                                key={
                                                    comment._id
                                                }
                                            >

                                                <strong>
                                                    {
                                                        comment
                                                            .user
                                                            ?.name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        comment.text
                                                    }
                                                </span>

                                            </div>

                                        )
                                    )}


                                    <form
                                        className="comment-form"

                                        onSubmit={(event) =>
                                            handleComment(
                                                event,
                                                post._id
                                            )
                                        }
                                    >

                                        <input
                                            type="text"

                                            placeholder="Write a comment..."

                                            maxLength={500}

                                            value={
                                                commentTexts[
                                                    post._id
                                                ] || ""
                                            }

                                            onChange={(event) =>
                                                setCommentTexts(
                                                    (
                                                        previous
                                                    ) => ({
                                                        ...previous,

                                                        [post._id]:
                                                            event
                                                                .target
                                                                .value,
                                                    })
                                                )
                                            }
                                        />


                                        <button type="submit">
                                            Comment
                                        </button>

                                    </form>

                                </section>

                            </article>

                        );

                    })

                )}

            </section>

        </main>
    );
}


export default Feed;