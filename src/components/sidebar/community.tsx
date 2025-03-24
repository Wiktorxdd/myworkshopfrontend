import { useEffect, useState } from "react"
import { getGroupById, getGroupMembers, followGroup, isFollowingGroup, deleteGroup } from "@/app/api/groups/route";
import { getCategoryById } from "@/app/api/categories/route";
import { getCurrentUser } from "@/app/api/users/route";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import FollowGroupicon from "../svgs/followgroup";
import UnFollowGroupicon from "../svgs/unfollowgroup"
import GroupEditIcon from "../svgs/editgroup"
import DeleteIcon from "../svgs/delete";
import Image from "next/image";
import Link from "next/link";
import { followUser } from "@/app/api/users/[userId]/route";
import NewGroupPost from "@/components/NewPost/communitypost";

export default function GroupSideBar() {
    const [group, setGroup] = useState({});
    const [groupMembers, setGroupMembers] = useState(null);
    const [memberCheck, setMemberCheck] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [category, setCategory] = useState();
    const unwrappedParams = useParams();
    const [image, setImage] = useState(null);
    const { id } = unwrappedParams;
    const router = useRouter();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user.id);
            } catch (error) {
                console.error('Failed to fetch current user:', error);
            }
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchGroup = async () => {
            const group = await getGroupById(id);
            setGroup(group.data)
            const category = await getCategoryById(group.data.category_id)
            setCategory(category.data);

            if (group.data.image.base64_data) {
                const base64String = group.data.image.base64_data;
                setImage(base64String);
            }
            const groupMembers = await getGroupMembers(id);
            setGroupMembers(groupMembers);
            const memberCheck = await isFollowingGroup(id)
            setMemberCheck(memberCheck);
        };
        fetchGroup();
    }, []);


    const handleJoinClick = async (id: any) => {
        await followGroup(id);
        const followAmount = await getGroupMembers(id)
        setGroupMembers(followAmount);
        const followGroupCheck = await isFollowingGroup(id)
        setMemberCheck(followGroupCheck);
    }

    const handleDeleteClick = async (id: any) => {
        if (confirm("Are you sure you want to delete this group?")) {
          try {
            await deleteGroup(id);
            router.push('/communities'); 
          } catch (error) {
            console.error('Error deleting group:', error);
            alert('Failed to delete group. Please try again.');
          }
        }
      };
    const dataUrl = `data:image/jpeg;base64,${image}`;

    return (
        <div className="flex">
            <div className="fixed w-64 h-screen bg-gray-200">
                {image && <Image src={dataUrl} alt="image" width={270} height={100} quality={100} />}
                <div className="p-10">
                    <div>
                        <h1 className="text-xl border-b-4 border-indigo-500">{group.name}</h1>
                        <p className="mt-2 text-lg ">About!</p>
                        <p>Category: {category && category.name}</p>
                        <p className='break-words border-b-4 border-indigo-500'>{group.description}</p>
                    </div>
                    <div>
                        <p className="mt-5">Members: {groupMembers || 0}</p>
                        {!memberCheck && currentUser !== group.user_id &&
                            <button onClick={() => handleJoinClick(id)} className="flex items-center space-x-3 mt-5 hover:text-blue-800">
                                <FollowGroupicon />
                                <span>Join Group</span>
                            </button>
                        }
                        {memberCheck && currentUser !== group.user_id &&
                            <button onClick={() => handleJoinClick(id)} className="flex items-center space-x-3 mt-5 hover:text-blue-800">
                                <UnFollowGroupicon />
                                <span>Leave Group</span>
                            </button>
                        }
                        {currentUser == group.user_id &&
                            <Link href={`/communities/${id}/editgroup/`} className="flex items-center space-x-3 mt-5 text-yellow-500 hover:text-blue-800">
                                <GroupEditIcon/>
                                <span>Edit Group</span>
                            </Link>
                        }
                        {currentUser == group.user_id &&
                            <button onClick={() => handleDeleteClick(id)} className="flex items-center space-x-3 mt-5 text-red-800 hover:text-blue-800">
                                <DeleteIcon/>
                                <span>Delete Group</span>
                            </button>
                        }
                    </div>
                </div>
            </div>
            {memberCheck || currentUser == group.user_id && <NewGroupPost/>}
        </div>
    )
}