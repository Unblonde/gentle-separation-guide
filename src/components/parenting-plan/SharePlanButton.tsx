
import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SharePlanButtonProps {
  planId?: string;
}

const SharePlanButton: React.FC<SharePlanButtonProps> = ({ planId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    if (!email) return;
    
    setIsSharing(true);
    
    try {
      // Implement actual sharing logic here
      // This would typically involve sending an invitation to the provided email
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });
      
      setIsOpen(false);
      setEmail('');
    } catch (error) {
      toast({
        title: "Failed to send invitation",
        description: "There was an error sending the invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Share2 className="mr-2 h-4 w-4" />
        Share plan
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share parenting plan</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you want to share this plan with.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="co-parent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSharing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleShare}
              disabled={!email || isSharing}
            >
              {isSharing ? "Sending..." : "Send invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SharePlanButton;
