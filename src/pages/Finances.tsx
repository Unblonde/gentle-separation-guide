
import React, { useState } from 'react';
import GOVUKLayout from '../components/GOVUKLayout';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FinancialItem {
  category: string;
  description: string;
  parentA: string;
  parentB: string;
  status: 'agreed' | 'disagreed' | 'unreviewed';
}

const Finances = () => {
  const [financialItems, setFinancialItems] = useState<FinancialItem[]>([
    {
      category: 'Regular payments',
      description: 'Monthly child maintenance payment',
      parentA: '£250 per month payment',
      parentB: '£250 per month payment',
      status: 'agreed'
    },
    {
      category: 'Regular payments',
      description: 'Pocket money',
      parentA: '£10 per week, provided on Saturdays',
      parentB: '£5 per week, provided on Saturdays',
      status: 'disagreed'
    },
    {
      category: 'Education',
      description: 'School uniform costs',
      parentA: 'Split equally between parents',
      parentB: 'Split equally between parents',
      status: 'agreed'
    },
    {
      category: 'Education',
      description: 'School trips',
      parentA: 'Split equally between parents',
      parentB: 'Parent who has child during the trip pays',
      status: 'disagreed'
    },
    {
      category: 'Healthcare',
      description: 'Dental check-ups',
      parentA: 'Parent A to arrange and pay',
      parentB: 'Split equally between parents',
      status: 'disagreed'
    },
    {
      category: 'Activities',
      description: 'Football club membership',
      parentA: 'Split equally between parents',
      parentB: 'Split equally between parents',
      status: 'agreed'
    },
    {
      category: 'Activities',
      description: 'Swimming lessons',
      parentA: 'Parent A to pay fully',
      parentB: 'Parent B to pay fully',
      status: 'unreviewed'
    }
  ]);

  const agreementSummary = {
    agreed: financialItems.filter(item => item.status === 'agreed').length,
    disagreed: financialItems.filter(item => item.status === 'disagreed').length,
    unreviewed: financialItems.filter(item => item.status === 'unreviewed').length,
    total: financialItems.length
  };

  const percentageAgreed = Math.round((agreementSummary.agreed / agreementSummary.total) * 100);
  
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
                  .map((item, index) => (
                    <div key={index} className="border-b border-gray-300 last:border-b-0">
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
                            <p className="text-sm">{item.parentA}</p>
                          </div>
                          <div className="p-3 bg-gray-50 border border-gray-200">
                            <p className="text-sm font-bold mb-2">Parent B's view</p>
                            <p className="text-sm">{item.parentB}</p>
                          </div>
                        </div>
                        
                        {item.status === 'disagreed' && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-sm">
                            <p className="font-bold">Suggested resolution</p>
                            <p>Discuss this item with a mediator to find a compromise that works for both parents.</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex space-x-4">
                          <button className="govuk-button bg-white text-govuk-blue border border-govuk-blue hover:bg-govuk-light-blue">
                            Update my view
                          </button>
                          {item.status === 'disagreed' && (
                            <button className="govuk-button">
                              Message about this item
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="mt-6">
                <button className="govuk-button">
                  Add new financial item
                </button>
              </div>
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
