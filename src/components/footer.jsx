import React from 'react';
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai';


export default function Footer() {
    return (
        <div className='flex justify-center '>
          <a href="https://github.com/sanketshevare">  <AiFillGithub size={28} /></a>
            <a href="https://www.linkedin.com/in/sanket-shevare-4a299a1b7"><AiFillLinkedin size={28} className='text-sky-700' /></a>
        </div>
    );
}


