'use client';

import { getPost, deletePost, editPost, getPostComments, createComment, deleteComment, getPostLikes, editComment, unlikePost, likePost } from "@/app/api/posts/route";
import { useState, useEffect, useCallback, Suspense, FormEvent } from 'react';
import { useRouter } from "next/navigation";
import { use } from "react";
import LikeIcon from "@/components/svgs/like";
import { formatDate } from "@/utils/date";
import CommentIcon from "@/components/svgs/comment";
import EditIcon from "@/components/svgs/edit";
import DeleteIcon from "@/components/svgs/delete";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { getUserId } from "@/app/api/users/[userId]/route";

const PostItem = React.memo(({ post, handleClick, likes, currentUser, handleDelete, toggleEdit, toggleComment, image, user }) => (
    <div className="flex flex-col items-center justify-center ">
        <li className="flex flex-col border bg-neutral-100 shadow-lg rounded-md p-5 m-5 w-1/2 h-1/2 text-center">
            <div>
                <Link className="underline text-blue-600" href={`/profile/${post.userId}`}>
                    {user}
                </Link>
            </div>
            <div className="block mt-2 text-xl font-bold">
                {post.title}
            </div>
            <div className="flex-grow overflow-y-auto mt-2">
                <p className="text-gray-700 break-words">{post.content}</p>
            </div>
            <div className="flex justify-center">
                {image &&
                    <Image className=""
                        src={image}
                        width={250}
                        height={250}
                        alt="image"
                    />
                }
            </div>
            <div className="mt-5 flex items-center justify-center space-x-5">
                <button onClick={() => handleClick(post.id)} className="flex items-center space-x-2 text-red-600 hover:text-red-800">
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

const CommentItem = React.memo(({ comment, currentUser, toggleCommentEdit, handleCommentDelete, ShowEditComment, name }) => (
    <div className="flex flex-col items-center justify-center">
        <li className="mt-5 flex flex-col items-center border bg-neutral-100 shadow-lg rounded-md w-2/5 h-1/2 text-center">
            <div className="">
                <Link className="underline text-blue-600" href={`/profile/${comment.user_id}`}>
                    {name}
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
    const [user, setUser] = useState()
    const [ShowComment, setShowComment] = useState(false);
    const [ShowEditComment, setShowEditComment] = useState(false);
    const [image, setImage] = useState(null);
    const [userMap, setUserMap] = useState({});
    const [showEditPost, setShowEditPost] = useState(false);
    const [likesCount, setLikes] = useState({});
    const [likedPosts, setLikedPosts] = useState({});
    const currentUser = localStorage.getItem('currentUser');

    useEffect(() => {
        const fetchPost = async () => {
            const post = await getPost(id);
            setPost(post.data);

            if (post.data.imaxge.base64_data) {
                const base64String = post.data.image.base64_data;
                const dataUrl = `data:image/jpeg;base64,${base64String}`;
                setImage(dataUrl);
            }

            const user = await getUserId(post.data.user_id);
            setUser(user.name);

            const likes = await getPostLikes(post.data.id)

            setLikes(likes);
        };
        fetchPost();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            const comment = await getPostComments(id)
            const fetchedComments = comment.data
            setComments(fetchedComments)
            

            const userIds = [...new Set(fetchedComments.map(comment => comment.user_id))];
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
        };
        fetchComments();
    }, [id]);



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
                router.push('/profile')
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post. Please try again.');
            }
        }

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
        await editPost(formData, post.id);
        const updatedData = Object.fromEntries(formData);
        setPost({ ...post, ...updatedData });
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

        const userIds = [...new Set(comment.data.map(comment => comment.user_id))];
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
                    {post ? (
                        <PostItem
                            post={post}
                            handleClick={handleClick}
                            likes={likesCount[post.id] || 0}
                            user={user}
                            image={image}
                            toggleEdit={toggleEdit}
                            toggleComment={toggleComment}
                            currentUser={currentUser}
                            handleDelete={handleDelete}
                        />
                    ) : (
                        <p>Loading</p>
                    )}
                </ul>
            }
            {showEditPost &&
                <div className="flex flex-col items-center justify-center">
                    <form onSubmit={handleSubmit} className="flex flex-col border bg-neutral-100 shadow-lg rounded-md p-5 m-5 w-1/2 h-1/2 text-center">
                        <input type="text" name="title" defaultValue={post.title} className="border rounded-md p-2 m-2" />
                        <textarea type="text" name="content" defaultValue={post.content} className="border rounded-md p-2 m-2" />
                        <input type="file" name="image" />
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
                            name={userMap[comment.user_id] || comment.user_id}
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