import Media from "../../models/media.js";

  export async function readUser (req, res)  {
    try 
    {
        const medias = await User.find({});
        res.status(200).send(medias);    
    } catch (error) 
    {
      console.log(error);
      res.sendStatus(500);
    }
  };
  
