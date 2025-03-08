'use client'
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usersGet, getCurrentUser } from "../api/users/route";
import { getUserPosts } from "../api/posts/route";
import SideBar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { getPosts, deletePost } from "../api/posts/route";
import LikeIcon from "@/components/svgs/like";
import CommentIcon from "@/components/svgs/comment";
import EditIcon from "@/components/svgs/edit";
import DeleteIcon from "@/components/svgs/delete";
import React from "react";



const PostItem = React.memo(({ post, handleClick, likes, currentUser, handleDelete }) => (
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
            {post.user_id == currentUser && (
                <button className="flex items-center space-x-2 text-red-800" onClick={() => handleDelete(post.id)}>
                    <DeleteIcon />
                    <span>Delete</span>
                </button>
            )}
        </div>
    </li>
));

export default function Profile() {
    const currentUser = localStorage.getItem('currentUser');
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState(0);
    const router = useRouter();
    const handleClick = useCallback(() => {
        setLikes(likes + 1);
    }, [likes]);

    useEffect(() => {
        const FetchUserAndPosts = async () => {
            try {
                const posts = await getUserPosts(currentUser);
                setPosts(posts);
            } catch (error) {
                console.error("Failed to fetch current user:", error);
            }
        };
        FetchUserAndPosts();
    }, []);

    const handleDelete = async (id) => {
        await deletePost(id);
        setPosts(posts.filter(posts => posts.id !== id));
        router.refresh();
    };

    return (
        <div className="flex ">
            <SideBar />
            <div className="flex-grow flex items-center justify-center p-12">
                {posts.data ? (
                    <ul className="flex flex-col space-y-6">
                        {posts.data.map((post: any) => (
                            <PostItem key={post.id} post={post} handleClick={handleClick} likes={likes} currentUser={currentUser} handleDelete={handleDelete} />
                        ))}
                    </ul>
                ) : (
                    <p>Loading...</p>
                )
                }
            </div>
        </div>
    );
}