const User = require("../models/user.js");
const {Configuration,OpenAIApi} = require("openai")
const axios = require("axios")
const textToSpeech = require('@google-cloud/text-to-speech')
const fs = require('fs');
const util = require('util');








//openai api key configuration
const configuration = new Configuration({
    organization : process.env.OPEN_AI_ORGANIZATION,
    apiKey : process.env.OPEN_AI_API_KEY
})

const openaiobj = new OpenAIApi(configuration);





exports.pingChatGpt = async(req,res,next) => {
try {
      const prompt = req.query.prompt; // Get the prompt from the request body
  
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: prompt,
        max_tokens: 250,
        temperature: 1
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`
        }
      });
  
      const completion = response.data.choices[0].text; // Extract the generated completion from the response
      const modifiedText = completion.replace(/\n/g , "");
      const modifiedString = completion.replace(/\n/, "");

      const user = await User.findById(req.user._id);
      let fileNumber = user.fileNumber
      await convertTextToMp3(modifiedText,fileNumber);
      user.fileNumber++;
      user.conversation.push({
        fromUser : prompt,
        toUser : modifiedString
      })
      await user.save();

  
      res.json({
          success : true,
          data : modifiedString,
         fileNumber
      });
} catch (error) {
next(error);
}

}


//google textospeech client using the inner credentials of dotenv
const client = new textToSpeech.TextToSpeechClient();
async function convertTextToMp3(message,fileNumber){
     // The text to synthesize
    const text = message;

    // Construct the request
    const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    if(fileNumber != 0){
      fs.unlink(`public/output${fileNumber-1}.mp3`, (err) => {
        if (err) {
            throw err;
        }
     })
    }
    await writeFile(`public/output${fileNumber}.mp3`, response.audioContent, 'binary');


}