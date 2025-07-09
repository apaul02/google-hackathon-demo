import Navbar from '@/components/navbar';
import { Policy } from '@/components/Policy';

export default function PolicyPage() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className='pt-20 flex-1'>
        <Policy />
      </div>
    </div>
  );
}
