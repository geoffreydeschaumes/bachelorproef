'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new GoogleAssistant(),
    new JovoDebugger({languageModelDir: './models'}),
    new FileDb()
);

const Player = require('./services/player.js');
const GoogleHandler = require('./google/googleHandler.js');

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
        console.time('ListIntent');
        // Genereert een array [0,1,2,3]
        const indices = Player.getRandomIndices(4);
        // Slaat de indices array op gedurende de sessie zodat deze hergebruikt kan worden.
        this.$session.$data.episodeIndices = indices;
        // Tekst wordt toegevoegd aan de speech variabele
        this.$speech.addText('Here\'s a list of episodes: ');
        // Voor elke nummer in de indices array worden de afleveringen opgehaald. 
        // Deze tekst word dan toegevoegd aan de speach variabele.
        for (let i = 0; i < indices.length; i++) {
            let episode = Player.getEpisode(indices[i]);
            this.$speech.addSayAsOrdinal(`${i + 1}`)
                .addText(episode.title)
                .addBreak("100ms");
        }
        this.$speech.addText('Which one would you like to listen to?');
        this.ask(this.$speech);
        console.timeEnd('ListIntent');
    },

    ChooseFromListIntent() {
            console.time("ChooseFromListIntent");
            // De gebruiker heeft een aflevering gekozen uit de lijst die in ListIntent opgesomd is.
            // Dit wordt verwerkt door het jovo framework en omgezet naar een ordinaal getal.
            var ordinal = 0;
            ordinal = this.$inputs.ordinal;
            // Slaat de indices array op gedurende de sessie zodat deze hergebruikt kan worden.
            let episodeIndices = this.$session.$data.episodeIndices;
            // De keuze wordt met - 1 verlaagd. De gebruiker zegt namelijk "Choose first episode"
            // De first zal omgezet worden naar 1 maar de array begint vanaf 0 te tellen en de eerste
            // episode zal dus te vinden zijn in episodeIndices[0]
            let episodeIndex = episodeIndices[parseInt(ordinal.key) - 1];
            // De currentIndex wordt bijgehouden voor als de gebruiker zou stoppen en de aflevering 
            // opnieuw zou willen opnemen.
            this.$user.$data.currentIndex = episodeIndex;
            // de aflevering word opgehaal. 
            let episode = Player.getEpisode(episodeIndex);
            this.$speech.addText('Enjoy'); 

            // Het jovo framework spreekt het google Assistent platform aan om 
            // gebruik te maken van de media response. 
            // Hierdoor word het mogelijk gemaakt om geluidsfragmenten af te spelen langer dan 120s
            this.$googleAction.$mediaResponse.play(episode.url, episode.title);
            // Door de suggestionChips kan men de aflevering pauzeren of opnieuw starten.
            this.$googleAction.showSuggestionChips(['pause', 'start over']);
            this.ask(this.$speech);
            console.timeEnd("ChooseFromListIntent");
    },

    ResumeIntent() {  
            console.time("resumeIntent")        
            //De huidige index wordt opgehaald
            let currentIndex = this.$user.$data.currentIndex;
            // De aflevering met de huidige index word opgehaald. 
            let episode = Player.getEpisode(currentIndex);
            this.$speech.addText('Resuming your episode.')
            // Het jovo framework spreekt het google Assistent platform aan om 
            // gebruik te maken van de media response. 
            // Hierdoor word het mogelijk gemaakt om geluidsfragmenten af te spelen langer dan 120s
            this.$googleAction.$mediaResponse.play(episode.url, episode.title);
            // Door de suggestionChips kan men de aflevering pauzeren of opnieuw starten.
            this.$googleAction.showSuggestionChips(['pause', 'start over']);
            this.ask(this.$speech);
            console.timeEnd("resumeIntent")
    },

    HelpIntent() {
            console.time("helpIntent");
            // this verwijst naar het jovo framework die een variable $speech aanroept. 
            // Deze variable is de tekst die geretourneerd zal worden door de speaker waarop het Google Assistant platform werkt. 
            this.$speech.addText('You can either listen to episode one or the latest episode or choose from a random list of episodes.')
                .addText('Which one would you like to do?')
            // this.ask retourneerd de speech. 
            this.ask(this.$speech);
            console.timeEnd("helpIntent");
    }
});


app.setGoogleAssistantHandler(GoogleHandler);

module.exports.app = app;