const express = require('express');
var https = require('https')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
var twitter = require('ntwitter');
const app = express();

app.set('port', process.env.PORT || 3002);
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
var original = []
app.get("/cat/:name", (req, res) => {
    var name = original.find(a => { return a.alias == req.params.name }).name
    if (name) {
        fs.exists("./images/" + name, (exists) => {
            if (!exists) {
                res.status(403).send("Sorry! You can't see that.")
            } else {
                var options = {
                    root: path.join(__dirname, 'images/'),
                    dotfiles: 'deny',
                    headers: {
                        'x-timestamp': Date.now(),
                        'x-sent': true
                    }
                }
                var fileName = name
                res.sendFile(fileName, options, function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('Sent:', fileName)
                    }
                })
            }
        });
    }
})
app.get("/original", (req, res) => {

    res.send(original)
})

app.post("/timeline/:user", (req, res) => {
    twit.stream("user", { track: req.params.user }, (data) => {
        data.on('data', (time) => {
            res.send(time)
        })
    })
})

app.post("/cats", (req, res) => {

    var list = [];
    original.forEach((e) => {
        list.push(e.alias);
    })
    res.send(list)
})

app.get("/clip/:name", (req, res) => {
    var name = req.params.name
    fs.exists("./videos/" + name, (exists) => {
        if (!exists) {
            res.status(403).send("Sorry! You can't see that.")
        } else {
            var options = {
                root: path.join(__dirname, 'videos/'),
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            }
            var fileName = name
            res.sendFile(fileName, options, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Sent:', fileName)
                }
            })
        }
    });
})

app.post("/clips", (req, res) => {
    fs.readdir("./videos", (err, fl) => {
        if (err) {
            res.destroy();
        }
        else {
            res.send({ "videos": fl });
        }
    })
})

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
    Array.from(fs.readdirSync('./images')).forEach((e) => {
        original.push({
            name: e,
            alias: randomEl(adjectives) + '' + randomEl(nouns)
        })
    })
})

function randomEl(list) {
    var i = Math.floor(Math.random() * list.length);
    return list[i];
}


var adjectives = ["ohcat", "mremii", "alex", "oshitacat", "likecat", "afuckingcat", "oohcat", "minecat", "aardvark", "albatross", "alligator", "alpaca", "ant", "anteater", "antelope", "ape", "armadillo", "baboon", "badger", "barracuda", "bat", "bear", "beaver", "bee", "bison", "boar", "buffalo", "butterfly", "camel", "capybara", "caribou", "cassowary", "cat", "caterpillar", "cattle", "chamois", "cheetah", "chicken", "chimpanzee", "chinchilla", "chough", "clam", "cobra", "cockroach", "cod", "cormorant", "coyote", "crab", "crane", "crocodile", "crow", "curlew", "deer", "dinosaur", "dog", "dogfish", "dolphin", "donkey", "dotterel", "dove", "dragonfly", "duck", "dugong", "dunlin", "eagle", "echidna", "eel", "eland", "elephant", "elephant-seal", "elk", "emu", "falcon", "ferret", "finch", "fish", "flamingo", "fly", "fox", "frog", "gaur", "gazelle", "gerbil", "giant-panda", "giraffe", "gnat", "gnu", "goat", "goose", "goldfinch", "goldfish", "gorilla", "goshawk", "grasshopper", "grouse", "guanaco", "guinea-fowl", "guinea-pig", "gull", "hamster", "hare", "hawk", "hedgehog", "heron", "herring", "hippopotamus", "hornet", "horse", "human", "hummingbird", "hyena", "ibex", "ibis", "jackal", "jaguar", "jay", "jellyfish", "kangaroo", "kingfisher", "koala", "komodo-dragon", "kookabura", "kouprey", "kudu", "lapwing", "lark", "lemur", "leopard", "lion", "llama", "lobster", "locust", "loris", "louse", "lyrebird", "magpie", "mallard", "manatee", "mandrill", "mantis", "marten", "meerkat", "mink", "mole", "mongoose", "monkey", "moose", "mouse", "mosquito", "mule", "narwhal", "newt", "nightingale", "octopus", "okapi", "opossum", "oryx", "ostrich", "otter", "owl", "ox", "oyster", "panther", "parrot", "partridge", "peafowl", "pelican", "penguin", "pheasant", "pig", "pigeon", "polar-bear", "pony", "porcupine", "porpoise", "prairie-dog", "quail", "quelea", "quetzal", "rabbit", "raccoon", "rail", "ram", "rat", "raven", "red-deer", "red-panda", "reindeer", "rhinoceros", "rook", "salamander", "salmon", "sand-dollar", "sandpiper", "sardine", "scorpion", "sea-lion", "sea-urchin", "seahorse", "seal", "shark", "sheep", "shrew", "skunk", "snail", "snake", "sparrow", "spider", "spoonbill", "squid", "squirrel", "starling", "stingray", "stinkbug", "stork", "swallow", "swan", "tapir", "tarsier", "termite", "tiger", "toad", "trout", "turkey", "turtle", "vicuña", "viper", "vulture", "wallaby", "walrus", "wasp", "water-buffalo", "weasel", "whale", "wolf", "wolverine", "wombat", "woodcock", "woodpecker", "worm", "wren", "yak", "zebra"];
var nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stickfigures", "mermaideggs", "seabarnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "icecream", "ukulele", "kazoo", "banjo", "operasinger", "circus", "trampoline", "carousel", "carnival", "locomotive", "hotairballoon", "prayingmantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "makeupartist", "model", "musician", "penciller", "producer", "scenographer", "setdecorator", "silversmith", "teacher", "automechanic", "beader", "bobbinboy", "clerkofthechapel", "fillingstationattendant", "foreman", "maintenanceengineering", "mechanic", "miller", "moldmaker", "panelbeater", "patternmaker", "plantoperator", "plumber", "sawfiler", "shopforeman", "soaper", "stationaryengineer", "wheelwright", "woodworkers"];
