import NewPost from "@/components/NewPost";

export default function PostLayout({ 
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {children}
            <NewPost />
        </div>
    )
}