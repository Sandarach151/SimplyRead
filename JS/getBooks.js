const fs = require('fs');
const path = require('path');
const EPub = require('epub');

async function getBooksList(directory) {
    const bookFiles = fs.readdirSync(directory);
    const books = [];
    for(file of bookFiles){
        const bookPath = path.join(directory, file);
        const title = await getEpubTitle(bookPath); // Get the title of the EPUB book
        books.push({ title, path: bookPath });
    }
    return books;
}

async function getEpubTitle(epubPath) {
    return new Promise((resolve, reject) => {
        let epub = new EPub(epubPath);

        epub.on("end", function () {
            resolve(epub.metadata.title);
        });

        epub.parse();
    });
}

exports.getBooksList = getBooksList;