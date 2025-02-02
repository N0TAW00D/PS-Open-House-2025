"use client";

import { Fragment, useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';

interface Person {
  id: number;
  name: string;
}

interface ExampleProps {
  setValue: any; // Use the correct type from react-hook-form
  value: any; // The current value from the form
}


export default function Example({ setValue, value }: ExampleProps) {
  const [selected, setSelected] = useState<Person | null>(value); // Type the selected state
  const [query, setQuery] = useState('');
  const [people, setPeople] = useState<Person[]>([]); // Type the people state

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/json/school.json');
      const data: Person[] = await res.json(); // Ensure the data is typed as Person[]
      setPeople(data);
    };
    fetchData();
  }, []);

  const filteredPeople = query === ''
    ? people
    : people.filter((person) =>
        person.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
    );

  const limitedSuggestions = filteredPeople.slice(0, 10);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSelect = (person: Person | null) => { // Typing the selected person
    if (person) {
      setSelected(person);
      setQuery(person.name);
      setValue('current_school', person.name); // Set the name to the form field
    } else {
      setSelected(null);
      setQuery('');
      setValue('current_school', null); // Set the value to null
    }
  };

  const handleCustomInput = () => {
    if (query && !filteredPeople.some((person) => person.name.toLowerCase() === query.toLowerCase())) {
      setSelected({ id: Date.now(), name: query }); // Create a custom person object
      setValue('current_school', query); // Set custom input as the value
    }
  };

  return (
    <div className="mx-auto">
      <Combobox value={selected} onChange={handleSelect}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 px-3 text-sm text-gray-900 focus:ring-0"
              displayValue={(person: Person | null) => (person ? person.name : '')}
              placeholder="ปัจจุบันศึกษาอยู่โรงเรียน"
              onChange={handleQueryChange}
              value={query}
              onBlur={handleCustomInput} // When input loses focus, check if it's a custom value
            />
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute z-10 mt-1 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
              {limitedSuggestions.length === 0 && query !== '' ? (
                <div className="cursor-default select-none px-3 py-2 text-gray-700">------</div>
              ) : (
                limitedSuggestions.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `cursor-pointer select-none py-2 px-3 ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`
                    }
                    value={person}
                  >
                    {({ selected }) => (
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {person.name}
                      </span>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
