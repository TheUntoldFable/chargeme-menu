import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center  p-24">
      <Popover>
        <PopoverTrigger>
          <Button variant="outline">Click here</Button>
        </PopoverTrigger>
        <PopoverContent className="border">WELCOME!</PopoverContent>
      </Popover>
    </main>
  );
}
