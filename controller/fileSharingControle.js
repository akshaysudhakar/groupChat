const AWS = require('aws-sdk');

const groupMessage = require('./../models/groupMessageModel');

exports.uploadToS3 = async (req,res)=>{
    const userId = req.user.id;
    const file = req.file;
    const groupId = req.group.id;
    try {

        const filename = `sharedFile${userId}/${new Date()}.txt`;

        const fileUrl = await uploadToS3(file.buffer, filename, file.mimetype);

        const data = {
            message : fileUrl,
            userId : userId,
            groupId : groupId
        }

        await groupMessage.create(data);

        res.status(200).json({fileUrl, success:true})

    }
    catch(err){
        console.log(err);
        res.status(500).json({message : 'server error while uploading the file'})
    }
}


function uploadToS3(data,filename,contentType){
    return new Promise((resolve,reject)=>{
        const BUCKET_NAME = 'akshayexpensetracker'
        const IAM_USER_KEY = process.env.AMAZON_ACCESS_KEY;
        const IAM_USER_SECRET =process.env.AMAZON_SECRET_ACCESS_KEY

        let s3Bucket = new AWS.S3({
            accessKeyId : IAM_USER_KEY,
            secretAccessKey : IAM_USER_SECRET
        })

        s3Bucket.createBucket(()=>{
            var params = {
                Bucket : BUCKET_NAME,
                Key : filename,
                Body : data,
                ContentType: contentType,
                ACL : 'public-read'
            }
            s3Bucket.upload(params, (err, s3response)=>{
                if(err){
                    console.log("not successfull",err)
                    reject(err)
                }
                else{
                    console.log("success",s3response)
                    resolve(s3response.Location)
                }
            })
        })
        }) 
}