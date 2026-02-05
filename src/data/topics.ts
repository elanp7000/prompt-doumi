import { Image, PenTool, Code, Briefcase, Smile, Lightbulb } from "lucide-react";

export type Topic = {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string; // Tailwind color class for background
    activeColor: string; // Tailwind color class for text/hover (darker shade)
    path: string;
};

export const TOPICS: Topic[] = [
    {
        id: "image",
        title: "이미지 생성",
        description: "AI 그림 생성을 위한 완벽한 프롬프트",
        icon: Image,
        color: "bg-primary", // Pink
        activeColor: "group-hover:text-pink-500",
        path: "/builder?mode=image",
    },
    {
        id: "writing",
        title: "블로그/글쓰기",
        description: "SEO 블로그, 마케팅 문구, 이메일 작성 도우미",
        icon: PenTool,
        color: "bg-secondary", // Mint
        activeColor: "group-hover:text-emerald-600",
        path: "/builder?mode=writing",
    },
    {
        id: "custom",
        title: "자유 제작",
        description: "원하는 모든 주제에 대해 자유롭게 만들기",
        icon: Lightbulb,
        color: "bg-gray-400",
        activeColor: "group-hover:text-gray-700",
        path: "/builder?mode=custom",
    },
    {
        id: "business",
        title: "비즈니스",
        description: "사업 기획, 아이디어 브레인스토밍, 보고서 요약",
        icon: Briefcase,
        color: "bg-orange-300",
        activeColor: "group-hover:text-orange-600",
        path: "/builder?mode=business",
    },
    {
        id: "fun",
        title: "재미/일상",
        description: "오늘 뭐 먹지?, 여행 계획, 타로 점 보기",
        icon: Smile,
        color: "bg-purple-300",
        activeColor: "group-hover:text-purple-600",
        path: "/builder?mode=fun",
    },
    {
        id: "coding",
        title: "코딩/개발",
        description: "버그수정, 코드리뷰, 기능구현",
        icon: Code,
        color: "bg-accent", // Blue
        activeColor: "group-hover:text-indigo-600",
        path: "/builder?mode=coding",
    },
];
