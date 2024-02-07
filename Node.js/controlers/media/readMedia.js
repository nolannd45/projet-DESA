import Media from "../../models/media.js";

  export async function readMedia (req, res)  {
    try 
    {
        const medias = await Media.find({});
        res.status(200).send(medias);    
    } catch (error) 
    {
      console.log(error);
      res.sendStatus(500);
    }
  };
  
