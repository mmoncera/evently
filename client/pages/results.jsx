import React, { useState, useEffect, useContext } from 'react';
import Redirect from '../components/redirect';
import EventCard from '../components/event-card';
import { AppContext, parseRoute } from '../lib';

function Results() {
  const [isSearching, setIsSearching] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useContext(AppContext);

  useEffect(() => {
    searchYelp();
  }, []);

  useEffect(() => {
    getBookmarks();
  }, []);

  function searchYelp() {
    const { params } = parseRoute(window.location.hash);
    const term = params.get('term');
    const location = params.get('location');
    fetch(`/api/search-yelp/?term=${term}&location=${location}`)
      .then(res => res.json())
      .then(data => {
        setIsSearching(false);
        if (data.error || data.length === 0) {
          return setError('Sorry, no events found.');
        }
        setResults(data);
      })
      .catch(err => console.error(err));
  }

  function getBookmarks() {
    const req = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('jwt')
      }
    };
    fetch('/api/bookmarks', req)
      .then(res => res.json())
      .then(bookmarks => {
        setBookmarks(bookmarks);
      })
      .catch(err => console.error(err));
  }

  function formatEventInfo(eventInfo) {
    const type = eventInfo.categories
      .map(category => category.title)
      .join(' • ');
    const address = eventInfo.location.display_address.join(', ');
    eventInfo = {
      eventId: eventInfo.id,
      alias: eventInfo.alias,
      imageUrl: eventInfo.image_url,
      name: eventInfo.name,
      rating: eventInfo.rating,
      reviewCount: eventInfo.review_count,
      price: eventInfo.price,
      type,
      address,
      phone: eventInfo.display_phone
    };
    return eventInfo;
  }

  function handleAddBookmark(eventInfo) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': window.localStorage.getItem('jwt')
      },
      body: JSON.stringify({ eventInfo })
    };
    fetch('/api/bookmarks', req)
      .then(res => setBookmarks([...bookmarks, eventInfo]))
      .catch(err => console.error(err));
  }

  function handleDeleteBookmark(eventInfo) {
    const req = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': window.localStorage.getItem('jwt')
      },
      body: JSON.stringify({ eventInfo })
    };
    fetch('/api/bookmarks', req)
      .then(res => setBookmarks(bookmarks.filter(bookmark => bookmark.eventId !== eventInfo.eventId)))
      .catch(err => console.error(err));
  }

  function renderBookmarkIcon(eventInfo) {
    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.eventId === eventInfo.eventId);
    if (bookmarkIndex >= 0) {
      return <i className="fa-solid fa-bookmark bookmark-icon" onClick={() => handleDeleteBookmark(eventInfo)}></i>;
    }
    return <i className="fa-regular fa-bookmark bookmark-icon" onClick={() => handleAddBookmark(eventInfo)}></i>;
  }

  if (!user) {
    return <Redirect to="sign-in" />;
  }

  if (isSearching) {
    return null;
  }

  const { params } = parseRoute(window.location.hash);
  const term = params.get('term');
  const location = params.get('location');

  return (
    <div className="row justify-content-center pt-5">
      <div className="col-sm-10 col-md-9 col-lg-7">
        {error && <h2 className="text-center font-rubik">{error}</h2>}
        {!error &&
          <>
            <h3 className="mb-3 font-rubik">{`${term} near ${location}`}</h3>
            <ul className="ps-0" >
              {results.map(result => {
                const eventInfo = formatEventInfo(result);
                return <EventCard key={eventInfo.eventId} eventInfo={eventInfo} icon={renderBookmarkIcon(eventInfo)}/>;
              })}
            </ul>
          </>
        }
      </div>
    </div>
  );
}

export default Results;