'use client';

import { Suspense, useState, useEffect, useCallback } from "react";
import { getPosts, deletePost, getPostLikes, likePost, unlikePost, getPostComments, getUserPostLikes, sharePost, getSharesPost, deleteSharePost } from "@/app/api/posts/route";
import { getUserId } from "../api/users/[userId]/route";
import LikeIcon from "@/components/svgs/like";
import UnlikeIcon from "@/components/svgs/unlike"
import CommentIcon from "@/components/svgs/comment";
import DeleteIcon from "@/components/svgs/delete";
import ShareIcon from "@/components/svgs/share"
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import GroupContainer from "@/components/communitiescontainer";
import { formatDate } from "@/utils/date";


const PostItem = React.memo(({ post, name, handleClick, likes, shares, currentUser, handleDelete, commentCount, handleShare }) => (
    <li className="border bg-neutral-100 shadow-lg rounded-md p-5 m-5">
        <div className="flex justify-between">
            <Link className="underline text-blue-600" href={`/profile/${post.user_id}`}>
                {name}
            </Link>
            <p className="break-word">{formatDate(post.created_at)}</p>
        </div>
        <Link className="block mt-2 text-xl font-bold" href={`/post/${post.id}`}>
            {post.title}
        </Link>
        <p className="mt-2 text-gray-700 break-words line-clamp-2">{post.content}</p>
        <div className="mt-4 flex items-center space-x-5">
            <button onClick={() => handleClick(post.id)} className="flex items-center space-x-2 text-red-600 hover:text-red-800">
                <LikeIcon />
                <span>{likes}</span>
            </button>
            <Link href={`/post/${post.id}`} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <CommentIcon />
                <span>Comments ({commentCount})</span>
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
                    <span>Share ({shares})</span>
                </button>
            )}
        </div>
        <div className="mt-5">
            {post.group_id && <Link href={`/communities/${post.group_id}`} >Group: {post.group_id}</Link>}
        </div>
    </li>
));

export default function Home() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [image, setImages] = useState([])
    const [userMap, setUserMap] = useState({});
    const [likesCount, setLikes] = useState({});
    const [likedPosts, setLikedPosts] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const [shareCounts, setShareCounts] = useState({})
    const currentUser = localStorage.getItem('currentUser');


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsData = await getPosts(currentPage);
                const fetchedPosts = postsData.data;
                setPosts(fetchedPosts);
                setLastPage(postsData.last_page);

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

    const handleClick = async (id) => {
        const isLiked = await getUserPostLikes(id)
        if (isLiked.status) {
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

    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <div className="min-h-screen flex flex-col">
                <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
                    The Main Page
                </header>
                <main className="grid grid-cols-3 divide-x-4 divide-gray-100">
                    <div></div>
                    <div>
                        <ul className="flex flex-col space-y-10 mb-5">
                            {posts.map((post: any) => (
                                <PostItem
                                    key={post.id}
                                    post={post}
                                    name={userMap[post.user_id] || post.user_id}
                                    handleClick={handleClick}
                                    likes={likesCount[post.id] || 0}
                                    shares={shareCounts[post.id] || 0}
                                    likedPosts={likedPosts}
                                    commentCount={commentCounts[post.id] || 0}
                                    currentUser={currentUser}
                                    handleDelete={handleDelete}
                                    handleShare={handleShare}
                                />
                            ))}
                        </ul>
                        <footer>
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
                        </footer>
                    </div>
                    <div className="flex justify-center">
                        <GroupContainer />
                    </div>
                </main>
            </div>
        </Suspense>
    );
}