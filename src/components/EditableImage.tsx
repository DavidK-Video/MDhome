import React from 'react';

interface EditableImageProps extends React.HTMLAttributes<HTMLImageElement> {
    id: string;
    isEditing: boolean;
    onClick: (id: string) => void;
    customImages: Record<string, string>;
    src?: string;
    alt?: string;
    className?: string;
    [key: string]: any;
}

export default function EditableImage({ id, isEditing, onClick, customImages, src, ...props }: EditableImageProps) {
    const finalSrc = customImages[id] || src || '';
    return (
        <img
            {...props}
            src={finalSrc}
            onClick={() => isEditing && onClick(id)}
            className={`${isEditing && id ? 'cursor-pointer border-2 border-red-500' : ''} ${props.className || ''}`}
        />
    );
}
