const categories = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Telegram', 'Twitter (X)', 'Spotify', 'Other'];

export const TopCategories = () => {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 h-full transition-all duration-300 hover:border-gold/20">
      <h3 className="text-lg font-semibold text-white mb-4">Top Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className="px-3 py-1.5 bg-dark-bg border border-dark-border rounded-full text-sm text-gray-300 hover:border-gold/50 transition-all duration-200 hover:scale-105 hover:text-white cursor-pointer"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
};
