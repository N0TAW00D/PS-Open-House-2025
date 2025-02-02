// components/Circle.tsx
import React from 'react';
import { CircleX, CircleCheck, CircleHelp, Atom, Sigma } from 'lucide-react';  // Example icons from lucide

interface CircleProps {
  baseValue: boolean;
  falseIcon: React.ElementType;  // Icon to display when baseValue is false
  trueIcon: React.ElementType;   // Icon to display when baseValue is true
  whenTrueColor: string;         // Color to apply when baseValue is true
}

const Circle: React.FC<CircleProps> = ({ baseValue, falseIcon: FalseIcon, trueIcon: TrueIcon, whenTrueColor }) => {
  return (
    <div className="flex justify-center items-center w-14 h-14 sm:w-[72px] sm:h-[72px] bg-white rounded-full">
      {baseValue ? (
        <TrueIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${whenTrueColor}`} />
      ) : (
        <FalseIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
      )}
    </div>
  );
};

export default Circle;
