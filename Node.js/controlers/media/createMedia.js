import { BlobServiceClient } from '@azure/storage-blob';
import 'dotenv/config';
import { MongoClient } from "mongodb";

const mongodbUri = process.env.MONGODB_URI;
const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);

const client = new MongoClient(mongodbUri);
client.connect();

async function createMedia(req, res) {

  const file = req.files
  const user = req.user
  const { titre, desc } = req.body
  
  const blobName = req.files["image"].name
  
      if (!file) {
        return res.status(400).json({ error: "Veuillez fournir le chemin du fichier." });
      }

      const blobClient = containerClient.getBlockBlobClient(`${Date.now()}_${blobName}`);

      try{
        await blobClient.upload(file["image"].data, file["image"].size, {
        blobHTTPHeaders: {
            blobContentType: file["image"].mimetype
        }
      });
      res.end(JSON.stringify({ message: `Le fichier ${Date.now()}_${blobName} a été téléchargé avec succès sur Azure Blob Storage.`}));
      } catch (error){
        console.error('Error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Erreur serveur ' }));
      }
      
      await storeMetadata(blobName, file["image"].mimetype, blobClient.url, user.id, titre, desc)

      } 

    async function storeMetadata(fileName, fileType, imageUrl, user, titre, desc) {
      const collection = client.db("test").collection('media');
      await collection.insertOne({ fileName, fileType, imageUrl,user, titre, desc });
  }


export default createMedia;