import { TrendingUp, Award, Activity } from 'lucide-react';

interface ScoreCardProps {
  score: number;
  recentTransactions: number;
}

export default function ScoreCard({ score, recentTransactions }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 700) return 'Excellent';
    if (score >= 600) return 'Good';
    return 'Fair';
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Payment Score</h2>
        <Award className="w-6 h-6" />
      </div>
      
      <div className="flex items-end space-x-4 mb-4">
        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {score}
        </div>
        <div>
          <p className="text-sm opacity-90">{getScoreLabel(score)}</p>
          <p className="text-xs opacity-75">Based on transaction history</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4" />
          <span className="text-sm">Recent Transactions</span>
        </div>
        <span className="text-sm font-semibold">{recentTransactions}</span>
      </div>
    </div>
  );
}
