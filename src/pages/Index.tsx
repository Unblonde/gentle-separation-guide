
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GOVUKLayout from '../components/GOVUKLayout';
import { ChevronRight, Video, FileText, Quote } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  const [showQuestions, setShowQuestions] = useState(false);
  
  return (
    <GOVUKLayout>
      <div className="grid gap-8">
        <div className="max-w-3xl">
          <h1>Support for parents who are separating</h1>
          <p className="text-xl mb-6">
            Free, practical tools to help you communicate and make arrangements for your children.
          </p>
          <div className="govuk-inset-text">
            <p className="italic">
              "Having a clear plan made it easier to focus on what's important - our children's wellbeing."
            </p>
          </div>
        </div>

        <div className="bg-govuk-light-blue p-6 border-l-4 border-govuk-blue max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Are you separating or already separated from your child's other parent?</h2>
          {!showQuestions ? (
            <button 
              onClick={() => setShowQuestions(true)}
              className="govuk-button"
            >
              Start now
            </button>
          ) : (
            <div className="space-y-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-normal">I'm thinking about separating or in the early stages</AccordionTrigger>
                  <AccordionContent>
                    <p>It's important to think about arrangements for your children as early as possible.</p>
                    <p>Our tools can help you:</p>
                    <ul className="list-disc pl-6 mb-4">
                      <li>Create a parenting plan</li>
                      <li>Understand your financial options</li>
                      <li>Find support services</li>
                    </ul>
                    <Link to="/parenting-plan" className="govuk-button inline-flex items-center">
                      Create a parenting plan
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-normal">We're already separated and need help with arrangements</AccordionTrigger>
                  <AccordionContent>
                    <p>Our tools can help you manage existing arrangements and resolve common issues.</p>
                    <div className="grid gap-4 mt-4">
                      <Link to="/parenting-plan" className="bg-white p-4 border border-gray-300 hover:bg-gray-50">
                        <h3 className="font-bold mb-1">Parenting plan and holiday planner</h3>
                        <p className="text-sm mb-0">Create and manage agreements about childcare arrangements</p>
                      </Link>
                      <Link to="/finances" className="bg-white p-4 border border-gray-300 hover:bg-gray-50">
                        <h3 className="font-bold mb-1">Financial arrangements</h3>
                        <p className="text-sm mb-0">Compare perspectives and find common ground</p>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-normal">We're struggling to agree or communicate</AccordionTrigger>
                  <AccordionContent>
                    <p>If you're finding it difficult to reach agreements, mediation services can help.</p>
                    <p>You can also:</p>
                    <ul className="list-disc pl-6 mb-4">
                      <li>Use our communication tools to share information in a neutral space</li>
                      <li>Find local mediation services</li>
                      <li>Get advice from specialists</li>
                    </ul>
                    <Link to="/help" className="govuk-button inline-flex items-center">
                      Find support services
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2>Parents' stories and guidance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="border border-gray-300 bg-white">
              <div className="p-4">
                <div className="bg-govuk-light-blue p-3 mb-4 inline-flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  <span className="font-bold">Video</span>
                </div>
                <h3 className="text-lg font-bold">How we created our parenting plan</h3>
                <p>Watch how Mark and Sarah worked together to arrange care for their children.</p>
                <a href="#" className="text-govuk-blue hover:underline font-bold inline-flex items-center">
                  Watch the video
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="border border-gray-300 bg-white">
              <div className="p-4">
                <div className="bg-govuk-light-blue p-3 mb-4 inline-flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="font-bold">Article</span>
                </div>
                <h3 className="text-lg font-bold">Helping children adjust to separation</h3>
                <p>Advice from child psychologists on supporting children through family changes.</p>
                <a href="#" className="text-govuk-blue hover:underline font-bold inline-flex items-center">
                  Read the article
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="border border-gray-300 bg-white">
              <div className="p-4">
                <div className="bg-govuk-light-blue p-3 mb-4 inline-flex items-center">
                  <Quote className="h-5 w-5 mr-2" />
                  <span className="font-bold">Testimonial</span>
                </div>
                <h3 className="text-lg font-bold">From conflict to cooperation</h3>
                <p>"We went from barely speaking to having a workable routine for our daughter."</p>
                <a href="#" className="text-govuk-blue hover:underline font-bold inline-flex items-center">
                  Read Aisha's story
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 border border-gray-300 bg-white max-w-3xl">
          <h2>Our tools</h2>
          <p>We've designed these tools to help reduce conflict and make co-parenting easier.</p>
          
          <div className="mt-4 space-y-4">
            <div className="border-l-4 border-govuk-blue pl-4">
              <h3 className="font-bold">Parenting plan and holiday planner</h3>
              <p className="mb-2">Create agreements for childcare arrangements and plan school holidays together.</p>
              <Link to="/parenting-plan" className="text-govuk-blue hover:underline font-bold inline-flex items-center">
                Start planning
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="border-l-4 border-govuk-blue pl-4">
              <h3 className="font-bold">Financial arrangements comparison</h3>
              <p className="mb-2">Share and compare perspectives on financial responsibilities.</p>
              <Link to="/finances" className="text-govuk-blue hover:underline font-bold inline-flex items-center">
                Compare arrangements
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="border-l-4 border-govuk-blue pl-4">
              <h3 className="font-bold">Support assistant</h3>
              <p className="mb-2">Get answers to common questions and find support services.</p>
              <Link to="/help" className="text-govuk-blue hover:underline font-bold inline-flex items-center">
                Ask a question
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="govuk-warning-text max-w-3xl">
          <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
          <div>
            <strong className="font-bold">For emergencies or if you feel unsafe</strong>
            <p className="mb-0">If you or your children are in immediate danger, call 999. For confidential support with domestic abuse, call the National Domestic Abuse Helpline on 0808 2000 247.</p>
          </div>
        </div>
      </div>
    </GOVUKLayout>
  );
};

export default Index;
