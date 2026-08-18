import { Send } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { Facebook } from "lucide-react";
import { Phone } from "lucide-react";

/* ------------------ Floating Buttons ------------------ */
export const FloatingControls = () => (
  <div className="fixed right-4 bottom-24 z-40 flex flex-col gap-3">
    <button className="w-12 h-12 rounded-full bg-[#25d366] flex items-center justify-center">
      <Phone className="text-white" />
    </button>
    <button className="w-12 h-12 rounded-full bg-[#1877f2] flex items-center justify-center">
      <Facebook className="text-white" />
    </button>
    <button className="w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center">
      <Send className="text-white" />
    </button>
    <button className="w-12 h-12 rounded-full bg-[#ff5722] flex items-center justify-center">
      <ArrowUp className="text-white" />
    </button>
  </div>
);
