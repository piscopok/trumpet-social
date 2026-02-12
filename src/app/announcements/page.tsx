import React from 'react'

function page() {
  return (
    <div>
      <h1 className='text-2xl font-bold'>Announcements</h1>
      <p>This is where I will post updates about the app, as well as new features that are in development. Or not. Who knows at the end of the day. I aint getting paid for this. My goal is to get more users than ashtonashton.net</p>
      <br />
      <h1 className='text-2xl font-bold'>Things (hopefully) currently in development:</h1>
      <ul className='list-disc ml-5 mt-2'>
        <li>Voice chat</li>
        <li>Photo uploads</li>
        <li>Custom themes</li>
      </ul>
      <p>Also give me ideas on what to call this thing.</p>
      <br />
      <img src="/image0.jpg" alt="Me rn" className="w-256 h-auto" />
    </div>
  )
}

export default page
