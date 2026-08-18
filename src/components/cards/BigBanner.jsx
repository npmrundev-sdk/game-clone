/* ------------------ Banner ------------------ */
export const BigBanner = () => {
  return (
    <div className="relative w-full aspect-[21/9] lg:aspect-[3/1] rounded-2xl overflow-hidden mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10 p-6 flex flex-col justify-center">
        <h2 className="text-2xl lg:text-4xl font-black text-[#fcc21b] italic">
          ৮২% লাকি ড্র বোনাস
        </h2>
        <p className="text-white font-bold text-lg">৫,০০০ টাকা পর্যন্ত</p>
      </div>

      <img
        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d"
        className="w-full h-full object-cover"
        alt="Banner"
      />
    </div>
  );
};
