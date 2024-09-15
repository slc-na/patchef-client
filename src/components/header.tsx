import { Heart, SquareTerminal } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className='flex select-none items-center justify-between border-gray-200 border-b px-8 py-3 dark:border-gray-800'>
      <div className="flex items-center justify-center gap-x-2">
        <SquareTerminal className="size-6" />
        <h1 className='font-medium text-black text-xl dark:text-white'>
          patchef
        </h1>
      </div>
      <div className="flex items-center gap-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild={true}>
              <a
                href="https://www.instagram.com/jermyst"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <div className='flex items-center font-medium text-xs'>
                    Made with&nbsp;
                    <Heart className="size-3 fill-red-400 stroke-none" />
                    &nbsp;by MY
                  </div>
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Di follow dulu yuk!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
