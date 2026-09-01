import React from 'react';

export default function CustomInputButton({
    value,
    onChange,
    onSubmit,
    placeholder = "...",
    type = "text",
    buttonContent = "Search",
    inputClassName = "",
    buttonClassName = "",
    containerClassName = "",
    disabled = false,
    ...restProps
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit && !disabled) {
        onSubmit(value);
        }
};

    return (
        <form 
        onSubmit={handleSubmit} 
        className={`flex items-center gap-2 w-full max-w-md ${containerClassName}`}
        >
        <div className="relative flex-1">
            <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-2 text-sm text-(--text-color) bg-background border border-(--border-color) rounded-[var(--radius-card,14px)] 
                focus:outline-none focus:ring-1 focus:ring-transparent focus:border-(--primary-color) transition-all 
                disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
            {...restProps}
            />
        </div>

        <button
            type="submit"
            disabled={disabled}
            className={`cursor-pointer px-4 py-2 text-sm font-medium text-(--text-color) bg-(--bg-color)/10 
                backdrop-blur-xl rounded-[var(--radius-card,14px)] hover:bg-(--bg-color)/90 focus:outline-none 
                flex items-center justify-center gap-2 ${buttonClassName}`}
        >
            {buttonContent}
        </button>
        </form>
    );
}