import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                <p className="text-text-muted text-sm mb-4">
                    © {new Date().getFullYear()} Prompt Doumi. Make AI easy for everyone.
                </p>
                <div className="flex justify-center gap-6 text-sm text-text-muted">
                    <a href="#" className="hover:text-primary transition-colors">이용약관</a>
                    <a href="#" className="hover:text-primary transition-colors">개인정보처리방침</a>
                    <a href="#" className="hover:text-primary transition-colors">문의하기</a>
                    <Link href="/admin" className="hover:text-primary transition-colors opacity-50 hover:opacity-100">관리자</Link>
                </div>
            </div>
        </footer>
    );
}
