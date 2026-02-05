"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminPage() {
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === "admin1234") {
            localStorage.setItem("prompt_doumi_admin", "true");
            alert("관리자로 로그인되었습니다.");
            router.push("/gallery");
        } else {
            alert("비밀번호가 틀렸습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-500">
            <div className="p-4 bg-gray-100 rounded-full">
                <Lock className="w-8 h-8 text-gray-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="password"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoFocus
                />
                <button
                    type="submit"
                    className="p-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                    확인
                </button>
            </form>
        </div>
    );
}
