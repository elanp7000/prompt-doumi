"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, RefreshCw, Check } from "lucide-react";
import { TOPICS } from "@/data/topics";

// Mock Data for Dropdowns (Will be expanded later)
const OPTIONS = {
    image: [
        {
            label: "화풍/스타일",
            items: [
                { name: "Photo-realistic (실사 이미지)", value: "Photo-realistic" },
                { name: "Digital Art (디지털 아트)", value: "Digital Art" },
                { name: "Oil Painting (유화)", value: "Oil Painting" },
                { name: "Anime (애니메이션)", value: "Anime" },
                { name: "3D Render (3D 렌더링)", value: "3D Render" },
                { name: "Watercolor (수채화)", value: "Watercolor" }
            ]
        },
        {
            label: "조명",
            items: [
                { name: "Natural Light (자연광)", value: "Natural Light" },
                { name: "Cinematic Lighting (영화 같은 조명)", value: "Cinematic Lighting" },
                { name: "Golden Hour (골든 아워)", value: "Golden Hour" },
                { name: "Studio Lighting (스튜디오 조명)", value: "Studio Lighting" },
                { name: "Neon Lights (네온 조명)", value: "Neon Lights" }
            ]
        },
        {
            label: "카메라 앵글",
            items: [
                { name: "Wide Angle (광각)", value: "Wide Angle" },
                { name: "Close-up (클로즈업)", value: "Close-up" },
                { name: "Bird's Eye View (조감도)", value: "Bird's Eye View" },
                { name: "Low Angle (로우 앵글)", value: "Low Angle" },
                { name: "Macro (접사)", value: "Macro" }
            ]
        },
        {
            label: "비율",
            items: [
                { name: "--ar 16:9 (와이드)", value: "--ar 16:9 (와이드)" },
                { name: "--ar 4:3 (일반 TV)", value: "--ar 4:3 (일반 TV)" },
                { name: "--ar 1:1 (정사각형)", value: "--ar 1:1 (정사각형)" },
                { name: "--ar 9:16 (세로형/릴스)", value: "--ar 9:16 (세로형/릴스)" }
            ]
        },
    ],
    writing: [
        { label: "톤앤매너", items: ["전문적인", "친근한", "유머러스한", "감성적인", "설득력 있는"] },
        { label: "형식", items: ["블로그 포스트", "이메일", "소셜 미디어 캡션", "보고서 요약", "기사"] },
        { label: "길이", items: ["짧게 (100자 이내)", "중간 (300자 내외)", "길게 (1000자 이상)"] },
    ],
    coding: [
        { label: "언어", items: ["Python", "JavaScript", "TypeScript", "React", "SQL", "Java"] },
        { label: "목적", items: ["기능 구현", "버그 수정", "코드 리팩토링", "주석 작성", "테스트 코드 작성"] },
    ],
    // Add defaults for others
    default: [
        { label: "스타일", items: ["간결하게", "자세하게", "창의적으로"] },
    ]
};

function BuilderContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode") || "custom";
    const topic = TOPICS.find(t => t.id === mode) || TOPICS[TOPICS.length - 1];

    const [basePrompt, setBasePrompt] = useState("");
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [copied, setCopied] = useState(false);

    // Get options for current mode
    const currentOptions = OPTIONS[mode as keyof typeof OPTIONS] || OPTIONS.default;

    useEffect(() => {
        // Generate prompt whenever inputs change
        const parts = [basePrompt];
        Object.entries(selections).forEach(([key, value]) => {
            if (value) parts.push(`${value}`);
        });
        setGeneratedPrompt(parts.filter(Boolean).join(", "));
    }, [basePrompt, selections]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Helper to get a darker shade for the icon based on the topic color
    const getIconColor = (bgClass: string) => {
        if (bgClass.includes("primary")) return "text-pink-500";
        if (bgClass.includes("secondary")) return "text-emerald-500";
        if (bgClass.includes("accent")) return "text-indigo-500"; // Darker blue for coding
        if (bgClass.includes("orange")) return "text-orange-500";
        if (bgClass.includes("purple")) return "text-purple-500";
        if (bgClass.includes("gray")) return "text-gray-600";
        return "text-gray-700";
    };

    const activeBg = topic.color;
    const iconColor = getIconColor(topic.color);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className={`inline-flex p-3 rounded-2xl ${activeBg} bg-opacity-20 mb-4`}>
                    <topic.icon className={`w-8 h-8 ${iconColor}`} />
                </div>
                <h1 className="text-3xl font-bold">{topic.title} 프롬프트 만들기</h1>
                <p className="text-text-muted">{topic.description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: Inputs */}
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <label className="font-bold text-gray-700">핵심 내용 입력</label>
                        <textarea
                            value={basePrompt}
                            onChange={(e) => setBasePrompt(e.target.value)}
                            placeholder="무엇을 만들고 싶으신가요? (예: 푸른 들판 위를 달리는 강아지)"
                            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none min-h-[120px] resize-none shadow-sm transition-all"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {currentOptions.map((opt) => (
                            <div key={opt.label} className="space-y-2">
                                <label className="font-bold text-gray-700 text-sm">{opt.label}</label>
                                <select
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none bg-white cursor-pointer hover:border-primary/50 transition-all"
                                    onChange={(e) => setSelections(prev => ({ ...prev, [opt.label]: e.target.value }))}
                                    value={selections[opt.label] || ""}
                                >
                                    <option value="">선택 안함</option>
                                    {opt.items.map((item: any) => {
                                        const label = typeof item === 'string' ? item : item.name;
                                        const value = typeof item === 'string' ? item : item.value;
                                        return <option key={value} value={value}>{label}</option>;
                                    })}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Preview & Action */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <div className={`p-6 rounded-2xl ${topic.color} bg-opacity-10 border border-gray-100 shadow-sm space-y-4`}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800">최종 프롬프트</h3>
                                <button
                                    onClick={() => { setBasePrompt(""); setSelections({}); }}
                                    className="text-xs text-text-muted hover:text-red-500 flex items-center gap-1"
                                >
                                    <RefreshCw className="w-3 h-3" /> 초기화
                                </button>
                            </div>

                            <div className="bg-white p-4 rounded-xl min-h-[160px] text-gray-700 leading-relaxed break-words shadow-inner">
                                {generatedPrompt || <span className="text-gray-400 italic">왼쪽에서 내용을 입력하면 여기에 자동으로 완성됩니다...</span>}
                            </div>

                            <button
                                onClick={handleCopy}
                                disabled={!generatedPrompt}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all ${!generatedPrompt
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : copied
                                        ? "bg-green-500 text-white"
                                        : "bg-primary text-white hover:bg-opacity-90 hover:-translate-y-0.5"
                                    }`}
                            >
                                {copied ? <><Check className="w-5 h-5" /> 복사 완료!</> : <><Copy className="w-5 h-5" /> 프롬프트 복사</>}
                            </button>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-sm text-text-muted">
                            💡 <strong>Tip:</strong> 선택한 옵션 조합에 따라 프롬프트 퀄리티가 달라집니다. 여러 가지 시도를 해보세요!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BuilderPage() {
    return (
        <Suspense fallback={<div className="text-center py-20">로딩 중...</div>}>
            <BuilderContent />
        </Suspense>
    );
}
