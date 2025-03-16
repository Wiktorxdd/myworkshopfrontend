import Header from "@/components/Header";
import "../mainpage.css";
import NewPost from "@/components/NewPost";

export default function SettingsLayout({ 
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