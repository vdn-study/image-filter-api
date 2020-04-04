import express from 'express';
import bodyParser from 'body-parser';
import validUrl from 'valid-url';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Implement a restful endpoint
  app.get("/filteredimage", async (req, res) => {
      const imageUrl = req.query.image_url;

      // Validate imageUrl
      if(!validUrl.isUri(imageUrl)){
        console.log(validUrl.isHttpUri(imageUrl));
        return res.status(400).send({message: "Image URL is invalid."});
      }

      // Process filtering image
      const  image = await filterImageFromURL(imageUrl);

      // Return response code and delete local file
      res.status(200)
       .sendFile(image, {}, async (err) => {
          if (err) {
            throw new Error('The file transfer was intruppted due to a server error'); 
          }

          await deleteLocalFiles([image]);
       });
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();