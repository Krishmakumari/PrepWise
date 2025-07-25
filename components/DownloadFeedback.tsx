"use client";

import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

interface DownloadFeedbackProps {
  feedback: {
    totalScore: number;
    categoryScores: Array<{
      name: string;
      score: number;
      comment: string;
    }>;
    finalAssessment: string;
    createdAt: string;
  };
  interview: {
    role: string;
  };
  userName: string;
}

const DownloadFeedback = ({ feedback, interview, userName }: DownloadFeedbackProps) => {
  const handleDownload = () => {
    const { totalScore, categoryScores, finalAssessment, createdAt } = feedback;
    const formattedDate = dayjs(createdAt || Date.now()).format("MMM D, YYYY");
    
    const content = `
INTERVIEW FEEDBACK REPORT
========================

Candidate: ${userName}
Interview Role: ${interview.role} Interview
Date: ${formattedDate}
Overall Score: ${totalScore}/100

EVALUATION BREAKDOWN:
====================

${categoryScores.map((category, index) => `
${index + 1}. ${category.name} (${category.score}/100)
   ${category.comment || "No comment provided for this category"}
`).join('')}

FINAL ASSESSMENT:
================
${finalAssessment}

FINAL VERDICT:
=============
${totalScore > 70 ? "RECOMMENDED" : "NOT RECOMMENDED"}

---
Generated on ${dayjs().format("MMM D, YYYY [at] h:mm A")}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${interview.role}_Interview_Feedback_${formattedDate.replace(/,/g, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      className="flex justify-center items-center bg-green-600 hover:bg-green-700 p-4 font-bold text-white rounded-full border-2 border-green-600"
    >
      Download Feedback
    </Button>
  );
};

export default DownloadFeedback;