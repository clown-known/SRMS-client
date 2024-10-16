import { ChangeEvent, KeyboardEvent } from 'react';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void; 
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  onKeyDown,
  placeholder = 'Search...',
}: SearchInputProps) {
  return (
    <div className="relative flex">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
    </div>
  );
}
