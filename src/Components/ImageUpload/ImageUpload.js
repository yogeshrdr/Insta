import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { storage, db } from '../../firebase';
import firebase from 'firebase';
import './ImageUpload.css'

function ImageUpload({username}) {
    const [image,setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    
    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () =>{
        //uploadation of image in storage
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) *100
                );
                setProgress(progress);
            },
            (error) =>{
                //Error Function 
                console.log(error);
                alert(error.message);
            },
            () => {
                //complete function
                storage.ref("images").child(image.name).getDownloadURL()
                .then(url => {
                    //post image inside the database
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption : caption,
                        imageUrl : url,
                        username : username
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        );
    };
    
    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <input type="text"  placeholder="Enter a Caption" value={caption} onChange={event => setCaption(event.target.value)}/>
            <input type="file" onChange={handleChange} />
            <Button className="imageupload__Button" onClick={handleUpload} >Upload</Button>
        </div>
    )
}

export default ImageUpload
