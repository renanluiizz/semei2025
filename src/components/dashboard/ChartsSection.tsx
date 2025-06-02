
import { EnhancedActivityChart } from './EnhancedActivityChart';

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Activity Chart */}
      <div className="lg:col-span-2">
        <EnhancedActivityChart />
      </div>
      
      {/* Additional charts can be added here */}
    </div>
  );
}
