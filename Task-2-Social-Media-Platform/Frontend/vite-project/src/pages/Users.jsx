import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getUsers,
    toggleFollow,
} from "../api/user.api";

import { useAuth } from "../context/AuthContext";

function Users() {
    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUsers = async () => {
        try {
            setError("");

            const data = await getUsers();

            setUsers(data.users || []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load users"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleFollow = async (userId) => {
        try {
            const data = await toggleFollow(userId);

            setUsers((previousUsers) =>
                previousUsers.map((currentUser) =>
                    currentUser._id === userId
                        ? {
                              ...currentUser,

                              followers: data.following
                                  ? [
                                        ...(currentUser.followers || []),
                                        user._id,
                                    ]
                                  : (
                                        currentUser.followers || []
                                    ).filter(
                                        (followerId) =>
                                            followerId !== user._id
                                    ),
                          }
                        : currentUser
                )
            );
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to update follow"
            );
        }
    };

    if (loading) {
        return (
            <main className="users-page">
                <p>Loading users...</p>
            </main>
        );
    }

    return (
        <main className="users-page">

            <h1>Discover People</h1>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <section className="users-list">

                {users.length === 0 ? (
                    <div className="empty-feed">
                        <p>No other users found.</p>
                    </div>
                ) : (
                    users.map((profileUser) => {

                        const isFollowing =
                            profileUser.followers?.some(
                                (followerId) =>
                                    followerId.toString() ===
                                    user?._id?.toString()
                            );

                        return (
                            <article
                                className="user-card"
                                key={profileUser._id}
                            >
                                <div>
                                    <Link
                                        to={`/profile/${profileUser._id}`}
                                        className="user-name-link"
                                    >
                                        <strong>
                                            {profileUser.name}
                                        </strong>
                                    </Link>

                                    <p>
                                        @{profileUser.username}
                                    </p>

                                    {profileUser.bio && (
                                        <p>{profileUser.bio}</p>
                                    )}

                                    <small>
                                        {profileUser.followers?.length || 0}
                                        {" "}followers
                                    </small>
                                </div>

                                <button
                                    className="follow-button"
                                    onClick={() =>
                                        handleFollow(profileUser._id)
                                    }
                                >
                                    {isFollowing
                                        ? "Unfollow"
                                        : "Follow"}
                                </button>
                            </article>
                        );
                    })
                )}

            </section>
        </main>
    );
}

export default Users;