'use client';

import React, { useState } from 'react';
import { Button } from '@/components/map/ui/button';
import { Input } from '@/components/map/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/map/ui/dialog';
import { Key, Github, AlertCircle } from 'lucide-react';

interface GitHubTokenDialogProps {
  open: boolean;
  onClose: () => void;
  onTokenSubmit: (token: string) => void;
}

export function GitHubTokenDialog({ open, onClose, onTokenSubmit }: GitHubTokenDialogProps) {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!token.trim()) return;
    
    setIsSubmitting(true);
    try {
      onTokenSubmit(token.trim());
      setToken('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setToken('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Token Required
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>To save changes to the server, you need a GitHub Personal Access Token.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">How to get a token:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
                    <li>Generate new token (classic)</li>
                    <li>Select "repo" scope</li>
                    <li>Copy and paste the token here</li>
                  </ol>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium">
              Personal Access Token
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!token.trim() || isSubmitting}
          >
            {isSubmitting ? 'Connecting...' : 'Connect'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}