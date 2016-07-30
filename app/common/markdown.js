const Remarkable = require('remarkable');
const markDown = new Remarkable();

export default function(html) {
    let rawHtmlMarkup = markDown.render(html.toString());
    return { __html: rawHtmlMarkup };
}