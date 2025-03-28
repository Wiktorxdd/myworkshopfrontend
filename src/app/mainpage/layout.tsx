import Header from "@/components/Header";
import "../mainpage.css";
import NewPost from "@/components/NewPost";

export default function HomeLayout({ 
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