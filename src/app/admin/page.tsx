"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Lock, User, Key, LogOut } from "lucide-react";

export default function AdminPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"login" | "register">("login");
    const [user, setUser] = useState<any>(null);
    const [newPassword, setNewPassword] = useState("");

    const router = useRouter();

    useEffect(() => {
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                // Determine navigation if needed, keeping simple standard flow
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Login successful, auto-redirect or just show state
                router.push("/gallery");
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert("회원가입 확인 메일을 확인해주세요! (또는 자동 로그인 설정을 확인하세요)");
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        alert("로그아웃되었습니다.");
        router.push("/");
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            alert("비밀번호가 변경되었습니다.");
            setNewPassword("");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-500">
                <div className="p-4 bg-primary/10 rounded-full">
                    <User className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">관리자 설정</h1>
                <p className="text-gray-500">현재 로그인 계정: {user.email}</p>

                <div className="w-full max-w-sm space-y-6">
                    {/* Password Change Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Key className="w-4 h-4" /> 비밀번호 변경
                        </h3>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <input
                                type="password"
                                placeholder="새로운 비밀번호"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                minLength={6}
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full p-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {loading ? "변경 중..." : "비밀번호 변경"}
                            </button>
                        </form>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full p-3 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium border border-red-100"
                    >
                        <LogOut className="w-4 h-4" /> 로그아웃
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-500">
            <div className="p-4 bg-gray-100 rounded-full">
                <Lock className="w-8 h-8 text-gray-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
                {mode === "login" ? "관리자 로그인" : "관리자 등록"}
            </h1>

            <form onSubmit={handleAuth} className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoFocus
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    minLength={6}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="p-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {loading ? "처리 중..." : (mode === "login" ? "로그인" : "등록하기")}
                </button>
            </form>

            <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-sm text-gray-500 hover:text-primary underline"
            >
                {mode === "login" ? "새 관리자 계정 만들기" : "이미 계정이 있으신가요? 로그인"}
            </button>
        </div>
    );
}
