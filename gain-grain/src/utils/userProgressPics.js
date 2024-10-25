import clientPromise from './mongodb'; 
import { ProgressPic } from './postModels/Post'

export const postProgressPic = async (userId, progressPic) => {
    const client = await clientPromise;
    const db = client.db();
  
    try {
        const newProgressPic = new ProgressPic({
            userId,
            progressPic,
            date: new Date()
        });

        await db.collection('progressPics').insertOne(newProgressPic);

        return { success: true, message: 'Progress pic posted.' };
    } catch (error) {
        console.error('Error posting progress pic: ', error);
        return { success: false, message: 'Error posting progress pic.' };
    }
};