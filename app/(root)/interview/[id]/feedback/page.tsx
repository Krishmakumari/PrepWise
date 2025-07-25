// import { getCurrentUser } from '@/lib/actions/auth.action';
// import { getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/general.action';
// import { redirect } from 'next/navigation';
// import React from 'react'

// const Page= async ({ params }: RouteParams) => {
//   const { interviewId } = await params;
//   const user= await getCurrentUser();

//   const interview= await getInterviewById(interviewId);
//   if(!interview) redirect('/');
//   const feedback =await getFeedbackByInterviewId({
//     interviewId,
//     userId: user?.id!,
//   })

//   return (
//     <div>page</div>
//   )
// }

// export default Page


import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DownloadFeedback from "@/components/DownloadFeedback";

const Page = async ({ params }: RouteParams) => {
  const { id: interviewId } = await params;
  
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/");
  }
  
  const interview = await getInterviewById(interviewId);
  
  if (!interview) {
    redirect("/");
  }

  const feedback = await getFeedbackByInterviewId({
    interviewId,
    userId: user.id,
  });

  if (!feedback) {
    return (
      <div className="flex flex-col min-h-screen gap-4 mx-auto max-w-7xl text-light-100 items-center justify-center">
        <h2 className="font-bold text-2xl">Feedback Not Available</h2>
        <p className="text-lg text-center">
          Feedback for this interview hasn't been generated yet. 
          <br />
          Please complete the interview first to generate feedback.
        </p>
        <Button asChild className="bg-dark-200 hover:text-dark-500 hover:bg-light-200 p-4 font-bold text-light-200 rounded-full border-2 border-light-200 mt-5">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const { totalScore, categoryScores, finalAssessment, createdAt } = feedback;
  const formattedDate = dayjs(createdAt || Date.now()).format("MMM D, YYYY");

  return (
    <div className="flex flex-col min-h-screen gap-4 mx-auto max-w-7xl text-light-100">
      <h2 className="font-bold">
        Feedback on the Interview - {interview.role} Interview
      </h2>
      <div className="flex flex-row gap-10 items-center text-base">
        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-1">
            <Image src="/star.svg" alt="star" width={25} height={25} />
            <p>Overall Impression:</p>
          </div>
          <span>{totalScore}/100</span>
        </div>
        <div className="flex flex-row gap-1">
          <Image src="/calendar.svg" alt="calendar" width={25} height={25} />
          <span>{formattedDate}</span>
        </div>
      </div>
      <h3 className="font-semibold mt-10 mb-5">Breakdown of Evaluation:</h3>
      <ol className="flex flex-col gap-4 list-decimal list-inside">
        {categoryScores.map(
          (
            category: { name: string; score: number; comment: string },
            index: number
          ) => (
            <li key={category.name} className="flex flex-col gap-3">
              <h4 className="text-lg font-semibold">
                {index + 1}. {category.name} ({category.score}/100)
              </h4>
              <p className="ml-5">
                {category.comment || "No comment provided for this category"}
              </p>
            </li>
          )
        )}
      </ol>
      <h4 className="text-orange-200 mt-4 text-lg">{finalAssessment}</h4>
      <h4 className="text-lg mt-5">
        Final Verdict:{" "}
        <span
          className={clsx("font-bold ml-4 badge-text", {
            "text-green-500": totalScore > 70,
            "text-red-500": totalScore <= 70,
          })}
        >
          {totalScore > 70 ? "Recommended" : "Not Recommended"}
        </span>
      </h4>
      <div className="flex gap-4 mt-5">
        <Button asChild
          className="flex justify-center items-center w-[80px] bg-dark-200 hover:text-dark-500 hover:bg-light-200                       
                             p-4 font-bold text-light-200 rounded-full border-2 border-light-200"
        >
          <Link href="/">Back</Link>
        </Button>
        <Button asChild
          className="flex justify-center items-center bg-blue-600 hover:bg-blue-700                       
                             p-4 font-bold text-white rounded-full border-2 border-blue-600"
        >
          <Link href={`/interview/${interviewId}`}>Retake Interview</Link>
        </Button>
        <DownloadFeedback 
          feedback={feedback}
          interview={interview}
          userName={user.name}
        />
      </div>
    </div>
  );
};

export default Page;