"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Edit2, Trash2, Calendar, User, Loader2 } from "lucide-react";
import Link from "next/link";

type Post = {
    id: string;
    title: string;
    content: string;
    media_url: string;
    media_type: string;
    created_at: string;
    client_id?: string;
    author_name?: string;
};

export default function GalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use() or await (Next.js 15+ convention, but safe to just await in effect or usage)
    // For client components in Next 15, params is a promise.
    // We'll handle it inside effect or use `use` hook if available, or just standard prop if Next 14.
    // Assuming Next 15/latest based on context, so `params` is a Promise.
    const [postId, setPostId] = useState<string>("");

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [myClientId, setMyClientId] = useState("");

    useEffect(() => {
        // Unwrap params
        params.then(p => {
            setPostId(p.id);
            fetchPost(p.id);
        });

        const storedId = localStorage.getItem("prompt_doumi_client_id");
        if (storedId) setMyClientId(storedId);
    }, [params]);

    const fetchPost = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('gallery_posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setPost(data);
        } catch (error) {
            console.error("Error fetching post:", error);
            alert("글을 불러올 수 없습니다.");
            router.push("/gallery");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!post) return;
        if (!confirm("정말 삭제하시겠습니까? (복구할 수 없습니다)")) return;

        try {
            const { error } = await supabase
                .from('gallery_posts')
                .delete()
                .eq('id', post.id);

            if (error) throw error;
            alert("삭제되었습니다.");
            router.push("/gallery");
        } catch (error) {
            console.error(error);
            alert("삭제 실패");
        }
    };

    const isOwner = post?.client_id && post.client_id === myClientId;

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
    if (!post) return null;

    return (
        <div className="max-w-4xl mx-auto py-10 animate-in fade-in duration-500 space-y-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
                <Link href="/gallery" className="inline-flex items-center text-text-muted hover:text-primary transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5 mr-2" /> 갤러리 목록
                </Link>

                {isOwner && (
                    <div className="flex gap-2">
                        <Link
                            href={`/gallery/${post.id}/edit`}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 font-bold"
                        >
                            <Edit2 className="w-4 h-4" /> 수정
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2 font-bold"
                        >
                            <Trash2 className="w-4 h-4" /> 삭제
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                {/* Media Area - Full Size */}
                <div className="bg-gray-50 border-b border-gray-100 p-4 md:p-8 flex justify-center">
                    {post.media_type === 'image' ? (
                        <img
                            src={post.media_url}
                            alt={post.title}
                            className="max-h-[70vh] w-auto h-auto object-contain rounded-lg shadow-sm"
                        />
                    ) : (
                        <div className="p-20 text-gray-400 text-center">
                            <p>파일 형식의 미디어입니다.</p>
                            <a href={post.media_url} target="_blank" className="text-primary underline mt-2 block">다운로드/열기</a>
                        </div>
                    )}
                </div>

                {/* Text Content */}
                <div className="p-8 space-y-6">
                    <div className="border-b border-gray-100 pb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-text-muted text-sm">
                            <span className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {post.author_name || "Anonymous"}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.created_at).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {post.content || <span className="text-gray-400 italic">내용이 없습니다.</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
