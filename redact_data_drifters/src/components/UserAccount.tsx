import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogOut, Settings, CreditCard, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface UserAccountProps {
  className?: string;
}

export function UserAccount({ className = '' }: UserAccountProps) {
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [user] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@chainforecast.ai',
    role: 'Sales Manager',
    company: 'ChainForecast Analytics',
    avatar: '',
    initials: 'AJ'
  });

  const handleLogout = () => {
    // In a real app, this would clear auth tokens and redirect to login
    console.log('Logging out...');
    alert('Logout functionality - In production, this would clear your session and redirect to login.');
  };

  const handleAccountSettings = () => {
    setShowAccountDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30 gap-2 ${className}`}
            size="sm"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">{user.name}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-slate-900/95 border-blue-400/30 text-blue-100 backdrop-blur-sm"
        >
          <DropdownMenuLabel className="text-blue-300">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-blue-400/70">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-blue-400/20" />
          
          <DropdownMenuItem 
            onClick={handleAccountSettings}
            className="cursor-pointer hover:bg-blue-500/20 focus:bg-blue-500/20 text-blue-200"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleAccountSettings}
            className="cursor-pointer hover:bg-blue-500/20 focus:bg-blue-500/20 text-blue-200"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-blue-500/20 focus:bg-blue-500/20 text-blue-200"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-blue-500/20 focus:bg-blue-500/20 text-blue-200"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-blue-400/20" />
          
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer hover:bg-red-500/20 focus:bg-red-500/20 text-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Account Details Dialog */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent className="bg-slate-900/95 border-blue-400/30 text-blue-100 backdrop-blur-sm max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-300">Account Details</DialogTitle>
            <DialogDescription className="text-blue-400/70">
              View and manage your account information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium text-blue-100">{user.name}</h3>
                <p className="text-sm text-blue-400/70">{user.role}</p>
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-3 border-t border-blue-400/20 pt-4">
              <div>
                <label className="text-xs text-blue-400/70 uppercase tracking-wide">Email</label>
                <p className="text-sm text-blue-200 mt-1">{user.email}</p>
              </div>
              
              <div>
                <label className="text-xs text-blue-400/70 uppercase tracking-wide">Company</label>
                <p className="text-sm text-blue-200 mt-1">{user.company}</p>
              </div>
              
              <div>
                <label className="text-xs text-blue-400/70 uppercase tracking-wide">Role</label>
                <p className="text-sm text-blue-200 mt-1">{user.role}</p>
              </div>

              <div>
                <label className="text-xs text-blue-400/70 uppercase tracking-wide">Account Status</label>
                <div className="flex items-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm text-green-400">Active</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 border-t border-blue-400/20 pt-4">
              <Button
                variant="outline"
                className="flex-1 bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex-1 bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
