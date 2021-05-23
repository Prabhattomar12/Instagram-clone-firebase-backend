import React, { useState, useEffect } from 'react';
import { Avatar } from '@material-ui/core';
import { db } from '../firebase';
import './post.css';

export default function Post({ postId, username, caption, imageURL }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let unsubscibe;

    if (postId) {
      unsubscibe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscibe();
    };
  }, [postId]);

  console.log('COMMENTS ', comments);

  return (
    <div className='post'>
      <div className='post_header'>
        <Avatar src={imageURL} className='post_header_avatar' />
        <h3>{username}</h3>
      </div>

      <img className='post_image' src={imageURL} alt='post_image' />
      <div className='post_text'>
        <h4>{username}</h4>
        <p>{caption}</p>
      </div>
      {comments.map((comment) => (
        <div className='post_text'>
          <h4>{comment.username}</h4>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
