import React,  {useState, useEffect}  from "react";
import './App.css';
import Post from './Components/Posts/Post';
import {auth, db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core';
import ImageUpload from "./Components/ImageUpload/ImageUpload";
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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

function App() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [posts, setPosts] = useState([]);
    const [open,setOpen] = useState(false);
    const [OpenSignIn, setOpenSignIn] = useState(false);
    const [addPost, setAddPost] = useState(false);
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [user,setUser] = useState(null);
    

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
          if (authUser){
            //user logged in 
              console.log(authUser);
              setUser(authUser);

              if(authUser.displayName)
              {
                //dont update username
              } else {
                // if we just created someone
                return authUser.updateProfile({
                  displayName: username,
                })
              }
          } else {
            // user logged out
            setUser(null);
          }
        })

        return () => {
          //perform some cleanup actionsMap
          unsubscribe();
        }
    }, [user, username]);


    //fetch posts data
    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot =>{
          setPosts(snapshot.docs.map(doc => ({ 
            id :doc.id, 
            post :doc.data() 
          })));
        })
    }, []);

    //Signup handler
    const signUp = (event) => {
      event.preventDefault();
      auth.createUserWithEmailAndPassword(email , password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((error) => alert(error.message));
      setOpen(false);
    }

    const signIn = (event) => {
      event.preventDefault();
      auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

      setOpenSignIn(false);
    }
  
    
  return (
    <div className="App">
      

        {/* Header */}
        {/* Signup  Modal */}
        <Modal
        open={open}
        onClose={() => setOpen(false)}
        >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
            <h2>Insta</h2>
              <Input 
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />

              <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
              <Button onClick={signUp}>Sign Up</Button>
            </form>
          </div> 
        </Modal>


        {/* SignIn  Modal */}
        <Modal
        open={OpenSignIn}
        onClose={() => setOpenSignIn(false)}
        >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
            <h2>Insta</h2>

              <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
              <Button onClick={signIn}>Sign In</Button>
            </form>
          </div> 
        </Modal>

        {/* AddPost Modal */}
       

        
        <div className="app__header">
        <h1 className="app__name">Insta</h1>
        {
            user ? (
              <div className="app__loginContainer">
              <Button onClick  = {() => setAddPost(true)}>Add Post</Button>
              <Button onClick  = {() => auth.signOut()}>Logout</Button>
              </div>
            ) : (
              <div className="app__loginContainer">
              <Button onClick  = {() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick  = {() => setOpen(true)}>Sign Up</Button>
              </div>
            )
          }

        </div>
          
         

          {/* Posts */}
          <div className="app__posts">
            <div className="app__postsLeft">
            {
            posts.map( ({id , post})  => (
              <Post
                key = {id}
                postId = {id}
                user = {user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            ))
            }


            </div>
          <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/COifFTsDi_o/"
            clientAccessToken='480013886755827|547b50d202ac73a073a9e9ede6375566'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>

          </div>


          <Modal
        open={addPost}
        onClose={() => setAddPost(false)}
        >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
            <h2>Insta - Upload Post</h2>
             {user?.displayName ? (
             <ImageUpload username={user.displayName}/>
              ): (<h3>Sorry you need to login</h3>)}

            <Button onClick  = {() => setAddPost(false)}>Close Modal</Button>
            </form>
          </div> 
        </Modal>

          
    </div>
  );
}

export default App;
