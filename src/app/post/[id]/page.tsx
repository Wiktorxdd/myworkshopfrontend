'use client';

import { getPost, deletePost, editPost } from "@/app/api/posts/route";
import { useState, useEffect, useCallback, Suspense, FormEvent } from 'react';
import { useRouter } from "next/navigation";
import { use } from "react";
import LikeIcon from "@/components/svgs/like";
import CommentIcon from "@/components/svgs/comment";
import EditIcon from "@/components/svgs/edit";
import DeleteIcon from "@/components/svgs/delete";
import Link from "next/link";
import React from "react";

const PostItem = React.memo(({ post, handleClick, likes, currentUser, handleDelete, toggleEdit }) => (
    <div className="flex flex-col items-center justify-center h-screen">
        <li className="flex flex-col border bg-neutral-100 shadow-lg rounded-md p-5 m-5 w-1/2 h-1/2 text-center">
            <div>
                <Link className="underline text-blue-600" href={`/profile/${post.userId}`}>
                    {post.author}
                </Link>
            </div>
            <div className="block mt-2 text-xl font-bold">
                {post.title}
            </div>
            <div className="flex-grow overflow-y-auto mt-2">
                <p className="text-gray-700 break-words">{post.content}</p>
            </div>
            <div className="mt-auto flex items-center justify-center space-x-5">
                <button onClick={handleClick} className="flex items-center space-x-2 text-red-600 hover:text-red-800">
                    <LikeIcon />
                    <span>{likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                    <CommentIcon />
                    <span>Comment</span>
                </button>
                {post.user_id == currentUser && (
                    <>
                        <button className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-700" onClick={() => toggleEdit()} >
                            <EditIcon />
                            <span>Edit</span>
                        </button>
                        <button className="flex items-center space-x-2 text-red-800" onClick={() => handleDelete(post.id)}>
                            <DeleteIcon />
                            <span>Delete</span>
                        </button>
                    </>
                )}
            </div>
        </li>
    </div>
));

export default function PostId({ params }) {
    console.log(params);
    const router = useRouter();
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);
    const [showEditPost, setShowEditPost] = useState(false);
    const currentUser = localStorage.getItem('currentUser');

    useEffect(() => {
        const fetchPost = async () => {
            const post = await getPost(id);
            setPost(post.data);
            console.log(post.data);
        };
        fetchPost();
    }, [id]);


    const handleClick = useCallback(() => {
        setLikes(likes + 1);
    }, [likes]);

    const handleDelete = async (id) => {
        await deletePost(id);
        router.push('/profile')

    };

    const toggleEdit = () => {
        setShowEditPost(!showEditPost);
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get("title")
        const content = formData.get("content")
        await editPost(post.id, title, content);
        setPost({ ...post, title, content });
        setShowEditPost(!showEditPost);
    }

    return (

        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            {!showEditPost &&
                <ul>
                    {post && (
                        <PostItem
                            post={post}
                            handleClick={handleClick}
                            likes={likes}
                            toggleEdit={toggleEdit}
                            currentUser={currentUser}
                            handleDelete={handleDelete}
                        />
                    )}
                </ul>
            }
            {showEditPost &&
                <div className="flex flex-col items-center justify-center h-screen">
                    <form onSubmit={handleSubmit} className="flex flex-col border bg-neutral-100 shadow-lg rounded-md p-5 m-5 w-1/2 h-1/2 text-center">
                        <input type="text" name="title" defaultValue={post.title} className="border rounded-md p-2 m-2" />
                        <textarea type="text" name="content" defaultValue={post.content} className="border rounded-md p-2 m-2" />
                        <div className="mt-auto flex items-center justify-center space-x-5">
                            <button className="border rounded-md p-2 m-2 bg-blue-600 text-white">Edit Post</button>
                            <button onClick={toggleEdit} className="border rounded-md p-2 m-2 bg-blue-600 text-white">Cancel</button>
                        </div>
                    </form>
                </div>
            }
        </Suspense>
    );
}