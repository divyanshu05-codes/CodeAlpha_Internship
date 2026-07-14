import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
    getUserProfile,
    toggleFollow,
} from "../api/user.api";

function Profile() {
    const { user: loggedInUser } = useAuth();
    const { username } = useParams();

    const profileUsername =
        username || loggedInUser?.username;

    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProfile = useCallback(async () => {
        if (!profileUsername) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await getUserProfile(profileUsername);

            setProfileUser(data.user);
            setPosts(data.posts || []);
        } catch (error) {
            console.error(
                "Load Profile Error:",
                error
            );

            setProfileUser(null);
            setPosts([]);

            setError(
                error.response?.data?.message ||
                    "Unable to load profile"
            );
        } finally {
            setLoading(false);
        }
    }, [profileUsername]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const isOwnProfile =
        profileUser?._id?.toString() ===
        loggedInUser?._id?.toString();

    const isFollowing =
        profileUser?.followers?.some(
            (follower) => {
                const followerId =
                    typeof follower === "object"
                        ? follower._id
                        : follower;

                return (
                    followerId?.toString() ===
                    loggedInUser?._id?.toString()
                );
            }
        ) || false;

    const handleFollow = async () => {
        if (!profileUser?._id) {
            return;
        }

        try {
            const data = await toggleFollow(
                profileUser._id
            );

            setProfileUser((previousUser) => {
                if (!previousUser) {
                    return previousUser;
                }

                const currentFollowers =
                    previousUser.followers || [];

                if (data.following) {
                    const alreadyFollowing =
                        currentFollowers.some(
                            (follower) => {
                                const followerId =
                                    typeof follower ===
                                    "object"
                                        ? follower._id
                                        : follower;

                                return (
                                    followerId?.toString() ===
                                    loggedInUser?._id?.toString()
                                );
                            }
                        );

                    if (alreadyFollowing) {
                        return previousUser;
                    }

                    return {
                        ...previousUser,

                        followers: [
                            ...currentFollowers,
                            loggedInUser._id,
                        ],
                    };
                }

                return {
                    ...previousUser,

                    followers: currentFollowers.filter(
                        (follower) => {
                            const followerId =
                                typeof follower ===
                                "object"
                                    ? follower._id
                                    : follower;

                            return (
                                followerId?.toString() !==
                                loggedInUser?._id?.toString()
                            );
                        }
                    ),
                };
            });
        } catch (error) {
            console.error(
                "Follow Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Unable to update follow"
            );
        }
    };

    if (loading) {
        return (
            <main className="profile-page">
                <p>Loading profile...</p>
            </main>
        );
    }

    if (error || !profileUser) {
        return (
            <main className="profile-page">
                <p className="error-message">
                    {error || "User not found"}
                </p>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <section className="profile-card">
                <div className="profile-avatar">
                    {profileUser.name
                        ?.charAt(0)
                        .toUpperCase()}
                </div>

                <div className="profile-info">
                    <h1>{profileUser.name}</h1>

                    <p>@{profileUser.username}</p>

                    <p>
                        {profileUser.bio ||
                            "No bio added yet."}
                    </p>

                    <div className="profile-stats">
                        <span>
                            <strong>
                                {profileUser.followers
                                    ?.length || 0}
                            </strong>{" "}
                            Followers
                        </span>

                        <span>
                            <strong>
                                {profileUser.following
                                    ?.length || 0}
                            </strong>{" "}
                            Following
                        </span>

                        <span>
                            <strong>
                                {posts.length}
                            </strong>{" "}
                            Posts
                        </span>
                    </div>

                    {!isOwnProfile && (
                        <button
                            type="button"
                            className="follow-button"
                            onClick={handleFollow}
                        >
                            {isFollowing
                                ? "Unfollow"
                                : "Follow"}
                        </button>
                    )}
                </div>
            </section>

            <h2 className="profile-posts-title">
                Posts
            </h2>

            <section className="posts-list">
                {posts.length === 0 ? (
                    <div className="empty-feed">
                        <p>No posts yet.</p>
                    </div>
                ) : (
                    posts.map((post) => (
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
                                        @
                                        {
                                            post.author
                                                ?.username
                                        }
                                    </p>
                                </div>
                            </header>

                            <p className="post-content">
                                {post.content}
                            </p>

                            <div className="post-actions">
                                <span>
                                    Likes (
                                    {post.likes?.length ||
                                        0}
                                    )
                                </span>

                                <span>
                                    Comments (
                                    {post.comments
                                        ?.length || 0}
                                    )
                                </span>
                            </div>
                        </article>
                    ))
                )}
            </section>
        </main>
    );
}

export default Profile;