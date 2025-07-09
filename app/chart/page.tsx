import { Chart } from '@/components/Chart';
import Navbar from '@/components/navbar';

export default function ChartPage() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      
      <div className='pt-20 flex-1'>
        <Chart />
      </div>
    </div>
  );
}
