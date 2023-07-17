(() => { 
  const $ = selector => document.querySelector( selector )
  const $$ = selector => document.querySelectorAll( selector ) 

  const rangeInput = $('input[type="range"')

  const showAllSentences = ( sentences ) => sentences.forEach( s => s.style.opacity = 1 )

  const filterSentences = ( sentences, saliencyMinimum ) => {
    [ ...sentences ].filter( s => Number( s.getAttribute( 'style' )
                        .replace('--salience:', '')
                        .replace('; opacity: 1;', '') 
                        .trim() < saliencyMinimum) )
      .forEach( s => s.style.opacity = 0 )
      return '🤗'
  }


  rangeInput.addEventListener('input', e => {
    const v = e.target.value
    const sen = $$( '.sentence' )
    showAllSentences( sen )
    filterSentences( sen , v )
    $('#rangeValue').textContent = v
  })
})()
