import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Prompt Doumi
                    </span>
                </Link>

                {/* Navigation - Removed as per user request */}

                {/* CTA Button */}
                <Link
                    href="/gallery"
                    className="px-5 py-2.5 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0"
                >
                    갤러리
                </Link>
            </div>
        </header>
    );
}
