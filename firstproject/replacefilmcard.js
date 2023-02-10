module.exports = (temp, film) => {
    let output = temp.replace(/{%id%}/g, film.id);

    output = output.replace(/{%filmname%}/g, film.filmname);

    output = output.replace(/{%actor%}/g, film.actor);

    output = output.replace(/{%desc%}/g, film.desc);
    
    if(film.dc) {
        output = output.replace(/{%dc%}/g, film.dc)
    } else {
        output = output.replace(/{%dc%}/g, "NOT DC")
    };

    return output;
}