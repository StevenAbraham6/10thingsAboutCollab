//
// Demo interactive adaptive cards
//


const Airtable = require('airtable')
Ciscospark  = require('ciscospark/env');
CiscoSpark = require('ciscospark')

function emojiNumber(number){
    switch(Number(number)){
        case 1:
            return "1️⃣"
        case 2:
            return "2️⃣"
        case 3:
            return "3️⃣"
        case 4: 
            return "4️⃣"                               
    }
}


async function airStore(message, bot, option){
    Airtable.configure({
      apiKey: "keyoPw1vi0AN2TbIP"
    })
  
    const base = Airtable.base("appg6ovHFMJF0lH6O")
    const table = base("table")

    process.env.CISCOSPARK_ACCESS_TOKEN = 'MmM2MjA2OTQtMTFhNC00ZDlhLWE2YmItOWZlZjc5OTNkMmIwZTJiZmUxMGMtM2U2_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f';
    const spark1 = new CiscoSpark({
      credentials: process.env.CISCOSPARK_ACCESS_TOKEN
    });


    
  
    //get the record
    table.select({
      view: "Grid view",
      filterByFormula: '{MessageId} = "'+message.messageId+'"'
    }).firstPage((err, records) => {
      if (err) {
        console.error(err)
        return
      }
      
     record_id = records[0].getId()

     //get langauge specific response 
     txt=""
     if(records[0].get("Language")=="English")
        txt="Nice, you are all done!!🎉 You selected option "+emojiNumber(option)+". Catch you in the next question👋."
     else if(records[0].get("Language")=="Korean")
        txt="좋아, 다 끝났어 !!🎉 옵션 "+emojiNumber(option)+"을 선택했습니다. 다음 질문에서 당신을 잡아라👋."



     spark1.messages.create({
        text: "",
        roomId: records[0].get("RoomId"),
        attachments: [{
                    'contentType': 'application/vnd.microsoft.card.adaptive',
                    'content': {
                        "type": "AdaptiveCard",
                        "body": [
                            {
                                "type": "TextBlock",
                                "text": txt,
                                "wrap": true
                            }
                        ],
                        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                        "version": "1.0"
                    }
                }]
        })       

     table.update(record_id, {
        "Option": option
        }, (err, record) => {
            if (err) {
            console.error(err)
            return
            }
      })

      //ret={"Language": records[0].get("Language"), "RecordID": records[0].getId()}
    //   await bot.reply( message, {
    //     text: 'Stats',
    //     attachments: [
    //         {
    //             'contentType': 'application/vnd.microsoft.card.adaptive',
    //             'content': {
    //                 "type": "AdaptiveCard",
    //                 "body": [
    //                     {
    //                         "type": "TextBlock",
    //                         "text": "Nice, you are all done!!🎉 You selected option "+emojiNumber(option)+". Catch you in the next question👋.",
    //                         "wrap": true
    //                     }
    //                 ],
    //                 "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    //                 "version": "1.0"
    //             }
    //         }
    //     ]
    // })

      //2.
      //console.log(records[0].getId())//all records are in the `records` array, do something with it
    })
  };


module.exports = function(controller) {

    controller.adapter.registerAdaptiveCardWebhookSubscription( controller.getConfig( 'webhook_uri' ) );


    controller.on( 'attachmentActions', async ( bot, message ) => {

        let option = message.value.vmlist;
        airStore(message,bot,option)
        //console.log(record)
        bot.deleteMessage({id: message.messageId})
        // await bot.reply( message, {
        //     text: 'Stats',
        //     attachments: [
        //         {
        //             'contentType': 'application/vnd.microsoft.card.adaptive',
        //             'content': {
        //                 "type": "AdaptiveCard",
        //                 "body": [
        //                     {
        //                         "type": "TextBlock",
        //                         "text": "Nice, you are all done!!🎉 You selected option "+emojiNumber(option)+". Catch you in the next question👋.",
        //                         "wrap": true
        //                     }
        //                 ],
        //                 "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        //                 "version": "1.0"
        //             }
        //         }
        //     ]
        // })
    })

    controller.commandHelp.push( { command: 'monitor', text: 'Demo interactive adaptive cards' } );

}
