'use client';

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import { getUserId } from "@/app/api/users/[userId]/route";
import { getPostComments, getGroupPosts, getPostLikes, likePost, unlikePost, deletePost, sharePost, getSharesPost } from "@/app/api/posts/route";
import GroupSideBar from "@/components/sidebar/community";
import ShareIcon from "@/components/svgs/share";
import LikeIcon from "@/components/svgs/like";
import CommentIcon from "@/components/svgs/comment";
import DeleteIcon from "@/components/svgs/delete";
import Link from "next/link";
import React from "react";


const PostItem = React.memo(({ post, handleClick, likes, name, currentUser, shares, handleDelete, handleShare, commentCount }) => (
    <li className="border bg-neutral-100 shadow-lg rounded-md p-5 m-5">
        <div>
            <Link className="underline text-blue-600" href={`/profile/${post.user_id}`}>
                {name}
            </Link>
        </div>
        <Link className="block mt-2 text-xl font-bold" href={`/post/${post.id}`}>
            {post.title}
        </Link>
        <p className="mt-2 text-gray-700">{post.content}</p>
        <div className="mt-4 flex items-center space-x-5">
            <button onClick={handleClick} className="flex items-center space-x-2 text-red-600 hover:text-red-800">
                <LikeIcon />
                <span>{likes}</span>
            </button>
            <Link href={`/post/${post.id}`} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <CommentIcon />
                <span>Comment ({commentCount})</span>
            </Link>
            {post.user_id == currentUser && (
                <button className="flex items-center space-x-2 text-red-800 " onClick={() => handleDelete(post.id)}>
                    <DeleteIcon />
                    <span>Delete</span>
                </button>
            )}
            {post.user_id != currentUser && (
                <button className="flex items-center space-x-2 text-green-800 " onClick={() => handleShare(post.id)}>
                    <ShareIcon />
                    <span>Shares ({shares})</span>
                </button>
            )}
        </div>
    </li>
));


export default function GroupIdPage() {
    const router = useRouter();
    const unwrappedParams = useParams();
    const { id } = unwrappedParams;
    const [likes, setLikes] = useState({});
    const [likedPosts, setLikedPosts] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [shareCount, setShareCounts] = useState(null);
    const [posts, setPosts] = useState([]);
    const [userMap, setUserMap] = useState({});
    const currentUser = localStorage.getItem('currentUser');

    const handleClick = async (id) => {
        const isLiked = await getPostLikes(id)
        if (isLiked) {
            await unlikePost(id);
        } else {
            await likePost(id);
        }
        setLikedPosts({ ...likedPosts, [id]: !isLiked });
        const likesCount = await getPostLikes(id);
        setLikes((prevLikes) => ({ ...prevLikes, [id]: likesCount }));
    }

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePost(id);
                setPosts(posts.filter(posts => posts.id !== id));
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post. Please try again.');
            }
        }
    };

    const handleShare = async (id) => {
        await sharePost(id);
        const shareCount = await getSharesPost(id);
        setShareCounts((prevShares) => ({ ...prevShares, [id]: shareCount }));
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsData = await getGroupPosts(id, currentPage);
                const fetchedPosts = postsData.data
                setPosts(fetchedPosts);
                setLastPage(postsData.last_page)

                const userIds = [...new Set(fetchedPosts.map(post => post.user_id))];

                const userPromises = userIds.map(id =>
                    getUserId(id).catch(error => {
                        console.error(`Failed to fetch user ${id}:`, error);
                        return null;
                    })
                );
                const users = await Promise.all(userPromises);
                const map = {};
                users.forEach(user => {
                    if (user) {
                        map[user.id] = user.name;
                    }
                });
                setUserMap(map);

                const likesPromises = fetchedPosts.map(post => getPostLikes(post.id));
                const likesResults = await Promise.all(likesPromises);
                const likesMap = {};
                fetchedPosts.forEach((post, index) => {
                    likesMap[post.id] = likesResults[index];
                });
                setLikes(likesMap);

                const commentPromises = fetchedPosts.map(post =>
                    getPostComments(post.id)
                        .then(comments => comments.total)
                        .catch(() => 0)
                );
                const commentCountsArray = await Promise.all(commentPromises);
                const commentsMap = {};
                fetchedPosts.forEach((post, index) => {
                    commentsMap[post.id] = commentCountsArray[index];
                });
                setCommentCounts(commentsMap);

                const sharePromises = fetchedPosts.map(post => getSharesPost(post.id));
                const shareResults = await Promise.all(sharePromises);
                const shareMap = {};
                fetchedPosts.forEach((post, index) => {
                    shareMap[post.id] = shareResults[index];
                });
                setShareCounts(shareMap);

            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };
        fetchPosts();
    }, [currentPage]);


    return (
        <div className="flex ">
            <GroupSideBar />
            <div className="flex-grow flex flex-col items-center justify-center p-12">
                {posts ? (
                    <ul className="flex flex-col space-y-6">
                        {posts.map((post: any) => (
                            <PostItem key={post.id}
                                post={post}
                                handleClick={handleClick}
                                likes={likes[post.id] || 0}
                                name={userMap[post.user_id] || post.user_id}
                                currentUser={currentUser}
                                commentCount={commentCounts[post.id] || 0}
                                handleDelete={handleDelete}
                                handleShare={handleShare}
                                shares={shareCount}
                            />
                        ))}
                    </ul>

                ) : (
                    <p>Loading...</p>
                )}
                <div className="flex justify-center space-x-4 mt-4 mb-5">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Previous
                    </button>
                    <span className="self-center">Page {currentPage} of {lastPage}</span>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === lastPage}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}