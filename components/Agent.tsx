"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED"
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({ 
  userName, 
  userId, 
  type,
  questions,
  interviewId
 }: AgentProps) => {
  const router = useRouter();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };

        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error: ", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = async(messages: SavedMessage[]) => {
    console.log("Generate feedback here");

    const { success, feedbackId } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages
    });

    if (success && feedbackId) {
      router.push(`/interview/${interviewId}/feedback`)
    } else {
      console.log("Error saving feedback");
      router.push("/");
    }
  }

  useEffect(() => {
    if(callStatus === CallStatus.FINISHED) {
      if(type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
    
  }, [messages, callStatus, type, userId]);


  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    
    try {
      if (type === "generate") {
        await vapi.start(
          undefined,
          undefined,
          undefined,
          process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
           variableValues: {
             username: userName,
             userid: userId,
            }
          }
        ); 
      } else {
         let formattedQuestions = "";
         if (questions) {
           formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
          }
          await vapi.start(interviewer, {
            variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnectCall = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="ai-avatar"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/profile.svg"
              alt="user avatar"
              className="rounded-full object-cover size-[120px]"
              width={540}
              height={540}
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className="flex w-full justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button 
            className="relative btn-call"
            onClick={handleCall}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />
            <span>
              {callStatus === CallStatus.CONNECTING ? "Connecting..." : "Call"}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect"
                  onClick={handleDisconnectCall}>
            End
          </button>
        )}
      </div>
      
      {callStatus === CallStatus.CONNECTING && (
        <div className="flex flex-col items-center mt-4 text-light-100">
          <p className="text-sm text-gray-400">Initializing AI interviewer...</p>
          <p className="text-xs text-gray-500 mt-1">This may take a few seconds</p>
        </div>
      )}
    </>
  );
};

export default Agent;