﻿var express = require('express');
var app = express();

//Contains key-value pairs of data submitted in the request body. 
//By default, it is undefined, and is populated when you use body-parsing 
//middleware such as body-parser and multer.
var bodyParser = require('body-parser');
var multer = require('multer');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/test');


var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    roles: [String]
});
var UserModel = mongoose.model('UserModel', UserSchema);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
//to start static content that is insid the public folder
app.use(express.static(__dirname + '/public'));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

//check if the user name and password are valid
passport.use(new LocalStrategy(
function (username, password, done) {

    UserModel.findOne({ username: username, password: password }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
    })
}));



//local is just username and password
app.post("/login", passport.authenticate('local'), function (req, res) {
    res.json(req.user);
});

app.get("/loggedin", function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

//logout
app.post('/logout', function (req, res) {
    req.logOut();
    res.send(200);
});


//Registration
app.post("/register", function (req, res) {
    UserModel.findOne({ username: req.body.username }, function (err, user) {
        if (user)//if user already exist
        {
           // res.send(200);
            res.json(null);
            return;
        }
        else//if user does not exist
        {
            var newUser = new UserModel(req.body);
            //newUser.role = ['student'];//default value if no one give role
            newUser.save(function (err, user) {
                req.login(user, function (err)
                {
                    if (err) { return next(err); }
                    res.json(user);
                });
            });
        }
    });
});


var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);//if not authorized 
    else
        next();//let it through
};


app.get("/rest/user", auth, function (req, res) {
    UserModel.find(function (err, users) {
        res.json(users);
    });
});

//Creating database for comic book
var ComicSchema = new mongoose.Schema({
    picurl: String,
    title: String,
    author: String,
    genres: [String],
    publisher: String,
    description: String,
    ratings:Number
});
var ComicBook = mongoose.model('ComicBook', ComicSchema);

var comic1 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i198770.jpg", title: "20 Seiki Shounen", author: "Urasawa Naoki",
    genres: ["Action", "Mystery", "Tragedy", "Psychological"], publisher: "Shogakukan", 
    description: "Humanity, having faced extinction at the end of the 20th century, would not have entered the new millennium if it weren't for them. In 1969, during their youth, they created a symbol. In 1997, as the coming disaster slowly starts to unfold, that symbol returns. This is the story of a group of boys who try to save the world.",
    ratings:100
});
var comic2 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i213730.png", title: "A Cruel God Reigns", author: "Hagio Moto",
    genres: ["Drama", "Tragedy", "Psychological"], publisher: "Shogakukan",
    description: "Zankoku na Kami ga Shihaisuru portrays the tale of two step-brothers - Jeremy and Ian, as they strive to discover their separate paths towards redemption. Jeremy, a sensitive but outgoing 17 year old, is delighted to hear the news of his neurotic and excitable mothers remarriage to a wealthy British man. However, much to his horror, his sweet-talking new step-father Greg, soon begins to exhibit a disturbing trait...he is a sadistic pedophile and loses no time in making Jeremy his target. Months of horrific, systematic abuse drives Jeremy to desperation; he sabotages his step-fathers car with the hope of eliminating him. The resulting accident, however, kills his mother along with Greg. Jeremy's shocked and guilt-stricken behaviour arouses the suspicions of Greg's free-spirited son, Ian. He unearths enough evidence to tie his step-brother to the crime; but in doing so, also discovers the details of Greg's sexual abuse of Jeremy. Caught in a moral dilemma -- between punishing the criminal and atoning for his father's sins, Ian soon finds himself haunted by lust for Jeremy. Is it lust...or love? He wonders whether he shares his father's proclivities, but finds himself helpless to resist being drawn into a passionate and painful relationship with Jeremy.",
    ratings: 98
});
var comic3 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i89435.png", title: "A Spirit of the Sun", author: "Kawaguchi Kaiji",
    genres: ["Adventure", "Tragedy"], publisher: "Shogakukan",
    description: "Japan is hit by a series of monumental natural disasters that leave the country fragmented and its people devastated. Follow the lives of its citizens as they deal with massive emigration to refugee camps on the Asian mainland and try to solve the political task of rebuilding their nation. A Spirit of the Sun is also a retelling and melding of two well-known stories in Japan. The setting is directly lifted from the early '70s disaster science-fiction book and movie Japan Sinks while many of the characters are allegorical to the key players in the Eastern classic The Three Kingdoms. Sangokushi aficionados may discover greater entertainment by watching the characters in A Spirit of the Sun closely to spot these resemblances.",
    ratings: 97
});
var comic4 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i162161.jpg", title: "Afro Tanaka", author: "Noritsuke Masaharu",
    genres: ["Comedy"], publisher: "Shogakukan",
    description: "Hiroshi Tanaka sports an intense perm which looks like the afro hairstyle favored by some African-Americans back in the 1970's. He doesn't get his hair done at a hair shop, he was actually born with his hair like that. For freedom, Hiroshi moves to Tokyo. He works hard there and, even though he turns 24, he still doesn't have a girlfriend. Meanwhile, a school friend informs Hiroshi that he is going to get married. Hiroshi remembers a promise that they made. Hiroshi is even more impatient to find a girlfriend. A beautiful woman named Aya Kato then moves into the neighborhood.",
    ratings: 95
});
var comic5 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i185182.jpg", title: "Ai Ore!", author: "Shinjo Mayu",
    genres: ["Comedy", "Drama", "Romance"], publisher: "Shogakukan",
    description: "Because Shinjo Mayu stopped her job relationship with Shogakukan, she continued her incomplete manga in Asuka and called it Ai Ore! - Danshikou no Hime to Joshikou no Ouji This can be considered a continuation of Ai (w)o Utau Yori Ore ni Oborero! or even as a second series.",
    ratings: 93
});
var comic6 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i198770.jpg", title: "Backstage Prince", author: "Kanoko Sakurakoji",
    genres: ["Comedy", "Drama", "Romance"], publisher: "Shogakukan",
    description: "Drawn into the exciting world of kabuki theatre, young Akari spends her time after school assisting the famous actor, Shonosuke Ichimura. In the real world, however, this prince of kabuki is actually a high school cutie named Ryusei. The pair's relationship gets off on the wrong foot but eventually, with the help of a cat known as Mr. Ken, the two teenagers fall in love.",
    ratings: 92
});
var comic7 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i188084.jpg", title: "Boku no Hatsukoi o Kimi ni Sasagu", author: "Aoki Kotomi",
    genres: ["Comedy", "Drama", "Romance"], publisher: "Shogakukan",
    description: "Takuma and Mayu's story began when they were only 8 years old. During his childhood, Takuma was constantly hospitalised due to his heart condition. He soon became friends with Mayu, the daughter of the doctor in charge of his case. Day by day they grew closer and closer. However, the summer when Takuma was 8, he made a promise to Mayu that he couldn't keep... Their story unfolds as they grow older and their bond gets stronger...",
    ratings: 90
});
var comic8 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i193363.png", title: "Boku wa Imōto ni Koi o Suru", author: "Aoki Kotomi",
    genres: ["Comedy", "Drama", "Romance"], publisher: "Shogakukan",
    description: "Humanity, having faced extinction at the end of the 20th century, would not have entered the new millennium if it weren't for them. In 1969, during their youth, they created a symbol. In 1997, as the coming disaster slowly starts to unfold, that symbol returns. This is the story of a group of boys who try to save the world.",
    ratings: 90
});
var comic9 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i187152.jpg", title: "Crash B-Daman", author: "Inuki Eiji",
    genres: ["Action", "Adventure", "Comedy", "Fantasy"], publisher: "Shogakukan",
    description: "Yamato Delgado is a young boy burning with a powerful B-DaSpirit. He lives a peaceful life with his foster mother Mie in a quite little town. However, a meeting with the mysterious man called Gray, who is searching for the Legend Stones, throws him into the first of many B-DaBattles to come! Will this boy survive this adventure filled with excitement, challenges and danger? His journey begins right here, right now!",
    ratings: 89
});
var comic10 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i190218.jpg", title: "Dame Oyaji", author: "Furuya Mitsutoshi",
    genres: ["Action", "Comedy", "Drama"], publisher: "Shogakukan",
    description: "Dame Oyaji received the 1979 Shogakukan Manga Award for shōnen manga",
    ratings: 87
});
var comic11 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i191470.jpg", title: "Esper Mami", author: "Fujiko Fujio",
    genres: ["Action", "Adventure", "Comedy", "Fantasy"], publisher: "Shogakukan",
    description: "One day Mami realizes that she has magical powers. Her mother also had those powers, as well as her grandmother. Mami slowly has to learn to live with her abilities, and she gets into a lot of trouble.",
    ratings: 85
});
var comic12 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i119936.png", title: "Freesia", author: "Matsumoto Jiro",
    genres: ["Action", "Drama", "Psychological"], publisher: "Shogakukan",
    description: "Freesia is set in an alternative Japanese society that is at war, and has passed a law legalizing retaliatory killings. If somebody kills your loved one, you are legally sanctioned to kill, or hire someone to kill, the victimizer. The manga is set around a character who works for a firm that specializes in these retaliatory killings.",
    ratings: 88
});
var comic13 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i197560.jpg", title: "Gaku", author: "Ishizuka Shinichi",
    genres: ["Drama", "Sports"], publisher: "Shogakukan",
    description: "As a mountain-rescue volunteer, Shimazaki Sanpo is a man who has scaled the world’s peaks and is well acquainted with the rigors, joys, and splendor of mountains. Many alpinists make their way up mountain trails in the hope of reaching a summit in Japan’s Northern Alps, where Sanpo lives. With comments like “You really hung in there!” and “Make sure you come again!”, he cheers up the climbers as they head back to everyday life.",
    ratings: 81
});
var comic14 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i157995.jpg", title: "Game Center Arashi", author: "Sugaya Mitsuru",
    genres: ["Sports"], publisher: "Shogakukan",
    description: "The story is about a young boy named Arashi Ishino who is obsessed with video games. He would spend all his time trying to beat the games and conquer the local arcades. He would meet competitors like Satoru Daimonji and Ishii, who would try to out match him with higher scores. At a certain point in each episode, he would display his special skill of unleashing a top which will spin so fast that both the top and his hands would catch on fire. On release, the spin would land on or near the cabinet panels, turning the ordinary button into a turbo button thus giving him a major advantage. His appearance is known for being bucktoothed, and he always wears a hat labeled Arashi with a picture of a sprited alien.",
    ratings: 80
});
var comic15 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i90716.jpg", title: "Dr. Koto Shinryoujo ", author: "Yamada Takatoshi",
    genres: ["Drama", "Romance"], publisher: "Shogakukan",
    description: "t is about a young, prominent surgeon, who left a prestigious hospital in Tokyo and moved to an isolated island in the southern part of Japan. He works at a clinic there as the only doctor on the island. First the islanders didn't trust him but slowly he gains their respect.",
    ratings: 82
});
var comic16 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i131958.jpg", title: "Bengoshi no Kuzu  ", author: "Iura Hideo",
    genres: ["Comedy"], publisher: "Shogakukan",
    description: "Bengoshi no Kuzu is about Takeda Masami, a new lawyer and fellow lawyer Kuzu Motohito, who Takeda is teamed up with, and how they deal with different court cases.",
    ratings: 81
});
var comic17 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i120427.png", title: "Hidamari no Ki  ", author: "Tezuka Osamu",
    genres: ["Action","Drama", "Historical"], publisher: "Shogakukan",
    description: "Edo, 1855, in the Hill of the Three Hundred district: Japan's isolationist foreign policy has been lifted, and the era of the Bakumatsu has begun. The samurai Ibuya Manjiro, 26 years old, has just begun his career as low-ranking retainer to the minor daimyo Lord Matsudaira. Tezuka Ryoan, 29, a disciple of Dutch medicine, has just been accepted as a student at Teki Academy in Osaka. Each has a temper to go with his talent, and in a time of brewing upheaval the two are not slow to find trouble, which brings them together in spite of their mutual dislike. Tezuka is called in one night to sew up Ibuya after an illicit duel; a few weeks later, Ibuya finds himself the only thing standing between Tezuka and a gang of swordsmen sent by the head of medicine for the Shogunate ",
    ratings: 79
});
var comic18 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i193567.jpg", title: "Golgo 13  ", author: "Koike Kazuto",
    genres: ["Action", "Adventure", "Drama", "Mystery"], publisher: "Shogakukan",
    description: "For four decades, Golgo 13 has been the world's greatest assassin for hire - sometimes to settle a private score, and sometimes to change history! His real name and nationality are unknown - but his legend is everywhere. G13 never fails a job, and never sees his clients again......unless they try to betray him!",
    ratings: 90
});
var comic19 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i212257.png", title: "Monster  ", author: "Urasawa Naoki",
    genres: ["Horror", "Drama", "Mystery", "Psychological"], publisher: "Shogakukan",
    description: "Monster weaves the riveting story of brilliant Dr. Kenzo Tenma, a famous surgeon with a promising career at a leading hospital. Tenma risks his reputation and promising career to save the life of a critically wounded young boy. Unbeknownst to him, this child is destined for a terrible fate. A string of strange and mysterious murders begin to occur soon afterward, ones that professionally benefit Dr. Tenma, and he emerges as the primary suspect. Conspiracies, serial murders, and a scathing depiction of the underbelly of hospital politics are all masterfully woven together in this compelling manga thriller. ",
    ratings: 84
});
var comic20 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i200155.jpg", title: "Shinya Shokudou  ", author: "Abe Yaro",
    genres: ["Drama"], publisher: "Shogakukan",
    description: "A manga that revolves around an old-fashioned all-night food stall, the various dishes that the stall owner prepares to suit the tastes of different customers, and the joys, griefs, trials and tribulations of his faithful patrons.",
    ratings: 78
});
var comic21 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i201784.jpg", title: "Yamikin Ushijima-kun", author: "Manabe Shohei",
    genres: ["Drama", "Psychological"], publisher: "Shogakukan",
    description: "In recent years, Japan has become the shining light of Asia - with its noteworthy achievements in the fields of Science and Technology, Medicine and the like. But while there are a great number of rich and successful Japanese people, there are even more who are engaged in a furious struggle simply to earn their day-to-day living expenses...all the while battling with dangerous and money-consuming addictions such as gambling and alcoholism. What will these people do when they require the cash to feed the never-ending desires that are part and parcel of being human? How miserable and dangerous might their lives become if they fall into the fearful traps that are set by black market money-lenders with the sole purpose of ensnaring such weak-willed individuals? ",
    ratings: 100
});
var comic22 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i127706.png", title: "Sakamichi no Apollon", author: "Kodama Yuki",
    genres: ["Drama", "Historical", "Romance"], publisher: "Shogakukan",
    description: "Nishimi Kaoru has moved from city to city and school to school because of his father’s job, so having his first day at a new school was just routine for him. Being intellectual in addition to being a transfer student all the time, he has always been seen as an outcast. All he has had to do was bear it as usual until the next time he moved. But things were slightly different this time. First, he started to get close to the class president, Mukae Ritsuko, and secondly, unlikely as it seemed, he grew closer to Kawabuchi Sentaro. Sentaro was infamous for getting into fights, skipping class and was an overall bad boy. Strangely enough, the three of them find common ground in music, namely jazz, and Kaoru finds himself actually enjoying the new town.",
    ratings: 71
});
var comic23 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i207920.png", title: "I Am a Hero", author: "Hanazawa Kengo",
    genres: ["Drama", "Horror"], publisher: "Shogakukan",
    description: "Hideo Suzuki is a thirty-five year old mangaka assistant struggling to be the hero in his own life by breaking back into the lime light with a new serial all the while juggling his relationship with his girlfriend and his own delusions. However, as hard as Hideo may try, the world seems to have a different set of plans for him; sinister and dark machinations that completely overturn his reality as he knows it.",
    ratings: 74
});
var comic24 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i200169.jpg", title: "Mogura no Uta", author: "Takahashi Noboru",
    genres: ["Comedy"], publisher: "Shogakukan",
    description: "Tanibukuro city’s Officer Kikukawa Reiji is the problem child of the police force. He doesn't always follow protocol and he enforces justice through his own personal morals. But it was that exact unwavering sense of righteousness that convinced the chief of police that Reiji was a perfect fit for a top secret undercover mission. He is given the task of infiltrating the Sukiya organization, the biggest and most dangerous mafia group of the Kanto region, and find solid evidence to arrest its leader Todoroki Shuho. But being accepted and trusted in the mafia means Reiji has to do unthinkable things and put himself in dangerous situations where one little slip and his life would be over.",
    ratings: 86
});
var comic25 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i185655.jpg", title: "Azumi", author: "Kozaki Ai",
    genres: ["Action", "Adventure", "Historical"], publisher: "Shogakukan",
    description: "Azumi focuses upon the life of the titular young female assassin. The manga begins an indeterminate number of years after the Battle of Sekigahara. As Azumi begins her duty, the manga introduces its characters into mainstream history. Many of the early missions that Azumi undertakes are the assassinations of the prominent supporters and generals of the Toyotomi Clan, against whom Tokugawa Ieyasu expected to again go to war. The manga reveals that many of the Toyotomi leaders who conveniently died of diseases or accidents prior to the final confrontation between the Toyotomi and Tokugawa were actually victims of assassinations by Azumi and her comrades, thus indicating to the reader when the events were taking place.",
    ratings: 87
});
var comic26 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i207573.jpg", title: "Bobobo-bo Bo-bobo", author: "Sawai Yoshio",
    genres: ["Action", "Comedy"], publisher: "Shuukan Shounen Jump",
    description: "In the year 300X, a cruel dictator has mandated the hunting of all hair in the Maruhage Empire. But a single man rises to the occasion and takes a stand against this violation of human hair rights. Bo-bobo, master of Fist of the Nose Hair, uses the prehensile hairs of his schnoz to most lethal ends. Follow the nonsensical adventures of Bo-bobo and his sentient sidekick snacks as they lead their hilarious rebellion against the Empire.",
    ratings: 89
});
var comic27 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i212212.jpg", title: "Busou Renkin ", author: "Watsuki Nobuhiro",
    genres: ["Action", "Adventure", "Comedy", "Romance"], publisher: "Shuukan Shounen Jump",
    description: "Talk about being at the wrong place at the wrong time! High school student Kazuki Muto had no clue what he was in for when he rescued damsel in distress Tokiko from a monster known as a homunculus. Disguised as humans—who actually eat humans—homunculi are malevolent creatures that affix themselves to people's brains, and once fully grown, the only thing that can annihilate them is a weapon called Buso Renkin! Follow the adventures of Kazuki after he discovers that it was actually Tokiko who saved his life by implanting a kakugane—an alchemical device that transforms into a busou renkin—to replace his heart!",
    ratings: 87
});
var comic28 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i212725.png", title: "Claymore", author: "Yagi Norihiro",
    genres: ["Action", "Fantasy"], publisher: "Shuukan Shounen Jump",
    description: "In a world where monsters called Yoma prey on humans and live among them in disguise, humanity's only hope is a new breed of warrior known as Claymores. Half human, half monster, these silver-eyed slayers possess supernatural strength, but are condemned to fight their savage impulses or lose their humanity completely.",
    ratings: 68
});
var comic29 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i172997.jpg", title: "D.Gray-man", author: "",
    genres: ["Action", "Mystery", "Adeventure", "Comedy"], publisher: "Shuukan Shounen Jump",
    description: "Set in a fictional 19th century England, D.Gray-man is the story of Allen Walker, a 15-year-old boy who roams the earth in search of Innocence. Washed away to unknown parts of the world after the Great Flood, Innocence is the mysterious substance used to create weapons that obliterate demons known as akuma.",
    ratings: 65
});
var comic30 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i213326.png", title: "Death Note", author: "Ohba Tsugumi",
    genres: ["Action", "Drama","Mystery","Psychological"], publisher: "Shuukan Shounen Jump",
    description: "Light Yagami is an ace student with great prospects--and he's bored out of his mind. But all that changes when he finds the Death Note, a notebook dropped by a rogue Shinigami death god. Any human whose name is written in the notebook dies, and now Light has vowed to use the power of the Death Note to rid the world of evil. But when criminals begin dropping dead, the authorities send the legendary detective L to track down the killer. With L hot on his heels, will Light lose sight of his noble goal… or his life?",
    ratings: 100
});
var comic31 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i169311.jpg", title: "Dr.Slump", author: "Toriyama Akira",
    genres: ["Adventure", "Comedy", "Romance"], publisher: "Shuukan Shounen Jump",
    description: "When goofy inventor Senbei Norimaki creates a precocious robot named Arale, his masterpiece turns out to be more than he bargained for! ",
    ratings: 77
});
var comic32 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i212199.jpg", title: "Dragon Ball Z", author: "",
    genres: ["Action", "Adventure", "Comedy", "Fantasy"], publisher: "Shuukan Shounen Jump",
    description: "A fated clash!! A battle surpassing gods begins — !!!! After peace returned to Earth following the battle with God of Destruction Beerus, the surviving remnants of Frieza’s forces,Sorbet and Tagoma, approached, seeking the Dragon Balls. Their objective: to revive Frieza in order to bring his forces back to power. That worst wish in history is granted at last, and the resurrected Frieza plots his vengeance against Goku and the other Saiyans... And so, Frieza’s new army advances on Earth, and Gohan,Piccolo, and Krillin clash with a thousand soldiers. Goku and Vegeta challenge Frieza to a fated duel, but Frieza had attained an overwhelming power-up! Allow me to show you… my further evolution!",
    ratings: 98
});
var comic33 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i116875.png", title: "Dragon Drive  ", author: "Sakura Kenichi",
    genres: ["Action", "Adventure", "Fantasy"], publisher: "Shuukan Shounen Jump",
    description: "Reiji Ozora thinks he's no good at anything--especially schoolwork! Then one day he's introducted to a game called Dragon Drive and gets his very own virtual dragon named Chibi. Small and weak, Chibi appears to be as big a loser as Reiji! But after their first battle, Reiji realizes there may be more to his tiny friend than meets the eyes.",
    ratings: 65
});
var comic34 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i121436.png", title: "Gun Blaze West  ", author: "Watsuki Nobuhiro",
    genres: ["Adventure"], publisher: "Shuukan Shounen Jump",
    description: "19th century, America - Legend has it that in the far West lies a sacred land called Gun Blaze West, and only the strong are able to set foot in that land. Viu Bannes, a cheerful and persistent boy, aspires to become a gunshooter and yearns to travel to the West to test his strength. He befriends a vagabond, Marcus Homer, and they both decide to set off on a journey to find Gun Blaze West. Thus an exciting journey to the West begins...",
    ratings: 69
});
var comic35 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i197664.png", title: "Hikaru no Go ", author: "Hotta Yumi",
    genres: ["Drama", "Sports"], publisher: "Shuukan Shounen Jump",
    description: "A regular school boy, Hikaru Shindo stumbles upon an old GO board while looking through his grandpa's old storage room for something worth money. From inside the board came an old spirit named Sai who once dedicated his life to GO. Together, Sai continues to search for the move people call The god's hand while Hikaru slowly began interest in this ancient game and walks down the road of GO.",
    ratings: 59
});
var comic36 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i199472.jpg", title: "Houshin Engi ", author: "Fujisaki Ryu",
    genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy"], publisher: "Shuukan Shounen Jump",
    description: "Once, there were two worlds that existed on this earth. In the sky where the deities lived was the Senninkai. On the ground where, of course, the people lived was Ningenkai. In the novel adaptation by Ryu Fujisaki, Houshin Engi follows Taikoubou on his mission to rid the Ningenkai of the evil immortals that have resided there. This colorful historically set manga keeps the reader on their feet and loving every minute of the in-depth characters and exciting adventures",
    ratings: 60
});
var comic37 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i213810.jpg", title: "Hunter x Hunter", author: "Togashi Yoshihiro",
    genres: ["Action", "Adventure", "Drama", "Fantasy"], publisher: "Shuukan Shounen Jump",
    description: "Hunters are a special breed, dedicated to tracking down treasures, magical beasts, and even other men. But such pursuits require a license, and less than one in a hundred thousand can pass the grueling qualification exam. Those who do pass gain access to restricted areas, amazing stores of information, and the right to call themselves Hunters.",
    ratings: 98
});
var comic38 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i132399.png", title: "Phantom Blood", author: "Araki Hirohiko",
    genres: ["Action", "Historical", "Adventure", "Drama","Horror"], publisher: "Shuukan Shounen Jump",
    description: "Phantom Blood stars Jonathan Joestar and the ambitious Dio Brando. It shows how the stone mask was found and how Dio first obtained and utilized his powers. Once Jonathan and Robert E. O. Speedwagon realize Dio's intentions, they must team up with Will A. Zeppeli and learn Ripple (Hamon) to stop Dio",
    ratings: 94
});
var comic39 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i53044.jpg", title: "Naruto", author: "Kishimoto Masashi",
    genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy"], publisher: "Shuukan Shounen Jump",
    description: "Twelve years ago, the powerful Nine-Tailed Demon Fox attacked the ninja village of Konohagakure. The demon was quickly defeated and sealed into the infant Naruto Uzumaki, by the Fourth Hokage who sacrificed his life to protect the village. Now Naruto is the number one knucklehead ninja who's determined to become the next Hokage and gain recognition by everyone who ever doubted him!",
    ratings: 80
});
var comic40 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i211287.png", title: "One Piece", author: "Oda Eiichiro",
    genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy"], publisher: "Shuukan Shounen Jump",
    description: "As a child, Monkey D. Luffy dreamed of becoming the King of the Pirates. But his life changed when he accidentally gained the power to stretch like rubber...at the cost of never being able to swim again! Now Luffy, with the help of a motley collection of nakama, is setting off in search of One Piece, said to be the greatest treasure in the world...",
    ratings: 100
});
var comic41 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i213741.jpg", title: "Rurouni Kenshin", author: "Watsuki Nobuhiro",
    genres: ["Action", "Comedy", "Drama", "Historical","Romance"], publisher: "Shuukan Shounen Jump",
    description: "140 years ago in Kyoto, with the coming of the American Black Ships, there arose a warrior who, felling men with his bloodstained blade, gained the name Hitokiri, man slayer! His killer blade helped close the turbulent Bakumatsu era and slashed open the progressive age known as Meiji . Then he vanished, and with the flow of years, became legend. Ten years later, a young woman's life is saved when she happens upon a strange wandering swordsman named Kenshin. The young woman accepts the wanderer into her dojo, despite his secretive past, and the two become fast friends. As their relationship grows, they meet and make more friends (as well as enemies), and they grow accustomed to their life together. However, one man can only run from his past for so long, and it isn't long before Kenshin is forced to face the life he thought he'd left behind. Now, together with his friends, he must fight the ghosts of his past if he wants the people he loves to have any kind of future.",
    ratings: 97
});
var comic42 = new ComicBook({
    picurl: "https://www.mangaupdates.com/image/i132499.jpg", title: "Bleach", author: "Kubo Tite",
    genres: ["Action", "Mystery", "Tragedy", "Psychological"], publisher: "Shuukan Shounen Jump",
    description: "",
    ratings: 95
});
var comic43 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i212395.jpg", title: "Slam Dunk", author: "Inoue Takehiko",
    genres: ["Comedy", "Drama", "Sports"], publisher: "Shuukan Shounen Jump",
    description: "Winning isn't everything in the game of basketball, but who wants to come in second? It takes dedication and discipline to be the best, and the Shohoku High hoops team wants to be just that. They have one last year to make their captain's dream of reaching the finals come true--will they do it? Takehiko Inoue's legendary beloved basketball manga is finally here and the tale of a lifetime is in your hands. Hanamichi Sakuragi's got no game with girls—none at all! It doesn't help that he's known for throwing down at a moment's notice and always coming out on top. A hopeless bruiser, he's been rejected by 50 girls in a row! All that changes when he meets the girl of his dreams, Haruko, and she's actually not afraid of him! When she introduces him to the game of basketball, his life is changed forever...",
    ratings: 100
});
var comic44 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i204464.jpg", title: "Ichigo 100%", author: "Kawashita Mizuki",
    genres: ["Comedy","Drama", "Romance"], publisher: "Shuukan Shounen Jump",
    description: "The hero (me, Junpei Manaka!) sneaks up to the roof to see the sunset. When he opens the door, he startles a mysterious beauty. She panics and runs away, but not before Junpei has caught sight of her adorable strawberry print panties...in EXTREME close-up. With that vision forever burned into his memory, Junpei embarks on a quest to find the girl, and the panties, of his dreams!",
    ratings: 49
});
var comic45 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i134406.png", title: "Tennis no Ouji-sama", author: "Konomi Takeshi",
    genres: ["Action", "Comedy", "Drama", "Sports"], publisher: "Shuukan Shounen Jump",
    description: "Ryoma Echizen just joined the Seishun Academy's tennis team, which is known for being one of the most competitive teams in Japan. Its members are incredibly talented, gifted, and athletic. With rigorous and extremely intense practices, the upperclassmen of the team expect the very best from themselves and they expect even more from the new members of the team. While most of the freshmen are on pins and needles hoping they won't get cut from the team, Ryoma Echizen is confident, cool, and collected. Some might even say he's cocky, but at least he's got the skills to back up his attitude. With his virtually unreturnable twist serve, Ryoma is sure to make the starting team. Join Ryoma and the other first years, as they train hard, make friends, and try to find a place for themselves on the team. And meet Ryoma's cute but chronically shy classmate Sakuno Ryuzaki. She's got a big crush on Ryoma, but will he ever notice her? Ryoma Echizen is the Prince of Tennis. He may be ready for the Seishun Academy tennis team, but are they ready for him?!",
    ratings: 86
});
var comic46 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i213407.jpg", title: "Kinnikuman", author: "Yudetamago",
    genres: ["Action", "Adventure", "Comedy", "Sports"], publisher: "Shuukan Shounen Jump",
    description: "Kinnikuman (Muscleman), a weak and clumsy super hero, constantly getting into wacky situations. As the series progressed, the story began changing from comedy to action as Kinnikuman battles stronger and stronger foes in the wrestling ring. The series continually introduced new Super Human characters, known as Chyo-jins, who would challenge Kinnikuman and his friends for various purposes.",
    ratings: 64
});
var comic47 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i165255.jpg", title: "Yu-Gi-Oh", author: "Takahashi Kazuki",
    genres: ["Adventure", "Comedy", "Fantasy"], publisher: "Shuukan Shounen Jump",
    description: "Sitting by himself in the back of the class, 10th-grader Yugi always had his head in some game--until he solved the Millennium Puzzle, an Egyptian artifact containing the spirit of a master gambler from the age of the pharaohs! Awakened after three thousand years, the King of Games possesses Yugi, recklessly challenging bullies and evil-doers to the Shadow Games, where the stakes are high, and even the most ordinary bet may result in weirdness and danger beyond belief! Let the games...begin!",
    ratings: 76
});
var comic48 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i139859.jpg", title: "Yu Yu Hakusho", author: "Togashi Yoshihiro",
    genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy"], publisher: "Shuukan Shounen Jump",
    description: "Yusuke Urameshi was a tough teen delinquent until one selfless act changed his life... by ending it. When he died saving a little kid from a speeding car, the afterlife didn't know what to do with him, so it gave him a second chance at life. Now, Yusuke is a ghost with a mission, performing good deeds at the behest of Botan, the ferrywoman of the River Styx, and Koenma, the pacifier-sucking judge of the dead.",
    ratings: 99
});
var comic49 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i162078.jpg", title: "Shaman King", author: "Takei Hiroyuki",
    genres: ["Action", "Adventure", "Comedy", "Drama"], publisher: "Shuukan Shounen Jump",
    description: "Yoh Asakura is a shaman--one of the gifted few who, thanks to training or natural talent, can channel spirits that most people can't even see. With the help of his fiancée, Anna, Yoh is in training for the ultimate shaman sports event: the Shaman Fight in Tokyo, the once-every-500-years tournament to see who can shape humanity's future and become the Shaman King. But unfortunately for Yoh, every shaman in the world is competing for the same prize…",
    ratings: 95
});
var comic50 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i211208.jpg", title: "World Trigger", author: "Ashihara Daisuke",
    genres: ["Action", "Comedy"], publisher: "Shuukan Shounen Jump",
    description: "A gate to another dimension has burst open, and from it emerge gigantic invincible creatures that threaten all of humanity. Earth's only defense is a mysterious group of warriors who have co-opted the alien technology in order to fight back!",
    ratings: 62
});
var comic51 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i210448.jpg", title: "Kuroko no Basuke", author: "Fujimaki Tadatoshi",
    genres: ["Comedy", "Drama", "Sports"], publisher: "Shuukan Shounen Jump",
    description: "Kuroko is a member from the legendary middle school basketball team known as The Generation of Miracles, and while nobody seems to know about him, the main five players of the team all admit that he is the strongest member, the phantom sixth player. When he joins the high-school basketball team, everyone is surprised to find out that he is small, weak, and easy to miss.",
    ratings: 93
});
var comic52 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i211837.png", title: "Ansatsu Kyoushitsu", author: "Matsui Yuusei",
    genres: ["Comedy", "Action"], publisher: "Shuukan Shounen Jump",
    description: "The story is about class 3-E of Kunugigaoka Middle School where every morning they greet their sensei with a massive firing squad. The sensei is a weird combination of an alien and a octopus that moves at speeds of mach-20. It turns out this creature was responsible for the destruction of the moon, rendering it forever in a crescent shape. He has announced that he will destroy the world in one year. The creature will teach class 3-E how to assassinate him before the year is over.",
    ratings: 90
});
var comic53 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i126654.jpg", title: "24 no Hitomi", author: "Kurashima Kei",
    genres: ["Comedy"], publisher: "Shuukan Shounen Champion",
    description: "There are liars in this world and then there,'s the school teacher Hitomi. She is beautiful, but lies to everyone on a constant basis from her students and faculty to random people. It causes major headaches to everyone around her since they never know what she is really conveying at any point in their conversation. Some lies are hard to tell and some are extravagant and obvious but somehow at the end of their conversation, Hitomi has reached out to them and changed their lives in a significant way.",
    ratings: 49
});
var comic54 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i141629.png", title: "Alabaster", author: "Tezuka Osamu",
    genres: ["Action", "Mystery"], publisher: "Shuukan Shounen Champion",
    description: "James Block is a former sports star whose criminal endeavors landed him in jail. In prison he meets Dr. F, a strange old man who tells James about a beam that can turn living things invisible. After escaping from prison, James finds and uses the laser on himself. But, because the beam has not been perfected yet, it only rendered his skin invisible, leaving his insides visible to the outside. Angered at his disfigurement, James takes the name Alabaster and begins eliminating the hypocrites and the boastful. He is joined by Ami Ozawa, the granddaughter of Doctor F, who was rendered invisible after the doctor used his pregnant daughter as an F Beam test subject.",
    ratings: 57
});
var comic55 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i208629.jpg", title: "Akumetsu", author: "Tabata Yoshiaki",
    genres: ["Action", "Drama", "Comedy"], publisher: "Shuukan Shounen Champion",
    description: "Nagasawa Shiina is just an average 3rd year high school student until her parents' company goes bankrupt. In order to pay the bills, she sells herself into prostitution. At her first job, a mysterious masked man crashes the party... and it's someone she knows. ",
    ratings: 52
});
var comic56 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i205448.jpg", title: "Angel Voice", author: "Koyano Takao",
    genres: ["Comedy", "Sports"], publisher: "Shuukan Shounen Champion",
    description: "This school is known for its football club Ranzan, a refuge from the head of the largest departments. To avoid disbanding the club, the manager using the new football coach: Tetsuo Kuroki. He will choose to form teams with the strongest students. And indeed, four of them come to integrate the school. Among them Shingo Narita, a student is turbulent but not a bad person who does not hesitate to fight to defend his colleagues. When he proposed to join the club soccer, a sport he practiced a few years ago, his enthusiasm took over. Through sport, Professor Kuroki will teach them that there are other solutions that come from a single blow.",
    ratings:66
});
var comic57 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i115652.jpg", title: "Kakugo no Susume", author: "Yamaguchi Takayuki",
    genres: ["Comedy", "Action", "Horror"], publisher: "Shuukan Shounen Champion",
    description: "A series of natural disasters has reduced the world to rubble, with the survivors doing whatever they must to survive in a world gone mad. But one young boy, Kakugo, gifted with amazing martial arts and a superpowerful suit of armor by his late father, has been charged with making the world (or at least his school) a safer place. But his sister has a matching set of skills and equipment, and she`s on a mission to bring peace to the world... by wiping out humanity!",
    ratings: 61
});
var comic58 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i157048.jpg", title: "Grappler Baki", author: "Itagaki Keisuke",
    genres: ["Action", "Martial Arts"], publisher: "Shuukan Shounen Champion",
    description: "To be the strongest in the world! That is Baki Hanma's dream. The mysterious, young, martial artist aspires to follow in his sinister father's footsteps as the world's strongest creature. But to what lengths will Baki go? We follow the young grappler as he matures in a world full of some of the strongest fighters and how he overcomes all obstacles in order to face his father one day in the fighting ring. From the jungles to and underground martial arts tournament, Baki is put to the test from fighters all over the world.",
    ratings: 98
});
var comic59 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i131705.jpg", title: "Baron Gong Battle", author: "Taguchi Masayuki",
    genres: ["Action"], publisher: "Shuukan Shounen Champion ",
    description: "An Ancient Terror…REBORN! The worst living weapon was a super creature from ancient times…the Neo Hume, and the Nazis have brought it back. Only one man has ever encountered the Neo Hume and lived…Baron Gong! The stakes are high. Their power is incredible. The destruction will be terrible. The battle to save humanity begins NOW!",
    ratings: 44
});
var comic60 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i113647.jpg", title: "Black Jack", author: "Tezuka Osamu",
    genres: ["Adventure", "Drama", "Horror","Psychological","Tragedy"], publisher: "Shuukan Shounen Champion",
    description: "Black Jack is a genius surgeon who never acquired his license due to his clashes with the medical establishment. He is hired out by anyone willing to pay his exorbitant rates and is perceived as a heartless rogue because of his enigmatic nature and antisocial manner. But that is not the whole story...",
    ratings: 89
});
var comic61 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i189870.jpg", title: "Crows", author: "Takahashi Hiroshi",
    genres: ["Comedy", "Action"], publisher: "Shuukan Shounen Champion",
    description: "Bouya Harumichi is a new transfer student to Suzuran all-boys high school, a place where only the worst delinquents assemble. Due to its large amount of delinquents who are hated by the general people for their inauspiciousness, similarly to crows, it is also known as Crows High School. Harumichi is an insanely strong fighter but has an irresponsible personality. How will he act in this new environment where everyone is a delinquent?",
    ratings: 96
});
var comic62 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i189924.jpg", title: "Cutey Honey", author: "Nagai Go",
    genres: ["Comedy", "Action"], publisher: "Shuukan Shounen Champion",
    description: "Honey Kisaragi is a normal catholic schoolgirl. That is, until her father was murdered by the Panther Claws who were seeking the Airbourne Elemental Fixation Device. She then finds out that she is actually an android created by him with the Airbourne Elemental Fixation Device within her. She is now trying to live a life as a normal schoolgirl and seeking revenge against Panther Claw.",
    ratings: 42
});
var comic63 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i144226.jpg", title: "Don Dracula", author: "Tezuka Osamu",
    genres: ["Comedy", "Fantasy"], publisher: "Shuukan Shounen Champion",
    description: "After living in Transylvania for several years, Earl Dracula (as Osamu Tezuka's official website calls him in English) has moved to Japan. In the Nerima Ward of Tokyo, he and his daughter, Chocola, and faithful servant Igor continue to live in the castle.",
    ratings: 53
});

var comic64 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i144855.jpg", title: "Drop", author: "Shinagawa Hiroshi",
    genres: ["Action"], publisher: "Shuukan Shounen Champion",
    description: "In the last summer of his middle-school life, he decides to become a delinquent. He leaves his prestigious private school and drops out to start leading a life as a delinquent. Now he is a member of the gang that rules Komae Kita Middle School, hiding the fact that he is an amateur at being a delinquent. He stays and fights together with Iguchi Tatsuya, a leader of a gang and a delinquent who Hiroshi aims to be like.",
    ratings: 97
});
var comic65 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i159073.jpg", title: "Goblin Koushaku", author: "Tezuka Osamu",
    genres: ["Action"], publisher: "Shuukan Shounen Champion",
    description: "Chinki has a precognitive dream in which he excavates the Todaiki from the ruins of Angyang in China - a bronze giant that is actually a massive psychokinetic robot. When Chinki discovers Aiai's soul can activate the robot, he dubs himself Duke Goblin and attempts to use the Todaiki's power to rule to world. Only the priest Tenran and his student Kanichi can stop him and return Aiai's trapped soul to her body.",
    ratings: 78
});
var comic66 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i192783.jpg", title: "Gang King", author: "Yanauchi Daiju",
    genres: ["Comedy", "Action"], publisher: "Shuukan Shounen Champion",
    description: "The lead character, Jimmy (Katsuya Oonishi) is an art student at Bara-Gaku ('Bara Juuji Gakuin'; Rose-Cross Academy). When he was little, he almost drowned, but was saved by a tattoo artist. From that day, Jimmy vowed to become a tattoo artist (because tattoos signify 'a hero' to him). Jimmy's a decent person by nature, but because of the people he hangs out with, he's considered a delinquent. Banko, his partner-in-crime, is a shrewed kid; he sells information on the popular girls (phone numbers, likes and dislikes, etc) in the area. Despite the delinquent exterior, Banko is actually really smart and has broad general knowledge. As the story progresses, Jimmy and Banko meet new people and they form a gang of their own; along the way they bump heads with other gangs from other schools/districts. This manga is not the typical highschool-slice-of-life story; it's got a rougher edge! This manga depicts some high school delinquents trying to get through high school life and gang fights. Okay no, mostly just gang fights.",
    ratings: 76
});
var comic67 = new ComicBook({
    picurl: "https://www.mangaupdates.com/image/i2127.jpg", title: "Gonta!", author: "Nami Taro",
    genres: [ "Action", "Sports"], publisher: "Shuukan Shounen Champion",
    description: "Umeboshi Kinya lives only for the sole purpose to fight and become stronger. But since he became the king of the baston, nobody dares to be measured. Kinya So bored and depressed ... It takes the hair of the beast and heard talk of a potential adversary that it will be a pleasure to go cause! He landed in a boxing hall where it does not happen as it really would have thought ... So? Who is the strongest now?!",
    ratings: 68
});
var comic68 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i195107.jpg", title: "Hanma Baki", author: "Itagaki Keisuke",
    genres: ["Action", "Drama", "Martial Arts","Sports"], publisher: "Shuukan Shounen Champion",
    description: "The sequel to the Baki series, supposed to concentrate around the conflict of Baki vs his father",
    ratings: 90
});
var comic69 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i127421.png", title: "Hungry Heart  ", author: "Takahashi Yoichi",
    genres: ["Comedy", "Romance", "Sports"], publisher: "Shuukan Shounen Champion",
    description: "Kyosuke Kano has lived under the shadow of his successful brother Seisuke all his life who is a professional soccer player. Tired of being compared and downgraded at, he abandoned playing soccer until a boy from his new high school discovered him and asked him to join their team. Kyosuke joins it and befriends two other first year players named Rodrigo and Sakai with the dream of becoming professional soccer players themselves.",
    ratings: 68
});
var comic70 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i198642.jpg", title: "Maji!", author: "Tachihara Ayumi",
    genres: ["Drama", "Action"], publisher: "Shuukan Shounen Champion",
    description: "Experience the life of a young member of the Japanese mafia. Our main character, Maji, lives his daily life as part of the Nagisa-gumi, protecting the locals and running their turf. He may not be the smartest man in the world, but he has the guts and attitude to become a great Japanese mafia member",
    ratings: 96
});
var comic71 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i164399.jpg", title: "Mitsudomoe  ", author: "Sakurai Norio",
    genres: ["Comedy"], publisher: "Shuukan Shounen Champion",
    description: "The somewhat precocious and sadistic girl 'Mitsuba', the somewhat lecherous muscle girl 'Futaba', and the somewhat mysterious girl 'Hitoha'. Better known as the (mischievous) Marui Sisters, this is the story of how these three triplets go about their days in Class 6-3 with their cute yet wild antics.",
    ratings: 42
});
var comic72 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i154529.jpg", title: "Mai-Otome", author: "Higuchi Tatsuhito",
    genres: ["Comedy", "Drama", "Fantasy", "Romance"], publisher: "Shuukan Shounen Champion",
    description: "Mashiro-hime has just transferred to the all-girls school, Garderobe...but little do the other students know, she's actually a boy. Desperate to escape an all-boys school where he was looked down upon, he disguised himself as the late Mashiro-hime to get in. Unfortunately, due to her royal status, members of an organization known as Shwarz are trying to assassinate him, and all the while, he's trying to break his Contract with Arika Yumemiya, who unexpectedly became his Otome to protect him from a member of Shwarz.",
    ratings: 53
});
var comic73 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i50845.jpg", title: "Punisher", author: "Sadogawa Jun",
    genres: ["Action", "Adventure"], publisher: "Shuukan Shounen Champion",
    description: "Recounts the journeys of a sword-wielding boy named Aruto and his female companion.",
    ratings: 43
});
var comic74 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i86205.jpg", title: "Scryed", author: "Kuroda Yousuke",
    genres: ["Action", "Adventure"], publisher: "Shuukan Shounen Champion",
    description: "22 years ago a mysterious seismic phenomenon rocked the Yokohama district, thrusting it miles into the sky and effectively separating it from the rest of Japan. In the following years, a fraction of the newborns in this fledgling world began to develop extraordinary powers, each unique to the personality of the possessor. These mutated humans became known as Alters and were responsible for turning the former Yokohama into a chaotic wasteland. Now, as the former metropolis continues to re-build itself, the Alters have fallen into two camps: those who have joined HOLY, a dogmatic organization that hopes to re-establish order and morality, and those who wish to lord over the comparatively weaker humans. Only Kazuma, a powerful Alter who's really only interested in looking out for himself and an orphan girl named Kanami, stands between them, suspicious of both sides and unaware that he may hold the key to harmonious co-existence.",
    ratings: 59
});
var comic75 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i130500.jpg", title: "Shounan Bakusouzoku", author: "Yoshida Satoshi",
    genres: ["Action", "Comedy"], publisher: "Shuukan Shounen Champion",
    description: "Meet Eguchi Yoosuke, leader of a high-school Biker Gang AND the school's handicrafts club. Which means he divides his time between fist fights and fancy needlework. And if you think he's weird, wait until you meet the rest of his gang...",
    ratings: 71
});
var comic76 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i213630.jpg", title: "Yowamushi Pedal", author: "Watanabe Wataru",
    genres: ["Comedy", "Drama", "Sports"], publisher: "Shuukan Shounen Champion",
    description: "Otaku Sakamichi Onoda has just entered high school and plans to join the anime club. In middle school, Onoda didn’t have any friends with whom he could talk about anime, games, Akihabara and other otaku things, and he is hoping he can make such friends in the anime club, but he finds out it's been disbanded. In order to reestablish the club he tries to find four other people who would like to join. Since he was a little boy, Onoda has ridden his mamachari–a bulky bicycle with a step-through frame mainly used for short rides, such as for casual fun or to pick up groceries–to go to Akihabara every week to check out or buy otaku things. Fellow freshman Shunsuke Imaizumi and bicyclist, while training, notices a boy (Onoda) riding his mamachari up a steep road. Freshman and road racing cyclist, Shokichi Naruko visits Akihabara to get some Gundam plastic models for his younger brothers and meets Onoda who catches his attention because of his cycling skill on the mamachari and later find out they go to the same school. Later on, both Naruko and Imaizumi try to convince him to join the bicycle racing club, but will he?",
    ratings: 65
});
var comic77 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i179748.jpg", title: "Worst", author: "Takahashi Hiroshi",
    genres: ["Comedy", "Drama", "Action"], publisher: "Shuukan Shounen Champion",
    description: "Worst is a high-impact, gang-related title that deals with teenage boys fighting their way through high school in order to gain respect. There is no room for deceit and underhanded tricks at the notorious High School Suzuran. These young men follow a strict honor code when it comes to brawling, reminiscent of the mafia in the early days. ",
    ratings: 97
});
var comic78 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i163168.jpg", title: "Ahiru no Sora", author: "Hinata Takeshi",
    genres: ["Comedy", "Drama", "Sports"], publisher: "Shuukan Shounen Magazine",
    description: "He's short, weak, and has just transferred to a new school. Kurumatani Sora is the main character in this story who loves basketball. He has been shooting hoops ever since he was little and has been trying to grow tall just like his mother, who used to be a basketball player. What happened to her and what Sora will do at the new school is all up to you to find out!",
    ratings: 74
});
var comic79 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i213174.png", title: "Acma:Game", author: "",
    genres: ["Action", "Psychological"], publisher: "Shuukan Shounen Magazine",
    description: "The manga centers around Teruasa Oda, a high school senior gifted in smarts, looks, and money. This seemingly perfect scion of Japan's powerful Oda Group gets caught in a nightmarish game with the son of the Belmont mafia family's boss.",
    ratings: 63
});
var comic80 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i206357.jpg", title: "Aho Girl", author: "Hiroyuki",
    genres: ["Comedy"], publisher: "Shuukan Shounen Magazine",
    description: "This 4-koma style manga features Yoshiko, a genuinely stupid girl (she can even manage to get all 0's on multiple choice tests.). She hangs out at school with her childhood friend, who she claims to like, and he has to put up with all her ridiculous behavior! ",
    ratings: 40
});
var comic81 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i207015.jpg", title: "GTO", author: "Fujisawa Tohru",
    genres: ["Comedy", "Drama"], publisher: "Shuukan Shounen Magazine",
    description: "Meet Eikichi Onizuka, a 22-year-old ex-biker. He's crude, foul-mouthed, and has a split-second temper. His unlikely goal: to be the Greatest High School Teacher in the World! Of course, the only reason he wants to be a teacher is so he can try to score with the hot students... Before he can become a full instructor, he's got to work as a student teacher to earn his credentials.  Onizuka may think he's the toughest guy on campus, but when he meets his class full of bullies, blackmailers, and scheming sadists, he'll have to prove it.",
    ratings: 98
});
var comic82 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i207016.jpg", title: "GTO - Shonan 14 Days ", author: "Fujisawa Tohru",
    genres: ["Comedy", "Drama", "Sports"], publisher: "Shuukan Shounen Magazine",
    description: "This is the sequel to the manga GTO (Great Teacher Onizuka). This takes place directly after the Teshigawara arc.",
    ratings: 94
});
var comic83 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i210803.jpg", title: "GTO - Paradise Lost", author: "Fujisawa Tohru",
    genres: ["Comedy", "Drama", "Sports"], publisher: "Shuukan Shounen Magazine",
    description: "Onizuka is a prisoner. For reasons that he only knows, he tells the story himself of what happened between him and Class G (which is basically an idol class), expect many troubles, adventures and of course many hilarious moments. GTO - Paradise Lost is a sequel to GTO and Onizuka is now 24 years old as well.",
    ratings: 95
});
var comic84 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i98961.jpg", title: "Shounan Junaigumi!", author: "Fujisawa Tohru",
    genres: ["Comedy", "Drama", "Sports"], publisher: "Shuukan Shounen Magazine",
    description: "Before Ekichi Onizuka would become the Greatest Teacher in the World, he and Ryuji Danma were members of the infamous biker gang, Oni Baku. When they weren't out riding around and getting into trouble, this duo could be found in school. ",
    ratings: 100
});
var comic85 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i191395.jpg", title: "Area no Kishi", author: "Igano Hiroaki",
    genres: ["Comedy", "Drama", "Sports"], publisher: "Shuukan Shounen Magazine",
    description: "Aizawa Kakeru is an energetic and dedicated eighth grader who serves as the manager for his school’s football team. Though he was well known for being a talented player the previous year, an accident during one of his games caused Kakeru to vow never to play competitively again. Still passionate about the sport, Kakeru dreams of one day becoming a professional football trainer so that he can work alongside his older brother Suguru, the ace of the school team who has represented Japan in international competition.",
    ratings: 82
});
var comic86 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i160084.jpg", title: "Baby Steps", author: "Katsuki Hikaru",
    genres: ["Comedy", "Drama", "Sports","Romance"], publisher: "Shuukan Shounen Magazine",
    description: "Maruo Eiichirou (Ei-Chan), a first year honor student, one day decides he's unhappy with the way things are and lacks exercise. His mother gives him a flyer for the local Tennis Club and he decides to check it out. He's instantly captivated by it. With no prior experience and poor physical conditioning, join Ei-Chan as he embarks on a tennis journey using his smarts, dedication and work ethic.",
    ratings: 45
});
var comic87 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i202989.jpg", title: "Daiya no A", author: "Terajima Yuuji",
    genres: ["Comedy", "Sports"], publisher: "Shuukan Shounen Magazine",
    description: "It is a manga of high-school baseball. The main character, who starts as pitcher from a country middle school, gets teamed up with a catcher from a school with an elite baseball team. He decides to leave the countryside to attend the school that this catcher plays for...",
    ratings: 80
});
var comic88 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i191390.jpg", title: "Days", author: "Yasuda Tsuyoshi",
    genres: ["Sports"], publisher: "Shuukan Shounen Magazine",
    description: "Two boys met on a stormy night: Tsukushi, a boy with no special traits at all, and Jin, a soccer genius. On that night, Jin drags Tsukushi into the world of high-school soccer.",
    ratings: 78
});
var comic89 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i212493.png", title: "Domestic na Kanojo", author: "Sasuga Kei",
    genres: ["Romance", "Drama"], publisher: "Shuukan Shounen Magazine",
    description: "Tonight, Natsuo loses his virginity. His partner? Her name is Rui and he just met her today after school. She's the one that brought up this whole situation, stating that she wanted to simply gain the knowledge about sex. She does not want to start a relationship, nor does she care about Natsuo. Afterwards, Natsuo feels guilty for losing his virginity to a girl he doesn't even particularly like. Mostly, it makes him feel like he betrayed his crush to his high school teacher: Hina. A quirky love triangle story unfolds as Natsuo, Rui, and Hina all end up becoming part of the same family!",
    ratings: 55
});
var comic90 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i210805.jpg", title: "Fuuka", author: "Seo Kouji",
    genres: ["Comedy", "Drama", "Sports"], publisher: "Shuukan Shounen Magazine",
    description: "Yuu Haruna just moved into town and loves to be on twitter. Out on his way to buy dinner he bumps into a mysterious girl, Fuuka Akitsuki, who breaks his phone thinking he was trying to take a picture of her panties. How will his new life change now?",
    ratings: 41
});
var comic91 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i213721.jpg", title: "Hajime no Ippo", author: "Morikawa Jyoji",
    genres: ["Action","Comedy", "Drama", "Sports"], publisher: "Shuukan Shounen Magazine",
    description: "Makunochi Ippo is an ordinary high school student in Japan. Since he spends most of his time away from school helping his mother run the family business, he doesn't get to enjoy his younger years like most teenagers. Always a target for bullying at school, Ippo's life is one of hardship. One of these after-school bullying sessions turns Ippo's life around for the better, as he is saved by a boxer named Takamura. He decides to follow in Takamura's footsteps and train to become a boxer, giving his life direction and purpose. Ippo's path to perfecting his pugilistic prowess is just beginning.",
    ratings: 100
});
var comic92 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i206761.jpg", title: "Kami-sama no Iutoori", author: "Kaneshiro Muneyuki",
    genres: ["Action", "Drama", "Horror"], publisher: "Shuukan Shounen Magazine",
    description: "Takahata Shun's day at high school begins just as normal and boring as ever, but it doesn't end that way. After his teacher's head explodes, he and his classmates find themselves forced to play children's games, such as Daruma ga Koronda (a game like Red Light/Green Light), with deadly stakes. With no idea who is behind this mysterious deadly game session, and no way of knowing when it will finally end, the only thing Shun and other students can do is keep trying to win.",
    ratings: 48
});
var comic93 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i208423.jpg", title: "Kindaichi Shounen no Jikenbo", author: "Kanari Youzaburou",
    genres: ["Comedy", "Drama", "Mystery","Romance"], publisher: "Shuukan Shounen Magazine",
    description: "Kindaichi (frequently with best-bud, Miyuki) travels to various places where a murder has taken place, typically involving ghosts, curses, myths and folklore of significant events from the distant past, and solves the mystery using ingenious deductions of curious clues and his cool magic.",
    ratings: 78
});
var comic94 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i170398.jpg", title: "Komori-chan wa Yaruki o Dase", author: "Konno Tohiro",
    genres: ["Comedy"], publisher: "Shuukan Shounen Magazine",
    description: "A gag comedy depicting the everyday life of Komori-chan, a little girl whose laziness knows no bounds.",
    ratings: 40
});
var comic95 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i212767.png", title: "Real Account", author: "Okushou",
    genres: ["Comedy", "Adventure", "Drama", "Psychological"], publisher: "Shuukan Shounen Magazine",
    description: "In a world driven by fictionalized friendship, courtesy of the program named real account, the table suddenly turns, and the cybernetic world turns real! How will they survive?",
    ratings: 39
});
var comic96 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i210618.jpg", title: "Seitokai Yakuindomo", author: "Ujiie Tozen",
    genres: ["Comedy","Romance"], publisher: "Shuukan Shounen Magazine",
    description: "I applied here since it's a close walk from my house. But it's really full of girls, huh? In this 4-koma series Tsuda Takatoshi is a new student in the recently gender-integrated high school. He's asked to join the student council as the vice president. Thus begins his days as the only normal boy among 3 female student council officers...",
    ratings: 35
});
var comic97 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i213563.png", title: "Tsubasa - Reservoir Chronicle", author: "CLAMP",
    genres: ["Action", "Drama", "Adventure","Comedy","Fantasy","Romance", "Mystery"], publisher: "Shuukan Shounen Magazine",
    description: "Sakura is the princess of Clow - and possessor of a mysterious, misunderstood power that promises to change the world. Syaoran is her childhood friend and leader of the archaeological dig that took his father's life. They reside in an alternate reality where whatever you least expect can happen - and does. When Sakura ventures to the dig site to declare her love for Syaoran, a puzzling symbol is uncovered - which triggers a remarkable quest. Now Syaoran embarks upon a desperate journey through other worlds - all in the name of saving Sakura.",
    ratings: 69
});
var comic98 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i165841.jpg", title: "Bloody Monday", author: "Ryuumon Ryou",
    genres: ["Action", "Drama", " Psychological"], publisher: "Shuukan Shounen Magazine",
    description: "A virus deal clinched in Russia on the Christmas eve. Purpose: unknown. Two clues: a mysterious lady Maya, who is one of the gangsters, and Bloody Monday,the keyword for the project. Then an incident happened in far-distant city of Tokyo. Fujimaru Takagi, a second year student at Mishiro Gakuin high school, is commissioned to find out the truth by the Public Security Intelligence Agency, for his great ability as a super hacker. Now, Maya approaches Fujimaru as his high school teacher...",
    ratings: 95
});
var comic99 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i185751.jpg", title: "A-bout!", author: "Ichikawa Masa",
    genres: ["Comedy", "Action"], publisher: "Shuukan Shounen Magazine",
    description: "Mitsumine High School is known as the school with the most juvenile delinquents in the country. The students are so violent that even the teachers are scared for their lives. Sunahara is the leader of the first years and is the strongest dude of his class. But when the transfer student Asagiri Shinnosuke makes an appearance at the school, he starts taking down names and kicking up dust like a tornado. If the students thought things were violent and unpredictable at Mitsumine, they haven’t seen anything yet since Asagiri is here to become the champion of the school.",
    ratings: 88
});
var comic100 = new ComicBook({
    picurl: "http://www.mangaupdates.com/image/i204267.jpg", title: "Koe no Katachi", author: "Ooima Yoshitoki",
    genres: ["Comedy", "Drama", "Romance"], publisher: "Shuukan Shounen Magazine",
    description: "The story revolves around Nishimiya Shōko, a grade school student who has impaired hearing. She transfers into a new school, where she is bullied by her classmates, especially Ishida Shouya. It gets to the point where she transfers to another school and as a result, Shouya is ostracized and bullied himself, with no friends to speak of and no plans for the future. Years later, he sets himself on a path to redemption.",
    ratings: 36
});

comic1.save();
comic2.save();
comic3.save();
comic4.save();
comic5.save();
comic6.save();
comic7.save();
comic8.save();
comic9.save();
comic10.save();
comic11.save();
comic12.save();
comic13.save();
comic14.save();
comic15.save();
comic16.save();
comic17.save();
comic18.save();
comic19.save();
comic20.save();
comic21.save();
comic22.save();
comic23.save();
comic24.save();
comic25.save();
comic26.save();
comic27.save();
comic28.save();
comic29.save();
comic30.save();
comic31.save();
comic32.save();
comic33.save();
comic34.save();
comic35.save();
comic36.save();
comic37.save();
comic38.save();
comic39.save();
comic40.save();
comic41.save();
comic42.save();
comic43.save();
comic44.save();
comic45.save();
comic46.save();
comic47.save();
comic48.save();
comic49.save();
comic50.save();
comic51.save();
comic52.save();
comic53.save();
comic54.save();
comic55.save();
comic56.save();
comic57.save();
comic58.save();
comic59.save();
comic60.save();
comic61.save();
comic62.save();
comic63.save();
comic64.save();
comic65.save();
comic66.save();
comic67.save();
comic68.save();
comic69.save();
comic70.save();
comic71.save();
comic72.save();
comic73.save();
comic74.save();
comic75.save();
comic76.save();
comic77.save();
comic78.save();
comic79.save();
comic80.save();
comic81.save();
comic82.save();
comic83.save();
comic84.save();
comic85.save();
comic86.save();
comic87.save();
comic88.save();
comic89.save();
comic90.save();
comic91.save();
comic92.save();
comic93.save();
comic94.save();
comic95.save();
comic96.save();
comic97.save();
comic98.save();
comic99.save();
comic100.save();






//  Set the environment variables we need.
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
    
app.listen(port ,ip);