import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CourseProgramSelectorProps {
  value?: string[];
  onChange?: (selected: string[]) => void;
  programs?: string[];
}

const CourseProgramSelector: React.FC<CourseProgramSelectorProps> = ({
  value: controlledValue,
  onChange,
  programs = [
    'International Program',
    'English Program', 
    'Intensive English Program',
    'General Program'
  ]
}) => {
  const [internalValue, setInternalValue] = useState<string[]>([]);

  // Use controlled value if provided, otherwise use internal state
  const selectedPrograms = controlledValue ?? internalValue;

  const handleProgramChange = (program: string, checked: boolean) => {
    const newSelectedPrograms = checked 
      ? [...selectedPrograms, program]
      : selectedPrograms.filter((p) => p !== program);

    // If an onChange handler is provided, use it
    if (onChange) {
      onChange(newSelectedPrograms);
    } else {
      // Otherwise, update internal state
      setInternalValue(newSelectedPrograms);
    }
  };

  return (
    <div className="p-2">
      <Label className="text-blue-800">ประเภทหลักสูตร / แผนการเรียน ที่สนใจ</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
        {programs.map((program) => (
          <div key={program} className="flex items-center space-x-2">
            <Checkbox
              id={program}
              name="course_programs"
              checked={selectedPrograms.includes(program)}
              onCheckedChange={(checked) => handleProgramChange(program, !!checked)}
            />
            <Label htmlFor={program}>{program}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgramSelector;