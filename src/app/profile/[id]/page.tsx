'use client'

import { useParams, useRouter } from "next/navigation"
import { Suspense, useState, useEffect, useCallback } from "react";
import { use } from "react";
import { getUserPosts, deletePost, getPostLikes, getPostComments, likePost, unlikePost, sharePost, getSharesPost } from "@/app/api/posts/route";
import { getUserId, getSharedPost } from "@/app/api/users/[userId]/route";
import LikeIcon from "@/components/svgs/like";
import CommentIcon from "@/components/svgs/comment";
import EditIcon from "@/components/svgs/edit";
import DeleteIcon from "@/components/svgs/delete";
import ShareIcon from "@/components/svgs/share";
import Link from "next/link";
import React from "react";
import SideBar from "@/components/sidebar";


const PostItem = React.memo(({ post, handleClick, likes, name, commentCount, shares, handleShare }) => (
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
            <button onClick={() => handleClick(post.id)} className="flex items-center space-x-2 text-red-600 hover:text-red-800">
                <LikeIcon />
                <span>{likes}</span>
            </button>
            <Link href={`/post/${post.id}`} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <CommentIcon />
                <span>Comment ({commentCount})</span>
            </Link>
            <button className="flex items-center space-x-2 text-green-800 " onClick={() => handleShare(post.id)}>
                <ShareIcon />
                <span>Share ({shares})</span>
            </button>
        </div>
    </li>
));


export default function ProfileID() {
    const router = useRouter();
    const unwrappedParams = useParams();
    const { id } = unwrappedParams;
    const [likes, setLikes] = useState({});
    const [likedPosts, setLikedPosts] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const [showShared, setShowShared] = useState(false);
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [userMap, setUserMap] = useState({});
    const [shareCounts, setShareCounts] = useState({})

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

    const toggleShared = () => {
        setShowShared(!showShared);
    }

    const handleShare = async (id) => {
        await sharePost(id);
        const shareCount = await getSharesPost(id);
        setShareCounts((prevShares) => ({ ...prevShares, [id]: shareCount }));
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsData = await getUserPosts(id, currentPage);
                const fetchedPosts = postsData.data
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

            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };
        fetchPosts();
    }, [currentPage]);

    return (
        <div className="flex">
            <SideBar />
            <div className="flex-grow flex flex-col items-center justify-center p-12">
                <div className="mb-4 space-x-10">
                    <button onClick={toggleShared}>
                        {!showShared ? 'Show Shared Posts' : 'Show User Posts'}
                    </button>
                </div>
                {posts && !showShared ? (
                    <ul className="flex flex-col space-y-6">
                        {posts.map((post: any) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                handleClick={handleClick}
                                likes={likes[post.id] || 0}
                                name={userMap[post.user_id] || post.user_id}
                                commentCount={commentCounts[post.id] || 0}
                                shares={shareCounts[post.id] || 0}
                                handleShare={handleShare}
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