const EPub = require('epub');
const cheerio = require('cheerio');

async function getChapterText(filepath, chapter){
    return new Promise((resolve, reject) => {
        let epub = new EPub(filepath);

        epub.on("end", function () {
            const chapterID = epub.flow[chapter].id;
            epub.getChapter(chapterID, function(error, text){
                console.log(text);
                resolve(text);
            });
        });

        epub.parse();
    });
}

async function parse(filepath) {
    return new Promise((resolve, reject) => {
        let epub = new EPub(filepath);
        const chapters = [];
        let chapterCounter = 0;

        epub.on("end", function () {
            epub.flow.forEach(function (chapter) {
                epub.getChapter(chapter.id, function (error, text) {
                    if (error) {
                    reject(error);
                    } else {
                    chapters.push(text);
                    chapterCounter++;

                    if (chapterCounter === epub.flow.length) {
                        resolve(chapters);
                    }
                    }
                });
            });
        });

        epub.parse();
    });
}

async function toText(chapters) {
    const chapterText = [];
    for (let i = 0; i < chapters.length; i++) {
        const $ = cheerio.load(chapters[i]);
        const plainText = $.text();
        chapterText.push(plainText);
        if (i == chapters.length - 1) {
            return chapterText;
        }
    }
}

async function getParagraphs(filepath){
    const chapters = await parse(filepath);
    const chapterText = await toText(chapters);
    allText = "";
    for(let chapter of chapterText){
        allText += chapter;
    }
    sentences = allText.split(". ");
    combinedSentences = [];
    for(let i=0; i<sentences.length; i+=5){
        let curText = sentences[i]+". "+sentences[i+1]+". "+sentences[i+2]+". "+sentences[i+3]+". "+sentences[i+4]+". ";
        combinedSentences.push(curText);
    }
    return combinedSentences;
}



exports.getChapterText = getChapterText;
exports.getParagraphs = getParagraphs;