(() => { 
  const $ = selector => document.querySelector( selector )
  const $$ = selector => document.querySelectorAll( selector ) 

  const uiContainer = $('#ui-container')

  const revealUI = (changes, observer) =>{
    uiContainer.classList = ''   
    observer.disconnect()
  }
  const content = $('#content')
  const observerConfig = { childList: true  }
  const contentObserver = new MutationObserver(revealUI)
  contentObserver.observe(content, observerConfig)

  const uiString = '<input type="range" list="markers" value="0" min="0" max="1" step="0.01"  /><span id="rangeValue">0.00</span>'


  const addUIListener = () => {
    const rangeInput = $('input[type="range"')
    rangeInput.addEventListener('input', e => {
      const v = e.target.value
      const sen = $$( '.sentence' )
      showAllSentences( sen )
      filterSentences( sen , v )
      $('#rangeValue').textContent = Number.parseFloat(v).toFixed(2)
    })
  }

  const showAllSentences = ( sentences ) => sentences.forEach( s => s.style.opacity = 1 )

  const filterSentences = ( sentences, saliencyMinimum ) => {
    [ ...sentences ].filter( s => Number( s.getAttribute( 'style' )
                        .replace('--salience:', '')
                        .replace('; opacity: 1;', '') 
                        .trim() < saliencyMinimum) )
      .forEach( s => s.style.opacity = 0 )
      return '🤗'
  }


  $('#ui-container a').addEventListener('click', e => {
   e.preventDefault()
   e.target.parentNode.innerHTML = uiString
   addUIListener()
  })

})()
