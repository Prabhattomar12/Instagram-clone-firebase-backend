import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import {
  makeStyles,
  unstable_createMuiStrictModeTheme,
} from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export default function App() {
  const [posts, setposts] = useState([]);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    const unsubscibe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscibe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setposts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((currUser) => {
        return currUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form>
        <center>
          <img
            className='login_logo'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png'
          />
        </center>
        <Input
          className='form_item'
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          className='form_item'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className='form_item'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={signUp} className='form_item'>
          Sign Up
        </Button>
      </form>
    </div>
  );

  const signInBody = (
    <div style={modalStyle} className={classes.paper}>
      <form>
        <center>
          <img
            className='login_logo'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png'
          />
        </center>

        <Input
          className='form_item'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className='form_item'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={signIn} className='form_item'>
          Sign Up
        </Button>
      </form>
    </div>
  );

  // console.log('posts ', posts);

  return (
    <div className='App'>
      <div className='header'>
        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png' />
        <div>
          {user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
            <div>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {body}
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {signInBody}
      </Modal>
      <div className='upload_image_wrapper'>
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h1>Sorry first login to create a post</h1>
        )}
      </div>

      <div className='app_body'>
        <div className='post_wrapper'>
          {posts.map((post) => (
            <Post
              key={post.id}
              postId={post.id}
              username={post.post.username}
              caption={post.post.caption}
              imageURL={post.post.imageURL}
            />
          ))}
        </div>

        <div className='bottom'></div>

        {/* <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
          clientAccessToken='2067bc8a16d75a1a706b1591064f8080|1893537144160962'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        /> */}
      </div>
    </div>
  );
}

//2067bc8a16d75a1a706b1591064f8080 client token
// 1893537144160962 app id
