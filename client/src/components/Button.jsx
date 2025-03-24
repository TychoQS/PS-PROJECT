/*
======================== USAGE ====================
        <Button size="medium">Click Me</Button>

        <Button size="small">Small Button</Button>

        <Button size="large">Large Button</Button>
*/

import React from 'react';
import {cherryBomb} from '@/styles/fonts';

export default function Button({size = 'medium', children}) {
    const sizeClasses = {
        small: 'w-24 h-8 text-sm',
        medium: 'w-40 h-12 text-xl',
        large: 'w-64 h-16 text-2xl',
    };

    const buttonSizeClass = sizeClasses[size] || sizeClasses.medium;

    return (
        <button
            className={`cursor-pointer ${buttonSizeClass} border-b-8 rounded-full hover:bg-orange-400 hover:border-none bg-[#FBAF00] border-b-[#403C61] font-black shadow-md text-[#403C61] focus:outline-none ${cherryBomb.className}`}
        >
            {children}
        </button>
    );
};