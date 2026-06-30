import Image from "next/image";

export interface InspectionStep {
  id: number;
  title: string;
  description: string;
  badges: string[];
  iconType: "svg" | "image";
  iconSrc?: string;
  align: "left" | "right";
}

export const inspectionSteps: InspectionStep[] = [
  {
    id: 1,
    title: "Upload X-Ray",
    description: "Upload your heart X-Ray image through our platform. You can use X-Ray results from any clinic or hospital. Make sure the image is clear and of good quality for optimal analysis results.",
    badges: ["Format: JPG, PNG", "Max: 10MB", "High Quality"],
    iconType: "svg",
    align: "left",
  },
  {
    id: 2,
    title: "AI Early Detection",
    description: "Our advanced AI system will analyze your X-Ray image in seconds. Our deep learning technology has been trained with thousands of medical cases to detect various heart conditions with 98% accuracy.",
    badges: ["Time: 30 seconds", "Accuracy: 98%", "AI Powered"],
    iconType: "image",
    iconSrc: "/landing/how-it-works/brain.png",
    align: "right",
  },
  {
    id: 3,
    title: "Choose Doctor",
    description: "Select a cardiologist from our list of experienced medical professionals. You can view each doctor's profile, specialization, and rating to choose the one that best suits your needs.",
    badges: ["50+ Doctors"],
    iconType: "image",
    iconSrc: "/landing/how-it-works/choosedoctor.png",
    align: "left",
  },
  {
    id: 4,
    title: "Give a Note",
    description: "Add additional information such as symptoms you're experiencing, medical history, or specific questions for the doctor. This information will help doctors provide more accurate diagnosis and appropriate recommendations.",
    badges: ["Optional", "Confidential", "Detailed"],
    iconType: "image",
    iconSrc: "/landing/how-it-works/note.png",
    align: "right",
  },
  {
    id: 5,
    title: "Final Verified Result",
    description: "Receive a complete analysis report that has been verified by a specialist doctor. The report includes AI detection results, doctor's interpretation, diagnosis, and treatment recommendations.",
    badges: ["Verified"],
    iconType: "image",
    iconSrc: "/landing/how-it-works/verified.png",
    align: "left",
  },
];

export function StepIcon({ step }: { step: InspectionStep }) {
  if (step.iconType === "svg") {
    return (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    );
  }
  return (
    <Image
      src={step.iconSrc!}
      alt={`${step.title} icon`}
      height={40}
      width={40}
      className="object-contain"
    />
  );
}
