import { motion } from 'motion/react';
import { Card } from './ui/card';
import { FileText, TrendingUp, Users, Gift, Target, Lightbulb } from 'lucide-react';
import { summaryStats, offersDataJSON, forecastDataJSON } from '../data/mockData';
import { useDashboard, formatCurrency } from '../context/DashboardContext';

export function SimpleSummary() {
  const { currency } = useDashboard();
  const avgDailySales = Math.round(summaryStats.avgForecast);
  const lastDaySales = Math.round(forecastDataJSON.forecast[forecastDataJSON.forecast.length - 1].prediction);
  const firstDaySales = Math.round(forecastDataJSON.forecast[0].prediction);
  const totalIncrease = lastDaySales - firstDaySales;
  const isGrowing = totalIncrease > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="my-6 sm:my-8"
    >
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/70 to-blue-900/40 backdrop-blur-sm">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 sm:p-3 rounded-lg bg-blue-500/20 border border-blue-400/30">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl text-white mb-1">📊 Summary - Explained Simply</h2>
              <p className="text-xs sm:text-sm text-blue-200/70">Understanding your business data like a story</p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* What's Happening Now */}
            <div className={`p-4 sm:p-5 rounded-lg bg-gradient-to-r ${isGrowing ? 'from-green-500/10' : 'from-yellow-500/10'} to-transparent border ${isGrowing ? 'border-green-400/20' : 'border-yellow-400/20'}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg ${isGrowing ? 'bg-green-500/20 border-green-400/30' : 'bg-yellow-500/20 border-yellow-400/30'} border flex-shrink-0`}>
                  <TrendingUp className={`h-4 w-4 sm:h-5 sm:w-5 ${isGrowing ? 'text-green-400' : 'text-yellow-400'}`} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg text-white mb-2">
                    📈 What's Happening with Sales?
                  </h3>
                  <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                    {isGrowing ? (
                      <>
                        Great news! Your business is <span className="text-green-400 font-semibold">growing</span>. 
                        Think of it like a plant that's getting taller every day. Your sales started at about 
                        <span className="text-white font-semibold"> {formatCurrency(firstDaySales, currency)} per day</span> and 
                        now they're at <span className="text-white font-semibold">{formatCurrency(lastDaySales, currency)} per day</span> - 
                        that's <span className="text-green-400 font-semibold">{formatCurrency(Math.abs(totalIncrease), currency)} more</span>! 
                        On average, you're making about <span className="text-white font-semibold">{formatCurrency(avgDailySales, currency)} every day</span>.
                      </>
                    ) : (
                      <>
                        Your sales are staying steady. Your business is making about 
                        <span className="text-white font-semibold"> {formatCurrency(avgDailySales, currency)} per day</span>. 
                        While sales have slightly adjusted from <span className="text-white font-semibold">{formatCurrency(firstDaySales, currency)}</span> to 
                        <span className="text-white font-semibold"> {formatCurrency(lastDaySales, currency)}</span>, 
                        your business remains stable with consistent daily performance.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Who Are Your Customers */}
            <div className="p-4 sm:p-5 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-400/20">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 flex-shrink-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg text-white mb-2">👥 Who Are Your Customers?</h3>
                  <p className="text-sm sm:text-base text-blue-100 leading-relaxed mb-3">
                    Imagine your customers are like different groups of friends. We've sorted them into 4 important groups:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
                      <p className="text-white font-semibold mb-1">🌟 VIP Customers (450 people)</p>
                      <p className="text-xs sm:text-sm text-blue-200/70">
                        These are your best friends! They buy a lot and spend big money ({formatCurrency(1000, currency)} each time!)
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
                      <p className="text-white font-semibold mb-1">💙 Frequent Buyers (1,200 people)</p>
                      <p className="text-xs sm:text-sm text-blue-200/70">
                        They come back often and really like your store. They spend about {formatCurrency(300, currency)} each visit.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-400/20">
                      <p className="text-white font-semibold mb-1">⚠️ At Risk Customers (800 people)</p>
                      <p className="text-xs sm:text-sm text-blue-200/70">They haven't visited in a while. We need to remind them we miss them!</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-400/20">
                      <p className="text-white font-semibold mb-1">👋 New/Low Value (600 people)</p>
                      <p className="text-xs sm:text-sm text-blue-200/70">Just starting out! Let's make them feel welcome so they become regular customers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Offers */}
            <div className="p-4 sm:p-5 rounded-lg bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-400/20">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/30 flex-shrink-0">
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg text-white mb-2">🎁 Smart Gift Ideas for Customers</h3>
                  <p className="text-sm sm:text-base text-blue-100 leading-relaxed mb-3">
                    Just like giving your best friend a special birthday gift, we should give our customers special treats:
                  </p>
                  <ul className="space-y-2 text-sm sm:text-base text-blue-100">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 flex-shrink-0">✨</span>
                      <span>
                        <span className="text-white font-semibold">VIP Customers:</span> {offersDataJSON.offers["VIP Customer"]}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 flex-shrink-0">🎯</span>
                      <span>
                        <span className="text-white font-semibold">Frequent Buyers:</span> {offersDataJSON.offers["Frequent Buyer"]}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 flex-shrink-0">💝</span>
                      <span>
                        <span className="text-white font-semibold">At Risk Customers:</span> {offersDataJSON.offers["At Risk Customer"]}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 flex-shrink-0">🎈</span>
                      <span>
                        <span className="text-white font-semibold">New Customers:</span> {offersDataJSON.offers["New/Low Value Customer"]}
                      </span>
                    </li>
                  </ul>
                  
                  <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-transparent border border-yellow-400/30">
                    <p className="text-sm text-white">
                      ⭐ <span className="font-semibold">Best Offer Recommendation:</span> {offersDataJSON.best_offer}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What Should You Do */}
            <div className="p-4 sm:p-5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-400/20">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex-shrink-0">
                  <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg text-white mb-2">💡 What Should You Do Next?</h3>
                  <div className="space-y-2 text-sm sm:text-base text-blue-100">
                    <p className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">1.</span>
                      <span><span className="font-semibold text-white">Make VIP customers extra happy</span> - They bring you the most money ({formatCurrency(450000, currency)} total)!</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">2.</span>
                      <span><span className="font-semibold text-white">Win back the 800 at-risk customers</span> - Give them the 15% discount to bring them back.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">3.</span>
                      <span><span className="font-semibold text-white">Keep your frequent buyers happy</span> - They're 1,200 loyal customers who love coming back.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">4.</span>
                      <span><span className="font-semibold text-white">Welcome new customers warmly</span> - Turn them into frequent buyers with great service!</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Bottom Line */}
            <div className="p-4 sm:p-5 rounded-lg bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-400/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-400/30 flex-shrink-0">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg text-white mb-2">🎯 The Bottom Line (Simple Version)</h3>
                  <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                    Your business is making about <span className="text-white font-semibold">{formatCurrency(avgDailySales, currency)} every day</span> and 
                    {isGrowing ? (
                      <span className="text-green-400 font-semibold"> growing steadily</span>
                    ) : (
                      <span> staying <span className="text-white font-semibold">stable</span></span>
                    )}! 
                    You have <span className="text-white font-semibold">{summaryStats.totalCustomers.toLocaleString()} customers</span>, and 
                    <span className="text-white font-semibold"> 450 of them are super important VIP customers</span> who spend the most. 
                    Focus on keeping everyone happy, especially your best customers, and try to win back 
                    the 800 at-risk customers with the special 15% discount offer. If you do this well, you could earn even more money! 🚀
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
