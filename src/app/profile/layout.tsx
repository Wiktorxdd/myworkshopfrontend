import Header from "@/components/Header";
import NewPost from "@/components/NewPost";

export default function ProfileLayout({ 
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <Header/>
            {children}
            <NewPost />
        </div>
    )
}