import { TOPICS } from "@/data/topics";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">반갑습니다! 어떤 작업을 도와드릴까요?</h1>
        <p className="text-text-muted text-lg">원하시는 주제를 선택하면 맞춤형 가이드가 시작됩니다.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPICS.map((topic) => {
          const Icon = topic.icon;
          if (topic.disabled) {
            return (
              <div
                key={topic.id}
                className="group relative bg-surface p-8 rounded-3xl border border-gray-100 shadow-sm opacity-80 cursor-not-allowed overflow-hidden grayscale-[0.3]"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${topic.color} opacity-10 rounded-bl-full -mr-8 -mt-8`} />

                <div className={`inline-flex items-center justify-center p-4 rounded-2xl ${topic.color} bg-opacity-20 text-text-main mb-6`}>
                  <Icon className="w-8 h-8 opacity-80" />
                </div>

                <h3 className={`text-2xl font-bold mb-3 ${topic.activeColor}`}>
                  {topic.title}
                </h3>

                <p className="text-text-muted mb-8 min-h-[3rem]">
                  {topic.description}
                </p>

                <div className="flex items-center gap-2 font-bold text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full w-fit">
                  🚧 준비중입니다
                </div>
              </div>
            );
          }

          return (
            <Link
              key={topic.id}
              href={topic.path}
              className="group relative bg-surface p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${topic.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`} />

              <div className={`inline-flex items-center justify-center p-4 rounded-2xl ${topic.color} bg-opacity-20 text-text-main mb-6`}>
                <Icon className="w-8 h-8 opacity-80" />
              </div>


              <h3 className={`text-2xl font-bold mb-3 ${topic.activeColor} transition-colors`}>
                {topic.title}
              </h3>

              <p className="text-text-muted mb-8 min-h-[3rem]">
                {topic.description}
              </p>

              <div className="flex items-center gap-2 font-bold text-sm text-text-main group-hover:gap-4 transition-all">
                프롬프트 만들기 <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
