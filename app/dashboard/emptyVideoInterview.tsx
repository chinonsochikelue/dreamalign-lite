import React from 'react'
import Image from "next/image"
import InterViewDialog from './InterViewDialog';


function EmptyVideoInterview() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center gap-8 border border-gray-500 border-dashed shadow-lg p-10 rounded-3xl max-w-xl mx-auto">
      <div className="w-full flex justify-center">
        <Image src="/interview.png" quality={100} height={130} width={500} alt="Empty State" className="object-contain w-full max-w-md" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-700 text-center">No Video Interviews Yet</h2>
      <p className="text-base text-gray-500 text-center mb-4">You haven't created any video interviews. Start by creating your first one to practice and improve your interview skills!</p>
      <InterViewDialog />
    </div>
  );
}

export default EmptyVideoInterview  