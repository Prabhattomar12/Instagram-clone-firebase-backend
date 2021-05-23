import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { storage, db } from '../firebase';
import './imageUpload.css';
import firebase from 'firebase';

function ImageUpload({ username }) {
  const [caption, setCaption] = useState();
  const [image, setImage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    console.log('file name ', e.target.files[0].name);

    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const uploadTask = storage.ref('/images/' + image.name).put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // handle progress
        const progress = Math.round(
          (snapshot.bytesTransferred * 100) / snapshot.totalBytes
        );
        setProgress(progress);
      },
      (error) => {
        // handle error
        console.log(error.message);
        alert(error.message);
      },
      () => {
        // progress complete
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              username: username,
              imageURL: url,
            });
          });
      }
    );

    setProgress(0);
    setCaption('');
    setImage(null);
  };

  return (
    <div className='image_upload'>
      <progress value={progress} />
      <input
        type='text'
        value={caption}
        placeholder='Enter a caption...'
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type='file' onChange={handleChange} />
      <Button onClick={handleUpload}>Post</Button>
    </div>
  );
}

export default ImageUpload;
