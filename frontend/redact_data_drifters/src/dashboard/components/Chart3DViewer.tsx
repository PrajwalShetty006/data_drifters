import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Box } from 'lucide-react';

interface Chart3DViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Chart3DViewer({ isOpen, onClose }: Chart3DViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-blue-950/95 to-blue-900/90 border-blue-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Box className="h-6 w-6 text-blue-400" />
            3D Visualization
          </DialogTitle>
          <DialogDescription className="text-blue-200/70">
            Interactive 3D chart visualization with depth and perspective
          </DialogDescription>
        </DialogHeader>
        
        <div className="h-[500px] flex items-center justify-center">
          <p className="text-blue-200/70">3D model viewer coming soon...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
