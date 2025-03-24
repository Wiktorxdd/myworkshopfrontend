import Header from "@/components/Header";
import "../mainpage.css";
import NewGroupPost from "@/components/GroupPost"

export default function CommunityLayout({ 
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <Header/>
            {children}
            <NewGroupPost />
        </div>
    )
}