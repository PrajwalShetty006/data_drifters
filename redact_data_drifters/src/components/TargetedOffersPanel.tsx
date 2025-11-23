import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { targetedOffers } from '../data/mockData';
import { useDashboard, formatCurrency } from '../context/DashboardContext';
import { useFilters } from '../context/FilterContext';
import { useMemo } from 'react';
import { Gift, TrendingUp, Star } from 'lucide-react';

interface TargetedOffersPanelProps {
  onExpand: () => void;
}

export function TargetedOffersPanel({ onExpand }: TargetedOffersPanelProps) {
  const { currency } = useDashboard();
  const { filters, applyFilters } = useFilters();
  
  // Apply filters to targeted offers
  const filteredOffers = useMemo(() => {
    if (!filters.metrics.offers) return [];
    return applyFilters(targetedOffers, 'segment');
  }, [filters, applyFilters]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/70 to-blue-900/40 backdrop-blur-sm h-full">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl text-white mb-1">Targeted Offers & Recommendations</h2>
                <p className="text-xs sm:text-sm text-blue-200/70">AI-Generated Marketing Strategies</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExpand}
              className="px-3 sm:px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition-all text-sm"
            >
              View All
            </motion.button>
          </div>

          {filteredOffers.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-blue-300">
              <p>Targeted offers are hidden by filters</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredOffers.map((offer, index) => (
              <motion.div
                key={offer.segment}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 sm:p-4 rounded-lg bg-gradient-to-r ${
                  offer.isBestOffer 
                    ? 'from-yellow-500/20 to-transparent border-yellow-400/40' 
                    : 'from-blue-500/10 to-transparent border-blue-400/20'
                } border hover:border-blue-400/40 transition-all relative`}
              >
                {offer.isBestOffer && (
                  <div className="absolute top-2 right-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-2 sm:mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-white font-semibold">{offer.segment}</h3>
                      <Badge 
                        variant={offer.priority === 'High' ? 'destructive' : 'secondary'}
                        className={`${
                          offer.priority === 'High' 
                            ? 'bg-red-500/20 text-red-300 border-red-400/30' 
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                        } text-xs`}
                      >
                        {offer.priority} Priority
                      </Badge>
                      {offer.isBestOffer && (
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs">
                          Best Offer ⭐
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-blue-100">{offer.offer}</p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="flex items-center gap-1 text-green-400 mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">Est. Revenue</span>
                    </div>
                    <p className="text-lg sm:text-xl text-white font-semibold">
                      {formatCurrency(offer.estimatedRevenue, currency)}
                    </p>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          )}
          
          {filteredOffers.length > 0 && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent border border-green-400/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/20 border border-green-400/30 flex-shrink-0">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">Total Potential Revenue</h4>
                  <p className="text-xl sm:text-2xl text-green-400 font-bold">
                    {formatCurrency(filteredOffers.reduce((sum, o) => sum + o.estimatedRevenue, 0), currency)}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-200/70 mt-1">
                    Estimated additional revenue from implementing all targeted offers
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
