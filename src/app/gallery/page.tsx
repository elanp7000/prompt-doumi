"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Plus, Image as ImageIcon, FileText, Loader2, Trash2, Edit2 } from "lucide-react";

type Post = {
    id: string;
    title: string;
    content: string;
    media_url: string;
    media_type: string;
    created_at: string;
    client_id?: string;
    author_name?: string; // Added field
};

export default function GalleryPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [myClientId, setMyClientId] = useState("");

    useEffect(() => {
        // Check my identity
        const storedId = localStorage.getItem("prompt_doumi_client_id");
        if (storedId) setMyClientId(storedId);

        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_posts')
                .select('id, title, content, media_url, media_type, created_at, client_id, author_name')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (post: Post) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        if (post.client_id !== myClientId) {
            alert("본인이 작성한 글만 삭제할 수 있습니다.\n(다른 브라우저나 기기에서 작성한 경우 삭제가 불가능할 수 있습니다)");
            return;
        }

        try {
            const { error: deleteError } = await supabase
                .from('gallery_posts')
                .delete()
                .eq('id', post.id);

            if (deleteError) throw deleteError;

            alert("삭제되었습니다.");
            fetchPosts(); // Refresh list
        } catch (error: any) {
            console.error("Delete failed:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // Helper to check ownership
    const isOwner = (post: Post) => {
        // If post has no client_id (old posts), nobody can delete easily (or allow all? safer to disallow)
        // Current logic: strict match
        return post.client_id && post.client_id === myClientId;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">갤러리</h1>
                    <p className="text-text-muted mt-1">멋진 작품을 감상하세요.</p>
                </div>
                <Link
                    href="/gallery/new"
                    className="px-5 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> 작품 올리기
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-600">아직 등록된 작품이 없습니다</h3>
                    <p className="text-gray-400 mb-6">첫 번째 작품의 주인공이 되어보세요!</p>
                    <Link
                        href="/gallery/new"
                        className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                    >
                        작품 등록하러 가기
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 relative">
                            {/* Wrap image area in Link to Detail */}
                            <Link href={`/gallery/${post.id}`} className="block relative aspect-video bg-gray-100 overflow-hidden cursor-pointer">
                                {post.media_type === 'image' ? (
                                    <img src={post.media_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                        <FileText className="w-12 h-12" />
                                    </div>
                                )}
                            </Link>

                            {/* Action Buttons (Visible Only to Owner) */}
                            {isOwner(post) && (
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        href={`/gallery/${post.id}/edit`}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 shadow-sm hover:bg-gray-50 hover:text-primary hover:scale-110 transition-all"
                                        title="수정하기"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(post); }}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:bg-red-50 hover:scale-110 transition-all"
                                        title="삭제하기"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <Link href={`/gallery/${post.id}`} className="block p-5">
                                <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>

                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">{post.author_name || "Anonymous"}</span>
                                    <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
