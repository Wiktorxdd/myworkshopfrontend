'use client';

import { getPost, deletePost, editPost, getPostComments, createComment, deleteComment } from "@/app/api/posts/route";
import { useState, useEffect, useCallback, Suspense, FormEvent } from 'react';
import { useRouter } from "next/navigation";
import { use } from "react";
import LikeIcon from "@/components/svgs/like";
import { formatDate } from "@/utils/date";
import CommentIcon from "@/components/svgs/comment";
import EditIcon from "@/components/svgs/edit";
import DeleteIcon from "@/components/svgs/delete";
import Link from "next/link";
import React from "react";

const PostItem = React.memo(({ post, handleClick, likes, currentUser, handleDelete, toggleEdit, toggleComment }) => (
    <div className="flex flex-col items-center justify-center ">
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
            <div className="mt-5 flex items-center justify-center space-x-5">
                <button onClick={handleClick} className="flex items-center space-x-2 text-red-600 hover:text-red-800">
                    <LikeIcon />
                    <span>{likes}</span>
                </button>
                <button onClick={toggleComment} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
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
            <p className="break-word mt-2">{formatDate(post.created_at)}</p>
        </li>
    </div>
));

const CommentItem = React.memo(({ comment, currentUser, toggleCommentEdit, handleCommentDelete, ShowEditComment }) => (
    <div className="flex flex-col items-center justify-center">
        <li className="mt-5 flex flex-col items-center border bg-neutral-100 shadow-lg rounded-md w-2/5 h-1/2 text-center">
            <div className="">
                <Link className="underline text-blue-600" href={`/profile/${comment.userId}`}>
                    {comment.user_id}
                </Link>
            </div>
            <div className="flex-grow overflow-y-auto mt-2">
            {!ShowEditComment && 
                <p className="text-gray-700 break-words">{comment.content}</p>    
            }
            {ShowEditComment &&
                <textarea></textarea>
            }
            </div>
            <div className="mt-5 flex items-center justify-center space-x-5">
                {comment.user_id == currentUser && (
                    <>
                        <button className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-700" onClick={() => toggleCommentEdit()} >
                            <EditIcon />
                            <span>Edit</span>
                        </button>
                        <button className="flex items-center space-x-2 text-red-800" onClick={() => handleCommentDelete(comment.id)}>
                            <DeleteIcon />
                            <span>Delete</span>
                        </button>
                    </>
                )}
            </div>
            <p className="break-word">{formatDate(comment.created_at)}</p>
        </li>
    </div>
));

export default function PostId({ params }) {
    const router = useRouter();
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([])
    const [likes, setLikes] = useState(0);
    const [ShowComment, setShowComment] = useState(false);
    const [ShowEditComment, setShowEditComment] = useState(false);
    const [showEditPost, setShowEditPost] = useState(false);
    const currentUser = localStorage.getItem('currentUser');

    useEffect(() => {
        const fetchPost = async () => {
            const post = await getPost(id);
            setPost(post.data);

        };
        fetchPost();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            const comment = await getPostComments(id)
            setComments(comment.data)
        };
        fetchComments();
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

    const toggleComment = () => {
        setShowComment(!ShowComment);
    }

    const toggleCommentEdit = () => {
        setShowEditComment(!ShowEditComment);
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

    const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const content = formData.get("content")
        await createComment(post.id, content);
        const comment = await getPostComments(id)
        setComments(comment.data)
        setShowComment(!ShowComment);
    }

    const handleCommentDelete = async (id) => {
        await deleteComment(id);
        setComments(comments.filter(comments => comments.id !== id));
        router.refresh();
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
                            toggleComment={toggleComment}
                            currentUser={currentUser}
                            handleDelete={handleDelete}
                        />
                    )}
                </ul>
            }
            {showEditPost &&
                <div className="flex flex-col items-center justify-center">
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
            {ShowComment &&
                <div className="flex flex-col items-center justify-center">
                    <form onSubmit={handleCommentSubmit} className="flex flex-col border bg-neutral-100 shadow-lg rounded-md text-center p-2 m-2 w-2/5 h-1/2">
                        <textarea type="text" name="content" placeholder="Comment content" className="border rounded-md" />
                        <div className="mt-auto flex items-center justify-center space-x-5">
                            <button className="border rounded-md p-2 m-2 bg-blue-600 text-white">Comment</button>
                            <button onClick={toggleComment} className="border rounded-md p-2 m-2 bg-blue-600 text-white">Cancel</button>
                        </div>
                    </form>
                </div>
            }
            <div className="">
                <ul className="">
                    <p className="font-bold flex flex-col items-center justify-center">Comments</p>
                    {comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            toggleCommentEdit={toggleCommentEdit}
                            handleCommentDelete={handleCommentDelete}
                            ShowEditComment={ShowEditComment}
                            comment={comment}
                            currentUser={currentUser}
                        />
                    ))}
                </ul>
            </div>
        </Suspense>
    );
}