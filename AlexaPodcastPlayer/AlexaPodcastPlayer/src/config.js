// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    logging: true,
 
    intentMap: {
        'AMAZON.StopIntent': 'END',
		'AMAZON.NextIntent': 'NextIntent',
		'AMAZON.PreviousIntent': 'PreviousIntent'
    },
 
    db: {
         FileDb: {
             pathToFile: '../db/db.json',
         }
     },
 };
 