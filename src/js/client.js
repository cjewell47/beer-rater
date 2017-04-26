console.log('hello world');

$(() => {

  $('.index-beer').on('mouseenter', function() {
    // $(this).find('.index-text').css({display: 'inline-block'});
    $(this).find('.index-text').animate({'display': 'inline-block'});

  });

  $('.index-beer').on('mouseleave', function() {
    $(this).find('.index-text').css({display: 'none'});

  });



});


.fadeIn('slow', function());
