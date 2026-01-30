"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Upload, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "", author_name: "" }); // added author_name
    const [file, setFile] = useState<File | null>(null);
    const [clientId, setClientId] = useState("");

    useEffect(() => {
        // Generate or retrieve Client ID for ownership
        let storedId = localStorage.getItem("prompt_doumi_client_id");
        if (!storedId) {
            storedId = crypto.randomUUID(); // Native random UUID
            localStorage.setItem("prompt_doumi_client_id", storedId);
        }
        setClientId(storedId);

        // Auto-fill nickname if previously used
        const storedName = localStorage.getItem("prompt_doumi_nickname");
        if (storedName) {
            setFormData(prev => ({ ...prev, author_name: storedName }));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !file || !formData.author_name) return alert("제목, 작성자 이름, 파일을 모두 입력해주세요.");

        setLoading(true);
        try {
            // Save nickname for next time
            localStorage.setItem("prompt_doumi_nickname", formData.author_name);

            // 1. Upload File
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(fileName);

            // 3. Insert Database Record
            const { error: dbError } = await supabase
                .from('gallery_posts')
                .insert({
                    title: formData.title,
                    content: formData.content,
                    author_name: formData.author_name, // Save nickname
                    client_id: clientId, // Save ownership
                    media_url: publicUrl,
                    media_type: file.type.startsWith('image') ? 'image' : 'file',
                });

            if (dbError) throw dbError;

            alert("등록되었습니다!");
            router.push("/gallery");
        } catch (error: any) {
            console.error(error);
            alert("업로드 중 오류가 발생했습니다: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 animate-in slide-in-from-bottom-4 duration-500">
            <Link href="/gallery" className="inline-flex items-center text-text-muted hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> 갤러리로 돌아가기
            </Link>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-primary/5">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">작품 올리기</h1>
                    <p className="text-text-muted mt-2">여러분의 멋진 프롬프트 결과물이나 자료를 공유해주세요.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
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
                                name="post_title_input"
                                autoComplete="off"
                                required
                                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                placeholder="작품의 제목을 적어주세요"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-bold text-gray-700">파일 첨부</label>
                        <div className={`relative border-2 border-dashed border-gray-200 rounded-xl p-8 text-center transition-all ${file ? 'bg-primary/5 border-primary/30' : 'hover:border-primary/50'}`}>
                            <input
                                type="file"
                                required
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                accept="image/*,video/*,.pdf"
                            />
                            <div className="flex flex-col items-center gap-2 text-text-muted pointer-events-none">
                                <Upload className={`w-8 h-8 ${file ? 'text-primary' : 'text-gray-400'}`} />
                                {file ? (
                                    <span className="font-bold text-primary">{file.name}</span>
                                ) : (
                                    <span>클릭하거나 파일을 여기로 드래그하세요</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-bold text-gray-700">설명 (선택)</label>
                        <textarea
                            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none min-h-[120px] resize-none transition-all"
                            placeholder="어떤 프롬프트를 사용하셨나요? 상세 내용을 적어주세요."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "등록하기"}
                    </button>
                </form>
            </div>
        </div>
    );
}
