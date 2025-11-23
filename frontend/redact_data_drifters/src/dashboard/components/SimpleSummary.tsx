import { motion } from 'motion/react';
import { Card } from './ui/card';
import { FileText, TrendingUp, Users, Gift, Target, Lightbulb } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useDashboard, formatCurrency } from '../context/DashboardContext';

export function SimpleSummary() {
  const { currency } = useDashboard();
  const { metrics, forecastData, transformedSegments, transformedOffers } = useData();
  
  const avgDailySales = Math.round(metrics.avgDailySales || 0);
  const forecast = forecastData?.forecast || [];
  const lastDaySales = forecast.length > 0 ? Math.round(forecast[forecast.length - 1].prediction || 0) : 0;
  const firstDaySales = forecast.length > 0 ? Math.round(forecast[0].prediction || 0) : 0;
  const totalIncrease = lastDaySales - firstDaySales;
  const isGrowing = totalIncrease > 0;
  
  // Get segment data
  const vipSegment = transformedSegments.find(s => s.segment === 'VIP Customer');
  const frequentSegment = transformedSegments.find(s => s.segment === 'Frequent Buyer');
  const atRiskSegment = transformedSegments.find(s => s.segment === 'At Risk Customer');
  const newSegment = transformedSegments.find(s => s.segment === 'New/Low Value Customer');
  
  // Get offers data
  const vipOffer = transformedOffers.find(o => o.segment === 'VIP Customer');
  const frequentOffer = transformedOffers.find(o => o.segment === 'Frequent Buyer');
  const atRiskOffer = transformedOffers.find(o => o.segment === 'At Risk Customer');
  const newOffer = transformedOffers.find(o => o.segment === 'New/Low Value Customer');
  const bestOffer = transformedOffers.find(o => o.isBestOffer);
  
  const totalCustomers = transformedSegments.reduce((sum, s) => sum + (s.count || 0), 0);

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
                    {vipSegment && (
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
                        <p className="text-white font-semibold mb-1">🌟 VIP Customers ({vipSegment.count} people)</p>
                        <p className="text-xs sm:text-sm text-blue-200/70">
                          These are your best friends! They buy a lot and spend big money {vipSegment.avgOrderValue > 0 ? `(${formatCurrency(vipSegment.avgOrderValue, currency)} each time!)` : 'with high-value purchases!'}
                        </p>
                      </div>
                    )}
                    {frequentSegment && (
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
                        <p className="text-white font-semibold mb-1">💙 Frequent Buyers ({frequentSegment.count} people)</p>
                        <p className="text-xs sm:text-sm text-blue-200/70">
                          They come back often and really like your store. {frequentSegment.avgOrderValue > 0 ? `They spend about ${formatCurrency(frequentSegment.avgOrderValue, currency)} each visit.` : 'They are loyal repeat customers.'}
                        </p>
                      </div>
                    )}
                    {atRiskSegment && (
                      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-400/20">
                        <p className="text-white font-semibold mb-1">⚠️ At Risk Customers ({atRiskSegment.count} people)</p>
                        <p className="text-xs sm:text-sm text-blue-200/70">They haven't visited in a while. We need to remind them we miss them!</p>
                      </div>
                    )}
                    {newSegment && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-400/20">
                        <p className="text-white font-semibold mb-1">👋 New/Low Value ({newSegment.count} people)</p>
                        <p className="text-xs sm:text-sm text-blue-200/70">Just starting out! Let's make them feel welcome so they become regular customers.</p>
                      </div>
                    )}
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
                    {vipOffer && (
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 flex-shrink-0">✨</span>
                        <span>
                          <span className="text-white font-semibold">VIP Customers:</span> {vipOffer.offer}
                        </span>
                      </li>
                    )}
                    {frequentOffer && (
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 flex-shrink-0">🎯</span>
                        <span>
                          <span className="text-white font-semibold">Frequent Buyers:</span> {frequentOffer.offer}
                        </span>
                      </li>
                    )}
                    {atRiskOffer && (
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 flex-shrink-0">💝</span>
                        <span>
                          <span className="text-white font-semibold">At Risk Customers:</span> {atRiskOffer.offer}
                        </span>
                      </li>
                    )}
                    {newOffer && (
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 flex-shrink-0">🎈</span>
                        <span>
                          <span className="text-white font-semibold">New Customers:</span> {newOffer.offer}
                        </span>
                      </li>
                    )}
                  </ul>
                  
                  {bestOffer && (
                    <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-transparent border border-yellow-400/30">
                      <p className="text-sm text-white">
                        ⭐ <span className="font-semibold">Best Offer Recommendation:</span> {bestOffer.offer}
                      </p>
                    </div>
                  )}
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
                    {vipSegment && (
                      <p className="flex items-start gap-2">
                        <span className="text-cyan-400 flex-shrink-0">1.</span>
                        <span><span className="font-semibold text-white">Make VIP customers extra happy</span> - They bring you the most money ({formatCurrency(vipSegment.revenue || 0, currency)} total)!</span>
                      </p>
                    )}
                    {atRiskSegment && (
                      <p className="flex items-start gap-2">
                        <span className="text-cyan-400 flex-shrink-0">2.</span>
                        <span><span className="font-semibold text-white">Win back the {atRiskSegment.count} at-risk customers</span> - Give them the discount to bring them back.</span>
                      </p>
                    )}
                    {frequentSegment && (
                      <p className="flex items-start gap-2">
                        <span className="text-cyan-400 flex-shrink-0">3.</span>
                        <span><span className="font-semibold text-white">Keep your frequent buyers happy</span> - They're {frequentSegment.count} loyal customers who love coming back.</span>
                      </p>
                    )}
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
                    You have <span className="text-white font-semibold">{totalCustomers.toLocaleString()} customers</span>, and 
                    {vipSegment && (
                      <span className="text-white font-semibold"> {vipSegment.count} of them are super important VIP customers</span>
                    )} who spend the most. 
                    Focus on keeping everyone happy, especially your best customers, and try to win back 
                    {atRiskSegment && (
                      <span> the {atRiskSegment.count} at-risk customers</span>
                    )} with the special discount offer. If you do this well, you could earn even more money! 🚀
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
