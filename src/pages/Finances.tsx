import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GOVUKLayout from '../components/GOVUKLayout';
import { Check, X, AlertCircle, Info, Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { getFamilyForUser, getFinancialArrangements, addFinancialArrangement, updateFinancialArrangement, subscribeToFinancialArrangements } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface FinancialItem {
  id: string;
  category: string;
  description: string;
  parent_a: string;
  parent_b: string;
  status: 'agreed' | 'disagreed' | 'unreviewed';
  family_id: string;
  created_by: string;
}

const Finances = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [financialItems, setFinancialItems] = useState<FinancialItem[]>([]);
  const [family, setFamily] = useState<{family_id: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<FinancialItem | null>(null);
  const [newItem, setNewItem] = useState({
    category: '',
    description: '',
    parent_a: '',
    parent_b: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    const loadData = async () => {
      if (user) {
        try {
          // Load family data
          const familyData = await getFamilyForUser(user.id);
          setFamily(familyData as {family_id: string} | null);
          
          if (familyData && 'family_id' in familyData) {
            // Load financial arrangements
            const arrangements = await getFinancialArrangements(familyData.family_id);
            setFinancialItems(arrangements);
            
            // Subscribe to changes
            const subscription = subscribeToFinancialArrangements(familyData.family_id, async (payload) => {
              // Reload data when changes occur
              const updatedArrangements = await getFinancialArrangements(familyData.family_id);
              setFinancialItems(updatedArrangements);
            });
            
            return () => {
              subscription.unsubscribe();
            };
          }
        } catch (error: any) {
          console.error('Error loading data:', error);
          toast({
            title: "Error loading arrangements",
            description: error.message,
            variant: "destructive",
          });
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [user, loading, navigate, toast]);

  const agreementSummary = {
    agreed: financialItems.filter(item => item.status === 'agreed').length,
    disagreed: financialItems.filter(item => item.status === 'disagreed').length,
    unreviewed: financialItems.filter(item => item.status === 'unreviewed').length,
    total: financialItems.length
  };

  const percentageAgreed = financialItems.length > 0 
    ? Math.round((agreementSummary.agreed / agreementSummary.total) * 100)
    : 0;

  const handleAddItem = async () => {
    if (!user || !family) return;
    
    try {
      const newFinancialItem = {
        ...newItem,
        family_id: family.family_id,
        created_by: user.id,
        status: 'unreviewed'
      };
      
      await addFinancialArrangement(newFinancialItem);
      
      toast({
        title: "Item added",
        description: "Financial arrangement has been added successfully.",
      });
      
      // Reset form
      setNewItem({
        category: '',
        description: '',
        parent_a: '',
        parent_b: '',
      });
      
      // Close dialog
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error adding item:', error);
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateView = async (item: FinancialItem, view: string) => {
    if (!user || !family) return;
    
    try {
      const isParentA = family.family_members?.some((member: any) => 
        member.user_id === user.id && member.role === 'Parent A'
      );
      
      const updates = isParentA 
        ? { parent_a: view }
        : { parent_b: view };
      
      await updateFinancialArrangement(item.id, updates);
      
      toast({
        title: "View updated",
        description: "Your view on this item has been updated.",
      });
    } catch (error: any) {
      console.error('Error updating view:', error);
      toast({
        title: "Error updating view",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (item: FinancialItem, status: 'agreed' | 'disagreed' | 'unreviewed') => {
    if (!user || !family) return;
    
    try {
      await updateFinancialArrangement(item.id, { status });
      
      toast({
        title: "Status updated",
        description: `Item marked as ${status}.`,
      });
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (item: FinancialItem) => {
    setEditItem(item);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;
    
    try {
      await updateFinancialArrangement(editItem.id, {
        category: editItem.category,
        description: editItem.description,
        parent_a: editItem.parent_a,
        parent_b: editItem.parent_b
      });
      
      toast({
        title: "Item updated",
        description: "Financial arrangement has been updated successfully.",
      });
      
      // Reset form
      setEditItem(null);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating item:', error);
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <GOVUKLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-govuk-blue"></div>
        </div>
      </GOVUKLayout>
    );
  }

  if (!family) {
    return (
      <GOVUKLayout>
        <div className="max-w-3xl">
          <h1>Financial Arrangements</h1>
          <p className="text-xl mb-6">
            Compare financial arrangements and find common ground.
          </p>
          
          <div className="bg-govuk-light-blue p-6 border-l-4 border-govuk-blue">
            <h2 className="text-xl font-bold mb-4">Create a family unit first</h2>
            <p className="mb-4">
              You need to create a family unit before you can manage financial arrangements.
            </p>
            <Button onClick={() => navigate('/profile')}>
              Set up your profile
            </Button>
          </div>
        </div>
      </GOVUKLayout>
    );
  }
  
  return (
    <GOVUKLayout>
      <div className="grid gap-8">
        <div>
          <div className="flex items-center justify-between">
            <h1>Financial Arrangements</h1>
            <button className="govuk-button">
              Share arrangements
            </button>
          </div>
          <p className="text-xl mb-6">
            Compare financial arrangements and find common ground.
          </p>
        </div>

        <div className="bg-govuk-light-blue p-6 border-l-4 border-govuk-blue">
          <h2 className="text-xl font-bold mb-4">Financial arrangements summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 border border-gray-300">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Items in agreement</p>
                <p className="text-4xl font-bold text-govuk-green">{agreementSummary.agreed}</p>
                <p className="text-sm text-gray-600">of {agreementSummary.total} items</p>
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-300">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Items in disagreement</p>
                <p className="text-4xl font-bold text-govuk-red">{agreementSummary.disagreed}</p>
                <p className="text-sm text-gray-600">of {agreementSummary.total} items</p>
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-300">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Items to review</p>
                <p className="text-4xl font-bold text-govuk-blue">{agreementSummary.unreviewed}</p>
                <p className="text-sm text-gray-600">of {agreementSummary.total} items</p>
              </div>
            </div>
          </div>
          <p>You're currently in agreement on <strong>{percentageAgreed}%</strong> of financial items.</p>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6 bg-gray-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">All items</TabsTrigger>
            <TabsTrigger value="agreed" className="data-[state=active]:bg-white">Agreed</TabsTrigger>
            <TabsTrigger value="disagreed" className="data-[state=active]:bg-white">Disagreed</TabsTrigger>
            <TabsTrigger value="unreviewed" className="data-[state=active]:bg-white">To review</TabsTrigger>
          </TabsList>
          
          {(['all', 'agreed', 'disagreed', 'unreviewed'] as const).map(tab => (
            <TabsContent key={tab} value={tab}>
              <div className="bg-white border border-gray-300">
                {financialItems
                  .filter(item => tab === 'all' || item.status === tab)
                  .map((item) => (
                    <div key={item.id} className="border-b border-gray-300 last:border-b-0">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold">{item.description}</h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <div>
                            {item.status === 'agreed' && (
                              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                                <Check className="h-4 w-4 mr-1" />
                                Agreed
                              </span>
                            )}
                            {item.status === 'disagreed' && (
                              <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-md">
                                <X className="h-4 w-4 mr-1" />
                                Disagreed
                              </span>
                            )}
                            {item.status === 'unreviewed' && (
                              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-md">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                To review
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 border border-gray-200">
                            <p className="text-sm font-bold mb-2">Parent A's view</p>
                            <p className="text-sm">{item.parent_a}</p>
                          </div>
                          <div className="p-3 bg-gray-50 border border-gray-200">
                            <p className="text-sm font-bold mb-2">Parent B's view</p>
                            <p className="text-sm">{item.parent_b}</p>
                          </div>
                        </div>
                        
                        {item.status === 'disagreed' && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-sm">
                            <p className="font-bold">Suggested resolution</p>
                            <p>Discuss this item with a mediator to find a compromise that works for both parents.</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex space-x-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="govuk-button bg-white text-govuk-blue border border-govuk-blue hover:bg-govuk-light-blue">
                                Update my view
                              </button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update your view</DialogTitle>
                                <DialogDescription>
                                  Share your perspective on "{item.description}"
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Your view on this item</label>
                                  <Textarea 
                                    placeholder="Describe your position..."
                                    onChange={(e) => {
                                      const isParentA = family.family_members?.some((member: any) => 
                                        member.user_id === user?.id && member.role === 'Parent A'
                                      );
                                      
                                      const view = e.target.value;
                                      if (isParentA) {
                                        setEditItem({...item, parent_a: view});
                                      } else {
                                        setEditItem({...item, parent_b: view});
                                      }
                                    }}
                                    defaultValue={
                                      family.family_members?.some((member: any) => 
                                        member.user_id === user?.id && member.role === 'Parent A'
                                      )
                                        ? item.parent_a
                                        : item.parent_b
                                    }
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  onClick={() => {
                                    if (editItem) {
                                      const isParentA = family.family_members?.some((member: any) => 
                                        member.user_id === user?.id && member.role === 'Parent A'
                                      );
                                      
                                      const view = isParentA ? editItem.parent_a : editItem.parent_b;
                                      handleUpdateView(item, view);
                                    }
                                  }}
                                >
                                  Save changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          {item.status === 'unreviewed' && (
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                onClick={() => handleUpdateStatus(item, 'agreed')}
                                className="bg-green-50 border-green-300 text-green-800 hover:bg-green-100"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Mark as agreed
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => handleUpdateStatus(item, 'disagreed')}
                                className="bg-red-50 border-red-300 text-red-800 hover:bg-red-100"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Mark as disagreed
                              </Button>
                            </div>
                          )}
                          
                          {item.status === 'disagreed' && (
                            <Button>
                              Message about this item
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                {financialItems.filter(item => tab === 'all' || item.status === tab).length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-bold mb-2">No items found</h3>
                    <p className="mb-4">There are no financial items in this category yet.</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add a new item
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add new financial item</DialogTitle>
                          <DialogDescription>
                            Create a new financial arrangement to discuss with your co-parent.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Category</label>
                            <Select 
                              onValueChange={(value) => setNewItem({...newItem, category: value})}
                              value={newItem.category}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Regular payments">Regular payments</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                <SelectItem value="Activities">Activities</SelectItem>
                                <SelectItem value="Clothing">Clothing</SelectItem>
                                <SelectItem value="Transportation">Transportation</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-1 block">Description</label>
                            <Input 
                              placeholder="E.g., School uniform costs"
                              value={newItem.description}
                              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-1 block">Your view (Parent A)</label>
                            <Textarea 
                              placeholder="Describe your position..."
                              value={newItem.parent_a}
                              onChange={(e) => setNewItem({...newItem, parent_a: e.target.value})}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-1 block">Co-parent's view (Parent B)</label>
                            <Textarea 
                              placeholder="Describe their position (if known)..."
                              value={newItem.parent_b}
                              onChange={(e) => setNewItem({...newItem, parent_b: e.target.value})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddItem}>
                            Add financial item
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
              
              {financialItems.filter(item => tab === 'all' || item.status === tab).length > 0 && (
                <div className="mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="govuk-button">
                        <Plus className="h-4 w-4 mr-2" />
                        Add new financial item
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add new financial item</DialogTitle>
                        <DialogDescription>
                          Create a new financial arrangement to discuss with your co-parent.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Category</label>
                          <Select 
                            onValueChange={(value) => setNewItem({...newItem, category: value})}
                            value={newItem.category}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Regular payments">Regular payments</SelectItem>
                              <SelectItem value="Education">Education</SelectItem>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="Activities">Activities</SelectItem>
                              <SelectItem value="Clothing">Clothing</SelectItem>
                              <SelectItem value="Transportation">Transportation</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Description</label>
                          <Input 
                            placeholder="E.g., School uniform costs"
                            value={newItem.description}
                            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Your view</label>
                          <Textarea 
                            placeholder="Describe your position..."
                            value={newItem.parent_a}
                            onChange={(e) => setNewItem({...newItem, parent_a: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Co-parent's view (if known)</label>
                          <Textarea 
                            placeholder="Describe their position (if known)..."
                            value={newItem.parent_b}
                            onChange={(e) => setNewItem({...newItem, parent_b: e.target.value})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddItem}>
                          Add financial item
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-4 bg-white p-6 border border-gray-300">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-govuk-blue mr-4 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold mb-2">Need help with financial arrangements?</h2>
              <p>If you're struggling to agree on financial arrangements, you might find these resources helpful:</p>
              <ul className="list-disc pl-8 mb-4">
                <li>The <a href="#" className="text-govuk-blue hover:underline">Child Maintenance Service</a> can help calculate appropriate maintenance payments</li>
                <li><a href="#" className="text-govuk-blue hover:underline">Family mediation services</a> can help you reach agreements</li>
                <li>Get <a href="#" className="text-govuk-blue hover:underline">legal advice</a> about your specific situation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </GOVUKLayout>
  );
};

export default Finances;
