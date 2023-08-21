import { Link } from '@remix-run/react';
import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ContentStoreGeneralEntry } from '~/services/content-store';

function AddDaySuffix(date: string) {
  const day = parseInt(date.split(' ')[0]);
  let suffix;
  if (day > 3 && day < 21) {
    suffix = 'th';
  } else {
    switch (day % 10) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
      default:
        suffix = 'th';
    }
  }
  return day + suffix + ' ' + date.substring(2);
}

function NextStall({
  startDT,
  endDT,
  location,
}: {
  startDT: string;
  endDT: string;
  location: ContentStoreGeneralEntry;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Stall date information
  const stallStartDT = new Date(startDT);
  const stallEndDT = new Date(endDT);

  const stallStartDate = AddDaySuffix(
    stallStartDT.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
  );
  const stallStartTime = stallStartDT.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true });

  const stallEndDate = AddDaySuffix(
    stallEndDT.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
  );
  const stallEndTime = stallEndDT.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true });

  return (
    <div className='mt-4 rounded-md border-2 border-solid border-ht-black bg-ht-orange p-6 text-left font-bold'>
      <div className='flex flex-wrap justify-center'>
        <span className='mr-2 underline'>Next Stall</span>
        <span className='text-center'>
          {stallStartDate == stallEndDate ? (
            <>
              {stallStartTime} - {stallEndTime}, {stallEndDate}
            </>
          ) : (
            <>
              {stallStartTime}, {stallStartDate} - {stallEndTime}, {stallEndDate}
            </>
          )}
        </span>
      </div>
      <div className='mt-3 flex flex-wrap justify-center'>
        <span className='mr-2 underline'>Location</span>
        <Link
          to={location.data.url}
          className='block text-center'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Google Maps Link'
        >
          <span>
            {location.metadata.title} <ExternalLink className='inline' size={16} />
          </span>
        </Link>
      </div>
    </div>
  );
}

export { NextStall };
