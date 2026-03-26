import { forwardRef, SelectHTMLAttributes, useState, useRef, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    value?: string;
    onChange?: (e: { target: { value: string } }) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className, value, onChange, ...props }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);
        const selectedOption = options.find((opt) => opt.value === value) || options[0];

        useEffect(() => {
            const handleOutsideClick = (event: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleOutsideClick);
            return () => document.removeEventListener('mousedown', handleOutsideClick);
        }, []);

        const handleSelect = (optionValue: string) => {
            if (onChange) {
                onChange({ target: { value: optionValue } });
            }
            setIsOpen(false);
        };

        return (
            <div className="w-full relative" ref={containerRef}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}

                <select
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    className="hidden"
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'w-full px-3 py-2 border border-gray-300 rounded-xl bg-white flex items-center justify-between cursor-pointer select-none transition-colors',
                        'focus:outline-none ring-offset-0',
                        isOpen ? 'ring-2 ring-[#004573] border-transparent' : 'hover:bg-gray-50',
                        error && 'border-red-500 ring-red-500',
                        className
                    )}
                >
                    <span className="truncate text-gray-900 text-sm sm:text-base">
                        {selectedOption?.label || 'Выберите...'}
                    </span>
                    <svg
                        className={cn("w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0", isOpen && "rotate-180")}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {isOpen && (
                    <div className="absolute z-[999] w-full mt-2 bg-[#4a4b50]/80 backdrop-blur-sm text-white rounded-xl shadow-xl py-1.5 border border-white/50 overflow-hidden origin-top-left transition-all">
                        <ul className="max-h-60 overflow-auto outline-none custom-scrollbar">
                            {options.map((option) => {
                                const isSelected = option.value === value;
                                return (
                                    <li
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={cn(
                                            "relative flex items-center px-9 py-2.5 text-sm cursor-pointer hover:bg-white/20 transition-colors",
                                            isSelected ? "font-medium text-white" : "text-gray-200"
                                        )}
                                    >
                                        {isSelected && (
                                            <span className="absolute left-3.5 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        )}
                                        <span className="truncate">{option.label}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    },
);

Select.displayName = 'Select';