"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Loader2, Save, Upload, ImageIcon } from "lucide-react";
import Link from "next/link";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "", author_name: "" });
    const [file, setFile] = useState<File | null>(null);
    const [currentMediaUrl, setCurrentMediaUrl] = useState("");
    const [postId, setPostId] = useState("");
    const [myClientId, setMyClientId] = useState("");

    useEffect(() => {
        const checkPermission = async () => {
            const p = await params;
            setPostId(p.id);

            // 1. Check Admin (Supabase Auth)
            const { data: { session } } = await supabase.auth.getSession();
            const isAdmin = !!session?.user;

            // 2. Check Owner (Local Storage)
            const storedId = localStorage.getItem("prompt_doumi_client_id");
            if (storedId) setMyClientId(storedId);

            fetchPost(p.id, storedId, isAdmin);
        };
        checkPermission();
    }, [params]);

    const fetchPost = async (id: string, clientId: string | null, isAdmin: boolean) => {
        try {
            const { data, error } = await supabase
                .from('gallery_posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            // Permission Check: Owner OR Admin
            const isOwner = data.client_id && data.client_id === clientId;
            if (!isOwner && !isAdmin) {
                alert("수정 권한이 없습니다.");
                router.push(`/gallery/${id}`);
                return;
            }

            setFormData({
                title: data.title,
                content: data.content || "",
                author_name: data.author_name || ""
            });
            setCurrentMediaUrl(data.media_url);
        } catch (error) {
            console.error(error);
            router.push("/gallery");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.author_name) return alert("제목과 작성자 이름을 입력해주세요.");

        setSaving(true);
        try {
            let finalMediaUrl = currentMediaUrl;
            let finalMediaType = 'image';

            // 1. If new file is selected, upload it
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('gallery')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('gallery')
                    .getPublicUrl(fileName);

                finalMediaUrl = publicUrl;
                finalMediaType = file.type.startsWith('image') ? 'image' : 'file';
            }

            // 2. Update DB
            const { error } = await supabase
                .from('gallery_posts')
                .update({
                    title: formData.title,
                    content: formData.content,
                    author_name: formData.author_name,
                    media_url: finalMediaUrl,
                    media_type: finalMediaType
                })
                .eq('id', postId);

            if (error) throw error;

            // Update local nickname cache
            localStorage.setItem("prompt_doumi_nickname", formData.author_name);

            alert("수정되었습니다.");
            router.push(`/gallery/${postId}`);
        } catch (error: any) {
            console.error(error);
            alert("수정 실패: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

    return (
        <div className="max-w-2xl mx-auto py-10 animate-in slide-in-from-bottom-4 duration-500">
            <Link href={`/gallery/${postId}`} className="inline-flex items-center text-text-muted hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> 돌아가기
            </Link>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-primary/5">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">글 수정하기</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">

                    {/* File Update Section */}
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700">이미지/파일 변경</label>
                        <div className={`relative border-2 border-dashed border-gray-200 rounded-xl p-8 text-center transition-all ${file ? 'bg-primary/5 border-primary/30' : 'hover:border-primary/50'}`}>
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                accept="image/*,video/*,.pdf"
                            />
                            <div className="flex flex-col items-center gap-2 text-text-muted pointer-events-none">
                                {file ? (
                                    <>
                                        <Upload className="w-8 h-8 text-primary" />
                                        <span className="font-bold text-primary">{file.name}</span>
                                        <span className="text-xs text-gray-400">파일이 선택되었습니다 (저장 시 반영)</span>
                                    </>
                                ) : (
                                    <>
                                        {currentMediaUrl && (
                                            <img src={currentMediaUrl} alt="Current" className="w-32 h-20 object-cover rounded mb-2 border border-gray-200 shadow-sm" />
                                        )}
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5 text-primary" />
                                            <span className="font-medium text-gray-600">클릭하여 이미지 변경 (선택사항)</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="font-bold text-gray-700">작성자 (닉네임)</label>
                            <input
                                type="text"
                                required
                                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                placeholder="이름/닉네임을 적어주세요"
                                value={formData.author_name}
                                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-bold text-gray-700">제목</label>
                            <input
                                type="text"
                                required
                                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                placeholder="작품의 제목을 적어주세요"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-bold text-gray-700">설명</label>
                        <textarea
                            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none min-h-[200px] resize-none transition-all"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> 수정 완료</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
