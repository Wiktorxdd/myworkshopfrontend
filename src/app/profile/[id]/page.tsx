'use client'

import { useParams, useRouter } from "next/navigation"
import { Suspense, useState, useEffect, useCallback } from "react";
import { use } from "react";
import { getUserPosts, deletePost } from "@/app/api/posts/route";
import LikeIcon from "@/components/svgs/like";
import CommentIcon from "@/components/svgs/comment";
import EditIcon from "@/components/svgs/edit";
import DeleteIcon from "@/components/svgs/delete";
import Link from "next/link";
import React from "react";
import SideBar from "@/components/sidebar";


const PostItem = React.memo(({ post, handleClick, likes }) => (
    <li className="border bg-neutral-100 shadow-lg rounded-md p-5 m-5">
        <div>
            <Link className="underline text-blue-600" href={`/profile/${post.user_id}`}>
                {post.user_id}
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
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <CommentIcon />
                <span>Comment</span>
            </button>
        </div>
    </li>
));

export default function ProfileID() {
    const router = useRouter();
    const unwrappedParams = useParams();
    const { id } = unwrappedParams;
    const [likes, setLikes] = useState(0);
    const [posts, setPosts] = useState([]);

    const handleClick = useCallback(() => {
        setLikes(likes + 1);
    }, [likes]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await getUserPosts(id);
                setPosts(posts);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="flex ">
            <SideBar />
            <div className="flex-grow flex items-center justify-center p-12">
                {posts.data ? (
                    <ul className="flex flex-col space-y-6">
                        {posts.data.map((post: any) => (
                            <PostItem key={post.id} post={post} handleClick={handleClick} likes={likes} />
                        ))}
                    </ul>
                ) : (
                    <p>Loading...</p>
                )
                }
            </div>
        </div>
    )
}