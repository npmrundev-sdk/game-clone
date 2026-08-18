import { PageContainer } from "@/components/shared/PageContainer";

export default function page() {
  return (
    <PageContainer title="প্রিয় আইটেমস">
      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80">
        {/* Placeholder for the Clipboard Image from your screenshot */}
        <div className="relative mb-4">
          <div className="w-24 h-24 bg-slate-400/20 rounded-lg flex items-center justify-center">
            <div className="w-12 h-16 bg-white/20 rounded-md rotate-3 shadow-xl"></div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-400 blur-md"></div>
        </div>

        <p className="text-white font-medium text-sm">কোন ডেটা নেই</p>
      </div>
    </PageContainer>
  );
}
