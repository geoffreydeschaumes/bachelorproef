'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger({languageModelDir: './models'}),
    new FileDb()
);

const Player = require('./services/player.js');
const AlexaHandler = require('./alexa/handler.js');

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    NEW_USER() {
        this.$speech.addText('Welcome to the Podcast Player!')
            .addText('Would you like to begin listening from episode one or rather choose from a list?')
        
        return this.ask(this.$speech);
    },

    LAUNCH() {
        this.$speech.addText('Would you like to resume where you left off or listen to the latest episode?')
        
        this.ask(this.$speech);
    },

    ListIntent() {
            console.time("ListIntent");
            // Genereert een array [0,1,2,3]
            const indices = Player.getRandomIndices(4);
            // Slaat de indices array op gedurende de sessie zodat deze hergebruikt kan worden.
            this.$session.$data.episodeIndices = indices;
            // Tekst wort toegevoegd aan de speech variabele    
            this.$speech.addText('Here\'s a list of episodes: ');
            // Voor elke nummer in de indices array worden de afleveringen opgehaald.
            // Deze tekst word dan toegevoegd aan de speech variabele.
            for (let i = 0; i < indices.length; i++) {
                let episode = Player.getEpisode(indices[i]);
                this.$speech.addSayAsOrdinal(`${i + 1}`)
                    .addText(episode.title)
                    .addBreak("100ms");
            }
            this.$speech.addText('Which one would you like to listen to?');
            this.ask(this.$speech);
            console.timeEnd("ListIntent");   
    },

    ChooseFromListIntent() {
        console.time("ChooseFromListIntent");
        // De gebruiker heeft een aflevering gekozen uit de lijst die in de ListIntent is opgesomd.
        // Dit wordt dan verwerkt door het jovo framework en omgezet naar een ordinaal getal.
        var ordinal = 0;
        ordinal = this.$inputs.ordinal;
        // Slaat de indices array op gedurende de sessie zodat deze hergebruikt kan worden. 
        let episodeIndices = this.$session.$data.episodeIndices;
        // De keuze wordt met 1 verlaagd. De gebruiker zal een zin gebruiken als "Choose the first episode".
        // First zal omgezet worden naar 1 maar de array begint vanaf 0 te tellen en de eerste 
        // aflevering zal dus te vinden zijn onder episodeIndices[0]
        let episodeIndex = episodeIndices[parseInt(ordinal.key) - 1];
        // De currentIndex wordt bijgehouden voor als de gebruiker zou stoppen en de aflevering opnieuw zou willen
        // opnemen. 
        this.$user.$data.currentIndex = episodeIndex;
        // De afleveringwordt opgehaald. 
        let episode = Player.getEpisode(episodeIndex);
        this.$speech.addText('Enjoy'); 
        // Het jovo framework spreekt het Alexa platform aan om gebruik te maken van de audioplayer.
        // Hierdoor is het mogelijk om lange geluidsfragmenten af te spelen. 
        // setOffsetInMilliseconds heeft aan vanaf wanneer het audiofragment moet beginnen spelen. 
        this.$alexaSkill.$audioPlayer
            .setOffsetInMilliseconds(0)
            .play(episode.url, `${episodeIndex}`)
            .tell(this.$speech);
        console.timeEnd("ChooseFromListIntent");     
    },

    ResumeIntent() {
            console.time("resumeIntent")
        // De huidige index wordt opgehaald
        let currentIndex = this.$user.$data.currentIndex;
        // huidige aflevering met de currentIndex wordt opgehaald
        let episode = Player.getEpisode(currentIndex);
        this.$speech.addText('Resuming your episode.')
        // Het jovo framework spreekt het Alexa platform aan om gebruik te maken
        // van de audioPlayer. SetOffsetInMilliseconds(offset) duid op wanneer de 
        // gebruiker gestopt was met het beluisteren van de laatst beluisterde aflevering
        let offset = this.$user.$data.offset;
        this.$alexaSkill.$audioPlayer
            .setOffsetInMilliseconds(offset)
            .play(episode.url, `${currentIndex}`)
            .tell(this.$speech);
            console.timeEnd("resumeIntent")
    },


    HelpIntent() {
        console.time("HelpIntent");
        //this verwijst naar het jovo framework object. 
        // Speech is een variabele dat gebruikt wordt om de virtuele assistent tekst te laten weergeven.
        this.$speech.addText('You can either listen to episode one or the latest episode or choose from a random list of episodes.')
            .addText('Which one would you like to do?')
        //this.ask() retourneert de tekst die aan de speech variabele is toegevoegd.
        this.ask(this.$speech);
        console.timeEnd("HelpIntent");
    }
});

app.setAlexaHandler(AlexaHandler);

module.exports.app = app;