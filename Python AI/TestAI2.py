import nltk
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from flask import Flask, render_template, request

nltk.download('punkt')
nltk.download('stopwords')

def simplify_paragraph(paragraph):
    # Tokenize the paragraph into words
    words = word_tokenize(paragraph)

    # Remove stopwords (common words that don't add much meaning)
    filtered_words = [word for word in words if word.lower() not in stopwords.words('english')]

    # Join the words to form the simplified paragraph
    simplified_paragraph = ' '.join(filtered_words)

    return simplified_paragraph

app = Flask(__name__)

def getReqText():
     user_paragraph = "In a quaint town, a mysterious old bookstore appeared overnight, offering books tailored to each customer's deepest desires. As readers delved into their personalized novels, they discovered the uncanny ability of the stories to shape their destinies."
     simplified_text = simplify_paragraph(user_paragraph)
     phrases = re.split(r'[,.]', simplified_text)
     paragraph = user_paragraph
     phrasesFilt = [s for s in phrases if s.strip() != ""]
     return [phrasesFilt, paragraph]

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_paragraph = request.form['user_paragraph']
        simplified_text = simplify_paragraph(user_paragraph)
        phrases = re.split(r'[,.]', simplified_text)
        phrases_filt = [s for s in phrases if s.strip() != ""]
        return render_template('TestFlaskApp.html', phrases=phrases_filt, paragraph=user_paragraph)
    else:
        [phrases, paragraph] = getReqText()
        return render_template('TestFlaskApp.html', phrases=phrases, paragraph=paragraph)

if __name__ == '__main__':
    app.run(debug=True)
