const news = [
  { title: 'New Payment Method Added!', content: 'You can now fund your wallet using OPay. Enjoy faster and more secure payments.' },
  { title: 'Referral Program', content: 'Refer friends and earn 10% of what they spend on the platform.' },
];

export const NewsUpdates = () => {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 h-full transition-all duration-300 hover:border-gold/20">
      <h3 className="text-lg font-semibold text-white mb-4">News & Updates</h3>
      <div className="space-y-4">
        {news.map((item, idx) => (
          <div key={idx} className="border-b border-dark-border pb-3 last:border-0 hover:bg-dark-bg/30 p-2 rounded-lg transition-all">
            <h4 className="text-white font-medium">{item.title}</h4>
            <p className="text-gray-400 text-sm mt-1">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
